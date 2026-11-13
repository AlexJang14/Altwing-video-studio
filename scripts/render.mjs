import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
import fs from 'node:fs';
const mode=process.argv[2]??'preview';
const episode=process.argv[3]??'1';
const range=process.argv[4];
if(!['preview','final'].includes(mode))throw new Error('Choose preview or final');
if(!['1','2'].includes(episode))throw new Error('Choose episode 1 or 2');
const scale=mode==='preview'?1/3:1;
const dir=episode==='2'?'work/episode2/renders':'work/renders';
const stem=episode==='2'?'episode2':'episode';
fs.mkdirSync(dir,{recursive:true});
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const options={serveUrl,browserExecutable:'/usr/bin/chromium',chromiumOptions:{gl:'swangle'}};
const composition=await selectComposition({...options,id:`TheLastWing-Episode${episode}`});
let frameRange;
if(range){frameRange=range.split('-').map(Number);if(frameRange.length!==2||frameRange.some(n=>!Number.isInteger(n))||frameRange[0]<0||frameRange[1]<frameRange[0]||frameRange[1]>=composition.durationInFrames)throw new Error('Use a valid inclusive START-END frame range');}
const suffix=range?`-${range}`:'';
let last=0;
await renderMedia({...options,composition,frameRange,codec:'h264',crf:18,pixelFormat:'yuv420p',colorSpace:'bt709',imageFormat:'jpeg',jpegQuality:95,scale,concurrency:2,outputLocation:`${dir}/${stem}-${mode}${suffix}.mp4`,
  onProgress:p=>{const now=Date.now();if(now-last>5000||p.progress===1){last=now;const status={episode,mode,frameRange,renderedFrames:p.renderedFrames,encodedFrames:p.encodedFrames,total:frameRange?frameRange[1]-frameRange[0]+1:composition.durationInFrames,progress:p.progress,updatedAt:new Date().toISOString()};fs.writeFileSync(`${dir}/${mode}${suffix}-progress.json`,JSON.stringify(status));}},
  onBrowserLog:log=>{if(log.type==='error')console.error(log.text);}
});
console.log(`${mode} render complete: ${dir}/${stem}-${mode}${suffix}.mp4`);
