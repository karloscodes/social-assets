import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../types";
import { Square } from "../scenes/common";
import { sp, clamp, ease, cue } from "../util";

/** "It knows who paid you": an email card, a Stripe/Polar customer panel slides in next to it,
 *  then a failing payment jumps to the top of the inbox on its own. Read-only badge at the end.
 *  spec: customer {initials,name,email,status,plan,recurring,ltv,since}, rows[] (inbox subjects), failing (row label), readOnly (badge text) */
export const DiagramPaid: React.FC<SceneProps> = ({ spec, brand, words, u, stageW, stageH, durationInFrames }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const C = brand.colors;
  const cu = spec.customer ?? {};
  const tCard = 2;
  const tPanel = cue(words, fps, "plan", 40) - 8;
  const tLtv = cue(words, fps, "lifetime", tPanel + 18) - 4;
  const tFail = cue(words, fps, "failing", tPanel + 70) - 4;
  const tJump = cue(words, fps, spec.jumpCue ?? "up", tFail + 16) - 8;
  const tLock = Math.min(tJump + 14, durationInFrames - 40);
  const red = "#dc2626";
  const card = (s: React.CSSProperties): React.CSSProperties => ({ position: "absolute", background: "#fff", border: `${u * 0.45}px solid ${C.ink}`, borderRadius: u * 3,
    boxShadow: `${u}px ${u}px 0 ${C.ink}`, ...s });
  const e = sp(f, fps, tCard);
  const p = sp(f, fps, tPanel, { damping: 13, stiffness: 130 });
  const ltvRaw = Number(String(cu.ltv ?? "$66").replace(/[^\d]/g, "")) || 66;
  const ltv = Math.round(interpolate(f, [tLtv, tLtv + 20], [0, ltvRaw], clamp));
  // inbox: failing row starts last and jumps to first
  const rows: string[] = spec.rows ?? ["How do I export my data?", "Feature idea: dark mode"];
  const n = rows.length + 1, rowH = 9.6;
  const j = sp(f, fps, tJump, { damping: 12, stiffness: 140 });
  const list = sp(f, fps, tFail - 10);
  const lock = sp(f, fps, tLock, { damping: 10 });
  const glow = f > tJump ? 0.5 + 0.5 * Math.sin((f - tJump) / 4) : 0;
  const row = (y: number, content: React.ReactNode, hot = false, key?: React.Key) => (
    <div key={key} style={{ position: "absolute", left: "6%", right: "6%", top: `${y}%`, height: `${rowH - 1.8}%`, background: hot ? "#fef2f2" : "#fff",
      border: `${u * 0.35}px solid ${hot ? red : "#d6d3d1"}`, borderRadius: u * 2, display: "flex", alignItems: "center", gap: u * 2, padding: `0 ${u * 2.4}px`,
      boxShadow: hot ? `0 0 ${u * 3 * glow}px rgba(220,38,38,0.45)` : "none", zIndex: hot ? 2 : 1 }}>{content}</div>
  );
  const listTop = 55;
  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      {/* email card (example) */}
      <div style={card({ left: "1%", top: "4%", width: "50%", padding: u * 3, transform: `scale(${e}) rotate(-2deg)`, transformOrigin: "0 0" })}>
        <div style={{ display: "flex", alignItems: "center", gap: u * 2 }}>
          <div style={{ flex: "none", width: u * 8.5, height: u * 8.5, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: u * 3.4, fontWeight: 800 }}>{cu.initials ?? "SC"}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: u * 4.2, fontWeight: 800, whiteSpace: "nowrap" }}>{cu.name ?? "Sarah Chen"}</div>
            <div style={{ fontSize: u * 2.8, fontWeight: 600, color: C.muted, whiteSpace: "nowrap" }}>{cu.email ?? "sarah@acme.com"}</div>
          </div>
        </div>
        {[0.95, 0.8, 0.6].map((w, i) => <div key={i} style={{ height: u * 2, borderRadius: u, background: "#e7e5e4", marginTop: u * 2,
          width: `${100 * w * ease(f, tCard + 8 + i * 4, tCard + 18 + i * 4)}%` }} />)}
        <div style={{ position: "absolute", left: u * 3, bottom: -u * 3.2, background: C.bg, border: `${u * 0.3}px solid #d6d3d1`, color: C.muted, fontSize: u * 2.4,
          fontWeight: 800, letterSpacing: u * 0.2, padding: `${u * 0.3}px ${u * 1.4}px`, borderRadius: u }}>EXAMPLE</div>
      </div>
      {/* customer panel slides in from the right */}
      <div style={card({ right: "1%", top: "1%", width: "45%", padding: u * 2.6, borderColor: C.accentDark, boxShadow: `${u}px ${u}px 0 ${C.accentDark}`, background: "#fff7ed",
        transform: `translateX(${(1 - p) * u * 60}px) rotate(${2 * p}deg)`, opacity: Math.min(1, p * 2) })}>
        <div style={{ fontSize: u * 2.7, fontWeight: 800, color: C.accentDark, letterSpacing: u * 0.15 }}>STRIPE · POLAR</div>
        <div style={{ display: "inline-block", marginTop: u * 1.4, background: "#dcfce7", color: "#166534", fontSize: u * 3, fontWeight: 800, padding: `${u * 0.5}px ${u * 1.6}px`, borderRadius: u * 2,
          transform: `scale(${sp(f, fps, tPanel + 10, { damping: 9 })})` }}>● {cu.status ?? "Active subscriber"}</div>
        {[["Plan", cu.plan ?? "Acme Pro", tPanel + 12], ["Recurring", cu.recurring ?? "$19/mo", tPanel + 16], ["Lifetime value", `$${ltv}`, tLtv]].map(([k, val, d], i) => (
          <div key={i} style={{ marginTop: u * 1.5, opacity: ease(f, d as number, (d as number) + 8), transform: `translateX(${(1 - ease(f, d as number, (d as number) + 10)) * u * 6}px)` }}>
            <div style={{ fontSize: u * 2.5, fontWeight: 700, color: C.muted }}>{k}</div>
            <div style={{ fontSize: i === 2 ? u * 6 : u * 4, fontWeight: 850, color: i === 2 ? C.accentDark : C.ink, lineHeight: 1.1 }}>{val}</div>
          </div>
        ))}
      </div>
      {/* inbox list: failing payment jumps to the top */}
      <div style={{ position: "absolute", left: "6%", top: `${listTop - 6}%`, fontSize: u * 3.2, fontWeight: 800, letterSpacing: u * 0.3, color: C.accentDark, opacity: list }}>INBOX</div>
      <div style={{ position: "absolute", right: "6%", top: `${listTop - 6.4}%`, fontSize: u * 3, fontWeight: 800, color: "#fff", background: red, padding: `${u * 0.4}px ${u * 1.6}px`,
        borderRadius: u * 1.6, transform: `scale(${sp(f, fps, tJump + 10, { damping: 8 })})` }}>Can't wait</div>
      <div style={{ position: "absolute", inset: 0, opacity: list, transform: `translateY(${(1 - list) * u * 8}px)` }}>
        {rows.map((r, i) => row(listTop + (i + j) * rowH,
          <><span style={{ width: u * 2.2, height: u * 2.2, borderRadius: "50%", background: "#d6d3d1", flex: "none" }} />
            <span style={{ fontSize: u * 3.5, fontWeight: 650, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r}</span></>, false, i))}
        {row(listTop + (n - 1) * rowH * (1 - j) - Math.sin(j * Math.PI) * 4,
          <><span style={{ width: u * 2.6, height: u * 2.6, borderRadius: "50%", background: red, flex: "none" }} />
            <span style={{ fontSize: u * 3.7, fontWeight: 800, color: red, whiteSpace: "nowrap" }}>{spec.failing ?? "Failing payment"}</span>
            <span style={{ marginLeft: "auto", fontSize: u * 2.8, fontWeight: 700, color: C.muted, whiteSpace: "nowrap" }}>{cu.plan ?? "Acme Pro"}</span></>, true, "fail")}
      </div>
      {/* read-only badge */}
      <div style={{ position: "absolute", left: "50%", top: "86.5%", transform: `translateX(-50%) scale(${lock})`, background: C.ink, color: "#fff", fontSize: u * 3.3, fontWeight: 750,
        padding: `${u * 1.1}px ${u * 2.8}px`, borderRadius: u * 2, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: u * 1.4 }}>
        <svg viewBox="0 0 40 44" width={u * 3.4} height={u * 3.8}><path d="M11 20 V13 a9 9 0 0 1 18 0 V20" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
          <rect x={5} y={19} width={30} height={23} rx={6} fill={C.accent} /></svg>
        {spec.readOnly ?? "Read-only keys · can't charge or refund"}
      </div>
    </Square>
  );
};
