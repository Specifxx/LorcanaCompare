# Going live: owner checklist

The fast path is `docs/CHROME-SETUP-PROMPT.md`: paste it into Claude in Chrome
and it does steps 2–10 for both sites. This file is the same list, written for a
human.

1. **Domains.** `lorcanacompare.com` and `gundamcompare.com` were bought in
   Vercel (2026-10-25), so DNS is Vercel's: add each to its project under
   Settings → Domains, with www redirecting to the apex.
2. **Merge** `claude/hopeful-bardeen-d4cuq3` into `main` in both repos.
   GitHub → Settings → Actions → Workflow permissions → Read and write.
3. **Neon:** one free project per site. Copy the pooled URL as `DATABASE_URL`.
4. **eBay keys:** the production keyset must be enabled. A new one stays
   disabled until Marketplace Account Deletion notifications are set up. The
   Lorcana site serves the endpoint at `/api/ebay/account-deletion`: register
   that URL on the eBay developer page with the same `EBAY_VERIFICATION_TOKEN`
   as the Lorcana Vercel project. On 2026-10-25 the key
   pair returned `invalid_client`, so re-copy the Cert ID from the developer
   portal.
5. **GitHub secrets** (both repos): `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`,
   `EBAY_AFFILIATE_CAMPAIGN`, `DATABASE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`,
   `INDEXNOW_KEY`, `STRIPE_SECRET_KEY` (monitor only). Add the `SITE_URL`
   variable too.
6. **Vercel:** import the repo and set the env vars listed in `.env.example`.
   Set the production branch to `main`. Add the domain and a www → apex redirect.
7. **Stripe:** create Plus ($2.99/$23.99) and Premium ($9.99/$79.99) prices
   (optional). Add a webhook at `/api/stripe/webhook` for the three
   `customer.subscription.*` events and put the signing secret in
   `STRIPE_WEBHOOK_SECRET`. Turn on the customer portal.
8. **Resend:** verify the domain and create an API key.
9. **Affiliates:** add the domains to eBay Partner Network (optionally one
   campaign per site), Impact/TCGplayer (a property per site) and Amazon.
10. **First import:** Actions → Refresh prices → Run workflow, then Ops
    monitor → Run workflow.
11. **Search:** Google Search Console (Domain property, submit
    `sitemap.xml`), Bing Webmaster Tools (import from GSC, IndexNow), AdSense
    (add site; `ads.txt` is served).

## Day to day

* Prices refresh at the time set in `refresh-prices.yml`. That commit is the
  day's only production build.
* An urgent code release: Actions → Production deploy → Run workflow.
* `/admin` shows users, revenue, clicks, store import health and the eBay
  budget. The ops monitor emails you when something breaks.
* Adding a store: verify that its `products.json` returns this game's
  products, then add it to `src/content/stores.ts`.

## Turning payments on (later)

Paid plans show "Coming soon", and the first 50 accounts on each site are
founding members with Premium free for good. The Stripe code is complete. To
start charging:

1. In Stripe, create Plus ($2.99/$23.99) and Premium ($9.99/$79.99) prices per
   site, a webhook to `/api/stripe/webhook` for the three
   `customer.subscription.*` events, and turn on the customer portal.
2. In Vercel set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, the four
   `STRIPE_PRICE_*` ids and `PAYMENTS_ENABLED=1`, then redeploy.
