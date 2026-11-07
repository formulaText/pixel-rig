import type { Resolution, FaceMode, TimeOfDay, EmoteKey } from '../core/types';
import { state } from '../core/constants';
import { rebuild, resize } from '../render/scene';
import { triggerEmote, expr } from '../character/expression';
import { shared } from '../materials/shared';
export function bindControls(){
  /* ================= UI ================= */
  function setSwitch(el: HTMLElement, on: boolean){ el.classList.toggle('on', on); el.setAttribute('aria-checked', on ? 'true' : 'false'); }
  document.querySelectorAll<HTMLElement>('.step').forEach(b => {
    b.addEventListener('click', () => { const k = b.dataset.k as 'f1' | 'f2' | 'f3' | 'f4'; state[k] = !state[k]; setSwitch(b, state[k]); });
  });
  function segBind(sel: string, attr: string, fn: (value: string) => void){
    document.querySelectorAll<HTMLElement>(sel + ' button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll<HTMLElement>(sel + ' button').forEach(x => x.classList.toggle('on', x === b));
      fn(b.dataset[attr]!);
    }));
  }
  segBind('#segS', 's', v => { state.S = +v as Resolution; rebuild(); });
  segBind('#segFace', 'f', v => { state.face = v as FaceMode; });
  segBind('#segTod', 't', v => { state.tod = v as TimeOfDay; });
  document.querySelectorAll<HTMLElement>('#emo button').forEach(b => b.addEventListener('click', () => triggerEmote(b.dataset.k as EmoteKey)));
  const dotIn = (document.getElementById('dot') as HTMLInputElement), dotVal = (document.getElementById('dotVal') as HTMLElement);
  dotIn.addEventListener('input', () => { state.dot = +dotIn.value; dotVal.textContent = String(state.dot); resize(); });
  const unwrapIn = (document.getElementById('unwrap') as HTMLInputElement), unwrapVal = (document.getElementById('unwrapVal') as HTMLElement);
  unwrapIn.addEventListener('input', () => { shared.uUnwrap.value = +unwrapIn.value / 100; unwrapVal.textContent = unwrapIn.value; });
  ([
    ['tgAuto', () => state.auto = !state.auto],
    ['tgCmp', () => state.compare = !state.compare],
    ['tgShadow', () => state.shadow = !state.shadow],
    ['tgBlink', () => { expr.autoBlink = !expr.autoBlink; expr.seq = []; return expr.autoBlink; }],
  ] satisfies [string, () => boolean][]).forEach(([id, fn]) => { const el = document.getElementById(id)!; el.addEventListener('click', () => setSwitch(el, fn())); });
}
