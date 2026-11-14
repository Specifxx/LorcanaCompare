import type { Metadata } from "next";
import { SITE } from "@/site.config";
import { canon } from "@/lib/site";
import { Fees } from "./Fees";
import { fitDescription } from "@/lib/seo-title";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: `${SITE.gameShort} selling fee calculator — TCGplayer and eBay`,
  description: fitDescription(`How much you keep when you sell a ${SITE.game} card on TCGplayer or eBay, after fees. Free calculator.`),
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
