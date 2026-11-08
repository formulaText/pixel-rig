// V6-02専用の原本比較。加工するのはwork/のコピーと検証サーバー応答だけ。
import { chromium } from 'playwright-core';
import { createServer } from 'vite';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

mkdirSync('work/v6-02', { recursive: true });
const output = 'work/v6-02';
const original = readFileSync('prototypes/v5_pixel-rig-poc.html', 'utf8');
const snapshot = `({ state:{...state}, player:{...player}, phase, idleT, moving, snapA, smoothA, curDir, dirHold, moveAcc, simTime, frameN, expr:JSON.parse(JSON.stringify(expr)), auto:{...auto}, camera:worldCam.matrixWorld.elements.slice(), W, H })`;
const hook = `window.__rig = { snapshot:()=>${snapshot}, setPlayerWorld, resize, tick };`;
const reference = original.replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', '/node_modules/three/build/three.min.js')
  .replace('</head>', '<link rel="icon" href="data:,"></head>')
  .replace(/\}\)\(\);\s*<\/script>/, hook + '\n})();\n</script>');
writeFileSync(`${output}/reference.html`, reference);
const server = await createServer({ server: { host: '127.0.0.1', port: 5175, strictPort: true, hmr: false, watch: { ignored: ['**/work/**'] } }, plugins: [{
  name: 'v6-02-test-adapter',
  transform(code, id) {
    if (id.endsWith('/src/main.ts')) return code + `
// The original-v5 comparison explicitly uses the retained baseline renderer.
characterStudy.variant='baseline';
import * as logic from './gameplay/logic';
import { expr } from './character/expression';
import { auto } from './input/input';
import { setPlayerWorld } from './gameplay/player';
import { worldCam, W, H } from './render/scene';
window.__rig = { snapshot:()=>{ const { phase, idleT, moving, dirHold, moveAcc }=logic; return ${snapshot}; }, setPlayerWorld, resize, tick };
`;
  }
}] });
await server.listen();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true,
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errors = [], requests = new Set(), results = [];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const clock = () => {
  let now = 0, callbacks = [], seed = 1;
  performance.now = () => now;
  window.requestAnimationFrame = callback => { callbacks.push(callback); return callbacks.length; };
  window.__resetRandom = () => { seed = 20261107; };
  Math.random = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  window.__advance = (count, delta = 1000/60) => { for (let i=0;i<count;i++) { now += delta; const next = callbacks; callbacks=[]; next.forEach(cb=>cb(now)); } };
};
async function open(path, viewport, dpr) {
  const p = await browser.newPage({ viewport, deviceScaleFactor: dpr });
  p.on('pageerror', e=>errors.push(`${path}: ${e.message}`));
  p.on('console', m=>{ if(m.type()==='error')errors.push(`${path}: ${m.text()}`); });
  p.on('response', r=>{ requests.add(r.url()); if(r.status()>=400)errors.push(`${r.status()}: ${r.url()}`); });
  await p.addInitScript(clock);
  await p.goto(`http://127.0.0.1:5175/${path}`);
  await p.waitForFunction(()=>window.__rig);
  // Let ResizeObserver finish before stepping; it must not clear the captured framebuffer.
  await p.waitForTimeout(50);
  await p.evaluate(()=>window.__resetRandom());
  // V6-03 makes readback opt-in. Enable the old comparison explicitly for equivalence.
  if(path==='') await p.locator('#tgCmp').evaluate(e=>e.click());
  return p;
}
async function capture(p, count, imageName) {
  return p.evaluate(({count,imageName})=>{
    // For long state transitions, advance the unchanged 60Hz logic directly and
    // render the last two frames. No intermediate GPU readback/draw is needed
    // to compare these selected poses. Short movement sequences use real frames.
    if (count > 30) {
      for (let i=0;i<count-2;i++) window.__rig.tick(performance.now());
      window.__advance(2);
    } else window.__advance(count);
    const canvas = document.getElementById('view');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const bytes = new Uint8Array(canvas.width*canvas.height*4);
    gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,bytes);
    const base64 = btoa(Array.from(bytes, b=>String.fromCharCode(b)).join(''));
    const strips = Array.from(document.querySelectorAll('.strip canvas'), c=>c.toDataURL());
    return { pixels:base64, strips, snapshot:window.__rig.snapshot(), image:imageName?canvas.toDataURL():null };
  },{count,imageName});
}
async function pairCheck(pages, name, count=2, save=false) {
  const [a,b] = await Promise.all(pages.map(p=>capture(p,count,save)));
  assert.deepEqual(b.snapshot,a.snapshot,`${name}: state`);
  const ab=Buffer.from(a.pixels,'base64'),bb=Buffer.from(b.pixels,'base64');
  let changed=0,maxDelta=0;
  for(let i=0;i<ab.length;i++){if(ab[i]!==bb[i])changed++;maxDelta=Math.max(maxDelta,Math.abs(ab[i]-bb[i]));}
  const stripsMatch = a.strips.every((s,i)=>s===b.strips[i]);
  results.push({name,bytes:ab.length,changed,maxDelta,stripsMatch,sha256:hash(ab),simTime:a.snapshot.simTime});
  if(save || changed) for(const [i,entry]of [a,b].entries()) if(entry.image)writeFileSync(`${output}/${name}-${i?'port':'original'}.png`,Buffer.from(entry.image.split(',')[1],'base64'));
  assert.equal(changed,0,`${name}: pixel bytes`);assert(stripsMatch,`${name}: comparison strips`);
  console.log(`${name}: ${changed} differing bytes`);
  return b;
}
async function click(pages,selector){await Promise.all(pages.map(p=>p.locator(selector).evaluate(e=>e.click())));}
async function range(pages,selector,value){await Promise.all(pages.map(p=>p.locator(selector).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));},value)));}
async function bake(pages,name){
  await click(pages,'#bake');
  const data=await Promise.all(pages.map(p=>p.locator('#dl').getAttribute('href')));
  assert.equal(data[0],data[1],`${name}: PNG`);
  const dimensions=await pages[1].locator('#sheet').evaluate(e=>[e.width,e.height]);
  results.push({name,pngSha256:hash(Buffer.from(data[1].split(',')[1],'base64')),dimensions});
  writeFileSync(`${output}/${name}.png`,Buffer.from(data[1].split(',')[1],'base64'));
  await click(pages,'#closeDlg');
}
try {
  for(const [orientation,viewport,dpr]of [ ['portrait',{width:393,height:852},3],['landscape',{width:852,height:393},3],['desktop',{width:1281,height:801},1.25] ]) {
    const pages=await Promise.all([open(`${output}/reference.html`,viewport,dpr),open('',viewport,dpr)]);
    await pairCheck(pages,`${orientation}-defaults`,2,true);
    await click(pages,'#tgAuto');
    for(const [name,x,z] of [['village',0,2.5],['well',3.1,0],['wall',-7.5,-4.9],['trees',13,-10],['water',8,10]]) {
      await Promise.all(pages.map(p=>p.evaluate(([x,z])=>window.__rig.setPlayerWorld(x,z),[x,z])));
      await pairCheck(pages,`${orientation}-${name}`,2,true);
    }
    for(const tod of ['evening','night','day']) {await click(pages,`#segTod [data-t="${tod}"]`);await pairCheck(pages,`${orientation}-${tod}`);}
    for(const shadow of ['off','on']){await click(pages,'#tgShadow');await pairCheck(pages,`${orientation}-shadow-${shadow}`);}
    for(const resolution of [16,24,32,48]) {
      await click(pages,`#segS [data-s="${resolution}"]`);await pairCheck(pages,`${orientation}-res-${resolution}`);
      await bake(pages,`${orientation}-png-${resolution}`);
    }
    await click(pages,'#segS [data-s="32"]');
    for(const amount of [0,50,100]) {await range(pages,'#unwrap',amount);await pairCheck(pages,`${orientation}-unwrap-${amount}`);}
    for(const dot of [2,7,4]){await range(pages,'#dot',dot);await pairCheck(pages,`${orientation}-dot-${dot}`);}
    for(const face of ['3d','uv','pixel']){await click(pages,`#segFace [data-f="${face}"]`);await pairCheck(pages,`${orientation}-face-${face}`);await bake(pages,`${orientation}-png-${face}`);}
    // Time-dependent main-view checks run without the original readPixels strips.
    // Their ON path was checked above and is resumed below. This is still a comparison, not an fps measurement.
    await click(pages,'#tgCmp');
    for(const key of ['joy','surprise','question','sad','angry','sweat']) {
      await click(pages,`#emo [data-k="${key}"]`);
      for(const [stage,count] of [['onset',4],['motion',12],['end',150]])await pairCheck(pages,`${orientation}-${key}-${stage}`,count);
    }
    for(const step of ['f1','f2','f3','f4'])for(const enabled of ['off','on']){await click(pages,`.step[data-k="${step}"]`);await pairCheck(pages,`${orientation}-${step}-${enabled}`);}
    // Blink timing and seeded sequence across 3 simulation seconds.
    for(let i=0;i<18;i++)await pairCheck(pages,`${orientation}-blink-${i}`,10);
    await click(pages,'#tgBlink');await pairCheck(pages,`${orientation}-blink-off`,180);await click(pages,'#tgBlink');
    // Original keyboard handling; direction hysteresis, fixed ticks, discrete/continuous movement.
    for(const step of [true,false]) {
      if(!step)await click(pages,'.step[data-k="f4"]');
      await Promise.all(pages.map(p=>p.evaluate(()=>window.__rig.setPlayerWorld(0,2.5))));
      for(const keys of [['ArrowDown'],['ArrowDown','ArrowRight'],['ArrowRight'],['ArrowUp','ArrowRight'],['ArrowUp'],['ArrowUp','ArrowLeft'],['ArrowLeft'],['ArrowDown','ArrowLeft']]) {
        for(const key of keys)await Promise.all(pages.map(p=>p.keyboard.down(key)));
        await pairCheck(pages,`${orientation}-move-${step}-${keys.join('-')}`,orientation==='portrait'?12:6,true);
        for(const key of keys)await Promise.all(pages.map(p=>p.keyboard.up(key)));
        await pairCheck(pages,`${orientation}-stop-${step}-${keys.join('-')}`,2);
      }
    }
    await click(pages,'.step[data-k="f4"]');
    await pairCheck(pages,`${orientation}-compare-off`,12);await click(pages,'#tgCmp');await pairCheck(pages,`${orientation}-compare-on`);
    await click(pages,'#tgCmp');
    // Actual pointer capture and release, not a test-only input vector.
    for(const p of pages){const r=await p.locator('#stage').boundingBox();await p.mouse.move(r.x+r.width/2,r.y+r.height/2);await p.mouse.down();await p.mouse.move(r.x+r.width/2+35,r.y+r.height/2-35);}
    await pairCheck(pages,`${orientation}-drag`,30);
    await Promise.all(pages.map(p=>p.mouse.up()));await pairCheck(pages,`${orientation}-drag-stop`,3);
    await click(pages,'#tgAuto');
    // Resume after a 4s pause: original dt clamp / max-six-ticks and the 3s input hold.
    await Promise.all(pages.map(p=>p.evaluate(()=>window.__advance(1,4000))));
    await pairCheck(pages,`${orientation}-resume-after-pause`);
    for(let i=0;i<4;i++)await pairCheck(pages,`${orientation}-auto-${i}`,120);
    await click(pages,'#tgCmp');await pairCheck(pages,`${orientation}-compare-resumed`);
    // Rotate the same live app (odd dimensions and fractional DPR included).
    await Promise.all(pages.map(p=>p.setViewportSize({width:viewport.height,height:viewport.width})));
    await Promise.all(pages.map(p=>p.waitForTimeout(50)));
    await pairCheck(pages,`${orientation}-rotated`,2,true);
    await Promise.all(pages.map(p=>p.close()));
    console.log(`${orientation}: matched`);
  }
  assert.deepEqual(errors,[],'console / HTTP / JS errors');
  assert([...requests].every(url=>url.startsWith('http://127.0.0.1:5175/')),'external dependency');
  const report={browser:await browser.version(),renderer:'Chromium / SwiftShader',randomSeed:20261107,mapSeed:11,clock:'manual RAF 1000/60 ms, performance.now origin 0; transitions >30 ticks advance tick directly then render two frames; explicit 4s resume pause',measurement:'readPixels comparison; not performance measurement; no video',cases:results.length,errors,requests:[...requests].sort(),results};
  writeFileSync(`${output}/comparison.json`,JSON.stringify(report,null,2)+'\n');
  console.log(`Matched ${results.length} cases; no unexplained differences.`);
} finally {await browser.close();await server.close();}
