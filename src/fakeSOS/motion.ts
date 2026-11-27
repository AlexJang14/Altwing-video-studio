import *as THREE from'three';import{ramp,between,blendV,smooth,type V3}from'../characters/performance';import{applyPerson,bodyState,localToWorld,restGripWorld,turnPerson,turnPenguin,type Person,type Foot}from'../reset/rig';import{type Plush}from'./face';
export const KNOCKS=[22.65,23.22,23.79,27.10,27.67,28.24,31.45,32.02,32.59,34.10,34.67,35.24];
export const CUTS=[0,.6,1.8,4,6.8,9,12,13.72,14.4,15.8,17.7,19,21,23.8,25.5,28.5,29.6,30.8,32,34.7,37,39,41.5,43.5,46,48.5,49.15,50.8,52.6,54.8,56,57.2,58.5,59.2,65.2,69.8,71.65];
export const storyTime=(t:number)=>t>=1.8&&t<4?42.3+(t-1.8)*.20:t;
export const gateGap=(t:number)=>t<48.4?3.15:t<49.4?3.15-1.53*ramp(t,48.4,49.4):t<65?1.62:1.62-1.51*ramp(t,65,71.65);
export const shipDistance=(t:number)=>t<45.8?0:t<55?1.8*ramp(t,45.8,55):1.8+7.8*ramp(t,55,72);
export const hatchOpen=(t:number)=>ramp(t,30.15,30.85);
const Y=new THREE.Vector3(0,1,0),routes=new Map<string,{curve:THREE.CatmullRomCurve3;length:number}>();
/** Planted world-space feet, purpose-specific stride/cadence; no accumulating frame state. */
export function travel(t:number,points:V3[],start:number,end:number,kind:'walk'|'run'|'small'|'small-run'|'crouch'='walk'){
 const key=JSON.stringify(points);if(!routes.has(key)){const curve=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));routes.set(key,{curve,length:curve.getLength()});}const{curve,length}=routes.get(key)!,small=kind.startsWith('small'),run=kind.includes('run'),stride=kind==='crouch'?.40:small?(run?.65:.42):(run?1.20:.95),cycles=Math.max(1,Math.round(length/stride)),cycle=length/cycles;
 const duration=end-start,dt=THREE.MathUtils.clamp(t-start,0,duration),accel=Math.min(.20,duration*.18),area=(v:number)=>.5*v-.5*accel/Math.PI*Math.sin(Math.PI*v/accel),u=dt<accel?area(dt)/(duration-accel):dt>duration-accel?1-area(duration-dt)/(duration-accel):(dt-.5*accel)/(duration-accel),distance=u*length;
 const point=(d:number)=>{const f=THREE.MathUtils.clamp(d/length,0,1),p=curve.getPointAt(f),v=curve.getTangentAt(f);if(d<0)p.addScaledVector(v,d);if(d>length)p.addScaledVector(v,d-length);return{p,yaw:Math.atan2(v.x,v.z)};},root=point(distance),stance=run?.47:.60;
 const feet=[-1,1].map((side,i)=>{const phase=distance/cycle+i*.5,k=Math.floor(phase),fraction=phase-k,old=(k-i*.5+.23)*cycle,swing=fraction>stance,q=(fraction-stance)/(1-stance),stamp=point(old+(swing?smooth(q)*cycle:0)),p=stamp.p.clone().add(new THREE.Vector3(Math.cos(stamp.yaw),0,-Math.sin(stamp.yaw)).multiplyScalar(side*(small?.108:.132)));p.y+=(small?0:.07)+(swing?(small?(run?.075:.045):kind==='crouch'?.045:run?.12:.075)*Math.sin(Math.PI*q)**2:0);p.sub(root.p).applyAxisAngle(Y,-root.yaw);return{p:p.toArray()as V3,yaw:stamp.yaw-root.yaw};});return{p:root.p.toArray()as V3,yaw:root.yaw,feet,phase:distance/cycle*Math.PI*2,gait:between(t,start,end,.20)};
}
function face<T extends Person|Plush>(a:T,yaw:number):T{const d=a.yaw-yaw;a.pose.feet=a.pose.feet?.map(f=>({p:new THREE.Vector3(...f.p).applyAxisAngle(Y,d).toArray()as V3,yaw:f.yaw+d}));a.yaw=yaw;return a;}
export const posePoint=(v:V3,a:Person)=>{const b=bodyState(a.pose);return localToWorld(new THREE.Vector3(...v).applyQuaternion(b.q).add(new THREE.Vector3(0,b.y,0)),a).toArray()as V3;};
export function humanWalk(t:number,path:V3[],start:number,end:number,kind:'walk'|'run'|'crouch'='walk'):Person{const m=travel(t,path,start,end,kind),a:Person={p:m.p,yaw:m.yaw,pose:{feet:m.feet,bodyY:-.115+(kind==='run'?.018:0)*Math.sin(m.phase*2)*m.gait,phase:m.phase,gait:m.gait,lean:(kind==='run'?.11:.02)*m.gait,headPitch:.03}};
 if(kind==='crouch'){a.pose.crouch=.88;a.pose.bodyY=-.02;a.pose.lean=.035;}
 if(kind==='run'){for(const side of[-1,1]as const){const swing=Math.sin(m.phase+(side<0?0:Math.PI))*m.gait,target=posePoint([side*.30,1.10+.09*swing,.12+.21*swing],a);if(side<0)a.pose.leftTarget=target;else a.pose.rightTarget=target;}}
 return a;}
