import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,usePixelDensity,useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {FilmFonts} from '../cinematic/Overlays';
import {RescueCamera} from './Camera';
import {RescueStage1} from './Stage1';
import {RescueOverlays} from './Overlays';
export const RescueFilm:React.FC<{episode:number}>=({episode})=>{
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),dpr=usePixelDensity(),t=f/fps;
 return <AbsoluteFill style={{background:'#07111c'}}><FilmFonts/>
  <ThreeCanvas width={width} height={height} dpr={dpr} shadows camera={{near:.08,far:180,fov:45}} gl={{antialias:true,alpha:false,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.05}}>
   <color attach="background" args={['#07111c']}/><RescueCamera time={t} episode={episode}/><RescueStage1 time={t}/>
  </ThreeCanvas>
  <RescueOverlays episode={episode} time={t}/>
  <Audio src={staticFile(`audio/rescue/episode-${episode}.mp3`)}/>
 </AbsoluteFill>;
};
export const RescueEpisode1:React.FC=()=><RescueFilm episode={1}/>;
