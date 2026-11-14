import data from './episodes.json';
export const stories=data.episodes;
export const brand=data.brand;
export const sceneAt=(episode:number,time:number)=>Math.max(0,stories[episode-1].scenes.findIndex(s=>time>=s.start&&time<s.end));
