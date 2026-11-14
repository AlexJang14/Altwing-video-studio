import React,{useMemo} from 'react';
import * as THREE from 'three';
import {Box,Orb,Ring,Line3D} from '../geometry';
import {SpaceshipCockpit,SpaceshipCorridor} from '../environments/Spaceship';
import {LandingCraft} from '../episode2/LandingCraft';
import {PlanetEnvironment} from '../environments/PlanetEnvironment';
import {StaticBatch} from './StaticBatch';
import {Crescent} from './Wangdoo';
import {ramp,lerp,type V3} from '../characters/performance';
const labels=new Map<string,THREE.Texture>();
function labelTexture(text:string,color:string,bg:string){
 const key=text+color+bg;if(labels.has(key))return labels.get(key)!;
 let texture:THREE.Texture;
 if(typeof document==='undefined')texture=new THREE.DataTexture(new Uint8Array([190,220,228,255]),1,1);
 else{const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,1024,256);ctx.fillStyle=color;ctx.font='bold 104px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,137,960);texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;}
 texture.needsUpdate=true;labels.set(key,texture);return texture;
}
export const Plate:React.FC<{text:string;position:V3;size?:[number,number];rotation?:V3;color?:string;bg?:string}>=({text,position,size=[1.1,.24],rotation=[0,0,0],color='#bfd6dd',bg='#14202c'})=>{
 const map=useMemo(()=>labelTexture(text,color,bg),[text,color,bg]);return <mesh position={position} rotation={rotation}><planeGeometry args={size}/><meshBasicMaterial map={map} toneMapped={false}/></mesh>;
};
export const ShipInterior:React.FC=()=> <>
 <StaticBatch cacheKey="rescue-cockpit"><group scale={.7}><SpaceshipCockpit time={0}/></group></StaticBatch>
 <Plate text="ARK-07" position={[1.4,1.35,-3.05]} size={[.95,.22]}/>
 <Box p={[.95,.38,-1.9]} s={[.27,.76,.25]} color="#263747" rough={.8}/>
 <Ring p={[.95,.76,-1.74]} radius={.064} tube={.013} color="#a8c7cc" glow={.1}/>
 <Box p={[-1.5,.42,-2.9]} s={[1.0,.84,.5]} color="#23313f"/>
 <Plate text="PEC / AUX 24 Wh" position={[-1.5,.87,-2.62]} size={[.8,.15]}/>
 </>;
export const StationInterior:React.FC<{time:number;emergency?:boolean;bulkhead?:number}>=({time,emergency=false,bulkhead=3.6})=><>
 <StaticBatch cacheKey="rescue-station"><group scale={.7}><SpaceshipCorridor time={0} damage={false}/></group>
  <Box p={[1.58,.48,-5.45]} s={[.59,.96,.35]} color="#26343e"/>
  <Box p={[1.58,1.3,-5.39]} s={[.92,.65,.12]} color="#101e28"/>
  <Box p={[-1.8,.15,-7.9]} s={[.55,.3,.6]} r={[0,.3,0]} color="#465160"/>
  <Box p={[-1.6,.32,-9.2]} s={[.65,.64,.5]} r={[0,-.4,-.05]} color="#323f4d"/>
 </StaticBatch>
 <Plate text="HELIX-9 / CREW DECK" position={[0,2.9,-7.15]} size={[2.8,.3]}/>
 <Plate text="7 / UNLOCATED" position={[1.58,1.3,-5.31]} size={[.8,.19]} color="#e6b5a0"/>
 <Plate text="RESCUE / DOCK →" position={[-1.8,1.55,-2.7]} size={[.65,.15]}/>
 <group name="bulkhead-frame" position={[0,0,-2.5]}>
  {[-1,1].map(side=><Box key={side} p={[side*2.16,1.65,0]} s={[.22,3.3,.34]} color="#48545e"/>)}
  <Box p={[0,3.35,0]} s={[4.55,.25,.34]} color="#46535f"/>
  <group name="solid-emergency-bulkhead" position={[0,bulkhead+1.55,0]}>
   <Box s={[4.15,3.1,.20]} color="#26313c" rough={.83}/>
   <Box p={[0,-1.45,.118]} s={[4.02,.07,.025]} color={emergency?'#e7a398':'#9ed2cf'} emissive={emergency?'#b74f43':'#538b93'} glow={.25}/>
   <Plate text="PRESSURE SEAL" position={[0,-.7,.122]} size={[1.35,.2]}/>
  </group>
 </group>
 {emergency&&<pointLight position={[1.7,2.3,-6]} color="#de7260" intensity={5+Math.sin(time*2.5)**2*5} distance={13}/>}
 </>;
