// Cards the catalogue floor left out (SITE.catalogMinCardCents; the low-traction cull, owner
// 2026-11-07): the import writes data/public/culled.json (card slug -> set slug) so a culled card's
// old URL 301s to its set instead of a 404. A card that climbs back over the floor leaves the file and
// gets its page back at the same URL (slugs never depend on the floor).
import fs from "node:fs";
import path from "node:path";

let map: Record<string, string> | null = null;

export function culledSetSlug(slug: string): string | null {
  if (!map) {
    try {
      map = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "public", "culled.json"), "utf8")) as Record<string, string>;
    } catch {
      map = {};
    }
  }
  return Object.prototype.hasOwnProperty.call(map, slug) ? map[slug] : null;
}
