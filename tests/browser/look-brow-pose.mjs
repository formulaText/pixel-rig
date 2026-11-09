import {execFileSync} from 'node:child_process';import {resolve} from 'node:path';
import{chromium}from'playwright-core';import{createServer}from'vite';import{mkdirSync,writeFileSync,readFileSync,symlinkSync,existsSync}from'node:fs';import assert from'node:assert/strict';
const out='work/look-consistency';mkdirSync(out,{recursive:true});const server=await createServer({cacheDir:'work/vite-brow-pose-cache',server:{host:'127.0.0.1',port:5204,strictPort:true,hmr:false,watch:{ignored:['**/work/**']}},plugins:[{name:'homura-probe',transform(c,id){if(id.endsWith('/src/main.ts'))return c+`\nimport * as THREE from 'three';import * as model from './research/model';import * as look from './research/runtime';import * as ui from './research/ui';import * as scene from './render/scene';import * as post from './render/post';import * as fr from './research/face-render';import * as fs from './research/face-stamps';import * as presets from './research/look-presets';import {renderer}from'./render/renderer';import {worldScene}from'./world/world';window.probe={THREE,model,look,ui,scene,post,fr,fs,presets,renderer,worldScene,shared,J,state,texel,SINP,COSP,characterStudy};`;}}]});await server.listen();
let baselineServer;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const errors=[],results={};
try{const p=await browser.newPage({viewport:{width:393,height:852},hasTouch:true,isMobile:true});p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await p.addInitScript(()=>{requestAnimationFrame=()=>0;});await p.goto('http://127.0.0.1:5204/?study=look&preset=homura-01');await p.waitForFunction(()=>window.probe);
const click=id=>p.locator('#'+id).tap();const snap=()=>p.evaluate(()=>{probe.look.renderLook();return probe.renderer.domElement.toDataURL();});
const source=JSON.parse(readFileSync('src/research/presets/homura-01-reference.schema5.json','utf8'));
const choose=async(id,value)=>{await p.locator(`[data-choice-for="${id}"] [data-choice="${value}"]`).tap();};
const values=()=>p.evaluate(()=>probe.ui.lookDocument().values);
assert.deepEqual(await values(),source.values,'full source values, not earlier suggested defaults');
assert.deepEqual(await p.evaluate(()=>probe.ui.lookDocument().preview),source.preview);
assert.deepEqual(await p.evaluate(()=>probe.ui.lookDocument().playback),source.playback);
const sample=()=>p.evaluate(()=>{const s=probe;s.look.renderLook();const cv=s.renderer.domElement,k=s.model.research.preview.view==='3d'?4:1,c=document.createElement('canvas');
 c.width=16*k;c.height=10*k;const g=c.getContext('2d'),eye=s.fs.stampUniforms.uResearchRects.value[0];g.drawImage(cv,Math.round(cv.width/2-8*k),Math.round(cv.height-eye.y-10*k),16*k,10*k,0,0,c.width,c.height);
 return{image:cv.toDataURL(),headImage:c.toDataURL(),head:s.J.head.matrixWorld.elements.slice(),rects:s.fs.stampUniforms.uResearchRects.value.slice(2,4).map(v=>v.toArray()),limbs:[s.J.armL.rotation.x,s.J.legL.rotation.x],clock:s.look.lookClock.ticks};});
await choose('face-eye-state','open');await p.uncheck('#look-blink');
results.expressions=[];results.poses=[];
const gallery=[];
for(const view of ['dot','3d']){
 await choose('look-view',view);await choose('look-motion','idle');
 const expressions=[];for(const ex of ['neutral','angry','sad']){await choose('face-expression',ex);const a=await sample();expressions.push(a.image);gallery.push({view,ex,image:a.image});results.expressions.push({view,expression:ex,rects:a.rects});}
 assert(new Set(expressions).size===3,'all three expressions are distinct in final output');
 await choose('face-expression','neutral');assert((await sample()).image===expressions[0],'expression roundtrip');
 // Same paused time, direction, settings: all modes have the same front head frame.
 const reference=await sample();for(const motion of ['walk','still','vertical','diagonal','idle','walk','idle']){
  await choose('look-motion',motion);const a=await sample();a.head.forEach((v,i)=>assert(Math.abs(v-reference.head[i])<1e-12,`${view}/${motion} head matrix`));
  assert(a.headImage===reference.headImage,`${view}/${motion} face pixels at 0.00 seconds`);results.poses.push({view,motion,headEqual:true,facePixelsEqual:true});
 }
 // Original eye artwork stays unchanged on blink-mode/position roundtrip.
 const base=await sample();await choose('face-blink-mode','shrink');assert((await sample()).image===base.image);await choose('face-blink-mode','image');
 const y=p.locator('input[type=number][data-face-value="face.region.y"]');await y.fill('.12');await y.dispatchEvent('change');await sample();await y.fill('.03');await y.dispatchEvent('change');assert((await sample()).image===base.image);
}
// UI guide is based on the same integer grid as rasterization; editing doesn't mutate raw placement.
await choose('face-part','brows');await choose('face-expression','neutral');
assert((await p.locator('#face-grid-info').textContent()).includes('左20・上6、5×2格子'));
assert.equal((await values()).face.brows.left.rect.x,.609375);
await choose('face-expression','angry');assert((await p.locator('#face-grid-info').textContent()).includes('0.02 → 0格子'));
await click('face-erase');const beforePaint=await values();await p.locator('#face-grid').scrollIntoViewIfNeeded();const box=await p.locator('#face-grid').boundingBox();
// Inverse rotated-cell hit testing: source pixel gets paint and undo restores complete values.
await p.touchscreen.tap(box.x+box.width*22.5/32,box.y+box.height*6.5/24);assert.notDeepEqual((await values()).face.brows.left.image,beforePaint.face.brows.left.image);
await click('face-undo');assert.deepEqual(await values(),beforePaint);await click('face-redo');assert.notDeepEqual((await values()).face.brows.left.image,beforePaint.face.brows.left.image);await click('face-undo');
results.gridAndPaintRoundtrip=true;
// Width, distance and expression are independent controls; returning values restores pixels.
await choose('face-expression','neutral');const browBefore=await sample(),sourceArtwork=(await values()).face.brows.left.image;
const width=p.locator('input[type=number][data-face-value="face.brows.left.rect.w"]');await width.fill('.25');await width.dispatchEvent('change');const widened=await sample();assert(widened.rects[0][2]>browBefore.rects[0][2]);assert.deepEqual((await values()).face.brows.left.image,sourceArtwork);
await width.fill(String(source.values.face.brows.left.rect.w));await width.dispatchEvent('change');
// Left-right link intentionally recomputes the opposite raw rectangle on explicit edits.
await click('look-preset-homura');await choose('face-part','brows');await choose('face-eye-state','open');await p.uncheck('#look-blink');const closeBefore=await sample();
await p.locator('#look-browGap-number').fill('.1');await p.locator('#look-browGap-number').dispatchEvent('input');const closer=await sample();assert(closer.rects[0][1]!==closeBefore.rects[0][1],JSON.stringify({before:closeBefore.rects,after:closer.rects,gap:(await values()).browGap}));assert.deepEqual(closer.rects[0].slice(2),closeBefore.rects[0].slice(2));
await p.locator('#look-browGap-number').fill('0');await p.locator('#look-browGap-number').dispatchEvent('input');assert((await sample()).image===closeBefore.image);
const visible=p.locator('[data-face-value="face.brows.left.neutralVisible"]');await visible.uncheck();assert((await sample()).image!==closeBefore.image);await visible.check();assert((await sample()).image===closeBefore.image);
results.shapeDistanceVisibility=true;
// Non-default raw values remain raw after opening/selecting, save, reload and copy.
await click('look-preset-homura');await choose('face-part','brows');const raw=p.locator('input[type=number][data-face-value="face.brows.left.rect.x"]');await raw.fill('.612345');await raw.dispatchEvent('change');
const fractional=await values();await choose('face-expression','sad');await choose('face-expression','neutral');assert.deepEqual(await values(),fractional);
await p.fill('#look-name','眉と姿勢の往復検査');await click('look-dock-save');assert.equal(await p.locator('#look-saved').inputValue(),'眉と姿勢の往復検査');const saved=await p.evaluate(()=>probe.ui.lookDocument());const savedImage=(await sample()).image;
await p.reload();await p.waitForFunction(()=>window.probe);await p.selectOption('#look-saved','眉と姿勢の往復検査');await click('look-load');assert.deepEqual(await p.evaluate(()=>probe.ui.lookDocument()),saved);assert((await sample()).image===savedImage,'reload restored pixels');
await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied');}}}));await click('look-copy');await p.waitForFunction(()=>document.querySelector('#look-operation-result').textContent.includes('手動コピー'));const text=await p.locator('#look-json').inputValue();assert.deepEqual(JSON.parse(text),saved);await click('look-preset-base');await p.fill('#look-json',text);await click('look-paste');assert.deepEqual(await p.evaluate(()=>probe.ui.lookDocument()),saved);assert((await sample()).image===savedImage,'paste restored pixels');
results.saveReloadCopy=true;
// Playing switching and paused roundtrip do not retain state from the previous motion.
await click('look-preset-homura');await choose('face-eye-state','open');await p.uncheck('#look-blink');
results.playing=[];for(const motion of ['idle','walk','vertical','diagonal','idle']){await choose('look-motion',motion);await click('look-dock-play');await p.evaluate(()=>{for(let i=0;i<10;i++)probe.look.renderLook(1/60);});await click('look-dock-play');const a=await sample();const document=await p.evaluate(()=>probe.ui.lookDocument());await choose('look-motion','still');await p.evaluate(d=>probe.ui.applyLookDocument(d),document);const b=await sample();assert(a.image===b.image,'same settings/time after motion order');results.playing.push({motion,ticks:document.playback.ticks,restored:true});}
await choose('look-motion','walk');await click('look-step');const walk0=await sample();for(let i=0;i<10;i++)await click('look-step');const walk1=await sample();assert.notDeepEqual(walk0.limbs,walk1.limbs,'headIdle 0 keeps walk animation');
// Eight directions retain front-only support; sampled transition stays continuous.
results.directions=await p.evaluate(()=>{const s=probe,r=s.model.research,rows=[];r.values=s.presets.homuraLook();for(let d=0;d<8;d++){r.preview.direction=d;r.preview.motion='walk';s.look.seekLook(0);s.look.renderLook();rows.push({direction:d,head:s.J.head.rotation.x,brow:s.fs.stampUniforms.uBrowOverlay.value});}r.preview.autoDirection=true;let max=0,prev;for(let tick=100;tick<=130;tick++){s.look.seekLook(tick);s.look.renderLook();const q=s.J.head.getWorldQuaternion(new s.THREE.Quaternion());if(prev)max=Math.max(max,q.angleTo(prev));prev=q.clone();}return{rows,max};});for(const row of results.directions.rows.slice(1)){assert(Math.abs(row.head+.06)<1e-12);assert.equal(row.brow,0);}assert(results.directions.max<.15);
// Baseline is preserved and restoring draft returns identical pixels.
await click('look-preset-homura');const draft=(await sample()).image;await click('look-dock-compare');assert.equal(await p.evaluate(()=>probe.model.research.baseline),true);await sample();await click('look-dock-compare');assert((await sample()).image===draft);
// Candidate source isn't automatically persisted over an existing entry.
assert(await p.evaluate(()=>JSON.parse(localStorage.getItem('pixel-rig-look-library-v1'))['眉と姿勢の往復検査'].values.face.brows.left.rect.x===.612345));
await choose('face-part','brows');await p.locator('#face-grid').scrollIntoViewIfNeeded();await sample();await p.screenshot({path:out+'/grid-portrait.png'});
await p.setViewportSize({width:852,height:393});await p.waitForTimeout(100);await sample();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:out+'/grid-landscape.png'});
// New angled brows, including a closed-eye state, must stay on the common grid
// during world translation. Keep pose, direction and lighting identical.
await p.setViewportSize({width:393,height:852});await p.waitForTimeout(100);
const measureMovement=()=>{const s=probe,r=s.model.research;r.preview.view='dot';r.preview.background='plain';r.preview.light='day';r.preview.blink=false;s.state.shadow=false;
 const capture=(gx,gy)=>{const tx=s.texel(),X=gx*tx,Z=gy*tx/s.SINP;s.J.root.position.set(X,0,Z);const rt=s.post.mkRT(s.scene.W,s.scene.H);s.scene.renderWorld({f1:true,f2:true,f3:true,face:'pixel'},X,Z,gx,-gy+Math.round(.9*s.COSP/tx),gx,gy,{target:rt,blob:false});const size=44,x=Math.floor(s.scene.W/2)-22,y=Math.floor(s.scene.H/2)-Math.round(.9*s.COSP/tx)-3,a=new Uint8Array(size*size*4);if(x<0||y<0||x+size>rt.width||y+size>rt.height)throw Error('comparison crop outside target');s.renderer.readRenderTargetPixels(rt,x,y,size,size,a);rt.dispose();const colors=new Set();for(let i=0;i<a.length;i+=4)colors.add(`${a[i]},${a[i+1]},${a[i+2]}`);if(colors.size<4)throw Error('empty character comparison');return a;};
 const diff=(a,b)=>{const out=[];for(let i=0;i<a.length;i+=4)if([0,1,2,3].some(k=>a[i+k]!==b[i+k]))out.push({x:i/4%44,y:Math.floor(i/4/44),before:Array.from(a.slice(i,i+4)),after:Array.from(b.slice(i,i+4))});return out;},rows=[];
 for(const expression of ['neutral','angry','sad'])for(const eyes of ['open','closed'])for(let d=0;d<8;d++){r.preview.expression=expression;r.preview.eyes=eyes;r.preview.direction=d;r.preview.motion='walk';s.look.seekLook(10);s.look.renderLook();const a=capture(0,0);rows.push({expression,eyes,direction:d,vertical:diff(a,capture(0,5)),diagonal:diff(a,capture(7,7))});}s.renderer.setRenderTarget(null);return rows;};
