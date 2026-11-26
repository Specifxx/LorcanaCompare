import type { Metadata } from "next";
import type { Post } from "@/content/blog/types";
import { byValue, productsInSet, refCents, setById } from "./data";
import { money } from "./format";
import { shortName } from "./names";
import { firstThatFits, fitDescription, fitTitle } from "./seo-title";

// A set's "most valuable cards" post is titled for the search it answers (2026-11-26, page scorecard Job D:
// /blog/attack-of-the-vine-most-valuable-cards sat at position 7 with 14 impressions and no click; its title ran past
// 60 characters and said nothing a reader could not guess). A post with `topSet` names today's most valuable card of
// that set and its TCGplayer market price, read from the same data the post's {{toplist}} table renders, stepping
// down to the price alone, then the plain post title. The h1 keeps the post's own title. No price, no change.

/** The person or thing a card is named for: "Belle & Beast - Certain as the Sun (Iconic)" -> "Belle & Beast". */
const who = (name: string) => shortName(name).split(" - ")[0].replace(/\s*\([^)]*\)\s*$/, "").trim();

export function postSeo(p: Post): { title: Metadata["title"]; description: string } {
  const plain = { title: p.title, description: fitDescription(p.description) };
  if (p.topSet == null) return plain;
  const set = setById(p.topSet)?.name;
  const top = byValue(productsInSet(p.topSet).filter((x) => x.kind === "card"))[0];
  const cents = top ? refCents(top.id) : null;
  if (!set || !top || cents == null) return plain;
  const price = money(cents);
  const title = fitTitle([`${set} Most Valuable Cards: ${who(top.name)} ${price}`, `${set} Most Valuable Cards: Top Card ${price}`, `${set} Most Valuable Cards`, p.title]);
  const lead = `The most valuable card in ${set} today: ${shortName(top.name)}, ${price} at TCGplayer market.`;
  const description = firstThatFits([`${lead} The top 20, every chase card and the booster box price, updated daily.`, `${lead} The top 20 and the booster box price, updated daily.`, `${lead} Updated daily.`, fitDescription(lead)]);
  return { title, description };
}
