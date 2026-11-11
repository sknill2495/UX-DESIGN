# MASTER EDIT PROMPT: "Split-Screen UI Explainer" style for the *POV: Buying a notebook to become organised* reel

> Paste everything below into Claude Opus 5.5 **in Claude Code**. It has to run code, so it will not work in a plain chat. Attach `SOURCE.mp4` (the notebook POV reel). Attach `REFERENCE.mp4` (the "5 AI workflows" split-screen video) if you have it. If you don't, §2 is the style bible.

---

## 0. ROLE AND DELIVERABLE

You are a senior short-form motion designer and Remotion engineer. Edit `SOURCE.mp4` so it follows the editing language of the reference: **hook (full-bleed) → split explainer (dark top panel with an animated UI card, one-word caption, footage below) → outro (full-bleed with a persistent keyword)**. Re-skin it in colours taken from SOURCE.

Deliver:
1. A Remotion project (TypeScript/React) with one composition `Main`: 1080×1920, **30 fps** (SOURCE's native rate), **1205 frames (40.17 s)**.
2. `out/final.mp4`: H.264 CRF 18, yuv420p, AAC 192 kbps. Speech loudness-normalised to −14 LUFS integrated, −1 dBTP.
3. `out/review/`: the stills listed in §9.
4. `EDIT_NOTES.md`: every deviation from this spec and the reason for it.

Don't ask questions you can answer by inspecting the file.

---

## 1. SOURCE FACTS (already measured; re-verify with ffprobe)

| Property | Value |
|---|---|
| Resolution / fps | 720×1280, 30 fps, H.264 + AAC |
| Duration | 40.19 s |
| Language | **Hindi/Hinglish** voice-over; the closing CTA line is in English |
| Shots | 15 cuts: 4.97, 6.20, 7.23, 8.40, 9.57, 10.97, 13.67, 20.07, 21.07, 21.80, 23.47, 23.97, 24.37, 25.03, 30.10 s |
| Set / look | Warm walnut bookstore and study, tungsten practicals; bottle-green rugby shirt with mustard and maroon stripes; cream paper, pastel stationery |

**The burned-in captions are already in the file.** Don't ask for a clean master: work with them.

| Burned text | Time | Source y (of 1280) | Handling |
|---|---|---|---|
| "POV: Buying a notebook to become organised." | 0 – 4.97 s | 6 – 12 % | Mode A. Keep it. Place no graphics over it. |
| "NEW NOTEBOOK. NEW ME." (serif) | 9.5 – 13.5 s | 84 – 87 % | Mode B. Pushed off-canvas by the footage offset (§5). |
| "बस नोटबुक्स का कलेक्शन बढ़ गया!" | 35.25 – 37.0 s | ≈ 70 % | Mode C. Keep it. Add no caption while it is on screen. |
| "If this is you, share it with someone who understands!" | 38.0 s – end | ≈ 70 % | Mode C. Keep it. Add no caption. |

### Transcription
Whisper `small` handles this Hindi speech poorly in `transcribe` mode. Run it with `task="translate"` to get the meaning and the segment timings. Then transcribe each speech clip on its own (`language="hi"`) to get word onsets. Captions are written in **romanised Hinglish**. Use this script and re-anchor each word to the measured onsets:

```
0.79  Bas, ab life organised hone wali hai, is baar sab kuch likhunga!
5.27  Monday se daily planning, expense tracking, gym routine, reading habit…
11.25 sab kuch ekdum systematic.
13.62 Par ek problem hai… ki first page kharab nahi hona chahiye.
17.92 Itna khoobsurat notebook hai!
21.94 Toh rough work ke liye alag notebook, important kaam ke liye alag, aur planning ke liye!
26.4 – 33.8  (no speech: montage, then a silent stare)
33.84 Organised toh nahi hua, bas notebooks ka collection badh gaya.
37.88 If this is you, share it with someone who understands.
```

If the network blocks Hugging Face, the CTranslate2 whisper-small weights are published on npm as `@skillninja/shortmovie-telop-model-p0…p3`. Concatenate the parts and verify the sha256 against `model.sha256`.

---

## 2. STYLE BIBLE (from the reference)

| Mode | Here | What it is |
|---|---|---|
| A: HOOK | 0 – 4.97 s | Full-bleed footage, kinetic display words, a rotated accent tile, floating UI chips, stickers |
| B: SPLIT EXPLAINER | 4.97 – 33.84 s | Dark panel (y 0–710, fades out by y 920) with a dot grid; an animated UI card; one-word caption at baseline y 690; footage below; reaction stickers |
| C: OUTRO | 33.84 s – end | Hard cut to full-bleed footage; a persistent yellow keyword in quotes |

Density targets:
- A new card state every 1.5–3 s. Never leave a static card on screen for more than 3 s.
- A sticker about every 3.5 s, alternating sides, never over the face.
- The caption is **exactly one word**: the word being spoken now, hard-swapped on its onset −1 frame.
- The card shows the **literal noun** being spoken.

---

## 3. COLOUR SYSTEM (re-derived for this footage)

The navy palette in the StoryBrand prompt does not fit this footage, which is warm walnut and green. Use:

```ts
export const T = {
  panel: '#15110E',            // espresso; matches the footage's shadows, so the fade is invisible
  dot: 'rgba(255,240,220,0.07)',
  card: '#F6F0E4',             // warm paper (matches the notebooks)
  cardStroke: '#0B0B0C',
  ink: '#121212',
  muted: '#7A726B',
  hairline: '#D8D0C4',
  accent: '#F2C230',           // the mustard stripe on his shirt, brightened
  accentSoft: '#FBEDB0',       // highlighter fill
  accentStroke: '#0B0B0C',
  shadowHard: '#15110E',
};
```

Use one accent only. Show a negative state with ✕, a strikethrough or a flat line, never with red. A yellow glow `0 0 18px rgba(242,194,48,.45)` is allowed only on display words in Modes A and C.

## 4. TYPOGRAPHY
Use Inter for everything. Load it from `@fontsource/inter` (npm), because Google Fonts can be blocked. Sizes: Mode B caption 96/800; hook display 148–170/900; outro caption 84/800; outro keyword 120/900 scaled to fit 90 % of the width; card eyebrow 20/700 +0.12em uppercase with a 22 px line icon; card title 40/800; row 30/600; meta 22/500; counter 150/900 tabular. Never wrap a line.

## 5. LAYOUT
- **Mode B footage:** fit to width (720→1080, ×1.5), then **translate down 560 px**. This one move puts his face at y ≈ 1100–1250, sends "NEW NOTEBOOK. NEW ME." off the bottom of the canvas, and buries the top of the frame under the opaque panel. No extra scale is needed, so the footage stays sharp. Keep the offset constant for the whole Mode B run.
- **Card:** 842 wide, top y 110, radius 28, 3 px stroke, shadow `0 18px 50px rgba(0,0,0,.45)`, padding 34. Clip the camera viewport at y 600 so a pushed-in card never touches the caption.
- **Mode B caption:** baseline y 690.
- **Mode A:** the burned POV title sits at y 108–240 and his face at y 300–900. Put the kinetic block lower-middle (y 1180–1460) and the accent tile at the left edge (x 52, y 800).
- **Mode C:** the face fills y 300–1000. **Move the caption and keyword below the chin** (caption baseline y ≈ 1190, keyword y ≈ 1080–1200). The burned captions start at y ≈ 1330. The reference's y 770 position would sit on his face here.

## 6. MOTION LIBRARY (frame counts at 30 fps)
- Card enter: spring scale 0.86→1, opacity 0→1, 9 f. Hard cut on concept change.
- Carousel for sibling states: 40 px gap so the neighbouring cards peek in; slide over 12 f with `bezier(.22,1,.36,1)`.
- Camera push-in: 20 f with `bezier(.65,0,.35,1)`, scale 1.35–1.7×, centred on the row being spoken.
- Highlighter wipe: 9 f, behind the text.
- Tick and ✕: draw over 6 f.
- Count-up: 24–30 f with `bezier(.16,1,.3,1)`, with a square grid that fills in sync.
- Bars: stagger 2 f.
- Nodes: dashed connectors with an animated dash offset.
- Limit slider: 14 f.
- Hook StreakIn: a white line sweeps the row in 4 f, then the word snaps in from −60 px with 2 f of blur.
- Stickers: 230 px tile, 8 px white border, rotated ±5–8°. Spring in over 10 f, hold 34–50 f, shrink out over 6 f.
- Floating chips: hook only, 5 chips, sine drift of ±6 px.
- **Stickers are original illustrated faces** (mustard circle with ink features plus a 1-word label). Use no third-party characters. Keep the reactions understated.
- SFX (synthesise with ffmpeg if no library is available): whoosh on each streak, pop on each sticker, click on each tick or ✕, a tick-run under count-ups, a thud on the turning-point push.

## 7. BEAT PLAN

**BEAT 0: HOOK, Mode A (0 – 4.97 s)**
- f0: a mustard "DAY 1" tile (190 px, −6°, hard shadow) springs in on the left.
- f8: an "new me" heart-eyes sticker (150 px) overlaps the tile.
- [life]: streak, then white "ab life" (60 px).
- [organised]: **"organised"**, 148 px, mustard on an ink bar.
- [hone]: "hone wali hai." (38 px).
- [is]: block swap to "is baar" (44 px).
- [sab]: giant white **"sab kuch"** (168 px, 4 px ink outline, hard shadow).
- [likhunga]: a mustard "likhunga." pill.
- Floating chips run throughout. A "haul" ₹-eyes sticker appears at 3.0 s.
- Hard cut to Mode B at the 4.97 s shot cut.

**BEAT 1: The master plan (4.97 – 13.5 s)**
- Eyebrow `NEW ME · FROM MONDAY`. Title highlighted on [Monday]: **"The master plan"**.
- Rows: `1 Daily planning`, `2 Expense tracking`, `3 Gym routine`, `4 Reading habit`. On [planning], [expense], [gym] and [reading], that row's chip fills, a ✓ draws, and the camera pushes to 1.5× on that row. Pull out on [habit].
- [sab] (11.25): carousel to the sibling card `ORGANISATION LEVEL`, "Life: ekdum systematic" (highlighted on [ekdum]). A 0 → 100 % counter and slider fire on [systematic].
- Stickers: "aesthetic" at 7.4 s; "sure…" side-eye at 10.7 s.

**BEAT 2: One small problem (13.5 – 17.6 s)**
- Eyebrow `ONE SMALL PROBLEM`. Title "Par ek **problem** hai…" (highlight on [problem]).
- A ruled notebook page labelled **PAGE 1** with "must stay perfect" underneath.
- On [first]: push to 1.7× on PAGE 1 and highlight it.
- On [kharab], [nahi] and [chahiye]: ✕ and strike `Scribbles`, `Cutting` and `Messy writing`, panning to the rows. Pull out at 17.15 s.
- Sticker: "uh oh" shock on [problem].

**BEAT 3: Too pretty to use (17.6 – 21.6 s)**
- Eyebrow `NOTEBOOK REVIEW`. An accentSoft tile holding a notebook illustration and **"Too pretty to use"** (highlighted on [notebook]).
- Five stars fill on [khoobsurat]. Sparkles twinkle.
- At 20.3 s, on the shot cut, a stamp **"PAGES USED: 0"** hits with a thud.
- Sticker: "too pretty" sweat face on [khoobsurat].

**BEAT 4: One person, many notebooks (21.6 – 26.45 s)**
- Eyebrow `ONE PERSON · MANY NOTEBOOKS`. A centre node **"Just me / 1 brain"**, highlighted on [alag].
- Satellites with dashed flowing connectors: `Rough work` on [rough], `Important` on [important], `Planning` on [planning]. Then `Ideas`, `Doodles` and `Maybe later` cascade in on [liye].
- Sticker: "one more?" thinking face on [important].

**BEAT 5: The haul vs the usage (26.45 – 30.1 s, no speech)**
- Eyebrow `NOTEBOOKS OWNED`. Count 0 → **12** with a 12-square grid filling. Highlight at 27.5 s; push to 1.6× at 27.7 s; pull out at 28.45 s.
- 29.0 s: carousel to `PAGES ACTUALLY WRITTEN`: **1 page (it's perfect)**, one square filled, a 2 px wobble.
- Sticker: "bro." facepalm at 27.0 s.
- No caption here, because nothing is spoken.

**BEAT 6: TURNING POINT, Organised +0 % (30.1 – 33.84 s, silent stare)**
- Eyebrow `ORGANISED · LAST 8 WEEKS`. Eight equal low bars; the last is mustard, labelled **+0%**.
- Push to 1.7× on the last bar at 31.0 s, with a thud. A dashed flat line draws across at 32.2 s; pull out.
- No sticker. Let the beat land.

**BEAT 7: OUTRO, Mode C (33.84 s – end)**
- Hard cut to full-bleed footage.
- One-word captions for "Organised toh nahi hua, bas" only, from 33.84 to 35.2 s, at baseline y 1190.
- On [collection]: the persistent keyword **‘notebook collector’** appears (mustard, hard shadow, glow) and stays to the last frame.
- Sticker: "same" on [toh].
- End on the source's last frame. No end card.

## 8. HARD RULES
1. Keep graphics off the face plus a 40 px margin. Check this on the stills for every beat.
2. Never show two caption systems at once. Your captions must never overlap the burned ones.
3. Every card state must show visible motion within its first 12 frames.
4. Change card concepts on sentence boundaries. Sibling states use the carousel.
5. Lock the panel edge, the caption baseline and the footage offset for the whole Mode B run.
6. Use no copyrighted characters as stickers.
7. Don't alter the voice or the timing. Don't trim the source.
8. Output exactly 1080×1920 at the full source duration.

## 9. SELF-REVIEW
Render stills at these points: the hook's first and last frames; the first Mode B frame; the midpoint of every beat; every camera-push peak; three sticker frames; the first Mode C frame; and the last frame. For each one, check that:
- the caption is a single word at the locked baseline;
- the card stays above y 600;
- the face is clear;
- the highlight sits behind its phrase;
- only colours from `T` are used;
- no burned caption collides with a new graphic.

Fix any problem, render again, and then produce the final render.
