import type { Post } from "./types";

export const post: Post = {
  slug: "how-to-spot-fake-lorcana-cards",
  title: "How to spot fake Lorcana cards: a seven-point check before you buy",
  description:
    "Counterfeit Disney Lorcana cards are sold as whole Enchanted sets on marketplaces. Seven checks that catch nearly all of them: the number, the rarity symbol, the foil, the back, the stock, the price and the seller.",
  date: "2026-11-05",
  keywords: ["fake lorcana cards", "how to spot fake lorcana cards", "counterfeit lorcana", "lorcana fake enchanted", "are my lorcana cards real", "lorcana proxy vs real"],
  image: { src: "/blog/how-to-spot-fake-lorcana-cards.jpg", alt: "How to spot fake Lorcana cards: the seven checks" },
  html: `
<p>Fake Lorcana cards exist because a handful of cards are worth hundreds of dollars and the rest are worth cents. Counterfeiters do not bother with commons: they print the Enchanted and Iconic cards, sell them one at a time on marketplaces, or bundle a "complete Enchanted set" for a price that would be a bargain if any of it were real. The checks below take a minute per card and catch almost every fake we have seen described by buyers.</p>

<h2>Which cards get faked</h2>
<p>Expensive ones. This is the live top ten by TCGplayer market price, rebuilt every morning; if someone is selling one of these for a fraction of the figure in the Market column, start from the assumption that it is fake and let the card prove otherwise.</p>
{{topall:10}}
<p>The full list is on <a href="/blog/most-expensive-lorcana-cards">the most expensive Lorcana cards</a>. Anything above about US$30 is worth a careful look; anything above US$100 deserves every check on this page.</p>

<h2>1. The number and the set must exist</h2>
<p>Every Lorcana card carries a line at the bottom in the form <b>204/204 · EN · 1</b>: the card's number out of the set's base size, the language, and the set number. Enchanted cards are numbered past the base set (205 onwards in a 204-card set), so an "Enchanted" with a number inside the base range is wrong on its face. Search the name on this site and open the printing: if the number, the rarity and the set do not line up with a real printing, the card does not exist. Counterfeit sets often include "Enchanted" versions of cards that were never printed as Enchanted.</p>

<h2>2. The rarity symbol must match</h2>
<p>Beside the number is a small rarity symbol; each rarity has its own shape and colour, and Enchanted cards have the distinctive full-art frame with the inkwell and the name set against the artwork rather than in a frame. Our <a href="/blog/lorcana-rarities-explained">rarities guide</a> shows what each looks like. A card with a Legendary frame and an Enchanted symbol, or an Enchanted card with a framed, normal layout, is a fake. Check the Iconic frame separately: Iconics only exist from Fabled (Set 9) onward, two per set.</p>

<h2>3. The foil pattern</h2>
<p>Ravensburger's foils are the hardest thing to copy. A real foil has a fine, even pattern that shifts as you tilt the card, and the text and the black borders stay crisp and unfoiled on top of it. Fakes tend to be a flat rainbow sheen laid over everything, text included, so the whole card shimmers like a sticker. Hold a known-real foil next to the card you are checking and tilt both: the difference is usually obvious at once. A "foil" that is simply glossy, with no shift at all, is also a fake.</p>

<h2>4. The back</h2>
<p>Turn it over. The back of every Lorcana card is identical: the Lorcana logo on the purple-to-gold ink gradient, with crisp edges to the artwork. Fakes are often paler or more saturated than a real back, slightly blurred, or cut off-centre so the border is thicker on one side. Compare it against a common from a pack you opened yourself; commons are free and they are the perfect reference.</p>

<h2>5. The card stock</h2>
<p>A real card is stiff, with a slight matte finish on the front, and it bends back flat. Fakes are usually thinner and either glossier or oddly rough, and many are a little smaller or larger than a real card (Lorcana cards are standard 63 × 88 mm). Put the card in a sleeve with a real one: a size difference shows. Weight is not a reliable test on its own, but a card that feels like a playing card from a board game is not from Ravensburger.</p>

<h2>6. The price</h2>
<p>This is the check that needs no card in hand. Counterfeiters price to sell, so a fake is almost always well under the real market. Every card page on this site shows TCGplayer's market price, every store listing we track and the eBay listings for that printing, so you can see within a few seconds whether a price is plausible. A single Enchanted at 30% of market from a new seller is a warning; a "complete Enchanted set" for a few hundred dollars is not a bargain, it is a box of fakes.</p>

<h2>7. The seller</h2>
<p>Buy from the stores we list (every one is a real card shop in its own country; see <a href="/stores">the stores we track</a>) or from marketplace sellers with a long history of card sales and clear photos of the actual card, front and back. Be wary of stock images, of listings that ship from a country the game is not sold in, and of sellers who list every chase card in the game at once in mint condition. Bulk "lots" of Enchanteds are the most common way fakes are sold.</p>

<h2>What to do if you have a fake</h2>
<p>Marketplaces refund counterfeit goods; open a case with photos of the card next to a real one and quote the number check above. Do not resell it, even described as a proxy. Proxies for casual play are fine among friends, but the moment a fake enters a trade or a sale, it is fraud, and it is the next person who pays.</p>
`,
  faq: [
    { q: "How can I tell if a Lorcana card is fake?", a: "Check the number line at the bottom against a real printing, the rarity symbol against the frame, the foil pattern against a known-real foil, the back against a common, and the price against the market. Most fakes fail at least two of those." },
    { q: "Do fake Lorcana cards have a different back?", a: "Often, yes: the gradient is paler or more saturated, the logo slightly blurred, or the print off-centre. Put it next to a common from a pack you opened." },
    { q: "Are Lorcana cards sold on AliExpress or Temu real?", a: "Complete 'Enchanted sets' and chase cards at a fraction of market from marketplaces outside the game's distribution are fakes. Ravensburger sells through hobby distributors and retailers, not direct through those marketplaces." },
    { q: "Is a proxy the same as a fake?", a: "A proxy is a stand-in for casual play that everyone at the table knows is not real. It becomes a fake the moment it is traded or sold as the real card." },
  ],
};
