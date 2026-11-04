import type { Post } from "./types";

// A market-trend post (owner, 2026-11-04). The dated figures are the TCGplayer
// market prices in the 4 November 2026 public export (data/public), summed per
// set over every card with a price ("master set"); the live tokens reprice daily.
// No price is a forecast.
export const post: Post = {
  slug: "lorcana-iconic-era-where-set-value-went",
  title: "Lorcana's Iconic era: how Fabled changed what a set is worth, set by set",
  description:
    "Before Fabled, a Lorcana master set was worth US$1,100 to 3,500. Since, US$5,700 to 15,300, with one Iconic carrying a quarter of it. Fourteen sets of prices, the pattern, and what Into the Inkdark changes.",
  date: "2026-11-04",
  keywords: ["lorcana iconic cards", "lorcana set value", "lorcana enchanted prices", "fabled iconic price", "lorcana market 2026", "into the inkdark"],
  image: {
    src: "/blog/lorcana-iconic-era-where-set-value-went.jpg",
    alt: "A bar chart of Lorcana master-set value by set: The First Chapter US$3.5k, Reign of Jafar US$3.2k, Fabled US$15.3k, Winterspell US$7.0k, Hyperia City US$5.7k, on Lorcana Compare's dark gold branding",
  },
  html: `
<p>Disney Lorcana is a little over three years old. In that time Ravensburger has shipped fourteen main sets, and the game's prices have gone through two distinct eras: the <b>Enchanted era</b>, from The First Chapter in August 2023 to Reign of Jafar in May 2025, and the <b>Iconic era</b> that began with Fabled in August 2025. The dividing line is sharp enough to see in a single number. We added up the TCGplayer market price of one of every card in each set (the "master set"), as of 4 November 2026, and the answer changes by a factor of three to five the moment Iconics arrive.</p>

<p>Every live figure below reprices each morning from the same data as the card pages. The dated figures in the text are from 4 November 2026 and are there so the comparison stays honest when the live numbers move.</p>

<h2>The Enchanted era: eight sets, US$1,100 to 3,500 each</h2>
<p>For the first two years a Lorcana set's value lived in its Enchanted cards, twelve to eighteen per set, and the rest of the set was worth very little. On 4 November the master sets looked like this:</p>
<ul>
<li><b>The First Chapter</b> (Aug 2023): US$3,504, led by {{card:510153}} at {{price:510153}}. The only early set with a four-figure top card, because it was printed before anyone knew how big the game would be.</li>
<li><b>Rise of the Floodborn</b> (Nov 2023): US$1,148.</li>
<li><b>Into the Inklands</b> (Feb 2024): US$1,286.</li>
<li><b>Ursula's Return</b> (May 2024): US$1,337.</li>
<li><b>Shimmering Skies</b> (Aug 2024): US$1,527.</li>
<li><b>Azurite Sea</b> (Nov 2024): US$1,238.</li>
<li><b>Archazia's Island</b> (Mar 2025): US$2,483.</li>
<li><b>Reign of Jafar</b> (May 2025): US$3,198, led by {{card:633104}} at {{price:633104}}.</li>
</ul>
<p>Two things stand out. Sets two to six are nearly identical in value, around US$1,200 to 1,500, which is what a set looks like when it is printed to demand and the only chase is an Enchanted tier of roughly equal cards. And the climb from Azurite Sea to Reign of Jafar is the first sign of a change: more Enchanted cards per set, and better-known characters in the Enchanted slot.</p>

<h2>The Iconic era: Fabled and after, US$5,700 to 15,300</h2>
<p>Fabled (August 2025) added two rarities above Enchanted: <b>Epic</b> and <b>Iconic</b>. The Iconics are the game's lottery tickets, two per set and far rarer than an Enchanted, and they rewrote the value of a set overnight:</p>
<ul>
<li><b>Fabled</b> (Aug 2025): US$15,297, with {{card:647663}} at {{price:647663}}. The most valuable Lorcana set by a wide margin, and the one with the most cards over US$200: seventeen.</li>
<li><b>Whispers in the Well</b> (Nov 2025): US$6,276, led by {{card:657885}} at {{price:657885}}.</li>
<li><b>Winterspell</b> (Feb 2026): US$7,018, led by {{card:673300}} at {{price:673300}}.</li>
<li><b>Wilds Unknown</b> (May 2026): US$7,135, led by {{card:690216}} at {{price:690216}}.</li>
<li><b>Attack of the Vine!</b> (Jul 2026): US$6,486, led by {{card:702667}} at {{price:702667}}.</li>
<li><b>Hyperia City</b> (Oct 2026): US$5,731 two weeks after release, led by {{card:722591}} at {{price:722591}}.</li>
</ul>
<p>The pattern since Fabled is steady: a set is worth US$6,000 to 7,000 at TCGplayer market, and <b>one Iconic carries about a quarter of it</b>. Fabled is the outlier because it was the first set with the new rarities, it reprinted the game's most popular characters, and it has had fifteen months for its supply to be opened and absorbed. The sets after it have settled into a narrower band.</p>

<h2>What did not change: the floor</h2>
<p>The median card in every one of the fourteen sets is worth between US$0.17 and US$0.37. A playset of any common, uncommon or rare costs less than a booster pack. That was true in 2023 and it is true today; Iconics made the top of the game more expensive without making the game more expensive to play. Our <a href="/blog/lorcana-booster-box-or-singles">box or singles</a> guide works through what that means for a buyer, and the <a href="/blog/most-expensive-lorcana-cards">most expensive Lorcana cards</a> list shows where the four-figure prices sit today.</p>

<h2>Hyperia City right now</h2>
<p>Hyperia City released on 23 October 2026 and is the freshest data point for how an Iconic-era set settles. Its two Iconics and eighteen Enchanteds, repriced daily:</p>
{{toplist:24740:12}}
<p>A booster box is {{price:706239}} at TCGplayer market; compare every store on the <a href="/card/disney-lorcana-hyperia-city-booster-box">Hyperia City booster box</a> page. Our <a href="/blog/hyperia-city-card-list-prices">Hyperia City price guide</a> follows the set day by day.</p>

<h2>Where it goes next: Into the Inkdark, 5 February 2027</h2>
<p><a href="/blog/into-the-inkdark-release-date-collector-boosters">Into the Inkdark</a>, Set 15, is dated 5 February 2027 and is already listed for pre-order. Based on the five Iconic-era sets so far, this is the pattern to expect, as a pattern rather than a prediction:</p>
<ol>
<li><b>A master set of US$6,000 to 7,000 within a month of release</b>, with the two Iconics at US$1,200 to 2,000 each and the Enchanteds mostly between US$100 and 300.</li>
<li><b>Pre-order prices for the Iconics will be the highest prices.</b> Every Iconic-era set's top card listed highest in its first two weeks and settled lower as boxes were opened.</li>
<li><b>The set before it (Hyperia City) will lose value in February.</b> In each release month we can measure, the previous set's Enchanteds repriced down as attention moved.</li>
<li><b>Fabled stays the exception.</b> It is the only Iconic-era set whose value has grown with age, and nothing on the 2027 calendar reprints its Iconics.</li>
</ol>
<p>The one thing that would break the pattern is a change to the rarity structure itself, as Fabled was. Ravensburger has not announced one for Into the Inkdark.</p>

<p><i>Data: TCGplayer market prices in Lorcana Compare's public export of 4 November 2026, one of each card per set. A description of how prices have behaved, not investment advice.</i></p>
`,
  faq: [
    { q: "What is the most valuable Lorcana set?", a: "By the sum of TCGplayer market prices for one of every card, Fabled (August 2025): US$15,297 on 4 November 2026, led by Mickey Mouse – Brave Little Prince (Iconic). The next most valuable are Wilds Unknown, Winterspell and Attack of the Vine!, each around US$6,500 to 7,100." },
    { q: "Why are Lorcana sets worth more since Fabled?", a: "Fabled added the Epic and Iconic rarities above Enchanted. Each set since has two Iconics that are far rarer than Enchanteds and sell for US$1,200 to 3,900, so a set's master-set value went from US$1,100 to 3,500 in the Enchanted era to US$5,700 to 15,300 since." },
    { q: "Are older Lorcana sets going up in value?", a: "The First Chapter is the only early set with a four-figure card, and Fabled is the only Iconic-era set whose value has risen with age. Sets two to eight have stayed between US$1,100 and 3,500 at TCGplayer market; their Enchanteds have mostly held, not climbed." },
    { q: "When is Into the Inkdark released?", a: "Set 15, Into the Inkdark, is dated 5 February 2027 and is listed for pre-order now." },
  ],
};
