import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

/** "Suppy": a little envelope creature (body = the logo's dark rounded square, orange notification dot).
 * Pure SVG so it can bounce, blink, wave. pose: idle | sort | celebrate */
export const Mascot: React.FC<{ size: number; pose?: "idle" | "sort" | "celebrate"; colors: { body: string; accent: string; face: string }; delay?: number; look?: number; holding?: React.ReactNode }> =
  ({ size, pose = "idle", colors, delay = 0, look = 0, holding }) => {
  const f = useCurrentFrame() - delay; const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 9, stiffness: 120 } });
  const hop = pose === "celebrate" ? Math.abs(Math.sin(f / 7)) * 14 : Math.abs(Math.sin(f / 14)) * 5;
  const squash = 1 + (pose === "celebrate" ? 0.05 : 0.025) * Math.cos(f / (pose === "celebrate" ? 3.5 : 7));
  const blinkPhase = f % 78; const blink = blinkPhase < 4 ? Math.abs(blinkPhase - 2) / 2 : 1;
  const sway = pose === "sort" ? Math.sin(f / 5) : Math.sin(f / 16);
  // arm angles (deg) around shoulder
  const lArm = pose === "celebrate" ? -150 + 15 * Math.sin(f / 4) : pose === "sort" ? 20 + 6 * sway : 25 + 4 * sway;
  const rArm = pose === "celebrate" ? 150 - 15 * Math.sin(f / 4 + 1) : pose === "sort" ? -95 + 35 * Math.sin(f / 5) : -25 - 10 * Math.max(0, Math.sin(f / 9));
  const dot = 1 + 0.12 * Math.max(0, Math.sin(f / 6));
  const lx = look * 4;
  const arm = (x: number, y: number, ang: number) => (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <path d="M0 0 L0 42" stroke={colors.body} strokeWidth={14} strokeLinecap="round" />
      <circle cx={0} cy={46} r={10} fill={colors.body} />
    </g>
  );
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible",
      transform: `translateY(${(1 - enter) * 60 - hop}px) scale(${enter})`, transformOrigin: "50% 100%" }}>
      <ellipse cx={100} cy={208} rx={58 - hop * 1.2} ry={8} fill="rgba(28,25,23,0.16)" />
      <g transform={`translate(100 200) scale(${1 / squash} ${squash}) translate(-100 -200)`}>
        <rect x={64} y={176} width={22} height={26} rx={10} fill={colors.body} />
        <rect x={114} y={176} width={22} height={26} rx={10} fill={colors.body} />
        {arm(34, 116, lArm)}
        {arm(166, 116, rArm)}
        <rect x={28} y={50} width={144} height={134} rx={40} fill={colors.body} />
        {/* envelope flap */}
        <path d="M46 70 L100 112 L154 70" fill="none" stroke={colors.face} strokeOpacity={0.22} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        {/* eyes */}
        <g transform={`translate(0 ${pose === "celebrate" ? -4 : 0})`}>
          {[76, 124].map((cx) => (
            <g key={cx} transform={`translate(${cx} 128) scale(1 ${blink}) translate(${-cx} -128)`}>
              {pose === "celebrate"
                ? <path d={`M${cx - 13} 132 Q${cx} 114 ${cx + 13} 132`} stroke={colors.face} strokeWidth={7} fill="none" strokeLinecap="round" />
                : <><ellipse cx={cx} cy={128} rx={15} ry={16} fill={colors.face} /><circle cx={cx + lx} cy={130} r={7.5} fill={colors.body} /><circle cx={cx + lx + 3} cy={126} r={2.5} fill="#fff" /></>}
            </g>
          ))}
          <circle cx={58} cy={150} r={7} fill={colors.accent} opacity={0.55} />
          <circle cx={142} cy={150} r={7} fill={colors.accent} opacity={0.55} />
          {pose === "celebrate"
            ? <path d="M86 150 Q100 170 114 150 Z" fill={colors.accent} />
            : <path d="M88 152 Q100 162 112 152" stroke={colors.face} strokeWidth={5} fill="none" strokeLinecap="round" />}
        </g>
        {/* notification dot, like the logo */}
        <g transform={`translate(160 54) scale(${dot})`}>
          <circle r={19} fill={colors.face} /><circle r={14} fill={colors.accent} />
        </g>
        {holding ? <g transform={`translate(166 116) rotate(${rArm}) translate(0 50) rotate(${-rArm})`}>{holding}</g> : null}
      </g>
    </svg>
  );
};

/** small envelope glyph usable inside SVG */
export const EnvelopeGlyph: React.FC<{ w?: number; fill?: string; stroke?: string; x?: number; y?: number }> = ({ w = 40, fill = "#fff", stroke = "#1c1917", x = 0, y = 0 }) => (
  <g transform={`translate(${x - w / 2} ${y - w * 0.35})`}>
    <rect width={w} height={w * 0.7} rx={w * 0.12} fill={fill} stroke={stroke} strokeWidth={w * 0.06} />
    <path d={`M${w * 0.1} ${w * 0.14} L${w / 2} ${w * 0.42} L${w * 0.9} ${w * 0.14}`} fill="none" stroke={stroke} strokeWidth={w * 0.06} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
