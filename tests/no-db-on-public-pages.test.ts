// Cost rule 1 (CLAUDE.md): no public page, layout or route reads the database.
// Neon holds only private data; everything public is files under data/. Only
// the private surfaces below may import the database or the session reader.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const PRIVATE = new Set([
  "src/app/account/page.tsx",
  "src/app/admin/page.tsx",
  "src/app/api/alerts/route.ts",
  "src/app/api/auth/login/route.ts",
  "src/app/api/auth/signup/route.ts",
  "src/app/api/auth/logout/route.ts",
  "src/app/api/contact/route.ts",
  "src/app/api/newsletter/route.ts",
  "src/app/api/history/route.ts",
  "src/app/api/me/route.ts",
  "src/app/api/stripe/checkout/route.ts",
  "src/app/api/stripe/portal/route.ts",
  "src/app/api/stripe/webhook/route.ts",
  "src/app/go/route.ts",
]);

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.(tsx?|jsx?)$/.test(e.name) ? [p] : [];
  });
}

test("only private surfaces touch the database", () => {
  const offenders = walk("src/app")
    .concat(walk("src/components"))
    .filter((f) => !PRIVATE.has(f))
    .filter((f) => /from "@\/lib\/(db|auth)"/.test(fs.readFileSync(f, "utf8")));
  assert.deepEqual(offenders, []);
});

test("the public data layer never imports the database", () => {
  for (const f of ["src/lib/data.ts", "src/lib/price-store.ts", "src/lib/post-render.ts"])
    assert.doesNotMatch(fs.readFileSync(f, "utf8"), /from "\.\/db"|@\/lib\/db|@prisma\/client/, f);
});
