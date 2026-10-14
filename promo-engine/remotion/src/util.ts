import { interpolate, spring, Easing } from "remotion";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const sp = (frame: number, fps: number, delay = 0, cfg: any = {}) =>
  spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120, mass: 0.8, ...cfg } });
export const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
/** local frame (in scene) when a cue word is spoken; falls back to `fallback` frames */
export const cue = (words: { text: string; start: number }[], fps: number, needle: string, fallback: number) => {
  const n = needle.toLowerCase();
  const w = words.find((x) => x.text.toLowerCase().replace(/[^\w$]/g, "").startsWith(n));
  return w ? Math.round(w.start * fps) : fallback;
};
export const rand = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
