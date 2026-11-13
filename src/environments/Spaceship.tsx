import React from 'react';
import * as THREE from 'three';
import {Box, Line3D, Orb, Ring} from '../geometry';
import {C} from '../config';
import {PlanetEnvironment} from './PlanetEnvironment';
export const CinematicLighting:React.FC<{time:number;emergency?:boolean}> = ({time,emergency=false})=><>
  <ambientLight intensity={.85} color="#bed4e8"/>
  <hemisphereLight args={['#c8e0f6','#3c3a4b',1.6]}/>
  <directionalLight position={[3,7,5]} intensity={2.5} color="#b8ddf3" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={8} shadow-camera-bottom={-5} shadow-bias={-.001}/>
  <directionalLight position={[-4,3,-5]} intensity={1.8} color={C.cyan}/>
  <pointLight position={[2,3,3]} color={C.amber} intensity={22} distance={16}/>
  {emergency&&<pointLight position={[-2,3.6,1]} color={C.red} intensity={15+Math.pow(Math.sin(time*5),2)*65} distance={16}/>}
</>;
const Floor:React.FC<{width?:number;length?:number}> = ({width=6.8,length=40})=><group>
  <Box p={[0,-.15,-10]} s={[width,.25,length]} color="#243246" rough={.72} metal={.25}/>
  {Array.from({length:15},(_,i)=><group key={i} position={[0,0,5-i*2.5]}>
    <Box p={[0,-.017,0]} s={[width-.2,.018,.025]} color="#07101b"/>
    {[-1,1].map(side=><React.Fragment key={side}>
      <Box p={[side*(width/2-.26),.003,0]} s={[.03,.016,2.3]} color={C.cyan} emissive={C.cyan} glow={1.2}/>
      <Box p={[side*(width/2-.58),.004,0]} s={[.12,.02,.4]} color="#b8a474" metal={.65}/>
      <Box p={[side*1.3,-.001,0]} s={[.022,.02,2.30]} color="#0c141e"/>
    </React.Fragment>)}
  </group>)}
</group>;
export const Sparks:React.FC<{time:number;origin?:[number,number,number]}> = ({time,origin=[2,4,-3]})=><group position={origin}>{Array.from({length:15},(_,i)=>{
  const phase=(time*.8+i*.073)%1; const x=Math.sin(i*17.1)*phase*.85;const y=-phase*phase*3.3;const z=Math.cos(i*7.8)*phase*.5;
  return <mesh key={i} position={[x,y,z]} scale={[.012,.05+.08*phase,.012]}><sphereGeometry args={[1,6,4]}/><meshBasicMaterial color={i%3?'#ffbc60':'#fff1cd'}/></mesh>;
})}</group>;
export const SpaceshipCorridor:React.FC<{time:number;damage?:boolean}> = ({time,damage=true})=><group>
  <Floor/>
  {[-1,1].map(side=><group key={side}>
    <Box p={[side*3.42,2.45,-10]} s={[.22,5.1,40]} color="#152233"/>
    {Array.from({length:10},(_,i)=><group key={i} position={[side*3.25,0,5-i*3.7]}>
      <Box p={[0,2.5,0]} s={[.19,4.9,.16]} color="#344556" metal={.7}/>
      <Box p={[-side*.06,1.85,-1.7]} s={[.065,2.8,3.16]} color={i%2?'#1a2a3e':'#203046'}/>
      <Box p={[-side*.11,3.65,-1.7]} s={[.08,.12,2.76]} color={i%3?C.cyan:C.red} emissive={i%3?C.cyan:C.red} glow={i%3?1.8:2.3}/>
      <Box p={[-side*.13,.45,-1.7]} s={[.09,.07,2.76]} color="#59646b"/>
      {Array.from({length:4},(_,j)=><Box key={j} p={[-side*.12,.83+j*.09,-1.7]} s={[.065,.032,1.75]} color="#081320"/>)}
      <Box p={[-side*.06,4.38,-1.7]} s={[.42,.46,3.16]} color="#101b2b"/>
    </group>)}
  </group>)}
  <Box p={[0,4.98,-10]} s={[6.9,.22,40]} color="#0c1725"/>
  {Array.from({length:9},(_,i)=><group key={i} position={[0,0,4-i*4]}>
    <Box p={[0,4.67,0]} s={[6.5,.22,.24]} color="#364555"/>
    <Box p={[0,4.81,-1.8]} s={[.65,.03,1.7]} color="#bcecff" emissive="#bcecff" glow={1.7}/>
  </group>)}
  <Box p={[0,2.4,-29]} s={[6.6,4.8,.3]} color="#263649"/>
  <Box p={[0,2.1,-28.8]} s={[2.5,4.1,.17]} color="#080f1a"/>
  <Line3D points={[[-1.4,0,-28.65],[-1.4,4.3,-28.65],[1.4,4.3,-28.65],[1.4,0,-28.65]]} color={C.cyan} radius={.035}/>
  <Box p={[2.9,2.18,-1]} s={[.10,1.0,1.7]} color="#030b12"/>
  <Box p={[2.83,2.38,-1]} s={[.035,.08,1.4]} color={C.red} emissive={C.red}/>
  {damage&&<><Sparks time={time}/><Box p={[1.35,4.65,-3.2]} s={[2,.13,.9]} r={[0,0,-.25]} color="#243247"/></>}
