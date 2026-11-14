import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import fs from 'node:fs';
fs.mkdirSync('public/rescue',{recursive:true});
const serveUrl=await bundle({entryPoint:'src/index.ts'}),options={serveUrl,browserExecutable:process.env.CHROME_PATH??'/usr/bin/chromium',chromiumOptions:{gl:'swangle'}};
const browser=await openBrowser('chrome',options);
try{
 for(const [id,name]of [['Rescue-Memory-Plush','memory-plush'],['Rescue-Memory-Training','memory-training']]){
  const composition=await selectComposition({...options,puppeteerInstance:browser,id});await renderStill({...options,composition,puppeteerInstance:browser,frame:0,output:`public/rescue/${name}.png`,imageFormat:'png'});console.log(name);
 }
 const composition=await selectComposition({...options,puppeteerInstance:browser,id:'Rescue-Security-Feed'});
 await renderStill({...options,composition,puppeteerInstance:browser,frame:49,output:'public/rescue/security-poster.png',imageFormat:'png'});
 await renderMedia({...options,composition,puppeteerInstance:browser,codec:'h264',pixelFormat:'yuv420p',colorSpace:'bt709',crf:20,outputLocation:'public/rescue/security.mp4',concurrency:2});console.log('Security footage');
}finally{await browser.close({silent:true});}
