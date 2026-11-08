// Issue #10. Raw render-target bytes, never video/screenshot compression.
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
import {writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const output='work/character-stability';mkdirSync(output,{recursive:true});
const server=await createServer({server:{host:'127.0.0.1',port:5179,strictPort:true,hmr:false,watch:{ignored:['**/work/**']}},plugins:[{name:'character-test-adapter',transform(code,id){if(id.endsWith('/src/main.ts'))return code+`
import * as scene from './render/scene';
import * as rig from './character/rig';
import * as post from './render/post';
import { renderer } from './render/renderer';
import { worldScene } from './world/world';
import { decalScene } from './world/decals';
import { expr, triggerEmote } from './character/expression';
import * as validation from './debug/validation';
window.study={scene,rig,post,renderer,worldScene,decalScene,expr,triggerEmote,state,shared,texel,SINP,COSP,validation,characterStudy,drawWorld,player};`;}}]});
await server.listen();
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],matrix=[],ablations=[],regressions=[];
try {
 const page=await browser.newPage({viewport:{width:1101,height:901},deviceScaleFactor:1.25});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.addInitScript(()=>{
  let now=0,callbacks=[]; requestAnimationFrame=cb=>{callbacks.push(cb);return callbacks.length;};
  window.advance=n=>{for(let i=0;i<n;i++){now+=1000/60;const c=callbacks;callbacks=[];c.forEach(cb=>cb(now));}};
  window.reads=0;for(const C of [WebGLRenderingContext,WebGL2RenderingContext]){const read=C.prototype.readPixels;C.prototype.readPixels=function(...a){window.reads++;return read.apply(this,a);};}
 });
 await page.goto('http://127.0.0.1:5179');await page.waitForFunction(()=>window.study);await page.waitForTimeout(80);
 // Helpers live only in the test server, not the deployed app.
 await page.evaluate(()=>{
 const s=window.study;
 const diff=(a,b,channels=[0,1,2,3])=>{let count=0,max=0;const examples=[];for(let p=0;p<a.length;p+=4){let changed=false;for(const c of channels){const d=Math.abs(a[p+c]-b[p+c]);max=Math.max(max,d);changed ||= d!==0;}if(changed){count++;if(examples.length<8)examples.push({pixel:p/4,before:Array.from(a.slice(p,p+4)),after:Array.from(b.slice(p,p+4))});}}return {count,max,examples};};
 window.difference=diff;
 window.capture=(o={})=>{
  const {scene,rig,post,renderer,worldScene,decalScene,expr,state,shared,texel,SINP,COSP,characterStudy}=s;
  const {gx=0,gy=0,angle=0,pose=.25,follow=true,variant='baseline',world=false,shadow=false,outline=true,lighting=true,tod='day',face='pixel',blink=0,emotion=null}=o;
  state.shadow=shadow;state.tod=tod;state.face=face;characterStudy.variant=variant;
  worldScene.visible=world;decalScene.visible=world;expr.autoBlink=false;expr.emote=emotion;expr.seq=blink?[[blink,9]]:[];
  rig.walkPose(pose);rig.J.motion.position.set(0,0,0);rig.J.motion.rotation.set(0,0,0);
  const tx=texel(),X=gx*tx,Z=gy*tx/SINP;
  rig.J.root.position.set(X,0,Z);rig.J.root.rotation.y=angle;rig.setFace(face);
  // Lighting-off is a test-only colour-material uniform override, applied after
  // applyLight. No production lighting algorithm or default is changed.
  const camX=follow?gx:0,camY=(follow?-gy:0)+Math.round(.9*COSP/tx);
  const target=post.mkRT(scene.W,scene.H);
  scene.renderWorld({f1:true,f2:true,f3:outline,face},X,Z,camX,camY,gx,gy,{target,blob:world});
  if(!lighting){shared.uAmb.value=1;shared.uSunInt.value=0;shared.uPLN.value=0;shared.uSunCol.value.set(1,1,1);post.pass(rig.charScene,scene.worldCam,scene.rtWLo,true);renderer.setRenderTarget(target);renderer.clear();renderer.render(post.postScene,post.postCam);}
  const size=state.S+4,cx=Math.floor(scene.W/2)+gx-camX,cy=Math.floor(scene.H/2)-gy-camY;
  const x=cx-Math.floor(size/2),y=cy-3;
  if(x<1||y<1||x+size>=scene.W||y+size>=scene.H)throw new Error('ROI clipped; this is not a valid character comparison');
  const read=rt=>{const bytes=new Uint8Array(size*size*4);renderer.readRenderTargetPixels(rt,x,y,size,size,bytes);return bytes;};
  const frame={color:read(scene.rtWLo),nd:read(scene.rtWND),final:read(target),size,x,y,camX,camY,gx,gy};
  target.dispose();return frame;
 };
 window.runCase=o=>{
  const {state,scene}=s;state.S=o.S;state.dot=o.dot;scene.rebuild();scene.resize();
  const frames={baseline:[],anchored:[]},sums={};
  for(const variant of ['baseline','anchored'])for(let step=0;step<24;step++)frames[variant].push(window.capture({...o,variant,gx:step*o.path[0],gy:step*o.path[1]}));
  for(const variant of ['baseline','anchored']){
   const series={color:[],final:[],normal:[],coverage:[]};
   for(let i=1;i<24;i++){const a=frames[variant][i-1],b=frames[variant][i];series.color.push(diff(a.color,b.color).count);series.final.push(diff(a.final,b.final).count);series.normal.push(diff(a.nd,b.nd,[0,1]).count);series.coverage.push(diff(a.color,b.color,[3]).count);}
   sums[variant]=Object.fromEntries(Object.entries(series).map(([k,v])=>[k,{total:v.reduce((a,b)=>a+b,0),max:Math.max(...v),changedTransitions:v.filter(Boolean).length}]));
  }
  let rawAB=0,normalAB=0,coverageAB=0,classificationAB=0;
  for(let i=0;i<24;i++){const a=frames.baseline[i],b=frames.anchored[i];rawAB+=diff(a.color,b.color).count;normalAB+=diff(a.nd,b.nd,[0,1]).count;coverageAB+=diff(a.final,b.final,[3]).count;for(let p=3;p<a.nd.length;p+=4)classificationAB+=(a.nd[p]%16)!==(b.nd[p]%16)?1:0;}
  if(o.S===32&&o.dot===4&&o.angle===0&&o.path[0]===0&&o.path[1]===1&&o.follow){window.witness=frames;}
  return {...o,frames:24,comparedPerTransition:(o.S+4)**2,metrics:sums,rawAB,normalAB,coverageAB,classificationAB};
 };
 });
 for(const dot of (process.env.CHARACTER_MATRIX === '0' ? [] : process.env.CHARACTER_CI ? [4] : [2,4,7]))for(const S of [16,24,32,48]){
  for(const angle of [0,Math.PI/2,Math.PI,Math.PI/4])for(const path of [[1,0],[0,1],[1,1]])for(const follow of [true,false]){
   // fixed-camera long paths need sufficient common view at the largest dot.
   const r=await page.evaluate(o=>runCase(o),{S,dot,angle,path,follow});
   for(const k of ['rawAB','normalAB','coverageAB','classificationAB'])assert.equal(r[k],0,`${k}: candidate changed non-depth output`);
   matrix.push(r);
  }
  console.log(`matrix S=${S} dot=${dot} complete`);
 }
 // Repeat control and independent switches: no movement, no outline, unlit,
 // shadows, other sun direction, all four walk poses / eight visible directions.
 for(const extra of [{path:[0,0]},{outline:false},{lighting:false},{shadow:true},{tod:'evening'},...Array.from({length:8},(_,i)=>({angle:i*Math.PI/4})),...Array.from({length:4},(_,i)=>({pose:i/4}))]){
  const r=await page.evaluate(o=>runCase(o),{S:32,dot:4,angle:0,path:[0,1],follow:true,...extra});ablations.push(r);
  assert.equal(r.rawAB,0);assert.equal(r.normalAB,0);assert.equal(r.classificationAB,0);
 }
 // Save the raw matched-pose witness: first pair where baseline changes and A
 // does not. Background is transparent black; scale by integer nearest pixels.
 const witness=await page.evaluate(()=>{
  runCase({S:32,dot:4,angle:0,path:[0,1],follow:true});
  const f=window.witness;let i=1;while(i<24&&!difference(f.baseline[i-1].final,f.baseline[i].final).count)i++;
  const a=f.baseline[i-1],b=f.baseline[i],c=f.anchored[i-1],d=f.anchored[i];
  const canvas=document.createElement('canvas');canvas.width=a.size*4;canvas.height=a.size;const ctx=canvas.getContext('2d');
  [a,b,c,d].forEach((f,k)=>{const data=new Uint8ClampedArray(f.final.length);for(let y=0;y<f.size;y++)for(let x=0;x<f.size;x++){const src=(y*f.size+x)*4,dst=((f.size-y-1)*f.size+x)*4;data.set(f.final.slice(src,src+4),dst);data[dst+3]=255;}ctx.putImageData(new ImageData(data,f.size,f.size),k*f.size,0);});
  const big=document.createElement('canvas');big.width=canvas.width*6;big.height=canvas.height*6;const g=big.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(canvas,0,0,big.width,big.height);
  const changes=difference(a.final,b.final);
  const depth=p=>{const A=a.nd[p*4+3],B=b.nd[p*4+3];return {a:(a.nd[p*4+2]*16+Math.floor(A/16))/4095,b:(b.nd[p*4+2]*16+Math.floor(B/16))/4095};};
  return {png:big.toDataURL(),frames:[i-1,i],changes,raw:difference(a.color,b.color),candidate:difference(c.final,d.final),depths:changes.examples.map(e=>({pixel:[e.pixel%a.size,Math.floor(e.pixel/a.size)],center:depth(e.pixel),neighbors:[-1,1,-a.size,a.size].map(n=>depth(e.pixel+n))})),width:a.size};
 });
 writeFileSync(`${output}/witness.png`,Buffer.from(witness.png.split(',')[1],'base64'));delete witness.png;
 // Full-scene A/B: identical raw colour, classification/coverage, and no changes
 // outside character plus its immediate outline neighbours (no background masks
 // selected by difference value). Background also tested independently below.
 const overlap=await page.evaluate(()=>{
  const {state,scene,texel,SINP}=study;state.S=32;state.dot=4;scene.rebuild();scene.resize();
  const results=[];
  const positions=[[0,2.5],[13,-10],[14,-10],[-7.5,-4.9],[-7.5,-9.5],[-9.5,-8],[9.8,-5],[0,0]];
  for(const x of [12,12.5,13,13.5,14])for(const z of [-13.5,-13,-12.5])positions.push([x,z]);
  for(const [x,z]of positions)for(const shadow of [true,false]){
   const o={gx:Math.round(x/texel()),gy:Math.round(z*SINP/texel()),world:true,shadow};
   const a=capture({...o,variant:'baseline'}),b=capture({...o,variant:'anchored'});
   let outside=0,idChanged=0,character=0,background=0;
   for(let p=0;p<a.size*a.size;p++){
    const id=a.nd[p*4+3]%16;idChanged+=(id!==b.nd[p*4+3]%16)?1:0;if(id===2)character++;else background++;
    const related=[0,-1,1,-a.size,a.size].some(n=>p+n>=0&&p+n<a.size*a.size&&a.nd[(p+n)*4+3]%16===2);
    if(!related&&difference(a.final.slice(p*4,p*4+4),b.final.slice(p*4,p*4+4)).count)outside++;
   }
   results.push({x,z,shadow,character,background,rawAB:difference(a.color,b.color).count,idChanged,outside,changed:difference(a.final,b.final).count});
  }return results;
 });
 overlap.forEach(r=>{assert.equal(r.rawAB,0);assert.equal(r.idChanged,0);assert.equal(r.outside,0);});regressions.push({name:'occlusion/background A/B',cases:overlap});
 assert(overlap.some(r=>r.character>0&&r.character<180),'must include actual partial occlusion, not only nearby objects');
 const effects=await page.evaluate(()=>{
  const {texel,SINP}=study,shadows=[],expressions=[];
  for(const x of [12,13,14,15])for(const z of [-13.5,-13,-12.5,-12]){
   const o={gx:Math.round(x/texel()),gy:Math.round(z*SINP/texel()),world:true};
   const a=capture({...o,shadow:false}),b=capture({...o,shadow:true});let changed=0,compared=0;
   for(let p=0;p<a.size*a.size;p++)if(a.nd[p*4+3]%16===2&&b.nd[p*4+3]%16===2){compared++;if(difference(a.color.slice(p*4,p*4+4),b.color.slice(p*4,p*4+4)).count)changed++;}
   shadows.push({x,z,compared,changed});
  }
  for(const variant of ['baseline','anchored'])for(const face of ['pixel','3d','uv']){
   const a=capture({variant,face}),b=capture({variant,face,emotion:{key:'angry',t:.5,dur:1.8}});
   expressions.push({variant,face,expressionChanged:difference(a.final,b.final).count});
  }
  return {shadows,expressions};
 });
 assert(effects.shadows.some(r=>r.changed>0),'shadow-on/off control must actually change character lighting');
 effects.expressions.filter(r=>r.face==='pixel').forEach(r=>assert(r.expressionChanged>0,'intentional brow/icon expression must remain'));
 // V6-03 replay + static-background checks with the candidate active, and
 // same-time pose/eye/face checks proving animation has not been removed.
 const ui=await page.evaluate(()=>{
  const {validation:v,state,worldScene,decalScene,characterStudy,renderer}=study;
  worldScene.visible=true;decalScene.visible=true;state.shadow=true;state.tod='day';state.S=32;state.dot=4;
  const select=key=>{const e=document.getElementById('v-preset');e.value=key;e.dispatchEvent(new Event('change'));};
  const backgrounds=[];
  for(const key of ['color-vertical','color-diagonal','color-horizontal','color-walk','color-trees']){
   select(key);characterStudy.variant='anchored';v.resetValidation();document.getElementById('v-base').click();v.seekValidation(.5);const r=v.compareStatic();backgrounds.push({key,result:r.result});
  }
  select('color-walk');v.seekValidation(0);const start=v.snapshot();v.seekValidation(1);const end=v.snapshot();
  characterStudy.freezePose=true;select('color-vertical');v.seekValidation(.5);const frozen=v.snapshot();
  const counts=[];for(const variant of ['baseline','anchored']){characterStudy.variant=variant;window.reads=0;v.startMeasurement(.05,.1);advance(20);counts.push({variant,reads:window.reads,result:v.result().performance.result});}
  v.leaveValidation();return {backgrounds,stationary:{start,end},frozen,counts,returnedVariant:characterStudy.variant,controlsDisabled:document.getElementById('normal-controls').disabled};
 });
 for(const r of ui.backgrounds)assert.equal(r.result.changed,0,`${r.key}: background stability`);
 assert.deepEqual(ui.stationary.start.player,ui.stationary.end.player);assert.notEqual(ui.stationary.start.phase,ui.stationary.end.phase);
 assert.equal(ui.frozen.expression.autoBlink,false);ui.counts.forEach(r=>assert.equal(r.reads,0));assert.equal(ui.returnedVariant,'precise');assert.equal(ui.controlsDisabled,false);
 const animation=await page.evaluate(()=>{
  const r=[];for(const variant of ['baseline','anchored']){
   const a=capture({variant,pose:0}),b=capture({variant,pose:.25}),c=capture({variant,pose:0,blink:2});
   r.push({variant,walk:difference(a.final,b.final).count,blink:difference(a.final,c.final).count});
  }return r;
 });animation.forEach(r=>{assert(r.walk>0);assert(r.blink>0);});
 const aggregate=Object.fromEntries(['baseline','anchored'].map(v=>[v,Object.fromEntries(['color','final','normal','coverage'].map(k=>[k,matrix.reduce((n,r)=>n+r.metrics[v][k].total,0)]))]));
 if(matrix.length){assert(aggregate.baseline.final>0,'the test MUST catch the old symptom');assert(aggregate.anchored.final<aggregate.baseline.final,'A must improve the same test');}
 const witnessCase=matrix.find(r=>r.S===32&&r.dot===4&&r.angle===0&&r.path[0]===0&&r.path[1]===1&&r.follow) ?? await page.evaluate(o=>runCase(o),{S:32,dot:4,angle:0,path:[0,1],follow:true});
 assert(witnessCase.metrics.baseline.final.total>0);assert.equal(witnessCase.metrics.anchored.final.total,0);
 assert.deepEqual(errors,[]);
 writeFileSync(`${output}/${process.env.CHARACTER_MATRIX === '0'?'effects':'results'}.json`,JSON.stringify({browser:await browser.version(),renderer:'SwiftShader',method:'24 integer positions, fixed walk pose 0.25 unless specified; same facing/light; aligned foot ROI S+4 including all character and 1px outline, raw render-target RGBA; no difference-dependent exclusion. Each variant compared between consecutive positions. GPU readback is diagnostic only.',viewport:{width:1101,height:901,dpr:1.25},aggregate,matrix,ablations,witness,regressions,effects,ui,animation,errors},null,2)+'\n');
 console.log(JSON.stringify({aggregate,witness,animation,errors},null,2));
}finally{await browser.close();await server.close();}
