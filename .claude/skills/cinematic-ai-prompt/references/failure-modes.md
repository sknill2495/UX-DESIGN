# Failure modes observed, causes and fixes

Source: twins/mother/VR generation (Higgsfield, 16.06 s, 1280x720, 24 fps). I compared frames at 1-3 fps against the prompt.

## 1. Empty establishing frame despite "no empty establishing frame"
- Observed: frame 0 shows a closed-off doorway with nobody in it; the boys appear about 0.3 s later.
- Cause: text-to-video models open on a stable composition and then introduce motion. The location reference image (an empty room) also pulls frame 0 toward emptiness.
- Fix: generate a start frame (IMAGE prompt of frame 0 with the characters mid-stride) and run image-to-video. As a text-only fallback, front-load it: "FRAME 0: both boys already one stride inside the room, motion-blurred mid-run".

## 2. Leader/follower inverted
- Observed: Noah (blue) ran in front toward the couch and Jack (red) trailed, the opposite of "Jack pulls Noah".
- Cause: "pulling" and "a step ahead" carry no screen direction. The model also wanted the final seat order (Noah LEFT) and solved it by making the left boy lead leftward.
- Fix: derive the run order from the final seats, or give an explicit cross. Example: "They run screen-LEFT. JACK is furthest LEFT in frame, arm stretched back; NOAH trails on the right. At the couch Jack swings past and drops onto the RIGHT cushion while Noah drops LEFT." If the story needs a cross, write the cross as its own beat.

## 3. Spatial mark ignored ("crouches between them")
- Observed: the mother knelt at the right end of the couch beside Jack and leaned across him to kiss Noah.
- Cause: she entered from screen-right, and the coffee table blocks the centre. The model takes the shortest path to the nearest end.
- Fix: give a path, a mark and an obstacle. Example: "She steps around the RIGHT end of the coffee table, moves to frame-CENTRE, and kneels on the rug directly in front of the gap between the boys' knees, her face level with theirs." Or move the props so the centre is reachable.

## 4. Identity accessory drops during motion
- Observed: Noah's glasses were unreadable or absent in some running frames and present on the couch.
- Fix: "Glasses ON and visible in every frame, including the run." Choose differentiators that survive motion blur: shirt colour beats glasses, and glasses beat braces. Braces are invisible unless the character smiles open-mouthed close to camera.

## 5. Subtle emotion lands as neutral
- Observed: Jack's "stunned hurt" read as eyes-closed, drowsy and blank.
- Cause: abstract emotion words ("stunned", "hurt") give the model nothing visible to render.
- Fix: write the acting as physical tells. Example: "His smile stays a beat, then the corners of his mouth flatten; eyes stay open, fixed on the doorway; brows draw slightly together; shoulders drop; he swallows; he does NOT close his eyes." Give the turn a dedicated 2 s beat with no other action in frame.

## 6. Camera framing differs from the location reference
- Observed: the opening shows the front door at frame-centre, but the reference and prompt placed it screen-right.
- Cause: "follow from the door" made the model face the door.
- Fix: add a CAMERA START POSITION block that states where the camera stands and what is visible at the frame edges.

## 7. Beat compression
- 10 timestamped beats in 16 s produced compressed and overlapping beats (kiss, phone and stand-up ran into each other).
- Rule: at most 1 beat per 1.5-2 s. When a story has more beats, split it into two shots.

## What reliably works (keep doing)
- Ownership by colour plus side for props (blue left, red right) was never swapped.
- "Does NOT kiss X" plus a restatement in the recap produced the correct target.
- Encoding emotion in prop physics ("Noah's grab quick and light, Jack's slow and heavy") came out correctly.
- Character turnaround sheets on a neutral backdrop produced stable faces and wardrobe across the whole take.
- A location contact sheet with 3 wides and 3 inserts kept the set, the decor and the light consistent.
