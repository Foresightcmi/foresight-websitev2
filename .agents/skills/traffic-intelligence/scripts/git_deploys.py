"""Git commit & deployment route mapper for traffic drop correlation."""
from __future__ import annotations

import re
import subprocess
from pathlib import Path
from typing import Any

from scripts.url_normalizer import extract_template_cohort, normalize_url


ROUTE_FILE_RE = re.compile(
    r"(?:^|/)(?:app|pages|src/app|src/pages|content|posts|guides|templates)/(.+?)(?:/page|/index)?\.(?:tsx|ts|jsx|js|mdx|md|html|astro|vue)$"
)


def infer_templates_from_files(changed_files: list[str]) -> list[str]:
    """Infer affected URL templates from modified repository file paths."""
    templates: set[str] = set()
    for fpath in changed_files:
        norm = fpath.replace("\\", "/").strip("/")
        m = ROUTE_FILE_RE.search(norm)
        if m:
            slug = re.sub(r"\[.+?\]", "item", m.group(1))
            templates.add(extract_template_cohort(normalize_url("/" + slug)))
        elif any(k in norm.lower() for k in ("layout.", "header", "navbar", "middleware", "next.config", "vercel.json")):
            templates.add("/*")
    return sorted(templates) or ["/*"]


def scan_git_deploys(repo_dir: str | Path, since_days: int = 90, max_commits: int = 100) -> list[dict[str, Any]]:
    """Extract recent Git commits with changed files and inferred route templates."""
    repo = Path(repo_dir).resolve()
    if not (repo / ".git").exists():
        return []
    cmd = [
        "git", "-C", str(repo), "log",
        f"--since={since_days}.days",
        f"-n{max_commits}",
        "--name-only",
        "--pretty=format:COMMIT|%h|%aI|%s",
    ]
    try:
        raw = subprocess.check_output(cmd, stderr=subprocess.DEVNULL, text=True, encoding="utf-8", errors="replace")
    except Exception:
        return []

    commits: list[dict[str, Any]] = []
    cur: dict[str, Any] | None = None
    files: list[str] = []
    for line in raw.splitlines():
        if line.startswith("COMMIT|"):
            if cur is not None:
                cur["templates"] = infer_templates_from_files(files)
                cur["files_changed"] = len(files)
                commits.append(cur)
            _, sha, iso_dt, subj = (line.split("|", 3) + ["", "", ""])[:4]
            cur = {"git_sha": sha, "deployed_at": iso_dt, "summary": subj.strip()}
            files = []
        elif line.strip() and cur is not None:
            files.append(line.strip())
    if cur is not None:
        cur["templates"] = infer_templates_from_files(files)
        cur["files_changed"] = len(files)
        commits.append(cur)
    return commits
