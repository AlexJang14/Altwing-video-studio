import * as THREE from 'three';import {smooth,ramp,between,lerp,type V3}from '../characters/performance';
export type Placement={p:V3;yaw:number};
export type Foot={p:V3;yaw:number};
export type PersonPose={crouch?:number;bodyY?:number;lean?:number;roll?:number;headYaw?:number;headPitch?:number;headRoll?:number;leftTarget?:V3;rightTarget?:V3;leftPole?:V3;rightPole?:V3;feet?:Foot[];gait?:number;phase?:number;lamp?:number};
export type PenguinPose={headYaw?:number;headPitch?:number;headRoll?:number;bodyRoll?:number;bob?:number;feet?:Foot[];wingL?:number;wingR?:number;worry?:number;scanner?:number;lamp?:number};
export type Person=Placement&{pose:PersonPose};export type Penguin=Placement&{pose:PenguinPose};
const Y=new THREE.Vector3(0,1,0),down=new THREE.Vector3(0,-1,0);
export function twoBone(target:THREE.Vector3,L1:number,restTip:THREE.Vector3,pole:THREE.Vector3){
 const L2=restTip.length(),distance=Math.max(.002,Math.min(L1+L2-.00001,target.length())),axis=target.clone().normalize();
 let perpendicular=pole.clone().addScaledVector(axis,-pole.dot(axis));if(perpendicular.lengthSq()<1e-9)perpendicular=new THREE.Vector3(0,0,1).addScaledVector(axis,-axis.z);perpendicular.normalize();
 const c=THREE.MathUtils.clamp((L1*L1+distance*distance-L2*L2)/(2*L1*distance),-1,1),elbow=axis.clone().multiplyScalar(L1*c).addScaledVector(perpendicular,L1*Math.sqrt(1-c*c)),end=axis.clone().multiplyScalar(distance);
 const upper=new THREE.Quaternion().setFromUnitVectors(down,elbow.clone().normalize()),lowerWorld=new THREE.Quaternion().setFromUnitVectors(restTip.clone().normalize(),end.sub(elbow).normalize()),lower=upper.clone().invert().multiply(lowerWorld);
 return {upper,lower,distance};
}
export const bodyState=(p:PersonPose)=>({y:(p.bodyY??0)-.53*(p.crouch??0),q:new THREE.Quaternion().setFromEuler(new THREE.Euler(p.lean??0,0,p.roll??0))});
const inverseBody=(point:THREE.Vector3,pose:PersonPose)=>{const b=bodyState(pose);point.y-=b.y;return point.applyQuaternion(b.q.clone().invert());};
export const worldToLocal=(v:V3,a:Placement)=>new THREE.Vector3(...v).sub(new THREE.Vector3(...a.p)).applyAxisAngle(Y,-a.yaw);
export const localToWorld=(v:THREE.Vector3,a:Placement)=>v.clone().applyAxisAngle(Y,a.yaw).add(new THREE.Vector3(...a.p));
export function applyPerson(root:THREE.Group,a:Person){
 const node=(s:string)=>{const o=root.getObjectByName(s);if(!o)throw Error('Missing rig node '+s);return o;},p=a.pose,b=bodyState(p);root.position.set(...a.p);root.rotation.set(0,a.yaw,0);
 node('AstroBody').position.set(0,b.y,0);node('AstroBody').quaternion.copy(b.q);node('AstroHead').rotation.set(p.headPitch??0,p.headYaw??0,p.headRoll??0);
 for(const [index,side,label]of [[0,-1,'L'],[1,1,'R']]as const){
  const shoulder=new THREE.Vector3(side*.242,1.49,0),target=index===0?p.leftTarget:p.rightTarget;
  let hand:THREE.Vector3;
  if(target)hand=inverseBody(worldToLocal(target,a),p).sub(shoulder);
  else{const swing=Math.sin((p.phase??0)+(index===0?0:Math.PI))*.12*(p.gait??0);hand=new THREE.Vector3(side*.055,-.585,.09+swing);}
  const pole=new THREE.Vector3(...(index===0?p.leftPole??[side*.5,-.15,1]:p.rightPole??[side*.5,-.15,1]));
  const arm=twoBone(hand,.30,new THREE.Vector3(0,-.330,.015),pole);node('AstroUpperArm'+label).quaternion.copy(arm.upper);node('AstroForearm'+label).quaternion.copy(arm.lower);
  const foot=p.feet?.[index]??{p:[side*.132,.07,0]as V3,yaw:0};const targetFoot=inverseBody(new THREE.Vector3(...foot.p),p).sub(new THREE.Vector3(side*.121,.95,0));
  const leg=twoBone(targetFoot,.44,new THREE.Vector3(0,-.44,0),new THREE.Vector3(0,0,1));node('AstroThigh'+label).quaternion.copy(leg.upper);node('AstroShin'+label).quaternion.copy(leg.lower);
  const finalQ=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,foot.yaw,0));node('AstroFoot'+label).quaternion.copy(leg.lower.clone().invert().multiply(leg.upper.clone().invert()).multiply(b.q.clone().invert()).multiply(finalQ));
 }
 root.updateMatrixWorld(true);
}
export function applyPenguin(root:THREE.Group,w:Penguin){
 const node=(s:string)=>root.getObjectByName(s)!,p=w.pose;root.position.set(...w.p);root.rotation.set(0,w.yaw,0);
 node('WangBody').position.set(0,p.bob??0,0);node('WangBody').rotation.set(0,0,p.bodyRoll??0);node('WangHead').rotation.set(p.headPitch??0,p.headYaw??0,p.headRoll??0);
 for(const [index,side,label]of [[0,-1,'L'],[1,1,'R']]as const){
  node('WangWing'+label).rotation.set(.02,0,side*(p[index===0?'wingL':'wingR']??.02));
  const f=p.feet?.[index];node('WangFoot'+label).position.set(...(f?.p??[side*.108,0,.014]));node('WangFoot'+label).rotation.set(0,f?.yaw??0,0);
  const eye=node('WangEye'+label),ey=1-(p.worry??0)*.85;eye.scale.y=ey;eye.position.y=.032*(1-ey);eye.rotation.z=side*(p.worry??0)*.36;
 }
 root.updateMatrixWorld(true);
}
const curves=new Map<string,{curve:THREE.CatmullRomCurve3;length:number}>();
export function walk(time:number,points:V3[],start:number,end:number,small=false){
 const key=JSON.stringify(points);if(!curves.has(key)){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));curves.set(key,{curve,length:curve.getLength()});}const {curve,length}=curves.get(key)!;
 const duration=end-start,dt=THREE.MathUtils.clamp(time-start,0,duration),accel=Math.min(.22,duration*.18),area=(u:number)=>.5*u-.5*accel/Math.PI*Math.sin(Math.PI*u/accel),progress=dt<accel?area(dt)/(duration-accel):dt>duration-accel?1-area(duration-dt)/(duration-accel):(dt-.5*accel)/(duration-accel);const s=progress*length,cycles=Math.max(1,Math.round(length/(small?.42:.95))),cycle=length/cycles;
 const point=(distance:number)=>{const u=THREE.MathUtils.clamp(distance/length,0,1),p=curve.getPointAt(u),v=curve.getTangentAt(u);if(distance<0)p.addScaledVector(v,distance);if(distance>length)p.addScaledVector(v,distance-length);return {p,yaw:Math.atan2(v.x,v.z)};};
 const root=point(s),feet=[-1,1].map((side,i)=>{const phase=s/cycle+i*.5,k=Math.floor(phase),frac=phase-k,old=(k-i*.5+.23)*cycle,swing=frac>.60,u=(frac-.60)/.40,stamp=point(old+(swing?smooth(u)*cycle:0)),p=stamp.p.clone().add(new THREE.Vector3(Math.cos(stamp.yaw),0,-Math.sin(stamp.yaw)).multiplyScalar(side*(small?.108:.132)));p.y+=(small?0:.07)+(swing?(small?.045:.075)*Math.sin(Math.PI*u)**2:0);p.sub(root.p).applyAxisAngle(Y,-root.yaw);return {p:p.toArray()as V3,yaw:stamp.yaw-root.yaw};});
 return {p:root.p.toArray()as V3,yaw:root.yaw,feet,phase:s/cycle*Math.PI*2,gait:between(time,start,end,.22)};
}
export function turnPenguin(w:Penguin,t:number,from:number,to:number,start:number,end:number,stance?:{from?:Foot[];to?:Foot[]}):Penguin{
 const u=ramp(t,start,end),yaw=lerp(from,to,u),middle=(start+end)*.5;
 const feet=[-1,1].map((side,i)=>{const a=i===0?start:middle,b=i===0?middle:end,raw=THREE.MathUtils.clamp((t-a)/(b-a),0,1),v=ramp(t,a,b),local=new THREE.Vector3(...(stance?.from?.[i]?.p??[side*.108,0,.014])),old=local.clone().applyAxisAngle(Y,from),next=new THREE.Vector3(...(stance?.to?.[i]?.p??[side*.108,0,.014])).applyAxisAngle(Y,to),p=old.lerp(next,v).add(new THREE.Vector3(...w.p));p.y+=.045*Math.sin(Math.PI*raw)**2;return {p:worldToLocal(p.toArray()as V3,{p:w.p,yaw}).toArray()as V3,yaw:lerp(from+(stance?.from?.[i]?.yaw??0),to+(stance?.to?.[i]?.yaw??0),v)-yaw};});return {...w,yaw,pose:{...w.pose,feet}};
}

