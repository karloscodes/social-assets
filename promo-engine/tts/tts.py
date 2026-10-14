#!/usr/bin/env python3
"""Narration + timing for a promo script.
Usage: python tts/tts.py videos/<id>.json
Writes remotion/public/<id>/vo.wav and props/<id>.timing.json (scene slots + word timestamps).
Engine: Kokoro-82M (Apache-2.0) via kokoro.KPipeline, one pipeline call per scene line."""
import json, os, re, sys, numpy as np, soundfile as sf
from kokoro import KPipeline

SR, FPS = 24000, 30
spec = json.load(open(sys.argv[1])); vid = spec["id"]; v = spec.get("voice", {})
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
PRE, POST = 0.12, 0.10            # around each line (Kokoro output already has ~0.2 s edges)
MIN = {"product-cut": 1.6, "end-card": 3.2}
TAIL = 1.4                         # hold on the last scene

def say(text):
    for w, ph in v.get("lexicon", {}).items():
        text = re.sub(rf"\b{re.escape(w)}\b", f"[{w}](/{ph}/)", text)
    return text

def sentences(text):
    """split a line into sentences (voice.perSentence); very short ones merge with the next for steadier prosody"""
    if not v.get("perSentence"): return [text]
    parts = [p for p in re.split(r"(?<=[.?!])\s+", text.strip()) if p]
    out, buf = [], ""
    for p in parts:
        buf = (buf + " " + p).strip()
        if len(buf) >= v.get("mergeShorterThan", 0): out.append(buf); buf = ""
    if buf: out.append(buf) if not out else out.__setitem__(-1, out[-1] + " " + buf)
    return out

audio, words, scenes, t = [], [], [], 0.0
for i, sc in enumerate(spec["scenes"]):
    chunks, toks, off = [], [], 0.0
    for si, sent in enumerate(sentences(sc["vo"])):
        if si and v.get("sentenceGap", 0) > 0:
            g = np.zeros(int(v["sentenceGap"] * SR), np.float32); chunks.append(g); off += len(g) / SR
        for r in pipe(say(sent), voice=v.get("voice", "af_heart"), speed=v.get("speed", 1.0), split_pattern=None):
            a = r.audio.numpy().astype(np.float32); lead = 0.0
            if v.get("perSentence"):  # tighten Kokoro's edge silence so pauses come from sentenceGap/bridgePause
                idx = np.where(np.abs(a) > 0.012)[0]
                if len(idx):
                    a0 = max(0, idx[0] - int(0.05 * SR)); a1 = min(len(a), idx[-1] + int(0.09 * SR))
                    lead = a0 / SR; a = a[a0:a1]
            chunks.append(a)
            for tk in r.tokens or []:
                if tk.start_ts is not None: toks.append((tk.text, max(0.0, off + tk.start_ts - lead), off + tk.end_ts - lead))
            off += len(a) / SR
    line = np.concatenate(chunks); dur = len(line) / SR
    start = t; vstart = start + (PRE if i else 0.15) + (v.get("bridgePause", 0) if sc.get("bridge") else 0) + sc.get("pause", 0)
    end = vstart + dur + POST
    last = i == len(spec["scenes"]) - 1
    if last and "tail" in v:   # voice.tail: seconds held after the last word (replaces MIN + TAIL on the end card)
        end = max(end + v["tail"], start + v.get("endMin", 2.4))
    else:
        end = max(end, start + MIN.get(sc["type"], 0))
        if last: end += TAIL
    pad = int(round((vstart - (sum(len(x) for x in audio) / SR)) * SR))
    audio.append(np.zeros(max(pad, 0), np.float32)); audio.append(line)
    # caption words: attach punctuation tokens to the previous word
    for txt, a0, a1 in toks:
        if re.fullmatch(r"[^\w$]+", txt) and words and words[-1]["scene"] == i:
            words[-1]["text"] += txt; continue
        words.append({"text": txt, "start": round(vstart + a0, 3), "end": round(vstart + a1, 3), "scene": i})
    scenes.append({"start": round(start, 3), "end": round(end, 3), "voStart": round(vstart, 3), "voEnd": round(vstart + dur, 3)})
    t = end
    print(f"{i:2d} {sc['type']:13s} {start:6.2f}-{end:6.2f}  {sc['vo']}")
# caption display rules, e.g. ["Twenty-nine dollars", "$29"]: spoken words -> on-screen text
def clean(x): return re.sub(r"[^\w$]", "", x).lower()
for spoken, shown in v.get("captionMap", []):
    seq = [clean(x) for x in spoken.split()]; i = 0
    while i <= len(words) - len(seq):
        if [clean(w["text"]) for w in words[i:i + len(seq)]] == seq and len({w["scene"] for w in words[i:i+len(seq)]}) == 1:
            trail = re.search(r"[^\w$]*$", words[i + len(seq) - 1]["text"]).group(0)
            words[i:i + len(seq)] = [{"text": shown + ("" if shown.endswith(trail) else trail), "start": words[i]["start"],
                                      "end": words[i + len(seq) - 1]["end"], "scene": words[i]["scene"]}]
        i += 1
total = t
full = np.concatenate(audio); full = np.concatenate([full, np.zeros(max(0, int(total * SR) - len(full)), np.float32)])
os.makedirs(f"{root}/remotion/public/{vid}", exist_ok=True); os.makedirs(f"{root}/props", exist_ok=True)
sf.write(f"{root}/remotion/public/{vid}/vo.wav", full, SR)
json.dump({"total": round(total, 3), "fps": FPS, "scenes": scenes, "words": words}, open(f"{root}/props/{vid}.timing.json", "w"), indent=1, ensure_ascii=False)
print(f"total {total:.2f}s, {len(words)} caption words")
