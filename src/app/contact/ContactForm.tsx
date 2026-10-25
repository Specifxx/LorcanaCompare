"use client";
import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState("");
  return (
    <form
      className="mt-6 flex flex-col gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.currentTarget));
        const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
        const d = (await r.json()) as { ok?: boolean; error?: string };
        setState(d.ok ? "Thanks — message sent." : d.error ?? "Could not send");
      }}
    >
      <select name="kind" className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-2"><option value="contact">General</option><option value="store">List my store</option><option value="feedback">Report a price</option></select>
      <input name="email" type="email" required placeholder="Your email" className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-2" />
      <textarea name="message" required rows={6} placeholder="Message" className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-2" />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button className="btn-primary">Send</button>
      {state && <p className="text-sm text-muted">{state}</p>}
    </form>
  );
}
