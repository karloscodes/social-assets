import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, continueRender, delayRender, Img } from "remotion";
import { loadFont } from "@remotion/fonts";
const h = delayRender("font");
loadFont({ family: "Bricolage", url: staticFile("hoodiechamp/bricolage.woff2"), weight: "200 800" }).then(() => continueRender(h)).catch(() => continueRender(h));

const BLUE = "#2e3cff", LIME = "#c4f01e", INK = "#111318";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.22, 1, 0.36, 1);
const tw = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: E });
const ss = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
const FPS = 30;
// safe zone: x 80..900, y 300..1520
const L = 80, W = 820, TOP = 320;

export type Line = { text: React.ReactNode; beats: number; vis: (lf: number, len: number) => React.ReactNode };
export const lineFrames = (lines: Line[], bpm: number) => {
  const P = 60 / bpm; let acc = 0;
  return lines.map((l) => { const s = Math.round(acc * P * FPS); acc += l.beats; return { s, e: Math.round(acc * P * FPS) }; });
};

const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: LIME }}>{children}</span>;

const Mascot: React.FC<{ f: number; size?: number; mood?: "sad" | "happy" | "calm" }> = ({ f, size = 260, mood = "calm" }) => {
  const bob = Math.sin(f / 18) * 6;
  const blink = [40, 130, 230, 330, 450].some((b) => Math.abs((f % 520) - b) < 3) ? 0.15 : 1;
  const mouth = mood === "sad" ? "M115 160q15 -10 30 0" : mood === "happy" ? "M110 148q20 18 40 0" : "M115 150q15 10 30 0";
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 260 300" style={{ transform: `translateY(${bob}px)`, overflow: "visible" }}>
      <ellipse cx="130" cy="290" rx={78 - bob} ry="10" fill="#0003" />
      <path d="M130 20c-60 0-95 45-95 105 0 30 8 55 20 75-25 15-40 40-40 75h230c0-35-15-60-40-75 12-20 20-45 20-75 0-60-35-105-95-105z" fill="#141c9c" stroke={LIME} strokeWidth="5" />
      <ellipse cx="130" cy="125" rx="68" ry="72" fill="#fff" />
      <ellipse cx="108" cy="120" rx="9" ry={9 * blink} fill={INK} /><ellipse cx="152" cy="120" rx="9" ry={9 * blink} fill={INK} />
      <path d={mouth} stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={`M110 205v${45 + Math.sin(f / 14) * 3}M150 205v${35 + Math.sin(f / 14 + 1) * 3}`} stroke={LIME} strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
};
const Logo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#fff" />
    <g transform="translate(4 7) scale(.875)"><path d="M32 2.5c-14.5 0-24.5 10.5-24.5 25 0 5.5 1.4 10.5 3.8 14.5C3.5 45.5-2 51.5-2 60.5V70h68v-9.5c0-9-5.5-15-13.3-18.5 2.4-4 3.8-9 3.8-14.5 0-14.5-10-25-24.5-25Z" fill={BLUE} /><ellipse cx="32" cy="27.5" rx="16" ry="16.5" fill="#fff" /><path d="M27.5 47.5v10M36.5 47.5v6" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" /></g></svg>
);
const rise = (lf: number, at: number, dist = 40) => ({ opacity: tw(lf, at, at + 14), transform: `translateY(${(1 - tw(lf, at, at + 18)) * dist}px)` });
const Bubble: React.FC<{ children: React.ReactNode; meta?: string; style?: React.CSSProperties }> = ({ children, meta, style }) => (
  <div style={{ ...style }}>
    <div style={{ background: "rgba(255,255,255,0.16)", borderRadius: 40, borderBottomLeftRadius: 10, padding: "26px 34px", fontSize: 44, fontWeight: 600, lineHeight: 1.25, display: "inline-block", maxWidth: 700 }}>{children}</div>
    {meta && <div style={{ fontSize: 32, opacity: 0.7, marginTop: 10, marginLeft: 12, fontWeight: 600 }}>{meta}</div>}
  </div>
);
const Tag: React.FC<{ t?: string }> = ({ t = "Example" }) => <div style={{ position: "absolute", top: -22, right: 26, background: LIME, color: INK, fontSize: 34, fontWeight: 800, padding: "6px 18px", borderRadius: 14 }}>{t}</div>;
const Creator: React.FC<{ img: string; name: string; style?: React.CSSProperties; right?: React.ReactNode }> = ({ img, name, style, right }) => (
  <div style={{ position: "relative", background: "#fff", color: INK, borderRadius: 34, padding: "22px 28px", display: "flex", alignItems: "center", gap: 24, width: W, ...style }}>
    <Tag /><Img src={staticFile(`hoodiechamp/stock/${img}`)} style={{ width: 104, height: 104, borderRadius: 52, objectFit: "cover" }} />
    <b style={{ flex: 1, fontSize: 44 }}>{name}</b>{right}
  </div>
);
const PriceChip: React.FC = () => <div style={{ background: BLUE, color: "#fff", fontSize: 38, fontWeight: 800, padding: "12px 24px", borderRadius: 18 }}>Price</div>;

