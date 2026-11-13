import React from 'react';
import {create,act} from '@react-three/test-renderer';
import * as THREE from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import fs from 'node:fs/promises';
import {createCanvas,ImageData as NodeImageData} from '@napi-rs/canvas';
import {WangdooPenguin,type PenguinAction} from '../src/characters/WangdooPenguin';
import {BlackAstronaut,type AstronautAction} from '../src/characters/BlackAstronaut';
import {WangdooPenguin as WangdooSoft,type PenguinAction as SoftAction} from '../src/characters/WangdooSoft';

// GLTFExporter uses this browser interface for binary buffers; Node supplies Blob.
class NodeFileReader {
  result:ArrayBuffer|string|null=null;
  onloadend:(()=>void)|null=null;
  readAsArrayBuffer(blob:Blob){blob.arrayBuffer().then(b=>{this.result=b;this.onloadend?.();});}
  readAsDataURL(blob:Blob){blob.arrayBuffer().then(b=>{this.result=`data:${blob.type};base64,${Buffer.from(b).toString('base64')}`;this.onloadend?.();});}
}
Object.assign(globalThis,{FileReader:NodeFileReader,IS_REACT_ACT_ENVIRONMENT:true});
await fs.mkdir('public/models',{recursive:true});
const soft=process.argv.includes('--episode2');
for(const kind of (soft?['wangdoo']:['wangdoo','astronaut']) as Array<'wangdoo'|'astronaut'>){
  const assetName=soft?'wangdoo-soft':kind;
  const component=(time:number,action:string)=>kind==='wangdoo'?(soft?<WangdooSoft time={time} action={action as SoftAction}/>:<WangdooPenguin time={time} action={action as PenguinAction}/>):<BlackAstronaut time={time} action={action as AstronautAction}/>;
  const renderer=await create(component(0,'idle'));
  const scene=renderer.scene.instance as THREE.Scene;
  let index=0;scene.traverse(obj=>{obj.name=`${assetName}_${index++}`;});
  const clips:THREE.AnimationClip[]=[];
  const actions=kind==='wangdoo'?(soft?['idle','walk','run','wave','curious','frightened','bounce','touch','sniff','excited']:['idle','walk','run','wave','curious','frightened','bounce']):['idle','walk','run','wake','look-down','reach','danger','hesitate'];
  for(const action of actions){
    const duration=action==='walk'?2*Math.PI/(kind==='wangdoo'?(soft?8.4:10):6):action==='run'?2*Math.PI/(kind==='wangdoo'?(soft?14:17):10):action==='wake'?2.5:Math.PI;
    const frames=32;
    const data=new Map<string,{times:number[];positions:number[];quaternions:number[];scales:number[]}>();
    for(let f=0;f<=frames;f++){
      const time=f/frames*duration;
      await act(async()=>{await renderer.update(component(time,action));});
      scene.traverse(obj=>{if(!obj.isObject3D||obj.type!=='Group')return;const d=data.get(obj.name)??{times:[],positions:[],quaternions:[],scales:[]};d.times.push(time);d.positions.push(...obj.position.toArray());d.quaternions.push(...obj.quaternion.toArray());d.scales.push(...obj.scale.toArray());data.set(obj.name,d);});
    }
    const tracks:THREE.KeyframeTrack[]=[];
    for(const [name,d] of data){
      if(d.positions.some((v,i)=>Math.abs(v-d.positions[i%3])>1e-5))tracks.push(new THREE.VectorKeyframeTrack(`${name}.position`,d.times,d.positions));
      if(d.quaternions.some((v,i)=>Math.abs(v-d.quaternions[i%4])>1e-5))tracks.push(new THREE.QuaternionKeyframeTrack(`${name}.quaternion`,d.times,d.quaternions));
      if(d.scales.some((v,i)=>Math.abs(v-d.scales[i%3])>1e-5))tracks.push(new THREE.VectorKeyframeTrack(`${name}.scale`,d.times,d.scales));
    }
    clips.push(new THREE.AnimationClip(action,duration,tracks));
  }
  await act(async()=>{await renderer.update(component(0,'idle'));});
  const exporter=new GLTFExporter();
  // Three's texture encoder expects a canvas. Supply the native Node canvas
  // only while exporting, so the headless rig renderer keeps its own context.
  const globals=globalThis as unknown as Record<string,unknown>;
  const previousDocument=globals.document,previousImageData=globals.ImageData;
  globals.document={createElement:(tag:string)=>{if(tag!=='canvas')throw new Error(`Unsupported export element ${tag}`);return createCanvas(1,1);}};
  globals.ImageData=NodeImageData;
  let result:ArrayBuffer|object;
  try{result=await exporter.parseAsync(scene,{binary:true,animations:clips,onlyVisible:true});}
  finally{if(previousDocument===undefined)delete globals.document;else globals.document=previousDocument;if(previousImageData===undefined)delete globals.ImageData;else globals.ImageData=previousImageData;}
  await fs.writeFile(`public/models/${assetName}.glb`,Buffer.from(result as ArrayBuffer));
  const meshes:THREE.Mesh[]=[];scene.traverse(o=>{if((o as THREE.Mesh).isMesh)meshes.push(o as THREE.Mesh);});
  await fs.writeFile(`public/models/${assetName}.json`,JSON.stringify({name:assetName,units:'meters',up:'+Y',front:'+Z',meshes:meshes.length,animations:clips.map(c=>({name:c.name,duration:c.duration,tracks:c.tracks.length})),source:`src/characters/${kind==='wangdoo'?(soft?'WangdooSoft':'WangdooPenguin'):'BlackAstronaut'}.tsx`},null,2)+'\n');
  console.log(`${kind}: ${meshes.length} meshes; ${clips.length} baked animation clips`);
  await renderer.unmount();
}
