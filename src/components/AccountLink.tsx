"use client";
// Account state is fetched client-side so every page stays cacheable for
// everyone (the Rift Compare use-me pattern). Also stamps data-adfree for
// paying members so ad slots hide.
import { useEffect, useState } from "react";

export interface Me { email: string; tier: string; isAdmin: boolean }

export function useMe(): Me | null | undefined {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d: { user: Me | null }) => {
        setMe(d.user);
        if (d.user && d.user.tier !== "free") document.documentElement.setAttribute("data-adfree", "");
      })
      .catch(() => setMe(null));
  }, []);
  return me;
}

export function AccountLink() {
  const me = useMe();
  if (me === undefined) return <span className="w-16" />;
  if (!me) return <a href="/login" className="btn-ghost px-3 py-1 text-xs">Sign in</a>;
  return (
    <span className="flex items-center gap-2">
      {me.isAdmin && <a href="/admin" className="text-xs text-brand-400">Admin</a>}
      <a href="/account" className="btn-ghost px-3 py-1 text-xs">Account</a>
    </span>
  );
}
