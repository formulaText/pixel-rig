import * as THREE from 'three';
/* ================= レンダラー ================= */
const stage = (document.getElementById('stage') as HTMLElement);
const renderer = new THREE.WebGLRenderer({ antialias:false, alpha:false, powerPreference:'high-performance' });
renderer.setPixelRatio(1);
renderer.autoClear = false;
const canvas = renderer.domElement;
canvas.id = 'view';
stage.prepend(canvas);


export { stage, renderer, canvas };
