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
