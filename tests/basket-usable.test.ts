import { test } from "node:test";
import assert from "node:assert/strict";
import { basketUsable, BASKET_MAX_AGE_H } from "../src/lib/tools";
import type { Offer } from "../src/lib/site-types";

// Best Basket never plans on a sold-out, pre-order or stale store row
// (2026-11-25, ported from Rift Compare's member report).
const NOW = Date.parse("2026-11-25T12:00:00Z");
const ago = (h: number) => new Date(NOW - h * 3_600_000).toISOString();
const o = (over: Partial<Offer> = {}): Offer => ({ source: "shop", market: "US", currency: "USD", cents: 500, inStock: true, url: "https://x", title: "t", ...over });

test("in stock, from a store read inside the window: usable", () => {
  assert.equal(basketUsable(o(), { shop: { at: ago(20) } }, NOW), true);
});

test("sold out or pre-order: never", () => {
  assert.equal(basketUsable(o({ inStock: false }), { shop: { at: ago(1) } }, NOW), false);
  assert.equal(basketUsable(o({ preorder: true }), { shop: { at: ago(1) } }, NOW), false);
});

test("a store whose last good read is older than the window is left out", () => {
  assert.equal(basketUsable(o(), { shop: { at: ago(BASKET_MAX_AGE_H + 1) } }, NOW), false);
});

test("eBay and TCGplayer rows are their own passes, not store reads", () => {
  assert.equal(basketUsable(o({ source: "ebay" }), {}, NOW), true);
  assert.equal(basketUsable(o({ source: "tcgplayer" }), {}, NOW), true);
});
