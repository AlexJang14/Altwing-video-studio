import React,{useMemo} from 'react';import * as THREE from 'three';
import {AlienSky,AlienVegetation,AncientGate} from '../episode2/AlienPlanet';
import {LandingCraft} from '../episode2/LandingCraft';
import {Box,Orb,Ring,Line3D} from '../geometry';
import {ramp,between,lerp,type V3} from '../characters/performance';
import {StaticBatch} from './StaticBatch';import {Plate,Presence} from './World';import {Crescent} from './Wangdoo';
export const PIT={minX:-7.4,maxX:-5.9,minZ:-6.8,maxZ:-4.4};
export const RescueTerrain:React.FC<{time:number}>=({time})=>{
 const ground=useMemo(()=>{const s=new THREE.Shape();s.moveTo(-70,-70);s.lineTo(70,-70);s.lineTo(70,70);s.lineTo(-70,70);s.closePath();const hole=new THREE.Path();hole.moveTo(PIT.minX,-PIT.minZ);hole.lineTo(PIT.maxX,-PIT.minZ);hole.lineTo(PIT.maxX,-PIT.maxZ);hole.lineTo(PIT.minX,-PIT.maxZ);hole.closePath();s.holes.push(hole);const g=new THREE.ShapeGeometry(s);g.rotateX(-Math.PI/2);return g;},[]);
 return <><AlienSky time={time} distant/><AlienVegetation rescue/>
  <mesh geometry={ground} receiveShadow><meshStandardMaterial color="#64556d" roughness={.99} metalness={0}/></mesh>
  <StaticBatch cacheKey="rescue-ground-pit">
   <Box p={[-6.65,-2.05,-5.6]} s={[1.6,.1,2.5]} color="#211f2e" rough={1}/>
   {[-7.4,-5.9].map(x=><Box key={x} p={[x,-1,-5.6]} s={[.06,2,2.4]} color="#3c3549" rough={1}/>)}
   {[-6.8,-4.4].map(z=><Box key={z} p={[-6.65,-1,z]} s={[1.5,2,.06]} color="#40384c" rough={1}/>)}
   <Box p={[-8.5,-.08,-5.8]} s={[.85,.16,3.4]} color="#515a65" rough={.85}/>
   {[-7,-6,-5].map(z=><React.Fragment key={z}><Box p={[-10.35,.4,z]} s={[.04,.8,.04]} color="#727d84"/><Box p={[-10.35,.75,z+.4]} s={[.035,.035,.9]} color="#869198"/></React.Fragment>)}
  </StaticBatch>
 </>;
};
export const CrashSite:React.FC<{time:number;current?:boolean}>=({time,current=true})=><>
 <StaticBatch cacheKey={`rescue-crash-site-${current}`}>
  {current&&<group position={[3.6,0,-2]} scale={.6}><LandingCraft time={0} damaged ramp={1}/></group>}
  <group position={[-8.3,0,4.3]} rotation={[0,.15,0]} scale={.6}><LandingCraft time={0} damaged ramp={0}/><Plate text="ARK-07" position={[0,3.3,-3.96]} size={[1.6,.34]}/><Box p={[-1,.9,-3.6]} s={[.9,.13,1.0]} r={[0,.4,.1]} color="#655a58" rough={1}/></group>
  <Box p={[-4.9,.12,-2.7]} s={[.31,.24,.17]} r={[.12,.4,-.4]} color="#626a70" rough={.9}/>
  <Box p={[-5.1,.04,-2.5]} s={[.08,.05,.45]} r={[0,.8,0]} color="#777268" rough={1}/>
 </StaticBatch>
 {current&&<Plate text="ARK-07" position={[3.6,2.02,-4.38]} size={[.95,.22]}/>}
 <Plate text="FLIGHT / 02:03 +06h" position={[-7.4,1.65,.55]} size={[1.0,.18]} rotation={[0,.15,0]} color="#d1b6a1"/>
 <Crescent position={[-4.9,.23,-2.60]} rotation={[.5,.2,-.4]} scale={.8}/>
 <Line3D points={[[-6,.025,-3.8],[-5.2,.025,-2.9],[-3.95,.025,-2.1]]} color="#424553" glow={0} radius={.018}/>
 </>;
