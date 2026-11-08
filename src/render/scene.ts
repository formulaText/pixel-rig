import type { RenderOptions, SpriteOptions } from '../core/types';
import * as THREE from 'three';
import { texel, FR, SPRITE_NEAR, SPRITE_FAR, CAM_TARGET, CAM_DIR, state, CHAR_FOOT_R, WORLD_NEAR, WORLD_FAR, WORLD_DIST, SINP } from '../core/constants';
import { applyLight, setCamBasis, updateShadowMap, blobMesh, blobMat, blobScene } from './lighting';
import { J, setFace, charScene } from '../character/rig';
import { shared } from '../materials/shared';
import { pass, setPost, computeStamps, computeResearchStamps, postMat, postScene, postCam, setIcon, mkRT } from './post';
import { ndChar, ndWorld } from '../materials/materials';
import { renderer, stage, canvas } from './renderer';
import { worldScene } from '../world/world';
import { decalScene } from '../world/decals';
import { player, setPlayerWorld } from '../gameplay/player';
import { makeGlyphTex } from '../character/face';
import { stageCells, faceCells } from '../debug/strips';
import { characterStudy } from '../debug/character-study';
import { anchoredCharacterND, configureColorDepth } from './character-depth-experiment';
let rtLo: THREE.WebGLRenderTarget, rtHi: THREE.WebGLRenderTarget, rtND: THREE.WebGLRenderTarget, cmpRT: THREE.WebGLRenderTarget, rtWLo: THREE.WebGLRenderTarget, rtWHi: THREE.WebGLRenderTarget, rtWND: THREE.WebGLRenderTarget;
let prevTx = texel();
/* ---- キャラ単体 ---- */
const charCam = new THREE.OrthographicCamera(-FR, FR, FR, -FR, SPRITE_NEAR, SPRITE_FAR);
function positionCharCam(subX: number, subY: number){
  charCam.position.copy(CAM_TARGET).addScaledVector(CAM_DIR, 5);
  charCam.lookAt(CAM_TARGET);
  charCam.translateX(-subX * texel());
  charCam.translateY(subY * texel());
  charCam.updateMatrixWorld();
}
function renderSprite(o: SpriteOptions, target: THREE.WebGLRenderTarget){
  const S = state.S;
  applyLight('sprite');
  J.root.position.set(0, 0, 0);
  J.root.rotation.y = o.angle;
  setFace(o.face);
  shared.uToon.value = o.f1 ? 1 : 0;
  shared.uFoot.value.set(0, 0, CHAR_FOOT_R, -1);
  shared.uNear.value = SPRITE_NEAR; shared.uFar.value = SPRITE_FAR;
  positionCharCam(o.subX, o.subY);
  setCamBasis(charCam);
  const needND = o.f3 || o.face === 'pixel';
  pass(charScene, charCam, o.f2 ? rtLo : rtHi, true);
  if (needND) pass(charScene, charCam, rtND, true, ndChar);
  setPost(o, rtLo, rtHi, rtND, S, S, SPRITE_FAR - SPRITE_NEAR, needND);
  computeStamps(charCam, S, S, o.face);
  postMat.uniforms.uIcon.value.w = 0;
  renderer.setRenderTarget(target);
  renderer.setClearColor(0x000000, 0); renderer.clear();
  renderer.render(postScene, postCam);
  renderer.setRenderTarget(null);
}

