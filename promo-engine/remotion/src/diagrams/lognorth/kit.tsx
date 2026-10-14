import React from "react";
import { Img, staticFile } from "remotion";
import type { Brand } from "../../types";

/** shared look for LogNorth diagrams: the site's terminal style (IBM Plex Mono, stone-dark cards, lime accent, rose errors) */
export const MONO = "'IBM Plex Mono', ui-monospace, monospace";
export const pal = (b: Brand) => {
  const C = b.colors;
  return { bg: C.bg, card: C.card, line: C.line ?? "#292524", border: C.border ?? "#44403c", text: C.muted, dim: C.dim ?? "#8a837e",
    ink: C.ink, acc: C.accent, err: C.error ?? "#e11d48", onAcc: C.onAccent ?? "#1c1917" };
};
export type Pal = ReturnType<typeof pal>;

/** terminal-style window: title bar with a label on the left and an optional tag on the right */
export const Win: React.FC<{ P: Pal; u: number; title: React.ReactNode; tag?: React.ReactNode; style?: React.CSSProperties; border?: string; children?: React.ReactNode }> =
  ({ P, u, title, tag, style, border, children }) => (
  <div style={{ position: "absolute", background: P.card, border: `${u * 0.3}px solid ${border ?? P.border}`, borderRadius: u * 1.4, overflow: "hidden",
    fontFamily: MONO, boxShadow: `0 ${u * 2}px ${u * 5}px rgba(0,0,0,0.55)`, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: u * 1.4, padding: `${u * 1.1}px ${u * 2}px`, borderBottom: `${u * 0.25}px solid ${P.line}`,
      fontSize: u * 2.7, color: P.dim, whiteSpace: "nowrap" }}>
      {[0, 1, 2].map((i) => <span key={i} style={{ width: u * 1.3, height: u * 1.3, borderRadius: "50%", background: P.border, flex: "none" }} />)}
      <span style={{ marginLeft: u * 0.6, overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
      {tag ? <span style={{ marginLeft: "auto" }}>{tag}</span> : null}
    </div>
    <div style={{ position: "relative", padding: `${u * 1.6}px ${u * 2.2}px` }}>{children}</div>
  </div>
);

/** small "EXAMPLE" tag so example names and numbers never read as real metrics */
export const Example: React.FC<{ P: Pal; u: number; style?: React.CSSProperties; o?: number }> = ({ P, u, style, o = 1 }) => (
  <div style={{ position: "absolute", fontFamily: MONO, fontSize: u * 2.3, fontWeight: 700, letterSpacing: u * 0.25, color: P.dim, border: `${u * 0.22}px solid ${P.border}`,
    background: P.bg, padding: `${u * 0.2}px ${u * 1.2}px`, borderRadius: u * 0.6, opacity: o, ...style }}>EXAMPLE</div>
);

export const Wordmark: React.FC<{ P: Pal; size: number; text?: string }> = ({ P, size, text = "lognorth" }) => (
  <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: size, color: P.ink, letterSpacing: -size * 0.02, whiteSpace: "nowrap" }}>
    <span style={{ color: P.acc }}>[</span>{text}<span style={{ color: P.acc }}>]</span>
  </span>
);

/** check mark drawn as SVG (IBM Plex Mono has no ✓ glyph; the fallback renders as √) */
export const Check: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} style={{ display: "inline-block", verticalAlign: "-0.1em" }}>
    <path d="M4 10.5 L8.2 14.5 L16 5.5" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/** the monitored app's label, optionally with its logo (e.g. SuppyHQ's mark) */
export const AppChip: React.FC<{ P: Pal; size: number; name: string; logo?: string }> = ({ P, size, name, logo }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, fontFamily: MONO, fontSize: size, color: P.ink, whiteSpace: "nowrap", verticalAlign: "middle" }}>
    {logo ? <Img src={staticFile(logo)} style={{ width: size * 1.25, height: size * 1.25, borderRadius: size * 0.25 }} /> : null}{name}
  </span>
);
