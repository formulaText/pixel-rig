/* ================= シェーダー部品 ================= */
const C_COMMON = `
uniform vec3 uCamR; uniform vec3 uCamU; uniform vec3 uCamB;
uniform vec2 uPixOrigin; uniform float uPixScale; uniform float uTexel; uniform float uT; uniform float uTime;
`;
const C_HASH = `
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 x){
  vec2 i = floor(x), f = fract(x); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float bandOf(float l){ return l > 0.8 ? 1.0 : (l > 0.5 ? 0.0 : (l > 0.3 ? -1.0 : -2.0)); }
`;
// 照明：太陽（シャドウマップ）＋点光源（ディザ付きの段階的な減衰）
const C_LIGHT = `
#include <packing>
uniform vec3 uLightDir; uniform vec3 uSunDirW; uniform vec3 uSunCol; uniform float uSunInt; uniform float uAmb;
uniform vec4 uPL[8]; uniform vec3 uPLC[8]; uniform float uPLN;
uniform sampler2D tShadow; uniform mat4 uShadowMat; uniform float uShadowOn;
float bayer2(vec2 p){ float x = mod(p.x, 2.0), y = mod(p.y, 2.0); return (x < 0.5 ? (y < 0.5 ? 0.0 : 3.0) : (y < 0.5 ? 2.0 : 1.0)) / 4.0 + 0.125; }
float shadowAt(vec3 wpos, vec3 nW){
  if (uShadowOn < 0.5 || dot(nW, uSunDirW) <= 0.05) return 1.0;
  vec4 sc = uShadowMat * vec4(wpos, 1.0);
  vec3 s = sc.xyz / sc.w;
  if (s.x <= 0.0 || s.x >= 1.0 || s.y <= 0.0 || s.y >= 1.0 || s.z >= 1.0) return 1.0;
  float d = unpackRGBAToDepth(texture2D(tShadow, s.xy));
  return s.z - 0.0015 > d ? 0.0 : 1.0;
}
float lighting(vec3 nV, vec3 nW, vec3 wpos, vec2 pix, out vec3 tint){
  float hl = dot(nV, uLightDir) * 0.5 + 0.5;
  if (shadowAt(wpos, nW) < 0.5) hl = min(hl, 0.42);
  float l = uAmb + hl * uSunInt * (1.0 - uAmb);
  vec3 add = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (float(i) >= uPLN) break;
    vec3 d = uPL[i].xyz - wpos; float dist = length(d);
    float a = clamp(1.0 - dist / uPL[i].w, 0.0, 1.0); a *= a;
    float lam = max(0.0, dot(nW, d / max(dist, 0.001))) * 0.6 + 0.4;
    float q = floor(a * lam * 4.0 + bayer2(pix)) / 4.0;
    vec3 c = uPLC[i];
    l += q * 0.75 * max(c.r, max(c.g, c.b));
    add += c * q;
  }
  tint = min(uSunCol + add * 0.85, vec3(1.35));
  return l;
}
`;
// プロシージャルな葉の塊：ピクセル空間のボロノイで塊を作り、塊ごとに疑似法線で陰影をつける
const C_FOLIAGE = `
float foliage(vec2 p, vec3 C, float Rw, float seed, out float offs, out vec3 nrm){
  vec2 cs = floor(vec2(dot(C, uCamR), dot(C, uCamU)) / uTexel + 0.5);
  vec2 lp = p + 0.5 - cs;
  float Rp = Rw / uTexel;
  float cell = max(3.0, floor(uT * 0.38 + 0.5));
  vec2 gc = floor(lp / cell);
  float best = 1e9, second = 1e9; vec2 bc = vec2(0.0);
  float tq = floor(uTime * 3.0);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = gc + vec2(float(i), float(j));
      vec2 c = (g + 0.2 + vec2(hash(g + seed), hash(g + seed + 17.0)) * 0.6) * cell;
      if (hash(g + seed + tq * 0.37) > 0.9) c.x += 1.0;
      float d = length(lp - c);
      if (d < best) { second = best; best = d; bc = c; } else if (d < second) second = d;
    }
  }
  vec2 nxy = bc / vec2(Rp, Rp * 0.92);
  offs = 0.0; nrm = vec3(0.0, 0.0, 1.0);
  if (dot(nxy, nxy) > 1.0 || best > cell * 0.85) return 0.0;
  nrm = vec3(nxy, sqrt(max(0.0, 1.0 - dot(nxy, nxy))));
  vec2 dd = lp - bc;
  if (second - best < 1.0) offs = -1.0;
  else if (-dd.x + dd.y > cell * 0.45) offs = 1.0;
  else if (dd.x - dd.y > cell * 0.4) offs = -1.0;
  return 1.0;
}
`;
// 頂点シェーダー：深度ルール（手前の板・奥の板・地面）をカメラの向きから計算
const VS = `
attribute vec4 aMapA; attribute vec2 aMapB; attribute float aCard; attribute vec4 aFoot;
uniform vec3 uCamB; uniform float uCardSrc; uniform float uCardKind; uniform vec4 uFoot; uniform float uKNear; uniform float uKFar;
varying vec3 vN; varying vec3 vWN; varying vec3 vWorld; varying vec2 vUv; varying float vDist;
varying vec4 vMapA; varying vec2 vMapB; varying float vKind;
void main(){
  vN = normalize(normalMatrix * normal);
  vWN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz; vUv = uv; vMapA = aMapA; vMapB = aMapB;
  vDist = -(viewMatrix * wp).z;
  float kind = uCardSrc > 1.5 ? aCard : (uCardSrc > 0.5 ? uCardKind : 0.0);
  vec4 foot = uCardSrc > 1.5 ? aFoot : uFoot;
  vKind = kind;
  vec3 pos = wp.xyz;
  if (kind > 0.5 && kind < 2.5) {
    vec3 nh = normalize(vec3(uCamB.x, 0.0, uCamB.z));         // カメラ側を向く水平方向
    float ext = foot.w < 0.0 ? foot.z : abs(nh.x) * foot.z + abs(nh.z) * foot.w;
    float d0 = dot(foot.xy, nh.xz) + (kind < 1.5 ? ext : -ext); // 足元の最も近い点 or 最も遠い点
    float t = (d0 - dot(wp.xyz, nh)) / dot(uCamB, nh);
    pos = mix(wp.xyz + uCamB * t, wp.xyz, kind < 1.5 ? uKNear : uKFar);
  }
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
  if (kind > 2.5) gl_Position.z = 0.9995 * gl_Position.w;     // 地面は常に最奥
}`;

