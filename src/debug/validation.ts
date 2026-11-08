import { STEP, state, texel, SINP, COSP } from '../core/constants';
import { seedRuntime } from '../core/random';
import { resetLogic, tick, simTime, phase, idleT, moving, snapA, smoothA, curDir, dirHold, moveAcc } from '../gameplay/logic';
import { player, setPlayerWorld } from '../gameplay/player';
import { resetInput, setReplayInput, auto } from '../input/input';
import { expr } from '../character/expression';
import { resetWorld, worldSeed, LAMPS } from '../world/world';
import { shared } from '../materials/shared';
import { renderer } from '../render/renderer';
import { W, H, rebuild, resize, worldCam, type CaptureOptions } from '../render/scene';
import { mkRT } from '../render/post';
import { ReplayClock, inputAt, parseInputs, presets } from './replay';
import { PerformanceRun } from './metrics';
import { comparePixels, differingPixels, type PixelFrame } from './pixels';
import { type BufferView } from './buffers';
import { characterStudy, DEFAULT_CHARACTER_VARIANT, type CharacterSelection } from './character-study';

declare const __BUILD_INFO__: {buildId:string; commit:string; builtAt:string};
const el = <T extends HTMLElement=HTMLElement>(id:string) => document.getElementById(id) as T;
const input = (id:string) => el<HTMLInputElement>(id);
export const clock = new ReplayClock(STEP);
export let active = false;
export let bufferView: BufferView = 'final';
let draw: (options?:CaptureOptions)=>void;
let savedSettings: ReturnType<typeof settings> | null = null;
let initial: ReturnType<typeof settings>;
let preset = 'still', seed = 11, inputs = presets.still.inputs;
export function studyPreset() { return active && !!presets[preset].study; }
export function studyCamera() {
  if (!studyPreset() || !characterStudy.fixedCamera) return null;
  const [x,z]=presets[preset].start;
  return { x:Math.round(x/texel()), y:-Math.round(z*SINP/texel())+Math.round(.9*COSP/texel()) };
}
let performanceRun: PerformanceRun | null = null;
let performanceConditions: ReturnType<typeof conditions> | null = null;
let lastPerformance: unknown = null;
let baseline: { image:PixelFrame; conditions:ReturnType<typeof conditions>; fingerprint:string; separation:unknown } | null = null;
let lastComparison: unknown = null;
const notices: string[] = [];
let lastUi = -Infinity;
function settings() { return { ...state, unwrap:shared.uUnwrap.value, autoBlink:expr.autoBlink }; }
function applySettings(s:ReturnType<typeof settings>) {
  const {unwrap, autoBlink, ...app}=s; Object.assign(state,app); shared.uUnwrap.value=unwrap; expr.autoBlink=autoBlink;
  rebuild(); resize(); syncControls();
}
function syncControls() {
  for (const [id, key] of [['segS','S'],['segFace','face'],['segTod','tod']] as const) el(id).querySelectorAll('button').forEach(b=>b.classList.toggle('on',Object.values(b.dataset)[0]===String(state[key])));
  for(const [id,on] of [['tgAuto',state.auto],['tgCmp',state.compare],['tgShadow',state.shadow],['tgBlink',expr.autoBlink]] as const) { el(id).classList.toggle('on',on); el(id).setAttribute('aria-checked',String(on)); }
  input('unwrap').value=String(shared.uUnwrap.value*100); el('unwrapVal').textContent=input('unwrap').value;
}
export function snapshot() {
  return { ticks:clock.ticks, time:simTime, shaderTime:shared.uTime.value, player:{...player}, phase,idleT,moving,snapA,smoothA,curDir,dirHold,moveAcc,
    expression:JSON.parse(JSON.stringify(expr)), auto:{...auto}, camera:worldCam.matrixWorld.elements.slice(), worldSeed };
}
function conditions() {
  return { mode:active?'検証':'通常操作', replayPaused:clock.paused, build:__BUILD_INFO__, settings:settings(), seed, worldSeed, preset, presetLabel:presets[preset].label, inputs,
    replay:'入力列を秒数から既存STEPへ丸めて繰返し。リセットで時刻0・乱数先頭・初期位置へ戻る',
    stepSeconds:STEP, viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio,orientation:innerWidth>innerHeight?'横':'縦',bufferWidth:W,bufferHeight:H},
    browser:navigator.userAgent, characters:1, pointLights:state.tod==='day'?0:LAMPS.length, shadowLights:state.shadow?1:0,
    qualityAdjustment:'なし', characterStudy:{...characterStudy,defaultVariant:DEFAULT_CHARACTER_VARIANT,presetControlsActive:studyPreset()}, bufferView, recording:input('v-recording').checked?'録画中（申告）':'録画なし（申告・自動検出不可）', state:snapshot() };
}
function fingerprint() { return JSON.stringify({settings:settings(),seed,preset,inputs,W,H,characterStudy}); }
function notice(text:string) { el('v-message').textContent=text; }
function runTick(index:number) {
  const length=inputs.reduce((n,v)=>n+Math.round(v.seconds/STEP),0);
  const {gx,gy}=player;
  setReplayInput(inputAt(inputs,index%Math.max(1,length),STEP)); tick(index*STEP*1000);
  if (presets[preset].stationary) { player.gx=gx; player.gy=gy; }
}
function resetState() {
  clock.reset(); resetLogic(); resetInput(); seedRuntime(seed); resetWorld(seed);
  expr.seq=[]; expr.seqT=0; expr.emote=null; expr.blinkWait=2.5; expr.autoBlink=initial.autoBlink;
  if (studyPreset() && characterStudy.freezePose) expr.autoBlink=false;
  setPlayerWorld(...presets[preset].start); shared.uTime.value=0; setReplayInput({x:0,y:0,len:0});
}
export function resetValidation() {
  stopMeasurement('リセット');
  const value=Number(input('v-seed').value);
  if(!Number.isInteger(value)||value<0||value>4294967295) throw new Error('seedは0〜4294967295の整数にしてください');
  const nextInputs=parseInputs(input('v-inputs').value);
  if(!active) { savedSettings=settings(); initial={...savedSettings,auto:false,compare:false}; active=true; }
  seed=value; preset=el<HTMLSelectElement>('v-preset').value;
  inputs=nextInputs;
  applySettings(initial); resetState(); draw(); lockControls(); refresh(); notice('リセットしました。時刻0で停止中です');
}
function lockControls() {
  el<HTMLFieldSetElement>('normal-controls').disabled=active;
  const measuring=!!performanceRun && !performanceRun.done;
  el<HTMLFieldSetElement>('v-conditions').disabled=measuring;
  for (const id of ['v-play','v-step','v-seek','v-base','v-compare','v-measure']) el<HTMLButtonElement>(id).disabled=measuring;
  el<HTMLSelectElement>('v-buffer').disabled=measuring;
}
export function leaveValidation() {
  stopMeasurement('通常操作へ復帰');
  characterStudy.selection='default'; characterStudy.freezePose=false; characterStudy.fixedCamera=false;
  el<HTMLSelectElement>('v-character-variant').value='default'; input('v-freeze-pose').checked=false; input('v-fixed-camera').checked=false;
  active=false; clock.reset(); setReplayInput(null); seedRuntime(null); resetInput(); resetLogic(); resetWorld(11);
  bufferView='final'; el<HTMLSelectElement>('v-buffer').value='final';
  if(savedSettings) applySettings(savedSettings);
  setPlayerWorld(0,2.5); shared.uTime.value=0; baseline=null; el<HTMLDetailsElement>('validation').open=false; draw(); lockControls(); refresh(); notice('通常操作に戻りました');
}
export function advanceValidation(dt:number) { return active ? clock.advance(dt,runTick) : 0; }
export function stepValidation() {
  if(!active) resetValidation(); clock.pause(); clock.single(runTick); shared.uTime.value=simTime; draw(); refresh();
}
export function seekValidation(seconds:number) {
  if(!Number.isFinite(seconds)||seconds<0||seconds>600) throw new Error('固定時刻は0〜600秒にしてください');
  if(!active) resetValidation(); resetState();
  const count=Math.round(seconds/STEP); for(let i=0;i<count;i++) clock.single(runTick);
  shared.uTime.value=simTime; draw(); refresh(); notice(`${clock.seconds.toFixed(3)}秒に固定しました（既存STEPに丸め）`);
}
export function captureStatic() {
  if(performanceRun && !performanceRun.done) throw new Error('性能測定を停止してから画素比較してください');
  if(!active) resetValidation(); clock.pause();
  const target=mkRT(W,H), time=simTime;
  const read=(character:boolean,blob:boolean,t:number) => {
    shared.uTime.value=t; draw({target,character,blob});
    const bytes=new Uint8Array(W*H*4); renderer.readRenderTargetPixels(target,0,0,W,H,bytes); return bytes;
  };
  try {
    const full=read(true,true,time), noCharacter=read(false,true,time), animated=read(false,false,time), pixels=read(false,false,0);
    const fixed=studyCamera();
    const x=fixed?.x??Math.round(player.gx), y=fixed?.y??(-Math.round(player.gy)+Math.round(.9*COSP/texel()));
    return { fullImage:full, image:{width:W,height:H,x,y,pixels}, conditions:conditions(), fingerprint:fingerprint(),
      separation:{characterPixels:differingPixels(full,noCharacter), movingFootShadowPixels:differingPixels(noCharacter,animated), intentionalAnimationPixels:differingPixels(animated,pixels),
        method:'同一カメラで4描画。全体→キャラ・顔・アイコンなし→足元影なし→既存シェーダー時刻0。静止比較は最終画像全域。建物・木の影と現在のuFootは保持し、差分を除外しない',
        frozenShaderSeconds:0, readPixels:true, normalPerformance:false} };
  } finally { target.dispose(); shared.uTime.value=time; draw(); renderer.setRenderTarget(null); }
}
function captureBaseline() { baseline=captureStatic(); notice('静止背景の基準を記録しました。進行して「画素比較」を押してください'); }
export function compareStatic() {
  if(!baseline) throw new Error('先に「比較基準」を押してください');
  const current=captureStatic();
  if(current.fingerprint!==baseline.fingerprint) throw new Error('条件が変わりました。比較基準を取り直してください');
  lastComparison={reference:baseline.conditions,current:current.conditions,referenceSeparation:baseline.separation,currentSeparation:current.separation,result:comparePixels(baseline.image,current.image)};
  notice(`静止背景：${(lastComparison as {result:{status:string;changed:number}}).result.status}（${(lastComparison as {result:{changed:number}}).result.changed}画素）。詳細は結果欄`);
  showResult(); return lastComparison;
}
export function startMeasurement(warmup?:number,duration?:number) {
  if(!active) resetValidation();
  resetState(); state.compare=false; bufferView='final'; el<HTMLSelectElement>('v-buffer').value='final'; clock.paused=false;
  const standard=el<HTMLSelectElement>('v-duration').value==='standard';
  performanceRun=new PerformanceRun(warmup??(standard?30:5),duration??(standard?60:10));
  performanceConditions=conditions(); lastPerformance=null; lockControls(); notice('画像読出しなしで性能を測定します。画面を表示したままお待ちください');
}
function stopMeasurement(reason:string) {
  if(performanceRun && !performanceRun.done) { performanceRun.interrupt(reason); finishMeasurement(); }
}
function finishMeasurement() {
  lastPerformance={conditions:performanceConditions,result:performanceRun!.result(),endState:snapshot()};
  lockControls(); showResult();
}
export function observeFrame(now:number,cpuMs:number,updates:number) {
  if(performanceRun && !performanceRun.done && performanceConditions && (W!==performanceConditions.viewport.bufferWidth || H!==performanceConditions.viewport.bufferHeight || devicePixelRatio!==performanceConditions.viewport.dpr)) stopMeasurement('内部解像度・DPRの変更');
  if(performanceRun && !performanceRun.done) { performanceRun.sample(now,cpuMs,updates); if(performanceRun.done) finishMeasurement(); }
  if(active && now-lastUi>250) { lastUi=now; refresh(); }
}
function refresh() {
  el('v-clock').textContent=active?`${clock.paused?'停止':'再生'} · ${clock.seconds.toFixed(3)}秒 · ${clock.ticks}更新`:'通常操作中';
  el('v-play').textContent=active&&!clock.paused?'停止':'再生';
  if(performanceRun) {
    const r=performanceRun.result();
    el('v-performance').textContent=`${{warming:'準備中',measuring:'測定中',complete:'測定完了',interrupted:'測定中断'}[r.status]} ${performanceRun.elapsed.toFixed(1)}秒 ／ ${r.renderedFps?.toFixed(1)??'—'} fps ／ 中央値 ${r.frameIntervals.medianMs?.toFixed(2)??'—'} ms ／ p95 ${r.frameIntervals.p95Ms?.toFixed(2)??'—'} ms ／ GPU未取得`;
  }
}
export function result() { return { schema:'pixel-rig-validation-1',conditions:conditions(),performance:lastPerformance ?? (performanceRun ? {conditions:performanceConditions,result:performanceRun.result(),endState:snapshot()} : null),pixelComparison:lastComparison,notices,
  knownIssues:['PNG保存は保留','Bは既存ビルドで実機確認・採用済み。既定化した新ビルドは実機確認待ち','自動検査10条件の差分は残存。まばたき時の変化は原因未確定で別件'],acceptance:'自動的な性能合格・実機確認・採用承認を意味しません' }; }
