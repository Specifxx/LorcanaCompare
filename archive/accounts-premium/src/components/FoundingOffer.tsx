"use client";
import { useEffect, useState } from "react";

/** "First 50 accounts get Premium free — N left", from /api/founding. */
export function FoundingOffer({ compact = false }: { compact?: boolean }) {
  const [d, setD] = useState<{ limit: number; left: number | null } | null>(null);
  useEffect(() => {
    fetch("/api/founding").then((r) => r.json()).then(setD).catch(() => {});
  }, []);
  const limit = d?.limit ?? 50;
  const gone = d?.left === 0;
  if (gone && compact) return null;
  return (
    <div className="card-surface border-brand/60 p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-400">Founding members</p>
      <p className="mt-1 text-xl font-bold">
        {gone ? "All founding places are taken" : `The first ${limit} accounts get Premium free`}
      </p>
      {!gone && (
        <p className="mt-1 text-sm text-muted">
          {d?.left != null ? <><b className="text-fg">{d.left}</b> of {limit} places left. </> : null}
          Create a free account and Premium is yours — no card, no trial, no catch.
        </p>
      )}
      {!gone && <a href="/login?next=/account" className="btn-primary mt-4">Claim a founding place</a>}
    </div>
  );
}
