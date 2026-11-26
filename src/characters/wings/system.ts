/** Canonical Wing rules. Pure event replay makes rendering independent of frame order. */
export type WingId='scout'|'shield'|'boost'|'torch'|'echo'|'builder';
export type WingSpec={name:string;color:string;symbol:string;abilities:string[];limitation:string;activationCost:number;drainPerSecond:number;maxSeconds:number;cooldownSeconds:number;shape:'feather'|'arc'|'jet'|'blade'|'wave'|'tool'};
export const WINGS:Record<WingId,WingSpec>={
 scout:{name:'Scout Wing',color:'#45d9ff',symbol:'curiosity',abilities:['scan','compare uncertain signals','reveal clues','navigate'],limitation:'Interference can hide or misidentify signals. A scan is evidence, never certainty.',activationCost:8,drainPerSecond:5,maxSeconds:8,cooldownSeconds:8,shape:'feather'},
 shield:{name:'Shield Wing',color:'#e6bb65',symbol:'care',abilities:['temporary barrier','protect from debris and impacts'],limitation:'Short duration, long cooldown, heavy energy drain.',activationCost:20,drainPerSecond:12,maxSeconds:2.5,cooldownSeconds:24,shape:'arc'},
 boost:{name:'Boost Wing',color:'#ffab65',symbol:'courage',abilities:['brief propulsion','jump assistance','emergency repositioning'],limitation:'Brief bursts only. Repeated use before cooling is rejected.',activationCost:18,drainPerSecond:15,maxSeconds:1.4,cooldownSeconds:12,shape:'jet'},
 torch:{name:'Torch Wing',color:'#ff633d',symbol:'insight',abilities:['cut','melt','illuminate','emergency access'],limitation:'Overheating and severe battery drain.',activationCost:15,drainPerSecond:14,maxSeconds:3,cooldownSeconds:20,shape:'blade'},
 echo:{name:'Echo Wing',color:'#a995ff',symbol:'understanding',abilities:['decode','reconstruct voice traces','amplify signals'],limitation:'Noise, ambiguity and corrupted data can prevent reconstruction.',activationCost:10,drainPerSecond:6,maxSeconds:6,cooldownSeconds:10,shape:'wave'},
 builder:{name:'Builder Wing',color:'#47c7ae',symbol:'creativity',abilities:['repair','assemble','reroute circuits','temporary mechanisms'],limitation:'Requires available materials, time and focused setup.',activationCost:10,drainPerSecond:4,maxSeconds:12,cooldownSeconds:8,shape:'tool'},
};
export type WingCommand={at:number;action:'activate'|'interference'|'release';wing?:WingId};
export type WingState={active:WingId|null;energy:number;activatedAt:number|null;releasedAt:number|null;interference:boolean;cooldowns:Partial<Record<WingId,number>>;rejected:{at:number;reason:string}[]};
export function wingStateAt(time:number,commands:readonly WingCommand[],initialEnergy=100):WingState{
 const s:WingState={active:null,energy:initialEnergy,activatedAt:null,releasedAt:null,interference:false,cooldowns:{},rejected:[]};let cursor=0;
 const release=(at:number)=>{if(!s.active)return;s.cooldowns[s.active]=at+WINGS[s.active].cooldownSeconds;s.active=null;s.releasedAt=at;s.interference=false;};
 const advance=(to:number)=>{if(s.active){const c=WINGS[s.active],expiry=Math.min((s.activatedAt??0)+c.maxSeconds,cursor+s.energy/c.drainPerSecond),until=Math.min(to,expiry);s.energy=Math.max(0,s.energy-(until-cursor)*c.drainPerSecond);if(expiry<=to)release(expiry);}cursor=to;};
 for(const cmd of [...commands].sort((a,b)=>a.at-b.at)){if(cmd.at>time)break;advance(cmd.at);if(cmd.action==='activate'){
  const id=cmd.wing??'scout',c=WINGS[id];const reason=s.active?'one-wing-only':(s.cooldowns[id]??0)>cmd.at?'cooldown':s.energy<c.activationCost?'insufficient-energy':null;
  if(reason)s.rejected.push({at:cmd.at,reason});else{s.active=id;s.energy-=c.activationCost;s.activatedAt=cmd.at;s.interference=false;s.releasedAt=null;}
 }else if(cmd.action==='interference'){if(s.active)s.interference=true;}else release(cmd.at);}
 advance(Math.max(cursor,time));return s;
}
export const EPISODE1_WING_COMMANDS:readonly WingCommand[]=[{at:25.15,action:'activate',wing:'scout'},{at:31.35,action:'interference'},{at:32.15,action:'release'}];
export const EPISODE1_FINAL_KNOCKS=[69.1,69.8,70.5] as const;
export const EPISODE1_KNOCKS=[.12,.70,1.28,23.05,23.63,24.21,29.00,29.58,30.16,33.12,33.51,33.90,52.70,53.28,53.86,...EPISODE1_FINAL_KNOCKS];
