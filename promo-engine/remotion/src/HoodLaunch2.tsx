import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, continueRender, delayRender, Img } from "remotion";
import { loadFont } from "@remotion/fonts";
const h = delayRender("font");
Promise.all([loadFont({ family: "Inter", url: staticFile("fonts/Inter.ttf"), weight: "100 900" }),
  loadFont({ family: "Bricolage", url: staticFile("hoodiechamp/bricolage.woff2"), weight: "200 800" })]).then(() => continueRender(h)).catch(() => continueRender(h));

export const LAUNCH2_LEN = 800;
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

const BIDS = [{ p: "$180", x: 180, w: false }, { p: "$240", x: 420, w: true }, { p: "$150", x: 660, w: false }, { p: "$210", x: 900, w: true }];
const PK = 2;
const T = { shout: 96, crowd: 210, gavel: 380, hit: 412, prev: 505, pay: 605, end: 705 };

export const HoodLaunch2: React.FC = () => {
  const f = useCurrentFrame();
  const endIn = ts(f, T.end - 6, T.end + 30);
  // camera shake
  const sh = [0, 0];
  // mascot
  const toStage = ts(f, T.crowd - 6, T.crowd + 20), toLeft = ts(f, T.prev, T.prev + 24);
  const mx = lerp(lerp(540, 250, toLeft), 540, endIn);
  const my = lerp(lerp(lerp(1560, 840, toStage), 760, toLeft), 880, endIn);
  const ms = lerp(lerp(lerp(330, 230, toStage), 210, toLeft), 290, endIn);
  const heat = env(f, 26, 40, 72, 86);
  const shout = env(f, T.shout - 6, T.shout + 10, T.crowd - 16, T.crowd);
  const happy = Math.max(env(f, T.hit + 6, T.hit + 18, T.prev - 10, T.prev), env(f, T.prev + 44, T.prev + 56, T.pay - 6, T.pay + 4), env(f, T.pay + 52, T.pay + 62, T.end, T.end + 10), env(f, T.end + 34, T.end + 46, 800, 810));
  const hop = 0.6 * (pulse(f, T.hit + 6, 18) + pulse(f, T.pay + 52, 18) + pulse(f, 20, 18) * 0.6);
  let lookX = 0, lookY = 0;
  lookX += -0.7 * env(f, T.shout, T.shout + 6, T.crowd - 10, T.crowd);
  lookY += 1 * env(f, T.crowd + 10, T.crowd + 20, T.prev, T.prev + 10);
  lookX += 0.8 * env(f, T.prev + 10, T.prev + 20, T.end, T.end + 10);
  // hook
  const hookS = lerp(1.06, 1, ts(f, 0, 24)), hookO = ts(f, 0, 16) * (1 - ts(f, T.shout - 14, T.shout));
  // shout burst
  const bS = lerp(0.6, 1, ts(f, T.shout + 8, T.shout + 30)), bO = 1 - ts(f, T.crowd - 14, T.crowd);
  // crowd
  const crowdUp = (i: number) => ts(f, T.crowd + i * 6, T.crowd + 30 + i * 6);
  const crowdO = 1 - ts(f, T.end - 8, T.end + 10);
  const padUp = (i: number) => ts(f, T.crowd + 40 + i * 18, T.crowd + 62 + i * 18);
  const picked = f >= T.hit;
  const loserDrop = ts(f, T.hit + 10, T.hit + 40);
  const toPrev = ts(f, T.prev, T.prev + 20);
  // gavel
  const gIn = ts(f, T.gavel - 20, T.gavel + 6), gSwing = lerp(-40, 4, ts(f, T.gavel + 4, T.hit)) - 4 * ts(f, T.hit, T.hit + 12), gOut = ts(f, T.hit + 30, T.hit + 56);
  const flash = 0;
  // preview / pay
  const ph = ts(f, T.prev + 6, T.prev + 44), paid = ts(f, T.pay + 50, T.pay + 70), coin = ts(f, T.pay + 14, T.pay + 50);
  const phO = 1 - ts(f, T.end - 6, T.end + 10);
  const creator = { x: BIDS[PK].x, y: 1620 };
  const shakeTf = `scale(${1 + 0.025 * ts(f, 0, T.end) * (1 - endIn)})`;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 75% at 50% 45%, ${C.bg2} 0%, ${C.bg} 70%)`, color: C.text, fontFamily: "Inter", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: shakeTf }}>
        {/* HOOK */}
        {hookO > 0.001 && <Big o={hookO} s={hookS} t={<>Need a video<br />for your <span style={{ color: C.lime }}>product?</span></>} size={104} top={330} />}
        {/* SHOUT bubble */}
        {f > T.shout && bO > 0.001 && <div style={{ position: "absolute", left: 540, top: 700, transform: `translate(-50%,-50%) scale(${bS}) translateY(${4 * Math.sin(f / 16)}px)`, transformOrigin: "30% 100%", opacity: bO * ts(f, T.shout + 8, T.shout + 22) }}>
          <div style={{ width: 860, padding: "64px 70px", boxSizing: "border-box", borderRadius: 70, background: C.lime, color: C.ink, textAlign: "center", fontFamily: D, fontWeight: 800, fontSize: 74, lineHeight: 1.04, letterSpacing: -2 }}>3 TikToks of people trying our ghost pepper sauce!</div>
          <div style={{ position: "absolute", left: 200, bottom: -46, width: 0, height: 0, borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderTop: `60px solid ${C.lime}`, transform: "skewX(-20deg)" }} />
        </div>}
        {/* CROWD + paddles */}
        {f >= T.crowd && crowdO > 0.001 && BIDS.map((b, i) => {
          const u = crowdUp(i), isP = i === PK, pu = padUp(i);
          const drop = isP ? 0 : loserDrop;
          const bob = (1 - ts(f, T.hit - 10, T.hit)) * 10 * Math.sin(f / 12 + i * 1.3) * pu;
          const by = lerp(2150, 1930, u) + drop * 420 + (isP ? toPrev * 0 : 0);
          const padY = by - 540 - bob - (isP ? 30 * ts(f, T.hit + 4, T.hit + 26) : 0);
          const wob = 3 * Math.sin(f / 14 + i);
          const scale = isP ? 1 + 0.08 * ts(f, T.hit + 4, T.hit + 26) - 0.04 * pulse(f, T.hit, 12) : 1;
          return <React.Fragment key={i}>
            <div style={{ position: "absolute", left: b.x, top: by, transform: "translate(-50%,-100%)", opacity: crowdO }}><Crowd white={b.w} s={180} /></div>
            {pu > 0.001 && <div style={{ position: "absolute", left: b.x, top: padY, transform: `translate(-50%,-50%) rotate(${picked ? 0 : wob}deg) scale(${pu * scale})`, opacity: crowdO * (1 - drop) * (isP ? 1 - ts(f, T.prev, T.prev + 14) : 1), zIndex: isP ? 3 : 2 }}>
              <div style={{ position: "absolute", left: 85, top: 150, width: 18, height: 230, borderRadius: 9, background: "#c9a27a" }} />
              <div style={{ position: "relative", width: 188, height: 188, borderRadius: 94, background: C.lime, color: C.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: isP && picked ? `8px solid #fff` : "none", boxSizing: "border-box" }}>
                <div style={{ fontFamily: D, fontWeight: 800, fontSize: 60, letterSpacing: -2, lineHeight: 1 }}>{b.p}</div>
                <div style={{ marginTop: 6, padding: "3px 12px", borderRadius: 999, background: C.ink, color: C.lime, fontSize: 20, fontWeight: 700 }}>Example</div>
              </div>
              {isP && picked && <div style={{ position: "absolute", left: 120, top: -40, padding: "8px 20px", borderRadius: 12, background: C.blue, color: "#fff", fontFamily: D, fontWeight: 800, fontSize: 38, transform: `rotate(-10deg) scale(${ts(f, T.hit + 4, T.hit + 20)})`, opacity: ts(f, T.hit + 4, T.hit + 14) }}>Picked</div>}
            </div>}
          </React.Fragment>;
        })}
        {/* GAVEL */}
        {gIn > 0.001 && gOut < 1 && <div style={{ position: "absolute", left: lerp(1300, BIDS[PK].x + 200, gIn) + 300 * gOut, top: lerp(900, 1060, gIn) - 200 * gOut, opacity: 1 - gOut, transformOrigin: "400px 131px", transform: `translate(-400px,-131px) rotate(${gSwing}deg)`, zIndex: 5 }}><Gavel /></div>}
        {/* preview phone */}
        {f > T.prev && phO > 0.001 && <div style={{ position: "absolute", left: lerp(creator.x, 700, ph), top: lerp(1600, 1020, ph), transform: `translate(-50%,-50%) scale(${lerp(0.15, 0.82, ph)}) rotate(${lerp(-12, 3, ph)}deg)`, opacity: phO * ts(f, T.prev + 4, T.prev + 18), zIndex: 4,
          width: 400, height: 700, borderRadius: 44, background: "#2b2724", border: `8px solid ${paid > 0.5 ? C.lime : "#fff"}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `rotate(${6 * Math.sin(f / 7)}deg)` }}><Bottle s={1.25} /></div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - paid, transform: `translateY(${80 * paid}px)` }}>
            <div style={{ transform: "rotate(-30deg)", fontFamily: D, fontWeight: 800, fontSize: 84, color: "rgba(255,255,255,0.65)", letterSpacing: 4 }}>PREVIEW</div></div>
          <div style={{ position: "absolute", top: 22, left: 22, padding: "8px 20px", borderRadius: 999, background: paid > 0.5 ? C.lime : "#fff", color: C.ink, fontSize: 30, fontWeight: 800 }}>{paid > 0.5 ? "Final video \u2713" : "Preview"}</div>
        </div>}
        {/* coin: brand -> creator */}
        {coin > 0 && coin < 1 && (() => { const x = lerp(mx + 60, creator.x, coin), y = lerp(my - 120, 1560, coin) - 380 * Math.sin(Math.PI * coin);
          return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(1)`, width: 110, height: 110, borderRadius: 55, background: C.lime, color: C.ink, fontFamily: D, fontWeight: 800, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 6 }}>$</div>; })()}
        {/* captions (big, top) */}
        <Big o={env(f, T.crowd + 30, T.crowd + 44, T.gavel - 14, T.gavel)} s={pop(f, T.crowd + 30)} t="Creators bid." size={110} top={330} />
        <Big o={env(f, T.hit + 2, T.hit + 16, T.prev - 12, T.prev)} s={pop(f, T.hit + 2)} t={<>You <span style={{ color: C.lime }}>pick.</span></>} size={130} top={320} />
        <Big o={env(f, T.prev + 4, T.prev + 18, T.pay - 12, T.pay)} s={pop(f, T.prev + 4)} t="They send a preview." size={84} top={340} />
        <Big o={env(f, T.pay + 4, T.pay + 18, T.end - 12, T.end)} s={pop(f, T.pay + 4)} t={<>Like it?<br />Pay them <span style={{ color: C.lime }}>directly.</span></>} size={84} top={300} />
        {/* bottle in hand */}
        <div style={{ position: "absolute", left: mx + ms * 0.55, top: my - ms * 0.55, transform: `translate(-50%,-50%) rotate(${12 - 10 * pulse(f, 10, 10)}deg)`, opacity: 1 - ts(f, T.end - 6, T.end + 10), zIndex: 7 }}><Bottle s={ms / 520} /></div>
        {/* megaphone */}
        {shout > 0.001 && <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: -22 * hop, zIndex: 7, opacity: Math.min(1, shout * 2) }}><path d={`M${mx - ms * 0.28} ${my - ms * 0.3} Q${mx - ms * 0.5} ${my - ms * 0.2} ${mx - ms * 0.6} ${my - ms * 0.34}`} stroke={C.blue} strokeWidth={ms * 0.11} strokeLinecap="round" fill="none" /></svg>}
        {shout > 0.001 && <div style={{ position: "absolute", left: mx - ms * 0.6, top: my - ms * 0.32, transform: `translate(-16px,-75px) rotate(${-100 + 2 * Math.sin(f / 14)}deg) scale(${0.85 * shout})`, transformOrigin: "16px 75px", zIndex: 7 }}><Megaphone /></div>}
        {/* mascot */}
        <div style={{ position: "absolute", left: mx, top: my - 22 * hop, transform: "translate(-50%,-100%)", zIndex: 6 }}>
          <Champ f={endIn >= 1 ? Math.min(f, 770) : f} size={ms} lookX={lookX} lookY={lookY} squint={Math.max(heat * 0.7, shout * 0.8)} happy={happy} tears={heat} steam={heat} hop={hop} blinks={[150, 330, 560, T.end + 60]} />
        </div>
        {/* end card */}
        {endIn > 0.001 && <div style={{ position: "absolute", left: 0, right: 0, top: 940, display: "flex", flexDirection: "column", alignItems: "center", opacity: ts(f, T.end + 10, T.end + 34), transform: `translateY(${30 * (1 - ts(f, T.end + 10, T.end + 34))}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}><Logo s={120} /><div style={{ fontFamily: D, fontWeight: 800, fontSize: 104, letterSpacing: -3 }}>hoodiechamp</div></div>
          <div style={{ marginTop: 56, fontFamily: D, fontWeight: 800, fontSize: 80, letterSpacing: -2.5 }}>Creators bid. You pick<span style={{ color: C.lime }}>.</span></div>
          <div style={{ marginTop: 34, fontSize: 46, fontWeight: 600 }}>Ask for an invite at <span style={{ color: C.lime }}>hoodiechamp.com</span></div>
        </div>}
      </AbsoluteFill>
      {/* impact flash */}
      {flash > 0 && <AbsoluteFill style={{ background: C.lime, mixBlendMode: "difference", opacity: 0.9 }} />}
      {/* top brand mark (not shaken) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 108, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, opacity: 1 - ts(f, T.end - 4, T.end + 14), zIndex: 9 }}>
        <Logo s={52} /><div style={{ fontFamily: D, fontWeight: 800, fontSize: 42, letterSpacing: -1.2 }}>hoodiechamp</div>
      </div>
    </AbsoluteFill>
  );
};
