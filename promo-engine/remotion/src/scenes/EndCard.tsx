import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import type { SceneProps } from "../types";
import { Mascot } from "../Mascot";
import { sp, rand } from "../util";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

export const EndCard: React.FC<SceneProps> = ({ spec, brand, u, stageW, stageH }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const C = brand.colors;
  const a = (d: number) => sp(f, fps, d, { damping: 12, stiffness: 140 });
  const wm = brand.wordmark; const typed = wm ? Math.max(0, Math.min(wm.text.length, Math.floor((f - 4) / 2))) : 0;
  const night = brand.theme === "dark";
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: u * 3 }}>
      {(brand.mascot && spec.pose !== "none" ? Array.from({ length: 36 }) : []).map((_, i) => {
        const t = Math.max(0, f - 8 - (i % 6)); const ang = rand(i) * Math.PI * 2, v = 6 + rand(i + 1) * 9;
        const x = stageW / 2 + Math.cos(ang) * v * t * u * 0.06, y = stageH * 0.36 + Math.sin(ang) * v * t * u * 0.06 + 0.02 * t * t * u;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: u * 1.6, height: u * 0.9, borderRadius: u * 0.3,
          background: i % 3 === 0 ? C.ink : C.accent, opacity: t > 0 ? Math.max(0, 1 - t / 60) : 0, transform: `rotate(${t * 12 + i * 30}deg)` }} />;
      })}
      {brand.mascot && spec.pose !== "none" ? <Mascot size={u * 30} pose={(spec.pose as any) ?? "celebrate"} colors={brand.mascot!} /> : null}
      {wm ? (
        <div style={{ fontFamily: wm.mono ? MONO : undefined, fontSize: u * 14, fontWeight: 700, letterSpacing: -u * 0.3, transform: `scale(${a(4)})`, color: C.ink, whiteSpace: "nowrap" }}>
          {wm.brackets ? <span style={{ color: C.accent }}>[</span> : null}{wm.text.slice(0, typed)}
          {typed < wm.text.length ? <span style={{ display: "inline-block", width: u * 7, height: u * 14, verticalAlign: "bottom", background: C.accent, opacity: f % 16 < 8 ? 1 : 0.2 }} /> : null}
          {wm.brackets && typed >= wm.text.length ? <span style={{ color: C.accent }}>]</span> : null}
        </div>
      ) : (
      <div style={{ display: "flex", alignItems: "center", gap: u * 2.4, transform: `scale(${a(6)})` }}>
        <Img src={staticFile(brand.logo)} style={{ width: u * 11, height: u * 11 }} />
        <div style={{ fontSize: u * 10, fontWeight: 850, letterSpacing: -u * 0.4 }}>{brand.name}</div>
      </div>)}
      {spec.tagline ? <div style={{ fontSize: wm ? u * 5.2 : u * 4.2, fontWeight: 500, color: C.muted, textAlign: "center", maxWidth: wm ? u * 98 : u * 80, opacity: a(12), lineHeight: 1.3 }}>{spec.tagline}</div> : null}
      <div style={{ display: "flex", flexDirection: wm ? "column" : "row", alignItems: "center", gap: u * 3, transform: `scale(${a(18)})` }}>
        <div style={{ background: night ? C.accent : C.accentDark, color: C.onAccent ?? "#fff", fontFamily: wm?.mono ? MONO : undefined, fontSize: u * 5, fontWeight: 750, padding: `${u * 2}px ${u * 5}px`, borderRadius: u * 2.2,
          boxShadow: night ? `0 0 ${u * 5}px ${C.accent}55` : "0 10px 30px rgba(234,88,12,0.35)", transform: `scale(${1 + 0.04 * Math.max(0, Math.sin(f / 6))})` }}>{brand.cta} →</div>
        <div style={{ fontSize: u * 5.4, fontWeight: 800, fontFamily: wm?.mono ? MONO : undefined }}>{brand.url}</div>
      </div>
    </div>
  );
};
