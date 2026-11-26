import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readSlugs, shortlistSlugs } from "../src/lib/shortlist-basket";

test("the shortlist's products are read by their own page, quantities summed per product", () => {
  const got = shortlistSlugs([
    { page: "/card/fabled-booster-box", qty: 1 },
    { page: "/card/fabled-booster-box?x=1", qty: 2 },
    { page: "/card/elsa-ice-maker", qty: 4 },
    { page: "/sealed", qty: 1 },
    { page: null, qty: 1 },
  ]);
  assert.deepEqual(got, [
    { slug: "fabled-booster-box", qty: 3 },
    { slug: "elsa-ice-maker", qty: 4 },
  ]);
});

test("the API takes only well-formed slugs", () => {
  assert.equal(readSlugs("nope"), null);
  assert.deepEqual(readSlugs([{ slug: "ok-1", qty: 2 }, { slug: "../etc", qty: 1 }, { slug: "x", qty: -3 }]), [
    { slug: "ok-1", qty: 2 },
    { slug: "x", qty: 1 },
  ]);
});

test("Best Basket prices the shortlist on arrival (QA guard journey)", () => {
  const src = readFileSync("src/app/tools/best-basket/Basket.tsx", "utf8");
  assert.match(src, /shortlistSlugs\(readCart\(\)\)/);
  assert.match(readFileSync("src/app/api/basket/route.ts", "utf8"), /productBySlug\(l\.slug\)/);
});
