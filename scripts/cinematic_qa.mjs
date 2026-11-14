import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import fs from 'node:fs/promises';
const options={browserExecutable:process.env.CHROME_PATH??'/usr/bin/chromium',chromiumOptions:{gl:'swangle'}};
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',options),errors=[];
const shots=[
 [[1.3,'impact'],[4,'run'],[8.2,'restart'],[13.1,'wave'],[15.6,'coffee'],[18.6,'bad-news'],[22.5,'repair'],[24.6,'catch'],[27,'restored'],[31,'planet'],[33.5,'jump'],[36.8,'probably'],[42,'hesitate'],[48.2,'choice'],[55.3,'brand']],
 [[1.7,'tumble'],[3.6,'crash'],[5.6,'stumble'],[8.2,'engine'],[13.6,'hello'],[15.9,'touch'],[17.2,'alarm'],[21.1,'pulse'],[23.9,'threat'],[27.8,'grab'],[30.6,'chase'],[33,'boost'],[34.3,'catch'],[39.7,'terminal'],[44.7,'no-time'],[48.1,'choice'],[56,'brand']]
];
try{
 for(const episode of process.argv[2]?[Number(process.argv[2])]:[1,2]){
  const composition=await selectComposition({serveUrl,id:`Cinematic-Episode${episode}`,puppeteerInstance:browser});
  const dir=`work/cinematic/qa/episode-${episode}`;await fs.mkdir(dir,{recursive:true});
  for(const [time,name]of shots[episode-1]){
   if(process.env.QA_TIMES&&!process.env.QA_TIMES.split(',').map(Number).includes(time))continue;
   await renderStill({composition,serveUrl,puppeteerInstance:browser,frame:Math.round(time*30),output:`${dir}/${String(time).padStart(4,'0')}-${name}.png`,scale:.5,imageFormat:'png',onBrowserLog:l=>{if(l.type==='error')errors.push(l);}});
   console.log(episode,time,name);
  }
 }
 await fs.writeFile('work/cinematic/qa/browser-errors.json',JSON.stringify(errors,null,2)+'\n');
 if(errors.length)throw new Error(`${errors.length} browser errors`);
}finally{await browser.close({silent:true});}
