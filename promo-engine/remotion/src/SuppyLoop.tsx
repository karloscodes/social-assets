import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, continueRender, delayRender } from "remotion";
import { loadFont } from "@remotion/fonts";
const h = delayRender("font");
loadFont({ family: "Inter", url: staticFile("fonts/Inter.ttf"), weight: "100 900" }).then(() => continueRender(h)).catch(() => continueRender(h));

export const LOOP = 450; // 15s @30
const C = { bg: "#f5f5f4", ink: "#1c1917", muted: "#57534e", accent: "#f97316", dark: "#ea580c", card: "#ffffff", line: "#e7e5e4" };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.22, 1, 0.36, 1);
const tw = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: E });
const TAU = Math.PI * 2;
const per = (f: number, n: number, ph = 0) => Math.sin((TAU * n * f) / LOOP + ph); // loop-safe oscillator

type Mail = { ini: string; name: string; subj: string; pitch: boolean; paid?: boolean };
const MAILS: Mail[] = [
  { ini: "GS", name: "Growth Studio", subj: "Quick question about your SEO", pitch: true },
  { ini: "LP", name: "Lee Park", subj: "How do I export my data?", pitch: false },
  { ini: "PX", name: "Partner Labs", subj: "Partnership opportunity 🚀", pitch: true },
  { ini: "AN", name: "Ana Nunes", subj: "Feature idea: dark mode", pitch: false },
  { ini: "DV", name: "DevShop Agency", subj: "We build apps 10x faster", pitch: true },
  { ini: "LG", name: "LeadGen Pro", subj: "5,000 leads for your SaaS", pitch: true },
  { ini: "DM", name: "Dana Moore", subj: "Charged twice this month", pitch: false, paid: true },
  { ini: "BL", name: "Backlink Hub", subj: "Guest post on your blog?", pitch: true },
];
const ARRIVE = (i: number) => 22 + i * 13;   // one new mail every ~0.43s
const T_SPAM = 150, T_TOP = 212, T_TEXT = 268, T_OUT = 372;

const Mascot: React.FC<{ f: number }> = ({ f }) => {
  const squint = interpolate(f, [T_SPAM - 6, T_SPAM + 4, T_SPAM + 40, T_SPAM + 50], [0, 1, 1, 0], cl);
  const joy = interpolate(f, [T_TOP + 10, T_TOP + 22, T_OUT - 10, T_OUT + 10], [0, 1, 1, 0], cl);
  const hop = Math.abs(per(f, 15)) * (4 + 10 * joy);
  const sq = 1 + 0.03 * per(f, 30, 1);
  const bp = (p: number) => { const d = Math.abs(f - p); return d < 3 ? d / 3 : 1; };
  const blink = Math.min(bp(60), bp(130), bp(300), bp(420));
  const ry = 16 * blink * (1 - 0.6 * squint);
  const look = interpolate(f, [T_SPAM - 4, T_SPAM + 6, T_SPAM + 40, T_SPAM + 50, T_TOP, T_TOP + 10, T_OUT, T_OUT + 20], [0, 1, 1, 0, 0, -0.6, -0.6, 0], cl) * 5;
  const lookY = interpolate(f, [T_TOP, T_TOP + 10, T_OUT, T_OUT + 20], [0, -3, -3, 0], cl);
  const arm = (x: number, ang: number) => <g transform={`translate(${x} 116) rotate(${ang})`}><path d="M0 0 L0 42" stroke={C.ink} strokeWidth={14} strokeLinecap="round" /><circle cx={0} cy={46} r={10} fill={C.ink} /></g>;
  const wave = joy * (-120 + 14 * per(f, 45));
  return (
    <svg width={230} height={253} viewBox="0 0 200 220" style={{ overflow: "visible", transform: `translateY(${-hop}px)` }}>
      <ellipse cx={100} cy={208} rx={58 - hop} ry={8} fill="rgba(28,25,23,0.16)" />
      <g transform={`translate(100 200) scale(${1 / sq} ${sq}) translate(-100 -200)`}>
        <rect x={64} y={176} width={22} height={26} rx={10} fill={C.ink} /><rect x={114} y={176} width={22} height={26} rx={10} fill={C.ink} />
        {arm(34, 25 + 4 * per(f, 10))}{arm(166, -25 + wave - 4 * per(f, 10))}
        <rect x={28} y={50} width={144} height={134} rx={40} fill={C.ink} />
        <path d="M46 70 L100 112 L154 70" fill="none" stroke={C.bg} strokeOpacity={0.22} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        {[76, 124].map((cx) => <g key={cx}>
          <ellipse cx={cx} cy={128} rx={15} ry={Math.max(1.5, ry)} fill={C.bg} />
          {ry > 5 && <><circle cx={cx + look} cy={130 + lookY} r={7.5} fill={C.ink} /><circle cx={cx + look + 3} cy={126 + lookY} r={2.5} fill="#fff" /></>}
        </g>)}
        <circle cx={58} cy={150} r={7} fill={C.accent} opacity={0.4 + 0.4 * joy} /><circle cx={142} cy={150} r={7} fill={C.accent} opacity={0.4 + 0.4 * joy} />
        <path d={`M88 ${152 - 2 * squint} Q100 ${162 + 8 * joy - 8 * squint} 112 ${152 - 2 * squint}`} stroke={C.bg} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform={`translate(160 54) scale(${1 + 0.12 * Math.max(0, per(f, 25))})`}><circle r={19} fill={C.bg} /><circle r={14} fill={C.accent} /></g>
      </g>
    </svg>
  );
};

