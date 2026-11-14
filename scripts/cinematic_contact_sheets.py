from PIL import Image,ImageOps,ImageDraw,ImageFont
from pathlib import Path
root=Path(__file__).resolve().parents[1]
font=ImageFont.truetype(str(root/'public/fonts/DejaVuSans.ttf'),19)
for ep in [1,2]:
 files=sorted((root/f'work/cinematic/qa/episode-{ep}').glob('*.png'),key=lambda p:float(p.stem.split('-')[0]))
 cols=5;w=270;h=480;label=42;rows=(len(files)+cols-1)//cols
 sheet=Image.new('RGB',(cols*w,rows*(h+label)), '#081220');draw=ImageDraw.Draw(sheet)
 for i,p in enumerate(files):
  x=i%cols*w;y=i//cols*(h+label)
  im=Image.open(p).convert('RGB');im=ImageOps.fit(im,(w,h));sheet.paste(im,(x,y))
  draw.text((x+12,y+h+8),p.stem,fill='#cae9e0',font=font)
 out=root/f'work/cinematic/qa/episode-{ep}-contact-sheet.jpg';sheet.save(out,quality=94)
 print(out)
