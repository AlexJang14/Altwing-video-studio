import * as THREE from 'three';
import {between,ramp,blendV,lerp,type V3} from '../characters/performance';
import {carryGrip,backpackPort,plushGroundOffset,type PlushPose,WANG_SCALE} from './Wangdoo';
import {handTo,worldHand,walkAstronaut,walkPlush,ASTRO_SCALE,type AstroActor,type PlushActor} from './locomotion';
import {type Blocking} from './types';
const fixedFeet=()=>[{p:[-.25,.135,0] as V3,yaw:0},{p:[.25,.135,0] as V3,yaw:0}];
export function rescue2(t:number):Blocking{
 let a:AstroActor={p:[.35,0,-2.15],yaw:.05,pose:{headYaw:.2}},w:PlushActor={p:[-.65,0,-2.15],yaw:.15,pose:{sealed:true,headTilt:-.1,scan:.4}},lamp=0,contact,cell:V3|undefined;
 if(t<6){
  a=handTo(a,t,'left',[.30,1.16,-1.8]);a=handTo(a,t,'right',[.80,1.16,-1.8]);a.pose.headYaw=Math.sin(t*3)*.09;w.pose.light=.7;
 }else if(t<12.7){
  const wake=ramp(t,6.4,7.4),check=between(t,8.0,11.45,.4),recover=ramp(t,11.5,12.7);
  a={p:[.15,0,-1.9],yaw:0,pose:{crouch:lerp(.35,.96,wake),headPitch:.34,headYaw:-.5}};
  w={p:[-.65,0,-2.15],yaw:-Math.PI/2,pose:{sealed:true,rootRoll:-Math.PI/2*(1-recover),status:ramp(t,11.4,11.85),wingL:-.8*(1-recover),wingR:-.8*(1-recover),headPitch:.16*(1-recover),light:ramp(t,12.1,12.7)}};
  w.pose.rootLift=plushGroundOffset(w.pose);
  if(check>0){const target=backpackPort(w.p,w.yaw,w.pose);a=handTo(a,t,'left',blendV(worldHand(a,t,-1),target,check));if(check>.9999)contact={kind:'companion-restart',target,side:-1 as const};}
 }else if(t<16){
  const down=ramp(t,14.6,15.7),hold=1-ramp(t,15.65,15.95);
  a=walkAstronaut(t,{points:[[3.1,0,-1.1],[3.1,0,.3]],start:12.7,end:14.5,kind:'walk'},{crouch:lerp(.35,.58,down),leftPole:[-.4,0,-1],headYaw:-.5,headPitch:.15});
  const offset=new THREE.Vector3(lerp(-.50,-.60,down),lerp(.72,0,down),lerp(.52,.42,down)).applyAxisAngle(new THREE.Vector3(0,1,0),a.yaw);
  w={p:new THREE.Vector3(...a.p).add(offset).toArray() as V3,yaw:a.yaw,pose:{sealed:true,status:1,headTilt:.06,headYaw:.1,light:.3}};
  const target=carryGrip(w.p,w.yaw,w.pose);a=handTo(a,t,'left',blendV(worldHand(a,t,-1),target,hold));if(hold>.9999)contact={kind:'carry-handle',target,side:-1 as const};
 }else if(t<28){
  a=walkAstronaut(t,{points:[[3.1,0,.3],[.4,0,-.1],[-2,0,-.7],[-3.3,0,-1.65]],start:16,end:21.4,kind:'walk'},{headYaw:-.55});
  w=walkPlush(t,{points:[[2.50,0,.72],[-.2,0,.3],[-2.4,0,-.4],[-4.4,0,-1.0]],start:16,end:21.1,kind:'walk'},{sealed:true,light:1,scan:.7,headTilt:-.08});
  if(t>22){a.pose.headYaw=lerp(-.55,.25,ramp(t,25,27));w.pose.headTilt=.13;w.pose.scan=.8;}
 }else if(t<36){
  a={p:[-3.3,0,-1.65],yaw:0,pose:{crouch:.20,headYaw:-.3,headPitch:.15}};w={p:[-4.4,0,-1.0],yaw:.1,pose:{sealed:true,headYaw:-.2,headTilt:-.12,scan:.5,light:1}};
  const stop=between(t,34.15,35.35,.25);if(stop>0){const target:V3=[-3.95,1.08,-2.1];a=handTo(a,t,'left',blendV(worldHand(a,t,-1),target,stop));if(stop>.9999)contact={kind:'transmitter-switch',target,side:-1 as const};}
 }else if(t<40.5){
  a=walkAstronaut(t,{points:[[-3.3,0,-1.65],[-3.05,0,-3.0],[-5.1,0,-3.6]],start:36,end:38.1,kind:'walk'},{headPitch:.25,headYaw:-.3});
  w=walkPlush(t,{points:[[-4.4,0,-1.0],[-2.6,0,-.8],[-2.7,0,-3.5],[-4.0,0,-3.5]],start:37.4,end:40.3,kind:'walk'},{sealed:true,scan:.65,light:1,headTilt:.10});
  const point=between(t,38.3,40.3,.2);if(point>0)a=handTo(a,t,'left',blendV(worldHand(a,t,-1),[-5.45,1.10,-3.95],point));lamp=point;
 }else if(t<46){
  a=walkAstronaut(t,{points:[[-5.1,0,-3.6],[-8.5,0,-4.0],[-9.0,0,-6.3],[-8.5,0,-7.8]],start:40.5,end:45.65,kind:'run'},{headYaw:-.15});
  w=walkPlush(t,{points:[[-4.0,0,-3.5],[-7.9,0,-3.8],[-8.15,0,-6.1],[-9.5,0,-7.4]],start:42.3,end:45.9,kind:'run'},{sealed:true,headTilt:.02,headYaw:.25,light:.8});lamp=1;
 }else{
  const lift=ramp(t,47.0,49.8),release=1-ramp(t,50.2,50.8);
  a={p:[-8.5,0,-7.8],yaw:0,pose:{crouch:lerp(.95,.35,lift)*(1-ramp(t,51.0,52.0)),headPitch:.25*(1-ramp(t,51,52)),headYaw:t<52?.4:Math.sin(t*.5)*.2}};
  w={p:[-9.5,0,-7.4],yaw:.1,pose:{sealed:true,headTilt:.06,headYaw:.25,scan:.6,light:.6}};
  cell=blendV([-7.75,.55,-7.65],[-7.75,1.07,-8.0],lift);
  if(t<50.8){const grab=ramp(t,46.3,46.9)*release,target:[number,number,number]=[cell[0],cell[1]+.25,cell[2]];a=handTo(a,t,'right',blendV(worldHand(a,t,1),target,grab));if(grab>.9999)contact={kind:'cell-lift',target,side:1 as const};}
  lamp=1;
 }
 if(!a.pose.feet)a.pose.feet=fixedFeet();return {a,w,lamp,contact,cell};
}
