#!/usr/bin/env python3
"""Free local neural dialogue, original score and deterministic sound design.

LJ Speech is public domain. Run with work/cinematic/tts-venv/bin/python.
No paid service or external voice API is used.
"""
from pathlib import Path
import json, subprocess, wave, urllib.request, shutil
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
CFG=json.loads((ROOT/'src/cinematic/episodes.json').read_text())
WORK=ROOT/'work/cinematic/voices'
OUT=ROOT/'public/audio/cinematic'
WORK.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
BASE='https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ljspeech/medium/en_US-ljspeech-medium'
for suffix in ['.onnx','.onnx.json']:
 p=WORK/('ljspeech'+suffix)
 if not p.exists():urllib.request.urlretrieve(BASE+suffix,p)
from piper import PiperVoice,SynthesisConfig
voice=PiperVoice.load(str(WORK/'ljspeech.onnx'))
SR=48000
def probe(p):
 return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]))
def pcm(p):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-ar',str(SR),'-ac','1','-f','f32le','-']),dtype='<f4')
def wav(p,a):
 with wave.open(str(p),'wb') as f:f.setnchannels(2 if a.ndim==2 else 1);f.setsampwidth(2);f.setframerate(SR);f.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
def envelope(d,attack=.02,release=.2):
 t=np.arange(round(d*SR))/SR
 return np.minimum(1,t/max(.001,attack))*np.minimum(1,(d-t)/max(.001,release))
def tone(f,d):
 t=np.arange(round(d*SR))/SR
 return np.sin(2*np.pi*f*t)+.12*np.sin(2*np.pi*f*2.001*t)
def bell(f,d=.8):
 t=np.arange(round(d*SR))/SR
 return (np.sin(2*np.pi*f*t)+.2*np.sin(2*np.pi*f*2.76*t))*np.exp(-t*5)*envelope(d,.008,.15)

