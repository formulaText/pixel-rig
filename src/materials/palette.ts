import * as THREE from 'three';
import { shared } from './shared';
/* ================= 色ランプ ================= */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
function shiftHue(h: number, target: number, amt: number){
  let d = target - h;
  if (d > 0.5) d -= 1;
  if (d < -0.5) d += 1;
  return (h + d * amt + 1) % 1;
}
function rampColor(base: THREE.Color, amt: number, ds: number, dl: number, target: number){
  const hsl = {} as THREE.HSL; base.getHSL(hsl);
  const c = new THREE.Color();
  c.setHSL(shiftHue(hsl.h, target, amt), clamp01(hsl.s + ds), clamp01(hsl.l + dl));
  return c;
}
function makeRamp4(hex: number){
  const b = new THREE.Color(hex);
  return [ rampColor(b, 0.22, 0.05, -0.30, 0.72), rampColor(b, 0.12, 0.03, -0.15, 0.72), b.clone(), rampColor(b, 0.10, -0.05, 0.12, 0.14) ];
}
function makeRamp5(hex: number){
  const b = new THREE.Color(hex);
  return [ rampColor(b, 0.22, 0.05, -0.30, 0.72), rampColor(b, 0.12, 0.03, -0.15, 0.72), b.clone(),
           rampColor(b, 0.10, -0.05, 0.12, 0.14), rampColor(b, 0.16, -0.10, 0.24, 0.14) ];
}
const RAMP_HEX: number[] = [];
const addRow = (h: number) => { RAMP_HEX.push(h); return RAMP_HEX.length - 1; };
addRow(0x4a8a3c); addRow(0x4a8a3c); addRow(0x9c7646); addRow(0xc4ad78); addRow(0x8e897d); addRow(0x2f78b8);
const R = {
  brick:addRow(0xb06a52), plank:addRow(0xa57a50), stoneW:addRow(0xa29c8f),
  roofR:addRow(0xb4463a), roofB:addRow(0x4366a6), roofG:addRow(0x4d7d48),
  wood:addRow(0x7a5032), window:addRow(0xf0d07a), leaf:addRow(0x3e8a45), bush:addRow(0x5a9c48),
  rock:addRow(0x8c8c93), cliff:addRow(0x8a7864), trunk:addRow(0x6c482e), waterW:addRow(0x2f78b8),
  barrel:addRow(0x9a6a3e), metal:addRow(0x5c5a66), lantern:addRow(0xf6c75a),
};
(function buildRampTex(){
  const n = RAMP_HEX.length, data = new Uint8Array(5 * n * 4);
  RAMP_HEX.forEach((h, row) => makeRamp5(h).forEach((c, i) => {
    const k = (row * 5 + i) * 4;
    data[k] = Math.round(c.r * 255); data[k + 1] = Math.round(c.g * 255); data[k + 2] = Math.round(c.b * 255); data[k + 3] = 255;
  }));
  const t = new THREE.DataTexture(data, 5, n, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
  shared.tRamp.value = t; shared.uRampRows.value = n;
})();


export { makeRamp4, R };
