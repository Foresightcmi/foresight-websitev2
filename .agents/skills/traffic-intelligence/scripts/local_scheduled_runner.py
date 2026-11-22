"""Rule 13 Track 2 Hardened Local SEO Governor Runner (9AM-6PM guard, PID lock, isolated worktree auto-deploy)."""
from __future__ import annotations

import argparse
import datetime as dt
import os
import shutil
import subprocess
import sys
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]
if str(SKILL_ROOT) not in sys.path:
    sys.path.insert(0, str(SKILL_ROOT))

from scripts.autonomous_seo_governor import run_governor_cycle

LOG_DIR = SKILL_ROOT / ".logs"
LOCK_FILE = LOG_DIR / "campaign_dispatch.lock"
LOG_FILE = LOG_DIR / "seo_governor.log"
WORKTREE_ROOT = Path(r"C:\Users\fores\.gemini\antigravity\scratch\.worktrees")

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


def _run_cmd(cmd: list[str], cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=cwd, text=True, capture_output=True, encoding="utf-8", errors="replace")


def _run_foresight_worktree_auto_deploy(main_repo: Path) -> str:
    """Execute idempotent Foresight SEO auto-heals inside a clean detached git worktree and push if substantive."""
    wt = WORKTREE_ROOT / "foresight-seo-governor"
    WORKTREE_ROOT.mkdir(parents=True, exist_ok=True)
    _run_cmd(["git", "fetch", "origin", "main"], cwd=main_repo)

    if not (wt / ".git").exists():
        res = _run_cmd(["git", "worktree", "add", "--detach", str(wt), "origin/main"], cwd=main_repo)
        if res.returncode != 0:
            return f"WORKTREE_INIT_ERR:{res.stderr.strip()[:120]}"

    _run_cmd(["git", "rebase", "--abort"], cwd=wt)
    _run_cmd(["git", "checkout", "--detach", "origin/main"], cwd=wt)
    _run_cmd(["git", "reset", "--hard", "origin/main"], cwd=wt)
    _run_cmd(["git", "clean", "-fd", "-e", "node_modules"], cwd=wt)

    wt_nm = wt / "node_modules"
    main_nm = main_repo / "node_modules"
    if main_nm.is_dir() and not wt_nm.exists():
        subprocess.run(["cmd", "/c", "mklink", "/J", str(wt_nm), str(main_nm)], capture_output=True)

    healer = wt / "scripts" / "auto-heal-intent-mismatches.mjs"
    if not healer.is_file():
        return "SKIP_HEALER_NOT_ON_ORIGIN_YET"

    (wt / ".analytics").mkdir(parents=True, exist_ok=True)
    for fname in ("governor_brief.json", "experiments_ledger.jsonl"):
        src = main_repo / ".analytics" / fname
        if src.is_file():
            shutil.copy2(src, wt / ".analytics" / fname)

    _run_cmd(["node", "scripts/auto-heal-intent-mismatches.mjs"], cwd=wt)
    diff_chk = _run_cmd(["git", "diff", "--quiet", "--", "data/posts.json", "data/cities.json", "public/llms.txt", "public/llms-full.txt"], cwd=wt)
    if diff_chk.returncode == 0:
        return "NO_OP_CLEAN"

    for gate_cmd in (
        ["node", "scripts/firstindex-truth-guard.mjs"],
        ["node", "scripts/seo-health-check.mjs"],
        [sys.executable, "scripts/page1-guard.py"],
    ):
        g = _run_cmd(gate_cmd, cwd=wt)
        if g.returncode != 0:
            return f"GATE_BLOCKED:{gate_cmd[-1]}"

    _run_cmd(["git", "config", "user.name", "Foresight Autonomous SEO Governor"], cwd=wt)
    _run_cmd(["git", "config", "user.email", "bot@fhinspectionsatl.com"], cwd=wt)
    _run_cmd(["git", "add", "data/posts.json", "data/cities.json", "public/llms.txt", "public/llms-full.txt", ".analytics/experiments_ledger.jsonl"], cwd=wt)
    today_s = dt.date.today().isoformat()
    _run_cmd(["git", "commit", "-m", f"chore(seo-governor): autonomous intent-mismatch & internal-link heal {today_s} [skip actions]"], cwd=wt)
    push = _run_cmd(["git", "push", "origin", "HEAD:refs/heads/main"], cwd=wt)
    if push.returncode != 0:
        _run_cmd(["git", "fetch", "origin", "main"], cwd=wt)
        _run_cmd(["git", "rebase", "origin/main"], cwd=wt)
        push = _run_cmd(["git", "push", "origin", "HEAD:refs/heads/main"], cwd=wt)
    if push.returncode == 0:
        shutil.copy2(wt / ".analytics" / "experiments_ledger.jsonl", main_repo / ".analytics" / "experiments_ledger.jsonl")
        _run_cmd(["node", "scripts/ping-indexnow.mjs"], cwd=wt)
        return "AUTO_DEPLOYED_TO_ORIGIN_MAIN"
    return f"PUSH_ERR:{push.stderr.strip()[:120]}"


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
            deploy_state = "LOCAL_SYNC_ONLY"
            if res["venture_slug"] == "foresight-home-inspections":
                deploy_state = _run_foresight_worktree_auto_deploy(repo)
            _log(
                f"OK [{res['venture_slug']}] edit_mode={res['core_update_gate']['edit_mode']} "
                f"gsc={res['sync_summary']['gsc_rows']} ga4={res['sync_summary']['ga4_rows']} "
                f"gaps={len(res['safe_topic_gaps'])} deploy={deploy_state}"
            )
    finally:
        LOCK_FILE.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
