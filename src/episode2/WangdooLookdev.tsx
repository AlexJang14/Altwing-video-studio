import React,{useLayoutEffect} from 'react';
import {AbsoluteFill,staticFile,useCurrentFrame,usePixelDensity,useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {WangdooPenguin} from '../characters/WangdooSoft';
import {PlanetLighting} from './Lighting';
const Camera:React.FC=()=>{const {camera}=useThree();useLayoutEffect(()=>{camera.position.set(2.15,1.65,5.25);camera.lookAt(0,.91,0);},[camera]);return null;};
export const WangdooLookdev:React.FC=()=>{
 const frame=useCurrentFrame(),{width,height}=useVideoConfig();const dpr=usePixelDensity();
 return <AbsoluteFill style={{background:'#b6c9df'}}>
   <style>{`@font-face{font-family:Studio;src:url('${staticFile('fonts/DejaVuSans.ttf')}')}`}</style>
   <ThreeCanvas width={width} height={height} dpr={dpr} shadows camera={{fov:34}} gl={{antialias:true,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.0}}>
     <color attach="background" args={['#b6c9df']}/><fog attach="fog" args={['#b6c9df',9,20]}/><Camera/><PlanetLighting studio/>
     <mesh position={[0,-.025,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#b9c8d9" roughness={.95} metalness={0}/></mesh>
     <WangdooPenguin time={frame/30} action={frame<60?'curious':'wave'} rotation={.18}/>
   </ThreeCanvas>
   <div style={{position:'absolute',top:68,left:68,fontFamily:'Studio',fontSize:25,letterSpacing:5,color:'#334259'}}>WANGDOO / EPISODE 02</div>
   <div style={{position:'absolute',bottom:72,left:68,right:68,fontFamily:'Studio',fontSize:21,lineHeight:1.6,color:'#485a70'}}>Soft plush body · Ivory face · Navy armor<br/>Warm gold trim · Cyan details · Happy little smile</div>
 </AbsoluteFill>;
};
