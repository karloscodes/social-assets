import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { Brand } from "./types";

export const Background: React.FC<{ brand: Brand; dark?: boolean; seed?: number; morning?: boolean }> = ({ brand, dark, seed = 0, morning }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const night = brand.theme === "dark";
  const bg = night ? (dark ? "#000000" : brand.colors.bg) : dark ? brand.colors.ink : brand.colors.bg;
  const dot = dark || night ? "rgba(255,255,255,0.07)" : "rgba(28,25,23,0.07)";
  const g = Math.max(W, H) / 28;
  const off = (f * 0.6) % g;
  const b1x = W * (0.2 + 0.08 * Math.sin(f / 50 + seed)), b1y = H * (0.18 + 0.05 * Math.cos(f / 60 + seed));
  const b2x = W * (0.85 + 0.06 * Math.cos(f / 45 + seed)), b2y = H * (0.6 + 0.06 * Math.sin(f / 55 + seed));
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -g, backgroundImage: `radial-gradient(${dot} 2.2px, transparent 2.6px)`,
        backgroundSize: `${g}px ${g}px`, transform: `translate(${off}px, ${off}px)` }} />
      <div style={{ position: "absolute", left: b1x - W * 0.35, top: b1y - W * 0.35, width: W * 0.7, height: W * 0.7, borderRadius: "50%",
        background: `radial-gradient(circle, ${brand.colors.accent}${night ? "1c" : dark ? "33" : "26"} 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", left: b2x - W * 0.3, top: b2y - W * 0.3, width: W * 0.6, height: W * 0.6, borderRadius: "50%",
        background: `radial-gradient(circle, ${dark || night ? "#ffffff0e" : "#1c191712"} 0%, transparent 65%)` }} />
      {morning ? ( // night to morning: a warm dawn rises from the bottom over the first ~1.5 s
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, Math.max(0, (f - 4) / 40)),
          background: "linear-gradient(to top, #f59e0b40 0%, #fb923c22 35%, #38bdf812 70%, transparent 100%)" }} />
      ) : null}
    </AbsoluteFill>
  );
};
