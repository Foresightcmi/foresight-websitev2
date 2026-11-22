"""Per-venture isolated SQLite store for cross-source analytics & experiment ledger."""
from __future__ import annotations

from contextlib import closing, contextmanager
import datetime as dt
import sqlite3
from pathlib import Path
from typing import Any, Iterator

from scripts.url_normalizer import extract_locale, extract_template_cohort, normalize_url

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS gsc_daily (
    date TEXT NOT NULL,
    url TEXT NOT NULL,
    template TEXT NOT NULL,
    locale TEXT NOT NULL,
    query TEXT NOT NULL,
    clicks REAL NOT NULL DEFAULT 0,
    impressions REAL NOT NULL DEFAULT 0,
    position REAL NOT NULL DEFAULT 0,
    source_url TEXT NOT NULL,
    retrieved_on TEXT NOT NULL,
    PRIMARY KEY (date, url, query)
);
CREATE TABLE IF NOT EXISTS ga4_daily (
    date TEXT NOT NULL,
    url TEXT NOT NULL,
    template TEXT NOT NULL,
    locale TEXT NOT NULL,
    sessions INTEGER NOT NULL DEFAULT 0,
    engaged_sessions INTEGER NOT NULL DEFAULT 0,
    key_events REAL NOT NULL DEFAULT 0,
    revenue REAL NOT NULL DEFAULT 0,
    call_clicks INTEGER NOT NULL DEFAULT 0,
    ai_assistant_sessions INTEGER NOT NULL DEFAULT 0,
    source_url TEXT NOT NULL,
    retrieved_on TEXT NOT NULL,
    PRIMARY KEY (date, url)
);
CREATE TABLE IF NOT EXISTS psi_snapshots (
    checked_at TEXT NOT NULL,
    url TEXT NOT NULL,
    strategy TEXT NOT NULL,
    perf_score REAL,
    lcp_ms REAL,
    inp_ms REAL,
    cls REAL,
    source_url TEXT NOT NULL,
    retrieved_on TEXT NOT NULL,
    PRIMARY KEY (checked_at, url, strategy)
);
CREATE TABLE IF NOT EXISTS annotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deployed_at TEXT NOT NULL,
    url_or_pattern TEXT NOT NULL,
    git_sha TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS experiments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    template TEXT NOT NULL,
    deployed_at TEXT NOT NULL,
    hypothesis TEXT NOT NULL,
    git_sha TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);
