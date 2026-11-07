// Search Console page demand, for the catalogue floor (the low-traction cull, owner 2026-11-07).
//
// RiftCompare's sister-demand job writes one aggregate file, gsc-pages.json (path -> [clicks,
// impressions, position] over 56 days), to this repo's `demand` branch every day. The import reads it
// so a card page people find through Google is never culled, whatever its price. No file (a fresh
// clone, a local run) means no demand: the floor alone decides.
import { execFileSync } from "node:child_process";

/** A card page with any click, or this many impressions in 56 days, is kept. */
export const DEMAND_MIN_IMPRESSIONS = 10;

/** Card slugs with real search demand, from gsc-pages.json's `pages`. */
export function demandSlugs(pages: Record<string, number[]>): Set<string> {
  const out = new Set<string>();
  for (const [path, [clicks = 0, impressions = 0]] of Object.entries(pages)) {
    const m = /^\/card\/([^/]+)$/.exec(path);
    if (m && (clicks > 0 || impressions >= DEMAND_MIN_IMPRESSIONS)) out.add(decodeURIComponent(m[1]));
  }
  return out;
}

/** Reads the `demand` branch through git (the workflow's checkout); an empty set when it can't. */
export function readDemandSlugs(): Set<string> {
  try {
    execFileSync("git", ["fetch", "--quiet", "--depth=1", "origin", "demand"], { stdio: "ignore", timeout: 60_000 });
    const raw = execFileSync("git", ["show", "FETCH_HEAD:gsc-pages.json"], { encoding: "utf8", timeout: 30_000 });
    const s = demandSlugs((JSON.parse(raw) as { pages?: Record<string, number[]> }).pages ?? {});
    console.log(`[demand] ${s.size} card pages with search demand kept past the catalogue floor`);
    return s;
  } catch {
    console.log("[demand] no demand branch: the catalogue floor alone decides");
    return new Set();
  }
}
