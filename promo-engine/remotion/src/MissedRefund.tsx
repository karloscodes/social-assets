import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
// SuppyHQ house style (matched to published v4e): warm dark, white rounded-square mascot, orange #ea580c
const O = "#ea580c", BG = "#151311", CARD = "#1f1c1a", LINE = "rgba(255,255,255,0.10)", TXT = "#f5f5f4", MUTED = "#a8a29e";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ES = Easing.bezier(0.45, 0, 0.55, 1);
const ts = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: ES });
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const FONT = "Inter, system-ui, sans-serif";
// beats: 4.5s, 4.5s, 4.5s, 4.5s, 5s
const B = [0, 135, 270, 405, 540];
export const MR_LEN = 690;

const Mascot: React.FC<{ s: number; f: number; happy?: number }> = ({ s, f, happy = 0 }) => {
  const blink = [60, 110].some((b) => Math.abs((f % 140) - b) < 3) ? 0.15 : 1;
  return <div style={{ position: "relative", width: s, height: s * 0.86 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: s * 0.3, background: "#fff" }} />
    {[0.36, 0.64].map((x) => happy > 0.5
      ? <svg key={x} style={{ position: "absolute", left: s * x - s * 0.07, top: s * 0.36, width: s * 0.14, height: s * 0.08 }} viewBox="0 0 14 8"><path d="M1 7 Q7 -1 13 7" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
      : <div key={x} style={{ position: "absolute", left: s * x - s * 0.04, top: s * 0.34, width: s * 0.08, height: s * 0.13 * blink, borderRadius: s, background: "#111" }} />)}
    <div style={{ position: "absolute", right: -s * 0.06, top: -s * 0.06, width: s * 0.26, height: s * 0.26, borderRadius: s, background: O, border: `${s * 0.035}px solid #151311` }} />
  </div>;
};
const Logo: React.FC<{ s: number }> = ({ s }) => <div style={{ position: "relative", width: s, height: s, borderRadius: s * 0.28, background: "#e7e5e4", color: "#1c1917", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: s * 0.5 }}>s
  <div style={{ position: "absolute", right: -s * 0.08, top: -s * 0.08, width: s * 0.36, height: s * 0.36, borderRadius: s, background: O, border: `${s * 0.05}px solid #151311` }} /></div>;

type Row = { av: string; name: string; sub: string; when: string; pitch: boolean };
const ROWS: Row[] = [
  { av: "GR", name: "Growth Rank SEO", sub: "Rank your app first on Google", when: "Mon", pitch: true },
  { av: "JK", name: "“Security researcher”", sub: "I found a bug in your app. Bounty?", when: "Sun", pitch: true },
  { av: "LB", name: "LinkBoost Agency", sub: "Guest posts for your SaaS", when: "Sun", pitch: true },
  { av: "CX", name: "CoinX Partners", sub: "Accept crypto in your app", when: "Sat", pitch: true },
  { av: "WP", name: "Webinar Pro", sub: "Free growth webinar for founders", when: "Fri", pitch: true },
  { av: "LD", name: "Lifetime Deals Co", sub: "List your app as a lifetime deal", when: "Fri", pitch: true },
  { av: "ML", name: "Maria L.", sub: "Can I get a refund on my Pro plan?", when: "3 days ago", pitch: false },
];
const RH = 150;

const Cap: React.FC<{ f: number; a: number; b: number; children: React.ReactNode }> = ({ f, a, b, children }) => {
  const o = ts(f, a, a + 18) * (1 - ts(f, b - 14, b));
  return <div style={{ position: "absolute", left: 80, width: 840, top: 330, fontSize: 86, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.06, opacity: o, transform: `translateY(${(1 - ts(f, a, a + 22)) * 30}px)` }}>{children}</div>;
};
const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: O }}>{children}</span>;

