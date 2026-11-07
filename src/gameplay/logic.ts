import { TAU, DIR_HOLD, DIR_HYST, texel, SINP, state, WALK_V, STEP, DIR8, CYCLE } from '../core/constants';
import { blocked } from '../world/world';
import { player } from './player';
import { inputVec, lastUser, autoVec, auto } from '../input/input';
import { tickExpr, applyEmote } from '../character/expression';
import { walkPose, idlePose } from '../character/rig';
/* ================= ロジック（60Hz固定） ================= */
let phase = 0, idleT = 0, moving = false, wasMoving = false, smoothA = 0, snapA = 0, moveAcc = 0, simTime = 0;
let curDir = 0, dirHold = 0;
function lerpAngle(a: number, b: number, t: number){ const d = ((b - a + Math.PI) % TAU + TAU) % TAU - Math.PI; return a + d * t; }
function angDist(a: number, b: number){ return Math.abs(((a - b + Math.PI) % TAU + TAU) % TAU - Math.PI); }
function pickDir(a: number){
  const k = ((Math.round(a / (TAU / 8)) % 8) + 8) % 8;
  if (!wasMoving) { curDir = k; dirHold = 0; return k; }
  dirHold++;
  if (k !== curDir && dirHold >= DIR_HOLD && angDist(a, curDir * TAU / 8) > DIR_HYST) { curDir = k; dirHold = 0; }
  return curDir;
}
function canAt(gx: number, gy: number){ const tx = texel(); return !blocked(gx * tx, gy * tx / SINP); }
function stepPixel(dx: number, dy: number){
  if (canAt(player.gx + dx, player.gy + dy)) { player.gx += dx; player.gy += dy; return true; }
  if (dx && dy) {
    if (canAt(player.gx + dx, player.gy)) { player.gx += dx; return true; }
    if (canAt(player.gx, player.gy + dy)) { player.gy += dy; return true; }
  }
  return false;
}
function moveFloat(dx: number, dy: number){
  if (canAt(player.gx + dx, player.gy + dy)) { player.gx += dx; player.gy += dy; return true; }
  if (canAt(player.gx + dx, player.gy)) { player.gx += dx; return true; }
  if (canAt(player.gx, player.gy + dy)) { player.gy += dy; return true; }
  return false;
}
function tick(now: number){
  if (state.f4) { player.gx = Math.round(player.gx); player.gy = Math.round(player.gy); }
  let v = inputVec(now);
  const isAuto = v.len < 0.3 && state.auto && now - lastUser > 3000;
  if (isAuto) v = autoVec();
  moving = v.len > 0.3;
  const spd = WALK_V / texel();
  if (moving) {
    const a = Math.atan2(v.x, v.y);
    const k = pickDir(a);
    snapA = k * TAU / 8;
    smoothA = lerpAngle(smoothA, a, 1 - Math.exp(-STEP * 12));
    let ok = true;
    if (state.f4) {
      const d = DIR8[k], diag = d[0] && d[1];
      moveAcc += spd * STEP * (diag ? Math.SQRT1_2 : 1);
      while (moveAcc >= 1) { moveAcc -= 1; if (!stepPixel(d[0], d[1])) { ok = false; moveAcc = 0; break; } }
    } else {
      ok = moveFloat(v.x * spd * STEP, v.y * spd * STEP);
    }
    if (isAuto) auto.stuck = ok ? 0 : auto.stuck + STEP;
    phase = (phase + STEP / CYCLE) % 1;
    idleT = 0;
  } else {
    idleT += STEP; phase = 0; moveAcc = 0;
  }
  wasMoving = moving;
  tickExpr();
  simTime += STEP;
}
function applyPose(stepped: boolean){
  if (moving) walkPose(stepped ? Math.floor(phase * 4) / 4 : phase);
  else idlePose(stepped ? ((Math.floor(idleT / 0.6) % 2) ? 1 : -1) : Math.sin(idleT * TAU / 1.2));
  applyEmote(stepped);
}


export { phase, idleT, moving, smoothA, snapA, moveAcc, simTime, curDir, dirHold, tick, applyPose };
