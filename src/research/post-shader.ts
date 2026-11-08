import {highlightLightGLSL,highlightFactorGLSL} from './highlight-light';
// Isolated research extension. Original shader is retained in render/shaders.ts.
export const LOOK_POST_FS = `
uniform sampler2D tColor; uniform sampler2D tHi; uniform sampler2D tND; uniform sampler2D tDepth; uniform sampler2D tGlyph; uniform sampler2D tIcon;
uniform vec2 uRes; uniform float uF2; uniform float uF3; uniform float uNDOn;
${highlightLightGLSL}
${highlightFactorGLSL}
uniform float uRange; uniform float uTexel;
uniform float uStamp; uniform vec2 uGlyph; uniform float uAtlasCols;
uniform vec3 uEye0; uniform vec3 uEye1; uniform vec3 uBrow0; uniform vec3 uBrow1;
uniform float uLookMode; uniform float uLookOn; uniform vec3 uLookInk; uniform vec3 uLookInnerInk; uniform vec2 uLookOpacity; uniform vec4 uMouth;
uniform vec4 uIcon; uniform vec2 uIconSize; uniform float uIconCols;
uniform float uResearchHighlight;uniform vec2 uHighlight;uniform float uBrowFrontOnly;uniform float uBrowOverlay;uniform vec3 uResearchEyeWorld[2];uniform vec3 uResearchEyeNormal;uniform vec3 uResearchEyeViewNormal;uniform float uResearchStamp; uniform sampler2D tResearchStamp; uniform vec4 uResearchRects[6]; uniform vec3 uResearchOriginalEyes[2];
varying vec2 vUv;
const vec3 INK = vec3(0.10, 0.06, 0.17);
vec4 srcAt(vec2 uv){
  if (uF2 > 0.5) { vec4 c = texture2D(tColor, uv); c.a = step(0.5, c.a); return c; }
  vec2 hp = 1.0 / (uRes * 4.0);
  vec3 rgb = vec3(0.0); float cov = 0.0;
  for (int j = 0; j < 4; j++) {
    for (int i = 0; i < 4; i++) {
      vec4 s = texture2D(tHi, uv + (vec2(float(i), float(j)) - 1.5) * hp);
      if (s.a > 0.5) { rgb += s.rgb; cov += 1.0; }
    }
  }
  if (cov > 0.0) rgb /= cov;
  return vec4(rgb, cov / 16.0);
}
vec4 decodeND(vec2 uv){
  vec4 q = texture2D(tND, uv);
  float A = floor(q.a * 255.0 + 0.5);
  float id = mod(A, 16.0);
  float lo = floor(A / 16.0);
  float hi = floor(q.b * 255.0 + 0.5);
  return vec4(q.r * 2.0 - 1.0, q.g * 2.0 - 1.0, (hi * 16.0 + lo) / 4095.0, id);
}
vec3 fullN(vec4 e){ return vec3(e.x, e.y, sqrt(max(0.0, 1.0 - e.x * e.x - e.y * e.y))); }
// 異なる物体どうしは「描画上の前後（深度バッファ）」、同じ物体内は「本来の深度」で比較する
void nb(vec2 uv, float g, vec4 me, float meS, inout float found, inout float bId, inout vec2 bUv, inout float ne){
  vec4 q = decodeND(uv);
  if (q.w < 0.5) return;
  bool sameObj = abs(q.w - me.w) < 0.5;
  // Two packed-depth codes cover a one-code rounding change at each endpoint.
  // Research-only: do not assign foreground paint at an ambiguous internal edge.
  float paintGuard=(uLookOn>.5 && uLookMode>.5 && abs(me.w-2.0)<.5)?2.0*uRange/4095.0:0.0;
  bool closer = sameObj ? (q.z - me.z) * uRange > g+paintGuard : texture2D(tDepth, uv).r < meS - 0.00001;
  if (closer) {
    bool choose = found < 0.5 || abs(q.w - 2.0) < 0.5;
    if(uLookOn>.5 && uLookMode>.5 && found>.5){
      vec4 prior=decodeND(bUv);
      choose=abs(prior.w-q.w)<.5 ? q.z>prior.z : texture2D(tDepth,uv).r<texture2D(tDepth,bUv).r;
    }
    if (choose) { bId = q.w; bUv = uv; }
    found = 1.0;
  } else if (sameObj && me.w > 0.5) {
    vec3 n1 = fullN(me), n2 = fullN(q);
    if (dot(n1, n2) < 0.6 && dot(n1, uLightDir) > dot(n2, uLightDir) + 0.15) ne = 1.0;
  }
}
vec4 glyphAt(vec2 p, vec3 e){
  if (e.z < -0.5) return vec4(0.0);
  vec2 d = p - e.xy;
  if (d.x < 0.0 || d.y < 0.0 || d.x >= uGlyph.x || d.y >= uGlyph.y) return vec4(0.0);
  return texture2D(tGlyph, vec2((e.z * uGlyph.x + d.x + 0.5) / (uGlyph.x * uAtlasCols), (d.y + 0.5) / uGlyph.y));
}
vec4 researchInk(vec2 p,vec4 r,float tile){
 if(r.z<=0.0||r.w<=0.0)return vec4(0.0);
 vec2 d=p-r.xy;
 if(d.x<0.0||d.y<0.0||d.x>=r.z||d.y>=r.w)return vec4(0.0);
 return texture2D(tResearchStamp,vec2((tile+(d.x+0.5)/r.z)/8.0,(d.y+0.5)/r.w));
}
void main(){
  vec2 t = 1.0 / uRes;
  vec4 c = srcAt(vUv);
  vec2 paintUv=vUv;
  bool ownPaint=uLookOn>.5 && uLookMode>.5;
  bool cov = c.a > 0.5;
  vec4 me = vec4(0.0);
  if (uNDOn > 0.5) me = decodeND(vUv);
  bool meChar = uNDOn > 0.5 ? (abs(me.w - 2.0) < 0.5) : cov;
  if (uF3 > 0.5) {
    float meS = me.w > 0.5 ? texture2D(tDepth, vUv).r : 1.0;
    vec3 mn = fullN(me);
    float nz = max(mn.z, 0.25);
    float gx = 0.06, gy = 0.06;
    if (me.w > 0.5) { gx += uTexel * abs(mn.x) / nz * 1.15; gy += uTexel * abs(mn.y) / nz * 1.15; }
    float found = 0.0, bId = 0.0, ne = 0.0; vec2 bUv = vUv;
    nb(vUv + vec2(t.x, 0.0), gx, me, meS, found, bId, bUv, ne);
    nb(vUv - vec2(t.x, 0.0), gx, me, meS, found, bId, bUv, ne);
    nb(vUv + vec2(0.0, t.y), gy, me, meS, found, bId, bUv, ne);
    nb(vUv - vec2(0.0, t.y), gy, me, meS, found, bId, bUv, ne);
    if (found > 0.5) {
      if (abs(bId - 2.0) < 0.5 && !meChar) {
        vec3 nc = srcAt(bUv).rgb;
        vec4 line = vec4(mix(uLookOn>.5?uLookInk:INK, nc * 0.3, 0.35), 1.0);
        if(ownPaint){
          // Keep the old line footprint, but give it foreground paint at every opacity.
          // Inset is a diagnostic alternative: it does not extend the silhouette.
          if(uLookMode<1.5){c=vec4(mix(nc,line.rgb,uLookOpacity.x),1.0);paintUv=bUv;}
        }else c = uLookOn>.5 ? mix(c,line,uLookOpacity.x) : line;
      } else if (meChar) {
        vec3 line = mix(c.rgb * 0.5, uLookOn>.5?uLookInnerInk:INK, 0.3);
        if(ownPaint && abs(bId-2.0)<.5){
          vec3 fill=srcAt(bUv).rgb;
          line=mix(fill*.5,uLookInnerInk,.3);
          c=vec4(mix(fill,line,uLookOpacity.y),1.0);paintUv=bUv;
        }else c.rgb = uLookOn>.5 ? mix(c.rgb,line,uLookOpacity.y) : line;
      } else if (me.w > 0.5) {
        c.rgb = mix(c.rgb * 0.62, INK, 0.12);
      }
    } else if (ne > 0.5 && cov) {
      c.rgb = min(c.rgb * 1.15 + 0.04, vec3(1.0));
    }
  }
  if(ownPaint && uLookMode>1.5 && meChar && uF3>.5){
    bool edge=abs(decodeND(vUv+vec2(t.x,0.0)).w-2.0)>.5 || abs(decodeND(vUv-vec2(t.x,0.0)).w-2.0)>.5 || abs(decodeND(vUv+vec2(0.0,t.y)).w-2.0)>.5 || abs(decodeND(vUv-vec2(0.0,t.y)).w-2.0)>.5;
    if(edge)c.rgb=mix(c.rgb,mix(uLookInk,c.rgb*.3,.35),uLookOpacity.x);
  }
  vec2 p = floor(vUv * uRes);
  if (uStamp > 0.5 && meChar) {
    float rawA = texture2D(tColor, paintUv).a;
    bool skin = uF2 > 0.5 ? (rawA > 0.5 && rawA < 0.8) : true;
    vec4 g = vec4(0.0);
    if (skin) { g = glyphAt(p, uEye0); if (g.a < 0.5) g = glyphAt(p, uEye1); }
    if (g.a < 0.5) g = glyphAt(p, uBrow0);
    if (g.a < 0.5) g = glyphAt(p, uBrow1);
    if (g.a > 0.5) c = vec4(g.rgb, 1.0);
    vec2 md=p-uMouth.xy;
    if(uLookOn>.5 && skin && md.x>=0.0 && md.y>=0.0 && md.x<uMouth.z && md.y<uMouth.w) c=vec4(INK,1.0);
  }
  if(uResearchStamp>.5 && meChar){
    float rawA=texture2D(tColor,paintUv).a;
    // Shared color pass already resolved hair/background depth. Never paint over it.
    if(uResearchStamp<1.5 && rawA>.5 && rawA<.8){
      vec4 ink=researchInk(p,uResearchRects[5],5.0);ink.rgb*=ink.a;
      for(int i=0;i<4;i++){
        vec4 part=researchInk(p,uResearchRects[i],float(i));
        if(i>=2 && uBrowFrontOnly>.5)part=vec4(0.0);
        if(i<2){
          if(i==0 && uResearchOriginalEyes[0].z>=0.0)part=glyphAt(p,uResearchOriginalEyes[0]);
          if(i==1 && uResearchOriginalEyes[1].z>=0.0)part=glyphAt(p,uResearchOriginalEyes[1]);
          // Keep the adopted narrow/half/closed glyph, changing only its white highlight.
          if(uResearchHighlight>.5 && uResearchOriginalEyes[i].z>=0.0 && part.a>.5 && part.r>.95 && part.g>.94 && part.b>.9){
            float factor=highlightFactor(uResearchEyeWorld[i],uResearchEyeNormal,uResearchEyeViewNormal,uHighlight.y);
            part.rgb=mix(vec3(36.0,26.0,56.0)/255.0,part.rgb,uHighlight.x*factor);
          }
        }
        ink=vec4(part.rgb*part.a,part.a)+ink*(1.0-part.a);
      }
      vec4 mouth=researchInk(p,uResearchRects[4],4.0);ink=vec4(mouth.rgb*mouth.a,mouth.a)+ink*(1.0-mouth.a);
      c.rgb=c.rgb*(1.0-ink.a)+ink.rgb;
      if(uResearchHighlight>.5){for(int i=0;i<2;i++){
        vec4 hi=researchInk(p,uResearchRects[i],float(i+6));
        if(uResearchOriginalEyes[i].z<0.0 && hi.a>0.0){float factor=highlightFactor(uResearchEyeWorld[i],uResearchEyeNormal,uResearchEyeViewNormal,uHighlight.y);
        c.rgb=mix(c.rgb,hi.rgb,hi.a*uHighlight.x*factor);}
      }}
    }
  }
  // Brow-only exception: the visible ND owner must still be this character.
  // World foreground already won depth before this pass. Eyes never use this path.
  if(uResearchStamp>.5 && meChar && uBrowOverlay>0.0){
    float owner=texture2D(tColor,vUv).a;
    if((owner>.63 && owner<.68)||(owner>.88 && owner<.92)){
      for(int i=2;i<4;i++){vec4 brow=researchInk(p,uResearchRects[i],float(i));c.rgb=mix(c.rgb,brow.rgb,brow.a*uBrowOverlay);}
    }
  }
  if (uIcon.w > 0.5) {
    vec2 d = p - uIcon.xy;
    if (d.x >= 0.0 && d.y >= 0.0 && d.x < uIconSize.x && d.y < uIconSize.y) {
      vec4 ic = texture2D(tIcon, vec2((uIcon.z * uIconSize.x + d.x + 0.5) / (uIconSize.x * uIconCols), (d.y + 0.5) / uIconSize.y));
      if (ic.a > 0.5) c = vec4(ic.rgb, 1.0);
    }
  }
  gl_FragColor = c;
}`;