export function plushWalk(t:number,path:V3[],start:number,end:number,run=false):Plush{const m=travel(t,path,start,end,run?'small-run':'small');return{p:m.p,yaw:m.yaw,pose:{feet:m.feet,bob:Math.abs(Math.sin(m.phase))*(run?.009:.004)*m.gait,bodyRoll:Math.sin(m.phase)*(run?.055:.028)*m.gait,wingL:run?.16:.04,wingR:run?.16:.04},flipperPitch:.04+.20*Math.sin(m.phase)*m.gait};}
export const packPoint=(w:Plush):V3=>localToWorld(new THREE.Vector3(.081,.46,-.335).applyEuler(new THREE.Euler(w.bodyPitch??0,0,w.pose.bodyRoll??0)).add(new THREE.Vector3(0,w.pose.bob??0,0)),w).toArray()as V3;
export const flipperPoint=(w:Plush):V3=>localToWorld(new THREE.Vector3(.025,-.155,.035).applyEuler(new THREE.Euler(w.flipperPitch??.02,0,w.pose.wingR??.02)).add(new THREE.Vector3(.178,.382,-.004)).applyEuler(new THREE.Euler(w.bodyPitch??0,0,w.pose.bodyRoll??0)).add(new THREE.Vector3(0,w.pose.bob??0,0)),w).toArray()as V3;
export const LAMP_RELEASE=14.05,LAMP_CATCH=14.32;
function introPlush(t:number):Plush{let w:Plush;if(t<13.1)w=plushWalk(t,[[-.90,0,.65],[-.28,0,.25]],12.0,13.1);else w=turnPenguin({p:[-.28,0,.25],yaw:Math.PI/2,pose:{}},t,travel(13.1,[[-.90,0,.65],[-.28,0,.25]],12,13.1,'small').yaw,Math.PI/2,13.1,13.55,{from:travel(13.1,[[-.90,0,.65],[-.28,0,.25]],12,13.1,'small').feet});
 w.pose.headYaw=-.38;w.pose.headRoll=.035;w.pose.headPitch=-.12*between(t,14.35,18,.4);w.pose.wingR=-.45*between(t,12.8,14.35,.3);w.pose.wingL=-.14*between(t,12.8,14.35,.3);w.flipperPitch=-1.30*between(t,12.8,14.35,.3);w.pose.bodyRoll=(w.pose.bodyRoll??0)+.045*Math.sin((t-13.7)*12)*between(t,13.7,14.7,.15);w.pat=between(t,16.2,17.2,.25);return w;}
