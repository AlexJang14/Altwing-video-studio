from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess,sys,json
ROOT=Path(__file__).resolve().parents[2];mode=sys.argv[1]if len(sys.argv)>1 else'preview';out=ROOT/'work/empty-room/deliverables';film=out/f'the-last-wing-ep01-the-empty-room-{mode}.mp4';frames=ROOT/f'work/empty-room/review-{mode}';frames.mkdir(exist_ok=True,parents=True)
times=[.6,1.8,4,6.7,8.8,10.9,13.5,15.7,18,20.5,22.7,25.2,27.8,30.9,32.8,35,37.8,40.6,44.1,48,50.7,55.6,63.6,67.0]
w,h=270,480;sheet=Image.new('RGB',(w*4,(h+34)*6),(16,18,22));draw=ImageDraw.Draw(sheet);font=ImageFont.truetype(str(ROOT/'public/fonts/DejaVuSans.ttf'),14)
for i,t in enumerate(times):
 p=frames/f'{t:05.2f}.jpg';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(film),'-frames:v','1','-vf',f'scale={w}:{h}',str(p)],check=True);im=Image.open(p).convert('RGB');x=i%4*w;y=i//4*(h+34);sheet.paste(im,(x,y));draw.text((x+10,y+h+9),f'{t:05.2f} s',(231,224,207),font=font)
sheet.save(out/f'episode1-contact-sheet-{mode}.jpg',quality=90);print(out/f'episode1-contact-sheet-{mode}.jpg')
# Preserve each of the four independent reference views and combine them for review.
folder=ROOT/'work/empty-room/characters'
if folder.exists():
 gallery=Image.new('RGB',(1080,1350),(16,18,22))
 for i,n in enumerate(['front','three-quarter','beside-astronaut','ship-lighting']):
  p=folder/f'wangdoo-{n}.png'
  if p.exists():gallery.paste(Image.open(p).convert('RGB').resize((540,675)),(i%2*540,i//2*675))
 gallery.save(out/'wangdoo-character-reference-views.jpg',quality=92)
