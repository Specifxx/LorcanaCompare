// temporary
import { readFileSync } from "node:fs";
const f = JSON.parse(readFileSync("data/fetch-live/au.json", "utf8")) as { cards: { s: string; no: string; n: string; f: string; p: number }[] };
for (const no of ["14/204", "23/204", "21/207", "209/204", "8"]) console.log(no, JSON.stringify(f.cards.filter((c) => c.no === no).map((c) => `${c.s}|${c.n}|${c.f}`).slice(0, 6)));
console.log("Hyperia", f.cards.filter((c) => c.s === "Hyperia City").length, "numbers", [...new Set(f.cards.filter((c) => c.s === "Hyperia City").map((c) => c.no))].length);
