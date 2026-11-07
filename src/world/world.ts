type SurfaceMap = { mode: 0; o: number[] } | { mode: 1 | 2; cx: number; cz: number; r: number; top: number; extra: number };
import * as THREE from 'three';
import { MC, MR, T, TW, TD, P, TH, CARD, TAU, PLAYER_R } from '../core/constants';
import { R } from '../materials/palette';
import { shared } from '../materials/shared';
import { wmat, groundMat } from '../materials/materials';
/* ================= マップ ================= */
const mapData = new Uint8Array(MC * MR * 4);
const mapGet = (c: number, r: number) => (c < 0 || r < 0 || c >= MC || r >= MR) ? T.grass : mapData[(r * MC + c) * 4];
const mapSet = (c: number, r: number, t: number) => { if (c >= 0 && r >= 0 && c < MC && r < MR) mapData[(r * MC + c) * 4] = t; };
const tileC = (x: number) => Math.floor(x / TW + MC / 2 + 0.5);
const tileR = (z: number) => Math.floor(z / TD + MR / 2 + 0.5);
function mulberry32(a: number){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(11);
const HOUSES = [
  { x:-7.5, z:-7, wall:R.brick, wp:P.brick, roof:R.roofR },
  { x:7.5, z:-7, wall:R.plank, wp:P.plankH, roof:R.roofB },
  { x:-8, z:7, wall:R.stoneW, wp:P.stone, roof:R.roofG },
];
(function buildMap(){
  for (let c = 0; c < MC; c++) mapSet(c, 12, T.dirt);
  for (let r = 0; r < MR; r++) mapSet(20, r, T.dirt);
  for (let c = 17; c <= 23; c++) for (let r = 11; r <= 13; r++) mapSet(c, r, T.cobble);
  for (let c = 0; c < MC; c++) for (let r = 0; r < MR; r++) {
    const e = ((c + 0.5 - 28.5) / 3.4) ** 2 + ((r + 0.5 - 17.5) / 2.3) ** 2;
    if (e < 1) mapSet(c, r, T.water);
    else if (e < 1.7 && mapGet(c, r) === T.grass) mapSet(c, r, T.sand);
  }
  for (let c = 0; c < MC; c++) for (let r = 0; r < MR; r++) if (mapGet(c, r) === T.grass && rnd() < 0.1) mapSet(c, r, T.meadow);
  [[8,15],[9,15],[8,16],[31,7],[32,7],[31,8],[12,19],[13,19],[24,3],[25,3]].forEach(([c, r]) => { if (mapGet(c, r) === T.grass) mapSet(c, r, T.meadow); });
  HOUSES.forEach(h => {
    const c = tileC(h.x - 0.8), rf = tileR(h.z + 1.7);
    if (h.z < 0) for (let r = rf; r <= 11; r++) mapSet(c, r, T.dirt);
    else { mapSet(c, rf, T.dirt); mapSet(c, rf + 1, T.dirt); }
  });
  const tex = new THREE.DataTexture(mapData, MC, MR, THREE.RGBAFormat);
  tex.minFilter = tex.magFilter = THREE.NearestFilter; tex.needsUpdate = true;
  shared.tMap.value = tex;
})();

/* ================= フィールド ================= */
const worldScene = new THREE.Scene();
const COL: { circles: { x: number; z: number; r: number }[]; rects: { x0: number; z0: number; x1: number; z1: number }[] } = { circles:[], rects:[] };
const addRect = (x0: number, z0: number, x1: number, z1: number) => COL.rects.push({x0, z0, x1, z1});
const addCirc = (x: number, z: number, r: number) => COL.circles.push({x, z, r});
const LAMPS: [number, number, number][] = [];
const G = {
  box:new THREE.BoxGeometry(1, 1, 1),
  cyl:new THREE.CylinderGeometry(1, 1, 1, 16),
  sph:new THREE.SphereGeometry(1, 14, 10),
  dod:new THREE.DodecahedronGeometry(1, 0),
  plane:new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
  circle:new THREE.CircleGeometry(1, 24).rotateX(-Math.PI / 2),
};
function roofGeo(w: number, h: number, d: number){
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth:d, bevelEnabled:false });
  g.translate(0, 0, -d / 2);
  g.rotateY(Math.PI / 2);
  return g;
}
const ROOF = roofGeo(3.9, 1.5, 4.4);
const WELL_ROOF = roofGeo(1.5, 0.6, 1.7);
const planar = (x: number, y: number, z: number): SurfaceMap => ({ mode:0, o:[x, y, z] });
const cylMap = (cx: number, cz: number, r: number, top: number, unwrap = -1): SurfaceMap => ({ mode:1, cx, cz, r, top, extra:unwrap });
const foliageMap = (cx: number, cy: number, cz: number, r: number, seed: number): SurfaceMap => ({ mode:2, cx, cz, r, top:cy, extra:seed });
const PLANAR0 = planar(0, 0, 0);
const staticParts = new Map<THREE.Material, THREE.BufferGeometry[]>();
const _o = new THREE.Object3D();
// geo を配置して、模様の写し方（map）・深度ルール（card）・足元の範囲（foot）を頂点に記録する
function put(geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, o: { s?: number[]; ry?: number; map?: SurfaceMap; foot?: number[]; card?: number } = {}){
  const s = o.s || [1, 1, 1];
  _o.position.set(x, y, z); _o.rotation.set(0, o.ry || 0, 0); _o.scale.set(s[0], s[1], s[2]); _o.updateMatrix();
  let g = geo.clone().applyMatrix4(_o.matrix);
  if (g.index) g = g.toNonIndexed();
  const n = g.attributes.position.count;
  const mp = o.map || PLANAR0;
  const A = mp.mode === 0 ? [0, mp.o[0], mp.o[1], mp.o[2]] : [mp.mode, mp.cx, mp.cz, mp.r];
  const B = mp.mode === 0 ? [0, -1] : [mp.top, mp.extra];
  const F = o.foot || [x, z, 0, 0];
  const card = o.card || 0;
  const a4 = new Float32Array(n * 4), b2 = new Float32Array(n * 2), c1 = new Float32Array(n), f4 = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) { a4.set(A, i * 4); b2.set(B, i * 2); c1[i] = card; f4.set(F, i * 4); }
  g.setAttribute('aMapA', new THREE.BufferAttribute(a4, 4));
  g.setAttribute('aMapB', new THREE.BufferAttribute(b2, 2));
  g.setAttribute('aCard', new THREE.BufferAttribute(c1, 1));
  g.setAttribute('aFoot', new THREE.BufferAttribute(f4, 4));
  if (!staticParts.has(m)) staticParts.set(m, []);
  staticParts.get(m)!.push(g);
}
function mergeGeos(list: THREE.BufferGeometry[]){
  const names = Object.keys(list[0].attributes).filter(nm => list.every(g => g.attributes[nm]));
  const total = list.reduce((s, g) => s + g.attributes.position.count, 0);
  const m = new THREE.BufferGeometry();
  names.forEach(nm => {
    const isz = list[0].attributes[nm].itemSize;
    const arr = new Float32Array(total * isz);
    let off = 0;
    list.forEach(g => { arr.set(g.attributes[nm].array, off); off += g.attributes[nm].array.length; });
    m.setAttribute(nm, new THREE.BufferAttribute(arr, isz));
  });
  return m;
}

