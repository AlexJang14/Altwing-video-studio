import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Line3D, Ring} from '../geometry';
import {C} from '../config';

export type PenguinAction='idle'|'walk'|'run'|'wave'|'curious'|'frightened'|'project'|'bounce'|'touch'|'sniff'|'excited';
type V3=[number,number,number];
const NAVY='#3c455c', IVORY='#fff6e9', GOLD='#f7b74d', ARMOR='#29445f';
const sphere=new THREE.SphereGeometry(1,40,28);
const smallSphere=new THREE.SphereGeometry(1,24,16);
const plushBump=(()=>{
 const pixels=new Uint8Array(64*64*4);let seed=2002;
 for(let i=0;i<pixels.length;i+=4){seed=(seed*16807)%2147483647;const value=75+Math.floor((seed/2147483647)*105);pixels[i]=pixels[i+1]=pixels[i+2]=value;pixels[i+3]=255;}
 const texture=new THREE.DataTexture(pixels,64,64,THREE.RGBAFormat);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(18,18);texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;return texture;
})();

// One continuous pear-shaped body; the white bib is projected onto its surface.
const surfaceZ=(x:number,y:number)=>{
  const v=(y-.94)/.82, f=1+.07*(1-v), r=Math.sqrt(Math.max(.002,1-v*v));
  const maxX=.67*f*r;
  return .58*f*r*Math.sqrt(Math.max(.002,1-(x/maxX)**2));
};
const makeBody=()=>{
  const g=sphere.clone(),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const y=p.getY(i),f=1+.07*(1-y);p.setXYZ(i,p.getX(i)*.67*f,.94+y*.82,p.getZ(i)*.58*f);}
  g.computeVertexNormals();return g;
};
const makeBib=()=>{
  const s=new THREE.Shape();
  s.moveTo(0,.215);
  s.bezierCurveTo(-.37,.215,-.615,.43,-.604,.83);
  s.bezierCurveTo(-.602,1.08,-.57,1.31,-.48,1.47);
  s.bezierCurveTo(-.40,1.62,-.23,1.665,-.115,1.525);
  s.quadraticCurveTo(0,1.405,.115,1.525);
  s.bezierCurveTo(.23,1.665,.40,1.62,.48,1.47);
  s.bezierCurveTo(.57,1.31,.602,1.08,.604,.83);
  s.bezierCurveTo(.615,.43,.37,.215,0,.215);
  // Split every shared edge together before curving the patch. Adaptive per-face
  // splitting creates T-junctions that open into cracks after projection.
  const flat=new THREE.ShapeGeometry(s,32),p=flat.attributes.position;
  const vertices:number[]=[];for(let i=0;i<p.count;i++)vertices.push(p.getX(i),p.getY(i),0);
  let indices=Array.from(flat.index!.array);
  for(let level=0;level<4;level++){
    const mids=new Map<string,number>(),next:number[]=[];
    const middle=(a:number,b:number)=>{
      const key=a<b?`${a}/${b}`:`${b}/${a}`;
      const found=mids.get(key);if(found!==undefined)return found;
      const n=vertices.length/3;vertices.push((vertices[a*3]+vertices[b*3])/2,(vertices[a*3+1]+vertices[b*3+1])/2,0);mids.set(key,n);return n;
    };
    for(let i=0;i<indices.length;i+=3){const a=indices[i],b=indices[i+1],c=indices[i+2],ab=middle(a,b),bc=middle(b,c),ca=middle(c,a);next.push(a,ab,ca,ab,b,bc,ca,bc,c,ab,bc,ca);}
    indices=next;
  }
  for(let i=0;i<vertices.length;i+=3)vertices[i+2]=surfaceZ(vertices[i],vertices[i+1])+.018;
  const uv:number[]=[];for(let i=0;i<vertices.length;i+=3)uv.push((vertices[i]+.8)/1.6,vertices[i+1]/1.8);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();flat.dispose();return g;
};
const makeWing=()=>{
  const s=new THREE.Shape();s.moveTo(-.055,.035);
  s.bezierCurveTo(.09,.095,.20,-.08,.194,-.27);
  s.bezierCurveTo(.185,-.43,.115,-.565,.055,-.585);
  s.bezierCurveTo(-.017,-.585,-.137,-.36,-.135,-.17);
  s.bezierCurveTo(-.135,-.055,-.105,.015,-.055,.035);
  return new THREE.ExtrudeGeometry(s,{depth:.105,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:24});
};
const bodyGeometry=makeBody(),bibGeometry=makeBib(),wingGeometry=makeWing();

