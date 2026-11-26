import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { postSeo } from "@/lib/post-seo";
import { byValue, productsInSet, refCents, sets } from "@/lib/data";
import { TITLE_MAX } from "@/lib/seo-title";
import type { Post } from "@/content/blog/types";

// Page scorecard 2026-11-23: /blog/attack-of-the-vine-most-valuable-cards (position 7, 14 impressions, no click),
// /tools/selling-fees (6.9) and /creators (11.5). A set's chase post names today's top card and its price.
const base: Post = { slug: "x", title: "Some Set Most Valuable Cards: Set 99", description: "The most valuable cards.", date: "2026-10-29", keywords: [], html: "" };

test("a post without topSet keeps its own title", () => {
  assert.equal(postSeo(base).title, base.title);
});

test("a set's chase post names its top card and TCGplayer price, within 60 characters", () => {
  const set = sets().find((s) => {
    const top = byValue(productsInSet(s.id).filter((p) => p.kind === "card"))[0];
    return top && refCents(top.id) != null;
  });
  if (!set) return; // no priced data in this checkout
  const { title, description } = postSeo({ ...base, topSet: set.id });
  assert.ok(title && typeof title === "object" && "absolute" in title);
  const t = (title as { absolute: string }).absolute;
  assert.ok(t.length <= TITLE_MAX, t);
  assert.ok(t.startsWith(`${set.name} Most Valuable Cards`), t);
  assert.match(description, /TCGplayer market/);
});

test("an unknown set falls back to the post's title", () => {
  assert.equal(postSeo({ ...base, topSet: -1 }).title, base.title);
});

test("tool and creators titles are titled for the search", () => {
  assert.match(readFileSync("src/app/tools/selling-fees/page.tsx", "utf8"), /Selling Fee Calculator: TCGplayer vs eBay/);
  assert.match(readFileSync("src/app/creators/page.tsx", "utf8"), /Content Creators & YouTubers/);
});
