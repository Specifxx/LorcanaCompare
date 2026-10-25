#!/usr/bin/env bash
# The "migration" step: pushes prisma/schema.prisma to the operational database
# before `next build`, on production builds only. The schema is additive by
# convention (new nullable columns, new tables), so no --accept-data-loss: a
# push that would drop data fails the build instead of silently losing rows.
# No DATABASE_URL (a fresh project before Neon is connected) → skipped, and the
# site still builds and serves every public page from data/.
set -euo pipefail
if [ -z "${DATABASE_URL:-}" ]; then
  echo "[build-db-push] DATABASE_URL not set — skipping schema push."
  exit 0
fi
if [ "${VERCEL_ENV:-production}" != "production" ]; then
  echo "[build-db-push] VERCEL_ENV=${VERCEL_ENV} — schema push runs on production builds only."
  exit 0
fi
npx prisma db push --skip-generate
