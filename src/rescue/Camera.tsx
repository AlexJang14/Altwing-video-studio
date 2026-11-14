import {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {blendV,ramp,type V3} from '../characters/performance';
import {rescue2} from './motion2';
import {rescue3} from './motion3';
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
export function camera2(t:number):{p:V3;look:V3;fov:number}{
 const b=rescue2(t),cx=(b.a.p[0]+b.w.p[0])*.5,cz=(b.a.p[2]+b.w.p[2])*.5;
 if(t<1.3)return {p:[11,6,8],look:[3.6,5,-6.5],fov:54};
 if(t<3.8)return {p:[1.7,1.7,3.5],look:[0,1.1,-2.1],fov:44};
 if(t<6)return {p:[9,4.5,6.5],look:[3.6,2.4,-6.5],fov:50};
 if(t<10.4)return {p:[.8,1.25,2.6],look:[-.2,.65,-2.1],fov:45};
 if(t<12.7)return {p:[-.3,1.0,1.9],look:[-.35,.55,-2.1],fov:45};
 if(t<16)return {p:[5.9,2.0,5.4],look:[2.8,1.1,0],fov:48};
 if(t<22)return {p:[cx+1,2.2,cz+7.8],look:[cx-.7,1.2,cz-2.8],fov:50};
 if(t<24.0)return {p:[-.7,2.6,7],look:[-4.5,1.2,-.6],fov:54};
 if(t<28)return {p:[-2,2.1,2.6],look:[-4.8,.8,-1.8],fov:48};
 if(t<36)return {p:[-3.4,2.1,5],look:[-3.8,1.2,-3.2],fov:49};
 if(t<40.5)return {p:[-2,4,1],look:[-6.4,.1,-5.2],fov:52};
 if(t<46)return {p:[cx+2.4,2.5,cz+7.3],look:[cx-.2,1.1,cz-.8],fov:52};
 return {p:[-5.5,2.7,-3.8],look:[-8.65,1.15,-8.1],fov:54};
}
export function camera3(t:number):{p:V3;look:V3;fov:number}{
 if(t<1.1)return {p:[-6.4,2.0,-7.6],look:[-8.4,1.1,-11.65],fov:48};
 if(t<4.5)return {p:[-6.8,2.4,-6.2],look:[-10,1.4,-12.7],fov:52};
 if(t<7)return {p:[-7.3,2.1,-17.2],look:[-9.9,1.05,-14.2],fov:65};
 if(t<25)return {p:[-8.6,2.3,-13.6],look:[-10,1.5,-19.6],fov:53};
 if(t<35)return {p:[-9.6,1.6,-13.4],look:[-9.9,1.0,-18.2],fov:47};
 if(t<47)return {p:[-7.5,1.65,-14.6],look:[-9.25,.88,-18.1],fov:51};
 if(t<50.2)return {p:[-9.9,1.65,-13.8],look:[-9.9,1.0,-18.2],fov:52};
 const b=rescue3(t),z=Math.max(-17.6,(b.a.p[2]+b.w.p[2])*.5+5.2);return {p:[-8.65,2.0,z],look:[-10,1.2,-23.8],fov:53};
}
export const RescueCamera:React.FC<{time:number;episode:number}>=({time,episode})=>{const {camera}=useThree();useLayoutEffect(()=>{const c=episode===1?camera1(time):episode===2?camera2(time):camera3(time);camera.position.set(...c.p);camera.lookAt(...c.look);(camera as THREE.PerspectiveCamera).fov=c.fov;camera.far=episode===1?180:260;camera.updateProjectionMatrix();},[camera,time,episode]);return null;};
