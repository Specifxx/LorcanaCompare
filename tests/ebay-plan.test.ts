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
