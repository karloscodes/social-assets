import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../types";
import { Square } from "../scenes/common";
import { sp, clamp, ease, cue } from "../util";

/** AI agent -> Draft (allowed) vs Send (separate permission, locked) */
export const DiagramGate: React.FC<SceneProps> = ({ spec, brand, words, u, stageW, stageH }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const C = brand.colors;
  const tDraft = cue(words, fps, "draft", 25) - 6;
  const tSend = cue(words, fps, "sending", tDraft + 30) - 6;
  const tSep = cue(words, fps, "separate", tSend + 15) - 4;
  const dL = ease(f, tDraft, tDraft + 14), dR = ease(f, tSend, tSend + 12);
  const shake = f > tSend + 12 && f < tSend + 26 ? Math.sin((f - tSend) * 2.2) * 4 : 0;
  const node = sp(f, fps, 0);
  const lines = [0.9, 0.75, 0.55];
  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d="M50 27 C 50 38, 26 36, 26 50" fill="none" stroke={C.ink} strokeWidth={1.2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dL} />
        <path d="M50 27 C 50 38, 74 36, 74 46" fill="none" stroke={C.ink} strokeWidth={1.2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dR} />
      </svg>
      {/* agent node */}
      <div style={{ position: "absolute", left: "50%", top: "3%", transform: `translateX(-50%) scale(${node})`, background: C.ink, color: "#fff", borderRadius: u * 3.4,
        padding: `${u * 2.2}px ${u * 4}px`, display: "flex", alignItems: "center", gap: u * 2, boxShadow: `${u}px ${u}px 0 ${C.accent}`, whiteSpace: "nowrap" }}>
        <div style={{ width: u * 8, height: u * 8, borderRadius: u * 2, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: u * 5,
          transform: `rotate(${Math.sin(f / 10) * 8}deg)` }}>✦</div>
        <div style={{ fontSize: u * 5, fontWeight: 800 }}>{spec.agent}</div>
      </div>
      {/* draft: allowed */}
      <div style={{ position: "absolute", left: "3%", top: "50%", width: "44%", transform: `scale(${sp(f, fps, tDraft + 10)})`, background: "#fff", border: `${u * 0.45}px solid ${C.ink}`,
        borderRadius: u * 3, padding: u * 3, boxShadow: `${u}px ${u}px 0 ${C.ink}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: u * 2 }}>
          <div style={{ fontSize: u * 5, fontWeight: 800 }}>{spec.draft}</div>
          <div style={{ width: u * 7, height: u * 7, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: u * 4.4, fontWeight: 900, transform: `scale(${sp(f, fps, tDraft + 24, { damping: 8 })})` }}>✓</div>
        </div>
        {lines.map((w, i) => <div key={i} style={{ height: u * 2.2, borderRadius: u, background: "#e7e5e4", marginTop: u * 1.6,
          width: `${100 * w * ease(f, tDraft + 12 + i * 5, tDraft + 22 + i * 5)}%` }} />)}
      </div>
      {/* send: locked gate */}
      <div style={{ position: "absolute", right: "3%", top: "46%", width: "44%", transform: `scale(${sp(f, fps, tSend + 8)}) translateX(${shake}px)`, background: "#fff7ed",
        border: `${u * 0.45}px solid ${C.accentDark}`, borderRadius: u * 3, padding: u * 3, boxShadow: `${u}px ${u}px 0 ${C.accentDark}`, display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1.6 }}>
        <svg viewBox="0 0 40 44" width={u * 13} height={u * 14}>
          <path d={`M11 20 V13 a9 9 0 0 1 18 0 V${20 - 4 * (1 - sp(f, fps, tSend + 14))}`} fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
          <rect x={5} y={19} width={30} height={23} rx={6} fill={C.accentDark} />
          <circle cx={20} cy={30} r={3.4} fill="#fff" />
        </svg>
        <div style={{ fontSize: u * 5, fontWeight: 800 }}>{spec.send}</div>
        <div style={{ fontSize: u * 3.4, fontWeight: 700, color: C.accentDark, textAlign: "center", opacity: ease(f, tSep, tSep + 10) }}>Separate permission</div>
      </div>
      <div style={{ position: "absolute", right: "8%", top: "90%", transform: `scale(${sp(f, fps, tSep + 10, { damping: 9 })})`, background: C.ink, color: "#fff", fontSize: u * 3.8,
        fontWeight: 800, padding: `${u}px ${u * 3}px`, borderRadius: u * 2, whiteSpace: "nowrap" }}>{spec.owner}</div>
      {spec.ownerNote ? (() => { const tNote = cue(words, fps, spec.noteCue ?? "cancel", tSep + 40) - 6; const c = 30 - Math.max(0, Math.floor((f - tNote - 10) / fps));
        return <div style={{ position: "absolute", left: "8%", top: "90%", transform: `scale(${sp(f, fps, tNote, { damping: 9 })})`, background: C.accentDark, color: "#fff", fontSize: u * 3.8,
          fontWeight: 800, padding: `${u}px ${u * 3}px`, borderRadius: u * 2, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: u * 1.4 }}>
          <span style={{ display: "inline-block", minWidth: u * 6, textAlign: "center", background: "#fff", color: C.accentDark, borderRadius: u, padding: `0 ${u * 0.8}px` }}>{c}s</span>{spec.ownerNote}</div>; })() : null}
    </Square>
  );
};
