// Compare the adopted source's explicit B with the new NORMAL rendering path.
// Adapters and readback live only in the test servers, not in shipped code.
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
import {execFileSync} from 'node:child_process';
import {mkdirSync,mkdtempSync,symlinkSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const referenceCommit='6db4a155d49f97017395401448af45d1cf6cf995';
const output=resolve('work/character-default');mkdirSync(output,{recursive:true});
const reference=mkdtempSync(output+'/reference-');
execFileSync('tar',['-x','-C',reference],{input:execFileSync('git',['archive',referenceCommit,'src','index.html','vite.config.ts','tsconfig.json','package.json'],{maxBuffer:16*1024*1024})});
symlinkSync(resolve('node_modules'),reference+'/node_modules','dir');
const renderingPaths=['src/render/character-depth-experiment.ts','src/render/shaders.ts','src/materials','src/character','src/core','src/gameplay','src/input','src/world'];
assert.equal(execFileSync('git',['diff',referenceCommit,'--',...renderingPaths]).length,0,'adopted depth shader, geometry, animation and input must not change; research integration is checked by pixel equivalence');
const servers=[];
for(const [root,port,isReference] of [[reference,5182,true],[process.cwd(),5181,false]]){
 const server=await createServer({root,server:{host:'127.0.0.1',port,strictPort:true,hmr:false,watch:{ignored:['**/work/**']}},plugins:[{name:'default-comparison-adapter',transform(code,id){if(id.endsWith('/src/main.ts'))return code+`
import * as validation from './debug/validation';
import * as scene from './render/scene';
import {mkRT} from './render/post';
import {renderer} from './render/renderer';
import {setPlayerWorld} from './gameplay/player';
import {expr,triggerEmote} from './character/expression';
import {seedRuntime} from './core/random';
// Seed the simulation after GPU resource construction; Three UUID allocation also consumes Math.random.
seedRuntime(20261107);
${isReference ? "characterStudy.variant='precise';" : ''}
window.probe={validation,scene,renderer,state,expr,triggerEmote,drawWorld,setPlayerWorld,characterStudy,mkRT};`;}}]});
 await server.listen();servers.push(server);
}
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],results=[],transitions=[];
const hash=a=>createHash('sha256').update(Buffer.from(a,'base64')).digest('hex');
try{
 for(const [name,viewport,dpr] of [['portrait',{width:393,height:852},3],['landscape',{width:852,height:393},3],['odd',{width:1101,height:901},1.25]]){
  const pages=[];
  for(const port of [5182,5181]){
   const p=await browser.newPage({viewport,deviceScaleFactor:dpr});pages.push(p);
   p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   await p.addInitScript(()=>{
    let now=0,callbacks=[],seed=20261107;performance.now=()=>now;
    Math.random=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
    requestAnimationFrame=cb=>{callbacks.push(cb);return callbacks.length;};
    window.advance=n=>{for(let i=0;i<n;i++){now+=1000/60;const c=callbacks;callbacks=[];c.forEach(cb=>cb(now));}};
    window.reads=0;for(const C of [WebGLRenderingContext,WebGL2RenderingContext]){const fn=C.prototype.readPixels;C.prototype.readPixels=function(...a){window.reads++;return fn.apply(this,a);};}
   });
   await p.goto(`http://127.0.0.1:${port}/`);await p.waitForFunction(()=>window.probe);await p.waitForTimeout(60);
  }
  const both=fn=>Promise.all(pages.map(p=>p.evaluate(fn)));
  async function compare(label,frames=2){
   const shots=await Promise.all(pages.map(p=>p.evaluate(frames=>{
    const s=probe;window.reads=0;advance(frames);const normalReads=window.reads;
    const conditions=s.validation.result().conditions;
    const {W,H,rtWLo,rtWHi,rtWND}=s.scene,target=s.mkRT(W,H);
    s.drawWorld({target});
    const read=rt=>{const a=new Uint8Array(rt.width*rt.height*4);s.renderer.readRenderTargetPixels(rt,0,0,rt.width,rt.height,a);let str='';for(let i=0;i<a.length;i+=8192)str+=String.fromCharCode(...a.subarray(i,i+8192));return btoa(str);};
    const colorTarget=s.state.f2?rtWLo:rtWHi;
    const bytes={color:read(colorTarget),normalDepth:read(rtWND),final:read(target)};
    const gl=s.renderer.getContext();s.renderer.setRenderTarget(colorTarget);const depthBits=gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE);
    target.dispose();s.renderer.setRenderTarget(null);
    return {bytes,conditions,depthBits,normalReads};
   },frames)));
   const [a,b]=shots;assert.equal(a.normalReads,0);assert.equal(b.normalReads,0);
   assert.equal(b.conditions.mode,'通常操作');assert.equal(b.conditions.characterStudy.selection,'default');assert.equal(b.conditions.characterStudy.variant,'precise');assert.equal(b.depthBits,24);
   assert.deepEqual(b.conditions.state,a.conditions.state,`${name}/${label}: pose/time/camera`);
   assert.deepEqual(b.conditions.settings,a.conditions.settings,`${name}/${label}: settings`);
   const hashes={};for(const stage of Object.keys(a.bytes)){assert.equal(b.bytes[stage],a.bytes[stage],`${name}/${label}: raw ${stage} bytes`);hashes[stage]=hash(b.bytes[stage]);}
   results.push({viewport:name,label,variant:b.conditions.characterStudy.variant,selection:b.conditions.characterStudy.selection,depthBits:b.depthBits,normalReadbacks:b.normalReads,hashes});
  }
  await compare('first-normal-frame');
  // Initial auto mode off for reproducible manual input.
  await both(()=>{probe.state.auto=false;});
  for(const S of [16,24,32,48])for(const dot of [2,4,7]){
   await Promise.all(pages.map(p=>p.evaluate(({S,dot})=>{probe.state.S=S;probe.state.dot=dot;probe.scene.rebuild();probe.scene.resize();}, {S,dot})));
   await compare(`S${S}-dot${dot}`);
  }
  await both(()=>{probe.state.S=32;probe.state.dot=4;probe.scene.rebuild();probe.scene.resize();probe.setPlayerWorld(0,2.5);});
  for(const keys of [['ArrowDown'],['ArrowDown','ArrowRight'],['ArrowRight']]){
   for(const k of keys)await Promise.all(pages.map(p=>p.keyboard.down(k)));
   for(let i=0;i<4;i++)await compare(`move-${keys.join('+')}-${i}`,8);
   for(const k of keys)await Promise.all(pages.map(p=>p.keyboard.up(k)));
   await compare('stop-'+keys.join('+'));
  }
  for(const face of ['pixel','3d','uv']){
   await Promise.all(pages.map(p=>p.evaluate(face=>{probe.state.face=face;probe.expr.seq=[[2,9]];probe.expr.seqT=0;},face)));await compare('blink-'+face,1);
   await both(()=>probe.triggerEmote('angry'));await compare('emotion-'+face,12);
  }
  await both(()=>{probe.state.face='pixel';probe.expr.emote=null;probe.expr.seq=[];});
  for(const [label,x,z] of [['tree',13,-10],['building',-7.5,-4.9],['water',8,10]]){
   await Promise.all(pages.map(p=>p.evaluate(([x,z])=>probe.setPlayerWorld(x,z),[x,z])));await compare(label);
  }
  for(const tod of ['evening','night','day']){await Promise.all(pages.map(p=>p.evaluate(tod=>probe.state.tod=tod,tod)));await compare(tod);}
  for(const setting of ['shadow','f1','f2','f3','f4']){
   await Promise.all(pages.map(p=>p.evaluate(k=>probe.state[k]=false,setting)));await compare(setting+'-off');
   await Promise.all(pages.map(p=>p.evaluate(k=>probe.state[k]=true,setting)));await compare(setting+'-on');
  }
  // Explicit comparison paths: observe real depth allocation and raw color/ND,
  // not only the reported variant. Reset keeps the explicit selection.
  const observed=[];
  for(const selection of ['baseline','anchored','precise','default']){
   await pages[1].evaluate(selection=>{const e=document.getElementById('v-character-variant');e.value=selection;e.dispatchEvent(new Event('change'));probe.validation.resetValidation();},selection);
   const c=await pages[1].evaluate(()=>{
    const s=probe;s.drawWorld();const gl=s.renderer.getContext();s.renderer.setRenderTarget(s.scene.rtWLo);const bits=gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE);s.renderer.setRenderTarget(null);
    const a=new Uint8Array(s.scene.W*s.scene.H*4);s.renderer.readRenderTargetPixels(s.scene.rtWND,0,0,s.scene.W,s.scene.H,a);
    return {conditions:s.validation.result().conditions,bits,nd:Array.from(a)};
   });
   assert.equal(c.conditions.characterStudy.selection,selection);assert.equal(c.conditions.characterStudy.variant,selection==='default'?'precise':selection);assert.equal(c.bits,['precise','default'].includes(selection)?24:16);observed.push(c);
  }
  assert.notDeepEqual(observed[0].nd,observed[1].nd,'baseline vs anchored ND distinguishes actual outline path');assert.deepEqual(observed[1].nd,observed[2].nd);assert.deepEqual(observed[2].nd,observed[3].nd);
  // Both apps take the same reset/return path, then force B ONLY in the old app.
  await pages[0].evaluate(()=>probe.validation.resetValidation());
  await both(()=>probe.validation.leaveValidation());await pages[0].evaluate(()=>probe.characterStudy.variant='precise');
  await compare('return-from-comparison');
  transitions.push({viewport:name,choices:observed.map(c=>({selection:c.conditions.characterStudy.selection,variant:c.conditions.characterStudy.variant,depthBits:c.bits})),outlinePathDistinguished:true});
  await Promise.all(pages.map(p=>p.close()));
 }
 assert.deepEqual(errors,[]);
 const report={referenceCommit,referenceBuild:'gh-42367092877-1-6db4a155d49f',referenceMode:'explicit B',newMode:'normal default (no manual B selection)',browser:await browser.version(),renderer:'SwiftShader',method:'Same seeded random, RAF, inputs, pose, camera and light. Zero-tolerance full raw color / normal-depth / final RGBA comparison. Diagnostic readback excluded from normal rendering; no performance measurement.',renderingSourcesUnchanged:renderingPaths,cases:results.length,transitions,results,errors};
 writeFileSync(output+'/equivalence.json',JSON.stringify(report,null,2)+'\n');console.log(`Default B matches adopted B in ${results.length} cases / three raw buffers; transitions and actual depth/outline paths passed`);
}finally{await browser.close();for(const s of servers)await s.close();}
