"""Assemble verified native frame ranges; use one continuous audio master."""
import json,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
cfg=json.loads((ROOT/'src/cinematic/episodes.json').read_text())
chunks=ROOT/'work/cinematic/downloads';out=ROOT/'work/cinematic/renders';out.mkdir(parents=True,exist_ok=True)
for ep in cfg['episodes']:
 if len(sys.argv)>1 and ep['id']!=int(sys.argv[1]):continue
 total=ep['duration']*30;lines=[]
 for start in range(0,total,450):
  end=min(total-1,start+449)
  name=ep['file'].replace('.mp4',f'-{start}-{end}.mp4')
  files=list(chunks.rglob(name))
  if len(files)!=1:raise SystemExit(f'Expected exactly one segment {name}, found {len(files)}')
  file=files[0];data=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-count_frames','-show_streams','-of','json',str(file)]))['streams'][0]
  assert int(data['nb_read_frames'])==end-start+1,name
  assert (data['width'],data['height'])==(1080,1920),name
  lines += ["file '"+str(file).replace("'","'\\''")+"'",f'duration {(end-start+1)/30:.9f}']
 listing=out/f'episode-{ep["id"]}-concat.txt';listing.write_text('\n'.join(lines)+'\n')
 subprocess.run(['ffmpeg','-v','warning','-y','-f','concat','-safe','0','-i',str(listing),'-i',str(ROOT/f'public/audio/cinematic/episode-{ep["id"]}.mp3'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-bsf:v','setts=pts=PTS-STARTPTS:dts=DTS-STARTPTS','-c:a','aac','-b:a','192k','-ar','48000','-t',str(ep['duration']),'-video_track_timescale','30000','-movflags','+faststart',str(out/ep['file'])],check=True)
 print(out/ep['file'],flush=True)
