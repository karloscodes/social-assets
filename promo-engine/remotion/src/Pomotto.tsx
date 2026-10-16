// Pomotto demo 1 "One ping": B&W flat panda, from out/pomotto-storyboards-v4.png. 6 beats x 4.5s = 27s @30fps.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, continueRender, delayRender, Sequence } from "remotion";
import { loadFont } from "@remotion/fonts";
const h = delayRender("font");
Promise.all([loadFont({ family: "Inter", url: staticFile("fonts/Inter.ttf"), weight: "100 900" }),
  loadFont({ family: "Cormorant", url: staticFile("fonts/Cormorant.ttf"), weight: "300 700" })]).then(() => continueRender(h)).catch(() => continueRender(h));

export const BEAT = 135;
export const POM1_LEN = BEAT * 6;
const WH = "#eeeeee", INK = "#080808", MID = "#484848", DIM = "#969696";
const ease = Easing.bezier(0.45, 0, 0.25, 1);
const ip = (f: number, a: number[], b: number[]) => interpolate(f, a, b, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

const se = (cx: number, cy: number, rx: number, ry: number, n = 4.2, st = 120) => {
  let d = "";
  for (let i = 0; i < st; i++) {
    const a = (i / st) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    d += `${i ? "L" : "M"}${(cx + rx * Math.sign(c) * Math.abs(c) ** (2 / n)).toFixed(1)},${(cy + ry * Math.sign(s) * Math.abs(s) ** (2 / n)).toFixed(1)}`;
  }
  return d + "Z";
};
const HEAD = se(0, 0, 290, 225);

type Eyes = "open" | "closed" | "tired" | "wide";
type PandaP = { x: number; y: number; s: number; eyes: Eyes; look?: number; arms?: "down" | "type" | "tap"; mouth?: "calm" | "smile" | "o" | "flat"; turn?: number; t: number };
// t = local frame, drives breathing, blinks and typing
const Panda: React.FC<PandaP> = ({ x, y, s, eyes, look = 0, arms = "down", mouth = "calm", turn = 0, t }) => {
  const breathe = 1 + 0.012 * Math.sin((t / 30) * Math.PI * 2 / 3.2);
  const blinkPhase = (t + 40) % 110; // one soft blink every ~3.7s
  const blink = (eyes === "open" || eyes === "wide") ? interpolate(blinkPhase, [0, 3, 6], [1, 0.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const tap = arms === "type" ? 4 * Math.sin(t / 4) : 0;
  const pr = eyes === "wide" ? [23, 26] : [17, 17];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <g transform={`scale(1,${breathe})`} style={{ transformOrigin: "0px 560px" }}>
        <ellipse cx={0} cy={365} rx={200} ry={195} fill={WH} />
        {arms === "down" && [-1, 1].map((k) => <ellipse key={k} cx={k * 150} cy={360} rx={55} ry={110} fill={MID} />)}
        {arms === "type" && [-1, 1].map((k) => <ellipse key={k} cx={k * 110} cy={390 + (k > 0 ? tap : -tap)} rx={60} ry={60} fill={MID} />)}
        {arms === "tap" && <><ellipse cx={-150} cy={360} rx={55} ry={110} fill={MID} /><ellipse cx={225} cy={180} rx={105} ry={60} fill={MID} /></>}
      </g>
      <g transform={`translate(${turn * 18},${-4 * (breathe - 1) * 100}) rotate(${turn * 5})`}>
        {[-1, 1].map((k) => <circle key={k} cx={k * 225} cy={-205} r={72} fill={MID} />)}
        <path d={HEAD} fill={WH} />
        {[-1, 1].map((k) => (
          <g key={k} transform={`translate(${k * 105 + turn * 10},-10)`}>
            <ellipse rx={62} ry={78} fill={INK} />
            {(eyes === "open" || eyes === "wide") && <ellipse cx={look * 16} rx={pr[0]} ry={pr[1] * blink} fill={WH} />}
            {eyes === "closed" && <path d="M-24,4 Q0,-16 24,4" stroke={WH} strokeWidth={7} fill="none" strokeLinecap="round" />}
            {eyes === "tired" && <rect x={-28} y={2} width={56} height={8} rx={4} fill={WH} />}
          </g>
        ))}
        <g transform={`translate(${turn * 14},0)`}>
          <ellipse cx={0} cy={86} rx={26} ry={16} fill={INK} />
          {mouth === "smile" && <path d="M-30,118 Q0,140 30,118" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />}
          {mouth === "o" && <ellipse cx={0} cy={134} rx={13} ry={14} fill={INK} />}
          {mouth === "flat" && <line x1={-24} x2={24} y1={128} y2={128} stroke={INK} strokeWidth={6} strokeLinecap="round" />}
        </g>
      </g>
    </g>
  );
};
const Desk = () => <rect x={44} y={1300} width={896} height={4} fill={MID} />;
const Laptop: React.FC<{ x: number; lit?: number }> = ({ x, lit = 0 }) => {
  const c = Math.round(40 + 50 * lit);
  return <g><rect x={x - 140} y={1110} width={280} height={190} rx={14} fill={`rgb(${c},${c},${c})`} /><circle cx={x} cy={1205} r={10} fill={`rgb(${c + 30},${c + 30},${c + 30})`} /></g>;
};
const Card: React.FC<{ x: number; y: number; label: string; o: number; dx?: number }> = ({ x, y, label, o, dx = 0 }) => (
  <g opacity={o} transform={`translate(${dx},0)`}>
    <rect x={x} y={y} width={330} height={86} rx={20} fill="#2e2e2e" />
    <rect x={x + 18} y={y + 18} width={50} height={50} rx={10} fill="#6e6e6e" />
    <text x={x + 86} y={y + 54} fontFamily="Inter" fontWeight={400} fontSize={26} fill="#dcdcdc">{label}</text>
  </g>
);
const Moon: React.FC<{ x: number; y: number; r: number; o: number }> = ({ x, y, r, o }) => (
  <g opacity={o}><mask id="mm"><rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill="#fff" /><circle cx={x + r * 0.55} cy={y - r * 0.15} r={r} fill="#000" /></mask>
    <circle cx={x} cy={y} r={r} fill={WH} mask="url(#mm)" /></g>
);
const Chime: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g>{[40, 75, 110].map((r, i) => {
    const o = interpolate(t - i * 6, [0, 15, 75], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const a = (d: number) => `${x + r * Math.cos((d * Math.PI) / 180)},${y + r * Math.sin((d * Math.PI) / 180)}`;
    return <path key={r} d={`M${a(-60)} A${r},${r} 0 0 1 ${a(60)}`} stroke="#9a9a9a" strokeWidth={4} fill="none" opacity={o} />;
  })}</g>
);
// one text block per beat: fades in at 0.4s, out over the last 0.5s
const Line: React.FC<{ t: number; children: React.ReactNode; top?: number; last?: boolean }> = ({ t, children, top = 470, last }) => {
  const o = ip(t, [10, 26], [0, 1]) * (last ? 1 : ip(t, [BEAT - 15, BEAT - 1], [1, 0]));
  return <div style={{ position: "absolute", left: 84, top, width: 840, opacity: o, transform: `translateY(${ip(t, [10, 30], [14, 0])}px)` }}>{children}</div>;
};
const H1: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = 96, children }) =>
  <div style={{ fontFamily: "Cormorant", fontWeight: 400, fontSize: size, lineHeight: 1.1, color: WH }}>{children}</div>;
