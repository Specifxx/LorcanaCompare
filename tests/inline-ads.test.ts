import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { ebayTilesFor, MAX_TILES } from "../src/lib/ad-pick";
import { BLOCK_H, PIC_W } from "../src/components/InlineAds";
import type { AdTile, CardAds } from "../src/lib/card-ads";

// The in-page ad block (owner, 2026-11-13; DECISIONS.md "the side rails are off" and "native horizontal ads"): one per page,
// eBay then TCGplayer, "Ad", sponsored links under their own placements, browser-only with its height reserved.
const read = (f: string) => fs.readFileSync(f, "utf8");
const t = (id: number, currency = "USD"): AdTile => ({ id, slug: `p${id}`, name: `P${id}`, image: null, cents: 100 * id, currency, url: `https://www.ebay.com/itm/${id}`, ref: null });

test("a market's own eBay tiles when it has enough, else eBay US, never more than ten", () => {
  const many = Array.from({ length: 14 }, (_, i) => t(i + 1));
  const ads: CardAds = { ebay: { US: many, UK: [t(1, "GBP"), t(2, "GBP")], AU: many.map((x) => ({ ...x, currency: "AUD" })) }, tcgplayer: [] };
  assert.equal(ebayTilesFor(ads, "AU").market, "AU");
  assert.equal(ebayTilesFor(ads, "AU").tiles.length, MAX_TILES);
  assert.equal(ebayTilesFor(ads, "UK").market, "US");
});

test("the block: client-only, height reserved, tiles 140-170px, labelled Ad, eBay first then TCGplayer, sponsored, never Amazon", () => {
  const s = read("src/components/InlineAds.tsx");
  assert.match(s, /^"use client";/);
  assert.ok(PIC_W >= 140 && PIC_W <= 170);
  assert.ok(BLOCK_H >= 300);
  assert.match(s, /style=\{\{ height: BLOCK_H \}\}/, "the empty box already has the block's height (CLS 0)");
  assert.match(s, /fetch\("\/api\/rails"\)/);
  assert.match(s, />Ad<\/span>/);
  assert.ok(s.indexOf("showEbay && (") < s.indexOf("showTcg && ("), "eBay first");
  assert.match(s, /-inline-ebay`/);
  assert.match(s, /-inline-tcg`/);
  assert.match(s, /rel="sponsored nofollow noopener"/);
  assert.doesNotMatch(s, /amazon/i);
  assert.doesNotMatch(s, /fixed|sticky|z-\d+/, "nothing floats");
  assert.doesNotMatch(s, /bestPrice|cheapest/i, "never a best price or a deal");
});

test("one block per page, in the page's content and never in the layout or the quick view", () => {
  const withBlock = ["src/app/page.tsx", "src/app/card/[slug]/page.tsx", "src/app/sets/[slug]/page.tsx", "src/app/cards/page.tsx", "src/app/sealed/page.tsx", "src/app/sealed/[type]/page.tsx"];
  for (const f of withBlock) assert.equal((read(f).match(/<InlineAds /g) ?? []).length, 1, f);
  for (const f of ["src/app/layout.tsx", "src/components/QuickView.tsx", "src/app/api/quick/[slug]/route.ts", "src/components/PriceTable.tsx", "src/components/CardBuy.tsx"]) assert.doesNotMatch(read(f), /InlineAds|CompactCardAds|card-ads/, f);
  assert.equal(fs.existsSync("src/components/CardAds.tsx"), false, "the old strips are replaced, not duplicated");
  const card = read("src/app/card/[slug]/page.tsx");
  assert.ok(card.indexOf("<PriceTable") < card.indexOf("<InlineAds"), "below the price table");
  const home = read("src/app/page.tsx");
  assert.ok(home.indexOf("<InlineAds") > home.indexOf("<GameTiles") && home.indexOf("<InlineAds") > home.indexOf("chase cards"), "not in the hero or above the first list");
});

test("no rail is left: no fixed column, no CSS for one, the dock stays", () => {
  assert.equal(fs.existsSync("src/components/SideAds.tsx"), false);
  assert.doesNotMatch(read("src/app/globals.css"), /side-rail|calc\(100% - 320px\)/);
  assert.match(read("src/app/layout.tsx"), /<PhoneDockAds \/>/);
  assert.match(read("src/components/PhoneDock.tsx"), /"dock-ebay"\)[\s\S]*"dock-tcg"\)/);
  assert.match(read("src/app/api/rails/route.ts"), /s-maxage=21600/);
});
