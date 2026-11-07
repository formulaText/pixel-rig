import { state, TAU } from '../core/constants';
import { expr, applyEmote } from '../character/expression';
import { walkPose } from '../character/rig';
import { renderSprite, cmpRT } from '../render/scene';
import { blit } from './comparison';
export function bindExport(){
  /* ================= 焼き出し ================= */
  const dlg = (document.getElementById('dlg') as HTMLDialogElement), sheet = (document.getElementById('sheet') as HTMLCanvasElement);
  const sheetCtx = sheet.getContext('2d')!;
  (document.getElementById('closeDlg') as HTMLElement).addEventListener('click', () => dlg.close());
  (document.getElementById('bake') as HTMLElement).addEventListener('click', () => {
    const S = state.S;
    const saved = expr.emote; expr.emote = null;
    const savedSeq = expr.seq; expr.seq = [];
    sheet.width = S * 4; sheet.height = S * 8;
    sheetCtx.clearRect(0, 0, sheet.width, sheet.height);
    for (let d = 0; d < 8; d++) for (let k = 0; k < 4; k++) {
      walkPose(k / 4); applyEmote(true);
      renderSprite({ f1:state.f1, f2:state.f2, f3:state.f3, face:state.face, angle:d * TAU / 8, subX:0, subY:0 }, cmpRT);
      blit(cmpRT, sheetCtx, S, k * S, d * S);
    }
    expr.emote = saved; expr.seq = savedSeq;
    const dpr = window.devicePixelRatio || 1;
    const maxCss = Math.min(innerWidth * 0.86, 640);
    const dev = Math.max(1, Math.floor(Math.min(maxCss / (S * 4), (innerHeight * 0.6) / (S * 8)) * dpr));
    sheet.style.width = (S * 4 * dev / dpr) + 'px';
    sheet.style.height = (S * 8 * dev / dpr) + 'px';
    (document.getElementById('dl') as HTMLAnchorElement).href = sheet.toDataURL('image/png');
    (document.getElementById('sheetInfo') as HTMLElement).textContent = `${S * 4}×${S * 8}px／行：下・右下・右・右上・上・左上・左・左下`;
    dlg.showModal();
  });
}
