import { research, effectiveLook } from '../research/model';
import type { RenderOptions, FaceMode } from '../core/types';
import * as THREE from 'three';
import { makeIconTex, glyph } from '../character/face';
import { shared, v3 } from '../materials/shared';
import { ATLAS_COLS, ICONS, texel, EMOTES } from '../core/constants';
import { POST_VS } from './shaders';
import { LOOK_POST_FS } from '../research/post-shader';
import { renderer } from './renderer';
import { J } from '../character/rig';
import { curEye, expr } from '../character/expression';
/* ================= ポストプロセス ================= */
const postMat = new THREE.ShaderMaterial({
  uniforms:{
    tColor:{value:null}, tHi:{value:null}, tND:{value:null}, tDepth:{value:null}, tGlyph:{value:null}, tIcon:{value:makeIconTex()},
    uLookOn:{value:0}, uLookInk:{value:new THREE.Color(.10,.06,.17)}, uLookInnerInk:{value:new THREE.Color(.10,.06,.17)}, uLookOpacity:{value:new THREE.Vector2(1,1)}, uMouth:{value:new THREE.Vector4()},
    uRes:{value:new THREE.Vector2(1, 1)}, uF2:{value:1}, uF3:{value:1}, uNDOn:{value:1},
    uLightDir:shared.uLightDir, uRange:{value:1}, uTexel:{value:0.1},
    uStamp:{value:0}, uGlyph:{value:new THREE.Vector2(1, 1)}, uAtlasCols:{value:ATLAS_COLS},
    uEye0:{value:v3(0, 0, -1)}, uEye1:{value:v3(0, 0, -1)}, uBrow0:{value:v3(0, 0, -1)}, uBrow1:{value:v3(0, 0, -1)},
    uIcon:{value:new THREE.Vector4(0, 0, 0, 0)}, uIconSize:{value:new THREE.Vector2(9, 9)}, uIconCols:{value:ICONS.length}
  },
  vertexShader:POST_VS, fragmentShader:LOOK_POST_FS, depthTest:false, depthWrite:false
});
const postScene = new THREE.Scene();
const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat);
postQuad.frustumCulled = false;
postScene.add(postQuad);
const postCam = new THREE.Camera();

function mkRT(w: number, h: number,  depthTex = false){
  const rt = new THREE.WebGLRenderTarget(w, h, {
    minFilter:THREE.NearestFilter, magFilter:THREE.NearestFilter,
    format:THREE.RGBAFormat, depthBuffer:true, stencilBuffer:false, generateMipmaps:false
  });
  if (depthTex) { rt.depthTexture = new THREE.DepthTexture(w, h); rt.depthTexture.type = THREE.UnsignedIntType; }
  return rt;
}

function pass(scene: THREE.Scene, cam: THREE.Camera, target: THREE.WebGLRenderTarget, clear: boolean, override?: THREE.Material){
  renderer.setRenderTarget(target);
  if (clear) { renderer.setClearColor(0x000000, 0); renderer.clear(); }
  scene.overrideMaterial = override || null;
  renderer.render(scene, cam);
  scene.overrideMaterial = null;
}
function setPost(o: RenderOptions, lo: THREE.WebGLRenderTarget, hi: THREE.WebGLRenderTarget, nd: THREE.WebGLRenderTarget, rx: number, ry: number, range: number, ndOn: boolean){
  const u = postMat.uniforms;
  u.tColor.value = lo.texture; u.tHi.value = hi.texture; u.tND.value = nd.texture; u.tDepth.value = nd.depthTexture;
  u.uRes.value.set(rx, ry);
  u.uF2.value = o.f2 ? 1 : 0; u.uF3.value = o.f3 ? 1 : 0;
  u.uNDOn.value = ndOn ? 1 : 0;
  u.uRange.value = range; u.uTexel.value = texel();
}
const _v = v3(), _c = v3(), _n = v3(), _h = v3();
function computeStamps(cam: THREE.Camera, rx: number, ry: number, face: FaceMode){
  const u = postMat.uniforms;
  J.root.updateMatrixWorld(true);
  if (face !== 'pixel') { u.uStamp.value = 0; return; }
  u.uStamp.value = 1;
  J.headC.getWorldPosition(_c);
  _h.copy(_c).project(cam);
  const hx = (_h.x * 0.5 + 0.5) * rx;
  const ei = curEye();
  const em = expr.emote ? EMOTES[expr.emote.key] : null;
  const bk = (em && glyph.w >= 2) ? em.brow : -1;
  const camB = shared.uCamB.value;
  const eyes = J.eyeA.map(a => {
    a.getWorldPosition(_v);
    const f = _n.copy(_v).sub(_c).normalize().dot(camB);
    _v.project(cam);
    return { f, px:(_v.x * 0.5 + 0.5) * rx, py:(_v.y * 0.5 + 0.5) * ry };
  });
  const both = eyes[0].f > 0.12 && eyes[1].f > 0.12;
  eyes.forEach((e, i) => {
    const eyeU = i ? u.uEye1.value : u.uEye0.value;
    const browU = i ? u.uBrow1.value : u.uBrow0.value;
    if (e.f <= 0.12) { eyeU.set(0, 0, -1); browU.set(0, 0, -1); return; }
    const narrow = e.f <= 0.5;
    let px = e.px;
    if (narrow) px += Math.sign(hx - px);
    const ex = Math.round(px - glyph.w / 2), ey = Math.round(e.py - glyph.h / 2);
    eyeU.set(ex, ey, (narrow ? 3 : 0) + ei);
    const left = both ? e.px < eyes[1 - i].px : e.px < hx;
    browU.set(ex, ey + glyph.h + 1, bk < 0 ? -1 : 6 + bk * 2 + (left ? 0 : 1));
  });
}
function computeResearchStamps(cam: THREE.Camera,rx:number,ry:number,face:FaceMode){
  computeStamps(cam,rx,ry,face);
  const u=postMat.uniforms;u.uMouth.value.set(0,0,0,0);
  if(research.active&&!effectiveLook().face.legacy){u.uStamp.value=0;return;}
  if(!research.active||!effectiveLook().mouth||face!=='pixel')return;
  J.headC.getWorldPosition(_c);_v.set(0,.18,.43);J.head.localToWorld(_v);_n.copy(_v).sub(_c).normalize();
  if(_n.dot(shared.uCamB.value)>.15){_v.project(cam);u.uMouth.value.set(Math.round((_v.x*.5+.5)*rx-1),Math.round((_v.y*.5+.5)*ry),2,1);}
}
function setIcon(cam: THREE.Camera, rx: number, ry: number){
  const u = postMat.uniforms, e = expr.emote;
  if (!e || e.t > e.dur - 0.12) { u.uIcon.value.w = 0; return; }
  const ei = EMOTES[e.key].icon, ic = ICONS[ei];
  J.headC.getWorldPosition(_v);
  _v.y += 0.62;
  _v.project(cam);
  const px = (_v.x * 0.5 + 0.5) * rx, py = (_v.y * 0.5 + 0.5) * ry;
  let off = e.t < 0.08 ? -2 : (e.t < 0.16 ? 1 : 0);
  if (ic.drift) off -= Math.floor((e.t * 4) % 3);
  u.uIcon.value.set(Math.round(px - 4 + ic.ox), Math.round(py + 2 + ic.oy + off), ei, 1);
}


export { postMat, postScene, postCam, mkRT, pass, setPost, computeStamps, computeResearchStamps, setIcon };
