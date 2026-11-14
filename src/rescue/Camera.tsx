import {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {blendV,ramp,type V3} from '../characters/performance';
export function camera1(t:number):{p:V3;look:V3;fov:number}{
 let p:V3=[1.65,1.65,3.4],look:V3=[-.12,1.0,-2.15],fov=43;
 if(t<1.05){p=blendV([24,18,31],[20,15,25],ramp(t,0,1.05));look=[0,7,-11];fov=51;}
 else if(t>=2.95&&t<3.6){p=[3.2,3.1,-2.0];look=[0,2.4,-7.8];fov=47;}
 else if(t<4){p=[1.5,1.7,3.3];look=[-.05,1.05,-2.15];fov=43;}
 else if(t<8){p=[1.8,1.75,3.8];look=[-.1,1.05,-2.15];fov=44;}
 else if(t<13){p=blendV([.3,1.18,1.7],[.1,1.12,1.4],ramp(t,8,13));look=[-.30,.67,-2.0];fov=44;}
 else if(t<17.5){p=[1.15,1.7,2.5-ramp(t,13,17.5)*1.6];look=[0,1,-2.8-ramp(t,13,17.5)*1.2];fov=46;}
 else if(t<22){p=[.2,1.65,1.3];look=[.15,1.15,-4.9];fov=45;}
 else if(t<31){p=[1.3,1.8,1.4];look=[.0,1.25,-4.8];fov=45;}
 else if(t<34.7){p=[-.5,1.5,2.0];look=[-.1,1.7,-9.0];fov=48;}
 else if(t<40){p=blendV([1.1,1.8,3.4],[1.2,1.75,4.0],ramp(t,34.7,40));look=[-.1,1.0,-1.8];fov=46;}
 else if(t<46){p=blendV([.5,1.7,3.5],[.35,1.55,3.15],ramp(t,40,46));look=[.05,.9,-2.0];fov=46;}
 else if(t<49){p=[1.8,1.8,3.9];look=[.1,1.35,-2.65];fov=43;}
 else{p=[1.1,1.9,4.2];look=[-.05,1.25,-2.6];fov=45;}
 if(t>3.2&&t<3.7){const shake=.035*(1-ramp(t,3.2,3.7));p[0]+=Math.sin(t*83)*shake;p[1]+=Math.sin(t*97)*shake;}
 return {p,look,fov};
}
export const RescueCamera:React.FC<{time:number;episode:number}>=({time,episode})=>{const {camera}=useThree();useLayoutEffect(()=>{const c=camera1(time);camera.position.set(...c.p);camera.lookAt(...c.look);(camera as THREE.PerspectiveCamera).fov=c.fov;camera.updateProjectionMatrix();},[camera,time,episode]);return null;};
