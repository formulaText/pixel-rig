import {TOON_FS} from '../render/shaders';
import {shared,K_LIGHT} from '../materials/shared';
// Same ambient, sun, shadow map, point positions/radii/colors as the face material.
// Point attenuation stays continuous here: a subpixel glint must not inherit Bayer steps.
export const highlightLightGLSL=TOON_FS.slice(TOON_FS.indexOf('#include <packing>'),TOON_FS.indexOf('uniform float uToon;'))
 .replace('float lighting(', 'float researchLighting(')
 .replace('floor(a * lam * 4.0 + bayer2(pix)) / 4.0','a * lam');
export const highlightFactorGLSL=`
float highlightFactor(vec3 pos,vec3 nw,vec3 nv,float strength){
 vec3 tint;float light=researchLighting(nv,nw,pos,vec2(0.0),tint);
 return mix(1.0,clamp(light,0.0,1.0),strength);
}`;
export const highlightLightUniforms=Object.fromEntries(K_LIGHT.map(k=>[k,shared[k]]));
