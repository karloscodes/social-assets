import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../../types";
import { Square } from "../../scenes/common";
import { sp, clamp, ease, cue } from "../../util";
import { pal, Win, Example, MONO, AppChip } from "./kit";

/** An error in production: failing requests stream into a tail, the same error folds into ONE issue card whose count climbs,
 *  then an alert drops in.
 *  spec: app, error {cls, msg, file, path}, count (final), lines[] (tail rows: [time, method, path, status]),
 *        issueNote, alert {title, to}, cues {card, repeat, issue, alert} */
export const DiagramErrorEvent: React.FC<SceneProps> = ({ spec, brand, words, u, stageW, stageH, durationInFrames }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const P = pal(brand);
  const cz = spec.cues ?? {};
  const err = spec.error ?? {};
  const tCard = Math.max(4, cue(words, fps, cz.card ?? "error", 14) - 4);
  const tRep = cue(words, fps, cz.repeat ?? "again", tCard + 20);
  const tIssue = cue(words, fps, cz.issue ?? "issue", tRep + 40) - 6;
  const tAlert = Math.min(cue(words, fps, cz.alert ?? "alert", tIssue + 30) - 8, durationInFrames - 30);
  const finalN = spec.count ?? 23;
  // count climbs from the "again" cue until just before "issue"
  const n = f < tCard ? 0 : Math.max(1, Math.round(interpolate(f, [tRep, tIssue], [1, finalN], { ...clamp, easing: (x) => x * x * (3 - 2 * x) })));
  const bump = n > 1 ? 1 + 0.07 * Math.max(0, Math.sin((f - tRep) * 0.9)) * (f < tIssue ? 1 : 0) : 1;
  // tail: one new failing line every few frames while the count climbs
  const rows: string[][] = spec.lines ?? [["05:00:58.012", "POST", "/checkout", "500"]];
  const visible = Math.min(14, Math.max(0, Math.floor((f - 2) / 5)));
  const card = sp(f, fps, tCard, { damping: 12, stiffness: 150 });
  const issue = sp(f, fps, tIssue, { damping: 10, stiffness: 160 });
  const alert = sp(f, fps, tAlert, { damping: 13, stiffness: 140 });
  const shake = f > tCard && f < tCard + 12 ? Math.sin(f * 2.2) * u * 0.6 * (1 - (f - tCard) / 12) : 0;
  const rowH = 4.6;
  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      {/* live tail */}
      <Win P={P} u={u} title={<>tail -f · {spec.appLogo ? <AppChip P={P} size={u * 2.7} name={spec.app} logo={spec.appLogo} /> : (spec.app ?? "shop-prod")}</>} tag={<span style={{ color: P.err }}>● live</span>}
        style={{ left: "2%", top: "0%", width: "96%", height: "40%", opacity: ease(f, 0, 8) }}>
        <div style={{ position: "relative", height: u * 29, overflow: "hidden" }}>
          {Array.from({ length: visible }).map((_, k) => {
            const r = rows[k % rows.length]; const age = visible - 1 - k; // newest at bottom
            if (age > 5) return null;
            const y = u * (29 - rowH * (age + 1));
            const bad = r[3]?.startsWith("5");
            return (
              <div key={k} style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", gap: u * 2, fontSize: u * 3, whiteSpace: "nowrap",
                color: bad ? P.err : P.text, opacity: ease(f, 2 + k * 5, 6 + k * 5) }}>
                <span style={{ color: P.dim }}>{r[0]}</span><span style={{ width: u * 9 }}>{r[1]}</span><span style={{ color: bad ? P.err : P.ink }}>{r[2]}</span>
                <span style={{ marginLeft: "auto", fontWeight: 700 }}>{r[3]}</span>
              </div>
            );
          })}
        </div>
      </Win>
      {/* the issue card: one error, one card, a count */}
      <div style={{ position: "absolute", left: "4%", top: "44%", width: "92%", fontFamily: MONO, background: P.card, borderRadius: u * 1.4,
        border: `${u * 0.3}px solid ${P.border}`, borderLeft: `${u * 1.1}px solid ${P.err}`, padding: `${u * 2.6}px ${u * 3}px`,
        boxShadow: `0 0 ${u * 6 * card}px ${P.err}40`, transform: `translateX(${shake}px) scale(${0.6 + 0.4 * card})`, opacity: Math.min(1, card * 1.6) }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: u * 2 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: u * 3.2, color: P.err, fontWeight: 500 }}>{err.cls ?? "Stripe::CardError"}</div>
            <div style={{ fontSize: u * 4.6, color: P.ink, fontWeight: 700, marginTop: u * 0.6, lineHeight: 1.15 }}>{err.msg ?? "Your card was declined."}</div>
            <div style={{ fontSize: u * 2.9, color: P.dim, marginTop: u * 1.2, whiteSpace: "nowrap" }}>{err.file ?? "payment_service.rb:67"} · {err.path ?? "/checkout"}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: u * 9, fontWeight: 700, color: P.err, transform: `scale(${bump})`, transformOrigin: "100% 50%", lineHeight: 1 }}>{n}×</div>
        </div>
      </div>
      {/* "1 issue" stamp */}
      <div style={{ position: "absolute", left: "8%", top: "72.5%", fontFamily: MONO, fontSize: u * 3.2, fontWeight: 700, color: P.onAcc, background: P.acc,
        padding: `${u * 0.6}px ${u * 1.8}px`, borderRadius: u * 0.8, transform: `scale(${issue}) rotate(${-3 * issue}deg)`, transformOrigin: "0 50%", whiteSpace: "nowrap" }}>
        {spec.issueNote ?? "1 issue, not 1,000 duplicates"}
      </div>
      {/* alert */}
      <div style={{ position: "absolute", left: "4%", top: "82%", width: "92%", fontFamily: MONO, background: "#2a0f16", border: `${u * 0.3}px solid ${P.err}`, borderRadius: u * 1.4,
        padding: `${u * 1.8}px ${u * 2.6}px`, display: "flex", alignItems: "center", gap: u * 2, opacity: Math.min(1, alert * 1.5),
        transform: `translateY(${(1 - alert) * u * 20}px)` }}>
        <span style={{ background: P.err, color: "#fff", fontWeight: 700, fontSize: u * 2.8, padding: `${u * 0.3}px ${u * 1.2}px`, borderRadius: u * 0.5,
          opacity: f > tAlert && (f - tAlert) % 20 < 10 ? 1 : 0.75 }}>ALERT</span>
        {spec.appLogo ? <AppChip P={P} size={u * 3} name="" logo={spec.appLogo} /> : null}
        <span style={{ fontSize: u * 3.1, color: P.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{spec.alert?.title ?? "spike: /checkout"}</span>
        <span style={{ marginLeft: "auto", fontSize: u * 2.8, color: P.dim, whiteSpace: "nowrap" }}>→ {spec.alert?.to ?? "telegram"}</span>
      </div>
      <Example P={P} u={u} style={{ right: "4%", top: "-5.5%" }} o={ease(f, 0, 10)} />
    </Square>
  );
};
