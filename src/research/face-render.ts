import * as THREE from 'three';
import {J} from '../character/rig';
import {curEye} from '../character/expression';
import {effectiveLook,research,type Preview} from './model';
import {FACE_W,FACE_H,type FaceData,type Bitmap,type Rect} from './face-data';
const head=J.head.children[0] as THREE.Mesh;
const originalGeometry=head.geometry,originalMaterial=head.material as THREE.ShaderMaterial;
const hair=J.head.children.slice(1,7);
let revision=0,seen=-1,lastFace:FaceData|null=null,lastMouth=false,lastExpression='',textures:THREE.CanvasTexture[]=[];
export const faceResources={updates:0};
export function dirtyFace(){revision++;}
const shapes:Record<string,THREE.BufferGeometry>={original:originalGeometry};
const mat=new THREE.ShaderMaterial({uniforms:{...originalMaterial.uniforms,tResearchFace:{value:null},uFaceRegion:{value:new THREE.Vector4()},uFaceOffset:{value:new THREE.Vector2()}},vertexShader:originalMaterial.vertexShader.replace('void main(){','varying vec3 vFaceLocal;\nvoid main(){\n vFaceLocal=position;'),fragmentShader:originalMaterial.fragmentShader.replace('void main(){','varying vec3 vFaceLocal;\nuniform sampler2D tResearchFace;uniform vec4 uFaceRegion;uniform vec2 uFaceOffset;\nvoid main(){').replace('gl_FragColor = vec4(c * tint, uAlpha);',`vec2 faceUV=vec2((vFaceLocal.x-uFaceOffset.x)/uFaceRegion.x+0.5,(vFaceLocal.y-uFaceOffset.y)/uFaceRegion.y+0.5);
 if(vFaceLocal.z>0.03 && faceUV.x>=0.0 && faceUV.x<=1.0 && faceUV.y>=0.0 && faceUV.y<=1.0){vec4 ink=texture2D(tResearchFace,faceUV);c=mix(c,ink.rgb,ink.a);}
 gl_FragColor=vec4(c*tint,uAlpha);`)});
function geometry(shape:string){
 if(shapes[shape])return shapes[shape];
 if(shape==='round')return shapes[shape]=new THREE.SphereGeometry(.44,24,18).scale(1.03,.94,1.03);
 const pts=[];for(let i=0;i<=24;i++){const y=-.44+i*.88/24;const r=Math.min(.38,Math.sqrt(Math.max(0,.44*.44-y*y)));pts.push(new THREE.Vector2(i===0||i===24?0:r,y));}
 return shapes[shape]=new THREE.LatheGeometry(pts,24);
}
function drawBitmap(g:CanvasRenderingContext2D,b:Bitmap,r:Rect,angle=0,opacity=1,scale=1){
 if(r.w<=0||r.h<=0||opacity<=0)return;
 const x=Math.round(r.x*FACE_W),y=Math.round(r.y*FACE_H),w=Math.max(1,Math.round(r.w*FACE_W)),h=Math.max(1,Math.round(r.h*FACE_H));
 // Inverse nearest sampling into a local integer grid. The source image is never mutated.
 const c=Math.cos(angle*Math.PI/180),s=Math.sin(angle*Math.PI/180);
 for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++){
  const nx=((dx+.5)/w-.5)/scale,ny=((dy+.5)/h-.5)/scale,ix=Math.floor((nx*c+ny*s+.5)*b[0].length),iy=Math.floor((-nx*s+ny*c+.5)*b.length);
  const color=b[iy]?.[ix];if(color){g.globalAlpha=opacity;g.fillStyle=color;g.fillRect(x+dx,y+dy,1,1);}
 }g.globalAlpha=1;
}
export function faceCanvas(f:FaceData,eyeState:number,mouth:boolean,open:boolean,expression:Preview['expression']){
 const canvas=document.createElement('canvas');canvas.width=FACE_W;canvas.height=FACE_H;const g=canvas.getContext('2d')!;
 drawBitmap(g,f.extra,{x:0,y:0,w:1,h:1});
 for(const side of ['left','right']as const){
  const e=f.eyes[side],r={...e.rect},closed=eyeState===2,half=eyeState===1;
  if(closed||half){const minimum=Math.min(e.minHeight,e.rect.h),h=closed?minimum:(e.rect.h+minimum)/2;r.y=e.rect.y+e.rect.h*e.closeAt-h*e.closeAt;r.h=h;}
  drawBitmap(g,closed&&f.blinkMode==='image'?e.closed:e.image,r,0,1,e.imageScale);
  const hi=e.highlight;if(hi.show&&!(hi.hideClosed&&(closed||half)))drawBitmap(g,[['#ffffff']],{x:r.x+hi.x*r.w,y:r.y+hi.y*r.h,w:hi.w*r.w,h:hi.h*r.h},0,hi.opacity);
  const b=f.brows[side],ex=b.expressions[expression];if(b.neutralVisible||expression!=='neutral')drawBitmap(g,b.image,{...b.rect,y:b.rect.y+ex.dy},side==='left'?ex.angle:-ex.angle,1,b.imageScale);
 }
 if(mouth)drawBitmap(g,open?f.mouth.open:f.mouth.image,f.mouth.rect,0,1,f.mouth.imageScale);
 return canvas;
}
export function applyResearchFace(){
 const v=effectiveLook(),p=research.preview,f=v.face;
 head.geometry=geometry(v.head.shape);J.head.scale.setScalar(v.head.size);for(const h of hair)h.visible=p.hair;
 if(f.legacy){head.material=originalMaterial;return;}
 if(lastFace!==f||seen!==revision||lastMouth!==v.mouth||lastExpression!==p.expression+String(p.mouthOpen)){
  textures.forEach(t=>t.dispose());textures=[0,1,2].map(eye=>{const t=new THREE.CanvasTexture(faceCanvas(f,eye,v.mouth,p.mouthOpen,p.expression));t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;});
  faceResources.updates++;lastFace=f;seen=revision;lastMouth=v.mouth;lastExpression=p.expression+String(p.mouthOpen);
 }
 const eye=p.eyes==='closed'?2:p.eyes==='open'||!p.blink?0:curEye();
 mat.uniforms.tResearchFace.value=textures[Math.min(2,eye)];mat.uniforms.uFaceRegion.value.set(.88*f.region.width,.88*f.region.height,0,0);mat.uniforms.uFaceOffset.value.set(.88*f.region.x,.88*f.region.y);
 head.material=mat;
}
export function restoreResearchFace(){head.geometry=originalGeometry;head.material=originalMaterial;J.head.scale.setScalar(1);for(const h of hair)h.visible=true;}
