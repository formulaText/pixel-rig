import * as THREE from 'three';
import {J} from '../character/rig';
import type {LookValues} from './model';
const pieces=J.head.children.slice(1,7);
const materials=pieces.map(h=>(h as THREE.Mesh).material);
const hairMaterial=(pieces[0] as THREE.Mesh).material as THREE.ShaderMaterial;
const taggedHair=hairMaterial.clone();taggedHair.uniforms={...hairMaterial.uniforms,uAlpha:{value:.9}};
const original=pieces.map(h=>({p:h.position.clone(),s:h.scale.clone(),r:h.rotation.clone()}));
export function restoreLookHair(){pieces.forEach((h,i)=>{h.position.copy(original[i].p);h.scale.copy(original[i].s);h.rotation.copy(original[i].r);(h as THREE.Mesh).material=materials[i];});}
export function applyLookHair(v:LookValues){
 restoreLookHair();
 if(v.browMode==='front-overlay')for(const h of pieces)(h as THREE.Mesh).material=taggedHair;
 // Static geometry in head-local space, identical in every direction. Depth is unchanged.
 if(v.hairStyle!=='eyes-visible')return;
 const [cap,back,...tips]=pieces;
 cap.scale.set(.96,.92,.96);cap.position.y+=.035;cap.position.z-=.025;
 back.scale.multiplyScalar(.96);back.position.z-=.025;
 for(const fringe of tips.slice(0,3)){fringe.scale.set(1,.55,.85);fringe.position.y+=.075;fringe.position.z-=.025;}
}
