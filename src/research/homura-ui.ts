import {BASE,research,clone,validateDocument,type LookValues} from './model';
import {homuraLook,HOMURA_NAME} from './look-presets';
import {lookDocument,applyLookDocument,refreshLookUI} from './ui';
import {dirtyFace} from './face-render';
import {resetLook} from './runtime';
const $=(id:string)=>document.getElementById(id)!;
function section(parent:HTMLElement,title:string){const e=document.createElement('section');e.className='look-subsection';e.innerHTML=`<h3>${title}</h3>`;parent.append(e);return e;}
export function bindHomuraUI(){
 const whole=$('look-whole'),presets=section(whole,'ルック候補（設定一式）');whole.insertBefore(presets,whole.children[1]);
 presets.innerHTML+='<p id="look-preset-state" role="status"></p><button class="btn" id="look-preset-homura">ほむら・ルック候補01を開く</button><button class="btn ghost" id="look-preset-base">調整中を基準の設定に戻す</button><p class="note">現在の調整欄を置き換えます。残したい調整は先に保存・コピーしてください。基準・保存済み一覧・通常のキャラクターは変わりません。</p>';
 const use=(values:LookValues)=>{const d=lookDocument();d.values=values;d.name=values.presetName;d.preview={...d.preview,direction:0,autoDirection:false,light:'day',lightSite:'default',motion:'idle',hair:true,eyes:'auto'};d.playback={ticks:0,paused:true};applyLookDocument(d);};
 $('look-preset-homura').onclick=()=>use(homuraLook());$('look-preset-base').onclick=()=>use(clone(BASE));
 function changed(){dirtyFace();refreshLookUI();sync();}
 const controls:Array<()=>void>=[];
 function options(host:HTMLElement,key:keyof LookValues,label:string,items:[string,string][]){const box=section(host,label);box.classList.add('homura-options');const buttons=items.map(([value,text])=>{const b=document.createElement('button');b.className='btn ghost';b.id='look-'+key+'-'+value;b.textContent=text;b.onclick=()=>{(research.values as any)[key]=value;changed();};box.append(b);return {b,value};});controls.push(()=>buttons.forEach(({b,value})=>b.setAttribute('aria-pressed',String(research.values[key]===value))));return box;}
 function number(host:HTMLElement,key:'highlightOpacity'|'highlightLight'|'browGap',label:string,min:number,max:number,step:number,scale=1){const box=section(host,label),row=document.createElement('div');row.className='look-range';box.append(row);const inputs=['range','number'].map(type=>{const e=document.createElement('input');e.id='look-'+key+(type==='number'?'-number':'');e.type=type;e.min=String(min);e.max=String(max);e.step=String(step);e.setAttribute('aria-label',label);e.oninput=()=>{const n=e.valueAsNumber;if(!Number.isFinite(n)||n<min||n>max)return;research.values[key]=n/scale;changed();};row.append(e);return e;});const reset=document.createElement('button');reset.className='btn ghost';reset.textContent='初期値';reset.onclick=()=>{research.values[key]=BASE[key];changed();};row.append(reset);controls.push(()=>inputs.forEach(e=>e.value=String(research.values[key]*scale)));}
 options($('look-head'),'headTiltScope','頭を上げる方向',[['front','正面だけ'],['all','全方向（従来）']]);
 const body=$('look-body');options(body,'idleMotion','待機の動き',[['current','現在の待機'],['none','待機の動きなし']]);const n=document.createElement('p');n.className='note';n.textContent='待機なしでは頭・胴体・腕・手・裾を固定。歩行とまばたきは別設定です。';body.append(n);
 const hair=$('look-hair');options(hair,'hairStyle','髪と目の関係',[['original','従来の髪'],['eyes-visible','正面の目を見せる（候補）'],['intentional-cover','目を隠す意図あり（従来形状）']]);options(hair,'frontFringe','正面の前髪の待機',[['follow','頭の待機に連動'],['still','固定（頭の待機も止める）']]);
 const hn=document.createElement('p');hn.className='note';hn.textContent='現行の前髪に独立した揺れはありません。固定は正面の頭の待機を抑えます。歩行時は頭に接続したままです。目を見せる候補は髪全体の位置と前髪の長さを調整し、全方向で同じ形を使います。';hair.append(hn);
 const face=$('look-face');const group=(name:string)=>[...face.querySelectorAll<HTMLElement>('.look-subsection')].find(e=>e.querySelector('h3')?.textContent===name)!;
 const brow=group('眉');options(brow,'browMode','眉の描き方',[['original','従来の眉'],['front-overlay','正面で髪の上（眉だけ）']]);number(brow,'browGap','眉を目へ近づける（顔に対する比・＋で下へ）',-.1,.1,.01);
 const bn=document.createElement('p');bn.className='note';bn.textContent='形は「配置・絵柄を編集」で変更。目からの距離とは別です。正面だけ表示し、前景の木などには隠れます。';brow.append(bn);
 const eye=group('目・ハイライト');number(eye,'highlightOpacity','ハイライトの基本不透明度（%）',0,100,5,100);number(eye,'highlightLight','照明による減光の強さ（%）',0,100,5,100);const en=document.createElement('p');en.className='note';en.textContent='左右のハイライト個別の不透明度に、この基本値を掛けます。減光0%は従来、100%は顔の位置・向きと太陽・影・街灯を反映します。';eye.append(en);
 for(const name of ['鼻の基準位置','口']){const item=group(name),details=document.createElement('details');details.innerHTML=`<summary>${name}の詳細</summary>`;item.before(details);details.append(item);}
 const draw=$('look-draw'),light=section(draw,'ハイライトの照明比較');for(const [id,label]of [['day','昼'],['dark','夜の暗がり'],['lamp','夜の照明付近'],['boundary','夜の明暗を移動']]as const){const b=document.createElement('button');b.className='btn ghost';b.id='look-light-scene-'+id;b.textContent=label;b.onclick=()=>{research.preview.light=id==='day'?'day':'night';research.preview.lightSite=id==='day'?'default':id;research.preview.motion=id==='boundary'?'vertical':'idle';research.preview.direction=0;research.preview.autoDirection=false;resetLook();refreshLookUI();sync();};light.append(b);controls.push(()=>b.setAttribute('aria-pressed',String((id==='day'?research.preview.light==='day'&&research.preview.lightSite==='default':research.preview.light==='night'&&research.preview.lightSite===id))));}const ln=document.createElement('p');ln.className='note';ln.textContent='移動は「再生する」で開始。位置・照明・経路は設定コピーにも記録します。';light.append(ln);
 // Move the existing copy button: one operation, visible beside browser save.
 document.querySelector('.look-save-row')!.append($('look-copy'));$('look-copy').classList.remove('ghost');$('look-copy').setAttribute('aria-label','設定をコピー（AIへ渡す・文字データ）');$('look-copy').title='ブラウザ保存とは別に、復元できる設定全文をコピー';
 function sync(){controls.forEach(f=>f());$('look-preset-state').textContent=`元の候補：${research.values.presetName}（調整は未採用）`;}
 window.addEventListener('look-controls-refreshed',sync);window.addEventListener('look-restored',sync);document.addEventListener('input',()=>queueMicrotask(sync));document.addEventListener('click',()=>queueMicrotask(sync));sync();
 if(new URLSearchParams(location.search).get('preset')==='homura-01')use(homuraLook());
}
