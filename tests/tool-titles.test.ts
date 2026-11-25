import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fitTitle, TITLE_MAX } from "../src/lib/seo-title";

// Page scorecard 2026-11-23: /daily (position 3.4) and /tools/trade (position 8) were seen and never clicked.
// Their titles lead with what a searcher asks, and fit Google's ~60 characters.
test("daily and trade titles lead with the searcher's words and fit", () => {
  const daily = readFileSync("src/app/daily/page.tsx", "utf8");
  const trade = readFileSync("src/app/tools/trade/page.tsx", "utf8");
  assert.match(daily, /Which \$\{SITE\.gameShort\} card is worth more\?/);
  assert.doesNotMatch(daily, /title: `\$\{SITE\.gameShort\} Price Duel/);
  assert.match(trade, /trade calculator: value cards at market price/);
  for (const g of ["Cyberpunk TCG", "Lorcana"]) {
    const t = fitTitle([`Which ${g} card is worth more? Daily price quiz`, `${g} daily card price quiz`]).absolute;
    assert.ok(t.length <= TITLE_MAX, t);
    assert.match(t, /worth more|price quiz/);
  }
});
