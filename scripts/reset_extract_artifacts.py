"""Verify GitHub ZIP digests, then extract only the expected render basename."""
import json,hashlib,zipfile,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];mode=sys.argv[1];manifest=Path(sys.argv[2]);out=ROOT/f'work/reset/segments-{mode}';out.mkdir(parents=True,exist_ok=True)
for a in json.loads(manifest.read_text()):
 file=Path(a['local']['path']);actual='sha256:'+hashlib.sha256(file.read_bytes()).hexdigest();assert actual==a['digest'],(a['name'],actual)
 chunk=int(a['name'].rsplit('-',1)[1]);start=chunk*300;end=start+299;expected=f'the-last-wing-ep01-dont-open-the-door-{mode}-{start}-{end}.mp4'
 with zipfile.ZipFile(file)as z:
  names=[n for n in z.namelist()if not n.endswith('/')];assert len(names)==1 and Path(names[0]).name==expected,names
  (out/expected).write_bytes(z.read(names[0]))
 print(expected,flush=True)
