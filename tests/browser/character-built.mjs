// Built UI transitions; no performance measurement or pixel readback.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(process.env.ARTIFACT_DIR||'dist'),output='work/character-default';mkdirSync(output,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const server=createServer((req,res)=>{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);try{if(p!==root&&!p.startsWith(root+sep))throw new Error();if(statSync(p).isDirectory())p=resolve(p,'index.html');res.setHeader('Content-Type',mime[extname(p)]||'text/plain');res.end(readFileSync(p));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(5177,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],results=[];
try{
 for(const [name,viewport]of [['portrait',{width:393,height:852}],['landscape',{width:852,height:393}]]){
  const p=await browser.newPage({viewport,deviceScaleFactor:3,hasTouch:true,isMobile:true});
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await p.addInitScript(()=>{window.__reads=0;for(const C of [WebGLRenderingContext,WebGL2RenderingContext]){const fn=C.prototype.readPixels;C.prototype.readPixels=function(...a){window.__reads++;return fn.apply(this,a);};}});
  const recorded=async()=>{await p.locator('#validation').evaluate(e=>e.open=true);await p.locator('#v-copy').tap();return JSON.parse(await p.locator('#v-result').inputValue()).conditions;};
  const ready=()=>p.waitForFunction(()=>document.getElementById('hud').textContent.includes('fps'));
  await p.goto('http://127.0.0.1:5177/');await ready();
  let c=await recorded();assert.equal(c.mode,'通常操作');assert.equal(c.characterStudy.variant,'precise');assert.equal(c.characterStudy.selection,'default');
  if(process.env.EXPECTED_BUILD_ID)assert.equal(c.build.buildId,process.env.EXPECTED_BUILD_ID);
  await p.locator('#v-seed').evaluate(e=>e.value='-1');
  await p.selectOption('#v-character-variant','baseline');
  c=await recorded();assert.equal(c.mode,'通常操作');assert.equal(c.characterStudy.variant,'precise');assert.equal(await p.locator('#v-character-variant').inputValue(),'default');
  await p.locator('#v-seed').evaluate(e=>e.value='11');
  // The app never persisted variants. Preserve unrelated data and ignore stale
  // hypothetical comparison settings instead of clearing origin-wide storage.
  await p.evaluate(()=>{localStorage.setItem('unrelated-user-setting','keep');localStorage.setItem('characterStudy',JSON.stringify({variant:'baseline'}));sessionStorage.setItem('variant','baseline');});
  await p.locator('#segTod [data-t="evening"]').tap();
  await p.locator('#v-reset').tap();c=await recorded();assert.equal(c.characterStudy.variant,'precise');
  const switches=[];
  for(const selection of ['anchored','precise','default','baseline']){
   await p.selectOption('#v-character-variant',selection);assert.match(await p.locator('#v-clock').textContent(),/停止.*0\.000/);
   await p.locator('#v-reset').tap();assert.equal(await p.locator('#v-character-variant').inputValue(),selection);
   await p.locator('#v-play').tap();await p.waitForTimeout(400);await p.locator('#v-play').tap();
   const stopped=await p.locator('#v-clock').textContent();await p.locator('#v-step').tap();assert.notEqual(await p.locator('#v-clock').textContent(),stopped);
   c=await recorded();assert.equal(c.characterStudy.variant,selection==='default'?'precise':selection);assert.equal(c.characterStudy.selection,selection);assert.equal(c.build.buildId,await p.locator('#build-id').textContent());switches.push({selection,variant:c.characterStudy.variant,time:c.state.time,build:c.build.buildId});
  }
  assert.equal(await p.evaluate(()=>window.__reads),0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.locator('#v-character-variant').scrollIntoViewIfNeeded();await p.screenshot({path:`${output}/built-${name}.png`});
  await p.locator('#v-exit').tap();assert.equal(await p.locator('#normal-controls').isDisabled(),false);
  const returned=await recorded();assert.equal(returned.characterStudy.variant,'precise');assert.equal(returned.characterStudy.selection,'default');assert.equal(returned.settings.tod,'evening');
  await p.selectOption('#v-character-variant','baseline');await p.reload();await ready();
  c=await recorded();assert.equal(c.mode,'通常操作');assert.equal(c.characterStudy.variant,'precise');assert.equal(c.characterStudy.selection,'default');
  assert.deepEqual(await p.evaluate(()=>[localStorage.getItem('unrelated-user-setting'),JSON.parse(localStorage.getItem('characterStudy')).variant,sessionStorage.getItem('variant')]),['keep','baseline','baseline']);
  await p.goto('http://127.0.0.1:5177/?study=color');await ready();
  c=await recorded();assert.equal(c.characterStudy.variant,'precise');assert.equal(c.characterStudy.selection,'default');assert.equal(c.preset,'color-vertical');
  assert.equal(await p.evaluate(()=>window.__reads),0);
  results.push({name,viewport,dpr:3,switches,readbacks:0,performanceMeasured:false,returnVariant:returned.characterStudy.variant,reloadVariant:'precise',unrelatedSettingsPreserved:true});await p.close();
 }
 assert.deepEqual(errors,[]);writeFileSync(`${output}/built-ui.json`,JSON.stringify({results,errors},null,2)+'\n');console.log('Built default B: startup, comparison/reset, return, reload, storage preservation, research URL; zero readback; no performance measurement');
}finally{await browser.close();await new Promise(r=>server.close(r));}
