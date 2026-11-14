import * as THREE from 'three';
import {astroState,astronautHand,between,lerp,ramp,smooth,type AstroPose,type V3} from '../characters/performance';
import {WANG_SCALE,flipperSurface,type PlushPose} from './Wangdoo';
export const ASTRO_SCALE=.68;
export type AstroActor={p:V3;yaw:number;pose:AstroPose};
export type PlushActor={p:V3;yaw:number;pose:PlushPose};
export type Route={points:V3[];start:number;end:number;kind:'walk'|'run';pause?:{at:number;resume:number;fraction:number}};
export type Placement={p:V3;yaw:number};
const cache=new Map<string,{curve:THREE.CatmullRomCurve3;length:number}>();
function getRoute(points:V3[]){const key=JSON.stringify(points);if(!cache.has(key)){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));cache.set(key,{curve,length:curve.getLength()});}return cache.get(key)!;}
function pointAtDistance(points:V3[],s:number):Placement{
 const {curve,length}=getRoute(points),u=Math.max(0,Math.min(1,s/length)),p=curve.getPointAt(u),t=curve.getTangentAt(u);
 // Endpoint extension gives natural planted feet before/after the root stops.
 if(s<0)p.addScaledVector(t,s);else if(s>length)p.addScaledVector(t,s-length);
 return {p:p.toArray() as V3,yaw:Math.atan2(t.x,t.z)};
}
export function travel(time:number,route:Route,plush=false):{p:V3;yaw:number;feet:Array<{p:V3;yaw:number}>;distance:number;phase:number;speed:number}{
 const {length}=getRoute(route.points),pause=route.pause;
 const u=pause?(time<pause.at?ramp(time,route.start,pause.at)*pause.fraction:time<pause.resume?pause.fraction:pause.fraction+(1-pause.fraction)*ramp(time,pause.resume,route.end)):ramp(time,route.start,route.end),s=u*length,root=pointAtDistance(route.points,s);
 const nominal=plush?.50:route.kind==='run'?.93:.68,cycle=length/Math.max(1,Math.round(length/nominal)),width=plush?.148:.17,ankle=plush?0:.135*ASTRO_SCALE;
 const feet=[-1,1].map((side,i)=>{
  const phase=s/cycle+i*.5,whole=Math.floor(phase),fraction=phase-whole;
  const old=(whole-i*.5+.23)*cycle;
  const swing=fraction>.6,swingU=(fraction-.6)/.4;
  const stamp=pointAtDistance(route.points,old+(swing?smooth(swingU)*cycle:0));
  const normal=new THREE.Vector3(Math.cos(stamp.yaw),0,-Math.sin(stamp.yaw));
  const pos=new THREE.Vector3(...stamp.p).addScaledVector(normal,side*width);
  pos.y+=ankle+(swing?(plush?.075:route.kind==='run'?.15:.095)*Math.sin(Math.PI*swingU)**2:0);
  return {p:pos.toArray() as V3,yaw:stamp.yaw};
 });
 return {...root,feet,distance:s,phase:s/cycle*Math.PI*2,speed:pause?Math.max(between(time,route.start,pause.at,.22),between(time,pause.resume,route.end,.22)):between(time,route.start,route.end,.22)};
}
const localPoint=(world:V3,p:V3,yaw:number,scale:number):V3=>new THREE.Vector3(...world).sub(new THREE.Vector3(...p)).applyAxisAngle(new THREE.Vector3(0,1,0),-yaw).divideScalar(scale).toArray() as V3;
export function walkAstronaut(time:number,route:Route,extra:AstroPose={}):AstroActor{
 const m=travel(time,route),run=route.kind==='run',pose:AstroPose={gait:m.speed,run:run?1:0,phase:m.phase,bodyY:-.06-m.speed*(run?.08:.025),lean:(run?.035:.01)*m.speed,...extra};
 pose.feet=m.feet.map(f=>({p:localPoint(f.p,m.p,m.yaw,ASTRO_SCALE),yaw:f.yaw-m.yaw}));return {p:m.p,yaw:m.yaw,pose};
}
export function walkPlush(time:number,route:Route,extra:PlushPose={}):PlushActor{
 const m=travel(time,route,true),pose:PlushPose={bodyRoll:Math.sin(m.phase)*.025*m.speed,bob:Math.abs(Math.sin(m.phase))*.008*m.speed,...extra};
 pose.feet=m.feet.map(f=>({p:localPoint(f.p,m.p,m.yaw,WANG_SCALE),yaw:f.yaw-m.yaw}));return {p:m.p,yaw:m.yaw,pose};
}
export function turnPlush(actor:PlushActor,time:number,from:number,to:number,start:number,end:number):PlushActor{
 const u=ramp(time,start,end),yaw=lerp(from,to,u),middle=(start+end)/2;
 const feet=[-1,1].map((side,i)=>{
  const a=i===0?start:middle,b=i===0?middle:end,raw=Math.max(0,Math.min(1,(time-a)/(b-a))),phase=ramp(time,a,b);
  const local=new THREE.Vector3(side*.185,0,.065).multiplyScalar(WANG_SCALE),old=local.clone().applyAxisAngle(new THREE.Vector3(0,1,0),from),next=local.clone().applyAxisAngle(new THREE.Vector3(0,1,0),to);
  const p=old.lerp(next,phase).add(new THREE.Vector3(...actor.p));p.y+=.065*Math.sin(Math.PI*raw)**2;
  return {p:localPoint(p.toArray() as V3,actor.p,yaw,WANG_SCALE),yaw:lerp(from,to,phase)-yaw};
 });
 return {...actor,yaw,pose:{...actor.pose,feet}};
}
export function handTo(actor:AstroActor,time:number,side:'left'|'right',target:V3):AstroActor{
 const s=astroState(time,actor.pose),v=new THREE.Vector3(...localPoint(target,actor.p,actor.yaw,ASTRO_SCALE));
 v.y-=s.bodyY;v.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(s.pitch,0,s.roll)).invert());
 return {...actor,pose:{...actor.pose,[side==='left'?'leftHand':'rightHand']:v.toArray() as V3}};
}
export const worldHand=(a:AstroActor,t:number,side:-1|1):V3=>new THREE.Vector3(...astronautHand(t,a.pose,side,[0,0,0],0)).multiplyScalar(ASTRO_SCALE).applyAxisAngle(new THREE.Vector3(0,1,0),a.yaw).add(new THREE.Vector3(...a.p)).toArray() as V3;
export function helpFlipper(actor:AstroActor,time:number,w:PlushActor,weight:number){
 const surface=flipperSurface(w.p,w.yaw,w.pose),rest=worldHand(actor,time,-1);
 let target=new THREE.Vector3(...surface.p).addScaledVector(surface.normal,.08),a=actor;
 for(let i=0;i<4;i++){
  a=handTo(actor,time,'left',target.toArray() as V3);const s=astroState(time,a.pose),arm=s.arms[0];
  const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,a.yaw,0)).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(s.pitch,0,s.roll))).multiply(arm.q?new THREE.Quaternion(...arm.q):new THREE.Quaternion().setFromEuler(new THREE.Euler(arm.x,0,-arm.spread))).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-arm.elbow,0,0)));
  const n=surface.normal.clone().applyQuaternion(q.clone().invert()),r=new THREE.Vector3(.115,.145,.10).multiplyScalar(ASTRO_SCALE),den=Math.sqrt((r.x*n.x)**2+(r.y*n.y)**2+(r.z*n.z)**2);
  const support=new THREE.Vector3(r.x*r.x*n.x,r.y*r.y*n.y,r.z*r.z*n.z).divideScalar(den).applyQuaternion(q);
  target=new THREE.Vector3(...surface.p).add(support);
 }
 const blended=new THREE.Vector3(...rest).lerp(target,weight).toArray() as V3;
 return {a:handTo(actor,time,'left',blended),target:blended,surface:surface.p};
}
export const move=(a:V3,b:V3,t:number,start:number,end:number):V3=>{const u=ramp(t,start,end);return [lerp(a[0],b[0],u),lerp(a[1],b[1],u),lerp(a[2],b[2],u)];};
