"use client";
import { useState } from "react";
import type { Series } from "@/lib/series";
import { PriceChart } from "./PriceChart";

/** Longer history for paying members, fetched on demand so the page itself
 *  stays one cached document for everyone. */
export function PremiumHistory({ productId }: { productId: number }) {
  const [state, setState] = useState<{ series: Series; days: number } | "locked" | null>(null);
  return (
    <div className="mt-3">
      {state && state !== "locked" && <PriceChart series={state.series} days={state.days} />}
      {state === "locked" ? (
        <p className="text-sm text-muted">Full price history is part of <a className="link" href="/premium">Plus and Premium</a>.</p>
      ) : (
        !state && (
          <button
            className="text-sm text-brand-400 hover:underline"
            onClick={async () => {
              const r = await fetch(`/api/history?id=${productId}`);
              if (r.status === 403) return setState("locked");
              setState((await r.json()) as { series: Series; days: number });
            }}
          >
            Show full history →
          </button>
        )
      )}
    </div>
  );
}
