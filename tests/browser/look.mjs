import {chromium} from 'playwright-core';
import {createServer} from 'vite';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const output='work/look';mkdirSync(output,{recursive:true});
const server=await createServer({server:{host:'127.0.0.1',port:5185,strictPort:true,hmr:false,watch:{ignored:['**/work/**']}},plugins:[{name:'look-test',transform(code,id){if(id.endsWith('/src/main.ts'))return code+`
import * as look from './research/runtime';import * as model from './research/model';import * as ui from './research/ui';import * as scene from './render/scene';import {renderer} from './render/renderer';import * as post from './render/post';window.lookTest={look,model,ui,scene,renderer,post,J,characterStudy,state,drawWorld};`;}}]});await server.listen();
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],results=[];
try{
 for(const [name,viewport]of [['portrait',{width:393,height:852}],['landscape',{width:852,height:393}]]){
 const p=await browser.newPage({viewport,deviceScaleFactor:3,hasTouch:true,isMobile:true});p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.addInitScript(()=>{window.reads=0;for(const C of [WebGLRenderingContext,WebGL2RenderingContext]){const fn=C.prototype.readPixels;C.prototype.readPixels=function(...a){window.reads++;return fn.apply(this,a);};}});
 await p.goto('http://127.0.0.1:5185/?study=look');await p.waitForFunction(()=>window.lookTest);
 const click=async id=>p.locator('#'+id).evaluate(e=>e.click());
 const snapshot=()=>p.evaluate(()=>{const {look,model,J}=lookTest;look.renderLook();return {ticks:look.lookClock.ticks,head:J.head.matrixWorld.elements.slice(),torso:J.torso.matrixWorld.elements.slice(),values:JSON.parse(JSON.stringify(model.effectiveLook()))};});
 // Compare the active default research compositor with unmodified B on the exact same pose and buffers.
 assert.equal(await p.evaluate(()=>{const s=lookTest;s.look.renderLook();const rt=s.post.mkRT(s.scene.W,s.scene.H);const read=()=>{s.renderer.setRenderTarget(rt);s.renderer.render(s.post.postScene,s.post.postCam);const b=new Uint8Array(rt.width*rt.height*4);s.renderer.readRenderTargetPixels(rt,0,0,rt.width,rt.height,b);return b;};const a=read();s.post.postMat.uniforms.uLookOn.value=0;const b=read();s.post.postMat.uniforms.uLookOn.value=1;rt.dispose();s.renderer.setRenderTarget(null);window.reads=0;return a.every((v,i)=>v===b[i]);}),true);
 const base=await snapshot();await p.fill('#look-headTilt-number','10');await p.dispatchEvent('#look-headTilt-number','input');const adjusted=await snapshot();assert.notDeepEqual(adjusted.head,base.head);
 await p.selectOption('#look-compare','baseline');assert.deepEqual((await snapshot()).head,base.head);await p.selectOption('#look-compare','draft');assert.deepEqual((await snapshot()).head,adjusted.head);
 await p.locator('[data-look-reset="headTilt"]').click();assert.deepEqual((await snapshot()).head,base.head);
 await p.selectOption('#look-motion','walk');await click('look-step');assert.equal((await snapshot()).ticks,1);
 for(const motion of ['still','idle','walk','vertical','diagonal'])for(const direction of ['0','1','2','3','4','5','6','7']){await p.selectOption('#look-motion',motion);await p.selectOption('#look-direction',direction);await click('look-step');await snapshot();}
 for(const view of ['3d','dot']){await p.selectOption('#look-view',view);await snapshot();assert.equal(await p.evaluate(()=>lookTest.characterStudy.variant),'precise');}
 await p.selectOption('#look-background','plain');await p.selectOption('#look-motion','idle');await p.selectOption('#look-direction','0');await p.fill('#look-headTilt-number','6');await p.dispatchEvent('#look-headTilt-number','input');
 await p.evaluate(()=>{document.querySelector('#look-name').closest('details').open=true;});await p.fill('#look-name','端末テスト');await click('look-save');assert.match(await p.locator('#look-message').textContent(),/保存しました/);
 const expected=await p.evaluate(()=>lookTest.ui.lookDocument());await p.reload();await p.waitForFunction(()=>window.lookTest);await p.evaluate(()=>document.querySelector('#look-name').closest('details').open=true);await p.selectOption('#look-saved','端末テスト');await click('look-load');assert.deepEqual(await p.evaluate(()=>lookTest.ui.lookDocument()),expected);
 await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}}));await click('look-copy');const text=await p.locator('#look-json').inputValue();await p.fill('#look-headTilt-number','2');await p.dispatchEvent('#look-headTilt-number','input');await p.fill('#look-json',text);await click('look-paste');assert.deepEqual(await p.evaluate(()=>lookTest.ui.lookDocument()),expected);
 await p.fill('#look-json','{"schema":999}');await click('look-paste');assert.match(await p.locator('#look-message').textContent(),/未対応/);assert.deepEqual(await p.evaluate(()=>lookTest.ui.lookDocument()),expected);
 await p.evaluate(()=>{const save=Storage.prototype.setItem;window.restoreStorage=()=>Storage.prototype.setItem=save;Storage.prototype.setItem=()=>{throw Error('容量制限');};});await click('look-save');assert.match(await p.locator('#look-message').textContent(),/容量制限/);await p.evaluate(()=>restoreStorage());
 await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied');}}}));await click('look-copy');assert.match(await p.locator('#look-message').textContent(),/コピーできません/);
 assert.equal(await p.evaluate(()=>window.reads),0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.locator('#look-panel').evaluate(e=>e.parentElement.scrollTop=0);await p.screenshot({path:`${output}/${name}.png`});
 await click('look-exit');assert.equal(await p.evaluate(()=>lookTest.model.research.active),false);assert.equal(await p.evaluate(()=>lookTest.characterStudy.variant),'precise');assert.equal(await p.evaluate(()=>lookTest.J.head.position.y),.56);
 results.push({name,directions:8,motions:5,storageRoundTrip:true,clipboardRoundTrip:true,rejectedInvalid:true,normalReads:0});await p.close();
 }
 assert.deepEqual(errors,[]);writeFileSync(output+'/foundation.json',JSON.stringify({results,errors},null,2));console.log('Look foundation: two orientations, controls/comparison/8 directions/motions/storage/errors/return passed');
}finally{await browser.close();await server.close();}
