"""92%-Autonomous Closed-Loop SEO Governor (Venture-Neutral, Rule 8 & Rule 11.10 Safe)."""
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
from scripts.google_connectors import fetch_core_updates_live
from scripts.traffic_cli import default_windows, resolve_venture_paths, run_sync


def _ingest_legacy_gsc_fallback_if_needed(ws: Path, store: AnalyticsStore, cfg: dict[str, Any]) -> int:
    """If live GSC API had 0 rows (e.g. cloud runner without SA key yet), ingest existing repo GSC snapshot with provenance."""
    rel_path = cfg.get("legacy_gsc_snapshot_path")
    if not rel_path:
        return 0
    snap_file = ws / rel_path
    if not snap_file.is_file():
        return 0
    existing = store.query_all("SELECT COUNT(*) AS n FROM gsc_daily")[0]["n"]
    if existing > 0:
        return 0
    raw = json.loads(snap_file.read_text(encoding="utf-8"))
    end_dt = str((raw.get("dateRange") or {}).get("endDate") or dt.date.today().isoformat())
    site_url = str(raw.get("siteUrl") or cfg.get("public_base_url") or "local-snapshot")
    converted = []
    for r in raw.get("rows", []):
        keys = r.get("keys", [])
        if len(keys) >= 2:
            converted.append({
                "date": end_dt,
                "query": keys[0],
                "page": keys[1],
                "clicks": r.get("clicks", 0),
                "impressions": r.get("impressions", 0),
                "position": r.get("position", 0.0),
            })
    return store.upsert_gsc_rows(converted, source_url=f"repo-snapshot://{rel_path} ({site_url})") if converted else 0


def _export_fresh_legacy_gsc_snapshot(ws: Path, store: AnalyticsStore, cfg: dict[str, Any], cur_start: str, cur_end: str) -> None:
    """When live GSC sync succeeds, refresh legacy JSON consumed by downstream Node/Python scripts."""
    out_rel = cfg.get("export_legacy_gsc_json")
    base_url = str(cfg.get("public_base_url") or "").rstrip("/")
    if not out_rel or not base_url:
        return
    rows = store.query_all(
        """SELECT query, url, SUM(clicks) AS clicks, SUM(impressions) AS impr,
                  SUM(position * impressions) / MAX(SUM(impressions), 1) AS pos
           FROM gsc_daily WHERE date BETWEEN ? AND ? AND query != '(all)'
           GROUP BY query, url ORDER BY impr DESC LIMIT 25000""",
        (cur_start, cur_end),
    )
    if not rows:
        return
    formatted = [
        {
            "keys": [r["query"], f"{base_url}{r['url']}"],
            "clicks": round(float(r["clicks"]), 1),
            "impressions": round(float(r["impr"]), 1),
            "ctr": round(float(r["clicks"]) / max(float(r["impr"]), 1.0), 4),
            "position": round(float(r["pos"]), 2),
        }
        for r in rows
    ]
    out_file = ws / out_rel
    out_file.parent.mkdir(parents=True, exist_ok=True)
    out_file.write_text(
        json.dumps(
            {
                "retrievedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
                "siteUrl": base_url,
                "dateRange": {"startDate": cur_start, "endDate": cur_end},
                "rows": formatted,
            },
            indent=2,
        ),
        encoding="utf-8",
    )



