import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { setReadout } from "../src/lib/set-readout";

// Rift Compare's set template (DECISIONS.md 2026-11-24): the set page's read-out is written from its own rows.
const card = (name: string, cents: number | null, rarity: string | null = "Common", inStock = true) => ({ name, cents, rarity, inStock });

test("setReadout: value, the top ten's share, the middle card, stock, and the facts", () => {
  const cards = [
    ...Array.from({ length: 6 }, (_, i) => card(`Chase ${i}`, 10000 - i * 100, "Enchanted")),
    ...Array.from({ length: 10 }, (_, i) => card(`Common ${i}`, 20 + i)),
    card("Unpriced", null, "Common", false),
  ];
  const r = setReadout("Test Set", cards);
  assert.match(r.about[0], /^16 of Test Set's 17 cards have a TCGplayer market price today, and one of each comes to \$/);
  assert.match(r.about[0], /The ten most valuable make up 99% of that, led by Chase 0 \(Enchanted\) at \$100\.00, then Chase 1 \(Enchanted\) at \$99\.00 and Chase 2/);
  assert.match(r.about[1], /10 of the priced cards are \$1\.00 or less/);
  assert.equal(r.about[2], "16 of the 17 cards are in stock at one or more of the sellers we track today; the rest show TCGplayer's market price until a store lists them.");
  assert.equal(r.facts, "The most valuable Test Set card today is Chase 0 (Enchanted), at $100.00; the cheapest priced one is Common 0 (Common), at $0.20. 6 of the ten most valuable are Enchanted cards.");
});

test("setReadout: nothing priced, nothing written; one card, no cheapest", () => {
  assert.deepEqual(setReadout("X", [card("A", null)]), { about: [], facts: null });
  assert.equal(setReadout("X", [card("A", 500, null)]).facts, "The most valuable X card today is A, at $5.00.");
});

test("the set page reads it under the list, ahead of the sealed tiles and the ad block", () => {
  const page = fs.readFileSync("src/app/sets/[slug]/page.tsx", "utf8");
  const i = (n: string) => { const at = page.indexOf(n, page.indexOf("return (")); assert.ok(at > 0, n); return at; };
  const order = ["Full {s.name} card list with prices", "About {s.name} prices", "How to read {s.name} prices", "booster boxes and sealed</h2>", "<InlineAds"];
  for (let k = 1; k < order.length; k++) assert.ok(i(order[k]) > i(order[k - 1]), `${order[k]} after ${order[k - 1]}`);
  assert.match(page, /"@type": "CollectionPage"/);
});
