import React from 'react';
import {AbsoluteFill,interpolate} from 'remotion';
import {C,EPISODE,ease} from '../config';
const mono:React.CSSProperties={fontFamily:'"Studio Mono",monospace',fontSize:21,letterSpacing:4};
export const AltWingBranding:React.FC<{final?:boolean}> = ({final=false})=><div style={{position:'absolute',left:72,right:72,top:76,display:'flex',justifyContent:'space-between',alignItems:'center',color:'#e1e8ef'}}>
  <div style={{...mono,fontSize:20,letterSpacing:5}}>ALTWING<span style={{color:C.cyan,marginLeft:8}}>↗</span></div>
  <div style={{...mono,fontSize:17,color:'#a8bacf'}}>{final?'YOU DECIDE EPISODE 2':'THE LAST WING / 01'}</div>
</div>;
export const DialogueCaptions:React.FC<{scene:number;localTime:number}> = ({scene,localTime:t})=>{
  if(scene===5||t<.4||(scene===2&&t<2.6)||(scene===0&&t>3.6))return null;
  const penguin=scene===2||scene===4;
  const line=EPISODE.scenes[scene].line;
  const local=t-(scene===2?2.6:.4);
  return <div style={{position:'absolute',bottom:225,left:88,right:88,textAlign:'center',opacity:ease(local/.2)}}>
    {penguin&&<div style={{...mono,fontSize:19,color:C.amber,marginBottom:17}}>WANGDOO</div>}
    <div style={{fontSize:43,fontWeight:700,lineHeight:1.3,color:'#f8f5ef',textShadow:'0 3px 22px #000,0 1px 3px #000',textWrap:'balance'}}>“{line}”</div>
  </div>;
};
export const HolographicUI:React.FC<{scene:number;localTime:number}> = ({scene,localTime:t})=>{
  if(scene===1){const oxygen=Math.max(12,Math.round(16-t*1.2));return <div style={{position:'absolute',top:220,left:74,right:74}}>
    <div style={{...mono,color:C.red,fontSize:23,marginBottom:24}}>LIFE SUPPORT / CRITICAL</div>
    <div style={{display:'flex',alignItems:'baseline',gap:19}}><span style={{fontSize:130,fontWeight:700,lineHeight:1,color:'#fff3ed',letterSpacing:-6}}>{oxygen===12?'12':oxygen}<span style={{fontSize:56}}>%</span></span><span style={{...mono,color:'#e1e7ee',fontSize:22}}>OXYGEN</span></div>
    <div style={{width:380,height:6,background:'#ff45452b',marginTop:24}}><div style={{height:6,width:`${oxygen}%`,background:C.red,boxShadow:'0 0 18px #ff4545'}}/></div>
  </div>;}
  if(scene===4)return <div style={{position:'absolute',top:216,left:74,right:74,opacity:ease(t/.2)}}>
    <div style={{...mono,color:C.amber,fontSize:22}}>JUMP DRIVE / INSUFFICIENT FUEL</div>
    <div style={{fontSize:72,fontWeight:700,marginTop:15,letterSpacing:-2}}>ONE JUMP LEFT.</div>
    <div style={{...mono,fontSize:19,color:'#d3d5f5',marginTop:22}}>02 DESTINATIONS · 01 DECISION</div>
    <div style={{marginTop:28,display:'flex',gap:16}}>{['A / SPACE STATION','B / UNKNOWN PLANET'].map((s,i)=><div key={s} style={{padding:'17px 18px',border:`1px solid ${i?'#bca5ff70':'#52d8ff70'}`,background:'#07111f99',fontSize:19,fontWeight:700,color:i?'#d6c9ff':C.cyan}}>{s}</div>)}</div>
  </div>;
  return null;
};
export const DecisionOverlay:React.FC<{localTime:number}> = ({localTime:t})=><>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(4,9,18,.22) 0%,rgba(4,9,18,.74) 28%,rgba(4,9,18,.78) 48%,rgba(4,9,18,.16) 67%,rgba(4,9,18,.3) 100%)'}}/>
  <div style={{position:'absolute',top:220,left:76,right:76,opacity:ease(t/.22),transform:`translateY(${(1-ease(t/.3))*16}px)`}}>
    <div style={{...mono,color:C.amber,fontSize:20}}>FUEL FOR ONE JUMP.</div>
    <div style={{fontSize:89,lineHeight:1.02,letterSpacing:-4,fontWeight:700,marginTop:25}}>WHAT WOULD<br/>YOU CHOOSE?</div>
    <div style={{marginTop:52,display:'flex',flexDirection:'column',gap:24}}>{EPISODE.choices.map(choice=><div key={choice.key} style={{border:`1px solid ${choice.color}88`,borderLeft:`6px solid ${choice.color}`,background:'#0a1324d9',padding:'31px 25px',display:'flex',alignItems:'center',gap:27}}>
      <div style={{fontSize:69,lineHeight:1,fontWeight:700,color:choice.color,minWidth:66}}>{choice.key}</div>
      <div><div style={{...mono,fontSize:18,letterSpacing:3,color:'#bfcede',marginBottom:8}}>{choice.title}</div><div style={{fontSize:35,fontWeight:700,letterSpacing:-.5}}>{choice.destination}</div></div>
    </div>)}</div>
    <div style={{marginTop:43,fontSize:36,letterSpacing:2,fontWeight:700,textAlign:'center'}}>COMMENT <span style={{color:C.cyan}}>A</span> OR <span style={{color:'#bca5ff'}}>B</span></div>
    <div style={{...mono,fontSize:18,letterSpacing:3,textAlign:'center',color:'#aebbd2',marginTop:17}}>YOUR CHOICE SHAPES EPISODE 2</div>
  </div>
  <div style={{position:'absolute',bottom:148,left:0,right:0,textAlign:'center'}}><div style={{fontSize:36,letterSpacing:9,fontWeight:700}}>THE LAST WING</div><div style={{fontSize:19,color:'#b0bdd0',letterSpacing:3,marginTop:16}}>An AltWing Original</div></div>
