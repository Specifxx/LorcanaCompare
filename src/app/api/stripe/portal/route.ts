import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { abs } from "@/lib/site";

export async function POST(req: Request) {
  const u = await getUser();
  if (!u?.stripeCustomerId) return NextResponse.redirect(new URL("/premium", req.url), 303);
  const s = await stripe<{ url: string }>("billing_portal/sessions", { customer: u.stripeCustomerId, return_url: abs("/account") });
  return NextResponse.redirect(s.url, 303);
}
