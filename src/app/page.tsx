import Link from "@/components/Link";
import { InlineAds } from "@/components/InlineAds";
import { SITE } from "@/site.config";
import { SearchBox } from "@/components/SearchBox";
import { MarketChooser } from "@/components/ClientPrefs";
import { CreatorsBubble } from "@/components/creators/CreatorsBubble";
import { HeroSparks } from "@/components/HeroSparks";
import { ChristmasGifts } from "@/components/ChristmasGifts";
import { TileGrid } from "@/components/ProductTile";
import { byValue, deals, latestReleasedSet, meta, products } from "@/lib/data";
import { ago, money } from "@/lib/format";
import { LiveAgo } from "@/components/LiveAgo";
import { posts } from "@/lib/posts";
import { shortName } from "@/lib/names";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fitTitle, fitDescription } from "@/lib/seo-title";
import { featuredSealed, preorderSetList, sealedHubs } from "@/lib/hubs";
import { isPreorder, preorderPath } from "@/lib/preorders";
import { inSeason as bfSeason } from "@/lib/black-friday";
import { CORE_SALES, salesInSeason } from "@/lib/sale-seasons";
import { kits, kitsOn, popular } from "@/lib/kits";
import { KitGrid } from "@/components/KitTile";
import { SealedHero } from "@/components/SealedHero";
import { SiteReviews } from "@/components/site-reviews/SiteReviews";
import { sealedHero } from "@/lib/sealed-hero";
import { GameTiles } from "@/components/GameTiles";
import { rankBy, rankProducts } from "@/lib/home-demand";

// The homepage leads with "<game> Card Prices" and the number of stores compared, as Rift Compare's does.
export function generateMetadata(): Metadata {
  const n = SITE.stores.length;
  // Keyword first, brand last (SEO audit, 2026-11-03: a long game name pushed the brand off Cyberpunk's title). Every
  // candidate is tried with the brand before any is tried bare.
  const g = SITE.gameShort;
  const brand = ` | ${SITE.name}`;
  const title = fitTitle([`${g} Card Prices — Compare ${n} Stores${brand}`, `${g} Card Prices — ${n} Stores${brand}`, `${g} Card Prices${brand}`, `${g} Card Prices — Compare ${n} Stores`, `${g} Card Prices`]);
  return {
    title,
    description: fitDescription(`Compare ${SITE.game} card and booster box prices across TCGplayer, eBay and ${n} online stores. Cheapest in-stock first, in your currency, updated daily.`),
    alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
    openGraph: { type: "website", siteName: SITE.name, url: "/", title: title.absolute },
  };
}

export const revalidate = 21600;

