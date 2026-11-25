import{bundle}from'@remotion/bundler';import{selectComposition,renderMedia,renderStill,openBrowser}from'@remotion/renderer';import fs from'node:fs';
const mode=process.argv[2]||'preview',chunk=Number(process.argv[3]||0);fs.mkdirSync('work/empty-room/renders',{recursive:true});
const serveUrl=await bundle({entryPoint:'src/index.ts'}),o={serveUrl,browserExecutable:process.env.CHROME_PATH||'/usr/bin/chromium',timeoutInMilliseconds:120000,chromiumOptions:{gl:'swangle'}};
if(mode==='qa'){
 const browser=await openBrowser('chrome',o);try{const comp=await selectComposition({...o,id:'Empty-Room-Episode1',puppeteerInstance:browser});fs.mkdirSync('work/empty-room/qa',{recursive:true});for(const t of[8.8,32.8,44.1,55.6,63.5,67])await renderStill({...o,composition:comp,puppeteerInstance:browser,frame:Math.round(t*30),imageFormat:'png',scale:.5,output:`work/empty-room/qa/${t.toFixed(2)}.png`});}finally{await browser.close({silent:true});}
}else if(mode==='characters'){
 const browser=await openBrowser('chrome',o);try{const comp=await selectComposition({...o,id:'Empty-Room-Characters',puppeteerInstance:browser});fs.mkdirSync('work/empty-room/characters',{recursive:true});for(const[f,n]of[[0,'front'],[30,'three-quarter'],[60,'beside-astronaut'],[90,'ship-lighting']])await renderStill({...o,composition:comp,puppeteerInstance:browser,frame:f,imageFormat:'png',scale:.7,output:`work/empty-room/characters/wangdoo-${n}.png`});}finally{await browser.close({silent:true});}
}else{
 const ship=mode==='ship',start=ship?0:chunk*300,end=ship?299:Math.min(start+299,2039);if(start>2039)throw Error('Invalid chunk');
 const composition=await selectComposition({...o,id:ship?'Empty-Room-Ship-Live':'Empty-Room-Episode1'});let last=0;
 const output=ship?'public/empty-room/ship-live.mp4':`work/empty-room/renders/empty-room-${mode}-${start}-${end}.mp4`;
 await renderMedia({...o,composition,frameRange:[start,end],codec:'h264',crf:mode==='final'?18:20,pixelFormat:'yuv420p',colorSpace:'bt709',imageFormat:'jpeg',jpegQuality:94,scale:ship?1:mode==='final'?1:.5,concurrency:Number(process.env.RENDER_CONCURRENCY||2),outputLocation:output,onProgress:p=>{if(Date.now()-last>15000||p.progress===1){last=Date.now();console.log(JSON.stringify({mode,start,end,frames:p.renderedFrames,progress:p.progress}));}},onBrowserLog:l=>{if(l.type==='error')console.error(l.text);}});console.log(output);
}