export const MissedRefund: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = lerp(0, RH * 2, ts(f, B[1] - 10, B[2] - 20)) + lerp(0, RH * 1, ts(f, B[2] - 10, B[2] + 30));
  const re = ts(f, B[3] + 10, B[3] + 60); // reorder into SuppyHQ
  const focus = ts(f, B[2] + 20, B[2] + 45);
  const cardO = ts(f, 0, 16) * (1 - ts(f, B[4] - 10, B[4] + 10));
  const endO = ts(f, B[4] + 8, B[4] + 36) * (1 - ts(f, MR_LEN - 16, MR_LEN - 1));
  const count = 63;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 40%, #2a2420 0%, ${BG} 65%)`, color: TXT, fontFamily: FONT, overflow: "hidden" }}>
      <Cap f={f} a={-20} b={B[1]}>Monday morning.<br /><Hi>{count}</Hi> support emails.</Cap>
      <Cap f={f} a={B[1]} b={B[2]}>Most of them aren’t <Hi>customers.</Hi></Cap>
      <Cap f={f} a={B[2]} b={B[3]}>At the bottom: a refund. <Hi>3 days ago.</Hi></Cap>
      <Cap f={f} a={B[3]} b={B[4]}>In SuppyHQ: paying customer <Hi>on top.</Hi></Cap>
      {/* inbox card */}
      <div style={{ position: "absolute", left: 80, width: 840, top: 720, height: 712, borderRadius: 36, background: CARD, border: `2px solid ${LINE}`, overflow: "hidden", opacity: cardO, boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}>
        <div style={{ height: 96, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px", borderBottom: `2px solid ${LINE}`, fontSize: 36, fontWeight: 700 }}>
          <div style={{ position: "relative" }}>
            <span style={{ opacity: 1 - Math.min(1, re / 0.45) }}>support@yourapp.com</span>
            <span style={{ position: "absolute", left: 0, top: 0, opacity: Math.max(0, (re - 0.55) / 0.45), whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 14 }}><Logo s={44} />&nbsp;SuppyHQ</span>
          </div>
          <span style={{ background: "rgba(255,255,255,0.10)", padding: "6px 18px", borderRadius: 999, fontSize: 32, opacity: 1 - Math.min(1, re / 0.45) }}>{count}</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, bottom: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 34, top: 22, fontSize: 26, fontWeight: 700, letterSpacing: 2, color: O, opacity: Math.max(0, (re - 0.85) / 0.15) }}>CAN’T WAIT</div>
          <div style={{ position: "absolute", left: 34, top: 252, fontSize: 26, fontWeight: 700, letterSpacing: 2, color: MUTED, opacity: Math.max(0, (re - 0.85) / 0.15) }}>SPAM</div>
          {ROWS.map((r, i) => {
            const y0 = 10 + i * RH - scroll;
            const y1 = r.pitch ? 292 + i * 104 : 62;
            const y = lerp(y0, y1, re);
            const dim = r.pitch ? lerp(1, 0.38, Math.max(focus, re)) * (1 - 0.8 * Math.sin(Math.PI * re)) : 1;
            const hi = r.pitch ? 0 : focus;
            const small = r.pitch ? re : 0;
            return <div key={i} style={{ position: "absolute", zIndex: r.pitch ? 1 : 2, backgroundColor: r.pitch ? undefined : CARD, left: 20, right: 20, top: y, height: lerp(RH - 14, 92, small), display: "flex", alignItems: "center", gap: 22, padding: "0 18px", borderRadius: 24, opacity: dim,
              backgroundImage: hi ? `linear-gradient(rgba(234,88,12,${0.12 * hi}),rgba(234,88,12,${0.12 * hi}))` : "none", boxShadow: hi ? `inset 0 0 0 ${3 * hi}px ${O}` : "none" }}>
              <div style={{ width: lerp(76, 56, small), height: lerp(76, 56, small), borderRadius: 40, background: r.pitch ? "#3a3532" : "#7c2d12", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 26, flex: "none" }}>{r.av}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: lerp(36, 30, small), fontWeight: 700, display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>{r.name}
                  {!r.pitch && <span style={{ fontSize: 24, background: O, color: "#fff", padding: "4px 12px", borderRadius: 10, opacity: re }}>Paid · Pro · Stripe</span>}</div>
                <div style={{ fontSize: 30, color: MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: 1 - small }}>{r.sub}</div>
              </div>
              <div style={{ fontSize: 28, color: !r.pitch ? lerp(0, 1, focus) > 0.5 ? O : MUTED : MUTED, fontWeight: !r.pitch ? 700 : 400, whiteSpace: "nowrap" }}>{r.when}</div>
            </div>;
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 1450, fontSize: 26, color: MUTED, opacity: cardO * 0.8 }}>Example inbox and names</div>
      {/* end card */}
      <div style={{ position: "absolute", left: 80, width: 840, top: 380, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", opacity: endO }}>
        <div style={{ transform: `translateY(${(1 - ts(f, B[4] + 8, B[4] + 40)) * 30 + 6 * Math.sin(f / 20)}px)` }}><Mascot s={250} f={f} happy={ts(f, B[4] + 50, B[4] + 56)} /></div>
        <div style={{ marginTop: 70, display: "flex", alignItems: "center", gap: 28 }}><Logo s={120} /><span style={{ fontSize: 110, fontWeight: 700, letterSpacing: -3 }}>SuppyHQ</span></div>
        <div style={{ marginTop: 60, fontSize: 68, fontWeight: 800, letterSpacing: -2, lineHeight: 1.08 }}>Pitches out.<br /><Hi>Paying customers on top.</Hi></div>
        <div style={{ marginTop: 56, fontSize: 56, fontWeight: 700 }}>suppyhq.com</div>
        <div style={{ marginTop: 14, fontSize: 44, color: MUTED }}>$29/mo</div>
        <div style={{ marginTop: 30, fontSize: 36, color: MUTED }}>Free for the first 10 people who write in.</div>
      </div>
    </AbsoluteFill>
  );
};
