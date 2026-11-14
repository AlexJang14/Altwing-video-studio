import React from 'react';
import {Box,Line3D,Orb} from '../geometry';
import {between,ramp} from '../characters/performance';
import {rescue1,doorBottom1} from './motion1';
import {RescuePair} from './Actors';
import {RescueLighting} from './Lighting';
import {ShipInterior,StationExterior,StationInterior,Presence,CrewRecords,NavSignals,ResourceDiagram} from './World';
import {worldHand} from './locomotion';
export const RescueStage1:React.FC<{time:number}>=({time:t})=>{
 const b=rescue1(t),station=t>=13&&t<40;
 if(t<1.05||(t>=2.95&&t<3.6))return <><RescueLighting center={[0,7,-10]}/><StationExterior time={t<1.05?t*2.8:t}/></>;
 return <>
  <RescueLighting center={station?[0,0,-3.8]:[0,0,-2.1]} emergency={t>=31&&t<40}/>
  {station?<>
   <StationInterior time={t} emergency={t>=31} bulkhead={doorBottom1(t)}/><CrewRecords/>
   <Presence time={t} position={[Math.sin(t*1.3)*.7,0,-15.5+(t-31)*.14]} visibility={between(t,31.2,39.7,.4)}/>
   {t>31&&<Line3D points={[[-.55,.012,-5.6],[-.55,.012,-2.8],[-.55,.012,.4]]} color="#86b7bd" radius={.013} glow={.25}/>}
  </>:<>
   <ShipInterior/>
   {t>=40&&<>
    <NavSignals time={t} power={ramp(t,44.1,45.2)}/>
    <Line3D points={[[1.25,.12,-2.25],[1.08,.24,-1.9],worldHand(b.a,t,1)]} color="#26333c" radius={.024} glow={0}/>
    <Orb p={worldHand(b.a,t,1)} s={[.035,.025,.025]} color="#9aafb3" metal={.5} rough={.65}/>
    {t>=49&&<ResourceDiagram position={[0,1.8,-3.25]} kind="fuel"/>}
   </>}
  </>}
  <RescuePair time={t} {...b}/>
 </>;
};
