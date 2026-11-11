// temporary
import { readFileSync } from "node:fs";
import { fetchRowsFor } from "../src/lib/fetchtcg";
const cat = JSON.parse(readFileSync("data/public/catalog.json", "utf8")) as { sets: { id: number; name: string }[]; products: { name: string; number: string | null; setId: number; kind: string }[] };
const sets = new Map(cat.sets.map((s) => [s.id, s.name]));
let n = 0, hit = 0, both = 0; const miss: Record<string, string[]> = {};
for (const p of cat.products) { if (p.kind !== "card") continue; n++; const r = fetchRowsFor({ name: p.name, number: p.number, setName: sets.get(p.setId) ?? null }); if (r) { hit++; if (r.rows.length > 1) both++; } else (miss[sets.get(p.setId) ?? "?"] ||= []).push(`${p.number} ${p.name}`); }
console.log("cards", n, "matched", hit, "both finishes", both);
for (const [s, m] of Object.entries(miss)) console.log("MISS", s, m.length, m.slice(0, 3).join(" ;; "));
const f = JSON.parse(readFileSync("data/fetch-live/au.json", "utf8")) as { cards: { s: string; no: string; n: string; f: string }[] };
const fin: Record<string, number> = {}; for (const c of f.cards) fin[c.f] = (fin[c.f] || 0) + 1; console.log("finishes", JSON.stringify(fin));
console.log("FETCH sample", f.cards.slice(0, 3).map((c) => `${c.s}|${c.no}|${c.n}`).join(" ;; "));