/* ---- フィールド＋キャラ ---- */
let W = 100, H = 100;
const worldCam = new THREE.OrthographicCamera(-1, 1, 1, -1, WORLD_NEAR, WORLD_FAR);
function updateWorldFrustum(){
  const tx = texel(), Wl = Math.floor(W / 2), Hl = Math.floor(H / 2);
  worldCam.left = -Wl * tx; worldCam.right = (W - Wl) * tx;
  worldCam.bottom = -Hl * tx; worldCam.top = (H - Hl) * tx;
  worldCam.updateProjectionMatrix();
}
export interface CaptureOptions { target?: THREE.WebGLRenderTarget; character?: boolean; blob?: boolean; skipComposite?: boolean }
function renderWorld(o: RenderOptions, X: number, Z: number, camX: number, camYup: number, cpx: number, cpy: number, capture: CaptureOptions = {}){
  const tx = texel();
  applyLight('world');
  shared.uToon.value = o.f1 ? 1 : 0;
  shared.uFoot.value.set(X, Z, CHAR_FOOT_R, -1);
  shared.uPixScale.value = o.f2 ? 1 : 4;
  shared.uPixOrigin.value.set(camX - Math.floor(W / 2), camYup - Math.floor(H / 2));
  shared.uNear.value = WORLD_NEAR; shared.uFar.value = WORLD_FAR;
  worldCam.position.copy(CAM_DIR).multiplyScalar(WORLD_DIST);
  worldCam.lookAt(0, 0, 0);
  worldCam.translateX(camX * tx);
  worldCam.translateY(camYup * tx);
  worldCam.updateMatrixWorld();
  setCamBasis(worldCam);
  if (state.shadow) updateShadowMap(X, Z);
  blobMesh.position.set(X, 0.03, Z);
  blobMat.uniforms.uCenter.value.set(cpx, -cpy);
  const rxp = Math.max(2, Math.round(0.4 / tx));
  blobMat.uniforms.uRad.value.set(rxp, Math.max(1, Math.round(rxp * 0.42)));
  const needND = o.f3 || o.face === 'pixel';
  const colorRT = o.f2 ? rtWLo : rtWHi;
  configureColorDepth(rtWLo, characterStudy.variant === 'precise' && o.f2);
  configureColorDepth(rtWHi, characterStudy.variant === 'precise' && !o.f2);
  pass(worldScene, worldCam, colorRT, true);
  pass(decalScene, worldCam, colorRT, false);
  if (capture.blob !== false) pass(blobScene, worldCam, colorRT, false);
  if (capture.character !== false) pass(charScene, worldCam, colorRT, false);
  if (needND) {
    pass(worldScene, worldCam, rtWND, true, ndWorld);
    if (capture.character !== false) pass(charScene, worldCam, rtWND, false, characterStudy.variant !== 'baseline' ? anchoredCharacterND : ndChar);
  }
  setPost(o, rtWLo, rtWHi, rtWND, W, H, WORLD_FAR - WORLD_NEAR, needND);
  computeResearchStamps(worldCam, W, H, o.face);
  setIcon(worldCam, W, H);
  if (capture.character === false) { postMat.uniforms.uStamp.value = 0; postMat.uniforms.uIcon.value.w = 0; }
  if (capture.skipComposite) return;
  renderer.setRenderTarget(capture.target || null);
  renderer.setClearColor(0x000000, 1); renderer.clear();
  renderer.render(postScene, postCam);
}

function rebuild(){
  const S = state.S;
  const wx = player.gx * prevTx, wz = player.gy * prevTx / SINP;
  prevTx = texel();
  setPlayerWorld(wx, wz);
  [rtLo, rtHi, rtND, cmpRT].forEach(r => r && r.dispose());
  rtLo = mkRT(S, S); rtHi = mkRT(S * 4, S * 4); rtND = mkRT(S, S, true); cmpRT = mkRT(S, S);
  shared.uT.value = S / 2;
  shared.uTexel.value = texel();
  makeGlyphTex(S, postMat);
  updateWorldFrustum();
  const dpr = window.devicePixelRatio || 1;
  const dev = Math.max(1, Math.round(80 * dpr / S));
  [...stageCells, ...faceCells].forEach(c => {
    c.cv.width = S; c.cv.height = S;
    c.cv.style.width = c.cv.style.height = (S * dev / dpr) + 'px';
    c.ctx.clearRect(0, 0, S, S);
  });
}
function resize(){
  const r = stage.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const dev = Math.max(1, Math.round(state.dot * dpr));
  const css = dev / dpr;
  W = Math.max(16, Math.floor(r.width / css));
  H = Math.max(16, Math.floor(r.height / css));
  renderer.setSize(W, H, false);
  const cw = W * css, ch = H * css;
  const left = Math.round((r.left + (r.width - cw) / 2) * dpr) / dpr - r.left;
  const top = Math.round((r.top + (r.height - ch) / 2) * dpr) / dpr - r.top;
  canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
  canvas.style.left = left + 'px'; canvas.style.top = top + 'px';
  [rtWLo, rtWHi, rtWND].forEach(t => t && t.dispose());
  rtWLo = mkRT(W, H); rtWHi = mkRT(W * 4, H * 4); rtWND = mkRT(W, H, true);
  updateWorldFrustum();
}



export { rtWLo, rtWHi, rtWND, cmpRT, renderSprite, W, H, worldCam, renderWorld, rebuild, resize };
