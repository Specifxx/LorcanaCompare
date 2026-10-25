import type { Post } from "./types";

export const post: Post = {
  slug: "most-expensive-lorcana-cards",
  title: "The most expensive Lorcana cards (updated daily)",
  description:
    "The 30 most expensive Disney Lorcana cards today, from Iconics and Enchanteds to the rare foil promos — live TCGplayer market prices with the cheapest place to buy each.",
  date: "2026-10-25",
  keywords: ["most expensive lorcana cards", "lorcana iconic cards", "most valuable lorcana cards", "lorcana enchanted list", "rarest lorcana cards"],
  html: `
<p>This list is rebuilt every morning from TCGplayer market prices for every Disney Lorcana card ever printed — 3,600+ cards across all 14 sets, the Illumineer's Quests and the promo lines. Click any card to compare every store and eBay listing for it.</p>

<h2>Top 30 most expensive Lorcana cards today</h2>
{{topall:30}}

<h2>Why these cards cost so much</h2>
<ul>
<li><b>Iconic rarity.</b> Since Fabled (Set 9), each main set has two Iconic cards, rarer than Enchanted. They dominate the top of the list — Mickey Mouse – Brave Little Prince and Minnie Mouse – Sweetheart Princess from Fabled, Buzz Lightyear and Merida from Wilds Unknown, and Hyperia City's Mickey Mouse – Best in Town.</li>
<li><b>Event and convention promos.</b> Foil promos given out at D23, Disney100 events and championships were printed in tiny numbers. A handful sell for thousands.</li>
<li><b>Early Enchanteds.</b> The First Chapter and Rise of the Floodborn Enchanteds were opened when the game was smallest, so fewer exist — and collector demand stayed even after those sets rotated out of Core.</li>
</ul>

<h2>What's next: Illustrious cards</h2>
<p>Set 15, <a href="/blog/into-the-inkdark-release-date-collector-boosters">Into the Inkdark</a>, introduces Collector Boosters and a new <b>Illustrious</b> rarity limited to 23 numbered copies of each card worldwide. Expect those to enter this list at the top in February 2027.</p>
`,
  faq: [
    { q: "What is the most expensive Lorcana card?", a: "It changes as prices move — the first row of the table above is today's answer, from TCGplayer's market price." },
    { q: "Which Lorcana rarity is the rarest?", a: "Iconic is the rarest pack rarity in current sets (two per set). From Into the Inkdark, Illustrious cards in Collector Boosters are rarer still, with 23 copies of each." },
  ],
};
