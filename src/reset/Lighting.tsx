import React,{useMemo}from 'react';import * as THREE from 'three';import {usePixelDensity}from 'remotion';import {SoftEnvironment}from '../episode2/Lighting';import {type V3}from '../characters/performance';
const softShadow=(()=>{const s=64,a=new Uint8Array(s*s*4);for(let y=0;y<s;y++)for(let x=0;x<s;x++){const d=((x-31.5)/24)**2+((y-31.5)/24)**2,i=(y*s+x)*4;a[i]=a[i+1]=a[i+2]=0;a[i+3]=Math.round(Math.exp(-d*2.2)*92);}const t=new THREE.DataTexture(a,s,s);t.needsUpdate=true;return t;})();
export const ContactShadow:React.FC<{p:V3;small?:boolean}>=({p,small})=><mesh position={[p[0],.001,p[2]]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={small?[.75,.70]:[.75,.75]}/><meshBasicMaterial map={softShadow} transparent depthWrite={false}/></mesh>;
export const ResetLighting:React.FC<{ship?:boolean;center?:V3}>=({ship=false,center=[0,0,0]})=>{const dpr=usePixelDensity(),target=useMemo(()=>new THREE.Object3D(),[]);target.position.set(center[0],1,center[2]);return <>
 <SoftEnvironment/><primitive object={target}/><ambientLight color="#9eadba" intensity={.10}/><hemisphereLight args={['#c5d7e6','#26313d',.35]}/>
 <directionalLight position={[center[0]-3,5.0,center[2]+4]} target={target} color={ship?'#ffe4c4':'#fff0dd'} intensity={2.1} castShadow shadow-mapSize={[dpr<.7?1024:2048,dpr<.7?1024:2048]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={5} shadow-camera-bottom={-3} shadow-camera-far={18} shadow-bias={-.0001} shadow-normalBias={.007} shadow-radius={4}/>
 <directionalLight position={[center[0]+2.5,3.0,center[2]-3]} color="#8ab9d9" intensity={1.5}/>
 <pointLight position={[center[0]+1.0,1.8,center[2]+2]} color="#d3e7f0" intensity={2.3} distance={6}/>
 {ship&&<pointLight position={[center[0]-.8,.8,center[2]+.8]} color="#ffdbad" intensity={3} distance={3}/>}
 </>;};
