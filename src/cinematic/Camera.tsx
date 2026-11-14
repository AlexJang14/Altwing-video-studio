import {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {blendV,ramp,type V3} from '../characters/performance';
import {blocking1,blocking2} from './motion';
export const FilmCamera:React.FC<{episode:number;time:number}>=({episode,time:t})=>{
 const {camera}=useThree();
 useLayoutEffect(()=>{
  const b=episode===1?blocking1(t):blocking2(t);let p:V3=[1.8,2.7,5.1],look:V3=[-.1,1.45,-2.4],fov=43;
  if(episode===1){
   if(t<5){p=[b.a.p[0]-.55,2.65,b.a.p[2]+7.0];look=[b.a.p[0],1.45,b.a.p[2]];fov=50;}
   else if(t<12){p=blendV([2.3,2.9,3.9],[1.9,2.7,3.3],ramp(t,5,12));look=[.65,1.65,-3.9];fov=49;}
   else if(t<17.15){p=blendV([.25,2.7,6.9],[.1,2.5,6.4],ramp(t,12,17.15));look=[-.65,1.35,-2.0];fov=49;}
   else if(t<20){p=[.0,2.35,6.4];look=[-.15,1.3,-2.05];fov=49;}
   else if(t<29){p=blendV([1.1,2.8,6.7],[.7,2.7,6.2],ramp(t,20,29));look=[-.55,1.4,-2.2];fov=49;}
   else if(t<33.0){p=blendV([2.8,3.6,4.5],[2.25,3.4,3.9],ramp(t,29,33));look=[-.15,3.3,-10];fov=48;}
   else if(t<38){p=[.3,2.5,6.0];look=[-.35,1.45,-2.0];fov=49;}
   else if(t<46){p=blendV([1.4,2.5,4.4],[.9,2.2,3.7],ramp(t,38,46));look=[-.05,1.6,-2.4];fov=47;}
   else{p=[.6,3.1,5.5];look=[-.05,2.25,-4.6];fov=47;}
  }else{
   if(t<2.8){p=[1.2,3.0,5.0];look=[-.25,1.5,-2.1];fov=51;}
   else if(t<5){p=blendV([10,5.6,7],[8.5,3.5,5],ramp(t,2.8,4.6));look=[0,2.5,-8];fov=52;}
   else if(t<12){p=blendV([1.6,2.9,8.4],[1.2,2.65,7.6],ramp(t,5,12));look=[.15,1.65,-2.3];fov=49;}
   else if(t<16.3){p=blendV([.45,2.05,7.8],[.2,1.95,7.2],ramp(t,12,16.3));look=[.0,1.25,.2];fov=51;}
   else if(t<20){p=[.0,2.15,7.7];look=[-.15,1.3,.2];fov=51;}
   else if(t<23){p=blendV([4,5.2,10],[3.2,4.8,9.3],ramp(t,20,23));look=[-4.4,1.9,-7.5];fov=49;}
   else if(t<26.5){p=[8,2.1,5.5];look=[4,5.3,-16];fov=49;}
   else if(t<29){p=[1.2,2.6,7];look=[-.15,1.6,-.8];fov=47;}
   else if(t<38){const x=(b.a.p[0]+b.w.p[0])*.5,z=(b.a.p[2]+b.w.p[2])*.5;p=[x-.6,2.8,z-9.2];look=[x,1.5,z+.2];fov=53;}
   else if(t<41){p=[-9.8,3.8,-.9];look=[-7.65,1.55,-8.0];fov=51;}
   else{p=blendV([-10.7,3.3,2.4],[-10.4,3.1,1.9],ramp(t,41,53));look=[-7.5,1.95,-8.0];fov=50;}
  }
  const s=b.shake;p[0]+=Math.sin(t*73)*s;p[1]+=Math.sin(t*87)*s*.6;
  camera.position.set(...p);camera.lookAt(...look);(camera as THREE.PerspectiveCamera).fov=fov;camera.updateProjectionMatrix();
 },[camera,episode,t]);
 return null;
};
