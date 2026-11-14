import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {between,ramp} from '../characters/performance';
import {stories,sceneAt} from './story';
const mint='#a6f0d5',amber='#ffd19a',white='#fff8ee',muted='#c6d4e1';
const mono:React.CSSProperties={fontFamily:'Studio Mono,monospace',letterSpacing:2.5,fontSize:23};
const panel:React.CSSProperties={background:'#0b1628ed',border:'1px solid #6a87946b',borderRadius:23,boxShadow:'0 12px 55px #02091544'};
export const FilmFonts=()=> <style>{`@font-face{font-family:'Studio Sans';src:url('${staticFile('fonts/DejaVuSans.ttf')}');font-weight:400}@font-face{font-family:'Studio Sans';src:url('${staticFile('fonts/DejaVuSans-Bold.ttf')}');font-weight:700}@font-face{font-family:'Studio Mono';src:url('${staticFile('fonts/DejaVuSansMono.ttf')}')}`}</style>;
const Eyebrow:React.FC<{children:React.ReactNode;color?:string}>=({children,color=mint})=><div style={{...mono,color,fontSize:23,lineHeight:1.5}}>{children}</div>;
const Title:React.FC<{children:React.ReactNode;size?:number}>=({children,size=63})=><div style={{fontWeight:700,fontSize:size,letterSpacing:-2,lineHeight:1.11,textWrap:'balance',textShadow:'0 4px 25px #02081699'}}>{children}</div>;
const Notice:React.FC<{top?:number;children:React.ReactNode;color?:string}>=({top=292,children,color=mint})=><div style={{position:'absolute',top,left:76,right:110,...panel,borderLeft:`5px solid ${color}`,padding:'22px 28px',fontSize:28,lineHeight:1.4,fontWeight:700,color}}>{children}</div>;
const OPTIONS=[
 [{key:'A',title:'SPACE STATION',detail:'Possible supplies · Unstable signal',risk:'Investigate the station',color:amber},{key:'B',title:'UNKNOWN PLANET',detail:'Energy source · Atmosphere unknown',risk:'Land on the planet',color:mint}],
 [{key:'A',title:'OPEN THE GATE',detail:'Follow the signal · Oxygen stays low',risk:'Enter an unknown destination',color:mint},{key:'B',title:'RESTORE OXYGEN',detail:'Lose the gate signal · Stay stranded',risk:'Power the ship’s recycler',color:amber}]
];
const Choices:React.FC<{episode:number;compact?:boolean}>=({episode,compact=false})=><div style={{display:'flex',flexDirection:compact?'row':'column',gap:compact?18:22}}>
 {OPTIONS[episode-1].map(o=><div key={o.key} style={{...panel,flex:1,padding:compact?'22px 22px':'29px 28px',borderLeft:`6px solid ${o.color}`,display:'flex',gap:compact?15:25,alignItems:'center'}}>
  <div style={{fontWeight:700,color:o.color,fontSize:compact?48:65,lineHeight:1}}>{o.key}</div>
  <div><div style={{fontWeight:700,fontSize:compact?25:36,letterSpacing:compact?0:.4,color:white}}>{o.title}</div>{!compact&&<><div style={{fontSize:26,color:muted,marginTop:12,lineHeight:1.35}}>{o.detail}</div><div style={{fontSize:23,color:o.color,marginTop:10}}>{o.risk}</div></>}</div>
 </div>)}
