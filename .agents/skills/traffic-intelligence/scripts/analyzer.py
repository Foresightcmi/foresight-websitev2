"""Deterministic cross-source SEO/CRO diagnostic views & DiD change verification."""
from __future__ import annotations

import datetime as dt
import re
from typing import Any

from scripts.db_store import AnalyticsStore

# Empirical organic CTR curve by rounded position (#1..#15) for striking-distance scoring
CTR_BENCHMARK = {
    1: 0.28, 2: 0.15, 3: 0.11, 4: 0.08, 5: 0.06,
    6: 0.045, 7: 0.035, 8: 0.028, 9: 0.022, 10: 0.018,
}


def _pct_change(cur: float, prev: float) -> float | None:
    if prev <= 0:
        return None
    return round(((cur - prev) / prev) * 100.0, 2)


class TrafficAnalyzer:
    """Computes pre-joined, zero-hallucination diagnostic tables from AnalyticsStore."""

    def __init__(self, store: AnalyticsStore, config: dict[str, Any] | None = None):
        self.store = store
        self.config = config or {}

    def _is_branded_query(self, query: str) -> bool:
        q = query.lower()
        return any(str(b).lower() in q for b in self.config.get("brand_terms", []))

    def segment_anomalies(
        self, cur_start: str, cur_end: str, prev_start: str, prev_end: str
    ) -> list[dict[str, Any]]:
        """Detect template/locale drops masked by flat site-wide graphs + correlate deploys."""
        cur_rows = self.store.query_all(
            """SELECT template, locale, SUM(clicks) AS clicks, SUM(impressions) AS impr
               FROM gsc_daily WHERE date BETWEEN ? AND ? GROUP BY template, locale""",
            (cur_start, cur_end),
        )
        prev_rows = {
            (r["template"], r["locale"]): r
            for r in self.store.query_all(
                """SELECT template, locale, SUM(clicks) AS clicks, SUM(impressions) AS impr
                   FROM gsc_daily WHERE date BETWEEN ? AND ? GROUP BY template, locale""",
                (prev_start, prev_end),
            )
        }
        annots = self.store.query_all(
            "SELECT deployed_at, url_or_pattern, git_sha, summary FROM annotations WHERE substr(deployed_at,1,10) BETWEEN ? AND ?",
            (prev_start, cur_end),
        )
        results: list[dict[str, Any]] = []
        all_keys = set(prev_rows.keys()) | {(r["template"], r["locale"]) for r in cur_rows}
        cur_map = {(r["template"], r["locale"]): r for r in cur_rows}

        for tmpl, loc in sorted(all_keys):
            c_clicks = float((cur_map.get((tmpl, loc)) or {}).get("clicks", 0))
            p_clicks = float((prev_rows.get((tmpl, loc)) or {}).get("clicks", 0))
            delta = round(c_clicks - p_clicks, 1)
            matched = [
                a for a in annots
                if a["url_or_pattern"] in ("/*", tmpl) or tmpl.startswith(a["url_or_pattern"].rstrip("*"))
            ]
            results.append({
                "template": tmpl,
                "locale": loc,
                "prev_clicks": p_clicks,
                "cur_clicks": c_clicks,
                "click_delta": delta,
                "pct_change": _pct_change(c_clicks, p_clicks),
                "correlated_deploys": matched,
            })
        results.sort(key=lambda x: x["click_delta"])
        return results


    def starving_money_pages(self, cur_start: str, cur_end: str) -> list[dict[str, Any]]:
        """High GA4 revenue/conversion-rate pages starving for organic search clicks."""
        ga = self.store.query_all(
            """SELECT url, SUM(sessions) AS sessions, SUM(key_events) AS key_events,
                      SUM(revenue) AS revenue, SUM(call_clicks) AS call_clicks
               FROM ga4_daily WHERE date BETWEEN ? AND ? GROUP BY url""",
            (cur_start, cur_end),
        )
        gsc = {
            r["url"]: r
            for r in self.store.query_all(
                """SELECT url, SUM(clicks) AS clicks, SUM(impressions) AS impr,
                          SUM(position * impressions) / MAX(SUM(impressions), 1) AS avg_pos
                   FROM gsc_daily WHERE date BETWEEN ? AND ? GROUP BY url""",
                (cur_start, cur_end),
            )
        }
        out: list[dict[str, Any]] = []
        for row in ga:
            url_val = str(row["url"])
            if "?" in url_val:
                continue  # Only indexable canonical paths qualify for organic internal-link boosts
            sess = int(row["sessions"])
            rev = float(row["revenue"])
            if sess < 3 and rev <= 0:
                continue
            ke = float(row["key_events"]) + float(row["call_clicks"])
            cvr = min(1.0, ke / max(sess, 1))
            rps = rev / max(sess, 1)
            g = gsc.get(url_val, {"clicks": 0.0, "impr": 0.0, "avg_pos": 0.0})
            if (rev > 0 or cvr >= 0.05) and float(g["clicks"]) < 150:
                out.append({
                    "url": url_val,
                    "sessions": sess,
                    "revenue": round(rev, 2),
                    "revenue_per_session": round(rps, 2),
                    "conversion_rate_pct": round(cvr * 100.0, 2),
                    "intent_events": round(ke, 1),
                    "gsc_clicks": round(float(g["clicks"]), 1),
                    "gsc_impressions": round(float(g["impr"]), 1),
                    "avg_position": round(float(g["avg_pos"]), 2),
                })
        out.sort(key=lambda x: (x["revenue_per_session"], x["intent_events"], x["gsc_impressions"]), reverse=True)
        return out

    def leaky_traffic_pages(
        self, cur_start: str, cur_end: str, min_sessions: int = 30
    ) -> list[dict[str, Any]]:
        """High-traffic landing pages with low conversion rate, protecting phone-converting pages."""
        rows = self.store.query_all(
            """SELECT url, locale, SUM(sessions) AS sessions, SUM(engaged_sessions) AS engaged,
                      SUM(key_events) AS key_events, SUM(revenue) AS revenue, SUM(call_clicks) AS call_clicks
               FROM ga4_daily WHERE date BETWEEN ? AND ? GROUP BY url, locale""",
            (cur_start, cur_end),
        )
        psi = {
            r["url"]: r
            for r in self.store.query_all(
                """SELECT url, perf_score, lcp_ms, inp_ms, cls
                   FROM psi_snapshots WHERE strategy='mobile' ORDER BY checked_at DESC"""
            )
        }
        out: list[dict[str, Any]] = []
        for r in rows:
            sess = int(r["sessions"])
            if sess < min_sessions:
                continue
            calls = int(r["call_clicks"])
            total_conv = float(r["key_events"]) + calls
            cvr = total_conv / sess
            if calls > 0 and (calls / sess) >= 0.03:
                continue  # Guardrail: phone-converting service page is NOT leaky
            if cvr < 0.015:
                out.append({
                    "url": r["url"],
                    "locale": r["locale"],
                    "sessions": sess,
                    "engagement_rate_pct": round((int(r["engaged"]) / sess) * 100.0, 1),
                    "web_key_events": float(r["key_events"]),
                    "call_clicks": calls,
                    "conversion_rate_pct": round(cvr * 100.0, 2),
                    "revenue": round(float(r["revenue"]), 2),
                    "mobile_cwv": psi.get(r["url"]),
                    "could_not_see": ["untracked_direct_dial_calls", "cookie_rejected_sessions"],
                })
        out.sort(key=lambda x: x["sessions"], reverse=True)
        return out


    def striking_distance_and_cannibalization(
        self, cur_start: str, cur_end: str, min_impressions: int | None = None
    ) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
        """Find #4-#20 quick-win queries (CTR-scored) and multi-URL keyword cannibalization."""
        min_impr = int(min_impressions if min_impressions is not None else self.config.get("min_striking_impressions", 100))
        min_can_impr = int(self.config.get("min_cannibal_impressions", 50))
        min_can_clicks = float(self.config.get("min_cannibal_clicks", 5))
        q_rows = self.store.query_all(
            """SELECT query, url, SUM(clicks) AS clicks, SUM(impressions) AS impr,
                      SUM(position * impressions) / MAX(SUM(impressions), 1) AS pos
               FROM gsc_daily WHERE date BETWEEN ? AND ? AND query != '(all)'
               GROUP BY query, url""",
            (cur_start, cur_end),
        )
        striking: list[dict[str, Any]] = []
        by_query: dict[str, list[dict[str, Any]]] = {}
        for r in q_rows:
            by_query.setdefault(r["query"], []).append(r)
            impr = float(r["impr"])
            pos = float(r["pos"])
            clicks = float(r["clicks"])
            if impr >= min_impr and 3.5 <= pos <= 20.5 and not self._is_branded_query(r["query"]):
                target_pos = 3 if pos <= 10.0 else 5
                potential = max(0.0, impr * CTR_BENCHMARK[target_pos] - clicks)
                striking.append({
                    "query": r["query"],
                    "url": r["url"],
                    "impressions": round(impr, 1),
                    "clicks": round(clicks, 1),
                    "avg_position": round(pos, 2),
                    "est_click_upside": round(potential, 1),
                })
        striking.sort(key=lambda x: x["est_click_upside"], reverse=True)

        cannibal: list[dict[str, Any]] = []
        for q, items in by_query.items():
            if self._is_branded_query(q):
                continue
            significant = [
                i for i in items
                if float(i["impr"]) >= min_can_impr and float(i["clicks"]) >= min_can_clicks and float(i["pos"]) <= 35.0
            ]
            if len(significant) >= 2:
                significant.sort(key=lambda i: (float(i["clicks"]), float(i["impr"]), -float(i["pos"])), reverse=True)
                cannibal.append({
                    "query": q,
                    "competing_pages": len(significant),
                    "recommended_owner": significant[0]["url"],
                    "pages": [
                        {"url": i["url"], "clicks": float(i["clicks"]), "impressions": float(i["impr"]), "avg_position": round(float(i["pos"]), 2)}
                        for i in significant
                    ],
                })
        cannibal.sort(key=lambda x: (sum(p["clicks"] for p in x["pages"]), sum(p["impressions"] for p in x["pages"])), reverse=True)
        return striking[:25], cannibal[:25]

    def url_intent_mismatches(self, cur_start: str, cur_end: str) -> list[dict[str, Any]]:
        """Detect queries ranking a wrong URL cohort/city based on venture intent_routing_rules."""
        rules = self.config.get("intent_routing_rules") or []
        if not rules:
            return []
        min_impr = int(self.config.get("min_striking_impressions", 15))
        rows = self.store.query_all(
            """SELECT query, url, SUM(clicks) AS clicks, SUM(impressions) AS impr,
                      SUM(position * impressions) / MAX(SUM(impressions), 1) AS pos
               FROM gsc_daily WHERE date BETWEEN ? AND ? AND query != '(all)'
               GROUP BY query, url HAVING impr >= ? AND pos <= 35.0 ORDER BY impr DESC""",
            (cur_start, cur_end, min_impr),
        )
        mismatches: list[dict[str, Any]] = []
        valid_slugs = set(self.config.get("valid_location_slugs") or [])
        for r in rows:
            q = str(r["query"])
            if self._is_branded_query(q):
                continue
            for rule in rules:
                ex_rx = rule.get("exclude_query_regex")
                if ex_rx and re.search(ex_rx, q, flags=re.IGNORECASE):
                    continue
                m = re.search(rule["query_regex"], q, flags=re.IGNORECASE)
                if not m:
                    continue
                slug_val = re.sub(r"[^a-z0-9]+", "-", (m.group(1) if m.lastindex else "").lower()).strip("-")
                if valid_slugs and slug_val and slug_val not in valid_slugs:
                    continue
                expected = str(rule["expected_url_template"]).replace("{1}", slug_val)
                if r["url"] != expected:
                    mismatches.append({
                        "query": q,
                        "ranking_url": r["url"],
                        "expected_url": expected,
                        "impressions": round(float(r["impr"]), 1),
                        "clicks": round(float(r["clicks"]), 1),
                        "avg_position": round(float(r["pos"]), 2),
                    })
                    break
        return mismatches[:25]

    def verify_experiment_did(self, experiment_id: int, window_days: int = 14) -> dict[str, Any]:
        """Compute Difference-in-Differences (DiD) lift vs untouched sibling cohort pages."""
        exps = self.store.query_all("SELECT * FROM experiments WHERE id = ?", (experiment_id,))
        if not exps:
            raise ValueError(f"Experiment {experiment_id} not found")
        exp = exps[0]
        dep = dt.date.fromisoformat(exp["deployed_at"][:10])
        b_start = (dep - dt.timedelta(days=window_days)).isoformat()
        b_end = (dep - dt.timedelta(days=1)).isoformat()
        a_start = (dep + dt.timedelta(days=1)).isoformat()
        a_end = (dep + dt.timedelta(days=window_days)).isoformat()

        def _sum_metric(col: str, sql_extra: str, params: tuple[Any, ...]) -> float:
            r = self.store.query_all(f"SELECT COALESCE(SUM({col}), 0) AS m FROM gsc_daily WHERE {sql_extra}", params)
            return float(r[0]["m"])

        t_before = _sum_metric("clicks", "url = ? AND date BETWEEN ? AND ?", (exp["url"], b_start, b_end))
        t_after = _sum_metric("clicks", "url = ? AND date BETWEEN ? AND ?", (exp["url"], a_start, a_end))
        t_impr_before = _sum_metric("impressions", "url = ? AND date BETWEEN ? AND ?", (exp["url"], b_start, b_end))

        # Net-new page (0 impressions & 0 clicks before deploy): never false-flag as REGRESSED vs growing controls
        if t_before <= 0 and t_impr_before <= 0:
            return {
                "experiment_id": experiment_id,
                "url": exp["url"],
                "template_cohort": exp["template"],
                "window_days": window_days,
                "treated_clicks_before": 0.0,
                "treated_clicks_after": t_after,
                "treated_pct_change": None,
                "control_pct_change": None,
                "did_lift_pct": None,
                "verdict": "NEW_PAGE_GAINED_CLICKS" if t_after > 0 else "NEW_PAGE_INDEXING",
            }

        # Balanced-panel cohort: only sibling URLs active in BOTH windows and not tested inside [b_start, a_end]
        balanced_controls = [
            r["url"]
            for r in self.store.query_all(
                """SELECT url FROM gsc_daily
                   WHERE template = ? AND url != ?
                     AND url NOT IN (
                         SELECT url FROM experiments
                         WHERE id != ? AND substr(deployed_at, 1, 10) BETWEEN ? AND ?
                     )
                   GROUP BY url
                   HAVING SUM(CASE WHEN date BETWEEN ? AND ? THEN impressions ELSE 0 END) > 0
                      AND SUM(CASE WHEN date BETWEEN ? AND ? THEN impressions ELSE 0 END) > 0""",
                (exp["template"], exp["url"], experiment_id, b_start, a_end, b_start, b_end, a_start, a_end),
            )
        ]
        if balanced_controls:
            ph = ",".join("?" for _ in balanced_controls)
            c_before = _sum_metric("clicks", f"url IN ({ph}) AND date BETWEEN ? AND ?", (*balanced_controls, b_start, b_end))
            c_after = _sum_metric("clicks", f"url IN ({ph}) AND date BETWEEN ? AND ?", (*balanced_controls, a_start, a_end))
        else:
            c_before, c_after = 0.0, 0.0

        t_pct = ((t_after - t_before) / t_before * 100.0) if t_before > 0 else 0.0
        c_pct = ((c_after - c_before) / c_before * 100.0) if c_before > 0 else 0.0
        return {
            "experiment_id": experiment_id,
            "url": exp["url"],
            "template_cohort": exp["template"],
            "window_days": window_days,
            "treated_clicks_before": t_before,
            "treated_clicks_after": t_after,
            "treated_pct_change": round(t_pct, 2),
            "control_pct_change": round(c_pct, 2),
            "did_lift_pct": round(t_pct - c_pct, 2),
            "verdict": "WORKED" if (t_pct - c_pct) >= 5.0 else ("REGRESSED" if (t_pct - c_pct) <= -5.0 else "INCONCLUSIVE"),
        }

    def climbed_rank_lost_clicks(
        self, cur_start: str, cur_end: str, prev_start: str, prev_end: str, min_impressions: int = 100
    ) -> list[dict[str, Any]]:
        """Detect queries that improved Google rank yet lost clicks (AIO / SERP CTR compression)."""
        cur = self.store.query_all(
            """SELECT query, url, SUM(clicks) AS c, SUM(impressions) AS i,
                      SUM(position * impressions) / MAX(SUM(impressions), 1) AS pos
               FROM gsc_daily WHERE date BETWEEN ? AND ? AND query != '(all)' GROUP BY query, url""",
            (cur_start, cur_end),
        )
        prev = {
            (r["query"], r["url"]): r
            for r in self.store.query_all(
                """SELECT query, url, SUM(clicks) AS c, SUM(impressions) AS i,
                          SUM(position * impressions) / MAX(SUM(impressions), 1) AS pos
                   FROM gsc_daily WHERE date BETWEEN ? AND ? AND query != '(all)' GROUP BY query, url""",
                (prev_start, prev_end),
            )
        }
        out: list[dict[str, Any]] = []
        for r in cur:
            p = prev.get((r["query"], r["url"]))
            if not p or float(r["i"]) < min_impressions:
                continue
            pos_gain = float(p["pos"]) - float(r["pos"])  # positive = climbed up closer to #1
            click_diff = float(r["c"]) - float(p["c"])
            if pos_gain >= 0.5 and click_diff <= -5.0:
                cause = "SERP_AIO_CTR_COMPRESSION" if float(r["i"]) >= float(p["i"]) * 0.9 else "SEARCH_DEMAND_DROP"
                out.append({
                    "query": r["query"],
                    "url": r["url"],
                    "prev_position": round(float(p["pos"]), 2),
                    "cur_position": round(float(r["pos"]), 2),
                    "click_delta": round(click_diff, 1),
                    "cause": cause,
                })
        out.sort(key=lambda x: x["click_delta"])
        return out[:20]

    def full_diagnostic(self, cur_start: str, cur_end: str, prev_start: str, prev_end: str) -> dict[str, Any]:
        striking, cannibal = self.striking_distance_and_cannibalization(cur_start, cur_end)
        min_impr = int(self.config.get("min_striking_impressions", 100))
        return {
            "window": {"current": [cur_start, cur_end], "previous": [prev_start, prev_end]},
            "segment_anomalies": self.segment_anomalies(cur_start, cur_end, prev_start, prev_end),
            "starving_money_pages": self.starving_money_pages(cur_start, cur_end),
            "leaky_traffic_pages": self.leaky_traffic_pages(cur_start, cur_end),
            "striking_distance": striking,
            "cannibalization": cannibal,
            "url_intent_mismatches": self.url_intent_mismatches(cur_start, cur_end),
            "climbed_rank_lost_clicks": self.climbed_rank_lost_clicks(cur_start, cur_end, prev_start, prev_end, min_impressions=min_impr),
        }


