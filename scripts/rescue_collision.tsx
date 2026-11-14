import React from 'react';import {create,act} from '@react-three/test-renderer';import * as THREE from 'three';import fs from 'node:fs';import assert from 'node:assert/strict';
import {RescuePair} from '../src/rescue/Actors';import {rescue1,doorBottom1} from '../src/rescue/motion1';
import {rescue2} from '../src/rescue/motion2';
import {rescue3,shelterDoorBottom} from '../src/rescue/motion3';
import {ellipsoid,intersects,capsuleClearance,support} from './rescue_collision_math';
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
const episode=Number(process.argv[2]??1),blocking=episode===1?rescue1:episode===2?rescue2:rescue3;
const frames=episode===3?2190:2160,errors:any[]=[],contacts:any[]=[],steps:any[]=[],previous=new Map<string,{p:THREE.Vector3;height:number;time:number}>();
const initial=blocking(0),r=await create(<RescuePair time={0} {...initial}/>),root=r.scene.instance as THREE.Object3D;
const obj=(name:string)=>{const o=root.getObjectByName(name);assert(o,name);return o;};
const world=(name:string)=>obj(name).getWorldPosition(new THREE.Vector3());
let maxContact=0,minFoot=1,maxSlip=0,minSeparation=Infinity;
for(let frame=0;frame<frames;frame++){
 const t=frame/30,b=blocking(t);await act(async()=>{await r.update(<RescuePair time={t} {...b}/>);});root.updateMatrixWorld(true);
 if(b.contact){const name=b.contact.side===-1?'astro-grip-left':'astro-grip-right',gap=world(name).distanceTo(new THREE.Vector3(...b.contact.target));maxContact=Math.max(maxContact,gap);if(gap>.003)errors.push({frame,type:'hand-contact-gap',gap,kind:b.contact.kind});if(frame%10===0)contacts.push({time:t,kind:b.contact.kind,gap});}
 const aHead=world('astro-head-shell'),wHead=world('plush-head-shell'),separation=aHead.distanceTo(wHead);minSeparation=Math.min(minSeparation,separation);
 if(separation<.53)errors.push({frame,type:'head-bounds-overlap',separation});
 const plushShells=['plush-head-shell','plush-torso-shell'].map(name=>({name,e:ellipsoid(obj(name))}));
 for(const name of ['astro-head-shell','astro-torso-shell','astro-chest-shell','astro-hip-shell','astro-shoulder-left','astro-shoulder-right','astro-hand-shell-left','astro-hand-shell-right']){
  for(const shell of plushShells)if(intersects(ellipsoid(obj(name)),shell.e)){
   const touch=b.contact?.kind==='reassure-head'&&name==='astro-hand-shell-left'&&shell.name==='plush-head-shell';
   const gap=touch?support(ellipsoid(obj(name)),new THREE.Vector3(...b.contact!.normal!).negate()).distanceTo(new THREE.Vector3(...b.contact!.surface!)):Infinity;
   if(!touch||gap>.002)errors.push({frame,type:'actor-shell-collision',name,plush:shell.name,gap:touch?gap:undefined});
  }
 }
 for(const side of ['left','right']){
  const shoulder=world(`astro-upper-arm-${side}`),elbow=world(`astro-forearm-${side}`),wrist=new THREE.Vector3(0,-.39,0).applyMatrix4(obj(`astro-forearm-${side}`).matrixWorld);
  for(const shell of plushShells)for(const [start,end,radius]of [[shoulder,elbow,.115*.68],[elbow,wrist,.104*.68]] as const){const clearance=capsuleClearance(start,end,radius,shell.e);if(clearance<-.002)errors.push({frame,type:'arm-cloth-collision',side,plush:shell.name,clearance});}
 }
 for(const [id,name,sole,small]of [['al','astro-foot-left','astro-sole-left',false],['ar','astro-foot-right','astro-sole-right',false],['wl','plush-foot-0','plush-sole-0',true],['wr','plush-foot-1','plush-sole-1',true]] as const){
  const p=world(sole),box=new THREE.Box3().setFromObject(obj(name),true),bottom=box.min.y;minFoot=Math.min(minFoot,bottom);
  if(bottom<-.003)errors.push({frame,type:'foot-penetration',id,bottom});
  const old=previous.get(id);
  if(old&&t-old.time<.04&&old.height>.006&&p.y<.004&&((episode===1&&t>13&&t<40)||(episode===2&&t>=12.7&&t<46)||(episode===3&&((t>=1.1&&t<7)||(t>=50.2&&t<55.2)))))steps.push({at:t,small});
  // Scene cuts may change blocking. Inside a planted stance, the actual sole
  // transform must stay fixed in world space even while the root moves.
  const cuts=episode===1?[0,4,8,13,31,40]:episode===2?[0,1.3,3.8,6,12.7,16,28,36,40.5,46]:[0,1.1,7,25,35,47,50.2];
  const awayFromCuts=cuts.every(c=>Math.abs(t-c)>.12)&&!(episode===2&&t>=6&&t<16);
  if(old&&old.height<.001&&p.y<.001&&awayFromCuts){const slip=Math.hypot(p.x-old.p.x,p.z-old.p.z);maxSlip=Math.max(maxSlip,slip);if(slip>.003)errors.push({frame,type:'planted-foot-slide',id,slip});}
  previous.set(id,{p,height:p.y,time:t});
 }
 if(episode===1&&t>=31&&t<40){for(const name of ['astro-head-shell','plush-head-shell']){const box=new THREE.Box3().setFromObject(obj(name),true);if(box.min.z< -2.4&&box.max.z> -2.6&&box.max.y>doorBottom1(t)-.008)errors.push({frame,type:'bulkhead-clearance',name,headTop:box.max.y,doorBottom:doorBottom1(t)});}}
 if(episode===3&&t>=1.1&&t<7){for(const name of ['astro-head-shell','plush-head-shell']){const box=new THREE.Box3().setFromObject(obj(name),true);if(box.min.z< -11.9&&box.max.z> -12.2&&box.max.y>shelterDoorBottom(t)-.008)errors.push({frame,type:'shelter-door-clearance',name});}}
 if(episode===2&&t>=16){
  for(const name of ['astro-foot-left','astro-foot-right','plush-foot-0','plush-foot-1']){const box=new THREE.Box3().setFromObject(obj(name),true);if(box.max.x> -7.4&&box.min.x< -5.9&&box.max.z> -6.8&&box.min.z< -4.4)errors.push({frame,type:'foot-over-pit',name});if(box.min.x< -10.31&&box.max.x> -10.39&&box.min.z< -4.1&&box.max.z> -7.1)errors.push({frame,type:'rail-obstruction',name});}
 }
 if(frame%300===0)console.log('frame',frame,'errors',errors.length);
}
await r.unmount();
fs.mkdirSync('work/rescue',{recursive:true});fs.writeFileSync(`work/rescue/collision-${episode}.json`,JSON.stringify({frames,maxContactGap:maxContact,minimumFootHeight:minFoot,maximumPlantedFootSlide:maxSlip,minimumHeadCenterSeparation:minSeparation,errors,contacts},null,2));fs.writeFileSync(`work/rescue/footsteps-${episode}.json`,JSON.stringify(steps,null,2));
console.log(JSON.stringify({frames,maxContact,minFoot,maxSlip,minSeparation,errors:errors.length,firstErrors:errors.slice(0,12)}));if(errors.length)process.exitCode=1;
