export const EPISODE = {
  title: 'THE LAST WING', subtitle: 'EPISODE 01 / THE SIGNAL',
  fps: 30, width: 1080, height: 1920, durationInFrames: 750,
  scenes: [
    {id: 'awakening', start: 0, end: 120, line: 'You wake up alone in space.'},
    {id: 'emergency', start: 120, end: 240, line: 'And your oxygen is running out.'},
    {id: 'wangdoo', start: 240, end: 390, line: 'Captain! I found something!'},
    {id: 'signal', start: 390, end: 540, line: 'A signal is coming from an unknown planet.'},
    {id: 'crisis', start: 540, end: 630, line: 'Fuel for one jump!'},
    {id: 'choice', start: 630, end: 750, line: 'What would you choose?'},
  ],
  choices: [
    {key: 'A', title: 'EXPLORE THE', destination: 'SPACE STATION', color: '#52d8ff'},
    {key: 'B', title: 'LAND ON THE', destination: 'UNKNOWN PLANET', color: '#bca5ff'},
  ],
} as const;
export const C = {black: '#080a0f', blue: '#07111f', charcoal: '#171b25', cyan: '#52d8ff', amber: '#ffb657', red: '#ff4545', violet: '#8955ff'};
export const ease = (x: number) => {const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t);};
export const mix = (a: number, b: number, t: number) => a + (b-a)*t;
