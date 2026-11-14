import type { Metadata } from "next";
import { InlineAds } from "@/components/InlineAds";
import { SITE } from "@/site.config";
import { canon } from "@/lib/site";
import { byValue, products, setById } from "@/lib/data";
import { SEALED_ORDER as ORDER, SEALED_PLURAL as PLURAL, sealedHref } from "@/lib/hubs";
import Link from "@/components/Link";
import { TileGrid } from "@/components/ProductTile";
import { fitDescription } from "@/lib/seo-title";

export const revalidate = 86400; // data only changes with a release (DECISIONS.md, "Vercel cost")
export const metadata: Metadata = {
  title: `${SITE.gameShort} booster box prices — cheapest sealed product`,
  description: fitDescription(`Compare ${SITE.game} booster box, booster pack, starter deck and sealed product prices across TCGplayer, eBay and ${SITE.stores.length} stores.`),
  ...canon("/sealed"),
};


export default function Sealed() {
  const sealed = products().filter((p) => p.kind === "sealed");
  const groups = ORDER.map((t) => ({ t, items: byValue(sealed.filter((p) => p.sealedType === t)) })).filter((g) => g.items.length);
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="page-title">{SITE.gameShort} booster box and sealed prices</h1>
        <p className="page-lede">Newest sets first within each type. Open any product to compare every store.</p>
      </header>
      {/* On a phone each type is one sideways row, like the home page's sealed shelf (2026-11-14); a grid from a tablet up. */}
      {groups.map((g) => (
        <section key={g.t} className="shelf-phone">
          <h2 className="mb-3 sec-title">{sealedHref(g.t) ? <Link className="hover:underline" href={sealedHref(g.t)!}>{PLURAL[g.t] ?? g.t} →</Link> : PLURAL[g.t] ?? g.t}</h2>
          <TileGrid items={g.items.sort((a, b) => (setById(b.setId)?.releasedOn ?? "").localeCompare(setById(a.setId)?.releasedOn ?? "")).slice(0, 24)} />
        </section>
      ))}
      <InlineAds page="sealed" />
    </div>
  );
}
