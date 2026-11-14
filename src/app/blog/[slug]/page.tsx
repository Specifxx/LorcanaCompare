import type { Metadata } from "next";
import Link from "@/components/Link";
import { notFound } from "next/navigation";
import { SITE } from "@/site.config";
import { morePosts, postBySlug, posts } from "@/lib/posts";
import { TOOLS } from "@/lib/tool-list";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";
import { abs } from "@/lib/site";
import { renderPost } from "@/lib/post-render";
import { fitDescription } from "@/lib/seo-title";

export const revalidate = 86400;
// Blog posts are code, not database rows: prerendering them costs nothing.
export const generateStaticParams = () => posts().map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = postBySlug(params.slug);
  if (!p) return {};
  const image = p.image?.src ?? "/opengraph-image.jpg";
  const description = fitDescription(p.description);
  return { title: p.title, description, keywords: p.keywords, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: "article", siteName: SITE.name, url: `/blog/${p.slug}`, title: p.title, description, publishedTime: p.date, images: [{ url: image, width: 1200, height: 630, alt: p.image?.alt ?? p.title }] }, twitter: { card: "summary_large_image", images: [image] } };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const p = postBySlug(params.slug);
  if (!p) notFound();
  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.description, datePublished: p.date, dateModified: p.updated ?? p.date, image: abs(p.image?.src ?? "/opengraph-image.jpg"), author: { "@type": "Organization", name: SITE.name, url: abs("/about") }, publisher: { "@type": "Organization", name: SITE.name, url: abs("/"), logo: { "@type": "ImageObject", url: abs("/icon.svg") } }, mainEntityOfPage: abs(`/blog/${p.slug}`) }} />
      {p.faq && <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />}
      <Breadcrumbs items={[{ name: "Guides", href: "/blog" }, { name: p.title }]} />
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{p.updated ? `Updated ${p.updated}` : p.date}</p>
      <h1 className="mt-2 page-title">{p.title}</h1>
      <p className="page-lede">{p.description}</p>
      {p.image && (
        // The post's own thumbnail, a static file in public/blog: no optimiser, no function.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image.src} alt={p.image.alt} width={1200} height={630} className="mt-6 aspect-[1200/630] w-full rounded-xl border border-ink-800 object-cover" />
      )}
      <div className="prose-site mt-8" dangerouslySetInnerHTML={{ __html: renderPost(p.html) }} />
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE} className="my-6" />
      {p.faq && (
        <section className="mt-12 max-w-[65ch]">
          <h2 className="mb-3 sec-title">FAQ</h2>
          {p.faq.map((f) => (<div key={f.q} className="border-b border-ink-800 py-4 last:border-b-0"><h3 className="font-semibold">{f.q}</h3><p className="mt-1.5 text-[15px] leading-relaxed text-muted">{f.a}</p></div>))}
        </section>
      )}
      {/* Every article hands the reader on to more reading and a tool, as Rift Compare's do (its "Related tools" row). */}
      <nav className="card-surface mt-12 grid gap-6 p-5 text-sm sm:grid-cols-2 sm:p-6" aria-label="Read next">
        <div>
          <p className="font-semibold">More guides</p>
          <ul className="mt-2 space-y-2">{morePosts(p.slug).map((x) => <li key={x.slug}><Link className="link" href={`/blog/${x.slug}`}>{x.title}</Link></li>)}</ul>
        </div>
        <div>
          <p className="font-semibold">Free price tools</p>
          <ul className="mt-2 space-y-2">{TOOLS.slice(0, 4).map((t) => <li key={t.href}><Link className="link" href={t.href}>{t.name}</Link></li>)}</ul>
        </div>
      </nav>
      <aside className="mt-8 border-t border-ink-800 pt-6 text-sm">
        <p className="font-semibold">Also from us</p>
        <p className="mt-1 text-muted">{SITE.sisterSites.map((s, i) => (<span key={s.url}>{i ? " · " : ""}<a className="link" href={s.url} rel="noopener">{s.anchor ?? s.name}</a> ({s.anchor ? s.name : s.game})</span>))}</p>
      </aside>
    </article>
  );
}
