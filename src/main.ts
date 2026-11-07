import './style.css';
import { STEP, state, texel, SINP, COSP, DIR_NAMES } from './core/constants';
import { tick, simTime, applyPose, snapA, smoothA, curDir } from './gameplay/logic';
import { shared } from './materials/shared';
import { player } from './gameplay/player';
import { setFace, J } from './character/rig';
import { renderWorld, resize, rebuild } from './render/scene';
import { updateComparison } from './debug/comparison';
import { stage } from './render/renderer';
import { bindControls } from './ui/controls';
import { bindExport } from './debug/export';
/* ================= メインループ ================= */
let frameN = 0, fps = 60, lastT = performance.now(), acc = 0;
const hud = (document.getElementById('hud') as HTMLElement);
const TOD_NAMES = { day:'昼', evening:'夕方', night:'夜' };
function frame(now: number){
  requestAnimationFrame(frame);
  const dt = Math.min(0.1, (now - lastT) / 1000);
  lastT = now;
  fps = fps * 0.93 + (1 / Math.max(dt, 1e-3)) * 0.07;
  acc += dt;
  let n = 0;
  while (acc >= STEP && n < 6) { tick(now); acc -= STEP; n++; }
  if (n === 6) acc = 0;
  shared.uTime.value = simTime;

  const S = state.S, st = state.f4, tx = texel();
  const cx = Math.round(player.gx), cy = Math.round(player.gy);
  const X = player.gx * tx, Z = player.gy * tx / SINP;
  const upOff = Math.round(0.9 * COSP / tx);

  setFace(state.face);
  applyPose(st);
  J.root.position.set(X, 0, Z);
  J.root.rotation.y = st ? snapA : smoothA;
  renderWorld({ f1:state.f1, f2:state.f2, f3:state.f3, face:state.face }, X, Z, cx, -cy + upOff, player.gx, player.gy);

  updateComparison(frameN, snapA, smoothA);
  if (frameN % 10 === 0) {
    hud.textContent = `${S}px／ドット×${state.dot}／${Math.round(fps)}fps／${TOD_NAMES[state.tod]}／向き：${DIR_NAMES[curDir]}`;
  }
  frameN++;
}

bindControls();
bindExport();
new ResizeObserver(resize).observe(stage);
rebuild();
resize();
requestAnimationFrame(frame);

declare const __BUILD_INFO__: { buildId: string; commit: string; builtAt: string };
document.getElementById('status')!.textContent = '起動しました · Three.js r128';
document.getElementById('build-id')!.textContent = __BUILD_INFO__.buildId;
document.getElementById('commit')!.textContent = __BUILD_INFO__.commit;
document.getElementById('built-at')!.textContent = __BUILD_INFO__.builtAt || '開発中';

export { frameN, frame };
