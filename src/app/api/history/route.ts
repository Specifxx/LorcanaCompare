import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { historyOf, productById } from "@/lib/data";
import { LIMITS } from "@/lib/premium";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const u = await getUser();
  const days = LIMITS[u?.tier ?? "free"].historyDays;
  if (!u || u.tier === "free") return NextResponse.json({ error: "Plus or Premium" }, { status: 403 });
  const p = productById(Number(new URL(req.url).searchParams.get("id")));
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ series: historyOf(p), days }, { headers: { "Cache-Control": "private, max-age=3600" } });
}
