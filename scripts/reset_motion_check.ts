import fs from 'node:fs';import * as THREE from 'three';import {GLTFLoader}from 'three/addons/loaders/GLTFLoader.js';import {loadImage}from '@napi-rs/canvas';import {applyPerson,applyPenguin}from '../src/reset/rig';import {blocking}from '../src/reset/motion';import {intersects,capsuleClearance}from './rescue_collision_math';
Object.assign(globalThis,{self:globalThis,createImageBitmap:async(b:Blob)=>loadImage(Buffer.from(await b.arrayBuffer()))});
async function load(file:string){const b=fs.readFileSync(file);return (await new Promise<any>((resolve,reject)=>new GLTFLoader().parse(new Uint8Array(b).buffer,'',resolve,reject))).scene as THREE.Group;}
const a=await load('public/reset/astronaut-tailored.glb'),w=await load('public/reset/wangdoo-sculpted.glb'),errors:any[]=[],contacts:any[]=[],steps:any[]=[],prev=new Map<string,{p:THREE.Vector3;h:number}>();
const find=(root:THREE.Group,name:string)=>{const o=root.getObjectByName(name);if(!o)throw Error('Missing '+name);return o;};
const point=(root:THREE.Group,name:string)=>find(root,name).getWorldPosition(new THREE.Vector3());
function ellipse(root:THREE.Group,name:string){const o=find(root,name)as THREE.Mesh;o.geometry.computeBoundingBox();const box=o.geometry.boundingBox!,c=box.getCenter(new THREE.Vector3()).applyMatrix4(o.matrixWorld),r=box.getSize(new THREE.Vector3()).multiplyScalar(.5),scale=new THREE.Vector3(),q=new THREE.Quaternion();o.matrixWorld.decompose(new THREE.Vector3(),q,scale);r.multiply(scale);return{c,q,r};}
const frames=Number(process.argv[2]??450);let minFloor=Infinity,maxContact=0,maxSlide=0;
for(let f=0;f<frames;f++){
 const t=f/30,b=blocking(t);applyPerson(a,b.a);applyPenguin(w,b.w);
 if(b.contact){const gap=point(a,'AstroGrip'+b.contact.side).distanceTo(new THREE.Vector3(...b.contact.target));maxContact=Math.max(gap,maxContact);if(gap>.003)errors.push({f,type:'contact-gap',gap});contacts.push({f,kind:b.contact.kind,gap});}
 const shells=['WangHeadCloth','WangTorso','WangFlipperL','WangFlipperR'].map(name=>({name,e:ellipse(w,name)}));
 for(const name of ['HelmetShell','SuitTrunk','TailoredGloveL','TailoredGloveR'])for(const p of shells)if(intersects(ellipse(a,name),p.e))errors.push({f,type:'shell-intersection',a:name,w:p.name});
 for(const side of ['L','R']){
  const shoulder=point(a,'AstroUpperArm'+side),elbow=point(a,'AstroForearm'+side),wrist=point(a,'AstroGrip'+side);
  for(const p of shells)for(const [from,to,r]of [[shoulder,elbow,.081],[elbow,wrist,.066]]as const){const clearance=capsuleClearance(from,to,r,p.e);if(clearance<-.003)errors.push({f,type:'arm-clearance',side,w:p.name,clearance});}
 }
 for(const root of [a,w])root.traverse(o=>{if(!(o as THREE.Mesh).isMesh)return;const min=new THREE.Box3().setFromObject(o,true).min.y;minFloor=Math.min(minFloor,min);if(min<-.003)errors.push({f,type:'floor-penetration',name:o.name,min});});
 for(const [root,name,small]of [[a,'AstroSoleL',false],[a,'AstroSoleR',false],[w,'WangSoleL',true],[w,'WangSoleR',true]]as const){const p=point(root,name),h=p.y,old=prev.get(name);if(old&&old.h>.006&&h<.003)steps.push({at:t,small});if(old&&h<.001&&old.h<.001&&[0,3,8,15,17.8,22,24,27,31,34,39,45,52,60.25].every(c=>Math.abs(t-c)>.10)){const slide=Math.hypot(p.x-old.p.x,p.z-old.p.z);maxSlide=Math.max(maxSlide,slide);if(slide>.003)errors.push({f,type:'foot-slide',name,slide});}prev.set(name,{p,h});}
}
fs.writeFileSync('work/reset/motion-validation.json',JSON.stringify({frames,minFloor,maxContact,maxSlide,errors,contacts},null,2));fs.writeFileSync('work/reset/footsteps.json',JSON.stringify(steps,null,2));console.log(JSON.stringify({frames,minFloor,maxContact,maxSlide,errors:errors.length,first:errors.slice(0,12)}));if(errors.length)process.exitCode=1;
