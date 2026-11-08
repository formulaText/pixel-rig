import {research,BASE,clone,validateDocument} from './model';
import {facePreset,originalFace,syncSide,FACE_W,FACE_H,type Bitmap,type Part,type Eye,type Brow,type Side} from './face-data';
import {dirtyFace,faceCanvas} from './face-render';
import {refreshLookUI,lookDocument} from './ui';
import {expr} from '../character/expression';
const $=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id)as T;
let part='eyes',side:Side='left',layer='normal',tool='pen',color='#241a38',history:string[]=[],future:string[]=[];
let beforeStroke='',painting=false,lastCell='';
const current=()=>part==='extra'?null:part==='mouth'?research.values.face.mouth:research.values.face[part as 'eyes'|'brows'][side];
const bitmap=():Bitmap=>{const f=research.values.face,p=current();return part==='extra'?f.extra:part==='eyes'&&layer==='closed'?(p as Eye).closed:part==='mouth'&&layer==='open'?f.mouth.open:p!.image;};
function snapshot(){return JSON.stringify(research.values);}
function remember(old:string){if(old!==snapshot()){history.push(old);if(history.length>60)history.shift();future=[];}}
function changed(){research.values.face.legacy=false;dirtyFace();updateEditor();}
function message(s:string){$('face-message').textContent=s;}
function mutate(fn:()=>void,activate=true,refreshFields=true){const old=snapshot();try{fn();if(activate)research.values.face.legacy=false;validateDocument(lookDocument());remember(old);dirtyFace();updateEditor();}catch(e){research.values=JSON.parse(old);message((e as Error).message);}if(refreshFields)refresh();}
function valueAt(path:string){return path.split('.').reduce((o:any,k)=>o[k],research.values);}
function put(path:string,value:any){const keys=path.split('.'),last=keys.pop()!;const o=keys.reduce((a:any,k)=>a[k],research.values);o[last]=value;}
function baseAt(path:string){return path.split('.').reduce((o:any,k)=>o[k],BASE);}
function num(path:string,label:string,min:number,max:number,step:number){return `<label>${label}<div class="look-range"><input type="range" data-face-value="${path}" min="${min}" max="${max}" step="${step}"><input type="number" aria-label="${label}" data-face-value="${path}" min="${min}" max="${max}" step="${step}"><button type="button" class="btn ghost" data-face-reset="${path}">初期値</button></div></label>`;}
function check(path:string,label:string){return `<label><input type="checkbox" data-face-value="${path}">${label}</label><button class="btn ghost" data-face-reset="${path}">初期値</button>`;}
function bindFields(root:HTMLElement){
 root.querySelectorAll<HTMLInputElement>('[data-face-value]').forEach(e=>{const path=e.dataset.faceValue!;if(e.type==='checkbox')e.checked=valueAt(path);else e.value=String(valueAt(path));e.onchange=()=>mutate(()=>{put(path,e.type==='checkbox'?e.checked:e.valueAsNumber);if(part==='eyes'||part==='brows'){const prefix=`face.${part}.${side}.`;if(path.startsWith(prefix)&&!path.startsWith(prefix+'highlight.'))syncSide(research.values.face,part,side);}},!path.startsWith('head.')&&!path.startsWith('face.nose.')&&!['face.linkEyes','face.linkBrows','face.mirrorArtwork'].includes(path));});
 root.querySelectorAll<HTMLInputElement>('input[type=range][data-face-value]').forEach(e=>{e.oninput=()=>{const path=e.dataset.faceValue!;mutate(()=>{put(path,e.valueAsNumber);if((part==='eyes'||part==='brows')&&path.startsWith(`face.${part}.${side}.`)&&!path.includes('.highlight.'))syncSide(research.values.face,part,side);},!path.startsWith('head.')&&!path.startsWith('face.nose.'),false);root.querySelectorAll<HTMLInputElement>('[data-face-value]').forEach(pair=>{if(pair.dataset.faceValue===path)pair.value=String(valueAt(path));});};});
 root.querySelectorAll<HTMLButtonElement>('[data-face-reset]').forEach(b=>b.onclick=()=>mutate(()=>{const path=b.dataset.faceReset!;put(path,clone(baseAt(path)));if(path.startsWith(`face.${part}.${side}.`)&&!path.includes('.highlight.')&&(part==='eyes'||part==='brows'))syncSide(research.values.face,part,side);},!b.dataset.faceReset!.startsWith('head.')&&!b.dataset.faceReset!.startsWith('face.nose.')&&!['face.linkEyes','face.linkBrows','face.mirrorArtwork'].includes(b.dataset.faceReset!)));
}
function fields(){
 const p=current(),prefix=part==='mouth'?'face.mouth':`face.${part}.${side}`;
 let html='';if(p){for(const [k,l,max]of [['x','配置範囲の横位置',1],['y','配置範囲の縦位置',1],['w','配置範囲の幅',.5],['h','配置範囲の高さ',.5]]as const)html+=num(prefix+'.rect.'+k,l,k==='w'||k==='h'?1/48:0,max,1/96);
 html+=num(prefix+'.imageScale','絵柄の拡大率（配置範囲は維持）',.5,2,.05);}
 if(part==='eyes'){
 html+=num(prefix+'.closeAt','閉じる基準位置（目の上端0・下端1）',0,1,.05)+num(prefix+'.minHeight','閉じ目の最小高さ（顔に対する比）',1/24,.2,1/96);
 html+=check(prefix+'.highlight.show','ハイライトを表示')+check(prefix+'.highlight.hideClosed','閉じ目・半目ではハイライトを隠す');
 for(const [k,label]of [['x','横位置'],['y','縦位置'],['w','幅'],['h','高さ'],['opacity','不透明度']])html+=num(prefix+'.highlight.'+k,'ハイライトの'+label,0,1,.05);
 html+='<button class="btn ghost" id="face-copy-highlight">反対の目にも同じ側のハイライト</button>';
 }
 if(part==='brows'){html+=check(prefix+'.neutralVisible','通常表情でも眉を表示');const ex=research.preview.expression;html+=num(prefix+'.expressions.'+ex+'.dy','選択中の表情：眉の上下移動',-.15,.15,.01)+num(prefix+'.expressions.'+ex+'.angle','選択中の表情：眉の角度',-35,35,1);}
 $('face-part-fields').innerHTML=html;bindFields($('face-part-fields'));
 if(part==='eyes')$('face-copy-highlight').onclick=()=>mutate(()=>{const f=research.values.face;f.eyes[side==='left'?'right':'left'].highlight=clone(f.eyes[side].highlight);});
}
function refresh(){
 $('face-legacy').textContent=research.values.face.legacy?'現在の顔を元の方式で再現中。編集すると頭表面への適用へ切り替わります。':'編集顔を頭表面へ適用中。髪は深度に従って顔を隠します。';
 $('face-undo').toggleAttribute('disabled',history.length===0);$('face-redo').toggleAttribute('disabled',future.length===0);
 for(const key of ['shape'])$<HTMLSelectElement>('face-head-'+key).value=research.values.head.shape;
 $<HTMLSelectElement>('face-blink-mode').value=research.values.face.blinkMode;
 $<HTMLSelectElement>('face-eye-state').value=research.preview.eyes;$<HTMLSelectElement>('face-expression').value=research.preview.expression;
 $<HTMLInputElement>('face-hair').checked=research.preview.hair;$<HTMLInputElement>('face-mouth-open').checked=research.preview.mouthOpen;
 bindFields($('face-general'));fields();updateEditor();refreshLookUI();
}
function updateEditor(){
 const canvas=$<HTMLCanvasElement>('face-grid'),g=canvas.getContext('2d')!;g.clearRect(0,0,320,240);g.fillStyle='#d8b69c';g.fillRect(0,0,320,240);
 g.imageSmoothingEnabled=false;const f=research.values.face;const eye=layer==='closed'?2:0;
 g.drawImage(faceCanvas(f,eye,research.values.mouth,layer==='open',research.preview.expression),0,0,320,240);
 g.strokeStyle='#0003';g.lineWidth=1;for(let x=0;x<=32;x++){g.beginPath();g.moveTo(x*10+.5,0);g.lineTo(x*10+.5,240);g.stroke();}for(let y=0;y<=24;y++){g.beginPath();g.moveTo(0,y*10+.5);g.lineTo(320,y*10+.5);g.stroke();}
 const p=current();if(p){g.strokeStyle='#663bdb';g.lineWidth=2;g.strokeRect(p.rect.x*320,p.rect.y*240,p.rect.w*320,p.rect.h*240);}
 g.strokeStyle='#088';g.beginPath();g.moveTo(f.nose.x*320-5,f.nose.y*240);g.lineTo(f.nose.x*320+5,f.nose.y*240);g.moveTo(f.nose.x*320,f.nose.y*240-5);g.lineTo(f.nose.x*320,f.nose.y*240+5);g.stroke();
 $('face-grid-info').textContent=`32×24 共通格子 · ${part==='extra'?'追加描画':part==='eyes'?'目':part==='brows'?'眉':'口'} ${side==='left'?'本人の左':'本人の右'} · 元絵柄 ${bitmap()[0].length}×${bitmap().length}。紫の範囲／鼻の十字は編集ガイドです。`;
}
function paint(e:PointerEvent){
 const c=$<HTMLCanvasElement>('face-grid'),r=c.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width,ny=(e.clientY-r.top)/r.height,p=current(),b=bitmap();
 const rect=p?.rect||{x:0,y:0,w:1,h:1},scale=p?.imageScale||1;
 if(nx<rect.x||ny<rect.y||nx>=rect.x+rect.w||ny>=rect.y+rect.h)return;
 const x=Math.floor((((nx-rect.x)/rect.w-.5)/scale+.5)*b[0].length),y=Math.floor((((ny-rect.y)/rect.h-.5)/scale+.5)*b.length);if(x<0||y<0||x>=b[0].length||y>=b.length)return;
 const key=x+','+y;if(key===lastCell)return;const previous=lastCell?lastCell.split(',').map(Number):[x,y],steps=Math.max(Math.abs(x-previous[0]),Math.abs(y-previous[1]));for(let n=0;n<=steps;n++){const t=steps?n/steps:0,px=Math.round(previous[0]+(x-previous[0])*t),py=Math.round(previous[1]+(y-previous[1])*t);b[py][px]=tool==='erase'?'':color;}lastCell=key;
 if(part==='brows')(current() as Brow).neutralVisible=true;
 if(part==='eyes'||part==='brows')syncSide(research.values.face,part,side,true);changed();
}
export function bindFaceEditor(){
 $('look-face-editor').innerHTML=`<details open><summary>顔・頭の研究</summary><p id="face-legacy" class="note"></p>
 <label>顔プリセット<select id="face-preset"><option value="original">現在の顔（基準）</option><option value="small">小さな目・少ない情報</option><option value="expressive">眉と頬のある顔</option></select></label><button class="btn" id="face-preset-use">複製して調整中へ</button><button class="btn ghost" id="face-duplicate">今の研究設定を複製</button><button class="btn ghost" id="face-reset">顔・頭を初期値へ</button>
 <div id="face-general"><label>頭形状<select id="face-head-shape"><option value="original">現在の球形</option><option value="round">横に少し丸い形</option><option value="cylinder">角を丸めた円柱形</option></select></label><button class="btn ghost" data-face-reset="head.shape">頭形状を初期値へ</button>${num('head.size','頭の大きさ（倍）',.9,1.1,.01)}${num('face.region.width','頭に対する顔領域の幅',.5,1,.01)}${num('face.region.height','頭に対する顔領域の高さ',.4,.85,.01)}${num('face.region.x','顔全体の横位置（本人の左が＋）',-.15,.15,.01)}${num('face.region.y','顔全体の縦位置（上が＋）',-.15,.15,.01)}
 ${check('face.linkEyes','目の配置を左右連動')}${check('face.linkBrows','眉の配置を左右連動')}${check('face.mirrorArtwork','連動して描く絵柄を左右反転（配置対称とは別）')}
 ${num('face.nose.x','鼻の基準・横位置（ガイドのみ）',0,1,1/32)}${num('face.nose.y','鼻の基準・縦位置（ガイドのみ）',0,1,1/24)}</div>
 <label><input id="face-hair" type="checkbox" checked>髪を表示（非表示は診断用）</label>
 <label>閉じ目の方式<select id="face-blink-mode"><option value="image">専用の閉じ目画像</option><option value="shrink">通常の目を縦に縮める</option></select></label>
 <label>目の表示<select id="face-eye-state"><option value="auto">まばたき設定に従う</option><option value="open">開いた目を固定</option><option value="closed">閉じた目を固定</option></select></label><label><input type="checkbox" id="face-mouth-open">開口状態を表示</label>
 <label>眉の比較表情<select id="face-expression"><option value="neutral">通常</option><option value="angry">きりっと</option><option value="sad">困り眉</option></select></label>
 <p>左右はキャラクター本人から見た左右です。配置の連動とハイライトは独立です。鼻・そばかすは「追加描画」に描くと、まばたきの変形を受けません。</p>
 <label>編集する部位<select id="face-part"><option value="eyes">目</option><option value="brows">眉</option><option value="mouth">口</option><option value="extra">追加描画（鼻・そばかす）</option></select></label><label>左右<select id="face-side"><option value="left">本人の左</option><option value="right">本人の右</option></select></label><label>編集する絵柄<select id="face-layer"><option value="normal">通常</option><option value="closed">閉じ目（目）</option><option value="open">開口（口）</option></select></label>
 <div class="validation-actions"><button class="btn" id="face-pen">描く</button><button class="btn ghost" id="face-erase">消しゴム</button><button class="btn ghost" id="face-undo">元に戻す</button><button class="btn ghost" id="face-redo">やり直す</button></div><label>描く色<input type="color" id="face-color" value="#241a38"></label><div id="face-palette"></div>
 <canvas id="face-grid" width="320" height="240" aria-label="顔のドット編集格子"></canvas><p class="note" id="face-grid-info"></p><p class="note">格子内は描画操作、格子の外はスクロールです。配置範囲を変えても元の絵柄は保持します。保存・コピーは下の研究設定に顔も含みます。</p>
 <details><summary>選択した部位の配置・絵柄・閉じ目・ハイライト</summary><div id="face-part-fields"></div></details><p id="face-message" role="status"></p></details>`;
  // Selecting the unedited original explicitly retains its original renderer.
 $('face-preset-use').onclick=()=>{const old=snapshot();research.values.face=facePreset($<HTMLSelectElement>('face-preset').value);remember(old);dirtyFace();refresh();};
 $('face-duplicate').onclick=()=>{const name=$<HTMLInputElement>('look-name');research.values=clone(research.values);name.value=(name.value+' の複製').slice(0,60);message('研究設定を複製しました。名前付き保存で別に残せます');dirtyFace();refresh();};
 $('face-reset').onclick=()=>{const old=snapshot();research.values.face=originalFace();research.values.head=clone(BASE.head);remember(old);dirtyFace();refresh();};
 $('face-head-shape').onchange=()=>{const old=snapshot();research.values.head.shape=$<HTMLSelectElement>('face-head-shape').value as any;remember(old);refresh();};
 for(const id of ['part','side','layer'])$('face-'+id).onchange=()=>{part=$<HTMLSelectElement>('face-part').value;side=$<HTMLSelectElement>('face-side').value as Side;layer=$<HTMLSelectElement>('face-layer').value;fields();updateEditor();};
 $('face-blink-mode').onchange=()=>mutate(()=>research.values.face.blinkMode=$<HTMLSelectElement>('face-blink-mode').value as any);
 $('face-eye-state').onchange=()=>{research.preview.eyes=$<HTMLSelectElement>('face-eye-state').value as any;expr.seq=[];};
 $('face-expression').onchange=()=>{research.preview.expression=$<HTMLSelectElement>('face-expression').value as any;if(research.preview.expression!=='neutral'){research.values.face.legacy=false;dirtyFace();}refresh();};
 $('face-hair').onchange=()=>research.preview.hair=$<HTMLInputElement>('face-hair').checked;
 $('face-mouth-open').onchange=()=>{research.preview.mouthOpen=$<HTMLInputElement>('face-mouth-open').checked;research.values.face.legacy=false;dirtyFace();refresh();};
 $('face-pen').onclick=()=>{tool='pen';message('描く：選択した部位の範囲をなぞってください');};$('face-erase').onclick=()=>{tool='erase';message('消しゴム：選択した部位の範囲をなぞってください');};
 $('face-color').oninput=()=>color=$<HTMLInputElement>('face-color').value;
 for(const c of ['#241a38','#3f5aa6','#fffaf0','#bd7054','#c64747']){const b=document.createElement('button');b.className='face-swatch';b.style.background=c;b.setAttribute('aria-label','色 '+c);b.onclick=()=>{color=c;$<HTMLInputElement>('face-color').value=c;};$('face-palette').append(b);}
 const grid=$<HTMLCanvasElement>('face-grid');grid.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();beforeStroke=snapshot();painting=true;lastCell='';grid.setPointerCapture(e.pointerId);paint(e);};grid.onpointermove=e=>{if(painting){e.preventDefault();paint(e);}};
 const end=()=>{if(painting){painting=false;remember(beforeStroke);refresh();}};grid.onpointerup=end;grid.onpointercancel=end;grid.onlostpointercapture=end;
 $('face-undo').onclick=()=>{if(history.length){future.push(snapshot());research.values=JSON.parse(history.pop()!);dirtyFace();refresh();}};$('face-redo').onclick=()=>{if(future.length){history.push(snapshot());research.values=JSON.parse(future.pop()!);dirtyFace();refresh();}};
 window.addEventListener('look-restored',()=>{history=[];future=[];dirtyFace();refresh();});refresh();
}
