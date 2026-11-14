import React from 'react';import {create,act} from '@react-three/test-renderer';import * as THREE from 'three';import {GLTFExporter}from 'three/addons/exporters/GLTFExporter.js';import fs from 'node:fs/promises';import {createCanvas,ImageData as NodeImageData}from '@napi-rs/canvas';
import {PlushWangdoo,type PlushPose}from '../src/rescue/Wangdoo';
// GLTFExporter uses this browser interface for binary buffers; Node supplies Blob.
class NodeFileReader {
  result:ArrayBuffer|string|null=null;
  onloadend:(()=>void)|null=null;
  readAsArrayBuffer(blob:Blob){blob.arrayBuffer().then(b=>{this.result=b;this.onloadend?.();});}
  readAsDataURL(blob:Blob){blob.arrayBuffer().then(b=>{this.result=`data:${blob.type};base64,${Buffer.from(b).toString('base64')}`;this.onloadend?.();});}
}
Object.assign(globalThis,{FileReader:NodeFileReader,IS_REACT_ACT_ENVIRONMENT:true});

await fs.mkdir('public/models',{recursive:true});
const poses:Record<string,(t:number)=>PlushPose>={
 idle:t=>({headTilt:Math.sin(t*Math.PI)*.025}),
 guide:t=>({headYaw:Math.sin(t*Math.PI)*.32,headTilt:.04,light:1}),
 scan:t=>({headYaw:Math.sin(t*Math.PI)*.2,headPitch:.13,scan:.7,wingR:.05}),
 uncertain:t=>({headTilt:-.12+Math.sin(t*Math.PI)*.012,headPitch:.18,status:.15}),
 reassured:t=>({headTilt:.07*(1-Math.cos(t*Math.PI))*.5,headYaw:.2,status:1}),
 walk:t=>({bodyRoll:Math.sin(t*Math.PI*4)*.025,bob:Math.abs(Math.sin(t*Math.PI*4))*.008,feet:[-1,1].map((side,i)=>({p:[side*.185,Math.max(0,Math.sin(t*Math.PI*4+i*Math.PI))*.08,.065+Math.cos(t*Math.PI*4+i*Math.PI)*.10],yaw:0}))})
};
const component=(t:number,p:PlushPose)=><PlushWangdoo time={t} pose={p}/>;
const renderer=await create(component(0,{})),scene=renderer.scene.instance as THREE.Scene;let n=0;scene.traverse(o=>{if(!o.name)o.name=`plush_export_${n++}`;});
const clips:THREE.AnimationClip[]=[];
for(const [name,pose]of Object.entries(poses)){
 const data=new Map<string,{times:number[];positions:number[];quaternions:number[];scales:number[]}>();
 for(let f=0;f<=48;f++){const t=f/24;await act(async()=>{await renderer.update(component(t,pose(t)));});scene.traverse(o=>{if(o.type!=='Group')return;const d=data.get(o.name)??{times:[],positions:[],quaternions:[],scales:[]};d.times.push(t);d.positions.push(...o.position.toArray());d.quaternions.push(...o.quaternion.toArray());d.scales.push(...o.scale.toArray());data.set(o.name,d);});}
 const tracks:THREE.KeyframeTrack[]=[];for(const [node,d]of data){if(d.positions.some((v,i)=>Math.abs(v-d.positions[i%3])>1e-5))tracks.push(new THREE.VectorKeyframeTrack(`${node}.position`,d.times,d.positions));if(d.quaternions.some((v,i)=>Math.abs(v-d.quaternions[i%4])>1e-5))tracks.push(new THREE.QuaternionKeyframeTrack(`${node}.quaternion`,d.times,d.quaternions));}
 clips.push(new THREE.AnimationClip(name,2,tracks));
}
await act(async()=>{await renderer.update(component(0,{}));});
const globals=globalThis as unknown as Record<string,unknown>,previousDocument=globals.document,previousImageData=globals.ImageData;
globals.document={createElement:(tag:string)=>{if(tag!=='canvas')throw Error(tag);return createCanvas(1,1);}};globals.ImageData=NodeImageData;
try{const result=await new GLTFExporter().parseAsync(scene,{binary:true,animations:clips,onlyVisible:true});await fs.writeFile('public/models/wangdoo-plush-mentor.glb',Buffer.from(result as ArrayBuffer));}
finally{if(previousDocument===undefined)delete globals.document;else globals.document=previousDocument;if(previousImageData===undefined)delete globals.ImageData;else globals.ImageData=previousImageData;}
await fs.writeFile('public/models/wangdoo-plush-mentor.json',JSON.stringify({name:'Wangdoo plush exploration companion',units:'meters',height:1.13,front:'+Z',up:'+Y',source:'src/rescue/Wangdoo.tsx',reference:'Textual gray/white plush reconstruction. The new actual plush photograph mentioned in the brief was not attached; no claim of matching an unseen photo.',animations:clips.map(c=>({name:c.name,duration:c.duration,tracks:c.tracks.length})),note:'Film locomotion uses world-stamped feet and IK. GLB walk is an optional in-place cycle; emissive lights are controlled in source. glTF omits bumpMap, but includes the fabric color textures and roughness/sheen.'},null,2)+'\n');
await renderer.unmount();console.log('Wangdoo plush GLB exported; six reusable mentor cycles.');
