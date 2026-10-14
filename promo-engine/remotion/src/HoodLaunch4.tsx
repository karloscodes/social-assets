import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, continueRender, delayRender, Img, OffthreadVideo, Loop } from "remotion";
import { loadFont } from "@remotion/fonts";
const h = delayRender("font");
Promise.all([loadFont({ family: "Inter", url: staticFile("fonts/Inter.ttf"), weight: "100 900" }),
  loadFont({ family: "Bricolage", url: staticFile("hoodiechamp/bricolage.woff2"), weight: "200 800" })]).then(() => continueRender(h)).catch(() => continueRender(h));

export const LAUNCH4_LEN = 1110;
const C = { bg: "#151311", bg2: "#22201d", card: "#ffffff", ink: "#1c1917", text: "#f5f5f4", muted: "#a8a29e", line: "rgba(255,255,255,0.12)",
  blue: "#2e3cff", lime: "#d4ff3a", red: "#d7261e", red2: "#a8160f" };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.32, 0.72, 0, 1);
const ES = Easing.bezier(0.45, 0, 0.55, 1);
const tw = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: E });
const ts = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: ES });
const env = (f: number, a: number, b: number, c: number, d: number) => ts(f, a, b) * (1 - ts(f, c, d));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pulse = (f: number, a: number, len = 10) => { const d = f - a; return d >= 0 && d < len ? Math.sin((d / len) * Math.PI) : 0; };
const D = "Bricolage";

// beats

const Hood: React.FC<{ f: number; size: number; lookX?: number; lookY?: number; squint?: number; happy?: number; tears?: number; steam?: number; hop?: number; blinks?: number[] }> =
  ({ f, size, lookX = 0, lookY = 0, squint = 0, happy = 0, tears = 0, steam = 0, hop = 0, blinks = [] }) => {
  const bl = Math.min(1, ...blinks.map((p) => { const d = Math.abs(f - p); return d < 4 ? d / 4 : 1; }));
  const ry = 4.4 * bl * (1 - 0.65 * squint) * (1 - happy);
  const sw = 7 * Math.sin(f / 6) + 10 * hop * Math.sin(f / 2.5);
  const sq = 1 - 0.08 * hop;
  return (
    <svg width={size} height={size * 0.97} viewBox="-4 0 72 70" style={{ overflow: "visible", display: "block" }}>
      {/* steam */}
      {[0, 1, 2].map((i) => { const p = ((f / 22 + i / 3) % 1); return <circle key={i} cx={22 + i * 10 + Math.sin(f / 5 + i) * 2} cy={2 - p * 14} r={2.2 + p * 2.5} fill="#fff" opacity={steam * (1 - p) * 0.9} />; })}
      <g transform={`translate(32 70) scale(${1 / sq} ${sq}) translate(-32 -70)`}>
        <path d="M32 2.5c-14.5 0-24.5 10.5-24.5 25 0 5.5 1.4 10.5 3.8 14.5C3.5 45.5-2 51.5-2 60.5V70h68v-9.5c0-9-5.5-15-13.3-18.5 2.4-4 3.8-9 3.8-14.5 0-14.5-10-25-24.5-25Z" fill="#fff" />
        <ellipse cx="32" cy="27.5" rx="16" ry="16.5" fill={C.blue} />
        {[26, 38].map((cx) => { const ex = cx + lookX * 3, ey = 28 + lookY * 3; return <g key={cx}>
          {ry > 0.5 && <ellipse cx={ex} cy={ey} rx={2.7} ry={ry} fill="#fff" />}
          {bl < 0.3 && happy < 0.5 && <path d={`M${ex - 2.6} ${ey} L${ex + 2.6} ${ey}`} stroke="#fff" strokeWidth={1.2} strokeLinecap="round" />}
          {happy > 0.02 && <path d={`M${ex - 3} ${ey + 1.5} Q${ex} ${ey - 3.5 * happy} ${ex + 3} ${ey + 1.5}`} stroke="#fff" strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={happy} />}
          {tears > 0.02 && [0, 1].map((k) => { const p = ((f / 14 + k / 2 + (cx > 30 ? 0.25 : 0)) % 1); return <path key={k} d={`M${ex + (cx > 30 ? 2 : -2)} ${ey + 3 + p * 9} q1 1.6 0 2.4 q-1 -0.8 0 -2.4z`} fill="#fff" opacity={tears * (1 - p)} />; })}
        </g>; })}
        <g transform={`rotate(${sw} 27.5 47.5)`}><path d="M27.5 47.5v10" stroke={C.blue} strokeWidth={3.5} strokeLinecap="round" /></g>
        <g transform={`rotate(${-sw * 0.8} 36.5 47.5)`}><path d="M36.5 47.5v6" stroke={C.blue} strokeWidth={3.5} strokeLinecap="round" /></g>
      </g>
    </svg>
  );
};