const TOON_FS = C_COMMON + C_LIGHT + `
uniform float uToon; uniform float uAlpha;
uniform vec3 uDeep; uniform vec3 uShadow; uniform vec3 uBase; uniform vec3 uLight;
uniform sampler2D uMap; uniform float uHasMap;
varying vec3 vN; varying vec3 vWN; varying vec3 vWorld; varying vec2 vUv;
void main(){
  vec4 tex = vec4(1.0);
  if (uHasMap > 0.5) { tex = texture2D(uMap, vUv); if (tex.a < 0.5) discard; }
  vec2 pix = uPixOrigin + floor(gl_FragCoord.xy / uPixScale);
  vec3 tint;
  float l = lighting(normalize(vN), normalize(vWN), vWorld, pix, tint);
  vec3 c;
  if (uToon > 0.5) c = l > 0.80 ? uLight : (l > 0.50 ? uBase : (l > 0.30 ? uShadow : uDeep));
  else c = uBase * (0.42 + 0.78 * l);
  if (uHasMap > 0.5) c = tex.rgb * (l > 0.30 ? 1.0 : 0.82);
  gl_FragColor = vec4(c * tint, uAlpha);
}`;

const WORLD_FS = C_COMMON + C_HASH + C_LIGHT + C_FOLIAGE + `
uniform float uToon; uniform sampler2D tRamp; uniform float uRampRows; uniform float uRow; uniform float uPattern;
uniform float uEmissive; uniform float uUnwrap;
varying vec3 vN; varying vec3 vWN; varying vec3 vWorld; varying vec4 vMapA; varying vec2 vMapB;
vec3 ramp(float idx){ return texture2D(tRamp, vec2((idx + 0.5) / 5.0, (uRow + 0.5) / uRampRows)).rgb; }
vec2 mapAt(vec2 pc){
  bool cyl = vMapA.x > 0.5 && normalize(vWN).y < 0.6;
  if (!cyl) {
    vec3 o3 = vMapA.x > 0.5 ? vec3(vMapA.y, vMapB.x, vMapA.z) : vMapA.yzw;
    vec2 o = floor(vec2(dot(o3, uCamR), dot(o3, uCamU)) / uTexel + 0.5);
    return vec2(pc.x - o.x, o.y - pc.y);
  }
  float cx = vMapA.y, cz = vMapA.z, r = vMapA.w, yTop = vMapB.x;
  float k = vMapB.y < 0.0 ? uUnwrap : vMapB.y;
  vec3 Rh = normalize(vec3(uCamR.x, 0.0, uCamR.z));
  vec3 Bh = normalize(vec3(uCamB.x, 0.0, uCamB.z));
  vec3 C = vec3(cx, 0.0, cz);
  float rel = clamp((pc.x * uTexel - dot(C, Rh)) / r, -1.0, 1.0);
  float th = asin(rel);
  vec3 Ph = C + Rh * (rel * r) + Bh * (r * cos(th));
  float y = (pc.y * uTexel - dot(Ph, uCamU)) / uCamU.y;
  float lx = mix(rel * r, th * r, k) / uTexel;
  float lyP = dot(vec3(cx, yTop, cz), uCamU) / uTexel - pc.y;
  float lyS = (yTop - y) * uCamU.y / uTexel;
  return vec2(lx, mix(lyP, lyS, k));
}
vec2 cellId(vec2 L){
  if (uPattern > 5.5) {
    float col = floor((L.x + floor(hash(vec2(floor(L.y / 7.0), 1.0)) * 2.0)) / 3.0);
    return vec2(col, floor((L.y + floor(hash(vec2(col, 4.0)) * 11.0)) / 11.0));
  }
  if (uPattern < 1.5) { float row = floor(L.y / 4.0); return vec2(floor((L.x + mod(row, 2.0) * 4.0) / 8.0), row); }
  if (uPattern < 2.5) { float row = floor(L.y / 4.0); return vec2(floor((L.x + floor(hash(vec2(row, 3.0)) * 24.0)) / 18.0), row); }
  if (uPattern < 3.5) { float col = floor(L.x / 3.0); return vec2(col, floor((L.y + floor(hash(vec2(col, 5.0)) * 20.0)) / 14.0)); }
  if (uPattern < 4.5) { float row = floor(L.y / 3.0); return vec2(floor((L.x + mod(row, 2.0) * 3.0) / 6.0), row); }
  float row = floor(L.y / 5.0);
  float w = 7.0 + floor(hash(vec2(row, 9.0)) * 5.0);
  return vec2(floor((L.x + floor(hash(vec2(row, 2.0)) * 12.0)) / w), row);
}
bool diff(vec2 a, vec2 b){ return a.x != b.x || a.y != b.y; }
float pat(vec2 p){
  if (uPattern < 0.5) return 0.0;
  vec2 pc = p + 0.5;
  vec2 id  = cellId(mapAt(pc));
  vec2 idR = cellId(mapAt(pc + vec2(1.0, 0.0)));
  vec2 idD = cellId(mapAt(pc + vec2(0.0, -1.0)));
  vec2 idL = cellId(mapAt(pc + vec2(-1.0, 0.0)));
  vec2 idU = cellId(mapAt(pc + vec2(0.0, 1.0)));
  if ((uPattern > 2.5 && uPattern < 3.5) || uPattern > 5.5) {
    if (idR.x != id.x || idD.y != id.y) return -1.0;
    return idL.x != id.x ? 1.0 : 0.0;
  }
  if (diff(id, idR) || diff(id, idD)) return uPattern > 4.5 ? -2.0 : -1.0;
  float o = hash(id) < 0.25 ? -1.0 : 0.0;
  if (diff(id, idU) || diff(id, idL)) o += 1.0;
  return o;
}
void main(){
  vec2 p = uPixOrigin + floor(gl_FragCoord.xy / uPixScale);
  vec3 nV = normalize(vN), nW = normalize(vWN);
  float offs = 0.0;
  if (vMapA.x > 1.5) {
    vec3 fn;
    if (foliage(p, vec3(vMapA.y, vMapB.x, vMapA.z), vMapA.w, vMapB.y, offs, fn) < 0.5) discard;
    nV = fn; nW = normalize(fn.x * uCamR + fn.y * uCamU + fn.z * uCamB);
  } else offs = pat(p);
  if (uEmissive > 0.5) { gl_FragColor = vec4(ramp(4.0), 1.0); return; }
  vec3 tint;
  float l = lighting(nV, nW, vWorld, p, tint);
  float idx = clamp((uToon > 0.5 ? 2.0 + bandOf(l) : 2.0) + offs, 0.0, 4.0);
  vec3 c = ramp(idx);
  if (uToon < 0.5) c *= 0.55 + 0.6 * l;
  gl_FragColor = vec4(c * tint, 1.0);
}`;