</div>;
export const FilmOverlays:React.FC<{episode:number;time:number}>=({episode,time:t})=>{
 const ep=stories[episode-1],scene=sceneAt(episode,t),local=t-ep.scenes[scene].start,promo=t>=53,choice=t>=46;
 const cue=ep.dialogue.find(c=>t>=c.at&&t<c.end),caption=cue?Math.min(ramp(t,cue.at,cue.at+.12),1-ramp(t,cue.end-.12,cue.end)):0;
 const oxygen=episode===1?(t<20?12:t<38?11:10):(t<20?9:t<29?8:t<38?7:t<46?5:4);
 return <AbsoluteFill style={{fontFamily:'Studio Sans,sans-serif',color:white,pointerEvents:'none'}}>
  <AbsoluteFill style={{background:promo?'linear-gradient(180deg,#071323fb 0%,#071323fa 80%,#071323f0 100%)':'linear-gradient(180deg,#07101ae0 0%,#07101a66 19%,transparent 39%,transparent 61%,#07101a99 83%,#07101aca 100%)'}}/>
  <div style={{position:'absolute',top:79,left:76,right:110,display:'flex',alignItems:'center',justifyContent:'space-between',...mono,fontSize:21}}><span style={{fontWeight:700,letterSpacing:4}}>ALTWING <span style={{fontWeight:400,color:mint,letterSpacing:2}}>ORIGINAL</span></span><span style={{color:muted}}>THE LAST WING / 0{episode}</span></div>
  {!promo&&<div style={{position:'absolute',top:152,left:76,right:110,display:'flex',gap:22,alignItems:'center'}}>
   <div style={{...panel,padding:'12px 20px',borderColor:'#ffb98566',fontSize:25,fontWeight:700,color:amber}}>O₂ {oxygen}%</div>
   <div style={{height:6,flex:1,background:'#95b8c433',borderRadius:4}}><div style={{width:`${oxygen/12*100}%`,height:6,background:amber,borderRadius:4}}/></div>
   <div style={{...mono,fontSize:21,color:mint}}>{episode===1?'VESSEL / ARK-07':'FUEL / EMPTY'}</div>
  </div>}
  {!choice&&<>
   {episode===1&&<>
    {scene===0&&<div style={{position:'absolute',top:286,left:76,right:110,opacity:ramp(t,.1,.45)}}><Eyebrow color={amber}>EPISODE 01 · THE LAST SIGNAL</Eyebrow><div style={{marginTop:18}}><Title>You’re the<br/>last one awake.</Title></div></div>}
    {scene===1&&<div style={{position:'absolute',top:280,left:76,right:110,opacity:ramp(local,0,.3)}}><Eyebrow color={amber}>47 DAYS WITHOUT EARTH</Eyebrow><div style={{marginTop:17}}><Title size={55}>{t<9?'EARTH CONNECTION LOST':'NAVIGATION OFFLINE'}</Title></div><div style={{...mono,color:'#ffb4a2',fontSize:24,marginTop:20}}>MAIN ENGINE FAILURE</div></div>}
    {scene===2&&<div style={{position:'absolute',top:286,left:76,right:110,opacity:ramp(local,0,.3)}}><Eyebrow>WANGDOO / MAINTENANCE</Eyebrow><div style={{marginTop:17}}><Title size={56}>{t<17.1?'One tiny victory.':'One very large problem.'}</Title></div></div>}
    {scene===3&&<><div style={{position:'absolute',top:278,left:76,right:110}}><Eyebrow>STORY MISSION 01</Eyebrow><Title size={53}>RESTORE NAVIGATION</Title></div><Notice top={432} color={t<25.6?amber:mint}>{t<23.5?'CONNECT CABLE  →  CLOSE SWITCH':t<25.6?'HOLD ON, WANGDOO!':'NAVIGATION PARTIALLY RESTORED'}</Notice></>}
    {scene===4&&<div style={{position:'absolute',top:272,left:76,right:110}}><Eyebrow>LONG-RANGE SCAN / TWO SIGNALS</Eyebrow><div style={{marginTop:16}}><Title size={56}>Two ways to survive.</Title></div>{t<33&&<div style={{display:'flex',gap:18,marginTop:25}}>{['A · SPACE STATION','B · UNKNOWN PLANET'].map((s,i)=><div key={s} style={{...panel,padding:'18px 20px',fontSize:23,fontWeight:700,color:i?mint:amber,flex:1}}>{s}</div>)}</div>}</div>}
    {scene===5&&<div style={{position:'absolute',top:274,left:76,right:110}}><Eyebrow color={amber}>RESERVE POWER CRITICAL</Eyebrow><div style={{marginTop:18}}><Title>ONE JUMP.<br/>NO RETURN.</Title></div><div style={{fontSize:29,lineHeight:1.4,color:muted,marginTop:25}}>Enough power for one destination.</div></div>}
   </>}
   {episode===2&&<>
    {scene===0&&<div style={{position:'absolute',top:267,left:76,right:110}}><Eyebrow color={amber}>EPISODE 02 · PLANET ROUTE (OPTION B)</Eyebrow><div style={{marginTop:18}}><Title size={58}>WE MADE<br/>A MISTAKE.</Title></div><div style={{fontSize:27,lineHeight:1.4,marginTop:20,color:muted}}>This is what happens<br/>if we choose the planet.</div></div>}
    {scene===1&&<div style={{position:'absolute',top:278,left:76,right:110}}><Eyebrow color={amber}>LANDING STATUS / QUESTIONABLE</Eyebrow><div style={{marginTop:18}}><Title size={57}>STRANDED.</Title></div><div style={{...mono,fontSize:24,lineHeight:1.7,color:muted,marginTop:17}}>FUEL EMPTY<br/>NAV SENSOR OFFLINE</div></div>}
    {scene===2&&<div style={{position:'absolute',top:278,left:76,right:110}}><Eyebrow color={t<16.3?mint:'#ffab98'}>{t<16.3?'FIRST CONTACT':'ALARM TRANSMISSION DETECTED'}</Eyebrow><div style={{marginTop:18}}><Title size={56}>{t<16.3?'It seems friendly.':'That wasn’t a flower.'}</Title></div></div>}
    {scene===3&&<div style={{position:'absolute',top:272,left:76,right:110}}><Eyebrow color={amber}>STORY MISSION 02 · SURVIVE THE SIGNAL</Eyebrow><div style={{marginTop:18}}><Title size={55}>{t<23?'The signal found a door.':t<26.5?'And something else.':'Time to leave.'}</Title></div></div>}
    {scene===4&&<div style={{position:'absolute',top:272,left:76,right:110}}><Eyebrow color={amber}>PROXIMITY ALERT / CLOSING FAST</Eyebrow><div style={{marginTop:18}}><Title size={57}>{t<32?'RUN.':t<35?'BOOST MALFUNCTION':'STAY TOGETHER.'}</Title></div></div>}
    {scene===5&&<><div style={{position:'absolute',top:272,left:76,right:110}}><Eyebrow>ANCIENT POWER TERMINAL</Eyebrow><div style={{marginTop:17}}><Title size={58}>ONE CORE.<br/>TWO OUTPUTS.</Title></div></div><Notice top={490} color={amber}>GATE ACCESS ↔ OXYGEN RECYCLER<br/><span style={{fontWeight:400,fontSize:25,color:muted}}>The core can power only one.</span></Notice></>}
   </>}
  </>}
  {choice&&!promo&&<div style={{position:'absolute',top:281,left:76,right:110,opacity:ramp(t,46,46.3),transform:`translateY(${(1-ramp(t,46,46.45))*14}px)`}}>
   <Eyebrow color={amber}>{episode===1?'ONE JUMP LEFT':'OXYGEN 4% · THREAT APPROACHING'}</Eyebrow>
   <div style={{marginTop:17,marginBottom:31}}><Title size={66}>YOU CHOOSE.</Title></div>
   <Choices episode={episode}/>
   <div style={{fontWeight:700,fontSize:37,textAlign:'center',marginTop:29}}>COMMENT <span style={{color:mint}}>A</span> OR <span style={{color:amber}}>B</span></div>
   <div style={{...mono,textAlign:'center',fontSize:23,color:muted,marginTop:14}}>YOUR CHOICE SHAPES EPISODE {episode+1}</div>
  </div>}
  {promo&&<>
   <div style={{position:'absolute',top:238,left:76,right:110}}><Eyebrow>THE NEXT MOVE IS YOURS.</Eyebrow><div style={{marginTop:17}}><Choices episode={episode} compact/></div><div style={{fontSize:24,textAlign:'center',color:muted,marginTop:15}}>Comment A or B · Shape Episode {episode+1}</div></div>
   <div style={{position:'absolute',left:76,right:110,top:505,opacity:ramp(t,53,53.45)}}>
    <div style={{display:'flex',alignItems:'center',gap:17}}><Img src={staticFile('brand/official-penguin.png')} style={{width:88,height:88,objectFit:'contain'}}/><div style={{fontSize:65,fontWeight:700,letterSpacing:-2}}>Alt<span style={{color:mint}}>Wing</span></div></div>
    <div style={{fontSize:46,fontWeight:700,lineHeight:1.13,marginTop:19,letterSpacing:-1}}>{episode===1?'Build your own journey.':'Try a real challenge.'}</div>
   </div>
   <div style={{position:'absolute',left:76,top:800,width:360,opacity:ramp(t,53.2,53.7)}}>
    <Eyebrow>EXPLORE · BUILD · LAUNCH</Eyebrow>
    <div style={{fontSize:33,fontWeight:700,lineHeight:1.45,marginTop:24}}>{episode===1?'Discover engineering. Try projects. Find your Wing.':'Make a prediction. Change one thing. See what happens.'}</div>
    <div style={{fontSize:26,lineHeight:1.5,color:muted,marginTop:24}}>Real browser projects<br/>at your own pace.</div>
    <div style={{...panel,padding:'18px 19px',color:mint,fontSize:27,fontWeight:700,marginTop:29,borderColor:'#a6f0d588'}}>LINK IN BIO ↗</div>
   </div>
   <div style={{position:'absolute',top:770,right:110,width:430,...panel,padding:12,transform:`translateY(${(1-ramp(t,53.2,53.75))*24}px)`,opacity:ramp(t,53.2,53.75)}}>
    <div style={{...mono,fontSize:16,letterSpacing:.5,padding:'3px 4px 13px',color:muted}}>junjang06.github.io/altwing</div>
    <div style={{height:610,overflow:'hidden',borderRadius:12}}><Img src={staticFile(episode===1?'brand/altwing-home.png':'brand/altwing-projects.png')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}}/></div>
    <div style={{fontSize:18,color:muted,padding:'12px 4px 2px'}}>Actual AltWing website</div>
   </div>
   <div style={{position:'absolute',bottom:144,left:76,right:110,color:mint,fontSize:24,textAlign:'center'}}>Your path. Your pace. · junjang06.github.io/altwing</div>
  </>}
  {cue&&<div style={{position:'absolute',left:83,right:118,bottom:promo?260:235,textAlign:'center',opacity:caption,transform:`translateY(${(1-caption)*6}px)`}}>
   <div style={{...mono,color:cue.who==='wangdoo'?amber:mint,fontSize:21,marginBottom:12}}>{cue.who==='wangdoo'?'WANGDOO':'MISSION LOG'}</div>
   <div style={{display:'inline-block',background:'#081120e8',borderRadius:20,padding:'19px 25px',fontSize:cue.text.length>72?35:39,fontWeight:700,lineHeight:1.35,textWrap:'balance',boxShadow:'0 4px 25px #0005'}}>{cue.text}</div>
  </div>}
  {!promo&&<div style={{position:'absolute',bottom:112,left:76,right:110,display:'flex',justifyContent:'space-between',...mono,fontSize:20,color:muted}}><span>{ep.title}</span><span>{Math.min(Math.floor(t),ep.duration).toString().padStart(2,'0')} / {ep.duration}</span></div>}
  <div style={{position:'absolute',left:0,bottom:0,height:5,width:`${t/ep.duration*100}%`,background:mint}}/>
 </AbsoluteFill>;
};
