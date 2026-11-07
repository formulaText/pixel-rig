import * as THREE from 'three';
import { U, v3, K_VS, K_COMMON, shared } from '../materials/shared';
import { VS, BLOB_FS } from './shaders';
import { SHADOW_SIZE, SHADOW_EXT, LIGHT_W, TOD, state } from '../core/constants';
import { renderer } from './renderer';
import { worldScene, LAMPS } from '../world/world';
import { shadowDepthMat } from '../materials/materials';
import { decalMat } from '../world/decals';
/* ---- 足元の影（乗算） ---- */
const blobScene = new THREE.Scene();
const blobMat = new THREE.ShaderMaterial({
  uniforms:U({ uCenter:{value:new THREE.Vector2()}, uRad:{value:new THREE.Vector2(5, 2)}, uCol:{value:v3(0.55, 0.58, 0.72)},
    uCardSrc:{value:0}, uCardKind:{value:0} }, K_VS, K_COMMON),
  vertexShader:VS, fragmentShader:BLOB_FS,
  transparent:true, depthWrite:false, depthTest:true,
  blending:THREE.CustomBlending, blendEquation:THREE.AddEquation,
  blendSrc:THREE.DstColorFactor, blendDst:THREE.ZeroFactor,
  blendSrcAlpha:THREE.ZeroFactor, blendDstAlpha:THREE.OneFactor
});
const blobMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4).rotateX(-Math.PI / 2), blobMat);
blobMesh.frustumCulled = false;
blobScene.add(blobMesh);

/* ---- シャドウマップ ---- */
const shadowRT = new THREE.WebGLRenderTarget(SHADOW_SIZE, SHADOW_SIZE, {
  minFilter:THREE.NearestFilter, magFilter:THREE.NearestFilter, format:THREE.RGBAFormat, depthBuffer:true, generateMipmaps:false
});
shared.tShadow.value = shadowRT.texture;
const lightCam = new THREE.OrthographicCamera(-SHADOW_EXT, SHADOW_EXT, SHADOW_EXT, -SHADOW_EXT, 40, 120);
const BIAS = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
const _lr = v3(), _lu = v3(), _ctr = v3();
function updateShadowMap(cx: number, cz: number){
  lightCam.position.copy(shared.uSunDirW.value).multiplyScalar(80);
  lightCam.lookAt(0, 0, 0);
  lightCam.updateMatrixWorld();
  const e = lightCam.matrixWorld.elements;
  _lr.set(e[0], e[1], e[2]); _lu.set(e[4], e[5], e[6]);
  _ctr.set(cx, 0, cz);
  const ts = 2 * SHADOW_EXT / SHADOW_SIZE;            // 影のテクセル単位で位置を揃えてちらつきを防ぐ
  lightCam.translateX(Math.round(_ctr.dot(_lr) / ts) * ts);
  lightCam.translateY(Math.round(_ctr.dot(_lu) / ts) * ts);
  lightCam.updateMatrixWorld();
  renderer.setRenderTarget(shadowRT);
  renderer.setClearColor(0xffffff, 1); renderer.clear();
  worldScene.overrideMaterial = shadowDepthMat;
  renderer.render(worldScene, lightCam);
  worldScene.overrideMaterial = null;
  shared.uShadowMat.value.copy(BIAS).multiply(lightCam.projectionMatrix).multiply(lightCam.matrixWorldInverse);
}

/* ---- 照明の設定 ---- */
function applyLight(mode: 'sprite' | 'world'){
  if (mode === 'sprite') {
    shared.uSunDirW.value.copy(LIGHT_W); shared.uSunCol.value.set(1, 1, 1);
    shared.uSunInt.value = 1; shared.uAmb.value = 0; shared.uPLN.value = 0; shared.uShadowOn.value = 0;
    return;
  }
  const t = TOD[state.tod];
  shared.uSunDirW.value.set(...t.dir).normalize();
  shared.uSunCol.value.set(...t.col);
  shared.uSunInt.value = t.int; shared.uAmb.value = t.amb;
  shared.uShadowOn.value = state.shadow ? 1 : 0;
  shared.uPLN.value = t.lamps > 0 ? LAMPS.length : 0;
  LAMPS.forEach(([x, y, z], i) => {
    shared.uPL.value[i].set(x, y, z, 4.5);
    shared.uPLC.value[i].set(1.0 * t.lamps, 0.72 * t.lamps, 0.38 * t.lamps);
  });
  decalMat.uniforms.uDecalMul.value.set(t.col[0] * t.decal, t.col[1] * t.decal, t.col[2] * t.decal);
}
function setCamBasis(cam: THREE.Camera){
  const e = cam.matrixWorld.elements;
  shared.uCamR.value.set(e[0], e[1], e[2]);
  shared.uCamU.value.set(e[4], e[5], e[6]);
  shared.uCamB.value.set(e[8], e[9], e[10]);
  shared.uLightDir.value.copy(shared.uSunDirW.value).transformDirection(cam.matrixWorldInverse);
}


export { shadowRT, blobScene, blobMat, blobMesh, updateShadowMap, applyLight, setCamBasis };
