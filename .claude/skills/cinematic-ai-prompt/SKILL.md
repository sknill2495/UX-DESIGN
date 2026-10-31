---
name: cinematic-ai-prompt
description: Writes production-grade prompts for photoreal AI images and AI video (Higgsfield, Seedance, Kling, Veo, Runway, Sora-class models that take reference images). Use whenever the user asks for a "prompt" for a realistic picture, photo, character, location, video, shot, scene, reel, ad, or short film, or hands over a voice-over / story script and wants it turned into character prompts, location prompts and scene-by-scene video prompts. Also use when the user shares an AI video plus its prompt and asks what went wrong or how to improve it.
---

# Cinematic AI Prompt

Turn an idea or a script into prompts that a reference-driven video model can execute in one generation, with locked identities, readable blocking and directed acting.

Worked example at full quality: `references/example-twins-v2.md`.

The method is reverse-engineered from a 16 s, 1280x720, 24 fps Higgsfield generation (twins + mother + VR headsets, golden-hour living room). That prompt mostly worked; where the output disobeyed it, the cause is documented in `references/failure-modes.md`. Read that file before writing any video prompt. The rules there were learned from real failures.

## Pick the mode

| User asks for | Mode | Deliver |
|---|---|---|
| A realistic picture / photo / still | IMAGE | One image prompt (`references/image-prompt.md`) |
| A character | CHARACTER | Turnaround-sheet prompt (`references/asset-sheets.md`) |
| A place / set | LOCATION | 6-panel location-sheet prompt (`references/asset-sheets.md`) |
| A single video shot or scene | SHOT | One video prompt in the 14-block format (`references/video-prompt-template.md`) |
| A voice-over script / story | STORY | The full package below |

## STORY mode: script to full package

Deliver these in this order. Everything later depends on what comes earlier.

1. **Story read (3-5 lines).** State the emotional spine in one sentence, the turn (the single moment the meaning changes), and the target runtime. If the script implies more than ~8 shots per minute of voice-over, say so and merge.
2. **Continuity bible (table).** One row per character: token slot, name, age, 3 locked identity tags (face/hair/accessory), wardrobe with exact colours, a prop colour if they own one, and a default screen side. Twins and look-alikes need at least two differentiators that stay visible from every angle, for example glasses + shirt colour + seat side. Do not rely on a facial detail alone, such as braces.
3. **Character sheet prompts.** One per character, using the turnaround template.
4. **Location sheet prompts.** One per set, using the 6-panel template, and the same time of day and light direction that the scenes use.
5. **Shot list (table).** Shot #, duration (5-15 s; prefer 8-10 s), the VO line it covers, the visual beat, the camera, and the references used.
6. **Scene-by-scene video prompts.** One full 14-block prompt per shot. Each prompt has to stand alone, because the model has no memory between generations. Repeat the identity lines and the location map in every prompt; never write "same as above".
7. **Start-frame prompts (optional but recommended).** For any shot whose first frame matters, give an IMAGE prompt for frame 0 so the user can run image-to-video. This is the only reliable way to defeat an empty establishing frame and wrong opening positions.
8. **Audio note.** Say whether the VO is laid in post (then: "No dialogue, no lip movement toward camera, ambient room tone only") or spoken on camera (then quote the exact lines with timestamps).

## Core rules (apply in every mode)

- **Bind each name to its token once, then keep using both together.** Write `<<<image_2>>> JACK` everywhere. In the source prompt "Jack/Noah" and the tokens were never formally bound, and the model had to guess.
- **Describe in screen terms, not story terms.** Use "screen-left", "nearest camera", "furthest left in frame". Never write "leads" or "behind" without a direction.
- **Beat density.** Use at most 1 beat per 1.5-2 s. With 10 beats in 16 s the model compresses or drops beats. Put the emotional turn in its own beat with breathing room.
- **Name the change point.** For acting arcs, give stages with time ranges, add "NOT X" guards before the turn, and add "the change happens HERE".
- **Every spatial instruction needs a path.** "Crouches between them" fails unless you also say how she gets there: "walks around the table's left end, kneels on the rug at frame-centre".
- **Make identity features visible in every frame.** For example: "glasses ON in every frame including the run". Otherwise the model drops them during motion.
- **Close with a restatement block.** The source prompt's POSITIVE CONSTRAINTS recap measurably anchored the seat order, headset colours and kiss target, which all came out correct.
- **Prefer positive phrasing**, then add a short negative list. Models obey "exactly three people" better than "no extra people" alone.
- **Use real optics language:** FOV in degrees or focal length on a named format, camera height, and lens character. Avoid adjectives like "epic".
- **No brand names or real people** in prompts. Write "VR headset", not a product name.

## Output style

Use plain headers and copy-paste-ready blocks in fenced code blocks, one block per prompt. Add no commentary inside the prompt. After a SHOT or STORY package, add a 3-line "Risk check" that names the beats most likely to fail and the mitigation for each, taken from `references/failure-modes.md`.