export const SuppyLoop: React.FC = () => {
  const f = useCurrentFrame();
  const out = tw(f, T_OUT, T_OUT + 50);          // everything resets
  const ROW = 106, TOP = 236;
  const keep = MAILS.map((m, i) => i).filter((i) => !MAILS[i].pitch);
  const spamCount = (out > 0.5 ? 0 : Math.round(interpolate(f, [T_SPAM, T_SPAM + 40], [0, 5], cl)));
  const topPos = tw(f, T_TOP, T_TOP + 26);
  const top = topPos * (1 - out);
  const textIn = tw(f, T_TEXT, T_TEXT + 22) * (1 - tw(f, T_OUT - 10, T_OUT + 20));
  const cardH = interpolate(top, [0, 1], [1110, 1110]);
  const nNew = MAILS.filter((_, i) => f >= ARRIVE(i)).length * (f < T_SPAM ? 1 : 0);
  const pitchExit = (i: number) => { const k = MAILS.slice(0, i).filter((m) => m.pitch).length; return tw(f, T_SPAM + k * 6, T_SPAM + k * 6 + 26); };
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: "Inter", color: C.ink }}>
      {/* soft drifting glow */}
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: 90 + 60 * per(f, 1), top: 180 + 40 * per(f, 1, 1.5),
        background: "radial-gradient(circle, rgba(249,115,22,0.13), rgba(249,115,22,0) 65%)" }} />
      {/* app window */}
      <div style={{ position: "absolute", left: 70, top: 200 - 20 * top, width: 940, height: cardH, background: C.card, borderRadius: 40,
        boxShadow: "0 40px 90px rgba(28,25,23,0.13), 0 2px 0 rgba(28,25,23,0.05)", overflow: "hidden" }}>
        <div style={{ height: 120, display: "flex", alignItems: "center", padding: "0 44px", gap: 18, borderBottom: `2px solid ${C.line}` }}>
          <img src={staticFile("suppyhq/logo.svg")} style={{ width: 52, height: 52 }} />
          <div style={{ fontSize: 40, fontWeight: 800 }}>Inbox</div>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.muted, marginLeft: 6, opacity: nNew ? 1 : 0.0 }}>{nNew} new</div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999,
            background: spamCount ? "#fff7ed" : "#f5f5f4", border: `2px solid ${spamCount ? C.accent : C.line}`,
            transform: `scale(${1 + 0.08 * Math.max(0, Math.sin(Math.min(1, Math.max(0, (f - T_SPAM) / 60)) * Math.PI * 5)) * (f < T_SPAM + 60 ? 1 : 0)})` }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: C.muted }}>Spam</span>
            <span style={{ fontSize: 30, fontWeight: 800, color: spamCount ? C.dark : C.muted, minWidth: 20 }}>{spamCount}</span>
          </div>
        </div>
        {/* section label */}
        <div style={{ position: "absolute", top: 150, left: 44, fontSize: 26, fontWeight: 800, letterSpacing: 2, color: C.dark, opacity: top }}>CAN'T WAIT</div>
        <div style={{ position: "absolute", top: 150, left: 44, fontSize: 26, fontWeight: 800, letterSpacing: 2, color: C.muted, opacity: tw(f, 20, 40) * (1 - top) * (1 - out) }}>NEEDS YOU</div>
        {MAILS.map((m, i) => {
          const a = tw(f, ARRIVE(i), ARRIVE(i) + 16) * (1 - out);
          if (a <= 0) return null;
          // slot: newest on top while arriving
          const arrivedAfter = MAILS.filter((_, j) => j > i && f >= ARRIVE(j)).length;
          let slot = arrivedAfter;
          let x = 0, rot = 0, op = a;
          if (m.pitch) { const e = pitchExit(i); x = 1100 * e; rot = 8 * e; op *= 1 - e; }
          else {
            const kIdx = keep.indexOf(i);
            const compact = tw(f, T_SPAM + 20, T_SPAM + 50);
            const settled = m.paid ? 2 : kIdx === 0 ? 1 : 0; // before rise: Dana last of real ones? order newest first
            const order = interpolate(compact, [0, 1], [slot, settled]);
            slot = interpolate(topPos, [0, 1], [order, 0]);
            if (!m.paid) slot = interpolate(topPos, [0, 1], [order, settled + 1]);
          }
          const paidH = m.paid ? top : 0;
          const y = TOP - 10 + slot * ROW + (slot > 0.5 && !m.paid ? 150 * topPos : 0) - 40 * (1 - a);
          return (
            <div key={i} style={{ position: "absolute", left: 30 + x, top: y, width: 880, height: 94 + 160 * (m.paid ? topPos : 0), transform: `rotate(${rot}deg) scale(${0.96 + 0.04 * a})`, opacity: op,
              borderRadius: 26, padding: "0 26px", display: "flex", flexDirection: "column", justifyContent: "flex-start",
              background: paidH ? `rgba(255,247,237,${paidH})` : "#fff", border: `${2 + paidH}px solid ${paidH > 0.4 ? C.accent : C.line}`,
              boxShadow: paidH ? `0 ${24 * paidH}px ${50 * paidH}px rgba(234,88,12,${0.22 * paidH})` : "none", zIndex: m.paid ? 5 : 1, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22, height: 94 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", flex: "none", background: m.paid ? "#ffedd5" : m.pitch ? "#f5f5f4" : "#e7e5e4",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: m.pitch ? "#a8a29e" : C.ink }}>{m.ini}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 750, color: m.pitch ? C.muted : C.ink }}>{m.name}</div>
                  <div style={{ fontSize: 26, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.subj}</div>
                </div>
                {m.paid && <div style={{ padding: "8px 18px", borderRadius: 999, background: C.dark, color: "#fff", fontSize: 24, fontWeight: 800,
                  transform: `scale(${interpolate(f, [T_TOP + 14, T_TOP + 24, T_TOP + 30], [0, 1.15, 1], cl) * (1 - out)})` }}>Paid</div>}
              </div>
              {m.paid && <div style={{ display: "flex", gap: 14, opacity: tw(f, T_TOP + 18, T_TOP + 34) * (1 - out), paddingLeft: 86, marginTop: 6 }}>
                {[["Plan", "Acme Pro"], ["Recurring", "$19/mo"], ["Lifetime", "$66"]].map(([k, v], j) => (
                  <div key={k} style={{ padding: "12px 20px", borderRadius: 18, background: "#fff", border: `2px solid ${C.line}`,
                    transform: `translateY(${20 * (1 - tw(f, T_TOP + 18 + j * 5, T_TOP + 36 + j * 5))}px)` }}>
                    <div style={{ fontSize: 20, color: C.muted, fontWeight: 600 }}>{k}</div>
                    <div style={{ fontSize: 30, fontWeight: 800 }}>{v}</div>
                  </div>))}
              </div>}
            </div>);
        })}
      </div>
      {/* on-screen line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, textAlign: "center", opacity: textIn, transform: `translateY(${30 * (1 - textIn)}px)` }}>
        <div style={{ fontSize: 66, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.12 }}>Pitches out.<br /><span style={{ color: C.dark }}>Paying customers on top.</span></div>
        <div style={{ marginTop: 26, fontSize: 40, fontWeight: 700, color: C.muted }}>suppyhq.com</div>
      </div>
      <div style={{ position: "absolute", right: 90, bottom: 190 }}><Mascot f={f} /></div>
    </AbsoluteFill>
  );
};
