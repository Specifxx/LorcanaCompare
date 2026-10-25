import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productById, refCents } from "@/lib/data";
import { money } from "@/lib/format";
import { LIMITS } from "@/lib/premium";
import { shortName } from "@/lib/names";
import { DeleteAlert } from "./DeleteAlert";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default async function Account({ searchParams }: { searchParams: { upgraded?: string } }) {
  const u = await getUser();
  if (!u) redirect("/login?next=/account");
  const founding = (await prisma.user.findUnique({ where: { id: u.id }, select: { foundingMember: true } }))?.foundingMember ?? false;
  const alerts = await prisma.priceAlert.findMany({ where: { userId: u.id }, select: { id: true, productId: true, targetCents: true, lastSentAt: true }, take: 500, orderBy: { createdAt: "desc" } });
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-black">Your account</h1>
      {searchParams.upgraded && <p className="mt-3 rounded-lg bg-buy/20 p-3 text-sm">Thanks for upgrading! Your plan is active (it can take a minute to show).</p>}
      <div className="card-surface mt-4 flex flex-wrap items-center gap-4 p-4">
        <div className="flex-1">
          <p className="text-sm text-muted">{u.email}</p>
          <p className="font-semibold capitalize">{u.tier} plan{u.isAdmin && " · admin"}</p>
          {founding && <p className="text-sm text-brand-400">★ Founding member: Premium is free for you, for good.</p>}
        </div>
        {u.tier === "free" ? <Link href="/premium" className="btn-ghost">Premium: coming soon</Link> : u.stripeCustomerId && <form action="/api/stripe/portal" method="post"><button className="btn-ghost">Manage billing</button></form>}
        <form action="/api/auth/logout" method="post"><button className="btn-ghost">Sign out</button></form>
      </div>
      <h2 className="mb-2 mt-8 text-lg font-bold">Price alerts ({alerts.length}/{LIMITS[u.tier].alerts})</h2>
      {!alerts.length && <p className="text-sm text-muted">No alerts yet. Open any card and press “Alert me”.</p>}
      <ul>
        {alerts.map((a) => {
          const p = productById(a.productId);
          return (
            <li key={a.id} className="flex items-center justify-between gap-3 border-t border-ink-800 py-2 text-sm">
              {p ? <Link className="flex-1 truncate hover:underline" href={`/card/${p.slug}`}>{shortName(p.name)}</Link> : <span className="flex-1">Product {a.productId}</span>}
              <span className="text-muted">now {money(p ? refCents(p.id) : null)}</span>
              <span>alert at <b>{money(a.targetCents)}</b></span>
              <DeleteAlert id={a.id} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
