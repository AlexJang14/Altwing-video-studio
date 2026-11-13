import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig,usePixelDensity} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {EPISODE,ease,mix} from './config';
import {BlackAstronaut} from './characters/BlackAstronaut';
import {WangdooPenguin} from './characters/WangdooPenguin';
import {CinematicLighting,SpaceshipCockpit,SpaceshipCorridor} from './environments/Spaceship';
import {CinematicCamera} from './components/CinematicCamera';
import {Overlays} from './components/Overlays';
import './style.css';
const Fonts=()=> <style>{`@font-face{font-family:'Studio Sans';src:url('${staticFile('fonts/DejaVuSans.ttf')}');font-weight:400}@font-face{font-family:'Studio Sans';src:url('${staticFile('fonts/DejaVuSans-Bold.ttf')}');font-weight:700}@font-face{font-family:'Studio Mono';src:url('${staticFile('fonts/DejaVuSansMono.ttf')}')}`}</style>;
const SceneContent:React.FC<{scene:number;t:number;globalTime:number}> = ({scene,t,globalTime})=>{
  if(scene===0)return <><SpaceshipCorridor time={globalTime}/><BlackAstronaut time={t} action="wake"/><mesh position={[0,.43,-.65]}><boxGeometry args={[1.8,.85,.7]}/><meshStandardMaterial color="#1a293b" roughness={.7}/></mesh></>;
  if(scene===1)return <><SpaceshipCorridor time={globalTime}/><BlackAstronaut time={t} action="run" position={[0,0,-7+t*1.85]}/></>;
  if(scene===2){const approach=ease(Math.min(t/2.6,1));const q=t<2.6?'run':t<3.7?'curious':'wave';return <><SpaceshipCorridor time={globalTime} damage={false}/><BlackAstronaut time={t} action="look-down" position={[.88,0,0]} rotation={-.28} headYaw={-.15}/><WangdooPenguin time={t} action={q} position={[mix(-1.75,-.62,approach),0,mix(-3.4,.22,approach)]} rotation={t<2.6?.12:.28} look={t>2.6?-.18:0}/></>;}
  if(scene===3){const k=ease(t/3);return <><SpaceshipCockpit time={globalTime}/><BlackAstronaut time={t} action={t<2.8?'walk':'reach'} position={[.62,0,mix(-.2,-3.5,k)]} rotation={Math.PI-.20}/><WangdooPenguin time={t} action={t<2.8?'walk':'project'} position={[-.95,0,mix(-.7,-4.0,k)]} rotation={Math.PI+.35}/></>;}
  if(scene===4)return <><SpaceshipCockpit time={globalTime}/><BlackAstronaut time={t} action={t<.55?'danger':'hesitate'} position={[.64,0,-2.6]} rotation={-.2} headYaw={Math.sin(t*2.5)*.3}/><WangdooPenguin time={t} action={t<.55?'frightened':'wave'} position={[-.95,0,-2.15]} rotation={.2} look={-.12}/></>;
  return <><SpaceshipCockpit time={globalTime}/><BlackAstronaut time={t} position={[.62,0,-2.7]} rotation={Math.PI-.12}/><WangdooPenguin time={t} position={[-.97,0,-2.65]} rotation={Math.PI+.1}/></>;
};
export const Episode:React.FC=()=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
  const pixelDensity=usePixelDensity();
  const scene=Math.max(0,EPISODE.scenes.findIndex(s=>frame>=s.start&&frame<s.end));
  const t=(frame-EPISODE.scenes[scene].start)/fps;
  return <AbsoluteFill style={{background:'#050b17'}}>
    <Fonts/>
    <ThreeCanvas width={width} height={height} dpr={pixelDensity} shadows camera={{position:[0,2,6],fov:43,near:.1,far:180}} gl={{antialias:true,alpha:false,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.15}}>
      <color attach="background" args={['#050b17']}/>
      {scene<3&&<fog attach="fog" args={['#0b172a',10,36]}/>}
      <CinematicCamera scene={scene} localTime={t} frame={frame}/>
      <CinematicLighting time={frame/fps} emergency={scene<2||scene===4}/>
      <SceneContent scene={scene} t={t} globalTime={frame/fps}/>
    </ThreeCanvas>
    <Overlays scene={scene} localTime={t} frame={frame}/>
    <Audio src={staticFile('audio/episode-score.wav')} volume={.82}/>
  </AbsoluteFill>;
};
export const CharacterPreview:React.FC=()=>{
  const frame=useCurrentFrame(),{width,height,fps}=useVideoConfig();const t=frame/fps;const pixelDensity=usePixelDensity();
  return <AbsoluteFill style={{background:'#07111f'}}><Fonts/><ThreeCanvas width={width} height={height} dpr={pixelDensity} shadows camera={{position:[3.8,2.4,7.8],fov:38}} gl={{antialias:true,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.15}}>
    <color attach="background" args={['#0b1422']}/><CinematicCamera scene={0} localTime={t} frame={frame} preview/><CinematicLighting time={t}/>
    <mesh position={[0,-.12,0]} receiveShadow><boxGeometry args={[200,.2,200]}/><meshStandardMaterial color="#162336" metalness={.5} roughness={.4}/></mesh>
    <BlackAstronaut time={t} action={t<2?'idle':'walk'} position={[-.7,0,0]} rotation={.10}/><WangdooPenguin time={t} action={t<2?'wave':'walk'} position={[.78,0,.3]} rotation={.10}/>
  </ThreeCanvas><div style={{position:'absolute',top:70,left:70,fontFamily:'"Studio Sans"',color:'white',fontSize:28,letterSpacing:6}}>THE LAST WING <span style={{color:'#52d8ff'}}> / CHARACTER STUDY</span></div></AbsoluteFill>;
};
