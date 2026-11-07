// The low-traction cull (owner, 2026-11-07): cheap cards leave the catalogue unless people find them
// through search, and a culled card's URL 301s to its set.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { applyCatalogFloor } from "@/lib/import/tcgcsv";
import { demandSlugs } from "@/lib/import/demand";
import type { Product, SetInfo } from "@/lib/site-types";

const now = new Date("2026-11-07T00:00:00Z");
const sets = [
  { id: 1, name: "Old", code: "1", slug: "old", releasedOn: "2024-01-01", productCount: 0 },
  { id: 2, name: "New", code: "2", slug: "new", releasedOn: "2026-10-20", productCount: 0 },
] as SetInfo[];
const card = (id: number, slug: string, setId: number, kind: "card" | "sealed" = "card") => ({ id, slug, setId, kind, name: slug }) as Product;

test("cheap cards go, unless sealed, new, or found through search", () => {
  const products = [card(1, "cheap", 1), card(2, "chase", 1), card(3, "cheap-new", 2), card(4, "cheap-searched", 1), card(5, "box", 1, "sealed")];
  const tcg = { 1: { Normal: { market: 25, low: 10, mid: 30 } }, 2: { Normal: { market: 4500, low: 4000, mid: 4800 } }, 3: { Normal: { market: 20, low: 10, mid: 20 } }, 4: { Normal: { market: 30, low: 10, mid: 30 } } };
  const kept = applyCatalogFloor(products, sets, tcg as never, 100, now, new Set(["cheap-searched"]));
  assert.deepEqual(kept.map((p) => p.slug), ["chase", "cheap-new", "cheap-searched", "box"]);
});

test("demand is a click or ten impressions on the card page itself", () => {
  const s = demandSlugs({ "/card/a": [1, 2, 9], "/card/b": [0, 10, 20], "/card/c": [0, 9, 5], "/sets/old": [5, 100, 3], "/card/d/opengraph-image": [1, 1, 1] });
  assert.deepEqual([...s].sort(), ["a", "b"]);
});

test("a culled card's page 301s to its set, and the file ships with the site", () => {
  const page = fs.readFileSync("src/app/card/[slug]/page.tsx", "utf8");
  assert.match(page, /culledSetSlug\(params\.slug\)/);
  assert.match(page, /permanentRedirect\(`\/sets\/\$\{set\}`\)/);
  assert.match(fs.readFileSync("scripts/import-all.ts", "utf8"), /"culled\.json"/);
  assert.match(fs.readFileSync("next.config.js", "utf8"), /\.\/data\/public\/\*\*\/\*/);
});
