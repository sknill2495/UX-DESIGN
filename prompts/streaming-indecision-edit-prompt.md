# MASTER EDIT PROMPT — "Split-Screen UI Explainer" style, adapted to the *streaming-indecision* mini-film

> Paste everything below the line into Claude Opus 5.5 **in Claude Code** (it has to run ffmpeg, a transcriber and Remotion; a plain chat cannot render video).
> Attach: `SOURCE.mp4` (the 36 s couch / remote / clock / phone film) and, if you still have it, `REFERENCE.mp4` (the "5 AI workflows" split-screen video).
> **Fill the four `{{…}}` variables in §0.1 before pasting.** Everything else is measured from the file.

---

## 0. ROLE AND DELIVERABLE

You are a senior short-form motion designer and Remotion engineer. Edit `SOURCE.mp4` so that it uses the editing language of `REFERENCE.mp4`: one-word captions, light UI cards on a dot-grid panel, highlighter wipes, ticks, counters, carousels, reaction stickers and a persistent yellow CTA keyword. Re-skin that language in a palette taken from SOURCE's own footage.

SOURCE is **not a talking head**. It is a 13-shot narrative ad with sparse dialogue. The reference's 90 % split-screen ratio would hide the story (TV screens, wall clock, phone), so this edit uses split-screen **only where the story is "inside his head"** and stays full-bleed where the footage itself carries the beat. Do not "fix" this back to 90 % split.

Deliver:
1. A Remotion project (TypeScript, React) with one composition `Main`, **1080×1920, 30 fps, 1086 frames (36.2 s)**.
2. `out/final.mp4` (H.264, CRF 18, AAC 192 kbps, yuv420p).
3. `out/review/` with the stills listed in §9.
4. `EDIT_NOTES.md` listing every deviation from this spec, with the reason for each.

Do not ask questions you can answer by inspecting the file. Ask only about what §0.1 leaves unfilled, or if a check in §1 fails.

### 0.1 Variables (the person commissioning the edit fills these)

| Variable | Meaning | Example |
|---|---|---|
| `{{APP_NAME}}` | Product shown on the phone in the last shot | "PickFlix" |
| `{{APP_PROMISE}}` | The 3–6 word benefit line | "Your pick in 10 seconds" |
| `{{CTA_KEYWORD}}` | Persistent outro keyword (URL, handle or app name) | "pickflix.app" |
| `{{CAPTION_LANG}}` | Caption script if the dialogue is not English: `english`, `hinglish-roman` or `devanagari` | `hinglish-roman` |

If any of these is still a literal `{{…}}`, **stop and ask**. Never invent a brand name or URL.

---

## 1. SOURCE FACTS (measured; verify, don't trust blindly)

- Container: H.264 720×1280, **30 fps**, 36.20 s, AAC 48 kHz stereo. It is a WhatsApp re-encode at about 2.7 Mbps.
- The footage is AI-generated (there is a ✦ watermark bottom-right, at about x 660–690 / y 1220–1250 of the source frame). **Cover or crop the watermark in every frame**: in Modes A and C, scale 1.0 fit-to-width plus a 1.04 crop-in moves it off-canvas. Log the method you use.
- Upscale: 720 → 1080 is 1.5×. Apply Lanczos and a light unsharp mask (`0.6 radius, 0.35 amount`). If a cleaner master exists (the original generator export), ask for it **before** rendering final. Note the softness in `EDIT_NOTES.md`.
- **Third-party marks are visible in the footage**: a Netflix wordmark on the TV around 20–24 s, plus a Netflix-style red/black grid UI and a branded remote button. Never reproduce these in graphics: no "Netflix" text, no red-on-black tiles, no N logo. The cards show a **generic streaming UI**. Flag in `EDIT_NOTES.md` that the footage itself shows the mark, so the client can decide whether to blur it (provide a `blurTrademark` boolean prop, default `false`, that applies an 18 px Gaussian blur to the TV region in shot S12).
- Integrated loudness is −18 LUFS, LRA 11.5. The source already contains **remote clicks (≈ 6–10 s), phone taps and a rising chime/music sting (≈ 29.6–36.2 s)**.

### 1.1 Shot list (scene threshold 0.25; re-run and correct to the frame)

