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
- Final continuous contact-timed sound masters: E2 `2f5f7f9`, E3 `b30beb3` (codec headroom). Later source commits add documentation/verification; native picture sources remain as recorded above.

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

All three actual MP4s pass native 1080 × 1920 resolution, 30-fps H.264/yuv420p/Rec.709,
stereo 48-kHz AAC, exact duration/frame count, zero picture/audio start timestamps,
and a full decode. No accidental black intervals were detected. No preview was enlarged
to make a final. Native H.264 ranges were copied into the final container; one continuous
sound master was encoded separately to avoid seams. All 15 downloaded artifact ZIPs
match their GitHub SHA-256 digests.

| Episode | Seconds | Video frames | File MB | Integrated LUFS | True peak dBTP |
|---|---:|---:|---:|---:|---:|
| 1 | 72 | 2160 | 14.92 | -21.34 | -1.28 |
| 2 | 72 | 2160 | 12.13 | -21.18 | -1.13 |
| 3 | 73 | 2190 | 7.46 | -21.42 | -2.08 |

The final encoded mixes retain at least 1 dB of true-peak headroom. Episode 3's master
uses extra pre-encoding headroom to account for AAC reconstruction peaks. The programme
contains no speech; its music, air, impacts, machinery, chirps and footfalls are original.

All three finals and all three smaller full-length previews load in Chromium, play,
decode moving frames and seek to their last second without errors. Contact sheets and
the largest frame changes outside cuts were inspected from the final movies. The outliers
show expected running, foreground parallax, closing doors, text and restored lighting;
no render flashes or blank joins were found.

See [movie metadata/checksums](validation/final-movies.json), [encoded audio measurements](validation/audio.json),
[browser playback/seek evidence](validation/playback.json), [artifact integrity](validation/artifact-integrity.json)
and the character/environment/model reports in the same directory. The delivery branch
also includes `SHA256SUMS` and a separate remote-file verification record.
