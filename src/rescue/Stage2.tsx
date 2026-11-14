import React from 'react';import * as THREE from 'three';
import {Box,Orb,Line3D} from '../geometry';import {LandingCraft} from '../episode2/LandingCraft';
import {ramp,between,lerp,blendV} from '../characters/performance';
import {rescue2} from './motion2';import {RescuePair} from './Actors';import {RescueLighting} from './Lighting';
import {ShipInterior,ResourceDiagram} from './World';import {RescueTerrain,CrashSite,Transmitter,Shelter,AllocationCradle,PortableCell,SurfacePresence} from './Planet';
export const RescueStage2:React.FC<{time:number}>=({time:t})=>{
 const b=rescue2(t),flight=t<1.3||(t>=3.8&&t<6),inside=(t>=1.3&&t<3.8)||(t>=6&&t<12.7);
 if(inside)return <><RescueLighting center={[0,0,-2.1]} warm={t>=6}/><ShipInterior/>
  {t<3.8&&<><Box p={[.55,.8,-1.8]} s={[.10,.70,.10]} color="#47545e"/><Box p={[.55,1.16,-1.8]} s={[.62,.065,.075]} color="#667783"/></>}
  <RescuePair time={t} {...b}/></>;
 const descent=t<1.3?lerp(9,5,ramp(t,0,1.3)):lerp(5,0,ramp(t,3.8,4.95));
 const u=ramp(t,38.6,39.6),hand=new THREE.Vector3(-4.7,1.15,-3.7),drop=hand.lerp(new THREE.Vector3(-6.6,-1.9,-5.4),u);drop.y+=Math.sin(Math.PI*u)*.7;
 return <>
  <RescueLighting center={flight?[3.6,0,-5]:b.a.p} planet/>
  <RescueTerrain time={t}/><CrashSite time={t} current={!flight}/><Shelter/>
  {flight&&<group position={[3.6,descent,-2]} rotation={[0,0,Math.sin(t*2.3)*.04]} scale={.6}><LandingCraft time={0} damaged={t>4.9} ramp={0}/></group>}
  {t>4.7&&t<6.2&&Array.from({length:12},(_,i)=>{const dust=ramp(t,4.7+i*.015,6.1);return <mesh key={i} position={[3.6+Math.sin(i*2.4)*dust*3,.15+dust*.5,-6+Math.cos(i*2.4)*dust*2]} scale={.25+dust*.6}><sphereGeometry args={[1,12,8]}/><meshBasicMaterial color="#a9a0ad" transparent opacity={(1-dust)*.30} depthWrite={false}/></mesh>;})}
  <Transmitter time={t}/><SurfacePresence time={t}/><AllocationCradle time={t}/>
  <Box p={[-7.75,.14,-7.65]} s={[.43,.28,.37]} color="#54626b" rough={.9}/>
  {t<46?<PortableCell position={[-7.75,.55,-7.65]}/>:<PortableCell position={b.cell??[-7.75,1.07,-8.0]}/>}
  {t>=36&&t<40.5&&<><Line3D points={[[-5.5,.025,-3.3],[-6.6,.025,-5.7],[-10,.025,-11]]} color="#86b9c3" radius={.016} glow={.45}/><mesh position={drop.toArray() as [number,number,number]} scale={.055}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color="#968a91" roughness={1}/></mesh></>}
  {t>=40.5&&<Line3D points={[[-5.1,.015,-3.6],[-8.5,.015,-4],[-9.0,.015,-6.3],[-8.5,.015,-7.8]]} color="#bdb48e" radius={.012} glow={.15}/>}
  {t>=49.5&&<ResourceDiagram position={[-8.1,1.75,-9.7]}/>}
  {!flight&&<RescuePair time={t} {...b}/>}
 </>;
};
