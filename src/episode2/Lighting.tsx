import React,{useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export const SoftEnvironment:React.FC=()=>{
  const {gl,scene}=useThree();
  useLayoutEffect(()=>{
    const generator=new THREE.PMREMGenerator(gl),room=new RoomEnvironment();
    const target=generator.fromScene(room,.05);
    const previous=scene.environment;scene.environment=target.texture;scene.environmentIntensity=.28;
    room.dispose();generator.dispose();
    return ()=>{scene.environment=previous;target.dispose();};
  },[gl,scene]);
  return null;
};
export const PlanetLighting:React.FC<{studio?:boolean;alert?:boolean}>=({studio=false,alert=false})=><>
  <SoftEnvironment/>
  <ambientLight color="#e8ddfa" intensity={.32}/>
  <hemisphereLight args={['#c3d7ff','#b5a1bd',.70]}/>
  <directionalLight position={[-3,6,7]} color="#fff0df" intensity={1.8} castShadow shadow-mapSize={[512,512]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={6} shadow-camera-bottom={-3} shadow-camera-near={.1} shadow-camera-far={25} shadow-normalBias={.025} shadow-bias={-.0002}/>
  <directionalLight position={[4,3,-4]} color={studio?'#a9ddff':'#ae9cff'} intensity={1.2}/>
  <directionalLight position={[3,1.5,5]} color="#dcecff" intensity={.35}/>
  {alert&&<pointLight position={[-2,2,0]} color="#ffae74" intensity={8} distance={8}/>}
</>;