const EndCard: React.FC<{ lf: number; pre: string; url: string; urlSize: number }> = ({ lf, pre, url, urlSize }) => (
  <div style={{ position: "absolute", left: L, width: W, top: TOP, height: 1200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 46, textAlign: "center" }}>
    <div style={{ ...rise(lf, 0), display: "flex", alignItems: "center", gap: 24 }}><Logo size={110} /><span style={{ fontSize: 76, fontWeight: 800 }}>hoodiechamp</span></div>
    <div style={{ ...rise(lf, 6), fontSize: 74, fontWeight: 800, lineHeight: 1.1 }}>{pre}</div>
    <div style={{ ...rise(lf, 12), background: LIME, color: INK, fontSize: urlSize, fontWeight: 800, padding: "28px 60px", borderRadius: 32, whiteSpace: "nowrap", width: "max-content", flexShrink: 0, lineHeight: 1.1 }}>{url}</div>
    <div style={rise(lf, 18, 60)}><Mascot f={lf} size={230} mood="happy" /></div>
  </div>
);

const Slides: React.FC<{ lines: Line[]; bpm: number; carousel?: boolean; end: (lf: number) => React.ReactNode }> = ({ lines, bpm, carousel, end }) => {
  const f = useCurrentFrame();
  const fr = lineFrames(lines, bpm);
  const total = fr[fr.length - 1].e;
  const OUT = 10;
  return (
    <AbsoluteFill style={{ background: BLUE, color: "#fff", fontFamily: "Bricolage, sans-serif", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(1200px 900px at 50% 40%, #3a48ff 0%, #2e3cff 55%, #2533e0 100%)" }} />
      {lines.map((l, i) => {
        const { s, e } = fr[i];
        // first line starts mid-entry so text is already moving at frame 0
        const lf = f - s + (i === 0 ? 8 : 0);
        if (f < s - 1 || f >= e) return null;
        const last = i === lines.length - 1;
        const out = last ? ss(f, total - 14, total - 2) : ss(f, e - OUT, e);
        const inn = tw(lf, 0, 16);
        const dx = carousel ? (1 - inn) * 140 - out * 140 : 0;
        const dy = carousel ? 0 : (1 - inn) * 50 - out * 30;
        const drift = carousel ? 0 : -lf * 0.35;
        const op = Math.min(inn, 1 - out);
        if (last) return <div key={i} style={{ position: "absolute", inset: 0, opacity: 1 - out }}>{end(lf)}</div>;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: op, transform: `translate(${dx}px, ${dy}px)` }}>
            <div style={{ position: "absolute", left: L, width: W, top: TOP, fontSize: 88, fontWeight: 800, lineHeight: 1.06, letterSpacing: -2, transform: `translateY(${drift}px)` }}>{l.text}</div>
            <div style={{ position: "absolute", left: L, width: W, top: 740, height: 700, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 30 }}>{l.vis(lf, e - s)}</div>
          </div>
        );
      })}
      {carousel && (
        <div style={{ position: "absolute", top: 1480, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
          {lines.map((_, i) => { const on = f >= fr[i].s && f < fr[i].e; return <div key={i} style={{ width: on ? 60 : 22, height: 22, borderRadius: 11, background: on ? LIME : "rgba(255,255,255,0.4)" }} />; })}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---- video 2: pain hook for businesses (track ~92.3 bpm)
export const PAIN_BPM = 92.3;
const painLines: Line[] = [
  { beats: 6, text: <>You spent a week DMing creators on <Hi>Instagram.</Hi></>, vis: (lf) => <>
    <Bubble meta="Sent · Mon" style={rise(lf, 4)}>Hi! Do you make UGC videos?</Bubble>
    <Bubble meta="Sent · Wed" style={rise(lf, 26)}>What would 3 TikToks cost?</Bubble>
    <Bubble meta="Sent · Fri" style={rise(lf, 48)}>Just following up 🙂</Bubble></> },
  { beats: 5, text: <>Half never <Hi>answered.</Hi></>, vis: (lf) => <>
    <div style={{ alignSelf: "center" }}><Mascot f={lf} size={300} mood="sad" /></div>
    <Bubble meta={lf > 30 ? "Seen · no reply" : "Sent · Fri"} style={{ opacity: 1 - ss(lf, 60, 90) * 0.5 }}>Just following up 🙂</Bubble></> },
  { beats: 6, text: <>The rest sent pitches, not <Hi>prices.</Hi></>, vis: (lf) => <>
    <Bubble style={rise(lf, 4)}><span style={{ fontSize: 40 }}>Hey!! Love your brand 😍 I'm a storyteller with an authentic voice. Let's hop on a call to talk about a collab…</span></Bubble>
    <div style={{ ...rise(lf, 30), fontSize: 40, fontWeight: 700, opacity: 0.8 * tw(lf, 30, 44), marginLeft: 12 }}>No price. Again.</div></> },
  { beats: 7, text: <>On hoodiechamp: one sentence, creators send <Hi>prices,</Hi> you pick.</>, vis: (lf) => {
    const pick = ss(lf, 66, 80);
    return <>
      <div style={{ ...rise(lf, 2), background: "rgba(255,255,255,0.16)", borderRadius: 30, padding: "24px 30px", fontSize: 42, fontWeight: 700, width: W }}>“3 TikTok ads for my candle”</div>
      {([["face1.jpg", "@nora.makes"], ["face2.jpg", "@lila.films"], ["face3.jpg", "@sam.ugc"]] as const).map(([im, n], k) => (
        <Creator key={n} img={im} name={n} right={<PriceChip />} style={{ ...rise(lf, 18 + k * 12), outline: k === 1 ? `${8 * pick}px solid ${LIME}` : "none", transform: `${rise(lf, 18 + k * 12).transform} scale(${k === 1 ? 1 + 0.03 * pick : 1 - 0.02 * pick})`, opacity: tw(lf, 18 + k * 12, 32 + k * 12) * (k === 1 ? 1 : 1 - 0.35 * pick) }} />
      ))}</>;
  } },
  { beats: 6, text: null, vis: () => null },
];
export const PAIN_LEN = lineFrames(painLines, PAIN_BPM).slice(-1)[0].e;
export const HoodPain: React.FC = () => <Slides lines={painLines} bpm={PAIN_BPM} end={(lf) => <EndCard lf={lf} pre="Ask for an invite at" url="hoodiechamp.com" urlSize={68} />} />;

// ---- video 3: creators carousel (track ~83.4 bpm)
export const CRE_BPM = 83.35;
const CT = {
  en: { l1: <>Stop pitching <Hi>brands.</Hi></>, l2: <>Brands post real briefs. You send a <Hi>price.</Hi></>, l3: <>You keep 100%. We take no <Hi>cut.</Hi></>, l4: <>Free for creators, <Hi>always.</Hi></>,
    brief: "Example brief", task: "3 TikTok ads for a vitamin C serum", send: "Send your price →", paid: "of your price, paid to you directly", prof: "Example profile", jobs: "Madrid · 14 jobs done", pre: "Create your profile at" },
  es: { l1: <>Deja de perseguir a las <Hi>marcas.</Hi></>, l2: <>Las marcas publican encargos reales. Tú envías un <Hi>precio.</Hi></>, l3: <>Te quedas el 100 %. No cobramos <Hi>comisión.</Hi></>, l4: <>Gratis para creadores, <Hi>siempre.</Hi></>,
    brief: "Encargo de ejemplo", task: "3 anuncios de TikTok para un sérum de vitamina C", send: "Envía tu precio →", paid: "de tu precio, te pagan directamente", prof: "Perfil de ejemplo", jobs: "Madrid · 14 trabajos hechos", pre: "Crea tu perfil en" },
};
const creLines = (lang: "en" | "es", v2: boolean): Line[] => { const t = CT[lang]; const b = v2 ? [6, 6, 6, 6, 7] : [4, 5, 4, 4, 6]; return [
  { beats: b[0], text: t.l1, vis: (lf) => <div style={{ alignSelf: "center" }}><Mascot f={lf} size={340} /></div> },
  { beats: b[1], text: t.l2, vis: (lf) => <>
    <div style={{ ...rise(lf, 4), position: "relative", background: "#fff", color: INK, borderRadius: 34, padding: "34px 34px", width: W }}>
      <Tag t={t.brief} /><div style={{ fontSize: 44, fontWeight: 800 }}>Glow Skincare</div><div style={{ fontSize: 40, marginTop: 8 }}>{t.task}</div></div>
    <div style={{ ...rise(lf, 24), background: LIME, color: INK, borderRadius: 30, padding: "28px 0", width: W, textAlign: "center", fontSize: 48, fontWeight: 800, transform: `${rise(lf, 24).transform} scale(${1 + 0.02 * Math.sin(lf / 10)})` }}>{t.send}</div></> },
  { beats: b[2], text: t.l3, vis: (lf) => <div style={{ alignSelf: "center", textAlign: "center" }}>
    <div style={{ fontSize: 300, fontWeight: 800, color: LIME, lineHeight: 1, letterSpacing: -8 }}>{Math.round(interpolate(tw(lf, 4, 40), [0, 1], [60, 100]))}%</div>
    <div style={{ fontSize: 44, fontWeight: 700, opacity: tw(lf, 30, 44) }}>{t.paid}</div></div> },
  { beats: b[3], text: t.l4, vis: (lf) => <>
    <div style={{ position: "relative", ...rise(lf, 4) }}>
      <div style={{ position: "relative", background: "#fff", color: INK, borderRadius: 34, padding: "22px 28px", display: "flex", alignItems: "center", gap: 24, width: W }}>
        <Tag t={t.prof} /><Img src={staticFile("hoodiechamp/faces/face_4871916.jpg")} style={{ width: 110, height: 110, borderRadius: 55, objectFit: "cover" }} />
        <div style={{ flex: 1 }}><div style={{ fontSize: 44, fontWeight: 800 }}>@mia.makes</div><div style={{ fontSize: 34, opacity: 0.7 }}>{t.jobs}</div></div>
        <div style={{ fontSize: 44, fontWeight: 800, color: BLUE }}>★ 4.9</div></div></div>
    <div style={{ alignSelf: "center", ...rise(lf, 18) }}><Mascot f={lf} size={250} mood="happy" /></div></> },
  { beats: b[4], text: null, vis: () => null },
]; };
export const CRE_LEN = lineFrames(creLines("en", false), CRE_BPM).slice(-1)[0].e;
export const CRE2_LEN = lineFrames(creLines("en", true), CRE_BPM).slice(-1)[0].e;
export const HoodCreators: React.FC<{ lang?: "en" | "es"; v2?: boolean }> = ({ lang = "en", v2 = false }) =>
  <Slides lines={creLines(lang, v2)} bpm={CRE_BPM} carousel end={(lf) => <EndCard lf={lf} pre={CT[lang].pre} url="hoodiechamp.com/creators" urlSize={v2 ? 44 : 54} />} />;
