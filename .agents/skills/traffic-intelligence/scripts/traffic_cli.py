"""CLI entrypoint for $0 Cross-Source Traffic & Revenue Intelligence."""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
from pathlib import Path
from typing import Any

SKILL_ROOT = Path(__file__).resolve().parents[1]
if str(SKILL_ROOT) not in sys.path:
    sys.path.insert(0, str(SKILL_ROOT))

from scripts.analyzer import TrafficAnalyzer, format_numbered_triage
from scripts.db_store import AnalyticsStore
from scripts.git_deploys import scan_git_deploys
from scripts.google_connectors import (
    GA4_SCOPES,
    GSC_SCOPES,
    fetch_core_updates_live,
    fetch_ga4_landing_pages,
    fetch_gsc_search_analytics,
    fetch_pagespeed_live,
    load_google_bearer_token,
)


def resolve_venture_paths(workspace: str | Path) -> tuple[Path, Path, dict[str, Any]]:
    ws = Path(workspace).resolve()
    cfg_path = ws / ".analytics" / "config.json"
    db_path = ws / ".analytics" / "traffic_intel.sqlite"
    cfg: dict[str, Any] = {}
    if cfg_path.is_file():
        cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
    return ws, db_path, cfg


def run_doctor(workspace: str | Path) -> dict[str, Any]:
    ws, db_path, cfg = resolve_venture_paths(workspace)
    token, auth_source = load_google_bearer_token(ws, GSC_SCOPES + GA4_SCOPES, cfg.get("service_account_path"))
    core = fetch_core_updates_live()
    return {
        "workspace": str(ws),
        "venture_slug": cfg.get("venture_slug", ws.name),
        "db_path": str(db_path),
        "db_exists": db_path.is_file(),
        "gsc_site_url": cfg.get("gsc_site_url") or os.environ.get("GSC_SITE_URL"),
        "ga4_property_id": cfg.get("ga4_property_id") or os.environ.get("GA4_PROPERTY_ID"),
        "google_auth_status": "READY" if token else "NEEDS_AUTH",
        "google_auth_source": auth_source,
        "git_repo_detected": (ws / ".git").exists(),
        "core_update_gate": {
            "edit_mode": core["edit_mode"],
            "active_rollout": core["active_rollout"],
            "blocking_updates": core["blocking_updates"],
        },
        "retrieved_on": dt.date.today().isoformat(),
    }


def _resolve_auto_gsc_site(token: str, public_base_url: str = "") -> str | None:
    """Strictly match GSC siteEntry to this venture's own public_base_url domain (Rule 8 isolation)."""
    import httpx
    from urllib.parse import urlsplit
    target_host = urlsplit(public_base_url).netloc.lower().replace("www.", "") if public_base_url else ""
    if not target_host:
        return None
    try:
        resp = httpx.get(
            "https://searchconsole.googleapis.com/webmasters/v3/sites",
            headers={"Authorization": f"Bearer {token}"},
            timeout=15.0,
        )
        entries = resp.json().get("siteEntry", []) if resp.is_success else []
        for entry in entries:
            s_url = str(entry.get("siteUrl", ""))
            clean_s = s_url.lower().replace("sc-domain:", "").replace("https://", "").replace("http://", "").replace("www.", "").strip("/")
            if clean_s == target_host:
                return s_url
        return None
    except Exception:
        return None


