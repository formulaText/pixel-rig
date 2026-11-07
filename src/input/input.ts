import { random } from '../core/random';
import type { EmoteKey } from '../core/types';
import { stage } from '../render/renderer';
import { EMOTES, STEP, texel, SINP } from '../core/constants';
import { player } from '../gameplay/player';
import { triggerEmote } from '../character/expression';
/* ================= 入力 ================= */
const keys = new Set<string>();
const KEYMAP: Record<string, string> = { ArrowUp:'u', KeyW:'u', ArrowDown:'d', KeyS:'d', ArrowLeft:'l', KeyA:'l', ArrowRight:'r', KeyD:'r' };
addEventListener('keydown', e => { if ((e.target as HTMLElement)?.closest('input, textarea, select')) return; if (KEYMAP[e.code]) { keys.add(KEYMAP[e.code]); e.preventDefault(); } });
addEventListener('keyup', e => { if (KEYMAP[e.code]) keys.delete(KEYMAP[e.code]); });
addEventListener('blur', () => keys.clear());
const joyEl = (document.getElementById('joy') as HTMLElement), knob = (document.getElementById('knob') as HTMLElement), hint = (document.getElementById('hint') as HTMLElement);
let joy: { id: number; ox: number; oy: number; x: number; y: number } | null = null;
stage.addEventListener('pointerdown', e => {
  stage.setPointerCapture(e.pointerId);
  const r = stage.getBoundingClientRect();
  joy = { id:e.pointerId, ox:e.clientX, oy:e.clientY, x:0, y:0 };
  joyEl.style.left = (e.clientX - r.left) + 'px';
  joyEl.style.top = (e.clientY - r.top) + 'px';
  joyEl.style.display = 'block';
  knob.style.transform = '';
  hint.style.opacity = '0';
});
stage.addEventListener('pointermove', e => {
  if (!joy || e.pointerId !== joy.id) return;
  let x = (e.clientX - joy.ox) / 40, y = (e.clientY - joy.oy) / 40;
  const l = Math.hypot(x, y);
  if (l > 1) { x /= l; y /= l; }
  joy.x = x; joy.y = y;
  knob.style.transform = `translate(${x * 30}px,${y * 30}px)`;
});
const endJoy = (e: PointerEvent) => { if (joy && e.pointerId === joy.id) { joy = null; joyEl.style.display = 'none'; } };
stage.addEventListener('pointerup', endJoy);
stage.addEventListener('pointercancel', endJoy);
let lastUser = -1e9;
export let replayInput: { x: number; y: number; len: number } | null = null;
export function setReplayInput(v: typeof replayInput) { replayInput = v; }
export function resetInput() { keys.clear(); joy = null; joyEl.style.display = 'none'; lastUser = -1e9; Object.assign(auto, { i:1, wait:0, stuck:0 }); }
function inputVec(now: number){
  if (replayInput) return replayInput;
  let x = 0, y = 0;
  if (keys.has('l')) x -= 1; if (keys.has('r')) x += 1;
  if (keys.has('u')) y -= 1; if (keys.has('d')) y += 1;
  if (joy) { x += joy.x; y += joy.y; }
  let len = Math.hypot(x, y);
  if (len > 1) { x /= len; y /= len; len = 1; }
  if (len > 0.3) { lastUser = now; hint.style.opacity = '0'; }
  return { x, y, len };
}
const WP = [[0,2.5,0],[0,-12,0],[-4,-4,0],[-14,0,1],[14,0,0],[4,9,1],[0,0,0]];
const auto = { i:1, wait:0, stuck:0 };
const EMOTE_KEYS = Object.keys(EMOTES) as EmoteKey[];
function autoVec(){
  if (auto.wait > 0) { auto.wait -= STEP; return { x:0, y:0, len:0 }; }
  const tx = texel();
  const px = player.gx * tx, pz = player.gy * tx / SINP;
  const [wx, wz] = WP[auto.i];
  const dx = wx - px, dz = wz - pz;
  if (Math.hypot(dx, dz) < 0.3 || auto.stuck > 1.5) {
    if (WP[auto.i][2]) { auto.wait = 2.2; triggerEmote(EMOTE_KEYS[Math.floor(random() * EMOTE_KEYS.length)]); }
    auto.i = (auto.i + 1) % WP.length; auto.stuck = 0;
    return { x:0, y:0, len:0 };
  }
  const sx = dx, sy = dz * SINP, l = Math.hypot(sx, sy);
  return { x:sx / l, y:sy / l, len:1 };
}


export { keys, joy, lastUser, inputVec, auto, autoVec };
