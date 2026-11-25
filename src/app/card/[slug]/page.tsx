import type { Metadata } from "next";
import Link from "@/components/Link";
import { Fragment } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { culledSetSlug } from "@/lib/culled";
import { SITE } from "@/site.config";
import { byValue, historyOf, meta, priceOf, productBySlug, productsInSet, refCents, setById, storeCountOf, storeLowsOf, historyThrough } from "@/lib/data";
import { imageAt } from "@/lib/image";
import { money, pct } from "@/lib/format";
import { shortName } from "@/lib/names";
import { PriceTable } from "@/components/PriceTable";
import { VaultOwn } from "@/components/vault/VaultOwn";
import { PriceAlert } from "@/components/PriceAlert";
import { WatchPrice } from "@/components/WatchPrice";
import { SeenPrice } from "@/components/SinceLastVisit";
import { lowestByMarket } from "@/lib/alert-feed";
import { CardStickyBuyBar, CardTopBuy, CheckedAgo } from "@/components/CardBuy";
import { EbayCallout } from "@/components/EbayCallout";
import { PriceHistory } from "@/components/PriceHistory";
import { TileGrid } from "@/components/ProductTile";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";
import { InlineAds } from "@/components/InlineAds";
import { amazonSearchUrls } from "@/lib/affiliate";
import { amazonCarries, amazonCells } from "@/lib/amazon-live";
import { fetchRowsFor } from "@/lib/fetchtcg";
import { abs } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShareButton } from "@/components/ShareButton";
import { DropShare } from "@/components/DropShare";
import { attrHref, rarityHref, sealedHref } from "@/lib/hubs";

import { cardDescriptionCandidates, cardTitleCandidates, firstThatFits, fitDescription, fitTitle } from "@/lib/seo-title";
import { cardAsksIndex, priceValidUntil } from "@/lib/indexing";
import { searchFound } from "@/lib/search-demand";
import { gtinLabel, gtinLd } from "@/lib/gtin";
import { MARKETS, type Market } from "@/lib/site-types";