</group>;
export const SpaceshipCockpit:React.FC<{time:number}> = ({time})=><group>
  <Floor width={14} length={31}/>
  <PlanetEnvironment time={time}/>
  {[-1,1].map(side=><group key={side}>
    <Box p={[side*6.35,3,-4]} s={[.5,6,20]} color="#162235"/>
    <Box p={[side*5.25,3.6,-9.0]} s={[.34,7.2,.42]} r={[0,0,side*-.15]} color="#30415b"/>
    <Box p={[side*5.03,3.6,-8.75]} s={[.034,6.8,.045]} r={[0,0,side*-.15]} color={C.cyan} emissive={C.cyan} glow={1.7}/>
    <Box p={[side*2.8,.64,-5.8]} s={[2.2,1.28,1.5]} color="#1b2b40"/>
    <group position={[side*2.8,1.42,-5.7]} rotation={[-.64,0,0]}>
      <Box s={[2.25,.09,1.4]} color="#293c51"/>
      <Box p={[0,.051,0]} s={[1.98,.018,1.15]} color="#061724" emissive="#0d3354" glow={.7}/>
      {Array.from({length:6},(_,i)=><Box key={i} p={[-.78+i*.3,.072,-.29]} s={[.15,.02,.38]} color={i%2?C.cyan:'#b6def7'} emissive={C.cyan} glow={.65}/>)}
      {Array.from({length:7},(_,i)=><Box key={i} p={[-.78+i*.25,.075,.33]} s={[.12,.023,.10]} color={i%3?C.cyan:C.amber} emissive={i%3?C.cyan:C.amber}/>)}
    </group>
    <Line3D points={[[side*5.4,.6,2],[side*5.4,.6,-7],[side*4.8,1.6,-9]]} radius={.022} color={C.amber}/>
  </group>)}
  <Box p={[0,6.65,-9]} s={[11,.5,.7]} color="#293a52"/>
  <Box p={[0,.28,-9]} s={[11,.54,.8]} color="#2b3e58"/>
  <Box p={[0,6.38,-8.64]} s={[10,.04,.04]} color={C.cyan} emissive={C.cyan} glow={2}/>
  <Box p={[0,.55,-8.54]} s={[10,.04,.04]} color={C.cyan} emissive={C.cyan} glow={2}/>
  <group position={[0,1.0,-5.9]}>
    <Ring r={[-Math.PI/2,0,0]} radius={.9} tube={.014}/>
    <Ring r={[-Math.PI/2,0,0]} radius={.69} tube={.008} color={C.violet}/>
    <mesh rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.87,48]}/><meshBasicMaterial color={C.cyan} transparent opacity={.06} side={THREE.DoubleSide} depthWrite={false}/></mesh>
    <Line3D points={[[-.7,0,0],[-.3,0,.3],[.16,0,-.13],[.65,0,-.4]]} radius={.012}/>
    {[[-.7,0,0],[.16,0,-.13],[.65,0,-.4]].map((p,i)=><Orb key={i} p={p as [number,number,number]} s={[.045,.045,.045]} color={i===2?C.violet:C.cyan} emissive={i===2?C.violet:C.cyan} glow={2}/>)}
  </group>
</group>;