const GROUND_FS = C_COMMON + C_HASH + C_LIGHT + `
uniform float uToon; uniform sampler2D tRamp; uniform float uRampRows;
uniform sampler2D tMap; uniform vec2 uMapSize; uniform float uTW; uniform float uTD; uniform float uTH; uniform float uHeightTiles;
varying vec3 vN;
vec2 worldXZ(vec2 gp){
  vec2 rh = normalize(uCamR.xz); vec2 fd = -normalize(uCamU.xz); float sp = length(uCamU.xz);
  return rh * (gp.x * uTexel) + fd * (gp.y * uTexel / sp);
}
float typeRaw(vec2 gp){
  vec2 xz = worldXZ(gp);
  vec2 t = floor(vec2(xz.x / uTW + uMapSize.x * 0.5 + 0.5, xz.y / uTD + uMapSize.y * 0.5 + 0.5));
  if (t.x < 0.0 || t.y < 0.0 || t.x >= uMapSize.x || t.y >= uMapSize.y) return 0.0;
  return floor(texture2D(tMap, (t + 0.5) / uMapSize).r * 255.0 + 0.5);
}
float typeAt(vec2 g){
  vec2 n = vec2(vnoise(g / 5.0), vnoise(g / 5.0 + vec2(31.7, 11.3))) - 0.5;
  return typeRaw(g + 0.5 + floor(n * uT * 0.5 + 0.5));
}
float grassP(vec2 g){
  float o = 0.0;
  float big = vnoise(g / vec2(18.0, 14.0));
  if (big > 0.64 || (big > 0.58 && mod(g.x + g.y, 2.0) < 0.5)) o = -1.0;
  vec2 cs = vec2(6.0, 5.0); vec2 cell = floor(g / cs);
  float h = hash(cell);
  vec2 org = cell * cs + floor(vec2(hash(cell + 3.1), hash(cell + 7.7)) * vec2(3.0, 2.0));
  vec2 l = g - org;
  if (h < 0.6) {
    if (l == vec2(1.0, 0.0) || l == vec2(0.0, 1.0) || l == vec2(2.0, 1.0)) o = 1.0;
    else if (l == vec2(1.0, 2.0)) o = -1.0;
  } else if (h < 0.75 && l == vec2(0.0, 0.0)) o = -1.0;
  return o;
}
vec4 flowerP(vec2 g){
  vec2 cs = vec2(7.0, 6.0); vec2 cell = floor(g / cs);
  float h = hash(cell + 11.0);
  if (h > 0.5) return vec4(0.0);
  vec2 org = cell * cs + floor(vec2(hash(cell + 2.3), hash(cell + 5.9)) * vec2(5.0, 4.0)) + 1.0;
  vec2 l = g - org;
  vec3 pc = h < 0.17 ? vec3(0.97, 0.95, 0.90) : (h < 0.34 ? vec3(0.98, 0.83, 0.30) : vec3(0.95, 0.55, 0.72));
  if (l == vec2(0.0)) return uT >= 16.0 ? vec4(0.98, 0.85, 0.35, 1.0) : vec4(pc, 1.0);
  if (uT >= 16.0 && (l == vec2(1.0, 0.0) || l == vec2(-1.0, 0.0) || l == vec2(0.0, 1.0) || l == vec2(0.0, -1.0))) return vec4(pc, 1.0);
  return vec4(0.0);
}
float dirtP(vec2 g){
  float o = 0.0;
  if (vnoise(g / 16.0) > 0.66) o = -1.0;
  float h = hash(g);
  if (h < 0.05) o -= 1.0; else if (h < 0.08) o += 1.0;
  vec2 cs = vec2(9.0, 7.0); vec2 cell = floor(g / cs);
  if (hash(cell + 5.0) < 0.35) {
    vec2 org = cell * cs + floor(vec2(hash(cell + 1.7), hash(cell + 9.3)) * vec2(6.0, 4.0));
    vec2 l = g - org;
    if (l.y == 0.0 && l.x >= 0.0 && l.x <= 1.0) o = 1.0;
    else if (l.y == 1.0 && l.x >= 0.0 && l.x <= 1.0) o = -1.0;
  }
  return o;
}
float sandP(vec2 g){
  float o = 0.0;
  if (hash(g + 3.0) < 0.05) o = -1.0;
  float w = g.y + floor(vnoise(vec2(g.x / 10.0, 3.7)) * 4.0);
  if (mod(w, 7.0) < 0.5 && hash(vec2(floor(g.x / 4.0), floor(w / 7.0))) < 0.6) o = 1.0;
  return o;
}
float cobbleP(vec2 g){
  float row = floor(g.y / 6.0), ly = g.y - row * 6.0;
  float sx = g.x + mod(row, 2.0) * 4.0; float col = floor(sx / 8.0), lx = sx - col * 8.0;
  if (ly > 4.5 || lx > 6.5) return -2.0;
  float o = hash(vec2(col, row)) < 0.3 ? -1.0 : 0.0;
  if (ly < 0.5 || lx < 0.5) o += 1.0;
  return o;
}
float waterP(vec2 g, float tq){
  float o = 0.0;
  if (vnoise(g / 14.0) > 0.6) o = -1.0;
  float wy = floor(g.y / 4.0);
  float sh = floor(tq * 0.5) + floor(hash(vec2(wy, 1.0)) * 30.0);
  if (mod(g.y, 4.0) < 0.5 && mod(g.x + sh + wy * 7.0, 14.0) < 3.0) o = 1.0;
  if (hash(g + vec2(tq * 13.0, tq * 7.0)) < 0.004) o = 2.0;
  return o;
}
void main(){
  vec2 p = uPixOrigin + floor(gl_FragCoord.xy / uPixScale);
  float hPx = uHeightTiles * uT;
  vec2 g = vec2(p.x, -(p.y - hPx) - 1.0);
  float ty = typeAt(g);
  float up = typeAt(g + vec2(0.0, -1.0));
  float dn = typeAt(g + vec2(0.0, 1.0));
  float lf = typeAt(g + vec2(-1.0, 0.0));
  float rt = typeAt(g + vec2(1.0, 0.0));
  float tq = floor(uTime * 6.0);
  float offs = 0.0; vec4 ov = vec4(0.0);
  if (ty < 0.5) offs = grassP(g);
  else if (ty < 1.5) { offs = grassP(g); ov = flowerP(g); }
  else if (ty < 2.5) offs = dirtP(g);
  else if (ty < 3.5) offs = sandP(g);
  else if (ty < 4.5) offs = cobbleP(g);
  else offs = waterP(g, tq);
  bool grassy = ty < 1.5, upGrassy = up < 1.5;
  if (!grassy && ty < 4.5 && upGrassy) offs -= 1.0;
  if (grassy && !upGrassy && up < 4.5) offs += 1.0;
  if (ty > 4.5) {
    if (up < 4.5) offs -= 1.0;
    bool shore = up < 4.5 || dn < 4.5 || lf < 4.5 || rt < 4.5;
    if (shore && hash(g + vec2(tq * 7.0, tq * 3.0)) > 0.5) ov = vec4(0.85, 0.94, 1.0, 1.0);
  }
  vec2 xz = worldXZ(g + 0.5);
  vec3 wpos = vec3(xz.x, uHeightTiles * uTH, xz.y);
  vec3 tint;
  float l = lighting(normalize(vN), vec3(0.0, 1.0, 0.0), wpos, p, tint);
  float idx = clamp((uToon > 0.5 ? 2.0 + bandOf(l) : 3.0) + offs, 0.0, 4.0);
  vec3 c = texture2D(tRamp, vec2((idx + 0.5) / 5.0, (ty + 0.5) / uRampRows)).rgb;
  if (uToon < 0.5) c *= 0.6 + 0.45 * l;
  if (ov.a > 0.5) c = ov.rgb;
  gl_FragColor = vec4(c * tint, 1.0);
}`;

