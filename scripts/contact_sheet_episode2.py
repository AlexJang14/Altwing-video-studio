from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parents[1]/'work/episode2/qa'
shots=[('descent','01 / YOU CHOSE B'),('first-steps','02 / FIRST STEPS'),('wangdoo-hello','03 / A LITTLE HELLO'),('the-bloom','04 / THE WORLD RESPONDS'),('the-answer','05 / AN ANSWER'),('choice','06 / YOUR CHOICE')]
canvas=Image.new('RGB',(1080,1376),'#151527');draw=ImageDraw.Draw(canvas)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',14)
for i,(name,label) in enumerate(shots):
 x,y=(i%3)*360,(i//3)*688;draw.text((x+13,y+17),label,font=font,fill='#e7ddf2')
 canvas.paste(Image.open(root/f'{name}.png').convert('RGB').resize((360,640),Image.Resampling.LANCZOS),(x,y+48))
canvas.save(root/'episode2-contact-sheet.jpg',quality=93)
print(root/'episode2-contact-sheet.jpg')
