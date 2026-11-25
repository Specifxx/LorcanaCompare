import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { canon } from "@/lib/site";
import { Trade } from "./Trade";
import { fitDescription, fitTitle } from "@/lib/seo-title";

export const revalidate = 86400;
export const metadata: Metadata = {
  // Scorecard 2026-11-23: position 8 and no clicks. Say what it values them at.
  title: fitTitle([
    `${SITE.gameShort} trade calculator: value cards at market price`,
    `${SITE.gameShort} trade calculator: is your trade fair?`,
    `${SITE.gameShort} trade calculator`,
  ]),
  description: fitDescription(`Value both sides of a ${SITE.game} trade at today's TCGplayer market price. Free, no account.`),
  ...canon("/tools/trade"),
};

export default function Page() {
  return (
    <div>
      <h1 className="page-title">{SITE.gameShort} trade calculator</h1>
      <p className="page-lede">One card per line on each side (&ldquo;2 Card Name&rdquo; works). Valued at today&apos;s TCGplayer market price.</p>
      <Trade />
    </div>
  );
}
