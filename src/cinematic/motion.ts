import * as THREE from 'three';
import {between,blendV,jump,lerp,ramp,smooth,astronautHand,type AstroPose,type WangPose,type V3} from '../characters/performance';
export type Actor<P>={p:V3;yaw:number;pose:P};
export type Blocking={a:Actor<AstroPose>;w:Actor<WangPose>;shake:number};
const waves=(t:number,start:number,end:number,fade=.3)=>between(t,start,end,fade);
const grip=(time:number,a:Actor<AstroPose>,yaw:number,pose:WangPose):V3=>{
 const hand=astronautHand(time,a.pose,-1,a.p,a.yaw);
 // The upper flipper meets the astronaut's left palm, using the same local rig transform.
 const wing=new THREE.Vector3(0,-.49,.04).applyEuler(new THREE.Euler(pose.swingR??0,.08,.19+(pose.wingR??0))).add(new THREE.Vector3(.645,1.105,-.015));
 wing.sub(new THREE.Vector3(0,.86,0)).applyEuler(new THREE.Euler(pose.lean??0,0,pose.roll??0)).add(new THREE.Vector3(0,.86+(pose.lift??0),0)).applyAxisAngle(new THREE.Vector3(0,1,0),yaw);
 return [hand[0]-wing.x,hand[1]-wing.y,hand[2]-wing.z];
};
export function blocking1(t:number):Blocking{
 const a:Actor<AstroPose>={p:[.7,0,-2.25],yaw:-.3,pose:{headYaw:-.3}};
 const w:Actor<WangPose>={p:[-.95,0,-1.9],yaw:.1,pose:{roll:Math.sin(t*1.7)*.025}};
 let shake=0;
 if(t<5){
  const hit=between(t,.15,1.6,.18),stand=ramp(t,1.0,2.25),run=ramp(t,2.25,2.9);
  a.p=[lerp(2.5,.6,stand),0,lerp(1.0,-2.7,ramp(t,2.4,5))];a.yaw=lerp(-.4,Math.PI,run);
  a.pose={crouch:(1-stand)*.88,roll:-.28*hit,lean:.2*(1-stand)+.12*run,leftArm:-.8*hit,leftElbow:.6,rightArm:-.4,headPitch:-.15,gait:run,run,phase:ramp(t,2.4,5)*3.7*4.95};
  w.p=[-4,0,-7];shake=.08*hit*(1-ramp(t,1.4,2.3));
 }else if(t<12){
  const walk=1-ramp(t,6.7,7.3),arrive=ramp(t,5,7.3),press=waves(t,7.7,8.7),slam=waves(t,9.8,10.8);
  a.p=[lerp(.6,1.25,arrive),0,lerp(-2.7,-3.85,arrive)];a.yaw=lerp(Math.PI,-.55,arrive);
  a.pose={gait:walk,run:.6*walk,phase:arrive*1.3*4.95,lean:.2*slam,rightArm:-.75*press-1.12*slam,rightElbow:.6,leftArm:-.25,headPitch:.18,headYaw:-.4};
  w.p=[-3,0,-7];shake=.035*waves(t,10.35,10.8,.2);
 }else if(t<20){
  const walk=1-ramp(t,13.7,14.25),approach=ramp(t,12,14.25),wave=waves(t,12.4,14.3),pop=waves(t,17.1,18.25);
  a.yaw=-.45;a.pose={headPitch:.25,headYaw:-.5,crouch:.6*ramp(t,17.65,19.4),leftArm:-.3,leftElbow:.7,rightArm:-.2,headRoll:.1*ramp(t,18.0,19.5)};
  w.p=[lerp(-2.8,-.85,approach),jump(t,17.17,.5,.18),lerp(-2.3,-1.75,approach)];w.yaw=lerp(.8,.08,approach);
  w.pose={gait:walk,phase:approach*2.0*8.57,wingL:wave*(.98+.13*Math.sin(t*13)),wingR:.55*waves(t,14.5,16.9),roll:-.12*waves(t,14.55,16.9)+.19*pop,panic:pop*.75,lean:-.14*pop,squash:1-.06*waves(t,17.03,17.22)};shake=.035*pop;
 }else if(t<29){
  const kneel=ramp(t,20,21.25),switchOn=ramp(t,22.1,23.3),slip=waves(t,23.8,25.65),caught=ramp(t,24.15,24.55)*(1-ramp(t,25.0,25.75)),recover=ramp(t,25.3,26.2);
  a.p=[.65,0,-2.25];a.yaw=-.42;
  a.pose={crouch:lerp(.6,.78,kneel)*(1-ramp(t,27.4,29)*.7),leftArm:-.72-.15*slip,leftElbow:.58,leftSpread:.19,rightArm:-.3-.6*ramp(t,20.5,22.1),rightElbow:.38,headPitch:.3,headYaw:-.4};
  w.p=[-.84,0,-1.92];w.pose={wingR:1.15*switchOn,wingL:.26*switchOn,roll:-.7*slip*(1-recover),lean:.14*slip,lift:.05*slip,panic:slip*.85,kick:.4*slip,squash:1-.04*waves(t,25.4,25.9)};
  w.p=blendV(w.p,grip(t,a,w.yaw,w.pose),caught);
  w.pose.wingL=lerp(w.pose.wingL??0,.9,recover*waves(t,26.2,28.8));
  shake=.035*waves(t,23.8,24.3);
 }else if(t<38){
  const turn=ramp(t,29,30.1),point=waves(t,32.8,35.6),doubt=ramp(t,35.6,36.6);
  a.p=[.65,0,-2.25];a.yaw=lerp(-.42,-2.85,turn);a.pose={crouch:.24*(1-turn),headYaw:.20*Math.sin(t*.5),headPitch:-.12};
  w.p=[-.88,jump(t,33.0,.7,.32),-1.95];w.yaw=lerp(.1,.42,point);
  w.pose={wingL:point*1.13,wingR:point*.45,roll:lerp(-.08,.13,doubt),lean:-.08*doubt,squash:1-.07*waves(t,32.83,33.0)};
 }else{
  const alarm=waves(t,38.0,39.1),reach=waves(t,41.5,44.8),tug=waves(t,47.3,49.8);
  a.p=[.65,0,-2.25];a.yaw=lerp(-2.85,-.1,ramp(t,38,39.2));a.pose={leftArm:-.48-1.0*reach,leftElbow:.2+.3*reach,rightArm:-.15,headYaw:.22*Math.sin(t*.9),headPitch:.16*reach,roll:.04*alarm};
  w.p=[lerp(-.88,-.44,tug),0,-1.95];w.pose={panic:.65*alarm,wingR:.8*tug,wingL:.25+.2*Math.sin(t*1.7),roll:.08*Math.sin(t*2)*tug,lean:-.07};shake=.055*alarm;
 }
 return {a,w,shake};
}

