import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../types";
import { Square } from "./common";
import { Mascot, EnvelopeGlyph } from "../Mascot";
import { sp, clamp, cue } from "../util";

/** mascot sorting: urgent chips go up to "Can't wait", pitches get tossed into the Spam bin */
export const MascotScene: React.FC<SceneProps> = ({ spec, brand, words, u, stageW, stageH }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const C = brand.colors; const chips: string[] = spec.chips ?? [];
  const cues = chips.map((c, i) => cue(words, fps, c.split(" ")[0].replace(/s$/, ""), 10 + i * 14));
  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      {/* Can't wait stack */}
      <div style={{ position: "absolute", left: "50%", top: "2%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1.6 }}>
        <div style={{ fontSize: u * 3.6, fontWeight: 800, letterSpacing: u * 0.4, color: C.accentDark, opacity: sp(f, fps, 2) }}>CAN'T WAIT</div>
        {chips.map((c, i) => {
          const s = sp(f, fps, cues[i], { damping: 11, stiffness: 150 });
          const y = interpolate(s, [0, 1], [u * 40, 0]);
          return <div key={i} style={{ transform: `translateY(${y}px) scale(${0.5 + 0.5 * s})`, opacity: Math.min(1, s * 2), background: "#fff", border: `${u * 0.4}px solid ${C.ink}`,
            borderRadius: u * 2.4, padding: `${u * 1.3}px ${u * 3}px`, fontSize: u * 4.6, fontWeight: 750, display: "flex", alignItems: "center", gap: u * 1.6,
            boxShadow: `${u * 0.8}px ${u * 0.8}px 0 ${C.accent}` }}>
            <span style={{ width: u * 2.6, height: u * 2.6, borderRadius: "50%", background: C.accent, display: "inline-block" }} />{c}</div>;
        })}
      </div>
      {/* spam bin */}
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const start = 6 + i * 13, t = interpolate(f, [start, start + 16], [0, 1], clamp);
          if (t <= 0 || t >= 1) return null;
          const x = interpolate(t, [0, 1], [56, 16]), y = 72 - Math.sin(t * Math.PI) * 26 + t * 12;
          return <g key={i} transform={`translate(${x} ${y}) rotate(${-t * 300})`}><EnvelopeGlyph w={8} fill="#fff" stroke={C.ink} /></g>;
        })}
        <g transform="translate(16 86)">
          <path d="M-11 -9 L11 -9 L8 10 L-8 10 Z" fill="#d6d3d1" stroke={C.ink} strokeWidth={0.8} />
          <rect x={-13} y={-12} width={26} height={4} rx={1.5} fill={C.ink} />
          <text y={4} textAnchor="middle" fontSize={4.6} fontWeight={800} fill={C.ink}>Spam</text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: "50%", bottom: "-4%", transform: "translateX(-38%)" }}>
        <Mascot size={u * 46} pose={spec.pose ?? "sort"} colors={brand.mascot!} look={-0.5} />
      </div>
    </Square>
  );
};
