import * as THREE from 'three';
import { makeRamp4 } from './palette';
import { U, shared, K_VS, K_COMMON, K_LIGHT } from './shared';
import { CARD } from '../core/constants';
import { VS, TOON_FS, WORLD_FS, GROUND_FS, ND_FS, SHADOW_DEPTH_VS, SHADOW_DEPTH_FS } from '../render/shaders';
/* ================= マテリアル ================= */
function charMat(hex: number, o: { alpha?: number; map?: THREE.Texture; side?: THREE.Side } = {}){
  const r = makeRamp4(hex);
  return new THREE.ShaderMaterial({
    uniforms:U({
      uToon:shared.uToon, uAlpha:{value:o.alpha || 1},
      uDeep:{value:r[0]}, uShadow:{value:r[1]}, uBase:{value:r[2]}, uLight:{value:r[3]},
      uMap:{value:o.map || null}, uHasMap:{value:o.map ? 1 : 0},
      uCardSrc:{value:1}, uCardKind:{value:CARD.NEAR}
    }, K_VS, K_COMMON, K_LIGHT),
    vertexShader:VS, fragmentShader:TOON_FS, side:o.side || THREE.FrontSide
  });
}
const matCache = new Map<string, THREE.ShaderMaterial>();
function wmat(row: number, pattern = 0, o: { emissive?: boolean } = {}){
  const key = row + '|' + pattern + '|' + (o.emissive ? 1 : 0);
  if (matCache.has(key)) return matCache.get(key)!;
  const m = new THREE.ShaderMaterial({
    uniforms:U({
      uToon:shared.uToon, tRamp:shared.tRamp, uRampRows:shared.uRampRows, uUnwrap:shared.uUnwrap,
      uRow:{value:row}, uPattern:{value:pattern}, uEmissive:{value:o.emissive ? 1 : 0},
      uCardSrc:{value:2}, uCardKind:{value:0}
    }, K_VS, K_COMMON, K_LIGHT),
    vertexShader:VS, fragmentShader:WORLD_FS
  });
  matCache.set(key, m);
  return m;
}
function groundMat(hTiles: number){
  return new THREE.ShaderMaterial({
    uniforms:U({
      uToon:shared.uToon, tRamp:shared.tRamp, uRampRows:shared.uRampRows,
      tMap:shared.tMap, uMapSize:shared.uMapSize, uTW:shared.uTW, uTD:shared.uTD, uTH:shared.uTH,
      uHeightTiles:{value:hTiles}, uCardSrc:{value:2}, uCardKind:{value:0}
    }, K_VS, K_COMMON, K_LIGHT),
    vertexShader:VS, fragmentShader:GROUND_FS
  });
}
function ndMat(id: number, src: number){
  return new THREE.ShaderMaterial({
    uniforms:U({ uId:{value:id}, uNear:shared.uNear, uFar:shared.uFar, uCardSrc:{value:src}, uCardKind:{value:CARD.NEAR} }, K_VS, K_COMMON),
    vertexShader:VS, fragmentShader:ND_FS, side:THREE.DoubleSide
  });
}
const ndWorld = ndMat(0, 2), ndChar = ndMat(2, 1);
const shadowDepthMat = new THREE.ShaderMaterial({ vertexShader:SHADOW_DEPTH_VS, fragmentShader:SHADOW_DEPTH_FS, side:THREE.DoubleSide });


export { charMat, wmat, groundMat, ndWorld, ndChar, shadowDepthMat };
