import type { Metadata } from "next";
import Link from "@/components/Link";
import { SITE } from "@/site.config";
import { canon } from "@/lib/site";
import { posts } from "@/lib/posts";
import { fitDescription } from "@/lib/seo-title";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: `${SITE.gameShort} guides and price analysis`,
  description: fitDescription(`Guides to buying ${SITE.game} cards: set price guides, most valuable cards, where to buy and pre-order advice.`),
  ...canon("/blog"),
};

export default function Blog() {
  return (
    <div>
      <header className="page-head">
        <h1 className="page-title">{SITE.gameShort} guides</h1>
      </header>
      {/* The home page's guide cards, with each guide's picture on top (2026-11-14): two across from a tablet, three on a wide screen. */}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {posts().map((p) => (
          <li key={p.slug} className="card-surface group flex flex-col overflow-hidden transition-colors hover:border-brand/60">
            {p.image && (
              <Link href={`/blog/${p.slug}`} className="block overflow-hidden border-b border-ink-700/60" tabIndex={-1}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image.src} alt={p.image.alt} width={1200} height={630} loading="lazy" decoding="async" className="aspect-[1200/630] w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
              </Link>
            )}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <Link href={`/blog/${p.slug}`} className="font-semibold leading-snug hover:underline">{p.title}</Link>
              <p className="mt-1.5 line-clamp-3 text-sm text-muted">{p.description}</p>
              <p className="mt-auto pt-3 text-xs text-muted">{p.updated ?? p.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
