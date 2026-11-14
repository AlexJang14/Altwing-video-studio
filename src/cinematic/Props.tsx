import React,{useLayoutEffect,useRef} from 'react';
import * as THREE from 'three';
import {Box,Line3D,Orb,Ring} from '../geometry';
import {between,lerp,ramp,type V3} from '../characters/performance';

// Static scenery does not cast hundreds of redundant shadows. Characters and
// interaction props keep their shadows; the broad deck/ground receives them.
export const SetDressing:React.FC<{children:React.ReactNode}>=({children})=>{
 const ref=useRef<THREE.Group>(null);
 useLayoutEffect(()=>{ref.current?.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=false;o.receiveShadow=o.position.y<.03;}});},[]);
 return <group ref={ref}>{children}</group>;
};
export const CoffeeMachine:React.FC<{time:number}>=({time})=><group position={[-2.15,0,-2.45]}>
 <Box p={[0,.55,0]} s={[.87,1.1,.68]} color="#293749" rough={.76}/>
 <Box p={[0,1.31,0]} s={[.82,.44,.56]} color="#bec8ca" rough={.38}/>
 <Box p={[0,1.31,.29]} s={[.6,.27,.025]} color="#0b242b"/>
 <Box p={[-.18,1.35,.311]} s={[.12,.075,.01]} color="#9fe9bc" emissive="#9fe9bc"/>
 <Box p={[0,1.02,.22]} s={[.13,.12,.22]} color="#1b252e"/>
 <mesh position={[0,.75,.23]}><cylinderGeometry args={[.12,.095,.22,24]}/><meshStandardMaterial color="#faf0d4" roughness={.8}/></mesh>
 <Ring p={[.13,.75,.23]} r={[0,Math.PI/2,0]} radius={.066} tube={.014} color="#faf0d4" glow={0}/>
 {Array.from({length:3},(_,i)=>{const u=(time*.35+i*.32)%1;return <Orb key={i} p={[Math.sin(time*2+i)*.035,.88+u*.24,.23]} s={[.018+u*.018,.05,.018]} color="#cde6e4" rough={1}/>;})}
