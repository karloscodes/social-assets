import React from "react";
import { AbsoluteFill, staticFile, continueRender, delayRender } from "remotion";
import { loadFont } from "@remotion/fonts";
const h = delayRender("font");
loadFont({ family: "Bricolage", url: staticFile("hoodiechamp/bricolage.woff2"), weight: "200 800" }).then(() => continueRender(h)).catch(() => continueRender(h));
const B = "#2e3cff", L = "#d4ff3a", W = "#ffffff", K = "#151311", INK = "#0b0a09";

const Eyes: React.FC<{ x1: number; x2: number; y: number; rx: number; ry: number; mode: "open" | "happy" | "wink" | "star"; c?: string; look?: number }> = ({ x1, x2, y, rx, ry, mode, c = INK, look = 0 }) => (
  <>{[x1, x2].map((x, i) => {
    const X = x + look;
    if (mode === "happy" || (mode === "wink" && i === 1)) return <path key={i} d={`M${X - rx * 1.1} ${y + ry * 0.35} Q${X} ${y - ry * 0.9} ${X + rx * 1.1} ${y + ry * 0.35}`} stroke={c} strokeWidth={rx * 0.55} fill="none" strokeLinecap="round" />;
    if (mode === "star") return <path key={i} d={star(X, y, ry * 1.05, ry * 0.45)} fill={L} stroke={c} strokeWidth={rx * 0.18} strokeLinejoin="round" />;
    return <ellipse key={i} cx={X} cy={y} rx={rx} ry={ry} fill={c} />;
  })}</>
);
function star(cx: number, cy: number, R: number, r: number) { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5; const rr = i % 2 ? r : R; d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1); } return d + "Z"; }

// A: round blob champ wearing a tiny hoodie
const A: React.FC<{ e: boolean }> = ({ e }) => (
  <svg viewBox="0 0 200 220" width={330} height={363}>
    <g transform={e ? "translate(0 -10)" : ""}>
      {/* hoodie body */}
      <path d="M40 150 Q40 120 70 116 L130 116 Q160 120 160 150 L160 196 Q160 206 150 206 L50 206 Q40 206 40 196 Z" fill={B} />
      {/* sleeves/arms */}
      {!e && <path d="M44 146 Q26 160 32 184" stroke={B} strokeWidth={22} strokeLinecap="round" fill="none" />}
      {!e && <path d="M156 146 Q174 160 168 184" stroke={B} strokeWidth={22} strokeLinecap="round" fill="none" />}
      <rect x={72} y={170} width={56} height={22} rx={10} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
      {/* hood around the round white face */}
      <circle cx={100} cy={92} r={70} fill={B} />
      <circle cx={100} cy={98} r={54} fill={W} />
      <Eyes x1={80} x2={120} y={100} rx={8} ry={13} mode={e ? "happy" : "open"} />
      {e && <><path d="M48 140 Q14 120 18 70" stroke={B} strokeWidth={22} strokeLinecap="round" fill="none" /><path d="M152 140 Q186 120 182 70" stroke={B} strokeWidth={22} strokeLinecap="round" fill="none" /></>}
      {/* drawstrings */}
      <path d="M86 150 v26" stroke={W} strokeWidth={5} strokeLinecap="round" /><circle cx={86} cy={180} r={5.5} fill={L} />
      <path d="M114 150 v18" stroke={W} strokeWidth={5} strokeLinecap="round" /><circle cx={114} cy={172} r={5.5} fill={L} />
    </g>
  </svg>
);

// B: the hoodie garment itself, eyes peeking from the empty hood
const Bm: React.FC<{ e: boolean }> = ({ e }) => (
  <svg viewBox="0 0 220 220" width={350} height={350}>
    {/* sleeves */}
    <path d={e ? "M58 112 Q30 80 38 44" : "M58 112 Q28 140 34 180"} stroke={B} strokeWidth={32} strokeLinecap="round" fill="none" />
    <path d="M162 112 Q192 140 186 180" stroke={B} strokeWidth={32} strokeLinecap="round" fill="none" />
    {e && <><circle cx={38} cy={40} r={15} fill={W} /></>}
    {!e && <circle cx={34} cy={184} r={15} fill={W} />}
    <circle cx={186} cy={184} r={15} fill={W} />
    {/* body */}
    <path d="M56 104 Q56 88 80 86 L140 86 Q164 88 164 104 L168 196 Q168 210 154 210 L66 210 Q52 210 52 196 Z" fill={B} />
    <path d="M60 196 H160" stroke="rgba(255,255,255,0.25)" strokeWidth={6} />
    <path d="M82 158 H138 L132 182 H88 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={5} strokeLinejoin="round" />
    {/* hood with empty dark opening */}
    <path d="M110 10 C62 10 46 46 50 82 Q54 110 110 112 Q166 110 170 82 C174 46 158 10 110 10 Z" fill={B} />
    <ellipse cx={110} cy={66} rx={44} ry={40} fill={K} />
    <Eyes x1={94} x2={126} y={e ? 66 : 70} rx={7} ry={11} mode={e ? "happy" : "open"} c={W} look={e ? 0 : 3} />
    <path d="M96 110 v28" stroke={W} strokeWidth={5} strokeLinecap="round" /><circle cx={96} cy={142} r={6} fill={L} />
    <path d="M124 110 v20" stroke={W} strokeWidth={5} strokeLinecap="round" /><circle cx={124} cy={134} r={6} fill={L} />
  </svg>
);

