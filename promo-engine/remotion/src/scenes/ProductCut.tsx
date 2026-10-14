import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import type { SceneProps } from "../types";
import { sp, clamp } from "../util";

/** real product card inside a phone mockup with a swing-in and a slow scroll */
export const ProductCut: React.FC<SceneProps> = ({ spec, brand, u, stageW, stageH, durationInFrames }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const C = brand.colors;
  const s = sp(f, fps, 0, { damping: 13, stiffness: 90 });
  const ph = Math.min(stageH * 0.98, u * 98), pw = ph * 0.54;
  const push = interpolate(f, [6, durationInFrames], [1, 1.16], clamp);
  const scroll = interpolate(f, [8, durationInFrames], [0, 1], clamp);
  const focus = spec.focus ?? 0;
  const rotY = interpolate(s, [0, 1], [-35, -8]) + Math.sin(f / 30) * 3;
  if (spec.frame === "window") {
    // desktop app: a browser-style window (dark title bar + URL), tilted in, slow push and scroll
    const ww = Math.min(stageW * 0.9, u * 96), wh = Math.min(stageH * 0.94, u * 94);
    const night = brand.theme === "dark";
    const rx = interpolate(s, [0, 1], [24, 6]) + Math.sin(f / 35) * 1.5;
    return (
      <div style={{ position: "absolute", inset: 0, perspective: u * 300 }}>
        <div style={{ position: "absolute", left: stageW / 2 - ww * 0.62, top: stageH / 2 - wh * 0.56, width: ww * 0.5, height: ww * 0.5, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}55 0%, transparent 70%)`, transform: `scale(${sp(f, fps, 4)})` }} />
        <div style={{ position: "absolute", left: (stageW - ww) / 2, top: (stageH - wh) / 2, width: ww, height: wh, borderRadius: u * 1.6, overflow: "hidden",
          background: night ? (C.card ?? "#1c1917") : "#fff", border: `${u * 0.3}px solid ${night ? C.border ?? "#44403c" : C.ink}`,
          boxShadow: `0 ${u * 4}px ${u * 10}px rgba(0,0,0,0.6)`,
          transform: `translateY(${(1 - s) * stageH * 0.5}px) scale(${push * 0.92}) rotateX(${rx}deg)`, transformOrigin: "50% 30%" }}>
          <div style={{ height: u * 6, display: "flex", alignItems: "center", gap: u * 1.2, padding: `0 ${u * 2}px`, borderBottom: `${u * 0.25}px solid ${C.line ?? "#292524"}`,
            fontFamily: "'IBM Plex Mono', monospace", fontSize: u * 2.6, color: C.dim ?? C.muted }}>
            {[0, 1, 2].map((i) => <span key={i} style={{ width: u * 1.3, height: u * 1.3, borderRadius: "50%", background: C.border ?? "#44403c" }} />)}
            <span style={{ marginLeft: u * 2, background: C.bg, padding: `${u * 0.4}px ${u * 2}px`, borderRadius: u * 0.6 }}>{spec.url ?? brand.url}</span>
          </div>
          <div style={{ position: "relative", width: "100%", height: wh - u * 6, overflow: "hidden" }}>
            <Img src={staticFile(spec.image)} style={{ position: "absolute", left: 0, width: "100%", top: `${-(focus * 30 + scroll * 10)}%` }} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", inset: 0, perspective: u * 300 }}>
      {/* accent shapes */}
      <div style={{ position: "absolute", left: stageW / 2 - pw * 0.95, top: stageH / 2 - ph * 0.32, width: pw * 0.7, height: pw * 0.7, borderRadius: "50%",
        background: C.accent, opacity: 0.9, transform: `scale(${sp(f, fps, 4)})` }} />
      {/* second accent: light ring well clear of the phone's edge (v2 used a dark rotating square here; it read as a broken camera bump / detached shadow) */}
      <div style={{ position: "absolute", left: stageW / 2 + pw * 0.62, top: stageH / 2 + ph * 0.2, width: pw * 0.36, height: pw * 0.36, borderRadius: "50%",
        border: `${pw * 0.05}px solid ${C.accent}`, opacity: 0.45, transform: `scale(${sp(f, fps, 7)})` }} />
      <div style={{ position: "absolute", left: (stageW - pw) / 2, top: (stageH - ph) / 2, width: pw, height: ph, borderRadius: pw * 0.14, background: C.ink,
        padding: pw * 0.035, boxShadow: `0 ${u * 4}px ${u * 8}px rgba(28,25,23,0.3)`,
        transform: `translateY(${(1 - s) * stageH * 0.6}px) scale(${push}) rotateY(${rotY}deg) rotateZ(${(1 - s) * 8}deg)`, transformOrigin: "50% 25%" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: pw * 0.11, background: C.bg, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: pw * 0.03, left: "50%", transform: "translateX(-50%)", width: pw * 0.3, height: pw * 0.07, borderRadius: pw, background: C.ink, zIndex: 2 }} />
          <Img src={staticFile(spec.image)} style={{ position: "absolute", left: "1%", width: "98%", borderRadius: pw * 0.04,
            top: `${12 - (focus * 30 + scroll * 8)}%`, boxShadow: "0 6px 20px rgba(28,25,23,0.12)" }} />
        </div>
      </div>
    </div>
  );
};
