import { test } from "node:test";
import assert from "node:assert/strict";
import type { Product, SetInfo } from "@/lib/site-types";
import { buildIndex, matchCard, matchSealed, markersAgree, printingOf } from "@/lib/import/match";

const set = (id: number, name: string): SetInfo => ({ id, name, code: String(id), slug: name, releasedOn: "2026-01-01", productCount: 1, upcoming: false });
const card = (id: number, name: string, number: string, setId: number, rarity = "Rare"): Product => ({ id, slug: String(id), name, kind: "card", setId, number, rarity, attrs: {}, sealedType: null, image: null, tcgUrl: "", printings: [] });
const sealed = (id: number, name: string, setId: number): Product => ({ ...card(id, name, "", setId), kind: "sealed", number: null, sealedType: "x" });

const sets = [set(1, "The First Chapter"), set(2, "Hyperia City"), set(3, "Attack of the Vine!")];
const products = [
  card(10, "Elsa - Spirit of Winter", "42/204", 1, "Legendary"),
  card(11, "Elsa - Spirit of Winter (Enchanted)", "207/204", 1, "Enchanted"),
  card(12, "Fru Fru - VIP Guest", "1/204", 2, "Common"),
  card(13, "4*Town - Hottest Band of the Year", "17/204", 3),
  sealed(20, "Disney Lorcana: Hyperia City Booster Box", 2),
  sealed(21, "Disney Lorcana: Hyperia City Booster Box Case", 2),
  sealed(22, "Disney Lorcana: Into the Inkdark Collector Booster Display", 2),
];
const idx = buildIndex(products, sets, "fraction");

test("card by number and name", () => {
  assert.equal(matchCard("Elsa - Spirit of Winter (42/204) [The First Chapter]", idx)?.product.id, 10);
  assert.equal(matchCard("Elsa - Spirit of Winter - Enchanted - 207/204 - Holo Foil", idx)?.product.id, 11);
  assert.equal(matchCard("Shenzi - Hyena Pack Leader (85//204) [Into the Inklands]", idx), null);
});

test("never matches on number alone", () => {
  assert.equal(matchCard("Mickey Mouse - True Friend 42/204", idx), null);
});

test("bare number with the set in the product type", () => {
  assert.equal(matchCard("4*Town, Hottest Band of the Year (0017) - Cold Foil", idx, "Disney Lorcana Singles > Attack of the Vine!")?.product.id, 13);
  assert.equal(matchCard("4*Town, Hottest Band of the Year (0017)", idx, "Disney Lorcana Singles > Hyperia City"), null);
});

test("foreign-language product is never matched", () => {
  assert.equal(matchSealed("Lorcana - Hyperia City - Japanese Booster Box (16 Packs)", idx), null);
});

test("sealed: box vs case vs collector display", () => {
  assert.equal(matchSealed("Disney Lorcana: Hyperia City - Booster Box", idx)?.product.id, 20);
  assert.equal(matchSealed("Disney Lorcana: Hyperia City Booster Box Case (4 boxes)", idx)?.product.id, 21);
  assert.equal(matchSealed("Disney Lorcana - Into the Inkdark Booster Display - EN", idx), null);
});

test("variant markers", () => {
  assert.equal(markersAgree("Psycho Gundam (LR+)", "LR+", "Psycho Gundam GD02-012 Parallel"), true);
  assert.equal(markersAgree("Psycho Gundam", "Legend Rare", "Psycho Gundam GD02-012 Parallel"), false);
  assert.equal(markersAgree("Psycho Gundam (LR+)", "LR+", "Psycho Gundam GD02-012"), false);
  assert.equal(printingOf("Elsa - Cold Foil"), "Cold Foil");
  assert.equal(printingOf("Elsa", "Non-Foil"), "Normal");
});
