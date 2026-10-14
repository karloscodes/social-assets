import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, continueRender, delayRender, Img } from "remotion";
import { loadFont } from "@remotion/fonts";
const h = delayRender("font");
loadFont({ family: "Inter", url: staticFile("fonts/Inter.ttf"), weight: "100 900" }).then(() => continueRender(h)).catch(() => continueRender(h));

export const LOOP3 = 450;
const C = { bg0: "rgb(10,8,7)", bg1: "rgb(26,22,20)", surf: "rgb(33,29,26)", line: "rgb(59,53,49)", text: "rgb(237,233,226)",
  muted: "rgb(173,163,151)", dim: "rgb(123,115,107)", or: "#f97316", orD: "#ea580c", or50: "rgb(67,32,16)", or700: "rgb(252,177,126)" };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.32, 0.72, 0, 1);
const ES = Easing.bezier(0.45, 0, 0.55, 1);
const tw = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: E });
const ts = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: ES });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const TAU = Math.PI * 2;
const per = (f: number, n: number, ph = 0) => Math.sin((TAU * n * f) / LOOP3 + ph);
const pulse = (f: number, a: number, len = 10) => { const d = f - a; return d >= 0 && d < len ? Math.sin((d / len) * Math.PI) : 0; };

const MX = 720, MY = 1000;            // mascot
const STOP = 300;                     // card stop x on input wire
const NEEDS = { x: 540, y: 352 }, BIN = { x: 540, y: 1600 };

type Mail = { ini: string; av: string; name: string; subj: string; paid?: boolean; t: number };
const MAILS: Mail[] = [
  { ini: "GS", av: "rgb(87,83,78)", name: "Growth Studio", subj: "Quick question about your SEO", t: 0 },
  { ini: "PL", av: "rgb(87,83,78)", name: "Partner Labs", subj: "Partnership opportunity", t: 62 },
  { ini: "HW", av: "#bae6fd", name: "Hannah Weber", subj: "Charged twice this month", paid: true, t: 124 },
];
// per mail: enter t..t+30, inspect t+30..t+52, exit t+52..t+80
const T_MORPH = 236, T_PULL = 262, T_LINE = 300, T_BACK = 382;

const Card: React.FC<{ m: Mail; paid: number; w?: number }> = ({ m, paid, w = 520 }) => (
  <div style={{ width: w, padding: "22px 26px", borderRadius: 30, background: `linear-gradient(180deg, rgb(44,39,35), ${C.surf})`,
    boxShadow: `0 24px 50px rgba(0,0,0,0.55), 0 0 0 1.5px ${paid ? `rgba(249,115,22,${0.4 + 0.6 * paid})` : "rgba(255,255,255,0.09)"}, 0 0 ${60 * paid}px rgba(249,115,22,${0.35 * paid})`,
    display: "flex", gap: 20, alignItems: "center", position: "relative" }}>
    <div style={{ width: 76, height: 76, borderRadius: 38, background: m.av, flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 28, fontWeight: 800, color: m.paid ? "#1c1917" : C.text }}>{m.ini}</div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 42, fontWeight: 750, color: C.text, whiteSpace: "nowrap" }}>{m.name}</div>
      <div style={{ fontSize: 33, color: C.muted, whiteSpace: "nowrap", marginTop: 2 }}>{m.subj}</div>
    </div>
    {/* envelope flap hint */}
    <svg width={44} height={32} viewBox="0 0 44 32" style={{ position: "absolute", right: 22, top: 18, opacity: 0.35 }}>
      <rect x={2} y={2} width={40} height={28} rx={6} fill="none" stroke={C.text} strokeWidth={3} /><path d="M4 5 L22 18 L40 5" fill="none" stroke={C.text} strokeWidth={3} strokeLinejoin="round" /></svg>
    <div style={{ position: "absolute", right: -14, top: -22, padding: "8px 20px", borderRadius: 999, background: C.orD, color: "#fff", fontSize: 30, fontWeight: 850,
      transform: `scale(${paid})`, boxShadow: "0 8px 24px rgba(234,88,12,0.6)" }}>Paid</div>
  </div>
);

