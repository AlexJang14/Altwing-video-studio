# Implementation and validation report

The master narrative revision produces a silent, character-led rescue trilogy.
The new shared plush model, finite engineering resources and conditional branches
support the astronaut’s development from guidance dependence to reciprocal leadership.

## Scope and sources

- Episode 1: DO NOT DOCK, 72 seconds; HELIX-9 rescue.
- Episode 2: THAT SHIP IS OURS, 72 seconds; conditional on Episode 1 option B.
- Episode 3: THIS IS NOT YOUR FIRST MISSION, 73 seconds; conditional on Episode 2 option A.
- Narrative/model source: `826a31b`. Native Episode 1: source `afbb2ed`, render branch `3b699a9`, workflow run `43568661876`.
- Native Episodes 2/3: source `826a31b`, render branch `afd50d7`, workflow run `43571493582`.
- Later source commits add documentation and verification helpers without changing the rendered scenes.

## Character and environment checks

| Episode | Frames checked | Largest declared contact error | Largest planted-sole drift | Detected contact / cloth / foot errors |
|---|---:|---:|---:|---:|
| 1 | 2,160 | 0.000000000 mm | 0.170 mm | 0 |
| 2 | 2,160 | 0.000000000 mm | 0.206 mm | 0 |
| 3 | 2,190 | 0.000000000 mm | 0.224 mm | 0 |

Actual shared mesh transforms were evaluated, including glove contact, head and torso
shells, arm capsules, visible feet, planted soles and timed pressure-door clearance.
The reassurance exception requires the actual glove support point to meet the head
surface within 2 mm; it does not waive other arm/head collisions.

Environment checks use actual spacecraft hull ellipsoids and conservative solid boxes
for walls, the transmitter, console/cradle and doors. The exterior/room scenes checked
4,137 frames and report zero detected obstacle or floor errors at a 3 mm geometry
tolerance. The lowest visible mesh point is −0.789 mm during the companion set-down
crouch; this is below the permitted numerical/cloth tolerance and below a rendered
pixel. Evaluated shapes and tolerances are explicit in the scripts and JSON reports.

Focused fixes include waiting until Wangdoo turns before reaching, stamping feet
in world space, a raised physical carry loop with an elbow direction outside the
plush, a lower set-down crouch, clear routes around the transmitter and pit, and
an archive display mounted on the wall outside the walking route.

## Reusable model and source verification

The exported plush GLB loads as 21 meshes / 14,965 vertices, with bounds
0.774 × 1.122 × 0.714 m and six valid animation clips. Embedded cloth color textures,
roughness and sheen are retained; Three’s bump map and procedural light/status
changes remain in the film source. TypeScript and diff whitespace checks pass.

Representative half-resolution frames and short low-resolution motion clips were
reviewed for the equipment check, bulkhead crossing, recovery/carry and reassurance.
Final contact sheets and frame-change montages are extracted from actual final MP4s.

## Authenticity and limits

The new actual plush photograph mentioned in the brief was not attached. The model
uses the written gray/white plush description and earlier smiling reference. An exact
match to an unseen photo is not claimed. Childhood/training/security/mission archives
are original fictional story images, not the user’s personal history.

The endings show verified, unmodified public AltWing activities: Engine Tradeoff,
Build a Mars Mission and Lost Sensor. Story interfaces are fictional; no claim is
made that this animated survival story is playable on the site. All sound is original
deterministic synthesis with no speech. Earlier assets, source and deliveries are preserved.

Only Episodes 1–3 are rendered. Future episodes, alternative branches and the warm
survival finale are documented plans. Audience choices have not been counted;
Episodes 2 and 3 remain explicitly conditional.

## Exported movie verification

The native exported-file results, audio measurements and playback evidence are
recorded in the delivery package after all three full-resolution renders complete.