def format_numbered_triage(diag: dict[str, Any], core_status: dict[str, Any]) -> str:
    """Format top cross-source findings into a human-gated [1]..[N] triage queue."""
    freeze = core_status.get("edit_mode") == "FREEZE"
    header = (
        "[CORE UPDATE FREEZE ACTIVE — DIAGNOSTICS ONLY; HOLD LIVE TITLE/H1 REWRITES]"
        if freeze else "[EDIT MODE: NORMAL — HUMAN APPROVAL REQUIRED]"
    )
    items: list[str] = []
    for d in diag.get("segment_anomalies", [])[:2]:
        if d["click_delta"] <= -10.0:
            dep_note = f" (deploy {d['correlated_deploys'][0]['git_sha']})" if d["correlated_deploys"] else ""
            act = "Inspect rollback/diff" if d["correlated_deploys"] else "Monitor cohort"
            items.append(f"{d['template']} [{d['locale']}]: {d['click_delta']} clicks ({d['pct_change']}%){dep_note} -> {act}")
    for m in diag.get("starving_money_pages", [])[:2]:
        act = "Stage internal links only (freeze)" if freeze else "Approve title/internal-link boost"
        items.append(f"{m['url']}: ${m['revenue']} rev ({m['conversion_rate_pct']}% CVR) on {m['gsc_clicks']} GSC clicks (pos {m['avg_position']}) -> {act}")
    for l in diag.get("leaky_traffic_pages", [])[:2]:
        items.append(f"{l['url']} [{l['locale']}]: {l['sessions']} sessions, {l['conversion_rate_pct']}% CVR -> Audit above-fold CTA & mobile CWV")
    for c in diag.get("cannibalization", [])[:1]:
        items.append(f"Query '{c['query']}': {c['competing_pages']} URLs competing -> Consolidate/canonical to {c['recommended_owner']}")
    if not items:
        return f"{header}\nNo statistically significant anomalies or bottlenecks above sample thresholds."
    numbered = "\n".join(f"[{idx}] {line}" for idx, line in enumerate(items, 1))
    return f"{header}\n{numbered}\n\nReply shorthand: e.g. '1 approve, 2 skip'"
