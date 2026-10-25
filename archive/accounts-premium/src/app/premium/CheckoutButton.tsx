"use client";
import { useState } from "react";

export function CheckoutButton({ tier, interval, label, ghost }: { tier: string; interval: string; label: string; ghost?: boolean }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      className={ghost ? "btn-ghost" : "btn-primary"}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const r = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier, interval }) });
        if (r.status === 401) return (location.href = "/login?next=/premium");
        const d = (await r.json()) as { url?: string; error?: string };
        if (d.url) location.href = d.url;
        else { alert(d.error ?? "Checkout is not available yet"); setBusy(false); }
      }}
    >
      {busy ? "…" : label}
    </button>
  );
}
