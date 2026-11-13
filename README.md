# THE LAST WING — Episode 1: The Signal

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
