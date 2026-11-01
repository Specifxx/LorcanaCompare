import type { Post } from "./types";

// Prices are live tokens (lib/post-render.ts), so every figure is today's TCGplayer market price.
export const post: Post = {
  slug: "lorcana-gift-guide",
  title: "Disney Lorcana gift guide 2026: the best presents at every budget",
  description: "Disney Lorcana gifts from a $8 booster pack to a sealed box: starter decks, gift sets, Illumineer's Troves and booster boxes, with today's prices and the cheapest store.",
  date: "2026-11-01",
  keywords: ["lorcana gift", "disney lorcana christmas gift", "lorcana gift ideas", "lorcana gift set", "best lorcana booster box", "lorcana for beginners"],
  html: `
<p>Disney Lorcana is one of the easiest card games to give as a present: everyone knows the characters, and the starter products are made for people who have never played. Here is what to buy at each budget, with today's market prices. Every product links to its page, where we compare TCGplayer, eBay and every store we track, cheapest in-stock first.</p>

<h2>Under $15: stocking fillers</h2>
<ul>
<li>A booster pack of the newest set, {{card:706241}}: {{price:706241}}.</li>
<li>Packs from recent sets are often cheaper still: {{card:690386}} ({{price:690386}}) or {{card:678167}} ({{price:678167}}).</li>
<li>For a fan of one film, a single card of their favourite character is a lovely small present. Browse by film on our <a href="/cards/franchise">Lorcana cards by franchise</a> page.</li>
</ul>

<h2>$40 to $110: a first deck or a gift set</h2>
<ul>
<li><b>A starter deck</b> is the right present for a new player: a ready-to-play deck in two ink colours with the rules inside. Compare every one on the <a href="/sealed/starter-deck">starter deck price list</a>, such as {{card:645305}} ({{price:645305}}).</li>
<li><b>{{card:646033}}</b> ({{price:646033}}): a two-player starter set, so a parent and child or two friends can learn together.</li>
<li><b>Gift boxes and bundles</b>: {{card:719729}} ({{price:719729}}) or {{card:719823}} ({{price:719823}}). See every one on the <a href="/sealed/collection">gift set price list</a>.</li>
<li><b>An Illumineer's Trove</b>: eight packs, dividers and a storage box. {{card:706243}} ({{price:706243}}) or {{card:690388}} ({{price:690388}}). Every trove is on the <a href="/sealed/illumineers-trove">trove price list</a>.</li>
</ul>

<h2>$130 to $250: a booster box</h2>
<p>A 24-pack booster box is the big present for someone who already plays or collects. Recent boxes:</p>
<ul>
<li>{{card:706239}}: {{price:706239}} (the newest set)</li>
<li>{{card:690384}}: {{price:690384}}</li>
<li>{{card:678165}}: {{price:678165}}</li>
<li>{{card:664819}}: {{price:664819}}</li>
<li>{{card:652703}}: {{price:652703}}</li>
</ul>
<p>Box prices move week to week, and stores often sit under TCGplayer's market. The <a href="/sealed/booster-box">booster box price list</a> shows the cheapest store for each, and the <a href="/tools/best-basket">best basket</a> tool prices several items in one order, shipping included.</p>

<h2>For the collector</h2>
<p>Sealed boxes of older sets now trade well above their launch price: {{card:485256}} is {{price:485256}} and {{card:645298}} is {{price:645298}}. Curator's Collections and D23 sets are collector's pieces too. If you buy at those prices, buy from a store or seller you trust and check the wrap.</p>

<h2>Buying tips for the holidays</h2>
<ol>
<li><b>Order early.</b> The newest set's boxes and troves sell out in December, and prices rise when they do.</li>
<li><b>Know what they play.</b> Lorcana decks use two of the six inks. Ask which they like, or pick a starter deck in their favourite characters' colours. Our <a href="/cards/ink">cards by ink</a> page shows all six.</li>
<li><b>Outside the US?</b> Switch the market at the top of any page for stores in your country, in your currency.</li>
</ol>
`,
  faq: [
    { q: "What is a good Disney Lorcana gift for a beginner?", a: "A starter deck, or a two-player starter set if two people will learn together. Both are ready to play with the rules inside." },
    { q: "How much is a Disney Lorcana booster box?", a: "Recent booster boxes trade at roughly $130 to $250 on TCGplayer; early sets such as The First Chapter and Fabled cost much more. Lorcana Compare shows today's price and the cheapest store for each." },
  ],
};