// 法線XY＋本来の深度12bit＋ID4bit（1:建物・地形 2:キャラ 3:小物）
const ND_FS = C_COMMON + C_HASH + C_FOLIAGE + `
uniform float uId; uniform float uNear; uniform float uFar; uniform float uCardSrc;
varying vec3 vN; varying float vDist; varying vec4 vMapA; varying vec2 vMapB; varying float vKind;
void main(){
  vec3 n = normalize(vN);
  if (uCardSrc > 1.5 && vMapA.x > 1.5) {
    vec2 p = uPixOrigin + floor(gl_FragCoord.xy / uPixScale);
    float fo; vec3 fn;
    if (foliage(p, vec3(vMapA.y, vMapB.x, vMapA.z), vMapA.w, vMapB.y, fo, fn) < 0.5) discard;
    n = fn;
  }
  float id = uId > 0.5 ? uId : (abs(vKind - 1.0) < 0.5 ? 3.0 : 1.0);
  float d = 1.0 - clamp((vDist - uNear) / (uFar - uNear), 0.0, 1.0);
  float d12 = floor(d * 4095.0 + 0.5);
  float hi = floor(d12 / 16.0);
  float lo = d12 - hi * 16.0;
  gl_FragColor = vec4(n.x * 0.5 + 0.5, n.y * 0.5 + 0.5, hi / 255.0, (lo * 16.0 + id) / 255.0);
}`;

