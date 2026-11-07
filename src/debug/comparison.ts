import type * as THREE from 'three';
import { STAGES, FACES, state } from '../core/constants';
import { renderer } from '../render/renderer';
import { player } from '../gameplay/player';
import { applyPose } from '../gameplay/logic';
import { renderSprite, cmpRT } from '../render/scene';
import { stageCells, faceCells } from './strips';
let pixBuf: Uint8Array | null = null;
function blit(rt: THREE.WebGLRenderTarget, ctx: CanvasRenderingContext2D, S: number, dx: number, dy: number){
  const n = S * S * 4;
  if (!pixBuf || pixBuf.length !== n) pixBuf = new Uint8Array(n);
  renderer.readRenderTargetPixels(rt, 0, 0, S, S, pixBuf);
  const img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    const src = (S - 1 - y) * S * 4;
    img.data.set(pixBuf.subarray(src, src + S * 4), y * S * 4);
  }
  ctx.putImageData(img, dx, dy);
}


function updateComparison(frameN: number, snapA: number, smoothA: number){
  const S = state.S;
  if (state.compare) {
    const subX = player.gx - Math.floor(player.gx), subY = player.gy - Math.floor(player.gy);
    if (frameN % 2 === 0) {
      STAGES.forEach((stg, i) => {
        const f = stg.f;
        applyPose(!!f[3]);
        renderSprite({ f1:!!f[0], f2:!!f[1], f3:!!f[2], face:state.face, angle:f[3] ? snapA : smoothA,
          subX:f[3] ? 0 : subX, subY:f[3] ? 0 : subY }, cmpRT);
        blit(cmpRT, stageCells[i].ctx, S, 0, 0);
      });
    } else {
      applyPose(true);
      FACES.forEach((fc, i) => {
        renderSprite({ f1:true, f2:true, f3:true, face:fc.k, angle:snapA, subX:0, subY:0 }, cmpRT);
        blit(cmpRT, faceCells[i].ctx, S, 0, 0);
      });
    }
  }
}

export { blit, updateComparison };
