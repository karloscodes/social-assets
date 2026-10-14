import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../types";
import { Square } from "../scenes/common";
import { sp, clamp, ease, cue } from "../util";

/** an old answer links to a new question and lands in the composer */
export const DiagramReply: React.FC<SceneProps> = ({ spec, brand, words, u, stageW, stageH }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const C = brand.colors;
  const tQ = cue(words, fps, "next", 30) - 6;
  const tLink = cue(words, fps, "old", tQ + 20) - 8;
  const tReady = cue(words, fps, "ready", tLink + 20) - 6;
  const draw = ease(f, tLink, tLink + 16);
  const answer: string = spec.answer;
  const typed = Math.round(interpolate(f, [tLink + 12, tReady + 8], [0, answer.length], clamp));
  const card = (extra: React.CSSProperties): React.CSSProperties => ({ position: "absolute", background: "#fff", border: `${u * 0.45}px solid ${C.ink}`, borderRadius: u * 3,
    padding: `${u * 2.2}px ${u * 3}px`, boxShadow: `${u * 1}px ${u * 1}px 0 ${C.ink}`, ...extra });
  const a = sp(f, fps, 2), q = sp(f, fps, tQ), comp = sp(f, fps, tLink);
  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      <div style={card({ left: "2%", top: "0%", width: "62%", transform: `scale(${a}) rotate(-2deg)`, transformOrigin: "0 0", background: C.ink, color: "#fff", boxShadow: `${u}px ${u}px 0 ${C.accent}` })}>
        <div style={{ fontSize: u * 3, fontWeight: 700, opacity: 0.6, marginBottom: u }}>YOU · LAST MONTH</div>
        <div style={{ fontSize: u * 4, fontWeight: 600, lineHeight: 1.3 }}>{answer}</div>
      </div>
      <div style={card({ right: "0%", top: "34%", width: "60%", transform: `scale(${q}) rotate(2deg)`, transformOrigin: "100% 0", display: "flex", gap: u * 2, alignItems: "center" })}>
        <div style={{ flex: "none", width: u * 8, height: u * 8, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: u * 3.2, fontWeight: 700 }}>JL</div>
        <div><div style={{ fontSize: u * 3, fontWeight: 700, color: C.muted }}>NEW QUESTION</div><div style={{ fontSize: u * 4.3, fontWeight: 700 }}>{spec.question}</div></div>
      </div>
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d="M22 26 C 10 50, 20 62, 40 66" fill="none" stroke={C.accentDark} strokeWidth={1.1} strokeDasharray="2.4 1.8" pathLength={100}
          style={{ clipPath: `inset(0 0 ${100 - draw * 100}% 0)` }} />
        <circle cx={40} cy={66} r={1.6 * draw} fill={C.accentDark} />
      </svg>
      <div style={{ position: "absolute", left: "2%", top: "44%", transform: `scale(${sp(f, fps, tLink + 8, { damping: 9 })})`, background: C.accentDark, color: "#fff",
        fontSize: u * 3.4, fontWeight: 800, padding: `${u * 0.8}px ${u * 2.2}px`, borderRadius: u * 2, whiteSpace: "nowrap" }}>✦ {spec.badge}</div>
      <div style={card({ left: "6%", right: "6%", top: "60%", transform: `translateY(${(1 - comp) * u * 20}px)`, opacity: comp, borderColor: C.accentDark, boxShadow: `${u}px ${u}px 0 ${C.accentDark}`, background: "#fff7ed" })}>
        <div style={{ fontSize: u * 3, fontWeight: 700, color: C.accentDark, marginBottom: u }}>SUGGESTED REPLY</div>
        <div style={{ fontSize: u * 4, fontWeight: 600, lineHeight: 1.3, minHeight: u * 10.5 }}>{answer.slice(0, typed)}<span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>|</span></div>
        <div style={{ display: "flex", gap: u * 2, marginTop: u * 1.5 }}>
          <div style={{ background: C.accentDark, color: "#fff", fontSize: u * 3.8, fontWeight: 750, padding: `${u}px ${u * 3.4}px`, borderRadius: u * 1.6,
            transform: `scale(${1 + 0.08 * sp(f, fps, tReady, { damping: 6 }) * Math.max(0, Math.sin((f - tReady) / 4))})` }}>Send</div>
          <div style={{ border: `${u * 0.35}px solid #d6d3d1`, fontSize: u * 3.8, fontWeight: 650, padding: `${u}px ${u * 3}px`, borderRadius: u * 1.6 }}>Skip</div>
        </div>
      </div>
    </Square>
  );
};
