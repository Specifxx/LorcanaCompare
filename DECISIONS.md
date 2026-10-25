# Decisions

Newest at the bottom. Each entry: what was decided, why, and what it replaced.

## Launch architecture: the Rift Compare playbook, rebuilt lean — 2026-10-25

**Owner:** "I want now expand to Lorcana Compare and Gundam Compare … design the
website in the exact same way as Rift Compare and OP Compare … minimize costs
in Vercel, the optimizations that Rift Compare has."

**Not a fork.** Rift Compare's repo is ~1,000 source files, most of them
Riftbound-specific (Radiance, legends, runes, its arcade). Forking would carry
all of that and its Neon history. Instead one engine was written for both new
sites, keeping Rift's decisions rather than its code:

* **Public data in files, not Neon** (Rift's `PUBLIC_DATA_MODE=files`, here the
  only mode). The daily import writes `data/public/*.json` and per-set history
  files; pages read them. Neon carries accounts, alerts and clicks only.
* **One build a day.** Rift's `[deploy]` subject gate, unchanged. The daily data
  commit is the release; `production-deploy.yml` is the fallback/manual button.
* **Nothing prerendered at build, revalidate ≥ 6 hours** (Rift, DECISIONS
  2026-09-11 and 2026-10-14).
* **Halloween theme** from Rift's `lib/season.ts`: visitor-local window
  16–31 October, stamped before paint, so ISR caching cannot keep it on into
  November.
* **Affiliate accounts shared with Rift:** the same eBay Partner Network
  campaign and TCGplayer Impact link, with a per-site `customid`/`subId`.

## eBay: 2,500 calls a day, nothing under $20, value × demand × staleness — 2026-10-25

**Owner:** "you have a 2,500 quota for each of the websites because we're
splitting the quota … don't use it for anything that's under $20 … think about
a good strategy depending on the demand and the popularity."

Both sites use one eBay app (5,000/day). Each site counts its own calls and
stops at 2,500, and also never spends below the app's live remaining count
minus a reserve of 100. The sites run at different hours (Lorcana 06 UTC,
Gundam 18 UTC) so each eBay day (it resets at midnight Pacific) holds one run of
each.

Eligible: TCGplayer reference price ≥ $20. Refresh interval by value ($100+
daily, $50–100 every 2 days, $20–50 every 4), shortened by demand (affiliate
clicks in 30 days: 3+ → 2 days, 10+ → daily) and halved for chase rarities,
booster boxes/cases and sets released in the last 45 days or upcoming. Due
products are ranked by log(price) × (1 + log2(1 + clicks)) × boosts × how
overdue, and the budget is spent from the top: 75% on eBay US, 12.5% each on
eBay UK and AU for the top of the ranking. An eBay result is shown for up to
five days. The homepage "eBay Picks" banner reuses these results (no extra
calls).

## Store matching: number and name, or nothing — 2026-10-25

Rift Compare's lesson: a wrong match puts a common's price and a buy button on
a chase card's page. Cards match on number + ≥60% of the name, variant markers
must agree (Enchanted, LR+, a generic "parallel" ↔ the product's "+" rarity);
titles without a number match only by exact name inside a set the product type
or tags name; ties are no match; non-English product never matches; a price
under ¼ or over 4× TCGplayer's is dropped. On the first runs (2026-10-24) the
price-outlier audit flagged ~4% of priced Gundam offers, and the samples
checked were genuine market spread rather than wrong cards.

## Admin is hard-coded — 2026-10-25

**Owner:** "just make bill.jyang101@gmail.com the admin. I just hard code that
in." `SITE.adminEmails`; `ADMIN_EMAILS` (env) can add more, never remove.

## eBay keys are secrets, not source — 2026-10-25

The owner offered to have the eBay keys hard-coded. The App ID is harmless, but
the Cert ID is the app's client secret and this repo's `data/` is published, so
both go into GitHub Actions secrets (`EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`)
via the setup prompt instead. On 2026-10-25 the pair returned
`invalid_client` from eBay's token endpoint: a new production keyset stays
disabled until the Marketplace Account Deletion notification is configured or
an exemption is filed (docs/SETUP.md, step 4).

## Store coverage: every Rift Compare store, plus the sister sites' — 2026-10-25

**Owner:** "we want to have as many sources as possible … Take a look at how
many stores RiftCompare has. If we can get like 80% of that, or more … aim for
at least 200 stores."

Rift Compare tracks 221 Shopify stores. Every one, plus the 321 other stores in
OP Compare's and MTG Compare's lists and an agent search of US/UK stores, was
probed: `/collections.json` for a Lorcana / Gundam Card Game collection (no
Gunpla, Gundam Assemble or Japanese-only collections), then that collection's
`products.json` checked for real product. Collections that came back empty, and
duplicate hostnames of one shop, were dropped after the first full import.
Result: Lorcana 318 stores, Gundam 189 (80% of Rift is 177). On the 2026-10-25
run Lorcana had 379,097 prices; a $20+ card is listed at a median of 56 stores
(6 in stock), and Gundam at 27 (5 in stock). Expensive singles sell out, so
tiles show both "N stores · M in stock", and out-of-stock rows stay in the price
table (dimmed) with their last price.

Stores are fetched 8 at a time (each still one page at a time) so ~300 stores
fit the workflow's timeout. Prices are stored as compact tuples, one file per
set (`data/public/prices/`), plus `summary.json` for list pages: the single
`prices.json` had reached 95 MB.

Currency is now proved per store: four Canadian stores had been labelled US by
the probe (their CAD prices would have shown as US$) and one New Zealand store
as Australian. They were corrected or removed, and the daily import now reads
each store's `/cart.js` currency first and refuses a store whose currency is not
its market's, the ops monitor reporting it.

The same day the cause of a worse bug was found: without `?country=` Shopify
Markets answers in the visitor's currency, and the runners are in the US, so
every non-US store's prices had come back converted to USD (Gameology's A$179.95
box as 135.00) and been labelled local. Every store request now sends the
store's own country (`countryOf`, eurozone → ES as on Rift Compare).

