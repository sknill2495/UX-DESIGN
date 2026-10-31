# Reference asset sheets

Reference images are what make the video consistent. The video prompt only points at them. Generate these first; they become `<<<image_N>>>`.

## Character turnaround sheet (one per character)

The format reverse-engineered from the supplied refs is a 16:9 triptych: full-body front | full-body back | head-and-shoulders close-up. Use a seamless studio backdrop, a single soft key, and plain solid-colour wardrobe with no logos.

```
Character reference sheet, 16:9, three panels side by side on a seamless warm-grey studio backdrop.
Panel 1: full-body FRONT view, standing neutral, arms relaxed at sides, feet visible, slight natural smile, looking into lens.
Panel 2: full-body BACK view, same pose, same scale, showing hair from behind and back of clothing.
Panel 3: tight head-and-shoulders portrait, front, eyes to lens, skin texture visible.
Subject: [age]-year-old [nationality/ethnicity if relevant] [gender], [build], [height cue].
Face: [face shape], [eye colour], [distinguishing marks: freckles across nose and cheeks, braces, dimples].
Hair: [colour, length, style, parting, how it falls].
Accessories: [glasses: round thin wire frames, gold] (must appear in panels 1 and 3).
Wardrobe: [garment + exact colour + fabric] (e.g. plain royal-blue crew-neck cotton t-shirt, no print), [bottoms], [shoes].
Identical face, hair, wardrobe and scale across all three panels.
Lighting: soft large key from camera-left, gentle fill, subtle rim, slight vignette, warm neutral grade.
Photographic: shot on full-frame digital, 85mm look, f/5.6 for full-body, f/2.8 for close-up, true-to-life skin texture, natural pores, no retouching, no beauty filter.
No text, no labels, no logos, no props, no other people.
```

Rules:
- Twins and look-alikes: generate twin A first, then generate twin B with A's sheet as the face reference: "identical twin of the reference face; change ONLY: [glasses added, shirt royal-blue, no braces]."
- Give each character a wardrobe colour from a different hue family (red vs blue, not red vs orange).
- Keep the sheet backdrop the same for the whole cast so lighting doesn't leak into identity.

## Location sheet (one per set)

The format reverse-engineered from the supplied ref is a 6-panel contact sheet with 3 wides on top and 3 inserts below, all at the same time of day.

```
Location reference contact sheet, 16:9, six photographs in a 3+3 grid with thin white gutters.
Location: [type, e.g. warm lived-in American suburban family living room], [era/style], [condition: tidy but lived-in].
Time and light: [golden-hour sunset] from [screen-right windows], dappled window-pane gobo shadows on walls and floor, warm practical lamp in background, long soft shadows.
Top row - three WIDE angles of the same room:
 1. From the [kitchen side], facing [the couch and front door].
 2. Three-quarter angle from [front-left], showing [couch, coffee table, kitchen beyond].
 3. From behind [the couch], facing [the front door and photo wall].
Bottom row - three INSERTS:
 4. [Hero prop area, e.g. coffee table with BLUE VR headset (left) and RED VR headset (right), game controller, toy bricks on rug].
 5. [Set-dressing detail, e.g. family photo wall].
 6. [Entry/exit point, e.g. front door with sidelight window, coat hooks, sneakers on mat].
Fixed geography: [list anchors with positions: grey 3-seat couch faces camera, coffee table in front, open kitchen background-left, front door right of photo wall].
Same light direction, colour temperature and set dressing in all six panels. Photoreal, full-frame, 24-35mm for wides, 50mm for inserts, natural colour, no people, no text.
```

Rules:
- Put every story prop in the set at its starting position, coloured to match its owner.
- Every entrance and exit used in the story must appear in at least one wide.
- Lock the time of day here. A later scene in different light needs a separate sheet.
