import React from 'react';
import {AbsoluteFill,staticFile} from 'remotion';
import {ease} from '../config';
import {EPISODE2} from './config';
const mono:React.CSSProperties={fontFamily:'Studio Mono,monospace',letterSpacing:3,fontSize:20};
export const Episode2Fonts=()=> <style>{`@font-face{font-family:'Studio Sans';src:url('${staticFile('fonts/DejaVuSans.ttf')}');font-weight:400}@font-face{font-family:'Studio Sans';src:url('${staticFile('fonts/DejaVuSans-Bold.ttf')}');font-weight:700}@font-face{font-family:'Studio Mono';src:url('${staticFile('fonts/DejaVuSansMono.ttf')}')}`}</style>;
export const Episode2Overlays:React.FC<{scene:number;t:number;frame:number}>=({scene,t,frame})=>{
 const s=EPISODE2.scenes[scene],final=scene===5;
 return <AbsoluteFill style={{pointerEvents:'none',fontFamily:'Studio Sans,sans-serif',color:'#fff8f0'}}>
  <AbsoluteFill style={{background:final?'linear-gradient(180deg,#11102255 0%,#111022da 22%,#111022d0 47%,#11102222 70%,#11102266 100%)':'linear-gradient(180deg,#17142688 0%,transparent 32%,transparent 60%,#17142699 95%)'}}/>
  <div style={{position:'absolute',top:76,left:72,right:72,display:'flex',justifyContent:'space-between',alignItems:'center',...mono,fontSize:18,color:'#eadff2'}}><span style={{letterSpacing:5}}>ALTWING <span style={{color:'#8fe6df'}}>↗</span></span><span>THE LAST WING / 02</span></div>
  {!final&&<>
   <div style={{position:'absolute',top:210,left:74,right:74,opacity:ease(t/.35)}}>
    {scene===0&&<><div style={{...mono,color:'#d2b9f7'}}>YOU CHOSE B.</div><div style={{fontSize:78,fontWeight:700,lineHeight:1.05,letterSpacing:-2,marginTop:22}}>THE UNKNOWN<br/>PLANET.</div></>}
    {scene===1&&<><div style={{...mono,color:'#ffe0b2'}}>LANDING COMPLETE</div><div style={{fontSize:67,fontWeight:700,lineHeight:1.08,marginTop:21,letterSpacing:-2}}>FIRST STEPS.</div></>}
    {scene===2&&<><div style={{...mono,color:'#b5f1e4'}}>WANGDOO / EXPLORER MODE</div><div style={{fontSize:46,fontWeight:700,marginTop:17,letterSpacing:2}}>A LITTLE HELLO.</div></>}
    {scene===3&&<div style={{...mono,color:'#baf6e5'}}>THE WORLD RESPONDS.</div>}
    {scene===4&&<><div style={{...mono,color:'#b8f3ed'}}>UNKNOWN SIGNAL / ANSWER RECEIVED</div><div style={{fontSize:70,fontWeight:700,lineHeight:1.06,letterSpacing:-2,marginTop:23}}>IT WASN’T<br/>AN ECHO.</div></>}
   </div>
   {t>(scene===3?1.7:.65)&&<div style={{position:'absolute',left:82,right:82,bottom:215,textAlign:'center',opacity:ease((t-(scene===3?1.7:.65))/.25)}}>
    {s.speaker==='wangdoo'&&<div style={{...mono,color:'#ffd18a',fontSize:18,marginBottom:17}}>WANGDOO</div>}
    <div style={{fontSize:43,fontWeight:700,lineHeight:1.30,textWrap:'balance',textShadow:'0 3px 20px #130d22,0 1px 4px #130d22'}}>“{s.line}”</div>
   </div>}
   <div style={{position:'absolute',bottom:104,left:74,right:74,display:'flex',justifyContent:'space-between',...mono,fontSize:16,color:'#e1d1e9'}}><span>FIRST CONTACT</span><span>EPISODE 02</span></div>
  </>}
  {final&&<>
   <div style={{position:'absolute',top:218,left:76,right:76,opacity:ease(t/.25)}}>
    <div style={{...mono,color:'#b9f1e8'}}>THE SIGNAL IS WAITING.</div>
    <div style={{fontSize:83,fontWeight:700,lineHeight:1.04,letterSpacing:-3,marginTop:22}}>DO YOU<br/>FOLLOW IT?</div>
    <div style={{marginTop:42,display:'flex',flexDirection:'column',gap:23}}>{EPISODE2.choices.map(choice=><div key={choice.key} style={{display:'flex',alignItems:'center',gap:26,border:`1px solid ${choice.color}88`,borderLeft:`6px solid ${choice.color}`,background:'#151727dc',padding:'26px 27px'}}>
     <div style={{fontSize:67,fontWeight:700,color:choice.color,minWidth:64}}>{choice.key}</div><div><div style={{...mono,fontSize:17,color:'#d5cce4',letterSpacing:2,marginBottom:8}}>{choice.top}</div><div style={{fontSize:35,fontWeight:700}}>{choice.label}</div></div>
    </div>)}</div>
    <div style={{textAlign:'center',fontSize:34,letterSpacing:2,fontWeight:700,marginTop:35}}>COMMENT <span style={{color:'#63e8e0'}}>A</span> OR <span style={{color:'#ffc383'}}>B</span></div>
    <div style={{textAlign:'center',...mono,fontSize:18,color:'#d3c9df',marginTop:13}}>YOU DECIDE EPISODE 3</div>
   </div>
   <div style={{position:'absolute',bottom:124,left:0,right:0,textAlign:'center'}}><div style={{fontSize:34,fontWeight:700,letterSpacing:8}}>THE LAST WING</div><div style={{fontSize:18,letterSpacing:3,color:'#d1c6de',marginTop:13}}>An AltWing Original</div></div>
  </>}
  <div style={{position:'absolute',bottom:0,left:0,height:4,width:`${(frame+1)/750*100}%`,background:'#80dbd7'}}/>
 </AbsoluteFill>;
};
