import React,{useLayoutEffect}from'react';import{useThree}from'@react-three/fiber';import *as THREE from'three';import{blendV,ramp,type V3}from'../characters/performance';import{blocking,storyTime,thief}from'./motion';import{localToWorld}from'../reset/rig';
export type Shot={p:V3;look:V3;fov:number};
export function camera(t:number):Shot{
 const b=blocking(t),a=b.a.p,w=b.w.p;
 if(t<.6)return{p:[-.9,1.7,-.7],look:[.05,1.42,-1.55],fov:32};if(t<1.8)return{p:[1.0,1.75,-1.15],look:[.65,1.10,-2.08],fov:40};
 if(t<4)return{p:[a[0]+.9,1.5,a[2]+2.1],look:[a[0]-.35,1.0,a[2]],fov:60};
 if(t<6.8)return{p:blendV([-3,29,-43],[-2,26,-38],ramp(t,4,6.8)),look:[0,3,-8],fov:58};
 if(t<9)return{p:[-.8,1.6,2.8],look:[0,1.0,-.3],fov:53};if(t<12)return{p:[9.5,5.5,-23.5],look:[0,1.8,-10.2],fov:62};
 if(t<13.72)return{p:[1.15,1.35,2.1],look:[-.15,.82,.15],fov:59};
 if(t<15.8)return{p:[.85,.95,1.65],look:[-.04,.52,.18],fov:55};
 if(t<17.7)return{p:[1.08,1.10,1.48],look:[-.13,.59,.17],fov:53};
 if(t<19)return{p:[.85,.74,1.25],look:[-.28,.50,.25],fov:42};
 if(t<21)return{p:[-1.40,1.5,a[2]-3.0],look:[.12,.94,a[2]+.25],fov:60};
 if(t<23.8)return{p:[-1.40,1.65,-5.3],look:[.15,1.10,-9.0],fov:64};
 if(t<25.5)return{p:[-.60,.76,w[2]+1.80],look:[w[0],.40,w[2]-.06],fov:62};
 if(t<28.5)return{p:[w[0]-1.10,.80,w[2]-1.2],look:[w[0]+.16,.48,w[2]-.12],fov:52};
 if(t<29.6)return{p:[-.85,.36,-9.35],look:[-.34,.09,-10.45],fov:42};
 if(t<30.8)return{p:[1.6,1.65,-9.5],look:[.72,1.18,-10.67],fov:45};
 if(t<32)return{p:[-.32,1.34,-9.55],look:[-.05,1.10,-11.08],fov:48};
 if(t<34.7)return{p:[-.10,1.20,-10.02],look:[-.05,1.10,-11.06],fov:47};
 if(t<37)return{p:[w[0]-.65,.81,w[2]-1.15],look:[w[0],.48,w[2]],fov:45};
 if(t<46)return{p:[a[0]+1.0,1.50,a[2]+2.20],look:[a[0]-.36,.91,a[2]],fov:61};
 if(t<48.5)return{p:[-1.3,1.35,a[2]+2.45],look:[a[0]-.35,.85,a[2]-.3],fov:65};
 if(t<49.15)return{p:[-1.16,1.52,7.7],look:[.62,1.04,5.72],fov:61};
 if(t<50.8)return{p:[-1.25,.94,6.7],look:[-.07,.46,4.96],fov:58};
 if(t<52.6)return{p:[-1.10,.89,3.60],look:[.01,.55,5.1],fov:60};
 if(t<54.8)return{p:[-1.25,.88,a[2]-1.4],look:[-.05,.55,w[2]],fov:60};
 if(t<56)return{p:[-1.3,1.10,8.25],look:[-.04,.56,6.8],fov:59};
 if(t<57.2)return{p:[-.38,.62,5.75],look:[-.22,.39,6.68],fov:44};
 if(t<59.2)return{p:[-.75,.80,5.50],look:[-.19,.54,6.87],fov:42};
 if(t<69.8)return{p:blendV([-.70,.77,3.65],[-.55,.75,3.8],ramp(t,59.2,69.8)),look:[0,.73,7.15],fov:58};
 return{p:[-10,4.4,12],look:[0,1.0,12.8],fov:104};
}
export const FilmCamera:React.FC<{time:number}>=({time})=>{const{camera:c}=useThree();useLayoutEffect(()=>{const k=camera(time);c.position.set(...k.p);c.lookAt(...k.look);(c as THREE.PerspectiveCamera).fov=k.fov;c.near=.045;c.far=600;c.updateProjectionMatrix();},[c,time]);return null;};
export function securityCamera(t:number,portrait=false):Shot{if(portrait)return{p:[1.15,1.55,2.8],look:[.03,1.25,0],fov:33};if(t>=4.3&&t<5.5)return{p:[1.0,1.75,-1.15],look:[.65,1.10,-2.08],fov:45};if(t>=5.5&&t<7.5){const a=thief(t),p=localToWorld(new THREE.Vector3(.27,1.375,-.01),a);return{p:[-.85,2.2,1.8],look:p.toArray()as V3,fov:19};}return{p:[-.85,2.2,2.75],look:[.12,1.15,-1.55],fov:62};}
