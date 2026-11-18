import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { canon } from "@/lib/site";
import { StaticPage } from "@/components/StaticPage";
import { fitDescription } from "@/lib/seo-title";
import { ABOUT } from "@/content/about";

export const revalidate = 86400;
export const metadata: Metadata = { title: ABOUT.title, description: fitDescription(ABOUT.description), ...canon("/about") };

export default function About() {
  return (
    <StaticPage title={ABOUT.title}>
      <p>{SITE.name} is a free price comparison site for {SITE.game}. Every day it collects the price of every {SITE.gameShort} card and sealed product from TCGplayer, eBay and {SITE.stores.length} online game stores in the US, UK, Canada, Australia and Europe, and puts them side by side, cheapest first.</p>
      <h2>Who runs it</h2>
      {ABOUT.who.map((p) => (
        <p key={p.slice(0, 24)}>{p}</p>
      ))}
      {SITE.disclaimer && <p>{SITE.disclaimer}</p>}
      <h2>How we make money</h2>
      <p>Some buy links are affiliate links (eBay Partner Network, TCGplayer, Amazon): if you buy, the store may pay us a small commission at no cost to you. Amazon, eBay and TCGplayer, our affiliate partners, head each price table whatever their price, with &ldquo;Best price&rdquo; still marking the cheapest. The stores below them are ranked by price only — a store that pays us nothing ranks exactly where its price puts it.</p>
      <h2>What it costs to run</h2>
      <p>{ABOUT.cost}</p>
      <h2>Contact</h2>
      <p>Spotted a wrong price, or run a store that sells {SITE.gameShort}? <a href="/contact">Get in touch</a> or email <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.</p>
    </StaticPage>
  );
}
