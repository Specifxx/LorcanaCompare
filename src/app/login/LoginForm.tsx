"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const next = useSearchParams().get("next") || "/account";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [err, setErr] = useState("");
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setErr("");
        const f = new FormData(e.currentTarget);
        const r = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: f.get("email"), password: f.get("password") }) });
        const d = (await r.json()) as { ok?: boolean; error?: string };
        if (d.ok) location.href = next.startsWith("/") ? next : "/account";
        else setErr(d.error ?? "Something went wrong");
      }}
    >
      <input name="email" type="email" required placeholder="Email" autoComplete="email" className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-2" />
      <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" autoComplete={mode === "login" ? "current-password" : "new-password"} className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-2" />
      {err && <p className="text-sm text-down">{err}</p>}
      <button className="btn-primary" type="submit">{mode === "login" ? "Sign in" : "Create account"}</button>
      <button type="button" className="text-sm text-muted hover:underline" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        {mode === "login" ? "New here? Create a free account" : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
