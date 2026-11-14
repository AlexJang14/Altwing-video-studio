import React,{useMemo} from 'react';
import * as THREE from 'three';
import {SoftEnvironment} from '../episode2/Lighting';
import {type V3} from '../characters/performance';
import {usePixelDensity} from 'remotion';
export const RescueLighting:React.FC<{center?:V3;emergency?:boolean;planet?:boolean;warm?:boolean}>=({center=[0,0,-3],emergency=false,planet=false,warm=false})=>{
 const dpr=usePixelDensity(),map=dpr<.7?512:1024,target=useMemo(()=>new THREE.Object3D(),[]);target.position.set(center[0],.9,center[2]);
 return <><SoftEnvironment/><primitive object={target}/>
  <ambientLight color={warm?'#e7d6c4':'#b3c4d8'} intensity={planet?.16:.12}/>
  <hemisphereLight args={[warm?'#ffe4c2':'#c0d1e8','#343847',.48]}/>
  <directionalLight position={[center[0]-2.6,5.8,center[2]+5.6]} target={target} intensity={emergency?.95:1.9} color={warm?'#ffe1b8':'#d2dfec'} castShadow shadow-mapSize={[map,map]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-3} shadow-camera-far={25} shadow-normalBias={.018} shadow-bias={-.00015}/>
  <directionalLight position={[center[0]+3.8,3.2,center[2]-4.5]} intensity={1.25} color={warm?'#b4d2e5':'#859ec2'}/>
  <pointLight position={[center[0]-1.4,1.5,center[2]+1.4]} intensity={warm?8:3.5} color="#dfba8f" distance={8}/>
 </>;
};
