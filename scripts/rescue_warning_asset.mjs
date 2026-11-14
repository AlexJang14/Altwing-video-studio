import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import fs from 'node:fs';
fs.mkdirSync('public/rescue',{recursive:true});
const serveUrl=await bundle({entryPoint:'src/index.ts'}),options={serveUrl,browserExecutable:process.env.CHROME_PATH??'/usr/bin/chromium',timeoutInMilliseconds:120000,chromiumOptions:{gl:'swangle'}};
const browser=await openBrowser('chrome',options);
try{
 const composition=await selectComposition({...options,puppeteerInstance:browser,id:'Rescue-Warning-Feed'});
 await renderStill({...options,composition,puppeteerInstance:browser,frame:57,output:'public/rescue/warning-poster.png',imageFormat:'png'});
 await renderMedia({...options,composition,puppeteerInstance:browser,codec:'h264',pixelFormat:'yuv420p',colorSpace:'bt709',crf:20,outputLocation:'public/rescue/warning.mp4',concurrency:1});console.log('Archived warning footage');
}finally{await browser.close({silent:true});}
