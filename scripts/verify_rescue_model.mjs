import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadImage} from '@napi-rs/canvas';
globalThis.self=globalThis;
globalThis.createImageBitmap=async(blob)=>loadImage(Buffer.from(await blob.arrayBuffer()));
const episode2=process.argv.includes('--episode2');
const results=[];
for(const name of ['wangdoo-plush-mentor']){
  const bytes=await fs.readFile(`public/models/${name}.glb`);
  const gltf=await new Promise((resolve,reject)=>new GLTFLoader().parse(new Uint8Array(bytes).buffer,'',resolve,reject));
  let meshes=0,vertices=0;
  gltf.scene.traverse(o=>{if(o.isMesh){meshes++;vertices+=o.geometry.getAttribute('position').count;}});
  const bounds=new THREE.Box3().setFromObject(gltf.scene);
  const size=bounds.getSize(new THREE.Vector3()).toArray();
  assert(meshes>=15&&vertices>10000,`${name}: no usable model geometry`);
  for(const node of ['plush-head-shell','plush-torso-shell','plush-foot-0','plush-foot-1'])assert(gltf.scene.getObjectByName(node),`Missing canonical node ${node}`);
  assert(size.every(n=>Number.isFinite(n)&&n>0),`${name}: invalid bounds`);
  assert(gltf.animations.length>=6,`${name}: missing animations`);
  for(const clip of gltf.animations){assert(clip.validate(),`${name}/${clip.name}: invalid animation`);assert(clip.tracks.length>0,`${name}/${clip.name}: inert animation`);}
  results.push({name,bytes:bytes.length,meshes,vertices,size,animations:gltf.animations.map(c=>c.name),ok:true});
}
const qa='work/rescue';
await fs.mkdir(qa,{recursive:true});
await fs.writeFile(`${qa}/model-validation.json`,JSON.stringify({ok:true,models:results},null,2)+'\n');
console.log(JSON.stringify(results,null,2));
