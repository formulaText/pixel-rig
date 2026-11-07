// Real RAF against the built artifact. No validation hooks or simulated clocks.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist'), output='work/character-stability';mkdirSync(output,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const server=createServer((req,res)=>{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);try{if(p!==root&&!p.startsWith(root+sep))throw new Error();if(statSync(p).isDirectory())p=resolve(p,'index.html');res.setHeader('Content-Type',mime[extname(p)]||'text/plain');res.end(readFileSync(p));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(5177,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],results=[];
try{
 for(const [name,viewport]of [['portrait',{width:393,height:852}],['landscape',{width:852,height:393}]]){
 for(const variant of ['baseline','anchored']) {
  const p=await browser.newPage({viewport,deviceScaleFactor:3,hasTouch:true,isMobile:true});
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await p.addInitScript(()=>{window.__reads=0;window.__readMs=0;for(const C of [WebGLRenderingContext,WebGL2RenderingContext]){const fn=C.prototype.readPixels;C.prototype.readPixels=function(...a){window.__reads++;const t=performance.now();try{return fn.apply(this,a);}finally{window.__readMs+=performance.now()-t;}};}});
  await p.goto('http://127.0.0.1:5177/?study=color');await p.waitForFunction(()=>document.getElementById('hud').textContent.includes('fps'));
  assert.equal(await p.evaluate(()=>typeof window.__validation),'undefined');
  assert.equal(await p.evaluate(()=>window.__reads),0);
  assert.equal(await p.locator('#validation').getAttribute('open'),'');assert.equal(await p.locator('#v-character-variant').inputValue(),'baseline');
  await p.selectOption('#v-preset','color-vertical');await p.selectOption('#v-character-variant',variant);
  await p.locator('#v-play').tap();await p.waitForTimeout(300);await p.locator('#v-play').tap();
  const stopped=await p.locator('#v-clock').textContent();await p.waitForTimeout(100);assert.equal(await p.locator('#v-clock').textContent(),stopped);
  await p.locator('#v-step').tap();assert.notEqual(await p.locator('#v-clock').textContent(),stopped);
  await p.locator('#v-measure').tap();
  await p.waitForFunction(()=>document.getElementById('v-performance').textContent.includes('測定完了'),{},{timeout:90000});
  assert.equal(await p.evaluate(()=>window.__reads),0,'real measurement contains no readback');
  const text=await p.locator('#v-result').inputValue(),r=JSON.parse(text);
  assert.equal(r.performance.conditions.characterStudy.variant,variant);
  assert.equal(r.conditions.mode,'検証');assert.equal(r.performance.result.status,'complete');assert(r.performance.result.measuredSeconds>=10);assert(r.performance.result.renderedFrames>0);assert.equal(r.performance.result.gpuMs,null);
  assert.equal(r.conditions.build.buildId,await p.locator('#build-id').textContent());
  await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('permission denied');}},configurable:true}));
  await p.locator('#v-copy').tap();await p.waitForFunction(()=>document.getElementById('v-message').textContent.includes('コピーできません'));
  assert(JSON.parse(await p.locator('#v-result').inputValue()).performance);
  await p.locator('#v-exit').tap();assert.equal(await p.locator('#normal-controls').isDisabled(),false);
  await p.locator('#validation>summary').tap();await p.locator('#v-copy').tap();
  const returned=JSON.parse(await p.locator('#v-result').inputValue());assert.equal(returned.conditions.mode,'通常操作');assert.equal(returned.conditions.state.ticks,0);assert.equal(returned.conditions.characterStudy.variant,'baseline');
  const stage=await p.locator('#stage').boundingBox();await p.mouse.move(stage.x+stage.width/2,stage.y+stage.height/2);await p.mouse.down();await p.mouse.move(stage.x+stage.width/2+30,stage.y+stage.height/2);await p.waitForTimeout(200);await p.mouse.up();
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.selectOption('#v-preset','color-vertical');await p.selectOption('#v-character-variant',variant);
  await p.locator('#v-base').evaluate(e=>e.closest('details').open=true);
  const compareStart=performance.now();await p.locator('#v-base').tap();await p.locator('#v-compare').tap();const comparisonWallMs=performance.now()-compareStart;
  const diagnosticReads=await p.evaluate(()=>window.__reads);const diagnosticReadMs=await p.evaluate(()=>window.__readMs);assert.equal(diagnosticReads,8);
  await p.locator('#v-character-variant').scrollIntoViewIfNeeded();
  await p.screenshot({path:`${output}/${name}-${variant}.png`});
  results.push({name,variant,normalReadbacks:0,diagnosticReads,diagnosticReadMs,comparisonWallMs,...r.performance});await p.close();console.log(`${name}: real RAF, 5s warmup + >=10s measurement, zero readbacks, copy fallback and return passed (${variant})`);
 }
 }
 assert.deepEqual(errors,[]);
 writeFileSync(`${output}/performance.json`,JSON.stringify({browser:await browser.version(),renderer:'Chromium / SwiftShader（ソフトウェアGPU）。iPhone性能ではない。録画・画素読出しなし',results,errors},null,2)+'\n');
}finally{await browser.close();await new Promise(r=>server.close(r));}
