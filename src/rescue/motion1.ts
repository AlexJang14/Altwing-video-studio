import {between,ramp,blendV,type V3} from '../characters/performance';
import {backpackPort,flipperGrip,type PlushPose} from './Wangdoo';
import {handTo,helpFlipper,worldHand,walkAstronaut,walkPlush,turnPlush,type AstroActor,type PlushActor} from './locomotion';
export const doorBottom1=(t:number)=>t<31?3.6:t<35?3.6-.85*ramp(t,31,35):t<38.8?2.75-.67*ramp(t,35,38.8):2.08*(1-ramp(t,38.8,39.8));
export function rescue1(t:number):{a:AstroActor;w:PlushActor;lamp:number;contact?:{kind:string;target:V3;side:-1|1;surface?:V3}}{
 let a:AstroActor={p:[.35,0,-2.15],yaw:.05,pose:{headYaw:-.15}},w:PlushActor={p:[-.65,0,-2.15],yaw:.15,pose:{headTilt:.04,status:1}};let lamp=0,contact;
 if(t<4){
  const reach=between(t,1.5,3.1,.2);a.pose={headYaw:.3,rightArm:-.7*reach,rightElbow:.45,lean:.06*reach};w.pose={headTilt:-.08,headYaw:.22};
 }else if(t<13){
  a.p=[.20,0,-2.15];const check=between(t,9.3,12.45,.5);a.pose={crouch:.96*check,headPitch:.30*check,headYaw:-.55,leftElbow:.3};
  w.pose={headTilt:.08,headYaw:-.1,scan:ramp(t,11.5,12.3),light:ramp(t,11.5,12.3)};w=turnPlush(w,t,.15,-1.4,8.3,9.2);
  if(check>0){const target=backpackPort(w.p,w.yaw,w.pose);a=handTo(a,t,'left',blendV(worldHand(a,t,-1),target,check));if(check>.9999)contact={kind:'equipment-check',target,side:-1 as const};}
 }else if(t<31){
  a=walkAstronaut(t,{points:[[.45,0,-.2],[.7,0,-2.7],[.8,0,-4.9]],start:13,end:17.5,kind:'walk'},{headYaw:t>22?-.2:.65});
  w=walkPlush(t,{points:[[-.6,0,-1.2],[-.62,0,-3.5],[-.60,0,-5.55]],start:13,end:16.9,kind:'walk'},{headYaw:t<17?-.4:0,headTilt:.05,scan:between(t,16.7,21.8,.3),light:1});
  if(t>17.1&&t<21.0){const press=between(t,17.1,20.9,.4);a=handTo(a,t,'right',blendV(worldHand(a,t,1),[1.5,1.15,-5.2],press));}
  if(t>=22){w.pose.scan=.6;w.pose.headTilt=-.12;a.pose.headYaw=t>29?-.65:.4;}
 }else if(t<40){
  const approach=between(t,34.5,38.3,.5),pull=between(t,35.2,38.1,.35);
  a=walkAstronaut(t,{points:[[.8,0,-4.9],[.45,0,-3.7],[.45,0,-2.8],[.45,0,.45]],start:31.7,end:38.5,kind:'run',pause:{at:34.9,resume:35.8,fraction:5/12}},{crouch:.6*approach,headYaw:-.65*approach});
  w=walkPlush(t,{points:[[-.60,0,-5.55],[-.55,0,-3.7],[-.55,0,-2.8],[-.55,0,.45]],start:31.3,end:38.5,kind:'run',pause:{at:34.2,resume:35.8,fraction:5.5/12}},{headTilt:-.12,headYaw:.35,light:1,wingR:1.30*pull});
  if(t>=35.25){
   const grip=helpFlipper(a,t,w,pull);a=grip.a;if(pull>.9999)contact={kind:'bulkhead-help',target:grip.target,side:-1 as const,surface:grip.surface};
  }
 }else{
  const repair=between(t,40.4,45.2,.35),kneel=ramp(t,40.1,40.9)*(1-ramp(t,45.3,46.5));
  a={p:[.30,0,-2.15],yaw:.05,pose:{crouch:.64*kneel,headPitch:.25*kneel,headYaw:t<46?.4:.1}};
  w={p:[-.65,0,-1.95],yaw:.30,pose:{scan:t<45?.7:.2,light:1,headTilt:t>49?.1:-.06,headYaw:.3}};
  if(repair>0){const target:V3=[.95,.76,-1.74];const approach=between(t,41.1,44.9,.35);a=handTo(a,t,'right',blendV(worldHand(a,t,1),target,approach));if(approach>.9999)contact={kind:'connector-repair',target,side:1 as const};}
  if(t>49){a.pose.headYaw=Math.sin((t-49)*.55)*.25;w.pose.light=.5;w.pose.scan=.3;}
 }
 if(!a.pose.feet)a.pose.feet=[{p:[-.25,.135,0],yaw:0},{p:[.25,.135,0],yaw:0}];
 return {a,w,lamp,contact};
}
