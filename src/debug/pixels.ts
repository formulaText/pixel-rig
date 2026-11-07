export interface PixelFrame { width: number; height: number; x: number; y: number; pixels: Uint8Array }
// Bottom-up RGBA; integer camera origins are the same ones used by renderWorld.
export function comparePixels(a: PixelFrame, b: PixelFrame) {
  if (a.width !== b.width || a.height !== b.height) throw new Error('画面寸法が変わりました。基準を取り直してください');
  const dx = b.x-a.x, dy = b.y-a.y;
  if (!Number.isInteger(dx) || !Number.isInteger(dy)) throw new Error('整数格子のカメラ移動のみ比較できます');
  let compared = 0, changed = 0, maxChannelDelta = 0;
  const examples: { x:number; y:number; before:number[]; after:number[] }[] = [];
  // One-pixel outline samples neighbours: both frames must have those neighbours in view.
  for (let y=1; y<a.height-1; y++) for (let x=1; x<a.width-1; x++) {
    const bx=x-dx, by=y-dy;
    if (bx<1 || by<1 || bx>=b.width-1 || by>=b.height-1) continue;
    const i=(y*a.width+x)*4, j=(by*b.width+bx)*4;
    let differs=false;
    for(let c=0;c<4;c++) { const d=Math.abs(a.pixels[i+c]-b.pixels[j+c]); maxChannelDelta=Math.max(maxChannelDelta,d); differs ||= d!==0; }
    compared++;
    if (differs) { changed++; if(examples.length<12) examples.push({x:x+a.x, y:y+a.y, before:Array.from(a.pixels.slice(i,i+4)), after:Array.from(b.pixels.slice(j,j+4))}); }
  }
  return { scroll:{dx,dy}, compared, changed, maxChannelDelta, examples,
    excluded:a.width*a.height-compared, exclusion:'視野の非共通部分と両画像の1px外周（輪郭の隣接参照）。物体や差分値による除外なし',
    status:compared===0?'比較範囲なし':changed?'不規則変化あり・未解決':'比較範囲で差分なし' };
}
export function differingPixels(a: Uint8Array, b: Uint8Array) {
  let n=0; for(let i=0;i<a.length;i+=4) if(a.subarray(i,i+4).some((v,c)=>v!==b[i+c])) n++; return n;
}
