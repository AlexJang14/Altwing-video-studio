"""Original silent-film soundscape. No recorded/generated speech is used."""
import json,subprocess,wave,sys
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
CFG=json.loads((ROOT/'src/rescue/episodes.json').read_text())
OUT=ROOT/'public/audio/rescue';OUT.mkdir(parents=True,exist_ok=True)
WORK=ROOT/'work/rescue/audio';WORK.mkdir(parents=True,exist_ok=True)
SR=48000
def env(d,a=.02,r=.25):
 t=np.arange(round(d*SR))/SR;return np.minimum(1,t/max(a,.001))*np.minimum(1,(d-t)/max(r,.001))
def tone(f,d):
 t=np.arange(round(d*SR))/SR;return np.sin(2*np.pi*f*t)+.12*np.sin(2*np.pi*f*2.003*t)
events={
1:{'impact':[3.22,31.05,39.4],'knock':[19.65,21.2,29.65,31.0,58.8,62.3],'chirp':[11.7,18.8,26.3,44.3,53.0],'servo':[(2.75,1.1),(31.2,8.5),(41.6,1.5)],'steps':[(13.3,17.5,.47),(31.6,34.8,.32),(35.9,38.5,.30)]},
2:{'impact':[4.65,5.15,31.7,35.2,38.9,43.0,58.7,62.0],'knock':[30.0,32.1,34.8,55.2,60.2],'chirp':[11.8,20.4,25.0,37.0,48.7],'servo':[(2.0,2.8),(9.4,1.3),(29.2,5.2),(47.0,2.3)],'steps':[(13.3,15.5,.53),(17.0,22.5,.49),(36.4,44.8,.34)]},
3:{'impact':[2.8,5.0,25.0,60.0],'knock':[5.0,24.6,58.6,63.1],'chirp':[4.5,8.3,26.0,32.0,43.6,46.0],'servo':[(.8,4.5),(36.8,1.0),(39.5,2.5),(43.5,1.8)],'steps':[(1.0,4.2,.37),(8.0,11.4,.48),(18.0,21.7,.5),(48.0,52.5,.45)]}}
for ep in CFG['episodes']:
 if len(sys.argv)>1 and ep['id']!=int(sys.argv[1]):continue
 d=ep['duration'];rng=np.random.default_rng(8800+ep['id']);audio=np.zeros((SR*d,2));ev=events[ep['id']]
 def add(sig,at,gain=.1,pan=0):
  x=max(0,round(at*SR));y=min(len(audio),x+len(sig));a=sig[:y-x]*gain
  audio[x:y,0]+=a*np.sqrt((1-pan)/2);audio[x:y,1]+=a*np.sqrt((1+pan)/2)
 # Low ship/air circulation and a restrained original harmonic motif.
 noise=rng.normal(0,1,SR*d);air=np.convolve(noise,np.ones(130)/130,mode='same')
 add(air*env(d,1.5,1),0,.11)
 for start in range(0,d,8):
  length=min(8,d-start);warm=(ep['id']==1 and start==8) or (ep['id']==2 and start==8) or (ep['id']==3 and start>=40)
  notes=[65.406,130.813,196.0,261.626] if warm else [36.708,73.416,110.0,155.563]
  for i,f in enumerate(notes):add(tone(f,length)*env(length,.8,.9),start,.018 if warm else .014,(-1)**i*.6)
 # Filtered breathing/pressure circulation: air only, no vocal performance.
 for at in np.arange(1.8,d-7,4.7):
  length=1.65;t=np.arange(round(length*SR))/SR
  breath=np.convolve(rng.normal(size=len(t)),np.ones(35)/35,mode='same')*np.sin(np.pi*t/length)**2
  add(breath,at,.038,.08)
 for at in ev['impact']:
  length=1.1;t=np.arange(round(length*SR))/SR
  sig=(np.sin(2*np.pi*(37*t+8*(1-np.exp(-t*8))))+.12*rng.normal(size=len(t)))*np.exp(-t*7)
  add(sig,at,.30)
 for i,at in enumerate(ev['knock']):
  length=.7;t=np.arange(round(length*SR))/SR
  sig=(np.sin(2*np.pi*86*t)+.19*np.sin(2*np.pi*367*t)+.05*rng.normal(size=len(t)))*np.exp(-t*13)
  add(sig,at,.19,(-1)**i*.45)
 for i,at in enumerate(ev['chirp']):
  length=.22;t=np.arange(round(length*SR))/SR
  add(np.sin(2*np.pi*(790*t+380*t*t))*env(length,.015,.12),at,.035,-.25)
 for i,(at,length) in enumerate(ev['servo']):
  t=np.arange(round(length*SR))/SR;filtered=np.convolve(rng.normal(size=len(t)),np.ones(24)/24,mode='same')
  sig=(filtered*.25+np.sin(2*np.pi*(165*t+12*t*t))*.14)*env(length,.12,.3)
  add(sig,at,.11,(-1)**i*.3)
 precise=ROOT/f'work/rescue/footsteps-{ep["id"]}.json'
 steps=json.loads(precise.read_text()) if precise.exists() else [{'at':float(at),'small':small} for start,end,period in ev['steps'] for small in [False,True] for at in np.arange(start+(.14 if small else 0),end,period*(.71 if small else 1))]
 for event in steps:
  small=event['small'];length=.16;t=np.arange(round(length*SR))/SR
  sig=(np.sin(2*np.pi*(190 if small else 78)*t)+.08*rng.normal(size=len(t)))*np.exp(-t*(44 if small else 31))
  if ep['id']!=2:sig+=.08*np.sin(2*np.pi*870*t)*np.exp(-t*24)
  add(sig,event['at'],.045 if small else .10,-.2 if small else .2)
 # Quiet the emotional checks and timestamp revelations; let one sound matter.
 quiet=[(8.0,11.4),(25.4,28.4)] if ep['id']==1 else [(6.0,11.7)] if ep['id']==2 else [(30,34.7),(47.0,49.0)]
 for a,b in quiet:
  x=int(a*SR);y=int(b*SR);audio[x:y]*=.54
 audio[-SR:]*=np.linspace(1,0,SR)[:,None]
 wav=WORK/f'episode-{ep["id"]}.wav'
 with wave.open(str(wav),'wb')as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((np.clip(audio,-.96,.96)*32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-af',f'loudnorm=I=-20:TP={-2.5 if ep["id"]==3 else -1.5}:LRA=11','-c:a','libmp3lame','-b:a','192k','-ar',str(SR),str(OUT/f'episode-{ep["id"]}.mp3')],check=True)
 print(ep['id'],'silent soundtrack',d,'seconds',flush=True)
(OUT/'PROVENANCE.txt').write_text('All music, air/ship ambience, pressure, mechanical impacts, chirps and footsteps are deterministic original synthesis in scripts/rescue_audio.py. No narration, dialogue, speech model, external voice service, copyrighted recording or paid API is used. Main programme mix target: -20 LUFS, -1.5 dBTP. Foot contact event files, when present, are extracted from the actual animation.\n')