| Shot | In – Out (s) | Content | Subject of interest for reframing |
|---|---|---|---|
| S1 | 0.00 – 1.90 | Wide, laughing on sofa, lamp and bookshelf | face (high, ≈ 20 % y) |
| S2 | 1.90 – 3.90 | Medium, raises remote, talking | face |
| S3 | 3.90 – 5.33 | Over-shoulder: TV "Comedy" row | TV screen |
| S4 | 5.33 – 6.83 | POV remote close-up, TV blurred behind | remote / thumb |
| S5 | 6.83 – 8.27 | Over-shoulder: "Thriller" / "Action" rows | TV screen |
| S6 | 8.27 – 9.90 | Close-up face, TV-lit glasses, talking | face |
| S7 | 9.90 – 12.03 | Over-shoulder: "Trending Now" / "Sci-Fi Hits" | TV screen |
| S8 | 12.03 – 13.50 | Wide, smiling, remote out | face |
| S9 | 13.50 – 15.00 | Medium, frowning, TV glow | face |
| S10 | 15.00 – 17.00 | Wince, explosion on TV behind him | face |
| S11 | 17.00 – 20.33 | Hand on head, exasperated | face |
| S12 | 20.33 – 28.17 | Wall clock **9:10** → tilt down → ghosted time-lapse dissolves → clock **10:00**, bored, looks up | clock, then face |
| S13 | 28.17 – 36.20 | Phone in hand, smiling, tapping (8 s static) | face + phone |

The clock reads 9:10 and later 10:00, so **50 minutes pass on screen**. That is the story's payoff number; use it.

### 1.2 Speech map (energy-based; the words are unknown)

Speech-band activity sits at ≈ 0.8–2.1, 4.3–6.4, 7.1–8.2, 9.1–12.4, 12.4–20.5 (dense, mixed with SFX), 22.0–22.6, 23.1–24.6, 25.1–27.1 and 28.3–29.6 s. From 29.6 s to the end there is no speech, only taps and the chime.

**Step 1, mandatory:** transcribe with word timestamps (faster-whisper `small` or better, `language=None` for auto-detect). Save `transcript.json` as `[{word, start, end}]`. If the language is Hindi or Hinglish, caption according to `{{CAPTION_LANG}}`. If a burst turns out to be a murmur, laugh or sigh with no words, it gets **no caption**. Do not invent dialogue.

**Step 2:** check for burned-in captions on 1 fps contact sheets. None were seen in a visual read. If you find any, stop and ask.

**Step 3:** run face detection (MediaPipe, every 5 frames, smoothed). For S3/S5/S7, detect the TV screen as the largest bright quad. Save the results to `faces.json` / `rois.json`.

---

## 2. MODE MAP FOR THIS VIDEO

| Mode | Time (s) | Share | Why |
|---|---|---|---|
| A — HOOK | 0.00 – 3.90 (S1–S2) | 11 % | He is excited. Full-bleed, kinetic title promising the 50-minute payoff. |
| B — SPLIT EXPLAINER | 3.90 – 20.33 (S3–S11) | 45 % | The scroll and the frustration. Cards show what is in his head: genres piling up, picks rejected, fatigue rising. |
| A′ — FULL-BLEED COUNTER | 20.33 – 28.17 (S12) | 22 % | The clock *is* the graphic. A panel would cover it. Overlay a big counter only. |
| C — OUTRO CTA | 28.17 – 36.20 (S13) | 22 % | Product moment. Full-bleed, phone-UI card beside him, persistent `{{CTA_KEYWORD}}`. |

Hard cut between modes on the shot cut, never mid-shot.

Density targets, scaled from the reference to this runtime:
- Mode B: **a new card state every 1.4–2.0 s**, which matches the shot cadence, so ~9–11 states in 16.4 s. Nothing static for more than 2.5 s.
- Stickers: **3 total** in Mode B, plus 1 in the hook. His own facial reactions already do the reference's sticker job; more stickers would compete with him.
- Captions: exactly one word, the word being spoken now, in Modes B and C. In Mode A, captions are allowed only if they don't collide with the title block; otherwise put the spoken words into the title itself.
- **Each card illustrates the literal noun on screen or in speech.** Comedy row on TV → comedy chip. Clock → minutes. Phone → app.

---

## 3. COLOUR SYSTEM (sampled from SOURCE)

