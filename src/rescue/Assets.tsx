import React,{useLayoutEffect} from 'react';
import {AbsoluteFill,useCurrentFrame,usePixelDensity,useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {Box} from '../geometry';
import {PlushWangdoo} from './Wangdoo';
import {RescuePair} from './Actors';
import {RescueLighting} from './Lighting';
import {StationInterior,Plate} from './World';
import {rescue1} from './motion1';
const ArchiveCamera:React.FC<{mode:string}>=({mode})=>{const {camera}=useThree();useLayoutEffect(()=>{if(mode==='cctv'){camera.position.set(-1.85,3.10,.8);camera.lookAt(0,.9,-4);}else if(mode==='plush'){camera.position.set(1.6,1.2,3.2);camera.lookAt(0,.57,0);}else{camera.position.set(2.7,1.9,4.7);camera.lookAt(0,.9,0);}},[camera,mode]);return null;};
export const ArchiveAsset:React.FC<{mode:'plush'|'training'|'cctv'}>=({mode})=>{
 const frame=useCurrentFrame(),{width,height,fps}=useVideoConfig(),dpr=usePixelDensity(),t=frame/fps,b=rescue1(mode==='cctv'?13+t:43);
 return <AbsoluteFill style={{background:'#171f2a'}}>
  <ThreeCanvas width={width} height={height} dpr={dpr} shadows camera={{fov:mode==='cctv'?53:37,near:.1,far:80}} gl={{antialias:true,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:mode==='cctv'?.8:1.05}}>
   <color attach="background" args={[mode==='plush'?'#756650':'#17232f']}/><ArchiveCamera mode={mode}/>
   <RescueLighting center={mode==='cctv'?[0,0,-4]:[0,0,0]} warm={mode!=='cctv'}/>
   {mode==='cctv'?<><StationInterior time={0}/><RescuePair time={13+t} a={b.a} w={b.w}/></>:<>
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[100,100]}/><meshStandardMaterial color={mode==='plush'?'#8b7b66':'#46535f'} roughness={.92}/></mesh>
    {mode==='plush'?<><PlushWangdoo time={0} accessories={false} pose={{headTilt:.05}}/><Box p={[-.75,.05,-.35]} s={[.5,.1,.36]} color="#52717a" rough={.9}/><Box p={[-.75,.12,-.35]} s={[.42,.04,.31]} color="#b9ac88" rough={1}/><Box p={[.75,.35,-.8]} s={[.12,.7,.12]} color="#b4a895" rough={1}/></>:<>
     <RescuePair time={0} a={{p:[.60,0,0],yaw:-.1,pose:{headYaw:-.25,rightArm:-.8,rightElbow:.5}}} w={{p:[-.6,0,.15],yaw:.1,pose:{light:1,headTilt:.04}}}/><Box p={[.8,.44,.75]} s={[.6,.88,.3]} color="#2e4b58"/><Plate text="TRAINING / PASS" position={[.8,.85,.91]} size={[.55,.14]} color="#b9e1c7"/>
    </>}
   </>}
  </ThreeCanvas>
  <div style={{position:'absolute',left:24,right:24,top:22,fontFamily:'monospace',letterSpacing:2,color:'#dde5dc',fontSize:mode==='cctv'?19:20,display:'flex',justifyContent:'space-between'}}><span>{mode==='cctv'?'HELIX-9 / CAM 04':mode==='plush'?'PERSONAL ARCHIVE / 2178':'TRAINING RECORD / 2188'}</span><span>{mode==='cctv'?'REC 14:03:12':'FICTIONAL IN-UNIVERSE IMAGE'}</span></div>
  {mode==='cctv'&&<AbsoluteFill style={{background:'repeating-linear-gradient(0deg,transparent 0px,transparent 3px,#0a1b2c1a 4px)',boxShadow:'inset 0 0 110px #0009',pointerEvents:'none'}}/>}
 </AbsoluteFill>;
};
export const PlushMemory:React.FC=()=><ArchiveAsset mode="plush"/>;
export const TrainingMemory:React.FC=()=><ArchiveAsset mode="training"/>;
export const SecurityFeed:React.FC=()=><ArchiveAsset mode="cctv"/>;
