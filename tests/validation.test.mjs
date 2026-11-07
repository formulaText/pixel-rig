import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transpileModule, ModuleKind } from 'typescript';
import { runInNewContext } from 'node:vm';
function load(file) {
  const exports={}; runInNewContext(transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ModuleKind.CommonJS}}).outputText,{exports}); return exports;
}
const {ReplayClock,inputAt,parseInputs}=load('src/debug/replay.ts');
const {mulberry32}=load('src/core/random.ts');
const {comparePixels}=load('src/debug/pixels.ts');
const {PerformanceRun}=load('src/debug/metrics.ts');
test('seed reset is reproducible including seed zero, streams do not share state',()=>{
  const a=mulberry32(0), b=mulberry32(0), c=mulberry32(1); const aa=[],bb=[],cc=[];
  for(let i=0;i<1000;i++){aa.push(a());bb.push(b());cc.push(c());}
  assert.deepEqual(aa,bb);assert.notDeepEqual(aa,cc); assert(aa.every(n=>n>=0&&n<1));
});
test('replay is independent of rendering cadence; pause, single step, reset and no catch-up',()=>{
  const run=(fps)=>{const clock=new ReplayClock(1/60),samples=[];clock.paused=false;for(let i=0;i<fps*2;i++)clock.advance(1/fps,n=>samples.push(inputAt([{seconds:1,x:1,y:1},{seconds:1,x:0,y:-1}],n,clock.step)));return {clock,samples};};
  const a=run(30), b=run(60), c=run(120); assert.equal(a.clock.ticks,120);assert.deepEqual(a.samples,b.samples);assert.deepEqual(b.samples,c.samples);
  const {clock}=a;clock.pause();clock.advance(60,()=>assert.fail());assert.equal(clock.ticks,120);clock.single(()=>{});assert.equal(clock.ticks,121);
  clock.reset();assert.equal(clock.seconds,0);clock.paused=false;assert.equal(clock.advance(90,()=>{}),6);assert.equal(clock.advance(0,()=>{}),0);
});
test('input durations use the supplied step, validate nonfinite/oversized input',()=>{
  assert.equal(inputAt([{seconds:1,x:1,y:0}],29,1/30).x,1);assert.equal(inputAt([{seconds:1,x:1,y:0}],30,1/30).x,0);
  for(const s of ['[]','[{"seconds":-1,"x":0,"y":0}]','[{"seconds":601,"x":0,"y":0}]','[{"seconds":1,"x":2,"y":0}]','null'])assert.throws(()=>parseInputs(s));
});
test('scroll compensation in both axes detects one changed static pixel, never masks a difference',()=>{
  const image=(x,y)=>{const pixels=new Uint8Array(8*7*4);for(let py=0;py<7;py++)for(let px=0;px<8;px++){const i=(py*8+px)*4;pixels[i]=(px+x+20)%256;pixels[i+1]=(py+y+20)%256;pixels[i+3]=255;}return {width:8,height:7,x,y,pixels};};
  for(const [x,y] of [[1,0],[0,1],[-1,1],[1,-1]]) { const a=image(0,0),b=image(x,y);assert.equal(comparePixels(a,b).changed,0);b.pixels[(3*8+3)*4]++;assert.equal(comparePixels(a,b).changed,1); }
  assert.equal(comparePixels(image(0,0),image(20,0)).compared,0);
  assert.throws(()=>comparePixels(image(0,0),image(.5,0)));
});
test('measurement excludes warmup, counts real frames/updates, keeps GPU unmeasured and interruption',()=>{
  const m=new PerformanceRun(1,2);for(let i=0;i<=90;i++)m.sample(i*1000/30,2,2);
  const r=m.result();assert.equal(r.status,'complete');assert.equal(r.renderedFrames,60);assert.equal(r.logicUpdates,120);assert.equal(r.gpuMs,null);assert.equal(r.renderedFps,30);assert.equal(r.readPixels,false);
  const interrupted=new PerformanceRun(0,60);interrupted.sample(0,1,1);interrupted.interrupt('向き変更');interrupted.sample(1000,1,1);assert.equal(interrupted.result().status,'interrupted');assert.equal(interrupted.result().renderedFrames,0);
});

test('warmup boundary overshoot never shortens the requested measurement window',()=>{
  const m=new PerformanceRun(1,2);m.sample(0,1,1);m.sample(1100,1,1);m.sample(3000,1,1);
  assert.equal(m.result().status,'measuring');assert.equal(m.result().measuredSeconds,1.9);
  m.sample(3100,1,1);assert.equal(m.result().status,'complete');assert.equal(m.result().measuredSeconds,2);
});