export function restGripWorld(a:Person,side:-1|1):V3{const p=a.pose,b=bodyState(p),index=side===-1?0:1,swing=Math.sin((p.phase??0)+(index===0?0:Math.PI))*.12*(p.gait??0);return localToWorld(new THREE.Vector3(side*(.242+.055),1.49-.585,.09+swing).applyQuaternion(b.q).add(new THREE.Vector3(0,b.y,0)),a).toArray()as V3;}

export function turnPerson(a:Person,t:number,from:number,to:number,start:number,end:number,stance?:{from?:Foot[];to?:Foot[]}):Person{
 const yaw=lerp(from,to,ramp(t,start,end)),middle=(start+end)/2;
 const feet=[-1,1].map((side,i)=>{const s=i===0?start:middle,e=i===0?middle:end,u=THREE.MathUtils.clamp((t-s)/(e-s),0,1),v=ramp(t,s,e),old=new THREE.Vector3(...(stance?.from?.[i]?.p??[side*.132,.07,0])).applyAxisAngle(Y,from),next=new THREE.Vector3(...(stance?.to?.[i]?.p??[side*.132,.07,0])).applyAxisAngle(Y,to),p=old.lerp(next,v).add(new THREE.Vector3(...a.p));p.y+=.075*Math.sin(Math.PI*u)**2;return{p:worldToLocal(p.toArray()as V3,{p:a.p,yaw}).toArray()as V3,yaw:lerp(from+(stance?.from?.[i]?.yaw??0),to+(stance?.to?.[i]?.yaw??0),v)-yaw};});return{...a,yaw,pose:{...a.pose,feet}};
}
