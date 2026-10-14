#!/usr/bin/env python3
"""Extract frames at fractions of every scene: python tools/scene_frames.py <id> [fractions...] -> out/frames/<id>/sNN-FF.png"""
import json, os, subprocess, sys
vid = sys.argv[1]; fr = [float(x) for x in sys.argv[2:]] or [0.35, 0.7, 0.97]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t = json.load(open(f"{root}/props/{vid}.timing.json")); od = f"{root}/out/frames/{vid}"; os.makedirs(od, exist_ok=True)
for f_ in os.listdir(od): os.remove(f"{od}/{f_}")
for i, s in enumerate(t["scenes"]):
    for x in fr:
        ts = s["start"] + (s["end"] - s["start"]) * x
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ts:.3f}", "-i", f"{root}/out/{vid}-vertical.mp4", "-frames:v", "1", f"{od}/s{i:02d}-{int(x*100):02d}.png"], check=True)
print(od)