const Champ: React.FC<{ f: number; size: number; lookX?: number; lookY?: number; squint?: number; happy?: number; tears?: number; steam?: number; hop?: number; blinks?: number[] }> =
  ({ f, size, lookX = 0, lookY = 0, squint = 0, happy = 0, tears = 0, steam = 0, hop = 0, blinks = [] }) => {
  const bl = Math.min(1, ...blinks.map((p) => { const d = Math.abs(f - p); return d < 4 ? d / 4 : 1; }));
  const ry = 13 * bl * (1 - 0.65 * squint) * (1 - happy);
  const sw = 8 * Math.sin(f / 6) + 12 * hop * Math.sin(f / 2.5);
  const breathe = 0.015 * Math.sin(f / 9);
  const sy = 1 + breathe - 0.09 * hop, sx = 1 - breathe * 0.6 + 0.07 * hop;
  const up = happy; // arms up for wins
  const armL = `M48 146 Q${lerp(26, 14, up)} ${lerp(160, 120, up)} ${lerp(32, 18, up)} ${lerp(184, 70, up)}`;
  const armR = `M152 146 Q${lerp(174, 186, up)} ${lerp(160, 120, up)} ${lerp(168, 182, up)} ${lerp(184, 70, up)}`;
  const lx = lookX * 7, ly = lookY * 6;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", display: "block" }}>
      {[0, 1, 2].map((i) => { const p = ((f / 22 + i / 3) % 1); return <circle key={i} cx={80 + i * 20 + Math.sin(f / 5 + i) * 4} cy={14 - p * 40} r={6 + p * 7} fill="#fff" opacity={steam * (1 - p) * 0.9} />; })}
      <g transform={`translate(100 206) scale(${sx} ${sy}) translate(-100 -206)`}>
        <path d="M40 150 Q40 120 70 116 L130 116 Q160 120 160 150 L160 196 Q160 206 150 206 L50 206 Q40 206 40 196 Z" fill={C.blue} />
        {up < 0.5 && <><path d={armL} stroke={C.blue} strokeWidth={22} strokeLinecap="round" fill="none" /><path d={armR} stroke={C.blue} strokeWidth={22} strokeLinecap="round" fill="none" /></>}
        <rect x={72} y={170} width={56} height={22} rx={10} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
        <circle cx={100} cy={92} r={70} fill={C.blue} />
        <circle cx={100} cy={98} r={54} fill="#fff" />
        {up >= 0.5 && <><path d={armL} stroke={C.blue} strokeWidth={22} strokeLinecap="round" fill="none" /><path d={armR} stroke={C.blue} strokeWidth={22} strokeLinecap="round" fill="none" /></>}
        {[80, 120].map((cx) => { const X = cx + lx, Y = 100 + ly; return <g key={cx}>
          {ry > 1 && <ellipse cx={X} cy={Y} rx={8} ry={ry} fill="#0b0a09" />}
          {bl < 0.3 && happy < 0.5 && <path d={`M${X - 8} ${Y} L${X + 8} ${Y}`} stroke="#0b0a09" strokeWidth={4.5} strokeLinecap="round" />}
          {happy > 0.02 && <path d={`M${X - 9} ${Y + 4} Q${X} ${Y - 11 * happy} ${X + 9} ${Y + 4}`} stroke="#0b0a09" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={happy} />}
          {tears > 0.02 && [0, 1].map((k) => { const p = ((f / 14 + k / 2 + (cx > 100 ? 0.25 : 0)) % 1); const tx = X + (cx > 100 ? 7 : -7);
            return <path key={k} d={`M${tx} ${Y + 10 + p * 22} q3 5 0 8 q-3 -3 0 -8z`} fill={C.blue} opacity={tears * (1 - p)} />; })}
        </g>; })}
        <g transform={`rotate(${sw} 86 150)`}><path d="M86 150 v26" stroke="#fff" strokeWidth={5} strokeLinecap="round" /><circle cx={86} cy={180} r={5.5} fill={C.lime} /></g>
        <g transform={`rotate(${-sw * 0.8} 114 150)`}><path d="M114 150 v18" stroke="#fff" strokeWidth={5} strokeLinecap="round" /><circle cx={114} cy={172} r={5.5} fill={C.lime} /></g>
      </g>
    </svg>
  );
};

