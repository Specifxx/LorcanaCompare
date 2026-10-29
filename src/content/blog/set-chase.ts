import type { Post } from "./types";

// One "most valuable cards" post per main set (29 October 2026, owner: set and chase-card searches are what bring RiftCompare its Google traffic), plus the cross-set Iconic, Enchanted and Epic lists. Written from the 28 October data by a script; counts are typed with that date, every price in a table or {{price}} token is live.
export const SET_POSTS: Post[] = [
  {
    slug: "the-first-chapter-most-valuable-cards",
    title: "The First Chapter Most Valuable Cards: Lorcana Set 1",
    description: "The most valuable The First Chapter cards today, from live TCGplayer and store prices: the top 20, every Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["the first chapter most valuable cards", "the first chapter chase cards", "the first chapter card prices", "the first chapter enchanted cards", "the first chapter booster box price"],
    html: `
<p><b>The First Chapter</b> is Disney Lorcana's Set 1. TCGplayer lists <b>218 cards</b> in it (72 Common, 54 Uncommon, 49 Rare, 19 Super Rare, 12 Legendary, 12 Enchanted). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/the-first-chapter">The First Chapter's full card list</a>.</p>

<h2>The 20 most valuable cards in The First Chapter</h2>
{{toplist:22937:20}}

<h2>The First Chapter Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. The First Chapter has <b>12</b>. The dearest three are {{card:510153}} ({{price:510153}}), {{card:510154}} ({{price:510154}}) and {{card:510152}} ({{price:510152}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>89%</b> of the set's total value (US$3,207.27 across 218 priced cards). 12 cards were worth US$100 or more, and <b>189 of 218</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>The First Chapter booster box and sealed prices</h2>
<p>A booster box of The First Chapter is {{price:485256}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:22937}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-the-first-chapter-booster-box">The First Chapter's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/rise-of-the-floodborn-most-valuable-cards">Rise of the Floodborn</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive The First Chapter card?", a: "On 28 October 2026 it was Elsa - Spirit of Winter (Enchanted) at US$952.84 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in The First Chapter?", a: "TCGplayer lists 218 cards in The First Chapter: 72 Common, 54 Uncommon, 49 Rare, 19 Super Rare, 12 Legendary, 12 Enchanted." },
      { q: "Is a booster box of The First Chapter worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 89% of the set's value and 189 of 218 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "rise-of-the-floodborn-most-valuable-cards",
    title: "Rise of the Floodborn Most Valuable Cards: Lorcana Set 2",
    description: "The most valuable Rise of the Floodborn cards today, from live TCGplayer and store prices: the top 20, every Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["rise of the floodborn most valuable cards", "rise of the floodborn chase cards", "rise of the floodborn card prices", "rise of the floodborn enchanted cards", "rise of the floodborn booster box price"],
    html: `
<p><b>Rise of the Floodborn</b> is Disney Lorcana's Set 2. TCGplayer lists <b>218 cards</b> in it (73 Common, 55 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 12 Enchanted). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/rise-of-the-floodborn">Rise of the Floodborn's full card list</a>.</p>

<h2>The 20 most valuable cards in Rise of the Floodborn</h2>
{{toplist:23303:20}}

<h2>Rise of the Floodborn Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Rise of the Floodborn has <b>12</b>. The dearest three are {{card:527802}} ({{price:527802}}), {{card:528111}} ({{price:528111}}) and {{card:527799}} ({{price:527799}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>88%</b> of the set's total value (US$1,053.17 across 218 priced cards). 3 cards were worth US$100 or more, and <b>197 of 218</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Rise of the Floodborn booster box and sealed prices</h2>
<p>A booster box of Rise of the Floodborn is {{price:516276}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:23303}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-rise-of-the-floodborn-booster-box">Rise of the Floodborn's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/the-first-chapter-most-valuable-cards">The First Chapter</a> and <a href="/blog/into-the-inklands-most-valuable-cards">Into the Inklands</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Rise of the Floodborn card?", a: "On 28 October 2026 it was Cinderella - Ballroom Sensation (Enchanted) at US$260.68 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Rise of the Floodborn?", a: "TCGplayer lists 218 cards in Rise of the Floodborn: 73 Common, 55 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 12 Enchanted." },
      { q: "Is a booster box of Rise of the Floodborn worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 88% of the set's value and 197 of 218 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "into-the-inklands-most-valuable-cards",
    title: "Into the Inklands Most Valuable Cards: Lorcana Set 3",
    description: "The most valuable Into the Inklands cards today, from live TCGplayer and store prices: the top 20, every Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["into the inklands most valuable cards", "into the inklands chase cards", "into the inklands card prices", "into the inklands enchanted cards", "into the inklands booster box price"],
    html: `
<p><b>Into the Inklands</b> is Disney Lorcana's Set 3. TCGplayer lists <b>228 cards</b> in it (76 Common, 54 Uncommon, 49 Rare, 19 Super Rare, 12 Legendary, 18 Enchanted). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/into-the-inklands">Into the Inklands's full card list</a>.</p>

<h2>The 20 most valuable cards in Into the Inklands</h2>
{{toplist:23367:20}}

<h2>Into the Inklands Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Into the Inklands has <b>18</b>. The dearest three are {{card:539276}} ({{price:539276}}), {{card:539164}} ({{price:539164}}) and {{card:539171}} ({{price:539171}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>72%</b> of the set's total value (US$1,257.19 across 228 priced cards). 3 cards were worth US$100 or more, and <b>204 of 228</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Into the Inklands booster box and sealed prices</h2>
<p>A booster box of Into the Inklands is {{price:531521}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:23367}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-into-the-inklands-booster-box">Into the Inklands's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/rise-of-the-floodborn-most-valuable-cards">Rise of the Floodborn</a> and <a href="/blog/ursulas-return-most-valuable-cards">Ursula's Return</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Into the Inklands card?", a: "On 28 October 2026 it was Mickey Mouse - Trumpeter (Enchanted) at US$205.38 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Into the Inklands?", a: "TCGplayer lists 228 cards in Into the Inklands: 76 Common, 54 Uncommon, 49 Rare, 19 Super Rare, 12 Legendary, 18 Enchanted." },
      { q: "Is a booster box of Into the Inklands worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 72% of the set's value and 204 of 228 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "ursulas-return-most-valuable-cards",
    title: "Ursula's Return Most Valuable Cards: Lorcana Set 4",
    description: "The most valuable Ursula's Return cards today, from live TCGplayer and store prices: the top 20, every Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["ursula's return most valuable cards", "ursula's return chase cards", "ursula's return card prices", "ursula's return enchanted cards", "ursula's return booster box price"],
    html: `
<p><b>Ursula's Return</b> is Disney Lorcana's Set 4. TCGplayer lists <b>222 cards</b> in it (72 Common, 54 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Enchanted). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/ursulas-return">Ursula's Return's full card list</a>.</p>

<h2>The 20 most valuable cards in Ursula's Return</h2>
{{toplist:23474:20}}

<h2>Ursula's Return Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Ursula's Return has <b>18</b>. The dearest three are {{card:550549}} ({{price:550549}}), {{card:550537}} ({{price:550537}}) and {{card:550544}} ({{price:550544}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>73%</b> of the set's total value (US$1,288.71 across 222 priced cards). 4 cards were worth US$100 or more, and <b>196 of 222</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Ursula's Return booster box and sealed prices</h2>
<p>A booster box of Ursula's Return is {{price:543859}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:23474}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-ursulas-return-booster-box">Ursula's Return's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/into-the-inklands-most-valuable-cards">Into the Inklands</a> and <a href="/blog/shimmering-skies-most-valuable-cards">Shimmering Skies</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Ursula's Return card?", a: "On 28 October 2026 it was Ariel - Sonic Warrior (Enchanted) at US$151.82 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Ursula's Return?", a: "TCGplayer lists 222 cards in Ursula's Return: 72 Common, 54 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Enchanted." },
      { q: "Is a booster box of Ursula's Return worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 73% of the set's value and 196 of 222 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "shimmering-skies-most-valuable-cards",
    title: "Shimmering Skies Most Valuable Cards: Lorcana Set 5",
    description: "The most valuable Shimmering Skies cards today, from live TCGplayer and store prices: the top 20, every Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["shimmering skies most valuable cards", "shimmering skies chase cards", "shimmering skies card prices", "shimmering skies enchanted cards", "shimmering skies booster box price"],
    html: `
<p><b>Shimmering Skies</b> is Disney Lorcana's Set 5. TCGplayer lists <b>222 cards</b> in it (72 Common, 54 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Enchanted). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/shimmering-skies">Shimmering Skies's full card list</a>.</p>

<h2>The 20 most valuable cards in Shimmering Skies</h2>
{{toplist:23536:20}}

<h2>Shimmering Skies Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Shimmering Skies has <b>18</b>. The dearest three are {{card:562021}} ({{price:562021}}), {{card:562007}} ({{price:562007}}) and {{card:559716}} ({{price:559716}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>77%</b> of the set's total value (US$1,500.70 across 222 priced cards). 4 cards were worth US$100 or more, and <b>201 of 222</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Shimmering Skies booster box and sealed prices</h2>
<p>A booster box of Shimmering Skies is {{price:555130}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:23536}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-shimmering-skies-booster-box">Shimmering Skies's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/ursulas-return-most-valuable-cards">Ursula's Return</a> and <a href="/blog/azurite-sea-most-valuable-cards">Azurite Sea</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Shimmering Skies card?", a: "On 28 October 2026 it was Mufasa - Ruler of Pride Rock (Enchanted) at US$333.41 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Shimmering Skies?", a: "TCGplayer lists 222 cards in Shimmering Skies: 72 Common, 54 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Enchanted." },
      { q: "Is a booster box of Shimmering Skies worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 77% of the set's value and 201 of 222 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "azurite-sea-most-valuable-cards",
    title: "Azurite Sea Most Valuable Cards: Lorcana Set 6",
    description: "The most valuable Azurite Sea cards today, from live TCGplayer and store prices: the top 20, every Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["azurite sea most valuable cards", "azurite sea chase cards", "azurite sea card prices", "azurite sea enchanted cards", "azurite sea booster box price"],
    html: `
<p><b>Azurite Sea</b> is Disney Lorcana's Set 6. TCGplayer lists <b>222 cards</b> in it (72 Common, 54 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Enchanted). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/azurite-sea">Azurite Sea's full card list</a>.</p>

<h2>The 20 most valuable cards in Azurite Sea</h2>
{{toplist:23746:20}}

<h2>Azurite Sea Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Azurite Sea has <b>18</b>. The dearest three are {{card:592037}} ({{price:592037}}), {{card:591999}} ({{price:591999}}) and {{card:591998}} ({{price:591998}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>70%</b> of the set's total value (US$1,208.43 across 222 priced cards). 3 cards were worth US$100 or more, and <b>198 of 222</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Azurite Sea booster box and sealed prices</h2>
<p>A booster box of Azurite Sea is {{price:578093}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:23746}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-azurite-sea-booster-box">Azurite Sea's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/shimmering-skies-most-valuable-cards">Shimmering Skies</a> and <a href="/blog/archazias-island-most-valuable-cards">Archazia's Island</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Azurite Sea card?", a: "On 28 October 2026 it was Tigger - In the Crow's Nest (Enchanted) at US$158.81 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Azurite Sea?", a: "TCGplayer lists 222 cards in Azurite Sea: 72 Common, 54 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Enchanted." },
      { q: "Is a booster box of Azurite Sea worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 70% of the set's value and 198 of 222 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "archazias-island-most-valuable-cards",
    title: "Archazia's Island Most Valuable Cards: Lorcana Set 7",
    description: "The most valuable Archazia's Island cards today, from live TCGplayer and store prices: the top 20, every Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["archazia's island most valuable cards", "archazia's island chase cards", "archazia's island card prices", "archazia's island enchanted cards", "archazia's island booster box price"],
    html: `
<p><b>Archazia's Island</b> is Disney Lorcana's Set 7. TCGplayer lists <b>222 cards</b> in it (72 Common, 54 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Enchanted). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/archazias-island">Archazia's Island's full card list</a>.</p>

<h2>The 20 most valuable cards in Archazia's Island</h2>
{{toplist:24011:20}}

<h2>Archazia's Island Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Archazia's Island has <b>18</b>. The dearest three are {{card:619749}} ({{price:619749}}), {{card:619748}} ({{price:619748}}) and {{card:619733}} ({{price:619733}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>78%</b> of the set's total value (US$2,381.14 across 222 priced cards). 9 cards were worth US$100 or more, and <b>196 of 222</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Archazia's Island booster box and sealed prices</h2>
<p>A booster box of Archazia's Island is {{price:607758}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:24011}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-archazias-island-booster-box">Archazia's Island's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/azurite-sea-most-valuable-cards">Azurite Sea</a> and <a href="/blog/reign-of-jafar-most-valuable-cards">Reign of Jafar</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Archazia's Island card?", a: "On 28 October 2026 it was Mickey Mouse - Inspirational Warrior (Enchanted) at US$429.38 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Archazia's Island?", a: "TCGplayer lists 222 cards in Archazia's Island: 72 Common, 54 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Enchanted." },
      { q: "Is a booster box of Archazia's Island worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 78% of the set's value and 196 of 222 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "reign-of-jafar-most-valuable-cards",
    title: "Reign of Jafar Most Valuable Cards: Lorcana Set 8",
    description: "The most valuable Reign of Jafar cards today, from live TCGplayer and store prices: the top 20, every Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["reign of jafar most valuable cards", "reign of jafar chase cards", "reign of jafar card prices", "reign of jafar enchanted cards", "reign of jafar booster box price"],
    html: `
<p><b>Reign of Jafar</b> is Disney Lorcana's Set 8. TCGplayer lists <b>227 cards</b> in it (75 Common, 56 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Enchanted). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/reign-of-jafar">Reign of Jafar's full card list</a>.</p>

<h2>The 20 most valuable cards in Reign of Jafar</h2>
{{toplist:24258:20}}

<h2>Reign of Jafar Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Reign of Jafar has <b>18</b>. The dearest three are {{card:633104}} ({{price:633104}}), {{card:631992}} ({{price:631992}}) and {{card:632720}} ({{price:632720}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>79%</b> of the set's total value (US$3,114.95 across 227 priced cards). 12 cards were worth US$100 or more, and <b>199 of 227</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Reign of Jafar booster box and sealed prices</h2>
<p>A booster box of Reign of Jafar is {{price:623064}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:24258}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-reign-of-jafar-booster-box">Reign of Jafar's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/archazias-island-most-valuable-cards">Archazia's Island</a> and <a href="/blog/fabled-most-valuable-cards">Fabled</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Reign of Jafar card?", a: "On 28 October 2026 it was Stitch - Experiment 626 (Enchanted) at US$471.98 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Reign of Jafar?", a: "TCGplayer lists 227 cards in Reign of Jafar: 75 Common, 56 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Enchanted." },
      { q: "Is a booster box of Reign of Jafar worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 79% of the set's value and 199 of 227 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "fabled-most-valuable-cards",
    title: "Fabled Most Valuable Cards: Lorcana Set 9",
    description: "The most valuable Fabled cards today, from live TCGplayer and store prices: the top 20, every Iconic and Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["fabled most valuable cards", "fabled chase cards", "fabled card prices", "fabled iconic cards", "fabled booster box price"],
    html: `
<p><b>Fabled</b> is Disney Lorcana's Set 9. TCGplayer lists <b>243 cards</b> in it (72 Common, 54 Uncommon, 48 Rare, 19 Super Rare, 12 Legendary, 18 Epic, 18 Enchanted, 2 Iconic). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/fabled">Fabled's full card list</a>.</p>

<h2>The 20 most valuable cards in Fabled</h2>
{{toplist:24348:20}}

<h2>Fabled Iconic cards</h2>
<p>Iconic is the rarest rarity in a pack: since Fabled (Set 9), each main set has two. Fabled has <b>2</b>. The dearest two are {{card:647663}} ({{price:647663}}) and {{card:651106}} ({{price:651106}}). Every Iconic card across all sets is in <a href="/blog/lorcana-iconic-cards">our Iconic list</a>.</p>

<h2>Fabled Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Fabled has <b>18</b>. The dearest three are {{card:651107}} ({{price:651107}}), {{card:651123}} ({{price:651123}}) and {{card:651112}} ({{price:651112}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Fabled Epic cards</h2>
<p>Epic is the rarity added with Fabled (Set 9), alongside Iconic, and usually sells for far less than an Enchanted. Fabled has <b>18</b>. The dearest three are {{card:647660}} ({{price:647660}}), {{card:650156}} ({{price:650156}}) and {{card:650142}} ({{price:650142}}). Every Epic card across all sets is in <a href="/blog/lorcana-epic-cards">our Epic list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>81%</b> of the set's total value (US$15,113.14 across 243 priced cards). 20 cards were worth US$100 or more, and <b>182 of 243</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Fabled booster box and sealed prices</h2>
<p>A booster box of Fabled is {{price:645298}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:24348}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-fabled-booster-box">Fabled's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/reign-of-jafar-most-valuable-cards">Reign of Jafar</a> and <a href="/blog/whispers-in-the-well-most-valuable-cards">Whispers in the Well</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Fabled card?", a: "On 28 October 2026 it was Mickey Mouse - Brave Little Prince (Iconic) at US$3,875.00 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Fabled?", a: "TCGplayer lists 243 cards in Fabled: 72 Common, 54 Uncommon, 48 Rare, 19 Super Rare, 12 Legendary, 18 Epic, 18 Enchanted, 2 Iconic." },
      { q: "Is a booster box of Fabled worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 81% of the set's value and 182 of 243 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "whispers-in-the-well-most-valuable-cards",
    title: "Whispers in the Well Most Valuable Cards: Lorcana Set 10",
    description: "The most valuable Whispers in the Well cards today from live prices: the top 20, the chase cards and the booster box price.",
    date: "2026-10-29",
    keywords: ["whispers in the well most valuable cards", "whispers in the well chase cards", "whispers in the well card prices", "whispers in the well iconic cards", "whispers in the well booster box price"],
    html: `
<p><b>Whispers in the Well</b> is Disney Lorcana's Set 10. TCGplayer lists <b>242 cards</b> in it (72 Common, 54 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Epic, 18 Enchanted, 2 Iconic). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/whispers-in-the-well">Whispers in the Well's full card list</a>.</p>

<h2>The 20 most valuable cards in Whispers in the Well</h2>
{{toplist:24414:20}}

<h2>Whispers in the Well Iconic cards</h2>
<p>Iconic is the rarest rarity in a pack: since Fabled (Set 9), each main set has two. Whispers in the Well has <b>2</b>. The dearest two are {{card:657885}} ({{price:657885}}) and {{card:657889}} ({{price:657889}}). Every Iconic card across all sets is in <a href="/blog/lorcana-iconic-cards">our Iconic list</a>.</p>

<h2>Whispers in the Well Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Whispers in the Well has <b>18</b>. The dearest three are {{card:660011}} ({{price:660011}}), {{card:660029}} ({{price:660029}}) and {{card:660041}} ({{price:660041}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Whispers in the Well Epic cards</h2>
<p>Epic is the rarity added with Fabled (Set 9), alongside Iconic, and usually sells for far less than an Enchanted. Whispers in the Well has <b>18</b>. The dearest three are {{card:660271}} ({{price:660271}}), {{card:660188}} ({{price:660188}}) and {{card:660026}} ({{price:660026}}). Every Epic card across all sets is in <a href="/blog/lorcana-epic-cards">our Epic list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>81%</b> of the set's total value (US$6,166.89 across 242 priced cards). 13 cards were worth US$100 or more, and <b>185 of 242</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Whispers in the Well booster box and sealed prices</h2>
<p>A booster box of Whispers in the Well is {{price:652703}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:24414}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-whispers-in-the-well-booster-box">Whispers in the Well's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/fabled-most-valuable-cards">Fabled</a> and <a href="/blog/winterspell-most-valuable-cards">Winterspell</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Whispers in the Well card?", a: "On 28 October 2026 it was Ariel - Ethereal Voice (Iconic) at US$1,482.58 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Whispers in the Well?", a: "TCGplayer lists 242 cards in Whispers in the Well: 72 Common, 54 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Epic, 18 Enchanted, 2 Iconic." },
      { q: "Is a booster box of Whispers in the Well worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 81% of the set's value and 185 of 242 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "winterspell-most-valuable-cards",
    title: "Winterspell Most Valuable Cards: Lorcana Set 11",
    description: "The most valuable Winterspell cards today, from live TCGplayer and store prices: the top 20, every Iconic and Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["winterspell most valuable cards", "winterspell chase cards", "winterspell card prices", "winterspell iconic cards", "winterspell booster box price"],
    html: `
<p><b>Winterspell</b> is Disney Lorcana's Set 11. TCGplayer lists <b>246 cards</b> in it (75 Common, 55 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Epic, 18 Enchanted, 2 Iconic). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/winterspell">Winterspell's full card list</a>.</p>

<h2>The 20 most valuable cards in Winterspell</h2>
{{toplist:24500:20}}

<h2>Winterspell Iconic cards</h2>
<p>Iconic is the rarest rarity in a pack: since Fabled (Set 9), each main set has two. Winterspell has <b>2</b>. The dearest two are {{card:673300}} ({{price:673300}}) and {{card:673298}} ({{price:673298}}). Every Iconic card across all sets is in <a href="/blog/lorcana-iconic-cards">our Iconic list</a>.</p>

<h2>Winterspell Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Winterspell has <b>18</b>. The dearest three are {{card:675515}} ({{price:675515}}), {{card:675279}} ({{price:675279}}) and {{card:673068}} ({{price:673068}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Winterspell Epic cards</h2>
<p>Epic is the rarity added with Fabled (Set 9), alongside Iconic, and usually sells for far less than an Enchanted. Winterspell has <b>18</b>. The dearest three are {{card:677154}} ({{price:677154}}), {{card:675380}} ({{price:675380}}) and {{card:677143}} ({{price:677143}}). Every Epic card across all sets is in <a href="/blog/lorcana-epic-cards">our Epic list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>75%</b> of the set's total value (US$6,966.23 across 246 priced cards). 18 cards were worth US$100 or more, and <b>181 of 246</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Winterspell booster box and sealed prices</h2>
<p>A booster box of Winterspell is {{price:664819}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:24500}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-winterspell-booster-box">Winterspell's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/whispers-in-the-well-most-valuable-cards">Whispers in the Well</a> and <a href="/blog/wilds-unknown-most-valuable-cards">Wilds Unknown</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Winterspell card?", a: "On 28 October 2026 it was Moana - Curious Explorer (Iconic) at US$1,248.52 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Winterspell?", a: "TCGplayer lists 246 cards in Winterspell: 75 Common, 55 Uncommon, 48 Rare, 18 Super Rare, 12 Legendary, 18 Epic, 18 Enchanted, 2 Iconic." },
      { q: "Is a booster box of Winterspell worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 75% of the set's value and 181 of 246 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "wilds-unknown-most-valuable-cards",
    title: "Wilds Unknown Most Valuable Cards: Lorcana Set 12",
    description: "The most valuable Wilds Unknown cards today, from live TCGplayer and store prices: the top 20, every Iconic and Enchanted card and the booster box price.",
    date: "2026-10-29",
    keywords: ["wilds unknown most valuable cards", "wilds unknown chase cards", "wilds unknown card prices", "wilds unknown iconic cards", "wilds unknown booster box price"],
    html: `
<p><b>Wilds Unknown</b> is Disney Lorcana's Set 12. TCGplayer lists <b>257 cards</b> in it (79 Common, 60 Uncommon, 49 Rare, 18 Super Rare, 13 Legendary, 18 Epic, 18 Enchanted, 2 Iconic). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/wilds-unknown">Wilds Unknown's full card list</a>.</p>

<h2>The 20 most valuable cards in Wilds Unknown</h2>
{{toplist:24617:20}}

<h2>Wilds Unknown Iconic cards</h2>
<p>Iconic is the rarest rarity in a pack: since Fabled (Set 9), each main set has two. Wilds Unknown has <b>2</b>. The dearest two are {{card:690216}} ({{price:690216}}) and {{card:690217}} ({{price:690217}}). Every Iconic card across all sets is in <a href="/blog/lorcana-iconic-cards">our Iconic list</a>.</p>

<h2>Wilds Unknown Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Wilds Unknown has <b>18</b>. The dearest three are {{card:692220}} ({{price:692220}}), {{card:690747}} ({{price:690747}}) and {{card:692217}} ({{price:692217}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Wilds Unknown Epic cards</h2>
<p>Epic is the rarity added with Fabled (Set 9), alongside Iconic, and usually sells for far less than an Enchanted. Wilds Unknown has <b>18</b>. The dearest three are {{card:692203}} ({{price:692203}}), {{card:692208}} ({{price:692208}}) and {{card:692214}} ({{price:692214}}). Every Epic card across all sets is in <a href="/blog/lorcana-epic-cards">our Epic list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>90%</b> of the set's total value (US$7,155.14 across 257 priced cards). 5 cards were worth US$100 or more, and <b>204 of 257</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Wilds Unknown booster box and sealed prices</h2>
<p>A booster box of Wilds Unknown is {{price:678165}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:24617}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-wilds-unknown-booster-box">Wilds Unknown's booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/winterspell-most-valuable-cards">Winterspell</a> and <a href="/blog/attack-of-the-vine-most-valuable-cards">Attack of the Vine!</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Wilds Unknown card?", a: "On 28 October 2026 it was Buzz Lightyear - Jungle Ranger (Iconic) at US$3,613.09 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Wilds Unknown?", a: "TCGplayer lists 257 cards in Wilds Unknown: 79 Common, 60 Uncommon, 49 Rare, 18 Super Rare, 13 Legendary, 18 Epic, 18 Enchanted, 2 Iconic." },
      { q: "Is a booster box of Wilds Unknown worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 90% of the set's value and 204 of 257 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "attack-of-the-vine-most-valuable-cards",
    title: "Attack of the Vine! Most Valuable Cards: Lorcana Set 13",
    description: "The most valuable Attack of the Vine! cards today from live prices: the top 20, the chase cards and the booster box price.",
    date: "2026-10-29",
    keywords: ["attack of the vine! most valuable cards", "attack of the vine! chase cards", "attack of the vine! card prices", "attack of the vine! iconic cards", "attack of the vine! booster box price"],
    html: `
<p><b>Attack of the Vine!</b> is Disney Lorcana's Set 13. TCGplayer lists <b>251 cards</b> in it (75 Common, 56 Uncommon, 52 Rare, 18 Super Rare, 12 Legendary, 18 Epic, 18 Enchanted, 2 Iconic). These are its most valuable cards today, read from TCGplayer's market price every morning, so the order below is always current. For every card in the set with the cheapest store price, see <a href="/sets/attack-of-the-vine">Attack of the Vine!'s full card list</a>.</p>

<h2>The 20 most valuable cards in Attack of the Vine!</h2>
{{toplist:24666:20}}

<h2>Attack of the Vine! Iconic cards</h2>
<p>Iconic is the rarest rarity in a pack: since Fabled (Set 9), each main set has two. Attack of the Vine! has <b>2</b>. The dearest two are {{card:702667}} ({{price:702667}}) and {{card:702666}} ({{price:702666}}). Every Iconic card across all sets is in <a href="/blog/lorcana-iconic-cards">our Iconic list</a>.</p>

<h2>Attack of the Vine! Enchanted cards</h2>
<p>Enchanted cards are full-art versions of the set's cards with a rainbow foil finish, and the classic Lorcana chase. Attack of the Vine! has <b>18</b>. The dearest three are {{card:704725}} ({{price:704725}}), {{card:704729}} ({{price:704729}}) and {{card:704719}} ({{price:704719}}). Every Enchanted card across all sets is in <a href="/blog/lorcana-enchanted-cards">our Enchanted list</a>.</p>

<h2>Attack of the Vine! Epic cards</h2>
<p>Epic is the rarity added with Fabled (Set 9), alongside Iconic, and usually sells for far less than an Enchanted. Attack of the Vine! has <b>18</b>. The dearest three are {{card:702665}} ({{price:702665}}), {{card:704702}} ({{price:704702}}) and {{card:704701}} ({{price:704701}}). Every Epic card across all sets is in <a href="/blog/lorcana-epic-cards">our Epic list</a>.</p>

<h2>Where the value sits</h2>
<p>On 28 October 2026, the ten most valuable cards held <b>86%</b> of the set's total value (US$6,641.11 across 251 priced cards). 12 cards were worth US$100 or more, and <b>207 of 251</b> were worth under US$1. That shape is typical of Disney Lorcana: a handful of chase printings carry the set, and most playable cards cost very little as singles.</p>

<h2>Attack of the Vine! booster box and sealed prices</h2>
<p>A booster box of Attack of the Vine! is {{price:690384}} at TCGplayer market today. Every sealed product from the set, with the cheapest in-stock store listing we found:</p>
{{sealed:24666}}
<p>Store prices for the same box differ by more than the cost of a few packs: compare every store on <a href="/card/disney-lorcana-attack-of-the-vine-booster-box">Attack of the Vine!'s booster box page</a> before you buy.</p>

<h2>Open boxes or buy singles?</h2>
<p>If you want one particular chase card, buying the single is almost always cheaper than opening packs for it: most boxes contain none of the top 20, and the one you want is one of many. Open boxes for the fun of opening; buy singles for the cards your deck or binder needs. <a href="/blog/lorcana-booster-box-or-singles">Booster box or singles?</a> works through the maths, and each card page charts its price history so you can see whether today's price is high for it.</p>

<h2>Other sets</h2>
<p>The same list for <a href="/blog/wilds-unknown-most-valuable-cards">Wilds Unknown</a>. Across every set, the dearest cards are in <a href="/blog/most-expensive-lorcana-cards">the most expensive Disney Lorcana cards</a>.</p>
`,
    faq: [
      { q: "What is the most expensive Attack of the Vine! card?", a: "On 28 October 2026 it was Belle & Beast - Certain as the Sun (Iconic) at US$1,831.91 on TCGplayer's market price. The table on this page is read every morning, so check it for today's order." },
      { q: "How many cards are in Attack of the Vine!?", a: "TCGplayer lists 251 cards in Attack of the Vine!: 75 Common, 56 Uncommon, 52 Rare, 18 Super Rare, 12 Legendary, 18 Epic, 18 Enchanted, 2 Iconic." },
      { q: "Is a booster box of Attack of the Vine! worth opening?", a: "For a specific card, buying the single is almost always cheaper. On 28 October 2026 the top ten cards held 86% of the set's value and 207 of 251 cards were worth under US$1, so a box's value rests on pulling one of a few cards. Open one for the fun of opening." },
    ],
  },
  {
    slug: "lorcana-enchanted-cards",
    title: "Every Lorcana Enchanted Card, Ranked by Price",
    description: "The most valuable Disney Lorcana Enchanted cards across every set, from live TCGplayer prices: what Enchanted means, how many each set has and the dearest.",
    date: "2026-10-29",
    keywords: ["lorcana enchanted cards", "most expensive enchanted lorcana", "lorcana enchanted list", "enchanted rarity lorcana", "lorcana enchanted prices"],
    html: `
<p><b>Enchanted</b> cards are Disney Lorcana's classic chase: full-art versions of cards from the set with a rainbow foil finish. The first two sets have 12 each; every main set since <i>Into the Inklands</i> has 18. They play exactly like the standard card, so their price is pure collecting demand.</p>

<h2>The 40 most valuable Enchanted cards</h2>
{{rarity:Enchanted:40}}

<h2>What makes one Enchanted worth more than another</h2>
<p>Three things explain most of the spread in the table. <b>The character:</b> Mickey, Elsa, Stitch and the princesses carry a premium in every set. <b>The set's age and print run:</b> early sets were opened in smaller numbers, so their Enchanteds are scarcer today. <b>Whether the card is played:</b> an Enchanted of a tournament staple has players as well as collectors chasing it.</p>

<h2>Enchanted, Epic and Iconic</h2>
<p>Since <i>Fabled</i> (Set 9), each main set also has <b>Epic</b> cards and two <b>Iconic</b> cards. Iconics are the rarest pack pull and usually the dearest card in their set; see <a href="/blog/lorcana-iconic-cards">every Iconic card</a> and <a href="/blog/lorcana-epic-cards">every Epic card</a>. From <i>Into the Inkdark</i> (Set 15), Collector Boosters add serialized Illustrious cards, 23 copies of each; <a href="/blog/into-the-inkdark-release-date-collector-boosters">our Inkdark guide</a> explains them.</p>

<h2>Buying an Enchanted</h2>
<ul><li><b>Buy the single.</b> The Enchanted you want is one of 18 in its set, so opening boxes for it costs far more than buying it.</li><li><b>Check condition and photos.</b> Foil surfaces scratch, and at these prices near-mint matters.</li><li><b>Compare delivered prices.</b> Each card page lists every store and eBay listing we track, and charts the card's price history.</li></ul>
`,
    faq: [
      { q: "How many Enchanted cards are in a Lorcana set?", a: "12 in each of the first two sets, The First Chapter and Rise of the Floodborn, and 18 in every main set since Into the Inklands." },
      { q: "What is the most expensive Lorcana Enchanted card?", a: "The first row of the table on this page, read from TCGplayer's market price every morning." },
      { q: "Are Enchanted cards tournament legal?", a: "Yes. An Enchanted card is a printing of a normal card and plays exactly like it." },
    ],
  },
  {
    slug: "lorcana-iconic-cards",
    title: "Lorcana Iconic Cards: Every One and Its Price",
    description: "Every Disney Lorcana Iconic card since Fabled, with live TCGplayer prices: what the Iconic rarity is, how rare it is and which Iconics are worth the most.",
    date: "2026-10-29",
    keywords: ["lorcana iconic cards", "iconic rarity lorcana", "lorcana iconic list", "most expensive iconic lorcana", "lorcana iconic price"],
    html: `
<p><b>Iconic</b> is Disney Lorcana's rarest pack rarity. It arrived with <i>Fabled</i> (Set 9), and each main set since has exactly two Iconic cards, far rarer than its 18 Enchanteds. That rarity is why an Iconic is usually the most valuable card in its set.</p>

<h2>Every Iconic card, by price</h2>
{{rarity:Iconic:20}}

<h2>Why Iconics cost so much</h2>
<p>Two per set, against 18 Enchanteds, means most players will never open one. The characters chosen have been the biggest names in each set (Mickey Mouse in Fabled and Hyperia City, Buzz Lightyear in Wilds Unknown, Moana in Winterspell, Ariel in Whispers in the Well, Belle and Beast in Attack of the Vine!), so collector demand is as high as the supply is low. Their prices also move the most: a new set's Iconics usually swing hardest in the first weeks as boxes are opened.</p>

<h2>Iconic, Enchanted and what comes next</h2>
<p>Below Iconic sit the <a href="/blog/lorcana-enchanted-cards">Enchanted cards</a> and the <a href="/blog/lorcana-epic-cards">Epic cards</a>. From <i>Into the Inkdark</i>, serialized Illustrious cards in Collector Boosters sit above everything, with only 23 copies of each; see <a href="/blog/into-the-inkdark-release-date-collector-boosters">our Into the Inkdark guide</a>. Each set's chase list, Iconics included, is in its "most valuable cards" post, for example <a href="/blog/fabled-most-valuable-cards">Fabled</a> and <a href="/blog/attack-of-the-vine-most-valuable-cards">Attack of the Vine!</a>.</p>

<h2>Buying an Iconic</h2>
<ul><li><b>Buy from a seller with photos of the actual card</b>, front and back, and check the corners and foil surface.</li><li><b>Consider graded copies</b> at this price: a PSA, BGS or CGC slab settles condition.</li><li><b>Compare every listing.</b> Each Iconic's card page shows every store and eBay listing we track, with its price history.</li></ul>
`,
    faq: [
      { q: "What is an Iconic card in Lorcana?", a: "The rarest rarity found in Disney Lorcana booster packs, introduced with Fabled (Set 9). Each main set since has two Iconic cards." },
      { q: "How many Iconic cards are there?", a: "Two per main set from Fabled onward; the table on this page lists every one with its price." },
      { q: "Is Iconic rarer than Enchanted?", a: "Yes. A set has two Iconics against 18 Enchanteds, and Iconics are pulled far less often." },
    ],
  },
  {
    slug: "lorcana-epic-cards",
    title: "Lorcana Epic Cards: The Full List With Prices",
    description: "Every Disney Lorcana Epic card since Fabled, ranked by live TCGplayer price: what the Epic rarity is, how it compares with Enchanted and the dearest ones.",
    date: "2026-10-29",
    keywords: ["lorcana epic cards", "epic rarity lorcana", "lorcana epic list", "lorcana epic price", "lorcana epic vs enchanted"],
    html: `
<p><b>Epic</b> is a Disney Lorcana rarity that arrived with <i>Fabled</i> (Set 9), alongside Iconic. Each main set since has 18 Epic cards. They sell for far less than Enchanteds, which makes them the affordable chase for many collectors.</p>

<h2>The 40 most valuable Epic cards</h2>
{{rarity:Epic:40}}

<h2>Epic versus Enchanted</h2>
<p>In price, the gap between the two rarities is wide: in most sets the dearest Epic costs a fraction of the dearest Enchanted, and many Epics sell for a few dollars.</p>

<h2>More chase lists</h2>
<p>See <a href="/blog/lorcana-enchanted-cards">every Enchanted card</a> and <a href="/blog/lorcana-iconic-cards">every Iconic card</a>, or each set's own list, for example <a href="/blog/wilds-unknown-most-valuable-cards">Wilds Unknown</a> and <a href="/blog/winterspell-most-valuable-cards">Winterspell</a>.</p>
`,
    faq: [
      { q: "What is an Epic card in Lorcana?", a: "A rarity introduced with Fabled (Set 9), alongside Iconic. Each main set since has 18 Epic cards." },
      { q: "Are Epic cards worth money?", a: "Some are; most sell for a few dollars. The table on this page ranks every Epic by TCGplayer's market price." },
    ],
  },
];
