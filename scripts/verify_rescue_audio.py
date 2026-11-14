"""Measure the actual exported AAC mix, without substituting a source waveform."""
from pathlib import Path
import subprocess,json,sys
root=Path(__file__).resolve().parents[1]
selected=int(sys.argv[1]) if len(sys.argv)>1 else None
results=[]
for ep in json.loads((root/'src/rescue/episodes.json').read_text())['episodes']:
 if selected and ep['id']!=selected:continue
 p=root/'work/rescue/renders'/ep['file']
 measured=subprocess.run(['ffmpeg','-v','info','-i',str(p),'-vn','-af','loudnorm=I=-20:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 payload=measured.stderr[measured.stderr.rfind('{'):];data=json.JSONDecoder().raw_decode(payload)[0]
 lufs=float(data['input_i']);peak=float(data['input_tp']);assert -22<lufs<-18,(p,lufs);assert peak<=-1,(p,peak)
 results.append({'episode':ep['id'],'file':p.name,'integratedLUFS':lufs,'truePeakDBTP':peak,'loudnessRangeLU':float(data['input_lra']),'source':'Original deterministic synthesis; no speech.','pass':True})
report=root/'work/rescue/audio-validation.json';prior=json.loads(report.read_text()) if selected and report.exists() else []
prior=[x for x in prior if x['episode'] not in {r['episode']for r in results}];report.write_text(json.dumps(sorted(prior+results,key=lambda x:x['episode']),indent=2)+'\n');print(json.dumps(results),flush=True)
