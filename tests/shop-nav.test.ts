import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { navGroups } from "@/lib/nav";
import { shopNav } from "@/lib/shop-nav";
import { attrFacets, rarityHubs, sealedHubs } from "@/lib/hubs";

// Navigation by the game's own dimensions (owner, 2026-11-09): the header dropdowns, the rail's "Shop by" groups and the phone
// menu read one list, built from the hubs that exist, so nothing links a page with no products.
test("every shop link is a real hub, and the header and the rail agree", () => {
  const s = shopNav();
  const hubs = new Set<string>(["/cards", "/sets", "/sealed", "/preorders"]);
  for (const f of attrFacets()) { hubs.add(`/cards/${f.cfg.facet}`); for (const h of f.hubs) hubs.add(`/cards/${f.cfg.facet}/${h.slug}`); }
  for (const h of rarityHubs()) hubs.add(`/cards/rarity/${h.slug}`);
  for (const h of sealedHubs()) hubs.add(`/sealed/${h.slug}`);
  for (const l of [...s.menus.flatMap((m) => m.columns.flatMap((c) => c.links)), ...s.groups.flatMap((g) => g.links)]) {
    assert.ok(hubs.has(l.href) || /^\/sets\/[a-z0-9-]+$/.test(l.href), `${l.href} is not a hub`);
  }
  assert.ok(s.menus.length >= 2 && s.menus.length <= 4, "the header keeps a short row");
  const rail = navGroups({ shop: s.groups });
  assert.equal(rail[0].title.startsWith("Shop by"), true, "the game's own dimension comes first");
  const hrefs = rail.flatMap((g) => g.links).map((l) => l.href);
  assert.equal(new Set(hrefs).size, hrefs.length, "the rail repeats a link");
  for (const m of s.menus) for (const c of m.columns) for (const l of c.links) assert.ok(hrefs.includes(l.href) || l.href === "/preorders", `${l.href} is in the dropdown but not the rail`);
});

test("the menus are server HTML: plain links, no client state, the phone menu is a dialog", () => {
  const menus = readFileSync("src/components/HeaderMenus.tsx", "utf8");
  assert.doesNotMatch(menus, /use client|useState/);
  assert.match(menus, /group-focus-within:visible/);
  assert.ok(existsSync("src/components/MobileMenu.tsx"));
  assert.match(readFileSync("src/components/MobileMenu.tsx", "utf8"), /<dialog/);
});
