// The owner's 2026-11-23 UX review (DECISIONS.md): no interrupting prompts, sort and filter, typo-tolerant search.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { editDistance, suggestWords } from "@/lib/fuzzy";
import { gridKeep, gridOrder, type GridItem } from "@/lib/grid-sort";

test("a misspelt word is swapped for the nearest catalogue word", () => {
  const freq = new Map([["charizard", 15], ["booster", 40], ["box", 40], ["display", 9]]);
  const known = (w: string) => [...freq.keys()].some((t) => t.startsWith(w));
  assert.deepEqual(suggestWords(["charizrd"], freq, known), ["charizard"]);
  assert.deepEqual(suggestWords(["boostr", "box"], freq, known), ["booster", "box"]);
  assert.equal(suggestWords(["booster"], freq, known), null); // nothing to fix
  assert.equal(suggestWords(["zzz"], freq, known), null); // too short to guess
  assert.equal(suggestWords(["qwertyuiop"], freq, known), null); // nothing close
  assert.equal(editDistance("dipslay", "display", 2), 1); // a swap counts once
});

const it = (i: number, price: number | null, date: string | null, set = "A", under: number | null = null): GridItem => ({ i, price, under, date, set });

test("the grid sorts one continuous order and keeps unpriced tiles last", () => {
  const items = [it(0, 500, "2025-01-01"), it(1, null, "2026-01-01"), it(2, 100, "2024-01-01")];
  assert.deepEqual(gridOrder(items, "price").map((x) => x.i), [2, 0, 1]);
  assert.deepEqual(gridOrder(items, "price-desc").map((x) => x.i), [0, 2, 1]);
  assert.deepEqual(gridOrder(items, "new").map((x) => x.i), [1, 0, 2]);
  assert.deepEqual(gridOrder(items, "default").map((x) => x.i), [0, 1, 2]);
  assert.equal(gridKeep({ ...it(0, 500, null), stock: false }, { inStock: true }), false);
  assert.equal(gridKeep(it(0, 500, null, "B"), { set: "A" }), false);
  assert.equal(gridKeep(it(0, 500, null), { band: [0, 1000] }), true);
  assert.equal(gridKeep(it(0, null, null), { band: [0, 1000] }), false);
});

test("every self-opening card asks visitorBusy and takes the visit's one prompt slot", () => {
  for (const f of ["src/components/site-reviews/RateCard.tsx", "src/components/ReturnNudge.tsx", "src/components/LeaveNudge.tsx"]) {
    const src = fs.readFileSync(f, "utf8");
    assert.match(src, /visitorBusy\(/, `${f} must not open while the visitor types`);
    assert.match(src, /claimPrompt\(/, `${f} must take the one prompt slot`);
  }
});
