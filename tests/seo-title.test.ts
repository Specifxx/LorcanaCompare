import { test } from "node:test";
import assert from "node:assert/strict";
import { SITE } from "@/site.config";
import { DESC_MAX, DESC_MIN, TITLE_MAX, cardDescriptionCandidates, cardTitleCandidates, firstThatFits, fitDescription, fitTitle, setTitleCandidates, hubTitleCandidates, hubDescriptionCandidates, setListIsComplete } from "@/lib/seo-title";

test("fitTitle keeps the brand when it fits and drops it before the words", () => {
  assert.equal(fitTitle(["Short"]).absolute, `Short | ${SITE.name}`);
  const long = "x".repeat(TITLE_MAX - 2);
  assert.equal(fitTitle([long]).absolute, long);
  assert.equal(fitTitle(["y".repeat(80), "z".repeat(10)]).absolute, `${"z".repeat(10)} | ${SITE.name}`);
  // A more specific candidate beats the brand.
  assert.equal(fitTitle([long, "short"]).absolute, long);
});

test("a card's number appears once", () => {
  assert.match(cardTitleCandidates("Jagd Doga (GD05-057)", "GD05-057", "Set", false)[0], /^Jagd Doga GD05-057 Price/);
});

test("every title fits in 60 characters when any candidate does", () => {
  const set = fitTitle(setTitleCandidates("A Very Long Expansion Name Indeed", 214)).absolute;
  assert.ok(set.length <= TITLE_MAX, set);
  assert.match(set, /Card List/);
  const card = fitTitle(cardTitleCandidates("Some Card", "AB01-001", "First Set", false)).absolute;
  assert.ok(card.length <= TITLE_MAX, card);
  assert.match(card, /^Some Card AB01-001 Price/);
});

test("a set page leads with the card list and its count", () => {
  assert.match(setTitleCandidates("First Set", 120)[0], /Card List: All 120 Cards \+ Prices$/);
  assert.ok(!setTitleCandidates("First Set", 0).some((t) => t.includes("All 0")));
});

// 2026-11-27 (page scorecard, Job D): "All 44 Cards" was untrue for a set the catalogue floor cut.
test("a set the catalogue floor cut says Top, never All", () => {
  const t = setTitleCandidates("Old Set", 44, false, false);
  assert.ok(!t.some((x) => x.includes("All 44")), t.join(" / "));
  assert.match(t[0], /Card List & Prices: Top 44 Cards$/);
});

test("a long Line: Name set keeps the game and the prices before dropping them", () => {
  const t = fitTitle(setTitleCandidates("Illumineer's Quest: The Great Hunny Rescue", 43)).absolute;
  assert.ok(t.length <= TITLE_MAX, t);
  assert.ok(t.startsWith(SITE.gameShort), t);
  assert.match(t, /The Great Hunny Rescue Card List & Prices/);
  // A full name that fits is kept.
  assert.match(fitTitle(setTitleCandidates("Quest: Deep Trouble", 6, false, false)).absolute, /Quest: Deep Trouble/);
});

test("a set list is complete without a floor, before release, or inside the 120-day window", () => {
  const now = Date.parse("2026-11-27");
  assert.equal(setListIsComplete({ upcoming: true }, now), true);
  if (!SITE.catalogMinCardCents) return;
  assert.equal(setListIsComplete({ releasedOn: "2026-10-23" }, now), true);
  assert.equal(setListIsComplete({ releasedOn: "2024-05-17" }, now), false);
  assert.equal(setListIsComplete({ releasedOn: null }, now), false);
});

test("llms.txt lists the main sections and every guide", async () => {
  const { GET } = await import("../src/app/llms.txt/route");
  const body = await GET().text();
  assert.match(body, new RegExp(`^# ${SITE.name}`));
  assert.match(body, /\/sets\)/);
  assert.match(body, /## Guides/);
});

test("an unreleased set with revealed cards is titled for the spoiler search, inside the limit", () => {
  const t = fitTitle(setTitleCandidates("First Set", 48, true)).absolute;
  assert.match(t, /Spoilers: 48 Cards Revealed/);
  assert.ok(t.length <= TITLE_MAX + 20);
  assert.match(setTitleCandidates("First Set", 0, true)[0], /Card List/);
});

