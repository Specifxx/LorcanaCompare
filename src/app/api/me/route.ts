import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const u = await getUser();
  return NextResponse.json(
    { user: u ? { email: u.email, tier: u.tier, isAdmin: u.isAdmin } : null },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