</>;
export const Overlays:React.FC<{scene:number;localTime:number;frame:number}> = ({scene,localTime:t,frame})=><AbsoluteFill style={{pointerEvents:'none',color:'#f2f5fa',fontFamily:'"Studio Sans",sans-serif'}}>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(3,7,15,.55) 0%,transparent 32%,transparent 56%,rgba(3,7,15,.75) 95%)'}}/>
  {scene===5?<DecisionOverlay localTime={t}/>:<>
    {scene===0&&<div style={{position:'absolute',top:225,left:74,right:70,opacity:ease(t/.5)}}><div style={{...mono,color:C.red,fontSize:23}}>DAY 1 / 04:17 SHIP TIME</div><div style={{fontSize:100,lineHeight:1.02,fontWeight:700,letterSpacing:-4,marginTop:23}}>LOST<br/>IN SPACE.</div></div>}
    {scene===2&&t>.5&&<div style={{position:'absolute',top:240,left:74,opacity:ease((t-.5)/.5)}}><div style={{...mono,fontSize:21,color:C.amber}}>YOU AREN’T ALONE.</div><div style={{fontSize:78,fontWeight:700,letterSpacing:-2,marginTop:17}}>MEET WANGDOO.</div><div style={{...mono,fontSize:17,color:'#bdcede',marginTop:15}}>COMPANION UNIT / ONLINE</div></div>}
    {scene===3&&<div style={{position:'absolute',top:220,left:74,right:74,opacity:ease(t/.5)}}><div style={{...mono,color:'#c9b6ff',fontSize:22}}>UNIDENTIFIED SIGNAL / LOCKED</div><div style={{fontSize:83,fontWeight:700,lineHeight:1.04,letterSpacing:-3,marginTop:23}}>SOMETHING<br/>IS CALLING.</div></div>}
    <HolographicUI scene={scene} localTime={t}/>
    <DialogueCaptions scene={scene} localTime={t}/>
    <div style={{position:'absolute',bottom:106,left:74,right:74,display:'flex',justifyContent:'space-between',...mono,fontSize:16,color:'#97adc2'}}><span>THE SIGNAL</span><span>EPISODE 01</span></div>
  </>}
  <AltWingBranding final={scene===5}/>
  <div style={{position:'absolute',bottom:0,left:0,width:`${(frame+1)/750*100}%`,height:4,background:scene<2?C.red:C.cyan}}/>
  <AbsoluteFill style={{boxShadow:'inset 0 0 200px 20px rgba(0,0,0,.28)'}}/>
  {scene!==5&&<AbsoluteFill style={{background:'#020712',opacity:interpolate(t,[0,.16],[.65,0],{extrapolateRight:'clamp'})}}/>}
</AbsoluteFill>;
