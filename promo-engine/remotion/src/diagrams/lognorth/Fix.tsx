import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../../types";
import { Square } from "../../scenes/common";
import { sp, clamp, ease, cue, rand } from "../../util";
import { pal, Win, Example, MONO } from "./kit";

/** The fix: a proposed diff, applied when you say the word; a deploy line drops on the error chart, the bars go to zero,
 *  the uptime strip stays green.
 *  spec: file, cause, minus, plus, proposed, applied, chartLabel, verified, uptime, cues {propose, apply, ship, stop} */
export const DiagramFix: React.FC<SceneProps> = ({ spec, brand, words, u, stageW, stageH, durationInFrames }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const P = pal(brand);
  const cz = spec.cues ?? {};
  const tProp = Math.max(4, cue(words, fps, cz.propose ?? "proposes", 16) - 8);
  const tApply = cue(words, fps, cz.apply ?? "word", tProp + 30) - 2;
  const tShip = cue(words, fps, cz.ship ?? "ship", tApply + 20) - 4;
  const tStop = Math.min(cue(words, fps, cz.stop ?? "stop", tShip + 20) - 6, durationInFrames - 36);
  const diff = sp(f, fps, tProp, { damping: 13, stiffness: 140 });
  const applied = sp(f, fps, tApply, { damping: 9, stiffness: 180 });
  // chart: 24 bars, errors high until the deploy, then fall to zero
  const N = 24, deployAt = 15;
  const deployX = (deployAt / N) * 100;
  const drawn = interpolate(f, [0, tShip], [6, deployAt], clamp) + interpolate(f, [tShip, tStop + 12], [0, N - deployAt], clamp);
  const dep = ease(f, tShip, tShip + 10);
  const ok = sp(f, fps, tStop + 6, { damping: 10 });
  const bars = Array.from({ length: N }).map((_, i) => (i < deployAt ? 0.45 + 0.5 * rand(i + 3) : i === deployAt ? 0.18 : 0));
  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      {/* diff */}
      <Win P={P} u={u} title={spec.file ?? "payment_service.rb"} tag={<span style={{ color: f > tApply ? P.acc : P.dim }}>{f > tApply ? (spec.applied ?? "applied") : (spec.proposed ?? "proposed fix")}</span>}
        border={f > tApply ? P.acc : undefined}
        style={{ left: "1%", top: "0%", width: "98%", transform: `translateY(${(1 - diff) * -u * 12}px) scale(${1 + 0.03 * Math.sin(Math.min(1, applied) * Math.PI)})`, opacity: Math.min(1, diff * 1.5) }}>
        <div style={{ fontSize: u * 2.7, color: P.dim, marginBottom: u * 1, whiteSpace: "nowrap" }}>{spec.cause ?? "# cause: test card token in live mode"}</div>
        <div style={{ fontSize: u * 3.2, lineHeight: 1.55, whiteSpace: "nowrap" }}>
          <div style={{ color: P.err, background: `${P.err}22`, padding: `0 ${u}px`, borderRadius: u * 0.4,
            textDecoration: f > tApply ? "line-through" : "none", opacity: f > tApply ? 0.6 : 1 }}>- {spec.minus ?? "token = test_card_token"}</div>
          <div style={{ color: P.acc, background: `${P.acc}22`, padding: `0 ${u}px`, borderRadius: u * 0.4, marginTop: u * 0.4,
            opacity: ease(f, tProp + 8, tProp + 16) }}>+ {spec.plus ?? "token = live_card_token"}</div>
        </div>
      </Win>
      {/* error chart */}
      <div style={{ position: "absolute", left: "3%", top: "34%", width: "94%", fontFamily: MONO, fontSize: u * 2.8, color: P.dim, display: "flex", opacity: ease(f, 2, 10) }}>
        <span>{spec.chartLabel ?? "/checkout errors"}</span>
      </div>
      <div style={{ position: "absolute", left: "3%", top: "40%", width: "94%", height: "30%", borderBottom: `${u * 0.3}px solid ${P.border}`, opacity: ease(f, 2, 10) }}>
        {bars.map((h, i) => {
          const vis = Math.max(0, Math.min(1, drawn - i));
          const after = i > deployAt;
          return <div key={i} style={{ position: "absolute", bottom: 0, left: `${(i / N) * 100 + 0.6}%`, width: `${100 / N - 1.2}%`,
            height: after ? u * 0.8 : `${h * 100 * vis}%`, opacity: after ? vis : 1, background: after ? P.acc : P.err, borderRadius: `${u * 0.4}px ${u * 0.4}px 0 0` }} />;
        })}
        {/* deploy line */}
        <div style={{ position: "absolute", left: `${deployX}%`, top: `${-8 * dep}%`, bottom: 0, width: 0, borderLeft: `${u * 0.4}px dashed ${P.ink}`, opacity: dep }} />
        <div style={{ position: "absolute", left: `calc(${deployX}% + ${u * 1.2}px)`, top: "-12%", fontFamily: MONO, fontSize: u * 2.6, color: P.ink, opacity: dep, whiteSpace: "nowrap" }}>deploy</div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "73%", transform: `translateX(-50%) scale(${ok})`, fontFamily: MONO, fontSize: u * 3.3, fontWeight: 700,
        color: P.onAcc, background: P.acc, padding: `${u * 0.7}px ${u * 2}px`, borderRadius: u * 0.8, whiteSpace: "nowrap" }}>{spec.verified ?? "0 errors in last 5 minutes"}</div>
      {/* uptime strip */}
      <div style={{ position: "absolute", left: "3%", top: "84%", width: "94%", fontFamily: MONO, opacity: ease(f, 4, 12) }}>
        <div style={{ display: "flex", fontSize: u * 2.7, color: P.dim, marginBottom: u * 1 }}>
          <span>uptime</span><span style={{ marginLeft: "auto", color: P.acc }}>● {spec.uptime ?? "up 84ms"}</span>
        </div>
        <div style={{ display: "flex", gap: u * 0.45, height: u * 4.4 }}>
          {Array.from({ length: 32 }).map((_, i) => <div key={i} style={{ flex: 1, borderRadius: u * 0.3, background: P.acc,
            opacity: 0.35 + 0.65 * ease(f, 4 + i * 1.2, 10 + i * 1.2) }} />)}
        </div>
      </div>
      <Example P={P} u={u} style={{ right: "3%", top: "-5.5%" }} o={ease(f, 0, 10)} />
    </Square>
  );
};
