# Lorcana Compare

Free Disney Lorcana price comparison: every card and sealed product, compared across
TCGplayer, eBay and Lorcana game stores (US, UK, Canada, Australia, EU), updated daily.

Built on the Rift Compare playbook (riftcompare.com, repo `Specifxx/TCGEmpire`),
rebuilt as one lean engine shared with Gundam Compare. The only game-specific files
are `src/site.config.ts` and `src/content/` (stores, blog posts, pre-order copy).

## How it works

```
GitHub Actions, daily 06:17 UTC (refresh-prices.yml)
  TCGCSV (TCGplayer catalogue + prices, category 71)
  + every Shopify store in src/content/stores.ts  (products.json)
  + eBay Browse API, budgeted (1,500 calls/day, nothing under $20)
  → data/public/*.json, data/history/<set>.json, data/state/*.json
  → commit to main with "[deploy]" in the subject  → one Vercel build a day
  → IndexNow ping
```

* **Public pages never touch the database.** They read the committed JSON
  (`src/lib/data.ts`), shipped with the deployment. Pages revalidate every 6–24
  hours and card pages are cached on first visit (nothing prerendered at build).
* **There is no database.** No accounts, no Premium, no email: the site
  compares prices and earns through affiliate links (eBay, TCGplayer, Amazon).
  The removed account/Premium code is in `archive/accounts-premium/`.
* **Deploys are gated** (`scripts/vercel-ignore-build.sh`): production builds
  only when the commit subject has `[deploy]`; previews need `[preview]`;
  `claude/*` branches never deploy.

## Features

Card and sealed pages with a price row per store (cheapest in-stock first,
affiliate buy links through `/go`, each click a Vercel `buy_click` event),
price history charts, set price guides, movers, a pre-order tracker, guides
with live price tables, and free tools: Deal Finder, Rising Cards, Demand
Finder, Best Basket, a trade calculator and a selling-fee calculator. Dark theme by default with
a light toggle, and a Halloween theme that switches itself off at the
visitor's midnight on 31 October.

## Run locally

```
npm install
cp .env.example .env
npx tsx scripts/import-all.ts   # fetch data (EBAY_REFRESH=false to skip eBay)
npm run dev
```

Checks: `npm run typecheck`, `npm run lint`, `npm test`.

## Going live

See `docs/SETUP.md` (and the Claude in Chrome prompt in `docs/CHROME-SETUP-PROMPT.md`).
