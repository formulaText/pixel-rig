import * as THREE from 'three';
import { SPRITES, DECAL_COLORS, DECALS } from '../core/constants';
import { shared, v3 } from '../materials/shared';
import { DECAL_VS, DECAL_FS } from '../render/shaders';
/* ---- 描き込み層 ---- */
const decalScene = new THREE.Scene();
const decalMat = (function buildDecals(){
  const pos: Record<string, { x: number; w: number; h: number }> = {};
  let x0 = 0, hMax = 0;
  Object.entries(SPRITES).forEach(([k, rows]) => { pos[k] = { x:x0, w:rows[0].length, h:rows.length }; x0 += rows[0].length + 1; hMax = Math.max(hMax, rows.length); });
  const c = document.createElement('canvas'); c.width = x0; c.height = hMax;
  const g = c.getContext('2d')!;
  Object.entries(SPRITES).forEach(([k, rows]) => rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (DECAL_COLORS[ch]) { g.fillStyle = DECAL_COLORS[ch]; g.fillRect(pos[k].x + x, hMax - rows.length + y, 1, 1); }
  })));
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = tex.magFilter = THREE.NearestFilter; tex.generateMipmaps = false;
  const corners = [[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]];
  const n = DECALS.length * 6;
  const P3 = new Float32Array(n * 3), anc = new Float32Array(n * 3), cor = new Float32Array(n * 2), spr = new Float32Array(n * 4), kind = new Float32Array(n);
  DECALS.forEach(([k, x, y, z, kd], i) => corners.forEach((cn, j) => {
    const v = i * 6 + j;
    anc.set([x, y, z], v * 3); cor.set(cn, v * 2); spr.set([pos[k].x, 0, pos[k].w, pos[k].h], v * 4); kind[v] = kd;
  }));
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(P3, 3));
  geo.setAttribute('aAnc', new THREE.BufferAttribute(anc, 3));
  geo.setAttribute('aCorner', new THREE.BufferAttribute(cor, 2));
  geo.setAttribute('aSpr', new THREE.BufferAttribute(spr, 4));
  geo.setAttribute('aKind', new THREE.BufferAttribute(kind, 1));
  const m = new THREE.ShaderMaterial({
    uniforms:{ uCamR:shared.uCamR, uCamU:shared.uCamU, uTexel:shared.uTexel,
      tAtlas:{value:tex}, uAtlasSize:{value:new THREE.Vector2(x0, hMax)}, uDecalMul:{value:v3(1, 1, 1)} },
    vertexShader:DECAL_VS, fragmentShader:DECAL_FS, depthWrite:false, depthTest:true
  });
  const me = new THREE.Mesh(geo, m); me.frustumCulled = false;
  decalScene.add(me);
  return m;
})();


export { decalScene, decalMat };