</group>;
export const RepairPanel:React.FC<{time:number;hand:V3;socket:V3}>=({time,hand,socket})=>{
 const live=ramp(time,25.2,26.2),flip=ramp(time,22.1,23.3);
 return <>
  <group position={[-.55,0,-3.1]}>
   <Box p={[0,.48,0]} s={[1.65,.96,.32]} color="#27394b"/>
   <Box p={[0,.6,.18]} s={[1.4,.52,.06]} color="#08141f"/>
   {[0,1,2,3].map(i=><Box key={i} p={[-.48+i*.31,.72,.218]} s={[.18,.07,.025]} color={live>.5?'#73e9d8':'#fb7964'} emissive={live>.5?'#73e9d8':'#fb7964'} glow={.7}/>)}
   <group position={[-.15,.62,.27]} rotation={[-.5+flip,0,0]}><Box p={[0,.15,0]} s={[.09,.3,.08]} color="#e6ac61"/><Orb p={[0,.3,0]} s={[.10,.06,.06]} color="#ffc06a"/></group>
   <Ring p={[.49,.34,.21]} radius={.08} tube={.015} color={live>.5?'#68e6df':'#ffb46a'} glow={1}/>
  </group>
  <group position={socket}>
   <Box p={[0,-.18,-.06]} s={[.27,.42,.18]} color="#32455a"/>
   <Ring p={[0,0,.045]} radius={.075} tube={.015} color={time>22.1?'#8fe8d2':'#ffd094'} glow={.5}/>
  </group>
  <Line3D points={[[socket[0],socket[1]-.2,socket[2]],[1.0,.04,-2.1],[.05,.04,-3.05]]} color={live>.5?'#77d9d0':'#2b3949'} radius={.018} glow={live*.6}/>
  {time>=20&&time<27.5&&<>
   <Line3D points={[[.75,.12,-3.0],[1.2,.15,-2.4],[hand[0]+.3,hand[1]-.25,hand[2]],hand]} color="#101b29" glow={0} radius={.035}/>
   <Orb p={hand} s={[.075,.04,.045]} color="#abc2c7" metal={.6}/>
   <Ring p={hand} radius={.055} tube={.008} color="#70d9ed" glow={1}/>
  </>}
 </>;
};
export const NavMap:React.FC<{time:number}>=({time})=>{
 const live=ramp(time,25.2,26.2),route=ramp(time,29,30),fail=ramp(time,38.1,38.7);
 return <group position={[0,2.7,-4.1]}>
  <Box s={[3.7,1.45,.09]} color="#0b192a" emissive="#0a1d2f" glow={.5}/>
  <group visible={live>.01} scale={[live,live,live]}>
   <Line3D points={[[-1.2,-.2,.07],[-.6,.2,.08],[0,0,.08],[.8,.3,.08],[1.45,-.1,.08]]} color="#7ce3eb" glow={.9} radius={.014}/>
   <Orb p={[-1.05,.1,.1]} s={[.08,.08,.08]} color="#ffbf75" emissive="#ffbf75" glow={1}/>
   <group position={[-1.05,.1,.12]} rotation={[0,0,time*.18]}><Box s={[.06,.5,.025]} color="#ffcf8d"/><Box s={[.5,.06,.025]} color="#ffcf8d"/></group>
   <Orb p={[1.05,.1,.10]} s={[.22,.22,.14]} color="#a894de" emissive="#967dd2" glow={.4}/>
   <Ring p={[1.05,.1,.14]} r={[.25,0,-.4]} radius={.31} tube={.009} color="#c5b9f7" glow={.4}/>
   <Box p={[0,-.48,.065]} s={[lerp(2.9,.9,fail),.07,.01]} color={fail>.5?'#ffae6b':'#8de3d7'} emissive={fail>.5?'#ffae6b':'#8de3d7'}/>
  </group>
  {!live&&<Box p={[0,0,.06]} s={[1.0,.015,.01]} color="#ed6f65" emissive="#ed6f65" glow={.6}/>}
 </group>;
};

