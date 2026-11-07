import { chromium } from 'playwright-core';
import { createServer } from 'vite';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const output='work/v6-03';mkdirSync(output,{recursive:true});
const server=await createServer({server:{host:'127.0.0.1',port:5176,strictPort:true,hmr:false,watch:{ignored:['**/work/**']}},plugins:[{
  name:'validation-test-adapter', transform(code,id){if(id.endsWith('/src/main.ts'))return code+`
import * as validation from './debug/validation';
import { expr, triggerEmote } from './character/expression';
import { renderer } from './render/renderer';
window.__validation={...validation, expr, triggerEmote, renderer, drawWorld};`;} }]});
await server.listen();
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],cases=[],pixels=[];
const click=(p,id)=>p.locator('#'+id).evaluate(e=>e.click());
async function snap(p){return p.evaluate(()=>window.__validation.snapshot());}
async function frame(p,n,delta=1000/60){await p.evaluate(([n,delta])=>window.__advance(n,delta),[n,delta]);}
async function select(p,key,seed=11){await p.evaluate(([key,seed])=>{document.querySelector('#v-preset').value=key;document.querySelector('#v-seed').value=seed;document.querySelector('#v-preset').dispatchEvent(new Event('change'));},[key,seed]);}
try {
 for(const [orientation,viewport,dpr]of [['portrait',{width:393,height:852},3],['landscape',{width:852,height:393},3],['odd',{width:1281,height:801},1.25]].slice(0,process.env.VALIDATION_CI?1:3)){
  const page=await browser.newPage({viewport,deviceScaleFactor:dpr,hasTouch:true});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.addInitScript(()=>{
    let now=0,callbacks=[];performance.now=()=>now;requestAnimationFrame=cb=>{callbacks.push(cb);return callbacks.length;};
    window.__advance=(n,delta)=>{for(let i=0;i<n;i++){now+=delta;const c=callbacks;callbacks=[];c.forEach(cb=>cb(now));}};
    window.__reads=0;
    for(const C of [WebGLRenderingContext,WebGL2RenderingContext]){const read=C.prototype.readPixels;C.prototype.readPixels=function(...args){window.__reads++;return read.apply(this,args);};}
  });
  await page.goto('http://127.0.0.1:5176/');await page.waitForFunction(()=>window.__validation);await page.waitForTimeout(60);
  await frame(page,10);assert.equal(await page.evaluate(()=>window.__reads),0,'normal rendering must not readPixels');
  await page.locator('#validation summary').first().tap();
  for(const key of ['still','horizontal','vertical','diagonal','wall','trees']){
    await select(page,key);
    const initial=await snap(page);await click(page,'v-base');
    await frame(page,2,1000);assert.deepEqual(await snap(page),initial,'pause freezes all state');
    await click(page,'v-step');assert.equal((await snap(page)).ticks,1);await frame(page,2,1000);assert.equal((await snap(page)).ticks,1);
    await page.evaluate(()=>window.__validation.seekValidation(.5));
    const comparison=await page.evaluate(()=>window.__validation.compareStatic());pixels.push({orientation,preset:key,...comparison});
    writeFileSync(`${output}/pixel-progress.json`,JSON.stringify(pixels,null,2));
    assert(comparison.result.compared>0);assert.equal(comparison.result.changed,0,`${orientation}/${key}: static background regression`);
    const run=async()=>page.evaluate(()=>{
      window.__validation.resetValidation();window.__validation.seekValidation(3);
      const s=window.__validation.snapshot(),capture=window.__validation.captureStatic();
      return {snapshot:s,bytes:Array.from(capture.image.pixels),fullBytes:Array.from(capture.fullImage),separation:capture.separation};
    });
    const first=await run(), second=await run();assert.deepEqual(second,first,`${orientation}/${key}: reset state and pixels`);
    assert.equal(first.snapshot.ticks,180);assert(first.separation.characterPixels>0,`${key}: character separated`);
    console.log(`${orientation}/${key}: repeated state/pixels match, static changes ${comparison.result.changed}/${comparison.result.compared}`);
    cases.push({orientation,preset:key,repeatedTicks:180,repeatedPixelBytes:first.bytes.length,repeatedFullPixelBytes:first.fullBytes.length,exactRepeat:true,staticChanged:comparison.result.changed});
  }
  // Actual RAF replay at 30/60/120Hz must yield identical integer simulation ticks and pixels.
  await select(page,'diagonal',123);
  await page.locator('#v-inputs').evaluate(e=>{e.value=JSON.stringify([{seconds:.1,x:1,y:0},{seconds:.1,x:0,y:-1}]);});
  const states=[];for(const hz of [30,60,120]){await click(page,'v-reset');await click(page,'v-play');await frame(page,hz,1000/hz);await click(page,'v-play');states.push(await snap(page));}
  assert.deepEqual(states[0],states[1]);assert.deepEqual(states[1],states[2]);
  await page.evaluate(()=>{window.__validation.triggerEmote('sweat');window.__validation.drawWorld();});
  const emotion=await snap(page);await frame(page,2,1000);assert.deepEqual(await snap(page),emotion);await click(page,'v-step');assert((await snap(page)).expression.emote.t>0);
  await page.evaluate(()=>window.__validation.seekValidation(12));const blink=await snap(page);await click(page,'v-reset');await page.evaluate(()=>window.__validation.seekValidation(12));assert.deepEqual(await snap(page),blink,'seeded blink sequence after reset');
  // GPU readback remains zero throughout performance measurement (fake RAF is a protocol test, not a performance claim).
  await page.evaluate(()=>{window.__reads=0;window.__validation.startMeasurement(.1,.2);});await frame(page,22);
  assert.equal(await page.evaluate(()=>window.__reads),0);const result=await page.evaluate(()=>window.__validation.result());
  assert.equal(result.performance.result.status,'complete');assert.equal(result.performance.result.gpuMs,null);assert.equal(result.performance.result.logicHz,result.performance.result.renderedFps);
  await page.evaluate(()=>window.__validation.startMeasurement(0,60));
  await page.setViewportSize({width:viewport.height,height:viewport.width});await page.waitForTimeout(60);
  // Synthetic RAF does not schedule the browser's resize-event delivery. Deliver it explicitly after resizing.
  await page.evaluate(()=>dispatchEvent(new Event('resize')));await frame(page,2);
  assert.equal((await page.evaluate(()=>window.__validation.result())).performance.result.status,'interrupted');
  await page.setViewportSize(viewport);await page.waitForTimeout(60);
  // Clipboard unavailable/denied must retain selectable output, never trap the user.
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('denied'))}}));
  await click(page,'v-copy');await page.waitForTimeout(20);assert.match(await page.locator('#v-message').textContent(),/コピーできません/);
  const text=await page.locator('#v-result').inputValue();const copied=JSON.parse(text);assert(copied.conditions.build.buildId);assert.equal(copied.conditions.seed,123);assert(copied.conditions.inputs.length);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text;}}}));await click(page,'v-copy');await page.waitForTimeout(20);assert.match(await page.locator('#v-message').textContent(),/コピーしました/);
  // Diagnostic GPU displays do not read back pixels; missing buffers are explicit black.
  await page.locator('#v-buffer').evaluate(e=>e.closest('details').open=true);
  for(const view of ['color','normal','depth','shadow','final']){await page.selectOption('#v-buffer',view);await page.evaluate(()=>window.__reads=0);await frame(page,1);assert.equal(await page.evaluate(()=>window.__reads),0);}
  await page.locator('#validation').evaluate(e=>e.scrollIntoView());await page.screenshot({path:`${output}/${orientation}.png`});
  const resourceCounts=[], resetPixels=[];for(const seed of [11,123,11,123,11]) {await select(page,'trees',seed);await frame(page,1);resourceCounts.push(await page.evaluate(()=>({...window.__validation.renderer.info.memory})));resetPixels.push(await page.evaluate(()=>Array.from(window.__validation.captureStatic().fullImage)));}
  assert.deepEqual(resourceCounts.at(-1),resourceCounts[0],'regenerated GPU resources do not accumulate');
  assert.deepEqual(resetPixels[0],resetPixels[2]);assert.deepEqual(resetPixels[2],resetPixels[4]);assert.deepEqual(resetPixels[1],resetPixels[3]);assert.notDeepEqual(resetPixels[0],resetPixels[1],'world seed changes visible geometry/patterns');
  await click(page,'v-exit');assert.equal(await page.locator('#normal-controls').isDisabled(),false);
  await page.evaluate(()=>window.__reads=0);await page.keyboard.down('ArrowRight');await frame(page,12);await page.keyboard.up('ArrowRight');assert.equal(await page.evaluate(()=>window.__reads),0);assert((await snap(page)).moving);
  await page.close();
 }
 assert.deepEqual(errors,[]);
 writeFileSync(`${output}/validation.json`,JSON.stringify({browser:await browser.version(),renderer:'SwiftShader',measurement:'手動RAF・readPixelsを用いた再現検査。実性能値ではない',cases,pixels,errors},null,2)+'\n');
 console.log(JSON.stringify({cases:cases.length,staticChanges:pixels.map(p=>({orientation:p.orientation,preset:p.preset,...p.result})),errors},null,2));
} finally {await browser.close();await server.close();}
