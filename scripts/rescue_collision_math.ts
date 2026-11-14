import * as THREE from 'three';
export type Ellipsoid={c:THREE.Vector3;q:THREE.Quaternion;r:THREE.Vector3};
export function ellipsoid(o:THREE.Object3D):Ellipsoid{const c=new THREE.Vector3(),q=new THREE.Quaternion(),r=new THREE.Vector3();o.matrixWorld.decompose(c,q,r);r.set(Math.abs(r.x),Math.abs(r.y),Math.abs(r.z));return {c,q,r};}
export const support=(e:Ellipsoid,d:THREE.Vector3)=>{const n=d.clone().applyQuaternion(e.q.clone().invert()),r=e.r,den=Math.sqrt((r.x*n.x)**2+(r.y*n.y)**2+(r.z*n.z)**2)||1;return new THREE.Vector3(r.x*r.x*n.x,r.y*r.y*n.y,r.z*r.z*n.z).divideScalar(den).applyQuaternion(e.q).add(e.c);};
export function intersects(a:Ellipsoid,b:Ellipsoid):boolean{
 if(a.c.distanceTo(b.c)>Math.max(...a.r.toArray())+Math.max(...b.r.toArray()))return false;
 const direction=a.c.clone().sub(b.c);if(direction.lengthSq()<1e-12)direction.set(1,0,0);
 const mink=(d:THREE.Vector3)=>support(a,d).sub(support(b,d.clone().negate()));
 let simplex=[mink(direction)],d=simplex[0].clone().negate();
 const line=()=>{const A=simplex[0],AB=simplex[1].clone().sub(A),AO=A.clone().negate();if(AB.dot(AO)>0)d=AB.clone().cross(AO).cross(AB);else{simplex=[A];d=AO;}};
 for(let n=0;n<48;n++){
  if(d.lengthSq()<1e-18)return true;
  const p=mink(d);if(p.dot(d)<-1e-10)return false;simplex.unshift(p);
  const A=simplex[0],AO=A.clone().negate();
  if(simplex.length===2){line();continue;}
  if(simplex.length===3){
   const B=simplex[1],C=simplex[2],AB=B.clone().sub(A),AC=C.clone().sub(A),ABC=AB.clone().cross(AC);
   if(ABC.clone().cross(AC).dot(AO)>0){if(AC.dot(AO)>0){simplex=[A,C];d=AC.clone().cross(AO).cross(AC);}else{simplex=[A,B];line();}}
   else if(AB.clone().cross(ABC).dot(AO)>0){simplex=[A,B];line();}
   else if(ABC.dot(AO)>0)d=ABC;else{simplex=[A,C,B];d=ABC.negate();}
   continue;
  }
  const B=simplex[1],C=simplex[2],D=simplex[3];let outside=false;
  for(const [v,w,opposite]of [[B,C,D],[C,D,B],[D,B,C]]){
   const normal=v.clone().sub(A).cross(w.clone().sub(A));if(normal.dot(opposite.clone().sub(A))>0)normal.negate();
   if(normal.dot(AO)>0){simplex=[A,v,w];d=normal;outside=true;break;}
  }
  if(!outside)return true;
 }
 return true; // Conservative: an unresolved grazing case never silently passes.
}
export function distanceToEllipsoid(p:THREE.Vector3,e:Ellipsoid):number{
 const v=p.clone().sub(e.c).applyQuaternion(e.q.clone().invert()),r=e.r,a=v.toArray(),sq=r.toArray().map(x=>x*x);
 const inside=a.reduce((sum,x,i)=>sum+x*x/sq[i],0);if(inside<=1)return -(1-Math.sqrt(inside))*Math.min(...r.toArray());
 let low=0,high=Math.max(...r.toArray())*v.length();
 for(let i=0;i<25;i++){const mid=(low+high)/2,value=a.reduce((sum,x,j)=>sum+sq[j]*x*x/(mid+sq[j])**2,0);if(value>1)low=mid;else high=mid;}
 const lambda=(low+high)/2,q=new THREE.Vector3(...a.map((x,i)=>sq[i]*x/(lambda+sq[i])) as [number,number,number]);return q.distanceTo(v);
}
export function capsuleClearance(a:THREE.Vector3,b:THREE.Vector3,radius:number,e:Ellipsoid){
 let left=0,right=1;
 for(let i=0;i<18;i++){const u=(left*2+right)/3,v=(left+right*2)/3;const du=distanceToEllipsoid(a.clone().lerp(b,u),e),dv=distanceToEllipsoid(a.clone().lerp(b,v),e);if(du<dv)right=v;else left=u;}
 return Math.min(distanceToEllipsoid(a,e),distanceToEllipsoid(b,e),distanceToEllipsoid(a.clone().lerp(b,(left+right)/2),e))-radius;
}
