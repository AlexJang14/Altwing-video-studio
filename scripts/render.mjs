import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
import fs from 'node:fs';
const mode=process.argv[2]??'preview';
if(!['preview','final'].includes(mode))throw new Error('Choose preview or final');
const scale=mode==='preview'?1/3:1;
fs.mkdirSync('work/renders',{recursive:true});
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const options={serveUrl,browserExecutable:'/usr/bin/chromium',chromiumOptions:{gl:'swangle'}};
const composition=await selectComposition({...options,id:'TheLastWing-Episode1'});
let last=0;
await renderMedia({...options,composition,codec:'h264',crf:18,pixelFormat:'yuv420p',imageFormat:'jpeg',jpegQuality:95,scale,concurrency:2,outputLocation:`work/renders/episode-${mode}.mp4`,
  onProgress:p=>{const now=Date.now();if(now-last>5000||p.progress===1){last=now;const status={mode,renderedFrames:p.renderedFrames,encodedFrames:p.encodedFrames,total:composition.durationInFrames,progress:p.progress,updatedAt:new Date().toISOString()};fs.writeFileSync(`work/renders/${mode}-progress.json`,JSON.stringify(status));}},
  onBrowserLog:log=>{if(log.type==='error')console.error(log.text);}
});
console.log(`${mode} render complete: work/renders/episode-${mode}.mp4`);
