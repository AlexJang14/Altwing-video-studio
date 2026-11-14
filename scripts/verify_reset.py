"""Verify the actual delivery file, including complete decode and audio level."""
import json,subprocess,sys,hashlib,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];mode=sys.argv[1]if len(sys.argv)>1 else'final'
file=ROOT/f'work/reset/renders/the-last-wing-ep01-dont-open-the-door-{mode}.mp4'
out=ROOT/'work/reset';assert file.exists()
data=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(file)]))
v=next(x for x in data['streams']if x['codec_type']=='video');a=next(x for x in data['streams']if x['codec_type']=='audio')
assert(v['width'],v['height'])==((1080,1920)if mode=='final'else(270,480))
assert int(v['nb_read_frames'])==2100 and v['r_frame_rate']=='30/1'
assert v['codec_name']=='h264'and v['pix_fmt']=='yuv420p'
assert a['codec_name']=='aac'and a['sample_rate']=='48000'and a['channels']==2
assert abs(float(data['format']['duration'])-70)<.06
assert abs(float(v['start_time']))<.001 and abs(float(a['start_time']))<.001
decode=subprocess.run(['ffmpeg','-v','error','-i',str(file),'-f','null','-'],capture_output=True,text=True,check=True)
assert not decode.stderr.strip(),decode.stderr
black=subprocess.run(['ffmpeg','-hide_banner','-i',str(file),'-an','-vf','blackdetect=d=0.12:pix_th=0.035','-f','null','-'],capture_output=True,text=True,check=True).stderr
black_events=[line.strip()for line in black.splitlines()if'black_start:'in line]
audio=subprocess.run(['ffmpeg','-hide_banner','-i',str(file),'-vn','-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True,check=True).stderr
summary=audio[audio.rfind('Summary:'):].split('[out#')[0].strip()
report={'file':file.name,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'bytes':file.stat().st_size,'width':v['width'],'height':v['height'],'frames':int(v['nb_read_frames']),'fps':v['r_frame_rate'],'duration':float(data['format']['duration']),'video':v['codec_name'],'pixelFormat':v['pix_fmt'],'colorSpace':v.get('color_space'),'audio':a['codec_name'],'sampleRate':a['sample_rate'],'channels':a['channels'],'videoStart':v['start_time'],'audioStart':a['start_time'],'completeDecode':'passed','blackEvents':black_events,'audioMeasurement':summary}
(out/f'verification-{mode}.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if black_events:raise SystemExit('Inspect black events before accepting delivery')
