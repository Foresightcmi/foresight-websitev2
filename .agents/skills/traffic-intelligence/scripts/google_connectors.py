"""$0 Google Search Status, PageSpeed v5, Search Console v1, and GA4 REST connectors."""
from __future__ import annotations

import datetime as dt
import json
import os
from pathlib import Path
from typing import Any
from urllib.parse import quote

import httpx

SEARCH_STATUS_URL = "https://status.search.google.com/incidents.json"
PSI_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
GSC_SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
GA4_SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]


def _parse_iso(ts: str | None) -> dt.datetime | None:
    if not ts:
        return None
    val = ts.replace("Z", "+00:00")
    dt_obj = dt.datetime.fromisoformat(val)
    return dt_obj if dt_obj.tzinfo else dt_obj.replace(tzinfo=dt.timezone.utc)


def evaluate_core_update_window(
    incidents: list[dict[str, Any]],
    now_iso: str | None = None,
    cooldown_days: int = 7,
) -> dict[str, Any]:
    """Enforce Rule 11.10 Core Update Freeze Gate: block title/H1 panic edits during rollouts."""
    now = _parse_iso(now_iso) or dt.datetime.now(dt.timezone.utc)
    blocking: list[dict[str, Any]] = []
    recent: list[dict[str, Any]] = []
    active_flag = False

    for inc in incidents:
        svc = str(inc.get("service_name", "")).lower()
        desc = str(inc.get("external_desc", ""))
        if svc != "ranking" and "update" not in desc.lower():
            continue
        begin_dt = _parse_iso(inc.get("begin"))
        end_dt = _parse_iso(inc.get("end"))
        item = {
            "id": inc.get("id"),
            "title": desc,
            "begin": inc.get("begin"),
            "end": inc.get("end"),
            "source_url": SEARCH_STATUS_URL,
            "retrieved_on": now.date().isoformat(),
        }
        recent.append(item)
        if begin_dt and begin_dt <= now:
            if end_dt is None:
                active_flag = True
                blocking.append({**item, "reason": "ACTIVE_ROLLOUT_IN_PROGRESS"})
            elif (now - end_dt).total_seconds() <= cooldown_days * 86400:
                blocking.append({**item, "reason": f"WITHIN_{cooldown_days}D_POST_ROLLOUT_COOLDOWN"})

    return {
        "edit_mode": "FREEZE" if blocking else "NORMAL",
        "active_rollout": active_flag,
        "blocking_updates": blocking,
        "recent_ranking_updates": recent[:8],
        "source_url": SEARCH_STATUS_URL,
        "retrieved_on": now.date().isoformat(),
    }


def fetch_core_updates_live(cooldown_days: int = 7) -> dict[str, Any]:
    """Fetch live Google Search Status Dashboard incidents and evaluate freeze lock."""
    with httpx.Client(timeout=15.0, follow_redirects=True) as client:
        resp = client.get(SEARCH_STATUS_URL)
        resp.raise_for_status()
        return evaluate_core_update_window(resp.json(), cooldown_days=cooldown_days)


