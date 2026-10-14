import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../types";
import { Square } from "./common";
import { sp, clamp, rand } from "../util";
import { EnvelopeGlyph } from "../Mascot";

/** flat vector illustration: an inbox tray overflowing with pitches; the refund is buried */
export const Illustration: React.FC<SceneProps> = ({ spec, brand, u, stageW, stageH }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const C = brand.colors;
  const labels: string[] = spec.labels ?? [];
  const N = 26;
  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: "visible" }}>
        {/* tray back */}
        <path d="M14 70 L86 70 L80 92 L20 92 Z" fill="#e7e5e4" />
        {/* falling / piled envelopes */}
        {Array.from({ length: N }).map((_, i) => {
          const d = i * 2.2;
          const s = sp(f, fps, d, { damping: 11, stiffness: 90 });
          const col = i % 7, row = Math.floor(i / 7);
          const tx = 24 + col * 8.6 + (rand(i) - 0.5) * 6, ty = 74 - row * 7.5 + (rand(i + 9) - 0.5) * 3;
          const x = interpolate(s, [0, 1], [tx + (rand(i + 3) - 0.5) * 30, tx]);
          const y = interpolate(s, [0, 1], [-20 - rand(i) * 30, ty]);
          const r = (rand(i + 5) - 0.5) * 50 * (1 - s * 0.6);
          return <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} opacity={Math.min(1, s * 3)}>
            <EnvelopeGlyph w={11} fill={i % 5 === 0 ? "#fde3cf" : "#fff"} stroke={C.ink} />
          </g>;
        })}
        {/* buried refund envelope */}
        {(() => {
          const s = sp(f, fps, 6, { damping: 12 }); const pulse = 1 + 0.25 * Math.abs(Math.sin(f / 9));
          const show = interpolate(f, [40, 52], [0, 1], clamp);
          return <g transform="translate(48 86)" opacity={s}>
            <circle r={9 * pulse} fill="none" stroke={C.accent} strokeWidth={0.8} opacity={show * (1.6 - pulse)} />
            <EnvelopeGlyph w={12} fill={C.accent} stroke={C.ink} />
          </g>;
        })()}
        {/* tray front */}
        <path d="M10 80 L90 80 L84 97 L16 97 Z" fill={C.ink} />
        <rect x={38} y={85} width={24} height={4} rx={2} fill={C.bg} opacity={0.25} />
        {/* counter badge */}
        {(() => { const n = Math.min(44, Math.floor(interpolate(f, [0, 60], [0, 44], clamp)));
          return <g transform="translate(86 76)"><circle r={6.5} fill={C.accentDark} /><text y={2.2} textAnchor="middle" fontSize={6} fontWeight={800} fill="#fff">{n}</text></g>; })()}
      </svg>
      {/* floating pitch labels */}
      {labels.map((l, i) => {
        const s = sp(f, fps, 8 + i * 6, { damping: 10, stiffness: 140 });
        const POS = [[24, 8], [70, 4], [50, 20], [20, 32], [78, 28], [46, 40]];
        const [x, y] = POS[i % POS.length];
        const bob = Math.sin((f + i * 10) / 12) * 0.8;
        return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y + bob}%`, transform: `translate(-50%,-50%) scale(${s}) rotate(${(i % 2 ? 1 : -1) * 5}deg)`,
          background: "#fff", border: `${u * 0.35}px solid ${C.ink}`, borderRadius: u * 2.5, padding: `${u * 1.2}px ${u * 2.6}px`, fontSize: u * 4.2, fontWeight: 700,
          whiteSpace: "nowrap", boxShadow: `${u * 0.8}px ${u * 0.8}px 0 ${C.ink}` }}>{l}</div>;
      })}
      {spec.buried ? (() => { const s = sp(f, fps, 48, { damping: 12 });
        return <div style={{ position: "absolute", left: "50%", top: "103%", transform: `translate(-50%,-50%) scale(${s})`, background: C.accentDark, color: "#fff",
          borderRadius: u * 3, padding: `${u * 1.2}px ${u * 3}px`, fontSize: u * 4.4, fontWeight: 800, whiteSpace: "nowrap" }}>↑ {spec.buried}</div>; })() : null}
    </Square>
  );
};
