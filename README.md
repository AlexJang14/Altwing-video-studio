# THE LAST WING — Episode 1: The Signal

## Downloads

- [Download the final 1080×1920 episode](episode-final.mp4?raw=true)
- [Watch or download the complete 25-second preview](episode-preview.mp4?raw=true)
- [Download the working video-studio project](altwing-video-studio-source.zip?raw=true)
- [Download Wangdoo — animated 3D model](wangdoo.glb?raw=true)
- [Download the astronaut — animated 3D model](astronaut.glb?raw=true)
- [View the episode contact sheet](episode-contact-sheet.jpg)

The final episode is rendered and verified: native 1080×1920, 30 fps,
750 frames, H.264/yuv420p Rec.709 video, and stereo AAC audio. Duration: 25.003
seconds. Full-file decoding completed without errors.

[Validation report and file checksums](validation.json).

The preview is a complete 25-second, 30 fps, 360×640 H.264 video with stereo AAC.
It includes all six 3D scenes, animated characters, captions, music, sound
effects, and the final A/B decision. It is caption-led, without spoken voices.

The source ZIP includes the generated score so it can be opened immediately
after `npm ci`. It also includes reusable React/Three.js rigs and GLB exports
with seven Wangdoo animations and eight astronaut animations. Rendering and
regeneration instructions are in the project's README.

Source ZIP commit: `4becaa93b3af54e492ef6607fea07fb5efdf5d06`.
Rendered code commit: `5e366aefa230fa0ec94c3d815a2fcc5e7e966e19`
(the later source commit adds documentation and a local npm-cache setting).

This dedicated delivery branch keeps generated video downloads separate from
the implementation branch and its pull request.
