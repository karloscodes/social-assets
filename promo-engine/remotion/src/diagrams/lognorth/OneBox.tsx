import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { SceneProps } from "../../types";
import { Square } from "../../scenes/common";
import { sp, ease, cue } from "../../util";
import { pal, Wordmark, MONO } from "./kit";

/** One small server you own. Logs, errors, alerts and uptime slot into it one by one (on their words); a price tag and a
 *  "stays here" lock follow.
 *  spec: modules[] ({label, sub, cue}), box (label), price (tag), stack (footer), stay (badge), cues {box, price, stay} */
export const DiagramOneBox: React.FC<SceneProps> = ({ spec, brand, words, u, stageW, stageH, durationInFrames }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const P = pal(brand);
  const cz = spec.cues ?? {};
  const mods: { label: string; sub: string; cue?: string }[] = spec.modules ?? [];
  const tBox = Math.max(0, cue(words, fps, cz.box ?? "box", 10) - 10);
  const tPrice = cue(words, fps, cz.price ?? "five", 80) - 4;
  const tStay = Math.min(cue(words, fps, cz.stay ?? "stay", tPrice + 30) - 4, durationInFrames - 30);
  const box = sp(f, fps, tBox, { damping: 13, stiffness: 120 });
  const leds = (i: number) => (f % 24 < 12 + (i % 3) * 3 ? 1 : 0.35);
  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      {/* server */}
      <div style={{ position: "absolute", left: "8%", top: "6%", width: "84%", height: "62%", background: P.card, border: `${u * 0.4}px solid ${P.border}`,
        borderRadius: u * 2.2, transform: `translateY(${(1 - box) * u * 20}px) scale(${0.85 + 0.15 * box})`, opacity: Math.min(1, box * 1.5),
        boxShadow: `0 ${u * 3}px ${u * 8}px rgba(0,0,0,0.6)` }}>
        <div style={{ display: "flex", alignItems: "center", padding: `${u * 2}px ${u * 3}px`, borderBottom: `${u * 0.3}px solid ${P.line}` }}>
          <Wordmark P={P} size={u * 4} />
          <span style={{ marginLeft: "auto", display: "flex", gap: u * 1 }}>
            {[0, 1, 2].map((i) => <span key={i} style={{ width: u * 1.6, height: u * 1.6, borderRadius: "50%", background: P.acc, opacity: leds(i) * box }} />)}
          </span>
        </div>
        <div style={{ padding: `${u * 2}px ${u * 3}px`, display: "flex", flexDirection: "column", gap: u * 1.6 }}>
          {mods.map((m, i) => {
            const t = cue(words, fps, m.cue ?? m.label.toLowerCase(), tBox + 14 + i * 10) - 6;
            const s = sp(f, fps, t, { damping: 12, stiffness: 170 });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: u * 2, fontFamily: MONO, background: P.bg, border: `${u * 0.3}px solid ${s > 0.5 ? P.acc : P.line}`,
                borderRadius: u * 1, padding: `${u * 1.3}px ${u * 2.2}px`, transform: `translateX(${(1 - s) * u * 70}px)`, opacity: Math.min(1, s * 1.4) }}>
                <span style={{ color: P.acc, fontSize: u * 3.6, fontWeight: 700 }}>▸</span>
                <span style={{ fontSize: u * 4, fontWeight: 700, color: P.ink }}>{m.label}</span>
                <span style={{ marginLeft: "auto", fontSize: u * 2.6, color: P.dim, whiteSpace: "nowrap" }}>{m.sub}</span>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: u * 2, textAlign: "center", fontFamily: MONO, fontSize: u * 2.7, color: P.dim, opacity: ease(f, tPrice - 6, tPrice + 6) }}>
          {spec.stack ?? "1 Docker container · 1 SQLite file"}
        </div>
      </div>
      {/* price tag */}
      <div style={{ position: "absolute", right: "2%", top: "0%", fontFamily: MONO, fontSize: u * 4.2, fontWeight: 700, color: P.onAcc, background: P.acc,
        padding: `${u * 0.8}px ${u * 2.2}px`, borderRadius: u * 1, transform: `scale(${sp(f, fps, tPrice, { damping: 8 })}) rotate(6deg)`, whiteSpace: "nowrap" }}>{spec.price ?? "$5 box"}</div>
      {/* stays here */}
      <div style={{ position: "absolute", left: "50%", top: "74%", transform: `translateX(-50%) scale(${sp(f, fps, tStay, { damping: 10 })})`, fontFamily: MONO,
        display: "flex", alignItems: "center", gap: u * 1.6, fontSize: u * 3.4, fontWeight: 700, color: P.ink, background: P.card, border: `${u * 0.3}px solid ${P.acc}`,
        padding: `${u * 1}px ${u * 2.6}px`, borderRadius: u * 1, whiteSpace: "nowrap" }}>
        <svg viewBox="0 0 40 44" width={u * 3.2} height={u * 3.5}><path d="M11 20 V13 a9 9 0 0 1 18 0 V20" fill="none" stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
          <rect x={5} y={19} width={30} height={23} rx={6} fill={P.acc} /></svg>
        {spec.stay ?? "your logs stay on your server"}
      </div>
    </Square>
  );
};
