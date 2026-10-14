import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../types";
import { sp, clamp } from "../util";

export const KineticText: React.FC<SceneProps> = ({ spec, brand, words, stageW, stageH, u }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const lines: string[] = spec.lines ?? [spec.vo];
  const accent: string[] = spec.accentWords ?? [];
  const dark = !!spec.dark;
  const v0 = words.length ? words[0].start : 0.2, v1 = words.length ? words[words.length - 1].end : 2;
  const ink = dark ? "#fff" : brand.colors.ink;
  const big = spec.big as string | undefined;
  const base = Math.min(stageW * 0.105, u * 11);
  let wi = 0;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: base * 0.12 }}>
      {lines.map((line, li) => {
        const lineStart = li === 0 && spec.instant ? -12 : Math.round((v0 + (li / lines.length) * (v1 - v0) * 0.9) * fps);
        const isBig = big && line === big;
        const fs = isBig ? Math.min(base * 2.1, (stageW * 0.86) / (line.length * 0.62)) : Math.min(base, (stageW * 0.88) / (line.length * 0.5));
        return (
          <div key={li} style={{ display: "flex", gap: fs * 0.24, flexWrap: "wrap", justifyContent: "center", maxWidth: stageW * 0.9 }}>
            {line.split(" ").map((w, k) => {
              const d = lineStart + k * 3; wi++;
              const s = sp(f, fps, d, { damping: 12, stiffness: 160 });
              const isAcc = accent.some((a) => w.startsWith(a) || a === line);
              let txt = w;
              if (isBig && /\$\d+/.test(w)) { // count up the price
                const n = parseInt(w.replace(/\D/g, ""), 10);
                const c = Math.round(interpolate(f, [d, d + 18], [0, n], clamp));
                txt = w.replace(/\d+/, String(c));
              }
              const under = interpolate(f, [d + 8, d + 20], [0, 1], clamp);
              return (
                <span key={k} style={{ position: "relative", display: "inline-block", fontSize: fs, fontWeight: isBig ? 900 : 800, letterSpacing: -fs * 0.035,
                  lineHeight: 1.05, color: isAcc ? brand.colors.accent : ink, opacity: s,
                  transform: `translateY(${(1 - s) * fs * 0.6}px) rotate(${(1 - s) * (k % 2 ? 6 : -6)}deg) scale(${0.7 + 0.3 * s})` }}>
                  {txt}
                  {isAcc && !isBig ? <svg style={{ position: "absolute", left: 0, bottom: -fs * 0.12, width: "100%", height: fs * 0.25, overflow: "visible" }} viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M2 14 Q 50 2 98 12" stroke={brand.colors.accent} strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - under} />
                  </svg> : null}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
