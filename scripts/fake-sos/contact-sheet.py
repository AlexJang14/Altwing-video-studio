from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess,sys,json
ROOT=Path(__file__).resolve().parents[2];mode=sys.argv[1]if len(sys.argv)>1 else'preview';out=ROOT/'work/fake-sos/deliverables';film=out/f'the-last-wing-ep01-the-fake-sos-{mode}.mp4';frames=ROOT/f'work/fake-sos/review-{mode}';frames.mkdir(exist_ok=True,parents=True)
times=[.3,1.1,2.5,5.5,7.6,10.5,12.9,14.2,16.6,18,20,23,24.8,27,29,31.2,33.4,35.2,38,40.5,42.9,44.8,47.4,49,49.8,51.7,53.5,55.2,56.6,58.5,61,66.5,69,71.2]
w,h=270,480;sheet=Image.new('RGB',(w*4,(h+34)*9),(16,18,22));draw=ImageDraw.Draw(sheet);font=ImageFont.truetype(str(ROOT/'public/fonts/DejaVuSans.ttf'),14)
for i,t in enumerate(times):
 p=frames/f'{t:05.2f}.jpg';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(film),'-frames:v','1','-vf',f'scale={w}:{h}',str(p)],check=True);im=Image.open(p).convert('RGB');x=i%4*w;y=i//4*(h+34);sheet.paste(im,(x,y));draw.text((x+10,y+h+9),f'{t:05.2f} s',(231,224,207),font=font)
sheet.save(out/f'episode1-contact-sheet-{mode}.jpg',quality=90);print(out/f'episode1-contact-sheet-{mode}.jpg')
# Six actual expression renders, not a generated illustration.
folder=ROOT/'work/fake-sos/characters'
gallery=Image.new('RGB',(1080,900),(16,18,22))
for i,n in enumerate(['happy','curious','surprised','afraid','relieved','scout-attachment']):
 p=folder/f'{n}.png'
 if p.exists():gallery.paste(Image.open(p).convert('RGB').resize((360,450)),(i%3*360,i//3*450))
gallery.save(out/'wangdoo-expression-contact-sheet.jpg',quality=94)
