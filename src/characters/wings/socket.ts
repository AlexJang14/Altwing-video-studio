import * as THREE from 'three';import {WINGS,type WingId,type WingState}from'./system';
const smooth=(v:number)=>{const x=THREE.MathUtils.clamp(v,0,1);return x*x*(3-2*x);};
/** One pack socket. Plush skin and hanging flippers are never replaced. */
export function updateWingSocket(root:THREE.Group,state:WingState,time:number){
 const body=root.getObjectByName('WangBody')!;let socket=body.getObjectByName('ModularWingSocket')as THREE.Group|undefined;
 if(!socket){socket=new THREE.Group();socket.name='ModularWingSocket';socket.position.set(0,.355,-.255);body.add(socket);}
 const id=state.active??socket.userData.lastWing as WingId|undefined;
 if(!id){socket.visible=false;return;}socket.userData.lastWing=id;
 if(socket.userData.builtWing!==id){socket.clear();socket.userData.builtWing=id;const spec=WINGS[id];for(const side of[-1,1]){
  const hinge=new THREE.Group();hinge.name=side<0?'WingSocketL':'WingSocketR';hinge.position.set(side*.125,0,0);socket.add(hinge);
  const base=new THREE.Mesh(new THREE.SphereGeometry(.035,16,10),new THREE.MeshStandardMaterial({color:'#65747b',roughness:.64,metalness:.25}));hinge.add(base);
  for(let i=0;i<3;i++){const blade=new THREE.Mesh(new THREE.CapsuleGeometry(.021,.25-i*.043,4,10),new THREE.MeshStandardMaterial({color:spec.color,emissive:spec.color,emissiveIntensity:.65,transparent:true,opacity:.86,roughness:.45,metalness:.1}));blade.name='ModularEnergyFeather';blade.position.set(side*(.12+i*.028),.025+i*.063,-.006-i*.018);blade.rotation.z=-side*(.85+i*.23);blade.castShadow=false;hinge.add(blade);}
  const rail=new THREE.Mesh(new THREE.CapsuleGeometry(.014,.27,4,10),new THREE.MeshStandardMaterial({color:'#7d9199',roughness:.65}));rail.position.x=side*.13;rail.rotation.z=side*Math.PI/2;hinge.add(rail);
 }}
 const u=state.active?smooth((time-(state.activatedAt??time))/.65):1-smooth((time-(state.releasedAt??time))/.6);socket.visible=u>.001;
 for(const side of[-1,1]){const hinge=socket.getObjectByName(side<0?'WingSocketL':'WingSocketR')!;hinge.rotation.y=side*(1-u)*1.45;hinge.rotation.z=side*(1-u)*.95;hinge.scale.setScalar(.35+.65*u);}
 socket.traverse(o=>{if(o.name==='ModularEnergyFeather'){const m=(o as THREE.Mesh).material as THREE.MeshStandardMaterial;m.opacity=state.interference?.50+.30*Math.sin(time*73)**2:.86;m.emissiveIntensity=state.interference?.2+.6*Math.sin(time*61)**2:.65;}});
 root.updateMatrixWorld(true);
}
