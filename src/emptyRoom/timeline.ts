// Retimes the preserved, coordinated original animation; no source pose is discarded.
export function sceneTime(t:number){
 const knots=[[0,0],[3,3],[10,8],[17,15],[27,27],[36,39],[46,45],[54,52],[61,60.25],[68,70]];
 for(let i=1;i<knots.length;i++){const[a,b]=knots[i-1],[c,d]=knots[i];if(t<=c)return b+(d-b)*(t-a)/(c-a);}return 70;
}
export const remaining=(t:number)=>Math.max(0,Math.min(30,Math.ceil(30-(t-42.2))));
