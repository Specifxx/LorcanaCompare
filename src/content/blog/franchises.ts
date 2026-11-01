import type { Post } from "./types";

// The tables are live ({{attrstats:FACET}}, lib/post-render.ts): counts and prices update with every import.
export const post: Post = {
  slug: "lorcana-cards-by-disney-movie",
  title: "Which Disney movies have the most valuable Lorcana cards?",
  description: "Every Disney and Pixar franchise in Lorcana ranked by cards, median price and cards worth $10+, plus all six inks compared. Live prices, updated daily.",
  date: "2026-11-01",
  keywords: ["lorcana cards by movie", "frozen lorcana cards", "most valuable lorcana franchise", "lorcana stitch cards", "lorcana princess cards", "lorcana ink colors"],
  html: `
<p>Most people come to Disney Lorcana through a film they love: a Frozen fan wants every Elsa, a Lilo &amp; Stitch fan wants every Stitch. So which films have the most cards, and which are the most expensive to collect? The tables below are live and update every time we import prices.</p>

<h2>Every franchise, ranked by size</h2>
{{attrstats:franchise}}
<p><b>Median</b> is the middle card's TCGplayer market price, so one Iconic or Enchanted card can't skew it. <b>$10+</b> counts the cards worth ten dollars or more, which is where the cost of a complete collection really sits. Click any film for every card from it, most valuable first.</p>

<h2>What stands out</h2>
<ul>
<li><b>The classics are the biggest.</b> Aladdin, Frozen, Beauty and the Beast, Peter Pan and The Little Mermaid have the most cards, because Ravensburger has returned to them in almost every set.</li>
<li><b>Size is not cost.</b> A typical card from any film costs well under a dollar. A film's collection gets expensive through its Enchanted, Iconic and foil printings, which is what the $10+ column counts.</li>
<li><b>Pixar films run dearer per card.</b> Toy Story, The Incredibles and Coco have fewer cards but a higher median, because a larger share of them are recent premium printings.</li>
</ul>

<h2>The six inks</h2>
<p>Every card is also one of six ink colours, and a deck uses two. Here is how they compare:</p>
{{attrstats:ink}}
<p>The inks are close to even: Ravensburger prints a similar number of cards in each, and the median card in every ink costs a few cents. Dual-ink cards count in both of their inks.</p>

<h2>Heroes, villains and princesses</h2>
<p>Classifications are the words under a character's name. They are a handy way to collect across films: every princess, every villain, every Floodborn.</p>
{{attrstats:classification}}

<h2>Collect a film for less</h2>
<ol>
<li>Open the film above and pick the cards you want; the cheap ones are cents each.</li>
<li>Paste your list into the <a href="/tools/best-basket">best basket</a> tool to find the cheapest mix of stores, shipping included.</li>
<li>Chasing the Enchanted? Check its price before opening packs: buying the single is almost always cheaper. Our <a href="/blog/lorcana-booster-box-or-singles">box or singles guide</a> shows why.</li>
</ol>
`,
  faq: [
    { q: "Which Disney movie has the most Lorcana cards?", a: "Aladdin, Frozen and Beauty and the Beast have the most, with well over 100 cards each. Lorcana Compare's franchise table shows the live count for every film." },
    { q: "How many ink colours are there in Lorcana?", a: "Six: Amber, Amethyst, Emerald, Ruby, Sapphire and Steel. A deck uses up to two." },
  ],
};