function house(h: typeof HOUSES[number]){
  const { x, z } = h, WH = TH * 1.5, foot = [x, z, 1.875, 1.6];
  const far = { card:CARD.FAR, foot };
  put(G.box, wmat(h.wall, h.wp), x, WH / 2, z, { ...far, s:[3.75, WH, 3.2], map:planar(x - 1.875, WH, z + 1.6) });
  put(ROOF, wmat(h.roof, P.shingle), x, WH, z, { map:planar(x - 2.2, WH + 1.5, z) });
  put(G.box, wmat(R.wood, P.plankV), x - 0.8, 0.8, z + 1.62, { ...far, s:[0.9, 1.6, 0.12], map:planar(x - 1.25, 1.6, z + 1.68) });
  put(G.box, wmat(R.window), x + 0.9, 1.35, z + 1.62, { ...far, s:[0.75, 0.6, 0.08] });
  put(G.box, wmat(R.wood), x + 0.9, 1.0, z + 1.66, { ...far, s:[0.9, 0.1, 0.14] });
  put(G.box, wmat(R.brick, P.brick), x + 1.1, WH + 0.9, z - 0.5, { s:[0.45, 1.1, 0.45], map:planar(x + 0.875, WH + 1.45, z - 0.275) });
  addRect(x - 1.875, z - 1.6, x + 1.875, z + 1.6);   // 壁の外形
}
// プロシージャル樹木：幹（樹皮模様）＋葉の塊を1〜3個
function tree(x: number, z: number,  s=1,  y0=0,  col=true){
  const foot = [x, z, 0.2 * s, -1];
  put(G.cyl, wmat(R.trunk, P.bark), x, y0 + 0.65 * s, z, { card:CARD.NEAR, foot, s:[0.2 * s, 1.3 * s, 0.2 * s], map:cylMap(x, z, 0.2 * s, y0 + 1.3 * s) });
  const blobs = [[0, 1.85, 0, 0.95]];
  if (rnd() < 0.6) blobs.push([(rnd() < 0.5 ? -1 : 1) * 0.55, 1.55 + rnd() * 0.3, 0.15, 0.62]);
  if (rnd() < 0.5) blobs.push([(rnd() - 0.5) * 0.4, 2.55, -0.1, 0.55]);
  blobs.forEach(([bx, by, bz, br]) => {
    const R0 = br * s, cx = x + bx * s, cy = y0 + by * s, cz = z + bz * s, gr = R0 + 0.5;
    put(G.sph, wmat(R.leaf), cx, cy, cz, { card:CARD.NEAR, foot, s:[gr, gr * 0.85, gr], map:foliageMap(cx, cy, cz, R0, Math.floor(rnd() * 97)) });
  });
  if (col) addCirc(x, z, 0.25 * s);
}
function bush(x: number, z: number,  s=1){
  const R0 = 0.55 * s, gr = R0 + 0.5, cy = 0.42 * s;
  put(G.sph, wmat(R.bush), x, cy, z, { card:CARD.NEAR, foot:[x, z, R0, -1], s:[gr, gr * 0.8, gr], map:foliageMap(x, cy, z, R0, Math.floor(rnd() * 97)) });
  addCirc(x, z, 0.5 * s);
}
function rock(x: number, z: number, r: number){ put(G.dod, wmat(R.rock), x, r * 0.35, z, { card:CARD.NEAR, foot:[x, z, r, -1], ry:rnd() * TAU, s:[r, r * 0.75, r] }); addCirc(x, z, r * 0.9); }
function well(x: number, z: number){
  const o = { card:CARD.NEAR, foot:[x, z, 0.75, -1] };
  put(G.cyl, wmat(R.stoneW, P.stone), x, 0.4, z, { ...o, s:[0.75, 0.8, 0.75], map:cylMap(x, z, 0.75, 0.8) });
  put(G.circle, wmat(R.waterW), x, 0.805, z, { ...o, s:[0.55, 1, 0.55] });
  put(G.box, wmat(R.wood), x - 0.62, 1.3, z, { ...o, s:[0.12, 1.8, 0.12] });
  put(G.box, wmat(R.wood), x + 0.62, 1.3, z, { ...o, s:[0.12, 1.8, 0.12] });
  put(WELL_ROOF, wmat(R.roofR, P.shingle), x, 2.15, z, { ...o, map:planar(x - 0.85, 2.75, z) });
  addCirc(x, z, 0.85);
}
function barrel(x: number, z: number){
  const o = { card:CARD.NEAR, foot:[x, z, 0.34, -1] };
  put(G.cyl, wmat(R.barrel, P.plankV), x, 0.42, z, { ...o, s:[0.34, 0.84, 0.34], map:cylMap(x, z, 0.34, 0.84) });
  put(G.cyl, wmat(R.metal), x, 0.2, z, { ...o, s:[0.355, 0.07, 0.355] });
  put(G.cyl, wmat(R.metal), x, 0.64, z, { ...o, s:[0.355, 0.07, 0.355] });
  addCirc(x, z, 0.38);
}
function crate(x: number, z: number){
  put(G.box, wmat(R.barrel, P.plankH), x, 0.35, z, { card:CARD.NEAR, foot:[x, z, 0.35, 0.35], s:[0.7, 0.7, 0.7], map:planar(x - 0.35, 0.7, z + 0.35) });
  addRect(x - 0.35, z - 0.35, x + 0.35, z + 0.35);
}
function fence(x0: number, x1: number, z: number){
  const o = { card:CARD.NEAR, foot:[(x0 + x1) / 2, z, (x1 - x0) / 2, 0.06] };
  for (let px = x0; px <= x1 + 0.01; px += 1) put(G.box, wmat(R.wood), px, 0.35, z, { ...o, s:[0.12, 0.7, 0.12] });
  put(G.box, wmat(R.wood), (x0 + x1) / 2, 0.5, z, { ...o, s:[x1 - x0, 0.07, 0.06] });
  put(G.box, wmat(R.wood), (x0 + x1) / 2, 0.25, z, { ...o, s:[x1 - x0, 0.07, 0.06] });
  addRect(x0 - 0.1, z - 0.12, x1 + 0.1, z + 0.12);
}
function sign(x: number, z: number){
  const o = { card:CARD.NEAR, foot:[x, z, 0.1, -1] };
  put(G.box, wmat(R.wood), x, 0.5, z, { ...o, s:[0.1, 1, 0.1] });
  put(G.box, wmat(R.wood, P.plankH), x, 0.95, z + 0.02, { ...o, s:[0.8, 0.4, 0.08], map:planar(x - 0.4, 1.15, z + 0.06) });
  addCirc(x, z, 0.2);
}
function lamp(x: number, z: number){
  const o = { card:CARD.NEAR, foot:[x, z, 0.1, -1] };
  put(G.cyl, wmat(R.metal), x, 1.0, z, { ...o, s:[0.06, 2.0, 0.06] });
  put(G.box, wmat(R.lantern, 0, {emissive:true}), x, 2.12, z, { ...o, s:[0.26, 0.3, 0.26] });
  put(G.box, wmat(R.metal), x, 2.31, z, { ...o, s:[0.34, 0.06, 0.34] });
  addCirc(x, z, 0.15);
  LAMPS.push([x, 2.1, z]);
}
const groundBase = groundMat(0), groundTop = groundMat(1);
function plateau(c0: number, r0: number, c1: number, r1: number){
  const x0 = (c0 - 20.5) * TW, x1 = (c1 + 1 - 20.5) * TW, z0 = (r0 - 12.5) * TD, z1 = (r1 + 1 - 12.5) * TD;
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, w = x1 - x0, d = z1 - z0;
  put(G.box, wmat(R.cliff, P.stone), cx, TH / 2, cz, { s:[w, TH, d], map:planar(x0, TH, z1) });
  put(G.plane, groundTop, cx, TH + 0.002, cz, { s:[w, 1, d] });
  for (let x = x0 + 0.6; x < x1; x += 1.4 + rnd()) put(G.dod, wmat(R.cliff), x, 0.3, z1 + 0.15, { card:CARD.NEAR, foot:[x, z1 + 0.15, 0.5, -1], ry:rnd() * TAU, s:[0.5, 0.45, 0.4] });
  addRect(x0, z0, x1, z1 + 0.4);
  return { x0, x1, z0, z1 };
}
(function buildWorld(){
  put(G.plane, groundBase, 0, 0, 0, { card:CARD.GROUND, s:[140, 1, 140] });
  HOUSES.forEach(house);
  well(3.1, -2.2);
  sign(-1.9, 2.4);
  barrel(10.6, -5.4); barrel(11.3, -4.8); barrel(-10.4, -5.3);
  crate(-11.2, -4.3);
  fence(4.5, 14.5, 18.6);
  [[-3.8, 2.9], [3.8, 2.9], [-6.4, -4.7], [8.9, -4.7], [-6.0, 9.3]].forEach(([x, z]) => lamp(x, z));
  const pl = plateau(4, 3, 11, 6);
  tree(pl.x0 + 2.0, pl.z0 + 2.0, 1.0, TH, false);
  tree(pl.x0 + 5.5, pl.z0 + 3.2, 0.9, TH, false);
  tree(pl.x0 + 8.0, pl.z0 + 1.6, 0.8, TH, false);
  [[-13,-10],[13,-11.5],[15,3.5],[-15,10.5],[-3.5,14],[3,16.5],[-16.5,-3.5],[17,-3.5],[-11,16.5],[17.5,13]]
    .forEach(([x, z]) => tree(x, z, 0.85 + rnd() * 0.4));
  for (let i = 0; i < 280; i++) {
    const x = (rnd() - 0.5) * 70, z = (rnd() - 0.5) * 70;
    if (Math.abs(x) > 22.5 || Math.abs(z) > 21.8) tree(x, z, 0.8 + rnd() * 0.5);
  }
  [[-4.4,-6.2],[10.2,-8.6],[-5.0,9.6],[-10.6,8.6]].forEach(([x, z]) => bush(x, z, 0.9 + rnd() * 0.3));
  [[11,-11,0.6],[-11,12,0.5],[4.5,-12,0.55],[-3,-16,0.45],[17,8,0.6],[-17,4,0.5]].forEach(([x, z, r]) => rock(x, z, r));
  staticParts.forEach((list, m) => { const me = new THREE.Mesh(mergeGeos(list), m); me.frustumCulled = false; worldScene.add(me); });
})();

const WATER_PTS = [[0,0],[0.8,0],[-0.8,0],[0,0.8],[0,-0.8]];
function blocked(x: number, z: number){
  if (Math.abs(x) > 21 || Math.abs(z) > 21) return true;
  for (const [ox, oz] of WATER_PTS) if (mapGet(tileC(x + ox * PLAYER_R), tileR(z + oz * PLAYER_R)) === T.water) return true;
  for (const c of COL.circles) { const dx = x - c.x, dz = z - c.z, r = c.r + PLAYER_R; if (dx * dx + dz * dz < r * r) return true; }
  for (const r of COL.rects) if (x > r.x0 - PLAYER_R && x < r.x1 + PLAYER_R && z > r.z0 - PLAYER_R && z < r.z1 + PLAYER_R) return true;
  return false;
}


export { worldScene, LAMPS, blocked };
