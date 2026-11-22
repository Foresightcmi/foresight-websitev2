"""Rule 13 Track 2 Hardened Local SEO Governor Runner (9AM-6PM guard, PID lock, persistent log)."""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]
if str(SKILL_ROOT) not in sys.path:
    sys.path.insert(0, str(SKILL_ROOT))

from scripts.autonomous_seo_governor import run_governor_cycle

LOG_DIR = SKILL_ROOT / ".logs"
LOCK_FILE = LOG_DIR / "campaign_dispatch.lock"
LOG_FILE = LOG_DIR / "seo_governor.log"

DEFAULT_ISOLATED_VENTURES = [
    r"C:\Users\fores\.gemini\antigravity\scratch\foresight-website",
    r"C:\Users\fores\.gemini\antigravity\scratch\property-tax-appeal-engine",
    r"C:\Users\fores\.gemini\antigravity\scratch\clearcomply-engine",
    r"C:\Users\fores\.gemini\antigravity\scratch\snapscope-arbitrage",
]


def _log(msg: str) -> None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    ts = dt.datetime.now().isoformat(timespec="seconds")
    line = f"[{ts}] {msg}"
    print(line)
    with LOG_FILE.open("a", encoding="utf-8") as fh:
        fh.write(line + "\n")


def _pid_alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--bypass-hours-guard", action="store_true")
    ap.add_argument("--ntfy-topic", default="fores-antigravity-alerts-77")
    ap.add_argument("--no-alert", action="store_true")
    args = ap.parse_args()

    now = dt.datetime.now()
    if not args.bypass_hours_guard and not (9 <= now.hour < 18):
        _log(f"SKIP: Outside 09:00-18:00 local business window (hour={now.hour}).")
        return

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    if LOCK_FILE.exists():
        try:
            old_pid = int(LOCK_FILE.read_text(encoding="utf-8").strip())
            if _pid_alive(old_pid):
                _log(f"SKIP: Active PID lock held by process {old_pid}.")
                return
        except Exception:
            pass
    LOCK_FILE.write_text(str(os.getpid()), encoding="utf-8")

    try:
        is_monday = now.weekday() == 0
        topic = "" if args.no_alert else (args.ntfy_topic if is_monday else "")
        for repo_str in DEFAULT_ISOLATED_VENTURES:
            repo = Path(repo_str)
            if not repo.is_dir():
                continue
            res = run_governor_cycle(repo, ntfy_topic=topic)
            _log(
                f"OK [{res['venture_slug']}] edit_mode={res['core_update_gate']['edit_mode']} "
                f"gsc_rows={res['sync_summary']['gsc_rows']} ga4_rows={res['sync_summary']['ga4_rows']} "
                f"gaps={len(res['safe_topic_gaps'])}"
            )
    finally:
        LOCK_FILE.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
