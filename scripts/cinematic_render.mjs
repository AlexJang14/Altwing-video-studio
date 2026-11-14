import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
import fs from 'node:fs';
const mode=process.argv[2]??'preview',episode=Number(process.argv[3]??1),range=process.argv[4];
if(!['preview','final'].includes(mode)||![1,2].includes(episode))throw Error('Usage: node scripts/cinematic_render.mjs preview|final 1|2 [START-END]');
const story=JSON.parse(fs.readFileSync('src/cinematic/episodes.json','utf8')).episodes[episode-1];
const dir='work/cinematic/renders';fs.mkdirSync(dir,{recursive:true});
const suffix=range?`-${range}`:'',file=mode==='final'?story.file:story.file.replace('-final','-preview');
const output=`${dir}/${file.replace('.mp4',suffix+'.mp4')}`;
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const options={serveUrl,browserExecutable:process.env.CHROME_PATH??'/usr/bin/chromium',chromiumOptions:{gl:'swangle'}};
const composition=await selectComposition({...options,id:`Cinematic-Episode${episode}`});
const frameRange=range?range.split('-').map(Number):undefined;
if(frameRange&&(frameRange.length!==2||frameRange.some(n=>!Number.isInteger(n))||frameRange[0]<0||frameRange[1]<frameRange[0]||frameRange[1]>=composition.durationInFrames))throw Error('Invalid inclusive frame range');
let last=0;
await renderMedia({...options,composition,frameRange,codec:'h264',crf:18,pixelFormat:'yuv420p',colorSpace:'bt709',imageFormat:'jpeg',jpegQuality:95,scale:mode==='preview'?1/3:1,concurrency:Number(process.env.RENDER_CONCURRENCY??2),outputLocation:output,
 onProgress:p=>{const now=Date.now();if(now-last>5000||p.progress===1){last=now;const status={episode,mode,frameRange,renderedFrames:p.renderedFrames,encodedFrames:p.encodedFrames,total:frameRange?frameRange[1]-frameRange[0]+1:composition.durationInFrames,progress:p.progress,updatedAt:new Date().toISOString()};fs.writeFileSync(`${dir}/e${episode}-${mode}${suffix}-progress.json`,JSON.stringify(status));if(process.env.CI)console.log(JSON.stringify(status));}},onBrowserLog:l=>{if(l.type==='error')console.error(l.text);}
});
console.log(output);