// 2026-11-24 (page scorecard, Job D): titles carry TCGplayer's market price; snippets lead with the cheapest in-stock store price, US first.
test("a card's title leads with its price and still fits, dropping the number before the price", () => {
  const t = fitTitle(cardTitleCandidates("Mulan - Martial Arts Master (Enchanted)", "234/204", "Hyperia City", false, "$99.52")).absolute;
  assert.equal(t, "Mulan - Martial Arts Master (Enchanted) Price: $99.52");
  const short = fitTitle(cardTitleCandidates("Goofy - Dancing Superstar", "12", "Promo Cards", false, "$2.24")).absolute;
  assert.ok(short.startsWith("Goofy - Dancing Superstar 12 Price: $2.24"), short);
  assert.ok(short.length <= TITLE_MAX, short);
  assert.match(fitTitle(cardTitleCandidates("Some Card", "1/204", "Set", false)).absolute, /Price — /, "no price, the old title");
});

test("card description leads with the store price and TCGplayer's market, rarity said once, never eBay", () => {
  const d = fitDescription(
    firstThatFits(
      cardDescriptionCandidates({ name: "Mulan - Martial Arts Master (Enchanted)", number: "234/204", setName: "Hyperia City", rarity: "Enchanted", sealed: false, ref: "$99.52", lead: { price: "$99.55", market: "US", inStockStores: 2 }, stores: 53 }),
    ),
  );
  assert.ok(d.startsWith("Mulan - Martial Arts Master (Enchanted) 234/204 from $99.55 in the US, in stock at 2 stores; TCGplayer market $99.52."), d);
  assert.equal(d.match(/Enchanted/g)?.length, 1, d);
  assert.ok(d.length >= DESC_MIN && d.length <= DESC_MAX, d);
  assert.doesNotMatch(d, /eBay/);
});

test("card description names another market when only it has stock; without stock or price it says so", () => {
  const ca = firstThatFits(cardDescriptionCandidates({ name: "Ariel - Collector of Oddities (Enchanted)", number: "236/204", setName: "Hyperia City", rarity: "Enchanted", sealed: false, ref: "$335.78", lead: { price: "C$473.99", market: "CA", inStockStores: 3 }, stores: 43 }));
  assert.ok(ca.startsWith("Ariel - Collector of Oddities (Enchanted) 236/204 from C$473.99 in Canada, in stock at 3 stores;"), ca);
  const sold = fitDescription(firstThatFits(cardDescriptionCandidates({ name: "Fabled Booster Box Case", number: null, setName: "Fabled", rarity: null, sealed: true, ref: "$3,767", lead: null, stores: 1 })));
  assert.ok(sold.startsWith("Fabled Booster Box Case price: TCGplayer market $3,767. Sold out at the 1 store we track"), sold);
  const none = fitDescription(firstThatFits(cardDescriptionCandidates({ name: "New Card", number: "1/204", setName: null, rarity: null, sealed: false, ref: null, lead: null, stores: 0 })));
  assert.match(none, /no TCGplayer market price yet/);
  for (const s of [ca, sold, none]) assert.ok(s.length <= DESC_MAX, s);
});

test("an attribute hub's title gives the count and the top price; its description the range and the top card", () => {
  const t = fitTitle(hubTitleCandidates("Big Hero 6 Lorcana cards", 24, "$45.10")).absolute;
  assert.ok(t.startsWith("Big Hero 6 Lorcana cards: All 24 + Prices (Top $45.10)"), t);
  assert.ok(t.length <= TITLE_MAX, t);
  const long = fitTitle(hubTitleCandidates("Who Framed Roger Rabbit and Friends Lorcana cards", 312, "$1,204")).absolute;
  assert.ok(long.length <= TITLE_MAX || long === "Who Framed Roger Rabbit and Friends Lorcana cards", long);
  assert.match(fitTitle(hubTitleCandidates("Toy Story Lorcana cards", 30, null)).absolute, /^Toy Story Lorcana cards: All 30 \+ Prices/);
  const d = fitDescription(firstThatFits(hubDescriptionCandidates({ label: "Big Hero 6", count: 24, low: "$0.12", high: "$45.10", topName: "Baymax - Armored Companion (Enchanted)", over10: 3 })));
  assert.ok(d.includes("from $0.12 to $45.10") && d.includes("Baymax - Armored Companion (Enchanted) at $45.10"), d);
  assert.ok(d.length >= DESC_MIN && d.length <= DESC_MAX, d);
  const bare = fitDescription(firstThatFits(hubDescriptionCandidates({ label: "Monsters, Inc.", count: 15, low: null, high: null, topName: null, over10: 0 })));
  assert.ok(bare.length >= DESC_MIN && bare.length <= DESC_MAX, bare);
});
