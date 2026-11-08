import {readLibrary,persistDocument,storageError} from './storage';
import {startLookMeasurement,lookMeasurementResult,bindLookMeasurement} from './performance';
import {BASE,PREVIEW,research,clone,limits,validateDocument,type LookDocument,type Preview,type LookValues} from './model';
import {enterLook,exitLook,lookClock,resetLook,stepLook,seekLook,seekLongLook} from './runtime';
declare const __BUILD_INFO__:{buildId:string};
const get=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const labels:Record<string,string>={headTilt:'頭を上げる角度（度）',headIdle:'頭の待機振幅（倍）',bodyIdle:'胴体の待機振幅（倍）',idleSpeed:'待機速度（倍）',outerOpacity:'外周線の不透明度',innerOpacity:'内部線の不透明度'};
let savedSignature='',savedName='',operationBusy=false;
const signature=()=>JSON.stringify([get<HTMLInputElement>('look-name')?.value.trim(),research.values,research.preview]);
export function refreshSaveState(){const e=get('look-save-state');if(!e)return;e.textContent=operationBusy?'処理中…':savedSignature===signature()?`保存済み：${savedName}`:'未保存の変更あり';}
function markSaved(name:string){savedName=name;savedSignature=signature();refreshSaveState();}
function operation(label:string,fn:()=>void|Promise<void>){if(operationBusy)return;operationBusy=true;message(label+'中…');refreshSaveState();for(const e of document.querySelectorAll<HTMLButtonElement>('[data-save-action]')){e.disabled=true;e.setAttribute('aria-busy','true');}
 const end=()=>{get('look-panel').inert=false;document.querySelector<HTMLElement>('.look-dock')!.inert=false;operationBusy=false;for(const e of document.querySelectorAll<HTMLButtonElement>('[data-save-action]')){e.disabled=false;e.removeAttribute('aria-busy');}refreshSaveState();};
 try{const pending=fn();if(pending){get('look-panel').inert=true;document.querySelector<HTMLElement>('.look-dock')!.inert=true;pending.catch(e=>message(label+'できませんでした。'+storageError(e))).finally(end);}else end();}catch(e){message(label+'できませんでした。'+storageError(e));end();}}

