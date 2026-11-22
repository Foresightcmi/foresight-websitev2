#!/usr/bin/env bash
# Vercel Ignored Build Step: exit 0 = SKIP build | exit 1 = PROCEED with build
if [[ "$VERCEL_GIT_COMMIT_MESSAGE" == *"[vercel skip]"* ]]; then
  echo "Skipping Vercel build: [vercel skip] token present."
  exit 0
fi

# Guard shallow clones: if HEAD^ is unavailable, proceed with build safely
git rev-parse --verify HEAD^ >/dev/null 2>&1 || exit 1

# Proceed ONLY when renderable Next.js pages, components, public assets, or SSG JSON data changed
if git diff --quiet HEAD^ HEAD -- \
  app/ components/ lib/ public/ \
  data/posts.json data/cities.json data/services-pseo.json data/truth.json \
  data/neighborhoods-pseo.json data/counties-pseo.json \
  next.config.mjs package.json vercel.json; then
  echo "Skipping Vercel build: only non-renderable telemetry/outreach files changed."
  exit 0
fi

echo "Renderable Foresight site files changed — proceeding with Vercel production build."
exit 1
