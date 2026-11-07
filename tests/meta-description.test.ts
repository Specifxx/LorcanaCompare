import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { SITE } from "@/site.config";
import { DESC_MAX, DESC_MIN, fitDescription } from "@/lib/seo-title";

// Bing flags descriptions under ~120 characters; Google cuts them past ~160 (owner's SEO audit, 2026-11-07).
const fits = (s: string) => s.length >= DESC_MIN && s.length <= DESC_MAX;

test("a short description is lengthened with site facts it does not already say", () => {
  for (const base of [
    `Contact ${SITE.name}, report a price or list your store.`,
    `Where ${SITE.name}'s ${SITE.gameShort} prices come from and how often they update.`,
    `${SITE.name} compares ${SITE.game} prices across stores so you never overpay.`,
    `Value both sides of a ${SITE.game} trade at today's TCGplayer market price. Free, no account.`,
    "The store prices you saved, grouped by store, with one checkout button per store.",
  ]) {
    const out = fitDescription(base);
    assert.ok(fits(out), `${out.length}: ${out}`);
    assert.ok(out.startsWith(base.replace(/\.$/, "")), out);
    // Nothing is said twice.
    assert.ok((out.match(/\bfree\b/gi) ?? []).length <= 1, out);
    assert.ok((out.match(/\bdaily\b/gi) ?? []).length <= 1, out);
  }
});

test("the site-wide description fits too", () => {
  assert.ok(fits(fitDescription(SITE.description)));
});

test("a description already in the window is left alone", () => {
  const ok = `Every ${SITE.game} set in release order, newest first, with each set's card list, card prices, the most valuable cards and the set's total value.`;
  if (fits(ok)) assert.equal(fitDescription(ok), ok);
});

test("a long description ends at a full sentence, else at a word with an ellipsis", () => {
  const sentences = `${"a".repeat(130)}. ${"b".repeat(60)}.`;
  assert.equal(fitDescription(sentences), `${"a".repeat(130)}.`);
  const words = Array.from({ length: 40 }, (_, i) => `word${i}`).join(" ");
  const out = fitDescription(words);
  assert.ok(out.length <= DESC_MAX && out.endsWith("…") && !/\s…$/.test(out), out);
  assert.ok(words.startsWith(out.slice(0, -1)), out);
});

test("every page's metadata description goes through fitDescription", () => {
  const walk = (d: string): string[] =>
    readdirSync(d).flatMap((f) => {
      const p = join(d, f);
      return statSync(p).isDirectory() ? walk(p) : /^(page|layout)\.tsx$/.test(f) ? [p] : [];
    });
  const bad: string[] = [];
  for (const f of walk("src/app")) {
    const src = readFileSync(f, "utf8");
    if (!/export (const metadata|async function generateMetadata|function generateMetadata)/.test(src)) continue;
    if (/(^|[{,]\s*)description:/m.test(src) && !src.includes("fitDescription(")) bad.push(f);
  }
  assert.deepEqual(bad, []);
});
