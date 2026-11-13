import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import fs from 'node:fs/promises';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium',chromiumOptions:{gl:'swangle'}});
const errors=[];
try{
 const composition=await selectComposition({serveUrl,id:'TheLastWing-Episode2',puppeteerInstance:browser});
 await fs.mkdir('work/episode2/qa',{recursive:true});
 for(const [name,frame] of [['descent',65],['first-steps',210],['wangdoo-hello',290],['the-bloom',445],['the-answer',585],['choice',690]]){
  await renderStill({composition,serveUrl,puppeteerInstance:browser,frame,output:`work/episode2/qa/${name}.png`,scale:.5,imageFormat:'png',onBrowserLog:l=>{if(l.type==='error')errors.push(l);}});
  console.log(`${name}: frame ${frame} rendered`);
 }
 await fs.writeFile('work/episode2/qa/browser-errors.json',JSON.stringify(errors,null,2)+'\n');
 if(errors.length)throw new Error(`${errors.length} browser errors`);
}finally{await browser.close({silent:true});}
