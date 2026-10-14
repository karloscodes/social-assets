import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../../types";
import { Square } from "../../scenes/common";
import { sp, clamp, ease, cue, rand } from "../../util";
import { pal, Win, Example, Wordmark, MONO, Pal, Check, AppChip } from "./kit";

/** The autofix loop as one pipeline across several scenes (fade between them so the header stays put).
 *  Header: a clock (night → morning) and a 4-node timeline (alert · investigate · fix + PR · ship + verify).
 *  spec.beat 1..4 lights its node and shows that beat's detail; beat 5 is the morning payoff (all nodes done).
 *  spec: beat, clock [from, to] ("HH:MM"), nodes [{label, steps}], plus per-beat fields (see each block) and cues {} */
const toMin = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const fmt = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`;

const Header: React.FC<{ P: Pal; u: number; f: number; beat: number; clock: [string, string]; nodes: { label: string; steps: string }[]; dur: number; clockEnd: number }> =
  ({ P, u, f, beat, clock, nodes, dur, clockEnd }) => {
  const m = interpolate(f, [6, clockEnd], [toMin(clock[0]), toMin(clock[1])], clamp);
  const day = m >= 6 * 60 && m < 20 * 60;
  const n = nodes.length;
  const prog = beat >= 5 ? 1 : interpolate(f, [0, 14], [Math.max(0, beat - 2), beat - 1], clamp) / (n - 1);
  const pulse = 0.5 + 0.5 * Math.sin(f / 4);
  return (
    <>
      <div style={{ position: "absolute", left: "2%", top: "0%", display: "flex", alignItems: "center", gap: u * 2, fontFamily: MONO }}>
        {day ? (
          <svg viewBox="0 0 40 40" width={u * 6} height={u * 6}><circle cx={20} cy={20} r={8} fill="#fbbf24" />
            {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2 + f / 40; return <line key={i} x1={20 + Math.cos(a) * 12} y1={20 + Math.sin(a) * 12} x2={20 + Math.cos(a) * 17} y2={20 + Math.sin(a) * 17} stroke="#fbbf24" strokeWidth={3} strokeLinecap="round" />; })}</svg>
        ) : (
          <svg viewBox="0 0 40 40" width={u * 6} height={u * 6}><path d="M26 6 A15 15 0 1 0 34 28 A12 12 0 0 1 26 6Z" fill={P.ink} opacity={0.9} /></svg>
        )}
        <span style={{ fontSize: u * 7.5, fontWeight: 700, color: P.ink, letterSpacing: -u * 0.2 }}>{fmt(m)}</span>
      </div>
      {/* timeline */}
      <div style={{ position: "absolute", left: "11%", right: "11%", top: "17%", height: u * 0.6, background: P.border, borderRadius: u }}>
        <div style={{ width: `${prog * 100}%`, height: "100%", background: P.acc, borderRadius: u }} />
      </div>
      {nodes.map((nd, i) => {
        const x = 11 + (78 * i) / (n - 1);
        const done = beat >= 5 || i < beat - 1 || (i === beat - 1 && f > dur - 10);
        const active = i === beat - 1 && beat < 5;
        const s = active ? sp(f, fps30, 2, { damping: 9 }) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: `${x}%`, top: "17.3%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: u * 4.2, height: u * 4.2, borderRadius: "50%", background: done ? P.acc : active ? P.bg : P.card,
              border: `${u * 0.5}px solid ${done || active ? P.acc : P.border}`, transform: `scale(${active ? 0.9 + 0.25 * s : 1})`,
              boxShadow: active ? `0 0 ${u * 3 * pulse}px ${P.acc}` : "none", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: MONO, fontSize: u * 2.2, fontWeight: 700, color: done ? P.onAcc : P.acc }}>{done ? <Check size={u * 3} color={P.onAcc} /> : null}</div>
            <div style={{ position: "absolute", top: u * 5.2, fontFamily: MONO, fontSize: u * 2.7, fontWeight: 700, whiteSpace: "nowrap",
              color: active ? P.acc : done ? P.ink : P.dim }}>{nd.label}</div>
            <div style={{ position: "absolute", top: u * 8.6, fontFamily: MONO, fontSize: u * 2.1, whiteSpace: "nowrap", color: P.dim }}>{nd.steps}</div>
          </div>
        );
      })}
    </>
  );
};
const fps30 = 30;

const Line: React.FC<{ P: Pal; u: number; o: number; a: React.ReactNode; b: React.ReactNode; err?: boolean; k?: number }> = ({ P, u, o, a, b, err, k = 1 }) => (
  <div style={{ opacity: o, transform: `translateX(${(1 - o) * u * 4}px)`, marginBottom: u * 1.3 * k }}>
    <div style={{ fontSize: u * 2.6 * k, color: P.dim, whiteSpace: "nowrap" }}>{a}</div>
    <div style={{ fontSize: u * 3.1 * k, color: err ? P.err : P.ink, whiteSpace: "nowrap" }}><span style={{ color: P.acc }}>→ </span>{b}</div>
  </div>
);

export const DiagramAutofix: React.FC<SceneProps> = ({ spec, brand, words, u, stageW, stageH, durationInFrames }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const P = pal(brand);
  const beat: number = spec.beat ?? 1;
  const cz = spec.cues ?? {};
  const c = (k: string, d: string, fb: number) => cue(words, fps, cz[k] ?? d, fb);
  const nodes = spec.nodes ?? [{ label: "alert", steps: "01 02" }, { label: "investigate", steps: "03" }, { label: "fix + PR", steps: "04 05" }, { label: "ship + verify", steps: "06 07 08" }];
  const top = 31; // detail area starts here (% of square)
  let detail: React.ReactNode = null;

  if (beat === 1) {
    // alert card → webhook packet → grok bot routine wakes
    const tA = Math.max(2, c("alert", "alert", 6) - 6), tW = c("webhook", "wakes", tA + 24) - 4, tB = c("bot", "routine", tW + 16) - 4;
    const a = sp(f, fps, tA, { damping: 12, stiffness: 150 });
    const w = ease(f, tW, tW + 18);
    const b = sp(f, fps, tB, { damping: 13 });
    const al = spec.alert ?? {};
    detail = (<>
      <div style={{ position: "absolute", left: "3%", top: `${top}%`, width: "94%", fontFamily: MONO, background: "#2a0f16", border: `${u * 0.3}px solid ${P.err}`,
        borderRadius: u * 1.4, padding: `${u * 2}px ${u * 2.6}px`, transform: `scale(${0.7 + 0.3 * a})`, opacity: Math.min(1, a * 1.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: u * 1.6 }}>
          <span style={{ background: P.err, color: "#fff", fontWeight: 700, fontSize: u * 2.7, padding: `${u * 0.3}px ${u * 1.2}px`, borderRadius: u * 0.5 }}>ALERT</span>
          <Wordmark P={P} size={u * 2.7} />
          {spec.appLogo ? <span style={{ marginLeft: "auto" }}><AppChip P={P} size={u * 2.9} name={spec.app ?? ""} logo={spec.appLogo} /></span> : null}
        </div>
        <div style={{ fontSize: u * 3.6, color: P.ink, fontWeight: 700, marginTop: u * 1.4, whiteSpace: "nowrap" }}>{al.title ?? "[shop-prod] Spike on /checkout"}</div>
        <div style={{ fontSize: u * 3.1, color: P.err, marginTop: u * 0.6 }}>{al.message ?? "8.1% errors, normally 1.0%"}</div>
      </div>
      {/* webhook link */}
      <div style={{ position: "absolute", left: "50%", top: `${top + 25}%`, height: "13%", width: u * 0.5, transform: "translateX(-50%)",
        background: `repeating-linear-gradient(${P.acc} 0 ${u * 1.2}px, transparent ${u * 1.2}px ${u * 2.2}px)`, opacity: ease(f, tW - 6, tW) }} />
      <div style={{ position: "absolute", left: "55%", top: `${top + 26.5}%`, fontFamily: MONO, fontSize: u * 3.2, color: P.acc, fontWeight: 700, opacity: ease(f, tW - 6, tW), whiteSpace: "nowrap" }}>
        webhook<div style={{ color: P.dim, fontWeight: 400, fontSize: u * 2.7 }}>{spec.webhookNote ?? "POST to the routine"}</div></div>
      {w > 0 && w < 1 ? <div style={{ position: "absolute", left: "50%", top: `${top + 25 + 13 * w}%`, transform: "translate(-50%,-50%)", width: u * 2.6, height: u * 2.6,
        borderRadius: "50%", background: P.acc, boxShadow: `0 0 ${u * 3}px ${P.acc}` }} /> : null}
      <Win P={P} u={u} title={spec.routine ?? "grok bot · routine lognorth-oncall"} border={f > tB + 6 ? P.acc : undefined}
        style={{ left: "3%", top: `${top + 40}%`, width: "94%", transform: `translateY(${(1 - b) * u * 10}px)`, opacity: Math.min(1, b * 1.5) }}>
        <div style={{ fontSize: u * 3.4, color: P.ink, whiteSpace: "nowrap" }}>
          <span style={{ color: P.acc }}>bot </span>{(spec.botLine ?? "on it. no one asked.").slice(0, Math.max(0, Math.floor((f - tB - 6) * 1.2)))}
        </div>
      </Win>
    </>);
  }

  if (beat === 2) {
    // MCP: tool calls come back one by one
    const tools: [string, string, boolean?][] = spec.tools ?? [];
    const keys = ["reads", "logs", "trace", "commit"];
    const ts = tools.map((_, i) => c(`t${i}`, keys[i] ?? "x", 10 + i * 20) - 4);
    const win = sp(f, fps, 0, { damping: 14 });
    detail = (<>
      <div style={{ position: "absolute", left: "3%", top: `${top}%`, display: "flex", alignItems: "center", gap: u * 2, fontFamily: MONO, opacity: win }}>
        <Wordmark P={P} size={u * 3.2} />
        <span style={{ width: u * 12, height: u * 0.5, background: `repeating-linear-gradient(90deg, ${P.acc} 0 ${u * 1.2}px, transparent ${u * 1.2}px ${u * 2.2}px)`,
          backgroundPositionX: `${-(f * 1.2) % (u * 2.2)}px` }} />
        <span style={{ fontSize: u * 3.2, fontWeight: 700, color: P.acc }}>MCP</span>
        <span style={{ fontSize: u * 2.6, color: P.dim }}>{spec.mcpNote ?? "read-only"}</span>
        <span style={{ width: u * 12, height: u * 0.5, background: `repeating-linear-gradient(90deg, ${P.acc} 0 ${u * 1.2}px, transparent ${u * 1.2}px ${u * 2.2}px)`,
          backgroundPositionX: `${(f * 1.2) % (u * 2.2)}px` }} />
        <span style={{ fontSize: u * 3.2, fontWeight: 700, color: P.ink }}>bot</span>
      </div>
      <Win P={P} u={u} title={spec.runTitle ?? "grok bot · investigating"} style={{ left: "3%", top: `${top + 8}%`, width: "94%", opacity: win }} border={P.acc}>
        {tools.map((t, i) => <Line key={i} P={P} u={u} k={spec.toolScale ?? 1} o={ease(f, ts[i], ts[i] + 8)} a={t[0]} b={t[1]} err={!!t[2]} />)}
      </Win>
    </>);
  }

  if (beat === 3) {
    // fix on a branch with a test, then the PR with evidence
    const tF = Math.max(2, c("fix", "fix", 8) - 6), tT = c("test", "test", tF + 20) - 4, tP = c("pr", "pull", tT + 20) - 6, tE = c("ev", "evidence", tP + 20) - 4;
    const d = sp(f, fps, tF, { damping: 13 }); const p = sp(f, fps, tP, { damping: 12, stiffness: 150 });
    detail = (<>
      <Win P={P} u={u} title={spec.file ?? "app/payments/charge.rb"} tag={spec.branch ?? "branch"} style={{ left: "3%", top: `${top}%`, width: "94%",
        transform: `translateY(${(1 - d) * -u * 8}px)`, opacity: Math.min(1, d * 1.5) }}>
        <div style={{ fontSize: u * 3.3, lineHeight: 1.55, whiteSpace: "nowrap" }}>
          <div style={{ color: P.err, background: `${P.err}22`, padding: `0 ${u}px`, borderRadius: u * 0.4 }}>- {spec.minus ?? "Stripe.timeout = 2"}</div>
          <div style={{ color: P.acc, background: `${P.acc}22`, padding: `0 ${u}px`, borderRadius: u * 0.4, marginTop: u * 0.4, opacity: ease(f, tF + 8, tF + 14) }}>+ {spec.plus ?? "Stripe.timeout = 30"}</div>
        </div>
        <div style={{ marginTop: u * 1.6, display: "flex", alignItems: "center", gap: u * 1.4, fontSize: u * 2.8, opacity: ease(f, tT, tT + 8), whiteSpace: "nowrap" }}>
          <span style={{ background: P.acc, color: P.onAcc, fontWeight: 700, padding: `${u * 0.2}px ${u * 1.2}px`, borderRadius: u * 0.5 }}>+ test</span>
          <span style={{ color: P.text }}>{spec.test ?? "a 3s Stripe answer"}</span>
        </div>
      </Win>
      <div style={{ position: "absolute", left: "3%", top: `${top + 38}%`, width: "94%", fontFamily: MONO, background: P.card, border: `${u * 0.3}px solid ${P.acc}`,
        borderRadius: u * 1.4, padding: `${u * 2}px ${u * 2.6}px`, transform: `translateY(${(1 - p) * u * 16}px) scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 1.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: u * 1.6, whiteSpace: "nowrap" }}>
          <span style={{ background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: u * 2.6, padding: `${u * 0.3}px ${u * 1.3}px`, borderRadius: u * 2 }}>⇡ open</span>
          <span style={{ fontSize: u * 3.4, color: P.dim, fontWeight: 700 }}>{spec.pr ?? "#412"}</span>
        </div>
        <div style={{ fontSize: u * 3.6, color: P.ink, fontWeight: 700, marginTop: u * 1.2, whiteSpace: "nowrap" }}>{spec.prTitle ?? "Restore the 30s Stripe timeout"}</div>
        <div style={{ fontSize: u * 2.8, color: P.text, marginTop: u * 1, opacity: ease(f, tE, tE + 8), whiteSpace: "nowrap" }}>
          {spec.evidence ?? "evidence: event 48213 · 8% vs 1% · a3f9c1e"}</div>
      </div>
    </>);
  }

  if (beat === 4) {
    // ship (only with access you gave it), then verify on the error chart until the alert clears
    const tS = Math.max(2, c("ship", "merges", 8) - 6), tD = c("deploy", "deploys", tS + 16) - 4, tW = c("watch", "watches", tD + 20) - 4, tC = Math.min(c("clear", "clears", tW + 24) - 4, durationInFrames - 24);
    const chips: string[] = spec.chips ?? ["CI passed", "merge", "deploy"];
    const N = 22, depAt = 10;
    const drawn = interpolate(f, [0, tD], [4, depAt], clamp) + interpolate(f, [tD, tC], [0, N - depAt], clamp);
    const bars = Array.from({ length: N }).map((_, i) => (i < depAt ? 0.55 + 0.4 * rand(i + 9) : 0.07 + 0.04 * rand(i)));
    const dep = ease(f, tD, tD + 10); const cl = sp(f, fps, tC, { damping: 9 });
    detail = (<>
      <div style={{ position: "absolute", left: "3%", top: `${top}%`, display: "flex", gap: u * 1.4, fontFamily: MONO }}>
        {chips.map((ch, i) => { const s = sp(f, fps, i < 2 ? tS + i * 6 : tD, { damping: 11 });
          return <span key={i} style={{ fontSize: u * 3, fontWeight: 700, color: P.onAcc, background: P.acc, padding: `${u * 0.5}px ${u * 1.6}px`, borderRadius: u * 0.7,
            transform: `scale(${s})`, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: u * 0.8 }}><Check size={u * 2.8} color={P.onAcc} />{ch}</span>; })}
      </div>
      <div style={{ position: "absolute", left: "3%", top: `${top + 8}%`, fontFamily: MONO, fontSize: u * 2.8, color: P.text, opacity: ease(f, tS, tS + 8), whiteSpace: "nowrap" }}>
        {spec.leash ?? "only with the merge + deploy access you give it"}</div>
      <div style={{ position: "absolute", left: "3%", top: `${top + 15}%`, fontFamily: MONO, fontSize: u * 2.7, color: P.dim }}>{spec.chartLabel ?? "/checkout error rate"}</div>
      <div style={{ position: "absolute", left: "3%", top: `${top + 20}%`, width: "94%", height: "26%", borderBottom: `${u * 0.3}px solid ${P.border}` }}>
        {bars.map((h, i) => { const vis = Math.max(0, Math.min(1, drawn - i)); const after = i >= depAt;
          return <div key={i} style={{ position: "absolute", bottom: 0, left: `${(i / N) * 100 + 0.6}%`, width: `${100 / N - 1.2}%`, height: `${h * 100 * vis}%`,
            background: after ? P.acc : P.err, borderRadius: `${u * 0.4}px ${u * 0.4}px 0 0` }} />; })}
        <div style={{ position: "absolute", left: `${(depAt / N) * 100}%`, top: "-6%", bottom: 0, borderLeft: `${u * 0.4}px dashed ${P.ink}`, opacity: dep }} />
        <div style={{ position: "absolute", left: `calc(${(depAt / N) * 100}% + ${u * 1.2}px)`, top: "-6%", fontFamily: MONO, fontSize: u * 2.6, color: P.ink, opacity: dep }}>deploy</div>
        <div style={{ position: "absolute", right: 0, top: "8%", fontFamily: MONO, fontSize: u * 3, color: P.acc, fontWeight: 700, opacity: ease(f, tW, tW + 10), whiteSpace: "nowrap" }}>
          {spec.verify ?? "0.9% since the deploy"}</div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: `${top + 51}%`, transform: `translateX(-50%) scale(${cl}) rotate(${-2 * cl}deg)`, fontFamily: MONO, fontSize: u * 3.6,
        fontWeight: 700, color: P.onAcc, background: P.acc, padding: `${u * 0.8}px ${u * 2.4}px`, borderRadius: u * 0.8, whiteSpace: "nowrap" }}>{spec.cleared ?? "alert clears"}</div>
    </>);
  }

  if (beat === 5) {
    // morning: the report the bot posted, and a closed stamp
    const tR = Math.max(4, c("fixed", "fixed", 10) - 4), tC = c("closed", "closed", tR + 30) - 6;
    const r = sp(f, fps, tR, { damping: 13 }); const s = sp(f, fps, tC, { damping: 8, stiffness: 160 });
    const stats: [string, string][] = spec.stats ?? [["24 min", "alert to verified fix"], ["0", "people paged"]];
    detail = (<>
      <Win P={P} u={u} title={spec.reportTitle ?? "grok bot · posted 03:36"} style={{ left: "3%", top: `${top}%`, width: "94%",
        transform: `translateY(${(1 - r) * u * 12}px)`, opacity: Math.min(1, r * 1.5) }}>
        <div style={{ fontSize: u * 3, color: P.ink, lineHeight: 1.45 }}>
          {(spec.report ?? []).map((l: string, i: number) => <div key={i} style={{ whiteSpace: "nowrap", opacity: ease(f, tR + 6 + i * 4, tR + 12 + i * 4) }}>{l}</div>)}
        </div>
      </Win>
      <div style={{ position: "absolute", left: "3%", right: "3%", top: `${top + 36}%`, display: "flex", gap: u * 2, fontFamily: MONO }}>
        {stats.map(([n, l], i) => <div key={i} style={{ flex: 1, background: P.card, border: `${u * 0.3}px solid ${P.border}`, borderRadius: u * 1.2, padding: `${u * 1.6}px ${u * 2}px`,
          opacity: ease(f, tC - 10 + i * 4, tC + i * 4) }}>
          <div style={{ fontSize: u * 6, fontWeight: 700, color: P.acc, lineHeight: 1 }}>{n}</div>
          <div style={{ fontSize: u * 2.6, color: P.dim, marginTop: u * 0.8, whiteSpace: "nowrap" }}>{l}</div></div>)}
      </div>
      <div style={{ position: "absolute", right: "5%", top: `${top - 2}%`, transform: `scale(${s}) rotate(${8 * s}deg)`, fontFamily: MONO, fontSize: u * 4.4, fontWeight: 700,
        color: P.acc, border: `${u * 0.6}px solid ${P.acc}`, padding: `${u * 0.4}px ${u * 1.8}px`, borderRadius: u * 1, background: `${P.bg}e6`, opacity: Math.min(1, s * 2) }}>
        {spec.stamp ?? "CLOSED"}</div>
    </>);
  }

  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      <Header P={P} u={u} f={f} beat={beat} clock={spec.clock ?? ["03:12", "03:12"]} nodes={nodes} dur={durationInFrames} clockEnd={spec.clockEnd ?? durationInFrames - 12} />
      {detail}
      <Example P={P} u={u} style={{ right: "2%", top: "1.5%" }} />
    </Square>
  );
};
