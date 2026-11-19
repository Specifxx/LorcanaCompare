"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { adFreePath } from "@/lib/ad-free-paths";
import { usePremium } from "./premium/usePremium";

/** Renders its ads everywhere except the ad-free pages (lib/ad-free-paths.ts): Premium, account, sign-in, collection, watches, giveaway. */
export function AdRouteGate({ children }: { children: ReactNode }) {
  // Premium members see no banner ads anywhere (owner, 2026-11-19): not drawn at all, so the phone dock never lifts the bottom nav.
  const member = usePremium().status === "member";
  const path = usePathname();
  return member || adFreePath(path) ? null : <>{children}</>;
}
