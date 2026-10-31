# Worked example: twins scene, corrected v2

This rewrites the original prompt with every fix from failure-modes.md applied. Use it as the quality bar for SHOT mode.

```
SCENE CONTEXT
One continuous scene. Twin boys JACK and NOAH burst into their home laughing, race to the couch and drop down still giddy. Their MOTHER follows with a grocery bag, kneels in front of them, tells them to take care of each other and kisses Noah on the forehead. Her phone rings and she leaves before kissing Jack. Noah happily pulls on his VR headset; Jack, who leaned in for a kiss that never came, goes quiet, then slowly reaches for his.

ACTIVE REFERENCES
<<<image_2>>> JACK: 9yo boy, sandy-blond side-swept hair, freckles, metal braces, warm-red crew-neck t-shirt, denim shorts, white sneakers. No glasses. Seat: RIGHT. 100% matches the reference.
<<<image_1>>> NOAH: 9yo boy, identical twin face, sandy-blond side-flip hair, round thin wire glasses, royal-blue crew-neck t-shirt, denim shorts, white sneakers. Seat: LEFT. 100% matches the reference.
<<<image_3>>> MOTHER: mid-30s woman, honey-blonde hair loosely tied back, cream knit cardigan, dark jeans, paper grocery bag on her hip. 100% matches the reference.
<<<image_4>>> LOCATION: warm lived-in family living room at golden hour, grey 3-seat couch facing camera, wooden coffee table, photo wall, front door with sidelight. 100% matches the reference.
DIFFERENTIATORS: NOAH = glasses + BLUE + LEFT. JACK = no glasses + RED + RIGHT. Glasses ON in every frame, including the run.

LOCATION MAP
Grey couch midground, facing camera. Coffee table foreground-centre: BLUE headset on its LEFT half (Noah's), RED headset on its RIGHT half (Jack's). Open kitchen background-left. Front door background-RIGHT, beside the photo wall. Rug between table and couch.

CAMERA START POSITION
Camera stands at the left end of the coffee table, angled screen-right toward the front door, so the couch is already visible at frame-left at 0:00.

FIRST FRAME AND SPATIAL BLOCKING
0:00 frame: both boys already one stride inside the doorway, mid-run, motion blur on limbs. JACK is furthest LEFT in frame, nearer the couch, arm stretched back holding NOAH's hand; NOAH trails on the right, tugged off balance, laughing. MOTHER in the doorway behind them. No empty frame.

FORMAT MODE
Single continuous take, 16 seconds, real-time, 16:9, no cuts.

OPTICS
47° diagonal FOV (about 40mm on full frame), eye level of a seated adult, deep enough focus to read all three faces.

CAMERA
Handheld pan screen-left following the boys from door to couch (0:00-0:04), settling to a straight-on centred frame of the couch. Locked and still from 0:04 to the end.

ACTION TIMING
0:00 JACK pulls NOAH screen-LEFT across the room, both LAUGHING. MOTHER, in the doorway: "Slowly, boooys!"
0:03 Jack swings Noah ahead of him at the couch; NOAH drops onto the LEFT cushion, JACK onto the RIGHT. Cushions compress, still laughing.
0:05 NOAH, grinning at Jack: "You ready to lose? Haha." Jack laughs back.
0:07 MOTHER walks around the RIGHT end of the coffee table to frame-CENTRE, sets the bag on the floor, and kneels on the rug directly in front of the gap between the boys' knees, one hand on each knee. "I want you to always take care of each other, okaaay."
0:10 She leans LEFT and kisses NOAH's forehead. Noah smiles. JACK, still smiling, tilts his face up toward her, forehead offered, waiting.
0:12 Phone RINGS. She glances at it, starts to turn toward Jack, then stands, phone to ear, and walks out screen-RIGHT. She does NOT kiss Jack.
0:13 JACK holds his lean. His smile stays, then flattens. Eyes OPEN and fixed on where she left, brows slightly drawn, shoulders drop. No other action in frame.
0:14 NOAH, oblivious, grabs the BLUE headset quickly: "Let's roll, Jack." He pulls it on.
0:15-0:16 JACK slowly lifts the RED headset, still half-turned toward the doorway. FINAL FRAME: Noah wearing blue, Jack raising red toward his face.

PERFORMANCE (acting)
JACK:
  - 0:00-0:10 HAPPY: kinetic, laughing hard, playful. NOT anxious.
  - 0:10-0:12 WAITING: smiling, hopeful, leaning up for his kiss.
  - 0:13-0:16 HURT: only AFTER she leaves. Mouth corners flatten, eyes open and still, a small swallow, slow hands. NOT crying, NOT eyes closed. The change happens HERE.
NOAH: easygoing and warm throughout; the tease is pure play; he takes the kiss without a thought and jumps to the game, never noticing Jack.
MOTHER: warm, a little tired, loving; the interruption is innocent, never cold.
Reactions staggered, not synced.

PHYSICS
Real child weight and momentum; the hand-pull visibly drags Noah's arm and shoulder. Cushions compress on landing. Cardigan fabric moves naturally. The headsets have real plastic weight: Noah's grab is quick and light, Jack's slow and heavy. Grounded, no floaty motion.

LIGHTING
Golden-hour sun from the screen-right windows, dappled window-pane gobo shadows on wall and floor, warm rim light, background lamp on. Consistent for the whole take.

AUDIO
Warm room tone, sneakers on wood, breathless laughter carrying into the couch. Dialogue as timed above. Soft ringtone at 0:12; her phone voice fades, unintelligible, from another room. No music.

POSITIVE CONSTRAINTS
One continuous 16 s take. Exactly three people. NOAH = glasses + blue + LEFT seat, glasses visible in every frame. JACK = no glasses + red + RIGHT seat. Jack is furthest left during the run, pulling Noah. Mother kneels at frame-centre between the boys, kisses ONLY Noah, and leaves screen-right before kissing Jack. Jack is happy until she leaves, then quietly hurt with eyes open. BLUE headset left/Noah, RED headset right/Jack, never swapped. Golden-hour gobo light throughout. No other people, no duplicate children, no morphing faces, no text, no cuts.
```

Recommended: generate the 0:00 frame as a still first (image-prompt.md) with all three references, then run image-to-video with this prompt.
