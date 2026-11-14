"""Publish the prepared draft using the repository-scoped Actions credential."""
import json,os,hashlib,mimetypes,subprocess
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[1];repo='AlexJang14/Altwing-video-studio';tag='last-wing-door-ep01-v1'
token=os.environ['GH_TOKEN']
def request(url,method='GET',data=None,content='application/json'):
 headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','Content-Type':content,'X-GitHub-Api-Version':'2022-11-28'}
 with urlopen(Request(url,data=data,headers=headers,method=method),timeout=180)as r:return json.load(r)if r.status!=204 else None
api='https://api.github.com/repos/'+repo
release=next(r for r in request(api+'/releases')if r['tag_name']==tag)
assert release['draft'],'Refusing to replace an already published release'
files=sorted((ROOT/'work/reset/delivery').glob('*'));assert len(files)==8
for f in files:
 for old in release['assets']:
  if old['name']==f.name:request(api+'/releases/assets/'+str(old['id']),'DELETE')
 raw=f.read_bytes();asset=request('https://uploads.github.com/repos/'+repo+'/releases/'+str(release['id'])+'/assets?name='+quote(f.name),'POST',raw,mimetypes.guess_type(f.name)[0]or'application/octet-stream')
 assert asset['state']=='uploaded'and asset['size']==len(raw),f.name
 if asset.get('digest'):assert asset['digest']=='sha256:'+hashlib.sha256(raw).hexdigest(),f.name
 print('Verified release asset:',f.name,len(raw),flush=True)
sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
payload={'draft':False,'target_commitish':sha,'body':(ROOT/'docs/reset/RELEASE.md').read_text()}
result=request(api+'/releases/'+str(release['id']),'PATCH',json.dumps(payload).encode())
assert not result['draft'];print(result['html_url'],flush=True)
