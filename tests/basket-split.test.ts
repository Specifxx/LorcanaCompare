// Best Basket's shipping-aware split (owner, 2026-11-25; lib/basket-split.ts, lib/borrowed-shipping.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { planBasket, type BasketCard } from "../src/lib/basket-optimize";
import { measuredPostage, splitListings, splitStores } from "../src/lib/basket-split";
import { borrow, validBorrowed, type BorrowedShipping } from "../src/lib/borrowed-shipping";
import type { PostageQuote } from "../src/lib/postage";
import type { Offer } from "../src/lib/site-types";

const NOW = Date.parse("2026-11-25T12:00:00Z");
const hoursAgo = (h: number) => new Date(NOW - h * 3_600_000).toISOString();
const offer = (o: Partial<Offer>): Offer => ({ source: "a", market: "US", currency: "USD", cents: 500, inStock: true, url: "https://a.com/products/card", title: "A card", ...o });

test("the split uses this market's in-stock store rows read in 48 hours, never a marketplace, a pre-order or an unread store", () => {
  const read = { a: { at: hoursAgo(2) }, b: { at: hoursAgo(49) }, c: { at: hoursAgo(1) }, d: { at: hoursAgo(47) } };
  const rows = splitListings(
    [
      offer({ source: "a", cents: 500 }),
      offer({ source: "a", cents: 400, inStock: false }),
      offer({ source: "b", cents: 300 }),
      offer({ source: "c", cents: 200, title: "A card (Pre-Order)" }),
      offer({ source: "c", cents: 250, preorder: true }),
      offer({ source: "tcgplayer", cents: 100 }),
      offer({ source: "d", cents: 600 }),
      offer({ source: "d", cents: 50, market: "UK", currency: "GBP" }),
      offer({ source: "zz", cents: 90 }),
    ],
    "US",
    read,
    NOW,
  );
  assert.deepEqual(
    rows.map((r) => [r.retailer, r.priceCents]),
    [
      ["a", 500],
      ["d", 600],
    ],
  );
});

test("shipping is borrowed only from the same shop (host) in the same market", () => {
  const pts = (c: number) => [{ subtotalCents: 1000, rates: { ny: c } }];
  const out = borrow(
    [
      { key: "ours-a", base: "https://www.shop-a.com", market: "US" },
      { key: "ours-c", base: "https://shop-c.com", market: "CA" },
    ],
    [{ from: "dexcompare", stores: [{ key: "x", base: "https://shop-a.com", market: "US" }, { key: "y", base: "https://shop-c.com", market: "US" }], snapshot: { stores: { x: { market: "US", currency: "USD", measuredAt: "2026-11-20", points: pts(500) }, y: { market: "US", currency: "USD", measuredAt: "2026-11-20", points: pts(500) } } } }],
    (m) => ({ US: "USD", CA: "CAD" })[m] ?? null,
    new Date(NOW),
  );
  assert.deepEqual(Object.keys(out.stores), ["ours-a"]);
});

test("measured postage: the dearest address, free over the measured threshold, 'up to' with more than one item", () => {
  const snap: BorrowedShipping = validBorrowed({
    version: 1,
    generatedAt: hoursAgo(1),
    addresses: { US: [{ id: "ny", label: "New York" }, { id: "sf", label: "San Francisco" }] },
    stores: { a: { market: "US", currency: "USD", measuredAt: "2026-11-20T00:00:00Z", points: [{ subtotalCents: 1000, rates: { ny: 500, sf: 800 } }, { subtotalCents: 10000, rates: { ny: 0, sf: 0 } }] } },
  });
  const post = measuredPostage("a", "US", snap)!;
  assert.equal(post({ subtotalCents: 5000, items: 1 }).cents, 800);
  assert.equal(post({ subtotalCents: 5000, items: 1 }).freeFromCents, 10000);
  assert.equal(post({ subtotalCents: 3000, items: 2 }).beyondMeasured, true);
  assert.equal(post({ subtotalCents: 12000, items: 2 }).free, true);
  assert.equal(post({ subtotalCents: 500, items: 1 }).basis, "estimate");
  assert.equal(measuredPostage("a", "UK", snap), null);
});

test("an unmeasured store is left out with its reason, never priced at zero shipping", () => {
  const cards: BasketCard[] = [{ cardId: "1", name: "Card", slug: "card", qty: 1, listings: [{ retailer: "cheap", priceCents: 100, url: "u" }, { retailer: "a", priceCents: 200, url: "u" }] }];
  const flat = (): PostageQuote => ({ cents: 500, label: "", tracked: null, basis: "measured", free: false, upTo: false });
  const { plan } = planBasket(cards, splitStores(cards, "US", (k) => (k === "a" ? flat : null)));
  assert.equal(plan.totalCents, 700);
  assert.deepEqual(plan.excludedStores.map((x) => x.key), ["cheap"]);
});

test("the store-by-store plan goes only to a Premium member, in the response", () => {
  const route = readFileSync("src/app/api/basket/route.ts", "utf8");
  assert.match(route, /premium \? \{ premium: true, summary: s\.summary, plan: s\.plan, alternatives: s\.alternatives \} : \{ premium: false, summary: s\.summary \}/);
  assert.match(route, /"Cache-Control": "no-store"/);
  assert.match(readFileSync("src/lib/basket-split.ts", "utf8"), /goHref\(\{ url, source: key, market, inStock: true \}, undefined, "best-basket"\)/);
});
