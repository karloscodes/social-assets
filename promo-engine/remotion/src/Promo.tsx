import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig, continueRender, delayRender } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont } from "@remotion/fonts";
import type { PromoProps, SceneProps } from "./types";
import { Background } from "./Background";
import { Captions } from "./Captions";
import { KineticText } from "./scenes/KineticText";
import { Illustration } from "./scenes/Illustration";
import { MascotScene } from "./scenes/MascotScene";
import { ProductCut } from "./scenes/ProductCut";
import { EndCard } from "./scenes/EndCard";
import { DiagramSort } from "./diagrams/Sort";
import { DiagramReply } from "./diagrams/ReplyLink";
import { DiagramGate } from "./diagrams/PermissionGate";
import { DiagramPaid } from "./diagrams/PaidContext";
import { DiagramErrorEvent } from "./diagrams/lognorth/ErrorEvent";
import { DiagramAgentMcp } from "./diagrams/lognorth/AgentMcp";
import { DiagramFix } from "./diagrams/lognorth/Fix";
import { DiagramOneBox } from "./diagrams/lognorth/OneBox";
import { DiagramAutofix } from "./diagrams/lognorth/AutofixLoop";

const DIAGRAMS: Record<string, React.FC<SceneProps>> = {
  "sort": DiagramSort, "reply-link": DiagramReply, "paid-context": DiagramPaid, "permission-gate": DiagramGate,
  "error-event": DiagramErrorEvent, "agent-mcp": DiagramAgentMcp, "fix": DiagramFix, "one-box": DiagramOneBox, "autofix-loop": DiagramAutofix,
};

const fontHandle = delayRender("font");
loadFont({ family: "Inter", url: staticFile("fonts/Inter.ttf"), weight: "100 900" })
  .then(() => continueRender(fontHandle)).catch(() => continueRender(fontHandle));
const monoHandle = delayRender("mono");
Promise.all([["Regular", "400"], ["Medium", "500"], ["Bold", "700"]].map(([n, w]) =>
  loadFont({ family: "IBM Plex Mono", url: staticFile(`fonts/IBMPlexMono-${n}.ttf`), weight: w })))
  .then(() => continueRender(monoHandle)).catch(() => continueRender(monoHandle));

const T = 12; // transition frames

export const layout = (w: number, h: number) => {
  const vertical = h >= w;
  // stage = where scene art lives; captions get their own band, above the bottom ~15% UI zone
  return vertical
    ? { vertical, stage: { x: 0, y: h * 0.07, w, h: h * 0.56 }, cap: { y: h * 0.655, h: h * 0.15, left: w * 0.07, right: w * 0.15 } }
    : { vertical, stage: { x: w * 0.05, y: h * 0.05, w: w * 0.9, h: h * 0.68 }, cap: { y: h * 0.75, h: h * 0.12, left: w * 0.1, right: w * 0.1 } };
};

const pick = (type: string, spec: any): React.FC<SceneProps> => {
  if (type === "kinetic-text") return KineticText;
  if (type === "illustration") return Illustration;
  if (type === "mascot") return MascotScene;
  if (type === "product-cut") return ProductCut;
  if (type === "end-card") return EndCard;
  if (type === "diagram") return DIAGRAMS[spec.diagram] ?? DiagramGate;
  return KineticText;
};

// a fade cross-dissolves two full scenes; next to the mascot or a phone mockup that reads as one overlapping the other,
// so those neighbours always slide instead
const BUSY = new Set(["mascot", "product-cut"]);
const presentations = (i: number, w: number, h: number, a?: string, b?: string, nextSpec?: any) => {
  if (nextSpec?.transitionIn === "fade") return fade(); // continuity between scenes that share a layout
  const k = i % 4;
  if (k === 3 && (BUSY.has(a ?? "") || BUSY.has(b ?? ""))) return slide({ direction: "from-right" });
  if (k === 0) return slide({ direction: "from-right" });
  if (k === 1) return wipe({ direction: "from-bottom-left" });
  if (k === 2) return slide({ direction: "from-bottom" });
  return fade();
};

export const Promo: React.FC<PromoProps> = (props) => {
  const { width: W, height: H, fps } = useVideoConfig();
  const L = layout(W, H);
  const { scenes, timing, brand } = props;
  const u = Math.min(L.stage.w, L.stage.h) / 100;
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, sans-serif", color: brand.colors.ink }}>
      <TransitionSeries>
        {scenes.map((spec, i) => {
          const slot = timing.scenes[i];
          const startF = Math.round(slot.start * fps), endF = Math.round(slot.end * fps);
          const last = i === scenes.length - 1;
          const dur = endF - startF + (last ? 0 : T);
          const Comp = pick(spec.type, spec);
          const words = timing.words.filter((w) => w.scene === i).map((w) => ({ ...w, start: w.start - slot.start, end: w.end - slot.start }));
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={dur}>
                <AbsoluteFill>
                  <Background brand={brand} dark={!!spec.dark} seed={i} morning={!!spec.morning} />
                  <div style={{ position: "absolute", left: L.stage.x, top: L.stage.y, width: L.stage.w, height: L.stage.h, overflow: "visible" }}>
                    <Comp spec={spec} brand={brand} words={words} durationInFrames={dur} stageW={L.stage.w} stageH={L.stage.h} u={u} />
                  </div>
                </AbsoluteFill>
              </TransitionSeries.Sequence>
              {!last && <TransitionSeries.Transition presentation={presentations(i, W, H, spec.type, scenes[i + 1]?.type, scenes[i + 1]) as any} timing={linearTiming({ durationInFrames: T })} />}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      <Captions words={timing.words} scenes={scenes} brand={brand} box={L.cap} width={W} />
      <Audio src={staticFile(`${props.id}/vo.wav`)} />
      {props.music ? <Audio src={staticFile(props.music)} volume={0.12} /> : null}
    </AbsoluteFill>
  );
};
