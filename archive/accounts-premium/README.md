# Archive: accounts, Premium, alerts, email

Removed from the live site on 2026-10-25 (owner: "get rid of the sign-in
features … get rid of the premium … just have it in an archive somewhere"),
kept here so it can come back. Not built, linted or type-checked
(tsconfig/eslint exclude `archive/`). Paths mirror where each file lived.

What it was: Google sign-in (lib/oauth.ts, app/api/auth/google), signed
session cookies (lib/auth.ts), Neon via Prisma (prisma/schema.prisma,
lib/db.ts), Free/Plus/Premium with Stripe checkout and webhook (lib/premium.ts,
lib/stripe.ts, app/premium, app/api/stripe), founding members (first 50
accounts free), price alerts with a daily email run (app/api/alerts,
scripts/send-alerts.ts), Resend email and owner notifications (lib/email.ts),
the contact form and newsletter, and the /admin dashboard.

To restore: move the files back, re-add `@prisma/client`, `prisma` and `jose`
to package.json, restore the build script's `prisma generate && bash
scripts/build-db-push.sh`, the Header's AccountLink, the card page's
AlertButton / PremiumHistory and the ClickEvent write in app/go/route.ts, and
see DECISIONS.md for the env vars each piece needs.
