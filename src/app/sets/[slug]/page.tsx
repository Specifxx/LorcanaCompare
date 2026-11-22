import type { Metadata } from "next";
import { InlineAds } from "@/components/InlineAds";
import Link from "@/components/Link";
import { notFound, permanentRedirect } from "next/navigation";
import { lineOfSet } from "@/lib/lines";
import { SITE } from "@/site.config";
import { canon } from "@/lib/site";
import { byValue, priceOf, productsInSet, refCents, setBySlug, sets, summaryOf } from "@/lib/data";
import { preorderSetList, rarityHref, sealedInSet } from "@/lib/hubs";
import { isPreorder, preorderPath } from "@/lib/preorders";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { money, pct } from "@/lib/format";
import { shortName } from "@/lib/names";
import { TileGrid } from "@/components/ProductTile";
import { JsonLd } from "@/components/JsonLd";
import { abs } from "@/lib/site";
import { fitTitle, setTitleCandidates, fitDescription } from "@/lib/seo-title";
import { postsAbout } from "@/lib/posts";
import { imageAt } from "@/lib/image";
import { SealedQuickBuy } from "@/components/SealedQuickBuy";
import { ShareButton } from "@/components/ShareButton";
import { setCopy } from "@/content/sets";
import type { Product, QA } from "@/lib/site-types";

export const dynamic = "force-dynamic"; // one CDN copy per URL (next.config.js CDN_PAGES), never ISR

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = setBySlug(params.slug);
  if (!s) return {};
  // List intent first, prices second, as on Rift Compare's set pages ("<set> card list" is the bigger query).
  const count = productsInSet(s.id).filter((p) => p.kind === "card").length;
  const spoilers = !!s.upcoming && count > 0;
  const title = fitTitle(setTitleCandidates(s.name, count, spoilers));
  return {
    title,
    description: fitDescription(spoilers
      ? `Every ${s.name} card revealed so far (${count} and counting), with pre-order prices as stores list them${s.releasedOn ? `. Releases ${s.releasedOn}` : ""}. Updated daily as new spoilers land.`
      : `${count > 0 ? `All ${count} ${s.name} cards` : `The ${s.name} card list`} with prices: the most valuable cards, every card's TCGplayer market price, and the cheapest store and eBay listings. Updated daily.`),
    ...canon(`/sets/${s.slug}`),
    openGraph: { ...canon(`/sets/${s.slug}`).openGraph, title: title.absolute },
  };
}

