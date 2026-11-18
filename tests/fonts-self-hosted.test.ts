// Fonts come from this site, preloaded, and never swap in after the first paint (2026-11-19): the Google
// Fonts stylesheet blocked the first paint for about 2 s on a phone. No AdSense script (owner, 2026-11-18).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const layout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");

test("the layout loads no third-party font stylesheet and no AdSense script", () => {
  assert.doesNotMatch(layout, /fonts\.googleapis|fonts\.gstatic|googlesyndication|adsbygoogle/);
});

test("both faces are self-hosted through next/font with display optional", () => {
  assert.match(layout, /from "next\/font\/local"/);
  assert.equal((layout.match(/display: "optional"/g) ?? []).length, 2);
  for (const f of ["Inter-latin.woff2", "PlusJakartaSans-latin.woff2"]) {
    assert.ok(existsSync(new URL(`../src/app/fonts/${f}`, import.meta.url)), f);
  }
});
