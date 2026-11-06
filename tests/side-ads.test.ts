import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { ebayTilesFor, MAX_TILES, MIN_WIDTH, RAIL_W, railFits, TILE_H } from "../src/components/SideAds";
import type { AdTile, CardAds } from "../src/lib/card-ads";

// The side rails (owner, 2026-11-06; DECISIONS.md "Side rails"): browser-only, from 1280px, ten tiles that scroll.
const t = (id: number, currency = "USD"): AdTile => ({ id, slug: `p${id}`, name: `P${id}`, image: null, cents: 100 * id, currency, url: `https://www.ebay.com/itm/${id}`, ref: null });

test("the rails start at every regular 16:9 and 16:10 width, and the CSS says the same", () => {
  assert.equal(MIN_WIDTH, 1280);
  const css = fs.readFileSync("src/app/globals.css", "utf8");
  assert.match(css, /@media \(min-width: 1280px\) \{\s*\.max-w-7xl \{ max-width: min\(80rem, calc\(100% - 320px\)\); \}/);
  // 320px = two rails and their gutters (RAIL_W + 2 × 12 each side).
  assert.equal(2 * (RAIL_W + 24), 320);
});

test("a window too short for one whole tile shows no rail", () => {
  assert.equal(railFits(1080), true);
  assert.equal(railFits(720), true);
  assert.equal(railFits(55 + 24 + 30 + 34 + 16 + TILE_H - 1), false);
});

test("a market's own eBay tiles when it has enough, else eBay US, never more than ten", () => {
  const many = Array.from({ length: 14 }, (_, i) => t(i + 1));
  const ads: CardAds = { ebay: { US: many, UK: [t(1, "GBP"), t(2, "GBP")], AU: many.map((x) => ({ ...x, currency: "AUD" })) }, tcgplayer: [] };
  assert.deepEqual(ebayTilesFor(ads, "AU").market, "AU");
  assert.equal(ebayTilesFor(ads, "AU").tiles.length, MAX_TILES);
  assert.deepEqual(ebayTilesFor(ads, "UK").market, "US");
  assert.deepEqual(ebayTilesFor(ads, "SG").market, "US");
});

test("nothing of the rails is in the server HTML: the layout mounts a client component that waits for the window", () => {
  const src = fs.readFileSync("src/components/SideAds.tsx", "utf8");
  assert.match(src, /^"use client";/);
  assert.match(src, /if \(!fit \|\| !data\) return null;/);
  assert.match(src, /fetch\("\/api\/rails"\)/);
  assert.match(fs.readFileSync("src/app/layout.tsx", "utf8"), /<SideAds \/>/);
  // The tiles' route is cached by the CDN like every other function response.
  assert.match(fs.readFileSync("src/app/api/rails/route.ts", "utf8"), /s-maxage=21600/);
});