SOURCE is warm and amber-lit: beige/khaki walls (≈ `#725538` in shade, ≈ `#C8B08A` near lamps), near-black TV and shadows (`#080604`–`#0F1510`), and his sweater in forest green with mustard and maroon stripes plus a cream collar. Re-sample these yourself from S1, S8 and S13 and adjust the constants by at most ±8 % lightness if they're off.

The reference's white panel would create a hard luminance step into this mid-dark room. Use an **espresso panel with warm paper cards**, and take the accent from his sweater's mustard instead of pure lemon yellow. That ties the graphics to his wardrobe, the way the reference's butter yellow ties to her room.

```ts
export const T = {
  panel:        '#16110D', // espresso; fades invisibly into the TV-lit/shadow shots
  dot:          'rgba(255,240,220,0.07)',
  card:         '#F5EEE2', // warm paper, matches the cream collar
  cardStroke:   '#0D0B09', // 3 px
  ink:          '#14110E',
  muted:        '#7D7266',
  hairline:     '#DDD3C4',
  accent:       '#E8B23A', // sweater mustard, the ONLY accent
  accentSoft:   '#F7E3AE', // highlighter fill
  accentStroke: '#0D0B09', // 2 px around highlighter boxes
  captionOnPanel:   '#FFFFFF',
  captionOnFootage: '#FFFFFF',
  shadowHard:   '#16110D',
};
```

Rules:
- **One accent only.** No red: red also reads as the streaming brand you must avoid. No green or maroon in the graphics, even though they are in the sweater; they stay in the footage.
- Negative state = ✕ in `ink`, a strikethrough, or a flat line.
- Yellow appears only in three ways: the highlighter box, filled active chips/bars, and Mode A/A′/C display type. A soft glow (`0 0 18px rgba(232,178,58,0.45)`) is allowed only on display type.

---

## 4. TYPOGRAPHY

**Inter** via `@remotion/google-fonts/Inter`, weights 500–900. Sizes are at 1080 px wide.

| Element | Size | Weight | Tracking | Other |
|---|---|---|---|---|
| Mode B caption | 96 | 800 | −0.03em | white, no shadow |
| Hook giant word / number | 160–200 | 900 | −0.04em | line-height 0.85 |
| Hook secondary | 36–46 | 800 | −0.01em | |
| A′ counter number | 220 | 900 | −0.05em | `accent`, hard shadow 5/7 px `shadowHard`, tabular numerals |
| A′ counter label | 44 | 800 | −0.01em | white, shadow `0 4px 18px rgba(0,0,0,.55)` |
| Outro caption | 84 | 800 | −0.02em | shadow `0 4px 18px rgba(0,0,0,.55)` |
| Outro persistent keyword | 110 | 900 | −0.03em | `accent` + hard shadow 4/6 px, in ‘ ’ quotes, fit to 90 % width, never wrap |
| Card eyebrow | 20 | 700 | +0.12em | UPPERCASE, `muted`, 22 px line icon |
| Card title | 40 | 800 | −0.02em | `ink` |
| Card row | 30 | 600 | −0.01em | `ink` |
| Card meta | 22 | 500 | 0 | `muted` |
| Card big number | 150 | 900 | −0.05em | `ink`, tabular |

Captions never wrap. If a word is wider than 86 % of the canvas, scale it down.

---

## 5. LAYOUT (1080 × 1920)

### Mode B (3.90 – 20.33 s)
- **Panel:** y 0–710 solid `T.panel`, then a linear fade to 0 % between y 710 and y 920. Dot grid of 3 px dots at 28 px spacing, fading with the panel.
- **Footage reframe, per shot, from the subject of interest in §1.1:**
  - Face shots (S6, S8–S11): translate down so the face centre lands at **y ≈ 1200**. Crop the bottom freely.
  - Over-shoulder TV shots (S3, S5, S7): translate so the **TV screen's centre lands at y ≈ 1250**. The card is the "zoomed" version of what's on that TV, so the viewer sees both.
  - S4 (remote POV): place the thumb/remote at y ≈ 1300.
  - Scale ≤ 1.15× the fit-to-width scale (on top of the 1.5× upscale). If a shot needs more, flag it. Ease reframes across cuts over 0 frames (hard cut; the shots are different).
