import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile, continueRender, delayRender } from "remotion";
import { loadFont } from "@remotion/fonts";
const h = delayRender("font");
Promise.all([loadFont({ family: "Inter", url: staticFile("fonts/Inter.ttf"), weight: "100 900" }),
  loadFont({ family: "Plex", url: staticFile("fonts/IBMPlexMono-Medium.ttf"), weight: "500" })]).then(() => continueRender(h)).catch(() => continueRender(h));

export const LOOP2 = 450;
// suppyhq.com .dark palette
const C = { bg0: "rgb(12,10,9)", bg1: "rgb(26,22,20)", surf: "rgb(33,29,26)", line: "rgb(59,53,49)", text: "rgb(237,233,226)",
  muted: "rgb(173,163,151)", dim: "rgb(123,115,107)", or: "#f97316", orD: "#ea580c", or50: "rgb(67,32,16)", or700: "rgb(252,177,126)" };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.32, 0.72, 0, 1);
const tw = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: E });
const ES = Easing.bezier(0.45, 0, 0.55, 1);
const ts = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: ES });

type M = { id: string; ini: string; av: string; name: string; subj: string; pitch?: boolean; meta?: string; wait: string; paid?: boolean; arrive: number };
// newest on top. PA & Ben present at start; PB, Hannah, PC arrive.
const MAILS: M[] = [
  { id: "pa", ini: "GS", av: "rgb(68,64,60)", name: "Growth Studio", subj: "Quick question about your SEO", pitch: true, wait: "1h", arrive: -1 },
  { id: "ben", ini: "BC", av: "#fecdd3", name: "Ben Carter", subj: "Refund for the last cycle?", meta: "Stripe", wait: "1d", arrive: -1 },
  { id: "pb", ini: "PL", av: "rgb(68,64,60)", name: "Partner Labs", subj: "Partnership opportunity", pitch: true, wait: "now", arrive: 12 },
  { id: "hw", ini: "HW", av: "#bae6fd", name: "Hannah Weber", subj: "Charged twice this month", meta: "Polar", wait: "now", paid: true, arrive: 40 },
  { id: "pc", ini: "LG", av: "rgb(68,64,60)", name: "LeadGen Pro", subj: "5,000 leads for your SaaS", pitch: true, wait: "now", arrive: 68 },
];
const T_DROP = 108, T_RISE = 170, T_PUSH = 200, T_PULL = 320, T_LINE = 318, T_RESET = 390;
const ROW = 210, LIST_Y = 390, PX = 40, PW = 1000;