export default function SetPage({ params }: { params: { slug: string } }) {
  const s = setBySlug(params.slug);
  if (!s) notFound();
  // A released set the catalogue cull emptied (lib/import/focus.ts) goes to its game, or the set list.
  if (s.productCount === 0 && !s.upcoming) {
    const line = lineOfSet(s);
    permanentRedirect(line ? `/games/${line.slug}` : "/sets");
  }
  const all = byValue(productsInSet(s.id));
  const cards = all.filter((p) => p.kind === "card");
  const sealed = all.filter((p) => p.kind === "sealed");
  const value = cards.reduce((a, p) => a + (refCents(p.id) ?? 0), 0);
  const rarityOrder = (r: string | null) => { const i = SITE.rarityOrder.indexOf(r ?? ""); return i < 0 ? 99 : i; };
  const byNumber = cards.slice();
  const listed = sets().filter((x) => x.productCount > 0);
  const i = listed.findIndex((x) => x.id === s.id);
  const newer = i > 0 ? listed[i - 1] : null;
  const older = i >= 0 && i < listed.length - 1 ? listed[i + 1] : null;
  const others = listed.filter((x) => x.id !== s.id && x.productCount > 20).slice(0, 12);
  const guides = postsAbout([s.name, s.code]).slice(0, 4);
  const copy = setCopy(s);
  const boxes = sealedInSet(s.id);
  const faq = setFaq(s.name, copy?.faq ?? [], cards, boxes.find((p) => p.sealedType === "Booster Box") ?? null);
  return (
    <div className="flex flex-col gap-8">
      {faq.length > 0 && <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />}
      {cards.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${s.name} card list`,
            numberOfItems: cards.length,
            itemListElement: cards.slice(0, 30).map((p, i) => ({ "@type": "ListItem", position: i + 1, name: shortName(p.name), url: abs(`/card/${p.slug}`) })),
          }}
        />
      )}
      <div>
      <Breadcrumbs items={[{ name: "Sets", href: "/sets" }, { name: s.name }]} />
      <header>
        <p className="text-xs uppercase tracking-wide text-brand-400">{s.upcoming ? "Upcoming" : "Released"} {s.releasedOn}</p>
        <h1 className="page-title">{s.upcoming && cards.length > 0 ? <>{s.name} spoilers: every card revealed so far</> : <>{s.name} card list &amp; prices</>}</h1>
        <ShareButton path={`/sets/${s.slug}`} name={`${s.name} prices`} medium="set" text={`${s.name}: every price compared on ${SITE.name}`} className="mt-3" />
        <p className="page-lede">{cards.length} cards · one of each is worth {money(value)} at TCGplayer market · {sealed.length} sealed products.</p>
        {preorderSetList().some((x) => x.id === s.id) && (
          <p className="mt-2"><Link className="link font-semibold" href={preorderPath(s)}>{isPreorder(s) ? `${s.name} pre-order prices at every store →` : `${s.name} booster box prices at every store →`}</Link></p>
        )}
        {copy && copy.facts.length > 0 && (
          <dl className="mt-4 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {copy.facts.map((f) => (
              <div key={f.label} className="card-surface p-3"><dt className="text-xs text-muted">{f.label}</dt><dd className="font-semibold">{f.value}</dd></div>
            ))}
          </dl>
        )}
      </header>
      </div>
      {/* Booster boxes first with a buy button each (components/SealedQuickBuy.tsx), before the card list. */}
      <SealedQuickBuy
        title={`Buy ${s.name} booster boxes and sealed`}
        items={boxes.slice(0, 6).map((p) => ({ id: p.id, slug: p.slug, name: shortName(p.name), image: imageAt(p.image, "200w"), best: summaryOf(p.id).best, stores: summaryOf(p.id).listedSources }))}
      />
      {cards.length > 0 && (<section><h2 className="mb-3 sec-title">Most valuable {s.name} cards</h2><TileGrid items={cards.slice(0, 18)} /></section>)}
      {sealed.length > 0 && (<section><h2 className="mb-3 sec-title">{s.name} booster boxes and sealed</h2><TileGrid items={sealed.slice(0, 12)} /></section>)}
      {cards.length > 0 && (
        <section>
          <h2 className="mb-3 sec-title">Full {s.name} card list with prices</h2>
          <div className="overflow-x-auto rounded-xl border border-ink-700/60">
            <table className="w-full text-sm">
              <thead className="bg-ink-850 text-left text-xs uppercase text-muted"><tr><th className="px-3 py-2">#</th><th className="px-3 py-2">Card</th><th className="px-3 py-2">Rarity</th><th className="px-3 py-2 text-right">Market</th><th className="px-3 py-2 text-right">7d</th><th className="px-3 py-2 text-right">Stores</th></tr></thead>
              <tbody>
                {byNumber.sort((a, b) => rarityOrder(a.rarity) - rarityOrder(b.rarity) || (parseInt(a.number ?? "") || 0) - (parseInt(b.number ?? "") || 0)).map((p) => {
                  const e = priceOf(p.id);
                  return (
                    <tr key={p.id} className="border-t border-ink-800">
                      <td className="px-3 py-1.5 text-muted">{p.number}</td>
                      <td className="px-3 py-1.5"><Link className="hover:underline" href={`/card/${p.slug}`}>{shortName(p.name)}</Link></td>
                      <td className="px-3 py-1.5 text-muted">{rarityHref(p.rarity) ? <Link className="hover:underline" href={rarityHref(p.rarity)!}>{p.rarity}</Link> : p.rarity}</td>
                      <td className="px-3 py-1.5 text-right font-semibold tabular-nums">{money(refCents(p.id))}</td>
                      <td className={`px-3 py-1.5 text-right ${(e.change7d ?? 0) >= 0 ? "text-up" : "text-down"}`}>{pct(e.change7d)}</td>
                      <td className="px-3 py-1.5 text-right text-muted">{new Set(e.offers.filter((o) => o.inStock).map((o) => o.source)).size}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {faq.length > 0 && (
        <section className="max-w-3xl">
          <h2 className="mb-3 sec-title">{s.name} FAQ</h2>
          {faq.map((f) => (
            <div key={f.q} className="border-b border-ink-800 py-3"><h3 className="font-medium">{f.q}</h3><p className="mt-1 text-sm text-muted">{f.a}</p></div>
          ))}
        </section>
      )}
      {guides.length > 0 && (
        <section>
          <h2 className="mb-3 sec-title">{s.name} guides</h2>
          <ul className="list-disc pl-5 text-sm">{guides.map((g) => <li key={g.slug}><Link className="link" href={`/blog/${g.slug}`}>{g.title}</Link></li>)}</ul>
        </section>
      )}
      <nav className="flex flex-wrap justify-between gap-3 text-sm" aria-label="Neighbouring sets">
        {older ? <Link className="link" href={`/sets/${older.slug}`}>← {older.name}</Link> : <span />}
        {newer && <Link className="link" href={`/sets/${newer.slug}`}>{newer.name} →</Link>}
      </nav>
      {others.length > 0 && (
        <section>
          <h2 className="mb-3 sec-title">Other {SITE.gameShort} card lists</h2>
          <div className="flex flex-wrap gap-2">{others.map((x) => <Link key={x.id} href={`/sets/${x.slug}`} className="chip hover:border-brand">{x.name}</Link>)}</div>
        </section>
      )}
      {/* Ads sit below the page's own content, never above it (2026-11-19, core-update quality pass). */}
      <InlineAds page="set" />
    </div>
  );
}

/** The set's own questions (src/content/sets.ts), then two answered from today's data: its most valuable card and its booster box. */
function setFaq(name: string, own: QA[], cards: Product[], box: Product | null): QA[] {
  const out = [...own];
  const top = cards.filter((p) => refCents(p.id)).slice(0, 3);
  if (top.length > 0) {
    const [first, ...rest] = top;
    const label = (p: Product) => { const n = shortName(p.name); return `${n}${p.rarity && !n.includes(`(${p.rarity})`) ? ` (${p.rarity})` : ""} at ${money(refCents(p.id))}`; };
    out.push({
      q: `What is the most valuable ${name} card?`,
      a: `Today it is ${label(first)} TCGplayer market${rest.length ? `, then ${rest.map(label).join(" and ")}` : ""}. Market prices move daily; the card list above is sorted by value.`,
    });
  }
  const listed = box ? summaryOf(box.id).listedSources : 0;
  if (box && listed > 0) {
    out.push({
      q: `Where is the cheapest ${name} booster box?`,
      a: `It depends on your market and changes daily. ${listed} store${listed === 1 ? " lists" : "s list"} the booster box today; its page compares them in your currency, in-stock first, next to TCGplayer and eBay. Prices are item prices before shipping.`,
    });
  }
  return out;
}
