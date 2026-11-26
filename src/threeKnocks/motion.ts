import *as THREE from'three';import{ramp,between,blendV,type V3}from'../characters/performance';import{blocking as original,targetBlend}from'../reset/motion';import{walk,turnPerson,turnPenguin,restGripWorld,localToWorld,type Person,type Penguin}from'../reset/rig';
export type PlushActor=Penguin&{bodyPitch?:number};
export type Blocking={a:Person;w:PlushActor;contact?:{side:'L'|'R';target:V3;kind:string};hideHuman?:boolean};
export function personWalk(t:number,path:V3[],start:number,end:number,run=false):Person{const m=walk(t,path,start,end);return{p:m.p,yaw:m.yaw,pose:{feet:m.feet,bodyY:-.115-(run?.015:.008)*Math.sin(m.phase)**2*m.gait,gait:m.gait*(run?1.7:1),phase:m.phase,lean:(run?.11:.025)*m.gait,lamp:1}};}
export function penguinWalk(t:number,path:V3[],start:number,end:number):PlushActor{const m=walk(t,path,start,end,true);return{p:m.p,yaw:m.yaw,pose:{feet:m.feet,bob:Math.abs(Math.sin(m.phase))*.005*m.gait,bodyRoll:Math.sin(m.phase)*.034*m.gait,headRoll:.025,lamp:0}};}
function face<T extends Person|PlushActor>(actor:T,yaw:number):T{const delta=actor.yaw-yaw;actor.pose.feet=actor.pose.feet?.map(f=>({p:new THREE.Vector3(...f.p).applyAxisAngle(new THREE.Vector3(0,1,0),delta).toArray()as V3,yaw:f.yaw+delta}));actor.yaw=yaw;return actor;}
export const packPoint=(w:PlushActor):V3=>localToWorld(new THREE.Vector3(.081,.36,-.265).applyEuler(new THREE.Euler(w.bodyPitch??0,0,w.pose.bodyRoll??0)).add(new THREE.Vector3(0,w.pose.bob??0,0)),w).toArray()as V3;
const runA:V3[]=[[.62,0,-9.15],[.62,0,-3.1]],runW:V3[]=[[.18,0,-8.55],[-.22,0,-5.8]],returnA:V3[]=[[.62,0,-3.1],[.35,0,-6.22]];
export function blocking(time:number):Blocking{
 const t=time<3?29.0+time*.7:time;
 if(t>=3&&t<16){const source=t<10?3+(t-3)*5/7:8+(t-10)*7/6;const b=original(source);return{...b,w:{...b.w,pose:{...b.w.pose,scanner:0,lamp:0}}};}
 let a:Person={p:[.62,0,-9.45],yaw:Math.PI,pose:{bodyY:-.115,lamp:t>=32?1:0}},w:PlushActor={p:[-.55,0,-8.8],yaw:Math.PI,pose:{headRoll:.025,worry:.3,lamp:0}};let contact:Blocking['contact'];
 if(t>=16&&t<18){a=personWalk(t,[[.58,0,6.2],[.58,0,3.8]],16,18);w=penguinWalk(t,[[-.36,0,6.6],[-.36,0,4.9]],16,18);}
 else if(t>=18&&t<21){a={p:[.58,0,-3.5],yaw:Math.PI,pose:{headYaw:-.7,bodyY:-.115,lamp:1}};w={p:[-.36,0,-2.7],yaw:Math.PI,pose:{headYaw:.35}};}
 else if(t>=21&&t<25){a=personWalk(t,[[.58,0,-6.8],[.62,0,-9.45]],21,24.6);w=penguinWalk(t,[[-.36,0,-6.0],[-.55,0,-8.8]],21.15,23.05);w.pose.worry=.5;w.pose.headRoll=-.07*ramp(t,23.05,23.25);}
 else if(t>=25&&t<29){w.pose.headPitch=.08;w.pose.headYaw=Math.sin((t-25)*2)*.20;a.pose.headYaw=.6;a.pose.leftTarget=undefined;}
 else if(t>=29&&t<31.2){a=personWalk(t,[[.62,0,-9.45],[.62,0,-9.15]],29.1,29.65);a=face(a,Math.PI);a.pose.headYaw=-.22;a.pose.roll=-.04*between(t,29.1,29.8,.15);w=penguinWalk(t,[[-.55,0,-8.8],[.18,0,-8.55]],29.25,30.75);w=face(w,Math.PI);w.pose.worry=.87;w.pose.headRoll=-.10;}
 else if(t>=31.2&&t<45){a.p=[.62,0,-9.15];a.pose.feet=face(personWalk(29.65,[[.62,0,-9.45],[.62,0,-9.15]],29.1,29.65),Math.PI).pose.feet;w.p=[.18,0,-8.55];w.pose.feet=face(penguinWalk(30.75,[[-.55,0,-8.8],[.18,0,-8.55]],29.25,30.75),Math.PI).pose.feet;w.pose.worry=.85;w.pose.headYaw=-.3;w.pose.wingL=.08;w.pose.wingR=.05;
  if(t>=35){a.pose.rightTarget=targetBlend(restGripWorld(a,1),localToWorld(new THREE.Vector3(.04,1.27,.38),a).toArray()as V3,ramp(t,35,35.4));a.pose.headPitch=.28;a.pose.headYaw=.25;}
 }
 else if(t>=45&&t<45.5){a=turnPerson({...a,p:[.62,0,-9.15]},t,Math.PI,0,45,45.5,{to:walk(45.5,runA,45.5,48.15).feet});w=turnPenguin({...w,p:[.18,0,-8.55]},t,Math.PI,0,45,45.5);}
 else if(t>=45.5&&t<48.25){a=personWalk(t,runA,45.5,48.15,true);a.pose.leftTarget=targetBlend(restGripWorld(a,-1),localToWorld(new THREE.Vector3(-.29,1.18,.20),a).toArray()as V3,between(t,45.5,46.5,.14));a.pose.leftPole=[-.8,-.1,.5];w=penguinWalk(t,runW,45.65,48.25);w.pose.worry=.7;}
 else if(t>=48.25){
  const stumble=between(t,48.25,51.6,.18);w={p:[-.22,0,-5.8],yaw:0,bodyPitch:.29*stumble,pose:{feet:walk(48.25,runW,45.65,48.25,true).feet,bob:.008*stumble,headPitch:.10*stumble,headRoll:-.09*stumble,worry:.85-.65*ramp(t,51.1,52.3),wingL:.18*stumble,wingR:.18*stumble,headYaw:.6*ramp(t,51.1,52.2)}};
  if(t<48.85){a=turnPerson(personWalk(48.15,runA,45.5,48.15,true),t,0,Math.PI,48.25,48.85,{from:walk(48.15,runA,45.5,48.15).feet,to:walk(48.85,returnA,48.85,50.15).feet});a.pose.headYaw=-.6*between(t,48.25,48.65,.1);}
  else if(t<50.15)a=personWalk(t,returnA,48.85,50.15,true);
  else if(t<50.7)a=turnPerson(personWalk(50.15,returnA,48.85,50.15),t,walk(50.15,returnA,48.85,50.15).yaw,0,50.15,50.7,{from:walk(50.15,returnA,48.85,50.15).feet});
  else{a={p:[.35,0,-6.22],yaw:0,pose:{bodyY:-.115,lamp:1}};const kneel=between(t,50.7,52.9,.38);a.pose.crouch=kneel;a.pose.bodyY=-.115-.045*kneel;a.pose.headYaw=-.6;a.pose.headPitch=.22*kneel;const touch=between(t,51.1,52.3,.25);if(touch>0){const target=packPoint(w);a.pose.leftTarget=targetBlend(restGripWorld(a,-1),target,touch);a.pose.leftPole=[-.4,0,-1];if(touch>.9999)contact={side:'L',target,kind:'help-wangdoo'};}
   if(t>=54){a=turnPerson({...a,pose:{bodyY:-.115,lamp:1}},t,0,-Math.PI/2,54,55.2);a.pose.headYaw=.5*Math.sin((t-55)*1.4);a.pose.headPitch=.10;w.pose.headYaw=.55;w.pose.worry=.3;}
   if(t>=68){a=turnPerson({...a,pose:{bodyY:-.115,lamp:1}},t,-Math.PI/2,-Math.PI,70.5,71.1);a.pose.headYaw=-.2;a.pose.roll=.035*between(t,70.5,71.25,.14);w.pose.worry=.9;w.pose.headYaw=.6;}
  }
 }
 return{a,w,contact,hideHuman:t>=18&&t<20.8};
}
export function securityEntry(t:number):Person{const route:V3[]=[[.15,0,1.9],[-.55,0,0],[.30,0,-1.55]];let a=t<4.7?personWalk(t,route,.5,4.7):turnPerson(personWalk(4.7,route,.5,4.7),t,walk(4.7,route,.5,4.7).yaw,Math.PI,4.7,5.2,{from:walk(4.7,route,.5,4.7).feet});a.pose.lamp=0;a.pose.headPitch=.12;a.pose.leftTarget=targetBlend(restGripWorld(a,-1),[.65,1.09,-2.06],ramp(t,5.35,6.0));return a;}
export function securityFinale(t:number):Person{const a:Person={p:[-.45,0,2.28],yaw:-.42*ramp(t,0,.75),pose:{bodyY:-.115,headYaw:-.12,headPitch:-.08,lamp:0}};let impact=0;for(const k of[1.1,1.8,2.5])impact=Math.max(impact,between(t,k-.18,k+.15,.15));const target:V3=[-.68,1.88,2.493-.075*(1-impact)];a.pose.leftTarget=targetBlend(restGripWorld(a,-1),target,ramp(t,.4,.95));a.pose.leftPole=[-1,0,1];return a;}