await p.evaluate(d=>probe.ui.applyLookDocument(d),source);results.expressionMovement=await p.evaluate(measureMovement);
// Compare residual positions and colors with the immutable source on this same GPU.
const referenceCommit='737c26d011f9a2e1a3b7cead3097b8cfb0d41a7f',root=resolve(out+'/reference-source');mkdirSync(root,{recursive:true});
execFileSync('tar',['-x','-C',root],{input:execFileSync('git',['archive',referenceCommit],{maxBuffer:64*1024*1024})});if(!existsSync(root+'/node_modules'))symlinkSync(resolve('node_modules'),root+'/node_modules');
baselineServer=await createServer({root,cacheDir:resolve(out+'/reference-cache'),server:{host:'127.0.0.1',port:5205,strictPort:true,hmr:false,watch:{ignored:['**/work/**']}},plugins:server.config.plugins.filter(p=>p.name==='homura-probe')});await baselineServer.listen();
const beforePage=await browser.newPage({viewport:{width:393,height:852},hasTouch:true,isMobile:true});await beforePage.addInitScript(()=>{requestAnimationFrame=()=>0;});await beforePage.goto('http://127.0.0.1:5205/?study=look&preset=homura-01');await beforePage.waitForFunction(()=>window.probe);await beforePage.evaluate(d=>probe.ui.applyLookDocument(d),source);
const referenceMovement=await beforePage.evaluate(measureMovement);assert.deepEqual(results.expressionMovement,referenceMovement,'no new residual; compare exact positions and both colors against source');await beforePage.close();
results.movementReference={commit:referenceCommit,conditions:48,referenceDifferencesExactlyEqual:true,residualConditions:referenceMovement.filter(r=>r.vertical.length||r.diagonal.length).length};
for(const row of results.expressionMovement.filter(r=>r.direction===0)){assert.equal(row.vertical.length,0);assert.equal(row.diagonal.length,0);}

await click('look-exit');assert.equal(await p.evaluate(()=>probe.characterStudy.variant),'precise');assert.equal(await p.evaluate(()=>probe.post.postMat.uniforms.uResearchStamp.value),0);assert.deepEqual(errors,[]);
writeFileSync(out+'/gallery.json',JSON.stringify(gallery));writeFileSync(out+'/results.json',JSON.stringify(results,null,2));console.log('Brow/pose: full user JSON, three expressions in dot/3D, grid/paint, 14 pose roundtrips, playing restore, 8 directions, save/reload/copy and normal B passed');
}finally{await browser.close();await baselineServer?.close();await server.close();}
