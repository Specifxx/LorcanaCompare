import type { Creator } from "@/lib/creators";

// Lorcana creators featured on /creators (owner, 2026-11-05; see Gundam
// Compare's list for the format). Newest `since` is the spotlight. Avatars
// live in public/img/creators/, cut to a circle. Only what the creator shows
// publicly; no follower count unless it flatters them.
export const CREATORS: Creator[] = [
  {
    slug: "danarnoldlorcana",
    name: "Dan Arnold Lorcana",
    blurb: "Competitive Disney Lorcana: weekly meta reports, deck guides, tournament breakdowns and coaching.",
    about:
      "Dan Arnold has been deep in the Lorcana meta since the game launched. Every week he breaks down what is actually winning at the top tables, from event standings and the decks players registered to the best lists to bring to your next tournament. The meta reports, deck guides and podcasts land on YouTube and Instagram, and he coaches players of every level on Metafy.",
    links: [
      { platform: "YouTube", url: "https://www.youtube.com/@danarnoldlorcana", handle: "@danarnoldlorcana" },
      { platform: "Instagram", url: "https://www.instagram.com/danarnoldlorcana/", handle: "@danarnoldlorcana" },
      { platform: "Website", url: "https://metafy.gg/@danarnoldlorcana", label: "Coaching on Metafy" },
      { platform: "Twitch", url: "https://www.twitch.tv/danarnoldlorcana", handle: "@danarnoldlorcana" },
    ],
    tags: ["Meta reports", "Deck guides", "Tournaments", "Coaching"],
    avatar: "/img/creators/danarnoldlorcana.webp",
    since: "2026-11-05",
  },
];
