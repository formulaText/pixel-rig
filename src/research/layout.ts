import {research} from './model';
import {lookClock} from './runtime';
import {refreshSaveState} from './ui';
const $=(id:string)=>document.getElementById(id)!;
function take(id:string){const e=$(id);return e.closest('label')||e;}
function group(parent:HTMLElement,id:string,label:string){const e=document.createElement('section');e.id=id;e.className='look-category';e.innerHTML=`<h2>${label}</h2>`;parent.append(e);return e;}
function sub(parent:HTMLElement,label:string){const e=document.createElement('section');e.className='look-subsection';e.innerHTML=`<h3>${label}</h3>`;parent.append(e);return e;}
function append(parent:HTMLElement,...ids:string[]){for(const id of ids)parent.append(take(id));}
function moveRange(parent:HTMLElement,key:string){const range=$('look-'+key).closest('.look-range')!;const label=document.querySelector(`label[for="look-${key}"]`);if(label)parent.append(label);parent.append(range);}
function faceField(parent:HTMLElement,path:string){const input=document.querySelector<HTMLInputElement>(`[data-face-value="${path}"]`)!;parent.append(input.closest('label')!);const reset=document.querySelector(`[data-face-reset="${path}"]`);if(reset&&!parent.contains(reset))parent.append(reset);}
function choices(id:string){const select=$(id) as HTMLSelectElement;if(select.dataset.buttons)return;select.dataset.buttons='true';select.classList.add('choice-source');select.setAttribute('aria-hidden','true');select.tabIndex=-1;const wrap=document.createElement('div');wrap.className='look-choices';wrap.dataset.choiceFor=id;wrap.setAttribute('role','group');wrap.setAttribute('aria-label',select.closest('label')?.firstChild?.textContent||id);
 for(const o of select.options){const b=document.createElement('button');b.type='button';b.className='btn ghost';b.dataset.choice=o.value;b.textContent=o.text;b.onclick=()=>{select.value=o.value;select.dispatchEvent(new Event('change',{bubbles:true}));sync();};wrap.append(b);}select.after(wrap);}
