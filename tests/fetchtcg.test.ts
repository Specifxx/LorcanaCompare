import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { cents, pickCondition } from "../src/lib/fetchtcg";

test("Fetch's price is dollars; we keep cents", () => {
  assert.equal(cents(1.2), 120);
  assert.equal(cents(0.29), 29);
});

test("Near Mint wins, graded and damaged copies never", () => {
  assert.deepEqual(pickCondition([{ condition: "Light Play", price: 1 }, { condition: "Near Mint", price: 2 }, { condition: "PSA 10", price: 0.5 }]), { condition: "Near Mint", price: 2 });
  assert.equal(pickCondition([{ condition: "PSA 10", price: 10 }, { condition: "Damaged", price: 1 }]), null);
});

test("a card matches only on collector number, set and name; a stale or missing file shows nothing", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "fetchtcg-"));
  mkdirSync(path.join(dir, "data", "fetch-live"), { recursive: true });
  const c = (o: object) => ({ s: "Hyperia City", no: "100/204", n: "Belle's City Guide", f: "Normal", c: "Near Mint", p: 40, u: "https://www.fetchtcg.com/cards/x?utm_source=a", ...o });
  writeFileSync(
    path.join(dir, "data", "fetch-live", "au.json"),
    JSON.stringify({ fetchedAt: new Date().toISOString(), cards: [c({}), c({ f: "Cold Foil", p: 400 }), c({ no: "101/204", n: "Twin" }), c({ no: "101/204", n: "Other name" })] }),
  );
  const cwd = process.cwd();
  process.chdir(dir);
  try {
    const { fetchRowsFor } = await import("../src/lib/fetchtcg");
    const r = fetchRowsFor({ name: "Belle's City Guide", number: "100/204", setName: "Hyperia City" });
    assert.deepEqual(r?.rows.map((x) => [x.finish, x.priceCents]), [["Normal", 40], ["Cold Foil", 400]]);
    assert.equal(fetchRowsFor({ name: "Belle's City Guide", number: "0100/204", setName: "hyperia city" })?.rows.length, 2, "leading zeros and case do not matter");
    assert.equal(fetchRowsFor({ name: "Belle's City Guide", number: "100/204", setName: "Azurite Sea" }), null, "another set is another card");
    assert.equal(fetchRowsFor({ name: "Twin", number: "101/204", setName: "Hyperia City" }), null, "two names on one number is ambiguous");
    assert.equal(fetchRowsFor({ name: "Belle's City Guide", number: null, setName: "Hyperia City" }), null);
  } finally {
    process.chdir(cwd);
  }
});

test("the feed is never committed and the build reads it", () => {
  assert.match(readFileSync(".gitignore", "utf8"), /^\/data\/fetch-live\/$/m);
  assert.match(readFileSync("package.json", "utf8"), /fetch-fetchtcg\.ts/);
});