const Bottle: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={200 * s} height={330 * s} viewBox="0 0 200 330">
    <rect x={78} y={0} width={44} height={34} rx={8} fill={C.ink} />
    <rect x={84} y={30} width={32} height={50} fill={C.red2} />
    <path d="M84 78 Q50 96 44 130 L44 300 Q44 326 70 326 L130 326 Q156 326 156 300 L156 130 Q150 96 116 78 Z" fill={C.red} />
    <rect x={58} y={150} width={84} height={130} rx={14} fill="#fff" />
    {/* ghost pepper with a little ghost face */}
    <path d="M100 168 q-6 -8 2 -12" stroke="#3f7d2a" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M82 182 Q100 166 118 182 L116 214 Q112 228 104 222 Q100 232 96 222 Q88 228 84 214 Z" fill={C.red} />
    <circle cx={94} cy={192} r={3.4} fill={C.ink} /><circle cx={106} cy={192} r={3.4} fill={C.ink} />
    <text x={100} y={252} textAnchor="middle" fontFamily={D} fontWeight={800} fontSize={17} fill={C.ink}>GHOST</text>
    <text x={100} y={270} textAnchor="middle" fontFamily={D} fontWeight={800} fontSize={17} fill={C.red}>PEPPER</text>
  </svg>
);

