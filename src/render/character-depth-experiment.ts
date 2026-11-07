import * as THREE from 'three';
import { ndChar } from '../materials/materials';
import { VS } from './shaders';

// Only the character's packed 12-bit outline depth is anchored to its foot.
// The hardware depth, projected geometry, world buffers and colour pass stay v5.
// POST compares packed depths only within a classification. This experiment is
// limited to the existing single character; classification 2 is not an actor ID.
// Do not use this relative depth for lighting, cross-object sorting or multiple
// actors without an explicit design and comparison of those cases.
export const anchoredCharacterND = new THREE.ShaderMaterial({
  uniforms: ndChar.uniforms,
  vertexShader: VS.replace(
    'vDist = -(viewMatrix * wp).z;',
    'vDist = -(viewMatrix * wp).z + dot(vec3(uFoot.x, 0.0, uFoot.y), uCamB);',
  ),
  fragmentShader: ndChar.fragmentShader,
  side: THREE.DoubleSide,
});

// B adds precision to the existing shared colour-pass depth attachment. It does
// not change the depth formula, draw order, geometry, palette, or number of passes.
// r128 uses DEPTH_COMPONENT16 for its default renderbuffer; UnsignedInt depth
// textures use DEPTH_COMPONENT24 on WebGL2, as the existing ND target already does.
// Reallocate only on a comparison/quality switch; resize owns target disposal.
// Returning to baseline/A restores the original renderbuffer, without retaining
// an extra colour target or reading pixels during ordinary rendering.
export function configureColorDepth(target: THREE.WebGLRenderTarget, precise: boolean) {
  if (!!target.depthTexture === precise) return;
  target.dispose(); // r128 also disposes an attached depthTexture.
  const depth = precise ? new THREE.DepthTexture(target.width, target.height, THREE.UnsignedIntType) : null;
  // r128's runtime default is null; its historical type declaration omits null.
  (target as { depthTexture: THREE.DepthTexture | null }).depthTexture = depth;
}
