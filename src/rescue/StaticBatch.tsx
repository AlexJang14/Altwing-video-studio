import React,{useLayoutEffect,useRef} from 'react';
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
/** Bake immutable scenery into a few material batches without changing its
 * geometry or shading. Animated props, lights and shader skies stay separate. */
export const StaticBatch:React.FC<{children:React.ReactNode;cacheKey:string}>=({children,cacheKey})=>{
 const source=useRef<THREE.Group>(null),output=useRef<THREE.Group>(null);
 useLayoutEffect(()=>{
  if(!source.current||!output.current)return;
  const root=source.current,baked=output.current;root.updateWorldMatrix(true,true);
  const inverse=root.matrixWorld.clone().invert(),groups=new Map<string,{material:THREE.Material;geometries:THREE.BufferGeometry[]}>(),hidden:THREE.Mesh[]=[];
  root.traverse(o=>{
   if(!(o instanceof THREE.Mesh)||o instanceof THREE.InstancedMesh||Array.isArray(o.material)||!(o.material instanceof THREE.MeshStandardMaterial))return;
   const m=o.material;if(m.transparent||m.map||m.bumpMap||m.vertexColors)return;
   const key=[m.type,m.color.getHexString(),m.roughness,m.metalness,m.emissive.getHexString(),m.emissiveIntensity,m.side,m.flatShading].join('/');
   const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();
   for(const name of Object.keys(g.attributes))if(!['position','normal','uv'].includes(name))g.deleteAttribute(name);
   g.applyMatrix4(inverse.clone().multiply(o.matrixWorld));
   const bucket=groups.get(key)??{material:m.clone(),geometries:[]};bucket.geometries.push(g);groups.set(key,bucket);o.visible=false;hidden.push(o);
  });
  for(const bucket of groups.values()){
   const geometry=mergeGeometries(bucket.geometries,false);for(const g of bucket.geometries)g.dispose();
   if(!geometry){bucket.material.dispose();continue;}
   const mesh=new THREE.Mesh(geometry,bucket.material);mesh.receiveShadow=true;mesh.castShadow=false;mesh.name='immutable-scenery-batch';baked.add(mesh);
  }
  return ()=>{for(const mesh of hidden)mesh.visible=true;for(const child of [...baked.children]){const m=child as THREE.Mesh;m.geometry.dispose();(m.material as THREE.Material).dispose();baked.remove(child);}};
 },[cacheKey]);
 return <group><group ref={source}>{children}</group><group ref={output}/></group>;
};
