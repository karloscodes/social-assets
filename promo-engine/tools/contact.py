#!/usr/bin/env python3
"""Contact sheet: python tools/contact.py out.png img1.png img2.png ... [--cols 4 --w 360]"""
import sys, argparse
from PIL import Image, ImageDraw
ap = argparse.ArgumentParser(); ap.add_argument("out"); ap.add_argument("imgs", nargs="+"); ap.add_argument("--cols", type=int, default=4); ap.add_argument("--w", type=int, default=360)
a = ap.parse_args()
ims = [Image.open(p).convert("RGB") for p in a.imgs]
w = a.w; h = int(ims[0].height * w / ims[0].width); pad = 10
rows = (len(ims) + a.cols - 1) // a.cols
sheet = Image.new("RGB", (a.cols * (w + pad) + pad, rows * (h + pad) + pad), (40, 40, 40))
for i, im in enumerate(ims):
    t = im.resize((w, h), Image.LANCZOS); x = pad + (i % a.cols) * (w + pad); y = pad + (i // a.cols) * (h + pad)
    sheet.paste(t, (x, y))
sheet.save(a.out)
