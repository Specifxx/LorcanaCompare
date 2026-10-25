// Admin dashboard (owner only: bill.jyang101@gmail.com, lib/admin.ts). Reads
// the private database with bounded aggregate queries plus the public data
// files' meta, so it works and stays cheap however large the click log grows.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/site.config";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { meta, productById } from "@/lib/data";
import { ago, money } from "@/lib/format";
import { PLANS } from "@/lib/premium";
import { shortName } from "@/lib/names";
import { sourceNameServer } from "@/lib/sources";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function Admin() {
  const u = await getUser();
  if (!u?.isAdmin) notFound();
  const day = new Date(Date.now() - 86_400_000);
  const week = new Date(Date.now() - 7 * 86_400_000);
  const month = new Date(Date.now() - 30 * 86_400_000);
  const founders = await prisma.user.count({ where: { foundingMember: true } });
  const [users, newUsers, tiers, alerts, clicks24, clicks7, bySource, topProducts, messages, subs] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: week } } }),
    prisma.user.groupBy({ by: ["tier"], where: { premiumUntil: { gt: new Date() } }, _count: { _all: true } }),
    prisma.priceAlert.count(),
    prisma.clickEvent.count({ where: { at: { gte: day } } }),
    prisma.clickEvent.count({ where: { at: { gte: week } } }),
    prisma.clickEvent.groupBy({ by: ["source"], where: { at: { gte: month } }, _count: { _all: true }, orderBy: { _count: { source: "desc" } }, take: 20 }),
    prisma.clickEvent.groupBy({ by: ["productId"], where: { at: { gte: month }, productId: { not: null } }, _count: { _all: true }, orderBy: { _count: { productId: "desc" } }, take: 15 }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 20, select: { id: true, email: true, message: true, kind: true, createdAt: true } }),
    prisma.newsletterSubscriber.count(),
  ]);
  const paid = Object.fromEntries(tiers.map((t) => [t.tier, t._count._all]));
  const mrr = (paid.plus ?? 0) * PLANS.plus.monthly + Math.max(0, (paid.premium ?? 0) - founders) * PLANS.premium.monthly;
  const m = meta();
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-3xl font-black">{SITE.name} admin</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Users" value={users} sub={`+${newUsers} this week`} />
        <Stat label="Founding members" value={`${founders}/50`} sub="Premium free" />
        <Stat label="Paying" value={Math.max(0, (paid.plus ?? 0) + (paid.premium ?? 0) - founders)} sub="paid plans: coming soon" />
        <Stat label="MRR (list price)" value={money(mrr)} sub="yearly plans counted monthly" />
        <Stat label="Affiliate clicks" value={clicks24} sub={`${clicks7} in 7 days`} />
        <Stat label="Price alerts" value={alerts} />
        <Stat label="Newsletter" value={subs} />
        <Stat label="eBay calls today" value={m?.ebay ? `${m.ebay.calls}/${m.ebay.budget}` : "—"} sub={m?.ebay ? `${m.ebay.eligible} products ≥ $${SITE.ebay.minPriceUsd}` : "not configured"} />
        <Stat label="Prices updated" value={m ? ago(m.updatedAt) : "never"} sub={m ? `${m.counts.offers.toLocaleString()} offers` : ""} />
      </div>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-4">
          <h2 className="mb-2 font-bold">Clicks by destination (30 days)</h2>
          <table className="w-full text-sm"><tbody>{bySource.map((r) => (<tr key={r.source} className="border-t border-ink-800"><td className="py-1">{sourceNameServer({ source: r.source, market: "US" })}</td><td className="text-right">{r._count._all}</td></tr>))}</tbody></table>
        </div>
        <div className="card-surface p-4">
          <h2 className="mb-2 font-bold">Most-clicked products (30 days)</h2>
          <table className="w-full text-sm"><tbody>{topProducts.map((r) => { const p = r.productId ? productById(r.productId) : null; return (<tr key={String(r.productId)} className="border-t border-ink-800"><td className="py-1">{p ? <Link className="hover:underline" href={`/card/${p.slug}`}>{shortName(p.name)}</Link> : r.productId}</td><td className="text-right">{r._count._all}</td></tr>); })}</tbody></table>
        </div>
      </section>
      <section className="card-surface p-4">
        <h2 className="mb-2 font-bold">Store imports</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted"><tr><th>Store</th><th>Status</th><th className="text-right">Listings</th><th className="text-right">Matched</th><th className="text-right">Last OK</th></tr></thead>
          <tbody>
            {SITE.stores.map((s) => { const st = m?.stores[s.key]; return (
              <tr key={s.key} className="border-t border-ink-800"><td className="py-1">{s.name} <span className="text-xs text-muted">{s.market}</span></td><td className={st?.ok ? "text-up" : "text-down"}>{st ? (st.ok ? "OK" : `FAILED: ${st.error?.slice(0, 60)}`) : "not run"}</td><td className="text-right">{st?.products ?? 0}</td><td className="text-right">{st?.matched ?? 0}</td><td className="text-right text-muted">{st ? ago(st.at) : ""}</td></tr>
            ); })}
          </tbody>
        </table>
      </section>
      <section className="card-surface p-4">
        <h2 className="mb-2 font-bold">Messages</h2>
        {!messages.length && <p className="text-sm text-muted">None yet.</p>}
        {messages.map((c) => (<div key={c.id} className="border-t border-ink-800 py-2 text-sm"><p className="text-xs text-muted">{c.kind} · {c.email} · {c.createdAt.toISOString().slice(0, 16)}</p><p className="whitespace-pre-wrap">{c.message}</p></div>))}
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-surface p-4">
      <p className="text-xs uppercase text-muted">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}