Not yet covered: big non-Shopify US stores (CoolStuffInc, Star City Games,
Troll and Toad, GameNerdz). Each needs its own scraper, and several sit behind
Cloudflare challenges.

## Domains are .com; eBay account deletion is a real endpoint — 2026-10-25

**Owner:** "Lorcanacompare.com and Gundam compare.com are both domains that I
just now bought in Vercel." `SITE.domain` and every link moved from the
planned `.app` names. The sister-site links point at the .com domains; Rift
Compare's own footer was not touched (owner: don't edit Rift Compare).

eBay disables a production keyset until the app handles Marketplace Account
Deletion notifications. Rather than file the exemption, both sites serve
`/api/ebay/account-deletion`: GET answers eBay's challenge with
sha256(challenge_code + EBAY_VERIFICATION_TOKEN + endpoint URL), POST
acknowledges a notice with 200. No eBay user data is stored, so there is
nothing to delete. The shared app registers the Lorcana site's endpoint only.

## Buy clicks are Vercel Analytics events too — 2026-10-25

**Owner:** "enable Vercel web analytics and also … by-click events … the
retailer that it's coming from for each website."

Every buy link already goes through `/go` (which tags the affiliate URL and
writes a `ClickEvent` row for /admin). `BuyClickTracker` (in the root layout)
listens for clicks and middle-clicks on any `/go?` link and sends the Vercel
event `buy_click` with retailer (display name), retailer_key, market,
product, page and destination host. One listener means a new buy button
anywhere is tracked without extra code. Custom events need Vercel Pro; the
`ClickEvent` log works on any plan. Amazon links use Rift Compare's tag
`riftcompare-20` until each site has its own `AMAZON_ASSOCIATE_TAG`.
`tests/affiliate.test.ts` pins the EPN, Impact and Amazon tagging.

## Neon only where it is essential — 2026-10-25

**Owner:** "most of the data, like any sort of public data, is now stored [in
files] … we really aren't using Neon at all for a lot of things, it's only for
… private data that it must have. Make sure there's not much dependency on Neon."

This site was built that way from the start (public data is only files), and
two remaining touchpoints were tightened:

* `/api/me` (called on every page view by a signed-in visitor) reads a signed
  snapshot of the account (email, tier, admin) from the session cookie, and
  goes to Neon at most once a day per visitor to refresh it. Signed-out
  visitors never cause a query.
* `/go` gives its click-log insert 800 ms at most. A slow or missing database
  costs a log row, never a buy click (Vercel's `buy_click` event still records it).

Neon is used for exactly: accounts and sessions refresh, price alerts and
their daily email run, the affiliate click log (admin dashboard and the eBay
demand signal), contact/newsletter rows and Stripe webhook idempotency. Built
and served with `DATABASE_URL` unset on 2026-10-25, every public page, search,
the sitemap and the affiliate redirect still worked. `tests/no-db-on-public-pages.test.ts`
fails if a public page or component imports the database or session reader.
