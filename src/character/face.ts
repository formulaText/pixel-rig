import * as THREE from 'three';
import { BROWS, GLYPHS, ATLAS_COLS, GLYPH_COLORS, ICONS, ICON_COLORS } from '../core/constants';
/* ================= 顔のグリフ・アイコン ================= */
function eyeVariants(base: string[]){
  const h = base.length, w = base[0].length;
  const cols = []; for (let x = 0; x < w; x++) if (base.some(r => r[x] !== '.')) cols.push(x);
  const blank = () => Array.from({length:h}, () => Array(w).fill('.'));
  const out = (a: string[][]) => a.map(r => r.join(''));
  const closed = blank();
  if (h === 1) cols.forEach(x => closed[0][x] = 'K');
  else { const r = h >= 3 ? Math.floor(h * 0.6) : h - 1; cols.forEach(x => closed[r][x] = 'D'); }
  let squint: string[][];
  if (h <= 2) squint = closed.map(r => r.slice());
  else {
    squint = base.map(r => [...r]);
    const cut = Math.ceil(h / 2);
    for (let y = 0; y < cut; y++) squint[y] = Array(w).fill('.');
    cols.forEach(x => squint[cut - 1][x] = 'D');
  }
  return [base, out(squint), out(closed)];
}
function browCells(w: number, h: number){
  const set = BROWS[w];
  if (!set || h < 2) return [null, null, null, null];
  const pad = (rows: string[]) => [...Array(h - 2).fill('.'.repeat(w)), ...rows];
  return [pad(set.angryL), pad(set.angryR), pad(set.sadL), pad(set.sadR)];
}
let glyph = GLYPHS[32], glyphTex: THREE.CanvasTexture | null = null;
function makeGlyphTex(S: number, postMat: THREE.ShaderMaterial){
  glyph = GLYPHS[S];
  const cells = [...eyeVariants(glyph.eye), ...eyeVariants(glyph.narrow), ...browCells(glyph.w, glyph.h)];
  const c = document.createElement('canvas');
  c.width = glyph.w * ATLAS_COLS; c.height = glyph.h;
  const g = c.getContext('2d')!;
  cells.forEach((rows, cell) => {
    if (!rows) return;
    rows.forEach((row, y) => [...row].forEach((ch, x) => {
      if (GLYPH_COLORS[ch]) { g.fillStyle = GLYPH_COLORS[ch]; g.fillRect(cell * glyph.w + x, y, 1, 1); }
    }));
  });
  if (glyphTex) glyphTex.dispose();
  glyphTex = new THREE.CanvasTexture(c);
  glyphTex.minFilter = glyphTex.magFilter = THREE.NearestFilter;
  glyphTex.generateMipmaps = false;
  postMat.uniforms.tGlyph.value = glyphTex;
  postMat.uniforms.uGlyph.value.set(glyph.w, glyph.h);
}
function makeIconTex(){
  const c = document.createElement('canvas');
  c.width = 9 * ICONS.length; c.height = 9;
  const g = c.getContext('2d')!;
  ICONS.forEach((ic, i) => ic.rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ICON_COLORS[ch]) { g.fillStyle = ICON_COLORS[ch]; g.fillRect(i * 9 + x, y, 1, 1); }
  })));
  const t = new THREE.CanvasTexture(c);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.generateMipmaps = false;
  return t;
}


export { glyph, makeGlyphTex, makeIconTex };
