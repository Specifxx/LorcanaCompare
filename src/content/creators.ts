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
      "Dan Arnold is a competitive Disney Lorcana player, Metafy coach and content creator with 25+ years of card game experience, including a 2019 Transformers TCG World Championship. His weekly data-driven meta reports and deck guides help players walk into their next Set Championship, CCQ or DLC ready to win.",
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
