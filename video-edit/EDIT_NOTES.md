# EDIT NOTES — streaming-indecision edit

Output: `out/final.mp4`. 1080×1920, 30 fps, 1085 frames (36.17 s). H.264 CRF 18, AAC 192 kbps, yuv420p, loudness normalised to −14 LUFS / −1 dBTP.

## What the dialogue revealed (it changed the plan)
I transcribed the audio with faster-whisper `small` (int8, run offline). The dialogue is Hindi, and the captions are romanised to Hinglish.

> aaj kuch accha dekhte hain · ye nahi · ye toh pehle dekh chuka hoon · ye boring lag rahi hai · kuch aur dekhte hain · comedy dekhun? · thriller? · action? · arre yaar, decide nahi ho raha · tees minute se movie choose kar raha hoon · aur movie dekhne ka mood nahi hai · chalo ek reel dekh leta hoon

The last shot is **not a product ad**. He gives up and starts scrolling reels. So the `{{APP_NAME}}`/`{{CTA_KEYWORD}}` variables in the prompt were dropped. The outro instead uses the persistent keyword **‘ek reel’**, a reel counter that climbs to 10, and the payoff line "…famous last words" timed to the chime at 33.7 s.

## Deviations from `prompts/streaming-indecision-edit-prompt.md`
- **Hook number is 30 min, not 50.** He says "tees minute" (30) at 22.7 s. The spoken word wins over my reading of the clock (9:10 → 10:00).
- **Card clip at y 598, not 710.** At 1.5–1.7× the camera push-ins ran down into the caption band (y 600–710). Cards now clip just above the caption. The clipped bottom edge is visible on push-in peaks at 11.2 s and 18.9 s.
- **Captions in the hook** are at y 1700, under the title block. Mode A′ and Mode C captions are at y 1180, below his chin in every checked still.
- **Sticker count 4** (popcorn, eye-roll, yawn, shock). They are original vector illustrations drawn in code. No third-party clips.
- **"thriller?" / "action?"** have a "?" added to match his questioning tone.
- **Whisper misheard several words**, fixed by hand: "देक्ते" → dekhte, "कुमटी" → comedy, "आख्छन" → action, "दिसाएडी" → decide, "चूस" → choose, "लगरी" → lag rahi. Check these by ear.
- **No dead-air cuts.** The full runtime is kept, and the time-lapse depends on its silences.

## Source handling
- The ✦ generator watermark was removed with `delogo` (x 656, y 1216, 34×34, at source resolution) before upscaling. No visible residue in stills.
- **Upscale is 720 → 1080 (Lanczos + light unsharp).** The source is a WhatsApp re-encode at about 2.7 Mbps, so expect softness on faces in S1, S8 and S13. A clean original export would noticeably improve the result.
- **Trademark: the Netflix wordmark is still visible in the footage** (on the TV around 20–24 s) and in a Netflix-style interface in shots S3, S5 and S7. The graphics avoid the brand entirely. Decide whether to blur the footage before publishing.

## Mode B reframes (translateY in px; footage scale stays 1.0× fit-to-width)
S3 597 · S4 150 · S5 674 · S6 398 · S7 616 · S8 488 · S9 501 · S10 414 · S11 524. No shot needed extra scale.

## Not done / known limits
- Face clearance was checked visually on 20 review stills, not per frame in code. The OpenCV Haar detector was too noisy on the over-the-shoulder shots to use as a gate.
- Word onsets come from Whisper (±2 frames typical). I did not watch the full render at 1× to check sync by ear.
