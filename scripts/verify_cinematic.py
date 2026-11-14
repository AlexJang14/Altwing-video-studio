"""Verify the actual exported movies, including every decoded video frame."""
import json,subprocess,hashlib,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
EPISODES=json.loads((ROOT/'src/cinematic/episodes.json').read_text())['episodes']
out=[]
for ep in EPISODES:
 p=ROOT/'work/cinematic/renders'/ep['file']
 if not p.exists():raise SystemExit(f'Missing {p}')
 data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-count_frames','-of','json',str(p)]))
 v=next(s for s in data['streams'] if s['codec_type']=='video');a=next(s for s in data['streams'] if s['codec_type']=='audio')
 assert (v['width'],v['height'])==(1080,1920)
 assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
 assert v['r_frame_rate']=='30/1' and int(v['nb_read_frames'])==ep['duration']*30
 assert abs(float(data['format']['duration'])-ep['duration'])<.1
 assert a['codec_name']=='aac' and a['channels']==2
 assert v.get('color_space')=='bt709'
 decode=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],capture_output=True,text=True,check=True)
 assert not decode.stderr,decode.stderr
 # The requested crash impact cut in E2 is exactly frames 124–127. It is
 # documented here so it cannot be confused with an accidental blank frame.
 black=subprocess.run(['ffmpeg','-v','info','-i',str(p),'-vf','blackdetect=d=0.1:pix_th=0.02:pic_th=0.98','-an','-f','null','-'],capture_output=True,text=True,check=True)
 blackevents=[line.split(']')[-1].strip() for line in black.stderr.splitlines() if 'black_start:' in line]
 for line in blackevents:
  parts=dict(x.split(':') for x in line.split() if ':' in x)
  assert ep['id']==2 and abs(float(parts['black_start'])-124/30)<.08 and float(parts['black_duration'])<.2,line
 result={'episode':ep['id'],'file':p.name,'duration':data['format']['duration'],'size':p.stat().st_size,'video':{k:v.get(k) for k in ['codec_name','width','height','pix_fmt','r_frame_rate','nb_read_frames','color_space']},'audio':{k:a.get(k) for k in ['codec_name','sample_rate','channels']},'fullDecode':'pass','blackEvents':blackevents,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
 out.append(result);print(json.dumps(result),flush=True)
(ROOT/'work/cinematic/renders/validation.json').write_text(json.dumps(out,indent=2)+'\n')
