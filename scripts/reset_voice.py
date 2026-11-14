"""One original stock neural narrator; local inference, no external voice service."""
from pathlib import Path
import json,re,wave,numpy as np,subprocess
import onnxruntime as ort
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parents[1];cfg=json.loads((ROOT/'src/reset/episode.json').read_text());OUT=ROOT/'public/reset/voice';OUT.mkdir(exist_ok=True,parents=True)
options=ort.SessionOptions();options.intra_op_num_threads=2;options.inter_op_num_threads=1
session=ort.InferenceSession(str(ROOT/'work/reset/voice/kokoro-v1.0.int8.onnx'),sess_options=options,providers=['CPUExecutionProvider'])
model=Kokoro.from_session(session,str(ROOT/'work/reset/voice/voices-v1.0.bin'))
def save(path,a,sr):
 with wave.open(str(path),'wb')as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(a,-.98,.98)*32767).astype('<i2').tobytes())
records=[]
for i,entry in enumerate(cfg['narration']):
 text=entry['text'].replace('Wangdoo','Wong doo').replace('AltWing','Alt Wing');limit=entry['until']-entry['at'];speed=.86
 a,sr=model.create(text,voice='am_michael',speed=speed,lang='en-us',sentence_pause=.38,clause_pause=.13)
 # Only adjust the synthesis rate within a restrained natural range, never an
 # unnaturally accelerated final waveform. A little room remains for breath.
 duration=len(a)/sr
 if duration>limit:
  speed=min(1.12,speed*duration/(limit-.08));a,sr=model.create(text,voice='am_michael',speed=speed,lang='en-us',sentence_pause=.38,clause_pause=.13);duration=len(a)/sr
 if duration>limit+.08:raise RuntimeError(f'Voice {i} needs {duration:.2f}s; slot {limit:.2f}s')
 # Preserve the model's natural cadence and intentional sentence pauses.
 path=OUT/f'{i:02d}.wav';save(path,a,sr);record={**entry,'file':f'reset/voice/{i:02d}.wav','duration':duration,'synthesisSpeed':speed,'wordCount':len(entry['text'].split())};records.append(record);print(i,round(duration,3),'/',limit,flush=True)
(ROOT/'public/reset/voice-timing.json').write_text(json.dumps(records,indent=2)+'\n')
# Deliver the timing/script as SRT and plain text, including the exact final take.
def stamp(t):
 ms=round(t*1000);h=ms//3600000;ms%=3600000;m=ms//60000;ms%=60000;return f'{h:02}:{m:02}:{ms//1000:02},{ms%1000:03}'
srt=[]
for i,r in enumerate(records):srt.append(f'{i+1}\n{stamp(r["at"])} --> {stamp(r["at"]+r["duration"])}\n{r["text"]}\n')
(ROOT/'public/reset/narration.srt').write_text('\n'.join(srt));(ROOT/'public/reset/narration-script.txt').write_text('\n\n'.join(f'{r["at"]:05.2f}–{r["at"]+r["duration"]:05.2f}  {r["text"]}'for r in records)+'\n')
print('All narrator takes generated locally.',flush=True)
