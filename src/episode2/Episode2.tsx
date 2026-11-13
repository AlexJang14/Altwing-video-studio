import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,usePixelDensity,useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {ease,mix} from '../config';
import {BlackAstronaut} from '../characters/BlackAstronaut';
import {WangdooPenguin} from '../characters/WangdooSoft';
import {AlienPlanet} from './AlienPlanet';
import {LandingCraft} from './LandingCraft';
import {LivingBloom} from './LivingBloom';
import {Episode2Camera} from './Camera';
import {PlanetLighting} from './Lighting';
import {Episode2Fonts,Episode2Overlays} from './Overlays';
import {EPISODE2} from './config';

const Stage:React.FC<{scene:number;t:number;time:number}>=({scene,t,time})=>{
 if(scene===0)return <><AlienPlanet time={time}/><LandingCraft time={t} descending/></>;
 if(scene===1){
  const p=ease((t-.55)/2.8),a=ease((t-1.05)/2.95);
  const penguinZ=mix(-3.85,.4,p),astronautZ=mix(-4.1,-.55,a);
  const rampHeight=(z:number)=>Math.max(0,Math.min(.72,(-.53-z)*Math.tan(.212)));
  return <><AlienPlanet time={time}/><LandingCraft time={time} ramp={ease(t/.85)}/>
   <WangdooPenguin time={t} action={p>0&&p<1?'walk':'idle'} position={[mix(-.35,-.55,p),rampHeight(penguinZ),penguinZ]} rotation={.13}/>
   <BlackAstronaut time={t} action={a>0&&a<1?'walk':'idle'} position={[mix(.40,.75,a),rampHeight(astronautZ),astronautZ]} rotation={.08}/>
  </>;
 }
 if(scene===2)return <><AlienPlanet time={time}/><LandingCraft time={time} ramp={1}/>
  <LivingBloom time={time}/>
  <WangdooPenguin time={t} action={t<1.1?'curious':t<2.7?'wave':'sniff'} position={[-.4,0,.35]} rotation={.14} look={t>2.7?.07:0}/>
  <BlackAstronaut time={t} action="look-down" position={[1.1,0,-1.9]} rotation={-.30} headYaw={-.22}/>
 </>;
 if(scene===3)return <><AlienPlanet time={time}/><LandingCraft time={time} ramp={1}/>
  <LivingBloom time={time}/>
  <WangdooPenguin time={t} action={t<2.8?'touch':'excited'} position={[-.55,0,.2]} rotation={.055} look={t<2.8?.035:-.02}/>
  <BlackAstronaut time={t} action="look-down" position={[1.15,0,-1.5]} rotation={-.25} headYaw={-.25}/>
 </>;
 if(scene===4)return <><AlienPlanet time={time}/><LandingCraft time={time} ramp={1}/><LivingBloom time={time}/>
  <WangdooPenguin time={t} action={t<1.7?'curious':'frightened'} position={[-.60,0,.25]} rotation={mix(-2.70,.14,ease((t-1.0)/1.0))} look={-.03}/>
  <BlackAstronaut time={t} action="hesitate" position={[.80,0,-.35]} rotation={-2.70} headYaw={Math.sin(t*1.2)*.08}/>
 </>;
 return <><AlienPlanet time={time}/><LandingCraft time={time} ramp={1}/><LivingBloom time={time}/>
  <WangdooPenguin time={t} action="curious" position={[-.65,0,.3]} rotation={.10}/>
  <BlackAstronaut time={t} action="hesitate" position={[.83,0,-.30]} rotation={-.05} headYaw={-.20}/>
 </>;
};
export const Episode2:React.FC=()=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),dpr=usePixelDensity();
 const scene=Math.max(0,EPISODE2.scenes.findIndex(s=>frame>=s.start&&frame<s.end));
 const t=(frame-EPISODE2.scenes[scene].start)/fps,time=frame/fps;
 return <AbsoluteFill style={{background:'#514264'}}>
  <Episode2Fonts/>
  <ThreeCanvas width={width} height={height} dpr={dpr} shadows camera={{position:[0,3,8],fov:43,near:.1,far:180}} gl={{antialias:true,alpha:false,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.0}}>
   <color attach="background" args={['#746180']}/><fog attach="fog" args={['#927f9d',18,76]}/>
   <Episode2Camera scene={scene} t={t} frame={frame}/><PlanetLighting/>
   <Stage scene={scene} t={t} time={time}/>
  </ThreeCanvas>
  <Episode2Overlays scene={scene} t={t} frame={frame}/>
  <Audio src={staticFile('audio/episode2-score.wav')} volume={.90}/>
 </AbsoluteFill>;
};
