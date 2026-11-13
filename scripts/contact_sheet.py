from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parents[1]/'work/qa'
shots=[('awakening','01 / THE AWAKENING'),('emergency','02 / THE EMERGENCY'),('wangdoo-reveal','03 / WANGDOO REVEAL'),('wangdoo-duet','03 / THE COMPANIONS'),('planet','04 / THE SIGNAL'),('crisis','05 / THE CRISIS'),('choice','06 / YOUR CHOICE')]
w,h=300,534
canvas=Image.new('RGB',(w*4,(h+45)*2),'#07111f')
draw=ImageDraw.Draw(canvas)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13)
for i,(name,title) in enumerate(shots):
    shot=Image.open(root/f'{name}.png').convert('RGB').resize((w,h),Image.Resampling.LANCZOS)
    x,y=(i%4)*w,(i//4)*(h+45)
    draw.text((x+13,y+14),title,font=font,fill='#d3e9f7')
    canvas.paste(shot,(x,y+45))
canvas.save(root/'episode-contact-sheet.jpg',quality=92)
print(root/'episode-contact-sheet.jpg')
