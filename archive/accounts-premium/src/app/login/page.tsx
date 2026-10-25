import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { FoundingOffer } from "@/components/FoundingOffer";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function Login() {
  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="mb-6 font-display text-2xl font-black">Sign in</h1>
      <Suspense><LoginForm /></Suspense>
      <div className="mt-8"><FoundingOffer compact /></div>
    </div>
  );
}
