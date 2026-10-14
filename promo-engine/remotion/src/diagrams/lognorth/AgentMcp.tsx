import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { SceneProps } from "../../types";
import { Square } from "../../scenes/common";
import { sp, clamp, ease, cue } from "../../util";
import { pal, Win, Example, Wordmark, MONO } from "./kit";

/** Your agent asks; the question goes down an MCP link to LogNorth; the matching issue and the log lines that led to it
 *  light up in LogNorth and travel back up into the agent's terminal.
 *  spec: agents (title), prompt, tool, host, mcpLabel, found, logs[] ([time, text, ms, isError]), stream[] (filler lines in LogNorth),
 *        cues {ask, query, mcp, found, logs} */
export const DiagramAgentMcp: React.FC<SceneProps> = ({ spec, brand, words, u, stageW, stageH, durationInFrames }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const P = pal(brand);
  const cz = spec.cues ?? {};
  const tAsk = Math.max(2, cue(words, fps, cz.ask ?? "ask", 10) - 6);
  const tQuery = cue(words, fps, cz.query ?? "reads", tAsk + 40) - 4;
  const tMcp = cue(words, fps, cz.mcp ?? "mcp", tQuery + 20) - 4;
  const tFound = cue(words, fps, cz.found ?? "error", tMcp + 30) - 10;
  const tLogs = Math.min(cue(words, fps, cz.logs ?? "every", tFound + 24) - 6, durationInFrames - 50);
  const prompt: string = spec.prompt ?? "why are payments failing?";
  const typed = Math.max(0, Math.min(prompt.length, Math.floor((f - tAsk) * 1.4)));
  const logs: [string, string, string, boolean][] = spec.logs ?? [];
  const stream: { t: string; k?: number }[] = spec.stream ?? []; // k: 0 = matches the issue, 1 = one of the log lines sent back
  // packet positions along the link (0 = agent, 1 = LogNorth)
  const down = ease(f, tQuery, tQuery + 16);
  const up1 = ease(f, tFound, tFound + 14);
  const up2 = ease(f, tLogs, tLogs + 14);
  const linkTop = 41, linkBot = 55; // % of square
  const pkt = (t: number, label: string, color: string, dir: "down" | "up", show: number) => {
    const y = dir === "down" ? interpolate(t, [0, 1], [linkTop, linkBot]) : interpolate(t, [0, 1], [linkBot, linkTop]);
    return show > 0 && t < 1 ? <div style={{ position: "absolute", left: "50%", top: `${y}%`, transform: "translate(-50%,-50%)", fontFamily: MONO, fontSize: u * 2.6,
      fontWeight: 700, color: P.onAcc, background: color, padding: `${u * 0.4}px ${u * 1.4}px`, borderRadius: u * 0.6, whiteSpace: "nowrap", zIndex: 5 }}>{label}</div> : null;
  };
  const mcpPulse = f > tMcp ? 1 + 0.12 * Math.max(0, Math.sin((f - tMcp) / 3)) * Math.max(0, 1 - (f - tMcp) / 30) : 1;
  const agentIn = sp(f, fps, 0, { damping: 14 });
  const lnIn = sp(f, fps, 6, { damping: 14 });
  const hi = (k: number) => (k === 0 ? f > tFound - 8 : f > tLogs - 8);
  return (
    <Square u={u} stageW={stageW} stageH={stageH}>
      {/* agent terminal */}
      <Win P={P} u={u} title={spec.agents ?? "your agent · Claude Code / Cursor"} style={{ left: "1%", top: "0%", width: "98%", height: "40%",
        transform: `translateY(${(1 - agentIn) * -u * 10}px)`, opacity: agentIn }} border={f > tFound ? P.acc : undefined}>
        <div style={{ fontSize: u * 3.3, color: P.ink, whiteSpace: "nowrap" }}>
          <span style={{ color: P.acc }}>&gt; </span>{prompt.slice(0, typed)}
          {typed < prompt.length || f < tQuery ? <span style={{ display: "inline-block", width: u * 1.8, height: u * 3.6, verticalAlign: "middle", background: P.acc, opacity: f % 14 < 7 ? 1 : 0 }} /> : null}
        </div>
        <div style={{ fontSize: u * 2.8, color: P.dim, marginTop: u * 1.4, opacity: ease(f, tQuery, tQuery + 6) * (f < tFound + 6 ? 1 : 0), position: "absolute", left: u * 2.2 , top: u * 7.4 }}>
          [agent] querying LogNorth…
        </div>
        <div style={{ marginTop: u * 1.6, fontSize: u * 2.9, lineHeight: 1.5, opacity: ease(f, tFound + 10, tFound + 16) }}>
          <div style={{ color: P.text, whiteSpace: "nowrap" }}>[agent] found <span style={{ color: P.err }}>{spec.found?.cls ?? "Stripe::CardError"}</span></div>
          <div style={{ color: P.dim, whiteSpace: "nowrap" }}>        {spec.found?.where ?? "payment_service.rb:67 · 23 hits"}</div>
        </div>
        <div style={{ marginTop: u * 0.8, fontSize: u * 2.7, lineHeight: 1.45 }}>
          {logs.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: u * 1.6, whiteSpace: "nowrap", color: l[3] ? P.err : P.text, opacity: ease(f, tLogs + 12 + i * 4, tLogs + 18 + i * 4) }}>
              <span style={{ color: P.dim }}>{l[0]}</span><span>{l[1]}</span><span style={{ marginLeft: "auto", color: P.dim }}>{l[2]}</span>
            </div>
          ))}
        </div>
      </Win>
      {/* MCP link */}
      <div style={{ position: "absolute", left: "50%", top: `${linkTop}%`, height: `${linkBot - linkTop}%`, width: u * 0.5, transform: "translateX(-50%)",
        background: `repeating-linear-gradient(${P.acc} 0 ${u * 1.2}px, transparent ${u * 1.2}px ${u * 2.2}px)`, backgroundPositionY: `${(f * 0.8) % (u * 2.2)}px`,
        opacity: ease(f, 4, 14) * 0.85 }} />
      <div style={{ position: "absolute", left: "56%", top: `${(linkTop + linkBot) / 2}%`, transform: `translateY(-50%) scale(${mcpPulse})`, transformOrigin: "0 50%", fontFamily: MONO,
        display: "flex", flexDirection: "column", gap: u * 0.3, opacity: ease(f, 6, 14) }}>
        <span style={{ fontSize: u * 3.6, fontWeight: 700, color: P.acc }}>MCP</span>
        <span style={{ fontSize: u * 2.5, color: P.dim, whiteSpace: "nowrap" }}>{spec.mcpLabel ?? "read-only"}</span>
      </div>
      {pkt(down, spec.tool ?? "search_logs", P.acc, "down", f >= tQuery ? 1 : 0)}
      {pkt(up1, "1 issue", P.ink, "up", f >= tFound ? 1 : 0)}
      {pkt(up2, `${logs.length} log lines`, P.ink, "up", f >= tLogs ? 1 : 0)}
      {/* LogNorth server */}
      <Win P={P} u={u} title={<Wordmark P={P} size={u * 2.9} />} tag={spec.host ?? "logs.yoursite.com"} style={{ left: "1%", top: "56%", width: "98%", height: "42%",
        transform: `translateY(${(1 - lnIn) * u * 10}px)`, opacity: lnIn }} border={f > tQuery + 12 && f < tLogs + 30 ? P.acc : undefined}>
        <div style={{ fontSize: u * 2.6, lineHeight: 1.62 }}>
          {stream.map(({ t: s, k = -1 }, i) => {
            const lit = k >= 0 && hi(k) && f > tQuery + 12;
            const isErr = /Error|500/.test(s);
            return <div key={i} style={{ whiteSpace: "nowrap", overflow: "hidden", color: lit ? P.onAcc : isErr ? P.err : P.dim,
              background: lit ? (isErr ? P.err : P.acc) : "transparent", padding: `0 ${u * 0.8}px`, borderRadius: u * 0.4,
              opacity: f > tQuery + 12 && !lit ? 0.55 : 1 }}>{s}</div>;
          })}
        </div>
      </Win>
      <Example P={P} u={u} style={{ right: "3%", top: "33.5%" }} o={ease(f, 4, 14)} />
    </Square>
  );
};
