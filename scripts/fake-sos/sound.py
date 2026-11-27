"""Original non-speech soundscape, mixed below one licensed local narrator."""
from pathlib import Path
import numpy as np,wave,json,subprocess
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'work/fake-sos/audio';OUT.mkdir(parents=True,exist_ok=True);SR=48000;D=72;rng=np.random.default_rng(333);fx=np.zeros((D*SR,2));voice=np.zeros_like(fx)

def mapped(old):return old

def env(n,attack=.012,release=.12):
 t=np.arange(n)/SR;return np.minimum(1,t/max(attack,.001))*np.minimum(1,(n/SR-t)/max(release,.001))
def add(a,at,gain=.1,pan=0):
 x=round(at*SR);y=min(len(fx),x+len(a));fx[x:y,0]+=a[:y-x]*gain*np.sqrt((1-pan)/2);fx[x:y,1]+=a[:y-x]*gain*np.sqrt((1+pan)/2)
def sine(f,d):t=np.arange(round(d*SR))/SR;return np.sin(2*np.pi*f*t)
# Sparse original soundscape. The station trap and escape each have a distinct dynamic.
noise=rng.normal(size=D*SR);air=np.convolve(noise,np.ones(95)/95,mode='same');add(air,0,.045)
for at,d in [(0,4),(6.8,2.2),(19,12),(37,9),(46,9),(59,12)]:add(sine(48,d)*env(round(d*SR),.35,.6),at,.010)
# Quiet warm three-note motif only with the catch and the successful rescue.
for start in [12.15,54.35]:
 for i,f in enumerate([196,261.626,293.665]):
  t=np.arange(round(2.2*SR))/SR;add((np.sin(2*np.pi*f*t)+.12*np.sin(2*np.pi*f*2*t))*np.exp(-t*1.7)*env(len(t),.025,.5),start+i*.55,.015,-.25+i*.25)
knock_times=[22.65,23.22,23.79,27.10,27.67,28.24,31.45,32.02,32.59,34.10,34.67,35.24]
for at in knock_times:
 t=np.arange(round(.50*SR))/SR;a=(np.sin(2*np.pi*92*t)+.29*np.sin(2*np.pi*217*t)+.05*rng.normal(size=len(t)))*np.exp(-t*17);add(a*env(len(t),.003,.10),at,.24,-.3)
# Dock latch, catch, soft fabric pat, Scout unfold and sonar, physical recorder reveal.
for at,g in [(10.35,.13),(14.32,.08),(16.28,.025),(16.60,.022),(29.99,.06),(30.30,.08),(56.22,.05)]:
 t=np.arange(round(.18*SR))/SR;add((np.sin(2*np.pi*190*t)+.12*rng.normal(size=len(t)))*np.exp(-t*32),at,g)
for at,d in [(23.80,.85),(30.15,.70),(48.40,1.00),(65.0,6.65)]:
 t=np.arange(round(d*SR))/SR;a=(np.convolve(rng.normal(size=len(t)),np.ones(25)/25,mode='same')+.06*np.sin(2*np.pi*105*t))*env(len(t),.08,.12);add(a,at,.085)
for at in [24.65,26.65,28.65,30.65]:
 t=np.arange(round(.16*SR))/SR;add(np.sin(2*np.pi*(580*t+500*t*t))*env(len(t),.01,.10),at,.025,.3)
# Brief strained chirp is a nonverbal companion sound, not robotic dialogue.
for at in [14.13,49.24]:
 t=np.arange(round(.22*SR))/SR;add(np.sin(2*np.pi*(440*t-180*t*t))*env(len(t),.02,.12),at,.025,-.2)
# Live security alert, departure vibration, rail pressure alarm. No random twist sting.
for at in [37.0,37.25,45.9,48.4,49.2,59.1,65.15,69.85]:add(sine(730,.10)*env(round(.10*SR),.006,.06),at,.03,.25)
t=np.arange(round(25.85*SR))/SR;engine=(np.sin(2*np.pi*43*t)+.18*np.sin(2*np.pi*66*t)+.16*np.convolve(rng.normal(size=len(t)),np.ones(37)/37,mode='same'))*env(len(t),2.0,.8);add(engine,45.8,.055)
# Low rhythmic tension enters during the run, then thins to the final choice.
for at in np.arange(46,54.1,.60):add(sine(65,.33)*env(round(.33*SR),.02,.25),at,.024)
for at in [59.2,61.3,63.4,65.5,67.6,69.7]:add((sine(73,1.8)+.22*sine(110,1.8))*env(round(1.8*SR),.25,.6),at,.014)
file=ROOT/'work/fake-sos/footsteps.json'
assert file.exists(),'Run motion pass first: actual landing times required.'
for e in json.loads(file.read_text()):
 t=np.arange(round(.15*SR))/SR;small=e['small'];add((np.sin(2*np.pi*(170 if small else 83)*t)+.05*rng.normal(size=len(t)))*np.exp(-t*(40 if small else 28)),e['at'],.030 if small else .070,-.2 if small else .2)
# Strip back for the physical reveal. Leave no music over the dangerous closing cut.
fx[int(30.8*SR):int(31.4*SR)]*=.08
fx[int(71.65*SR):]=0
entries=json.loads((ROOT/'public/fake-sos/voice-timing.json').read_text());mask=np.zeros(D*SR)
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
subprocess.run(['ffmpeg','-v','error','-y','-i',str(OUT/'master.wav'),'-c:a','libmp3lame','-b:a','256k',str(ROOT/'public/fake-sos/master.mp3')],check=True)
print('72-second master: one original stock narrator and original non-speech sound design.',flush=True)

subprocess.run(['ffmpeg','-v','error','-y','-i',str(OUT/'master.wav'),'-c:a','aac','-b:a','192k','-ar',str(SR),str(ROOT/'public/fake-sos/final-mix.m4a')],check=True)