export const SuppyLoop2: React.FC = () => {
  const f = useCurrentFrame();
  const reset = ts(f, T_RESET, T_RESET + 50);
  const rise = tw(f, T_RISE, T_RISE + 34) * (1 - reset);
  const hold = tw(f, T_RISE + 20, T_RISE + 44) * (1 - tw(f, T_RESET - 10, T_RESET + 20));
  // slots
  const arrived = (m: M) => m.arrive < 0 || f >= m.arrive;
  const slotOf = (m: M): number => {
    // stacking: count arrived mails newer than m (later in array)
    const idx = MAILS.indexOf(m);
    let s = 0;
    for (let j = idx + 1; j < MAILS.length; j++) { const n = MAILS[j]; const a = n.arrive < 0 ? 1 : tw(f, n.arrive, n.arrive + 18);
      const gone = n.pitch && n.id !== "pa" ? tw(f, T_DROP + 6, T_DROP + 46) : n.id === "hw" ? 0 : 0; s += a * (1 - gone); }
    if (m.id === "pa") s *= 1; // pa leaves too
    return s;
  };
  let spam = 0;
  const pitchDrop = (m: M) => { const k = ["pc", "pb", "pa"].indexOf(m.id); return interpolate(f, [T_DROP + k * 9, T_DROP + k * 9 + 30], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) }); };
  ["pc", "pb", "pa"].forEach((id) => { if (pitchDrop(MAILS.find((m) => m.id === id)!) >= 1) spam++; });
  const spamShown = f >= T_RESET + 25 ? 0 : spam;
  // camera on Hannah's row (slot 0 after rise)
  const push = ts(f, T_PUSH, T_PULL) * (1 - ts(f, T_PULL, T_PULL + 45));
  const scale = 1 + 0.22 * push;
  const focusY = LIST_Y + ROW / 2 + 40;
  const camY = -260 * push * 0 ;
  const spamY = 160 + 1520 - 140;
  const lineIn = tw(f, T_LINE + 20, T_LINE + 50) * (1 - ts(f, T_RESET, T_RESET + 30));
  return (
    <AbsoluteFill style={{ fontFamily: "Inter", color: C.text, background: `radial-gradient(120% 80% at 50% 25%, rgb(44,36,30) 0%, ${C.bg1} 45%, ${C.bg0} 100%)` }}>
      <div style={{ position: "absolute", width: 1100, height: 700, left: -10, top: 300 + 40 * Math.sin((f / LOOP2) * Math.PI * 2), borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(234,88,12,0.10), rgba(234,88,12,0))", filter: "blur(20px)" }} />
      <AbsoluteFill style={{ transform: `translateY(${-120 * push}px) scale(${scale})`, transformOrigin: `50% ${focusY}px` }}>
        {/* window */}
        <div style={{ position: "absolute", left: PX, top: 160, width: PW, height: 1520, borderRadius: 44, background: C.surf,
          boxShadow: "0 60px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ height: 96, display: "flex", alignItems: "center", gap: 14, padding: "0 36px", borderBottom: `1px solid ${C.line}` }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c, opacity: 0.85 }} />)}
            <div style={{ marginLeft: 24, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.text, color: C.bg1, fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>S
                <div style={{ position: "absolute", right: -5, top: -5, width: 14, height: 14, borderRadius: 7, background: C.or, border: `3px solid ${C.surf}` }} /></div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>SuppyHQ</div>
            </div>
          </div>
          <div style={{ padding: "34px 44px 0", display: "flex", alignItems: "baseline" }}>
            <div style={{ fontSize: 58, fontWeight: 750, letterSpacing: -1 }}>Needs you</div>
          </div>
          {/* section label */}
          <div style={{ position: "absolute", left: 44, top: 196, fontSize: 28, fontWeight: 700, letterSpacing: 2.5, color: C.or, opacity: rise }}>CAN'T WAIT</div>
          <div style={{ position: "absolute", left: 44, top: 196, fontSize: 28, fontWeight: 700, letterSpacing: 2.5, color: C.dim, opacity: 1 - rise }}>INBOX</div>
          {/* spam tray */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, borderTop: `1px solid ${C.line}`, background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", padding: "0 44px", gap: 20 }}>
            <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2} strokeLinecap="round"><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" /></svg>
            <div style={{ fontSize: 40, fontWeight: 650, color: C.muted }}>Spam</div>
            <div style={{ marginLeft: "auto", fontSize: 40, fontWeight: 800, minWidth: 64, height: 64, borderRadius: 32, padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "center",
              background: spamShown ? C.or50 : "rgba(255,255,255,0.06)", color: spamShown ? C.or700 : C.dim,
              transform: `scale(${1 + 0.18 * Math.max(...["pc", "pb", "pa"].map((id, k) => { const d = f - (T_DROP + k * 9 + 30); return d >= 0 && d < 10 ? Math.sin((d / 10) * Math.PI) : 0; }))})` }}>{spamShown}</div>
          </div>
        </div>
        {MAILS.map((m) => {
          const a = m.arrive < 0 ? 1 : tw(f, m.arrive, m.arrive + 20) * (1 - (m.id === "hw" || m.pitch ? reset : 0));
          let y = LIST_Y + slotOf(m) * ROW - (m.arrive < 0 ? 0 : 60 * (1 - tw(f, m.arrive, m.arrive + 20)));
          let op = a, sc = 1, rot = 0;
          if (m.pitch) {
            const d = pitchDrop(m);
            // pa re-enters on reset
            y = y + (spamY + 60 - y) * d; sc = 1 - 0.75 * d; rot = -6 * d; op = (m.id === "pa" ? 1 : a) * (1 - interpolate(d, [0.7, 1], [0, 1], cl));
            if (m.id === "pa") { const back = tw(f, T_RESET + 10, T_RESET + 55); if (f > T_RESET) { op = back; y = LIST_Y + ROW * (1 - 0) + 0 - 40 * (1 - back) + ROW * 0; sc = 1; rot = 0; y = LIST_Y + ROW + 86 * hold - 40 * (1 - back); } }
          }
          if (m.id === "ben") { const r = tw(f, T_RESET + 10, T_RESET + 55); y = LIST_Y + interpolate(rise + 0 * r, [0, 1], [slotOf(m), 1]) * ROW; if (f > T_RESET) y = LIST_Y + interpolate(r, [0, 1], [1, 0]) * ROW + ROW * (f > T_RESET ? 0 : 0); }
          if (m.id === "ben" && f > T_RESET) { const r = tw(f, T_RESET + 10, T_RESET + 55); y = LIST_Y + ROW * (1 - r) + ROW * r * 0; y = LIST_Y + ROW * (1 - r); }
          if (m.id === "ben") y += 86 * hold * (f > T_RESET ? 1 - tw(f, T_RESET + 10, T_RESET + 55) : 1);
          if (m.paid) { y = LIST_Y + interpolate(rise, [0, 1], [slotOf(m), 0]) * ROW - 0; if (f > T_RESET) { y = LIST_Y - 80 * reset; } }
          const hl = m.paid ? rise : 0;
          return (
            <div key={m.id} style={{ position: "absolute", left: PX, width: PW, top: y, height: ROW + (m.paid ? 86 * hold : 0), opacity: op, transform: `scale(${sc * (m.paid ? 1 + 0.02 * hold : 1)}) rotate(${rot}deg)`,
              zIndex: m.paid ? 5 : 2, display: "flex", alignItems: "center", gap: 28, padding: "0 44px",
              background: hl ? `rgba(67,32,16,${0.9 * hl})` : C.surf, borderTop: `1px solid ${C.line}`, boxShadow: hl ? `inset 8px 0 0 ${C.or}, 0 20px 50px rgba(0,0,0,${0.45 * hl})` : "none", borderRadius: 18 * hl }}>
              <div style={{ width: 112, height: 112, borderRadius: 56, background: m.av, flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 38, fontWeight: 750, color: m.pitch ? C.muted : "#1c1917" }}>{m.ini}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: 50, fontWeight: 700, color: m.pitch ? C.muted : C.text }}>{m.name}</div>
                  {m.paid && <div style={{ fontSize: 40, color: C.or }}>★</div>}
                  <div style={{ marginLeft: "auto", fontSize: 32, color: C.dim }}>{m.wait}</div>
                </div>
                <div style={{ fontSize: 45, marginTop: 6, color: m.pitch ? C.dim : C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.subj}</div>
                {m.paid && <div style={{ display: "flex", gap: 14, marginTop: 14, height: 64 * hold + 0.01, opacity: hold, overflow: "hidden" }}>
                  {[["Paid", true], ["Acme Analytics", false], ["$49/mo", false]].map(([t, p], j) => (
                    <div key={t as string} style={{ fontSize: 36, fontWeight: p ? 800 : 600, padding: "8px 20px", borderRadius: 12, background: p ? C.orD : "rgba(255,255,255,0.08)", color: p ? "#fff" : C.text,
                      fontFamily: (t as string).includes("$") ? "Plex" : "Inter", transform: `translateY(${16 * (1 - tw(f, T_RISE + 22 + j * 5, T_RISE + 42 + j * 5))}px)` }}>{t}</div>))}
                </div>}
              </div>
            </div>);
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1020, textAlign: "center", opacity: lineIn, transform: `translateY(${40 * (1 - lineIn)}px)` }}>
        <div style={{ fontSize: 82, fontWeight: 850, letterSpacing: -2, lineHeight: 1.08 }}>Pitches out.<br /><span style={{ color: C.or }}>Paying customers on top.</span></div>
        <div style={{ marginTop: 28, fontSize: 46, fontWeight: 600, color: C.muted }}>suppyhq.com</div>
      </div>
    </AbsoluteFill>
  );
};
