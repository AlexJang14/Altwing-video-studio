"""Join verified frame ranges without rescaling or a second video encode."""
import json,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
mode=sys.argv[1] if len(sys.argv)>1 else 'preview'
assert mode in ('preview','final')
base='the-last-wing-ep01-dont-open-the-door'
segments=ROOT/f'work/reset/segments-{mode}'
out=ROOT/'work/reset/renders';out.mkdir(parents=True,exist_ok=True)
lines=[]
for start in range(0,2100,300):
 end=start+299;name=f'{base}-{mode}-{start}-{end}.mp4';files=list(segments.rglob(name))
 assert len(files)==1,(name,len(files))
 file=files[0];s=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-count_frames','-show_streams','-of','json',str(file)]))['streams'][0]
 assert int(s['nb_read_frames'])==300,(name,s.get('nb_read_frames'))
 assert(s['width'],s['height'])==((1080,1920)if mode=='final'else(270,480)),name
 assert s['r_frame_rate']=='30/1',name
 lines += ["file '"+str(file).replace("'","'\\''")+"'",'duration 10.000000000']
listing=out/f'concat-{mode}.txt';listing.write_text('\n'.join(lines)+'\n')
audio=ROOT/'work/reset/audio/master.wav'
audio_args=['-c:a','aac','-b:a','192k','-ar','48000']
if not audio.exists():
 audio=ROOT/'public/reset/final-mix.m4a';audio_args=['-c:a','copy']
assert audio.exists(),'Build the lossless master or use the included continuous AAC mix'
output=out/f'{base}-{mode}.mp4'
subprocess.run(['ffmpeg','-v','warning','-y','-f','concat','-safe','0','-i',str(listing),'-i',str(audio),'-map','0:v:0','-map','1:a:0','-c:v','copy','-bsf:v','setts=pts=PTS-STARTPTS:dts=DTS-STARTPTS',*audio_args,'-t','70','-video_track_timescale','30000','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',str(output)],check=True)
print(output)
