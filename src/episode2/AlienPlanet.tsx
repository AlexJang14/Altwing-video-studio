import React,{useLayoutEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {Line3D,Orb,Ring,Box} from '../geometry';
import {ease} from '../config';
const leaf=(()=>{
 const g=new THREE.PlaneGeometry(1,1,8,18),p=g.attributes.position;
 for(let i=0;i<p.count;i++){const t=p.getY(i)+.5;const x=p.getX(i)*Math.sin(Math.PI*t)*.52;p.setXYZ(i,x,t*.95,t*t*.52);}
 g.computeVertexNormals();return g;
})();
const flowerStem=new THREE.CylinderGeometry(.035,.065,1,8);
const flowerCap=new THREE.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI*.64);
const rockGeo=new THREE.DodecahedronGeometry(1,1);

function randomFamily(seedStart:number){let seed=seedStart;return ()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};}
const AlienGroves:React.FC<{clearing?:boolean;rescue?:boolean}>=({clearing=false,rescue=false})=>{
 const stems=useRef<THREE.InstancedMesh>(null),caps=useRef<THREE.InstancedMesh>(null),leaves=useRef<THREE.InstancedMesh>(null),rocks=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{
  const rnd=randomFamily(80911),m=new THREE.Object3D();
  for(let i=0;i<54;i++){
   const side=i%2?1:-1;let x=side*(3.1+rnd()*18);const h=.65+rnd()*2.6;let z=-32+rnd()*40;
   if(clearing&&x>-12&&x<2&&z>-14&&z<7)x-=14;
   if(rescue&&x>-18&&x<12&&z>-24&&z<10)x=side*(24+rnd()*15);
   if(Math.hypot(x+7.4,z+11)<4.1)z=-28-rnd()*6;
   m.position.set(x,h*.5,z);m.rotation.set(0,rnd()*6.28,(rnd()-.5)*.13);m.scale.set(.8,h,.8);m.updateMatrix();stems.current!.setMatrixAt(i,m.matrix);
   m.position.set(x,h,z);m.rotation.set(0,rnd()*6.28,0);m.scale.set(h*.44,h*.15,h*.44);m.updateMatrix();caps.current!.setMatrixAt(i,m.matrix);
  }
  for(let i=0;i<90;i++){
   const side=i%2?1:-1;let x=side*(2.2+rnd()*15),z=-22+rnd()*32;if(clearing&&x>-12&&x<2&&z>-14&&z<7)x-=14;if(rescue&&x>-18&&x<12&&z>-24&&z<10)x=side*(22+rnd()*15);m.position.set(x,.015,z);m.rotation.set(.05+rnd()*.35,rnd()*6.28,side*(.2+rnd()*.5));const s=.5+rnd()*1.7;m.scale.setScalar(s);m.updateMatrix();leaves.current!.setMatrixAt(i,m.matrix);
  }
  for(let i=0;i<25;i++){
   const x=(i%2?1:-1)*(5+rnd()*40),z=-25-rnd()*40,h=2+rnd()*12;
   m.position.set(x,h*.3,z);m.rotation.set(rnd(),rnd()*6.28,rnd()*.25);m.scale.set(2+rnd()*5,h,2+rnd()*3);m.updateMatrix();rocks.current!.setMatrixAt(i,m.matrix);
  }
  for(const ref of [stems,caps,leaves,rocks])ref.current!.instanceMatrix.needsUpdate=true;
 },[clearing,rescue]);
 return <>
  <instancedMesh ref={stems} args={[flowerStem,undefined,54]}><meshStandardMaterial color="#37616c" roughness={.9} emissive="#24676d" emissiveIntensity={.08}/></instancedMesh>
  <instancedMesh ref={caps} args={[flowerCap,undefined,54]}><meshStandardMaterial color="#8cd3cf" roughness={.64} emissive="#49a9bd" emissiveIntensity={.32} side={THREE.DoubleSide}/></instancedMesh>
  <instancedMesh ref={leaves} args={[leaf,undefined,90]}><meshStandardMaterial color="#376778" roughness={.85} side={THREE.DoubleSide} emissive="#247a81" emissiveIntensity={.12}/></instancedMesh>
  <instancedMesh ref={rocks} args={[rockGeo,undefined,25]}><meshStandardMaterial color="#61536f" roughness={1}/></instancedMesh>
 </>;
};
const Ground:React.FC<{clearing?:boolean}>=({clearing=false})=>{
 const geometry=useMemo(()=>{
  const g=new THREE.PlaneGeometry(140,140,72,72);g.rotateX(-Math.PI/2);const p=g.attributes.position,colors=[];const color=new THREE.Color();
  for(let i=0;i<p.count;i++){
   const x=p.getX(i),z=p.getZ(i),mask=Math.min(1,Math.max(0,(Math.abs(x)-2.4)/6));
   const flat=clearing&&x>-12&&x<3&&z>-14&&z<7?0:mask;
   p.setY(i,(Math.sin(x*.18+z*.16)*.55+Math.cos(z*.31)*.27)*flat);
   const n=Math.sin(x*.7+z*.3)*Math.cos(z*.6)*.5+.5;color.set('#574b66').lerp(new THREE.Color('#786581'),n*.38);colors.push(color.r,color.g,color.b);
  }
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;
 },[clearing]);
 return <mesh geometry={geometry} receiveShadow><meshStandardMaterial vertexColors roughness={.97} metalness={0}/></mesh>;
};
const Sky:React.FC<{time:number;distant?:boolean}>=({time,distant=false})=>{
 const positions=useMemo(()=>{const r=randomFamily(20714),a=new Float32Array(480*3);for(let i=0;i<480;i++){a[i*3]=(r()-.5)*170;a[i*3+1]=15+r()*70;a[i*3+2]=-60-r()*35;}return a;},[]);
 return <>
  <mesh><sphereGeometry args={[distant?200:115,32,16]}/><shaderMaterial side={THREE.BackSide} depthWrite={false} vertexShader="varying vec3 v;void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}" fragmentShader="varying vec3 v;void main(){float h=normalize(v).y;vec3 low=vec3(.43,.30,.48);vec3 high=vec3(.095,.075,.20);vec3 c=mix(low,high,smoothstep(-.1,.8,h));gl_FragColor=vec4(c,1.);}"/></mesh>
  <points rotation={[0,time*.0008,0]}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial size={.09} color="#e6dcff" transparent opacity={.72}/></points>
  <group scale={distant?2:1}><group position={[-19,24,-70]} rotation={[.22,.1,-.30]}>
   <mesh><sphereGeometry args={[12,48,32]}/><shaderMaterial vertexShader="varying vec3 n;void main(){n=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}" fragmentShader="varying vec3 n;float h(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}void main(){vec3 v=normalize(n);float f=.6*noise(v*6.)+.27*noise(v*13.)+.13*noise(v*27.);float bands=sin(v.y*24.+f*8.)*.5+.5;vec3 c=mix(vec3(.19,.12,.30),vec3(.66,.49,.77),f);c=mix(c,vec3(.78,.65,.88),pow(bands,5.)*.3);float light=max(0.,dot(v,normalize(vec3(-.9,.6,.5))));c*=.12+light*.95;gl_FragColor=vec4(c,1.);}"/></mesh>
   <mesh rotation={[1.13,.08,.15]}><ringGeometry args={[14.5,19,80]}/><meshBasicMaterial color="#d8caee" transparent opacity={.30} side={THREE.DoubleSide} depthWrite={false}/></mesh>
   <mesh rotation={[1.13,.08,.15]}><ringGeometry args={[16.1,16.35,80]}/><meshBasicMaterial color="#eee1ff" transparent opacity={.5} side={THREE.DoubleSide} depthWrite={false}/></mesh>
  </group></group>
 </>;
};
export const AncientGate:React.FC<{time:number}>=({time})=>{
 const awake=ease((time-16.1)/2.2),eyes=ease((time-19.0)/.8);
 const runeColor=awake>.05?'#64dedc':'#374352';
 return <group position={[-7.4,0,-11]} scale={1.35}>
  {[-1,1].map(side=><group key={side}>
   <Box p={[side*1.7,1.58,0]} s={[.51,3.16,.72]} r={[0,0,side*.035]} color="#3b3650" rough={.94} metal={0}/>
   <Line3D points={[[side*1.41,.35,.381],[side*1.41,2.8,.381],[side*1.39,3.12,.381]]} color={runeColor} radius={.024} glow={awake*2}/>
   {[.65,1.2,1.75,2.3,2.85].map((y,i)=><Box key={y} p={[side*1.70,y,.375]} s={[.18,.075,.018]} color={awake>.1?'#57dace':'#455d65'} emissive="#57dace" glow={awake*(.6+i*.13)}/>)}
  </group>)}
  <mesh position={[0,3.1,0]}><torusGeometry args={[1.7,.28,12,48,Math.PI]}/><meshStandardMaterial color="#49405b" roughness={.94}/></mesh>
  <mesh position={[0,3.1,.39]}><torusGeometry args={[1.43,.026,6,48,Math.PI]}/><meshStandardMaterial color={runeColor} emissive="#5fe4de" emissiveIntensity={awake*2}/></mesh>
  <mesh position={[0,2.05,-.07]}><planeGeometry args={[2.8,3.8]}/><meshBasicMaterial color="#244e63" transparent opacity={awake*.22} depthWrite={false} side={THREE.DoubleSide}/></mesh>
  <group visible={eyes>.01}>{[-1,1].map(side=><Orb key={side} p={[side*.39,2.85,-1.2]} s={[.085,.075,.04]} color="#99f8ef" emissive="#7ef3e5" glow={eyes*2.3}/>)}</group>
  <pointLight position={[0,2,.8]} color="#5ae1d9" intensity={awake*7} distance={9}/>
 </group>;
};
export const AlienPlanet:React.FC<{time:number;gate?:boolean;signal?:boolean;clearing?:boolean}>=({time,gate=true,signal=true,clearing=false})=><>
 <Sky time={time}/><Ground clearing={clearing}/><AlienGroves clearing={clearing}/>
 {signal&&<Line3D points={[[.6,.015,.9],[-1,.015,-3],[-4,.015,-7],[-7.4,.015,-9.3]]} color="#78c9d0" radius={.021} glow={.02+ease((time-15.7)/1.8)*.7}/>}
 {gate&&<AncientGate time={time}/>}
</>;
export {Sky as AlienSky,AlienGroves as AlienVegetation};
