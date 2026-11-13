import React, {useMemo} from 'react';
import * as THREE from 'three';
import {C} from '../config';
const vertex=`varying vec3 vPosition; varying vec3 vNormal; void main(){vPosition=position;vNormal=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragment=`
varying vec3 vPosition; varying vec3 vNormal;
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){return .55*noise(p)+.27*noise(p*2.04)+.13*noise(p*4.12)+.06*noise(p*8.2);}
void main(){vec3 n=normalize(vNormal);float f=fbm(n*8.);float bands=sin(n.y*33.+f*16.)*.5+.5;vec3 col=mix(vec3(.065,.022,.17),vec3(.37,.16,.66),f);col=mix(col,vec3(.69,.48,.91),pow(bands,4.)*.37);float light=max(0.,dot(n,normalize(vec3(-.8,.7,1.))));col*=.17+light*.95;float rim=pow(1.-max(0.,n.z),3.);col+=vec3(.25,.08,.6)*rim*.35;gl_FragColor=vec4(col,1.);}`;
export const PlanetEnvironment: React.FC<{time:number}> = ({time})=>{
  const stars=useMemo(()=>{
    const arr=new Float32Array(1100*3);let seed=78231;
    const random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
    for(let i=0;i<1100;i++){arr[i*3]=(random()-.5)*170;arr[i*3+1]=(random()-.3)*110;arr[i*3+2]=-50-random()*50;}
    return arr;
  },[]);
  return <group>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[stars,3]}/></bufferGeometry><pointsMaterial size={.095} color="#d7e6ff" transparent opacity={.85} sizeAttenuation/></points>
    <group position={[-1.2,5.3,-32]} rotation={[.12,0,-.24]}>
      <mesh rotation={[0,time*.008,0]}><sphereGeometry args={[10.5,64,48]}/><shaderMaterial vertexShader={vertex} fragmentShader={fragment}/></mesh>
      <mesh scale={1.027}><sphereGeometry args={[10.5,48,32]}/><shaderMaterial transparent side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} vertexShader={`varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);v=normalize(-p.xyz);n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*p;}`} fragmentShader={`varying vec3 n;varying vec3 v;void main(){float a=pow(1.-abs(dot(n,v)),3.);gl_FragColor=vec4(.42,.20,1.,a*.7);}`}/></mesh>
      <mesh rotation={[1.12,.10,.16]}><ringGeometry args={[12.6,16.8,96]}/><meshBasicMaterial color="#a48fd2" side={THREE.DoubleSide} transparent opacity={.15} depthWrite={false}/></mesh>
      <mesh rotation={[1.12,.10,.16]}><ringGeometry args={[13.0,13.15,96]}/><meshBasicMaterial color="#d8c7ff" side={THREE.DoubleSide} transparent opacity={.36} depthWrite={false}/></mesh>
    </group>
    <pointLight position={[-4,7,-12]} color={C.violet} intensity={100} distance={40}/>
  </group>;
};