export function lookDocument():LookDocument{return {schema:3,name:get<HTMLInputElement>('look-name').value.trim()||'研究設定',buildId:__BUILD_INFO__.buildId,values:clone(research.values),preview:clone(research.preview),playback:{ticks:lookClock.ticks,paused:lookClock.paused}};}
function message(s:string){get('look-message').textContent=s;const e=get('look-operation-result');if(e)e.textContent=s;}
function safe(fn:()=>void){try{fn();}catch(e){message((e as Error).message);}}
export function refreshLookUI(){
 for(const k of Object.keys(limits))for(const suffix of ['','-number'])(get<HTMLInputElement>('look-'+k+suffix)).value=String(research.values[k as keyof LookValues]);
 get<HTMLInputElement>('look-mouth').checked=research.values.mouth;get<HTMLInputElement>('look-outlineColor').value=research.values.outlineColor;get<HTMLInputElement>('look-innerOutlineColor').value=research.values.innerOutlineColor;
 for(const k of ['view','background','motion','direction','zoom','light']as const)get<HTMLSelectElement>('look-'+k).value=String(research.preview[k]);
 for(const k of ['blink','autoDirection']as const)get<HTMLInputElement>('look-'+k).checked=research.preview[k];
 get<HTMLSelectElement>('look-compare').value=research.baseline?'baseline':'draft';window.dispatchEvent(new Event('look-controls-refreshed'));refreshSaveState();
}
export function applyLookDocument(value:unknown){const d=validateDocument(value);research.values=d.values;research.preview=d.preview;research.baseline=false;get<HTMLInputElement>('look-name').value=d.name;const finish=()=>{lookClock.paused=d.playback.paused;refreshLookUI();window.dispatchEvent(new Event('look-restored'));};if(d.playback.ticks>36000)return seekLongLook(d.playback.ticks,n=>message(`再生位置を復元中… ${Math.round(n*100)}%`)).then(finish);seekLook(d.playback.ticks);finish();}
function list(selected=get<HTMLSelectElement>('look-saved').value){const names=Object.keys(readLibrary());const sel=get<HTMLSelectElement>('look-saved');sel.replaceChildren(...names.map(n=>{const o=document.createElement('option');o.value=o.textContent=n;return o;}));if(names.includes(selected))sel.value=selected;}
export function bindLook(){
 const panel=document.createElement('section');panel.id='look-panel';panel.className='validation look-panel';panel.hidden=true;
 const select=(key:string,label:string,opts:[string,string][])=>`<label>${label}<select id="look-${key}">${opts.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label>`;
 const ranges=Object.entries(limits).map(([k,[min,max,step]])=>`<label for="look-${k}">${labels[k]}</label><div class="look-range"><input id="look-${k}" type="range" min="${min}" max="${max}" step="${step}"><input aria-label="${labels[k]}の数値" id="look-${k}-number" type="number" min="${min}" max="${max}" step="${step}"><button class="btn ghost" data-look-reset="${k}">初期値</button></div>`).join('');
 panel.innerHTML=`<h2>キャラクターのルック研究</h2><p class="note">通常のキャラクターは変更しません。調整値は研究用です。プレビューを見ながら下の項目を操作できます。</p><p id="look-time"></p>
 <div class="validation-actions"><button class="btn" id="look-play">再生／停止</button><button class="btn ghost" id="look-step">1コマ進む</button><button class="btn ghost" id="look-reset-time">時刻を先頭へ</button><button class="btn ghost" id="look-exit">通常操作へ戻る</button></div>
 ${select('compare','同じ時刻で比較',[['draft','調整中'],['baseline','採用済みの基準']])}
 ${select('view','表示',[['dot','最終ドット絵'],['3d','3D確認（高解像度・輪郭なし）']])}
 ${select('motion','動作',[['still','静止'],['idle','待機'],['walk','その場歩行'],['vertical','縦移動（既存経路）'],['diagonal','斜め移動（既存経路）']])}
 ${select('direction','向き', ['正面','本人の左斜め','本人の左横','左後ろ','後ろ','右後ろ','本人の右横','本人の右斜め'].map((s,i)=>[String(i),s]))}
 <label><input id="look-autoDirection" type="checkbox">2秒ずつ固定順で8方向</label><label><input id="look-blink" type="checkbox">まばたき</label>
 ${select('background','背景',[['map','既存マップ'],['plain','無地']])}${select('zoom','ドットの拡大確認',[['1','通常サイズ'],['2','2倍（ぼかしなし）'],['3','3倍（ぼかしなし）']])}${select('light','照明',[['day','昼'],['evening','夕方'],['night','夜']])}
 <details open><summary>角度・待機・輪郭</summary>${ranges}<label><input id="look-mouth" type="checkbox">口を表示（基準は口なし）</label><button class="btn ghost" data-look-reset="mouth">口を初期値へ</button><label>キャラの外周線の色<input id="look-outlineColor" type="color"></label><button class="btn ghost" data-look-reset="outlineColor">外周線の色を初期値へ</button><label>キャラの内部線の色<input id="look-innerOutlineColor" type="color"></label><button class="btn ghost" data-look-reset="innerOutlineColor">内部線の色を初期値へ</button></details>
 <div id="look-face-editor"></div>
 <details><summary>名前付き保存・コピー・貼り付け</summary><label>設定名<input id="look-name" value="研究設定" maxlength="60"></label><button class="btn" id="look-save">端末内へ保存</button><label>保存済み<select id="look-saved"></select></label><button class="btn ghost" id="look-load">選択した設定を復元</button><button class="btn ghost" id="look-copy">調整中の設定をコピー</button><label>コピー内容／復元する設定<textarea id="look-json" rows="5"></textarea></label><button class="btn ghost" id="look-paste">貼り付けた設定を復元</button></details><details><summary>性能測定（見た目の確認後）</summary><p>最終ドット絵の現在の設定で測ります。端末を縦持ち／横持ちにして、準備5秒＋測定10秒、自動終了まで操作せず待ってください。測定条件に顔と頭の設定も記録します。</p><button class="btn" id="look-measure">現在のドット絵を15秒測定</button><button class="btn ghost" id="look-measure-copy">測定結果をコピー</button><p id="look-performance" role="status"></p><textarea id="look-measure-result" rows="4" aria-label="性能測定結果"></textarea></details><p id="look-message" role="status"></p>`;
 document.querySelector('.panel')!.prepend(panel);
 const dock=document.createElement('div');dock.className='look-dock';dock.innerHTML='<button class="btn" id="look-dock-compare">基準／調整中</button><button class="btn" id="look-dock-view">3D／ドット</button><button class="btn" id="look-dock-play">再生／停止</button>';document.querySelector('.stage')!.append(dock);
 get('look-dock-compare').onclick=()=>{research.baseline=!research.baseline;refreshLookUI();};get('look-dock-view').onclick=()=>{research.preview.view=research.preview.view==='dot'?'3d':'dot';refreshLookUI();};get('look-dock-play').onclick=()=>{lookClock.paused=!lookClock.paused;};

 get('look-open').addEventListener('click',()=>{enterLook();refreshLookUI();safe(list);});
 for(const [k,[min,max]]of Object.entries(limits))for(const suffix of ['','-number'])get('look-'+k+suffix).addEventListener('input',e=>{
  const value=(e.target as HTMLInputElement).valueAsNumber;if(!Number.isFinite(value)||value<min||value>max){message(`${labels[k]}は${min}〜${max}です`);return;}
  (research.values as any)[k]=value;for(const peer of ['','-number']){const input=get<HTMLInputElement>('look-'+k+peer);if(input!==e.target)input.value=String(value);}
 });
 panel.querySelectorAll<HTMLButtonElement>('[data-look-reset]').forEach(b=>b.onclick=()=>{const k=b.dataset.lookReset as keyof LookValues;(research.values as any)[k]=clone(BASE[k]);refreshLookUI();});
 get('look-innerOutlineColor').oninput=()=>{research.values.innerOutlineColor=get<HTMLInputElement>('look-innerOutlineColor').value;};
 get('look-mouth').onchange=()=>{research.values.mouth=get<HTMLInputElement>('look-mouth').checked;};get('look-outlineColor').oninput=()=>{research.values.outlineColor=get<HTMLInputElement>('look-outlineColor').value;};
 for(const k of ['view','background','motion','direction','zoom','light']as const)get('look-'+k).onchange=()=>{(research.preview as any)[k]=['direction','zoom'].includes(k)?Number(get<HTMLSelectElement>('look-'+k).value):get<HTMLSelectElement>('look-'+k).value;if(k==='motion')resetLook();};
 for(const k of ['blink','autoDirection']as const)get('look-'+k).onchange=()=>{research.preview[k]=get<HTMLInputElement>('look-'+k).checked;if(k==='blink'){import('../character/expression').then(({expr})=>{expr.seq=[];expr.autoBlink=research.preview.blink;});}};
 get('look-compare').onchange=()=>{research.baseline=get<HTMLSelectElement>('look-compare').value==='baseline';};
 get('look-play').onclick=()=>{lookClock.paused=!lookClock.paused;};get('look-step').onclick=stepLook;get('look-reset-time').onclick=resetLook;get('look-exit').onclick=exitLook;
 get('look-save').onclick=()=>operation('保存',()=>{const d=persistDocument(lookDocument());list(d.name);if(get<HTMLSelectElement>('look-saved').value!==d.name)throw Error('保存は完了しましたが一覧を更新できません。再読み込みして保存済み一覧を確認してください。');markSaved(d.name);message(`保存しました：${d.name}（この端末のブラウザ）`);});
 get('look-load').onclick=()=>operation('復元',()=>{const d=readLibrary()[get<HTMLSelectElement>('look-saved').value];if(!d)throw Error('保存済み設定を選んでください。');const finish=()=>{markSaved(d.name);message('設定を復元しました：'+d.name);};const result=applyLookDocument(d);if(result)return result.then(finish);finish();});
 get('look-paste').onclick=()=>operation('貼り付け復元',()=>{const text=get<HTMLTextAreaElement>('look-json').value;if(text.length>150000)throw Error('設定が大きすぎます');const finish=()=>{refreshSaveState();message('貼り付けた設定を復元しました。この端末に残す場合は保存してください。');};const result=applyLookDocument(JSON.parse(text));if(result)return result.then(finish);finish();});
 get('look-copy').onclick=()=>operation('コピー',async()=>{get('look-json').closest('details')!.open=true;const text=JSON.stringify(validateDocument(lookDocument()),null,2);get<HTMLTextAreaElement>('look-json').value=text;try{await navigator.clipboard.writeText(text);message('設定をコピーしました（ファイルの書き出しではありません）。');}catch(e){throw Error('コピーできませんでした。内容欄を長押しして手動コピーできます。'+(e as Error).message);}});
 bindLookMeasurement();get('look-measure').onclick=()=>safe(()=>{lookClock.paused=false;startLookMeasurement(lookDocument());});get('look-measure-copy').onclick=async()=>{try{const result=lookMeasurementResult();if(!result)throw Error('測定結果がありません');const text=JSON.stringify(result,null,2);get<HTMLTextAreaElement>('look-measure-result').value=text;await navigator.clipboard.writeText(text);message('測定結果をコピーしました');}catch(e){message('測定結果をコピーできませんでした。'+(e as Error).message);}};
 refreshLookUI();if(new URLSearchParams(location.search).get('study')==='look'){enterLook();refreshLookUI();safe(list);}
}
