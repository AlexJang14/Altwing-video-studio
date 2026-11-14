import React,{useLayoutEffect} from 'react';
import {AbsoluteFill,useCurrentFrame,usePixelDensity,useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {PlushWangdoo} from './Wangdoo';
import {PlanetLighting} from '../episode2/Lighting';
const Camera=()=>{const {camera}=useThree();useLayoutEffect(()=>{camera.position.set(1.9,1.1,3.9);camera.lookAt(0,.61,0);},[camera]);return null;};
export const PlushLookdev:React.FC=()=>{
 const f=useCurrentFrame(),{width,height}=useVideoConfig(),dpr=usePixelDensity();
 return <AbsoluteFill><ThreeCanvas width={width} height={height} dpr={dpr} shadows camera={{fov:33}} gl={{antialias:true,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.05}}>
  <color attach="background" args={['#202838']}/><Camera/><PlanetLighting studio/>
  <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[100,100]}/><meshStandardMaterial color="#3e4857" roughness={.95}/></mesh>
  <PlushWangdoo time={f/30} pose={{headTilt:.07,headYaw:-.12,scan:.5,light:.1}}/>
 </ThreeCanvas></AbsoluteFill>;
};
