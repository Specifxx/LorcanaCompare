import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { byValue, products, setById } from "@/lib/data";
import { TileGrid } from "@/components/ProductTile";

export const revalidate = 21600;
export const metadata: Metadata = {
  title: `${SITE.gameShort} booster box prices — cheapest sealed product`,
  description: `Compare ${SITE.game} booster box, booster pack, starter deck and sealed product prices across TCGplayer, eBay and ${SITE.stores.length} stores.`,
  alternates: { canonical: "/sealed" },
};

const ORDER = ["Booster Box", "Case", "Illumineer's Trove", "Booster Pack", "Sleeved Pack", "Starter Deck", "Collection", "Prerelease", "Deck", "Other"];

const PLURAL: Record<string, string> = { "Booster Box": "Booster boxes", Case: "Cases", "Illumineer's Trove": "Illumineer's Troves", "Booster Pack": "Booster packs", "Sleeved Pack": "Sleeved packs", "Starter Deck": "Starter decks", Collection: "Collections and gift sets", Prerelease: "Prerelease kits", Deck: "Decks", Other: "Other sealed" };

export default function Sealed() {
  const sealed = products().filter((p) => p.kind === "sealed");
  const groups = ORDER.map((t) => ({ t, items: byValue(sealed.filter((p) => p.sealedType === t)) })).filter((g) => g.items.length);
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-black">{SITE.gameShort} booster box and sealed prices</h1>
        <p className="mt-2 text-muted">Newest sets first within each type. Open any product to compare every store.</p>
      </header>
      {groups.map((g) => (
        <section key={g.t}>
          <h2 className="mb-3 text-xl font-bold">{PLURAL[g.t] ?? g.t}</h2>
          <TileGrid items={g.items.sort((a, b) => (setById(b.setId)?.releasedOn ?? "").localeCompare(setById(a.setId)?.releasedOn ?? "")).slice(0, 24)} />
        </section>
      ))}
    </div>
  );
}
