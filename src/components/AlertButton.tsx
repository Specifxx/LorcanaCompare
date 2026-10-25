"use client";
import { useState } from "react";
import { useMe } from "./AccountLink";

export function AlertButton({ productId, refCents }: { productId: number; refCents: number | null }) {
  const me = useMe();
  const [target, setTarget] = useState(refCents ? ((refCents * 0.9) / 100).toFixed(2) : "");
  const [msg, setMsg] = useState("");
  if (me === undefined) return null;
  if (!me)
    return (
      <a href={`/login?next=${encodeURIComponent(typeof window !== "undefined" ? location.pathname : "/")}`} className="btn-ghost w-full">
        🔔 Email me when it drops
      </a>
    );
  return (
    <form
      className="flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await fetch("/api/alerts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, targetCents: Math.round(Number(target) * 100) }) });
        const d = (await r.json()) as { ok?: boolean; error?: string };
        setMsg(d.ok ? "Alert set — we'll email you." : d.error ?? "Could not save");
      }}
    >
      <label className="sr-only" htmlFor="target">Target price (USD)</label>
      <input id="target" value={target} onChange={(e) => setTarget(e.target.value)} inputMode="decimal" className="w-24 rounded-md border border-ink-700 bg-ink-900 px-2 text-sm" />
      <button className="btn-primary flex-1" type="submit">🔔 Alert me</button>
      {msg && <p className="text-xs text-muted">{msg}</p>}
    </form>
  );
}
