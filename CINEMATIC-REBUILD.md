# The Last Wing — cinematic rebuild

Two independent, deterministic 3D shorts: **Episode 1: The Last Signal** (58 s,
1,740 frames) and **Episode 2: We Made a Mistake — Planet Route (Option B)**
(59 s, 1,770 frames). Both render at native 1080 × 1920, 30 fps, H.264,
Rec.709/yuv420p with stereo AAC. The source renders full resolution; previews
are explicitly separate 360 × 640 files.

## Preserve and edit

The previous working episodes are preserved on
`archive/episodes-before-cinematic-rebuild` at
`b53cfeb10357a27a2c27c750cdceff259d295882`. Their composition IDs remain
`TheLastWing-Episode1` and `TheLastWing-Episode2`. The two new IDs are
`Cinematic-Episode1` and `Cinematic-Episode2`.

- `src/cinematic/episodes.json`: scene timing, dialogue, story actions, filenames,
  and verified AltWing copy. Scene boundaries are in seconds.
- `src/cinematic/motion.ts`: character blocking, anticipation, gait phase, jump
  arcs, hesitation, wave, point, stumble, panic, flipper grips, catch and recovery.
- `src/characters/performance.ts`: optional continuous pose controls, leg IK and
  shared hand transforms. The older action-based character API remains usable.
- `src/characters/WangdooSoft.tsx`: rounded plush Wangdoo, ivory face/belly,
  curved smiling eyes, cheeks, yellow beak/feet, navy flippers, gold trim and
  cyan circuitry. The original user image was visually available in the chat;
  its original PNG file was not present locally. The official website mascot is
  used for brand identification, not substituted for the user's character brief.
- `src/cinematic/Props.tsx`: coffee machine, cable coupling, switch, navigation
  map, metallic alarm flower, visible signal pulse, rising structures, threat,
  debris, crash dust and the single-core terminal.
- `src/cinematic/Camera.tsx`: eased camera movement and action framing.
- `src/cinematic/Overlays.tsx`: reusable AltWing identity, safe-area typography,
  subtitles, oxygen display, story missions, voting and authentic website inserts.
- `src/cinematic/mouth-*.json`: 30 fps speech amplitudes driving Wangdoo's beak.

## Story and brand integrity

Episode 1 develops a genuine repair partnership before the one-jump decision.
The astronaut connects a cable, Wangdoo closes the switch, and the astronaut
catches him when the repair sparks. Navigation returns only partially.

Episode 2 explicitly says **“This is what happens if we choose the planet.”**
It does not assert that an audience vote occurred. Wangdoo's flower touch
causes an alarm; a visible pulse wakes the gate and a moving machine. The crew
flee around the ship, recover from an unsafe boost, and reach a terminal. Its
single core can power the gate or the oxygen recycler, with a lost alternative
in either case. The final vote shapes Episode 3, which is not produced here.

In-universe objectives are labelled **STORY MISSION**. They are fictional
survival objectives, not representations of playable AltWing website features.
The final cards promote real engineering exploration and browser projects.

Official site: <https://junjang06.github.io/altwing/#/>.
`public/brand/verified-page.json` records the landing-page text and source.
`public/brand/altwing-home.png` and `altwing-projects.png` are authentic captures
of the deployed public homepage and the **Follow the sunlight** project.
Unmodified public assets were fetched with normal TLS verification and served
through a local read-only proxy for Chromium certificate compatibility. No
features, results, user counts, or app screenshots were invented. No changes
were made to the AltWing application repository. The end cards include the
visible URL and LINK IN BIO; the publisher must place that URL in their bio.

## Audio

`public/audio/cinematic/episode-1.mp3` and `episode-2.mp3` contain consistent
local neural dialogue, an original synthesized score, ambience and effects.
Music ducks under each dialogue cue. The narrator uses a calm lower register;
Wangdoo uses a brighter pitch and EQ, with small electronic chirps.
`episode-*-cue-timing.json` records actual generated cue lengths and treatment.
Captions come from the same dialogue configuration as the voices.

These are **synthetic local voices**, not professional human performances.
No paid voice or rendering API was invoked. The LJ Speech voice dataset is
public domain; attribution and engine/model provenance are in
`public/audio/cinematic/VOICE-LICENSE.txt`. The engine/model are not bundled.

## Reproduce

Use Node 22+ and installed Chrome/Chromium; Linux rendering uses SwiftShader.

```sh
npm ci
npm run typecheck
npx tsx scripts/cinematic_motion_test.tsx
node scripts/cinematic_qa.mjs
python3 scripts/cinematic_contact_sheets.py
node scripts/cinematic_render.mjs preview 1
node scripts/cinematic_render.mjs preview 2
node scripts/cinematic_render.mjs final 1
node scripts/cinematic_render.mjs final 2
python3 scripts/verify_cinematic.py
```

Set `CHROME_PATH` when the browser is not `/usr/bin/chromium`, and optionally
`RENDER_CONCURRENCY` (default 2). An inclusive frame range is supported, e.g.
`node scripts/cinematic_render.mjs final 1 0-449`.
The optional GitHub Actions workflow renders four independent native segments
for each episode on standard Linux runners in this public repository. Only
dedicated `render/cinematic-*` branch pushes trigger it. It has read-only repo
permissions, does not publish or deploy, and retains artifacts for seven days.

To regenerate audio, create a Python virtual environment, install `piper-tts==1.8.0`
and `numpy`, then run `python scripts/cinematic_audio.py`. This downloads the
public-domain LJ Speech model into the ignored work directory. Existing mixed
audio is committed, so ordinary video rendering needs no voice service/model.

## Inspection and limits

Motion verification evaluates every one of the 3,510 frame transforms,
checks actual 3D palm/flipper contact in both catches, checks that kneeling boots
stay on the deck, and verifies that the chase clears the ship. Contact sheets
cover all eight story beats, character expressions, interactions, voting and
both brand inserts. The export verifier checks exact frame count, native
dimensions, duration, codecs, color space, stereo audio, SHA-256 and a full
decode. Episode 2 deliberately contains a four-frame crash impact cut
(frames 124–127); other sustained black intervals fail verification.

This is a procedural Three.js production using the existing assets. It does
not use facial motion capture, fluid simulation or a cinematic game engine.
Robot jets, particles, metallic flower panels and physical interaction are
animated deterministically for reliable frame rendering. The editable source
is the authoritative version of the new performances; the existing reusable
GLB models and their older baked animation clips remain available.
