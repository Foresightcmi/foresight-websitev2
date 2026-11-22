"""Native $0 FastMCP server for Cross-Source Traffic & Revenue Intelligence."""
from __future__ import annotations

import json
import sys
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]
if str(SKILL_ROOT) not in sys.path:
    sys.path.insert(0, str(SKILL_ROOT))

from mcp.server.fastmcp import FastMCP

from scripts.analyzer import TrafficAnalyzer, format_numbered_triage
from scripts.autonomous_seo_governor import run_governor_cycle
from scripts.db_store import AnalyticsStore
from scripts.google_connectors import fetch_core_updates_live, fetch_pagespeed_live
from scripts.traffic_cli import default_windows, resolve_venture_paths, run_doctor, run_sync

mcp = FastMCP("traffic-intelligence")


@mcp.tool()
def traffic_doctor(workspace: str = ".") -> str:
    """Verify venture isolation (.analytics/), Google auth readiness, Git repo, and live Google Core Update freeze status."""
    return json.dumps(run_doctor(workspace), indent=2)


@mcp.tool()
def traffic_core_updates(cooldown_days: int = 7) -> str:
    """Check live Google Search Status Dashboard ranking rollouts and return EDIT_MODE ('FREEZE' vs 'NORMAL')."""
    return json.dumps(fetch_core_updates_live(cooldown_days=cooldown_days), indent=2)


@mcp.tool()
def traffic_pagespeed_check(url: str, workspace: str = ".", strategy: str = "mobile") -> str:
    """Run a live $0 Google PageSpeed Insights v5 audit (LCP, INP, CLS, Perf Score) and store snapshot in venture SQLite."""
    _, db_path, _ = resolve_venture_paths(workspace)
    snap = fetch_pagespeed_live(url, strategy=strategy)
    AnalyticsStore(db_path).upsert_psi_snapshot(snap, source_url=snap["source_url"])
    return json.dumps(snap, indent=2)


@mcp.tool()
def traffic_sync(
    workspace: str = ".",
    days: int = 56,
    gsc_site_url: str = "",
    ga4_property_id: str = "",
) -> str:
    """Sync Git commit deploy annotations, Google Search Console, and GA4 landing pages into isolated venture SQLite."""
    res = run_sync(
        workspace,
        days=days,
        gsc_site=gsc_site_url or None,
        ga4_prop=ga4_property_id or None,
    )
    return json.dumps(res, indent=2)



@mcp.tool()
def traffic_full_audit(workspace: str = ".", window_days: int = 28) -> str:
    """Run all deterministic cross-source views: segment drops + deploys, starving money pages, leaky funnels, striking distance, cannibalization, and AIO CTR compression."""
    _, db_path, cfg = resolve_venture_paths(workspace)
    cs, ce, ps, pe = default_windows(window_days)
    diag = TrafficAnalyzer(AnalyticsStore(db_path), config=cfg).full_diagnostic(cs, ce, ps, pe)
    core = fetch_core_updates_live()
    return json.dumps({"core_update_gate": core, **diag}, indent=2)


@mcp.tool()
def traffic_log_experiment(
    url: str,
    deployed_at: str,
    hypothesis: str,
    workspace: str = ".",
    git_sha: str = "",
) -> str:
    """Register an approved SEO/CRO page change for Day-14 and Day-28 Difference-in-Differences cohort verification."""
    _, db_path, _ = resolve_venture_paths(workspace)
    exp_id = AnalyticsStore(db_path).record_experiment(url, deployed_at, hypothesis, git_sha)
    return json.dumps({"experiment_id": exp_id, "url": url, "deployed_at": deployed_at, "status": "LOGGED"}, indent=2)


@mcp.tool()
def traffic_verify_experiment(experiment_id: int, workspace: str = ".", window_days: int = 14) -> str:
    """Evaluate Day-14 or Day-28 Difference-in-Differences (DiD) click lift against untouched balanced-panel cohort pages."""
    _, db_path, cfg = resolve_venture_paths(workspace)
    res = TrafficAnalyzer(AnalyticsStore(db_path), config=cfg).verify_experiment_did(experiment_id, window_days=window_days)
    return json.dumps(res, indent=2)


@mcp.tool()
def traffic_weekly_triage(workspace: str = ".", window_days: int = 28) -> str:
    """Generate a human-gated [1]..[N] numbered-triage queue enforcing Google Core Update freeze locks."""
    _, db_path, cfg = resolve_venture_paths(workspace)
    cs, ce, ps, pe = default_windows(window_days)
    diag = TrafficAnalyzer(AnalyticsStore(db_path), config=cfg).full_diagnostic(cs, ce, ps, pe)
    core = fetch_core_updates_live()
    return format_numbered_triage(diag, core)


@mcp.tool()
def traffic_governor_cycle(
    workspace: str = ".",
    sync_days: int = 56,
    window_days: int = 28,
    ntfy_topic: str = "",
) -> str:
    """Execute the 92%-autonomous SEO Governor cycle: sync Git/GSC/GA4, enforce Core Update freeze lock, export .analytics/governor_brief.json, verify Day-14/28 DiD experiments, and stage [1]..[N] human approvals."""
    res = run_governor_cycle(workspace, sync_days=sync_days, window_days=window_days, ntfy_topic=ntfy_topic)
    return json.dumps(res, indent=2)


if __name__ == "__main__":
    mcp.run(transport="stdio")
