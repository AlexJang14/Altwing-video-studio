"""Original non-speech soundscape, mixed below one licensed local narrator."""
from pathlib import Path
import numpy as np,wave,json,subprocess
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'work/empty-room/audio';OUT.mkdir(parents=True,exist_ok=True);SR=48000;D=68;rng=np.random.default_rng(333);fx=np.zeros((D*SR,2));voice=np.zeros_like(fx)

def mapped(old):
 knots=[(0,0),(3,3),(8,10),(15,17),(27,27),(39,36),(45,46),(52,54),(60.25,61),(70,68)]
 for i in range(1,len(knots)):
  a,b=knots[i-1];c,d=knots[i]
  if old<=c:return b+(old-a)*(d-b)/(c-a)
 return 68

def env(n,attack=.012,release=.12):
 t=np.arange(n)/SR;return np.minimum(1,t/max(attack,.001))*np.minimum(1,(n/SR-t)/max(release,.001))
def add(a,at,gain=.1,pan=0):
 x=round(at*SR);y=min(len(fx),x+len(a));fx[x:y,0]+=a[:y-x]*gain*np.sqrt((1-pan)/2);fx[x:y,1]+=a[:y-x]*gain*np.sqrt((1+pan)/2)
def sine(f,d):t=np.arange(round(d*SR))/SR;return np.sin(2*np.pi*f*t)
# Mostly room tone. Exterior space is sparse; engines are heard as cabin vibration.
noise=rng.normal(size=D*SR);air=np.convolve(noise,np.ones(95)/95,mode='same');add(air,0,.055)
for at,d in [(6.08,10.9),(17,8),(27,9),(43,18)]:add(sine(52,d)*env(round(d*SR),.4,.5),at,.012)
# A quiet original three-note companion motif, used sparingly.
for start in [10.2,61.0]:
 for i,f in enumerate([196.0,261.626,293.665]):
  t=np.arange(round(2.6*SR))/SR;add((np.sin(2*np.pi*f*t)+.16*np.sin(2*np.pi*f*2*t))*np.exp(-t*1.6)*env(len(t),.03,.5),start+i*.8,.010,-.3+i*.3)
# A distinctive recurring triple knock: tactile wood/metal resonance, no jump-scare burst.
knocks=[(.12,.10),(.57,.10),(1.02,.10),(24.0,.23),(24.6,.23),(25.2,.25),(32.15,.30),(32.7,.30),(33.25,.32),(48.1,.20),(48.65,.20),(49.2,.22),(55.8,.19),(56.35,.19),(56.9,.21),(59.0,.18)]
for old,gain in knocks:
 at=mapped(old)
 if old<2:gain=.32
 t=np.arange(round(.75*SR))/SR;a=(np.sin(2*np.pi*92*t)+.29*np.sin(2*np.pi*217*t)+.075*rng.normal(size=len(t)))*np.exp(-t*15);add(a*env(len(t),.003,.10),at,gain,-.40)
for at in [mapped(6.95)]:
 t=np.arange(round(1.0*SR))/SR;add((np.sin(2*np.pi*39*t)+.10*rng.normal(size=len(t)))*np.exp(-t*6),at,.25)
for at,d in [(17.0,1.0),(mapped(10.8),.35)]:
 t=np.arange(round(d*SR))/SR;a=(np.convolve(rng.normal(size=len(t)),np.ones(27)/27,mode='same')+.1*np.sin(2*np.pi*165*t))*env(len(t),.10,.15);add(a,at,.08)
for at in [mapped(27.3),36.15]:
 t=np.arange(round(.22*SR))/SR;add(np.sin(2*np.pi*(620*t+420*t*t))*env(len(t),.01,.12),at,.036,.25)
for at in [mapped(34.05),mapped(34.19),mapped(34.32)]:
 t=np.arange(round(.08*SR))/SR;add(rng.normal(size=len(t))*env(len(t),.002,.03),at,.025,-.3)
add((sine(38,3)+.20*sine(57,3))*env(3*SR,.25,1.5),40.7,.037)
for at in [42.2,46.5,52,57.0,60.1]:add(sine(760,.12)*env(round(.12*SR),.006,.08),at,.025,.3)
# Precise actual-foot landings replace these draft footsteps when the motion pass exists.
file=ROOT/'work/empty-room/footsteps.json'
steps=json.loads(file.read_text())if file.exists()else[{'at':x,'small':s}for start,end in [(9.1,9.9),(15.8,17.8),(24,26.5),(31,32),(34.4,36.4)]for s in [False,True]for x in np.arange(start+(0.12 if s else 0),end,.52 if not s else .32)]
for e in steps:
 t=np.arange(round(.16*SR))/SR;small=e['small'];add((np.sin(2*np.pi*(170 if small else 83)*t)+.05*rng.normal(size=len(t)))*np.exp(-t*(40 if small else 28)),e['at'],.034 if small else .08,-.2 if small else .2)
# No score before the important knocks. Keep the narrator above ambience.
for a,b in [(23.5,27),(30.5,33.0)]:fx[int(a*SR):int(b*SR)]*=.85
entries=json.loads((ROOT/'public/empty-room/voice-timing.json').read_text());mask=np.zeros(D*SR)
for e in entries:
 raw=OUT/f'voice-{e["file"].split("/")[-1]}'
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(ROOT/'public'/e['file']),'-ar',str(SR),'-ac','1',str(raw)],check=True)
 with wave.open(str(raw),'rb')as f:a=np.frombuffer(f.readframes(f.getnframes()),np.int16).astype(float)/32768
 x=round(e['at']*SR);y=min(len(voice),x+len(a));voice[x:y,0]+=a[:y-x]*.79;voice[x:y,1]+=a[:y-x]*.79;mask[max(0,x-int(.04*SR)):min(len(mask),y+int(.08*SR))]=1
mask=np.convolve(mask,np.ones(2401)/2401,mode='same');fx*=1-mask[:,None]*.55;fx[-int(.4*SR):]*=np.linspace(1,0,int(.4*SR))[:,None]
def wav(p,a):
 with wave.open(str(p),'wb')as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((np.clip(a,-.98,.98)*32767).astype('<i2').tobytes())
wav(OUT/'fx.wav',fx);wav(OUT/'narration.wav',voice);wav(OUT/'mix-raw.wav',fx+voice)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(OUT/'mix-raw.wav'),'-af','loudnorm=I=-16:TP=-1.8:LRA=9','-ar',str(SR),str(OUT/'master.wav')],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(OUT/'master.wav'),'-c:a','libmp3lame','-b:a','256k',str(ROOT/'public/empty-room/master.mp3')],check=True)
print('68-second master: one original stock narrator and original non-speech sound design.',flush=True)
