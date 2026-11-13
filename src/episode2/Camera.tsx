import React,{useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {ease,mix} from '../config';
export const Episode2Camera:React.FC<{scene:number;t:number;frame:number}>=({scene,t,frame})=>{
 const {camera}=useThree();
 useLayoutEffect(()=>{
  let p:[number,number,number],target:[number,number,number],fov=43;
  if(scene===0){const k=ease(t/4);p=[mix(11,9.1,k),mix(7.2,4.8,k),mix(8.8,7.5,k)];target=[0,mix(5.7,2.2,k),-7.5];fov=49;}
  else if(scene===1){const k=ease(t/4);p=[mix(2.5,1.8,k),2.55,mix(7.9,7.2,k)];target=[0,1.6,-1.8];fov=43;}
  else if(scene===2){const k=ease(t/4);p=[mix(1.0,.7,k),1.35,mix(6.45,6.2,k)];target=[-.60,.94,.35];fov=41.5;}
  else if(scene===3){const k=ease(t/5);p=[mix(-2.35,-1.6,k),mix(1.85,1.65,k),mix(6.8,6.2,k)];target=[-.05,1.0,.45];fov=41;}
  else if(scene===4){const k=ease(t/4);p=[mix(2.8,2.2,k),mix(2.6,3.4,k),mix(7.6,8.2,k)];target=[mix(-1,-7.4,k),mix(1.75,3.0,k),mix(-5.2,-11,k)];fov=45;}
  else {p=[1.8,3.0,mix(8.8,8.4,ease(t/4))];target=[-2.2,2.7,-6.8];fov=42;}
  camera.position.set(...p);camera.lookAt(...target);(camera as THREE.PerspectiveCamera).fov=fov;camera.updateProjectionMatrix();
 },[camera,scene,t,frame]);
 return null;
};