const SHADOW_DEPTH_VS = `void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SHADOW_DEPTH_FS = `#include <packing>\nvoid main(){ gl_FragColor = packDepthToRGBA(gl_FragCoord.z); }`;

const BLOB_FS = C_COMMON + `
uniform vec2 uCenter; uniform vec2 uRad; uniform vec3 uCol;
void main(){
  vec2 p = uPixOrigin + floor(gl_FragCoord.xy / uPixScale) + 0.5;
  vec2 d = (p - uCenter) / uRad;
  if (dot(d, d) > 1.0) discard;
  gl_FragColor = vec4(uCol, 1.0);
}`;

const DECAL_VS = `
attribute vec3 aAnc; attribute vec2 aCorner; attribute vec4 aSpr; attribute float aKind;
uniform vec3 uCamR; uniform vec3 uCamU; uniform float uTexel;
varying vec2 vTex;
void main(){
  vec2 s = vec2(dot(aAnc, uCamR), dot(aAnc, uCamU)) / uTexel;
  vec2 s0 = floor(s + 0.5);
  vec2 off = (s0 - s) + aCorner * aSpr.zw - vec2(floor(aSpr.z * 0.5), 0.0);
  vec3 w = aAnc + uCamR * (off.x * uTexel) + uCamU * (off.y * uTexel);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  if (aKind > 3.5) gl_Position.z = 0.999 * gl_Position.w;
  vTex = aSpr.xy + aCorner * aSpr.zw;
}`;
const DECAL_FS = `
uniform sampler2D tAtlas; uniform vec2 uAtlasSize; uniform vec3 uDecalMul;
varying vec2 vTex;
void main(){
  vec4 c = texture2D(tAtlas, (floor(vTex) + 0.5) / uAtlasSize);
  if (c.a < 0.5) discard;
  gl_FragColor = vec4(c.rgb * uDecalMul, 1.0);
}`;

