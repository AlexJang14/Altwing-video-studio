"""One licensed stock narrator; phrase-exact subtitle boundaries from real waveform lengths."""
from pathlib import Path
import json,wave,re,sys,os
import numpy as np
import onnxruntime as ort
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parents[2];cfg=json.loads((ROOT/'src/fakeSOS/episode.json').read_text());out=ROOT/'public/fake-sos/voice';out.mkdir(parents=True,exist_ok=True)
o=ort.SessionOptions();o.intra_op_num_threads=2;o.inter_op_num_threads=1
session=ort.InferenceSession(os.environ.get('KOKORO_MODEL',str(ROOT/'work/reset/voice/kokoro-v1.0.int8.onnx')),sess_options=o,providers=['CPUExecutionProvider']);model=Kokoro.from_session(session,str(ROOT/'work/reset/voice/voices-v1.0.bin'))
records=[];captions=[]
def save(p,a,sr):
 with wave.open(str(p),'wb')as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(a,-.98,.98)*32767).astype('<i2').tobytes())
for number,entry in enumerate(cfg['narration']):
 speed=.99;gap=.12 if number in [0,7,9]else .18;limit=entry['until']-entry['at']
 for attempt in range(4):
  takes=[]
  for phrase in entry['phrases']:
   spoken=phrase.replace('Wangdoo','Wong doo').replace('AltWing','Alt Wing');a,sr=model.create(spoken,voice='am_michael',speed=speed,lang='en-us',sentence_pause=.20,clause_pause=.10)
   # Trim only synthesized leading/trailing silence, retaining80ms breath edges.
   active=np.flatnonzero(np.abs(a)>.003)
   if len(active):a=a[max(0,int(active[0]-.055*sr)):min(len(a),int(active[-1]+.070*sr))]
   takes.append((phrase,a,sr))
  duration=sum(len(a)/sr for _,a,sr in takes)+gap*(len(takes)-1)
  if duration<=limit+.015:break
  speed=min(1.22,speed*duration/(limit-.025))
 if duration>limit+.03:raise RuntimeError(f'Cue{number}: {duration:.2f}s exceeds{limit:.2f}s at natural synthesis speed{speed:.3f}')
 at=entry['at']
 for j,(text,a,sr) in enumerate(takes):
  at=entry.get('phraseTimes',[at]*len(takes))[j] if 'phraseTimes'in entry else at
  name=f'{number:02d}-{j:02d}.wav';save(out/name,a,sr);r={'at':round(at,6),'end':round(at+len(a)/sr,6),'duration':len(a)/sr,'text':text,'file':'fake-sos/voice/'+name,'synthesisSpeed':speed};records.append(r);captions.append({k:r[k]for k in ['at','end','text']});at+=len(a)/sr+gap
 print(number,round(duration,3),round(speed,3),'/ slot',round(limit,2),flush=True)
(ROOT/'public/fake-sos/voice-timing.json').write_text(json.dumps(records,indent=2)+'\n');(ROOT/'public/fake-sos/captions.json').write_text(json.dumps(captions,indent=2)+'\n')
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(ROOT/'public/fake-sos/narration.srt').write_text('\n'.join(f'{i+1}\n{stamp(r["at"])} --> {stamp(r["end"])}\n{r["text"]}\n'for i,r in enumerate(records)))
(ROOT/'public/fake-sos/narration-script.txt').write_text('\n'.join(f'{r["at"]:.3f}–{r["end"]:.3f} {r["text"]}'for r in records)+'\n')
print('ONE STOCK NARRATOR COMPLETE — exact phrase audio/subtitle boundaries',flush=True)
