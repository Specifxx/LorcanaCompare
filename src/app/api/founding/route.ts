// How many founding-member places are left (first 50 accounts get Premium
// free). One count query, cached at the edge for five minutes.
import { NextResponse } from "next/server";
import { prisma, dbConfigured } from "@/lib/db";
import { FOUNDING_LIMIT } from "@/lib/premium";

export const dynamic = "force-dynamic";

export async function GET() {
  let left: number | null = null;
  if (dbConfigured()) {
    try {
      left = Math.max(0, FOUNDING_LIMIT - (await prisma.user.count({ where: { foundingMember: true } })));
    } catch {}
  }
  return NextResponse.json({ limit: FOUNDING_LIMIT, left }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
