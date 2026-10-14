import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, continueRender, delayRender, Img } from "remotion";
import { loadFont } from "@remotion/fonts";
const h = delayRender("font");
Promise.all([loadFont({ family: "Inter", url: staticFile("fonts/Inter.ttf"), weight: "100 900" }),
  loadFont({ family: "Bricolage", url: staticFile("hoodiechamp/bricolage.woff2"), weight: "200 800" })]).then(() => continueRender(h)).catch(() => continueRender(h));

export const HOODIE_LEN = 710;
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
const B1 = 60, B2 = 150, B3 = 275, BP = 372, BV = 518, BC = 570, BE = 610;

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
const PICK = 2;

export const Hoodie: React.FC = () => {
  const f = useCurrentFrame();
  const endIn = ts(f, BE, BE + 30);
  // ---- hood state
  const heat = env(f, 22, 32, 52, 64);
  const lookUp = env(f, 8, 20, B1 + 10, B1 + 20) + env(f, B2 + 10, B2 + 20, B3 + 70, B3 + 80);
  let lookX = 0;
  lookX += -0.8 * env(f, B2 + 70, B2 + 76, B2 + 84, B2 + 90) + 0.8 * env(f, B2 + 86, B2 + 92, B2 + 100, B2 + 106) + 0.9 * env(f, B2 + 104, B2 + 108, B2 + 118, B2 + 124);
  lookX += 0.6 * env(f, B3 + 46, B3 + 60, B3 + 80, B3 + 92);
  const happy = Math.max(env(f, B3 + 12, B3 + 20, B3 + 40, B3 + 48), env(f, BV + 20, BV + 28, BC + 20, BC + 30), env(f, B1 + 70, B1 + 76, B1 + 86, B1 + 92));
  const squint = env(f, B2 + 96, B2 + 100, B2 + 112, B2 + 118);
  const hop = pulse(f, B3 + 14, 14) + pulse(f, BV + 22, 14) + pulse(f, BV + 36, 14) * 0.7 + pulse(f, 40, 10) * 0.5;
  // hood placement: bottom center, then into end card
  const hx = 540, hy = lerp(1700, 860, endIn), hs = lerp(250, 330, endIn);
  // ---- beat envelopes
  const intro = 1 - ts(f, B1 - 6, B1 + 14);
  const s1 = env(f, B1, B1 + 16, B2 - 6, B2 + 8);
  const s2 = env(f, B2, B2 + 16, B3 - 6, B3 + 8);
  const s3 = env(f, B3, B3 + 16, BP - 6, BP + 8);
  const prod = env(f, BP, BP + 22, BV - 8, BV + 10);
  const prev = env(f, BV, BV + 14, BE - 8, BE + 6);
  // bottle: intro hero -> sits in brief card (step 1) -> brand card (step 2/3)
  const bIn = tw(f, 0, 24);
  const toCard = ts(f, B1 - 4, B1 + 22);
  const toBrand = ts(f, B2 + 4, B2 + 30);
  const toPay = ts(f, B3 + 40, B3 + 66);
  // brief card rect
  const card = { x: lerp(90, lerp(60, 80, toPay), toBrand), y: lerp(470, lerp(400, 560, toPay), toBrand), w: lerp(900, lerp(680, 330, toPay), toBrand), h: lerp(360, lerp(230, 190, toPay), toBrand) };
  const cardO = (ts(f, B1 - 4, B1 + 14)) * (1 - ts(f, BP - 6, BP + 8));
  const typed = Math.round(interpolate(f, [B1 + 18, B1 + 62], [0, REQ.length], cl));
  const bottleX = lerp(540, card.x + 90, toCard), bottleY = lerp(lerp(820, 790, bIn), card.y + card.h / 2, toCard);
  const bottleS = lerp(1.55, toBrand > 0 ? lerp(0.5, 0.42, toBrand) : 0.5, toCard);
  const bottleO = Math.min(bIn, 1 - ts(f, BP - 6, BP + 8));
  // tokens + prices
  const tokIn = (i: number) => tw(f, B2 + 26 + i * 6, B2 + 44 + i * 6);
  const priceIn = (i: number) => tw(f, B2 + 52 + i * 10, B2 + 68 + i * 10);
  const picked = tw(f, B3 + 6, B3 + 18);
  // pitch bubble
  const pt = interpolate(f, [B2 + 74, B2 + 98], [0, 1], cl);
  const bounce = ts(f, B2 + 98, B2 + 116);
  const pitchX = f < B2 + 98 ? lerp(1250, 852, Math.pow(pt, 1.3)) : lerp(852, 1300, bounce);
  const gateHit = pulse(f, B2 + 97, 12);
  // pay arc
  const coin = ts(f, B3 + 70, B3 + 96);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 75% at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)`, color: C.text, fontFamily: "Inter", overflow: "hidden" }}>
      {/* top brand mark */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 108, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, opacity: 1 - ts(f, BE - 4, BE + 14) }}>
        <Logo s={52} /><div style={{ fontFamily: D, fontWeight: 800, fontSize: 42, letterSpacing: -1.2 }}>hoodiechamp</div>
      </div>
      {/* intro line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: D, fontWeight: 800, fontSize: 84, letterSpacing: -2.5, lineHeight: 1.02, opacity: intro * tw(f, 6, 22) }}>Need videos<br />of your product?</div>
      <Caption t="A small hot sauce brand, for example." o={intro * tw(f, 14, 28)} size={40} />
      <Step n={1} t="Say what you need" o={s1} />
      <Step n={2} t="Creators bid" o={s2} />
      <Step n={3} t="You pick. Pay them yourself." o={s3} />
      {/* brief / brand card */}
      {cardO > 0.001 && <div style={{ position: "absolute", left: card.x, top: card.y, width: card.w, height: card.h, borderRadius: 34, background: C.card, color: C.ink, opacity: cardO, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 190, right: 44, top: 46, opacity: 1 - toBrand * 0 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2, color: "#78716c", opacity: 1 - ts(f, B3 + 36, B3 + 46) }}>{toBrand > 0.5 ? "YOUR REQUEST" : "WHAT DO YOU NEED?"}</div>
          <div style={{ fontFamily: D, fontWeight: 800, fontSize: lerp(54, 40, toBrand), lineHeight: 1.1, letterSpacing: -1, marginTop: 10, opacity: 1 - ts(f, B3 + 36, B3 + 46) }}>
            {REQ.slice(0, typed)}<span style={{ opacity: f < B1 + 70 && Math.floor(f / 8) % 2 === 0 ? 1 : 0, color: C.blue }}>|</span></div>
        </div>
        <div style={{ position: "absolute", left: 150, top: 70, fontFamily: D, fontWeight: 800, fontSize: 40, opacity: ts(f, B3 + 58, B3 + 68) }}>Your brand</div>
        <div style={{ position: "absolute", left: 190, bottom: 36, display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 700, opacity: tw(f, B1 + 66, B1 + 80) * (1 - toBrand),
          transform: `scale(${0.8 + 0.2 * tw(f, B1 + 66, B1 + 80)})`, transformOrigin: "0 50%" }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: C.lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✓</div>We fill in the details
        </div>
      </div>}
      {/* bottle */}
      <div style={{ position: "absolute", left: bottleX, top: bottleY, transform: `translate(-50%,-50%) rotate(${-6 * pulse(f, 40, 16)}deg)`, opacity: bottleO, zIndex: 3 }}><Bottle s={bottleS} /></div>
      {/* step 2: wire, creators, prices */}
      {(s2 > 0.001 || s3 > 0.001) && <svg width={1080} height={1920} style={{ position: "absolute", opacity: s2 }}>
        {PRICES.map((p, i) => <path key={i} d={`M400 640 C400 700 ${p.x} 660 ${p.x} 760`} stroke={C.blue} strokeWidth={5} fill="none" strokeDasharray="16 14" strokeDashoffset={-f * 2} opacity={tokIn(i)} />)}
        {/* brief dots traveling */}
        {PRICES.map((p, i) => { const t = ts(f, B2 + 30 + i * 6, B2 + 50 + i * 6); return t > 0 && t < 1 ? <circle key={i} cx={lerp(400, p.x, t)} cy={lerp(640, 760, t)} r={14} fill={C.lime} /> : null; })}
      </svg>}
      {PRICES.map((p, i) => {
        const isPick = i === PICK;
        const o = Math.max(s2, isPick ? s3 : s3 * (1 - picked * 0.75)) * tokIn(i);
        if (o <= 0.001) return null;
        const px = isPick ? lerp(p.x, 860, toPay) : p.x, py = isPick ? lerp(840, 650, toPay) : 840;
        const fade = isPick ? 1 : 1 - picked * 0.75;
        return <div key={i} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%,-50%) scale(${isPick ? 1 + 0.08 * picked : 1})`, opacity: o * fade * (isPick ? 1 : 1 - toPay), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Token s={150} />
          <div style={{ fontSize: 26, fontWeight: 600, color: C.muted, opacity: priceIn(i) }}>Example</div>
          <div style={{ marginTop: -10, padding: "10px 26px", borderRadius: 999, background: C.lime, color: C.ink, fontFamily: D, fontWeight: 800, fontSize: 50, opacity: priceIn(i), transform: `translateY(${-30 * (1 - priceIn(i))}px)` }}>{p.p}</div>
          {isPick && <div style={{ position: "absolute", top: -34, right: -70, padding: "8px 20px", borderRadius: 12, background: C.blue, color: "#fff", fontFamily: D, fontWeight: 800, fontSize: 34,
            transform: `rotate(-8deg) scale(${interpolate(f, [B3 + 6, B3 + 14, B3 + 20], [0, 1.2, 1], cl)})` }}>Picked</div>}
        </div>;
      })}
      {/* pitch bubble + gate */}
      {s2 > 0.001 && <>
        <div style={{ position: "absolute", left: 800, top: 490, transform: `translate(-50%,-50%) scale(${(1 + 0.25 * gateHit) * tw(f, B2 + 66, B2 + 76)})`, opacity: s2, width: 92, height: 92, borderRadius: 26, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4 }}>
          <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
        </div>
        <div style={{ position: "absolute", left: pitchX, top: 490 - 120 * Math.sin(bounce * Math.PI) * 0.6 + 200 * bounce * bounce, transform: `translate(0,-50%) rotate(${30 * bounce}deg)`, opacity: s2 * (1 - bounce), zIndex: 5,
          padding: "16px 22px", borderRadius: 22, background: "#3a3632", fontSize: 34, fontWeight: 700, whiteSpace: "nowrap" }}>Pitch 👋</div>
      </>}
      <Caption t="Only creators who fit can answer, with a price." o={env(f, B2 + 54, B2 + 66, B2 + 78, B2 + 86)} />
      <Caption t="Nobody can write to you until you ask." o={env(f, B2 + 92, B2 + 102, B3 - 6, B3 + 4)} />
      {/* step 3: pay directly around hoodiechamp */}
      {s3 > 0.001 && <>
        <div style={{ position: "absolute", left: 540, top: 655, transform: "translate(-50%,-50%)", opacity: s3 * ts(f, B3 + 62, B3 + 74), width: 200, height: 170, borderRadius: 30, border: `4px dashed ${C.muted}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Logo s={64} /><div style={{ fontSize: 26, color: C.muted, fontWeight: 600 }}>hoodiechamp</div>
        </div>
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: s3 * ts(f, B3 + 62, B3 + 74) }}>
          <path d="M260 540 C300 300 780 300 840 520" stroke={C.lime} strokeWidth={6} fill="none" strokeDasharray="4 16" strokeLinecap="round" />
        </svg>
        {coin > 0 && coin < 1 && (() => { const t = coin; const x = Math.pow(1 - t, 3) * 260 + 3 * Math.pow(1 - t, 2) * t * 300 + 3 * (1 - t) * t * t * 780 + t * t * t * 840;
          const y = Math.pow(1 - t, 3) * 540 + 3 * Math.pow(1 - t, 2) * t * 300 + 3 * (1 - t) * t * t * 300 + t * t * t * 520;
          return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: 84, height: 84, borderRadius: 42, background: C.lime, color: C.ink, fontFamily: D, fontWeight: 800, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", opacity: s3 }}>$</div>; })()}
      </>}
      <Caption t="Pick one. Talk by email. Pay them yourself." o={env(f, B3 + 20, B3 + 32, B3 + 54, B3 + 62)} />
      <Caption t="We never touch the money." o={env(f, B3 + 64, B3 + 74, BP - 6, BP + 4)} size={52} />
      {/* product: real crops of the live home page */}
      {prod > 0.001 && (() => { const pan = ts(f, BP + 60, BP + 80); const pan2 = ts(f, BP + 84, BV - 8);
        return <div style={{ position: "absolute", left: 60, top: 270, width: 960, height: 1060, borderRadius: 30, background: "#f5f5f4", overflow: "hidden", opacity: prod, transform: `scale(${0.94 + 0.06 * prod})` }}>
          <div style={{ height: 70, background: "#e7e5e4", display: "flex", alignItems: "center", gap: 12, padding: "0 24px" }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: "#d6d3d1" }} />)}
            <div style={{ marginLeft: 16, flex: 1, height: 40, borderRadius: 20, background: "#fff", color: "#57534e", fontSize: 24, display: "flex", alignItems: "center", padding: "0 20px" }}>hoodiechamp.com</div>
          </div>
          <div style={{ position: "absolute", left: 30, top: 110 - 700 * pan, width: 900 }}>
            <Img src={staticFile("hoodiechamp/hero.png")} style={{ width: 900, display: "block" }} />
          </div>
          <div style={{ position: "absolute", left: 150, top: lerp(990, 100, pan) - 560 * pan2, width: 660 }}>
            <Img src={staticFile("hoodiechamp/steps.png")} style={{ width: 660, display: "block" }} />
          </div>
        </div>; })()}
      {/* preview before you pay */}
      {prev > 0.001 && (() => { const a = tw(f, BV, BV + 24); const shrink = ts(f, BC, BC + 24);
        return <div style={{ position: "absolute", left: lerp(1200, 540, a), top: lerp(700, 680, a), transform: `translate(-50%,-50%) rotate(${lerp(12, 0, a)}deg) scale(${lerp(1, 0.78, shrink)})`, opacity: prev,
          width: 400, height: 700, borderRadius: 44, background: "#2b2724", border: "6px solid #fff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `rotate(${6 * Math.sin(f / 9)}deg)` }}><Bottle s={1.25} /></div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: "rotate(-30deg)", fontFamily: D, fontWeight: 800, fontSize: 84, color: "rgba(255,255,255,0.55)", letterSpacing: 4 }}>PREVIEW</div></div>
          <div style={{ position: "absolute", top: 22, left: 22, padding: "6px 16px", borderRadius: 999, background: C.lime, color: C.ink, fontSize: 24, fontWeight: 800 }}>From the creator</div>
        </div>; })()}
      <Caption t="See a preview before you pay." o={env(f, BV + 14, BV + 26, BC - 4, BC + 4)} size={52} />
      <Caption t="Creators keep 100% of their price." o={env(f, BC + 6, BC + 16, BE - 8, BE)} size={44} />
      {/* hood */}
      <div style={{ position: "absolute", left: hx, top: hy - 18 * hop, transform: "translate(-50%,-100%)", zIndex: 6 }}>
        <Hood f={endIn >= 1 ? Math.min(f, BE + 70) : f} size={hs} lookX={lookX} lookY={-1 * lookUp + 0.7 * env(f, BV + 8, BV + 16, BC, BC + 10)} squint={Math.max(squint, heat * 0.7)} happy={happy}
          tears={heat} steam={heat} hop={hop} blinks={[95, 200, 330, 470, 560, BE + 60]} />
      </div>
      {/* end card */}
      {endIn > 0.001 && <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", flexDirection: "column", alignItems: "center", opacity: ts(f, BE + 12, BE + 36), transform: `translateY(${40 * (1 - ts(f, BE + 12, BE + 36))}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}><Logo s={120} /><div style={{ fontFamily: D, fontWeight: 800, fontSize: 104, letterSpacing: -3 }}>hoodiechamp</div></div>
        <div style={{ marginTop: 56, fontFamily: D, fontWeight: 800, fontSize: 80, letterSpacing: -2.5 }}>Creators bid. You pick<span style={{ color: C.lime }}>.</span></div>
        <div style={{ marginTop: 34, fontSize: 46, fontWeight: 600 }}>Ask for an invite at <span style={{ color: C.lime }}>hoodiechamp.com</span></div>
        <div style={{ marginTop: 26, fontSize: 34, color: C.muted }}>Free to post. Free to pick for invited brands.</div>
      </div>}
    </AbsoluteFill>
  );
};
