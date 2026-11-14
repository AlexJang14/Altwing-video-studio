import React from 'react';
import {Box,Orb,Ring,Line3D} from '../geometry';
import {ramp,between,lerp} from '../characters/performance';
import {rescue3,shelterDoorBottom,repairConnector} from './motion3';
import {RescuePair} from './Actors';import {RescueLighting} from './Lighting';import {StaticBatch} from './StaticBatch';
import {Plate,Presence,CrewRecords,ResourceDiagram} from './World';
import {RescueTerrain,Shelter,PortableCell} from './Planet';
export const ShelterRoom:React.FC<{time:number}>=({time:t})=><>
 <StaticBatch cacheKey="shelter-room">
  <Box p={[-10,-.10,-18.5]} s={[6,.20,13.0]} color="#414b58" rough={.92}/>
  {[-13,-7].map(x=><Box key={x} p={[x,2.1,-18.5]} s={[.18,4.2,13]} color="#333e4d" rough={.94}/>)}
  <Box p={[-10,4.2,-18.5]} s={[6,.15,13]} color="#2b3744" rough={.9}/><Box p={[-10,2.1,-25]} s={[6,4.2,.20]} color="#2c3846" rough={.9}/>
  {[-14,-17,-20,-23].map(z=><React.Fragment key={z}><Box p={[-10,.012,z]} s={[5.4,.012,.035]} color="#7b8b91"/><Box p={[-12.86,2.7,z]} s={[.035,.07,1.4]} color="#788e99" emissive="#849dad" glow={.30}/><Box p={[-7.14,2.7,z]} s={[.035,.07,1.4]} color="#788e99" emissive="#849dad" glow={.30}/></React.Fragment>)}
  <Box p={[-12.85,1.85,-19.8]} s={[.10,1.45,2.5]} color="#0a1825" rough={.85}/>
  <Box p={[-8.55,.42,-17.9]} s={[.32,.84,.35]} color="#354653" rough={.9}/>
  <Box p={[-8.55,1.25,-17.83]} s={[.24,.44,.08]} color="#3f525e" rough={.8}/>
  <Box p={[-11.7,.55,-23.7]} s={[.9,1.1,.65]} color="#263a47" rough={.9}/>
  <Box p={[-9.9,1.7,-24.65]} s={[2.5,1.0,.08]} color="#122535" rough={.8}/>
 </StaticBatch>
 <Plate text={t<17?'ARK-07 / IDENTITY MATCH':t<25?'PHASE-SIGNAL / 7 RESEARCHERS':'PHASE-SIGNAL / ARCHIVE'} position={[-12.79,2.2,-19.8]} rotation={[0,Math.PI/2,0]} size={[2.25,.23]}/>
 <group position={[-12.78,1.8,-19.8]} rotation={[0,Math.PI/2,0]}><CrewRecords position={[0,0,0]}/></group>
 <Line3D points={[[-12.77,1.2,-18.8],[-12.77,1.3,-19.1],[-12.77,1.1,-19.45],[-12.77,1.35,-19.8],[-12.77,1.2,-20.15],[-12.77,1.3,-20.7]]} color="#87b8c5" radius={.012} glow={t>=25&&t<35?.2:.6}/>
 <Plate text="LOCAL BUS" position={[-8.55,1.3,-17.78]} size={[.22,.07]}/>
 <Ring p={[-8.55,.92,-17.70]} radius={.045} tube={.01} color="#b8c7bc" glow={0}/>
 <Box p={repairConnector(t)} s={[.068,.065,.07]} color="#aebaa8" rough={.6}/>
 <Line3D points={[[-8.55,.5,-17.75],[-8.38,.66,-17.63],repairConnector(t)]} color="#677c81" radius={.012} glow={0}/>
 <mesh position={[-8.5,1.53,-17.76]}><sphereGeometry args={[.045,16,10]}/><meshStandardMaterial color="#c2d2bd" emissive="#ffe0ab" emissiveIntensity={t<35?.15+Math.sin(t*15)**8*.8:t<41.8?0:t<43.1?1.8:t<44.4?0:.8}/></mesh>
 <Plate text="FIXED / EMERGENCY CAPACITOR" position={[-9.9,1.85,-24.59]} size={[2.3,.20]}/>
 <Plate text="ONE TRANSMISSION / NO RECOMMENDATION" position={[-9.9,1.5,-24.59]} size={[2.3,.15]}/>
 <Line3D points={[[-11.7,.06,-23.7],[-11.7,.06,-24.5],[-10,.06,-24.5],[-10,1.3,-24.5]]} color="#8b9c9b" radius={.013} glow={.08}/>
 {t>=50&&<ResourceDiagram position={[-9.8,2.2,-23.3]} kind="relay"/>}
</>;
export const RescueStage3:React.FC<{time:number}>=({time:t})=>{
 const b=rescue3(t);return <>
  <RescueLighting center={t<7?[-10,0,-12]:[-10,0,-19]} warm={t>=44} planet={t<4.5}/>
  {t<4.5&&<RescueTerrain time={t+60}/>}
  <Shelter open={shelterDoorBottom(t)/3.7}/><ShelterRoom time={t}/>
  <group position={[-7.75,1.06,-11.75]}><Box s={[.40,.55,.15]} color="#304453" rough={.8}/><Plate text="SEAL + SCRUBBER" position={[0,.34,.10]} size={[.57,.1]}/></group>
  <PortableCell position={[-7.75,1.07,-11.59]}/>
  {t<4.5&&<Presence time={t+60} position={[-10,0,lerp(-8,-10.5,ramp(t,.7,4.3))]}/>}
  <RescuePair time={t} {...b}/>
 </>;
};
