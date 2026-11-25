const { chromium } = require('../../../../brand-system/design-system/node_modules/playwright');
const path = require('path');
const { pathToFileURL } = require('url');
(async () => {
 const browser = await chromium.launch({headless:true});
 const base = pathToFileURL(path.resolve('outputs/prototypes/talent-os-soft-system/v0.33.0/soft-system.html')).href;
 for (const [name, query, width, height] of [['screen-start','','1440','900'],['screen-chaos','?stage=chaos','1440','900'],['room-start','?view=room','1440','900'],['room-chaos','?view=room&stage=chaos','1440','900'],['screen-mobile','','390','844']]) {
  const page = await browser.newPage({viewport:{width:+width,height:+height},deviceScaleFactor:1});
  await page.goto(base+query); await page.evaluate(() => document.fonts.ready); await page.screenshot({path:`projects/talent-os-soft-system/handoff/v0.33.0/screenshots/${name}-${width}x${height}.png`});
  console.log(name, JSON.stringify(await page.evaluate(() => ({title:document.title, buttons:[...document.querySelectorAll('button')].filter(x=>x.offsetWidth&&x.offsetHeight).map(x=>x.textContent.trim().replace(/\s+/g,' ')).slice(0,20), canvas:(()=>{const e=document.querySelector('.viewport-canvas');const r=e.getBoundingClientRect();return {style:e.getAttribute('style'),width:r.width,height:r.height}})()})))); await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