const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  <div style={{ fontFamily: "Inter", fontWeight: 300, fontSize: 30, color: DIM, marginTop: 20 }}>{children}</div>;

const Scene: React.FC<{ i: number; children: (t: number) => React.ReactNode; light?: [number, number] }> = ({ i, children, light = [540, 700] }) => {
  const f = useCurrentFrame(), t = f - i * BEAT;
  if (t < 0 || t >= BEAT) return null;
  const sc = 1 + 0.02 * (t / BEAT), dy = interpolate(t, [0, BEAT], [6, -6]);
  const fadeIn = i === 0 ? ip(t, [0, 12], [0, 1]) : ip(t, [0, 14], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${light[0]}px ${light[1]}px, #2a2a2a 0%, #141414 35%, #060606 70%)` }} />
      <AbsoluteFill style={{ transform: `translateY(${dy}px) scale(${sc})`, transformOrigin: "540px 960px" }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>{children(t)}</svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const T: React.FC<{ i: number; children: (t: number) => React.ReactNode; last?: boolean; top?: number }> = ({ i, children, last, top }) => {
  const f = useCurrentFrame(), t = f - i * BEAT;
  if (t < 0 || t >= BEAT) return null;
  return <Line t={t} last={last} top={top}>{children(t)}</Line>;
};

export const PomottoOnePing: React.FC = () => (
  <AbsoluteFill style={{ background: "#060606" }}>
    {/* 1. One ping. */}
    <Scene i={0}>{(t) => {
      const c = ip(t, [24, 46], [0, 1]), look = ip(t, [44, 62], [0, 1]);
      return <><Card x={560} y={640} label="New message" o={c} dx={(1 - c) * 40} />
        <Panda x={430} y={960} s={0.62} eyes="open" look={look} turn={look * 0.6} arms={look > 0.5 ? "down" : "type"} mouth={look > 0.5 ? "o" : "calm"} t={t} />
        <Laptop x={430} /><Desk /></>;
    }}</Scene>
    <T i={0}>{() => <H1>One ping.</H1>}</T>
    {/* 2. 23 minutes */}
    <Scene i={1}>{(t) => <><Panda x={560} y={1010} s={0.5} eyes={t < 30 ? "open" : "tired"} look={ip(t, [0, 30], [1, 0])} mouth="flat" t={t} /><Desk /></>}</Scene>
    <T i={1}>{() => <><H1 size={140}>23 minutes</H1><H1 size={56}>to get back to the task.</H1><Sub>UC Irvine researchers</Sub></>}</T>
    {/* 3. product: start the timer */}
    <Scene i={2}>{(t) => {
      const o = ip(t, [8, 24], [0, 1]), m = ip(t, [40, 62], [0, 1]);
      const secs = Math.max(0, Math.floor((t - 40) / 30)), left = 1500 - (t > 40 ? secs : 0);
      const tm = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
      return <><g opacity={o}><rect x={84} y={800} width={816} height={96} rx={24} fill="#222" />
        <Moon x={520} y={848} r={18} o={m} />
        <text x={570} y={864} fontFamily="Inter" fontWeight={500} fontSize={44} fill={WH} style={{ fontVariantNumeric: "tabular-nums" }}>{tm}</text></g>
        <Panda x={300} y={1080} s={0.36} eyes="open" look={1} arms={t > 30 && t < 50 ? "tap" : "down"} mouth="smile" t={t} /></>;
    }}</Scene>
    <T i={2}>{() => <H1 size={84}>Start the timer.<br />Your Mac goes quiet.</H1>}</T>
    {/* 4. Nothing to toggle. */}
    <Scene i={3}>{(t) => <><Panda x={490} y={980} s={0.62} eyes="closed" arms="type" mouth="smile" t={t} /><Laptop x={490} lit={0.6 + 0.15 * Math.sin(t / 25)} /><Desk /></>}</Scene>
    <T i={3}>{() => <H1>Nothing to toggle.</H1>}</T>
    {/* 5. Your messages are waiting. (chime at 18.3s) */}
    <Scene i={4}>{(t) => {
      const c1 = ip(t, [40, 58], [0, 1]), c2 = ip(t, [52, 70], [0, 1]), up = ip(t, [12, 32], [0, 1]);
      return <><Chime x={300} y={820} t={t - 8} /><Card x={560} y={720} label="Slack" o={c1} dx={(1 - c1) * 30} /><Card x={560} y={816} label="Messages" o={c2} dx={(1 - c2) * 30} />
        <Panda x={400} y={1000} s={0.55} eyes={up > 0.5 ? "wide" : "closed"} look={up} turn={up * 0.4} mouth="smile" t={t} /><Desk /></>;
    }}</Scene>
    <T i={4}>{() => <H1>Your messages<br />are waiting.</H1>}</T>
    {/* 6. End card */}
    <Scene i={5}>{(t) => <Panda x={700} y={1030} s={0.5} eyes="closed" mouth="smile" t={t} />}</Scene>
    <T i={5} last top={600}>{() => <><H1 size={140}>Pomotto</H1>
      <div style={{ fontFamily: "Inter", fontWeight: 300, fontSize: 42, color: "#c8c8c8", marginTop: 24 }}>Free to try. $2.99 once for Pro.</div>
      <div style={{ fontFamily: "Inter", fontWeight: 300, fontSize: 36, color: DIM, marginTop: 14 }}>pomotto.app</div></>}</T>
  </AbsoluteFill>
);
