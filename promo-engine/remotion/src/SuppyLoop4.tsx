import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, continueRender, delayRender, Img } from "remotion";
import { loadFont } from "@remotion/fonts";
const h = delayRender("font");
loadFont({ family: "Inter", url: staticFile("fonts/Inter.ttf"), weight: "100 900" }).then(() => continueRender(h)).catch(() => continueRender(h));

export const LOOP4 = 660;
const C = { bg0: "rgb(10,8,7)", bg1: "rgb(26,22,20)", surf: "rgb(33,29,26)", line: "rgb(59,53,49)", text: "rgb(237,233,226)",
  muted: "rgb(173,163,151)", dim: "rgb(123,115,107)", or: "#f97316", orD: "#ea580c", or50: "rgb(67,32,16)", or700: "rgb(252,177,126)" };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.32, 0.72, 0, 1);
const ES = Easing.bezier(0.45, 0, 0.55, 1);
const tw = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: E });
const ts = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: ES });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const TAU = Math.PI * 2;
const per = (f: number, n: number, ph = 0) => Math.sin((TAU * n * f) / LOOP4 + ph);
const pulse = (f: number, a: number, len = 10) => { const d = f - a; return d >= 0 && d < len ? Math.sin((d / len) * Math.PI) : 0; };

const MX = 720, MY = 1000;            // mascot
const STOP = 300;                     // card stop x on input wire
const NEEDS = { x: 540, y: 380 }, BIN = { x: 540, y: 1600 };

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
  const blink = Math.min(bl(18), bl(250), bl(400), bl(470), bl(600));
  const breathe = 0.018 * per(f, 12);
  const sy = 1 + breathe - 0.10 * hop, sx = 1 - breathe * 0.6 + 0.08 * hop;
  const eyeH = 46 * blink * (1 - 0.62 * squint) * (1 - happy);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(-50%,-100%) scale(${scale})`, transformOrigin: "50% 100%" }}>
      <svg width={240} height={230} viewBox="0 0 240 230" style={{ overflow: "visible" }}>
        <g transform={`translate(120 218) scale(${sx} ${sy}) translate(-120 -218)`}>
          <rect x={14} y={30} width={212} height={188} rx={70} fill="#ffffff" />
          {[86, 154].map((cx) => {
            const ex = cx + lookX * 16, ey = 122 + lookY * 12;
            return <g key={cx}>
              {eyeH > 2 && <ellipse cx={ex} cy={ey} rx={17} ry={eyeH / 2} fill="#000" />}
              {blink < 0.3 && happy < 0.5 && <path d={`M${ex - 15} ${ey} L${ex + 15} ${ey}`} stroke="#000" strokeWidth={6} strokeLinecap="round" />}
              {happy > 0.02 && <path d={`M${ex - 18} ${ey + 8} Q${ex} ${ey - 22 * happy} ${ex + 18} ${ey + 8}`} stroke="#000" strokeWidth={8} fill="none" strokeLinecap="round" opacity={happy} />}
            </g>;
          })}
          <circle cx={206} cy={48} r={26.5 * (1 + 0.06 * Math.max(0, per(f, 18)))} fill="#ea580c" stroke={C.bg1} strokeWidth={6} />
        </g>
      </svg>
    </div>
  );
};

// ---- after-Paid beats ----
const T_CUST = 238, T_CUST_OUT = 344, T_SPAMV = 352, T_SPAMV_OUT = 438, T_FAST = 452, T_FAST_END = 556, T_END = 560, T_RET = 612;
const FAST = Array.from({ length: 12 }, (_, i) => ({ t: T_FAST + 4 + i * 8, up: i % 4 === 2 }));
const FN = ["SEO Boost", "Lead Lists", "Dev Agency", "Link Swap", "Growth Co", "Ad Partners", "Crypto Deal", "Backlinks"];
const FC = ["Anna Li", "Sam Ortiz", "Mia Chen", "Leo Park"];

const Stat: React.FC<{ k: string; v: string; mono?: boolean }> = ({ k, v, mono }) => (
  <div style={{ padding: "26px 30px", borderRadius: 24, background: "rgba(255,255,255,0.04)", border: `2px solid ${C.line}` }}>
    <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2.5, color: C.dim }}>{k}</div>
    <div style={{ fontSize: 52, fontWeight: 750, marginTop: 8, fontFamily: mono ? "ui-monospace, Menlo, monospace" : "Inter" }}>{v}</div>
  </div>
);

const mPosW = (f: number) => Math.max(ts(f, T_CUST - 8, T_CUST + 14) * (1 - ts(f, T_CUST_OUT + 10, T_CUST_OUT + 30)), ts(f, T_SPAMV - 8, T_SPAMV + 14) * (1 - ts(f, T_SPAMV_OUT + 14, T_SPAMV_OUT + 30)));
export const SuppyLoop4: React.FC<{ brand?: boolean; endCard?: boolean }> = ({ brand = false, endCard = false }) => {
  const f = useCurrentFrame();
  const cardM = endCard ? ts(f, T_RET + 14, T_RET + 40) : 0;
  const card = endCard ? ts(f, T_RET + 34, T_RET + 60) : 0;
  // beat envelopes
  const cust = ts(f, T_CUST, T_CUST + 30) * (1 - ts(f, T_CUST_OUT, T_CUST_OUT + 22));
  const spamV = ts(f, T_SPAMV, T_SPAMV + 30) * (1 - ts(f, T_SPAMV_OUT, T_SPAMV_OUT + 22));
  const endIn = tw(f, T_END + 8, T_END + 32) * (1 - ts(f, T_RET, T_RET + 22));
  const endPre = ts(f, T_FAST_END - 2, T_END + 6) * (endCard ? 1 : 1 - ts(f, T_RET + 20, T_RET + 46));
  const away = Math.max(cust, spamV);                 // mascot steps aside
  const wire = 1 - Math.max(away, endPre, mPosW(f));
  // mascot reactions
  let lookX = 0, lookY = 0, squint = 0, happy = 0, hop = 0;
  MAILS.forEach((m) => {
    const ins = ts(f, m.t + 22, m.t + 34) * (1 - ts(f, m.t + 52, m.t + 62));
    lookX += -0.9 * ins;
    if (!m.paid) { squint += ts(f, m.t + 36, m.t + 44) * (1 - ts(f, m.t + 56, m.t + 66)); lookY += 0.9 * ts(f, m.t + 54, m.t + 62) * (1 - ts(f, m.t + 70, m.t + 82)); hop += pulse(f, m.t + 52, 10) * 0.6; }
    else { happy = ts(f, m.t + 40, m.t + 48) * (1 - ts(f, m.t + 100, m.t + 112)); lookY += -1 * ts(f, m.t + 54, m.t + 64) * (1 - ts(f, m.t + 90, m.t + 104)); hop += pulse(f, m.t + 44, 12) + pulse(f, m.t + 58, 12) * 0.7; }
  });
  lookY += -1 * cust + 0 * spamV;
  lookY += -1 * spamV;
  // fast mode: eyes dart
  FAST.forEach((c) => { const v = ts(f, c.t + 4, c.t + 7) * (1 - ts(f, c.t + 8, c.t + 11)); lookX += -0.8 * v; lookY += (c.up ? -0.8 : 0.8) * ts(f, c.t + 8, c.t + 10) * (1 - ts(f, c.t + 11, c.t + 14)); if (c.up) hop += pulse(f, c.t + 8, 8) * 0.6; });
  happy = Math.max(happy, 0.9 * ts(f, T_END + 6, T_END + 18) * (endCard ? 1 : 1 - ts(f, T_RET, T_RET + 16)));
  const bounce = 18 * hop;
  const mPos = Math.max(ts(f, T_CUST - 8, T_CUST + 14) * (1 - ts(f, T_CUST_OUT + 10, T_CUST_OUT + 30)), ts(f, T_SPAMV - 8, T_SPAMV + 14) * (1 - ts(f, T_SPAMV_OUT + 14, T_SPAMV_OUT + 30)));
  const mx = lerp(lerp(MX, 900, mPos), 540, cardM), my = lerp(lerp(MY + 110, 1840, mPos), 760, cardM), ms = lerp(lerp(1, 0.6, mPos), 1.15, cardM);
  // counters
  const fastSpam = FAST.filter((c) => !c.up && f >= c.t + 18).length * 50;   // each streak card stands for a batch
  const baseSpam = MAILS.filter((m) => !m.paid && f >= m.t + 78).length;
  const spamN = f >= T_RET + 20 ? 0 : baseSpam + fastSpam;
  const needsN = (f >= MAILS[2].t + 84 ? 1 : 0) + FAST.filter((c) => c.up && f >= c.t + 16).length;
  const needsShown = f >= T_RET + 20 ? 0 : needsN;
  // spin clock
  const fast = ts(f, T_FAST - 6, T_FAST + 10) * (1 - ts(f, T_FAST_END, T_FAST_END + 16));
  const clockA = interpolate(f, [T_FAST, T_FAST_END], [0, 360 * 4], { ...cl, easing: ES });
  const day = (Math.cos((clockA * Math.PI) / 360) + 1) / 2;
  return (
    <AbsoluteFill style={{ fontFamily: "Inter", color: C.text, overflow: "hidden",
      background: `radial-gradient(110% 70% at 50% 45%, rgb(${lerp(46, 30, fast * (1 - day))},${lerp(37, 30, fast * (1 - day))},${lerp(31, 44, fast * (1 - day))}) 0%, ${C.bg1} 45%, ${C.bg0} 100%)` }}>
      <AbsoluteFill style={{ transform: `translateY(${brand ? 40 : 0}px)` }}>
      {/* pipes */}
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: wire }}>
        <defs><filter id="gl"><feGaussianBlur stdDeviation="7" /></filter></defs>
        {["M -40 1000 L 600 1000", `M 720 880 C 720 700 540 640 540 ${NEEDS.y + 150}`, `M 720 1120 C 720 1300 540 1380 540 ${BIN.y - 90}`].map((d, i) => (
          <g key={i}>
            <path d={d} stroke={C.or} strokeWidth={16 + 10 * fast} fill="none" opacity={0.25 + 0.25 * fast} filter="url(#gl)" />
            <path d={d} stroke="rgba(255,200,160,0.55)" strokeWidth={4} fill="none" />
            <path d={d} stroke="#fff" strokeWidth={4} fill="none" strokeDasharray="14 46" strokeDashoffset={-(f * 2 + 0) % 60} opacity={0.5} />
          </g>))}
        {/* speed lines */}
        {Array.from({ length: 9 }).map((_, i) => { const x = ((f * 46 + i * 157) % 1300) - 200; const y = 1000 + ((i * 37) % 9 - 4) * 16;
          return <line key={i} x1={x} y1={y} x2={x + 160} y2={y} stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.35 * fast} />; })}
      </svg>
      {/* 24/7 indicator */}
      <div style={{ position: "absolute", left: brand ? 735 : "50%", top: brand ? 530 : 92, zIndex: 3, transform: `translateX(${brand ? "0" : "-50%"}) scale(${(0.7 + 0.3 * fast) * 1})`, transformOrigin: "0% 0%", opacity: fast, display: "flex", alignItems: "center", gap: 20,
        padding: "14px 32px", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)" }}>
        <svg width={56} height={56} viewBox="0 0 56 56"><circle cx={28} cy={28} r={24} fill="none" stroke={C.text} strokeWidth={4} />
          <line x1={28} y1={28} x2={28 + 15 * Math.sin((clockA * Math.PI) / 180)} y2={28 - 15 * Math.cos((clockA * Math.PI) / 180)} stroke={C.or} strokeWidth={5} strokeLinecap="round" />
          <line x1={28} y1={28} x2={28 + 10 * Math.sin((clockA * Math.PI) / 2160)} y2={28 - 10 * Math.cos((clockA * Math.PI) / 2160)} stroke={C.text} strokeWidth={5} strokeLinecap="round" /></svg>
        <div style={{ fontSize: 52, fontWeight: 850 }}>24/7</div>
        <div style={{ fontSize: 44 }}>{day > 0.5 ? "☀️" : "🌙"}</div>
      </div>
      {/* Spam bin */}
      <div style={{ position: "absolute", left: BIN.x, top: BIN.y, transform: `translate(-50%,-50%) scale(${1 + 0.1 * Math.max(...MAILS.map((m) => pulse(f, m.t + 76, 10)), ...FAST.map((c) => (c.up ? 0 : pulse(f, c.t + 17, 6))))})`, opacity: Math.min(wire, 1 - spamV),
        width: 380, height: 170, borderRadius: 36, background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.10)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2} strokeLinecap="round"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" /></svg>
        <div style={{ fontSize: 50, fontWeight: 750, color: C.muted }}>Spam</div>
        <div style={{ fontSize: 44, fontWeight: 850, minWidth: 64, height: 64, padding: "0 16px", borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center",
          background: spamN ? C.or50 : "rgba(255,255,255,0.07)", color: spamN ? C.or700 : C.dim }}>{spamN}</div>
      </div>
      {/* Needs you panel */}
      <div style={{ position: "absolute", left: 110, top: 200, width: 860, height: 300, borderRadius: 40, opacity: Math.min(wire, 1 - cust * 0),
        background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.10)" }}>
        <div style={{ position: "absolute", left: 34, top: 20, fontSize: 40, fontWeight: 750, color: C.or700 }}>Needs you</div>
        <div style={{ position: "absolute", left: 250, top: 18, fontSize: 36, fontWeight: 850, minWidth: 56, height: 56, padding: "0 14px", borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center",
          background: needsShown ? C.orD : "rgba(255,255,255,0.07)", color: needsShown ? "#fff" : C.dim, transform: `scale(${1 + 0.2 * Math.max(pulse(f, MAILS[2].t + 84, 8), ...FAST.map((c) => (c.up ? pulse(f, c.t + 16, 8) : 0)))})` }}>{needsShown}</div>
      </div>
      {/* the three opening mails (kept from v3) */}
      {MAILS.map((m, i) => {
        const t = m.t;
        if (f < t - 2) return null;
        const enter = ts(f, t, t + 30);
        let x = lerp(-280, STOP, enter), y = 1000, s = 1, rot = 0, op = 1, z = 4;
        let paid = 0;
        const ex = m.paid ? ts(f, t + 54, t + 84) : interpolate(f, [t + 52, t + 78], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
        if (ex > 0) {
          if (m.paid) { const p = ex; x = lerp(STOP, NEEDS.x, Math.min(1, p * 1.4)); y = lerp(1000, NEEDS.y, p) - Math.sin(p * Math.PI) * 30; s = lerp(1, 1.4, p); z = 6; }
          else { x = lerp(STOP, BIN.x, Math.min(1, ex * 1.5)); y = lerp(1000, BIN.y, ex) + Math.sin(ex * Math.PI) * -60; s = lerp(1, 0.4, ex); rot = 14 * ex; op = 1 - interpolate(ex, [0.75, 1], [0, 1], cl); if (ex >= 1) return null; }
        }
        if (m.paid) {
          paid = tw(f, t + 86, t + 100);
          op = (1 - ts(f, T_CUST, T_CUST + 14)) + ts(f, T_CUST_OUT + 4, T_CUST_OUT + 20) * (1 - ts(f, T_FAST + 40, T_FAST + 60));
          // after the customer beat it sits back in Needs you, then fades as the fast stream begins
          op *= 1 - ts(f, T_SPAMV - 6, T_SPAMV + 6);
          if (op <= 0) return null;
        }
        const wig = Math.sin((f - t - 30) / 2.2) * 2 * ts(f, t + 30, t + 36) * (1 - ts(f, t + 46, t + 52));
        return <div key={i} style={{ position: "absolute", left: x, top: y, zIndex: z, opacity: Math.min(op, m.paid ? 1 : 1), transform: `translate(-50%,-50%) scale(${s}) rotate(${rot + wig}deg)` }}>
          <Card m={m} paid={paid} />
        </div>;
      })}
      {/* fast stream */}
      {FAST.map((c, i) => {
        if (f < c.t || f > c.t + 20) return null;
        const e = ts(f, c.t, c.t + 7);
        let x = lerp(-280, STOP, e), y = 1000, s = 0.9, op = 1, rot = 0;
        const ex = ts(f, c.t + 8, c.t + 18);
        if (ex > 0) { const ty = c.up ? NEEDS.y : BIN.y; x = lerp(STOP, 540, ex); y = lerp(1000, ty, ex); s = lerp(0.9, 0.4, ex); op = 1 - interpolate(ex, [0.7, 1], [0, 1], cl); rot = (c.up ? -8 : 14) * ex; }
        const m: Mail = c.up ? { ini: FC[i % 4].split(" ").map((w) => w[0]).join(""), av: "#bbf7d0", name: FC[i % 4], subj: "Paid customer", paid: true, t: 0 }
          : { ini: "··", av: "rgb(87,83,78)", name: FN[i % 8], subj: "Quick question…", t: 0 };
        return <div key={"f" + i} style={{ position: "absolute", left: x, top: y, zIndex: 4, opacity: op, transform: `translate(-50%,-50%) scale(${s}) rotate(${rot}deg) skewX(${-8 * (1 - e)}deg)` }}>
          <Card m={m} paid={c.up ? 1 : 0} />
        </div>;
      })}
      {/* BEAT 1: customer panel (grows out of the Hannah card) */}
      {cust > 0.001 && <div style={{ position: "absolute", zIndex: 8, left: lerp(NEEDS.x - 364, 40, cust), top: lerp(NEEDS.y - 84, brand ? 225 : 170, cust), width: lerp(728, 1000, cust), height: lerp(168, brand ? 1305 : 1360, cust),
        borderRadius: 40, background: C.surf, border: `2px solid rgba(249,115,22,${0.6 * cust})`, boxShadow: `0 40px 100px rgba(0,0,0,${0.6 * cust})`, overflow: "hidden", opacity: Math.min(1, cust * (f > T_CUST_OUT ? 2.5 : 3)) }}>
        <div style={{ padding: 56, opacity: ts(f, T_CUST + 14, T_CUST + 34) * (1 - ts(f, T_CUST_OUT - 4, T_CUST_OUT + 8)) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ width: 130, height: 130, borderRadius: 65, background: "#bae6fd", color: "#1c1917", fontSize: 48, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>HW</div>
            <div>
              <div style={{ fontSize: 66, fontWeight: 800, letterSpacing: -1 }}>Hannah Weber</div>
              <div style={{ fontSize: 38, color: C.muted, marginTop: 4 }}>Active subscriber</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
            <div style={{ fontSize: 34, fontWeight: 850, padding: "10px 26px", borderRadius: 999, background: C.orD, color: "#fff" }}>Paid</div>
            <div style={{ fontSize: 34, fontWeight: 600, padding: "10px 26px", borderRadius: 999, background: "rgba(255,255,255,0.08)" }}>Polar ↗</div>
            <div style={{ fontSize: 34, fontWeight: 700, padding: "10px 26px", borderRadius: 999, background: C.or50, color: C.or700 }}>★ VIP</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 44 }}>
            {[["LIFETIME VALUE", "$637", true], ["CUSTOMER SINCE", "Sep 2025", false], ["PLAN", "Acme Analytics", false]].map(([k, v, mono], j) => (
              <div key={k as string} style={{ gridColumn: j === 2 ? "span 2" : undefined, transform: `translateY(${30 * (1 - tw(f, T_CUST + 24 + j * 7, T_CUST + 46 + j * 7))}px)`, opacity: tw(f, T_CUST + 24 + j * 7, T_CUST + 46 + j * 7) }}>
                <Stat k={k as string} v={v as string} mono={mono as boolean} /></div>))}
          </div>
          <div style={{ marginTop: 44, padding: "30px 34px", borderRadius: 24, border: `2px solid ${C.line}`, opacity: tw(f, T_CUST + 46, T_CUST + 66) }}>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2.5, color: C.dim }}>WRITING ABOUT</div>
            <div style={{ fontSize: 46, fontWeight: 750, marginTop: 10 }}>Charged twice this month</div>
          </div>
        </div>
      </div>}
      {/* BEAT 2: Spam bin opens into the real Spam view (crop of suppyhq.com hero-spam-dark) */}
      {spamV > 0.001 && (() => {
        const W = { x: lerp(BIN.x - 190, 40, spamV), y: lerp(BIN.y - 85, brand ? 225 : 170, spamV), w: lerp(380, 1000, spamV), h: lerp(170, brand ? 1305 : 1360, spamV) };
        const sc = 1000 / 600, sx = 400, sy = 30;
        return <div style={{ position: "absolute", zIndex: 8, left: W.x, top: W.y, width: W.w, height: W.h, borderRadius: 40, overflow: "hidden", background: C.surf, opacity: f > T_SPAMV_OUT ? Math.min(1, spamV * 2.5) : 1,
          border: "2px solid rgba(255,255,255,0.12)", boxShadow: `0 40px 100px rgba(0,0,0,${0.6 * spamV})` }}>
          <div style={{ position: "absolute", left: -sx * sc * (W.w / 1000), top: -sy * sc * (W.w / 1000), width: 2560 * sc * (W.w / 1000), height: 1440 * sc * (W.w / 1000),
            opacity: ts(f, T_SPAMV + 10, T_SPAMV + 28) }}>
            <Img src={staticFile("suppyhq-loop-v3/hero-spam-dark.png")} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>;
      })()}
      <div style={{ position: "absolute", left: mx, top: my - bounce, zIndex: 9 }}>
        <Mochi f={endCard ? Math.min(f, T_RET + 60) : f} lookX={lookX} lookY={lookY} squint={Math.min(1, squint)} happy={happy} hop={hop} scale={ms} />
      </div>
      </AbsoluteFill>
      {brand && <div style={{ position: "absolute", left: 0, right: 0, top: 112, height: 52, zIndex: 20, opacity: 1 - ts(f, T_RET + 22, T_RET + 40) * (endCard ? 1 : 0), display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        {/* real header logo from suppyhq.com: w-8 h-8 rounded-xl square, w-2.5 dot at -top-0.5 -right-0.5 with ring-2; scaled 1.625x, dark-mode stone colors */}
        <div style={{ position: "relative", width: 52, height: 52 }}>
          <div style={{ width: 52, height: 52, borderRadius: 19.5, background: "rgb(237,233,226)", color: "rgb(30,26,22)", fontSize: 26, fontWeight: 600, letterSpacing: -0.4, display: "flex", alignItems: "center", justifyContent: "center" }}>s</div>
          <div style={{ position: "absolute", width: 16.25, height: 16.25, top: -3.25, right: -3.25, borderRadius: "50%", background: "#f97316", boxShadow: `0 0 0 3.25px ${C.bg1}` }} />
        </div>
        <div style={{ fontSize: 40, fontWeight: 750, color: C.text, letterSpacing: -0.5 }}>SuppyHQ</div>
      </div>}
      {endCard && card > 0.001 && <div style={{ position: "absolute", left: 0, right: 0, top: 880, zIndex: 12, display: "flex", flexDirection: "column", alignItems: "center", opacity: card, transform: `translateY(${50 * (1 - card)}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div style={{ position: "relative", width: 128, height: 128 }}>
            <div style={{ width: 128, height: 128, borderRadius: 48, background: "rgb(237,233,226)", color: "rgb(30,26,22)", fontSize: 64, fontWeight: 600, letterSpacing: -1, display: "flex", alignItems: "center", justifyContent: "center" }}>s</div>
            <div style={{ position: "absolute", width: 40, height: 40, top: -8, right: -8, borderRadius: "50%", background: "#f97316", boxShadow: `0 0 0 8px ${C.bg1}` }} />
          </div>
          <div style={{ fontSize: 120, fontWeight: 750, letterSpacing: -3, color: C.text }}>SuppyHQ</div>
        </div>
        <div style={{ marginTop: 70, fontSize: 64, fontWeight: 650, color: C.text }}>suppyhq.com</div>
        <div style={{ marginTop: 18, fontSize: 40, fontWeight: 550, color: C.muted }}>$29/mo</div>
      </div>}
      {/* end line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, zIndex: 10, textAlign: "center", opacity: endIn, transform: `translateY(${40 * (1 - endIn)}px)` }}>
        <div style={{ fontSize: 96, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05 }}>Pitches out.<br /><span style={{ color: C.or }}>Paying customers<br />on top.</span></div>
        <div style={{ marginTop: 40, fontSize: 54, fontWeight: 650, color: C.muted }}>suppyhq.com · $29/mo</div>
      </div>
    </AbsoluteFill>
  );
};