function showResult() { input('v-result').value=JSON.stringify(result(),null,2); }
export function bindValidation(render:(options?:CaptureOptions)=>void) {
  draw=render;
  el('v-preset').innerHTML=Object.entries(presets).map(([key,p])=>`<option value="${key}">${p.label}</option>`).join('');
  el<HTMLSelectElement>('v-preset').value='still';
  // Do not restore a browser-retained comparison as the normal rendering mode.
  el<HTMLSelectElement>('v-character-variant').value=characterStudy.selection;
  el('v-character-variant').addEventListener('change',()=>{
    stopMeasurement('比較方式の変更');
    const previous=characterStudy.selection;
    characterStudy.selection=el<HTMLSelectElement>('v-character-variant').value as CharacterSelection;
    try { resetValidation(); notice('同じ経路の先頭へ戻りました。「再生」で変更前／候補を比較してください'); }
    catch(e) {
      characterStudy.selection=previous;
      el<HTMLSelectElement>('v-character-variant').value=previous;
      notice((e as Error).message);
    }
  });
  for (const [id,key] of [['v-freeze-pose','freezePose'],['v-fixed-camera','fixedCamera']] as const) {
    input(id).addEventListener('change',()=>{
      stopMeasurement('切分け条件の変更'); characterStudy[key]=input(id).checked;
      try { resetValidation(); } catch(e) { notice((e as Error).message); }
    });
  }
  input('v-inputs').value=JSON.stringify(presets.still.inputs);
  el('v-preset').addEventListener('change',()=>{ input('v-inputs').value=JSON.stringify(presets[el<HTMLSelectElement>('v-preset').value].inputs); try { resetValidation(); } catch(e) { notice((e as Error).message); } });
  const actions:Record<string,()=>void>={
    'v-reset':resetValidation, 'v-exit':leaveValidation,
    'v-play':()=>{if(!active)resetValidation(); clock.paused=!clock.paused; if(clock.paused)clock.pause(); refresh();},
    'v-step':stepValidation, 'v-seek':()=>seekValidation(Number(input('v-time').value)),
    'v-base':captureBaseline,'v-compare':compareStatic,'v-measure':()=>startMeasurement(),
    'v-stop-measure':()=>{stopMeasurement('利用者が停止');refresh();},
  };
  for(const [id,action]of Object.entries(actions)) el(id).addEventListener('click',()=>{try{action();}catch(e){notice((e as Error).message);}});
  el('v-buffer').addEventListener('change',()=>{if(!active)resetValidation();bufferView=el<HTMLSelectElement>('v-buffer').value as BufferView;});
  el('v-copy').addEventListener('click',async()=>{
    showResult(); const text=input('v-result').value;
    try { if(!navigator.clipboard)throw new Error('Clipboard unavailable'); await navigator.clipboard.writeText(text); notice('結果をコピーしました'); }
    catch { notice('コピーできませんでした。下の結果欄を長押ししてコピーできます。通常操作へ戻れます'); input('v-result').focus(); input('v-result').select(); }
  });
  addEventListener('resize',()=>{stopMeasurement('画面サイズ・向きの変更');});
  document.addEventListener('visibilitychange',()=>{ if(document.hidden){clock.pause();resetInput();stopMeasurement('画面が非表示');} });
  addEventListener('blur',()=>{if(active){clock.pause();stopMeasurement('フォーカスが外れた');}});
  refresh();
  if (new URLSearchParams(location.search).get('study')==='color') {
    el<HTMLDetailsElement>('validation').open=true;
    el<HTMLSelectElement>('v-preset').value='color-vertical';
    el('v-preset').dispatchEvent(new Event('change'));
  }
}
