from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess,sys,json
ROOT=Path(__file__).resolve().parents[2];mode=sys.argv[1]if len(sys.argv)>1 else'preview';out=ROOT/'work/three-knocks/deliverables';film=out/f'the-last-wing-ep01-the-three-knocks-{mode}.mp4';frames=ROOT/f'work/three-knocks/review-{mode}';frames.mkdir(exist_ok=True,parents=True)
times=[.6,2,6,10.9,12.8,19.7,23.7,25.8,27.2,29.3,31.8,33.7,37,41.5,44,46.8,48.6,49.5,51.65,53,55.7,63.8,69.1,71.2]
w,h=270,480;sheet=Image.new('RGB',(w*4,(h+34)*6),(16,18,22));draw=ImageDraw.Draw(sheet);font=ImageFont.truetype(str(ROOT/'public/fonts/DejaVuSans.ttf'),14)
for i,t in enumerate(times):
 p=frames/f'{t:05.2f}.jpg';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(film),'-frames:v','1','-vf',f'scale={w}:{h}',str(p)],check=True);im=Image.open(p).convert('RGB');x=i%4*w;y=i//4*(h+34);sheet.paste(im,(x,y));draw.text((x+10,y+h+9),f'{t:05.2f} s',(231,224,207),font=font)
sheet.save(out/f'episode1-contact-sheet-{mode}.jpg',quality=90);print(out/f'episode1-contact-sheet-{mode}.jpg')
# Preserve each of the four independent reference views and combine them for review.
folder=ROOT/'docs/three-knocks/characters'
if folder.exists():
 gallery=Image.new('RGB',(1080,1350),(16,18,22))
 for i,n in enumerate(['front','three-quarter','beside-astronaut','ship-lighting']):
  p=folder/f'wangdoo-{n}.png'
  if p.exists():gallery.paste(Image.open(p).convert('RGB').resize((540,675)),(i%2*540,i//2*675))
 gallery.save(out/'wangdoo-character-reference-views.jpg',quality=92)
