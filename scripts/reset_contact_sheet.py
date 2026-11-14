import subprocess,sys,math
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1];mode=sys.argv[1]if len(sys.argv)>1 else'final';out=ROOT/'work/reset';frames=out/f'frames-{mode}';frames.mkdir(parents=True,exist_ok=True)
film=out/f'renders/the-last-wing-ep01-dont-open-the-door-{mode}.mp4'
times=[.6,4,5.8,7.2,8.7,11.7,13.6,16.8,21.2,23.2,25.5,28.5,32.25,35.2,37.5,43,46.4,54,63,68.5]
sheet=Image.new('RGB',(1080,2500),'#101820');draw=ImageDraw.Draw(sheet)
for i,t in enumerate(times):
 p=frames/f'{t:05.2f}.png';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(film),'-frames:v','1','-vf','scale=270:480',str(p)],check=True)
 sheet.paste(Image.open(p),(i%4*270,i//4*500));draw.text((i%4*270+10,i//4*500+484),f'{t:05.2f} s',fill='#dce4e7')
sheet.save(out/f'episode1-contact-sheet-{mode}.jpg',quality=94)
for n,(a,b)in enumerate([(0,1000),(1000,2000),(2000,2500)]):sheet.crop((0,a,1080,b)).save(out/f'contact-{mode}-{n}.jpg',quality=93)
if mode=='preview':
 for name,start,duration,cols,rows in [('plush-and-check',9,3,6,3),('entry',15.8,2,6,2),('live-reveal',41,4,6,4)]:
  subprocess.run(['ffmpeg','-v','error','-y','-ss',str(start),'-i',str(film),'-t',str(duration),'-vf',f'fps=6,scale=135:240,tile={cols}x{rows}:padding=2:color=0x101820','-frames:v','1',str(out/f'motion-{name}.jpg')],check=True)
print(out/f'episode1-contact-sheet-{mode}.jpg')