const SoftOrb:React.FC<{p?:V3;s?:V3;color?:string;armor?:boolean;emissive?:string;glow?:number}> = ({p=[0,0,0],s=[1,1,1],color=IVORY,armor=false,emissive='#000000',glow=0})=><mesh geometry={smallSphere} position={p} scale={s} castShadow receiveShadow>
  <meshPhysicalMaterial color={color} roughness={armor?.32:.64} metalness={armor?.28:0} clearcoat={armor?.5:.05} clearcoatRoughness={.3} sheen={armor?0:.15} sheenColor={color} sheenRoughness={.9} emissive={emissive} emissiveIntensity={glow}/>
</mesh>;
export const PenguinRig:React.FC<{time:number;action:PenguinAction;look?:number;children:React.ReactNode}>=({time,action,look=0,children})=>{
  const moving=action==='walk'||action==='run';const phase=time*(action==='run'?14:8.4);
  const bob=moving?Math.abs(Math.sin(phase))*.022:action==='bounce'||action==='excited'?Math.abs(Math.sin(time*5))*.085:Math.sin(time*2.1)*.004;
  const roll=moving?Math.sin(phase)*.055:action==='curious'||action==='sniff'?Math.sin(time*1.8)*.09:Math.sin(time*1.6)*.008;
  return <group position={[0,bob,0]} rotation={[look+(action==='frightened'?-.10:0),0,roll]}>{children}</group>;
};