// The page, in RiftCompare's order (owner, 2026-11-03: "the way they structure
// it, today's top deals, chase cards, what people say, and then the blog
// posts"): a centred hero with the search, the region pills and trending
// chips; today's top deals; sealed; the newest set's chase cards; what people
// say; guides; the FAQ. Nothing else: the tools, movers, pre-order and set
// grids, the hub chip rows and the ad strips that used to follow the hero are
// gone from here (the rail links them): "less is more" (owner, same day).
export default function Home() {
  const m = meta();
  const latest = latestReleasedSet();
  const releases = preorderSetList();
  const upcoming = releases.find((s) => isPreorder(s)) ?? null;
  // MOST POPULAR FIRST (owner, 2026-11-20: "maybe the chase cards, we can get rid of that section now … just have the most popular as
  // the first, as what shows on the homepage, and this should be across all sites"): every priced card and sealed product (no
  // inserts), ordered by what visitors opened and bought (lib/home-rank.ts, data/demand.json). It replaces the newest set's chase
  // cards, which stay on that set's page.
  const popularItems = rankProducts(byValue(products().filter((p) => p.kind === "card" || (p.kind === "sealed" && p.sealedType !== "Insert")))).slice(0, 12);
  // Trending chips: the most valuable chase-rarity cards (SITE.chaseRarities), so a
  // tokens-and-markers catalogue never fills the row with "Energy Marker" (BandaiCompare).
  const cards = products().filter((p) => p.kind === "card");
  const chaseOnly = cards.filter((p) => p.rarity && SITE.chaseRarities.includes(p.rarity));
  const trending = rankProducts(byValue(chaseOnly.length >= 6 ? chaseOnly : cards.filter((p) => p.rarity))).slice(0, 6);
  // Most likely to earn first (owner, 2026-11-18; lib/home-rank.ts): demand × value over three times as many deals.
  const topDeals = rankBy(deals(18), (d) => d.p).slice(0, 6);
  const shelf = featuredSealed(6);
  const sealedLinks = sealedHubs();
  // The sealed shelf: one tabbed, swipeable row (components/SealedHero.tsx) on every site.
  const hero = sealedHero();
  const storeCount = SITE.stores.length;
  const today = (m?.updatedAt ?? new Date().toISOString()).slice(0, 10);
  const faqs = [
    { q: `What is ${SITE.name}?`, a: `${SITE.name} is a free ${SITE.game} price comparison site. It compares prices for every ${SITE.gameShort} card and sealed product across TCGplayer, eBay and ${storeCount} online game stores in the US, UK, Canada, Australia and Europe, and updates them every day.` },
    { q: `Where is the cheapest place to buy ${SITE.gameShort} cards?`, a: `It changes card by card. Search a card on ${SITE.name} to see every store's price for it, cheapest in-stock first, in your own currency, with a direct link to buy.` },
    { q: `How often are ${SITE.gameShort} prices updated?`, a: `We read TCGplayer and every store each day, and the site publishes them the same day, so every price page says when its prices were checked (in amber once they are over 12 hours old). eBay listings for cards worth $${SITE.ebay.minPriceUsd} or more are re-checked every one to four days depending on value and demand.` },
    { q: `Is ${SITE.name} free?`, a: `Yes, completely, and you don't need an account. ${SITE.name} is paid for by affiliate commissions: when you buy through some links, the store may pay us a small fee at no cost to you.` },
  ];
  return (
    <div className="flex flex-col gap-12">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE.name, url: SITE_URL, logo: `${SITE_URL}/icon.svg` }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE_URL, publisher: { "@id": `${SITE_URL}/#org` }, potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/cards?q={q}`, "query-input": "required name=q" } }} />
      {/* The products on this page, by their own URLs: the most popular, then the sealed shelf (SEO audit, 2026-11-03; 2026-11-20). */}
      {shelf.length + popularItems.length > 0 && (
        <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: `Most popular ${SITE.gameShort} card and sealed prices`, itemListElement: [...popularItems, ...shelf.filter((x) => !popularItems.some((y) => y.id === x.id))].map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/card/${p.slug}`, name: p.name })) }} />
      )}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />

      {/* The hero: full-bleed across the content column and tall enough to fill
          the first screen, like RiftCompare's (owner, 2026-11-03: "the hero can
          fit more like riftcompare … everything should be fill"); the search as
          its one action, the living background behind it (HeroSparks) and the
          creators bubble in its corner. `hero-bleed` (globals.css) breaks out of
          the page container; `hero-search` keeps the suggestions above what follows. */}
      <section className="hero-band hero-bleed relative -mt-6 flex flex-col items-center justify-center overflow-x-clip px-4 pb-6 pt-6 text-center sm:px-8 sm:pb-14 sm:pt-12">
        <HeroSparks />
        {/* Phone hero, 2026-11-19 (owner: "way too much going on in the mobile version of the home page"): the headline, the
            words and the link to every card. The header already has the search and the market, so the creators bubble, the
            market row, trending chips and counts show from sm up; the sealed shelf follows straight after. Same HTML at
            every width. */}
        <div className="hidden sm:contents"><CreatorsBubble /></div>
        <ChristmasGifts />
        <p className="mx-auto hidden items-center justify-center gap-2 font-display text-base font-black sm:flex">
          <img src="/icon.svg" alt={`${SITE.name} logo`} width={28} height={28} className="h-7 w-7 rounded-lg" />
          <span className="wordmark">{SITE.wordmark[0]}</span>
          <span className="text-fg">{SITE.wordmark[1]}</span>
        </p>
        <h1 className="hero-glow mx-auto mt-3 max-w-4xl font-display text-3xl font-black leading-[1.1] sm:text-5xl lg:text-6xl">
          <span className="wordmark">{SITE.gameShort}</span> Card Prices
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base text-muted sm:text-lg">
          <strong className="block text-fg">Buy {SITE.gameShort} cards at the best price</strong>
          Price check any card or sealed product and find the cheapest place to buy: live prices from TCGplayer, eBay and {storeCount} stores in the US, UK, Canada, Australia and Europe, in your own currency, updated daily.
        </p>
        <div className="hero-search relative z-30 mx-auto mt-6 hidden w-full max-w-3xl sm:block"><SearchBox big /></div>
        <div className="hidden sm:block">
          <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-muted">Shopping from</p>
          <MarketChooser className="mt-2 justify-center" bare />
        </div>
        {trending.length > 0 && (
          <div className="mx-auto mt-5 hidden w-full max-w-3xl sm:block">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Trending</p>
            <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {trending.map((p) => (
                <li key={p.id}>
                  <Link href={`/card/${p.slug}`} className="block truncate rounded-xl border border-ink-700 bg-ink-900/70 px-3 py-2.5 text-sm text-fg/85 transition-colors hover:border-brand hover:text-fg">
                    {shortName(p.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-5 hidden text-xs text-muted sm:block">
          {m ? (
            <>
              {`${m.counts.cards.toLocaleString()} cards · ${m.counts.sealed} sealed products · ${storeCount} stores · prices updated `}
              <LiveAgo iso={m.updatedAt} initial={ago(m.updatedAt)} />
            </>
          ) : (
            "Prices update daily"
          )}
          {upcoming && <> · <Link className="link" href={preorderPath(upcoming)}>{upcoming.name} pre-orders →</Link></>}
        </p>
        <p className="mt-4 text-sm sm:mt-3"><Link href="/cards" className="link font-semibold">All {m?.counts.cards.toLocaleString() ?? ""} cards in the database →</Link></p>
      </section>

      {/* Multi-game sites (SITE.lines): one tile per game, straight under the hero. */}
      <GameTiles />

      {/* Most popular first, straight under the hero and the game tiles (owner, 2026-11-20). One sideways row on a phone. */}
      {popularItems.length > 0 && (
        <section className="sd shelf-phone">
          {/* The weekly Hot 100 as words in the header (merch M21, 2026-11-25: /hot-100 was the site's most viewed page in the last 7 days and the home did not link it). */}
          <Header title={`Most popular ${SITE.gameShort} prices`} href="/cards" sub={<>What shoppers open and buy most right now, each with every store&apos;s price. <Link href="/hot-100" className="link font-semibold">This week&apos;s Hot 100 →</Link></>} all="All cards" />
          <TileGrid items={popularItems} />
        </section>
      )}

      {/* Sealed is as big a market as singles: one section the size of the chase-cards one, tabs for the boxes and each pre-order. */}
      {hero.featured.length + hero.preorders.length > 0 && (
        <div className="sd">
          <SealedHero data={hero} game={SITE.gameShort} sealedHref={sealedLinks.some((h) => h.slug === "booster-box") ? "/sealed/booster-box" : "/sealed"} />
        </div>
      )}

      {/* Model kits (SITE.kits): the kits most shops have in stock. */}
      {SITE.kits && kitsOn() && (
        <section className="sd shelf-phone">
          <Header title={`${SITE.kits.label} prices`} href="/kits" sub={`${kits().length.toLocaleString()} ${SITE.kits.noun} across ${SITE.kits.stores.length} hobby shops, matched by barcode.`} />
          <KitGrid items={popular(kits()).slice(0, 6)} />
        </section>
      )}

      {/* Today's top deals sit below the products (owner, 2026-11-16; Most popular replaced the chase cards 2026-11-20). */}
      {topDeals.length > 0 && (
        <section className="sd">
          <Header title="Today's top deals" href="/tools/deal-finder" sub="In-stock listings below TCGplayer market, refreshed daily." all="Browse all deals" />
          {bfSeason(today) && <p className="mb-3 text-sm"><Link className="link" href="/black-friday">Black Friday deals</Link> · <Link className="link" href="/cyber-monday">Cyber Monday deals</Link>, updated daily →</p>}
          {salesInSeason(CORE_SALES, today).map((s) => (
            <p key={s.slug} className="mb-3 text-sm"><Link className="link" href={`/${s.slug}`}>{s.linkLabel}, updated daily →</Link></p>
          ))}
          <div className="sd-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topDeals.map((d) => (
              <Link key={`${d.p.id}${d.offer.source}`} href={`/card/${d.p.slug}`} className="card-surface flex min-w-0 items-center gap-3 p-3 transition hover:border-brand/60">
                {d.p.image && <img src={d.p.image} alt={d.p.name} className="h-20 w-14 object-contain" loading="lazy" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{shortName(d.p.name)}</p>
                  <p className="text-xs text-muted">Market {money(d.market)}</p>
                  <p className="text-sm"><b className="text-buy-400">{money(d.offer.cents, d.offer.currency)}</b> <span className="text-xs text-muted" title="How far under TCGplayer's market price (recent US sales) this store price is">({d.saving}% under TCGplayer)</span></p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}


      {/* The ad banners mid-page (owner, 2026-11-25: they sat at the very foot of the page): after the products and deals the visitor came
          for, before the reviews, guides and questions; never under the hero (2026-11-19 quality pass). */}
      <InlineAds page="home" />

      {/* The site's own star score and approved reviews (owner, 2026-11-03), loaded in the browser; nothing until there is a rating. */}
      <SiteReviews />

      {/* The guide cards from sm up (2026-11-19): on a phone the menu and footer reach the blog. */}
      {posts().length > 0 && (
        <section className="sd hidden sm:block">
          <Header title="Guides" href="/blog" sub={`Buying guides and price explainers for ${SITE.gameShort}.`} />
          <div className="sd-stagger grid gap-3 md:grid-cols-3">
            {posts().slice(0, 3).map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card-surface p-5 transition hover:border-brand/60">
                <p className="font-semibold">{p.title}</p>
                <p className="mt-1 line-clamp-3 text-sm text-muted">{p.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="sd max-w-3xl">
        <h2 className="mb-3 sec-title">Frequently asked questions</h2>
        {faqs.map((f) => (
          <details key={f.q} className="border-b border-ink-800 py-3">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-2 text-sm text-muted">{f.a}</p>
          </details>
        ))}
      </section>
      <p className="sr-only">{products().length} products tracked</p>
    </div>
  );
}

function Header({ title, href, sub, all = "See all" }: { title: string; href?: string; sub?: ReactNode; all?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0 flex-1 basis-64">
        <h2 className="sec-title">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
      </div>
      {href && <Link href={href} className="btn-ghost shrink-0 px-3.5 py-1.5 text-xs sm:text-sm">{all} →</Link>}
    </div>
  );
}
