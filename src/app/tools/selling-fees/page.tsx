import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { canon } from "@/lib/site";
import { Fees } from "./Fees";
import { fitDescription, fitTitle } from "@/lib/seo-title";

export const revalidate = 86400;
export const metadata: Metadata = {
  // Titled for the search (2026-11-26, page scorecard Job D: position 6.9, 15 impressions, no click; the old title ran
  // past 60 characters). The description states the rates the calculator uses (Fees.tsx).
  title: fitTitle([`${SITE.gameShort} Selling Fee Calculator: TCGplayer vs eBay`, `${SITE.gameShort} Selling Fee Calculator`]),
  description: fitDescription(`What you keep selling a ${SITE.game} card on TCGplayer (10.75% + 2.5% payment + $0.30) or eBay (13.25% + $0.40), after fees. Free calculator.`),
  ...canon("/tools/selling-fees"),
};

export default function Page() {
  return (
    <div className="max-w-3xl">
      <h1 className="page-title">Selling fee calculator</h1>
      <p className="page-lede">Estimates for a US seller using standard rates. Your actual fees depend on your seller level, store category and promotions, so check the marketplace&apos;s own fee page before relying on them.</p>
      <Fees />
    </div>
  );
}
