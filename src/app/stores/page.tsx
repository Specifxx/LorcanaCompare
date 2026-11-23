import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { canon } from "@/lib/site";
import { meta } from "@/lib/data";
import { MARKET_LABEL, type Market } from "@/lib/site-types";
import { StaticPage } from "@/components/StaticPage";
import { kitStoreStatus } from "@/lib/kits";
import { SuggestStore } from "@/components/ReportForms";
import { FoldFinder } from "@/components/FoldFinder";
import { fitDescription } from "@/lib/seo-title";

export const revalidate = 86400;
export const metadata: Metadata = { title: `${SITE.gameShort} stores we compare`, description: fitDescription(`Every online ${SITE.game} store ${SITE.name} compares, by country.`), ...canon("/stores") };

/** Stores of a country shown before "Show all". */
const FIRST = 12;

export default function Stores() {
  const m = meta();
  const markets = [...new Set(SITE.stores.map((s) => s.market))];
  // Since 2026-11-23: the US first, then the countries with the most stores; each country's stores by listings matched, the
  // biggest FIRST showing and the rest behind "Show all" (it was one flat list of every store, 21,700 px on a phone).
  const matched = (key: string) => m?.stores[key]?.matched ?? 0;
  const groups = markets
    .map((mk) => ({ mk, list: SITE.stores.filter((s) => s.market === mk).sort((a, b) => matched(b.key) - matched(a.key) || a.name.localeCompare(b.name)) }))
    .sort((a, b) => (b.mk === "US" ? 1 : 0) - (a.mk === "US" ? 1 : 0) || b.list.length - a.list.length);
  const ebayNames = (Object.keys(SITE.ebay.marketShares ?? { US: 1, UK: 1, AU: 1 }) as Market[]).map((mk) => ({ US: "US", UK: "UK", AU: "Australia", CA: "Canada" } as Partial<Record<Market, string>>)[mk] ?? mk);
  const ebayList = ebayNames.length > 1 ? `${ebayNames.slice(0, -1).join(", ")} and ${ebayNames[ebayNames.length - 1]}` : ebayNames.join("");
  return (
    <StaticPage title={`${SITE.gameShort} stores we compare`}>
      <p>Plus TCGplayer and eBay ({ebayList}). Know a store we should compare? <a href="#suggest">Suggest it below</a>. Run one? <a href="/list-your-store">List your store</a>, free. Every store is checked before it is listed and every week after: <a href="/how-we-pick-stores">how we pick stores</a>.</p>
      <noscript><style>{`.ff-x{display:revert!important}.ff-box,[data-ff-more]{display:none!important}`}</style></noscript>
      <div data-ff-root>
      <FoldFinder placeholder="Find a store by name" noun="stores" />
      {groups.map(({ mk, list }) => (
        <section key={mk} data-ff-group>
          <h2>{MARKET_LABEL[mk]}</h2>
          <ul className="store-list">
            {list.map((s, i) => (
              <li key={s.key} data-ff={s.name.toLowerCase()} className={i >= FIRST ? "ff-x" : undefined}><a href={s.base} rel="noopener nofollow">{s.name}</a> {m?.stores[s.key]?.matched ? <span className="text-muted">— {m.stores[s.key].matched.toLocaleString()} listings matched</span> : null}</li>
            ))}
          </ul>
          {list.length > FIRST && <button type="button" data-ff-more className="ff-more">Show all {list.length} stores in {MARKET_LABEL[mk]}</button>}
        </section>
      ))}
      </div>
      {SITE.kits && (
        <section>
          <h2>{SITE.kits.label} shops</h2>
          <p>For <a href="/kits">{SITE.kits.noun}</a>, matched by the barcode on the box.</p>
          <ul className="store-list">
            {SITE.kits.stores.map((s) => (
              <li key={s.key}><a href={s.base} rel="noopener nofollow">{s.name}</a> <span className="text-muted">— {MARKET_LABEL[s.market]}{kitStoreStatus()[s.key]?.matched ? `, ${kitStoreStatus()[s.key].matched.toLocaleString()} kits matched` : ""}</span></li>
            ))}
          </ul>
        </section>
      )}
      <section id="suggest">
        <h2>Suggest a store</h2>
        <p>Tell us about a {SITE.gameShort} store we don&apos;t compare yet. We check every suggestion and add the store if we can read its prices.</p>
        <SuggestStore regions={markets.map((mk) => [mk, MARKET_LABEL[mk]])} what={`${SITE.gameShort} products`} buttonClassName="btn-buy" />
      </section>
    </StaticPage>
  );
}