const Mochi: React.FC<{ f: number; lookX: number; lookY: number; squint: number; happy: number; hop: number; scale: number }> = ({ f, lookX, lookY, squint, happy, hop, scale }) => {
  const bl = (p: number) => { const d = Math.abs(f - p); return d < 4 ? d / 4 : 1; };
  const blink = Math.min(bl(18), bl(232), bl(352), bl(430));
  const breathe = 0.018 * per(f, 10);
  const sy = 1 + breathe - 0.10 * hop, sx = 1 - breathe * 0.6 + 0.08 * hop;
  const eyeH = 46 * blink * (1 - 0.62 * squint) * (1 - happy);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(-50%,-100%) scale(${scale})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: "50%", top: "55%", width: 420, height: 420, transform: "translate(-50%,-50%)", borderRadius: "50%",
        background: `radial-gradient(closest-side, rgba(255,240,225,${0.22 + 0.1 * happy}), rgba(249,115,22,0.08) 60%, rgba(0,0,0,0))` }} />
      <svg width={240} height={230} viewBox="0 0 240 230" style={{ overflow: "visible", position: "relative" }}>
        <defs>
          <linearGradient id="mb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e9e4de" /></linearGradient>
          <filter id="ms" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#000" floodOpacity="0.5" /></filter>
        </defs>
        <ellipse cx={120} cy={222} rx={86 * (1 + 0.2 * hop)} ry={10} fill="rgba(0,0,0,0.45)" />
        <g transform={`translate(120 218) scale(${sx} ${sy}) translate(-120 -218)`} filter="url(#ms)">
          <rect x={14} y={30} width={212} height={188} rx={70} fill="url(#mb)" />
          <ellipse cx={92} cy={58} rx={48} ry={14} fill="#fff" opacity={0.8} />
          {/* eyes */}
          {[86, 154].map((cx) => {
            const ex = cx + lookX * 14, ey = 120 + lookY * 10;
            return <g key={cx}>
              {eyeH > 2 && <><ellipse cx={ex} cy={ey} rx={17} ry={eyeH / 2} fill="#1c1917" />
                {eyeH > 14 && <ellipse cx={ex + 5} cy={ey - eyeH * 0.22} rx={5.5} ry={Math.min(8, eyeH * 0.17)} fill="#fff" />}</>}
              {blink < 0.3 && happy < 0.5 && <path d={`M${ex - 15} ${ey} Q${ex} ${ey + 6} ${ex + 15} ${ey}`} stroke="#1c1917" strokeWidth={6} fill="none" strokeLinecap="round" />}
              {happy > 0.02 && <path d={`M${ex - 18} ${ey + 8} Q${ex} ${ey - 22 * happy} ${ex + 18} ${ey + 8}`} stroke="#1c1917" strokeWidth={8} fill="none" strokeLinecap="round" opacity={happy} />}
            </g>;
          })}
          <ellipse cx={58} cy={150} rx={16} ry={9} fill={C.or} opacity={0.22 + 0.4 * happy} />
          <ellipse cx={182} cy={150} rx={16} ry={9} fill={C.or} opacity={0.22 + 0.4 * happy} />
          <path d={`M110 ${158} Q120 ${163 + 6 * happy} 130 158`} stroke="#1c1917" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.75} />
          <g transform={`translate(200 46) scale(${1 + 0.15 * Math.max(0, per(f, 15))})`}><circle r={20} fill={C.bg1} /><circle r={14} fill={C.or} /></g>
        </g>
      </svg>
    </div>
  );
};