export function droppedLamp(t:number):V3{const p=flipperPoint(introPlush(LAMP_RELEASE)),target:V3=[.12,.30,.20],d=LAMP_CATCH-LAMP_RELEASE,u=THREE.MathUtils.clamp(t-LAMP_RELEASE,0,d);return[p[0]+(target[0]-p[0])*u/d,p[1]+((target[1]-p[1]+4.9*d*d)/d)*u-4.9*u*u,p[2]+(target[2]-p[2])*u/d];}
export type Motion={a:Person;w:Plush;contact?:{side:'L'|'R';target:V3;kind:string};ship:boolean;exterior:boolean};
const backA:V3[]=[[.65,0,-9.55],[.55,0,-2]],backW:V3[]=[[-.35,0,-9.0],[-.35,0,-1.3]],runA:V3[]=[[.55,0,-2],[.55,0,6.28]],runW:V3[]=[[-.35,0,-1.3],[-.22,0,4.92]],returnA:V3[]=[[.55,0,6.28],[.82,0,5.30],[.35,0,4.50]],pushA:V3[]=[[.35,0,4.50],[.35,0,6.50]],pushW:V3[]=[[-.22,0,4.92],[-.22,0,6.92]];
export function blocking(display:number):Motion{const t=storyTime(display);let a:Person={p:[.30,0,.16],yaw:-Math.PI/2,pose:{bodyY:-.115,headPitch:.2}},w:Plush={p:[-.28,0,.25],yaw:Math.PI/2,pose:{headRoll:.03,headYaw:-.3}};let contact:Motion['contact'];
 const ship=t>=6.8&&t<19,exterior=(t>=4&&t<6.8)||(t>=9&&t<12);
 if(t>=12&&t<19){w=introPlush(t);const kneel=between(t,13.3,18.8,.5);a.pose.crouch=kneel;a.pose.bodyY=-.115-.045*kneel;a.pose.headPitch=.32;a.pose.headYaw=.25;
  const catchTarget:V3=[.12,.30,.20];const catchWeight=ramp(t,13.85,LAMP_CATCH);a.pose.rightTarget=blendV(restGripWorld(a,1),catchTarget,catchWeight);
  if(t>=LAMP_CATCH){a.pose.rightTarget=blendV(catchTarget,[.18,.60,.23],ramp(t,LAMP_CATCH,15.4));if(t>=17.6)a.pose.rightTarget=blendV([.18,.60,.23],posePoint([.13,1.25,.185],a),ramp(t,17.6,18.35));}
  a.pose.rightPole=[.5,0,1];const pat=between(t,15.85,17.55,.35),hover:V3=[.02,1.05,.10],target:V3=[-.22,.842-.012*between(t,16.2,17.2,.25),.17];
  if(t>=15.25&&t<18.1){a.pose.leftTarget=t<15.85?blendV(restGripWorld(a,-1),hover,ramp(t,15.25,15.85)):t<17.55?blendV(hover,target,pat):blendV(hover,restGripWorld(a,-1),ramp(t,17.55,18.1));a.pose.leftPole=[-.8,1,.6];if(pat>.999)contact={side:'L',target,kind:'gentle-head-pat'};}

 }
 else if(t>=19&&t<21){a=humanWalk(t,[[.58,0,6.2],[.58,0,3.8]],19,21);w=plushWalk(t,[[-.36,0,6.6],[-.36,0,4.9]],19,21);}
 else if(t>=21&&t<26.4){a=humanWalk(t,[[.62,0,-7.1],[.62,0,-8.4]],21,23);w=plushWalk(t,[[-.35,0,-6.5],[-.35,0,-7.65]],21.1,23.0);a.pose.headYaw=.3;w.pose.headRoll=.09*ramp(t,22.65,23.2);}
 else if(t>=26.4&&t<29.4){a=humanWalk(t,[[.62,0,-8.4],[.65,0,-10.1]],26.4,29.0);w=plushWalk(t,[[-.35,0,-7.65],[-.35,0,-9.3]],26.55,29.1);w.pose.headPitch=.2*ramp(t,28.3,28.9);}
 else if(t>=29.4&&t<33.0){a={p:[.65,0,-10.1],yaw:Math.PI,pose:{bodyY:-.115,headYaw:.15,headPitch:.1,feet:travel(29,[[.62,0,-8.4],[.65,0,-10.1]],26.4,29).feet}};w={p:[-.35,0,-9.3],yaw:Math.PI,pose:{headPitch:.14,headRoll:-.08,feet:travel(29.1,[[-.35,0,-7.65],[-.35,0,-9.3]],26.55,29.1,'small').feet}};
  const press=between(t,29.5,30.35,.20),target:V3=[.87,1.17,-10.64];if(press>0){a.pose.leftTarget=blendV(restGripWorld(a,-1),target,press);if(press>.999)contact={side:'L',target,kind:'inspection-latch'};}a.pose.leftPole=[-.5,0,1];
 }
 else if(t>=33&&t<37.4){a=face(humanWalk(t,[[.65,0,-10.1],[.65,0,-9.55]],33,33.65),Math.PI);w=face(plushWalk(t,[[-.35,0,-9.3],[-.35,0,-9.0]],33,33.65),Math.PI);a.pose.headYaw=.5;w.pose.headYaw=-.35;w.pose.headPitch=-.15;if(t>=36.7){a=turnPerson(a,t,Math.PI,0,36.7,37.4,{from:a.pose.feet,to:travel(37.4,backA,37.4,45.7).feet});w=turnPenguin(w,t,Math.PI,0,36.7,37.4,{from:w.pose.feet,to:travel(37.4,backW,37.4,45.7,'small').feet});}}
 else if(t>=37.4&&t<46){a=humanWalk(t,backA,37.4,45.7);w=plushWalk(t,backW,37.4,45.7);a.pose.rightTarget=posePoint([.0,1.20,.34],a);a.pose.headPitch=.27;a.pose.headYaw=.22;w.pose.headYaw=-.25;}
 else if(t>=46&&t<48.5){a=humanWalk(t,runA,46,48.5,'run');w=plushWalk(t,runW,46.2,49.15,true);}
 else if(t>=48.5&&t<49.25){a=turnPerson({p:[.55,0,6.28],yaw:0,pose:{bodyY:-.115}},t,0,travel(49.25,returnA,49.25,50.35,'crouch').yaw,48.5,48.9,{from:travel(48.5,runA,46,48.5,'run').feet,to:travel(49.25,returnA,49.25,50.35,'crouch').feet});w=plushWalk(t,runW,46.2,49.15,true);w.bodyPitch=.40*ramp(t,49.15,49.4);w.pose.headPitch=.12*ramp(t,49.15,49.4);w.pose.wingL=.25;w.pose.wingR=.25;const weight=between(t,48.9,49.28,.12),target:V3=[.98,1.20,5.82];a.pose.leftTarget=blendV(restGripWorld(a,-1),target,weight);a.pose.leftPole=[-.5,0,1];a.pose.headYaw=.35;if(weight>.999)contact={side:'L',target,kind:'emergency-door-hold'};}
 else if(t>=49.25&&t<50.8){a=humanWalk(t,returnA,49.25,50.35,'crouch');if(t>=50.35)a=turnPerson(a,t,a.yaw,0,50.35,50.8,{from:travel(50.35,returnA,49.25,50.35,'crouch').feet,to:travel(51.25,pushA,51.25,54.7,'crouch').feet});a.pose.rightTarget=posePoint([.12,1.20,.18],a);a.pose.rightPole=[.5,.5,-1];w={p:[-.22,0,4.92],yaw:0,bodyPitch:.40*ramp(t,49.15,49.4),pose:{feet:travel(49.15,runW,46.2,49.15,'small-run').feet,headPitch:.12,headYaw:.35,wingL:.25,wingR:.25}};}
 else if(t>=50.8){
  if(t<54.7){a=humanWalk(t,pushA,51.25,54.7,'crouch');w=plushWalk(t,pushW,51.25,54.7);w.bodyPitch=.40*(1-ramp(t,51.0,51.65));w.pose.headPitch=.10*(1-ramp(t,51.1,51.8));w.pose.headYaw=.5*ramp(t,51.6,52.5);w.pose.wingL=.12;w.pose.wingR=.12;}
  else{a={p:[.35,0,6.50],yaw:0,pose:{crouch:.88,bodyY:-.02,feet:travel(54.7,pushA,51.25,54.7,'crouch').feet,headPitch:.28}};w={p:[-.22,0,6.92],yaw:0,pose:{feet:travel(54.7,pushW,51.25,54.7,'small').feet,headPitch:-.18,headYaw:.5}};
   a=turnPerson(a,t,0,-.94,55.2,56.0,{from:a.pose.feet});if(t>=57.2)w=turnPenguin(w,t,0,Math.PI,57.2,58.45,{from:w.pose.feet});w.pose.headYaw=t<57.2?.4:.6;w.pose.headPitch=-.18;
  }
  const help=between(t,50.8,55.4,.25);if(help>0){const target=packPoint(w);a.pose.leftTarget=blendV(restGripWorld(a,-1),target,help);a.pose.leftPole=[-.4,0,-1];if(help>.999)contact={side:'L',target,kind:'barrier-rescue-support'};}
  if(t>=56){a.pose.headYaw=-.05+.30*between(t,60,63,.5);a.pose.headPitch=.28;}
 }
 // Lift/replant feet before a new walk or backward step, instead of swapping stance.
 if(t>=25.8&&t<26.4)a=turnPerson(a,t,Math.PI,travel(26.4,[[.62,0,-8.4],[.65,0,-10.1]],26.4,29).yaw,25.8,26.4,{from:travel(23,[[.62,0,-7.1],[.62,0,-8.4]],21,23).feet,to:travel(26.4,[[.62,0,-8.4],[.65,0,-10.1]],26.4,29).feet});
 if(t>=26.0&&t<26.55)w=turnPenguin(w,t,Math.PI,Math.PI,26,26.55,{from:travel(23,[[-.35,0,-6.5],[-.35,0,-7.65]],21.1,23,'small').feet,to:travel(26.55,[[-.35,0,-7.65],[-.35,0,-9.3]],26.55,29.1,'small').feet});
 if(t>=32.4&&t<33){const pa=face(humanWalk(33,[[.65,0,-10.1],[.65,0,-9.55]],33,33.65),Math.PI),pw=face(plushWalk(33,[[-.35,0,-9.3],[-.35,0,-9]],33,33.65),Math.PI);a=turnPerson(a,t,Math.PI,Math.PI,32.4,33,{from:travel(29,[[.62,0,-8.4],[.65,0,-10.1]],26.4,29).feet,to:pa.pose.feet});w=turnPenguin(w,t,Math.PI,Math.PI,32.4,33,{from:travel(29.1,[[-.35,0,-7.65],[-.35,0,-9.3]],26.55,29.1,'small').feet,to:pw.pose.feet});}
 return{a,w,contact,ship,exterior};
}
export function lampState(t:number,b:Motion){if(t<LAMP_RELEASE)return{p:flipperPoint(b.w),yaw:b.w.yaw,roll:0};if(t<LAMP_CATCH)return{p:droppedLamp(t),yaw:Math.PI/2,roll:(t-LAMP_RELEASE)*10};if(t<18.35)return{p:b.a.pose.rightTarget??restGripWorld(b.a,1),yaw:Math.PI/2,roll:2.7*(1-ramp(t,LAMP_CATCH,15.1))};return{p:posePoint([.13,1.25,.185],b.a),yaw:b.a.yaw,roll:Math.PI/2};}
export function thief(t:number):Person{const path:V3[]=[[.15,0,1.9],[-.5,0,0],[.3,0,-1.55]];let a=t<3.8?humanWalk(t,path,.15,3.8):turnPerson(humanWalk(3.8,path,.15,3.8),t,travel(3.8,path,.15,3.8).yaw,Math.PI,3.8,4.3,{from:travel(3.8,path,.15,3.8).feet});const touch=ramp(t,4.35,5.10);a.pose.leftTarget=blendV(restGripWorld(a,-1),[.65,1.09,-2.06],touch);a.pose.leftPole=[-.5,0,1];a.pose.headPitch=.13;return a;}
