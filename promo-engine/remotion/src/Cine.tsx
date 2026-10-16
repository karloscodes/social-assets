import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, OffthreadVideo, Sequence, Img } from "remotion";
// Cinematic stock promos (LogNorth 3am, hoodiechamp world). Safe zone: x 60..920, y 400..1420 (studio channels.json "vertical").
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ES = Easing.bezier(0.45, 0, 0.55, 1);
const ts = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: ES });
const SX = 64, SW = 856;
type Shot = { clip?: string; from: number; len: number; start?: number; zoom?: [number, number]; panY?: number };

const Grade: React.FC<{ warm?: number }> = ({ warm = 1 }) => <>
  <AbsoluteFill style={{ background: `rgba(255,150,60,${0.07 * warm})`, mixBlendMode: "soft-light" }} />
  <AbsoluteFill style={{ background: "radial-gradient(120% 75% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }} />
  <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0) 35%, rgba(0,0,0,0.62) 62%, rgba(0,0,0,0.72) 80%, rgba(0,0,0,0.3) 100%)" }} />
</>;
const Clip: React.FC<{ s: Shot; fade?: number; filter?: string }> = ({ s, fade = 12, filter = "sepia(0.18) saturate(1.05) contrast(1.06) brightness(0.92)" }) => {
  const f = useCurrentFrame();
  const z = s.zoom ?? [1.04, 1.12];
  const sc = interpolate(f, [0, s.len], z, cl);
  const o = ts(f, 0, fade) * (1 - ts(f, s.len - fade, s.len));
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ transform: `scale(${sc}) translateY(${interpolate(f, [0, s.len], [0, s.panY ?? -20], cl)}px)` }}>
      <OffthreadVideo src={staticFile(`cine/${s.clip}.mp4`)} startFrom={s.start ?? 0} muted style={{ width: 1080, height: 1920, objectFit: "cover", filter }} />
    </AbsoluteFill>
  </AbsoluteFill>;
};
const Line: React.FC<{ a: number; b: number; children: React.ReactNode; font: string; size?: number; top?: number }> = ({ a, b, children, font, size = 88, top = 1040 }) => {
  const f = useCurrentFrame();
  const o = ts(f, a + 4, a + 20) * (1 - ts(f, b - 14, b));
  return <div style={{ position: "absolute", left: SX, width: SW, top, fontFamily: font, fontSize: size, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.04, color: "#fff", opacity: o,
    transform: `translateY(${(1 - ts(f, a, a + 24)) * 26}px)`, textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>{children}</div>;
};
const Pop: React.FC<{ a: number; b: number; children: React.ReactNode; top: number; left?: number }> = ({ a, b, children, top, left = SX }) => {
  const f = useCurrentFrame();
  const o = ts(f, a, a + 16) * (1 - ts(f, b - 12, b));
  return <div style={{ position: "absolute", left, top, opacity: o, transform: `translateY(${(1 - ts(f, a, a + 20)) * 20}px)` }}>{children}</div>;
};

// ---------------- LogNorth ----------------
const LN = { bg: "#0c0a09", fg: "#fafaf9", card: "#1c1917", line: "#44403c", sub: "#a8a29e", acc: "#a3e635", err: "#e11d48" };
const MONO = "'IBM Plex Mono','JetBrains Mono','DejaVu Sans Mono',monospace";
const SANS = "Inter, sans-serif";
const Term: React.FC<{ rows: { t: string; c?: string }[]; w?: number }> = ({ rows, w = SW }) => (
  <div style={{ width: w, background: "rgba(12,10,9,0.86)", border: `2px solid ${LN.line}`, borderRadius: 22, padding: "24px 30px", fontFamily: MONO, fontSize: 38, lineHeight: 1.45, color: LN.fg, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
    {rows.map((r, i) => <div key={i} style={{ color: r.c ?? LN.fg, whiteSpace: "nowrap", overflow: "hidden" }}>{r.t}</div>)}
  </div>
);
const LNMark: React.FC<{ size: number }> = ({ size }) => <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: size, color: LN.fg }}><span style={{ color: LN.acc }}>[</span>lognorth<span style={{ color: LN.acc }}>]</span></span>;
// beats (frames @30): 0-150, 150-300, 300-450, 450-600, 600-735, end 735-870
export const LN_LEN = 870;
export const LogNorth3am: React.FC = () => {
  const f = useCurrentFrame();
  const shots: Shot[] = [
    { clip: "37700770", from: 0, len: 165, zoom: [1.1, 1.18] },
    { clip: "33942937", from: 150, len: 165, zoom: [1.08, 1.16] },
    { clip: "37700770", from: 300, len: 165, start: 300, zoom: [1.16, 1.24], panY: 30 },
    { clip: "35164030", from: 450, len: 165, zoom: [1.06, 1.14] },
    { clip: "7986492", from: 600, len: 180, zoom: [1.05, 1.12] },
  ];
  const endO = ts(f, 735, 760);
  return <AbsoluteFill style={{ background: LN.bg }}>
    {shots.map((s, i) => <Sequence key={i} from={s.from} durationInFrames={s.len}><Clip s={s} /></Sequence>)}
    <Grade warm={f < 450 ? 0.4 : 1} />
    {/* brand tag from 0.5s so a stranger knows the product */}
    <div style={{ position: "absolute", left: SX, top: 420, opacity: ts(f, 10, 30) * (1 - endO) }}><LNMark size={44} /></div>
    <Line font={SANS} a={-10} b={150}>Alert at <span style={{ color: LN.acc }}>3am.</span></Line>
    <Pop a={30} b={150} top={560}><Term rows={[{ t: "[lognorth] alert", c: LN.acc }, { t: "/checkout 8% vs 1%", c: "#fda4af" }]} /></Pop>
    <Line font={SANS} a={150} b={300} size={80}>LogNorth wakes a <span style={{ color: LN.acc }}>Grok Bot</span> routine.</Line>
    <Pop a={180} b={300} top={560}><Term rows={[{ t: "webhook  POST to the routine", c: LN.sub }, { t: "grok bot investigate", c: LN.fg }, { t: "logs, trace, commits", c: LN.sub }]} /></Pop>
    <Line font={SANS} a={300} b={450} size={80}>It writes the fix, <span style={{ color: LN.acc }}>with a test.</span></Line>
    <Pop a={330} b={450} top={560}><Term rows={[{ t: "fix branch + failing test", c: LN.sub }, { t: "pull request #412", c: LN.fg }, { t: "with the evidence", c: LN.sub }]} /></Pop>
    <Line font={SANS} a={450} b={600} size={80}>LogNorth watches until it <span style={{ color: LN.acc }}>clears.</span></Line>
    <Pop a={480} b={600} top={560}><Term rows={[{ t: "[lognorth] verify", c: LN.acc }, { t: "0.9% since the deploy", c: LN.fg }, { t: "closed · report sent", c: LN.acc }]} /></Pop>
    <Line font={SANS} a={600} b={740}>Fixed by <span style={{ color: LN.acc }}>breakfast.</span></Line>
    {/* end card */}
    <AbsoluteFill style={{ opacity: endO * (1 - ts(f, LN_LEN - 12, LN_LEN - 1)), background: "rgba(12,10,9,0.9)" }}>
      <div style={{ position: "absolute", left: SX, width: SW, top: 560, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 44, transform: `translateY(${(1 - ts(f, 735, 770)) * 24}px)` }}>
        <LNMark size={96} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76, letterSpacing: -2, lineHeight: 1.08, color: LN.fg }}>Alert at 3am.<br /><span style={{ color: LN.acc }}>Fixed by breakfast.</span></div>
        <div style={{ fontFamily: SANS, fontSize: 44, color: LN.sub, fontWeight: 600 }}>Self-hosted logging. Free for your first app.</div>
        <div style={{ fontFamily: MONO, fontSize: 60, fontWeight: 700, color: LN.bg, background: LN.acc, padding: "16px 40px", borderRadius: 18 }}>lognorth.com</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------------- hoodiechamp ----------------
const HB = "#2e3cff", HL = "#c4f01e", INK = "#111318";
const HoodLogo: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill={HB} />
    <g transform="translate(4 7) scale(.875)"><path d="M32 2.5c-14.5 0-24.5 10.5-24.5 25 0 5.5 1.4 10.5 3.8 14.5C3.5 45.5-2 51.5-2 60.5V70h68v-9.5c0-9-5.5-15-13.3-18.5 2.4-4 3.8-9 3.8-14.5 0-14.5-10-25-24.5-25Z" fill="#fff" /><ellipse cx="32" cy="27.5" rx="16" ry="16.5" fill={HB} /><path d="M27.5 47.5v10M36.5 47.5v6" stroke={HB} strokeWidth="3.5" strokeLinecap="round" /></g></svg>
);
const HT = {
  en: { l1: <>Your product.<br /><span style={{ color: HL }}>Their camera.</span></>, l2: <>Say what you need in <span style={{ color: HL }}>one sentence.</span></>, brief: "“3 TikTok ads for my candle”",
    l3: <>Creators who fit send a <span style={{ color: HL }}>price.</span></>, price: "Price", l4: <>Prices, not pitches. <span style={{ color: HL }}>You pick.</span></>, picked: "Picked ✓",
    e1: <>Creators bid.<br />You pick.</>, e2: "Ask for an invite at", ex: "Example" },
  es: { l1: <>Tu producto.<br /><span style={{ color: HL }}>Su cámara.</span></>, l2: <>Di lo que necesitas en <span style={{ color: HL }}>una frase.</span></>, brief: "“3 anuncios de TikTok para mi vela”",
    l3: <>Los creadores que encajan te mandan un <span style={{ color: HL }}>precio.</span></>, price: "Precio", l4: <>Precios, no propuestas. <span style={{ color: HL }}>Tú eliges.</span></>, picked: "Elegido ✓",
    e1: <>Los creadores ofertan.<br />Tú eliges.</>, e2: "Pide una invitación en", ex: "Ejemplo" },
};
export const HW_LEN = 750;
export const HoodWorld: React.FC<{ lang?: "en" | "es" }> = ({ lang = "en" }) => {
  const f = useCurrentFrame(); const t = HT[lang];
  const shots: Shot[] = [
    { clip: "12433083", from: 0, len: 165, zoom: [1.06, 1.14] },
    { clip: "13929660", from: 150, len: 165, zoom: [1.04, 1.12] },
    { clip: "8154851", from: 300, len: 165, start: 60, zoom: [1.04, 1.1] },
    { clip: "7514219", from: 450, len: 165, zoom: [1.08, 1.16] },
  ];
  const endO = ts(f, 600, 625);
  const sz = lang === "es" ? 78 : 86;
  const tag = <div style={{ position: "absolute", left: SX, top: 420, display: "flex", alignItems: "center", gap: 18, opacity: ts(f, 8, 28) * (1 - endO) }}>
    <HoodLogo s={64} /><span style={{ fontFamily: "Bricolage, Inter, sans-serif", fontSize: 44, fontWeight: 800, color: "#fff" }}>hoodiechamp</span>
    <span style={{ marginLeft: 14, background: HL, color: INK, fontFamily: SANS, fontWeight: 800, fontSize: 30, padding: "4px 14px", borderRadius: 10 }}>{t.ex}</span></div>;
  const cards = ["@nora.makes", "@lila.films", "@sam.ugc"];
  return <AbsoluteFill style={{ background: "#0b0d1a" }}>
    {shots.map((s, i) => <Sequence key={i} from={s.from} durationInFrames={s.len}><Clip s={s} /></Sequence>)}
    <Grade />
    {tag}
    <Line font={SANS} a={-10} b={150} size={96}>{t.l1}</Line>
    <Line font={SANS} a={150} b={300} size={sz}>{t.l2}</Line>
    <Pop a={185} b={300} top={560}><div style={{ background: "#fff", color: INK, fontFamily: SANS, fontSize: 40, fontWeight: 700, padding: "26px 32px", borderRadius: 26, width: SW }}>{t.brief}</div></Pop>
    <Line font={SANS} a={300} b={450} size={sz}>{t.l3}</Line>
    <Line font={SANS} a={450} b={600} size={sz}>{t.l4}</Line>
    {[0, 1, 2].map((k) => { const pick = ts(f, 500, 516); const isP = k === 1;
      return <Pop key={k} a={330 + k * 12} b={600} top={560 + k * 130}>
        <div style={{ width: SW, display: "flex", alignItems: "center", justifyContent: "space-between", background: f > 450 && isP ? HL : "rgba(255,255,255,0.94)", color: INK, fontFamily: SANS, fontSize: 38, fontWeight: 700, padding: "22px 28px", borderRadius: 24,
          opacity: f > 450 && !isP ? 1 - 0.5 * pick : 1, transform: `scale(${f > 450 && isP ? 1 + 0.03 * pick : 1})` }}>
          <span>{cards[k]}</span><span style={{ background: HB, color: "#fff", padding: "8px 20px", borderRadius: 14, fontSize: 32 }}>{f > 500 && isP ? t.picked : t.price}</span></div></Pop>; })}
    {/* end card */}
    <AbsoluteFill style={{ opacity: endO * (1 - ts(f, HW_LEN - 12, HW_LEN - 1)), background: HB }}>
      <AbsoluteFill style={{ background: "radial-gradient(1200px 900px at 50% 45%, #3a48ff 0%, #2e3cff 55%, #2533e0 100%)" }} />
      <div style={{ position: "absolute", left: SX, width: SW, top: 520, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 48, transform: `translateY(${(1 - ts(f, 600, 636)) * 24}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}><div style={{ borderRadius: 30, boxShadow: "0 0 0 4px #fff" }}><HoodLogo s={120} /></div><span style={{ fontFamily: "Bricolage, Inter, sans-serif", fontWeight: 800, fontSize: 84, color: "#fff" }}>hoodiechamp</span></div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: lang === "es" ? 76 : 88, letterSpacing: -2.5, lineHeight: 1.05, color: "#fff" }}>{t.e1}</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: "#fff" }}>{t.e2}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: INK, background: HL, padding: "20px 44px", borderRadius: 26, whiteSpace: "nowrap" }}>hoodiechamp.com</div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
