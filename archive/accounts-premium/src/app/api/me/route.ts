import { NextResponse } from "next/server";
import { getSessionSnapshot } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  // Signed-out visitors and fresh cookies never touch the database.
  const u = await getSessionSnapshot();
  return NextResponse.json(
    { user: u ? { email: u.email, tier: u.tier, isAdmin: u.isAdmin } : null },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
