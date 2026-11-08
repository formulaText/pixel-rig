import {bindFaceEditor} from './research/face-ui';
import './style.css';
import { renderLook } from './research/runtime';
import { bindLook } from './research/ui';
import { STEP, state, texel, SINP, COSP, DIR_NAMES } from './core/constants';
import { tick, simTime, applyPose, snapA, smoothA, curDir } from './gameplay/logic';
import { shared } from './materials/shared';
import { player } from './gameplay/player';
import { setFace, J, walkPose } from './character/rig';
import { renderWorld, resize, rebuild, type CaptureOptions } from './render/scene';
import { updateComparison } from './debug/comparison';
import { stage } from './render/renderer';
import { bindControls } from './ui/controls';
import { bindExport } from './debug/export';
import { bindValidation, active, advanceValidation, observeFrame, bufferView, studyPreset, studyCamera } from './debug/validation';
import { characterStudy } from './debug/character-study';
import { showBuffer } from './debug/buffers';
/* ================= メインループ ================= */
let frameN = 0, fps = 60, lastT = performance.now(), acc = 0;
const hud = (document.getElementById('hud') as HTMLElement);
const TOD_NAMES = { day:'昼', evening:'夕方', night:'夜' };
function frame(now: number){
  requestAnimationFrame(frame);
  const cpuStart = performance.now();
  const dt = Math.min(0.1, (now - lastT) / 1000);
  lastT = now;
  fps = fps * 0.93 + (1 / Math.max(dt, 1e-3)) * 0.07;
  if(renderLook(dt)) { acc=0; return; }
  let n = 0;
  if(active) { acc=0; n=advanceValidation(dt); }
  else {
    acc += dt;
    while (acc >= STEP && n < 6) { tick(now); acc -= STEP; n++; }
    if (n === 6) acc = 0;
  }
  shared.uTime.value = simTime;

  drawWorld();
  showBuffer(bufferView);

  updateComparison(frameN, snapA, smoothA);
  observeFrame(now, performance.now()-cpuStart, n);
  if (frameN % 10 === 0) {
    hud.textContent = `${state.S}px／ドット×${state.dot}／${Math.round(fps)}fps／${TOD_NAMES[state.tod]}／向き：${DIR_NAMES[curDir]}`;
  }
  frameN++;
}

function drawWorld(options?: CaptureOptions){
  const st = state.f4, tx = texel();
  const cx = Math.round(player.gx), cy = Math.round(player.gy);
  const X = player.gx * tx, Z = player.gy * tx / SINP;
  const upOff = Math.round(0.9 * COSP / tx);

  setFace(state.face);
  applyPose(st);
  if (studyPreset() && characterStudy.freezePose) {
    walkPose(.25);
    J.motion.position.set(0, 0, 0); J.motion.rotation.set(0, 0, 0);
  }
  J.root.position.set(X, 0, Z);
  J.root.rotation.y = studyPreset() && characterStudy.freezePose ? 0 : (st ? snapA : smoothA);
  const fixed = studyCamera();
  renderWorld({ f1:state.f1, f2:state.f2, f3:state.f3, face:state.face }, X, Z, fixed?.x ?? cx, fixed?.y ?? (-cy + upOff), player.gx, player.gy, options);

}

bindControls();
bindExport();
new ResizeObserver(resize).observe(stage);
rebuild();
resize();
bindValidation(drawWorld);
bindLook();
bindFaceEditor();
document.addEventListener('visibilitychange',()=>{ lastT=performance.now(); acc=0; });
requestAnimationFrame(frame);

declare const __BUILD_INFO__: { buildId: string; commit: string; builtAt: string };
document.getElementById('status')!.textContent = '起動しました · Three.js r128';
document.getElementById('build-id')!.textContent = __BUILD_INFO__.buildId;
document.getElementById('commit')!.textContent = __BUILD_INFO__.commit;
document.getElementById('built-at')!.textContent = __BUILD_INFO__.builtAt || '開発中';

export { frameN, frame };
