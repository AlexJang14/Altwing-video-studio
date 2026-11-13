import React from 'react';
import {create,act} from '@react-three/test-renderer';
import * as THREE from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import fs from 'node:fs/promises';
import {WangdooPenguin,type PenguinAction} from '../src/characters/WangdooPenguin';
import {BlackAstronaut,type AstronautAction} from '../src/characters/BlackAstronaut';

// GLTFExporter uses this browser interface for binary buffers; Node supplies Blob.
class NodeFileReader {
  result:ArrayBuffer|string|null=null;
  onloadend:(()=>void)|null=null;
  readAsArrayBuffer(blob:Blob){blob.arrayBuffer().then(b=>{this.result=b;this.onloadend?.();});}
  readAsDataURL(blob:Blob){blob.arrayBuffer().then(b=>{this.result=`data:${blob.type};base64,${Buffer.from(b).toString('base64')}`;this.onloadend?.();});}
}
Object.assign(globalThis,{FileReader:NodeFileReader,IS_REACT_ACT_ENVIRONMENT:true});
await fs.mkdir('public/models',{recursive:true});
for(const kind of ['wangdoo','astronaut'] as const){
  const component=(time:number,action:string)=>kind==='wangdoo'?<WangdooPenguin time={time} action={action as PenguinAction}/>:<BlackAstronaut time={time} action={action as AstronautAction}/>;
  const renderer=await create(component(0,'idle'));
  const scene=renderer.scene.instance as THREE.Scene;
  let index=0;scene.traverse(obj=>{obj.name=`${kind}_${index++}`;});
  const clips:THREE.AnimationClip[]=[];
  const actions=kind==='wangdoo'?['idle','walk','run','wave','curious','frightened','bounce']:['idle','walk','run','wake','look-down','reach','danger','hesitate'];
  for(const action of actions){
    const duration=action==='walk'?2*Math.PI/(kind==='wangdoo'?10:6):action==='run'?2*Math.PI/(kind==='wangdoo'?17:10):action==='wake'?2.5:Math.PI;
    const frames=32;
    const data=new Map<string,{times:number[];positions:number[];quaternions:number[]}>();
    for(let f=0;f<=frames;f++){
      const time=f/frames*duration;
      await act(async()=>{await renderer.update(component(time,action));});
      scene.traverse(obj=>{if(!obj.isObject3D||obj.type!=='Group')return;const d=data.get(obj.name)??{times:[],positions:[],quaternions:[]};d.times.push(time);d.positions.push(...obj.position.toArray());d.quaternions.push(...obj.quaternion.toArray());data.set(obj.name,d);});
    }
    const tracks:THREE.KeyframeTrack[]=[];
    for(const [name,d] of data){
      if(d.positions.some((v,i)=>Math.abs(v-d.positions[i%3])>1e-5))tracks.push(new THREE.VectorKeyframeTrack(`${name}.position`,d.times,d.positions));
      if(d.quaternions.some((v,i)=>Math.abs(v-d.quaternions[i%4])>1e-5))tracks.push(new THREE.QuaternionKeyframeTrack(`${name}.quaternion`,d.times,d.quaternions));
    }
    clips.push(new THREE.AnimationClip(action,duration,tracks));
  }
  await act(async()=>{await renderer.update(component(0,'idle'));});
  const exporter=new GLTFExporter();
  const result=await exporter.parseAsync(scene,{binary:true,animations:clips,onlyVisible:true});
  await fs.writeFile(`public/models/${kind}.glb`,Buffer.from(result as ArrayBuffer));
  const meshes:THREE.Mesh[]=[];scene.traverse(o=>{if((o as THREE.Mesh).isMesh)meshes.push(o as THREE.Mesh);});
  await fs.writeFile(`public/models/${kind}.json`,JSON.stringify({name:kind,units:'meters',up:'+Y',front:'+Z',meshes:meshes.length,animations:clips.map(c=>({name:c.name,duration:c.duration,tracks:c.tracks.length})),source:`src/characters/${kind==='wangdoo'?'WangdooPenguin':'BlackAstronaut'}.tsx`},null,2)+'\n');
  console.log(`${kind}: ${meshes.length} meshes; ${clips.length} baked animation clips`);
  await renderer.unmount();
}
