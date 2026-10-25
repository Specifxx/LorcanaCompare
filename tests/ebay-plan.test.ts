import { test } from "node:test";
import assert from "node:assert/strict";
import type { Product } from "@/lib/site-types";
import { intervalHours, planEbayRefresh } from "@/lib/import/ebay";

const p = (id: number, rarity = "Rare", kind: "card" | "sealed" = "card"): Product => ({ id, slug: String(id), name: `Card ${id}`, kind, setId: 1, number: `${id}/204`, rarity, attrs: {}, sealedType: kind === "sealed" ? "Booster Box" : null, image: null, tcgUrl: "", printings: [] });
const now = new Date("2026-10-24T06:00:00Z");

test("never spends a call under $20", () => {
  const products = [p(1), p(2), p(3)];
  const ref = new Map([[1, 1999], [2, 2000], [3, 50]]);
  const { calls, eligible } = planEbayRefresh({ products, refUsdCents: ref, clicks30d: new Map(), newSetIds: new Set(), state: {}, budget: 100, now });
  assert.equal(eligible, 1);
  assert.deepEqual([...new Set(calls.map((c) => c.product.id))], [2]);
});

test("stays inside the budget", () => {
  const products = Array.from({ length: 5000 }, (_, i) => p(i + 1));
  const ref = new Map(products.map((x) => [x.id, 2000 + x.id * 10]));
  const { calls } = planEbayRefresh({ products, refUsdCents: ref, clicks30d: new Map(), newSetIds: new Set(), state: {}, budget: 2500, now });
  assert.ok(calls.length <= 2500, `${calls.length} calls`);
  assert.ok(calls.length >= 2400);
});

test("expensive and in-demand first; fresh results are not re-checked", () => {
  const products = [p(1), p(2), p(3)];
  const ref = new Map([[1, 3000], [2, 50000], [3, 3000]]);
  const state = { 2: { US: { at: new Date(now.getTime() - 3_600_000).toISOString(), offer: null } } };
  const { calls } = planEbayRefresh({ products, refUsdCents: ref, clicks30d: new Map([[3, 40]]), newSetIds: new Set(), state, budget: 4, now });
  const us = calls.filter((c) => c.market === "US").map((c) => c.product.id);
  assert.equal(us[0], 3); // demand beats value when value is checked an hour ago
  assert.ok(!us.includes(2));
});

test("refresh intervals", () => {
  assert.equal(intervalHours(150, 0, false), 24);
  assert.equal(intervalHours(60, 0, false), 48);
  assert.equal(intervalHours(25, 0, false), 96);
  assert.equal(intervalHours(25, 12, false), 24);
});

test("eBay listings: graded, foreign and multi-card titles never match", async () => {
  const { listingMatches } = await import("@/lib/import/ebay");
  const { SITE } = await import("@/site.config");
  const num = SITE.numberStyle === "code" ? "GD05-102" : "230/204";
  const card: Product = { ...p(1), name: "Belle - Exceptional Writer (Enchanted)", number: num, rarity: "Enchanted" };
  assert.equal(listingMatches(card, `Belle Exceptional Writer Enchanted ${num} NM`), true);
  const song: Product = { ...p(2), name: "Let It Go", number: num, rarity: "Rare" };
  assert.equal(listingMatches(song, `Let It Go ${num} Holo`), true);
  for (const t of [
    `Belle - Exceptional Writer Enchanted ${num} etc Set of 3`,
    `Belle Exceptional Writer Enchanted ${num} Japan`,
    `Belle Exceptional Writer Enchanted ${num} JPN`,
    `Belle Exceptional Writer Enchanted ${num} JA 14`,
    `PSA10 Belle Exceptional Writer Enchanted ${num}`,
    `Belle Exceptional Writer Enchanted ${num} TAG 10 GEM MINT`,
    `Belle Exceptional Writer Enchanted ${num} P SA10`,
  ])
    assert.equal(listingMatches(card, t), false, t);
});

test("promo numbers: TCGplayer '14' matches a seller's '14/P3'", async () => {
  const { listingMatches } = await import("@/lib/import/ebay");
  const { SITE } = await import("@/site.config");
  if (SITE.numberStyle !== "fraction") return;
  const promo: Product = { ...p(3), name: "Goofy - Expert Shipwright (Disney Cruise Promo)", number: "14", rarity: "Promo" };
  assert.equal(listingMatches(promo, "Disney Lorcana Goofy - Expert Shipwright Cruise Promo Foil 14/P3 EN"), true);
  assert.equal(listingMatches(promo, "Goofy - Expert Shipwright 15/P3 Foil"), false);
});

test("bracketed qualifiers must match: a winner card never takes a participation card's listing", async () => {
  const { qualifiersAgree } = await import("@/lib/import/ebay");
  const { tokens } = await import("@/lib/slug");
  const t = (s: string) => new Set(tokens(s));
  assert.equal(qualifiersAgree("Gundam Maxter (Store Tournament Winner Pack 01)", t("Gundam Maxter UNIT Holo R GD05-069 Participation Card")), false);
  assert.equal(qualifiersAgree("Kshatriya (GD01-051) (Store Tournament Winner Pack 01)", t("Kshatriya (GD01-051) (Store Tournament Winner Pack 01)")), true);
  assert.equal(qualifiersAgree("EX Base (EXBP-031) (SDCC 2026)", t("Gundam Ace September 2026 Issue EXBP-031 EX Base")), false);
  assert.equal(qualifiersAgree("Goofy - Expert Shipwright (Disney Cruise Promo)", t("Goofy Expert Shipwright Cruise Promo Foil 14/P3")), true);
  assert.equal(qualifiersAgree("Gundam Exia (Trans-Am) (LR+)", t("Gundam Exia Trans AM GD03-049 LR+ Alt Art")), true);
  assert.equal(qualifiersAgree("Elsa - Spirit of Winter (Enchanted)", t("Elsa Spirit of Winter 207/204")), true);
  assert.equal(qualifiersAgree("Unicorn Gundam (Awakened) (Newtype Challenge 2026 Mission 4)", t("Unicorn Gundam Awakened GD04-066 NTC Winners Card")), true);
});
