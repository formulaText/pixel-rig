export function summarize(samples: number[]) {
  if (!samples.length) return { count:0, meanMs:null, medianMs:null, p95Ms:null, maxMs:null, over50ms:0 };
  const sorted = [...samples].sort((a,b) => a-b);
  const sum = samples.reduce((a,b) => a+b, 0);
  return { count:samples.length, meanMs:sum/samples.length,
    medianMs:sorted[Math.ceil(sorted.length * .5)-1], p95Ms:sorted[Math.ceil(sorted.length * .95)-1],
    maxMs:sorted[sorted.length-1], over50ms:samples.filter(n => n > 50).length };
}
export class PerformanceRun {
  intervals: number[] = []; cpu: number[] = []; updates = 0; draws = 0;
  private start: number | null = null; private previous: number | null = null; private measurementStart: number | null = null;
  elapsed = 0; status: 'warming' | 'measuring' | 'complete' | 'interrupted' = 'warming'; reason: string | null = null;
  constructor(readonly warmupSeconds: number, readonly durationSeconds: number) {}
  sample(now: number, cpuMs: number, updates: number) {
    if (this.done) return;
    if (this.start === null) this.start = now;
    this.elapsed = (now-this.start)/1000;
    if (this.elapsed < this.warmupSeconds) return;
    this.status = 'measuring';
    if (this.measurementStart === null) this.measurementStart = now;
    if (this.previous !== null) {
      this.intervals.push(now-this.previous); this.cpu.push(cpuMs); this.updates += updates; this.draws++;
    }
    this.previous = now;
    if ((now-this.measurementStart)/1000 >= this.durationSeconds) this.status = 'complete';
  }
  interrupt(reason: string) { if (!this.done) { this.status = 'interrupted'; this.reason = reason; } }
  get done() { return this.status === 'complete' || this.status === 'interrupted'; }
  result() {
    const totalMs = this.intervals.reduce((a,b) => a+b, 0);
    return { status:this.status, reason:this.reason, warmupSeconds:this.warmupSeconds, requestedSeconds:this.durationSeconds,
      measuredSeconds:totalMs/1000, renderedFrames:this.draws, logicUpdates:this.updates,
      renderedFps:totalMs ? this.draws*1000/totalMs : null, logicHz:totalMs ? this.updates*1000/totalMs : null,
      frameIntervals:summarize(this.intervals), cpuSubmission:summarize(this.cpu), gpuMs:null,
      gpuNote:'未取得。RAF間隔・CPU描画命令発行時間はGPU時間ではありません',
      readPixels:false, video:'外部録画は自動検出できません。結果の申告欄を参照', pacing:'通常RAF描画、既存STEPロジック。描画60fpsへ制限していない', passJudgment:null };
  }
}
