import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/site.config";
import { deals } from "@/lib/data";
import { money } from "@/lib/format";
import { goHref } from "@/lib/affiliate";
import { shortName } from "@/lib/names";
import { sourceNameServer } from "@/lib/sources";

export const revalidate = 21600;
export const metadata: Metadata = {
  title: `${SITE.gameShort} deals — cards selling below market`,
  description: `In-stock ${SITE.game} cards and sealed products listed below their TCGplayer market price at stores and on eBay today.`,
  alternates: { canonical: "/deals" },
};

export default function Deals() {
  const rows = deals(60);
  return (
    <div>
      <h1 className="font-display text-3xl font-black">{SITE.gameShort} cards below market today</h1>
      <p className="mt-2 text-muted">In-stock US-dollar listings 8–60% under TCGplayer market. Premium members get this list by email every morning.</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-ink-700/60">
        <table className="w-full text-sm">
          <thead className="bg-ink-850 text-left text-xs uppercase text-muted"><tr><th className="px-3 py-2">Card</th><th className="px-3 py-2">Where</th><th className="px-3 py-2 text-right">Market</th><th className="px-3 py-2 text-right">Price</th><th className="px-3 py-2" /></tr></thead>
          <tbody>
            {rows.map((d) => (
              <tr key={`${d.p.id}-${d.offer.source}-${d.offer.printing}`} className="border-t border-ink-800">
                <td className="px-3 py-2"><Link className="hover:underline" href={`/card/${d.p.slug}`}>{shortName(d.p.name)}</Link></td>
                <td className="px-3 py-2 text-muted">{sourceNameServer(d.offer)}</td>
                <td className="px-3 py-2 text-right text-muted">{money(d.market)}</td>
                <td className="px-3 py-2 text-right font-semibold text-buy-400">{money(d.offer.cents)} <span className="text-xs text-muted">−{d.saving}%</span></td>
                <td className="px-3 py-2 text-right"><a className="btn-buy" rel="sponsored nofollow noopener" target="_blank" href={goHref(d.offer, d.p.id, "deals")}>Buy</a></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="p-4 text-muted">No below-market listings today.</p>}
      </div>
    </div>
  );
}
