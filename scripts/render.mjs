import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
import fs from 'node:fs';
const mode=process.argv[2]??'preview';
const episode=process.argv[3]??'1';
if(!['preview','final'].includes(mode))throw new Error('Choose preview or final');
if(!['1','2'].includes(episode))throw new Error('Choose episode 1 or 2');
const scale=mode==='preview'?1/3:1;
const dir=episode==='2'?'work/episode2/renders':'work/renders';
const stem=episode==='2'?'episode2':'episode';
fs.mkdirSync(dir,{recursive:true});
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const options={serveUrl,browserExecutable:'/usr/bin/chromium',chromiumOptions:{gl:'swangle'}};
const composition=await selectComposition({...options,id:`TheLastWing-Episode${episode}`});
let last=0;
await renderMedia({...options,composition,codec:'h264',crf:18,pixelFormat:'yuv420p',colorSpace:'bt709',imageFormat:'jpeg',jpegQuality:95,scale,concurrency:2,outputLocation:`${dir}/${stem}-${mode}.mp4`,
  onProgress:p=>{const now=Date.now();if(now-last>5000||p.progress===1){last=now;const status={episode,mode,renderedFrames:p.renderedFrames,encodedFrames:p.encodedFrames,total:composition.durationInFrames,progress:p.progress,updatedAt:new Date().toISOString()};fs.writeFileSync(`${dir}/${mode}-progress.json`,JSON.stringify(status));}},
  onBrowserLog:log=>{if(log.type==='error')console.error(log.text);}
});
console.log(`${mode} render complete: ${dir}/${stem}-${mode}.mp4`);
