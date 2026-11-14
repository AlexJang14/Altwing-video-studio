import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,usePixelDensity,useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {FilmCamera} from './Camera';
import {FilmStage} from './Stage';
import {FilmFonts,FilmOverlays} from './Overlays';
export const CinematicFilm:React.FC<{episode:number}>=({episode})=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),dpr=usePixelDensity(),time=frame/fps;
 const impactCut=episode===2&&frame>=124&&frame<128;
 return <AbsoluteFill style={{background:'#081220'}}>
  <FilmFonts/>
  <ThreeCanvas width={width} height={height} dpr={dpr} shadows camera={{position:[0,3,8],fov:47,near:.1,far:180}} gl={{antialias:true,alpha:false,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.08}}>
   <color attach="background" args={['#081220']}/>
   {episode===2&&time>=2.8&&<fog attach="fog" args={['#9785a2',23,84]}/>}
   <FilmCamera episode={episode} time={time}/><FilmStage episode={episode} time={time}/>
  </ThreeCanvas>
  <FilmOverlays episode={episode} time={time}/>
  {impactCut&&<AbsoluteFill style={{background:'#03050a'}}/>}
  <Audio src={staticFile(`audio/cinematic/episode-${episode}.mp3`)}/>
 </AbsoluteFill>;
};
export const CinematicEpisode1:React.FC=()=><CinematicFilm episode={1}/>;
export const CinematicEpisode2:React.FC=()=><CinematicFilm episode={2}/>;