- **Card:** centred, 842 px wide, top at y 110, 380–480 px tall, 28 px radius, `T.card`, 3 px `cardStroke`, shadow `0 18px 50px rgba(0,0,0,0.5)`, 34 px padding.
- **Caption:** baseline locked at y 690 for the whole Mode B run.
- **Stickers:** footage zone only (y 950–1800), never over the face box + 40 px.

### Mode A (0 – 3.90 s)
Full-bleed with the watermark cropped. Title block at y 90–560. **His face sits at ≈ 18–28 % y in S1/S2**, which collides with a top title, so move the title block **lower** for this video: y 980–1450 (over his torso/sweater; the dark green holds white type well). Put small secondary text at y 860–960. Re-verify against `faces.json`.

### Mode A′ (20.33 – 28.17 s)
Full-bleed. The clock is top-right (≈ x 60–90 %, y 7–25 %) in the first half and his face is centre. Put the counter **lower-left**: number at x 80, baseline y 1560; label below at y 1630. Never overlap the clock or the face.

### Mode C (28.17 – 36.20 s)
Full-bleed. His face is at ≈ x 55–75 %, y 40–55 %, and the phone is at the lower left.
- **Phone-UI card** (see beat 6): 420 × 760 px, top-left at (60, 150), radius 44, 3 px stroke, so it sits above and left of his head.
- Caption at y ≈ 1000 if any words are spoken (expect only ≈ 28.3–29.6 s).
- Persistent keyword centred at y ≈ 1640 (lower, over the dark sweater), not the reference's 1120, because his face occupies the middle.

---

## 6. MOTION LIBRARY (frames @ 30 fps)

Build each of these as a reusable component. Use `spring()` or `Easing.bezier()` for every animation.

1. `<WordCaption>`: hard cut on word onset (−1 frame). Optional 4-frame scale pop 0.92 → 1.0 on at most one in four words (nouns, numbers).
2. `<CardEnter>`: new concept. Scale 0.86 → 1, opacity 0 → 1 over 9 f, `spring({damping:14, stiffness:220})`. The old card hard-cuts out.
3. `<CardCarousel>`: sibling states. 40 px gap, neighbour edges peek in, slide over 12 f, `bezier(0.22,1,0.36,1)`.
4. `<CardCamera>`: push-in 1.0 → 1.45–1.8 over 18–22 f, `bezier(0.65,0,0.35,1)`, recentring on the active element. Never cross y 710. Use it on about half the states.
5. `<Highlight>`: `accentSoft` rectangle with a 2 px stroke and 6 px radius, wiped left → right over 8–10 f, text on top.
6. `<Check>`: 28 px rounded box; the tick or ✕ draws in over 6 f.
7. `<ButtonPress>`: outline pill → scale 0.94 for 4 f → filled `ink` pill with "✓".
8. `<TypeOn>`: 28 chars/s, 2 px caret blinking every 20 f.
9. `<CountUp>`: 0 → target over 22–30 f, `bezier(0.16,1,0.3,1)`, with an optional square grid filling row by row.
10. `<Limit>`: pill meter that fills to a target, with a scale below it.
11. `<PosterStack>`: **new for this video.** Small poster tiles (100 × 148, 2 px stroke, flat `hairline`/`muted` fills with a 1-word genre label, no real titles, no red) drop into a stack with a 2 f stagger and ±3° rotation.
12. `<StreakIn>`: Mode A only. A 5 px white line sweeps across the row over 4 f, then the word snaps in from a 60 px offset with a 3 f stretched-duplicate motion blur.
13. `<Sticker>`: 230 px tile, 8 px white border, rotated ±4–8°. Spring in over 10 f, hold 36–60 f, out over 6 f. Use **original illustrated or royalty-free** reactions only: no cartoon characters, no screenshots from real films or shows.
14. `<FloatChips>`: hook only. 4 dark chips (`rgba(22,17,13,.75)`, 1 px 15 % white border) drift ±6 px.
15. `<ClockCounter>`: Mode A′. The number tracks the **visible clock's** minutes: it reads 0 when the clock shows 9:10 and 50 when it shows 10:00. Interpolate along the dissolves and sample the clock hands' angle from the footage if you can; otherwise map linearly from S12's first frame to its last frame showing 10:00.

