import {PerformanceRun} from '../debug/metrics';
import {characterStudy} from '../debug/character-study';
import {state} from '../core/constants';
import {research,effectiveLook,clone} from './model';
declare const __BUILD_INFO__:{buildId:string};
let run:PerformanceRun|null=null,conditions:unknown=null;
export function startLookMeasurement(document:unknown){
 if(research.preview.view!=='dot')throw Error('性能測定は「最終ドット絵」に切り替えてください');
 run=new PerformanceRun(5,10);conditions={buildId:__BUILD_INFO__.buildId,document,comparison:research.baseline?'baseline':'draft',renderedValues:clone(effectiveLook()),variant:characterStudy.variant,selection:characterStudy.selection,S:state.S,dot:state.dot,shadow:state.shadow,characterCount:1,orientation:innerWidth>innerHeight?'横持ち':'縦持ち',viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},userAgent:navigator.userAgent};show();
}
export function interruptLookMeasurement(reason:string){run?.interrupt(reason);show();}
export function lookMeasurementResult(){return run?{conditions,performance:run.result()}:null;}
function show(){const el=document.getElementById('look-performance');if(!el||!run)return;const r=run.result();el.textContent=r.status==='complete'?`測定終了：${r.renderedFps?.toFixed(3)}fps・${r.renderedFrames}フレーム・${r.measuredSeconds.toFixed(3)}秒・p95 ${r.frameIntervals.p95Ms?.toFixed(2)}ms`:r.status==='interrupted'?`測定中断：${r.reason}`:`${r.status==='warming'?'準備中（5秒）':'測定中（10秒）'} — 自動終了まで操作せず待ってください`;}
export function sampleLookMeasurement(now:number,cpu:number,updates:number){if(!run||run.done)return;run.sample(now,cpu,updates);show();}
export function bindLookMeasurement(){
 document.querySelector('.look-dock')?.addEventListener('pointerdown',()=>interruptLookMeasurement('プレビュー操作が変更されました'));
 document.getElementById('look-panel')!.addEventListener('click',e=>{const id=(e.target as HTMLElement).id;if(id!=='look-measure'&&id!=='look-measure-copy')interruptLookMeasurement('操作が変更されました');},true);
 for(const type of ['input','change','pointerdown'])document.getElementById('look-panel')!.addEventListener(type,()=>interruptLookMeasurement('設定または操作が変更されました'));
 window.addEventListener('resize',()=>interruptLookMeasurement('画面の向き・寸法が変わりました'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)interruptLookMeasurement('画面が非表示になりました');});
}
