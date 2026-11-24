import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Owner, 2026-11-17 (final): eBay first, then TCGplayer, then Amazon. Since the owner's 2026-11-23 UX review (P1 10) that block sits
// under the stores on the product page, under one "Marketplaces · Ad" line; the quick view keeps it on top.
test("Amazon sits right under the last pinned row (eBay, then TCGplayer)", () => {
  const s = readFileSync(new URL("../src/components/PriceTable.tsx", import.meta.url), "utf8");
  assert.match(s, /shown\.reduce\(\(at, o, i\) => \(pinned\.includes\(o\) \? i : at\), -1\);/);
  assert.match(s, /const lead = below && cheapest && pinned\.includes\(cheapest\) \? cheapest : null;/, "the best price leads even when it is a marketplace");
  assert.match(s, /const below = !compact && !maxRows && /);
  assert.match(s, /Marketplaces <span className="ad-pill/);
  assert.doesNotMatch(s, /norm\(a\) - norm\(b\)/);
});