export const StationExterior:React.FC<{time:number}>=({time})=>{
 const lock=ramp(time,0,3.0);return <>
  <group position={[0,0,-40]} scale={2}><PlanetEnvironment time={time}/></group>
  <StaticBatch cacheKey="helix-9-exterior">
   <group position={[0,8,-14]}>
    <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[14,1.1,16,96]}/><meshStandardMaterial color="#293542" metalness={.7} roughness={.55}/></mesh>
    <Orb s={[3.4,2.7,3.4]} color="#233140" rough={.58} metal={.65}/>
    {Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return <group key={i} rotation={[0,a,0]}><Box p={[0,0,8]} s={[.8,.9,13]} color="#344251" metal={.65}/><Box p={[0,.1,13.8]} s={[3.1,3.2,3.0]} color="#283647" rough={.7}/><Box p={[0,.5,15.4]} s={[1.9,.08,.03]} color="#60818c" emissive="#315d69" glow={.2}/></group>;})}
    <Box p={[0,-3.8,0]} s={[1.7,6,1.7]} color="#303e4c"/>
    <Orb p={[0,-6.5,0]} s={[3.5,1.2,3.1]} color="#354557" rough={.7}/>
   </group>
   <mesh position={[0,2.4,-10.9]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[1.35,1.35,6.4,32,1,true]}/><meshStandardMaterial color="#2d3c4d" metalness={.65} roughness={.6} side={THREE.DoubleSide}/></mesh>
  </StaticBatch>
  <Plate text="HELIX-9" position={[0,6.6,-9.5]} size={[3.3,.65]}/>
  <group position={[0,lerp(2.8,2.4,lock),lerp(2,-5.35,lock)]} rotation={[0,Math.PI,0]} scale={.62}><group position={[0,-2.1,8]}><LandingCraft time={0}/></group></group>
  <group position={[0,2.4,-7.8]}><Ring radius={1.25} tube={.14} color="#5e7483" glow={0}/><Ring radius={.99} tube={.04} color="#deb07d" glow={.3}/>{Array.from({length:4},(_,i)=><group key={i} rotation={[0,0,i*Math.PI/2]}><Box p={[lerp(1.46,.95,ramp(time,3.05,3.5)),0,.08]} s={[.44,.23,.4]} color="#9a9fa2" metal={.65}/></group>)}</group>
 </>;
};
export const Presence:React.FC<{time:number;position:V3;visibility?:number}>=({time,position,visibility=1})=>{
 const stride=Math.sin(time*1.9)*.16;return <group position={position} scale={.82} visible={visibility>.01}>
  <Orb p={[0,2.7,0]} s={[.55,.76,.32]} color="#101923" rough={1} metal={0}/>
  <Orb p={[0,3.55,.02]} s={[.24,.34,.22]} color="#121d28" rough={1} metal={0}/>
  {[-1,1].map(side=><group key={side} position={[side*.29,0,side*stride]}>
   <Orb p={[0,1.18,0]} s={[.14,1.12,.18]} color="#111b25" rough={1} metal={0}/>
   <Orb p={[0,.11,.16]} s={[.21,.12,.37]} color="#111b25" rough={1} metal={0}/>
   <Orb p={[side*.36,2.11,-.02]} s={[.12,.83,.14]} color="#14212b" rough={1} metal={0}/>
  </group>)}
  <mesh position={[.2,.004,1.8]} rotation={[-Math.PI/2,0,-.18]} scale={[1.1,3.3,1]}><circleGeometry args={[1,32]}/><meshBasicMaterial color="#0a121f" transparent opacity={.22*visibility} depthWrite={false}/></mesh>
 </group>;
};
export const CrewRecords:React.FC<{position?:V3}>=({position=[1.55,1.4,-5.3]})=><group position={position}>{Array.from({length:7},(_,i)=><group key={i} position={[(i%4-1.5)*.16,-Math.floor(i/4)*.25,0]}><Orb p={[0,.05,0]} s={[.038,.045,.018]} color="#a3acb1" rough={1}/><Box p={[0,-.035,0]} s={[.085,.08,.02]} color="#717f8c"/><Box p={[0,-.10,0]} s={[.09,.013,.01]} color="#cc9281" emissive="#a66e58" glow={.15}/></group>)}</group>;
export const NavSignals:React.FC<{time:number;power?:number}>=({time,power=1})=><group position={[0,1.85,-3.5]} visible={power>.01}>
 <Box s={[2.6,1.05,.055]} color="#0b1825" rough={.8}/>
 <Line3D points={[[-1,.02,.04],[-.4,.18,.05],[0,-.04,.04],[.8,.12,.05]]} color="#86c0c8" glow={.6*power}/>
 <Ring p={[-.8,.06,.06]} radius={.12} tube={.013} color="#d3b48b" glow={.4*power}/>
 <Orb p={[.82,.06,.06]} s={[.15,.15,.055]} color="#9b83be" emissive="#6b5a89" glow={.25*power}/>
 <Plate text="HELIX-9 / SURFACE" position={[0,-.35,.05]} size={[2.25,.17]}/>
 </group>;
export const ResourceDiagram:React.FC<{position:V3;kind?:'fuel'|'cell'|'relay'}>=({position,kind='cell'})=><group position={position}>
 <Box s={[2.15,1.1,.07]} color="#0e1c28" rough={.85}/><Ring p={[0,.02,.05]} radius={.13} color="#d1dbc6" tube={.018} glow={.3}/>
 {[-1,1].map(side=><React.Fragment key={side}><Line3D points={[[side*.16,.02,.06],[side*.4,.02,.06],[side*.7,.18,.06]]} radius={.014} color={side<0?'#9ccfce':'#d4b68d'} glow={.4}/><Box p={[side*.75,.18,.06]} s={[.30,.21,.025]} color={side<0?'#75a9b1':'#bb9f7c'}/></React.Fragment>)}
 <Plate text={kind==='fuel'?'1 DESCENT / 0 RETURN':kind==='relay'?'ONE TRANSMISSION':'1 CELL / 2 LOADS'} position={[0,-.34,.055]} size={[1.9,.18]}/>
 </group>;
