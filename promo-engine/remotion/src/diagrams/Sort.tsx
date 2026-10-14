import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../types";
import { Square } from "../scenes/common";
import { sp, clamp, ease, cue } from "../util";

const ROWS = ["Refund request", "How do I export my data?", "Feature idea: dark mode", "Love the new update"];
const INIT = ["DM", "LP", "AN", "TO"];

/** N emails pour in, the pitches fly to Spam, the people stay, the refund rises to the top */
export const DiagramSort: React.FC<SceneProps> = ({ spec, brand, words, u, stageW, stageH }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const C = brand.colors;
  const total = spec.total ?? 44, spam = spec.spam ?? 40;
  const kept = [9, 20, 27, total - 3]; // indices that are real people; last one = refund
  const tSpam = cue(words, fps, "pitches", 40) - 4;
  const tTop = cue(words, fps, "top", tSpam + 50) - 18;
  const cols = 8, cw = 10, ch = 8.2, gx = 50 - (cols * cw) / 2 + cw / 2, gy = 12;
  const bin = { x: 15, y: 88 };
  let spamIdx = 0;
  const counted = Math.round(interpolate(f, [tSpam, tSpam + 34], [0, spam], clamp));
  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      <div style={{ position: "absolute", left: "50%", top: "-3%", transform: "translateX(-50%)", fontSize: u * 4.4, fontWeight: 800,
        color: C.muted, opacity: interpolate(f, [0, 8, tSpam, tSpam + 10], [0, 1, 1, 0], clamp), whiteSpace: "nowrap" }}>{total} new emails</div>
      {Array.from({ length: total }).map((_, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const x0 = gx + col * cw, y0 = gy + row * ch;
        const pop = sp(f, fps, i * 0.7, { damping: 12, stiffness: 170 });
        const keptAt = kept.indexOf(i);
        if (keptAt < 0) {
          const k = spamIdx++; const st = tSpam + k * 0.8;
          const t = ease(f, st, st + 16);
          const x = interpolate(t, [0, 1], [x0, bin.x]), y = interpolate(t, [0, 1], [y0, bin.y]) - Math.sin(t * Math.PI) * 14;
          if (t >= 1) return null;
          return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: u * 7.4, height: u * 5.4, transform: `translate(-50%,-50%) scale(${pop * (1 - 0.6 * t)}) rotate(${t * 200}deg)`,
            background: "#fff", border: `${u * 0.45}px solid ${C.ink}`, borderRadius: u * 1, opacity: 1 - t * 0.3 }}>
            <svg viewBox="0 0 10 7" width="100%" height="100%"><path d="M1 1.2 L5 4 L9 1.2" stroke={C.ink} strokeWidth={0.7} fill="none" strokeLinecap="round" /></svg>
          </div>;
        }
        // kept: becomes a row in the list
        const toList = ease(f, tSpam + 18, tSpam + 36);
        const refund = keptAt === 3;
        const slotFinal = refund ? 0 : keptAt + 1;
        const slot = interpolate(ease(f, tTop, tTop + 18), [0, 1], [keptAt, slotFinal]);
        const lx = 50, ly = 26 + slot * 14.5;
        const x = interpolate(toList, [0, 1], [x0, lx]), y = interpolate(toList, [0, 1], [y0, ly]);
        const wv = interpolate(toList, [0, 1], [7.4, 78]), hv = interpolate(toList, [0, 1], [5.4, 12]);
        const hl = refund ? ease(f, tTop, tTop + 14) : 0;
        return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: u * wv, height: u * hv, transform: `translate(-50%,-50%) scale(${pop * (1 + 0.04 * hl)})`,
          background: "#fff", border: `${u * (0.45 + 0.3 * hl)}px solid ${hl > 0.5 ? C.accentDark : C.ink}`, borderRadius: u * (1 + 1.4 * toList), zIndex: refund ? 3 : 2,
          boxShadow: hl ? `0 ${u * 2}px ${u * 4}px rgba(234,88,12,${0.35 * hl})` : "none", display: "flex", alignItems: "center", gap: u * 2, padding: `0 ${u * 2.4 * toList}px`, overflow: "hidden" }}>
          <div style={{ opacity: toList, display: "flex", alignItems: "center", gap: u * 2, width: "100%" }}>
            <div style={{ flex: "none", width: u * 7, height: u * 7, borderRadius: "50%", background: refund ? "#ffedd5" : "#e7e5e4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: u * 2.8, fontWeight: 700 }}>{refund ? INIT[0] : INIT[keptAt + 1]}</div>
            <div style={{ fontSize: u * 3.9, fontWeight: 650, whiteSpace: "nowrap", flex: 1 }}>{refund ? ROWS[0] : ROWS[keptAt + 1]}</div>
          </div>
        </div>;
      })}
      {/* refund tag */}
      <div style={{ position: "absolute", left: "50%", top: "13%", transform: `translate(-50%,-50%) scale(${sp(f, fps, tTop + 14, { damping: 10 })})`, zIndex: 4,
        background: C.accentDark, color: "#fff", fontSize: u * 3.6, fontWeight: 800, padding: `${u * 0.9}px ${u * 2.4}px`, borderRadius: u * 2, whiteSpace: "nowrap" }}>{spec.topLabel ?? "Can't wait"}</div>
      {/* spam bin */}
      <div style={{ position: "absolute", left: `${bin.x}%`, top: `${bin.y}%`, transform: `translate(-50%,-50%) scale(${sp(f, fps, tSpam - 10)})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: u * 18, height: u * 3, background: C.ink, borderRadius: u, transform: `rotate(${interpolate(f, [tSpam - 4, tSpam + 4, tSpam + 40, tSpam + 48], [0, -18, -18, 0], clamp)}deg)`, transformOrigin: "0% 100%" }} />
        <div style={{ width: u * 15, height: u * 14, background: "#d6d3d1", border: `${u * 0.5}px solid ${C.ink}`, borderTop: "none", borderRadius: `0 0 ${u * 2}px ${u * 2}px`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: u * 5.4, fontWeight: 900, lineHeight: 1 }}>{counted}</div>
          <div style={{ fontSize: u * 3, fontWeight: 700 }}>{spec.spamLabel ?? "Spam"}</div>
        </div>
      </div>
    </Square>
  );
};
