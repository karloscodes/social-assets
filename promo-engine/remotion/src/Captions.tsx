import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import type { Brand, Word, SceneSpec } from "./types";

type Page = { words: Word[]; start: number; end: number; scene: number };
// phrase-aware caption pages: break at punctuation first, then at natural seams (before "and/but/so/to/..."),
// never right after glue words like "the", "a", "you've", "your".
const GLUE = new Set(["the", "a", "an", "to", "of", "your", "my", "our", "you've", "you're", "it's", "is", "are", "was", "can", "can't", "in", "on", "at", "for", "with", "from", "and", "but", "so", "like", "that", "just", "more", "than", "old", "upset", "separate", "just", "look", "grok", "claude"]);
const BREAK_BEFORE = new Set(["and", "but", "so", "because", "from", "with", "to", "until", "like", "that", "if", "or", "about", "at", "under", "is", "can"]);
const plain = (w: Word) => w.text.toLowerCase().replace(/[^\w'$]/g, "");
const chars = (ws: Word[]) => ws.map((x) => x.text).join(" ").length;
const split = (ws: Word[], maxWords: number, maxChars: number): Word[][] => {
  if (ws.length <= maxWords && chars(ws) <= maxChars) return [ws];
  let best = 1, bestCost = Infinity;
  for (let k = 1; k < ws.length; k++) {
    const l = ws.slice(0, k), r = ws.slice(k);
    let cost = Math.abs(chars(l) - chars(r));
    if (GLUE.has(plain(ws[k - 1]))) cost += 30;
    if (BREAK_BEFORE.has(plain(ws[k]))) cost -= 14;
    if (/^\$?\d/.test(ws[k - 1].text)) cost += 20;
    if (l.length === 1 || r.length === 1) cost += 25;
    if (cost < bestCost) { bestCost = cost; best = k; }
  }
  return [...split(ws.slice(0, best), maxWords, maxChars), ...split(ws.slice(best), maxWords, maxChars)];
};
const paginate = (words: Word[], maxWords = 5, maxChars = 26): Page[] => {
  const phrases: Word[][] = []; let cur: Word[] = [];
  for (const w of words) {
    if (cur.length && w.scene !== cur[0].scene) { phrases.push(cur); cur = []; }
    cur.push(w);
    if (/[.?!,:;]$/.test(w.text)) { phrases.push(cur); cur = []; }
  }
  if (cur.length) phrases.push(cur);
  return phrases.flatMap((p) => split(p, maxWords, maxChars)).map((ws) => ({ words: ws, start: ws[0].start, end: ws[ws.length - 1].end, scene: ws[0].scene }));
};

export const Captions: React.FC<{ words: Word[]; scenes: SceneSpec[]; brand: Brand; box: { y: number; h: number; left: number; right: number }; width: number }> =
  ({ words, scenes, brand, box, width }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const pages = React.useMemo(() => paginate(words), [words]);
  const idx = pages.findIndex((p, i) => t >= p.start - 0.05 && t < (pages[i + 1] ? Math.min(pages[i + 1].start - 0.05, p.end + 0.6) : p.end + 0.8));
  if (idx < 0) return null;
  const page = pages[idx];
  const sc = scenes[page.scene] as any;
  if (sc?.captions === false || (sc?.type === "kinetic-text" && sc?.captions !== true)) return null;
  const dark = !!scenes[page.scene]?.dark || brand.theme === "dark";
  const onAcc = brand.colors.onAccent ?? "#fff";
  const accBg = brand.theme === "dark" ? brand.colors.accent : brand.colors.accentDark;
  const accShadow = brand.theme === "dark" ? "0 10px 24px rgba(0,0,0,0.5)" : "0 10px 24px rgba(234,88,12,0.35)";
  const fs = Math.round(width * (width < 1200 ? 0.072 : 0.04));
  const enter = spring({ frame: f - Math.round((page.start - 0.05) * fps), fps, config: { damping: 13, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", left: box.left, width: width - box.left - box.right, top: box.y, height: box.h,
      display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", alignContent: "center", gap: `${fs * 0.12}px ${fs * 0.22}px`,
      transform: `translateY(${(1 - enter) * fs * 0.25}px) scale(${0.94 + 0.06 * enter})` }}>
      {page.words.map((w, i) => {
        const active = t >= w.start - 0.03 && t < (page.words[i + 1]?.start ?? page.end + 0.8);
        const said = t >= w.start - 0.03;
        const pop = spring({ frame: f - Math.round(w.start * fps), fps, config: { damping: 10, stiffness: 260 } });
        return (
          <span key={i} style={{ fontSize: fs, fontWeight: 850, letterSpacing: -fs * 0.02, lineHeight: 1.1,
            padding: `${fs * 0.04}px ${fs * 0.16}px`, borderRadius: fs * 0.2,
            color: active ? onAcc : dark ? (said ? "#fff" : "rgba(255,255,255,0.55)") : (said ? brand.colors.ink : "rgba(28,25,23,0.45)"),
            background: active ? accBg : "transparent",
            transform: `scale(${active ? 1 + 0.08 * pop : 1}) rotate(${active ? -2 * pop : 0}deg)`,
            boxShadow: active ? accShadow : "none",
            textShadow: !active && !dark ? "0 2px 0 rgba(255,255,255,0.6)" : dark && !active ? "0 2px 8px rgba(0,0,0,0.8)" : "none" }}>{w.text.replace(/[.,;:]+$/, "")}</span>
        );
      })}
    </div>
  );
};
