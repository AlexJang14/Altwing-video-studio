import React from 'react';
import * as THREE from 'three';
import {Box,Line3D,Orb,Ring} from '../geometry';
import {ease,mix} from '../config';

export const LandingCraft:React.FC<{time:number;descending?:boolean;ramp?:number;damaged?:boolean}>=({time,descending=false,ramp=0,damaged=false})=>{
 const landing=descending?ease(time/3.1):1;
 const y=2.1+(1-landing)*5.5;
 const thrust=descending?1-ease((time-2.8)/.6):0;
 return <>
  <group position={[0,y,-8]} rotation={[0,0,descending?Math.sin(time*2.1)*.015*(1-landing):0]}>
   <Orb s={[2.65,1.22,3.8]} color="#242b3b" metal={.35} rough={.52}/>
   <Orb p={[0,.73,-.7]} s={[1.83,.77,2.4]} color="#333e50" metal={.28} rough={.52}/>
   <Orb p={[0,1.61,1.8]} s={[1.60,.49,1.25]} color="#142739" metal={.45} rough={.23}/>
   <Line3D points={[[-1.39,1.58,2.0],[-.8,1.96,2.5],[0,2.08,2.7],[.8,1.96,2.5],[1.39,1.58,2.0]]} color="#85d9e3" radius={.023} glow={.7}/>
   <Box p={[0,.17,3.18]} s={[3.2,3.4,1.5]} color="#333c50" rough={.67}/>
   <Box p={[0,.16,3.95]} s={[2.61,3.2,.04]} color="#101a2a" rough={.8}/>
   {[-1,1].map(side=><React.Fragment key={side}>
    <group visible={ramp<.98}>
     <Box p={[side*(.64+ramp*1.2),.16,4.0]} s={[1.26,3.14,.09]} color="#2c394c"/>
     <Box p={[side*(.09+ramp*1.2),.16,4.06]} s={[.025,1.5,.01]} color="#8bdce5" emissive="#8bdce5" glow={.5}/>
    </group>
    <Line3D points={[[side*1.4,-1.4,4.03],[side*1.4,1.8,4.03],[0,1.8,4.03]]} color="#e9ad67" radius={.024} glow={.2}/>
    <Box p={[side*3.0,-.1,-.7]} s={[2.0,.28,3.8]} r={[0,0,side*-.08]} color="#34445b"/>
    <group visible={!(damaged&&side===1)}>
     <Orb p={[side*3.15,-.35,-.55]} s={[.72,.65,1.65]} color="#2a384b" rough={.48}/>
     <Orb p={[side*3.15,-.35,.95]} s={[.47,.45,.12]} color="#121e31" metal={.6}/>
     <Ring p={[side*3.15,-.35,1.045]} radius={.30} tube={.028} color="#56d1e7" glow={.7}/>
    </group>
    <Line3D points={[[side*2.3,-.8,-1.7],[side*2.65,-1.8,-1.5],[side*2.7,-2,-1.5]]} color="#5b6574" radius={.087} glow={0}/>
    <Line3D points={[[side*1.9,-.9,1.55],[side*2.4,-1.8,1.7],[side*2.45,-2,1.75]]} color="#606a7b" radius={.085} glow={0}/>
    {[-1.5,1.75].map(z=><Orb key={z} p={[side*(z<0?2.7:2.45),-2.015,z]} s={[.47,.09,.64]} color="#273347" rough={.88}/>)}
    {Array.from({length:4},(_,i)=><Box key={i} p={[side*2.51,.15,-2+i*.56]} s={[.03,.075,.22]} color="#f6b86c" emissive="#f6b86c" glow={.25}/>)}
    {thrust>.01&&<group position={[side*3.15,-1.27,-.55]}>
     <Ring r={[Math.PI/2,0,0]} radius={.33} tube={.035} color="#9fe9ff" glow={2}/>
     <mesh position={[0,-thrust*.75,0]} rotation={[0,0,Math.PI]} scale={[1,thrust,1]}><coneGeometry args={[.29,1.6,20]}/><meshBasicMaterial color="#8edcff" transparent opacity={.72} depthWrite={false}/></mesh>
     <pointLight color="#9bdbff" intensity={thrust*10} distance={5}/>
    </group>}
   </React.Fragment>)}
   <Box p={[0,.35,-3.55]} s={[1.7,.45,.7]} color="#1d283b"/>
  </group>
  {ramp>0&&<group position={[0,.72,-3.93]} rotation={[mix(-Math.PI/2,.212,ramp),0,0]}>
   <Box p={[0,0,1.7]} s={[3.25,.09,3.4]} color="#4e596b" rough={.78} metal={.15}/>
   {[-1,1].map(side=><Box key={side} p={[side*1.47,.053,1.7]} s={[.028,.012,3.25]} color="#eab56e" emissive="#eab56e" glow={.2}/>)}
   {Array.from({length:8},(_,i)=><Box key={i} p={[0,.052,.2+i*.41]} s={[2.7,.012,.025]} color="#89929e" rough={.8}/>)}
  </group>}
 </>;
};
