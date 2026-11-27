"""Checks timing from the actual baked voice cues, not invented narration durations."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[2]
e=json.loads((ROOT/'public/fake-sos/voice-timing.json').read_text());c=json.loads((ROOT/'public/fake-sos/captions.json').read_text());assert len(e)==len(c)==14
for v,s in zip(e,c):assert 0<=v['at']<v['end']<=72 and v['text']==s['text']and abs(v['at']-s['at'])<.00001
for a,b in zip(e,e[1:]):assert a['end']<=b['at']
f=(ROOT/'src/fakeSOS/Film.tsx').read_text();assert f.count('ONE MINUTE EARLIER')==1
r={'voicePhrases':len(e),'captions':len(c),'overlappingPhrases':0,'flashbackLabels':1,'lastNarrationEnd':e[-1]['end'],'decisionHoldSeconds':6.0,'episode2Produced':False}
p=ROOT/'work/fake-sos/story-timing-check.json';p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(r,indent=2));print(r)