const petal=new THREE.Shape();petal.moveTo(0,0);petal.bezierCurveTo(-.36,.28,-.24,.75,0,.89);petal.bezierCurveTo(.24,.75,.36,.28,0,0);
const petalGeo=new THREE.ShapeGeometry(petal,16);
export const AlarmBloom:React.FC<{time:number}>=({time})=>{
 const alarm=ramp(time,16.2,16.75),open=ramp(time,12,13.4),lean=.12*Math.sin(time*2)*(1-alarm);
 return <group position={[.58,0,.55]} rotation={[0,0,lean]}>
  <Line3D points={[[0,0,0],[.04,.3,0],[-.05,.7,0],[0,1.08,0]]} color="#3c867e" glow={.15} radius={.04}/>
  <group position={[0,1.08,0]} rotation={[0,time*.12,0]}>
   {Array.from({length:7},(_,i)=><group key={i} rotation={[0,i*2*Math.PI/7,0]}><group rotation={[lerp(-.5,-2.27,open)+alarm*.92,0,0]}>
    <mesh geometry={petalGeo} scale={[.8,.8,.8]} rotation={[.7,0,0]}><meshPhysicalMaterial color={new THREE.Color('#d0f8e5').lerp(new THREE.Color('#8793a2'),alarm)} metalness={alarm*.85} roughness={lerp(.65,.27,alarm)} side={THREE.DoubleSide} emissive={alarm>.5?'#240a0a':'#77d9c8'} emissiveIntensity={lerp(.15,.03,alarm)}/></mesh>
    <Line3D points={[[0,.03,.01],[0,.25,.23],[0,.51,.38]]} color={alarm>.5?'#ff6f64':'#7de9d8'} radius={.008} glow={alarm>.5?1.4:.5}/>
    <group visible={alarm>.01} position={[0,.40,.3]} scale={[alarm,alarm,alarm]}><Box s={[.055,.48,.045]} color="#b0b8c3"/><Orb p={[0,.25,0]} s={[.055,.055,.055]} color="#ff7768" emissive="#ff574f" glow={1.4}/></group>
   </group></group>)}
   <Orb s={[.15,.15,.15]} color={alarm>.3?'#ed4939':'#ffe7a1'} emissive={alarm>.3?'#ff2419':'#b7eddd'} glow={.4+alarm*.3}/>
  </group>
  {alarm>.02&&[0,1,2].map(i=>{const u=((time-16.25)*1.3+i/3)%1;return <mesh key={i} position={[0,1.12+u*2,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.18+u*1.6,.195+u*1.6,48]}/><meshBasicMaterial color="#ff756c" transparent opacity={(1-u)*.6*alarm} side={THREE.DoubleSide} depthWrite={false}/></mesh>;})}
 </group>;
};
const pulseCurve=new THREE.CatmullRomCurve3([[.58,.035,.55],[-.1,.035,-1.8],[-2.8,.035,-5.4],[-5.1,.035,-8.6],[-7.4,.035,-10.5]].map(p=>new THREE.Vector3(...p)));
export const SignalPath:React.FC<{time:number}>=({time})=>{
 const u=ramp(time,20.1,21.8),tail=pulseCurve.getPointAt(u).toArray() as V3;
 return <group visible={time>=20.1}>
  <Line3D points={Array.from({length:22},(_,i)=>pulseCurve.getPointAt(u*i/21).toArray() as V3)} color="#ff8a70" radius={.026} glow={1.1}/>
  {time<22.2&&<Orb p={tail} s={[.18,.045,.18]} color="#fff2b5" emissive="#ff946a" glow={2}/>}
 </group>;
};
export const RisingStructures:React.FC<{time:number}>=({time})=><>
 {[-1,1].map((side,i)=>{const up=ramp(time,21.8+i*.3,24.1+i*.3);return <group key={side} position={[-7.4+side*3.6,lerp(-4.5,0,up),-12.6]}><Box p={[0,2,0]} s={[.8,4,.95]} color="#403a52" rough={.94}/><Line3D points={[[0,.3,.49],[0,3.7,.49]]} radius={.028} color="#80ded3" glow={1.2*up}/><Ring p={[0,3.2,.51]} radius={.19} tube={.018} color="#a1e8de" glow={up}/></group>;})}
