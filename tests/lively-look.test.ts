import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SITE } from "../src/site.config";
import { contrast, lookCss } from "../src/lib/theme-vars";

// The lively look (owner, 2026-11-26; DECISIONS.md): decoration only. These pin what keeps it that way.
const css = readFileSync("src/app/globals.css", "utf8");
const start = css.indexOf("── The lively look");
const block = css.slice(start).replace(/\/\*[\s\S]*?\*\//g, "");
const art = readFileSync("src/components/HeroArt.tsx", "utf8");

test("the lively look is the last block of globals.css, with no image and no font", () => {
  assert.ok(start > 0, "globals.css needs the block that starts '── The lively look'");
  assert.ok(!/url\(/.test(block), "no url( in the lively look: gradients only");
  assert.ok(!/@font-face|@import/.test(block));
});

test("every animation of the look sits inside prefers-reduced-motion: no-preference", () => {
  const open = block.indexOf("@media screen and (prefers-reduced-motion: no-preference)");
  const close = block.indexOf("@keyframes", open);
  assert.ok(open > 0 && close > open);
  const outside = block.slice(0, open) + block.slice(close).replace(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");
  assert.ok(!/animation(-name)?\s*:/.test(outside), "an animation outside the motion block would move for a visitor who asked for less motion");
  // What moves is what a compositor moves: transform, opacity, and a gradient's position.
  for (const frames of block.slice(close).match(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g) ?? []) {
    for (const prop of frames.match(/[a-z-]+(?=\s*:)/g) ?? []) assert.ok(["transform", "opacity", "background-position"].includes(prop), `${prop} in ${frames.slice(0, 30)}`);
  }
});

test("the look is opt-in and never outranks a site's own stylesheet", () => {
  for (const sel of block.match(/^[^@{}\n][^{}]*(?=\{)/gm) ?? []) {
    for (const part of sel.split(",")) {
      if (part.includes("[data-look")) assert.ok(/:where\(:root\[data-look[^)]*\)/.test(part), `wrap the scope in :where(): ${part.trim()}`);
    }
  }
});

test("the hero art is decoration: hidden from readers, no link, no photo, no script, out of the flow", () => {
  assert.ok(art.includes('className="hero-art" aria-hidden="true"'));
  assert.ok(!/<a\b|<img\b|<Link\b|"use client"|<canvas\b|url\(/.test(art));
  assert.match(block, /\.hero-art\s*\{[^}]*position:\s*absolute[^}]*pointer-events:\s*none/);
  // Inside the page's column, never the window's empty sides.
  assert.match(block, /\.hero-art\s*\{[^}]*width:\s*min\(100%,\s*80rem\)/);
  const page = readFileSync("src/app/page.tsx", "utf8");
  assert.equal(page.match(/<HeroArt \/>/g)?.length, 1);
  assert.match(readFileSync("src/app/layout.tsx", "utf8"), /data-look=\{SITE\.look\?\.art\}/);
});

test("the look's colours come from SITE.look, and the light theme's read as text", () => {
  const out = lookCss();
  if (!SITE.look) return assert.equal(out, "");
  for (const n of ["a", "b", "c", "h1", "h2", "h3", "h4", "h5", "h6"]) assert.ok(out.includes(`--lv-${n}:`), `--lv-${n}`);
  const light = out.split('[data-theme="light"]{')[1];
  for (const m of light.matchAll(/--lv-[a-z0-9]+:(\d+) (\d+) (\d+)/g)) {
    assert.ok(contrast([+m[1], +m[2], +m[3]], [255, 255, 255]) >= 4.5, `${m[0]} on white`);
  }
});
