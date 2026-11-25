// Read-only authentic AltWing recording. Changes only disposable browser simulation controls.
import{chromium}from'playwright-core';import fs from'node:fs';import{execFileSync}from'node:child_process';
const dir='work/empty-room/product-frames';fs.mkdirSync(dir,{recursive:true});const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const record={officialURL:'https://altwing.org/#/aerospace-build?wing=gnc',capturedAtUTC:new Date().toISOString(),source:'Actual published AltWing V1, unmodified public frontend',lab:'Lost Sensor',productionWrites:0,authenticatedSession:false,statsOptedOut:true,requests:[],frames:[],fictionalDoorScenePlayable:false};
try{
 const context=await browser.newContext({viewport:{width:900,height:1700},deviceScaleFactor:1,extraHTTPHeaders:{DNT:'1','Sec-GPC':'1'}});await context.addInitScript(()=>{localStorage.setItem('altwing-analytics-consent-v1','no');Object.defineProperty(navigator,'doNotTrack',{get:()=> '1'});Object.defineProperty(navigator,'globalPrivacyControl',{get:()=>true});});
 await context.route('**/*',r=>{const q=r.request(),u=new URL(q.url());const allowed=u.origin==='https://altwing.org'&&q.method()==='GET'&&!u.pathname.startsWith('/api/');record.requests.push({url:u.origin+u.pathname,method:q.method(),allowed});return allowed?r.continue():r.abort('blockedbyclient');});
 const page=await context.newPage();await page.goto(record.officialURL,{waitUntil:'networkidle'});await page.locator('main:not(.aw-loading)').waitFor();
 for(let i=0;i<6&&!await page.locator('.gnclab').isVisible().catch(()=>false);i++){const next=page.getByRole('button',{name:'CONTINUE →',exact:true});await next.click();await page.waitForTimeout(220);}
 await page.locator('.gnclab').waitFor();await page.locator('.gnclab').evaluate(e=>e.scrollIntoView({block:'start'}));await page.waitForTimeout(200);
 record.actualLabText=await page.locator('.gnclab').innerText();if(!record.actualLabText.includes('Three estimates.')||!record.actualLabText.includes('TRUST RADAR'))throw Error('Not the actual Lost Sensor simulation');
 const sensors=await page.locator('.gnclab-sensors').boundingBox(),bottom=await page.locator('.gnclab-live-estimate').boundingBox(),lab=await page.locator('.gnclab').boundingBox();const clip={x:Math.max(0,Math.floor(lab.x)),y:Math.max(0,Math.floor(sensors.y)-8),width:Math.floor(lab.width/2)*2,height:Math.floor((bottom.y+bottom.height-sensors.y+22)/2)*2};
 if(clip.y+clip.height>1700)throw Error('Real UI crop outside capture viewport');record.clip=clip;
 await page.screenshot({path:'public/empty-room/altwing-lost-sensor-first.png',clip});
 const sliders=page.locator('.gnclab input[type=range]');if(await sliders.count()!==3)throw Error('Expected three real source-confidence controls');
 for(let i=0;i<48;i++){
  if(i>0&&i<19){await sliders.nth(0).focus();await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');}
  if(i>=20&&i<38){await sliders.nth(1).focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');}
  const weights=await sliders.evaluateAll(xs=>xs.map(x=>x.value));const estimate=await page.locator('.gnclab-live-estimate strong').innerText();record.frames.push({frame:i,weights,estimate});await page.mouse.move(890,1680);await page.screenshot({path:`${dir}/${String(i).padStart(3,'0')}.jpg`,clip,type:'jpeg',quality:94});
 }
 await page.screenshot({path:'public/empty-room/altwing-lost-sensor-last.png',clip});if(record.frames[0].estimate===record.frames.at(-1).estimate)throw Error('Actual estimate did not change');if(record.requests.some(x=>!x.allowed))throw Error('Unexpected non-read-only request');
 execFileSync('ffmpeg',['-v','error','-y','-framerate','12','-i',dir+'/%03d.jpg','-r','30','-c:v','libx264','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart','public/empty-room/altwing-lost-sensor.mp4']);record.video='altwing-lost-sensor.mp4';record.browser=browser.version();fs.writeFileSync('public/empty-room/product-provenance.json',JSON.stringify(record,null,2));
}finally{await browser.close();}
