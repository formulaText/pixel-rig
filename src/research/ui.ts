import {BASE,PREVIEW,research,clone,limits,validateDocument,type LookDocument,type Preview,type LookValues} from './model';
import {enterLook,exitLook,lookClock,resetLook,stepLook,seekLook} from './runtime';
declare const __BUILD_INFO__:{buildId:string};
const get=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const labels:Record<string,string>={headTilt:'頭を上げる角度（度）',headIdle:'頭の待機振幅（倍）',bodyIdle:'胴体の待機振幅（倍）',idleSpeed:'待機速度（倍）',outerOpacity:'外周線の不透明度',innerOpacity:'内部線の不透明度'};
const storageKey='pixel-rig-look-library-v1';
export function lookDocument():LookDocument{return {schema:1,name:get<HTMLInputElement>('look-name').value.trim()||'研究設定',buildId:__BUILD_INFO__.buildId,values:clone(research.values),preview:clone(research.preview),playback:{ticks:lookClock.ticks,paused:lookClock.paused}};}
function message(s:string){get('look-message').textContent=s;}
function safe(fn:()=>void){try{fn();}catch(e){message((e as Error).message);}}
export function refreshLookUI(){
 for(const k of Object.keys(limits))for(const suffix of ['','-number'])(get<HTMLInputElement>('look-'+k+suffix)).value=String(research.values[k as keyof LookValues]);
 get<HTMLInputElement>('look-mouth').checked=research.values.mouth;get<HTMLInputElement>('look-outlineColor').value=research.values.outlineColor;
 for(const k of ['view','background','motion','direction','zoom','light']as const)get<HTMLSelectElement>('look-'+k).value=String(research.preview[k]);
 for(const k of ['blink','autoDirection']as const)get<HTMLInputElement>('look-'+k).checked=research.preview[k];
 get<HTMLSelectElement>('look-compare').value=research.baseline?'baseline':'draft';
}
export function applyLookDocument(value:unknown){const d=validateDocument(value);research.values=d.values;research.preview=d.preview;research.baseline=false;get<HTMLInputElement>('look-name').value=d.name;seekLook(d.playback.ticks);lookClock.paused=d.playback.paused;refreshLookUI();}
function library():Record<string,LookDocument>{const raw=localStorage.getItem(storageKey);if(!raw)return Object.create(null);const v=JSON.parse(raw);if(!v||typeof v!=='object'||Array.isArray(v))throw Error('保存領域の形式が不正です。上書きしません');return Object.assign(Object.create(null),v);}
function list(){const names=Object.keys(library());const sel=get<HTMLSelectElement>('look-saved');sel.replaceChildren(...names.map(n=>{const o=document.createElement('option');o.value=o.textContent=n;return o;}));}
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
 <details open><summary>角度・待機・輪郭</summary>${ranges}<label><input id="look-mouth" type="checkbox">口を表示（基準は口なし）</label><button class="btn ghost" data-look-reset="mouth">口を初期値へ</button><label>キャラの線の色<input id="look-outlineColor" type="color"></label><button class="btn ghost" data-look-reset="outlineColor">線の色を初期値へ</button></details>
 <div id="look-face-editor"></div>
 <details><summary>名前付き保存・コピー・貼り付け</summary><label>設定名<input id="look-name" value="研究設定" maxlength="60"></label><button class="btn" id="look-save">端末内へ保存</button><label>保存済み<select id="look-saved"></select></label><button class="btn ghost" id="look-load">選択した設定を復元</button><button class="btn ghost" id="look-copy">設定をコピー</button><label>コピー内容／復元する設定<textarea id="look-json" rows="5"></textarea></label><button class="btn ghost" id="look-paste">貼り付けた設定を復元</button></details><p id="look-message" role="status"></p>`;
 document.querySelector('.panel')!.prepend(panel);
 get('look-open').addEventListener('click',()=>{enterLook();refreshLookUI();safe(list);});
 for(const [k,[min,max]]of Object.entries(limits))for(const suffix of ['','-number'])get('look-'+k+suffix).addEventListener('input',e=>{
  const value=Number((e.target as HTMLInputElement).value);if(!Number.isFinite(value)||value<min||value>max){message(`${labels[k]}は${min}〜${max}です`);return;}
  (research.values as any)[k]=value;refreshLookUI();
 });
 panel.querySelectorAll<HTMLButtonElement>('[data-look-reset]').forEach(b=>b.onclick=()=>{const k=b.dataset.lookReset as keyof LookValues;(research.values as any)[k]=clone(BASE[k]);refreshLookUI();});
 get('look-mouth').onchange=()=>{research.values.mouth=get<HTMLInputElement>('look-mouth').checked;};get('look-outlineColor').oninput=()=>{research.values.outlineColor=get<HTMLInputElement>('look-outlineColor').value;};
 for(const k of ['view','background','motion','direction','zoom','light']as const)get('look-'+k).onchange=()=>{(research.preview as any)[k]=['direction','zoom'].includes(k)?Number(get<HTMLSelectElement>('look-'+k).value):get<HTMLSelectElement>('look-'+k).value;if(k==='motion')resetLook();};
 for(const k of ['blink','autoDirection']as const)get('look-'+k).onchange=()=>{research.preview[k]=get<HTMLInputElement>('look-'+k).checked;if(k==='blink'){import('../character/expression').then(({expr})=>{expr.seq=[];expr.autoBlink=research.preview.blink;});}};
 get('look-compare').onchange=()=>{research.baseline=get<HTMLSelectElement>('look-compare').value==='baseline';};
 get('look-play').onclick=()=>{lookClock.paused=!lookClock.paused;};get('look-step').onclick=stepLook;get('look-reset-time').onclick=resetLook;get('look-exit').onclick=exitLook;
 get('look-save').onclick=()=>safe(()=>{const d=validateDocument(lookDocument()),all=library();if(Object.keys(all).length>=30&&!all[d.name])throw Error('保存は30件までです');all[d.name]=d;localStorage.setItem(storageKey,JSON.stringify(all));list();get<HTMLSelectElement>('look-saved').value=d.name;message('端末内へ保存しました');});
 get('look-load').onclick=()=>safe(()=>{const d=library()[get<HTMLSelectElement>('look-saved').value];if(!d)throw Error('保存済み設定を選んでください');applyLookDocument(d);message('設定を復元しました');});
 get('look-paste').onclick=()=>safe(()=>{const text=get<HTMLTextAreaElement>('look-json').value;if(text.length>150000)throw Error('設定が大きすぎます');applyLookDocument(JSON.parse(text));message('貼り付けた設定を復元しました');});
 get('look-copy').onclick=async()=>{try{const text=JSON.stringify(validateDocument(lookDocument()),null,2);get<HTMLTextAreaElement>('look-json').value=text;await navigator.clipboard.writeText(text);message('設定をコピーしました');}catch(e){message('コピーできませんでした。内容欄を長押しして手動コピーできます。'+(e as Error).message);}};
 refreshLookUI();if(new URLSearchParams(location.search).get('study')==='look'){enterLook();refreshLookUI();safe(list);}
}
