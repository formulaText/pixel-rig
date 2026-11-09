import {FACE_W,FACE_H,type Rect,type Brow,type Bitmap,type Side} from './face-data';
export type Expression='neutral'|'angry'|'sad';
// Derived raster values only. Never write these integers back into a document.
export function rasterRect(r:Rect):Rect{return {x:Math.round(r.x*FACE_W),y:Math.round(r.y*FACE_H),w:Math.max(1,Math.round(r.w*FACE_W)),h:Math.max(1,Math.round(r.h*FACE_H))};}
export function gridRect(r:Rect):Rect{return {x:r.x/FACE_W,y:r.y/FACE_H,w:r.w/FACE_W,h:r.h/FACE_H};}
export function browRaster(b:Brow,expression:Expression,side:Side){
 const ex=b.expressions[expression],rect=rasterRect({...b.rect,y:b.rect.y+ex.dy});
 const angle=ex.angle*(side==='left'?1:-1)*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle),cx=rect.x+rect.w/2,cy=rect.y+rect.h/2;
 const hx=(Math.abs(c)*rect.w+Math.abs(s)*rect.h)/2,hy=(Math.abs(s)*rect.w+Math.abs(c)*rect.h)/2;
 // Keep the rotated rectangle, including pixels outside the unrotated box.
 const x=Math.floor(cx-hx+1e-10),y=Math.floor(cy-hy+1e-10);
 const bounds={x,y,w:Math.ceil(cx+hx-1e-10)-x,h:Math.ceil(cy+hy-1e-10)-y};
 return {rect,bounds,angle:ex.angle*(side==='left'?1:-1),sample(px:number,py:number){
  const dx=px-cx,dy=py-cy,rx=dx*c+dy*s,ry=-dx*s+dy*c;
  if(Math.abs(rx)>=rect.w/2||Math.abs(ry)>=rect.h/2)return null;
  const ix=Math.floor((rx/rect.w/b.imageScale+.5)*b.image[0].length),iy=Math.floor((ry/rect.h/b.imageScale+.5)*b.image.length);
  return ix>=0&&iy>=0&&ix<b.image[0].length&&iy<b.image.length?{x:ix,y:iy}:null;
 }};
}
export function browPixels(b:Brow,expression:Expression,side:Side):{bounds:Rect;pixels:Bitmap}{
 const raster=browRaster(b,expression,side),r=raster.bounds;
 const pixels=Array.from({length:r.h},(_,dy)=>Array.from({length:r.w},(_,dx)=>{const q=raster.sample(r.x+dx+.5,r.y+dy+.5);return q?b.image[q.y][q.x]:'';}));
 return {bounds:r,pixels};
}
