import React from 'react';
import * as THREE from 'three';
import {Line3D,Orb} from '../geometry';
import {ease} from '../config';
const petal=(()=>{const g=new THREE.PlaneGeometry(1,1,8,18),p=g.attributes.position;for(let i=0;i<p.count;i++){const t=p.getY(i)+.5;p.setXYZ(i,p.getX(i)*Math.sin(Math.PI*t)*.47,Math.sin(t*Math.PI)*.07,t*.58);}g.computeVertexNormals();return g;})();
export const LivingBloom:React.FC<{time:number;position?:[number,number,number]}>=({time,position=[.55,0,.7]})=>{
 const open=ease((time-13.05)/1.6);
 return <group position={position}>
  <Line3D points={[[0,0,0],[-.055,.28,.02],[.025,.53,0],[0,.75,0]]} color="#3d827d" radius={.034} glow={.06}/>
  {[-1,1].map(side=><mesh key={side} geometry={petal} position={[0,.24,0]} rotation={[.55,side*.9,side*.55]} scale={[.72,.72,.72]}><meshStandardMaterial color="#447b77" side={THREE.DoubleSide} roughness={.8}/></mesh>)}
  <group position={[0,.75,0]} rotation={[0,time*.09,Math.sin(time*1.8)*.018]}>
   {Array.from({length:7},(_,i)=><group key={i} rotation={[0,i*Math.PI*2/7,0]}>
    <group rotation={[-1.18+open*1.22,0,0]}>
     <mesh geometry={petal}><meshPhysicalMaterial color="#c0f1de" roughness={.56} metalness={0} side={THREE.DoubleSide} sheen={.2} emissive="#5cd6da" emissiveIntensity={.09+open*.24}/></mesh>
     <Line3D points={[[0,.012,.03],[0,.078,.29],[0,.034,.53]]} color="#8be5eb" radius={.006} glow={.18+open*.6}/>
    </group>
   </group>)}
   <Orb p={[0,.045,0]} s={[.12,.11,.12]} color="#f5e7aa" metal={0} rough={.5} emissive="#a4eada" glow={.15+open*1.0}/>
  </group>
  <pointLight position={[0,.95,.05]} color="#a8efe2" intensity={open*3.0} distance={4}/>
 </group>;
};
