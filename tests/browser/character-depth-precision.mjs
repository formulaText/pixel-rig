// Issue #10. Raw render-target bytes, never video/screenshot compression.
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
import {writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const output='work/character-depth-precision';mkdirSync(output,{recursive:true});
const server=await createServer({server:{host:'127.0.0.1',port:5180,strictPort:true,hmr:false,watch:{ignored:['**/work/**']}},plugins:[{name:'character-test-adapter',transform(code,id){if(id.endsWith('/src/main.ts'))return code+`
import * as THREE from 'three';
import * as scene from './render/scene';
import * as rig from './character/rig';
import * as post from './render/post';
import { renderer } from './render/renderer';
import { worldScene } from './world/world';
import { decalScene } from './world/decals';
import { expr, triggerEmote } from './character/expression';
import * as validation from './debug/validation';
window.study={THREE,scene,rig,post,renderer,worldScene,decalScene,expr,triggerEmote,state,shared,texel,SINP,COSP,validation,characterStudy,drawWorld,player};`;}}]});
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
 await page.goto('http://127.0.0.1:5180');await page.waitForFunction(()=>window.study);await page.waitForTimeout(80);
 // Helpers live only in the test server, not the deployed app.
 await page.evaluate(()=>{
 const s=window.study;
 const diff=(a,b,channels=[0,1,2,3])=>{let count=0,max=0;const examples=[];for(let p=0;p<a.length;p+=4){let changed=false;for(const c of channels){const d=Math.abs(a[p+c]-b[p+c]);max=Math.max(max,d);changed ||= d!==0;}if(changed){count++;if(examples.length<8)examples.push({pixel:p/4,before:Array.from(a.slice(p,p+4)),after:Array.from(b.slice(p,p+4))});}}return {count,max,examples};};
 window.difference=diff;
 window.capture=(o={})=>{
  const {scene,rig,post,renderer,worldScene,decalScene,expr,state,shared,texel,SINP,COSP,characterStudy}=s;
  const {gx=0,gy=0,angle=0,pose=.25,follow=true,variant='precise',world=false,shadow=false,outline=true,lighting=true,tod='day',face='pixel',blink=0,emotion=null,character=true}=o;
  state.shadow=shadow;state.tod=tod;state.face=face;characterStudy.variant=variant;
  worldScene.visible=world;decalScene.visible=world;expr.autoBlink=false;expr.emote=emotion;expr.seq=blink?[[blink,9]]:[];
  rig.walkPose(pose);rig.J.motion.position.set(0,0,0);rig.J.motion.rotation.set(0,0,0);
  const tx=texel(),X=gx*tx,Z=gy*tx/SINP;
  rig.J.root.position.set(X,0,Z);rig.J.root.rotation.y=angle;rig.setFace(face);
  // Lighting-off is a test-only colour-material uniform override, applied after
  // applyLight. No production lighting algorithm or default is changed.
  const camX=follow?gx:0,camY=(follow?-gy:0)+Math.round(.9*COSP/tx);
  const target=post.mkRT(scene.W,scene.H);
  scene.renderWorld({f1:true,f2:true,f3:outline,face},X,Z,camX,camY,gx,gy,{target,blob:world,character});
  if(!lighting){shared.uAmb.value=1;shared.uSunInt.value=0;shared.uPLN.value=0;shared.uSunCol.value.set(1,1,1);post.pass(rig.charScene,scene.worldCam,scene.rtWLo,true);renderer.setRenderTarget(target);renderer.clear();renderer.render(post.postScene,post.postCam);}
  const size=state.S+4,cx=Math.floor(scene.W/2)+gx-camX,cy=Math.floor(scene.H/2)-gy-camY;
  const x=cx-Math.floor(size/2),y=cy-3;
  if(x<1||y<1||x+size>=scene.W||y+size>=scene.H)throw new Error('ROI clipped; this is not a valid character comparison');
  const read=rt=>{const bytes=new Uint8Array(size*size*4);renderer.readRenderTargetPixels(rt,x,y,size,size,bytes);return bytes;};
  const u=post.postMat.uniforms;
  const brows=[0,1].filter(i=>u[i?'uEye1':'uEye0'].value.z>=0).map(i=>{const b=u[i?'uBrow1':'uBrow0'].value;return {x:b.x-x-1,y:b.y-y-1,w:u.uGlyph.value.x+2,h:u.uGlyph.value.y+2};});
  const frame={brows,color:read(scene.rtWLo),nd:read(scene.rtWND),final:read(target),size,x,y,camX,camY,gx,gy};
  target.dispose();return frame;
 };
 window.runCase=o=>{
  const {state,scene}=s;state.S=o.S;state.dot=o.dot;scene.rebuild();scene.resize();
  const frames={anchored:[],precise:[]},sums={};
  for(const variant of ['anchored','precise'])for(let step=0;step<24;step++)frames[variant].push(window.capture({...o,variant,gx:step*o.path[0],gy:step*o.path[1]}));
  for(const variant of ['anchored','precise']){
   const series={color:[],final:[],normal:[],coverage:[],browColor:[],browFinal:[]};
   for(let i=1;i<24;i++){const a=frames[variant][i-1],b=frames[variant][i];series.color.push(diff(a.color,b.color).count);series.final.push(diff(a.final,b.final).count);series.normal.push(diff(a.nd,b.nd,[0,1]).count);series.coverage.push(diff(a.color,b.color,[3]).count);
    for(const stage of ['color','final']){let n=0;for(let p=0;p<a.size*a.size;p++){const x=p%a.size,y=Math.floor(p/a.size);if(a.brows.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h))n+=diff(a[stage].slice(p*4,p*4+4),b[stage].slice(p*4,p*4+4)).count;}series[stage==='color'?'browColor':'browFinal'].push(n);}}
   sums[variant]=Object.fromEntries(Object.entries(series).map(([k,v])=>[k,{total:v.reduce((a,b)=>a+b,0),max:Math.max(...v),changedTransitions:v.filter(Boolean).length}]));
  }
  let rawAB=0,normalAB=0,coverageAB=0,classificationAB=0,maskAB=0;
  for(let i=0;i<24;i++){const a=frames.anchored[i],b=frames.precise[i];rawAB+=diff(a.color,b.color).count;normalAB+=diff(a.nd,b.nd,[0,1]).count;coverageAB+=diff(a.final,b.final,[3]).count;for(let p=3;p<a.nd.length;p+=4){classificationAB+=(a.nd[p]%16)!==(b.nd[p]%16)?1:0;maskAB+=(a.color[p]>0)!==(b.color[p]>0)?1:0;}}
  window.frames=frames;
  return {...o,frames:24,comparedPerTransition:(o.S+4)**2,metrics:sums,rawAB,normalAB,coverageAB,classificationAB,maskAB};
 };
 });
 // Part-ID pass keeps original geometry, material IDs, sides and draw sorting.
 // Only diagnostic fragment output changes; nothing is shipped to the app.
 await page.evaluate(()=>{
  const {rig,post,renderer,scene,THREE}=study,J=rig.J;
  const parts=new Map();let next=1;
  const add=(mesh,label)=>parts.set(mesh,{id:next++,label});
  ['tunic','belt','hem','collar'].forEach((n,i)=>add(J.torso.children[i],n));
  add(J.tail.children[0],'scarf-tail');
  ['face-skin','hair-cap','back-hair','bang-right','bang-center','bang-left','ahoge'].forEach((n,i)=>add(J.head.children[i],n));
  for(const side of ['L','R']){add(J['arm'+side].children[0],'sleeve-'+side);add(J['arm'+side].children[1],'hand-'+side);add(J['leg'+side].children[0],'pants-'+side);add(J['leg'+side].children[1],'boot-'+side);}
  window.partLabels=Object.fromEntries([...parts.values()].map(p=>[p.id,p.label]));
  window.captureIds=o=>{
   const f=capture({...o,face:'pixel',world:false}),materials=new Map(),callbacks=new Map();
   for(const [mesh,p] of parts){const m=mesh.material;if(!materials.has(m)){materials.set(m,m.fragmentShader);m.fragmentShader='uniform float uDiagnosticPart; void main(){gl_FragColor=vec4(uDiagnosticPart/255.0,0.,0.,1.);}';m.uniforms.uDiagnosticPart={value:0};m.needsUpdate=true;}
    callbacks.set(mesh,mesh.onBeforeRender);mesh.onBeforeRender=()=>{m.uniforms.uDiagnosticPart.value=p.id;m.uniformsNeedUpdate=true;};
   }
   try{post.pass(rig.charScene,scene.worldCam,scene.rtWLo,true);f.ids=new Uint8Array(f.size*f.size*4);renderer.readRenderTargetPixels(scene.rtWLo,f.x,f.y,f.size,f.size,f.ids);}
   finally{for(const [m,fs]of materials){m.fragmentShader=fs;delete m.uniforms.uDiagnosticPart;m.needsUpdate=true;}for(const [m,cb]of callbacks)m.onBeforeRender=cb;}
   return f;
  };
  window.probeDepth=w=>{
   const results=[],savedVisible=new Map([...parts.keys()].map(m=>[m,m.visible]));
   for(const step of w.steps){const o={...w.condition,gx:step*w.condition.path[0],gy:step*w.condition.path[1],variant:'anchored'};
    study.state.S=o.S;study.state.dot=o.dot;scene.rebuild();scene.resize();const f=capture(o),target=post.mkRT(scene.W,scene.H);target.texture.type=THREE.FloatType;
    for(const label of [...new Set(w.partA)]){
     const mesh=[...parts].find(([,p])=>p.label===label)?.[0];if(!mesh)continue;
     for(const m of parts.keys())m.visible=m===mesh;
     const mat=mesh.material,fs=mat.fragmentShader;mat.fragmentShader='varying vec3 vN; void main(){gl_FragColor=vec4(normalize(vN),gl_FragCoord.z);}';mat.needsUpdate=true;
     try{post.pass(rig.charScene,scene.worldCam,target,true);const v=new Float32Array(4);renderer.readRenderTargetPixels(target,f.x+w.pixel[0],f.y+w.pixel[1],1,1,v);results.push({step,part:label,normal:Array.from(v.slice(0,3)),rasterDepth:v[3],round16:Math.round(v[3]*65535),round24:Math.round(v[3]*16777215)});}
     finally{mat.fragmentShader=fs;mat.needsUpdate=true;}
    }
    for(const [m,v]of savedVisible)m.visible=v;target.dispose();
   }
   return results;
  };
  window.partWitnesses={};
  window.findPartWitnesses=o=>{
   if(Object.keys(partWitnesses).length===3)return Object.keys(partWitnesses);
   const f=window.frames;
   for(let i=1;i<24;i++){
    const a=f.anchored[i-1],b=f.anchored[i];if(!difference(a.color,b.color).count)continue;
    const opts=j=>({...o,gx:j*o.path[0],gy:j*o.path[1]});
    const ia=captureIds({...opts(i-1),variant:'anchored'}),ib=captureIds({...opts(i),variant:'anchored'});
    for(let p=0;p<a.size*a.size;p++){
     if(!difference(a.color.slice(p*4,p*4+4),b.color.slice(p*4,p*4+4)).count)continue;
     const labels=[ia,ib].map(v=>partLabels[v.ids[p*4]]??'background');
     const category=labels.some(l=>/sleeve|hand/.test(l))?'sleeve-hand':labels.some(l=>/pants|boot/.test(l))?'ankle':labels.some(l=>/^bang/.test(l))&&labels[0]!==labels[1]?'face-bang':null;
     if(!category||partWitnesses[category]||(o.targetPart&&category!==o.targetPart))continue;
     const ca=f.precise[i-1],cb=f.precise[i];
     const ba=captureIds({...opts(i-1),variant:'precise'}),bb=captureIds({...opts(i),variant:'precise'});
     const pixel=v=>Array.from(v.slice(p*4,p*4+4));
     const canvas=document.createElement('canvas');canvas.width=a.size*4;canvas.height=a.size;const ctx=canvas.getContext('2d');
     [a,b,ca,cb].forEach((v,k)=>{const data=new Uint8ClampedArray(v.final.length);for(let y=0;y<v.size;y++)for(let x=0;x<v.size;x++){const from=(y*v.size+x)*4,to=((v.size-y-1)*v.size+x)*4;data.set(v.final.slice(from,from+4),to);data[to+3]=255;}ctx.putImageData(new ImageData(data,v.size,v.size),k*v.size,0);});
     const big=document.createElement('canvas');big.width=canvas.width*8;big.height=canvas.height*8;const g=big.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(canvas,0,0,big.width,big.height);g.strokeStyle='#ff00ff';g.lineWidth=1;for(let k=0;k<4;k++)g.strokeRect((k*a.size+p%a.size)*8-1,(a.size-1-Math.floor(p/a.size))*8-1,10,10);
     partWitnesses[category]={condition:o,steps:[i-1,i],pixel:[p%a.size,Math.floor(p/a.size)],origin:'bottom-left of foot-aligned S+4 ROI',partA:labels,partB:[ba,bb].map(v=>partLabels[v.ids[p*4]]),colorA:[pixel(a.color),pixel(b.color)],colorB:[pixel(ca.color),pixel(cb.color)],finalA:[pixel(a.final),pixel(b.final)],finalB:[pixel(ca.final),pixel(cb.final)],normalA:[pixel(a.nd).slice(0,2),pixel(b.nd).slice(0,2)],normalB:[pixel(ca.nd).slice(0,2),pixel(cb.nd).slice(0,2)],png:big.toDataURL()};
    }
    if(Object.keys(partWitnesses).length===3)break;
   }
   return Object.keys(partWitnesses);
  };
 });
 // Reported sites: hold each pose/direction/light and move it; a different pose
 // is a separate sequence, never a temporal flicker comparison.
 const seen=new Set();
 async function run(o,group){const key=JSON.stringify(o);if(seen.has(key))return;seen.add(key);const r=await page.evaluate(o=>runCase(o),o);r.group=group;
  assert.equal(r.normalAB,0);assert.equal(r.maskAB,0);assert.equal(r.classificationAB,0);assert.equal(r.coverageAB,0);matrix.push(r);
  if(r.metrics.precise.color.total)await page.evaluate(o=>{
   if(window.residual)return;const f=window.frames.precise;
   for(let i=1;i<24;i++){const a=f[i-1],b=f[i],d=difference(a.color,b.color);if(!d.count)continue;
    const p=d.examples[0].pixel,opts=j=>({...o,gx:j*o.path[0],gy:j*o.path[1],variant:'precise'}),ia=captureIds(opts(i-1)),ib=captureIds(opts(i));
    window.residual={condition:o,steps:[i-1,i],pixel:[p%a.size,Math.floor(p/a.size)],parts:[ia,ib].map(v=>partLabels[v.ids[p*4]]),color:[a,b].map(v=>Array.from(v.color.slice(p*4,p*4+4))),normal:[a,b].map(v=>Array.from(v.nd.slice(p*4,p*4+2)))};break;
   }
  },o);
 }
 if(process.env.DEPTH_MATRIX!=='0'){
  for(const dot of process.env.CHARACTER_CI?[4]:[2,4,7])for(const S of [16,24,32,48]){
   for(const angle of [0,Math.PI/2,Math.PI,Math.PI/4])for(const path of [[1,0],[0,1],[1,1]])for(const follow of [true,false])await run({S,dot,angle,pose:.25,path,follow},'resolution-scale-camera');
   console.log(`B matrix S=${S} dot=${dot}`);
  }
  for(const S of [16,24,32,48])for(const pose of [0,.25,.5,.75])for(const angle of Array.from({length:8},(_,i)=>i*Math.PI/4))for(const path of [[0,1],[1,1]])await run({S,dot:4,angle,pose,path,follow:true},'pose-direction');
 }
 // Fixed, reviewable 32px examples, separate from the non-duplicated matrix.
 await page.evaluate(()=>{window.partWitnesses={};});
 const witnessCases=[];
 for(const spec of [{targetPart:'sleeve-hand',angle:3*Math.PI/2,pose:0},{targetPart:'ankle',angle:3*Math.PI/4,pose:0},{targetPart:'face-bang',angle:Math.PI/2,pose:.75}]){
  const o={S:32,dot:4,path:[1,1],follow:true,...spec};
  witnessCases.push(await page.evaluate(o=>{const r=runCase(o);findPartWitnesses(o);return r;},o));
 }
 if(!matrix.length)matrix.push(...witnessCases);
 await run({S:32,dot:4,angle:5*Math.PI/4,pose:0,path:[1,1],follow:true},'residual-control');
 const witnesses=await page.evaluate(()=>partWitnesses),residual=await page.evaluate(()=>window.residual??null);
 for(const [name,w]of Object.entries(witnesses)){writeFileSync(`${output}/${name}.png`,Buffer.from(w.png.split(',')[1],'base64'));delete w.png;}
 for(const w of Object.values(witnesses)){
  w.depthProbe=await page.evaluate(w=>probeDepth(w),w);
  w.movementControls=await page.evaluate(w=>{const out=[];study.state.S=w.condition.S;study.state.dot=w.condition.dot;study.scene.rebuild();study.scene.resize();
   for(const path of [[0,1],[1,1],[0,0]])for(const variant of ['anchored','precise']){const frames=w.steps.map(step=>captureIds({...w.condition,variant,gx:step*path[0],gy:step*path[1]})),p=w.pixel[1]*frames[0].size+w.pixel[0];out.push({path,variant,parts:frames.map(f=>partLabels[f.ids[p*4]]),color:frames.map(f=>Array.from(f.color.slice(p*4,p*4+4))),final:frames.map(f=>Array.from(f.final.slice(p*4,p*4+4)))});}return out;
  },w);
  for(const c of w.movementControls)if(c.variant==='precise'||c.path[1]===0)assert.deepEqual(c.final[0],c.final[1]);
 }
 if(residual)residual.depthProbe=await page.evaluate(w=>probeDepth({...w,partA:w.parts}),residual);
 writeFileSync(`${output}/witnesses.json`,JSON.stringify(witnesses,null,2));
 // Continue with independent controls, whole-scene and lifecycle checks below.
 for(const extra of [{path:[0,0]},{outline:false},{lighting:false},{shadow:true},{tod:'evening'}]){
  const r=await page.evaluate(o=>runCase(o),{S:32,dot:4,angle:0,pose:0,path:[0,1],follow:true,...extra});ablations.push(r);
 }
 assert.equal(ablations[0].metrics.anchored.final.total,0);assert.equal(ablations[0].metrics.precise.final.total,0);
 for(const name of ['sleeve-hand','ankle','face-bang'])assert(witnesses[name],`missing concrete part witness ${name}`);
 const effects=await page.evaluate(()=>{
  const {state,scene,texel,SINP,renderer,post,rig}=study;state.S=32;state.dot=4;scene.rebuild();scene.resize();
  const overlap=[],animation=[],positions=[[0,2.5],[13,-10],[14,-10],[-7.5,-4.9],[-7.5,-9.5],[-9.5,-8],[9.8,-5],[0,0]];
  for(const x of [12,12.5,13,13.5,14])for(const z of [-13.5,-13,-12.5])positions.push([x,z]);
  for(const [x,z]of positions)for(const shadow of [true,false]){
   const o={gx:Math.round(x/texel()),gy:Math.round(z*SINP/texel()),world:true,shadow};
   const a=capture({...o,variant:'anchored'}),na=capture({...o,variant:'anchored',character:false}),b=capture({...o,variant:'precise'}),nb=capture({...o,variant:'precise',character:false});let outside=0,idChanged=0,character=0,maskChanged=0,occlusionChanged=0;
   for(let p=0;p<a.size*a.size;p++){
    occlusionChanged+=(difference(a.color.slice(p*4,p*4+4),na.color.slice(p*4,p*4+4)).count>0)!==(difference(b.color.slice(p*4,p*4+4),nb.color.slice(p*4,p*4+4)).count>0)?1:0;
    const id=a.nd[p*4+3]%16;idChanged+=id!==b.nd[p*4+3]%16?1:0;if(id===2)character++;
    maskChanged+=(a.color[p*4+3]===0)!==(b.color[p*4+3]===0)?1:0;
    const related=[0,-1,1,-a.size,a.size].some(n=>p+n>=0&&p+n<a.size*a.size&&a.nd[(p+n)*4+3]%16===2);
    if(!related&&difference(a.final.slice(p*4,p*4+4),b.final.slice(p*4,p*4+4)).count)outside++;
   }
   overlap.push({x,z,shadow,character,idChanged,maskChanged,occlusionChanged,outside,rawChanged:difference(a.color,b.color).count,finalChanged:difference(a.final,b.final).count});
  }
  for(const variant of ['anchored','precise'])for(const face of ['pixel','3d','uv']){
   const a=capture({variant,face,pose:0}),b=capture({variant,face,pose:.25}),c=capture({variant,face,pose:0,blink:2}),d=capture({variant,face,pose:0,emotion:{key:'angry',t:.5,dur:1.8}});
   animation.push({variant,face,walk:difference(a.final,b.final).count,blink:difference(a.final,c.final).count,emotion:difference(a.final,d.final).count});
  }
  // Query actual attachment precision, not just the requested texture type.
  const gl=renderer.getContext(),depth={};
  for(const variant of ['baseline','anchored','precise']){capture({variant});depth[variant]=[scene.rtWLo,scene.rtWND].map(rt=>{renderer.setRenderTarget(rt);return gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE);});}
  const highPrecision=[];
  for(const variant of ['baseline','anchored','precise']){const f=capture({variant});scene.renderWorld({f1:true,f2:false,f3:true,face:'pixel'},0,0,0,f.camY,0,0);const bits=[scene.rtWLo,scene.rtWHi].map(rt=>{renderer.setRenderTarget(rt);return gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE);});highPrecision.push({variant,bits});}
  const restoration=[];
  for(const variant of ['baseline','anchored']){const a=capture({variant,pose:0,gy:7});capture({variant:'precise',pose:0,gy:7});const b=capture({variant,pose:0,gy:7});restoration.push({variant,color:difference(a.color,b.color).count,nd:difference(a.nd,b.nd).count,final:difference(a.final,b.final).count});}
  // Repeated switches/resizes must release the previous GPU depth attachment.
  const memory=[];for(let i=0;i<6;i++){state.dot=i%2?4:7;scene.resize();for(const variant of ['precise','anchored','baseline']){capture({variant});memory.push({cycle:i,variant,textures:renderer.info.memory.textures});}}
  state.dot=4;scene.resize();
  return {overlap,animation,depth,highPrecision,restoration,memory};
 });
 writeFileSync(`${output}/effects-inspection.json`,JSON.stringify(effects,null,2));
 effects.overlap.forEach(r=>{assert.equal(r.idChanged,0);assert.equal(r.maskChanged,0);assert.equal(r.occlusionChanged,0);});
 assert(effects.overlap.some(r=>r.character>0&&r.character<180));
 effects.animation.forEach(r=>{assert(r.walk>0);if(r.face==='pixel')assert(r.blink>0);assert(r.emotion>0);});
 effects.restoration.forEach(r=>{assert.equal(r.color,0);assert.equal(r.nd,0);assert.equal(r.final,0);});
 assert.deepEqual(effects.depth,{baseline:[16,24],anchored:[16,24],precise:[24,24]});
 assert.deepEqual(effects.highPrecision.map(r=>r.bits),[[16,16],[16,16],[16,24]]);
 for(const variant of ['precise','anchored','baseline'])assert.equal(new Set(effects.memory.filter(r=>r.variant===variant).map(r=>r.textures)).size,1,'GPU resource accumulation');
 const ui=await page.evaluate(()=>{
  const {validation:v,state,worldScene,decalScene,characterStudy}=study;worldScene.visible=true;decalScene.visible=true;state.shadow=true;state.tod='day';state.S=32;state.dot=4;
  const select=key=>{const e=document.getElementById('v-preset');e.value=key;e.dispatchEvent(new Event('change'));};
  const background=[];
  for(const key of ['color-vertical','color-diagonal','color-horizontal','color-walk','color-trees']){
   select(key);characterStudy.variant='precise';v.resetValidation();document.getElementById('v-base').click();v.seekValidation(.5);const r=v.compareStatic();
   const b=v.captureStatic();characterStudy.variant='anchored';const a=v.captureStatic();background.push({key,result:r.result,AB:difference(a.image.pixels,b.image.pixels).count});
  }
  select('color-walk');characterStudy.variant='precise';v.seekValidation(0);const start=v.snapshot();v.seekValidation(1);const end=v.snapshot();
  const options=[...document.getElementById('v-character-variant').options].map(o=>o.value),switches=[];
  for(const variant of options){const e=document.getElementById('v-character-variant');e.value=variant;e.dispatchEvent(new Event('change'));switches.push({variant,actual:characterStudy.variant,time:v.snapshot().time});}
  characterStudy.variant='precise';v.resetValidation();window.reads=0;for(let i=0;i<12;i++)v.stepValidation();const normalReads=window.reads;
  v.leaveValidation();return {background,stationary:{start,end},options,switches,normalReads,returnedVariant:characterStudy.variant};
 });
 writeFileSync(`${output}/ui-inspection.json`,JSON.stringify(ui,null,2));
 ui.background.forEach(r=>{assert.equal(r.result.changed,0);});
 assert.deepEqual(ui.stationary.start.player,ui.stationary.end.player);assert.notEqual(ui.stationary.start.phase,ui.stationary.end.phase);
 assert.deepEqual(ui.options,['baseline','anchored','precise']);ui.switches.forEach(r=>{assert.equal(r.variant,r.actual);assert.equal(r.time,0);});
 assert.equal(ui.normalReads,0);assert.equal(ui.returnedVariant,'baseline');
 const aggregate=Object.fromEntries(['anchored','precise'].map(v=>[v,Object.fromEntries(['color','final','normal','coverage','browColor','browFinal'].map(k=>[k,matrix.reduce((n,r)=>n+r.metrics[v][k].total,0)]))]));
 assert(aggregate.anchored.color>0,'test must detect A residual before compositing');assert(aggregate.precise.color<aggregate.anchored.color);assert(aggregate.precise.final<aggregate.anchored.final);
 assert.deepEqual(errors,[]);
 writeFileSync(`${output}/${process.env.DEPTH_MATRIX==='0'?'effects':'results'}.json`,JSON.stringify({browser:await browser.version(),renderer:'SwiftShader',method:'24 integer positions per fixed pose/direction/light; foot-aligned S+4 ROI; raw targets, zero tolerance. ID diagnostic retains geometry/material sort IDs and sides. Counts are changed pixel-transitions, not unique pixels or device incidence. No performance measurements.',aggregate,matrix,ablations,witnesses,residual,effects,ui,errors},null,2)+'\n');
 console.log(JSON.stringify({aggregate,witnesses,depth:effects.depth,animation:effects.animation,errors},null,2));
}finally{await browser.close();await server.close();}
