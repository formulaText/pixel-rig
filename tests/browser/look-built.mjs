// Built UI transitions; no performance measurement or pixel readback.
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(process.env.ARTIFACT_DIR||'dist'),output='work/look-face';mkdirSync(output,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const server=createServer((req,res)=>{let p=resolve(root,'.'+new URL(req.url,'http://local').pathname);try{if(p!==root&&!p.startsWith(root+sep))throw new Error();if(statSync(p).isDirectory())p=resolve(p,'index.html');res.setHeader('Content-Type',mime[extname(p)]||'text/plain');res.end(readFileSync(p));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(5178,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],results=[];
try{
 for(const[name,viewport]of[['portrait',{width:393,height:852}],['landscape',{width:852,height:393}]]){
 const p=await browser.newPage({viewport,deviceScaleFactor:3,hasTouch:true,isMobile:true});p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await p.addInitScript(()=>{window.reads=0;for(const C of[WebGLRenderingContext,WebGL2RenderingContext]){const fn=C.prototype.readPixels;C.prototype.readPixels=function(...a){window.reads++;return fn.apply(this,a);};}});
 await p.goto('http://127.0.0.1:5178/?study=look');await p.waitForFunction(()=>document.querySelector('#look-time').textContent.includes('停止'));
 const click=id=>p.locator('#'+id).evaluate(e=>e.click());
 const build=await p.locator('#build-id').textContent();if(process.env.EXPECTED_BUILD_ID)assert.equal(build,process.env.EXPECTED_BUILD_ID);
 await p.selectOption('#face-preset','expressive');await click('face-preset-use');await p.selectOption('#face-head-shape','cylinder');await p.selectOption('#look-motion','diagonal');await click('look-step');
 await p.evaluate(()=>document.querySelector('#look-name').closest('details').open=true);await p.fill('#look-name','公開成果物');await click('look-save');assert.match(await p.locator('#look-message').textContent(),/保存しました/);
 await p.reload();await p.waitForFunction(()=>document.querySelector('#look-time').textContent.includes('停止'));await p.evaluate(()=>document.querySelector('#look-name').closest('details').open=true);await p.selectOption('#look-saved','公開成果物');await click('look-load');assert.equal(await p.locator('#face-head-shape').inputValue(),'cylinder');await click('look-copy');const doc=JSON.parse(await p.locator('#look-json').inputValue());assert.equal(doc.schema,3);assert.equal(doc.buildId,build);assert.equal(doc.values.face.preset,'expressive');assert.equal(doc.preview.motion,'diagonal');
 // Real built controls, no internal test exports. Check interruption and recorded mode, not synthetic fps.
 await click('look-measure');await p.waitForTimeout(200);await p.selectOption('#look-background','plain');await click('look-measure-copy');const m=JSON.parse(await p.locator('#look-measure-result').inputValue());assert.equal(m.conditions.variant,'precise');assert.equal(m.conditions.document.values.face.preset,'expressive');assert.equal(m.performance.status,'interrupted');assert.equal(m.performance.readPixels,false);
 await p.selectOption('#look-view','3d');await p.waitForTimeout(150);await p.selectOption('#look-view','dot');await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>window.reads),0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await p.evaluate(()=>typeof window.probe),'undefined');
 await click('look-exit');await p.waitForFunction(()=>document.querySelector('#hud').textContent.includes('fps'));await p.locator('#validation').evaluate(e=>e.open=true);await click('v-copy');const normal=JSON.parse(await p.locator('#v-result').inputValue()).conditions;assert.equal(normal.characterStudy.variant,'precise');assert.equal(normal.mode,'通常操作');
 results.push({orientation:name,build,restore:true,measurementInterrupted:true,normalVariant:normal.characterStudy.variant,readPixels:0});await p.close();
 }
 assert.deepEqual(errors,[]);writeFileSync(output+'/built.json',JSON.stringify({results,errors},null,2));console.log('Built combined research: default B, face persistence, both preview modes, measurement recording/interruption and normal return passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
