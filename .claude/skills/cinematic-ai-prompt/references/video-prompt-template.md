# 14-block video prompt template

The block order matters. Models weight early text heavily, and the final recap gets a second pass of attention. Keep the headers in caps exactly as shown. Each block below includes why it exists.

```
SCENE CONTEXT
[2-4 sentences. Who, where, what happens, and the emotional thread in one line.
"One continuous scene." if no cuts.]

ACTIVE REFERENCES
<<<image_1>>> NAME_A: [age, hair, 1-2 face tags, accessory, exact wardrobe colours, shoes]. Default side: LEFT. 100% matches the reference.
<<<image_2>>> NAME_B: [...] Default side: RIGHT. 100% matches the reference.
<<<image_3>>> NAME_C: [...] Carries: [prop]. 100% matches the reference.
<<<image_4>>> LOCATION: [type, time of day, light quality, 3-5 anchor objects with positions]. 100% matches the reference.
DIFFERENTIATORS: NAME_A = [tag + colour + side]. NAME_B = [tag + colour + side]. Visible in every frame.

LOCATION MAP
[Fixed geography in screen terms: what is foreground/midground/background, left/right.
Where every prop sits and who it belongs to. Entry/exit points. Seating/standing marks.]

CAMERA START POSITION
[Where the camera physically is in the set at frame 0 and what it faces, e.g.
"Camera stands in the living room facing the front door, which is frame-centre background."
This must agree with the location reference image.]

FIRST FRAME AND SPATIAL BLOCKING
[Exactly what is visible at 0:00. Characters already mid-action. Who is where on screen.
"No empty establishing frame." For guaranteed results, supply a start-frame image.]

FORMAT MODE
[Single continuous take / N shots, duration, real-time vs slow-motion, aspect ratio.]

OPTICS
[FOV in degrees or "35mm on full frame", camera height, lens character, depth of field.]

CAMERA
[One sentence per move, with the moment it settles. Handheld/locked/dolly. Energy per phase.]

ACTION TIMING
0:00 [beat: who does what, screen direction, physical cause]
0:02 [...]
[At most 1 beat per 1.5-2 s. Dialogue in quotes inside the beat where it is spoken.
The emotional turn gets its own beat plus a "hold" beat after it.]

PERFORMANCE (acting)
NAME: [arc in stages with time ranges]
  - STAGE 1 (0:00-0:08): [emotion + visible behaviour]. NOT [wrong emotion].
  - STAGE 2 (...): [...]
  - STAGE 3 (...): only AFTER [trigger]. The change happens HERE, not before.
NAME: [single-state description]
Reactions staggered, not synced.

PHYSICS
[Body weight, momentum, contact (hands, cushions compressing), cloth, prop weight,
fast-vs-slow handling that encodes emotion. "Grounded, no floaty motion."]

LIGHTING
[Source direction in screen terms, quality, colour temperature, shadow pattern,
rim light, "consistent for the entire take". Must match the location sheet.]

AUDIO
[Room tone, foley list, every dialogue line with speaker token and timestamp,
SFX timings, off-screen voice behaviour, "No music" or the music spec.]

POSITIVE CONSTRAINTS
[Recap of everything that must be true: take length, exact headcount, differentiators,
positions, prop ownership, arc order, lighting. Then a short list of prohibitions:
no extra people, no duplicate characters, no morphing faces, no text, no cuts.]
```

## Calibration from the reference generation

| Block in source prompt | Result in video | Keep / change |
|---|---|---|
| ACTIVE REFERENCES with "100% matches" | Faces, wardrobe and room matched the sheets | Keep |
| LOCATION MAP plus prop ownership by colour and side | Blue headset left, red right, never swapped | Keep |
| FIRST FRAME "no empty establishing frame" | About 0.3 s of empty doorway before the boys appear | Add a start-frame image |
| "Jack pulls Noah" | Inverted: Noah (blue) ran in front | State screen direction plus who is furthest along it |
| "Crouches between them" | She knelt at the right end beside Jack and reached across | Give her a path and a mark |
| "Kisses Noah only" | Correct | Keep the explicit "does NOT kiss X" |
| Jack's 3-stage arc | Stages 1-2 good; stage 3 read as neutral/drowsy, not hurt | Give a physical tell for the hurt (see failure-modes) |
| Headset grab fast vs slow | Correct: Noah fast, Jack slow | Keep emotion encoded as physics |
| Golden-hour gobo light | Consistent | Keep |
