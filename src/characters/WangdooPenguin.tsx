import React from 'react';
import {Box, Line3D, Orb, Ring} from '../geometry';
import {C} from '../config';
export type PenguinAction = 'idle'|'walk'|'run'|'wave'|'curious'|'frightened'|'project'|'bounce';
export const PenguinRig: React.FC<{time:number;action?:PenguinAction;look?:number;children?:React.ReactNode}> = ({time,action='idle',look=0,children}) => {
  const travel=action==='walk'||action==='run';
  const cycle=time*(action==='run'?17:10);
  const sway=travel?Math.sin(cycle)*.065:Math.sin(time*2)*.012;
  const lift=travel?Math.abs(Math.sin(cycle))*.035:action==='bounce'?Math.abs(Math.sin(time*4))*.15:Math.sin(time*2.2)*.009;
  return <group position={[0,lift,0]} rotation={[0,look,sway]}>{children}</group>;
};
export const WangdooPenguin: React.FC<{time:number;action?:PenguinAction;look?:number;position?:[number,number,number];rotation?:number;scale?:number}> = ({time,action='idle',look=0,position=[0,0,0],rotation=0,scale=1}) => {
  const travel=action==='walk'||action==='run';
  const phase=time*(action==='run'?17:10);
  const tilt=action==='curious'?Math.sin(time*2)*.12:action==='frightened'?-.12:0;
  return <group position={position} rotation={[0,rotation,0]} scale={scale}>
    <PenguinRig time={time} action={action}>
      <Orb p={[0,.82,0]} s={[.69,.72,.55]} color="#424c63" rough={.62}/>
      <Orb p={[0,.77,.26]} s={[.61,.655,.35]} color="#f7f3e9" metal={.04} rough={.68}/>
      <group position={[0,1.25,0]} rotation={[look,0,tilt]}>
        <Orb s={[.605,.535,.52]} color="#62677b" metal={.12} rough={.69}/>
        <Orb p={[0,-.13,.409]} s={[.40,.29,.172]} color="#fff8ed" metal={.04} rough={.68}/>
        {[-1,1].map(side=><React.Fragment key={side}>
          <Orb p={[side*.235,.006,.391]} s={[.315,.379,.169]} color="#fff8ed" metal={.04} rough={.68}/>
          <Orb p={[side*.322,-.113,.538]} s={[.087,.038,.014]} color="#efb4a3" rough={.8} metal={0}/>
          <Line3D points={[[side*.235-.075,.111,.550],[side*.235-.037,.156,.557],[side*.235,.168,.559],[side*.235+.039,.151,.557],[side*.235+.075,.111,.550]]} color="#171b23" radius={.023} glow={0}/>
        </React.Fragment>)}
        <Orb p={[0,-.07,.57]} s={[.195,.087,.16]} color="#ffca48" metal={.06} rough={.53}/>
        <Orb p={[0,-.118,.56]} s={[.173,.060,.14]} color="#efa72d" metal={.06} rough={.55}/>
        <Line3D points={[[-.17,-.10,.628],[0,-.105,.727],[.17,-.10,.628]]} color="#df9428" radius={.007} glow={0}/>
      </group>
      {[-1,1].map((side,i)=>{
        const wave=action==='wave'&&side===-1?1.15+Math.sin(time*9)*.22:action==='frightened'?.55:0;
        const swing=travel?Math.sin(phase+i*Math.PI)*.16:0;
        const foot=Math.sin(phase+i*Math.PI);
        return <React.Fragment key={side}>
          <group position={[side*.60,1.08,-.015]} rotation={[swing,side*.1,side*(.28+wave)]}>
            <Orb p={[0,-.27,0]} s={[.177,.46,.228]} color="#e9a849" rough={.43} metal={.4} emissive="#fd982b" glow={.35}/>
            <Orb p={[0,-.25,.023]} s={[.156,.439,.229]} color="#2b415b" rough={.45} metal={.35}/>
            <Line3D points={[[0,.06,.219],[.008,-.16,.249],[0,-.36,.236]]} color={C.cyan} radius={.009}/>
            <Ring p={[0,-.38,.229]} radius={.041} tube={.009}/>
          </group>
          <Line3D points={[[side*.43,1.12,.246],[side*.47,.8,.322],[side*.39,.42,.34]]} color={C.amber} radius={.017} glow={1.5}/>
          <group position={[side*.255,travel?Math.max(0,foot)*.115:0,travel?foot*.155:0]} rotation={[travel?foot*.2:0,0,0]}>
            <Orb p={[0,.25,0]} s={[.16,.12,.15]} color="#242c39"/>
            <Orb p={[0,.105,.12]} s={[.235,.115,.30]} color="#ffbd38" metal={.35} rough={.32}/>
            <Orb p={[0,.048,.13]} s={[.238,.045,.302]} color="#202738" rough={.75}/>
            <Box p={[0,.063,.373]} s={[.18,.035,.012]} color="#d69832"/>
          </group>
        </React.Fragment>;
      })}
      <Orb p={[0,.84,-.465]} s={[.36,.41,.12]} color="#21334c" metal={.75} rough={.32}/>
      <Ring p={[0,.84,-.588]} radius={.135} tube={.035} color={C.amber}/>
      <Orb p={[0,.84,-.587]} s={[.09,.09,.015]} color={C.amber} emissive={C.amber} glow={3}/>
      {action==='project'&&<group position={[.0,.6,.45]} rotation={[-.5,0,0]}>
        <Ring p={[0,1.02,.35]} radius={.42} tube={.009}/>
        <Ring p={[0,1.02,.35]} radius={.30} tube={.006} color={C.violet}/>
        <Line3D points={[[0,0,0],[-.42,1.02,.35],[.42,1.02,.35],[0,0,0]]} radius={.004}/>
        <Orb p={[0,1.02,.35]} s={[.08,.08,.08]} color={C.violet} emissive={C.violet} glow={3}/>
      </group>}
    </PenguinRig>
  </group>;
};
