// The forum's topics for this game (src/lib/forum/site.ts reads them). An empty
// topic shows its blurb and prompts, never an invented post.
import type { ForumCategory } from "@/lib/forum/core";

export const FORUM_INTRO = "Talk Disney Lorcana prices, deals, decks and collections with other players.";

export const FORUM_CATEGORIES: ForumCategory[] = [
  { key: "new-sets", name: "New set prices", blurb: "Pre-orders, release week and how a new set's cards are settling.", prompts: ["Is the next booster box worth pre-ordering?", "Which enchanteds are holding their price?"] },
  { key: "deals", name: "Deals & where to buy", blurb: "Good prices you spotted, store experiences and shipping tips.", prompts: ["Which store shipped fastest for you?", "Best booster box or trove price this week"] },
  { key: "collection", name: "Collection talk", blurb: "Pulls, binders, graded cards and what you're chasing.", prompts: ["Your best enchanted pull (describe it!)", "What are you still missing from a set?"] },
  { key: "decks", name: "Decks & play", blurb: "Budget builds, staples worth buying and the meta.", prompts: ["Cheapest competitive deck right now?", "Which staples are worth buying early?"] },
  { key: "site", name: "Site feedback", blurb: "Ideas, bugs or a store we should add.", prompts: ["A feature you'd like to see"] },
];
