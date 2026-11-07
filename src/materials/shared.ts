import * as THREE from 'three';
import { COSP, SINP, CAM_DIR, texel, CHAR_FOOT_R, MC, MR, TW, TD, TH, LIGHT_W } from '../core/constants';
/* ================= 共有ユニフォーム ================= */
const v3 = (x=0, y=0, z=0) => new THREE.Vector3(x, y, z);
const shared = {
  uCamR:{ value:v3(1, 0, 0) }, uCamU:{ value:v3(0, COSP, -SINP) }, uCamB:{ value:CAM_DIR.clone() },
  uPixOrigin:{ value:new THREE.Vector2() }, uPixScale:{ value:1 }, uTexel:{ value:texel() }, uT:{ value:16 }, uTime:{ value:0 },
  uKNear:{ value:0.15 }, uKFar:{ value:0.02 }, uFoot:{ value:new THREE.Vector4(0, 0, CHAR_FOOT_R, -1) },
  uToon:{ value:1 }, uUnwrap:{ value:1 },
  tRamp:{ value:null as THREE.Texture | null }, uRampRows:{ value:1 },
  tMap:{ value:null as THREE.Texture | null }, uMapSize:{ value:new THREE.Vector2(MC, MR) }, uTW:{ value:TW }, uTD:{ value:TD }, uTH:{ value:TH },
  uNear:{ value:1 }, uFar:{ value:2 },
  uLightDir:{ value:v3(0, 1, 0) }, uSunDirW:{ value:LIGHT_W.clone() }, uSunCol:{ value:v3(1, 1, 1) },
  uSunInt:{ value:1 }, uAmb:{ value:0 },
  uPL:{ value:Array.from({length:8}, () => new THREE.Vector4()) }, uPLC:{ value:Array.from({length:8}, () => v3()) }, uPLN:{ value:0 },
  tShadow:{ value:null as THREE.Texture | null }, uShadowMat:{ value:new THREE.Matrix4() }, uShadowOn:{ value:0 },
};
const K_VS: (keyof typeof shared)[] = ['uCamB','uKNear','uKFar','uFoot'];
const K_COMMON: (keyof typeof shared)[] = ['uCamR','uCamU','uCamB','uPixOrigin','uPixScale','uTexel','uT','uTime'];
const K_LIGHT: (keyof typeof shared)[] = ['uLightDir','uSunDirW','uSunCol','uSunInt','uAmb','uPL','uPLC','uPLN','tShadow','uShadowMat','uShadowOn'];
function U(extra: Record<string, THREE.IUniform>, ...lists: (keyof typeof shared)[][]){ const u: Record<string, THREE.IUniform> = {}; lists.flat().forEach(k => u[k] = shared[k]); return Object.assign(u, extra); }


export { v3, shared, K_VS, K_COMMON, K_LIGHT, U };
