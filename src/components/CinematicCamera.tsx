import React, {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {ease,mix} from '../config';
export const CinematicCamera:React.FC<{scene:number;localTime:number;frame:number;preview?:boolean}> = ({scene,localTime:t,frame,preview=false})=>{
  const {camera}=useThree();
  useLayoutEffect(()=>{
    let p:[number,number,number]=[3,2.5,6],target:[number,number,number]=[0,1.5,0],fov=43;
    if(preview){p=[3.8,2.4,7.8];target=[0,1.45,0];fov=38;}
    else if(scene===0){const k=ease(t/4);p=[mix(.9,.65,k),mix(1.15,1.65,k),mix(3.6,3.0,k)];target=[0,mix(1.50,2.05,k),0];fov=45;}
    else if(scene===1){const z=-7+t*1.85;p=[.95+Math.sin(t*.4)*.15,1.65,z+4.8];target=[0,1.6,z-.4];fov=49;}
    else if(scene===2){if(t<2.35){p=[.05,.88,3.25];target=[-.65,.88,-.55];fov=43;}else{const k=ease((t-2.35)/2.65);p=[mix(1.7,1.5,k),2.2,mix(8.0,7.6,k)];target=[.15,1.55,-.08];fov=43;}}
    else if(scene===3){const k=ease(t/5);p=[mix(1.8,3.0,k),mix(2.9,3.7,k),mix(3.6,6.6,k)];target=[mix(-.4,-.8,k),mix(2.2,3.0,k),mix(-5,-10,k)];fov=mix(46,52,k);}
    else if(scene===4){const impact=Math.exp(-t*5);p=[2.1+Math.sin(t*35)*.05*impact,2.5+Math.cos(t*29)*.045*impact,3.9];target=[0,1.48,-2.35];fov=46;}
    else {const k=ease(t/4);p=[0,3.25,mix(7.9,7.5,k)];target=[0,2.7,-6];fov=50;}
    camera.position.set(...p); camera.lookAt(new THREE.Vector3(...target));
    (camera as THREE.PerspectiveCamera).fov=fov;camera.updateProjectionMatrix();
  },[camera,frame,scene,t,preview]);
  return null;
};
