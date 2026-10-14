export type Word = { text: string; start: number; end: number; scene: number };
export type SceneSlot = { start: number; end: number; voStart: number; voEnd: number };
export type Brand = {
  name: string; url: string; cta: string; logo: string;
  colors: { bg: string; ink: string; muted: string; accent: string; accentDark: string; card: string;
    onAccent?: string; error?: string; line?: string; border?: string; dim?: string };
  mascot?: { name: string; body: string; accent: string; face: string } | null;
  /** "dark": the whole video sits on colors.bg (a dark color) with light ink; default is light */
  theme?: "light" | "dark";
  /** text wordmark shown instead of logo + name, e.g. { text: "lognorth", brackets: true, mono: true } */
  wordmark?: { text: string; brackets?: boolean; mono?: boolean };
};
export type SceneSpec = { type: string; vo: string; [k: string]: any };
export type PromoProps = {
  id: string; brand: Brand; scenes: SceneSpec[];
  timing: { total: number; fps: number; scenes: SceneSlot[]; words: Word[] };
  width: number; height: number; music?: string | null;
};
export type SceneProps = {
  spec: SceneSpec; brand: Brand; words: Word[]; // words with times local to the scene (seconds)
  durationInFrames: number; stageW: number; stageH: number; u: number;
};
