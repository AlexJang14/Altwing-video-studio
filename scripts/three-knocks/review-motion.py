"""Sequential frames from the actual assembled preview, for contact/motion inspection."""
from pathlib import Path
import subprocess
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[2];out=ROOT/'work/three-knocks/deliverables';movie=out/'the-last-wing-ep01-three-knocks-preview.mp4';folder=ROOT/'work/three-knocks/motion-review';folder.mkdir(parents=True,exist_ok=True);font=ImageFont.truetype(str(ROOT/'public/fonts/DejaVuSans.ttf'),14)
sequences={'scout-deploy':[25.15,25.35,25.65,26.0,26.5,27.0],'recoil-hide':[29.1,29.35,29.65,30.0,30.35,30.7],'orange-match':[5.8,37,39.8,40.8,41.5,42.3],'run-stumble':[45.7,46.3,47.0,47.7,48.3,48.7],'return-help':[49.1,49.7,50.4,51.25,51.65,52.0],'final-knocks':[68.2,68.85,69.1,69.8,70.5,71.2]}
for name,times in sequences.items():
 sheet=Image.new('RGB',(240*6,452),(16,18,22));draw=ImageDraw.Draw(sheet)
 for i,t in enumerate(times):
  p=folder/f'{name}-{t}.jpg';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(movie),'-frames:v','1','-vf','scale=240:426',str(p)],check=True);sheet.paste(Image.open(p).convert('RGB'),(i*240,0));draw.text((i*240+8,432),f'{t:.2f}s',font=font,fill=(247,242,230))
 sheet.save(folder/f'{name}.jpg',quality=92)
print('Sequential actual-video frame strips complete')
