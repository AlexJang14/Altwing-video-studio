import {chromium} from 'playwright-core';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();const results=[];
const files=process.argv.slice(2);
try{
 for(const file of files){
  await page.goto('http://127.0.0.1:8092/');
  const result=await page.evaluate(async file=>{
   const video=document.createElement('video');video.muted=true;video.preload='auto';document.body.append(video);
   video.src=new URL(file,location.href).href;
   await new Promise((resolve,reject)=>{video.addEventListener('loadedmetadata',resolve,{once:true});video.addEventListener('error',()=>reject(new Error('Video error '+video.error?.message)),{once:true});});
   await video.play();await new Promise(r=>setTimeout(r,700));video.pause();
   const played=video.currentTime,decoded=video.getVideoPlaybackQuality().totalVideoFrames;
   video.currentTime=Math.max(0,video.duration-1);
   await new Promise(resolve=>video.addEventListener('seeked',resolve,{once:true}));
   const data={file,width:video.videoWidth,height:video.videoHeight,duration:video.duration,played,decoded,seekedTo:video.currentTime,error:video.error?.message??null};
   video.remove();return data;
  },file);
  if(result.error||result.played<.2||result.decoded<3)throw Error(JSON.stringify(result));
  results.push(result);console.log(JSON.stringify(result));
 }
 fs.writeFileSync('work/cinematic/playback-verification.json',JSON.stringify(results,null,2)+'\n');
}finally{await browser.close();}
