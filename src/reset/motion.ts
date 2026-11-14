import * as THREE from 'three';
import {ramp,between,blendV,type V3}from '../characters/performance';
import {walk,turnPenguin,turnPerson,localToWorld,type Person,type Penguin,type Foot,restGripWorld}from './rig';
export type ResetBlocking={a:Person;w:Penguin;contact?:{side:'L'|'R';target:V3;kind:string};hideHuman?:boolean};
export const packPoint=(w:Penguin)=>localToWorld(new THREE.Vector3(.081,.360,-.265).applyEuler(new THREE.Euler(0,0,w.pose.bodyRoll??0)).add(new THREE.Vector3(0,w.pose.bob??0,0)),w).toArray()as V3;
export const targetBlend=(rest:V3,target:V3,weight:number)=>blendV(rest,target,weight);
const entryA:V3[]=[[.58,0,6.20],[.58,0,3.80]],entryW:V3[]=[[-.36,0,6.60],[-.36,0,4.90]];
const doorA:V3[]=[[.58,0,-7.10],[.58,0,-8.95]],doorW:V3[]=[[-.36,0,-6.25],[-.36,0,-8.10]];
const reachA:V3[]=[[.62,0,-8.95],[.62,0,-10.16]],nervousW:V3[]=[[-.36,0,-8.10],[-.30,0,-9.10]];
const returnA:V3[]=[[.62,0,-10.16],[.62,0,-8.60]],returnW:V3[]=[[-.30,0,-9.10],[-.30,0,-8.35]];
function personWalk(t:number,points:V3[],start:number,end:number):Person{const m=walk(t,points,start,end);return{p:m.p,yaw:m.yaw,pose:{feet:m.feet,bodyY:-.115-Math.sin(m.phase)**2*.008*m.gait,phase:m.phase,gait:m.gait,lean:.025*m.gait,headPitch:.025,lamp:1}};}
function penguinWalk(t:number,points:V3[],start:number,end:number):Penguin{const m=walk(t,points,start,end,true);return{p:m.p,yaw:m.yaw,pose:{feet:m.feet,bob:Math.abs(Math.sin(m.phase))*.003*m.gait,bodyRoll:Math.sin(m.phase)*.023*m.gait,headRoll:.025,lamp:1}};}
export function blocking(t:number):ResetBlocking{
 let a:Person={p:[.35,0,-1.72],yaw:0,pose:{headYaw:-.20}},w:Penguin={p:[-.55,0,-1.3],yaw:0,pose:{headRoll:.035,headYaw:.1}},contact:ResetBlocking['contact'];
 if(t<3){a={p:[.58,0,-8.95],yaw:Math.PI,pose:{headYaw:.8*(1-ramp(t,1.3,2.25))}};w={p:[-.36,0,-8.1],yaw:Math.PI,pose:{headPitch:.05,worry:.25,lamp:1}};}
 else if(t>=8&&t<15){
  if(t<9.1)w=turnPenguin({p:[-.55,0,-1.3],yaw:0,pose:{headYaw:.15,headRoll:.035}},t,0,Math.PI/2,8.6,9.1,{to:walk(9.1,[[-.55,0,-1.3],[-.22,0,-1.3]],9.1,9.9,true).feet});
  else if(t<9.9){w=penguinWalk(t,[[-.55,0,-1.3],[-.22,0,-1.3]],9.1,9.9);w.pose.headYaw=-.20;}
  else w=turnPenguin({p:[-.22,0,-1.3],yaw:0,pose:{headYaw:.4,headRoll:.035}},t,Math.PI/2,0,9.9,10.55,{from:walk(9.9,[[-.55,0,-1.3],[-.22,0,-1.3]],9.1,9.9,true).feet});
  const kneel=between(t,10.15,13.85,.45);a.pose.crouch=kneel;a.pose.bodyY=-.16*kneel;a.pose.headYaw=-.6;a.pose.headPitch=.22*kneel;
  const touch=between(t,10.9,12.35,.28);if(touch>0){const target=packPoint(w);a.pose.leftTarget=targetBlend(restGripWorld(a,-1),target,touch);a.pose.leftPole=[-.4,0,-1];if(touch>.9999)contact={side:'L',target,kind:'backpack-check'};}
  w.pose.scanner=between(t,12.8,15,.20);w.pose.headPitch=-.10*between(t,12.4,14.8,.3);
 }else if(t>=15&&t<17.8){a=personWalk(t,entryA,15.8,17.8);w=penguinWalk(t,entryW,15.8,17.8);w.pose.headYaw=-.15;}
 else if(t>=17.8&&t<22){a={p:[.58,0,-3.5],yaw:Math.PI,pose:{headYaw:-.55,lamp:1}};w={p:[-.36,0,-2.7],yaw:Math.PI,pose:{headYaw:.3,lamp:1}};}
 else if(t>=22&&t<24){a={p:[.58,0,-7.1],yaw:Math.PI,pose:{headYaw:.6*(1-ramp(t,22.2,23.3)),lamp:1}};w={p:[-.36,0,-6.25],yaw:Math.PI,pose:{headYaw:.7*(1-ramp(t,22.08,22.7)),headRoll:-.06*ramp(t,22.2,23),headPitch:.025,worry:.43,lamp:1}};}
 else if(t>=24&&t<27){a=personWalk(t,doorA,24,26.75);w=penguinWalk(t,doorW,24.12,26.90);w.pose.worry=.43;}
 else if(t>=27&&t<31){a={p:[.58,0,-8.95],yaw:Math.PI,pose:{headYaw:.55,lamp:1}};w={p:[-.36,0,-8.1],yaw:Math.PI,pose:{scanner:ramp(t,27,27.5),worry:.35,headPitch:.06,headYaw:-.1,lamp:1}};}
 else if(t>=31&&t<34){a=personWalk(t,reachA,31,31.85);const reach=between(t,31.9,32.8,.25)*(1-ramp(t,32.15,32.6));a.pose.leftTarget=targetBlend(restGripWorld(a,-1),[1.20,1.53,-10.43],reach);a.pose.headYaw=-.3;a.pose.headPitch=.08;w={p:[-.36,0,-8.1],yaw:Math.PI,pose:{scanner:1,worry:.48,lamp:1}};}
 else if(t>=34&&t<45){
  a={p:[.62,0,-10.16],yaw:Math.PI,pose:{headYaw:.15,headPitch:.08,lamp:1}};
  w=penguinWalk(t,nervousW,34.8,36.35);w.pose.scanner=1-ramp(t,34.2,35.4);w.pose.worry=.7;w.pose.headPitch=.18;w.pose.headYaw=-.18;w.pose.wingR=.06;
  if(t>=39){const u=ramp(t,39.2,39.9);a.pose.rightTarget=targetBlend(restGripWorld(a,1),localToWorld(new THREE.Vector3(.02,1.28,.38),a).toArray()as V3,u);a.pose.headYaw=.25;a.pose.headPitch=.27;}
 }else if(t>=45){
  if(t<45.7){a=turnPerson({p:[.62,0,-10.16],yaw:Math.PI,pose:{bodyY:-.115,lamp:1}},t,Math.PI,0,45,45.7,{to:walk(45.7,returnA,45.7,47.3).feet});w=turnPenguin({p:[-.30,0,-9.10],yaw:Math.PI,pose:{worry:.65,lamp:1}},t,Math.PI,0,45,45.7,{to:walk(45.7,returnW,45.7,47.3,true).feet});}
  else if(t<48){a=personWalk(t,returnA,45.7,47.3);w=penguinWalk(t,returnW,45.7,47.3);w.pose.worry=.65;}
  else{a=turnPerson({p:[.62,0,-8.60],yaw:0,pose:{bodyY:-.115,lamp:1}},t,0,-Math.PI/2,48,49.3,{from:walk(47.3,returnA,45.7,47.3).feet});w={p:[-.30,0,-8.35],yaw:0,pose:{feet:walk(47.3,returnW,45.7,47.3,true).feet,worry:.60,lamp:1,headYaw:.62,headPitch:-.18,headRoll:.07}};a.pose.headYaw=-.55+1.1*between(t,50,55,.8)-1.1*between(t,56.5,60,.8);a.pose.headPitch=.09;}
 }
 return{a,w,contact,hideHuman:t>=17.8&&t<20.4};
}
export const shipDeparture=(t:number)=>Math.max(0,30-(t-45));
export const intruderBlocking=(t:number):Person=>{
 const route:V3[]=[[.15,0,2.6],[-.55,0,.0],[.30,0,-1.55]],end=personWalk(4.2,route,1,4.2);let a=t<4.2?personWalk(t,route,1,4.2):turnPerson({...end,pose:{bodyY:-.115}},t,end.yaw,Math.PI,4.2,4.62,{from:end.pose.feet});a.pose.lamp=0;
 const touch=ramp(t,4.7,5.2);a.pose.leftTarget=targetBlend(restGripWorld(a,-1),[.65,1.09,-2.06],touch);a.pose.headPitch=.18;return a;
};
