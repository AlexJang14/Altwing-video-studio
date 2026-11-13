#!/usr/bin/env python3
"""Original deterministic score and sound design for First Contact."""
from pathlib import Path
import subprocess,wave
import numpy as np

SR=48000;LENGTH=25
rng=np.random.default_rng(2002)
audio=np.zeros((SR*LENGTH,2),dtype=np.float64)
def add(signal,start,gain=1,pan=0):
 a=max(0,int(start*SR));b=min(len(audio),a+len(signal));s=signal[:b-a]*gain
 audio[a:b,0]+=s*np.sqrt((1-pan)/2);audio[a:b,1]+=s*np.sqrt((1+pan)/2)
def env(d,a=.04,r=.3):
 t=np.arange(round(d*SR))/SR
 return np.minimum(1,t/max(a,.001))*np.minimum(1,(d-t)/max(r,.001))
def tone(f,d):
 t=np.arange(round(d*SR))/SR
 return np.sin(2*np.pi*f*t)+.16*np.sin(2*np.pi*f*2.002*t)
def bell(f,d=1.8):
 t=np.arange(round(d*SR))/SR
 return (np.sin(2*np.pi*f*t)+.26*np.sin(2*np.pi*f*2.76*t))*np.exp(-t*3)*env(d,.008,.35)

# Quiet wonder, warmth around Wangdoo, then an unresolved answer from the gate.
chords=[(0,4,[55,110,164.814,246.942]),(4,4,[55,110,164.814,207.652]),
 (8,4,[73.416,146.832,184.997,220,329.628]),
 (12,5,[73.416,146.832,220,277.183,369.994]),
 (17,4,[61.735,123.471,174.614,261.626]),(21,4,[55,110,164.814,246.942])]
for start,d,notes in chords:
 t=np.arange(round(d*SR))/SR
 for i,f in enumerate(notes):
  pad=tone(f,d)+.25*tone(f*.998,d)+.25*tone(f*1.002,d)
  add(pad*env(d,.85,.8)*(.91+.09*np.sin(t*.9+i)),start,.025,-.65+i*.27)

# Alien wind: filtered original noise, not a sampled recording.
noise=rng.normal(0,1,SR*LENGTH)
wind=np.convolve(noise,np.ones(170)/170,mode='same')
add(wind*env(LENGTH,1.2,1.5),0,.12,-.15)
add(tone(35,LENGTH)*env(LENGTH,1,1.3),0,.011)

# Atmospheric entry, engine spool-down, and a grounded landing.
d=3.5;t=np.arange(round(d*SR))/SR
entry=(np.sin(2*np.pi*(62*t-3*t*t))+.3*rng.normal(0,1,len(t)))*env(d,.6,.9)
add(entry,0,.055)
d=.85;t=np.arange(round(d*SR))/SR
add((np.sin(2*np.pi*(39*t+12*(1-np.exp(-t*8))))+.15*rng.normal(0,1,len(t)))*np.exp(-t*7),3.12,.19)
d=.8;t=np.arange(round(d*SR))/SR
servo=np.convolve(rng.normal(0,1,len(t)),np.ones(15)/15,mode='same')
add((servo*.6+np.sin(2*np.pi*(310*t-60*t*t))*.09)*env(d,.10,.25),4.10,.045,.22)

# Tiny padded steps, alongside the astronaut's heavier footfalls.
for start,end,period,small in [(4.62,7.36,.37,True),(5.14,7.9,.53,False)]:
 for i,at in enumerate(np.arange(start,end,period)):
  d=.11 if small else .17;t=np.arange(round(d*SR))/SR
  sig=np.sin(2*np.pi*(230 if small else 86)*t)*np.exp(-t*(42 if small else 28))
  sig+=rng.normal(0,.07 if small else .11,len(t))*np.exp(-t*66)
  add(sig,at,.064 if small else .105,(-1 if i%2 else 1)*.22)

# Friendly robot chirps and the plant opening in reply.
for at,f in [(8.75,1046.5),(8.93,1318.5),(10.18,1174.66),(12.92,1318.5),(13.12,1568)]:
 add(bell(f,.22),at,.027,-.35)
for i,f in enumerate([587.33,739.99,880,1108.73,1318.51]):
 add(bell(f,2.5),13.2+i*.12,.036,-.65+i*.3)
for at,f in [(9.1,659.25),(11.2,739.99),(14.8,880),(16,1108.73)]:
 add(bell(f,2.2),at,.017,.4)

# Ancient mechanism answering: low resonance, followed by a deliberate pause.
d=2.2;t=np.arange(round(d*SR))/SR
gate=(np.sin(2*np.pi*46.25*t)+.3*np.sin(2*np.pi*69.3*t))*env(d,.25,.9)
add(gate,17.3,.10)
for i,f in enumerate([246.94,369.99,493.88]):add(bell(f,2.8),17.65+i*.16,.04,i*.4-.4)
a,b=int(20.1*SR),int(21*SR);audio[a:b]*=np.linspace(1,.13,b-a)[:,None]
for i,f in enumerate([440,554.365,659.255]):add(bell(f,2.5),21.1+i*.15,.035,i*.35-.35)
audio[-SR:]*=np.linspace(1,0,SR)[:,None]
audio*=.85/max(.85,np.max(np.abs(audio)))
pcm=(np.tanh(audio)*32767).astype('<i2')
path=Path(__file__).resolve().parents[1]/'public/audio/episode2-score.wav'
path.parent.mkdir(exist_ok=True,parents=True)
with wave.open(str(path),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes(pcm.tobytes())
master=path.with_name('episode2-score.master.wav')
subprocess.run(['ffmpeg','-v','error','-y','-i',str(path),'-af','loudnorm=I=-18:TP=-1.5:LRA=9','-ar',str(SR),'-c:a','pcm_s16le',str(master)],check=True)
master.replace(path)
print(f'{path}: original 25-second stereo score and effects')