def run_governor_cycle(
    workspace: str | Path,
    sync_days: int = 56,
    window_days: int = 28,
    ntfy_topic: str = "",
) -> dict[str, Any]:
    """Execute one complete 92%-autonomous closed-loop SEO cycle for an isolated venture."""
    ws, db_path, cfg = resolve_venture_paths(workspace)
    venture_slug = cfg.get("venture_slug", ws.name)
    core = fetch_core_updates_live()
    sync_info = run_sync(ws, days=sync_days)

    store = AnalyticsStore(db_path)
    fallback_rows = _ingest_legacy_gsc_fallback_if_needed(ws, store, cfg)
    cs, ce, ps, pe = default_windows(window_days)
    if sync_info.get("gsc_rows", 0) > 0:
        _export_fresh_legacy_gsc_snapshot(ws, store, cfg, cs, ce)

    analyzer = TrafficAnalyzer(store, config=cfg)
    diag = analyzer.full_diagnostic(cs, ce, ps, pe)

    top_pos_cap = float(cfg.get("protected_top_positions_max", 3.5))
    protected_rows = store.query_all(
        """SELECT url, query, SUM(impressions) AS impr,
                  SUM(position * impressions) / MAX(SUM(impressions), 1) AS pos
           FROM gsc_daily WHERE date BETWEEN ? AND ? AND query != '(all)'
           GROUP BY url, query HAVING impr >= 10 AND pos <= ?""",
        (cs, ce, top_pos_cap),
    )
    protected_urls = sorted({r["url"] for r in protected_rows})
    protected_queries = {r["query"] for r in protected_rows}
    cannibal_queries = {c["query"] for c in diag["cannibalization"]}
    mismatch_queries = {m["query"] for m in diag["url_intent_mismatches"]}

    safe_topic_gaps = [
        item for item in diag["striking_distance"]
        if item["query"] not in protected_queries
        and item["query"] not in cannibal_queries
        and item["query"] not in mismatch_queries
    ][:20]

    boilerplate_nav = {"/", "/about", "/contact", "/privacy", "/terms", "/blog"}
    deep_money_targets = [
        p for p in diag["starving_money_pages"] if p["url"] not in boilerplate_nav
    ][:10]

    today_d = dt.date.today()
    did_checks: list[dict[str, Any]] = []
    for exp in store.query_all("SELECT id, deployed_at FROM experiments ORDER BY id DESC LIMIT 25"):
        age_days = (today_d - dt.date.fromisoformat(exp["deployed_at"][:10])).days
        if age_days >= 14:
            win = 28 if age_days >= 28 else 14
            did_checks.append(analyzer.verify_experiment_did(int(exp["id"]), window_days=win))

    triage_text = format_numbered_triage(diag, core)
    brief = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "retrieved_on": today_d.isoformat(),
        "venture_slug": venture_slug,
        "core_update_gate": core,
        "allow_existing_page_rewrites": core["edit_mode"] == "NORMAL",
        "sync_summary": {**sync_info, "fallback_snapshot_rows": fallback_rows},
        "protected_top_urls": protected_urls,
        "priority_internal_link_targets": deep_money_targets or diag["starving_money_pages"][:10],
        "safe_topic_gaps": safe_topic_gaps,
        "url_intent_mismatches": diag["url_intent_mismatches"][:15],
        "leaky_funnel_pages": diag["leaky_traffic_pages"][:10],
        "cannibalization_alerts": diag["cannibalization"][:10],
        "aio_ctr_compressed_queries": diag["climbed_rank_lost_clicks"][:10],
        "experiment_did_verifications": did_checks,
        "staged_human_triage": triage_text,
    }
    brief_rel = cfg.get("brief_output_path", ".analytics/governor_brief.json")
    brief_path = ws / brief_rel
    brief_path.parent.mkdir(parents=True, exist_ok=True)
    brief_path.write_text(json.dumps(brief, indent=2) + "\n", encoding="utf-8")

    has_actionable = "[1]" in triage_text
    if ntfy_topic and (has_actionable or any(d["verdict"] == "REGRESSED" for d in did_checks)):
        import httpx
        httpx.post(
            f"https://ntfy.sh/{ntfy_topic}",
            headers={"Title": f"SEO Governor [{venture_slug}] ({core['edit_mode']})"},
            content=triage_text.encode("utf-8"),
            timeout=10.0,
        )
    return brief



def main() -> None:
    parser = argparse.ArgumentParser(description="Closed-Loop 92%-Autonomous SEO Governor")
    parser.add_argument("--workspace", default=".", help="Isolated venture workspace path")
    sub = parser.add_subparsers(dest="cmd", required=True)

    gov = sub.add_parser("govern", help="Run full closed-loop sync, Core Update gate, brief export & optional ntfy alert")
    gov.add_argument("--sync-days", type=int, default=56)
    gov.add_argument("--window-days", type=int, default=28)
    gov.add_argument("--ntfy-topic", default="")

    gate = sub.add_parser("check-gate", help="Check live Google Core Update freeze status (NORMAL vs FREEZE)")
    gate.add_argument("--github-output", default="", help="Optional GITHUB_OUTPUT path to write edit_mode=...")

    args = parser.parse_args()
    if args.cmd == "govern":
        res = run_governor_cycle(args.workspace, args.sync_days, args.window_days, args.ntfy_topic)
        print(json.dumps({
            "venture_slug": res["venture_slug"],
            "edit_mode": res["core_update_gate"]["edit_mode"],
            "allow_existing_page_rewrites": res["allow_existing_page_rewrites"],
            "sync_summary": res["sync_summary"],
            "priority_link_targets": len(res["priority_internal_link_targets"]),
            "safe_topic_gaps": len(res["safe_topic_gaps"]),
        }, indent=2))
    elif args.cmd == "check-gate":
        core = fetch_core_updates_live()
        if args.github_output:
            with Path(args.github_output).open("a", encoding="utf-8") as fh:
                fh.write(f"edit_mode={core['edit_mode']}\n")
        print(json.dumps(core, indent=2))


if __name__ == "__main__":
    main()
