import React from 'react';import {AbsoluteFill,Audio,Img,Sequence,staticFile,useCurrentFrame,useVideoConfig,usePixelDensity}from 'remotion';import {ThreeCanvas}from '@remotion/three';import * as THREE from 'three';import {FilmFonts}from '../cinematic/Overlays';import {FilmCamera}from './Camera';import {ResetStage}from './Stage';import cfg from './episode.json';import voice from '../../public/reset/voice-timing.json';import captions from '../../public/reset/captions.json';
export const ResetFilm:React.FC=()=>{const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),t=frame/fps,dpr=usePixelDensity(),line=captions.find(x=>t>=x.at&&t<x.end);
 return <AbsoluteFill style={{background:'#07111b'}}><FilmFonts/>
  <ThreeCanvas width={width} height={height} dpr={dpr} shadows camera={{fov:45,near:.07,far:600}} gl={{antialias:true,alpha:false,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.05}}><FilmCamera time={t}/><ResetStage time={t}/></ThreeCanvas>
  <AbsoluteFill style={{pointerEvents:'none',background:'linear-gradient(180deg,#02091344,transparent 25%,transparent 70%,#02091399)'}}/>
  {t>=8&&t<10.3&&<div style={{position:'absolute',left:80,right:110,top:130,fontFamily:'Studio Sans',fontSize:32,color:'#d7e0e4',letterSpacing:4}}>THE LAST WING <span style={{fontSize:23,letterSpacing:1}}> / EPISODE 1</span></div>}
  {line&&<div style={{position:'absolute',left:82,right:112,top:1550,fontFamily:'Studio Sans',fontSize:57,fontWeight:600,lineHeight:1.22,color:'#fff8ed',textAlign:'center',textShadow:'0 3px 16px #000, 0 2px 3px #000'}}>{line.text}</div>}
  <Audio src={staticFile('reset/master.mp3')}/>
 </AbsoluteFill>;
};
