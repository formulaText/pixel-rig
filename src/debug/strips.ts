import { STAGES, FACES } from '../core/constants';
/* ================= 比較ストリップ ================= */
function makeStrip(el: HTMLElement, items: { label: string }[]){
  return items.map(it => {
    const cell = document.createElement('div'); cell.className = 'cell';
    const cv = document.createElement('canvas');
    cell.appendChild(cv);
    const lb = document.createElement('div'); lb.textContent = it.label;
    cell.appendChild(lb);
    el.appendChild(cell);
    return { cv, ctx:cv.getContext('2d')! };
  });
}
const stageCells = makeStrip((document.getElementById('stageStrip') as HTMLElement), STAGES);
const faceCells = makeStrip((document.getElementById('faceStrip') as HTMLElement), FACES);
export { stageCells, faceCells };
