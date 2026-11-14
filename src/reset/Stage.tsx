import React,{useMemo}from 'react';import * as THREE from 'three';import {ramp,between,type V3}from '../characters/performance';import {blocking}from './motion';import {ResetAstronaut,ResetWangdoo}from './Characters';import {ResetSet,Exterior}from './Environment';import {ResetLighting,ContactShadow}from './Lighting';import {Plate}from '../rescue/World';import {Box,Line3D,Orb}from '../geometry';
const TargetSpot:React.FC<{p:V3;look:V3;color:string;intensity:number;shadow?:boolean}>=({p,look,color,intensity,shadow=false})=>{const target=useMemo(()=>new THREE.Object3D(),[]);target.position.set(...look);return <><primitive object={target}/><spotLight position={p} target={target} color={color} intensity={intensity} distance={14} angle={.95} penumbra={.85} decay={2} castShadow={shadow} shadow-mapSize={[1024,1024]} shadow-normalBias={.008}/></>;};
export const StationLights:React.FC=()=> <><ambientLight color="#8fa7bd" intensity={.18}/><hemisphereLight args={['#adc2d1','#101a24',.32]}/><TargetSpot p={[-1.5,2.97,-8.0]} look={[0,.7,-9.3]} color="#d8e4ee" intensity={28} shadow/><TargetSpot p={[1.5,2.97,-4.2]} look={[.3,.8,-7.5]} color="#9abacc" intensity={20}/><pointLight position={[-.85,2.4,-10.15]} color="#bcd1de" intensity={7} distance={5}/><pointLight position={[-1.9,2.2,-6.0]} color="#a4c5d9" intensity={7} distance={9}/><pointLight position={[1.4,1.6,-10.45]} color="#ed5e49" intensity={1.3} distance={3}/><pointLight position={[-2.1,1.5,-1.6]} color="#dec39d" intensity={3} distance={5}/></>;
export const ResetStage:React.FC<{time:number}>=({time:t})=>{
 const b=blocking(t);
 if((t>=3&&t<5.2)||(t>=6.6&&t<8))return <Exterior time={t}/>;
 const ship=t>=5.2&&t<15;
 return <>
  <color attach="background" args={[ship?'#101b27':'#0e1924']}/>
  {ship?<><ResetLighting ship center={[0,0,-1.1]}/><ResetSet name="ship-interior" time={t}/>
   <Plate text={t<8?'HELP.':'RESCUE MAP'} position={[-.35,1.43,-2.462]} size={[.96,.24]} color="#f0d5b5" bg="#0a1823"/>
   <mesh position={[0,1.90,-3.205]}><circleGeometry args={[.965,64]}/><meshBasicMaterial color="#071724"/></mesh>
   {Array.from({length:24},(_,i)=><mesh key={i} position={[Math.sin(i*8.3)*.80,1.9+Math.cos(i*2.7)*.82,-3.20]}><sphereGeometry args={[.0035,6,4]}/><meshBasicMaterial color="#b4ced9"/></mesh>)}
  </>:<><StationLights/><ResetSet name="station-interior" time={t}/><Plate text="MANUAL RELEASE · 30 SEC" position={[1.36,1.68,-10.61]} size={[.77,.16]} color="#e3c6ac" bg="#121c23"/><Plate text="← SHIP" position={[-2.54,1.6,-7.0]} rotation={[0,Math.PI/2,0]} size={[.80,.24]} color="#c3d9d0" bg="#152721"/></>}
  <ResetAstronaut actor={b.a}/><ResetWangdoo actor={b.w}/><ContactShadow p={b.a.p}/><ContactShadow p={b.w.p} small/>
  {t>=12.7&&t<15&&<group position={[-.13,1.04,-.92]} rotation={[-.10,0,0]}>
   <Box s={[.64,.36,.015]} color="#142a34" rough={.9}/><Line3D points={[[-.23,-.07,.012],[-.11,-.07,.012],[-.11,.055,.012],[.20,.055,.012]]} radius={.007} color="#a6d2d2" glow={.4}/><Orb p={[-.23,-.07,.02]} s={[.023,.023,.010]} color="#e3b982" glow={0}/><Orb p={[.20,.055,.02]} s={[.018,.024,.010]} color="#adcfc9" glow={0}/><Plate text="SHIP        DOOR" position={[0,-.137,.014]} size={[.56,.07]}/>
  </group>}
 </>;
};
