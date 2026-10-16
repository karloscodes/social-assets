import React from "react";
import { Composition } from "remotion";
import { Promo } from "./Promo";
import { SuppyLoop, LOOP } from "./SuppyLoop";
import { SuppyLoop2, LOOP2 } from "./SuppyLoop2";
import { SuppyLoop3, LOOP3 } from "./SuppyLoop3";
import { SuppyLoop4, LOOP4 } from "./SuppyLoop4";
import { Hoodie, HOODIE_LEN } from "./Hoodie";
import { HoodMascots } from "./HoodMascots";
import { Hoodie2, HOODIE2_LEN } from "./Hoodie2";
import { Hoodie3, HOODIE3_LEN } from "./Hoodie3";
import { Hoodie4, HOODIE4_LEN } from "./Hoodie4";
import { HoodLaunch, LAUNCH_LEN } from "./HoodLaunch";
import { HoodLaunch2, LAUNCH2_LEN } from "./HoodLaunch2";
import { HoodLaunch3, LAUNCH3_LEN } from "./HoodLaunch3";
import { HoodLaunch4, LAUNCH4_LEN } from "./HoodLaunch4";
import { HoodLaunch4b, LAUNCH4B_LEN } from "./HoodLaunch4b";
import { HoodLaunch4c, LAUNCH4C_LEN } from "./HoodLaunch4c";
import { HoodPain, PAIN_LEN, HoodCreators, CRE_LEN, CRE2_LEN } from "./HoodSlides";
import { HoodLaunchEs, LAUNCH_ES_LEN } from "./HoodLaunchEs";
import { MissedRefund, MR_LEN } from "./MissedRefund";
import { LogNorth3am, LN_LEN, HoodWorld, HW_LEN } from "./Cine";
import type { PromoProps } from "./types";

const placeholder: PromoProps = {
  id: "demo", width: 1080, height: 1920,
  brand: { name: "Brand", url: "brand.com", cta: "Start free", logo: "suppyhq/logo.svg",
    colors: { bg: "#f5f5f4", ink: "#1c1917", muted: "#57534e", accent: "#f97316", accentDark: "#ea580c", card: "#ffffff" },
    mascot: { name: "M", body: "#1c1917", accent: "#f97316", face: "#f5f5f4" } },
  scenes: [{ type: "kinetic-text", vo: "Hello", lines: ["Render with", "--props"] }],
  timing: { total: 3, fps: 30, scenes: [{ start: 0, end: 3, voStart: 0, voEnd: 1 }], words: [] },
};

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Promo"
    component={Promo as any}
    defaultProps={placeholder as any}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={90}
    calculateMetadata={({ props }: any) => ({
      durationInFrames: Math.ceil(props.timing.total * props.timing.fps),
      fps: props.timing.fps, width: props.width, height: props.height,
    })}
  />
  <Composition id="SuppyLoop" component={SuppyLoop} fps={30} width={1080} height={1920} durationInFrames={LOOP} />
  <Composition id="SuppyLoop2" component={SuppyLoop2} fps={30} width={1080} height={1920} durationInFrames={LOOP2} />
  <Composition id="SuppyLoop3" component={SuppyLoop3} fps={30} width={1080} height={1920} durationInFrames={LOOP3} />
  <Composition id="SuppyLoop4" component={SuppyLoop4} fps={30} width={1080} height={1920} durationInFrames={LOOP4} />
  <Composition id="SuppyLoop4b" component={SuppyLoop4} defaultProps={{ brand: true }} fps={30} width={1080} height={1920} durationInFrames={LOOP4} />
  <Composition id="SuppyLoop4e" component={SuppyLoop4} defaultProps={{ brand: true, endCard: true }} fps={30} width={1080} height={1920} durationInFrames={745} />
  <Composition id="Hoodie" component={Hoodie} fps={30} width={1080} height={1920} durationInFrames={HOODIE_LEN} />
  <Composition id="HoodMascots" component={HoodMascots} fps={30} width={2000} height={2000} durationInFrames={1} />
  <Composition id="Hoodie2" component={Hoodie2} fps={30} width={1080} height={1920} durationInFrames={HOODIE2_LEN} />
  <Composition id="Hoodie3" component={Hoodie3} fps={30} width={1080} height={1920} durationInFrames={HOODIE3_LEN} />
  <Composition id="Hoodie4" component={Hoodie4} fps={30} width={1080} height={1920} durationInFrames={HOODIE4_LEN} />
  <Composition id="HoodLaunch" component={HoodLaunch} fps={30} width={1080} height={1920} durationInFrames={LAUNCH_LEN} />
  <Composition id="HoodLaunch2" component={HoodLaunch2} fps={30} width={1080} height={1920} durationInFrames={LAUNCH2_LEN} />
  <Composition id="HoodLaunch3" component={HoodLaunch3} fps={30} width={1080} height={1920} durationInFrames={LAUNCH3_LEN} />
  <Composition id="HoodLaunch4" component={HoodLaunch4} fps={30} width={1080} height={1920} durationInFrames={LAUNCH4_LEN} />
  <Composition id="HoodLaunch4b" component={HoodLaunch4b} fps={30} width={1080} height={1920} durationInFrames={LAUNCH4B_LEN} />
  <Composition id="HoodLaunch4c" component={HoodLaunch4c} fps={30} width={1080} height={1920} durationInFrames={LAUNCH4C_LEN} />
    <Composition id="HoodPain" component={HoodPain} fps={30} width={1080} height={1920} durationInFrames={PAIN_LEN} />
  <Composition id="HoodCreators" component={HoodCreators} fps={30} width={1080} height={1920} durationInFrames={CRE_LEN} />
  <Composition id="HoodLaunchEs" component={HoodLaunchEs} fps={30} width={1080} height={1920} durationInFrames={LAUNCH_ES_LEN} />
  <Composition id="HoodCreators2En" component={HoodCreators} defaultProps={{ lang: "en" as const, v2: true }} fps={30} width={1080} height={1920} durationInFrames={CRE2_LEN} />
  <Composition id="HoodCreators2Es" component={HoodCreators} defaultProps={{ lang: "es" as const, v2: true }} fps={30} width={1080} height={1920} durationInFrames={CRE2_LEN} />
  <Composition id="MissedRefund" component={MissedRefund} fps={30} width={1080} height={1920} durationInFrames={MR_LEN} />
  <Composition id="LogNorth3am" component={LogNorth3am} fps={30} width={1080} height={1920} durationInFrames={LN_LEN} />
  <Composition id="HoodWorldEn" component={HoodWorld} defaultProps={{ lang: "en" as const }} fps={30} width={1080} height={1920} durationInFrames={HW_LEN} />
  <Composition id="HoodWorldEs" component={HoodWorld} defaultProps={{ lang: "es" as const }} fps={30} width={1080} height={1920} durationInFrames={HW_LEN} />
</>
);
