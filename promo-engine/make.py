#!/usr/bin/env python3
"""Promo engine: one command from script file to MP4.
  python3 make.py videos/<id>.json [--horizontal] [--skip-tts] [--still SECONDS ...]
Steps: Kokoro narration + word timestamps -> props JSON -> Remotion render (1080x1920, optional 1920x1080)."""
import argparse, json, os, subprocess, sys
ROOT = os.path.dirname(os.path.abspath(__file__))
KOKORO_PY = os.environ.get("KOKORO_PY", "/workspace/promo/suppyhq-vo/.venv/bin/python")
ap = argparse.ArgumentParser(); ap.add_argument("script"); ap.add_argument("--horizontal", action="store_true")
ap.add_argument("--skip-tts", action="store_true"); ap.add_argument("--still", type=float, nargs="*"); ap.add_argument("--concurrency", default="4")
a = ap.parse_args()
spec = json.load(open(a.script)); vid = spec["id"]
if not a.skip_tts or not os.path.exists(f"{ROOT}/props/{vid}.timing.json"):
    subprocess.run([KOKORO_PY, f"{ROOT}/tts/tts.py", a.script], check=True)
timing = json.load(open(f"{ROOT}/props/{vid}.timing.json"))
os.makedirs(f"{ROOT}/out", exist_ok=True)
sizes = [("vertical", 1080, 1920)] + ([("horizontal", 1920, 1080)] if a.horizontal else [])
for name, w, h in sizes:
    props = {**{k: spec[k] for k in ("id", "brand", "scenes")}, "timing": timing, "width": w, "height": h, "music": spec.get("music")}
    pp = f"{ROOT}/props/{vid}.{name}.json"; json.dump(props, open(pp, "w"), ensure_ascii=False)
    if a.still is not None:
        for t in a.still:
            out = f"{ROOT}/out/stills/{vid}-{name}-{t:05.2f}.png"
            subprocess.run(["npx", "remotion", "still", "src/index.ts", "Promo", out, f"--props={pp}", f"--frame={int(t * 30)}", "--log=error"], cwd=f"{ROOT}/remotion", check=True)
        continue
    out = f"{ROOT}/out/{vid}-{name}.mp4"
    subprocess.run(["npx", "remotion", "render", "src/index.ts", "Promo", out, f"--props={pp}", "--codec=h264", "--crf=18",
                    f"--concurrency={a.concurrency}", "--audio-codec=aac", "--audio-bitrate=192k", "--log=error"], cwd=f"{ROOT}/remotion", check=True)
    print("rendered", out)
