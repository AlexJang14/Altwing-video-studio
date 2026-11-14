import React from 'react';import {create,act}from '@react-three/test-renderer';import * as THREE from 'three';import {OBB}from 'three/addons/math/OBB.js';import fs from 'node:fs';
import {RescuePair}from '../src/rescue/Actors';import {rescue2}from '../src/rescue/motion2';import {rescue3,shelterDoorBottom}from '../src/rescue/motion3';import {LandingCraft}from '../src/episode2/LandingCraft';import {ellipsoid,intersects}from './rescue_collision_math';
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
const er=await create(<><group position={[3.6,0,-2]} scale={.6}><LandingCraft time={0} damaged ramp={1} collisionId="current"/></group><group position={[-8.3,0,4.3]} rotation={[0,.15,0]} scale={.6}><LandingCraft time={0} damaged ramp={0} collisionId="wreck"/></group></>),env=er.scene.instance as THREE.Object3D;env.updateMatrixWorld(true);
const sphereNames=['hull','upper-hull','canopy','engine--1'],boxNames=['airlock','wing--1','wing-1'];
const hulls=['current','wreck'].flatMap(id=>sphereNames.map(n=>({name:`${id}-${n}`,shape:ellipsoid(env.getObjectByName(`${id}-${n}`)!)})));
function objectBox(o:THREE.Object3D){const m=o as THREE.Mesh;m.geometry.computeBoundingBox();return new OBB().fromBox3(m.geometry.boundingBox!).applyMatrix4(m.matrixWorld);}
const shipBoxes=['current','wreck'].flatMap(id=>boxNames.map(n=>({name:`${id}-${n}`,box:objectBox(env.getObjectByName(`${id}-${n}`)!)})));
const box=(p:number[],size:number[])=>new OBB(new THREE.Vector3(...p as [number,number,number]),new THREE.Vector3(...size as [number,number,number]).multiplyScalar(.5));
const errors:any[]=[],report:any[]=[];
for(const episode of [2,3]){
 const blocking=episode===2?rescue2:rescue3,frames=episode===2?2160:2190,ar=await create(<RescuePair time={0}{...blocking(0)}/>),root=ar.scene.instance as THREE.Object3D;let checked=0,minFloor=Infinity;
 for(let f=0;f<frames;f++){
  const t=f/30;if((episode===2&&t<6)||(episode===3&&t<1.1))continue;
  const b=blocking(t);await act(async()=>{await ar.update(<RescuePair time={t}{...b}/>);});root.updateMatrixWorld(true);
  const names=['astro-head-shell','astro-torso-shell','astro-chest-shell','astro-hip-shell','plush-head-shell','plush-torso-shell'];
  const obstacles=episode===2&&t<12.7?[]:episode===2?[...shipBoxes,{name:'cell-cradle',box:box([-7.75,.42,-8],[.5,.84,.65])},{name:'transmitter',box:box([-3.95,.42,-2.1],[.2,.84,.2])}]:[
   {name:'shelter-left-wall',box:box([-13,2.1,-18.5],[.18,4.2,13])},{name:'shelter-right-wall',box:box([-7,2.1,-18.5],[.18,4.2,13])},{name:'shelter-back-wall',box:box([-10,2.1,-25],[6,4.2,.2])},
   {name:'entrance-left',box:box([-12.6,3.4,-12.2],[1.8,6.8,.7])},{name:'entrance-right',box:box([-7.4,3.4,-12.2],[1.8,6.8,.7])},{name:'pressure-door',box:box([-10,1.8+shelterDoorBottom(t),-12.05],[3.4,3.6,.2])},
   {name:'repair-post',box:box([-8.55,.42,-17.9],[.32,.84,.35])},{name:'archive-display',box:box([-12.85,1.85,-19.8],[.10,1.45,2.5])}];
  for(const name of names){const o=root.getObjectByName(name)!;const e=ellipsoid(o),obb=objectBox(o);for(const obstacle of obstacles)if(obb.intersectsOBB(obstacle.box,1e-6))errors.push({episode,frame:f,type:'solid-obstacle',actor:name,obstacle:obstacle.name});if(episode===2&&t>=12.7)for(const hull of hulls)if(intersects(e,hull.shape))errors.push({episode,frame:f,type:'hull-collision',actor:name,obstacle:hull.name});}
  // Check actual visible mesh vertices, including the lying/recovering plush,
  // rather than a root point or an unrotated body envelope.
  root.traverse(o=>{if(!(o as THREE.Mesh).isMesh)return;const m=o as THREE.Mesh;if(!m.geometry.attributes.position)return;const bottom=new THREE.Box3().setFromObject(m,true).min.y;minFloor=Math.min(minFloor,bottom);if(bottom<-.003)errors.push({episode,frame:f,type:'mesh-below-floor',name:o.name,bottom});});
  checked++;
 }
 report.push({episode,checkedFrames:checked,minimumVisibleMeshHeight:minFloor});await ar.unmount();
}
await er.unmount();fs.writeFileSync('work/rescue/environment-collision.json',JSON.stringify({method:'Actual shared hull ellipsoids with convex GJK; conservative OBB tests for solid walls, consoles and crates; actual visible mesh vertex floor extents.',report,errors},null,2));console.log(JSON.stringify({report,errors:errors.length,firstErrors:errors.slice(0,12)}));if(errors.length)process.exitCode=1;
