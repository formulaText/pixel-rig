import {browRaster,rasterRect,gridRect} from './face-grid';
import {frontWeight} from './look-presets';
// Editable version of the adopted screen-grid face. Selection belongs to the
// preset/document, never to edit history. No geometry or depth buffer changes.
import * as THREE from 'three';
import {J} from '../character/rig';
import {curEye} from '../character/expression';
import {glyph} from '../character/face';
import {effectiveLook,research} from './model';
import {originalFace,FACE_W,FACE_H,type FaceData,type Rect} from './face-data';
import {faceCanvas,faceRevision} from './face-render';
const base=originalFace(),keys=['left','right'] as const;
const rects=Array.from({length:6},()=>new THREE.Vector4());
const originals=Array.from({length:2},()=>new THREE.Vector3());
export const stampUniforms={uResearchHighlight:{value:0},uHighlight:{value:new THREE.Vector2(1,0)},uBrowFrontOnly:{value:0},uBrowOverlay:{value:0},uResearchEyeWorld:{value:[new THREE.Vector3(),new THREE.Vector3()]},uResearchEyeNormal:{value:new THREE.Vector3()},uResearchEyeViewNormal:{value:new THREE.Vector3()},uResearchStamp:{value:0},tResearchStamp:{value:null as THREE.Texture|null},uResearchRects:{value:rects},uResearchOriginalEyes:{value:originals}};
let lastFace:FaceData|null=null,lastRevision=-1,lastMouth=false,lastExpression='',lastGlyph='',textures:THREE.CanvasTexture[]=[];
const compatibleEyes=[false,false];
export const stampResources={updates:0};
const v=new THREE.Vector3(),a=new THREE.Vector3(),b=new THREE.Vector3();
function atlas(f:FaceData,eye:number){
 const c=document.createElement('canvas');c.width=FACE_W*8;c.height=FACE_H;const g=c.getContext('2d')!;g.imageSmoothingEnabled=false;
 const layers=['eye-left','eye-right','brow-left','brow-right','mouth','extra','highlight-left','highlight-right'];
 layers.forEach((layer,i)=>{
  if(i===2||i===3){const side=keys[i-2],b=f.brows[side],raster=browRaster(b,research.preview.expression,side),bounds=raster.bounds;
   const eyeGrid=rasterRect(base.eyes[side].rect),w=Math.max(1,Math.round(bounds.w*glyph.w/eyeGrid.w*f.region.width/base.region.width)),h=Math.max(1,Math.round(bounds.h*glyph.h/eyeGrid.h*f.region.height/base.region.height));
   if(b.neutralVisible||research.preview.expression!=='neutral'){
    const tile=document.createElement('canvas');tile.width=w;tile.height=h;const tg=tile.getContext('2d')!;
    // Sample the original artwork at the final pixel centers. Do not rasterize
    // to 32×24 first and then lose the angle in a second nearest reduction.
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const q=raster.sample(bounds.x+(x+.5)*bounds.w/w,bounds.y+(y+.5)*bounds.h/h),color=q?b.image[q.y][q.x]:'';if(color){tg.fillStyle=color;tg.fillRect(x,y,1,1);}}g.drawImage(tile,i*FACE_W,0,FACE_W,FACE_H);
   }return;
  }
  const r=i>=6?f.eyes[keys[i-6]].rect:i<2?f.eyes[keys[i]].rect:i<4?{...f.brows[keys[i-2]].rect,y:f.brows[keys[i-2]].rect.y+f.brows[keys[i-2]].expressions[research.preview.expression].dy}:i===4?f.mouth.rect:{x:0,y:0,w:1,h:1};
  const src=faceCanvas(f,eye,effectiveLook().mouth,research.preview.mouthOpen,research.preview.expression,layer,effectiveLook().highlightLight===0&&effectiveLook().highlightOpacity===1);
  g.drawImage(src,Math.round(r.x*FACE_W),Math.round(r.y*FACE_H),Math.max(1,Math.round(r.w*FACE_W)),Math.max(1,Math.round(r.h*FACE_H)),i*FACE_W,0,FACE_W,FACE_H);
 });return c;
}
export function scaleResearchStamps(k:number){if(stampUniforms.uResearchStamp.value===0)return;for(const r of rects)r.multiplyScalar(k);for(const e of originals){e.x*=k;e.y*=k;}}
export function computeEditableStamps(cam:THREE.Camera,rx:number,ry:number,u:Record<string,any>){
 stampUniforms.uResearchStamp.value=0;
 if(!research.active)return;
 if(research.baseline){const status=document.getElementById('face-brow-effective'),text='基準を表示中です。調整中へ戻ると研究設定の実効寸法を表示します。';if(status&&status.textContent!==text)status.textContent=text;return;}
 if(!effectiveLook().face.legacy&&effectiveLook().browMode==='original'){const status=document.getElementById('face-brow-effective'),text='頭表面の顔：編集格子を曲面へ適用します。最終画素の寸法は向きと画素化で変わります。';if(status&&status.textContent!==text)status.textContent=text;return;}
 const f=effectiveLook().face,p=research.preview;
 const expression=JSON.stringify([p.expression,p.mouthOpen,effectiveLook().highlightOpacity,effectiveLook().highlightLight,effectiveLook().browMode]);
 const glyphKey=`${glyph.w},${glyph.h}`;
 if(lastGlyph!==glyphKey||lastFace!==f||lastRevision!==faceRevision()||lastMouth!==effectiveLook().mouth||lastExpression!==expression){textures.forEach(t=>t.dispose());textures=[0,1,2].map(eye=>{const t=new THREE.CanvasTexture(atlas(f,eye));t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;});lastGlyph=glyphKey;lastFace=f;lastRevision=faceRevision();lastMouth=effectiveLook().mouth;lastExpression=expression;stampResources.updates++;for(let i=0;i<2;i++)compatibleEyes[i]=JSON.stringify(f.eyes[keys[i]])===JSON.stringify(base.eyes[keys[i]]);}
 const eye=p.eyes==='closed'?2:p.eyes==='open'||!p.blink?0:curEye();
 stampUniforms.tResearchStamp.value=textures[eye];stampUniforms.uResearchStamp.value=f.legacy?1:2;
 const settings=effectiveLook();stampUniforms.uResearchHighlight.value=settings.highlightLight>0||settings.highlightOpacity!==1?1:0;stampUniforms.uHighlight.value.set(settings.highlightOpacity,settings.highlightLight);
 stampUniforms.uBrowFrontOnly.value=settings.browMode==='front-overlay'?1:0;
 stampUniforms.uBrowOverlay.value=settings.browMode==='front-overlay'?frontWeight(J.root.rotation.y):0;
 J.eyeA.forEach((a,i)=>a.getWorldPosition(stampUniforms.uResearchEyeWorld.value[i]));
 stampUniforms.uResearchEyeNormal.value.set(0,0,1).transformDirection(J.head.matrixWorld);stampUniforms.uResearchEyeViewNormal.value.copy(stampUniforms.uResearchEyeNormal.value).transformDirection(cam.matrixWorldInverse);
 // A position changes projected anchors only, not source pixels or sprite size.
 function shift(local:THREE.Vector3,dx:number,dy:number){a.copy(local);J.head.localToWorld(a);a.project(cam);b.copy(local).add(v.set(dx,dy,0));J.head.localToWorld(b);b.project(cam);return [(b.x-a.x)*rx/2,(b.y-a.y)*ry/2];}
 function place(i:number,r:Rect,ref:Rect,origin:THREE.Vector3,anchor:THREE.Vector3,w:number,h:number){
  if(origin.z<0){rects[i].set(0,0,0,0);return null;}
  const sx=f.region.width/base.region.width,sy=f.region.height/base.region.height;
  const cx=r.x+r.w/2,cy=r.y+r.h/2,bx=ref.x+ref.w/2,by=ref.y+ref.h/2;
  const d=shift(anchor,.88*(f.region.x+(cx-.5)*f.region.width-(bx-.5)*base.region.width),.88*(f.region.y-(cy-.5)*f.region.height+(by-.5)*base.region.height));
  const width=Math.max(1,Math.round(w*r.w/ref.w*sx)),height=Math.max(1,Math.round(h*r.h/ref.h*sy));
  const cxOut=origin.x+d[0]+w/2,cyOut=origin.y+d[1]+h/2;
  rects[i].set(Math.round(cxOut-width/2),Math.round(cyOut-height/2),width,height);
  return {x:cxOut,y:cyOut};
 }
 for(let i=0;i<2;i++){
  const side=keys[i],e=f.eyes[side],old=u[i?'uEye1':'uEye0'].value as THREE.Vector3;
  place(i,e.rect,base.eyes[side].rect,old,J.eyeA[i].position,glyph.w,glyph.h);
  // Preserve the adopted blink/narrow glyph exactly when its artwork is unchanged.
  const compatible=compatibleEyes[i]&&(f.blinkMode==='image'||eye===0);
  originals[i].set(old.x,old.y,compatible?old.z:-1);
  originals[i].x=rects[i].x;originals[i].y=rects[i].y;
  if(rects[i].z!==glyph.w||rects[i].w!==glyph.h)originals[i].z=-1;
  // Brows share the eye's editor-grid scale: at S32, 4×6 cells -> 2×3 pixels.
  // A 5×2-cell brow therefore occupies 2.5×1 before final integer rounding,
  // not the former hard-coded 2×2 box. Expression rotation expands this box.
  const eyeGrid=rasterRect(base.eyes[side].rect),browGrid=rasterRect(base.brows[side].rect);
  const bw=browGrid.w*glyph.w/eyeGrid.w,bh=browGrid.h*glyph.h/eyeGrid.h;
  const browOrigin=old.clone();browOrigin.x+=glyph.w/2-bw/2;browOrigin.y+=glyph.h+1;
  const bounds=browRaster(f.brows[side],p.expression,side).bounds,ref=gridRect(browGrid);
  const center=place(i+2,ref,ref,browOrigin,J.eyeA[i].position,bw,bh);
  if(center){
   // Local part placement and dimensions use the same grid units. Global face
   // placement still projects through the head transform, exactly like the eyes.
   const sx= glyph.w/eyeGrid.w*f.region.width/base.region.width,sy=glyph.h/eyeGrid.h*f.region.height/base.region.height;
   const dx=(bounds.x+bounds.w/2-browGrid.x-browGrid.w/2)*sx;
   const dy=(bounds.y+bounds.h/2-browGrid.y-browGrid.h/2+(settings.browMode==='front-overlay'?settings.browGap*FACE_H:0))*sy;
   const width=Math.max(1,Math.round(bounds.w*sx)),height=Math.max(1,Math.round(bounds.h*sy));
   rects[i+2].set(Math.round(center.x+dx-width/2),Math.round(center.y-dy-height/2),width,height);
  }
 }
 const mouthOrigin=new THREE.Vector3(u.uMouth.value.x,u.uMouth.value.y,u.uMouth.value.z>0?0:-1);
 place(4,f.mouth.rect,base.mouth.rect,mouthOrigin,new THREE.Vector3(0,.18,.43),2,3);
 // Extra paint uses the same anchored face grid; it is independent of blinking.
 const left=u.uEye0.value as THREE.Vector3,right=u.uEye1.value as THREE.Vector3;
 const center=left.z>=0?left:right;const ref=left.z>=0?base.eyes.left.rect:base.eyes.right.rect;
 const full={x:0,y:0,w:1,h:1};
 place(5,full,full,new THREE.Vector3(center.x+glyph.w/2-(ref.x+ref.w/2)*16,center.y+glyph.h/2-(1-ref.y-ref.h/2)*12,center.z),J.eyeA[left.z>=0?0:1].position,16,12);
 const status=document.getElementById('face-brow-effective');if(status){
  const message=`最終ドットの眉枠（透明余白を含む）：本人の左 ${rects[2].z}×${rects[2].w}画素、本人の右 ${rects[3].z}×${rects[3].w}画素。3D確認も同じドット配置を4倍表示。小さな移動・角度は画素化で同じ結果になる場合があります。`;
  if(status.textContent!==message)status.textContent=message;
 }
 u.uStamp.value=0;u.uMouth.value.set(0,0,0,0);
}
