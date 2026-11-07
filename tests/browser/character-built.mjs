// Built comparison controls only. Performance measurements are deferred by user.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist'),output='work/character-depth-precision';mkdirSync(output,{recursive:true});
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
  await p.goto('http://127.0.0.1:5177/?study=color');await p.waitForFunction(()=>document.getElementById('hud').textContent.includes('fps'));
  assert.equal(await p.locator('#v-character-variant').inputValue(),'baseline');assert.equal(await p.locator('#v-preset').inputValue(),'color-vertical');
  const switches=[];
  for(const variant of ['anchored','precise','baseline','precise']){
   await p.selectOption('#v-character-variant',variant);assert.match(await p.locator('#v-clock').textContent(),/停止.*0\.000/);
   await p.locator('#v-play').tap();await p.waitForTimeout(400);await p.locator('#v-play').tap();
   const stopped=await p.locator('#v-clock').textContent();await p.locator('#v-step').tap();assert.notEqual(await p.locator('#v-clock').textContent(),stopped);
   await p.locator('#v-copy').tap();const r=JSON.parse(await p.locator('#v-result').inputValue());assert.equal(r.conditions.characterStudy.variant,variant);assert.equal(r.performance,null);assert.equal(r.conditions.build.buildId,await p.locator('#build-id').textContent());switches.push({variant,time:r.conditions.state.time,build:r.conditions.build.buildId});
  }
  assert.equal(await p.evaluate(()=>window.__reads),0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.locator('#v-character-variant').scrollIntoViewIfNeeded();await p.screenshot({path:`${output}/built-${name}.png`});
  await p.locator('#v-exit').tap();assert.equal(await p.locator('#normal-controls').isDisabled(),false);await p.locator('#validation>summary').tap();await p.locator('#v-copy').tap();const returned=JSON.parse(await p.locator('#v-result').inputValue());assert.equal(returned.conditions.characterStudy.variant,'baseline');
  results.push({name,viewport,dpr:3,switches,readbacks:0,performanceMeasured:false,returnVariant:returned.conditions.characterStudy.variant});await p.close();
 }
 assert.deepEqual(errors,[]);writeFileSync(`${output}/built-ui.json`,JSON.stringify({results,errors},null,2)+'\n');console.log('Built A/B controls, reset/replay/return, no overflow, zero readback; no performance measurement');
}finally{await browser.close();await new Promise(r=>server.close(r));}