for ep in CFG['episodes']:
 rng=np.random.default_rng(4200+ep['id'])
 n=round(ep['duration']*SR);dialogue=np.zeros((n,2));score=np.zeros_like(dialogue);mouth=np.zeros(ep['duration']*30)
 timings=[]
 def add(a,at,gain=.1,pan=0):
  start=round(at*SR);end=min(n,start+len(a));a=a[:end-start]*gain
  if a.ndim==1:score[start:end,0]+=a*np.sqrt((1-pan)/2);score[start:end,1]+=a*np.sqrt((1+pan)/2)
  else:score[start:end]+=a
 for i,c in enumerate(ep['dialogue']):
  stem=f"e{ep['id']}-{i:02d}"
  raw=WORK/(stem+'-raw.wav');final=WORK/(stem+'.wav')
  if not raw.exists():
   with wave.open(str(raw),'wb') as f:voice.synthesize_wav(c['text'],f,SynthesisConfig(length_scale=.85 if c['who']=='wangdoo' else .93,noise_scale=.43,noise_w_scale=.55))
  # Separate stable character timbres, with gentle EQ rather than heavy distortion.
  pitch=1.13 if c['who']=='wangdoo' else .96
  maxd=c['end']-c['at']-.04
  rawd=probe(raw);tempo=max(.92,rawd/pitch/maxd)
  eq='highpass=f=170,equalizer=f=2600:t=q:w=1:g=2' if c['who']=='wangdoo' else 'highpass=f=90,equalizer=f=190:t=q:w=.8:g=1'
  filt=f'asetrate=22050*{pitch},aresample=48000,atempo={tempo},{eq},loudnorm=I=-17:TP=-2:LRA=6,afade=t=out:st={max(0,maxd-.04)}:d=0.04'
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af',filt,'-t',str(maxd),str(final)],check=True)
  a=pcm(final);start=round(c['at']*SR);end=min(n,start+len(a));a=a[:end-start]
  pan=-.12 if c['who']=='wangdoo' else 0
  dialogue[start:end,0]+=a*np.sqrt((1-pan)/2);dialogue[start:end,1]+=a*np.sqrt((1+pan)/2)
  if c['who']=='wangdoo':
   for frame in range(int(c['at']*30),min(len(mouth),int((c['at']+len(a)/SR)*30)+1)):
    x=max(0,round((frame/30-c['at'])*SR));part=a[x:x+SR//30]
    if len(part):mouth[frame]=min(1,float(np.sqrt(np.mean(part*part)))*11)
  timings.append({**c,'duration':len(a)/SR,'timeCompression':round(tempo,3),'pitchRatio':pitch})
  print(stem,c['who'],round(len(a)/SR,2),c['text'],flush=True)
 # Original harmonic score: crisis, comic relief, teamwork, wonder, threat, choice.
 notes=[[55,110,164.81,220],[65.41,130.81,196,261.63],[73.42,146.83,220,293.66],[61.74,123.47,185,246.94]]
 for j,s in enumerate(ep['scenes']):
  d=s['end']-s['start'];ch=notes[(j+(ep['id']-1)*2)%4]
  for k,f in enumerate(ch):add(tone(f,d)*envelope(d,.45,.6),s['start'],.026,-.7+k*.45)
  if j in [0,1,4,5,6]:
   for at in np.arange(s['start']+.15,s['end'],.48):
    t=np.arange(int(SR*.18))/SR
    add(np.sin(2*np.pi*(65*t+5*(1-np.exp(-t*14))))*np.exp(-t*28),at,.07)
  if j in [2,3,7]:
   for k,at in enumerate(np.arange(s['start']+.35,s['end']-.2,.78)):add(bell(ch[2]*[2,2.5,3,4][k%4],.7),at,.017,(-1)**k*.4)
 # Filtered ship/planet ambience.
 noise=rng.normal(size=n);wind=np.convolve(noise,np.ones(100)/100,mode='same')
 add(wind*envelope(ep['duration'],.3,1),0,.065)
 def impact(at,gain=.18):
  d=.85;t=np.arange(round(d*SR))/SR
  add((np.sin(2*np.pi*(38*t+8*(1-np.exp(-t*9))))+.22*rng.normal(size=len(t)))*np.exp(-t*8),at,gain)
 def chirp(at,f=1200):add(bell(f,.25),at,.035,-.25)
 def step(at,small=False):
  d=.15;t=np.arange(round(d*SR))/SR
  add((np.sin(2*np.pi*(210 if small else 80)*t)+rng.normal(0,.12,len(t)))*np.exp(-t*36),at,.06 if small else .09)
 if ep['id']==1:
  for at in [.45,1.35,8.7,10.4,17.13,23.9,38.4]:impact(at,.12 if at!=17.13 else .22)
  for at in np.arange(2.65,7,.46):step(at)
  for at in np.arange(12.15,14.5,.38):step(at,True)
  for at in [12.5,14.5,26.05,33.0,36.0]:chirp(at)
  for at in [24.1,24.3,25.6]:chirp(at,2300)
  for f,at in [(523,25.5),(659,25.7),(784,25.9)]:add(bell(f,1.6),at,.055)
 else:
  for at,gain in [(3.9,.27),(4.15,.3),(7.55,.19),(21.7,.17),(23.4,.14),(25.6,.18),(28.1,.2),(30.2,.16),(35.5,.2),(43.4,.23),(48,.2),(51.1,.22)]:impact(at,gain)
  for at in np.arange(5.1,6.6,.4):step(at,True)
  for at in np.arange(28,36.7,.36):step(at)
  for at in np.arange(28.1,32.5,.27):step(at,True)
  for at in [12.7,14.6,15.5]:chirp(at)
  for at in np.arange(16.4,20,.55):
   d=.21;t=np.arange(round(d*SR))/SR;add(np.sin(2*np.pi*(880*t+140*t*t))*envelope(d),at,.07)
  d=2.8;t=np.arange(round(d*SR))/SR
  add((np.sin(2*np.pi*(90*t+100*t*t))+.14*rng.normal(size=len(t)))*envelope(d,.15,.5),32,.10,-.2)
 # Duck music/effects under every spoken phrase with smooth attack/release.
 duck=np.ones(n)
 for c in timings:
  a=max(0,round((c['at']-.14)*SR));b=min(n,round((c['at']+c['duration']+.18)*SR))
  d=b-a;shape=np.ones(d)*.39;fade=min(int(.13*SR),d//2)
  shape[:fade]=np.linspace(1,.39,fade);shape[-fade:]=np.linspace(.39,1,fade)
  duck[a:b]=np.minimum(duck[a:b],shape)
 score*=duck[:,None];score[-int(SR*.65):]*=np.linspace(1,0,int(SR*.65))[:,None]
 mix=dialogue+score
 wav(WORK/f'e{ep["id"]}-mix.wav',mix)
 target=OUT/f'episode-{ep["id"]}.mp3'
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(WORK/f'e{ep["id"]}-mix.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=8','-ar',str(SR),'-c:a','libmp3lame','-b:a','192k',str(target)],check=True)
 (OUT/f'episode-{ep["id"]}-cue-timing.json').write_text(json.dumps(timings,indent=2)+'\n')
 (ROOT/f'src/cinematic/mouth-{ep["id"]}.json').write_text(json.dumps([round(x,3) for x in mouth])+'\n')
 print('Finished',target,flush=True)

(OUT/'VOICE-LICENSE.txt').write_text('Dialogue generated locally with Piper using the public-domain LJ Speech dataset voice.\nModel: '+BASE+'.onnx\nDataset: https://keithito.com/LJ-Speech-Dataset/\nPiper engine: GPL-3.0, https://github.com/OHF-Voice/piper1-gpl\nNarrator pitch ratio .96; Wangdoo 1.13. These are synthetic character voices.\nAll music, ambience and effects are original deterministic synthesis by cinematic_audio.py.\nNo voice imitation, paid API, purchased sample, or noncommercial model used.\n')
