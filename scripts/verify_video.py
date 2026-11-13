from pathlib import Path
import json, subprocess, sys

path=Path(sys.argv[1])
mode=sys.argv[2] if len(sys.argv)>2 else 'final'
data=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(path)]))
video=next(s for s in data['streams'] if s['codec_type']=='video')
audio=next(s for s in data['streams'] if s['codec_type']=='audio')
expected=(360,640) if mode=='preview' else (1080,1920)
assert (video['width'],video['height'])==expected
assert video['codec_name']=='h264'
assert video['pix_fmt']=='yuv420p'
assert video['r_frame_rate']=='30/1'
assert int(video['nb_read_frames'])==750
assert abs(float(data['format']['duration'])-25)<.06
assert audio['codec_name']=='aac' and audio['channels']==2
subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','null','-'],check=True)
result={'ok':True,'file':path.name,'bytes':path.stat().st_size,'width':video['width'],'height':video['height'],'fps':30,'frames':750,'duration':float(data['format']['duration']),'video_codec':video['codec_name'],'pixel_format':video['pix_fmt'],'audio_codec':audio['codec_name'],'audio_channels':audio['channels'],'decode_errors':0}
out=Path(__file__).resolve().parents[1]/'work/qa'/f'{mode}-video-validation.json'
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