const Logo: React.FC<{ s: number }> = ({ s }) => <Img src={staticFile("hoodiechamp/icon.svg")} style={{ width: s, height: s, display: "block" }} />;
const Token: React.FC<{ s?: number }> = ({ s = 130 }) => (
  <div style={{ width: s, height: s, borderRadius: s * 0.3, background: C.blue, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
    <svg width={s * 0.8} height={s * 0.8} viewBox="-4 4 72 66"><path d="M32 2.5c-14.5 0-24.5 10.5-24.5 25 0 5.5 1.4 10.5 3.8 14.5C3.5 45.5-2 51.5-2 60.5V70h68v-9.5c0-9-5.5-15-13.3-18.5 2.4-4 3.8-9 3.8-14.5 0-14.5-10-25-24.5-25Z" fill="#fff" /><ellipse cx="32" cy="27.5" rx="16" ry="16.5" fill={C.blue} /></svg>
  </div>
);
const Step: React.FC<{ n: number; t: string; o: number }> = ({ n, t, o }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 262, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${16 * (1 - o)}px)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 30px 12px 14px", borderRadius: 999, background: "rgba(255,255,255,0.07)" }}>
      <div style={{ width: 56, height: 56, borderRadius: 28, background: C.lime, color: C.ink, fontFamily: D, fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div style={{ fontFamily: D, fontWeight: 800, fontSize: 48, letterSpacing: -1 }}>{t}</div>
    </div>
  </div>
);
const Caption: React.FC<{ t: string; o: number; size?: number }> = ({ t, o, size = 46 }) => (
  <div style={{ position: "absolute", left: 80, right: 80, top: 1270, textAlign: "center", fontSize: size, fontWeight: 650, lineHeight: 1.2, opacity: o, transform: `translateY(${16 * (1 - o)}px)` }}>{t}</div>
);

const REQ = "3 TikToks of people trying our ghost pepper sauce";
const PRICES = [{ p: "$180", x: 230 }, { p: "$240", x: 540 }, { p: "$150", x: 850 }];

const shakeAt = (f: number, a: number, amp: number, len = 16) => { const d = f - a; if (d < 0 || d > len) return [0, 0]; const k = amp * (1 - d / len); return [k * Math.sin(d * 2.9), k * Math.cos(d * 3.7)]; };
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const pop = (f: number, a: number, len = 10) => 0.96 + 0.04 * ts(f, a, a + 18);

const Crowd: React.FC<{ white: boolean; s: number }> = ({ white, s }) => (
  <svg width={s} height={s * 1.2} viewBox="-4 0 72 84" style={{ display: "block", overflow: "visible" }}>
    <path d="M32 2.5c-14.5 0-24.5 10.5-24.5 25 0 5.5 1.4 10.5 3.8 14.5C3.5 45.5-2 51.5-2 60.5V84h68V60.5c0-9-5.5-15-13.3-18.5 2.4-4 3.8-9 3.8-14.5 0-14.5-10-25-24.5-25Z" fill={white ? "#fff" : C.blue} />
    <ellipse cx="32" cy="27.5" rx="15" ry="16" fill="#0b0a09" />
    <path d="M27.5 47.5v9M36.5 47.5v6" stroke={white ? C.blue : "#fff"} strokeWidth={3} strokeLinecap="round" />
  </svg>
);
const Megaphone: React.FC = () => (
  <svg width={190} height={150} viewBox="0 0 190 150" style={{ overflow: "visible" }}>
    <path d="M20 60 L120 14 L120 136 L20 90 Z" fill={C.lime} />
    <rect x={4} y={56} width={24} height={38} rx={8} fill="#fff" />
    <ellipse cx={120} cy={75} rx={16} ry={61} fill="#b8e020" />
    <rect x={40} y={92} width={16} height={40} rx={6} fill="#fff" />
  </svg>
);
const Gavel: React.FC = () => (
  <svg width={420} height={260} viewBox="0 0 420 260" style={{ overflow: "visible" }}>
    <rect x={150} y={118} width={270} height={26} rx={13} fill="#c9a27a" />
    <rect x={40} y={50} width={130} height={160} rx={26} fill="#fff" />
    <rect x={40} y={90} width={130} height={22} fill={C.blue} /><rect x={40} y={148} width={130} height={22} fill={C.blue} />
  </svg>
);
const Big: React.FC<{ t: React.ReactNode; o: number; s: number; top?: number; size?: number }> = ({ t, o, s, top = 300, size = 100 }) => (
  <div style={{ position: "absolute", left: 40, right: 40, top, textAlign: "center", fontFamily: D, fontWeight: 800, fontSize: size, letterSpacing: -3, lineHeight: 1.0, opacity: o, transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{t}</div>
);


const Serum: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={140 * s} height={300 * s} viewBox="0 0 140 300">
    <rect x={52} y={0} width={36} height={70} rx={18} fill="#fff" />
    <rect x={44} y={64} width={52} height={36} rx={6} fill="#1c1917" />
    <path d="M30 108 Q30 98 40 98 L100 98 Q110 98 110 108 L120 280 Q120 298 102 298 L38 298 Q20 298 20 280 Z" fill="#d9a441" />
    <path d="M30 108 Q30 98 40 98 L56 98 L44 298 L38 298 Q20 298 20 280 Z" fill="#fff" opacity={0.25} />
    <rect x={34} y={170} width={72} height={78} rx={10} fill="#fff" />
    <rect x={46} y={190} width={48} height={8} rx={4} fill={C.blue} /><rect x={46} y={208} width={34} height={6} rx={3} fill="#d6d3d1" /><rect x={46} y={222} width={40} height={6} rx={3} fill="#d6d3d1" />
  </svg>
);
const Clip: React.FC<{ src: string; len: number; off?: number }> = ({ src, len, off = 0 }) => (
  <Loop durationInFrames={len}><OffthreadVideo src={staticFile(src)} muted startFrom={off} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></Loop>
);

const Sneaker: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={220 * s} height={300 * s} viewBox="0 0 220 300"><g transform="translate(0 80)">
    <path d="M20 120 L20 60 Q20 40 40 40 L90 40 Q110 70 150 80 L190 92 Q210 98 210 120 Z" fill="#fff" />
    <rect x={16} y={116} width={198} height={26} rx={10} fill={C.blue} />
    <path d="M70 52 L80 78 M86 50 L96 76 M102 56 L112 80" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
    <circle cx={44} cy={70} r={8} fill={C.lime} /></g></svg>
);
const Can: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={140 * s} height={300 * s} viewBox="0 0 140 300">
    <rect x={30} y={30} width={80} height={250} rx={16} fill="#fff" /><rect x={36} y={22} width={68} height={14} rx={6} fill="#d6d3d1" />
    <rect x={30} y={110} width={80} height={90} fill={C.blue} /><text x={70} y={165} textAnchor="middle" fontFamily={D} fontWeight={800} fontSize={26} fill="#fff">ICED</text>
    <circle cx={50} cy={240} r={6} fill="#a8d8ff" /><circle cx={84} cy={70} r={5} fill="#a8d8ff" /></svg>
);
const Phones: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={220 * s} height={300 * s} viewBox="0 0 220 300">
    <path d="M40 190 L40 140 Q40 50 110 50 Q180 50 180 140 L180 190" stroke="#fff" strokeWidth={18} fill="none" strokeLinecap="round" />
    <rect x={20} y={160} width={50} height={90} rx={20} fill={C.blue} /><rect x={150} y={160} width={50} height={90} rx={20} fill={C.blue} />
    <circle cx={45} cy={205} r={8} fill={C.lime} /></svg>
);
const Candle: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={160 * s} height={300 * s} viewBox="0 0 160 300">
    <path d="M80 40 Q100 80 80 104 Q60 80 80 40Z" fill="#ffb020" /><path d="M80 66 Q88 84 80 98 Q72 84 80 66Z" fill="#fff4c2" />
    <rect x={77} y={100} width={6} height={20} fill={C.ink} />
    <rect x={30} y={118} width={100} height={160} rx={18} fill="#fff" /><rect x={30} y={180} width={100} height={40} fill={C.lime} /></svg>
);
const PRODUCTS = [Serum, Sneaker, Can, Phones, Candle];
const Product: React.FC<{ f: number; s: number; freeze?: number }> = ({ f, s, freeze }) => {
  const ff = freeze ?? f; const per = 30; const i = Math.floor(ff / per); const t = (ff % per) / per;
  const out = ts(t * per, per - 8, per); const P = PRODUCTS[i % PRODUCTS.length]; const N = PRODUCTS[(i + 1) % PRODUCTS.length];
  return <div style={{ position: "relative", width: 220 * s, height: 300 * s }}>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", opacity: 1 - out, transform: `scale(${1 - 0.25 * out})` }}><P s={s} /></div>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", opacity: out, transform: `scale(${0.75 + 0.25 * out})` }}><N s={s} /></div>
  </div>;
};
const S = (x: string) => `hoodiechamp/stock/${x}.mp4`;
const CARDS = [
  { src: S("e"), len: 140, h: "@nora.makes", p: "$180" },
  { src: S("a"), len: 260, h: "@lila.films", p: "$150" },
  { src: S("f"), len: 140, h: "@sam.ugc", p: "$220" },
];
const GRID = [S("d"), S("g"), S("b"), S("f")];
const PK = 1;
const T = { ask: 105, bid: 215, browse: 355, pick: 485, prev: 615, fin: 765, net: 885, end: 1000 };
// network nodes (golden spiral)
const NODES = Array.from({ length: 46 }).map((_, i) => { const a = i * 2.39996; const r = 70 + 58 * Math.sqrt(i) * 1.18; return { x: 540 + r * Math.cos(a), y: 960 + r * Math.sin(a) * 1.25, v: i % 4 === 1 }; });

