// After each import: email every price alert whose product's cheapest in-stock
// USD price (stores, eBay US, TCGplayer) is at or under its target. At most one
// email per alert per 7 days (Rift Compare capped price-drop emails weekly).
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { SITE } from "@/site.config";
import type { Catalog } from "@/lib/site-types";
import { readSummary } from "@/lib/price-store";
import { decodeOffer } from "@/lib/offer-codec";
import { sendEmail, escapeHtml } from "@/lib/email";
import { money } from "@/lib/format";

async function main() {
  if (!process.env.DATABASE_URL) return console.log("[alerts] no DATABASE_URL — skipped");
  const dir = path.join(process.cwd(), "data", "public");
  const catalog = JSON.parse(fs.readFileSync(path.join(dir, "catalog.json"), "utf8")) as Catalog;
  const summary = readSummary();
  const byId = new Map(catalog.products.map((p) => [p.id, p]));
  const site = (process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE.domain}`).replace(/\/$/, "");
  const db = new PrismaClient();
  const weekAgo = new Date(Date.now() - 7 * 86_400_000);
  const alerts = await db.priceAlert.findMany({
    where: { OR: [{ lastSentAt: null }, { lastSentAt: { lt: weekAgo } }] },
    select: { id: true, productId: true, targetCents: true, user: { select: { email: true } } },
    take: 20000,
  });
  let sent = 0;
  for (const a of alerts) {
    const p = byId.get(a.productId);
    const best = (summary[a.productId]?.b ?? []).map(decodeOffer).filter((o) => o && o.currency === "USD").sort((x, y) => x!.cents - y!.cents)[0];
    if (!p || !best || best.cents > a.targetCents) continue;
    const ok = await sendEmail(
      a.user.email,
      `${p.name} is now ${money(best.cents)}`,
      `<p><b>${escapeHtml(p.name)}</b> hit your target of ${money(a.targetCents)}: it is <b>${money(best.cents)}</b> today.</p><p><a href="${site}/card/${p.slug}">Compare every store →</a></p><p style="color:#888;font-size:12px">You set this alert on ${SITE.name}. Manage alerts at ${site}/account.</p>`,
    );
    if (ok) {
      sent++;
      await db.priceAlert.update({ where: { id: a.id }, data: { lastSentAt: new Date() }, select: { id: true } });
    }
  }
  console.log(`[alerts] ${alerts.length} checked, ${sent} sent`);
  await db.$disconnect();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