export const Transmitter:React.FC<{time:number}>=({time})=>{
 const active=time<34.9,pulse=active?Math.max(between(time,29.9,30.5,.15),between(time,32.0,32.6,.15)):0;
 return <group position={[-3.95,0,-2.1]}>
  <Box p={[0,.42,0]} s={[.20,.84,.20]} color="#515d67" rough={.9}/><Box p={[0,.95,0]} s={[.35,.26,.26]} color="#5f6f79" rough={.8}/>
  <Ring p={[0,1.12,0]} r={[Math.PI/2,0,0]} radius={.20} tube={.018} color="#b8c6c2" glow={.1}/>
  <Orb p={[0,1.13,0]} s={[.045,.045,.045]} color={active?'#e4b284':'#525f67'} emissive="#ce7359" glow={pulse}/>
  <Plate text="ARK-07 / TX" position={[0,.97,.14]} size={[.32,.10]}/>
  {pulse>.01&&[0,1,2].map(i=><Ring key={i} p={[0,1.2+i*.25,0]} r={[Math.PI/2,0,0]} radius={.25+i*.13+pulse*.1} tube={.007} color="#d79e89" glow={pulse*.6}/>)}
 </group>;
};
export const Shelter:React.FC<{open?:number}>=({open=0})=><>
 <StaticBatch cacheKey="shelter-facade"><Box p={[-12.6,3.4,-12.2]} s={[1.8,6.8,.7]} color="#4b485b" rough={.95}/><Box p={[-7.4,3.4,-12.2]} s={[1.8,6.8,.7]} color="#4b485b" rough={.95}/><Box p={[-10,5.2,-12.2]} s={[7,3.2,.7]} color="#514b61" rough={.95}/></StaticBatch>
 <group position={[-2.6,0,-1]}><AncientGate time={0}/></group>
 <group name="solid-shelter-door" position={[-10,1.8+open*3.7,-12.05]}><Box s={[3.4,3.6,.20]} color="#3c4653" rough={.85}/><Plate text="PRESSURE SHELTER" position={[0,.4,.12]} size={[2.6,.3]}/></group>
 <Plate text="CONTINUOUS POWER REQUIRED" position={[-10,3.9,-11.8]} size={[3.1,.22]} color="#c6bb9f"/>
 </>;
export const PortableCell:React.FC<{position:V3;rotation?:V3;active?:boolean}>=({position,rotation=[0,0,0],active=true})=><group name="portable-power-cell" position={position} rotation={rotation}>
 <Box s={[.26,.43,.22]} color="#5a6a72" rough={.75} metal={.18}/><Box p={[0,0,.116]} s={[.14,.22,.015]} color={active?'#b9dfc1':'#6b7777'} emissive="#84bb9c" glow={active?.3:0}/>
 <Ring p={[0,.25,0]} r={[Math.PI/2,0,0]} radius={.065} tube={.012} color="#c3c5ab" glow={0}/><Plate text="24 V" position={[0,-.14,.12]} size={[.18,.06]}/>
 </group>;
export const AllocationCradle:React.FC<{time:number}>=({time})=><group position={[-7.75,0,-8.0]}>
 <Box p={[0,.42,0]} s={[.50,.84,.65]} color="#3c4955" rough={.85}/>
 {[-1,1].map(side=><React.Fragment key={side}><Ring p={[.22,.89,side*.21]} r={[Math.PI/2,0,0]} radius={.10} tube={.018} color={side<0?'#9ebbc8':'#c9b593'} glow={.2}/><Line3D points={[[0,1.05,.05],[.1,.92,side*.12],[.22,.89,side*.21]]} color={side<0?'#9ebbc8':'#c9b593'} radius={.012} glow={.15}/></React.Fragment>)}
 <Plate text="300 W MAX" position={[0,.60,.34]} size={[.44,.11]}/>
 </group>;
export const SurfacePresence:React.FC<{time:number}>=({time})=><Presence time={time} position={[lerp(-1.5,-5.3,ramp(time,35,63)),0,-18+.6*ramp(time,29.9,30.7)+.8*ramp(time,32,32.7)+5.9*ramp(time,35,63)]} visibility={ramp(time,29.8,31)}/>;