function sync(){
 for(const wrap of document.querySelectorAll<HTMLElement>('[data-choice-for]')){const select=$(wrap.dataset.choiceFor!) as HTMLSelectElement;for(const b of wrap.querySelectorAll<HTMLButtonElement>('button')){b.setAttribute('aria-pressed',String(b.dataset.choice===select.value));const option=[...select.options].find(o=>o.value===b.dataset.choice);b.disabled=!!option?.disabled;}}
 for(const b of document.querySelectorAll<HTMLButtonElement>('[data-direction]'))b.setAttribute('aria-pressed',String(!research.preview.autoDirection&&Number(b.dataset.direction)===research.preview.direction));
 if(!$('look-dock-play'))return;
 $('look-dock-compare').textContent=research.baseline?'基準を表示中':'調整中を表示中';$('look-dock-compare').setAttribute('aria-pressed',String(research.baseline));
 $('look-dock-view').textContent=research.preview.view==='dot'?'表示：ドット':'表示：3D';$('look-dock-view').setAttribute('aria-pressed',String(research.preview.view==='3d'));
 $('look-dock-play').textContent=lookClock.paused?'▶ 再生する':'Ⅱ 停止する';$('look-dock-play').setAttribute('aria-pressed',String(!lookClock.paused));
 $('look-direction-state').textContent=research.preview.autoDirection?'自動回転中（2秒ごと）':`固定：${($('look-direction') as HTMLSelectElement).selectedOptions[0].text}`;
 refreshSaveState();
}
export function organizeLookUI(){
 const panel=$('look-panel');const whole=group(panel,'look-whole','全体'),head=group(panel,'look-head','頭'),face=group(panel,'look-face','顔'),hair=group(panel,'look-hair','髪'),motion=group(panel,'look-body','胴体・動き'),draw=group(panel,'look-draw','描画');
 // Saving is a complete research document, not a face preset or an image export.
 const saves=$('look-name').closest('details')!;saves.open=true;saves.querySelector('summary')!.textContent='この端末のブラウザに保存';whole.append(saves);
 const note=document.createElement('p');note.className='note';note.textContent='顔の絵柄・配置、頭、動き、線、表示条件と保存時の再生位置を保存します。画像やファイルの書き出しではありません。';saves.insertBefore(note,saves.children[1]);
 $('look-save').textContent='この名前で保存';$('look-load').textContent='選んだ設定を復元';$('look-copy').textContent='設定をコピー';$('look-paste').textContent='貼り付けから復元';
 for(const id of ['look-save','look-load','look-paste','look-copy'])$(id).dataset.saveAction='true';
 const transfer=document.createElement('details');transfer.innerHTML='<summary>設定コピー・貼り付け（文字データ）</summary>';saves.append(transfer);append(transfer,'look-copy','look-json','look-paste');
 $('face-duplicate').textContent='現在の設定を別名で保存';saves.append($('face-duplicate'));$('face-duplicate').dataset.saveAction='true';$('face-duplicate').onclick=()=>{const name=$('look-name')as HTMLInputElement;name.value=(name.value.slice(0,40)+' のコピー '+new Date().toLocaleTimeString('ja-JP',{hour12:false})).slice(0,60);$('look-save').click();};
 append(whole,'look-compare','look-view','look-background');
 const direction=sub(whole,'向き');const compass=document.createElement('div');compass.className='direction-compass';const order=[3,4,5,2,-1,6,1,0,7];const arrows=['↓','↙','←','↖','↑','↗','→','↘'];for(const n of order){const b=document.createElement(n<0?'span':'button');if(n<0)b.textContent='キャラ';else{b.textContent=arrows[n];b.className='btn ghost';b.dataset.direction=String(n);b.setAttribute('aria-label',($('look-direction')as HTMLSelectElement).options[n].text);b.onclick=()=>{const a=$('look-autoDirection')as HTMLInputElement;a.checked=false;a.dispatchEvent(new Event('change',{bubbles:true}));const select=$('look-direction')as HTMLSelectElement;select.value=String(n);select.dispatchEvent(new Event('change',{bubbles:true}));sync();};}compass.append(b);}direction.append(compass);append(direction,'look-direction','look-autoDirection');$('look-direction').classList.add('choice-source');const directionState=document.createElement('p');directionState.id='look-direction-state';direction.append(directionState);
 append(head,'face-head-shape');head.append(document.querySelector('[data-face-reset="head.shape"]')!);faceField(head,'head.size');moveRange(head,'headTilt');append(head,'face-reset');$('face-reset').textContent='顔・頭を基準に戻す';
 const faceAll=sub(face,'全体配置');append(faceAll,'face-preset','face-preset-use','face-legacy');$('face-preset-use').textContent='この顔をコピーして編集';for(const path of ['width','height','x','y'])faceField(faceAll,'face.region.'+path);
 const brows=sub(face,'眉');faceField(brows,'face.linkBrows');append(brows,'face-expression');
 const eyes=sub(face,'目・ハイライト');faceField(eyes,'face.linkEyes');append(eyes,'look-blink','face-eye-state','face-blink-mode');
 const nose=sub(face,'鼻の基準位置');for(const path of ['x','y'])faceField(nose,'face.nose.'+path);
 const mouth=sub(face,'口');append(mouth,'look-mouth','face-mouth-open');mouth.append(document.querySelector('[data-look-reset="mouth"]')!);
 for(const [host,part]of [[brows,'brows'],[eyes,'eyes'],[nose,'extra'],[mouth,'mouth']]as const){const b=document.createElement('button');b.className='btn ghost';b.textContent=part==='extra'?'鼻・そばかすを描く':'配置・絵柄を編集';b.onclick=()=>{const select=$('face-part')as HTMLSelectElement;select.value=part;select.dispatchEvent(new Event('change',{bubbles:true}));$('face-workbench').scrollIntoView({block:'start',behavior:'smooth'});};host.append(b);}
 const edit=sub(face,'選択した部位を編集');edit.id='face-workbench';append(edit,'face-part','face-side','face-layer');faceField(edit,'face.mirrorArtwork');append(edit,'face-grid','face-grid-info');const paint=$('face-pen').parentElement!;edit.append(paint);append(edit,'face-color','face-palette','face-part-fields','face-message');
 append(hair,'face-hair');const hairNote=document.createElement('p');hairNote.className='note';hairNote.textContent='髪を隠す表示は顔の確認用です。髪型の編集はまだありません。';hair.append(hairNote);
 append(motion,'look-time','look-motion','look-play','look-step','look-reset-time');for(const key of ['headIdle','bodyIdle','idleSpeed'])moveRange(motion,key);
 append(draw,'look-light','look-zoom','look-outlineColor');draw.append(document.querySelector('[data-look-reset="outlineColor"]')!);moveRange(draw,'outerOpacity');append(draw,'look-innerOutlineColor');draw.append(document.querySelector('[data-look-reset="innerOutlineColor"]')!);moveRange(draw,'innerOpacity');
 const performance=$('look-measure').closest('details')!;draw.append(performance);append(draw,'look-exit','look-message');
 // Remove the old empty scaffolding only; controls and their handlers were moved.
 for(const child of [...panel.children])if(!child.classList.contains('look-category'))child.remove();
 for(const id of ['look-compare','look-view','look-motion','look-background','look-light','look-zoom','face-head-shape','face-preset','face-part','face-side','face-layer','face-eye-state','face-blink-mode','face-expression'])choices(id);
 // Stable toolbar has its own layout row, so it never paints over the character.
 const stage=$('stage'),column=document.createElement('div');column.className='look-preview-column';stage.before(column);column.append(stage);const dock=document.querySelector('.look-dock')as HTMLElement;column.append(dock);dock.innerHTML='<div class="look-toolbar-buttons"></div><div class="look-save-row"><span id="look-save-state" role="status">未保存の変更あり</span><button class="btn" id="look-dock-save" data-save-action>保存</button></div><p id="look-operation-result" role="status"></p>';
 const toolbar=dock.querySelector('.look-toolbar-buttons')!;for(const [id,label]of [['compare','基準'],['view','表示'],['play','再生']]){const b=document.createElement('button');b.id='look-dock-'+id;b.className='btn ghost';b.textContent=label;b.onclick=()=>{if(id==='play')$('look-play').click();else{const e=$('look-'+(id==='compare'?'compare':'view'))as HTMLSelectElement;e.value=id==='compare'?(research.baseline?'draft':'baseline'):(research.preview.view==='dot'?'3d':'dot');e.dispatchEvent(new Event('change',{bubbles:true}));}sync();};toolbar.append(b);}
 $('look-dock-save').onclick=()=>$('look-save').click();$('look-operation-result').textContent=$('look-message').textContent;
 document.addEventListener('input',()=>queueMicrotask(sync));document.addEventListener('change',()=>queueMicrotask(sync));document.addEventListener('click',()=>queueMicrotask(sync));document.addEventListener('pointerup',()=>queueMicrotask(sync));window.addEventListener('look-controls-refreshed',sync);window.addEventListener('look-restored',sync);
 document.addEventListener('pointerdown',e=>{const b=(e.target as HTMLElement).closest('button');if(b)b.classList.add('is-pressed');});for(const event of ['pointerup','pointercancel'])document.addEventListener(event,()=>document.querySelectorAll('.is-pressed').forEach(e=>e.classList.remove('is-pressed')));
 // Playback can change without a DOM input (e.g. measurement ending).
 setInterval(()=>{if(research.active)sync();},500);sync();window.dispatchEvent(new Event('resize'));
}
