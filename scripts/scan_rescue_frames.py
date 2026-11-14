"""Review the largest changes inside shots for accidental render flashes."""
from pathlib import Path
import json,subprocess,heapq,sys
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1]
cfg=json.loads((ROOT/'src/rescue/episodes.json').read_text())
cuts=[[0,1.05,2.95,3.6,4,8,13,17.5,22.15,26,31,34.7,40,46,49,57,64],[0,1.3,3.8,6,10.4,12.7,16,22,24,28,36,40.5,46,55,64],[0,1.1,4.5,7,11.2,15.1,16.9,25,35,47,50.2,55,65]]
font=ImageFont.truetype(str(ROOT/'public/fonts/DejaVuSans.ttf'),16)
for ep in cfg['episodes']:
 if len(sys.argv)>1 and ep['id']!=int(sys.argv[1]):continue
 cmd=['ffmpeg','-v','error','-i',str(ROOT/'work/rescue/renders'/ep['file']),'-vf','scale=180:320','-an','-f','rawvideo','-pix_fmt','rgb24','-']
 p=subprocess.Popen(cmd,stdout=subprocess.PIPE);previous=None;ranked=[];metrics=[];index=0
 while True:
  raw=p.stdout.read(180*320*3)
  if not raw:break
  assert len(raw)==180*320*3
  frame=np.frombuffer(raw,dtype=np.uint8).reshape(320,180,3)
  if previous is not None:
   diff=float(np.abs(frame.astype(np.int16)-previous).mean());metrics.append(round(diff,3))
   if all(abs(index/30-t)>.15 for t in cuts[ep['id']-1]):
    item=(diff,index,raw)
    if len(ranked)<12:heapq.heappush(ranked,item)
    elif diff>ranked[0][0]:heapq.heapreplace(ranked,item)
  previous=frame.astype(np.int16);index+=1
 assert p.wait()==0 and index==ep['duration']*30
 sheet=Image.new('RGB',(6*180,2*350),'#081220');draw=ImageDraw.Draw(sheet)
 top=sorted(ranked,reverse=True)
 for i,(diff,frame,raw) in enumerate(top):
  x=i%6*180;y=i//6*350
  sheet.paste(Image.frombytes('RGB',(180,320),raw),(x,y));draw.text((x+7,y+324),f'{frame/30:.3f}s Δ{diff:.1f}',font=font,fill='#bee4d7')
 out=ROOT/f'work/rescue/qa/episode-{ep["id"]}-frame-change-review.jpg';sheet.save(out,quality=93)
 (out.with_suffix('.json')).write_text(json.dumps({'frames':index,'topChangesOutsideCuts':[{'frame':i,'time':i/30,'difference':d} for d,i,_ in top],'frameDifferences':metrics},indent=2)+'\n')
 print(out,flush=True)
