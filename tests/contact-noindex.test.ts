import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The contact page is a utility page: noindex, links followed, never in the sitemap (page scorecard 2026-11-23).
test("/contact is noindex, follow and out of the sitemap", () => {
  const page = readFileSync("src/app/contact/page.tsx", "utf8");
  assert.match(page, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/);
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
  assert.doesNotMatch(sitemap, /"\/contact"/);
});
