# Assets and provenance

Episode 2's revised Wangdoo retains the owner's original reference design,
with a softer body, connected ivory face patch, smaller beak, warm cheek
blush, fine gold armor trim, and brighter, closer staging. The fabric bump
texture is procedurally generated with a fixed seed. It is embedded in
`public/models/wangdoo-soft.glb`, with ten baked animation clips. The smooth
surface subdivision uses shared edges to avoid cracks in close-up renders.

The unknown planet, landing craft, responsive flower, gateway, and moon are
original procedural geometry, materials, and shaders in `src/episode2/`.
`scripts/make_audio_episode2.py` synthesizes its original score and effects.

The astronaut, Wangdoo, spaceship, planet shader, hologram, geometry, animation,
score, sound effects, and overlays are implemented in this repository. Wangdoo's
design follows the character reference supplied by the project owner in chat.
The original reference image was visible in the conversation but was not mounted
as a downloadable workspace file; it is not redistributed in this repository.

`public/models/wangdoo.glb` and `public/models/astronaut.glb` are reusable binary
glTF assets with baked animation clips. Their original articulated React rigs
remain in `src/characters/`; rendering the episode uses those source rigs.
Coordinates: meters, +Y up, +Z front. The Wangdoo holographic projection remains a
scene effect in the source component. The GLBs use rigid articulated parts,
rather than a skinned armature.

`scripts/make_audio.py` synthesizes all music and sound effects from oscillators
and seeded noise. It uses no recordings, stock music, paid APIs, or external
voice services. The delivered episode is caption-led, without spoken narration
or voiced dialogue. Professional voices are an optional later enhancement.

DejaVu font files are bundled for reproducible captions. Their upstream license
is included at `public/fonts/LICENSE.txt`.