export const SuppyLoop3: React.FC = () => {
  const f = useCurrentFrame();
  const morph = ts(f, T_MORPH, T_MORPH + 34) * (1 - ts(f, T_BACK, T_BACK + 40));
  const pull = ts(f, T_PULL, T_PULL + 70) * (1 - ts(f, T_BACK - 6, T_BACK + 30));
  const lineIn = tw(f, T_LINE, T_LINE + 26) * (1 - ts(f, T_BACK, T_BACK + 26));
  const wire = 1 - morph;
  // mascot reactions
  let lookX = 0, lookY = 0, squint = 0, happy = 0, hop = 0;
  MAILS.forEach((m) => {
    const ins = ts(f, m.t + 22, m.t + 34) * (1 - ts(f, m.t + 52, m.t + 62));
    lookX += -0.9 * ins;
    if (!m.paid) { squint += ts(f, m.t + 36, m.t + 44) * (1 - ts(f, m.t + 56, m.t + 66)); lookY += 0.9 * ts(f, m.t + 54, m.t + 62) * (1 - ts(f, m.t + 70, m.t + 82)); hop += pulse(f, m.t + 52, 10) * 0.6; }
    else { happy = ts(f, m.t + 40, m.t + 48) * (1 - ts(f, m.t + 100, m.t + 112)); lookY += -1 * ts(f, m.t + 54, m.t + 64) * (1 - ts(f, m.t + 90, m.t + 104)); hop += pulse(f, m.t + 44, 12) + pulse(f, m.t + 58, 12) * 0.7; }
  });
  lookX += 0.5 * pulse(f, 300, 40) - 0.4 * pulse(f, 345, 30);
  const bounce = 18 * hop;
  // mascot position: center -> beside the end line during product
  const mPos = ts(f, T_MORPH, T_MORPH + 40) * (1 - ts(f, T_BACK + 4, T_BACK + 50));
  const mx = lerp(MX, 540, mPos), my = lerp(MY + 110, 1300, mPos), ms = lerp(1, 0.62, mPos);
  const spamN = MAILS.filter((m) => !m.paid && f >= m.t + 78).length * (f < T_BACK + 30 ? 1 : 0);
  // window rect: from Needs-you panel to product window
  const win = { x: lerp(110, 30, morph), y: lerp(200, 150, morph), w: lerp(860, 1020, morph), h: lerp(260, 980, morph) };
  // screenshot camera (source 2560x1440). Zoomed on list column/Hannah row, then pull back.
  const sc = lerp(1020 / 640, 1020 / 1150, pull);
  const srcX = lerp(390, 330, pull), srcY = lerp(219, 0, pull);
  return (
    <AbsoluteFill style={{ fontFamily: "Inter", color: C.text, overflow: "hidden",
      background: `radial-gradient(110% 70% at 50% 45%, rgb(46,37,31) 0%, ${C.bg1} 45%, ${C.bg0} 100%)` }}>
      {/* pipes */}
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: wire }}>
        <defs><filter id="gl"><feGaussianBlur stdDeviation="7" /></filter></defs>
        {["M -40 1000 L 600 1000", `M 720 880 C 720 700 540 620 540 ${NEEDS.y + 140}`, `M 720 1120 C 720 1300 540 1380 540 ${BIN.y - 90}`].map((d, i) => (
          <g key={i}>
            <path d={d} stroke={C.or} strokeWidth={16} fill="none" opacity={0.25} filter="url(#gl)" />
            <path d={d} stroke="rgba(255,200,160,0.55)" strokeWidth={4} fill="none" />
            <path d={d} stroke="#fff" strokeWidth={4} fill="none" strokeDasharray="14 46" strokeDashoffset={-(f * 2) % 60} opacity={0.5} />
          </g>))}
      </svg>
      {/* Spam bin */}
      <div style={{ position: "absolute", left: BIN.x, top: BIN.y, transform: `translate(-50%,-50%) scale(${1 + 0.1 * Math.max(...MAILS.map((m) => pulse(f, m.t + 76, 10)))})`, opacity: wire,
        width: 360, height: 170, borderRadius: 36, background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.10)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 22, boxShadow: "inset 0 10px 30px rgba(0,0,0,0.5)" }}>
        <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2} strokeLinecap="round"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" /></svg>
        <div style={{ fontSize: 50, fontWeight: 750, color: C.muted }}>Spam</div>
        <div style={{ fontSize: 44, fontWeight: 850, minWidth: 64, height: 64, padding: "0 16px", borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center",
          background: spamN ? C.or50 : "rgba(255,255,255,0.07)", color: spamN ? C.or700 : C.dim }}>{spamN}</div>
      </div>
      {/* Needs you panel -> product window */}
      <div style={{ position: "absolute", left: win.x, top: win.y, width: win.w, height: win.h, borderRadius: lerp(40, 34, morph), overflow: "hidden",
        background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.10)", boxShadow: `0 ${50 * morph}px ${110 * morph}px rgba(0,0,0,${0.6 * morph})` }}>
        <div style={{ position: "absolute", left: 34, top: 22, fontSize: 40, fontWeight: 750, color: C.or700, opacity: 1 - morph }}>Needs you</div>
        <div style={{ position: "absolute", left: -srcX * sc, top: -srcY * sc, width: 2560 * sc, height: 1440 * sc, opacity: ts(f, T_MORPH + 6, T_MORPH + 30) * (1 - ts(f, T_BACK, T_BACK + 30)) }}>
          <Img src={staticFile("suppyhq-loop-v3/hero-desk-dark.png")} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      {/* mails */}
      {MAILS.map((m, i) => {
        const t = m.t;
        if (f < t - 2) return null;
        const enter = ts(f, t, t + 30);
        let x = lerp(-280, STOP, enter), y = 1000, s = 1, rot = 0, op = 1, z = 4;
        let paid = 0;
        const ex = m.paid ? ts(f, t + 54, t + 84) : interpolate(f, [t + 52, t + 78], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
        if (ex > 0) {
          if (m.paid) {
            // over the mascot then up the branch
            const p = ex;
            x = lerp(STOP, NEEDS.x, Math.min(1, p * 1.4)); y = lerp(1000, NEEDS.y + 0, p) - Math.sin(p * Math.PI) * 30; s = lerp(1, 1.4, p); z = 6;
          } else {
            x = lerp(STOP, BIN.x, Math.min(1, ex * 1.5)); y = lerp(1000, BIN.y, ex) + Math.sin(ex * Math.PI) * -60; s = lerp(1, 0.4, ex); rot = 14 * ex; op = 1 - interpolate(ex, [0.75, 1], [0, 1], cl);
            if (ex >= 1) return null;
          }
        }
        if (m.paid) {
          paid = tw(f, t + 86, t + 100);
          // hand off to the real screenshot: fade as the window morphs
          op = 1 - ts(f, T_MORPH + 4, T_MORPH + 26);
          if (f > T_BACK) op = 0;
          if (op <= 0) return null;
        }
        // inspection wiggle
        const wig = Math.sin((f - t - 30) / 2.2) * 2 * ts(f, t + 30, t + 36) * (1 - ts(f, t + 46, t + 52));
        return <div key={i} style={{ position: "absolute", left: x, top: y, zIndex: z, opacity: op, transform: `translate(-50%,-50%) scale(${s}) rotate(${rot + wig}deg)` }}>
          <Card m={m} paid={paid} />
        </div>;
      })}
      <div style={{ position: "absolute", left: mx, top: my - bounce, zIndex: 5 }}>
        <Mochi f={f} lookX={lookX} lookY={lookY} squint={Math.min(1, squint)} happy={happy} hop={hop} scale={ms} />
      </div>
      {/* end line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, textAlign: "center", opacity: lineIn, transform: `translateY(${40 * (1 - lineIn)}px)` }}>
        <div style={{ fontSize: 88, fontWeight: 850, letterSpacing: -2, lineHeight: 1.06 }}>Pitches out.<br /><span style={{ color: C.or }}>Paying customers<br />on top.</span></div>
        <div style={{ marginTop: 34, fontSize: 48, fontWeight: 650, color: C.muted }}>suppyhq.com · $29/mo</div>
      </div>
    </AbsoluteFill>
  );
};
