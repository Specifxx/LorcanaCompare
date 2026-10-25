import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function Login() {
  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="mb-6 font-display text-2xl font-black">Sign in or create an account</h1>
      <Suspense><LoginForm /></Suspense>
    </div>
  );
}