export const WangdooPenguin:React.FC<{time:number;action?:PenguinAction;look?:number;position?:V3;rotation?:number;scale?:number}> = ({time,action='idle',look=0,position=[0,0,0],rotation=0,scale=1})=>{
  const moving=action==='walk'||action==='run',phase=time*(action==='run'?14:8.4);
  const eyes=useMemo(()=>[-1,1].map(side=>{
    const x=side*.245;
    return [[x-.081,1.365,surfaceZ(x-.081,1.365)+.043],[x-.044,1.416,surfaceZ(x-.044,1.416)+.044],[x,1.433,surfaceZ(x,1.433)+.044],[x+.044,1.416,surfaceZ(x+.044,1.416)+.044],[x+.081,1.365,surfaceZ(x+.081,1.365)+.043]] as V3[];
  }),[]);
  return <group position={position} rotation={[0,rotation,0]} scale={scale}>
    <PenguinRig time={time} action={action} look={look}>
      <group scale={[1,1+Math.sin(time*2.1)*.004,1]}>
        <mesh geometry={bodyGeometry} castShadow><meshPhysicalMaterial color={NAVY} roughness={.73} metalness={0} sheen={.40} sheenColor="#8a8ea4" sheenRoughness={.95} clearcoat={.025} bumpMap={plushBump} bumpScale={.003}/></mesh>
        <mesh geometry={bibGeometry}><meshPhysicalMaterial color={IVORY} roughness={.80} metalness={0} sheen={.40} sheenColor="#fff7e5" sheenRoughness={1} bumpMap={plushBump} bumpScale={.0025}/></mesh>
        {eyes.map((points,i)=><Line3D key={i} points={points} color="#171925" radius={.021} glow={0}/>)}
        {[-1,1].map(side=><SoftOrb key={side} p={[side*.34,1.245,surfaceZ(side*.34,1.245)+.032]} s={[.081,.041,.011]} color="#efb7ad"/>)}
        <group position={[0,1.245,surfaceZ(0,1.245)+.034]} rotation={[-.035,0,0]}>
          <SoftOrb p={[0,.005,.062]} s={[.164,.081,.145]} color="#ffca51"/>
          <SoftOrb p={[0,-.036,.055]} s={[.149,.052,.135]} color="#f2ac36"/>
          <Line3D points={[[-.134,-.021,.117],[0,-.026,.194],[.134,-.021,.117]]} color="#da912d" radius={.005} glow={0}/>
        </group>
        {[-1,1].map((side,i)=>{
          const raised=(action==='wave'&&side===-1)?1.05+Math.sin(time*7)*.16:(action==='touch'&&side===1)?.93*Math.min(1,time/.9):action==='excited'?.55:action==='frightened'?.40:0;
          const swing=(action==='touch'&&side===1)?-.50*Math.min(1,time/.9):moving?Math.sin(phase+i*Math.PI)*.12:0;
          return <React.Fragment key={side}>
            <group position={[side*.645,1.105,-.015]} rotation={[swing,side*.08,side*(.19+raised)]}>
              <group scale={[side,1,1]}>
                <mesh geometry={wingGeometry} castShadow><meshPhysicalMaterial color={GOLD} metalness={.38} roughness={.36} clearcoat={.4} emissive="#ff9f39" emissiveIntensity={.13}/></mesh>
                <mesh geometry={wingGeometry} position={[0,-.005,.027]} scale={[.98,.983,1]} castShadow><meshPhysicalMaterial color={ARMOR} roughness={.3} metalness={.25} clearcoat={.65} clearcoatRoughness={.22}/>
                </mesh>
                <Line3D points={[[.005,-.073,.175],[.077,-.25,.178],[.077,-.405,.17]]} radius={.007} color="#20c7ff" glow={.7}/>
                <Ring p={[.072,-.435,.169]} radius={.032} tube={.007} color="#20c7ff" glow={.7}/>
                <Line3D points={[[-.073,-.11,.169],[-.066,-.25,.169],[-.012,-.40,.169]]} radius={.004} color="#5a7186" glow={0}/>
              </group>
              <SoftOrb p={[0,-.018,.015]} s={[.105,.112,.115]} color="#334054" armor/>
            </group>
            <Line3D points={[[.55,1.18],[.61,1.02],[.65,.84],[.62,.64],[.53,.45],[.42,.31]].map(([x,y])=>[side*x,y,surfaceZ(x,y)+.017] as V3)} radius={.012} color="#ffc370" glow={.45}/>
          </React.Fragment>;
        })}
        <SoftOrb p={[0,.90,-.555]} s={[.315,.355,.098]} color="#283c54" armor/>
        <Ring p={[0,.91,-.657]} radius={.12} tube={.022} color={GOLD} glow={.6}/>
        <SoftOrb p={[0,.91,-.665]} s={[.075,.075,.012]} color="#fff0ac" emissive="#ffc560" glow={1.2}/>
        <Line3D points={[[-.20,1.09,-.607],[-.23,.9,-.625],[-.19,.69,-.608]]} radius={.007} color={C.cyan} glow={1}/>
        <SoftOrb p={[0,.26,-.40]} s={[.16,.10,.24]} color={NAVY}/>
      </group>
      {[-1,1].map((side,i)=>{
        const step=Math.sin(phase+i*Math.PI);
        return <group key={side} position={[side*.265,moving?Math.max(0,step)*.09:0,moving?step*.14:0]} rotation={[moving?step*.15:0,side*-.06,0]}>
          <SoftOrb p={[0,.096,.135]} s={[.225,.10,.265]} color="#ffb52e"/>
          <SoftOrb p={[0,.031,.126]} s={[.226,.029,.266]} color="#3b3d4b"/>
          {[-1,1].map(toe=><Line3D key={toe} points={[[toe*.068,.11,.335],[toe*.074,.076,.371]]} color="#e1a03a" radius={.004} glow={0}/>)}
        </group>;
      })}
    </PenguinRig>
  </group>;
};
