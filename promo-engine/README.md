# promo-engine

Faceless promo videos from a script file. Kokoro reads the narration; Remotion renders motion graphics with
captions timed word by word; a vector mascot; animated diagrams; short shots of the product in a phone.

## Make a video
```bash
cd /workspace/promo-engine
python3 make.py videos/suppyhq-v1.json               # 1080x1920 -> out/suppyhq-v1-vertical.mp4
python3 make.py videos/suppyhq-v1.json --horizontal  # also 1920x1080 -> out/suppyhq-v1-horizontal.mp4
python3 make.py videos/suppyhq-v1.json --skip-tts --still 3 10.5   # quick PNG stills in out/stills/
```
Rendering takes about 30 s per orientation on this box. The first time, Remotion downloads its own headless Chrome.

## The next video (e.g. LogNorth)
1. Put the assets in `remotion/public/lognorth/` (logo.svg, product card PNGs; to grab cards see `/workspace/promo/suppyhq/capture_cards.py`).
2. Copy `videos/suppyhq-v1.json` to `videos/lognorth-v1.json` and change `id`, `brand` (name, url, cta, logo, colors, mascot colors) and `scenes`.
3. Use only facts from the product's site. Run `python3 make.py videos/lognorth-v1.json --horizontal`.

### Scene types (`scenes[].type`). Each scene needs `vo` (the line it narrates).
| type | fields |
|---|---|
| `kinetic-text` | `lines[]`, `accentWords[]`, optional `big` (the line shown huge; a $ number counts up), `dark`, `instant` (first line visible from frame 0) |
| `illustration` | `art: "overflowing-inbox"`, `labels[]`, `buried` |
| `diagram` | `diagram: "sort"` (`total`, `spam`, `spamLabel`, `topLabel`) · `"reply-link"` (`question`, `answer`, `badge`) · `"permission-gate"` (`agent`, `draft`, `send`, `owner`) |
| `diagram` (LogNorth, `diagrams/lognorth/`) | `"error-event"` (tail lines, error card + count, "1 issue" stamp, alert) · `"agent-mcp"` (agent asks, MCP link, matching lines light up in LogNorth and go back) · `"fix"` (diff, deploy line, errors to zero, uptime) · `"one-box"` (logs/errors/alerts/uptime in one server) |
| `mascot` | `pose: idle/sort/celebrate`, `chips[]` |
| `product-cut` | `image` (path in public/), `focus` (scroll offset; -0.2..1), optional `frame: "window"` + `url` (desktop app in a browser window instead of a phone). Keep these to 1.5–3 s and under 25% of the video |
| `end-card` | `tagline`, `pose` |
Brand options: `theme: "dark"` (dark background, light ink, `colors.onAccent` for text on the accent), `wordmark` (text logo, e.g. `[lognorth]` in IBM Plex Mono), `mascot: null` (no mascot; end card `pose: "none"`).
Any scene can set `captions: false`. Captions are off by default on `kinetic-text`, because that scene already shows the words.

Voice settings (`voice`): `speed`, `lexicon` (word -> IPA, e.g. `"SuppyHQ": "sˈʌpi ˈAʧ kjˈu"`),
`captionMap` (spoken words -> on-screen text, e.g. `["Twenty-nine dollars", "$29"]`). Scene lengths follow the narration.
Animations inside diagrams start on cue words (see `cue()` in `remotion/src/util.ts`).
New art: add a component under `remotion/src/scenes` or `remotion/src/diagrams` and map it in `pick()` in `Promo.tsx`.
The illustration and the diagrams are built for SuppyHQ; for another product, write new ones (same pattern).

## Layout and safe areas
Vertical: scene art sits from 7% to 63% of the height; captions sit from 65.5% to 80.5% of the height, between 7% from the left and 15% from the right. That keeps them clear of the TikTok/Reels bottom UI (about 15%) and the right-side button column.

## Files
- `tts/tts.py`: Kokoro narration, one pipeline call per scene line. Writes `remotion/public/<id>/vo.wav` and `props/<id>.timing.json` (scene slots and word timestamps).
- `remotion/src/`: `Promo.tsx` (scene series, transitions, audio), `Captions.tsx`, `Mascot.tsx` ("Suppy"), `Background.tsx`, `scenes/`, `diagrams/`.
- `tools/contact.py`: contact sheet from frames.

## Licenses (commercial use)
- Remotion: Remotion License. Free, including commercial use, for individuals and companies with up to 3 employees; bigger companies need a paid company license. https://www.remotion.dev/docs/license
- Kokoro-82M plus the af_heart voice: Apache-2.0. https://huggingface.co/hexgrad/Kokoro-82M · kokoro/misaki code: Apache-2.0
- Inter font: SIL Open Font License 1.1 · React: MIT
- The mascot, illustration and diagrams are original vector art drawn in code. The product cards are screenshots of suppyhq.com. There's no music.
