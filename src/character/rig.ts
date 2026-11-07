import type { FaceMode } from '../core/types';
import * as THREE from 'three';
import { GLYPH_COLORS, TAU, LEG_LEN } from '../core/constants';
import { charMat } from '../materials/materials';
/* ================= キャラクター ================= */
const charScene = new THREE.Scene();
function makeFaceDecal(){
  const c = document.createElement('canvas'); c.width = 128; c.height = 64;
  const g = c.getContext('2d')!;
  for (const cx of [34.7, 93.3]) {
    g.fillStyle = GLYPH_COLORS.D; g.beginPath(); g.ellipse(cx, 33, 7, 10.5, 0, 0, TAU); g.fill();
    g.fillStyle = GLYPH_COLORS.C; g.beginPath(); g.ellipse(cx, 37, 5, 6, 0, 0, TAU); g.fill();
    g.fillStyle = GLYPH_COLORS.W; g.beginPath(); g.arc(cx + 2.2, 28, 2.6, 0, TAU); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.minFilter = t.magFilter = THREE.LinearFilter; t.generateMipmaps = false;
  return t;
}
const CM = {
  skin:charMat(0xf2c29b, {alpha:0.6}), hair:charMat(0xc4622d, {side:THREE.DoubleSide}), eye:charMat(0x2a1f3d),
  tunic:charMat(0x2f8f8a), belt:charMat(0x6b4226), pants:charMat(0x3b3f6b),
  boots:charMat(0x7a4a2b), scarf:charMat(0xd8433a), decal:charMat(0xffffff, {map:makeFaceDecal()})
};
function mesh(geo: THREE.BufferGeometry, m: THREE.Material, x=0, y=0, z=0){ const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); return o; }
function grp(parent: THREE.Object3D, x=0, y=0, z=0){ const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; }

// Constructed synchronously below before any pose/render call.
type Rig = Record<'root' | 'motion' | 'hips' | 'torso' | 'tail' | 'head' | 'eyes3d' | 'headC' | 'armL' | 'armR' | 'legL' | 'legR', THREE.Group> & { decal: THREE.Mesh; eyeA: THREE.Group[] };
const J = {} as Rig;
J.root = grp(charScene);
J.motion = grp(J.root);
J.hips = grp(J.motion, 0, LEG_LEN, 0);
J.torso = grp(J.hips);
J.torso.add(mesh(new THREE.CylinderGeometry(0.22, 0.29, 0.52, 12), CM.tunic, 0, 0.24, 0));
J.torso.add(mesh(new THREE.CylinderGeometry(0.295, 0.30, 0.08, 12), CM.belt, 0, 0.04, 0));
J.torso.add(mesh(new THREE.CylinderGeometry(0.29, 0.34, 0.14, 12), CM.tunic, 0, -0.04, 0));
const ring = mesh(new THREE.TorusGeometry(0.2, 0.075, 8, 16), CM.scarf, 0, 0.5, 0);
ring.rotation.x = Math.PI / 2;
J.torso.add(ring);
J.tail = grp(J.torso, 0.1, 0.5, -0.18);
J.tail.add(mesh(new THREE.BoxGeometry(0.13, 0.42, 0.05), CM.scarf, 0, -0.2, 0));
J.head = grp(J.torso, 0, 0.56, 0);
J.head.add(mesh(new THREE.SphereGeometry(0.44, 20, 14), CM.skin, 0, 0.36, 0));
const cap = mesh(new THREE.SphereGeometry(0.475, 20, 10, 0, TAU, 0, Math.PI * 0.5), CM.hair, 0, 0.36, 0);
cap.rotation.x = -0.3;
J.head.add(cap);
const backHair = mesh(new THREE.SphereGeometry(0.45, 16, 12), CM.hair, 0, 0.27, -0.1);
backHair.scale.set(1.03, 0.95, 0.85);
J.head.add(backHair);
for (const bx of [-0.2, 0, 0.2]) {
  const b = mesh(new THREE.ConeGeometry(0.1, 0.22, 4), CM.hair, bx, 0.46, 0.42);
  b.rotation.set(Math.PI, 0, bx * 0.8);
  J.head.add(b);
}
const ahoge = mesh(new THREE.ConeGeometry(0.06, 0.24, 5), CM.hair, 0.06, 0.88, 0.05);
ahoge.rotation.z = -0.5;
J.head.add(ahoge);
J.eyes3d = grp(J.head);
for (const sx of [-1, 1]) J.eyes3d.add(mesh(new THREE.BoxGeometry(0.075, 0.14, 0.05), CM.eye, sx * 0.15, 0.31, 0.405));
J.decal = mesh(new THREE.SphereGeometry(0.447, 16, 10, Math.PI / 2 - 0.75, 1.5, Math.PI / 2 - 0.42, 0.95), CM.decal, 0, 0.36, 0);
J.head.add(J.decal);
J.headC = grp(J.head, 0, 0.36, 0);
J.eyeA = [grp(J.head, 0.15, 0.33, 0.41), grp(J.head, -0.15, 0.33, 0.41)];
for (const sx of [-1, 1]) {
  const a = grp(J.torso, sx * 0.31, 0.44, 0);
  a.add(mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.34, 8), CM.tunic, 0, -0.15, 0));
  a.add(mesh(new THREE.SphereGeometry(0.09, 10, 8), CM.skin, 0, -0.36, 0));
  if (sx > 0) J.armL = a; else J.armR = a;
  const l = grp(J.hips, sx * 0.13, 0, 0);
  l.add(mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.4, 8), CM.pants, 0, -0.2, 0));
  l.add(mesh(new THREE.BoxGeometry(0.18, 0.15, 0.27), CM.boots, 0, -0.47, 0.035));
  if (sx > 0) J.legL = l; else J.legR = l;
}
function setFace(mode: FaceMode){ J.eyes3d.visible = mode === '3d'; J.decal.visible = mode === 'uv'; }
function walkPose(ph: number){
  const s = Math.sin(TAU * ph), a = Math.abs(s), swing = 0.6 * s;
  J.legL.rotation.x = -swing; J.legR.rotation.x = swing;
  J.armL.rotation.set(s * 0.75, 0, 0.1);
  J.armR.rotation.set(-s * 0.75, 0, -0.1);
  J.hips.position.y = LEG_LEN * Math.cos(swing) + 0.005;
  J.hips.rotation.y = s * 0.1;
  J.torso.position.y = 0;
  J.torso.rotation.set(0.1, -s * 0.18, 0);
  J.head.rotation.set(-0.06, s * 0.08, 0);
  J.tail.rotation.set(0.75 + (1 - a) * 0.25, 0, s * 0.15);
}
function idlePose(b: number){
  J.legL.rotation.x = 0; J.legR.rotation.x = 0;
  J.armL.rotation.set(0, 0, 0.1 + b * 0.03);
  J.armR.rotation.set(0, 0, -0.1 - b * 0.03);
  J.hips.position.y = LEG_LEN; J.hips.rotation.y = 0;
  J.torso.position.y = -(0.5 - 0.5 * b) * 0.05;
  J.torso.rotation.set(0.02, 0, 0);
  J.head.rotation.set(0.04 * b, 0, 0);
  J.tail.rotation.set(0.18 + b * 0.05, 0, 0);
}


export { charScene, J, setFace, walkPose, idlePose };
