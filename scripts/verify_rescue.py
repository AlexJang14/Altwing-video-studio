"""Verify the actual exported movies, including every decoded video frame."""
import json,subprocess,hashlib,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
EPISODES=json.loads((ROOT/'src/rescue/episodes.json').read_text())['episodes']
selected=int(sys.argv[1]) if len(sys.argv)>1 else None
report=ROOT/'work/rescue/renders/validation.json'
out=[r for r in json.loads(report.read_text()) if r['episode']!=selected] if selected and report.exists() else []
for ep in EPISODES:
 if selected and ep['id']!=selected:continue
 p=ROOT/'work/rescue/renders'/ep['file']
 if not p.exists():raise SystemExit(f'Missing {p}')
 data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-count_frames','-of','json',str(p)]))
 v=next(s for s in data['streams'] if s['codec_type']=='video');a=next(s for s in data['streams'] if s['codec_type']=='audio')
 assert (v['width'],v['height'])==(1080,1920)
 assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
 assert v['r_frame_rate']=='30/1' and int(v['nb_read_frames'])==ep['duration']*30
 assert abs(float(data['format']['duration'])-ep['duration'])<.1
 assert a['codec_name']=='aac' and a['channels']==2
 assert abs(float(v['start_time']))<.001 and abs(float(a['start_time']))<.001,'Picture/audio timestamp offset'
 assert v.get('color_space')=='bt709'
 decode=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],capture_output=True,text=True,check=True)
 assert not decode.stderr,decode.stderr
 black=subprocess.run(['ffmpeg','-v','info','-i',str(p),'-vf','blackdetect=d=0.1:pix_th=0.02:pic_th=0.98','-an','-f','null','-'],capture_output=True,text=True,check=True)
 blackevents=[line.split(']')[-1].strip() for line in black.stderr.splitlines() if 'black_start:' in line]
 assert not blackevents,blackevents
 result={'episode':ep['id'],'file':p.name,'duration':data['format']['duration'],'size':p.stat().st_size,'video':{k:v.get(k) for k in ['codec_name','width','height','pix_fmt','r_frame_rate','nb_read_frames','color_space']},'audio':{k:a.get(k) for k in ['codec_name','sample_rate','channels']},'fullDecode':'pass','blackEvents':blackevents,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
 out.append(result);print(json.dumps(result),flush=True)
report.write_text(json.dumps(sorted(out,key=lambda r:r['episode']),indent=2)+'\n')
