#!/usr/bin/env python3
"""Synthesize the episode's original, deterministic score and sound effects.

No sampled recordings, network services, API keys, or third-party music.
"""
from pathlib import Path
import wave
import numpy as np

SR = 48000
LENGTH = 25
rng = np.random.default_rng(1801)
mix = np.zeros((SR * LENGTH, 2), dtype=np.float64)

def add(signal, start, gain=1, pan=0):
    begin = int(start * SR)
    signal = np.asarray(signal) * gain
    end = min(len(mix), begin + len(signal))
    if end <= begin:
        return
    signal = signal[:end-begin]
    mix[begin:end, 0] += signal * np.sqrt((1-pan)/2)
    mix[begin:end, 1] += signal * np.sqrt((1+pan)/2)

def tone(freq, duration, amplitude=1):
    t = np.arange(int(duration*SR))/SR
    return (np.sin(2*np.pi*freq*t) + .18*np.sin(2*np.pi*freq*2.002*t)) * amplitude

def envelope(duration, attack=.04, release=.15):
    t = np.arange(int(duration*SR))/SR
    return np.minimum(1,t/max(.001,attack))*np.minimum(1,(duration-t)/max(.001,release))

# Evolving D-minor harmony; slow, quiet movement leaves space for captions.
chords = [(0,8,[73.416,110,146.832,174.614]),
          (8,5,[73.416,110,164.814,220]),
          (13,5,[58.270,116.541,174.614,220,293.665]),
          (18,3,[65.406,97.999,138.591,195.998]),
          (21,4,[73.416,110,146.832,164.814])]
for start,duration,frequencies in chords:
    t=np.arange(int(duration*SR))/SR
    for i,f in enumerate(frequencies):
        pad=(tone(f,duration)+.35*tone(f*.998,duration)+.3*tone(f*1.002,duration))
        pad*=envelope(duration,min(1.1,duration/3),.8)*(.84+.16*np.sin(2*np.pi*.16*t+i))
        add(pad,start,.025,-.7+i*.3)

# Continuous ship sub-bass and a restrained rhythmic pulse before the choice.
ambient=tone(38,LENGTH)*.014+tone(57,LENGTH)*.006
add(ambient*envelope(LENGTH,1,1.2),0)
for at in np.arange(.2,20.5,.84):
    t=np.arange(int(.25*SR))/SR
    beat=np.sin(2*np.pi*(55*t+18*(1-np.exp(-t*12))))*np.exp(-t*19)
    add(beat,at,.055)

# Urgent two-tone alarm. Stop it when Wangdoo is revealed.
for at in np.arange(.05,7.8,.8):
    d=.27;t=np.arange(int(d*SR))/SR
    sig=np.sin(2*np.pi*(740*t+40*t*t))*envelope(d,.012,.08)
    add(sig,at,.050,-.35)
    add(tone(620,.16)*envelope(.16,.01,.06),at+.31,.029,.35)

# Astronaut and Wangdoo footfalls.
for start,end,period,small in [(4.08,7.85,.33,False),(8.15,10.48,.24,True),(13.05,15.8,.42,False),(13.04,15.8,.28,True)]:
    for i,at in enumerate(np.arange(start,end,period)):
        d=.10 if small else .17;t=np.arange(int(d*SR))/SR
        f=290 if small else 92
        body=np.sin(2*np.pi*f*t)*np.exp(-t*(48 if small else 28))
        grit=rng.normal(0,1,len(t))*np.exp(-t*75)*(.10 if small else .16)
        add(body+grit,at,.060 if small else .11,(-1 if i%2 else 1)*.24)

# Falling sparks and electrical snaps.
for at in [.2,1.1,4.3,5.05,5.9,6.6,7.4]:
    d=.18;t=np.arange(int(d*SR))/SR
    noise=rng.normal(0,1,len(t));noise=np.diff(noise,prepend=noise[0])
    add(noise*np.exp(-t*38),at,.038,.55)

# Wangdoo's tiny mechanical greeting and the navigation hologram.
for at,base in [(8.18,880),(8.37,1174),(8.57,1046),(11.0,1318),(11.2,1568)]:
    d=.11;t=np.arange(int(d*SR))/SR
    sig=np.sin(2*np.pi*(base*t+base*.2*t*t))*envelope(d,.01,.05)
    add(sig,at,.035,-.4)
for i,f in enumerate([293.665,440,587.33,880,1174.66]):
    d=1.1;sig=tone(f,d)*np.exp(-np.arange(int(d*SR))/SR*4)*envelope(d,.01,.2)
    add(sig,15.7+i*.07,.035,(-.5+i*.25))

# Planet-reveal impact and crisis shudder, then a deliberate musical pause.
for at,gain in [(13.25,.16),(18.03,.23)]:
    d=1.5;t=np.arange(int(d*SR))/SR
    boom=np.sin(2*np.pi*(36*t+25*(1-np.exp(-t*2))))*np.exp(-t*3)
    boom+=rng.normal(0,.20,len(t))*np.exp(-t*8)
    add(boom,at,gain)
pause_a,pause_b=int(20.25*SR),int(21.0*SR)
mix[pause_a:pause_b]*=np.linspace(1,.08,pause_b-pause_a)[:,None]
for i,f in enumerate([293.665,349.228,440]):
    d=2.5;t=np.arange(int(d*SR))/SR
    add(tone(f,d)*np.exp(-t*2.0)*envelope(d,.015,.4),21.1+i*.12,.037,i*.4-.4)
mix[-int(.8*SR):]*=np.linspace(1,0,int(.8*SR))[:,None]
peak=float(np.max(np.abs(mix)))
mix*=.77/max(peak,.77)
pcm=(np.tanh(mix)*32767).astype('<i2')
path=Path(__file__).resolve().parents[1]/'public/audio/episode-score.wav'
path.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(path),'wb') as out:
    out.setnchannels(2);out.setsampwidth(2);out.setframerate(SR);out.writeframes(pcm.tobytes())
print(f'{path}: {LENGTH}s, stereo {SR}Hz; original synthesized audio')