def fetch_pagespeed_live(target_url: str, strategy: str = "mobile", api_key: str | None = None) -> dict[str, Any]:
    """Query free Google PageSpeed Insights v5 API for CWV (LCP, INP, CLS, Performance Score)."""
    params: dict[str, str] = {"url": target_url, "strategy": strategy, "category": "PERFORMANCE"}
    key = api_key or os.environ.get("PAGESPEED_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if key:
        params["key"] = key
    with httpx.Client(timeout=45.0) as client:
        resp = client.get(PSI_API_URL, params=params)
        resp.raise_for_status()
        data = resp.json()
    lh = data.get("lighthouseResult", {})
    audits = lh.get("audits", {})
    field = data.get("loadingExperience", {}).get("metrics", {})
    perf = (lh.get("categories", {}).get("performance", {}).get("score") or 0.0) * 100.0
    lcp = field.get("LARGEST_CONTENTFUL_PAINT_MS", {}).get("percentile") or audits.get("largest-contentful-paint", {}).get("numericValue")
    inp = field.get("INTERACTION_TO_NEXT_PAINT", {}).get("percentile") or audits.get("experimental-interaction-to-next-paint", {}).get("numericValue")
    cls_val = field.get("CUMULATIVE_LAYOUT_SHIFT_SCORE", {}).get("percentile")
    cls = (cls_val / 100.0) if cls_val is not None else audits.get("cumulative-layout-shift", {}).get("numericValue")
    return {
        "url": target_url,
        "strategy": strategy,
        "perf_score": round(float(perf), 1),
        "lcp_ms": round(float(lcp), 1) if lcp is not None else None,
        "inp_ms": round(float(inp), 1) if inp is not None else None,
        "cls": round(float(cls), 3) if cls is not None else None,
        "source_url": f"{PSI_API_URL}?url={quote(target_url, safe='')}&strategy={strategy}",
        "retrieved_on": dt.date.today().isoformat(),
    }


def _mint_clock_synced_sa_token(sa_path: Path, scopes: list[str]) -> str:
    """Mint RS256 Service Account token synced to Google HTTP Date header (immune to host clock skew)."""
    import email.utils
    import time
    from google.auth import crypt, jwt

    sa_info = json.loads(sa_path.read_text(encoding="utf-8"))
    with httpx.Client(timeout=10.0) as client:
        now_epoch = int(time.time())
        try:
            head_resp = client.head("https://oauth2.googleapis.com/token")
            if "date" in head_resp.headers:
                now_epoch = int(email.utils.parsedate_to_datetime(head_resp.headers["date"]).timestamp())
        except Exception:
            pass
        signer = crypt.RSASigner.from_service_account_info(sa_info)
        assertion = jwt.encode(
            signer,
            {
                "iss": sa_info["client_email"],
                "scope": " ".join(scopes),
                "aud": sa_info.get("token_uri", "https://oauth2.googleapis.com/token"),
                "iat": now_epoch,
                "exp": now_epoch + 3600,
            },
        )
        tok_str = assertion.decode("utf-8") if isinstance(assertion, bytes) else assertion
        resp = client.post(
            sa_info.get("token_uri", "https://oauth2.googleapis.com/token"),
            data={"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": tok_str},
        )
        resp.raise_for_status()
        return str(resp.json()["access_token"])


def load_google_bearer_token(
    workspace_dir: str | Path, scopes: list[str], configured_sa_path: str | None = None
) -> tuple[str | None, str]:
    """Resolve read-only OAuth bearer token from per-venture Service Account, token.json, or ADC."""
    import google.auth
    from google.auth.transport.requests import Request
    from google.oauth2 import credentials as oauth_creds

    ws = Path(workspace_dir).resolve()
    custom_sa = (ws / configured_sa_path) if configured_sa_path else None
    sa_candidates = [
        custom_sa,
        ws / ".analytics" / "service-account.json",
        Path(os.environ["GOOGLE_APPLICATION_CREDENTIALS"]) if os.environ.get("GOOGLE_APPLICATION_CREDENTIALS") else None,
    ]
    for sa_path in sa_candidates:
        if sa_path and sa_path.is_file():
            try:
                return _mint_clock_synced_sa_token(sa_path, scopes), f"service_account:{sa_path.name}"
            except Exception:
                continue

    tok_path = ws / ".analytics" / "token.json"
    if tok_path.is_file():
        creds = oauth_creds.Credentials.from_authorized_user_file(str(tok_path), scopes=scopes)
        if not creds.valid and creds.refresh_token:
            creds.refresh(Request())
            tok_path.write_text(creds.to_json(), encoding="utf-8")
        if creds.token:
            return creds.token, "oauth_token:.analytics/token.json"

    try:
        creds, _ = google.auth.default(scopes=scopes)
        creds.refresh(Request())
        if creds.token:
            return creds.token, "application_default_credentials"
    except Exception:
        pass
    return None, "unconfigured"



def fetch_gsc_search_analytics(
    token: str, site_url: str, start_date: str, end_date: str, max_rows: int = 50000
) -> list[dict[str, Any]]:
    """Pull paginated Google Search Console date+page+query performance rows ($0 API)."""
    endpoint = f"https://searchconsole.googleapis.com/webmasters/v3/sites/{quote(site_url, safe='')}/searchAnalytics/query"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    rows_out: list[dict[str, Any]] = []
    start_row = 0
    with httpx.Client(timeout=30.0) as client:
        while start_row < max_rows:
            body = {
                "startDate": start_date,
                "endDate": end_date,
                "dimensions": ["date", "page", "query"],
                "rowLimit": min(25000, max_rows - start_row),
                "startRow": start_row,
            }
            resp = client.post(endpoint, headers=headers, json=body)
            resp.raise_for_status()
            batch = resp.json().get("rows", [])
            if not batch:
                break
            for item in batch:
                keys = item.get("keys", ["", "/", ""])
                rows_out.append({
                    "date": keys[0], "page": keys[1], "query": keys[2],
                    "clicks": item.get("clicks", 0),
                    "impressions": item.get("impressions", 0),
                    "position": item.get("position", 0.0),
                })
            if len(batch) < 25000:
                break
            start_row += len(batch)
    return rows_out


AI_ASSISTANT_SOURCES = ("chatgpt.com", "perplexity.ai", "claude.ai", "gemini.google.com", "copilot.microsoft.com")


def fetch_ga4_landing_pages(
    token: str,
    property_id: str,
    start_date: str,
    end_date: str,
    call_event_names: list[str] | None = None,
    key_conversion_events: list[str] | None = None,
) -> list[dict[str, Any]]:
    """Pull GA4 landing page sessions, engagement, key events, revenue, custom call events, and AI referrals."""
    prop = str(property_id).replace("properties/", "").strip()
    endpoint = f"https://analyticsdata.googleapis.com/v1beta/properties/{prop}:runReport"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    call_set = {e.lower() for e in (call_event_names or ["phone_call_click", "click_to_call", "tel_click"])}
    conv_set = {e.lower() for e in (key_conversion_events or [])}

    base_body = {
        "dateRanges": [{"startDate": start_date, "endDate": end_date}],
        "dimensions": [{"name": "date"}, {"name": "landingPagePlusQueryString"}],
        "metrics": [
            {"name": "sessions"},
            {"name": "engagedSessions"},
            {"name": "keyEvents"},
            {"name": "grossPurchaseRevenue"},
        ],
        "limit": 50000,
    }
    evt_body = {
        "dateRanges": [{"startDate": start_date, "endDate": end_date}],
        "dimensions": [{"name": "date"}, {"name": "landingPagePlusQueryString"}, {"name": "eventName"}],
        "metrics": [{"name": "eventCount"}],
        "limit": 50000,
    }
    ai_body = {
        "dateRanges": [{"startDate": start_date, "endDate": end_date}],
        "dimensions": [{"name": "date"}, {"name": "landingPagePlusQueryString"}, {"name": "sessionSource"}],
        "metrics": [{"name": "sessions"}],
        "limit": 25000,
    }
    with httpx.Client(timeout=30.0) as client:
        resp = client.post(endpoint, headers=headers, json=base_body)
        resp.raise_for_status()
        data = resp.json()
        evt_rows = client.post(endpoint, headers=headers, json=evt_body).json().get("rows", [])
        ai_rows = client.post(endpoint, headers=headers, json=ai_body).json().get("rows", [])

    def _fmt_dt(raw: str) -> str:
        return f"{raw[:4]}-{raw[4:6]}-{raw[6:8]}" if len(raw) == 8 else raw

    by_key: dict[tuple[str, str], dict[str, Any]] = {}
    for r in data.get("rows", []):
        dims = [d.get("value", "") for d in r.get("dimensionValues", [])]
        mets = [m.get("value", "0") for m in r.get("metricValues", [])]
        dt_s, lp = _fmt_dt(dims[0]), (dims[1] or "/")
        by_key[(dt_s, lp)] = {
            "date": dt_s, "landing_page": lp,
            "sessions": int(float(mets[0])), "engaged_sessions": int(float(mets[1])),
            "key_events": float(mets[2]), "revenue": float(mets[3]),
            "call_clicks": 0, "ai_assistant_sessions": 0,
        }
    for r in evt_rows:
        dims = [d.get("value", "") for d in r.get("dimensionValues", [])]
        cnt = int(float(r.get("metricValues", [{"value": "0"}])[0].get("value", "0")))
        dt_s, lp, ename = _fmt_dt(dims[0]), (dims[1] or "/"), dims[2].lower()
        rec = by_key.get((dt_s, lp))
        if rec:
            if ename in call_set:
                rec["call_clicks"] += cnt
            elif ename in conv_set and rec["key_events"] == 0:
                rec["key_events"] += float(cnt)
    for r in ai_rows:
        dims = [d.get("value", "") for d in r.get("dimensionValues", [])]
        cnt = int(float(r.get("metricValues", [{"value": "0"}])[0].get("value", "0")))
        dt_s, lp, src = _fmt_dt(dims[0]), (dims[1] or "/"), dims[2].lower()
        rec = by_key.get((dt_s, lp))
        if rec and any(ai in src for ai in AI_ASSISTANT_SOURCES):
            rec["ai_assistant_sessions"] += cnt
    return list(by_key.values())
