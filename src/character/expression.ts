import { random } from '../core/random';
import type { EmoteKey } from '../core/types';
import { EMOTES, STEP, TAU } from '../core/constants';
import { J } from './rig';
/* ================= 感情表現 ================= */
const expr: { autoBlink: boolean; blinkWait: number; seq: [number, number][]; seqT: number; emote: { key: EmoteKey; t: number; dur: number } | null } = { autoBlink:true, blinkWait:2.5, seq:[], seqT:0, emote:null };
function triggerEmote(key: EmoteKey){ expr.emote = { key, t:0, dur:EMOTES[key].dur }; expr.seq = []; }
function tickExpr(){
  if (expr.emote) { expr.emote.t += STEP; if (expr.emote.t >= expr.emote.dur) expr.emote = null; }
  if (expr.seq.length) {
    if (--expr.seqT <= 0) { expr.seq.shift(); if (expr.seq.length) expr.seqT = expr.seq[0][1]; }
  } else if (expr.autoBlink && !expr.emote) {
    expr.blinkWait -= STEP;
    if (expr.blinkWait <= 0) {
      expr.seq = [[1,3],[2,4],[1,3]];
      if (random() < 0.15) expr.seq.push([0,5],[1,3],[2,4],[1,3]);
      expr.seqT = expr.seq[0][1];
      expr.blinkWait = 2 + random() * 4;
    }
  }
}
function curEye(){
  if (expr.emote) return EMOTES[expr.emote.key].eye;
  return expr.seq.length ? expr.seq[0][0] : 0;
}
function applyEmote(stepped: boolean){
  J.motion.position.set(0, 0, 0);
  J.motion.rotation.set(0, 0, 0);
  const e = expr.emote;
  if (!e) return;
  const t = stepped ? Math.floor(e.t * 12) / 12 : e.t;
  const env = Math.max(0, Math.min(1, t / 0.15, (e.dur - t) / 0.3));
  const fade = Math.max(0, 1 - t / 0.7);
  switch (EMOTES[e.key].motion) {
    case 'hop':
      for (const k of [0, 0.32]) if (t >= k && t < k + 0.26) J.motion.position.y = 0.24 * Math.sin(Math.PI * (t - k) / 0.26);
      J.armL.rotation.z += 0.9 * env; J.armR.rotation.z -= 0.9 * env;
      break;
    case 'jolt':
      if (t < 0.16) J.motion.position.y = 0.14 * Math.sin(Math.PI * t / 0.16);
      J.torso.rotation.x -= 0.3 * fade; J.head.rotation.x -= 0.2 * fade;
      J.armL.rotation.z += 0.5 * fade; J.armR.rotation.z -= 0.5 * fade;
      break;
    case 'tilt':
      J.head.rotation.z += 0.32 * env; J.torso.rotation.z += 0.06 * env;
      break;
    case 'slump':
      J.torso.rotation.x += 0.3 * env; J.head.rotation.x += 0.35 * env;
      J.motion.position.y = -0.04 * env;
      J.armL.rotation.z -= 0.08 * env; J.armR.rotation.z += 0.08 * env;
      break;
    case 'stomp':
      if (t < 1.1) {
        const k = Math.floor(t / 0.14), ph = (t % 0.14) / 0.14;
        J.motion.position.y = 0.07 * Math.sin(Math.PI * ph);
        J.motion.rotation.z = (k % 2 ? 1 : -1) * 0.06;
      }
      J.armL.rotation.z += 0.35 * env; J.armR.rotation.z -= 0.35 * env;
      break;
    case 'fidget':
      J.motion.position.x = 0.06 * Math.sin(t * TAU * 3) * env;
      J.head.rotation.y += 0.25 * Math.sin(t * TAU * 1.5) * env;
      break;
  }
}


export { expr, triggerEmote, tickExpr, curEye, applyEmote };
