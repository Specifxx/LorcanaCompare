import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { ebayTilesFor, MAX_TILES } from "../src/lib/ad-pick";
import { BANNER_H } from "../src/components/InlineAds";
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

test("two banners, eBay and TCGplayer apart: client-only, height reserved, labelled Ad, sponsored, never Amazon, never best", () => {
  const s = read("src/components/InlineAds.tsx");
  assert.match(s, /^"use client";/);
  assert.ok(BANNER_H >= 240);
  assert.match(s, /style=\{\{ height: BANNER_H \}\}/, "the empty boxes already have the banners' height (CLS 0)");
  assert.match(s, /fetch\("\/api\/rails"\)/);
  assert.match(s, />Ad<\/span>/);
  assert.ok(s.indexOf('brand="eBay"') < s.indexOf('brand="TCGplayer"'), "eBay first");
  for (const tag of ["banner-ebay", "banner-tcg", "banner-ebay-all", "banner-tcg-all"]) assert.match(s, new RegExp("-" + tag + "`"), tag);
  assert.match(s, /rel="sponsored nofollow noopener"/);
  assert.doesNotMatch(s, /amazon/i);
  assert.doesNotMatch(s, /fixed|sticky|z-\d+/, "nothing floats");
  assert.doesNotMatch(s, /bestPrice|cheapest|best price/i, "never a best price or a deal");
});

test("one block per page, in the page's content and never in the layout or the quick view", () => {
  const withBlock = ["src/app/page.tsx", "src/app/card/[slug]/page.tsx", "src/app/sets/[slug]/page.tsx", "src/app/cards/page.tsx", "src/app/sealed/page.tsx", "src/app/sealed/[type]/page.tsx"];
  for (const f of withBlock) assert.equal((read(f).match(/<InlineAds /g) ?? []).length, 1, f);
  for (const f of ["src/app/layout.tsx", "src/components/PriceTable.tsx", "src/components/CardBuy.tsx"]) assert.doesNotMatch(read(f), /InlineAds|CompactCardAds|card-ads/, f);
  // The quick view carries its own small ad pair (owner, 2026-11-18: "ads can show in the quick view"), never the page's block.
  assert.doesNotMatch(read("src/components/QuickView.tsx"), /InlineAds|CompactCardAds/);
  assert.match(read("src/components/QuickView.tsx"), /<QuickAds /);
  assert.doesNotMatch(read("src/components/QuickAds.tsx"), /ads\.amazon|source: "amazon"/, "never Amazon in the quick view");
  assert.equal(fs.existsSync("src/components/CardAds.tsx"), false, "the old strips are replaced, not duplicated");
  const card = read("src/app/card/[slug]/page.tsx");
  assert.ok(card.indexOf("<InlineAds") > card.indexOf("<PriceTable"), "below the price table (2026-11-19, core-update quality pass)");
  const home = read("src/app/page.tsx");
  // Mid-page since 2026-11-25 (owner: the ads sat at the very foot of the page): after the products and deals, before the questions.
  assert.ok(home.indexOf("<InlineAds") > home.indexOf("Today's top deals"), "after the products and deals, never under the hero");
  assert.ok(home.indexOf("<InlineAds") < home.indexOf("Frequently asked questions"), "before the questions");
});

test("the gutter column (owner, 2026-11-25): right of the page only, wide windows only, never in the server HTML", async () => {
  const { GUTTER_MIN, pastBanner } = await import("../src/components/GutterAds");
  assert.equal(GUTTER_MIN, 1800);
  assert.deepEqual(pastBanner([1, 2, 3, 4, 5, 6, 7, 8, 9]), [5, 6, 7, 8, 9], "after the banner's four");
  assert.deepEqual(pastBanner([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  const g = read("src/components/GutterAds.tsx");
  assert.match(g, /matchMedia\(`\(min-width: \$\{GUTTER_MIN\}px\)`\)/);
  assert.match(g, /data-ad /);
  assert.match(g, /"gutter-tcg"/);
  assert.doesNotMatch(g, /source: "(ebay|amazon)"/, "TCGplayer only");
  const css = read("src/app/globals.css");
  assert.match(css, /\.gutter-ads \{[^}]*left: calc\(100% - 2px\)/, "just past the page's right edge, never over it");
  assert.match(read("src/app/layout.tsx"), /<main className="relative [^"]*">[\s\S]*<AdRouteGate><GutterAds \/><\/AdRouteGate>\s*<\/main>/);
});

test("no old rail is left: no fixed column, no CSS for one, the dock stays", () => {
  assert.equal(fs.existsSync("src/components/SideAds.tsx"), false);
  assert.doesNotMatch(read("src/app/globals.css"), /side-rail|calc\(100% - 320px\)/);
  assert.match(read("src/app/layout.tsx"), /<PhoneDockAds \/>/);
  assert.match(read("src/components/PhoneDock.tsx"), /"dock-ebay"\)[\s\S]*"dock-tcg"\)/);
  assert.match(read("src/app/api/rails/route.ts"), /s-maxage=21600/);
});
