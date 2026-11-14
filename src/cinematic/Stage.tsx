import React from 'react';
import * as THREE from 'three';
import {BlackAstronaut} from '../characters/BlackAstronaut';
import {WangdooPenguin} from '../characters/WangdooSoft';
import {astronautHand,between,lerp,ramp,type V3} from '../characters/performance';
import {SpaceshipCockpit,SpaceshipCorridor,Sparks} from '../environments/Spaceship';
import {AlienPlanet,AncientGate} from '../episode2/AlienPlanet';
import {LandingCraft} from '../episode2/LandingCraft';
import {SoftEnvironment} from '../episode2/Lighting';
import {Box,Orb,Ring} from '../geometry';
import {blocking1,blocking2} from './motion';
import {AlarmBloom,ChaseRocks,CoffeeMachine,CrashDust,NavMap,PowerTerminal,RepairPanel,RisingStructures,SetDressing,SignalPath,Threat} from './Props';
import mouth1 from './mouth-1.json';
import mouth2 from './mouth-2.json';

const FilmLighting:React.FC<{episode:number;time:number}>=({episode,time})=>{
 const b=episode===1?blocking1(time):blocking2(time),center=b.a.p,planet=episode===2&&time>=2.8;
 // A wide soft key stays near the actors, including during the moving chase.
 const target=React.useMemo(()=>new THREE.Object3D(),[]);target.position.set(center[0],1,center[2]);
 return <>
  <SoftEnvironment/><primitive object={target}/>
  <ambientLight color="#dce1f3" intensity={planet?.32:.4}/>
  <hemisphereLight args={['#c9defc',planet?'#a696ac':'#4e5669',.85]}/>
  <directionalLight target={target} position={[center[0]-3,7,center[2]+6]} color="#ffefd9" intensity={2.0} castShadow shadow-mapSize={[512,512]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-4} shadow-camera-near={.1} shadow-camera-far={30} shadow-normalBias={.03} shadow-bias={-.0002}/>
  <directionalLight position={[center[0]+4,5,center[2]-5]} color={planet?'#bcaafa':'#84c9fa'} intensity={1.3}/>
  <directionalLight position={[center[0]+1,2,center[2]+5]} color="#eaf3ff" intensity={.45}/>
  {episode===1&&time<29&&<pointLight position={[1,3,-2]} color="#ffac7d" intensity={4+Math.sin(time*3)**2*4} distance={12}/>}
 </>;
};
export const FilmStage:React.FC<{episode:number;time:number}>=({episode,time:t})=>{
 const b=episode===1?blocking1(t):blocking2(t),{a,w}=b,repairEnd=blocking1(22.2).a;
 w.pose.talk=(episode===1?mouth1:mouth2)[Math.min(Math.round(t*30),(episode===1?mouth1:mouth2).length-1)]??0;
 const actors=<><BlackAstronaut time={t} position={a.p} rotation={a.yaw} pose={a.pose}/><WangdooPenguin time={t} position={w.p} rotation={w.yaw} pose={w.pose}/></>;
 if(episode===1)return <>
  <FilmLighting episode={episode} time={t}/>
  <SetDressing>{t<5?<SpaceshipCorridor time={t}/>:<SpaceshipCockpit time={t}/>}</SetDressing>
  {t>=5&&<>
   <Box p={[0,3.5+ramp(t,29,31.3)*8,-8.3]} s={[11,6.8,.12]} color="#1c2b40" rough={.8}/>
   <Box p={[0,3.5+ramp(t,29,31.3)*8,-8.2]} s={[.035,6.5,.03]} color="#314b61"/>
   <NavMap time={t}/><CoffeeMachine time={t}/>
   {t>=20&&<RepairPanel time={t} hand={astronautHand(t,a.pose,1,a.p,a.yaw)} socket={astronautHand(22.2,repairEnd.pose,1,repairEnd.p,repairEnd.yaw)}/>}
  </>}
  {((t>17.1&&t<17.55)||(t>23.8&&t<24.55))&&<Sparks time={t*2} origin={t<20?[-1.7,2.3,-3.0]:[-.5,1.5,-2.6]}/>}
  {actors}
 </>;
 if(t<2.8)return <><FilmLighting episode={2} time={t}/><SetDressing><SpaceshipCockpit time={t}/></SetDressing><Box p={[0,3.5,-8.3]} s={[11,6.8,.15]} color="#5a365a" emissive="#b25b67" glow={.25}/>{actors}<Sparks time={t*1.8}/></>;
 const drop=ramp(t,2.8,3.9),damaged=t>7.52;
 const podFall=ramp(t,7.52,7.88),podY=lerp(1.75,.58,podFall);
 return <>
  <FilmLighting episode={2} time={t}/>
  <SetDressing><AlienPlanet time={t} gate={false} signal={false} clearing/>
   <group position={[0,t<5?lerp(6,0,drop):0,0]} rotation={[0,0,t<5?lerp(-.16,.045,drop):.045]}>
    <LandingCraft time={t} ramp={t>=5?1:0} damaged={damaged}/>
   </group>
   <AncientGate time={16.1+ramp(t,21.8,23.6)*2.2}/>
   <RisingStructures time={t}/><ChaseRocks time={t}/><PowerTerminal time={t}/>
  </SetDressing>
  {damaged&&<group position={[3.15,podY,-8.55+podFall*.55]} rotation={[podFall*.7,0,podFall*.5]}><Orb s={[.72,.65,1.65]} color="#2a384b" rough={.6}/><Ring p={[0,0,1.50]} radius={.3} tube={.028} color="#667d8c" glow={0}/></group>}
  <CrashDust time={t}/><AlarmBloom time={t}/><SignalPath time={t}/>
  <Threat time={t}/>
  {t>=5&&actors}
 </>;
};
