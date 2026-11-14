"""Build downloadable outputs only after actual media verification."""
import json,subprocess,hashlib,shutil,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];work=ROOT/'work/reset';out=work/'delivery';out.mkdir(parents=True,exist_ok=True)
base='the-last-wing-ep01-dont-open-the-door'
if not(out/'wangdoo-character-previews.zip').exists():
 with zipfile.ZipFile(out/'wangdoo-character-previews.zip','w',zipfile.ZIP_DEFLATED)as z:
  for f in sorted((ROOT/'docs/reset/character-gate').glob('*.png')):z.write(f,f.name)
  z.write(ROOT/'docs/reset/character-gate/wangdoo-character-gallery.jpg','wangdoo-character-gallery.jpg')
shutil.copy(ROOT/'docs/reset/character-gate/wangdoo-character-gallery.jpg',out/'wangdoo-character-gallery.jpg')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for mode in ['final','preview']:
 file=work/f'renders/{base}-{mode}.mp4';report=json.loads((work/f'verification-{mode}.json').read_text());assert sha(file)==report['sha256'];assert report['frames']==2100 and report['completeDecode']=='passed'and not report['blackEvents'];shutil.copy(file,out/file.name)
play=json.loads((work/'playback-final.json').read_text());assert play['duration']==70 and play['width']==1080 and play['playedTo']>.3 and not play['error']
shutil.copy(work/'episode1-contact-sheet-final.jpg',out/'episode1-contact-sheet.jpg')
source_sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
provenance={'deliveryRun':__import__('os').environ.get('GITHUB_RUN_ID'),'renderSource':'b8f6c2c4f33f49435b9919d42286947c3f0b2385','deliverySource':source_sha,'previewRun':'https://github.com/AlexJang14/Altwing-video-studio/actions/runs/43628216510','nativeRun':'https://github.com/AlexJang14/Altwing-video-studio/actions/runs/43629399916','nativeRendering':'1080x1920, scale=1, seven consecutive 300-frame ranges; no upscaling','deliveryPreview':'Downsampled from verified native final; the original review preview is preserved in the workspace.','finalSha256':sha(out/f'{base}-final.mp4'),'previewSha256':sha(out/f'{base}-preview.mp4')}
(work/'render-provenance.json').write_text(json.dumps(provenance,indent=2)+'\n')
subprocess.run(['git','archive','--format=zip','--prefix=last-wing-door-source/','-o',str(out/'episode1-editable-source.zip'),'HEAD'],cwd=ROOT,check=True)
files=[(ROOT/'public/reset/narration-script.txt','narration-script.txt'),(ROOT/'public/reset/voice-timing.json','narration-timing.json'),(ROOT/'public/reset/narration.srt','narration.srt'),(ROOT/'src/reset/episode.json','episode-shot-plan.json'),(ROOT/'docs/reset/STORY-BIBLE.md','STORY-BIBLE.md'),(ROOT/'docs/reset/QUALITY-CONTROL.md','QUALITY-CONTROL.md'),(ROOT/'docs/reset/LICENSES.md','LICENSES.md'),(ROOT/'public/reset/product-provenance.json','product-provenance.json')]
files += [(work/name,name)for name in['verification-final.json','playback-final.json','verification-preview.json','motion-summary.json','intruder-validation.json','render-provenance.json','caption-layout.json']]
with zipfile.ZipFile(out/'episode1-production-notes.zip','w',zipfile.ZIP_DEFLATED)as z:
 for file,name in files:z.write(file,name)
manifest=[]
for f in sorted(out.iterdir()):
 if f.is_file()and f.name!='MANIFEST.sha256':manifest.append(f'{sha(f)}  {f.name}')
(out/'MANIFEST.sha256').write_text('\n'.join(manifest)+'\n')
print(json.dumps({'source':source_sha,'files':[{'name':f.name,'bytes':f.stat().st_size}for f in sorted(out.iterdir())if f.is_file()]},indent=2))
