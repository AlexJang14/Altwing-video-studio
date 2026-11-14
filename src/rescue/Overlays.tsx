import React from 'react';
import {AbsoluteFill,Img,OffthreadVideo,Sequence,staticFile} from 'remotion';
import {ramp,between} from '../characters/performance';
import data from './episodes.json';
const ink='#eef0e9',cyan='#a6ced1',amber='#e9bea0';
const mono:React.CSSProperties={fontFamily:'Studio Mono,monospace',fontSize:23,letterSpacing:2};
const card:React.CSSProperties={background:'#0b1522e8',border:'1px solid #aac4ca55',borderRadius:18};
export const RescueOverlays:React.FC<{episode:number;time:number}>=({episode,time:t})=>{
 const ep=data.episodes[episode-1],voteStart=episode===1?57:55,promo=ep.promotion.at,vote=t>=voteStart,ad=t>=promo;
 const panel=ep.panels.find(p=>t>=p.at&&t<p.end),alpha=panel?between(t,panel.at,panel.end,.15):0;
 const security=episode===1&&t>=22.15&&t<30.85,memories=episode===1&&t>=7.9&&t<11.2;
 return <AbsoluteFill style={{fontFamily:'Studio Sans,sans-serif',color:ink,pointerEvents:'none'}}>
  <AbsoluteFill style={{background:ad?'linear-gradient(180deg,#07121af5,#07121ae0 65%,#07121af5)':'linear-gradient(180deg,#081019a8,transparent 34%,transparent 72%,#08101966)'}}/>
  <div style={{position:'absolute',top:74,left:76,right:112,display:'flex',justifyContent:'space-between',...mono,fontSize:21,color:'#c3d0d5'}}><span style={{letterSpacing:3}}>ALTWING ORIGINAL</span><span>THE LAST WING / 0{episode}</span></div>
  {!ad&&<div style={{position:'absolute',top:140,left:76,right:112,display:'flex',justifyContent:'space-between',...mono,fontSize:20,color:'#bac8cf'}}><span>{episode===1?'ARK-07 · HELIX-9 RESCUE':episode===2?'ARK-07 · PLANET SURFACE':'ARK-07 · SHELTER FACILITY'}</span><span>{episode===1?'2189':episode===2?'SUIT O₂ / '+(t<36?'12%':t<55?'8%':'5%'):'SEALED AIR / VERIFIED'}</span></div>}
  {panel&&!security&&!ad&&<div style={{position:'absolute',left:76,right:112,top:episode===1&&t<4?292:240,opacity:alpha,transform:`translateY(${(1-alpha)*7}px)`}}>
   <div style={{...mono,fontSize:22,color:panel.tone==='alert'?amber:cyan,marginBottom:17,lineHeight:1.45}}>{panel.label}</div>
   <div style={{fontWeight:700,fontSize:panel.title.length>29?43:panel.title.length>23?51:episode===1&&t<4?81:61,lineHeight:1.09,letterSpacing:-1.4,textWrap:'balance',textShadow:'0 3px 28px #020713'}}>{panel.title}</div>
   <div style={{marginTop:22,...card,padding:'18px 23px',borderLeft:`4px solid ${panel.tone==='alert'?amber:cyan}`,display:'inline-block'}}>{panel.lines.map((line,i)=><div key={line} style={{fontSize:line.length>39?25:28,lineHeight:1.5,color:i?'#cad4d8':ink}}>{line}</div>)}</div>
  </div>}
  {memories&&<div style={{position:'absolute',top:235,left:76,right:112,opacity:between(t,7.9,11.2,.2)}}>
   <div style={{...mono,color:cyan,fontSize:21,marginBottom:15}}>PERSONAL EXPLORATION COMPANION / ORIGIN RECORD</div>
   <div style={{display:'flex',gap:20}}>{[['memory-plush.png','PERSONAL ARCHIVE · 2178'],['memory-training.png','TRAINING RECORD · 2188']].map(([file,label])=><div key={file} style={{flex:1,...card,padding:9,opacity:file.includes('plush')?1:.4+.6*ramp(t,8.6,9.4)}}><Img src={staticFile('rescue/'+file)} style={{width:'100%',height:286,objectFit:'cover',borderRadius:10}}/><div style={{...mono,fontSize:17,padding:'12px 3px 3px',letterSpacing:1,color:cyan}}>{label}</div></div>)}</div>
  </div>}
  {security&&<div style={{position:'absolute',top:230,left:76,right:112,opacity:between(t,22.15,30.85,.2)}}>
   <div style={{...mono,fontSize:23,color:cyan,marginBottom:15}}>HELIX-9 / SECURITY RECORD</div>
   <div style={{...card,padding:12}}><div style={{position:'relative',height:535,overflow:'hidden',borderRadius:10,background:'#07101b'}}>
    {t<26?<Sequence layout="none" from={Math.round(22.15*30)} durationInFrames={120}><OffthreadVideo src={staticFile('rescue/security.mp4')} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/></Sequence>:<Img src={staticFile('rescue/security-poster.png')} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${1+.09*ramp(t,26,27.1)})`}}/>}
   </div>
   <div style={{display:'flex',justifyContent:'space-between',fontFamily:'Studio Mono',fontSize:26,color:ink,padding:'19px 9px 9px'}}><span>RECORDED 14:03:12</span><span>DOCKED 20:03:12</span></div></div>
   <div style={{marginTop:17,fontSize:39,fontWeight:700,lineHeight:1.25,color:t<27?cyan:amber}}>{t<25.7?'IDENTITY MATCH / SAME SUIT + CRESCENT':t<28.2?'SIX HOURS BEFORE YOUR ARRIVAL':'TIMESTAMP CONFLICT · INSUFFICIENT DATA'}</div>
  </div>}
  {vote&&<div style={{position:'absolute',top:ad?210:258,left:76,right:112,opacity:ramp(t,voteStart,voteStart+.25)}}>
   {!ad&&<><div style={{...mono,color:amber,marginBottom:17}}>{episode===1?'ONE DESCENT. NO CERTAIN ANSWER.':episode===2?'ONE CELL. TWO CONTINUOUS LOADS.':'ONE WARNING. A REAL COST.'}</div><div style={{fontSize:67,fontWeight:700,lineHeight:1.1,letterSpacing:-2,marginBottom:29}}>WHAT WOULD YOU DO?</div></>}
   <div style={{display:'flex',flexDirection:ad?'row':'column',gap:18}}>{ep.choices.map(o=><div key={o.key} style={{...card,flex:1,borderLeft:`5px solid ${o.color}`,padding:ad?'18px 20px':'26px 27px',display:'flex',gap:20,alignItems:'center'}}><div style={{fontWeight:700,fontSize:ad?43:61,color:o.color}}>{o.key}</div><div><div style={{fontSize:ad?23:35,fontWeight:700,lineHeight:1.2}}>{o.title}</div>{!ad&&<div style={{fontSize:28,lineHeight:1.4,color:'#c7d2d7',marginTop:12}}>{o.cost}</div>}</div></div>)}</div>
   <div style={{textAlign:'center',marginTop:ad?14:28,fontSize:ad?24:36,fontWeight:700}}>COMMENT A OR B <span style={{fontWeight:400,fontSize:ad?21:24,color:'#c4d1d6'}}> · YOUR CHOICE DECIDES EPISODE {ep.promotion.voteNext}</span></div>
  </div>}
  {ad&&<>
   <div style={{position:'absolute',top:440,left:76,right:112,opacity:ramp(t,promo,promo+.3)}}>
    <div style={{fontSize:46,fontWeight:700,lineHeight:1.2,letterSpacing:-1}}>{t<promo+2.5?ep.promotion.bridge.slice(0,2).join(' '):ep.promotion.bridge[2]}</div>
   </div>
   <div style={{position:'absolute',top:708,left:76,width:380,opacity:ramp(t,promo+1.5,promo+2.0)}}>
    <div style={{fontSize:57,fontWeight:700,letterSpacing:-2,color:ink}}>Alt<span style={{color:cyan}}>Wing</span></div>
    <div style={{fontSize:39,fontWeight:700,lineHeight:1.2,marginTop:24}}>{ep.promotion.headline}</div>
    <div style={{fontSize:32,lineHeight:1.45,marginTop:25,color:'#d2dcd9'}}>{ep.promotion.lines.map(s=><div key={s} style={{marginBottom:12}}>{s}</div>)}</div>
    <div style={{fontSize:26,lineHeight:1.5,color:'#b6c9cf',marginTop:24}}>Explore engineering interests<br/>and hands-on projects.</div>
    <div style={{...card,borderColor:'#a3ced188',fontWeight:700,fontSize:38,color:cyan,padding:'18px 18px',marginTop:30}}>LINK IN BIO ↗</div>
   </div>
   <div style={{position:'absolute',top:700,right:112,width:438,...card,padding:12,opacity:ramp(t,promo+2,promo+2.5)}}>
    <div style={{...mono,letterSpacing:.5,fontSize:17,padding:'4px 3px 12px',color:cyan}}>ACTUAL ALTWING ACTIVITY</div>
    <Img src={staticFile(`rescue/altwing-${ep.promotion.activity}.png`)} style={{width:'100%',height:672,objectFit:'contain',objectPosition:'top',borderRadius:10,background:'#08131f'}}/>
    <div style={{fontSize:17,color:'#c9d4d9',padding:'11px 3px 3px'}}>Official site · Unmodified interface</div>
   </div>
   <div style={{position:'absolute',left:76,right:112,bottom:175,color:cyan,fontSize:26,textAlign:'center'}}>junjang06.github.io/altwing · Your path. Your pace.</div>
  </>}
  {!ad&&<div style={{position:'absolute',left:76,right:112,bottom:119,display:'flex',justifyContent:'space-between',...mono,fontSize:20,color:'#c0c9cd'}}><span>{ep.title}</span><span>{String(Math.floor(t)).padStart(2,'0')} / {ep.duration}</span></div>}
 </AbsoluteFill>;
};
