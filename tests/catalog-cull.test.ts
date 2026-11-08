// The low-traction cull (owner, 2026-11-07): cheap cards leave the catalogue unless people find them
// through search, and a culled card's URL 301s to its set.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { applyCatalogFloor } from "@/lib/import/tcgcsv";
import { demandSlugs } from "@/lib/import/demand";
import type { Product, SetInfo } from "@/lib/site-types";

const now = new Date("2026-11-07T00:00:00Z");
const sets = [
  { id: 1, name: "Old", code: "1", slug: "old", releasedOn: "2024-01-01", productCount: 0 },
  { id: 2, name: "New", code: "2", slug: "new", releasedOn: "2026-10-20", productCount: 0 },
] as SetInfo[];
const card = (id: number, slug: string, setId: number, kind: "card" | "sealed" = "card") => ({ id, slug, setId, kind, name: slug }) as Product;

test("cheap cards go, unless sealed, new, or found through search", () => {
  const products = [card(1, "cheap", 1), card(2, "chase", 1), card(3, "cheap-new", 2), card(4, "cheap-searched", 1), card(5, "box", 1, "sealed")];
  const tcg = { 1: { Normal: { market: 25, low: 10, mid: 30 } }, 2: { Normal: { market: 4500, low: 4000, mid: 4800 } }, 3: { Normal: { market: 20, low: 10, mid: 20 } }, 4: { Normal: { market: 30, low: 10, mid: 30 } } };
  const kept = applyCatalogFloor(products, sets, tcg as never, 100, now, new Set(["cheap-searched"]));
  assert.deepEqual(kept.map((p) => p.slug), ["chase", "cheap-new", "cheap-searched", "box"]);
});

test("demand is a click or ten impressions on the card page itself", () => {
  const s = demandSlugs({ "/card/a": [1, 2, 9], "/card/b": [0, 10, 20], "/card/c": [0, 9, 5], "/sets/old": [5, 100, 3], "/card/d/opengraph-image": [1, 1, 1] });
  assert.deepEqual([...s].sort(), ["a", "b"]);
});

test("a culled card's page 301s to its set, and the file ships with the site", () => {
  const page = fs.readFileSync("src/app/card/[slug]/page.tsx", "utf8");
  assert.match(page, /culledSetSlug\(params\.slug\)/);
  assert.match(page, /permanentRedirect\(`\/sets\/\$\{set\}`\)/);
  assert.match(fs.readFileSync("scripts/import-all.ts", "utf8"), /"culled\.json"/);
  assert.match(fs.readFileSync("next.config.js", "utf8"), /\.\/data\/public\/\*\*\/\*/);
});

// The store focus (SITE.catalogFocus; BandaiCompare, owner 2026-11-08).
import { focusCatalog, storesInOneMarket } from "@/lib/import/focus";
import type { Offer } from "@/lib/site-types";

const offer = (source: string, market: "US" | "UK", inStock = true) => ({ source, market, currency: "USD", cents: 100, inStock, url: "", title: "" }) as Offer;
const rule = { minStores: 2, keepListedCents: 2000, keepCents: 5000 };

test("stores count per market, never TCGplayer, eBay or Amazon", () => {
  const o = [offer("a", "US"), offer("b", "UK"), offer("ebay", "US"), offer("tcgplayer", "US"), offer("c", "US", false)];
  assert.equal(storesInOneMarket(o, true), 1);
  assert.equal(storesInOneMarket(o, false), 2);
  assert.equal(storesInOneMarket([], true), 0);
});

test("the focus keeps what stores sell, the chase cards, new sealed and search demand", () => {
  const sealed = (id: number, slug: string, setId: number, sealedType: string) => ({ ...card(id, slug, setId, "sealed"), sealedType }) as Product;
  const products = [
    card(1, "two-stores", 1), card(2, "two-markets", 1), card(3, "twenty-listed", 1), card(4, "twenty-unlisted", 1),
    card(5, "fifty", 1), card(6, "searched", 1), card(7, "new-bulk", 2),
    sealed(8, "old-pack", 1, "Booster Pack"), sealed(9, "old-pack-stocked", 1, "Booster Pack"), sealed(10, "new-pack", 2, "Booster Pack"),
    sealed(11, "old-box", 1, "Booster Box"), sealed(12, "sleeves", 2, "Insert"),
  ];
  const offers = new Map<number, Offer[]>([
    [1, [offer("a", "US"), offer("b", "US")]],
    [2, [offer("a", "US"), offer("b", "UK")]],
    [3, [offer("a", "US", false)]],
    [9, [offer("a", "UK")]],
    [12, [offer("a", "US")]],
  ]);
  const t = (c: number) => ({ Normal: { market: c, low: c, mid: c } });
  const tcg = { 2: t(1500), 3: t(2500), 4: t(2500), 5: t(6000), 7: t(10), 11: t(9000) };
  const kept = focusCatalog({ products, sets, offers, tcg: tcg as never, rule, now, demand: new Set(["searched"]) });
  assert.deepEqual(kept.map((p) => p.slug), ["two-stores", "twenty-listed", "fifty", "searched", "old-pack-stocked", "new-pack", "old-box"]);
});

test("yesterday's kept product stays while two stores in one market still list it", () => {
  const products = [card(1, "flicker", 1), card(2, "gone", 1)];
  const offers = new Map<number, Offer[]>([
    [1, [offer("a", "US", false), offer("b", "US")]],
    [2, [offer("a", "US", false)]],
  ]);
  assert.deepEqual(focusCatalog({ products, sets, offers, tcg: {}, rule, now }).map((p) => p.slug), []);
  assert.deepEqual(focusCatalog({ products, sets, offers, tcg: {}, rule, now, previous: new Set([1, 2]) }).map((p) => p.slug), ["flicker"]);
});

test("a released set the cull emptied 301s to its game; the import runs the focus before eBay", () => {
  const page = fs.readFileSync("src/app/sets/[slug]/page.tsx", "utf8");
  assert.match(page, /productCount === 0 && !s\.upcoming/);
  const imp = fs.readFileSync("scripts/import-all.ts", "utf8");
  assert.ok(imp.indexOf("focusCatalog(") > 0 && imp.indexOf("focusCatalog(") < imp.indexOf("planEbayRefresh({"));
});
