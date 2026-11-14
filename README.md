# THE LAST WING — AltWing Video Studio

## Silent rescue trilogy — current production

The master narrative version uses silent visual storytelling, an original atmospheric
soundtrack and a gray-and-white plush Wangdoo. All films are vertical **1080 × 1920,
30 fps, H.264/AAC MP4**. Earlier sources and films remain available.

| Episode | Title | Length | Route |
|---|---|---|---|
| 1 | DO NOT DOCK | 72 s | HELIX-9 rescue |
| 2 | THAT SHIP IS OURS | 72 s | Conditional: Episode 1 option B |
| 3 | THIS IS NOT YOUR FIRST MISSION | 73 s | Conditional: Episode 2 option A |

Select `Rescue-Episode1`, `Rescue-Episode2` or `Rescue-Episode3` in Remotion Studio.
See [the story bible](docs/rescue/STORY-BIBLE.md), [character/clue/branch trackers](docs/rescue/TRACKERS.md)
and [production and verification guide](docs/rescue/PRODUCTION.md).

```sh
npm ci
npm run typecheck
npm run rescue:collision -- 1
npm run rescue:collision -- 2
npm run rescue:collision -- 3
npm run rescue:environment
npm run rescue:preview -- 1
npm run rescue:render -- 1
npm run rescue:render -- 2
npm run rescue:render -- 3
npm run rescue:verify
```

Wangdoo's reusable rig is in `src/rescue/Wangdoo.tsx`; the GLB with six mentor
cycles is `public/models/wangdoo-plush-mentor.glb`. The newer real plush photograph
mentioned in the brief was not attached; this model follows the written plush
description. The personal/training archives are original fictional story images.

## Previous cinematic rebuild — Episodes 1 and 2

The previous films are **The Last Signal** (58 seconds) and **We Made a
Mistake — Planet Route B** (59 seconds), with softer Wangdoo performances,
character teamwork, English dialogue/captions and authentic AltWing endings.
Select `Cinematic-Episode1` or `Cinematic-Episode2` in Remotion Studio.

See [the rebuild guide](CINEMATIC-REBUILD.md) for editing, timing, voice
provenance, validation and rendering. Quick commands:

```sh
npm ci
npm run typecheck
npm run cinematic:motion
npm run cinematic:render -- 1
npm run cinematic:render -- 2
```

The earlier 25-second episodes and their commands are preserved below.

## Original Episode 2 — First Contact

Episode 2 follows choice B onto the unknown violet planet. The landing craft
touches down, the crew exits, Wangdoo greets a living alien flower, and its reply
awakens an ancient gateway. Viewers choose whether to enter the gate or return
to the ship. Output: a complete 25-second vertical episode.

Wangdoo's Episode 2 model follows the supplied robot-penguin reference with a
continuous, rounded plush body, a smooth ivory face and belly, happy curved
eyes, small warm beak, pink cheeks, short yellow feet, navy armor, fine gold
trim, cyan details, and a compact back thruster. Closer, brighter character
shots make his face readable. His original Episode 1 model is retained.

```sh
npm ci
npm run episode2:audio
npm run episode2:assets
node scripts/verify_models.mjs --episode2
npm run episode2:qa
python3 scripts/contact_sheet_episode2.py
npm run episode2:preview
npm run episode2:render
python3 scripts/verify_video.py work/episode2/renders/episode2-final.mp4 final
```

In Remotion Studio, select `TheLastWing-Episode2` for the film or
`Wangdoo-Episode2` for the new character study. Episode 2 timing, dialogue, and
choices live in `src/episode2/config.ts`; the new model lives in
`src/characters/WangdooSoft.tsx`. `public/models/wangdoo-soft.glb` includes ten
baked animation clips and the fabric bump texture.

The original 25-second episodes are caption-led with music and sound effects, without
spoken voices. Episode 2 downloads are kept on the separate
[`episode-2-delivery` branch](https://github.com/AlexJang14/Altwing-video-studio/tree/episode-2-delivery).

## Episode 1 — The Signal

A deterministic, fully 3D 25-second vertical episode for the original AltWing
space-survival series. A black-suited astronaut and Wangdoo discover a signal,
then ask viewers to choose between an abandoned station and an unknown planet.

## Run the studio

Requirements: Node 22+, Python 3 with NumPy/Pillow, FFmpeg, and Chromium.

```sh
npm ci
npm run audio
npm start
```

Open the URL printed by Remotion. Choose `TheLastWing-Episode1` for the film or
`CharacterPreview` for the independent side-by-side character study.

`remotion.config.ts` uses `/usr/bin/chromium` and the SwiftShader ANGLE renderer
for this Linux environment. On another machine, set the local browser executable
or remove `Config.setBrowserExecutable(...)` to use Remotion's browser download.
No API credentials are required.

## Render and verify

```sh
npm run typecheck
npm run audio
npm run assets
node scripts/verify_models.mjs
npm run qa
python3 scripts/contact_sheet.py
npm run preview
npm run render
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate -show_entries format=duration out/the-last-wing-episode-1.mp4
```

`npm run preview` renders 360×640; `npm run render` renders 1080×1920, 30 fps,
H.264/yuv420p with stereo AAC. Both are the complete 750-frame episode.
Rendering uses local CPU/WebGL through Chromium; it does not invoke video APIs.

## Episode structure

| Time | Scene | Action |
| --- | --- | --- |
| 00–04 | The awakening | Alarm, helmet close-up, astronaut rises |
| 04–08 | The emergency | Articulated corridor run, sparks, oxygen warning |
| 08–13 | Meet Wangdoo | Penguin runs in, looks up, and waves |
| 13–18 | The signal | Crew walks into cockpit; planet and hologram reveal |
| 18–21 | The crisis | Ship impact, fuel warning, hesitation |
| 21–25 | The choice | Readable A/B cards and comment prompt |

The episode is caption-led. The score, alarms, footsteps, sparks, mechanical
chirps, hologram, and impacts are included. There is no spoken narration.

## Reuse for Episode 2

- `src/config.ts`: scene timing, dialogue, destinations, palette, output settings.
- `src/Episode.tsx`: scene staging, character positions, action selection.
- `src/characters/`: reusable procedural geometry and articulated character rigs.
- `src/components/CinematicCamera.tsx`: deterministic camera shots and easing.
- `src/environments/`: corridor, cockpit, starfield, procedural planet.
- `src/components/Overlays.tsx`: captions, telemetry, decision screen, branding.
- `public/models/`: exported Wangdoo and astronaut GLBs with animation clips.
- `scripts/export_characters.tsx`: regenerates GLBs from the same source models.
- `scripts/make_audio.py`: regenerates the original score and effects.

Every pose and camera transform derives from the requested Remotion frame.
There are no uncontrolled wall-clock animation loops. The starfield and audio
use fixed seeds. Generated video and QA files are excluded from this implementation
branch. Downloadable builds are kept on the separate
[`episode-1-delivery` branch](https://github.com/AlexJang14/Altwing-video-studio/tree/episode-1-delivery).
Source, exported models, font licenses, and regeneration scripts are versioned.

See [ASSETS.md](ASSETS.md) for asset provenance and current creative limitations.
