import Link from "next/link";
import { SITE } from "@/site.config";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-700/60 bg-ink-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-4">
        <div>
          <p className="font-display font-black"><span className="wordmark">{SITE.wordmark[0]}</span> {SITE.wordmark[1]}</p>
          <p className="mt-2 text-muted">{SITE.tagline}. Free for everyone.</p>
        </div>
        <div>
          <p className="mb-2 font-semibold">Prices</p>
          <ul className="space-y-1 text-muted">
            <li><Link href="/cards">All cards</Link></li>
            <li><Link href="/sets">Set price guides</Link></li>
            <li><Link href="/sealed">Booster box prices</Link></li>
            <li><Link href="/movers">Price movers</Link></li>
            <li><Link href="/deals">Below-market deals</Link></li>
            <li><Link href="/preorders">Pre-orders</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold">{SITE.name}</p>
          <ul className="space-y-1 text-muted">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/methodology">How prices work</Link></li>
            <li><Link href="/stores">Stores we track</Link></li>
            <li><Link href="/blog">Guides</Link></li>
            <li><Link href="/premium">Premium</Link></li>
            <li><Link href="/contact">Contact / list your store</Link></li>
            <li><a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></li>
            <li><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold">Also from us</p>
          <ul className="space-y-1 text-muted">
            {SITE.sisterSites.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="noopener">{s.name}</a> <span className="text-xs">· {s.game}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-7xl px-4 pb-8 text-xs text-muted">
        {SITE.name} is an independent price comparison site, not affiliated with or endorsed by the publisher of {SITE.game}. As an eBay Partner, TCGplayer affiliate and Amazon Associate we may earn a commission from qualifying purchases made through links on this site, at no cost to you. Prices change often; the store&apos;s checkout price is final.
      </p>
    </footer>
  );
}
