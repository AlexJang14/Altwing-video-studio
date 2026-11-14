import React from 'react';
import * as THREE from 'three';
import {C} from './config';
type V3 = [number, number, number];
export const Orb: React.FC<{p?:V3;s?:V3;color?:string;metal?:number;rough?:number;emissive?:string;glow?:number}> = ({p=[0,0,0],s=[1,1,1],color=C.charcoal,metal=.35,rough=.45,emissive='#000000',glow=1}) => <mesh position={p} scale={s} castShadow receiveShadow><sphereGeometry args={[1,32,24]}/><meshStandardMaterial color={color} metalness={metal} roughness={rough} emissive={emissive} emissiveIntensity={glow}/></mesh>;
export const Box: React.FC<{p?:V3;s?:V3;r?:V3;color?:string;emissive?:string;glow?:number;metal?:number;rough?:number}> = ({p=[0,0,0],s=[1,1,1],r=[0,0,0],color=C.charcoal,emissive='#000000',glow=1,metal=.35,rough=.58}) => <mesh position={p} scale={s} rotation={r} castShadow receiveShadow><boxGeometry/><meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={glow} metalness={metal} roughness={rough}/></mesh>;
export const Ring: React.FC<{p?:V3;r?:V3;radius:number;tube?:number;color?:string;glow?:number}> = ({p=[0,0,0],r=[0,0,0],radius,tube=.015,color=C.cyan,glow=2}) => <mesh position={p} rotation={r}><torusGeometry args={[radius,tube,8,48]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={glow} metalness={.5} roughness={.3}/></mesh>;
export const Line3D: React.FC<{points:V3[];color?:string;radius?:number;glow?:number;opacity?:number}> = ({points,color=C.cyan,radius=.012,glow=2,opacity=1}) => {
  const curve=React.useMemo(()=>new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),[JSON.stringify(points)]);
  return <mesh><tubeGeometry args={[curve,24,radius,6,false]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={glow} transparent={opacity<1} opacity={opacity}/></mesh>;
};
