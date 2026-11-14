# Silent rescue trilogy: production and verification

## Edit and render

Use the existing locked Node/Remotion/React Three Fiber/Three.js project. No new
framework or paid rendering, speech or stock-media service is required. Install
with `npm ci` only when dependencies are absent. Chrome is supplied through
`CHROME_PATH`, default `/usr/bin/chromium`.

The current configuration is `src/rescue/episodes.json`. It controls the titles,
72/72/73-second durations, panel timings, voting costs, conditional route labels
and eight-second product transitions. `src/Root.tsx` registers the three native
1080 × 1920, 30-fps compositions. `npm start` opens Remotion Studio.

- `npm run rescue:preview -- 2`: complete 360 × 640 motion preview.
- `npm run rescue:render -- 2`: native final, never an enlarged preview.
- `node scripts/rescue_render.mjs final 2 450-899`: inclusive native frame range.
- `python scripts/assemble_rescue.py 2`: join verified native ranges from
  `work/rescue/segments`, copying the H.264 picture stream; encode one continuous
  AAC soundtrack and reset timestamps to zero.
- `npm run rescue:verify -- 2`: inspect the actual exported file and fully decode it.
- `python scripts/verify_rescue_audio.py 2`: measure the actual AAC mix.
- `python scripts/rescue_contact_sheets.py --video 2`: extract final-film contact frames.
- `python scripts/scan_rescue_frames.py 2`: review the largest frame changes within shots.

`.github/workflows/rescue-render.yml` renders five independent 450-frame ranges
per episode on standard GitHub-hosted Linux runners. The last range is shorter.
Temporary render branches restrict the episode matrix to the intended batch.
All chunks must be present and frame-count verified before assembly. Files are
written under `work/rescue/renders`; source assets remain in `public/`.

## Shared characters and animation

The existing black astronaut and reusable spacecraft, station and planet assets
are retained. Archive branches preserve earlier implementations and deliveries.
The current plush model has a distinct round gray head and plump torso, a soft
white face/belly, curved smiling eyes, hanging gray flippers and pale-yellow
beak/feet. Cloth color maps, a fine procedural bump, high roughness and fabric
sheen replace the robotic body. Its compact scanner/lamp pack has a crescent ID.

**Reference limitation:** the brief refers to a new actual plush photograph, but
that photograph is absent from the attachments. This is a reconstruction from
the written gray/white plush description, informed by the earlier shown smiling
penguin reference. It is not represented as an exact match to an unseen photo.
The childhood/training images are original fictional in-universe images.

`npm run rescue:model` exports `public/models/wangdoo-plush-mentor.glb` with six
mentor performance cycles and embedded color textures. The canonical film rig
remains in TypeScript. glTF omits Three's bump-map extension and source-controlled
light/status animations; the film retains them. The optional GLB walk is an
in-place cycle. Film locomotion uses world-stamped feet.

`motion1/2/3.ts` supplies deterministic blocking. Foot placements follow curve
arc distance with actual planted world positions. Three-dimensional leg IK keeps
soles flat; deliberate stance changes lift feet. Arm IK includes the hand offset
and an optional elbow direction for carrying around the plush body. Quaternion
properties stay stable across FK/IK transitions. Support points place the glove
tangent to a flipper or head. Carrying uses the physical backpack loop, never a
glove through the plush. The human sets Wangdoo on flat ground beside the ramp.

Static scenery is batched by material without changing its geometry/shading.
Animated pressure doors and contacts remain separate. Cameras respect the
vertical frame and leave space for mobile-readable mission panels.

## Physical verification

`npm run rescue:collision -- N` builds the actual shared character meshes in the
React Three test renderer and evaluates every frame. It checks actual hand-marker
contacts, visible foot mesh bounds, planted-sole drift, convex ellipsoid shell
intersections, arm capsules versus plush cloth, head separation, pit/rail bounds
and the timed closing doors. A declared reassuring touch passes only when the
actual glove support surface matches the plush head surface within 2 mm; other
arm/head collisions remain forbidden. Contacts and landings are exported for
precise synthesized foley.

`npm run rescue:environment` adds actual spacecraft hull ellipsoids and conservative
solid-box checks for the walls, consoles, transmitter, cradle and pressure door.
It also checks visible mesh vertices against the floor, including knees, hands,
flippers and crash recovery. Geometry tolerance is 3 mm. Reported tiny cloth
compression below this tolerance is disclosed in the validation report. Airborne
and absent exterior actors are not treated as planted on the exterior floor.

Use `npm run rescue:qa -- N` for representative half-resolution rendered frames;
`QA_TIMES=14.1,48.1` limits inspection to those configured times. Equipment checks,
carry/reassurance and the first episode's bulkhead also have short rendered motion
previews. Final contact sheets are extracted from the actual assembled movies.

## Sound and authentic product footage

`npm run rescue:audio` synthesizes original stereo music, air/breath circulation,
knocks, impacts, mechanical sounds, subtle nonverbal chirps and contact-timed
footsteps. There is no narration, dialogue or speech synthesis. Earlier voiced
assets are retained only for the earlier films. Mix target: −20 LUFS / −1.5 dBTP.

Authentic unmodified activities were captured from the official user-supplied
AltWing site, `https://junjang06.github.io/altwing/#/`, using its own navigation:

| Story engineering problem | Actual activity | Official route |
|---|---|---|
| One descent / no return reserve | Engine Tradeoff | `#/aerospace-build?wing=propulsion` |
| One source / two continuous loads | Build a Mars Mission | `#/aerospace-build?wing=mission-design` |
| Unreliable guidance / limited recovery | Lost Sensor | `#/aerospace-build?wing=gnc` |

Capture evidence is `public/rescue/verified-activities.json`. Fictional story
interfaces are separate assets; the endings do not claim that this survival
series is playable on AltWing. Promotion components retain A/B participation,
show the relevant experiment, broaden to engineering interests and hands-on
projects, and display the official link. No account data was accessed.

## Story continuity

The [story bible](STORY-BIBLE.md) defines the author-only answer, limited reveal
schedule and planned eight-episode emotional arc. The [trackers](TRACKERS.md)
record character progress, clue/payoff timing and the lasting costs of each
branch. Only Episodes 1–3 are produced. Later episodes and alternative routes are
specifications. Both characters survive the planned finale; the astronaut
supplies light and leadership, then chooses to continue alongside his companion.
