import React from 'react';
import {Box, Line3D, Orb, Ring} from '../geometry';
import {C, ease, mix} from '../config';
export type AstronautAction='idle'|'walk'|'run'|'wake'|'look-down'|'reach'|'danger'|'hesitate';
const suit='#0b1018', armor='#161e2a', joint='#242c36';
const Segment: React.FC<{length:number;width:number;color?:string}> = ({length,width,color=suit})=><mesh position={[0,-length/2,0]} castShadow><capsuleGeometry args={[width,length-width*2,8,16]}/><meshStandardMaterial color={color} metalness={.18} roughness={.84}/></mesh>;
export const AstronautRig: React.FC<{time:number;action:AstronautAction;children:React.ReactNode}> = ({time,action,children})=>{
  const traveling=action==='walk'||action==='run';
  const speed=action==='run'?10:6;
  const wake=action==='wake'?1-ease(time/2.2):0;
  return <group position={[0,-wake*.88+(traveling?Math.abs(Math.sin(time*speed))*.055:Math.sin(time*1.7)*.012),0]} rotation={[wake*.40+(action==='run'?.12:0),0,action==='danger'?Math.sin(time*17)*.035:0]}>{children}</group>;
};
export const BlackAstronaut: React.FC<{time:number;action?:AstronautAction;position?:[number,number,number];rotation?:number;headYaw?:number}> = ({time,action='idle',position=[0,0,0],rotation=0,headYaw=0})=>{
  const moving=action==='walk'||action==='run', running=action==='run';
  const phase=time*(running?10:6), stride=running?.78:.43;
  const headPitch=action==='look-down'?.34:action==='wake'?mix(.65,0,ease(time/1.8)):action==='danger'?-.09:Math.sin(time*.8)*.025;
  return <group position={position} rotation={[0,rotation,0]}><AstronautRig time={time} action={action}>
    <Orb p={[0,1.77,0]} s={[.48,.57,.27]} color={suit} metal={.1} rough={.87}/>
    <Orb p={[0,1.95,.09]} s={[.445,.37,.235]} color={armor} metal={.2} rough={.8}/>
    <Box p={[0,1.85,.342]} s={[.40,.23,.035]} color="#0a111b"/>
    <Box p={[.11,1.90,.365]} s={[.075,.012,.008]} color={C.cyan} emissive={C.cyan} glow={1.3}/>
    <Box p={[-.11,1.85,.365]} s={[.075,.012,.008]} color="#344455"/>
    <Line3D points={[[-.24,2.05,.235],[-.28,1.74,.259],[-.18,1.59,.25]]} color="#394351" glow={0} radius={.012}/>
    <Line3D points={[[.24,2.05,.235],[.28,1.74,.259],[.18,1.59,.25]]} color="#394351" glow={0} radius={.012}/>
    <Orb p={[0,1.27,0]} s={[.36,.24,.26]} color={suit} rough={.9}/>
    <Box p={[0,1.39,.22]} s={[.59,.09,.085]} color="#29313c"/>
    <Box p={[0,1.39,.274]} s={[.12,.085,.02]} color="#101722"/>
    <Box p={[0,1.92,-.31]} s={[.61,.73,.27]} color="#101720" rough={.9}/>
    {[-1,1].map(side=><React.Fragment key={side}>
      <Box p={[side*.24,1.91,-.46]} s={[.065,.54,.035]} color="#2b3540"/>
      <Box p={[side*.24,2.12,-.484]} s={[.024,.10,.007]} color={C.cyan} emissive={C.cyan}/>
    </React.Fragment>)}
    <group position={[0,2.48,0]} rotation={[headPitch,headYaw,action==='hesitate'?Math.sin(time*2)*.045:0]}>
      <mesh position={[0,-.13,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.26,.047,12,40]}/><meshStandardMaterial color="#232d3a" metalness={.5} roughness={.5}/></mesh>
      <Orb p={[0,.17,0]} s={[.385,.43,.355]} color="#101721" metal={.24} rough={.72}/>
      <Orb p={[0,.17,.195]} s={[.326,.285,.215]} color="#02060b" metal={.85} rough={.2}/>
      <Line3D points={[[-.225,.34,.34],[-.10,.38,.389],[.11,.375,.388]]} color="#668b9e" radius={.009} glow={.05}/>
      {[-1,1].map(side=><Orb key={side} p={[side*.366,.12,-.012]} s={[.046,.115,.11]} color="#25303b" rough={.8}/>)}
    </group>
    {[-1,1].map((side,index)=>{
      const step=moving?Math.sin(phase+index*Math.PI)*stride:0;
      const arm=action==='reach'&&side===-1?-1.16:action==='danger'?-.40:-step*.65+.06;
      const knee=moving?Math.max(0,-Math.sin(phase+index*Math.PI))*(running?1.08:.58):action==='wake'?(1-ease(time/2.2))*.9:.05;
      return <React.Fragment key={side}>
        <group position={[side*.25,1.12,0]} rotation={[step,0,side*.035]}>
          <Segment length={.52} width={.135}/>
          <Orb p={[0,-.48,.015]} s={[.145,.135,.15]} color={joint}/>
          <group position={[0,-.5,0]} rotation={[knee,0,0]}>
            <Segment length={.53} width={.12}/>
            <Orb p={[0,-.15,.09]} s={[.139,.23,.073]} color={armor} rough={.87}/>
            <Orb p={[0,-.51,.105]} s={[.175,.145,.30]} color="#111923" rough={.88}/>
            <Box p={[0,-.61,.105]} s={[.31,.07,.49]} color="#070b11"/>
          </group>
        </group>
        <group position={[side*.49,2.02,0]} rotation={[arm,0,side*(action==='danger'?.24:.10)]}>
          <Orb s={[.19,.22,.195]} color={armor} rough={.85}/>
          <Segment length={.45} width={.115}/>
          <Orb p={[0,-.42,0]} s={[.12,.12,.12]} color={joint}/>
          <group position={[0,-.44,0]} rotation={[-(running?.95:.18),0,0]}>
            <Segment length={.39} width={.104}/>
            <Box p={[0,-.24,.105]} s={[.15,.16,.035]} color="#25323f"/>
            <Box p={[0,-.24,.125]} s={[.083,.045,.008]} color={C.cyan} emissive={C.cyan} glow={.7}/>
            <Orb p={[0,-.46,.012]} s={[.115,.145,.10]} color="#111820" rough={.9}/>
            <Orb p={[-side*.09,-.42,.045]} s={[.045,.08,.055]} color="#1b2530"/>
          </group>
        </group>
      </React.Fragment>;
    })}
  </AstronautRig></group>;
};