def run_sync(workspace: str | Path, days: int = 56, gsc_site: str | None = None, ga4_prop: str | None = None) -> dict[str, Any]:
    ws, db_path, cfg = resolve_venture_paths(workspace)
    store = AnalyticsStore(db_path)
    end_d = (dt.date.today() - dt.timedelta(days=2)).isoformat()
    start_d = (dt.date.today() - dt.timedelta(days=days + 2)).isoformat()

    commits = scan_git_deploys(ws, since_days=days + 14)
    existing_shas = {r["git_sha"] for r in store.query_all("SELECT git_sha FROM annotations WHERE git_sha != ''")}
    added_commits = 0
    for c in commits:
        if c["git_sha"] not in existing_shas:
            for tmpl in c["templates"]:
                store.record_annotation(c["deployed_at"], tmpl, c["git_sha"], c["summary"])
            added_commits += 1

    site = gsc_site or cfg.get("gsc_site_url") or os.environ.get("GSC_SITE_URL")
    prop = ga4_prop or cfg.get("ga4_property_id") or os.environ.get("GA4_PROPERTY_ID")
    token, auth_src = load_google_bearer_token(ws, GSC_SCOPES + GA4_SCOPES, cfg.get("service_account_path"))
    summary: dict[str, Any] = {
        "window": [start_d, end_d], "git_deploys_indexed": added_commits,
        "auth_source": auth_src, "gsc_rows": 0, "ga4_rows": 0, "could_not_see": [],
    }
    if not token:
        summary["could_not_see"].append("google_oauth_unconfigured")
        return summary
    if site == "auto":
        site = _resolve_auto_gsc_site(token, str(cfg.get("public_base_url") or ""))
    if site:
        try:
            gsc_rows = fetch_gsc_search_analytics(token, site, start_d, end_d)
            summary["gsc_rows"] = store.upsert_gsc_rows(gsc_rows, source_url=f"gsc://{site}")
            summary["resolved_gsc_site"] = site
        except Exception as exc:
            summary["could_not_see"].append(f"gsc_sync_error:{type(exc).__name__}")
    else:
        summary["could_not_see"].append("gsc_site_url_unset_or_unverified")
    if prop:
        try:
            ga4_rows = fetch_ga4_landing_pages(
                token, prop, start_d, end_d,
                call_event_names=cfg.get("call_event_names"),
                key_conversion_events=cfg.get("key_conversion_events"),
            )
            summary["ga4_rows"] = store.upsert_ga4_rows(ga4_rows, source_url=f"ga4://properties/{prop}")
        except Exception as exc:
            summary["could_not_see"].append(f"ga4_sync_error:{type(exc).__name__}")
    else:
        summary["could_not_see"].append("ga4_property_id_unset")
    return summary



def default_windows(window_days: int = 28) -> tuple[str, str, str, str]:
    cur_end = dt.date.today() - dt.timedelta(days=2)
    cur_start = cur_end - dt.timedelta(days=window_days - 1)
    prev_end = cur_start - dt.timedelta(days=1)
    prev_start = prev_end - dt.timedelta(days=window_days - 1)
    return cur_start.isoformat(), cur_end.isoformat(), prev_start.isoformat(), prev_end.isoformat()


def main() -> None:
    p = argparse.ArgumentParser(description="Antigravity $0 Cross-Source Traffic Intelligence CLI")
    p.add_argument("--workspace", default=".", help="Target venture workspace directory (Rule 8 isolated)")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("doctor", help="Check venture isolation, Google auth, and live Core Update freeze status")
    sub.add_parser("core-updates", help="Query live Google Search Status Dashboard ranking rollouts")

    psi_p = sub.add_parser("pagespeed", help="Fetch & store live PageSpeed Insights v5 CWV snapshot")
    psi_p.add_argument("url")
    psi_p.add_argument("--strategy", choices=["mobile", "desktop"], default="mobile")

    sync_p = sub.add_parser("sync", help="Sync Git deploys + GSC + GA4 into per-venture SQLite")
    sync_p.add_argument("--days", type=int, default=56)
    sync_p.add_argument("--gsc-site")
    sync_p.add_argument("--ga4-property")

    aud_p = sub.add_parser("audit", help="Run deterministic cross-source diagnostic views")
    aud_p.add_argument("--window-days", type=int, default=28)

    tri_p = sub.add_parser("triage", help="Emit numbered [1]..[N] triage queue (+ optional ntfy push)")
    tri_p.add_argument("--window-days", type=int, default=28)
    tri_p.add_argument("--ntfy-topic", default="")

    args = p.parse_args()
    ws, db_path, cfg = resolve_venture_paths(args.workspace)

    if args.cmd == "doctor":
        print(json.dumps(run_doctor(ws), indent=2))
    elif args.cmd == "core-updates":
        print(json.dumps(fetch_core_updates_live(), indent=2))
    elif args.cmd == "pagespeed":
        snap = fetch_pagespeed_live(args.url, strategy=args.strategy)
        AnalyticsStore(db_path).upsert_psi_snapshot(snap, source_url=snap["source_url"])
        print(json.dumps(snap, indent=2))
    elif args.cmd == "sync":
        print(json.dumps(run_sync(ws, args.days, args.gsc_site, args.ga4_property), indent=2))
    elif args.cmd in ("audit", "triage"):
        cs, ce, ps, pe = default_windows(args.window_days)
        diag = TrafficAnalyzer(AnalyticsStore(db_path), config=cfg).full_diagnostic(cs, ce, ps, pe)
        core = fetch_core_updates_live()
        if args.cmd == "audit":
            print(json.dumps({"core_update_gate": core, **diag}, indent=2))
        else:
            msg = format_numbered_triage(diag, core)
            if args.ntfy_topic:
                import httpx
                httpx.post(f"https://ntfy.sh/{args.ntfy_topic}", content=msg.encode("utf-8"), timeout=10.0)
            print(msg)


if __name__ == "__main__":
    main()
