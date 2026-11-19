import type { Metadata } from "next";
import { SignIn } from "@/components/premium/SignIn";

// Sign in ON this site (owner, 2026-11-19): Google, Discord or an emailed link; the account lives with RiftCompare's (lib/premium-member.ts).
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: true } };

export default function AccountPage() {
  return (
    <div className="py-6 sm:py-10">
      <SignIn />
    </div>
  );
}
