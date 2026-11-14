import React from 'react';
import * as THREE from 'three';
import {Line3D,Ring,Box} from '../geometry';
import {type V3,lerp} from '../characters/performance';
export const WANG_SCALE=.8;
export type PlushPose={headYaw?:number;headPitch?:number;headTilt?:number;bodyRoll?:number;lean?:number;wingL?:number;wingR?:number;rootRoll?:number;rootLift?:number;bob?:number;status?:number;scan?:number;light?:number;sealed?:boolean;feet?:Array<{p:V3;yaw:number}>};
const GRAY='#96979d',WHITE='#f3f2eb',YELLOW='#e6d480';
const unit=new THREE.SphereGeometry(1,40,28);
const fabric=(()=>{let s=4132;const data=new Uint8Array(96*96*4);for(let i=0;i<data.length;i+=4){s=s*16807%2147483647;const v=90+s%80;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;}const t=new THREE.DataTexture(data,96,96,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(11,11);t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.needsUpdate=true;return t;})();
function clothMap(head:boolean){
 const w=1024,h=512,data=new Uint8Array(w*h*4);
 for(let row=0;row<h;row++)for(let column=0;column<w;column++){
  const phi=column/(w-1)*Math.PI*2,theta=(1-row/(h-1))*Math.PI;
  const x=-Math.cos(phi)*Math.sin(theta),y=Math.cos(theta),z=Math.sin(phi)*Math.sin(theta);
  const shape=head?Math.min(((x+.39)/.57)**2+((y+.04)/.77)**2,((x-.39)/.57)**2+((y+.04)/.77)**2):(x/.88)**2+((y+.03)/.95)**2;
  const mask=THREE.MathUtils.smoothstep(z,.16,.42)*(1-THREE.MathUtils.smoothstep(shape,.94,1.03));
  const i=(row*w+column)*4;data[i]=lerp(150,243,mask);data[i+1]=lerp(151,242,mask);data[i+2]=lerp(157,235,mask);data[i+3]=255;
 }
 const map=new THREE.DataTexture(data,w,h,THREE.RGBAFormat);map.colorSpace=THREE.SRGBColorSpace;map.minFilter=THREE.LinearMipmapLinearFilter;map.magFilter=THREE.LinearFilter;map.generateMipmaps=true;map.needsUpdate=true;return map;
}
const headMap=clothMap(true),bodyMap=clothMap(false);
const PlushMaterial:React.FC<{color?:string;map?:THREE.Texture}>=({color=WHITE,map})=><meshPhysicalMaterial color={map?'#ffffff':color} map={map} metalness={0} roughness={.91} sheen={.52} sheenRoughness={.93} sheenColor="#dad8d6" bumpMap={fabric} bumpScale={.0017}/>;
const Soft:React.FC<{p?:V3;s:V3;color?:string;name?:string}>=({p=[0,0,0],s,color=GRAY,name})=><mesh name={name} position={p} scale={s} geometry={unit} castShadow><PlushMaterial color={color}/></mesh>;
export const crescentGeometry=(()=>{const s=new THREE.Shape();s.absarc(0,0,.074,.45,Math.PI*2-.45,false);s.bezierCurveTo(.005,-.06,-.025,-.018,.012,.045);s.closePath();return new THREE.ShapeGeometry(s,24);})();
export const Crescent:React.FC<{position?:V3;rotation?:V3;scale?:number}>=({position=[0,0,0],rotation=[0,0,0],scale=1})=><mesh geometry={crescentGeometry} position={position} rotation={rotation} scale={scale}><meshStandardMaterial color="#ecebdc" roughness={.8} side={THREE.DoubleSide}/></mesh>;
export function plushPoint(local:V3,position:V3,yaw:number,pose:PlushPose):V3{
 const v=new THREE.Vector3(...local).applyEuler(new THREE.Euler(pose.lean??0,0,pose.bodyRoll??0)).add(new THREE.Vector3(0,pose.bob??0,0)).sub(new THREE.Vector3(0,.55,0)).applyEuler(new THREE.Euler(0,0,pose.rootRoll??0)).add(new THREE.Vector3(0,.55+(pose.rootLift??0),0)).multiplyScalar(WANG_SCALE).applyAxisAngle(new THREE.Vector3(0,1,0),yaw).add(new THREE.Vector3(...position));return v.toArray() as V3;
}
export const backpackPort=(p:V3,yaw:number,pose:PlushPose):V3=>plushPoint([-.21,.66,-.36],p,yaw,pose);
export const flipperGrip=(p:V3,yaw:number,pose:PlushPose):V3=>{
 const local=new THREE.Vector3(0,-.29,.035).applyEuler(new THREE.Euler(0,0,.10+(pose.wingR??0))).add(new THREE.Vector3(.365,.72,0));
 return plushPoint(local.toArray() as V3,p,yaw,pose);
};
export const PlushWangdoo:React.FC<{time:number;position?:V3;yaw?:number;pose?:PlushPose}>=({time,position=[0,0,0],yaw=0,pose={}})=>{
 const status=pose.status??1,rootRoll=pose.rootRoll??0;
 return <group name="rescue-wangdoo" position={position} rotation={[0,yaw,0]} scale={WANG_SCALE}>
  <group position={[0,.55+(pose.rootLift??0),0]} rotation={[0,0,rootRoll]}><group position={[0,-.55,0]}>
   <group position={[0,pose.bob??0,0]} rotation={[pose.lean??0,0,pose.bodyRoll??0]}>
    <mesh geometry={unit} position={[0,.49,0]} scale={[.365,.43,.305]} castShadow><PlushMaterial map={bodyMap}/></mesh>
    <group name="wang-head" position={[0,1.04,.012]} rotation={[pose.headPitch??0,pose.headYaw??0,pose.headTilt??0]}>
     <mesh geometry={unit} scale={[.402,.363,.334]} castShadow><PlushMaterial map={headMap}/></mesh>
     {[-1,1].map(side=><React.Fragment key={side}>
      <Line3D points={Array.from({length:9},(_,i)=>{const a=Math.PI*(.17+i/8*.66);return [side*.162+.049*Math.cos(a),.035+.042*Math.sin(a),.328] as V3;})} color="#1b1d21" radius={.013} glow={0}/>
      <Soft p={[side*.23,-.075,.301]} s={[.05,.026,.012]} color="#e4ceca"/>
     </React.Fragment>)}
     <Soft name="wang-beak" p={[0,-.074,.338]} s={[.095,.043,.086]} color={YELLOW}/>
     <Line3D points={[[-.073,-.085,.384],[0,-.09,.416],[.073,-.085,.384]]} color="#c4b56d" radius={.003} glow={0}/>
    </group>
    {[-1,1].map(side=><group key={side} name={`wang-wing-${side}`} position={[side*.365,.72,0]} rotation={[0,0,side*(.10+(side===-1?pose.wingL??0:pose.wingR??0))]}>
     <Soft p={[0,-.19,0]} s={[.075,.255,.10]} color={GRAY}/>
     <object3D name={`plush-grip-${side===-1?'left':'right'}`} position={[0,-.29,.035]}/>
    </group>)}
    <group name="wang-backpack" position={[0,.57,-.296]}>
     <Soft s={[.206,.218,.115]} color="#626e78"/>
     <Box p={[0,0,-.094]} s={[.27,.29,.06]} color="#586775" metal={.08} rough={.85}/>
     <Crescent position={[0,.045,-.129]} rotation={[0,Math.PI,0]}/>
     <mesh position={[.105,-.075,-.137]}><sphereGeometry args={[.014,12,8]}/><meshStandardMaterial color={status>.1?'#8bdfdb':'#586570'} emissive="#57b4bb" emissiveIntensity={status*.8}/></mesh>
     <object3D name="plush-equipment-port" position={[-.21,.09,-.064]}/>
     <Ring p={[-.21,.09,-.064]} r={[0,Math.PI/2,0]} radius={.032} tube={.007} color="#94a1a4" glow={0}/>
     <group position={[.21,.10,-.02]}><Soft s={[.045,.06,.05]} color="#586b78"/><mesh position={[.025,.01,.035]}><sphereGeometry args={[.018,14,10]}/><meshStandardMaterial color="#82d8df" emissive="#82d8df" emissiveIntensity={(pose.scan??0)*.7}/></mesh></group>
     {pose.sealed&&<mesh position={[0,0,-.022]} scale={[.24,.25,.14]} geometry={unit}><meshPhysicalMaterial color="#dceef2" transparent opacity={.10} roughness={.13} metalness={.12} depthWrite={false}/></mesh>}
    </group>
    <group position={[.21,.61,.245]}>
     <mesh><cylinderGeometry args={[.024,.024,.055,16]}/><meshStandardMaterial color="#748187" roughness={.65}/></mesh>
     {(pose.light??0)>.01&&<><pointLight color="#fff0d4" intensity={(pose.light??0)*1.6} distance={4}/><mesh position={[0,0,.03]}><sphereGeometry args={[.018,12,8]}/><meshBasicMaterial color="#ffe3b6"/></mesh></>}
    </group>
   </group>
   {[-1,1].map((side,i)=>{const foot=pose.feet?.[i];return <group key={side} name={`plush-foot-${i}`} position={foot?.p??[side*.185,0,.065]} rotation={[0,foot?.yaw??0,0]}>
    <Soft p={[0,.062,.055]} s={[.136,.062,.18]} color={YELLOW}/><object3D name={`plush-sole-${i}`} position={[0,0,.055]}/>
   </group>;})}
  </group></group>
 </group>;
};
