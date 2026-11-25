"""Assemble precisely2040 native frames and one continuous audio master."""
from pathlib import Path
import json,subprocess,sys,hashlib
ROOT=Path(__file__).resolve().parents[2];mode=sys.argv[1]if len(sys.argv)>1 else'preview';assert mode in('preview','final')
segments=ROOT/f'work/empty-room/segments-{mode}';out=ROOT/'work/empty-room/deliverables';out.mkdir(parents=True,exist_ok=True);entries=[];checks=[]
for start in range(0,2040,300):
 end=min(start+299,2039);name=f'empty-room-{mode}-{start}-{end}.mp4';files=list(segments.rglob(name));assert len(files)==1,(name,files)
 p=files[0];s=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-count_frames','-show_streams','-of','json',str(p)]))['streams'][0]
 assert int(s['nb_read_frames'])==end-start+1,(name,s.get('nb_read_frames'));assert(s['width'],s['height'])==((1080,1920)if mode=='final'else(540,960));assert s['r_frame_rate']=='30/1'
 entries+=['file '+"'"+str(p).replace("'","'\\''")+"'",'duration '+f'{(end-start+1)/30:.9f}'];checks.append({'file':name,'frames':int(s['nb_read_frames']),'width':s['width'],'height':s['height']})
listing=out/f'concat-{mode}.txt';listing.write_text('\n'.join(entries)+'\n');audio=ROOT/'public/empty-room/final-mix.m4a';audio=audio if audio.exists()else ROOT/'public/empty-room/master.mp3'
file=out/f'the-last-wing-ep01-the-empty-room-{mode}.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(listing),'-i',str(audio),'-map','0:v:0','-map','1:a:0','-c:v','copy','-bsf:v','setts=pts=PTS-STARTPTS:dts=DTS-STARTPTS',*(['-c:a','copy']if audio.suffix=='.m4a'else['-c:a','aac','-b:a','192k','-ar','48000']),'-t','68','-video_track_timescale','30000','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',str(file)],check=True)
s=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(file)]));v=next(x for x in s['streams']if x['codec_type']=='video');a=next(x for x in s['streams']if x['codec_type']=='audio')
assert int(v['nb_read_frames'])==2040;assert v['r_frame_rate']=='30/1';assert v['codec_name']=='h264';assert v['pix_fmt']=='yuv420p';assert abs(float(s['format']['duration'])-68)<.05;assert a['codec_name']=='aac'and a['sample_rate']=='48000'
# Decode every video/audio frame, rather than relying on a header-only probe.
subprocess.run(['ffmpeg','-v','error','-i',str(file),'-f','null','-'],check=True)
r={'file':file.name,'mode':mode,'duration':s['format']['duration'],'frames':2040,'fps':30,'width':v['width'],'height':v['height'],'codec':v['codec_name'],'pixelFormat':v['pix_fmt'],'audioCodec':a['codec_name'],'audioRate':a['sample_rate'],'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'decodedAllFrames':True,'segments':checks}
(out/f'verification-{mode}.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