export const HoodLaunch4: React.FC = () => {
  const f = useCurrentFrame();
  const endIn = ts(f, T.end, T.end + 34);
  const toLow = ts(f, T.bid - 10, T.bid + 24);
  const mx = 540;
  const my = lerp(lerp(1560, 1830, toLow), 760, endIn);
  const ms = lerp(lerp(330, 210, toLow), 240, endIn);
  const mO = (1 - ts(f, T.fin + 6, T.fin + 22)) + ts(f, T.end + 6, T.end + 26);
  const shout = env(f, T.ask - 2, T.ask + 14, T.bid - 18, T.bid - 2);
  const bubble = env(f, T.ask + 10, T.ask + 30, T.bid - 14, T.bid);
  let lookX = 0, lookY = 0;
  lookY += -1 * env(f, T.bid + 10, T.bid + 24, T.prev + 60, T.prev + 74);
  lookX += -1 * env(f, T.bid + 70, T.bid + 80, T.bid + 92, T.bid + 100) + 1 * env(f, T.bid + 100, T.bid + 110, T.bid + 120, T.bid + 128);
  lookX += -0.7 * env(f, T.browse + 30, T.browse + 40, T.browse + 56, T.browse + 64) + 0.7 * env(f, T.browse + 64, T.browse + 74, T.browse + 90, T.browse + 98);
  lookX += 0.5 * env(f, T.prev + 60, T.prev + 72, T.prev + 96, T.prev + 106);
  const tapPick = T.pick + 14;
  const happy = Math.max(env(f, tapPick + 2, tapPick + 12, T.pick + 70, T.pick + 80), env(f, T.prev + 100, T.prev + 110, T.fin, T.fin + 8), env(f, T.end + 40, T.end + 54, 1110, 1120));
  const hop = 0.6 * (pulse(f, tapPick, 18) + pulse(f, T.prev + 100, 18) + pulse(f, 24, 18) * 0.6);
  // cards
  const cardIn = (i: number) => ts(f, T.bid + 20 + i * 14, T.bid + 46 + i * 14);
  const bidIn = (i: number) => ts(f, T.bid + 54 + i * 14, T.bid + 72 + i * 14);
  const sel = ts(f, T.browse - 14, T.browse + 2);
  const away = ts(f, T.browse, T.browse + 28);
  const cardW = 300, cardH = 430, cardTop = 640, gap = 30;
  const cx = (i: number) => 60 + i * (cardW + gap);
  // profile panel (opens from picked card)
  const open = ts(f, T.browse + 4, T.browse + 36);
  const toPhone = ts(f, T.pick + 40, T.pick + 76);
  const prX = lerp(cx(PK), 70, open), prY = lerp(cardTop, 580, open), prW = lerp(cardW, 940, open), prH = lerp(cardH + 140, 1040, open);
  const pW1 = 500, pH1 = 888, pX1 = 290, pY1 = 590;
  const making = f >= T.pick + 40;
  const prog = ts(f, T.pick + 76, T.prev + 4);
  const prevOn = ts(f, T.prev, T.prev + 14);
  const coin = ts(f, T.prev + 64, T.prev + 98);
  const paid = ts(f, T.prev + 98, T.prev + 112);
  const wm = 1 - ts(f, T.fin, T.fin + 16);
  const full = ts(f, T.fin + 10, T.fin + 46);
  const shrink = ts(f, T.net, T.net + 50);
  // container rect: panel -> phone -> full -> tiny tile in the network
  let X = lerp(prX, pX1, toPhone), Y = lerp(prY, pY1, toPhone), W = lerp(prW, pW1, toPhone), H = lerp(prH, pH1, toPhone), R = lerp(lerp(26, 40, open), 46, toPhone);
  X = lerp(X, 0, full); Y = lerp(Y, 0, full); W = lerp(W, 1080, full); H = lerp(H, 1920, full); R = lerp(R, 0, full);
  X = lerp(X, 540 - 45, shrink); Y = lerp(Y, 960 - 80, shrink); W = lerp(W, 90, shrink); H = lerp(H, 160, shrink); R = lerp(R, 14, shrink);
  const boxO = (f >= T.browse ? 1 : 0) * (1 - ts(f, T.end + 10, T.end + 30) * 0.6);
  const netO = ts(f, T.net + 20, T.net + 70) * (1 - 0.55 * ts(f, T.end, T.end + 30));
  const netRot = (f - T.net) / 900;
  const capDark = full * (1 - shrink);
  const cap = (t: React.ReactNode, a: number, b: number, size = 96, top = 300) => <Big o={env(f, a + 2, a + 16, b - 14, b)} s={pop(f, a + 2)} t={t} size={size} top={top} />;
  const frozen = f >= T.bid ? T.bid - 10 : undefined;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 75% at 50% 45%, ${C.bg2} 0%, ${C.bg} 70%)`, color: C.text, fontFamily: "Inter", overflow: "hidden" }}>
      {/* network */}
      {netO > 0.001 && <AbsoluteFill style={{ opacity: netO, transform: `rotate(${netRot * 20}deg) scale(${lerp(1.5, 1, ts(f, T.net, T.net + 90))})` }}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          {NODES.map((a, i) => NODES.slice(i + 1).filter((b) => Math.hypot(a.x - b.x, a.y - b.y) < 190).map((b, j) =>
            <line key={i + "-" + j} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.lime} strokeOpacity={0.18 + 0.12 * Math.sin(f / 20 + i)} strokeWidth={2} />))}
          {[540].map((x) => <line key="c" x1={540} y1={960} x2={NODES[0].x} y2={NODES[0].y} stroke={C.lime} strokeOpacity={0.3} strokeWidth={2} />)}
        </svg>
        {NODES.map((n, i) => { const ap = ts(f, T.net + 10 + i * 1.5, T.net + 34 + i * 1.5); const bob = 4 * Math.sin(f / 18 + i);
          return <div key={i} style={{ position: "absolute", left: n.x, top: n.y + bob, transform: `translate(-50%,-50%) rotate(${-netRot * 20}deg) scale(${ap})`, opacity: ap }}>
            {n.v ? <div style={{ width: 54, height: 96, borderRadius: 10, overflow: "hidden", boxShadow: `0 0 0 3px ${C.lime}` }}><Clip src={[S("d"), S("e"), S("f"), S("g"), S("b")][i % 5]} len={140} off={(i * 13) % 100} /></div>
              : <div style={{ boxShadow: `0 0 24px rgba(46,60,255,0.6)`, borderRadius: 18 }}><Token s={56} /></div>}
          </div>; })}
      </AbsoluteFill>}
      <AbsoluteFill style={{ transform: `scale(${1 + 0.02 * ts(f, 0, T.fin) * (1 - full)})` }}>
        {/* bid cards */}
        {f > T.bid && f < T.browse + 40 && CARDS.map((c, i) => {
          const isP = i === PK; const a = cardIn(i); if (a <= 0.001) return null;
          if (isP && f >= T.browse) return null;
          const slide = isP ? 0 : away * (i < PK ? -1 : 1) * 500;
          return <div key={i} style={{ position: "absolute", left: cx(i) + slide, top: cardTop + lerp(80, 0, a) - (isP ? 20 * sel : 0), width: cardW, opacity: a * (isP ? 1 : (1 - 0.5 * sel) * (1 - away)) }}>
            <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 26, overflow: "hidden", background: "#2b2724", boxShadow: isP ? `0 0 0 ${6 * sel}px ${C.lime}` : "none" }}><Clip src={c.src} len={c.len} off={i * 20} /></div>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, fontSize: 30, fontWeight: 650 }}><Token s={42} />{c.h}</div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12, opacity: bidIn(i), transform: `translateY(${16 * (1 - bidIn(i))}px)` }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.muted, letterSpacing: 1 }}>BID</div>
              <div style={{ padding: "6px 18px", borderRadius: 999, background: C.lime, color: C.ink, fontFamily: D, fontWeight: 800, fontSize: 40 }}>{c.p}</div>
            </div>
            <div style={{ marginTop: 10, display: "inline-block", padding: "3px 12px", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: C.muted, fontSize: 22, fontWeight: 700, opacity: bidIn(i) }}>Example</div>
          </div>;
        })}
        {/* morphing box: profile -> making -> preview -> final -> network tile */}
        {f >= T.browse && boxO > 0.001 && <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, borderRadius: R, overflow: "hidden", opacity: boxO, background: lerp(0, 1, 1 - toPhone) > 0.5 ? "#201e1b" : "#000",
          boxShadow: `0 0 0 ${lerp(lerp(6, 2, open), 6, toPhone) * (1 - full) + 3 * shrink}px ${paid > 0.5 || shrink > 0 ? C.lime : toPhone > 0.5 ? "#fff" : open > 0.5 ? "rgba(255,255,255,0.15)" : C.lime}, 0 30px 80px rgba(0,0,0,0.5)` }}>
          {/* profile content */}
          {toPhone < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 940, height: 1040, opacity: open * (1 - toPhone * 1.6), transformOrigin: "0 0", transform: `scale(${W / 940}, ${H / 1040})` }}>
            <div style={{ position: "absolute", left: 44, top: 40, display: "flex", alignItems: "center", gap: 20 }}><Token s={96} />
              <div><div style={{ fontFamily: D, fontWeight: 800, fontSize: 52, letterSpacing: -1 }}>{CARDS[PK].h}</div><div style={{ fontSize: 28, color: C.muted, fontWeight: 600 }}>Product videos</div></div></div>
            <div style={{ position: "absolute", right: 44, top: 46, textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}><div style={{ fontSize: 24, fontWeight: 700, color: C.muted }}>BID</div><div style={{ padding: "6px 18px", borderRadius: 999, background: C.lime, color: C.ink, fontFamily: D, fontWeight: 800, fontSize: 40 }}>{CARDS[PK].p}</div></div>
              <div style={{ marginTop: 8, display: "inline-block", padding: "3px 12px", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: C.muted, fontSize: 22, fontWeight: 700 }}>Example</div></div>
            <div style={{ position: "absolute", left: 44, top: 190, fontSize: 26, fontWeight: 700, color: C.muted, letterSpacing: 2 }}>PAST WORK</div>
            {GRID.map((g, i) => <div key={i} style={{ position: "absolute", left: 44 + i * 214, top: 240, width: 196, height: 350, borderRadius: 18, overflow: "hidden", opacity: ts(f, T.browse + 30 + i * 8, T.browse + 50 + i * 8), transform: `translateY(${20 * (1 - ts(f, T.browse + 30 + i * 8, T.browse + 50 + i * 8))}px)` }}><Clip src={g} len={140} off={i * 25} /></div>)}
            <div style={{ position: "absolute", left: 44, top: 630, width: 852, height: 280, borderRadius: 18, overflow: "hidden", opacity: ts(f, T.browse + 62, T.browse + 82) }}><div style={{ position: "relative", width: "100%", height: "100%" }}><Clip src={S("a")} len={260} off={40} /></div></div>
            <div style={{ position: "absolute", left: 44, right: 44, top: 940, height: 74, borderRadius: 999, background: C.lime, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D, fontWeight: 800, fontSize: 40,
              transform: `scale(${1 - 0.04 * pulse(f, tapPick, 10)})`, opacity: ts(f, T.pick - 10, T.pick + 6) }}>{f >= tapPick ? "Picked ✓" : "Pick this creator"}</div>
          </div>}
          {/* making */}
          {making && <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, opacity: toPhone * (1 - prevOn) }}>
            <Token s={110} /><div style={{ fontSize: 34, fontWeight: 700 }}>Making your video</div>
            <div style={{ width: 300, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.15)" }}><div style={{ width: 300 * prog, height: 14, borderRadius: 7, background: C.lime }} /></div>
          </div>}
          {/* the video */}
          {f >= T.prev && <div style={{ position: "absolute", inset: 0, opacity: prevOn }}><div style={{ position: "relative", width: "100%", height: "100%" }}><Clip src={S("a")} len={260} off={20} /></div>
            <div style={{ position: "absolute", inset: 0, opacity: wm, background: "rgba(0,0,0,0.18)" }}>
              {[-1, 0, 1].map((k) => <div key={k} style={{ position: "absolute", left: 0, right: 0, top: `${50 + k * 30}%`, textAlign: "center", transform: "translateY(-50%) rotate(-28deg)", fontFamily: D, fontWeight: 800, fontSize: 76, letterSpacing: 6, color: "rgba(255,255,255,0.6)" }}>PREVIEW</div>)}
            </div>
            <div style={{ position: "absolute", left: lerp(24, 60, full), top: lerp(24, 1500, full), padding: "8px 20px", borderRadius: 999, background: wm > 0.5 ? "#fff" : C.lime, color: C.ink, fontSize: lerp(28, 40, full), fontWeight: 800, opacity: 1 - shrink, whiteSpace: "nowrap" }}>{wm > 0.5 ? "Preview" : "Final video ✓"}</div>
          </div>}
        </div>}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 700, background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0))", opacity: capDark }} />
        {coin > 0 && coin < 1 && (() => { const x = lerp(mx, pX1 + 250, coin), y = lerp(my - ms * 0.6, pY1 + pH1 - 60, coin) - 260 * Math.sin(Math.PI * coin);
          return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: 100, height: 100, borderRadius: 50, background: C.lime, color: C.ink, fontFamily: D, fontWeight: 800, fontSize: 58, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 6, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>$</div>; })()}
        {bubble > 0.001 && <div style={{ position: "absolute", left: 540, top: 820, transform: `translate(-50%,-50%) scale(${lerp(0.7, 1, ts(f, T.ask + 10, T.ask + 34))}) translateY(${4 * Math.sin(f / 16)}px)`, transformOrigin: "30% 100%", opacity: bubble }}>
          <div style={{ width: 820, padding: "56px 64px", boxSizing: "border-box", borderRadius: 64, background: "#fff", color: C.ink, textAlign: "center", fontFamily: D, fontWeight: 800, fontSize: 64, lineHeight: 1.06, letterSpacing: -1.5 }}>"A short video of someone using our product."</div>
          <div style={{ position: "absolute", left: 230, bottom: -44, width: 0, height: 0, borderLeft: "36px solid transparent", borderRight: "36px solid transparent", borderTop: "56px solid #fff", transform: "skewX(-24deg)" }} />
        </div>}
        {cap(<>Need a video<br />for your <span style={{ color: C.lime }}>product?</span></>, -2, T.ask, 104, 330)}
        {cap("Say what you need.", T.ask, T.bid, 92, 360)}
        {cap(<>Creators bid.<br /><span style={{ color: C.lime }}>They keep their full price.</span></>, T.bid, T.browse, 76, 330)}
        {cap("Browse their work.", T.browse, T.pick, 90, 380)}
        {cap(<>Pick one.<br /><span style={{ color: C.lime }}>They make your video.</span></>, T.pick, T.prev, 80, 330)}
        {cap(<>See a preview.<br />Like it? <span style={{ color: C.lime }}>Pay them.</span></>, T.prev, T.fin, 80, 330)}
        {cap(<>Get the <span style={{ color: C.lime }}>final video.</span></>, T.fin, T.net, 92, 360)}
        {/* product in hand (morphing) */}
        <div style={{ position: "absolute", left: mx + ms * 0.62, top: my - ms * 0.5, transform: `translate(-50%,-50%) rotate(8deg)`, opacity: Math.min(1, mO) * (1 - ts(f, T.end - 4, T.end + 12)), zIndex: 7 }}><Product f={f} s={ms / 470} freeze={undefined} /></div>
        {shout > 0.001 && <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, zIndex: 7, opacity: Math.min(1, shout * 2) }}><path d={`M${mx - ms * 0.28} ${my - ms * 0.3} Q${mx - ms * 0.5} ${my - ms * 0.2} ${mx - ms * 0.6} ${my - ms * 0.34}`} stroke={C.blue} strokeWidth={ms * 0.11} strokeLinecap="round" fill="none" /></svg>}
        {shout > 0.001 && <div style={{ position: "absolute", left: mx - ms * 0.6, top: my - ms * 0.32, transform: `translate(-16px,-75px) rotate(${-100 + 2 * Math.sin(f / 14)}deg) scale(${0.85 * shout})`, transformOrigin: "16px 75px", zIndex: 7 }}><Megaphone /></div>}
        <div style={{ position: "absolute", left: mx, top: my - 22 * hop, transform: "translate(-50%,-100%)", zIndex: 6, opacity: Math.min(1, mO) }}>
          <Champ f={endIn >= 1 ? Math.min(f, 1080) : f} size={ms} lookX={lookX} lookY={lookY} squint={shout * 0.8} happy={happy} hop={hop} blinks={[60, 190, 300, 450, 600, 740, T.end + 80]} />
        </div>
        {endIn > 0.001 && <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", opacity: ts(f, T.end + 12, T.end + 36), transform: `translateY(${30 * (1 - ts(f, T.end + 12, T.end + 36))}px)` }}>
          <div style={{ padding: "50px 40px", borderRadius: 48, background: "rgba(21,19,17,0.82)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}><Logo s={110} /><div style={{ fontFamily: D, fontWeight: 800, fontSize: 96, letterSpacing: -3 }}>hoodiechamp</div></div>
          <div style={{ marginTop: 46, fontFamily: D, fontWeight: 800, fontSize: 64, letterSpacing: -2, lineHeight: 1.08 }}>Pay per pick.<br />Access our creator network.</div>
          <div style={{ marginTop: 30, fontFamily: D, fontWeight: 800, fontSize: 56, letterSpacing: -1.5, color: C.lime }}>Creators bid. You pick.</div>
          <div style={{ marginTop: 30, fontSize: 42, fontWeight: 600 }}>Ask for an invite at <span style={{ color: C.lime }}>hoodiechamp.com</span></div></div>
        </div>}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 108, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, opacity: 1 - ts(f, T.end - 4, T.end + 14), zIndex: 9 }}>
        <Logo s={52} /><div style={{ fontFamily: D, fontWeight: 800, fontSize: 42, letterSpacing: -1.2, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>hoodiechamp</div>
      </div>
    </AbsoluteFill>
  );
};
