import * as THREE from 'three';
export type V3=[number,number,number];
export const sat=(x:number)=>Math.max(0,Math.min(1,x));
export const smooth=(x:number)=>{const t=sat(x);return t*t*t*(t*(t*6-15)+10);};
export const ramp=(t:number,a:number,b:number)=>smooth((t-a)/(b-a));
export const between=(t:number,a:number,b:number,fade=.25)=>ramp(t,a,a+fade)*(1-ramp(t,b-fade,b));
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export const blendV=(a:V3,b:V3,t:number):V3=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
export const yawMix=(a:number,b:number,t:number)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*t;
export const jump=(t:number,start:number,duration:number,height:number)=>{const u=(t-start)/duration;return u>0&&u<1?height*4*u*(1-u):0;};
export type AstroPose={gait?:number;run?:number;phase?:number;crouch?:number;lean?:number;roll?:number;bodyY?:number;leftArm?:number;rightArm?:number;leftElbow?:number;rightElbow?:number;leftSpread?:number;rightSpread?:number;headPitch?:number;headYaw?:number;headRoll?:number};
export type WangPose={gait?:number;run?:number;phase?:number;lean?:number;roll?:number;lift?:number;squash?:number;wingL?:number;wingR?:number;swingL?:number;swingR?:number;panic?:number;kick?:number;thrust?:number;talk?:number};
export const footCycle=(phase:number,stride:number,height:number)=>{
 const u=((phase/(Math.PI*2))%1+1)%1;
 if(u<.6)return {z:stride*(1-2*u/.6),y:0};
 const f=(u-.6)/.4;return {z:lerp(-stride,stride,smooth(f)),y:height*Math.sin(Math.PI*f)**2};
};
export const astroState=(time:number,p:AstroPose)=>{
 const gait=sat(p.gait??0),run=sat(p.run??0),phase=p.phase??time*lerp(6,12,run),c=sat(p.crouch??0);
 const bodyY=-.76*c+(p.bodyY??0)+gait*.025*Math.sin(phase*2);
 const pitch=p.lean??(.10*run*gait),roll=p.roll??(.012*Math.sin(phase)*gait);
 const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,0,roll));
 const legs=[-1,1].map((side,i)=>{
  const foot=footCycle(phase+i*Math.PI,lerp(.23,.38,run),lerp(.11,.24,run));
  const z=foot.z*gait+(i===0?-.96*Math.sqrt(c):.35*c);
  const lift=foot.y*gait;
  const local=new THREE.Vector3(side*.25,.135+lift-bodyY,z).applyQuaternion(q.clone().invert());
  const dy=local.y-1.12,dz=local.z,L1=.5,L2=.51,d=Math.max(.02,Math.min(1.009,Math.hypot(dy,dz)));
  const beta=Math.acos(Math.max(-1,Math.min(1,(L1*L1+d*d-L2*L2)/(2*L1*d))));
  const upper=Math.atan2(-dz,-dy)-beta;
  const knee=Math.PI-Math.acos(Math.max(-1,Math.min(1,(L1*L1+L2*L2-d*d)/(2*L1*L2))));
  return {upper,knee,ankle:-upper-knee-pitch};
 });
 const swing=Math.sin(phase)*lerp(.38,.70,run)*gait;
 return {bodyY,pitch,roll,legs,phase,gait,run,
  arms:[{x:p.leftArm??(-swing*.7+.06),elbow:p.leftElbow??(.18+run*gait*.68),spread:p.leftSpread??.1},{x:p.rightArm??(swing*.7+.06),elbow:p.rightElbow??(.18+run*gait*.68),spread:p.rightSpread??.1}],
  headPitch:p.headPitch??Math.sin(time*.8)*.018,headYaw:p.headYaw??0,headRoll:p.headRoll??0};
};
export const astronautHand=(time:number,p:AstroPose,side:-1|1,position:V3,yaw:number):V3=>{
 const s=astroState(time,p),a=s.arms[side===-1?0:1];
 const hand=new THREE.Vector3(0,-.46,.012).applyEuler(new THREE.Euler(-a.elbow,0,0)).add(new THREE.Vector3(0,-.44,0)).applyEuler(new THREE.Euler(a.x,0,side*a.spread)).add(new THREE.Vector3(side*.49,2.02,0)).applyEuler(new THREE.Euler(s.pitch,0,s.roll)).add(new THREE.Vector3(0,s.bodyY,0)).applyAxisAngle(new THREE.Vector3(0,1,0),yaw).add(new THREE.Vector3(...position));
 return hand.toArray() as V3;
};
export const wangState=(time:number,p:WangPose)=>{
 const gait=sat(p.gait??0),run=sat(p.run??0),phase=p.phase??time*lerp(8.4,14,run),squash=Math.max(.88,Math.min(1.1,p.squash??1));
 return {phase,gait,run,squash,lift:(p.lift??0)+Math.abs(Math.sin(phase))*.018*gait+.86*(squash-1),lean:p.lean??0,roll:(p.roll??0)+Math.sin(phase)*.05*gait,panic:sat(p.panic??0)};
};
