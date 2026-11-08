// This grid belongs to the current research, not a universal character format.
export const FACE_W=32,FACE_H=24;
export const FACE_HIGHLIGHT_COLOR='#fffaf0';
export type Bitmap=string[][]; // transparent is ''; source pixels never resampled by placement
export interface Rect{x:number;y:number;w:number;h:number}
export interface Part{rect:Rect;image:Bitmap;imageScale:number}
export type Side='left'|'right';
export interface Eye extends Part{closed:Bitmap;closeAt:number;minHeight:number;highlight:{show:boolean;x:number;y:number;w:number;h:number;opacity:number;hideClosed:boolean}}
export interface Brow extends Part{neutralVisible:boolean;expressions:Record<'neutral'|'angry'|'sad',{dy:number;angle:number}>}
export interface FaceData{
 preset:string;legacy:boolean;region:{width:number;height:number;x:number;y:number};
 linkEyes:boolean;linkBrows:boolean;mirrorArtwork:boolean;
 eyes:Record<Side,Eye>;brows:Record<Side,Brow>;
 blinkMode:'shrink'|'image';mouth:Part&{open:Bitmap};extra:Bitmap;nose:{x:number;y:number};
}
const cp=<T>(v:T):T=>JSON.parse(JSON.stringify(v));
// Exact adopted S32 glyph colors (GLYPH_COLORS), separated highlight is W.
const D='#241a38',C='#3f5aa6';
export const blank=(w:number,h:number):Bitmap=>Array.from({length:h},()=>Array(w).fill(''));
function eye(x:number):Eye{return {imageScale:1,rect:{x,y:.375,w:.125,h:.25},image:[[D,D],[D,D],[C,C]],closed:[[D,D]],closeAt:.65,minHeight:1/24,highlight:{show:true,x:.5,y:0,w:.5,h:1/3,opacity:1,hideClosed:true}};}
function brow(x:number):Brow{return {imageScale:1,rect:{x,y:.25,w:.15625,h:1/12},image:[[D,D]],neutralVisible:false,expressions:{neutral:{dy:0,angle:0},angry:{dy:.02,angle:20},sad:{dy:-.02,angle:-20}}};}
export function originalFace():FaceData{return {preset:'original',legacy:true,region:{width:.82,height:.62,x:0,y:0},linkEyes:true,linkBrows:true,mirrorArtwork:false,eyes:{left:eye(.625),right:eye(.25)},brows:{left:brow(.609375),right:brow(.234375)},blinkMode:'image',mouth:{imageScale:1,rect:{x:.4375,y:.75,w:.125,h:.125},image:[['',''],[D,D],['','']],open:[[D,D],[D,D],[D,D]]},extra:blank(FACE_W,FACE_H),nose:{x:.5,y:.65}};}
export function facePreset(name:string):FaceData{
 const f=originalFace();f.preset=name;if(name==='original')return f;f.legacy=false;
 if(name==='small'){for(const s of ['left','right']as const){f.eyes[s].rect.w=.09375;f.eyes[s].rect.h=.166667;f.eyes[s].image=[[D],[D]];f.eyes[s].highlight.show=false;}}
 if(name==='expressive'){for(const s of ['left','right']as const){f.eyes[s].rect.h=.291667;f.brows[s].image=[[D,D,D]];f.brows[s].neutralVisible=true;}f.extra[16][9]='#bd7054';f.extra[16][22]='#bd7054';}
 syncSide(f,'eyes','left');syncSide(f,'brows','left');return f;
}
export function mirrorRect(r:Rect):Rect{return {...r,x:1-r.x-r.w};}
export function syncSide(f:FaceData,kind:'eyes'|'brows',side:Side,art=false){
 if(!(kind==='eyes'?f.linkEyes:f.linkBrows))return;const other=side==='left'?'right':'left';
 const source=f[kind][side],target=f[kind][other];target.rect=mirrorRect(source.rect);target.imageScale=source.imageScale;
 if(kind==='eyes'){f.eyes[other].closeAt=f.eyes[side].closeAt;f.eyes[other].minHeight=f.eyes[side].minHeight;}else{f.brows[other].neutralVisible=f.brows[side].neutralVisible;f.brows[other].expressions=cp(f.brows[side].expressions);}
 if(art){target.image=cp(source.image);if(f.mirrorArtwork)target.image=target.image.map(r=>r.slice().reverse());if(kind==='eyes'){const a=f.eyes[side],b=f.eyes[other];b.closed=cp(a.closed);if(f.mirrorArtwork)b.closed=b.closed.map(r=>r.slice().reverse());}}
}
function obj(v:any){if(!v||typeof v!=='object'||Array.isArray(v))throw Error('顔設定の構造が不正です');}
function num(v:any,min:number,max:number,label:string){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error(`${label} は ${min}〜${max} です`);}
function flag(v:any){if(typeof v!=='boolean')throw Error('顔の切替値が不正です');}
export function validateBitmap(v:any,maxW=16,maxH=16){if(!Array.isArray(v)||v.length<1||v.length>maxH||!Array.isArray(v[0])||v[0].length<1||v[0].length>maxW)throw Error('絵柄の寸法が不正です');for(const r of v)if(!Array.isArray(r)||r.length!==v[0].length||r.some(c=>typeof c!=='string'||(c!==''&&!/^#[0-9a-f]{6}$/i.test(c))))throw Error('絵柄は矩形で透明またはRGB色を指定してください');}
function rect(r:any){obj(r);for(const k of ['x','y'])num(r[k],0,1,'配置位置');for(const k of ['w','h'])num(r[k],1/48,1,'配置範囲');if(r.x+r.w>1.001||r.y+r.h>1.001)throw Error('配置範囲は顔の格子内に収めてください');}
export function validateFace(f:any):asserts f is FaceData{
 obj(f);if(typeof f.preset!=='string'||f.preset.length>60)throw Error('顔の名前が不正です');for(const k of ['legacy','linkEyes','linkBrows','mirrorArtwork'])flag(f[k]);obj(f.region);num(f.region.width,.5,1,'顔の幅');num(f.region.height,.4,.85,'顔の高さ');num(f.region.x,-.15,.15,'顔の横位置');num(f.region.y,-.15,.15,'顔の縦位置');
 if(!['shrink','image'].includes(f.blinkMode))throw Error('閉じ目の方式が不正です');obj(f.eyes);obj(f.brows);
 for(const s of ['left','right']){const e=f.eyes[s],b=f.brows[s];obj(e);obj(b);rect(e.rect);rect(b.rect);num(e.imageScale,.5,2,'絵柄の拡大率');num(b.imageScale,.5,2,'絵柄の拡大率');validateBitmap(e.image);validateBitmap(e.closed);validateBitmap(b.image);num(e.closeAt,0,1,'閉じる基準位置');num(e.minHeight,1/24,.2,'閉じ目の最小高さ');obj(e.highlight);for(const k of ['show','hideClosed'])flag(e.highlight[k]);for(const k of ['x','y','w','h','opacity'])num(e.highlight[k],0,1,'ハイライト');flag(b.neutralVisible);obj(b.expressions);for(const k of ['neutral','angry','sad']){obj(b.expressions[k]);num(b.expressions[k].dy,-.15,.15,'眉の移動');num(b.expressions[k].angle,-35,35,'眉の角度');}}
 obj(f.mouth);rect(f.mouth.rect);num(f.mouth.imageScale,.5,2,'絵柄の拡大率');validateBitmap(f.mouth.image);validateBitmap(f.mouth.open);validateBitmap(f.extra,FACE_W,FACE_H);if(f.extra.length!==FACE_H||f.extra[0].length!==FACE_W)throw Error('追加描画領域は32×24です');obj(f.nose);num(f.nose.x,0,1,'鼻の基準');num(f.nose.y,0,1,'鼻の基準');
}