### 6.1 Sound
- **The source already has remote clicks, phone taps and a chime sting.** Do not stack SFX on top of those moments. Add a whoosh (−18 dB) on each `StreakIn`, a soft pop (−20 dB) on each sticker, a UI click (−22 dB) on `Check`/`ButtonPress` **only where the source is silent**, and a soft clock tick-run (−24 dB) under `ClockCounter`.
- No music bed: the source's chime at 29.6 s is the musical payoff, so leave it clean.
- Normalise the mix to −14 LUFS integrated, −1 dBTP. Raise speech, don't compress the SFX into it.

---

## 7. BEAT PLAN

Anchor every event to `transcript.json` words where a matching word exists. Where no word exists (much of this film), anchor to **shot cuts** (from detection, ±0 frames) and to visible on-screen events (TV row change, clock hand position). The listed times are approximate.

### BEAT 0 — HOOK, Mode A (0.00 – 3.90, S1–S2)
- f0: mustard tile (190 px, radius 26, rotated −6°, 3 px `ink` stroke, hard shadow) containing a ▶ play glyph pops in at (150, 1000).
- f6: `StreakIn` **"MOVIE NIGHT"** (white, 900, 120 px) to the right of the tile.
- f14: small **"spent"** (44 px) above a giant **"50 min"** (200 px, `accent` on an `ink` bar), streaking in from the left at y ≈ 1250.
- f22: thin white **"choosing. 0 min watching."** (40 px) under it.
- On the S1→S2 cut (1.90 s): one sticker (popcorn, original illustration) lands overlapping the tile's right edge.
- `FloatChips` around his torso throughout; they must avoid the face.
- Captions: only if speech in 0.8–2.1 s fits without colliding; otherwise skip them in this mode.
- Hard cut to Mode B at 3.90.

### BEAT 1 — "The scroll begins" (3.90 – 6.83, S3–S4)
- Card eyebrow `▦ TONIGHT · BROWSING`. Title **"What should I watch?"** with a highlight wiping on enter.
- `PosterStack` drops 6 tiles labelled COMEDY on the S3 cut.
- S4 cut (5.33): `CardCamera` pushes into the stack at 1.5×, and a counter chip "Titles seen: 0 → 24" ticks in the corner.

### BEAT 2 — "Genre hopping" (6.83 – 9.90, S5–S6)
- Carousel to the sibling card: a genre chip row `Comedy · Thriller · Action · Sci-Fi · Trending`. On the S5 cut, **Thriller** and **Action** fill `accent` one after another (2 f stagger). The counter continues 24 → 61.
- S6 (close-up face, 8.27): carousel to a card titled **"Added to My List"** with 3 rows, each getting a ✓, and a meta line "Watched: 0".

### BEAT 3 — "Everything, nothing" (9.90 – 13.50, S7–S8)
- New concept: big counter card, eyebrow `⌕ TITLES SCROLLED`. `CountUp` 61 → **140+** with the square grid filling.
- Highlight "140+" when the count lands. `CardCamera` pushes in at 1.6×.
- S8 (12.03, he smiles again): a sub-line types on: "still nothing to watch".
- Sticker on the S8 cut: an original "eyes darting" illustration.

### BEAT 4 — "Rejecting everything" (13.50 – 17.00, S9–S10)
- New concept: eyebrow `✕ TONIGHT'S PICK`. Checklist `Too long`, `Seen it`, `Not in the mood`, `Too intense`. Each row gets ✕ + strikethrough on S9 cut, +12 f, +24 f, and on the **S10 cut** (the explosion: "Too intense").
- Sticker on S10: an original "cringe face" illustration, on the left side, away from his face.

### BEAT 5 — "Decision fatigue" (17.00 – 20.33, S11). This is the turning point; weight it heaviest.
- Eyebrow `▮ DECISION FATIGUE`. A `Limit` meter fills 0 → **100 %** over 30 f on the S11 cut. The scale reads "fine … tired … done".
- On the next speech onset, or +45 f: highlight "done". `CardCamera` pushes into the filled end at 1.7×.
- No sticker. Let it land.
- Hard cut to Mode A′ at 20.33.