const chase=new THREE.CatmullRomCurve3([new THREE.Vector3(-.45,0,-.2),new THREE.Vector3(-3.8,0,-1.2),new THREE.Vector3(-6.3,0,-3.3),new THREE.Vector3(-6.8,0,-5.2),new THREE.Vector3(-7.2,0,-7.35)]);
const chaseLength=chase.getLength();
const chasePoint=(u:number):V3=>chase.getPointAt(Math.max(0,Math.min(1,u))).toArray() as V3;
export function blocking2(t:number):Blocking{
 const a:Actor<AstroPose>={p:[1.25,0,-.25],yaw:-.35,pose:{headPitch:.2,headYaw:-.25}};
 const w:Actor<WangPose>={p:[-.55,0,.1],yaw:.1,pose:{}};let shake=0;
 if(t<2.8){
  a.p=[.6,0,-2.4];a.yaw=-.18;a.pose={lean:.18,roll:Math.sin(t*8)*.07,leftArm:-1.0,rightArm:-1.1,leftElbow:.55,rightElbow:.5,headPitch:.2};
  w.p=[lerp(-1.5,-.4,ramp(t,.3,2.6)),.1+jump(t,.5,1.7,.2),-1.45];w.pose={roll:-ramp(t,.4,2.4)*Math.PI*2,wingL:.7,wingR:.8,panic:1,kick:1};shake=.07;
 }else if(t<5){a.p=[0,-9,0];w.p=[0,-9,0];shake=.07*between(t,3.8,4.6,.1);}
 else if(t<12){
  const walk=1-ramp(t,6.1,6.7),move=ramp(t,5,6.7),stumble=waves(t,5.25,6.1);
  a.p=[lerp(.9,1.25,move),0,lerp(-2.6,-.25,move)];a.p[1]=Math.max(0,(-.53-a.p[2])*Math.tan(.212));a.pose={gait:walk,phase:move*2.35*4.95,headPitch:.3,headYaw:-.4};
  w.p=[-.55,0,lerp(-1.5,.25,move)];w.p[1]=Math.max(0,(-.53-w.p[2])*Math.tan(.212));w.pose={gait:walk,phase:move*1.75*8.57,lean:.45*stumble,roll:.3*stumble,wingL:.8*stumble+.65*waves(t,6.5,7.5),wingR:.75*stumble,panic:.7*waves(t,7.55,8.15),squash:1-.08*stumble};w.yaw=.05;
 }else if(t<20){
  const hello=waves(t,12.3,14.7),sniff=waves(t,14.7,15.55),touch=ramp(t,15.35,16.15)*(1-ramp(t,16.7,17.3)),warn=waves(t,14.2,16.8),recoil=ramp(t,16.4,17.2);
  a.pose={headPitch:.28,headYaw:-.45,leftArm:-1.08*warn,leftElbow:.4,leftSpread:.18};
  w.p=[lerp(-.55,-1.0,recoil),jump(t,16.55,.8,.38),lerp(.25,.9,recoil)];w.yaw=lerp(.0,.08,recoil);
  w.pose={wingL:hello*(1.05+.10*Math.sin(t*12)),wingR:.9*touch+.5*recoil,swingR:-.6*touch,lean:.22*sniff-.16*recoil,roll:Math.sin(t*1.5)*.07*(1-recoil),panic:recoil,squash:1-.06*waves(t,16.25,16.5)};
 }else if(t<29){
  const approach=ramp(t,26.7,27.7),grab=ramp(t,27.5,28.1),pull=ramp(t,28.0,29);
  a.p=blendV([1.25,0,-.25],[-.1,0,-.2],approach);a.yaw=lerp(-.35,-2.5,pull);a.pose={headYaw:-.45*(1-approach),headPitch:.2,crouch:.4*grab,leftArm:-.8*grab,leftElbow:.35,leftSpread:.28,gait:.5*pull,phase:pull*2.4};
  w.p=blendV([-1,0,.9],[-.5,0,-.2],pull);w.yaw=lerp(.08,-2.5,pull);w.pose={panic:.9,wingR:1.1*grab,wingL:.5,roll:-.10,lean:-.1};
  w.p=blendV(w.p,grip(t,a,w.yaw,w.pose),grab*(1-ramp(t,28.55,29)));
  shake=.045*waves(t,21.6,22.4)+.035*waves(t,25.5,26.2);
 }else if(t<38){
  const u=ramp(t,29,36.6),point=chasePoint(u),tan=chase.getTangentAt(u);
  a.p=point;a.yaw=Math.atan2(tan.x,tan.z);const catchIt=waves(t,33.7,35.4),stop=1-ramp(t,36.2,37.2);
  a.pose={gait:stop,run:stop,phase:u*chaseLength*4.95,lean:.13*stop,crouch:.22*catchIt,leftArm:-.65*catchIt,leftElbow:.8,leftSpread:.18,headYaw:.3*catchIt};
  const boost=between(t,32.05,34.8,.2),flight=ramp(t,32.15,33.75),caught=ramp(t,33.7,34.1)*(1-ramp(t,35.1,35.8));
  const robotU=Math.max(0,u-.08+flight*.21*(1-caught));w.p=chasePoint(robotU);w.p[0]-=.55*(1-flight);w.p[1]=jump(t,32.05,3.15,1.55);w.yaw=a.yaw;
  w.pose={gait:stop*(1-boost),run:1,phase:Math.max(0,robotU)*chaseLength*8.57,lean:-.30*boost,roll:Math.sin(t*17)*.10*boost,wingL:.65,wingR:1.12*caught+.6*(1-caught),panic:.9,thrust:boost*(1-caught),kick:boost};
  w.p=blendV(w.p,grip(t,a,w.yaw,w.pose),caught);
  w.p=blendV(w.p,[-8.15,0,-6.6],ramp(t,36.2,37.5));a.yaw=lerp(a.yaw,-.10,ramp(t,36.7,37.8));w.yaw=lerp(w.yaw,.15,ramp(t,36.3,37.5));
  shake=.04*waves(t,30.1,30.55)+.035*waves(t,35.5,36.0);
 }else{
  a.p=[-7.2,0,-7.35];w.p=[-8.15,0,-6.6];a.yaw=-.15;w.yaw=.15;
  const pointShip=waves(t,40.7,42.6),pointGate=waves(t,42.1,43.8),fear=waves(t,43.4,45.8);
  a.pose={rightArm:-1.15*pointShip,rightElbow:.25,headYaw:lerp(-.35,.65,pointShip),headPitch:.15,leftArm:-.35,headRoll:.05*Math.sin(t)};
  w.pose={wingL:1.12*pointGate+.5*fear,wingR:.35+.25*fear,panic:.8,roll:-.1*pointGate+.07*Math.sin(t*3)*fear,lean:-.07};
  shake=.07*waves(t,43.35,44.1)+.035*waves(t,48.0,48.4)+.045*waves(t,51.1,51.55);
 }
 return {a,w,shake};
}
