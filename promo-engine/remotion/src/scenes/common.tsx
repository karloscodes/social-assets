import React from "react";
/** centers a square design area of 100u x 100u inside the stage */
export const Square: React.FC<{ u: number; stageW: number; stageH: number; children: React.ReactNode; scaleW?: number }> = ({ u, stageW, stageH, children, scaleW = 100 }) => (
  <div style={{ position: "absolute", left: (stageW - scaleW * u) / 2, top: (stageH - 100 * u) / 2, width: scaleW * u, height: 100 * u }}>{children}</div>
);
export const Pill: React.FC<{ children: React.ReactNode; bg: string; color: string; size: number; style?: React.CSSProperties }> = ({ children, bg, color, size, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, background: bg, color, fontSize: size, fontWeight: 700,
    padding: `${size * 0.45}px ${size * 0.9}px`, borderRadius: size * 2, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(28,25,23,0.12)", ...style }}>{children}</div>
);
