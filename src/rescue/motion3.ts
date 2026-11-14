import {between,ramp,lerp,blendV,type V3} from '../characters/performance';
import {walkAstronaut,walkPlush,handTo,worldHand,reassureHead,type AstroActor,type PlushActor} from './locomotion';
import {type Blocking} from './types';
export const shelterDoorBottom=(t:number)=>3.7*(1-ramp(t,3.8,4.45));
export const repairConnector=(t:number):V3=>[-8.55,.92,lerp(-17.62,-17.75,ramp(t,39.0,40.5))];
export function rescue3(t:number):Blocking{
 let a:AstroActor={p:[-9.2,0,-18.1],yaw:Math.PI,pose:{headYaw:.15}},w:PlushActor={p:[-10.5,0,-18.4],yaw:Math.PI,pose:{sealed:true,headTilt:.05,scan:.7,light:.7}},lamp=0,contact;
 if(t<1.1){
  a={p:[-8.2,0,-11.35],yaw:0,pose:{crouch:.35,headPitch:.25,headYaw:.4}};w={p:[-10.55,0,-11.0],yaw:Math.PI,pose:{sealed:true,scan:.6,light:1}};
  const target:V3=[-7.75,1.32,-11.59];a=handTo(a,t,'right',target);contact={kind:'shelter-cell-seat',target,side:1 as const};
 }else if(t<7){
  a=walkAstronaut(t,{points:[[-9.3,0,-10.0],[-9.3,0,-13.7]],start:1.1,end:3.7,kind:'run'},{headYaw:.1});
  w=walkPlush(t,{points:[[-10.5,0,-10.6],[-10.5,0,-14.8]],start:1.1,end:3.5,kind:'run'},{sealed:true,headYaw:-.1,scan:.5,light:1});
 }else if(t>=25&&t<35){
  a={p:[-9.3,0,-18.1],yaw:0,pose:{headYaw:lerp(-.7,.4,ramp(t,32.3,34.8)),headPitch:.13}};
  w={p:[-10.4,0,-18.4],yaw:0,pose:{sealed:true,status:.15,headTilt:-.16,headPitch:.18,scan:0,light:0}};
 }else if(t>=35&&t<47){
  const kneel=between(t,35,46.8,.55);a={p:[-9.1,0,-18.1],yaw:0,pose:{crouch:.65*kneel,headPitch:.22,headYaw:.45}};
  w={p:[-10.4,0,-18.4],yaw:0,pose:{sealed:true,status:lerp(.15,1,ramp(t,44.2,46.6)),headTilt:lerp(-.16,.06,ramp(t,44.5,46.8)),headYaw:.25,scan:0,light:0}};
  let target:V3=[-8.55,1.25,-17.70],weight=between(t,35.6,37.7,.32),kind='isolate-local-bus';
  if(t>=38){target=repairConnector(t);weight=between(t,38.2,41.0,.35);kind='reconnect-local-bus';}
  if(t>=41.1){target=[-8.55,1.30,-17.70];weight=between(t,41.35,43.0,.3);kind='test-lamp-circuit';}
  if(t>=43.2){target=[-8.55,1.25,-17.70];weight=between(t,43.8,45.7,.35);kind='restart-limited-bus';}
  if(weight>0){a=handTo(a,t,'right',blendV(worldHand(a,t,1),target,weight));if(weight>.9999)contact={kind,target,side:1 as const};}
 }else if(t>=47&&t<50.2){
  a={p:[-9.3,0,-18.1],yaw:0,pose:{crouch:.42*between(t,47.0,50.1,.35),headYaw:-.55,headPitch:.15}};
  w={p:[-10.4,0,-18.4],yaw:0,pose:{sealed:true,status:1,headTilt:.06,headYaw:.25,scan:0,light:0}};
  const weight=between(t,47.5,49.6,.45);if(weight>0){const help=reassureHead(a,t,w,weight);a=help.a;if(weight>.9999)contact={kind:'reassure-head',target:help.target,side:-1 as const,surface:help.surface,normal:help.normal};}lamp=ramp(t,49.1,50.0);
 }else if(t>=50.2){
  a=walkAstronaut(t,{points:[[-9.3,0,-18.1],[-9.3,0,-21.5]],start:50.2,end:54.6,kind:'walk'},{headYaw:-.1});
  w=walkPlush(t,{points:[[-10.4,0,-18.4],[-10.5,0,-20.7]],start:50.7,end:54.8,kind:'walk'},{sealed:true,status:1,headTilt:.03,headYaw:.2,scan:0,light:0});lamp=1;
 }
 if(!a.pose.feet)a.pose.feet=[{p:[-.25,.135,0],yaw:0},{p:[.25,.135,0],yaw:0}];
 return {a,w,lamp,contact};
}
