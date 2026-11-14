import React from 'react';
import * as THREE from 'three';
import {BlackAstronaut} from '../characters/BlackAstronaut';
import {astroState} from '../characters/performance';
import {ASTRO_SCALE,type AstroActor,type PlushActor} from './locomotion';
import {PlushWangdoo} from './Wangdoo';
import {Plate} from './World';
export const RescueAstronaut:React.FC<{time:number;actor:AstroActor;lamp?:number}>=({time,actor:a,lamp=0})=>{
 const s=astroState(time,a.pose);
 return <group name="rescue-astronaut" position={a.p} rotation={[0,a.yaw,0]} scale={ASTRO_SCALE}>
  <BlackAstronaut time={time} pose={a.pose}/>
  <group position={[0,s.bodyY,0]} rotation={[s.pitch,0,s.roll]}>
   <Plate text="ARK-07" position={[0,1.84,-.48]} rotation={[0,Math.PI,0]} size={[.45,.12]}/>
   <group position={[.37,1.96,.31]} rotation={[Math.PI/2,0,0]}>
    <mesh><cylinderGeometry args={[.045,.043,.15,16]}/><meshStandardMaterial color="#35424b" roughness={.85}/></mesh>
    <mesh position={[0,.076,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.035,20]}/><meshStandardMaterial color="#d9d4bc" emissive="#ffe4ad" emissiveIntensity={lamp*1.2}/></mesh>
   </group>
  </group>
 </group>;
};
export const RescuePair:React.FC<{time:number;a:AstroActor;w:PlushActor;lamp?:number}>=({time,a,w,lamp=0})=><><RescueAstronaut time={time} actor={a} lamp={lamp}/><PlushWangdoo time={time} position={w.p} yaw={w.yaw} pose={w.pose}/></>;
