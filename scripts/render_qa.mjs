import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import fs from 'node:fs/promises';
const serveUrl=await bundle({entryPoint:'src/index.ts'});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium',chromiumOptions:{gl:'swangle'}});
const logs=[];
try{
  const composition=await selectComposition({serveUrl,id:'TheLastWing-Episode1',puppeteerInstance:browser});
  await fs.mkdir('work/qa',{recursive:true});
  for(const [name,frame] of [['awakening',65],['emergency',190],['wangdoo-reveal',290],['wangdoo-duet',352],['planet',510],['crisis',586],['choice',690]]){
    await renderStill({composition,serveUrl,puppeteerInstance:browser,frame,output:`work/qa/${name}.png`,scale:.5,imageFormat:'png',onBrowserLog:log=>{if(log.type==='error')logs.push(log);}});
    console.log(`${name}: frame ${frame} rendered`);
  }
  const characters=await selectComposition({serveUrl,id:'CharacterPreview',puppeteerInstance:browser});
  await renderStill({composition:characters,serveUrl,puppeteerInstance:browser,frame:30,output:'work/qa/characters.png',scale:2/3});
  await fs.writeFile('work/qa/browser-errors.json',JSON.stringify(logs,null,2)+'\n');
  if(logs.length)throw new Error(`${logs.length} browser errors`);
}finally{await browser.close({silent:true});}