// C: chunky squircle head inside a hood silhouette, lime champion star on top
const Cm: React.FC<{ e: boolean }> = ({ e }) => (
  <svg viewBox="0 0 200 220" width={330} height={363}>
    <path d="M100 28 C46 28 22 64 22 110 C22 150 40 174 30 206 L170 206 C160 174 178 150 178 110 C178 64 154 28 100 28 Z" fill={B} />
    <rect x={44} y={58} width={112} height={112} rx={44} fill={W} />
    <Eyes x1={80} x2={120} y={114} rx={11} ry={17} mode={e ? "wink" : "open"} />
    {!e && <><circle cx={84} cy={106} r={4} fill={W} /><circle cx={124} cy={106} r={4} fill={W} /></>}
    {e && <><circle cx={84} cy={106} r={4} fill={W} /></>}
    {e && <path d="M88 146 Q100 156 112 146" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />}
    <path d="M84 188 v14 M116 188 v10" stroke={W} strokeWidth={6} strokeLinecap="round" />
    <g transform={`translate(100 ${e ? 12 : 20}) rotate(${e ? -12 : 0})`}><path d={star(0, 0, 22, 10)} fill={L} stroke={K} strokeWidth={3} strokeLinejoin="round" /></g>
  </svg>
);

// D: a little clapperboard in a hoodie (it's about videos)
const Dm: React.FC<{ e: boolean }> = ({ e }) => (
  <svg viewBox="0 0 220 230" width={340} height={355}>
    {/* hood behind */}
    <path d="M110 30 C58 30 36 60 36 100 L36 200 L184 200 L184 100 C184 60 162 30 110 30 Z" fill={B} />
    {/* clapper face */}
    <rect x={54} y={78} width={112} height={100} rx={22} fill={W} />
    {/* clapper stick, striped, opens on expression */}
    <g transform={`rotate(${e ? -26 : 0} 56 70)`}>
      <rect x={52} y={56} width={116} height={24} rx={8} fill={K} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${66 + i * 26} 56 l14 0 l-12 24 l-14 0z`} fill={L} />)}
    </g>
    <Eyes x1={88} x2={132} y={124} rx={9} ry={14} mode={e ? "star" : "open"} />
    {e && <ellipse cx={110} cy={156} rx={10} ry={7} fill={INK} />}
    <path d="M94 200 v16 M126 200 v12" stroke={W} strokeWidth={6} strokeLinecap="round" />
    <circle cx={94} cy={220} r={6} fill={L} /><circle cx={126} cy={216} r={6} fill={L} />
  </svg>
);

const Cell: React.FC<{ k: string; t: string; M: React.FC<{ e: boolean }>; ex: string }> = ({ k, t, M, ex }) => (
  <div style={{ width: 960, height: 960, borderRadius: 48, background: "#1d1a18", display: "flex", flexDirection: "column", alignItems: "center", padding: 40, boxSizing: "border-box" }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 22, alignSelf: "flex-start" }}>
      <div style={{ fontFamily: "Bricolage", fontWeight: 800, fontSize: 96, color: L }}>{k}</div>
      <div style={{ fontFamily: "Bricolage", fontWeight: 800, fontSize: 44, color: "#f5f5f4" }}>{t}</div>
    </div>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-around", width: "100%" }}>
      {[false, true].map((e) => <div key={String(e)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <M e={e} /><div style={{ fontFamily: "Bricolage", fontSize: 34, color: "#a8a29e" }}>{e ? ex : "neutral"}</div></div>)}
    </div>
    <div style={{ display: "flex", gap: 30, alignItems: "flex-end" }}>
      {[110, 64, 36].map((s) => <div key={s} style={{ width: s, height: s * 1.08, position: "relative" }}><div style={{ position: "absolute", left: "50%", bottom: 0, transform: `translateX(-50%) scale(${s / 350})`, transformOrigin: "50% 100%" }}><M e={false} /></div></div>)}
      <div style={{ fontFamily: "Bricolage", fontSize: 26, color: "#78716c", marginLeft: 10 }}>small sizes</div>
    </div>
  </div>
);

export const HoodMascots: React.FC = () => (
  <AbsoluteFill style={{ background: "#151311", padding: 40, display: "grid", gridTemplateColumns: "960px 960px", gap: 40 }}>
    <Cell k="A" t="Blob champ in a hoodie" M={A} ex="happy" />
    <Cell k="B" t="The hoodie itself" M={Bm} ex="waving" />
    <Cell k="C" t="Squircle head + champ star" M={Cm} ex="wink" />
    <Cell k="D" t="Clapper in a hoodie" M={Dm} ex="action!" />
  </AbsoluteFill>
);