### BEAT 5′ — "Time lost", Mode A′ (20.33 – 28.17, S12)
- No panel. `ClockCounter` lower-left: **"0"** → **"50"** in sync with the clock, label **"minutes scrolling"**.
- When the clock first reads 10:00, the number pops (scale 1.12 → 1.0 over 6 f) and a second label types on beneath it: "0 minutes watching".
- Captions at y ≈ 1000 for any spoken words in 22.0–27.1 s, white, outro-caption style.
- Ghosted dissolves are in the source. Keep the overlay **steady** through them; do not dissolve the graphics.

### BEAT 6 — Solution + CTA, Mode C (28.17 – 36.20, S13)
- On the S13 cut: the phone-UI card enters (`CardEnter`). Its contents:
  - Top bar: `{{APP_NAME}}` in 30 px 800.
  - `TypeOn`: "What are you in the mood for?" → answer chip "Something light, under 2 hrs" (filled `accent`).
  - A single result poster tile (generic, flat), and a **"Play"** `ButtonPress` that fires on the first audible tap at ≈ 29.7 s, synced to the source's tap SFX. Find the transient and match it to the frame.
  - A meta line types on: `{{APP_PROMISE}}`.
- Persistent keyword **‘{{CTA_KEYWORD}}’** appears in sync with the chime's first note (≈ 33.0 s; find the onset) and stays to the last frame.
- Optional: a thin white underline draws under the keyword over 10 f, 1 s before the end.
- End on the last frame of S13. No end card, no logo sting.

---

## 8. HARD RULES

1. No graphic over a face box + 40 px margin, ever. Check every frame programmatically.
2. Never more than one caption word on screen.
3. Every card state changes visibly within its first 15 frames.
4. Concept changes happen on shot cuts. Siblings inside a shot use the carousel.
5. The panel boundary (710/920) and caption baseline (690) stay locked across all of Mode B.
6. Do not reproduce trademarks, logos, real film titles or a red-on-black streaming look. Stickers must be original or royalty-free.
7. **Do not cut dead air.** The silences are part of the narrative (time-lapse, frustration). Output keeps the full 36.2 s and the original audio timing.
8. Output is exactly 1080×1920, 30 fps, 1086 frames.
9. The ✦ watermark must not be visible on any frame.

---

## 9. SELF-REVIEW LOOP (before the final render)

Render stills (`npx remotion still`) at: f0, the last frame of the hook, the first Mode B frame, the midpoint of every beat, every `CardCamera` peak, each sticker peak, the first A′ frame, the frame where the clock reads 10:00, the first Mode C frame, the ButtonPress frame, the keyword's first frame, and the last frame. Save them to `out/review/`. For each still, check:
- Caption single, readable, at its locked position?
- Card inside the panel and above y 710?
- Face clear? Clock clear in A′? Watermark gone?
- Highlight sitting exactly behind its phrase?
- Colours only from `T`, with no red anywhere in the graphics?
- Same design system as the reference stills at 3.2 s, 14.3 s and 37.5 s?

Fix everything, re-render the stills, then render `final.mp4`. Watch it at 1× and log in `EDIT_NOTES.md` any trigger more than 2 frames off its anchor (word, cut, tap or chime). Fix those triggers, then re-render.

---

## 10. PROJECT STRUCTURE

```
src/
  Root.tsx  Main.tsx  theme.ts
  beats.ts            // [{anchor: {type:'cut'|'word'|'sfx', ref}, mode, card, stickers}]
  layout/Panel.tsx  layout/FootageFrame.tsx   // per-shot ROI reframe + watermark crop
  text/WordCaption.tsx  text/StreakIn.tsx  text/PersistentKeyword.tsx  text/ClockCounter.tsx
  cards/Card.tsx  cards/CardCarousel.tsx  cards/CardCamera.tsx  cards/PhoneCard.tsx
  cards/parts/{Row,Chip,Check,Highlight,ButtonPress,TypeOn,CountUp,SquareGrid,Limit,PosterStack}.tsx
  fx/Sticker.tsx  fx/FloatChips.tsx
public/
  SOURCE.mp4  transcript.json  shots.json  faces.json  rois.json  onsets.json  stickers/*  sfx/*
```

Drive every timing from `shots.json` (cut frames), `transcript.json` (words) and `onsets.json` (tap and chime transients from `librosa.onset`). Never hard-code seconds.
