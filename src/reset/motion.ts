import * as THREE from 'three';import {ramp,between,blendV,type V3}from '../characters/performance';import {walk,turnPenguin,localToWorld,type Person,type Penguin,bodyState,restGripWorld}from './rig';
export type ResetBlocking={a:Person;w:Penguin;contact?:{side:'L'|'R';target:V3;kind:string};hideHuman?:boolean};
export const packPoint=(w:Penguin)=>localToWorld(new THREE.Vector3(.081,.360,-.265).applyEuler(new THREE.Euler(0,0,w.pose.bodyRoll??0)).add(new THREE.Vector3(0,w.pose.bob??0,0)),w).toArray()as V3;
export const targetBlend=(rest:V3,target:V3,weight:number)=>blendV(rest,target,weight);
export function blocking(t:number):ResetBlocking{
 let a:Person={p:[.50,0,-1.80],yaw:.10,pose:{headYaw:-.20}},w:Penguin={p:[-.55,0,-1.3],yaw:0,pose:{headRoll:.035,headYaw:.1}},contact;
 if(t<3){a={p:[.58,0,-8.95],yaw:Math.PI,pose:{headYaw:.8*(1-ramp(t,1.3,2.25))}};w={p:[-.36,0,-8.1],yaw:Math.PI,pose:{headPitch:.05,worry:.25,lamp:1}};}
 else if(t>=8&&t<15){
  if(t<9.1){w=turnPenguin({p:[-.55,0,-1.3],yaw:0,pose:{headYaw:.15,headRoll:.035}},t,0,Math.PI/2,8.6,9.1,{to:walk(9.1,[[-.55,0,-1.3],[-.12,0,-1.3]],9.1,9.9,true).feet});}
  else if(t<9.9){const m=walk(t,[[-.55,0,-1.3],[-.12,0,-1.3]],9.1,9.9,true);w={p:m.p,yaw:m.yaw,pose:{feet:m.feet,bob:Math.abs(Math.sin(m.phase))*.003*m.gait,bodyRoll:Math.sin(m.phase)*.018*m.gait,headYaw:-.20,headRoll:.035}};}
  else w=turnPenguin({p:[-.12,0,-1.3],yaw:0,pose:{headYaw:.4,headRoll:.035}},t,Math.PI/2,0,9.9,10.55,{from:walk(9.9,[[-.55,0,-1.3],[-.12,0,-1.3]],9.1,9.9,true).feet});
  const kneel=between(t,10.15,13.85,.45);a.pose.crouch=kneel;a.pose.bodyY=-.16*kneel;a.pose.headYaw=-.6;a.pose.headPitch=.22*kneel;
  const touch=between(t,10.9,12.35,.28);if(touch>0){const target=packPoint(w);const rest=restGripWorld(a,-1);a.pose.leftTarget=targetBlend(rest,target,touch);a.pose.leftPole=[-.4,0,-1];if(touch>.9999)contact={side:'L'as const,target,kind:'backpack-check'};}
  w.pose.scanner=between(t,12.8,15,.20);w.pose.headPitch=-.10*between(t,12.4,14.8,.3);
 }
 return {a,w,contact};
}
export const shipDeparture=(t:number)=>Math.max(0,30-(t-45));
