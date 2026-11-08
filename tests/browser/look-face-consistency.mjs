import {chromium} from 'playwright-core';
import {createServer} from 'vite';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const port=Number(process.env.FACE_TEST_PORT||5192);const deadline=setTimeout(()=>{console.error('Face consistency exceeded 6 minutes');process.exit(1);},360000);deadline.unref();
const out='work/face-fix';mkdirSync(out,{recursive:true});
const server=await createServer({server:{host:'127.0.0.1',port,strictPort:true,hmr:false,watch:{ignored:['**/work/**']}},plugins:[{name:'face-consistency',transform(c,id){if(id.endsWith('/src/main.ts'))return c+`
import * as look from './research/runtime';import * as model from './research/model';import * as ui from './research/ui';import * as fr from './research/face-render';import * as fs from './research/face-stamps';import * as post from './render/post';import * as scene from './render/scene';import {renderer}from'./render/renderer';import {expr,curEye}from'./character/expression';window.probe={look,model,ui,fr,fs,post,scene,renderer,expr,curEye,J,characterStudy};`;}}]});await server.listen();
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[],errors=[],images=[];
const same=(actual,expected,message='rendered pixels')=>assert.ok(actual===expected,message);
try{
for(const [orientation,viewport]of [['portrait',{width:393,height:852}],['landscape',{width:852,height:393}]]){
 const p=await browser.newPage({viewport,deviceScaleFactor:3});p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>{requestAnimationFrame=()=>0;});await p.goto(`http://127.0.0.1:${port}/?study=look`);await p.waitForFunction(()=>window.probe);
 const click=id=>p.locator('#'+id).evaluate(e=>e.click());
 const pos=(axis,value)=>p.locator(`input[type=number][data-face-value="face.region.${axis}"]`).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('change'));},value);
 const snap=()=>p.evaluate(()=>{const s=probe;s.look.renderLook();const cv=s.renderer.domElement,c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;const g=c.getContext('2d');g.drawImage(cv,0,0);const a=g.getImageData(0,0,c.width,c.height).data;let ink=0;for(let i=0;i<a.length;i+=4)if((a[i]===36&&a[i+1]===26&&a[i+2]===56)||(a[i]===63&&a[i+1]===90&&a[i+2]===166)||(a[i]===255&&a[i+1]===250&&a[i+2]===240))ink++;const rects=s.post.postMat.uniforms.uResearchStamp.value?s.post.postMat.uniforms.uResearchRects.value.slice(0,2).map(r=>r.toArray()):[];const rt=s.model.research.preview.view==='3d'?s.scene.rtWHi:s.scene.rtWLo;const raw=new Uint8Array(rt.width*rt.height*4);s.renderer.readRenderTargetPixels(rt,0,0,rt.width,rt.height,raw);let visible=0;for(const [x,y,w,h]of rects)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){const a=raw[(j*rt.width+i)*4+3];if(a>127&&a<204)visible++;}return{image:c.toDataURL(),ink,visible,rects,face:structuredClone(s.model.research.values.face),eye:s.model.research.preview.eyes==='open'?0:s.curEye(),ticks:s.look.lookClock.ticks,variant:s.characterStudy.variant};});
 await p.selectOption('#look-motion','still');await p.selectOption('#face-eye-state','open');await p.uncheck('#look-blink');await p.uncheck('#face-hair');
 for(const view of ['dot','3d']){
  console.log('Starting '+orientation+' '+view);await p.selectOption('#look-view',view);await click('face-reset');const initial=await snap();assert(initial.ink>0);
  // Compare the initial research output against the unchanged adopted face, not just its data.
  await p.selectOption('#look-compare','baseline');const baseline=await snap();same(initial.image,baseline.image,'initial adopted face');await p.selectOption('#look-compare','draft');
  await p.locator('input[type=number][data-face-value="face.eyes.left.imageScale"]').evaluate(e=>{e.value='1.5';e.dispatchEvent(new Event('change'));});assert.equal((await snap()).face.legacy,true);await p.locator('[data-face-reset="face.eyes.left.imageScale"]').evaluate(e=>e.click());same((await snap()).image,initial.image,'artwork scale roundtrip without projection change');
  await p.selectOption('#face-blink-mode','shrink');same((await snap()).image,initial.image,'open eye does not change with closed mode');await p.selectOption('#face-blink-mode','image');same((await snap()).image,initial.image);
  const positions=[];
  for(const axis of ['x','y'])for(const n of [-.06,.06]){await pos(axis,n);const moved=await snap();assert.deepEqual(moved.face.eyes,initial.face.eyes);assert.equal(moved.face.legacy,true);assert.notEqual(moved.image,initial.image,'position applies');assert.deepEqual(moved.rects.map(r=>r.slice(2)),initial.rects.map(r=>r.slice(2)),'position does not resize glyph');assert.equal(moved.ink,moved.visible,'only resolved skin visibility clips the glyph');positions.push({axis,n,ink:moved.ink,initialInk:initial.ink,visibleSkinPixels:moved.visible,rects:moved.rects});await pos(axis,0);same((await snap()).image,initial.image,'position roundtrip');}
  await pos('x',.03);await p.selectOption('#face-blink-mode','shrink');await pos('y',-.03);const first=await snap();await click('face-reset');await pos('y',-.03);await pos('x',.03);await p.selectOption('#face-blink-mode','shrink');const second=await snap();assert.deepEqual(second.face,first.face);same(second.image,first.image,'operation order');
  await p.selectOption('#look-compare','baseline');same((await snap()).image,baseline.image);await p.selectOption('#look-compare','draft');same((await snap()).image,second.image);
  await p.evaluate(()=>document.querySelector('#look-name').closest('details').open=true);await p.fill('#look-name',orientation+'-'+view);await click('look-save');await p.reload();await p.waitForFunction(()=>window.probe);await p.evaluate(()=>document.querySelector('#look-name').closest('details').open=true);await p.selectOption('#look-saved',orientation+'-'+view);await click('look-load');same((await snap()).image,second.image,'reload and restore pixels');
  await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}}));await click('look-copy');const saved=await p.locator('#look-json').inputValue();await click('face-reset');await p.fill('#look-json',saved);await click('look-paste');same((await snap()).image,second.image,'paste pixels');
  await click('face-reset');images.push({label:orientation+' '+view+' fixed-open',image:(await snap()).image});
  // Automatic blink at the same simulation tick: compare orders and roundtrips
  // both paused and while advancing the existing replay clock through real play UI.
  await p.selectOption('#look-motion','idle');await p.selectOption('#face-eye-state','auto');await p.check('#look-blink');
  console.log('Saved/returned '+orientation+' '+view);const blink=[];
  for(const tick of [0,151,154,159])for(const playing of [false,true]){
   await p.evaluate(t=>probe.look.seekLook(t),tick);if(playing)await click('look-play');
   await p.selectOption('#face-blink-mode','image');const a=await snap();await p.selectOption('#face-blink-mode','shrink');const z=await snap();if(a.eye===0)same(z.image,a.image);
   await pos('x',.03);await pos('x',0);same((await snap()).image,z.image);await p.selectOption('#face-blink-mode','image');same((await snap()).image,a.image);
   if(playing){await p.evaluate(()=>probe.look.renderLook(1/60));assert.equal((await snap()).ticks,tick+1);await click('look-play');}
   blink.push({tick,playing,eye:a.eye});
  }
  assert(blink.some(r=>r.eye===2),'closed blink sampled');assert(blink.some(r=>r.eye===1),'half blink sampled');
  console.log('Passed '+orientation+' '+view);
  results.push({orientation,view,openModePixelDifference:0,returnPixelDifference:0,orderPixelDifference:0,storagePixelDifference:0,baselinePixelDifference:0,positions,blink});
  await p.selectOption('#look-motion','still');await p.selectOption('#face-eye-state','open');await p.uncheck('#look-blink');
 }
 console.log('Resources '+orientation);await p.selectOption('#look-view','dot');const updates=await p.evaluate(()=>{probe.look.renderLook();const a=probe.fs.stampResources.updates;for(let i=0;i<30;i++)probe.look.renderLook();return probe.fs.stampResources.updates-a;});assert.equal(updates,0);
 // Surface presets and existing schema-2 saved faces retain their projection.
 for(const preset of ['small','expressive']){console.log('Surface '+orientation+' '+preset);await p.selectOption('#face-preset',preset);await click('face-preset-use');for(const view of ['dot','3d']){console.log('Surface view '+view);await p.selectOption('#look-view',view);const a=await snap();await p.selectOption('#face-blink-mode','shrink');same((await snap()).image,a.image);await pos('y',.02);await pos('y',0);same((await snap()).image,a.image);await p.selectOption('#face-blink-mode','image');same((await snap()).image,a.image);}}
 await click('look-exit');assert.equal(await p.evaluate(()=>probe.characterStudy.variant),'precise');assert.equal(await p.evaluate(()=>probe.post.postMat.uniforms.uResearchStamp.value),0);await p.close();
}
assert.deepEqual(errors,[]);writeFileSync(out+'/consistency.json',JSON.stringify({results,errors},null,2));for(const [i,x]of images.entries())writeFileSync(`${out}/fixed-${i}.png`,Buffer.from(x.image.split(',')[1],'base64'));console.log('Face consistency: actual UI, open/blinking/paused/playing, both views/orientations, order/roundtrip/storage/baseline pixels passed');
}finally{await browser.close();await server.close();}
