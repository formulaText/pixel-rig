import * as THREE from 'three';
import { renderer } from '../render/renderer';
import { rtWLo, rtWHi, rtWND } from '../render/scene';
import { shadowRT } from '../render/lighting';
import { state } from '../core/constants';
export type BufferView = 'final' | 'color' | 'normal' | 'depth' | 'shadow';
const material = new THREE.ShaderMaterial({
  uniforms:{image:{value:null as THREE.Texture | null}, depth:{value:false}},
  vertexShader:'varying vec2 uv0; void main(){uv0=uv; gl_Position=vec4(position.xy,0.,1.);}',
  fragmentShader:'uniform sampler2D image; uniform bool depth; varying vec2 uv0; void main(){vec4 c=texture2D(image,uv0); gl_FragColor=depth?vec4(vec3(c.r),1.):vec4(c.rgb,1.);}',
  depthTest:false, depthWrite:false,
});
const scene = new THREE.Scene(); scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));
const camera = new THREE.Camera();
export function showBuffer(view: BufferView) {
  if(view==='final') return;
  const ndAvailable=state.f3 || state.face==='pixel';
  const texture = view==='color' ? (state.f2?rtWLo:rtWHi).texture : view==='shadow' ? (state.shadow?shadowRT.texture:null) : ndAvailable ? (view==='depth'?rtWND.depthTexture:rtWND.texture) : null;
  renderer.setRenderTarget(null);
  if (!texture) { renderer.setClearColor(0,1); renderer.clear(); return; }
  material.uniforms.image.value=texture; material.uniforms.depth.value=view==='depth'; renderer.render(scene,camera);
}