export const dynamic = "force-dynamic"; // one CDN copy per URL (next.config.js CDN_PAGES), never ISR

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = productBySlug(params.slug);
  if (!p) return {};
  const set = setById(p.setId);
  const ref = refCents(p.id);
  const name = shortName(p.name);
  // "<card> <number> Price: $X — <set>" (TCGplayer's market), stepped down to fit 60 characters (lib/seo-title.ts).
  const title = fitTitle(cardTitleCandidates(name, p.number, set?.name ?? null, p.kind === "sealed", ref ? money(ref) : null)).absolute;
  // The description leads with the cheapest in-stock store price, US first, then TCGplayer's market (2026-11-24, page
  // scorecard Job D; lib/seo-title.ts cardDescriptionCandidates). Stores only in the lead, never eBay, TCGplayer or Amazon.
  const storeOffers = priceOf(p.id).offers.filter((o) => o.inStock && !o.preorder && o.cents > 0 && !["ebay", "tcgplayer", "amazon"].includes(o.source));
  const cheapestIn = (mk: Market) => storeOffers.filter((o) => o.market === mk).sort((a, b) => a.cents - b.cents)[0];
  const leadOffer = MARKETS.map(cheapestIn).find(Boolean) ?? null;
  const description = fitDescription(firstThatFits(
    cardDescriptionCandidates({
      name,
      number: p.number,
      setName: set?.name ?? null,
      rarity: p.rarity,
      sealed: p.kind === "sealed",
      ref: ref ? money(ref) : null,
      lead: leadOffer
        ? { price: money(leadOffer.cents, leadOffer.currency), market: leadOffer.market, inStockStores: new Set(storeOffers.filter((o) => o.market === leadOffer.market).map((o) => o.source)).size }
        : null,
      stores: storeCountOf(p.id),
    }),
  ));
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/card/${p.slug}` },
    // Pack inserts (worth cents, DECISIONS.md 2026-10-28) and cards with no
    // price and no listing at all (lib/indexing.ts) stay out of the index.
    ...(cardAsksIndex(p, ref, priceOf(p.id).offers.length, storeCountOf(p.id), set, searchFound(`/card/${p.slug}`)) ? {} : { robots: { index: false, follow: true } }),
    // The image is ./opengraph-image.tsx: the card and its real price gap (lib/share.ts).
    openGraph: { type: "website", siteName: SITE.name, url: `/card/${p.slug}`, title, description },
    twitter: { card: "summary_large_image" },
  };
}

export default function CardPage({ params }: { params: { slug: string } }) {
  const p = productBySlug(params.slug);
  if (!p) {
    // A card the catalogue floor culled: its set lists what is left (lib/culled.ts).
    const set = culledSetSlug(params.slug);
    if (set) permanentRedirect(`/sets/${set}`);
    notFound();
  }
  const set = setById(p.setId);
  const e = priceOf(p.id);
  const ref = refCents(p.id);
  const m = meta();
  const series = historyOf(p);
  const name = shortName(p.name);
  const related = byValue(productsInSet(p.setId).filter((x) => x.id !== p.id && x.kind === p.kind)).slice(0, 6);
  const inStock = e.offers.filter((o) => o.inStock);
  const usOffers = inStock.filter((o) => o.currency === "USD");
  // Sealed only: the markets' tagged searches, upgraded to the item's own page and this build's price where the API found them.
  // Fetch TCG's own listing of this card (Australia only; Fetch lists no sealed): null without the build-time file.
  const fetchTcg = p.kind === "card" ? fetchRowsFor({ name: p.name, number: p.number, setName: set?.name ?? null }) : null;
  const amazon = p.kind === "sealed" && amazonCarries(p) ? amazonCells(p.id, amazonSearchUrls(`${SITE.game} ${name}`)) : null;
  return (
    <article className="flex flex-col gap-8">
      {/* Product markup only when a real in-stock US offer backs it (2026-11-04,
          DECISIONS.md): Google treats a Product with none of offers, review or
          aggregateRating as an error, so a card with only a reference price
          emits no Product rather than an invalid one. */}
      {usOffers.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            image: p.image ? imageAt(p.image, "in_1000x1000") : undefined,
            sku: String(p.id),
            productID: `tcgplayer:${p.id}`,
            ...gtinLd(p.upc),
            brand: { "@type": "Brand", name: SITE.game },
            category: p.kind === "card" ? "Trading card" : "Sealed trading card product",
            url: abs(`/card/${p.slug}`),
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "USD",
              lowPrice: (Math.min(...usOffers.map((o) => o.cents)) / 100).toFixed(2),
              highPrice: (Math.max(...usOffers.map((o) => o.cents)) / 100).toFixed(2),
              offerCount: usOffers.length,
              availability: "https://schema.org/InStock",
              priceValidUntil: priceValidUntil(),
            },
          }}
        />
      )}
      <Breadcrumbs items={[{ name: p.kind === "sealed" ? "Sealed" : "Cards", href: p.kind === "sealed" ? "/sealed" : "/cards" }, ...(set ? [{ name: set.name, href: `/sets/${set.slug}` }] : []), { name }]} />
      <div className="grid gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
        {/* Phones: the name, price and Buy come first; the big image and the
            details follow the prices (RiftCompare's card page, 2026-09-26). */}
        <div className="order-2 flex flex-col gap-4 md:order-1">
          {p.image && <div className="lv-frame hidden md:block"><img src={imageAt(p.image, "400w")!} alt={`${name} ${SITE.gameShort} card`} className="block w-full rounded-xl" width={400} height={560} /></div>}
          <dl className="card-surface grid grid-cols-2 gap-x-3 gap-y-1.5 p-4 text-sm">
            {set && (<><dt className="text-muted">Set</dt><dd><Link className="link" href={`/sets/${set.slug}`}>{set.name}</Link></dd></>)}
            {p.number && (<><dt className="text-muted">Number</dt><dd>{p.number}</dd></>)}
            {p.rarity && (<><dt className="text-muted">Rarity</dt><dd>{rarityHref(p.rarity) ? <Link className="link" href={rarityHref(p.rarity)!}>{p.rarity}</Link> : p.rarity}</dd></>)}
            {p.upc && (<><dt className="text-muted">{gtinLabel(p.upc)} barcode</dt><dd className="tabular-nums">{p.upc}</dd></>)}
            <dt className="text-muted">TCGplayer ID</dt><dd className="tabular-nums">{p.id}</dd>
            {p.sealedType && (<><dt className="text-muted">Type</dt><dd>{sealedHref(p.sealedType) ? <Link className="link" href={sealedHref(p.sealedType)!}>{p.sealedType}</Link> : p.sealedType}</dd></>)}
            {Object.entries(p.attrs).slice(0, 8).map(([k, v]) => { const hubs = attrHref(k, v); return (<Fragment key={k}><dt className="text-muted">{k.replace(/([a-z])([A-Z])/g, "$1 $2")}</dt><dd>{hubs ? hubs.map((l, i) => <Fragment key={l.label}>{i > 0 ? ", " : ""}{l.href ? <Link className="link" href={l.href}>{l.label}</Link> : l.label}</Fragment>) : v}</dd></Fragment>); })}
          </dl>
        </div>
        <div className="order-1 flex min-w-0 flex-col gap-6 md:order-2">
          <header>
            <div className="flex items-start gap-3">
              {p.image && <img src={imageAt(p.image, "200w")!} alt={name} className="w-20 shrink-0 rounded-md md:hidden" width={80} height={112} />}
              <h1 className="min-w-0 flex-1 font-display text-2xl font-black md:text-3xl">{name} {p.number && <span className="text-muted">{p.number}</span>} price</h1>
              <ShareButton path={`/card/${p.slug}`} name={`${name}${p.number ? ` ${p.number}` : ""}`} medium={p.kind === "sealed" ? "sealed" : "card"} offers={e.offers} compact className="mt-1" />
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <p><span className="lv-price text-3xl font-black text-brand-400">{money(ref)}</span> <span className="text-sm text-muted">TCGplayer market</span></p>
              <p className="text-sm">7d <span className={(e.change7d ?? 0) >= 0 ? "text-up" : "text-down"}>{pct(e.change7d)}</span> · 30d <span className={(e.change30d ?? 0) >= 0 ? "text-up" : "text-down"}>{pct(e.change30d)}</span></p>
              <p className="text-sm text-muted">{inStock.length} in-stock listing{inStock.length === 1 ? "" : "s"} worldwide</p>
            </div>
            <CardTopBuy offers={e.offers} productId={p.id} ebayQuery={`${SITE.ebay.query} ${name} ${p.number ?? ""}`.trim()} />
            {/* One short row of actions (Fiverr usability review, 2026-11-25: "a lot of the buttons have a lot of text"). */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <VaultOwn id={p.id} name={`${name}${p.number ? ` ${p.number}` : ""}`} href={`/card/${p.slug}`} image={p.image ? imageAt(p.image, "200w") : null} prices={lowestByMarket(e.offers)} hint={false} />
              <DropShare path={`/card/${p.slug}`} name={`${name}${p.number ? ` ${p.number}` : ""}`} offers={e.offers} short />
            </div>
            {Object.keys(e.tcg).length > 1 && (
              <p className="mt-2 flex flex-wrap gap-2 text-xs">
                {Object.entries(e.tcg).map(([k, v]) => (
                  <span key={k} className="chip">{k}: {money(v.market ?? v.mid ?? v.low)}</span>
                ))}
              </p>
            )}
            {SITE.priceAlerts && <WatchPrice site={SITE.key} productId={p.id} prices={lowestByMarket(e.offers)} />}
            {SITE.priceAlerts && <SeenPrice productId={p.id} prices={lowestByMarket(e.offers)} />}
          </header>
          {/* Jump links (owner, 2026-11-23 UX review, P1 13: a 9,500px product page needs anchors). Plain links, in the server HTML. */}
          <nav aria-label="On this page" className="no-scrollbar -mt-2 flex gap-2 overflow-x-auto text-xs"><a href="#prices" className="chip">Prices</a><a href="#history" className="chip">History</a><a href="#facts" className="chip">Facts</a></nav>
          <section id="prices" className="scroll-mt-24">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4">
              <h2 className="sec-title">Compare prices</h2>
              <CheckedAgo at={m?.updatedAt} />
            </div>
            <PriceTable offers={e.offers} fx={m?.fx ?? { USD: 1 }} productId={p.id} page="card" amazon={amazon} fetchTcg={fetchTcg} image={p.image ? imageAt(p.image, "200w") : null} product={`${name}${p.number ? ` ${p.number}` : ""}`} />
            {/* Fiverr usability review, 2026-11-25: "is this looking at all the pricing, or only the sites you get a commission from?" */}
            <p className="mt-2 text-xs text-muted">
              Every store we track is listed, whether it pays us or not, in price order. <Link className="link" href="/methodology">How we compare</Link>
            </p>
            {/* The eBay call-out sits under the stores, not above the cheapest one (owner, 2026-11-23 UX review, P1 10). */}
            <div className="mt-3"><EbayCallout offers={e.offers} productId={p.id} query={`${SITE.ebay.query} ${name} ${p.number ?? ""}`.trim()} /></div>
            {SITE.priceAlerts && <PriceAlert site={SITE.key} productId={p.id} prices={lowestByMarket(e.offers)} />}
          </section>
          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CARD} />
          <section id="history" className="scroll-mt-24 card-surface p-4">
            <h2 className="mb-2 text-lg font-bold">Price history</h2>
            <PriceHistory tcg={series} lows={storeLowsOf(p)} fx={m?.fx} through={historyThrough()} days={365} />
          </section>
          <section id="facts" className="scroll-mt-24 prose-site max-w-none text-sm">
            <h2>Is {name} worth it?</h2>
            <p>
              {name} {ref ? `sells for about ${money(ref)} on TCGplayer` : "has no TCGplayer market price yet"}
              {e.change30d != null ? `, ${e.change30d >= 0 ? "up" : "down"} ${Math.abs(e.change30d)}% over 30 days` : ""}. {usOffers.length ? `The cheapest in-stock US listing we track is ${money(usOffers[0].cents, usOffers[0].currency)}.` : ""} Prices from {SITE.stores.length} stores, TCGplayer and eBay are read and published every day; the line above says when these were checked.
            </p>
          </section>
        </div>
      </div>
      {related.length > 0 && (
        <section>
          <h2 className="mb-3 sec-title">More from {set?.name}</h2>
          <TileGrid items={related} />
        </section>
      )}
      <CardStickyBuyBar offers={e.offers} productId={p.id} />
      {/* Ads sit below the page's own content, never above it (2026-11-19, core-update quality pass). */}
      <InlineAds page="card" />
    </article>
  );
}
