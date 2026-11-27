import *as THREE from'three';import{ramp,between}from'../characters/performance';import{applyPenguin,type Penguin}from'../reset/rig';
export type Emotion='happy'|'curious'|'surprised'|'afraid'|'relieved';
export type Plush=Penguin&{emotion?:Emotion;bodyPitch?:number;flipperPitch?:number;pat?:number};
export function emotionAt(t:number):Emotion{if(t<4)return'afraid';if(t<12)return'curious';if(t<13.72)return'happy';if(t<14.48)return'surprised';if(t<16.2)return'relieved';if(t<19)return'happy';if(t<31)return'curious';if(t<33)return'surprised';if(t<53.2)return'afraid';if(t<55.8)return'relieved';return'afraid';}
export function faceParams(emotion:Emotion){switch(emotion){case'happy':return{open:false,x:1.08,y:1,brow:0};case'curious':return{open:true,x:.94,y:.96,brow:.06};case'surprised':return{open:true,x:1.18,y:1.22,brow:.13};case'afraid':return{open:true,x:1.07,y:1.12,brow:.27};case'relieved':return{open:false,x:1.02,y:.80,brow:0};}}
export function applyPlush(root:THREE.Group,w:Plush,time:number,override?:Emotion){
 if(!root.userData.faceRest){root.userData.faceRest=['L','R'].map(side=>root.getObjectByName('WangEye'+side)!.position.clone());}
 applyPenguin(root,{...w,pose:{...w.pose,worry:0}});root.getObjectByName('WangBody')!.rotation.x=w.bodyPitch??0;
 const e=override??w.emotion??emotionAt(time),f=faceParams(e),blink=[13,17.85,21.3,28.3,36.6,55.5,63.2].reduce((v,a)=>Math.max(v,between(time,a,a+.17,.075)),0);
 for(const[i,side]of ['L','R'].entries()){const eye=root.getObjectByName('WangEye'+side)!;eye.position.copy(root.userData.faceRest[i]);eye.rotation.set(0,0,0);eye.scale.set(1,1,1);const open=root.getObjectByName('WangEyeOpen'+side)!,smile=root.getObjectByName('WangEyeSmile'+side)!,brow=root.getObjectByName('WangBrow'+side)!;
  open.visible=f.open;open.scale.set(f.x,f.y*(1-.96*blink),1);smile.visible=!f.open;smile.scale.set(f.x,f.y,1);brow.visible=f.open;brow.rotation.z=(i===0?1:-1)*f.brow;brow.position.y=.069+(e==='surprised'?.010:0);
 }
 const pat=w.pat??0;root.getObjectByName('WangHead')!.scale.set(1+.012*pat,1-.025*pat,1+.012*pat);root.updateMatrixWorld(true);
}
