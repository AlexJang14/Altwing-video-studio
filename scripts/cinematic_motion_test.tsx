import React from 'react';
import {create} from '@react-three/test-renderer';
import * as THREE from 'three';
import assert from 'node:assert/strict';
import {BlackAstronaut} from '../src/characters/BlackAstronaut';
import {WangdooPenguin} from '../src/characters/WangdooSoft';
import {blocking1,blocking2} from '../src/cinematic/motion';
import {astroState,type AstroPose} from '../src/characters/performance';
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
const world=(root:THREE.Object3D,name:string)=>{root.updateMatrixWorld(true);const obj=root.getObjectByName(name);assert(obj,`Missing ${name}`);return obj.getWorldPosition(new THREE.Vector3());};
for(const [episode,t]of [[1,24.6],[1,24.85],[2,34.2],[2,34.5]]){
 const {a,w}=episode===1?blocking1(t):blocking2(t);
 const r=await create(<group><BlackAstronaut time={t} position={a.p} rotation={a.yaw} pose={a.pose}/><WangdooPenguin time={t} position={w.p} rotation={w.yaw} pose={w.pose}/></group>);
 const root=r.scene.instance as THREE.Object3D;
 const error=world(root,'astro-grip-left').distanceTo(world(root,'wang-grip-right'));
 assert(error<.025,`Episode ${episode} catch at ${t}: ${error}m gap`);
 console.log(`Episode ${episode} catch ${t}: ${(error*1000).toFixed(1)}mm`);await r.unmount();
}
for(const crouch of [0,.35,.6,.78]){
 const r=await create(<BlackAstronaut time={0} pose={{crouch}}/>),root=r.scene.instance as THREE.Object3D;
 for(const side of ['left','right'])assert(Math.abs(world(root,`astro-sole-${side}`).y)<.006,`Crouch ${crouch}: ${side} boot leaves deck`);
 await r.unmount();
}
for(const [episode,duration]of [[1,58],[2,59]]){
 for(let frame=0;frame<duration*30;frame++){
  const {a,w}=episode===1?blocking1(frame/30):blocking2(frame/30);
  assert([...a.p,...w.p,a.yaw,w.yaw,...Object.values(a.pose),...Object.values(w.pose)].every(Number.isFinite),`Invalid transform e${episode} f${frame}`);
  for(const leg of astroState(frame/30,a.pose).legs)assert([leg.upper,leg.knee,leg.ankle].every(Number.isFinite));
  // The escape path must pass outside the landing craft and both engine pods.
  if(episode===2&&frame/30>=29&&frame/30<37&&a.p[2]<-3.8)assert(a.p[0]<-4.7,'Escape route intersects ship');
 }
}
console.log('Pass: both catches, planted kneeling feet, all 3,510 frame transforms, escape clearance.');
