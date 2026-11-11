# EDIT_NOTES

These notes list where this edit departs from the original spec (`video-edit-prompt_2.md`) and the adapted spec (`PROMPT_notebook-pov.md`), and why.

## Mismatch between the spec and the footage
- The original prompt was written for a different video: a 73 s English talking head about StoryBrand, shot at 24 fps on a navy set. The attached file is a **40.19 s Hindi/Hinglish POV skit about notebooks, 720×1280 at 30 fps**. All of §7 (the StoryBrand beats) and the §3 navy palette were replaced. `PROMPT_notebook-pov.md` is the rewritten spec.
- No `REFERENCE.mp4` was attached. The style comes only from the written description in §2.

## Burned-in captions (spec §1.3 / §11)
- The source has four burned caption blocks. No clean master was requested; this edit uses the fallback.
- Mode B needed **no extra scale**. A constant 560 px downward translate pushes "NEW NOTEBOOK. NEW ME." off-canvas and the panel covers the top band. The footage stays at fit-to-width, so no shot is degraded and no unsharp mask was applied.
- Mode A keeps the burned POV title and adds no captions. The new graphics sit below it.
- Mode C keeps the burned Hindi line and CTA. One-word captions run only from 33.84 to 35.2 s, before the burned Hindi line appears. A persistent keyword (‘notebook collector’) was added even though the fallback says to skip it. The source has no burned keyword pill, and the keyword sits clear of the burned text: it spans y 1080–1200, and the burned text starts at y ≈ 1330.

## Layout deviations
- In Mode C the caption and keyword were moved from y 770 to y ≈ 1080–1190. At y 770 they would cover his face in the closing close-up (hard rule 1 takes priority).
- The hook runs 4.97 s (12 % of runtime, against 4 % in the reference). The burned POV title covers that whole stretch, and the first shot cut falls at 4.97 s.
- Beats 5 and 6 (26.4–33.8 s) have no speech, so the caption slot is empty there. Card motion carries the density.

## Timing accuracy
- Whisper `small` is weak on Hindi. Word onsets come from per-clip forced transcription and were corrected by hand, so expect ±2–4 frames on some Hinglish words. This is most likely in the fast run "kharab nahi hona chahiye" (16.24–16.87 s). I have not verified this by listening.
- The montage timings at 26.5 s, 27.5 s, 29.0 s, 30.1 s, 31.0 s and 32.2 s are anchored to shot cuts and to time, not to words, because nothing is spoken there.

## Assets
- The stickers are original SVG faces drawn in code. No stock reaction clips were available offline.
- The SFX (whoosh, pop, click, tick, thud) were synthesised with ffmpeg. There is no music bed; the source already carries one.
- The face-box check was done by eye on the review stills, not per frame. MediaPipe was not used.
