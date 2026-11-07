// Replay time is integer ticks at the existing logic STEP, independent of RAF cadence.
export interface InputSegment { seconds: number; x: number; y: number }
export interface Preset { label: string; start: [number, number]; inputs: InputSegment[]; study?: boolean; stationary?: boolean }
export const presets: Record<string, Preset> = {
  'color-vertical': { label:'色比較：縦移動', start:[0,2.5], inputs:[{seconds:2,x:0,y:-1},{seconds:2,x:0,y:1}], study:true },
  'color-diagonal': { label:'色比較：斜め移動', start:[0,2.5], inputs:[{seconds:2,x:1,y:1},{seconds:2,x:-1,y:-1}], study:true },
  'color-horizontal': { label:'色比較：横移動', start:[0,2.5], inputs:[{seconds:2,x:1,y:0},{seconds:2,x:-1,y:0}], study:true },
  'color-walk': { label:'色比較：位置固定の歩行', start:[0,2.5], inputs:[{seconds:4,x:0,y:1}], study:true, stationary:true },
  'color-trees': { label:'色比較：木との重なり', start:[11,-13], inputs:[{seconds:2,x:1,y:0},{seconds:2,x:-1,y:0}], study:true },
  still: { label:'静止', start:[0, 2.5], inputs:[{seconds:6, x:0, y:0}] },
  horizontal: { label:'横移動', start:[0, 2.5], inputs:[{seconds:2, x:1, y:0}, {seconds:2, x:-1, y:0}, {seconds:2, x:0, y:0}] },
  vertical: { label:'縦移動', start:[0, 2.5], inputs:[{seconds:2, x:0, y:-1}, {seconds:2, x:0, y:1}, {seconds:2, x:0, y:0}] },
  diagonal: { label:'斜め移動', start:[0, 2.5], inputs:[{seconds:2, x:1, y:1}, {seconds:2, x:-1, y:-1}, {seconds:2, x:0, y:0}] },
  wall: { label:'壁際', start:[-7.5, -4.9], inputs:[{seconds:2, x:0, y:-1}, {seconds:2, x:1, y:-1}, {seconds:2, x:0, y:0}] },
  trees: { label:'木の重なり', start:[13, -10], inputs:[{seconds:2, x:1, y:0}, {seconds:2, x:-1, y:-1}, {seconds:2, x:0, y:0}] },
};
export function inputAt(inputs: InputSegment[], tick: number, step: number) {
  let end = 0;
  for (const input of inputs) {
    end += Math.round(input.seconds / step);
    if (tick < end) { const len = Math.hypot(input.x, input.y); return { x:input.x / Math.max(1, len), y:input.y / Math.max(1, len), len:Math.min(1, len) }; }
  }
  return { x:0, y:0, len:0 };
}
export function parseInputs(text: string): InputSegment[] {
  const value: unknown = JSON.parse(text);
  if (!Array.isArray(value) || value.length < 1 || value.length > 1000) throw new Error('入力列は1〜1000区間にしてください');
  let duration = 0;
  for (const v of value) {
    if (!v || ![v.seconds, v.x, v.y].every(Number.isFinite) || v.seconds <= 0 || Math.abs(v.x) > 1 || Math.abs(v.y) > 1) throw new Error('secondsは正数、xとyは−1〜1にしてください');
    duration += v.seconds;
  }
  if (duration > 600) throw new Error('入力列は合計600秒以内にしてください');
  return value.map(({seconds, x, y}) => ({seconds, x, y}));
}
export class ReplayClock {
  ticks = 0; paused = true; private acc = 0;
  constructor(readonly step: number) {}
  reset() { this.ticks = 0; this.acc = 0; this.paused = true; }
  pause() { this.paused = true; this.acc = 0; }
  advance(dt: number, run: (tick: number) => void) {
    if (this.paused) return 0;
    this.acc += Math.min(0.1, Math.max(0, dt));
    let n = 0;
    while (this.acc + 1e-12 >= this.step && n < 6) { this.single(run); this.acc -= this.step; n++; }
    if (n === 6) this.acc = 0;
    return n;
  }
  single(run: (tick: number) => void) { run(this.ticks++); }
  get seconds() { return this.ticks * this.step; }
}