const POST_VS = `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const POST_FS = `
uniform sampler2D tColor; uniform sampler2D tHi; uniform sampler2D tND; uniform sampler2D tDepth; uniform sampler2D tGlyph; uniform sampler2D tIcon;
uniform vec2 uRes; uniform float uF2; uniform float uF3; uniform float uNDOn;
uniform vec3 uLightDir; uniform float uRange; uniform float uTexel;
uniform float uStamp; uniform vec2 uGlyph; uniform float uAtlasCols;
uniform vec3 uEye0; uniform vec3 uEye1; uniform vec3 uBrow0; uniform vec3 uBrow1;
uniform vec4 uIcon; uniform vec2 uIconSize; uniform float uIconCols;
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
  bool closer = sameObj ? (q.z - me.z) * uRange > g : texture2D(tDepth, uv).r < meS - 0.00001;
  if (closer) {
    if (found < 0.5 || abs(q.w - 2.0) < 0.5) { bId = q.w; bUv = uv; }
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
void main(){
  vec2 t = 1.0 / uRes;
  vec4 c = srcAt(vUv);
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
        c = vec4(mix(INK, nc * 0.3, 0.35), 1.0);
      } else if (meChar) {
        c.rgb = mix(c.rgb * 0.5, INK, 0.3);
      } else if (me.w > 0.5) {
        c.rgb = mix(c.rgb * 0.62, INK, 0.12);
      }
    } else if (ne > 0.5 && cov) {
      c.rgb = min(c.rgb * 1.15 + 0.04, vec3(1.0));
    }
  }
  vec2 p = floor(vUv * uRes);
  if (uStamp > 0.5 && meChar) {
    float rawA = texture2D(tColor, vUv).a;
    bool skin = uF2 > 0.5 ? (rawA > 0.5 && rawA < 0.8) : true;
    vec4 g = vec4(0.0);
    if (skin) { g = glyphAt(p, uEye0); if (g.a < 0.5) g = glyphAt(p, uEye1); }
    if (g.a < 0.5) g = glyphAt(p, uBrow0);
    if (g.a < 0.5) g = glyphAt(p, uBrow1);
    if (g.a > 0.5) c = vec4(g.rgb, 1.0);
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


export { VS, TOON_FS, WORLD_FS, GROUND_FS, ND_FS, SHADOW_DEPTH_VS, SHADOW_DEPTH_FS, BLOB_FS, DECAL_VS, DECAL_FS, POST_VS, POST_FS };