</>;
export const Threat:React.FC<{time:number}>=({time})=>{
 const reveal=ramp(time,22.5,24.2),advance=ramp(time,24,54),z=lerp(-21,-12,advance),x=lerp(7,-3,advance),cycle=time*1.6;
 return <group position={[x,lerp(-14,0,reveal),z]}>
  <group position={[0,8.6,0]}>
   <Orb s={[2.6,1.9,1.5]} color="#252b3d" rough={.82}/>
   <Orb p={[0,2.05,.1]} s={[1.5,.95,1.10]} color="#30394d" rough={.78}/>
   <Orb p={[0,2.12,1.03]} s={[1.07,.27,.12]} color="#ff735f" emissive="#ff5a42" glow={.75}/>
   <Orb p={[0,-.4,1.4]} s={[.44,.44,.2]} color="#e7af70" emissive="#ee8460" glow={.7}/>
   <Ring p={[0,-.4,1.55]} radius={.58} tube={.055} color="#b2a39a" glow={0}/>
   {[-1,1].map(side=><group key={side} position={[side*2.6,.3,0]}><Orb s={[.8,.9,.9]} color="#414355" rough={.78}/><Orb p={[side*.25,-1.5,0]} s={[.52,1.3,.63]} color="#33384b" rough={.85}/><Orb p={[side*.25,-2.7,.15]} s={[.66,.55,.67]} color="#3b4050" rough={.85}/></group>)}
  </group>
  {[-1,1].map((side,i)=>{const u=(cycle+i*Math.PI),lift=Math.max(0,Math.sin(u))*.9;return <group key={side} position={[side*1.65,0,Math.cos(u)*.8]}>
   <Orb p={[0,3.5+lift,0]} s={[.57,2.8,.6]} color="#303348" rough={.88}/>
   <Orb p={[0,1.2+lift,.45]} s={[.88,.9,.78]} color="#424157" rough={.85}/>
   <Orb p={[0,.45+lift,.5]} s={[.88,.46,1.35]} color="#282c3e" rough={.86}/>
   <Line3D points={[[0,2.0+lift,.62],[0,5.6+lift,.62]]} color="#d89168" glow={.5} radius={.033}/>
  </group>;})}
  <mesh position={[-3,.015,4]} rotation={[-Math.PI/2,0,-.25]} scale={[5,8,1]}><circleGeometry args={[1,48]}/><meshBasicMaterial color="#171626" transparent opacity={reveal*.28} depthWrite={false}/></mesh>
 </group>;
};
export const ChaseRocks:React.FC<{time:number}>=({time})=><>
 {[[-4.1,.4,-2.7],[-7.4,.5,-3.8],[-5.7,.45,-5.6]].map((p,i)=><mesh key={i} position={p as V3} rotation={[.3,i,.2]} scale={[.65,.5,.65]}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color="#695a70" roughness={1}/></mesh>)}
 {Array.from({length:8},(_,i)=>{const u=((time-29)*.35+i*.17)%1;return <mesh visible={time>=29&&time<37} key={i} position={[-1.7-i*.45+Math.sin(i)*.6,4.2*(1-u)**2,-1.6-i*.6]} scale={.07+(i%3)*.035}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color="#756777" roughness={1}/></mesh>;})}
</>;
export const PowerTerminal:React.FC<{time:number}>=({time})=>{
 const turn=time*.7;
 return <group position={[-8.05,0,-8.7]}>
  <Box p={[0,.65,0]} s={[2.6,1.3,.9]} color="#403c52" rough={.88}/>
  <Box p={[0,1.45,0]} s={[2.75,.3,1.02]} color="#56546c" rough={.85}/>
  <group position={[0,1.95,0]} rotation={[0,turn,0]}><mesh><octahedronGeometry args={[.3,0]}/><meshStandardMaterial color="#c3ffe7" emissive="#7bddcf" emissiveIntensity={1.1} roughness={.25} metalness={.3}/></mesh><Ring radius={.43} tube={.015} r={[Math.PI/2,0,0]} color="#9df3df" glow={1}/></group>
  {[-1,1].map(side=><group key={side} position={[side*.98,1.7,0]}><Ring radius={.21} tube={.035} r={[Math.PI/2,0,0]} color={side===-1?'#afacef':'#ffc185'} glow={.8}/><Line3D points={[[0,0,0],[-side*.3,.01,0],[-side*.65,.24,0]]} color={side===-1?'#afacef':'#ffc185'} radius={.018} glow={.4}/></group>)}
 </group>;
};
export const CrashDust:React.FC<{time:number}>=({time})=><group visible={time>3.65&&time<6.2} position={[0,0,-8]}>
 {Array.from({length:14},(_,i)=>{const u=ramp(time,3.75+i*.025,5.8),angle=i*2.4;return <mesh key={i} position={[Math.sin(angle)*u*5,.2+u*.7,Math.cos(angle)*u*3]} scale={.3+u*(.4+i%3*.14)}><sphereGeometry args={[1,12,8]}/><meshBasicMaterial color="#aea1af" transparent opacity={(1-u)*.4} depthWrite={false}/></mesh>;})}
</group>;