"""


class AnalyticsStore:
    """Thread-safe local SQLite wrapper scoped strictly to a single venture workspace."""

    def __init__(self, db_path: str | Path):
        self.db_path = Path(db_path).resolve()
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.ledger_path = self.db_path.parent / "experiments_ledger.jsonl"
        with self._conn() as con:
            con.executescript(SCHEMA_SQL)
        self._rehydrate_experiments_from_ledger()

    def _rehydrate_experiments_from_ledger(self) -> None:
        if not self.ledger_path.is_file():
            return
        import json
        existing = {
            (r["url"], r["deployed_at"], r["hypothesis"])
            for r in self.query_all("SELECT url, deployed_at, hypothesis FROM experiments")
        }
        for line in self.ledger_path.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            item = json.loads(line)
            key = (item["url"], item["deployed_at"], item["hypothesis"])
            if key not in existing:
                with self._conn() as con:
                    con.execute(
                        "INSERT INTO experiments (url, template, deployed_at, hypothesis, git_sha, created_at) VALUES (?,?,?,?,?,?)",
                        (item["url"], item["template"], item["deployed_at"], item["hypothesis"], item.get("git_sha", ""), item.get("created_at", "")),
                    )
                existing.add(key)

    @contextmanager
    def _conn(self) -> Iterator[sqlite3.Connection]:
        con = sqlite3.connect(str(self.db_path))
        con.row_factory = sqlite3.Row
        try:
            with con:
                yield con
        finally:
            con.close()

    @staticmethod
    def _today() -> str:
        return dt.date.today().isoformat()

    def upsert_gsc_rows(self, rows: list[dict[str, Any]], source_url: str) -> int:
        retrieved = self._today()
        payload = []
        for r in rows:
            u = normalize_url(str(r.get("page") or r.get("url") or "/"))
            payload.append((
                str(r["date"])[:10], u, extract_template_cohort(u), extract_locale(u),
                str(r.get("query") or "(all)").strip().lower(),
                float(r.get("clicks", 0)), float(r.get("impressions", 0)), float(r.get("position", 0)),
                source_url, retrieved,
            ))
        with self._conn() as con:
            con.executemany(
                """INSERT INTO gsc_daily VALUES (?,?,?,?,?,?,?,?,?,?)
                   ON CONFLICT(date, url, query) DO UPDATE SET
                   clicks=excluded.clicks, impressions=excluded.impressions,
                   position=excluded.position, retrieved_on=excluded.retrieved_on""",
                payload,
            )
        return len(payload)

    def upsert_ga4_rows(self, rows: list[dict[str, Any]], source_url: str) -> int:
        retrieved = self._today()
        payload = []
        for r in rows:
            u = normalize_url(str(r.get("landing_page") or r.get("url") or "/"))
            payload.append((
                str(r["date"])[:10], u, extract_template_cohort(u), extract_locale(u),
                int(r.get("sessions", 0)), int(r.get("engaged_sessions", 0)),
                float(r.get("key_events", 0)), float(r.get("revenue", 0.0)),
                int(r.get("call_clicks", 0)), int(r.get("ai_assistant_sessions", 0)),
                source_url, retrieved,
            ))
        with self._conn() as con:
            con.executemany(
                """INSERT INTO ga4_daily VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
                   ON CONFLICT(date, url) DO UPDATE SET
                   sessions=excluded.sessions, engaged_sessions=excluded.engaged_sessions,
                   key_events=excluded.key_events, revenue=excluded.revenue,
                   call_clicks=excluded.call_clicks, ai_assistant_sessions=excluded.ai_assistant_sessions,
                   retrieved_on=excluded.retrieved_on""",
                payload,
            )
        return len(payload)

    def upsert_psi_snapshot(self, snap: dict[str, Any], source_url: str) -> None:
        u = normalize_url(str(snap.get("url") or "/"))
        checked = str(snap.get("checked_at") or dt.datetime.now(dt.timezone.utc).isoformat())
        with self._conn() as con:
            con.execute(
                """INSERT OR REPLACE INTO psi_snapshots VALUES (?,?,?,?,?,?,?,?,?)""",
                (
                    checked, u, str(snap.get("strategy", "mobile")),
                    snap.get("perf_score"), snap.get("lcp_ms"), snap.get("inp_ms"), snap.get("cls"),
                    source_url, self._today(),
                ),
            )

    def record_annotation(self, deployed_at: str, url_or_pattern: str, git_sha: str = "", summary: str = "") -> int:
        with self._conn() as con:
            cur = con.execute(
                "INSERT INTO annotations (deployed_at, url_or_pattern, git_sha, summary) VALUES (?,?,?,?)",
                (deployed_at, url_or_pattern, git_sha, summary),
            )
            return int(cur.lastrowid or 0)

    def record_experiment(self, url: str, deployed_at: str, hypothesis: str, git_sha: str = "") -> int:
        import json
        norm = normalize_url(url)
        tmpl = extract_template_cohort(norm)
        now_s = dt.datetime.now(dt.timezone.utc).isoformat()
        dep_d = deployed_at[:10]
        with self._conn() as con:
            cur = con.execute(
                "INSERT INTO experiments (url, template, deployed_at, hypothesis, git_sha, created_at) VALUES (?,?,?,?,?,?)",
                (norm, tmpl, dep_d, hypothesis, git_sha, now_s),
            )
            exp_id = int(cur.lastrowid or 0)
        entry = {"id": exp_id, "url": norm, "template": tmpl, "deployed_at": dep_d, "hypothesis": hypothesis, "git_sha": git_sha, "created_at": now_s}
        with self.ledger_path.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(entry) + "\n")
        return exp_id

    def query_all(self, sql: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
        with self._conn() as con:
            return [dict(r) for r in con.execute(sql, params).fetchall()]
