import {BASE,clone,type LookValues} from './model';
export const HOMURA_NAME='ほむら・ルック候補01';
// Built-in comparison data: never writes browser storage or the game default.
export function homuraLook():LookValues{
 const v=clone(BASE);Object.assign(v,{presetName:HOMURA_NAME,headTilt:12,headTiltScope:'front',headIdle:0,mouth:false,outlineMode:'underpaint',outerOpacity:.8,innerOpacity:.7,hairStyle:'eyes-visible',frontFringe:'still',browMode:'front-overlay',highlightLight:1});
 v.head.shape='cylinder';v.face.region.y=.03;v.face.blinkMode='image';
 for(const side of ['left','right']as const)v.face.brows[side].neutralVisible=true;
 return v;
}
// Smooth angular support ends before either 45-degree diagonal. No blanket tilt.
export function frontWeight(angle:number){const a=Math.abs(Math.atan2(Math.sin(angle),Math.cos(angle)));const x=Math.max(0,Math.min(1,1-a/(Math.PI/4)));return x*x*(3-2*x);}
export function previewAngle(seconds:number,direction:number,auto:boolean,smooth:boolean){
 if(!auto)return direction*Math.PI/4;
 const phase=seconds/2,k=Math.floor(phase),f=phase-k;
 const x=smooth?Math.max(0,(f-.85)/.15):0;
 return (k+x*x*(3-2*x))*Math.PI/4;
}
