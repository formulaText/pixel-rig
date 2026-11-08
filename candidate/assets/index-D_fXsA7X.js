var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=`#fffaf0`,r=e=>JSON.parse(JSON.stringify(e)),i=`#241a38`,a=`#3f5aa6`,o=(e,t)=>Array.from({length:t},()=>Array(e).fill(``));function s(e){return{imageScale:1,rect:{x:e,y:.375,w:.125,h:.25},image:[[i,i],[i,i],[a,a]],closed:[[i,i]],closeAt:.65,minHeight:1/24,highlight:{show:!0,x:.5,y:0,w:.5,h:1/3,opacity:1,hideClosed:!0}}}function c(e){return{imageScale:1,rect:{x:e,y:.25,w:.15625,h:1/12},image:[[i,i]],neutralVisible:!1,expressions:{neutral:{dy:0,angle:0},angry:{dy:.02,angle:20},sad:{dy:-.02,angle:-20}}}}function l(){return{preset:`original`,legacy:!0,region:{width:.82,height:.62,x:0,y:0},linkEyes:!0,linkBrows:!0,mirrorArtwork:!1,eyes:{left:s(.625),right:s(.25)},brows:{left:c(.609375),right:c(.234375)},blinkMode:`image`,mouth:{imageScale:1,rect:{x:.4375,y:.75,w:.125,h:.125},image:[[``,``],[i,i],[``,``]],open:[[i,i],[i,i],[i,i]]},extra:o(32,24),nose:{x:.5,y:.65}}}function u(e){let t=l();if(t.preset=e,e===`original`)return t;if(t.legacy=!1,e===`small`)for(let e of[`left`,`right`])t.eyes[e].rect.w=.09375,t.eyes[e].rect.h=.166667,t.eyes[e].image=[[i],[i]],t.eyes[e].highlight.show=!1;if(e===`expressive`){for(let e of[`left`,`right`])t.eyes[e].rect.h=.291667,t.brows[e].image=[[i,i,i]],t.brows[e].neutralVisible=!0;t.extra[16][9]=`#bd7054`,t.extra[16][22]=`#bd7054`}return f(t,`eyes`,`left`),f(t,`brows`,`left`),t}function d(e){return{...e,x:1-e.x-e.w}}function f(e,t,n,i=!1){if(!(t===`eyes`?e.linkEyes:e.linkBrows))return;let a=n===`left`?`right`:`left`,o=e[t][n],s=e[t][a];if(s.rect=d(o.rect),s.imageScale=o.imageScale,t===`eyes`?(e.eyes[a].closeAt=e.eyes[n].closeAt,e.eyes[a].minHeight=e.eyes[n].minHeight):(e.brows[a].neutralVisible=e.brows[n].neutralVisible,e.brows[a].expressions=r(e.brows[n].expressions)),i&&(s.image=r(o.image),e.mirrorArtwork&&(s.image=s.image.map(e=>e.slice().reverse())),t===`eyes`)){let t=e.eyes[n],i=e.eyes[a];i.closed=r(t.closed),e.mirrorArtwork&&(i.closed=i.closed.map(e=>e.slice().reverse()))}}function p(e){if(!e||typeof e!=`object`||Array.isArray(e))throw Error(`顔設定の構造が不正です`)}function m(e,t,n,r){if(typeof e!=`number`||!Number.isFinite(e)||e<t||e>n)throw Error(`${r} は ${t}〜${n} です`)}function h(e){if(typeof e!=`boolean`)throw Error(`顔の切替値が不正です`)}function g(e,t=16,n=16){if(!Array.isArray(e)||e.length<1||e.length>n||!Array.isArray(e[0])||e[0].length<1||e[0].length>t)throw Error(`絵柄の寸法が不正です`);for(let t of e)if(!Array.isArray(t)||t.length!==e[0].length||t.some(e=>typeof e!=`string`||e!==``&&!/^#[0-9a-f]{6}$/i.test(e)))throw Error(`絵柄は矩形で透明またはRGB色を指定してください`)}function _(e){p(e);for(let t of[`x`,`y`])m(e[t],0,1,`配置位置`);for(let t of[`w`,`h`])m(e[t],1/48,1,`配置範囲`);if(e.x+e.w>1.001||e.y+e.h>1.001)throw Error(`配置範囲は顔の格子内に収めてください`)}function v(e){if(p(e),typeof e.preset!=`string`||e.preset.length>60)throw Error(`顔の名前が不正です`);for(let t of[`legacy`,`linkEyes`,`linkBrows`,`mirrorArtwork`])h(e[t]);if(p(e.region),m(e.region.width,.5,1,`顔の幅`),m(e.region.height,.4,.85,`顔の高さ`),m(e.region.x,-.15,.15,`顔の横位置`),m(e.region.y,-.15,.15,`顔の縦位置`),![`shrink`,`image`].includes(e.blinkMode))throw Error(`閉じ目の方式が不正です`);p(e.eyes),p(e.brows);for(let t of[`left`,`right`]){let n=e.eyes[t],r=e.brows[t];p(n),p(r),_(n.rect),_(r.rect),m(n.imageScale,.5,2,`絵柄の拡大率`),m(r.imageScale,.5,2,`絵柄の拡大率`),g(n.image),g(n.closed),g(r.image),m(n.closeAt,0,1,`閉じる基準位置`),m(n.minHeight,1/24,.2,`閉じ目の最小高さ`),p(n.highlight);for(let e of[`show`,`hideClosed`])h(n.highlight[e]);for(let e of[`x`,`y`,`w`,`h`,`opacity`])m(n.highlight[e],0,1,`ハイライト`);h(r.neutralVisible),p(r.expressions);for(let e of[`neutral`,`angry`,`sad`])p(r.expressions[e]),m(r.expressions[e].dy,-.15,.15,`眉の移動`),m(r.expressions[e].angle,-35,35,`眉の角度`)}if(p(e.mouth),_(e.mouth.rect),m(e.mouth.imageScale,.5,2,`絵柄の拡大率`),g(e.mouth.image),g(e.mouth.open),g(e.extra,32,24),e.extra.length!==24||e.extra[0].length!==32)throw Error(`追加描画領域は32×24です`);p(e.nose),m(e.nose.x,0,1,`鼻の基準`),m(e.nose.y,0,1,`鼻の基準`)}var y={presetName:`基準`,headTiltScope:`all`,idleMotion:`current`,hairStyle:`original`,frontFringe:`follow`,browMode:`original`,browGap:0,highlightOpacity:1,highlightLight:0},b={...y,headTilt:0,headIdle:1,bodyIdle:1,idleSpeed:1,outlineMode:`legacy`,mouth:!1,outlineColor:`#1a0f2b`,innerOutlineColor:`#1a0f2b`,outerOpacity:1,innerOpacity:1,head:{shape:`original`,size:1},face:l()},x={lightSite:`default`,view:`dot`,background:`map`,motion:`idle`,direction:0,autoDirection:!1,blink:!0,zoom:1,light:`day`,hair:!0,eyes:`auto`,mouthOpen:!1,expression:`neutral`},S=e=>JSON.parse(JSON.stringify(e)),C={headTilt:[0,12,.5],headIdle:[0,1.5,.05],bodyIdle:[0,1.5,.05],idleSpeed:[.25,2,.05],outerOpacity:[0,1,.05],innerOpacity:[0,1,.05]};function w(e){if(!e||typeof e!=`object`||Array.isArray(e))throw Error(`設定はオブジェクトで指定してください`)}function T(e){if(w(e),e.schema===1){if(w(e.values),w(e.preview),w(e.values.face),e.values.face.preset!==`original`)throw Error(`工程1の顔設定が不正です`);e=S(e);let t=e;t.schema=2,t.values.face=l(),t.values.innerOutlineColor=t.values.outlineColor,Object.assign(t.preview,{hair:!0,eyes:`auto`,mouthOpen:!1,expression:`neutral`})}if(w(e),e.schema===2&&(e=S(e),w(e),e.schema=3),w(e),e.schema===3&&(e=S(e),w(e),w(e.values),e.schema=4,e.values.outlineMode=`legacy`),w(e),e.schema===4&&(e=S(e),w(e),w(e.values),e.schema=5,Object.assign(e.values,{...y}),w(e.preview),e.preview.lightSite=`default`),w(e),e.schema!==5)throw Error(`未対応のスキーマ版です（対応：1〜4→5移行、5）。元データは変更しません`);if(typeof e.name!=`string`||!e.name.trim()||e.name.length>60)throw Error(`設定名は1〜60文字にしてください`);if(typeof e.buildId!=`string`||e.buildId.length>120)throw Error(`ビルドIDが不正です`);let t=e.values,n=e.preview;if(w(t),w(n),![`legacy`,`underpaint`,`inset`].includes(t.outlineMode))throw Error(`線と塗りの方式が不正です`);if(w(e.playback),!Number.isInteger(e.playback.ticks)||e.playback.ticks<0||e.playback.ticks>5184e3||typeof e.playback.paused!=`boolean`)throw Error(`再生位置は0〜24時間の範囲にしてください`);for(let[e,[n,r]]of Object.entries(C))if(typeof t[e]!=`number`||!Number.isFinite(t[e])||t[e]<n||t[e]>r)throw Error(`${e} は ${n}〜${r} の数値にしてください`);if(typeof t.mouth!=`boolean`||typeof t.outlineColor!=`string`||typeof t.innerOutlineColor!=`string`||!/^#[0-9a-f]{6}$/i.test(t.outlineColor)||!/^#[0-9a-f]{6}$/i.test(t.innerOutlineColor))throw Error(`口の設定または輪郭色が不正です`);if(typeof t.presetName!=`string`||t.presetName.length>60)throw Error(`ルック候補名が不正です`);for(let[e,n]of Object.entries({headTiltScope:[`all`,`front`],idleMotion:[`current`,`none`],hairStyle:[`original`,`eyes-visible`,`intentional-cover`],frontFringe:[`follow`,`still`],browMode:[`original`,`front-overlay`]}))if(!n.includes(t[e]))throw Error(`${e} の選択が不正です`);for(let[e,n,r]of[[`browGap`,-.1,.1],[`highlightOpacity`,0,1],[`highlightLight`,0,1]])if(typeof t[e]!=`number`||!Number.isFinite(t[e])||t[e]<n||t[e]>r)throw Error(`${e} は ${n}〜${r} です`);if(w(t.head),![`original`,`round`,`cylinder`].includes(t.head.shape)||typeof t.head.size!=`number`||!Number.isFinite(t.head.size)||t.head.size<.9||t.head.size>1.1)throw Error(`頭形状または大きさ（0.9〜1.1）が不正です`);v(t.face);for(let[e,t]of Object.entries({lightSite:[`default`,`dark`,`lamp`,`boundary`],view:[`dot`,`3d`],background:[`plain`,`map`],motion:[`still`,`idle`,`walk`,`vertical`,`diagonal`],light:[`day`,`evening`,`night`],eyes:[`auto`,`open`,`closed`],expression:[`neutral`,`angry`,`sad`]}))if(!t.includes(n[e]))throw Error(`プレビューの ${e} が不正です`);if(typeof n.hair!=`boolean`||typeof n.mouthOpen!=`boolean`)throw Error(`髪・口の状態が不正です`);if(!Number.isInteger(n.direction)||n.direction<0||n.direction>7||typeof n.autoDirection!=`boolean`||typeof n.blink!=`boolean`||![1,2,3].includes(n.zoom))throw Error(`方向・まばたき・拡大率が不正です`);return S({schema:5,name:e.name.trim(),buildId:e.buildId,values:t,preview:n,playback:e.playback})}var E={active:!1,baseline:!1,values:S(b),preview:S(x)};function D(){return E.active&&!E.baseline?E.values:b}var ee=`ほむら・ルック候補01`;function te(){let e=S(b);Object.assign(e,{presetName:ee,headTilt:12,headTiltScope:`front`,headIdle:0,mouth:!1,outlineMode:`underpaint`,outerOpacity:.8,innerOpacity:.7,hairStyle:`eyes-visible`,frontFringe:`still`,browMode:`front-overlay`,highlightLight:1}),e.head.shape=`cylinder`,e.face.region.y=.03,e.face.blinkMode=`image`;for(let t of[`left`,`right`])e.face.brows[t].neutralVisible=!0;return e}function ne(e){let t=Math.max(0,Math.min(1,1-Math.abs(Math.atan2(Math.sin(e),Math.cos(e)))/(Math.PI/4)));return t*t*(3-2*t)}function re(e,t,n,r){if(!n)return t*Math.PI/4;let i=e/2,a=Math.floor(i),o=i-a,s=r?Math.max(0,(o-.85)/.15):0;return(a+s*s*(3-2*s))*Math.PI/4}var ie=`pixel-rig-look-library-v1`;function ae(){let e=localStorage.getItem(ie);if(!e)return Object.create(null);let t;try{t=JSON.parse(e)}catch{throw Error(`保存データを読み取れません。元のデータは上書きしていません。設定コピーで現在の調整を退避してください。`)}if(!t||typeof t!=`object`||Array.isArray(t))throw Error(`保存領域の形式が不正です。上書きせず保持しています。`);return Object.assign(Object.create(null),t)}function oe(e){let t=T(e),n=ae();if(Object.keys(n).length>=30&&!Object.hasOwn(n,t.name))throw Error(`保存は30件までです。既存の名前で更新するか、設定をコピーして退避してください。`);n[t.name]=t;let r=JSON.stringify(n);if(localStorage.setItem(ie,r),localStorage.getItem(`pixel-rig-look-library-v1`)!==r)throw Error(`ブラウザへの保存を確認できません。設定をコピーして退避し、ブラウザの保存制限を確認してください。`);return t}function se(e){let t=e;return t?.name===`QuotaExceededError`?`ブラウザの保存容量が不足しています。設定をコピーして退避し、空き容量やブラウザの保存制限を確認してください。`:t?.name===`SecurityError`?`このブラウザでは保存領域を利用できません。Safariの通常タブで開くか、設定をコピーして退避してください。`:`${t?.message||String(e)} 必要なら「設定をコピー」で現在の調整を退避してください。`}function ce(e){if(!e.length)return{count:0,meanMs:null,medianMs:null,p95Ms:null,maxMs:null,over50ms:0};let t=[...e].sort((e,t)=>e-t),n=e.reduce((e,t)=>e+t,0);return{count:e.length,meanMs:n/e.length,medianMs:t[Math.ceil(t.length*.5)-1],p95Ms:t[Math.ceil(t.length*.95)-1],maxMs:t[t.length-1],over50ms:e.filter(e=>e>50).length}}var le=class{warmupSeconds;durationSeconds;intervals=[];cpu=[];updates=0;draws=0;start=null;previous=null;measurementStart=null;elapsed=0;status=`warming`;reason=null;constructor(e,t){this.warmupSeconds=e,this.durationSeconds=t}sample(e,t,n){this.done||(this.start===null&&(this.start=e),this.elapsed=(e-this.start)/1e3,this.elapsed<this.warmupSeconds||(this.status=`measuring`,this.measurementStart===null&&(this.measurementStart=e),this.previous!==null&&(this.intervals.push(e-this.previous),this.cpu.push(t),this.updates+=n,this.draws++),this.previous=e,(e-this.measurementStart)/1e3>=this.durationSeconds&&(this.status=`complete`)))}interrupt(e){this.done||(this.status=`interrupted`,this.reason=e)}get done(){return this.status===`complete`||this.status===`interrupted`}result(){let e=this.intervals.reduce((e,t)=>e+t,0);return{status:this.status,reason:this.reason,warmupSeconds:this.warmupSeconds,requestedSeconds:this.durationSeconds,measuredSeconds:e/1e3,renderedFrames:this.draws,logicUpdates:this.updates,renderedFps:e?this.draws*1e3/e:null,logicHz:e?this.updates*1e3/e:null,frameIntervals:ce(this.intervals),cpuSubmission:ce(this.cpu),gpuMs:null,gpuNote:`未取得。RAF間隔・CPU描画命令発行時間はGPU時間ではありません`,readPixels:!1,video:`外部録画は自動検出できません。結果の申告欄を参照`,pacing:`通常RAF描画、既存STEPロジック。描画60fpsへ制限していない`,passJudgment:null}}},ue=`precise`,O={selection:`default`,get variant(){return this.selection==="default"?ue:this.selection},set variant(e){this.selection=e},freezePose:!1,fixedCamera:!1},k=1e3,de=1001,fe=1002,A=1003,j=1004,pe=1005,me=1006,he=1007,ge=1008,_e=1009,ve=1012,ye=1014,be=1015,xe=1020,Se=1022,Ce=1023,we=1026,Te=2201,Ee=2202,De=2300,Oe=2301,ke=2302,Ae=2400,je=2401,Me=2402,Ne=2500,Pe=2501,Fe=3e3,Ie=3001,Le=3007,Re=3002,ze=3003,Be=3004,Ve=3005,He=3006,Ue=3200,We=3201,Ge=7680,Ke=35044,qe=35048,Je=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let n=this._listeners[e];if(n!==void 0){let e=n.indexOf(t);e!==-1&&n.splice(e,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let n=t.slice(0);for(let t=0,r=n.length;t<r;t++)n[t].call(this,e);e.target=null}}},Ye=[];for(let e=0;e<256;e++)Ye[e]=(e<16?`0`:``)+e.toString(16);var Xe=Math.PI/180,Ze=180/Math.PI;function Qe(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Ye[e&255]+Ye[e>>8&255]+Ye[e>>16&255]+Ye[e>>24&255]+`-`+Ye[t&255]+Ye[t>>8&255]+`-`+Ye[t>>16&15|64]+Ye[t>>24&255]+`-`+Ye[n&63|128]+Ye[n>>8&255]+`-`+Ye[n>>16&255]+Ye[n>>24&255]+Ye[r&255]+Ye[r>>8&255]+Ye[r>>16&255]+Ye[r>>24&255]).toUpperCase()}function $e(e,t,n){return Math.max(t,Math.min(n,e))}function et(e,t){return(e%t+t)%t}function tt(e,t,n){return(1-n)*e+n*t}function nt(e){return!(e&e-1)&&e!==0}function rt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function it(e){return 2**Math.floor(Math.log(e)/Math.LN2)}var M=class{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e,t){return t===void 0?(this.x+=e.x,this.y+=e.y,this):(console.warn(`THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.`),this.addVectors(e,t))}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e,t){return t===void 0?(this.x-=e.x,this.y-=e.y,this):(console.warn(`THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.`),this.subVectors(e,t))}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn(`THREE.Vector2: offset has been removed from .fromBufferAttribute().`),this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}};M.prototype.isVector2=!0;var at=class{constructor(){this.elements=[1,0,0,0,1,0,0,0,1],arguments.length>0&&console.error(`THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.`)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){let n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=t,n[4]*=t,n[7]*=t,this}rotate(e){let t=Math.cos(e),n=Math.sin(e),r=this.elements,i=r[0],a=r[3],o=r[6],s=r[1],c=r[4],l=r[7];return r[0]=t*i+n*s,r[3]=t*a+n*c,r[6]=t*o+n*l,r[1]=-n*i+t*s,r[4]=-n*a+t*c,r[7]=-n*o+t*l,this}translate(e,t){let n=this.elements;return n[0]+=e*n[2],n[3]+=e*n[5],n[6]+=e*n[8],n[1]+=t*n[2],n[4]+=t*n[5],n[7]+=t*n[8],this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};at.prototype.isMatrix3=!0;var ot,st=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ot===void 0&&(ot=document.createElementNS(`http://www.w3.org/1999/xhtml`,`canvas`)),ot.width=e.width,ot.height=e.height;let n=ot.getContext(`2d`);e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ot}return t.width>2048||t.height>2048?(console.warn(`THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons`,e),t.toDataURL(`image/jpeg`,.6)):t.toDataURL(`image/png`)}},ct=0,lt=class e extends Je{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=de,i=de,a=me,o=ge,s=Ce,c=_e,l=1,u=Fe){super(),Object.defineProperty(this,"id",{value:ct++}),this.uuid=Qe(),this.name=``,this.image=t,this.mipmaps=[],this.mapping=n,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new M(0,0),this.repeat=new M(1,1),this.center=new M(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new at,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.encoding=u,this.version=0,this.onUpdate=null}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.image=e.image,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.encoding=e.encoding,this}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.5,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,mapping:this.mapping,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,type:this.type,encoding:this.encoding,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(this.image!==void 0){let r=this.image;if(r.uuid===void 0&&(r.uuid=Qe()),!t&&e.images[r.uuid]===void 0){let t;if(Array.isArray(r)){t=[];for(let e=0,n=r.length;e<n;e++)r[e].isDataTexture?t.push(ut(r[e].image)):t.push(ut(r[e]))}else t=ut(r);e.images[r.uuid]={uuid:r.uuid,url:t}}n.image=r.uuid}return t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case k:e.x-=Math.floor(e.x);break;case de:e.x=e.x<0?0:1;break;case fe:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case k:e.y-=Math.floor(e.y);break;case de:e.y=e.y<0?0:1;break;case fe:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&this.version++}};lt.DEFAULT_IMAGE=void 0,lt.DEFAULT_MAPPING=300,lt.prototype.isTexture=!0;function ut(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?st.getDataURL(e):e.data?{data:Array.prototype.slice.call(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn(`THREE.Texture: Unable to serialize Texture.`),{})}var N=class{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e,t){return t===void 0?(this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this):(console.warn(`THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.`),this.addVectors(e,t))}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e,t){return t===void 0?(this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this):(console.warn(`THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.`),this.subVectors(e,t))}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this.w=this.w<0?Math.ceil(this.w):Math.floor(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn(`THREE.Vector4: offset has been removed from .fromBufferAttribute().`),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}};N.prototype.isVector4=!0;var dt=class extends Je{constructor(e,t,n){super(),this.width=e,this.height=t,this.depth=1,this.scissor=new N(0,0,e,t),this.scissorTest=!1,this.viewport=new N(0,0,e,t),n||={},this.texture=new lt(void 0,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.encoding),this.texture.image={},this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=1,this.texture.generateMipmaps=n.generateMipmaps!==void 0&&n.generateMipmaps,this.texture.minFilter=n.minFilter===void 0?me:n.minFilter,this.depthBuffer=n.depthBuffer===void 0||n.depthBuffer,this.stencilBuffer=n.stencilBuffer!==void 0&&n.stencilBuffer,this.depthTexture=n.depthTexture===void 0?null:n.depthTexture}setTexture(e){e.image={width:this.width,height:this.height,depth:this.depth},this.texture=e}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.width=e.width,this.height=e.height,this.depth=e.depth,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.depthTexture=e.depthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}};dt.prototype.isWebGLRenderTarget=!0;var ft=class extends dt{constructor(e,t,n){super(e,t,n),this.samples=4}copy(e){return super.copy.call(this,e),this.samples=e.samples,this}};ft.prototype.isWebGLMultisampleRenderTarget=!0;var pt=class{constructor(e=0,t=0,n=0,r=1){this._x=e,this._y=t,this._z=n,this._w=r}static slerp(e,t,n,r){return console.warn(`THREE.Quaternion: Static .slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead.`),n.slerpQuaternions(e,t,r)}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(o===0)e[t+0]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u;else if(o===1)e[t+0]=d,e[t+1]=f,e[t+2]=p,e[t+3]=m;else{if(u!==m||s!==d||c!==f||l!==p){let e=1-o,t=s*d+c*f+l*p+u*m,n=t>=0?1:-1,r=1-t*t;if(r>2**-52){let i=Math.sqrt(r),a=Math.atan2(i,t*n);e=Math.sin(e*a)/i,o=Math.sin(o*a)/i}let i=o*n;if(s=s*e+d*i,c=c*e+f*i,l=l*e+p*i,u=u*e+m*i,e===1-o){let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){if(!(e&&e.isEuler))throw Error(`THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.`);let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:console.warn(`THREE.Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<2**-52?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e,t){return t===void 0?this.multiplyQuaternions(this,e):(console.warn(`THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.`),this.multiplyQuaternions(e,t))}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,i=this._z,a=this._w,o=a*e._w+n*e._x+r*e._y+i*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=i,this;let s=1-o*o;if(s<=2**-52){let e=1-t;return this._w=e*a+t*this._w,this._x=e*n+t*this._x,this._y=e*r+t*this._y,this._z=e*i+t*this._z,this.normalize(),this._onChangeCallback(),this}let c=Math.sqrt(s),l=Math.atan2(c,o),u=Math.sin((1-t)*l)/c,d=Math.sin(t*l)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=i*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){this.copy(e).slerp(t,n)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}};pt.prototype.isQuaternion=!0;var P=class{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e,t){return t===void 0?(this.x+=e.x,this.y+=e.y,this.z+=e.z,this):(console.warn(`THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.`),this.addVectors(e,t))}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e,t){return t===void 0?(this.x-=e.x,this.y-=e.y,this.z-=e.z,this):(console.warn(`THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.`),this.subVectors(e,t))}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e,t){return t===void 0?(this.x*=e.x,this.y*=e.y,this.z*=e.z,this):(console.warn(`THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.`),this.multiplyVectors(e,t))}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return e&&e.isEuler||console.error(`THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.`),this.applyQuaternion(ht.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ht.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=s*t+a*r-o*n,l=s*n+o*t-i*r,u=s*r+i*n-a*t,d=-i*t-a*n-o*r;return this.x=c*s+d*-i+l*-o-u*-a,this.y=l*s+d*-a+u*-i-c*-o,this.z=u*s+d*-o+c*-a-l*-i,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=this.x<0?Math.ceil(this.x):Math.floor(this.x),this.y=this.y<0?Math.ceil(this.y):Math.floor(this.y),this.z=this.z<0?Math.ceil(this.z):Math.floor(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e,t){return t===void 0?this.crossVectors(this,e):(console.warn(`THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.`),this.crossVectors(e,t))}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return mt.copy(this).projectOnVector(e),this.sub(mt)}reflect(e){return this.sub(mt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t,n){return n!==void 0&&console.warn(`THREE.Vector3: offset has been removed from .fromBufferAttribute().`),this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}};P.prototype.isVector3=!0;var mt=new P,ht=new pt,gt=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){let t=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0;for(let s=0,c=e.length;s<c;s+=3){let c=e[s],l=e[s+1],u=e[s+2];c<t&&(t=c),l<n&&(n=l),u<r&&(r=u),c>i&&(i=c),l>a&&(a=l),u>o&&(o=u)}return this.min.set(t,n,r),this.max.set(i,a,o),this}setFromBufferAttribute(e){let t=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0;for(let s=0,c=e.count;s<c;s++){let c=e.getX(s),l=e.getY(s),u=e.getZ(s);c<t&&(t=c),l<n&&(n=l),u<r&&(r=u),c>i&&(i=c),l>a&&(a=l),u>o&&(o=u)}return this.min.set(t,n,r),this.max.set(i,a,o),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=vt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e){return this.makeEmpty(),this.expandByObject(e)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return e===void 0&&(console.warn(`THREE.Box3: .getCenter() target is now required`),e=new P),this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return e===void 0&&(console.warn(`THREE.Box3: .getSize() target is now required`),e=new P),this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e){e.updateWorldMatrix(!1,!1);let t=e.geometry;t!==void 0&&(t.boundingBox===null&&t.computeBoundingBox(),yt.copy(t.boundingBox),yt.applyMatrix4(e.matrixWorld),this.union(yt));let n=e.children;for(let e=0,t=n.length;e<t;e++)this.expandByObject(n[e]);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t===void 0&&(console.warn(`THREE.Box3: .getParameter() target is now required`),t=new P),t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,vt),vt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Et),Dt.subVectors(this.max,Et),bt.subVectors(e.a,Et),xt.subVectors(e.b,Et),St.subVectors(e.c,Et),Ct.subVectors(xt,bt),wt.subVectors(St,xt),Tt.subVectors(bt,St);let t=[0,-Ct.z,Ct.y,0,-wt.z,wt.y,0,-Tt.z,Tt.y,Ct.z,0,-Ct.x,wt.z,0,-wt.x,Tt.z,0,-Tt.x,-Ct.y,Ct.x,0,-wt.y,wt.x,0,-Tt.y,Tt.x,0];return!At(t,bt,xt,St,Dt)||(t=[1,0,0,0,1,0,0,0,1],!At(t,bt,xt,St,Dt))?!1:(Ot.crossVectors(Ct,wt),t=[Ot.x,Ot.y,Ot.z],At(t,bt,xt,St,Dt))}clampPoint(e,t){return t===void 0&&(console.warn(`THREE.Box3: .clampPoint() target is now required`),t=new P),t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return vt.copy(e).clamp(this.min,this.max).sub(e).length()}getBoundingSphere(e){return e===void 0&&console.error(`THREE.Box3: .getBoundingSphere() target is now required`),this.getCenter(e.center),e.radius=this.getSize(vt).length()*.5,e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(_t[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_t[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_t[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_t[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_t[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_t[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_t[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_t[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_t)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}};gt.prototype.isBox3=!0;var _t=[new P,new P,new P,new P,new P,new P,new P,new P],vt=new P,yt=new gt,bt=new P,xt=new P,St=new P,Ct=new P,wt=new P,Tt=new P,Et=new P,Dt=new P,Ot=new P,kt=new P;function At(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){kt.fromArray(e,a);let o=i.x*Math.abs(kt.x)+i.y*Math.abs(kt.y)+i.z*Math.abs(kt.z),s=t.dot(kt),c=n.dot(kt),l=r.dot(kt);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var jt=new gt,Mt=new P,Nt=new P,Pt=new P,Ft=class{constructor(e=new P,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?jt.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t===void 0&&(console.warn(`THREE.Sphere: .clampPoint() target is now required`),t=new P),t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return e===void 0&&(console.warn(`THREE.Sphere: .getBoundingBox() target is now required`),e=new gt),this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){Pt.subVectors(e,this.center);let t=Pt.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.add(Pt.multiplyScalar(n/e)),this.radius+=n}return this}union(e){return Nt.subVectors(e.center,this.center).normalize().multiplyScalar(e.radius),this.expandByPoint(Mt.copy(e.center).add(Nt)),this.expandByPoint(Mt.copy(e.center).sub(Nt)),this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},It=new P,Lt=new P,Rt=new P,zt=new P,Bt=new P,Vt=new P,Ht=new P,Ut=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t===void 0&&(console.warn(`THREE.Ray: .at() target is now required`),t=new P),t.copy(this.direction).multiplyScalar(e).add(this.origin)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,It)),this}closestPointToPoint(e,t){t===void 0&&(console.warn(`THREE.Ray: .closestPointToPoint() target is now required`),t=new P),t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.direction).multiplyScalar(n).add(this.origin)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=It.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(It.copy(this.direction).multiplyScalar(t).add(this.origin),It.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Lt.copy(e).add(t).multiplyScalar(.5),Rt.copy(t).sub(e).normalize(),zt.copy(this.origin).sub(Lt);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Rt),o=zt.dot(this.direction),s=-zt.dot(Rt),c=zt.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.direction).multiplyScalar(u).add(this.origin),r&&r.copy(Rt).multiplyScalar(d).add(Lt),f}intersectSphere(e,t){It.subVectors(e.center,this.origin);let n=It.dot(this.direction),r=It.dot(It)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return o<0&&s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||n!==n)&&(n=i),(a<r||r!==r)&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,It)!==null}intersectTriangle(e,t,n,r,i){Bt.subVectors(t,e),Vt.subVectors(n,e),Ht.crossVectors(Bt,Vt);let a=this.direction.dot(Ht),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zt.subVectors(this.origin,e);let s=o*this.direction.dot(Vt.crossVectors(zt,Vt));if(s<0)return null;let c=o*this.direction.dot(Bt.cross(zt));if(c<0||s+c>a)return null;let l=-o*zt.dot(Ht);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},F=class e{constructor(){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],arguments.length>0&&console.error(`THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.`)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/Wt.setFromMatrixColumn(e,0).length(),i=1/Wt.setFromMatrixColumn(e,1).length(),a=1/Wt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){e&&e.isEuler||console.error(`THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.`);let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Kt,e,qt)}lookAt(e,t,n){let r=this.elements;return Xt.subVectors(e,t),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),Jt.crossVectors(n,Xt),Jt.lengthSq()===0&&(Math.abs(n.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),Jt.crossVectors(n,Xt)),Jt.normalize(),Yt.crossVectors(Xt,Jt),r[0]=Jt.x,r[4]=Yt.x,r[8]=Xt.x,r[1]=Jt.y,r[5]=Yt.y,r[9]=Xt.y,r[2]=Jt.z,r[6]=Yt.z,r[10]=Xt.z,this}multiply(e,t){return t===void 0?this.multiplyMatrices(this,e):(console.warn(`THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.`),this.multiplyMatrices(e,t))}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],ee=r[13],te=r[2],ne=r[6],re=r[10],ie=r[14],ae=r[3],oe=r[7],se=r[11],ce=r[15];return i[0]=a*x+o*T+s*te+c*ae,i[4]=a*S+o*E+s*ne+c*oe,i[8]=a*C+o*D+s*re+c*se,i[12]=a*w+o*ee+s*ie+c*ce,i[1]=l*x+u*T+d*te+f*ae,i[5]=l*S+u*E+d*ne+f*oe,i[9]=l*C+u*D+d*re+f*se,i[13]=l*w+u*ee+d*ie+f*ce,i[2]=p*x+m*T+h*te+g*ae,i[6]=p*S+m*E+h*ne+g*oe,i[10]=p*C+m*D+h*re+g*se,i[14]=p*w+m*ee+h*ie+g*ce,i[3]=_*x+v*T+y*te+b*ae,i[7]=_*S+v*E+y*ne+b*oe,i[11]=_*C+v*D+y*re+b*se,i[15]=_*w+v*ee+y*ie+b*ce,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15];return p*(+i*s*u-r*c*u-i*o*d+n*c*d+r*o*f-n*s*f)+m*(+t*s*f-t*c*d+i*a*d-r*a*f+r*c*l-i*s*l)+h*(+t*c*u-t*o*f-i*a*u+n*a*f+i*o*l-n*c*l)+g*(-r*o*l-t*s*u+t*o*d+r*a*u-n*a*d+n*s*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=u*h*c-m*d*c+m*s*f-o*h*f-u*s*g+o*d*g,v=p*d*c-l*h*c-p*s*f+a*h*f+l*s*g-a*d*g,y=l*m*c-p*u*c+p*o*f-a*m*f-l*o*g+a*u*g,b=p*u*s-l*m*s-p*o*d+a*m*d+l*o*h-a*u*h,x=t*_+n*v+r*y+i*b;if(x===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/x;return e[0]=_*S,e[1]=(m*d*i-u*h*i-m*r*f+n*h*f+u*r*g-n*d*g)*S,e[2]=(o*h*i-m*s*i+m*r*c-n*h*c-o*r*g+n*s*g)*S,e[3]=(u*s*i-o*d*i-u*r*c+n*d*c+o*r*f-n*s*f)*S,e[4]=v*S,e[5]=(l*h*i-p*d*i+p*r*f-t*h*f-l*r*g+t*d*g)*S,e[6]=(p*s*i-a*h*i-p*r*c+t*h*c+a*r*g-t*s*g)*S,e[7]=(a*d*i-l*s*i+l*r*c-t*d*c-a*r*f+t*s*f)*S,e[8]=y*S,e[9]=(p*u*i-l*m*i-p*n*f+t*m*f+l*n*g-t*u*g)*S,e[10]=(a*m*i-p*o*i+p*n*c-t*m*c-a*n*g+t*o*g)*S,e[11]=(l*o*i-a*u*i-l*n*c+t*u*c+a*n*f-t*o*f)*S,e[12]=b*S,e[13]=(l*m*r-p*u*r+p*n*d-t*m*d-l*n*h+t*u*h)*S,e[14]=(p*o*r-a*m*r-p*n*s+t*m*s+a*n*h-t*o*h)*S,e[15]=(a*u*r-l*o*r+l*n*s-t*u*s-a*n*d+t*o*d)*S,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n){return this.set(1,t,n,0,e,1,n,0,e,t,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,i=Wt.set(r[0],r[1],r[2]).length(),a=Wt.set(r[4],r[5],r[6]).length(),o=Wt.set(r[8],r[9],r[10]).length();this.determinant()<0&&(i=-i),e.x=r[12],e.y=r[13],e.z=r[14],Gt.copy(this);let s=1/i,c=1/a,l=1/o;return Gt.elements[0]*=s,Gt.elements[1]*=s,Gt.elements[2]*=s,Gt.elements[4]*=c,Gt.elements[5]*=c,Gt.elements[6]*=c,Gt.elements[8]*=l,Gt.elements[9]*=l,Gt.elements[10]*=l,t.setFromRotationMatrix(Gt),n.x=i,n.y=a,n.z=o,this}makePerspective(e,t,n,r,i,a){a===void 0&&console.warn(`THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.`);let o=this.elements,s=2*i/(t-e),c=2*i/(n-r),l=(t+e)/(t-e),u=(n+r)/(n-r),d=-(a+i)/(a-i),f=-2*a*i/(a-i);return o[0]=s,o[4]=0,o[8]=l,o[12]=0,o[1]=0,o[5]=c,o[9]=u,o[13]=0,o[2]=0,o[6]=0,o[10]=d,o[14]=f,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,n,r,i,a){let o=this.elements,s=1/(t-e),c=1/(n-r),l=1/(a-i),u=(t+e)*s,d=(n+r)*c,f=(a+i)*l;return o[0]=2*s,o[4]=0,o[8]=0,o[12]=-u,o[1]=0,o[5]=2*c,o[9]=0,o[13]=-d,o[2]=0,o[6]=0,o[10]=-2*l,o[14]=-f,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};F.prototype.isMatrix4=!0;var Wt=new P,Gt=new F,Kt=new P(0,0,0),qt=new P(1,1,1),Jt=new P,Yt=new P,Xt=new P,Zt=new F,Qt=new pt,$t=class e{constructor(t=0,n=0,r=0,i=e.DefaultOrder){this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._order=r||this._order,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t,n){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t||=this._order,t){case`XYZ`:this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-$e(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin($e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin($e(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:console.warn(`THREE.Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n!==!1&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Zt.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Zt,t,n)}setFromVector3(e,t){return this.set(e.x,e.y,e.z,t||this._order)}reorder(e){return Qt.setFromEuler(this),this.setFromQuaternion(Qt,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}toVector3(e){return e?e.set(this._x,this._y,this._z):new P(this._x,this._y,this._z)}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}};$t.prototype.isEuler=!0,$t.DefaultOrder=`XYZ`,$t.RotationOrders=[`XYZ`,`YZX`,`ZXY`,`XZY`,`YXZ`,`ZYX`];var en=class{constructor(){this.mask=1}set(e){this.mask=1<<e}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}},tn=0,nn=new P,rn=new pt,an=new F,on=new P,sn=new P,cn=new P,ln=new pt,un=new P(1,0,0),dn=new P(0,1,0),fn=new P(0,0,1),pn={type:`added`},mn={type:`removed`},hn=class e extends Je{constructor(){super(),Object.defineProperty(this,"id",{value:tn++}),this.uuid=Qe(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DefaultUp.clone();let t=new P,n=new $t,r=new pt,i=new P(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new F},normalMatrix:{value:new at}}),this.matrix=new F,this.matrixWorld=new F,this.matrixAutoUpdate=e.DefaultMatrixAutoUpdate,this.matrixWorldNeedsUpdate=!1,this.layers=new en,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return rn.setFromAxisAngle(e,t),this.quaternion.multiply(rn),this}rotateOnWorldAxis(e,t){return rn.setFromAxisAngle(e,t),this.quaternion.premultiply(rn),this}rotateX(e){return this.rotateOnAxis(un,e)}rotateY(e){return this.rotateOnAxis(dn,e)}rotateZ(e){return this.rotateOnAxis(fn,e)}translateOnAxis(e,t){return nn.copy(e).applyQuaternion(this.quaternion),this.position.add(nn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(un,e)}translateY(e){return this.translateOnAxis(dn,e)}translateZ(e){return this.translateOnAxis(fn,e)}localToWorld(e){return e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return e.applyMatrix4(an.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?on.copy(e):on.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),sn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?an.lookAt(sn,on,this.up):an.lookAt(on,sn,this.up),this.quaternion.setFromRotationMatrix(an),r&&(an.extractRotation(r.matrixWorld),rn.setFromRotationMatrix(an),this.quaternion.premultiply(rn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(console.error(`THREE.Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(pn)):console.error(`THREE.Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(mn)),this}clear(){for(let e=0;e<this.children.length;e++){let t=this.children[e];t.parent=null,t.dispatchEvent(mn)}return this.children.length=0,this}attach(e){return this.updateWorldMatrix(!0,!1),an.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),an.multiply(e.parent.matrixWorld)),e.applyMatrix4(an),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getWorldPosition(e){return e===void 0&&(console.warn(`THREE.Object3D: .getWorldPosition() target is now required`),e=new P),this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return e===void 0&&(console.warn(`THREE.Object3D: .getWorldQuaternion() target is now required`),e=new pt),this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sn,e,cn),e}getWorldScale(e){return e===void 0&&(console.warn(`THREE.Object3D: .getWorldScale() target is now required`),e=new P),this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sn,ln,e),e}getWorldDirection(e){e===void 0&&(console.warn(`THREE.Object3D: .getWorldDirection() target is now required`),e=new P),this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let e=this.children;for(let t=0,n=e.length;t<n;t++)e[t].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{}},n.metadata={version:4.5,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),JSON.stringify(this.userData)!==`{}`&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};hn.DefaultUp=new P(0,1,0),hn.DefaultMatrixAutoUpdate=!0,hn.prototype.isObject3D=!0;var gn=new P,_n=new P,vn=new at,yn=class{constructor(e=new P(1,0,0),t=0){this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=gn.subVectors(n,t).cross(_n.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t===void 0&&(console.warn(`THREE.Plane: .projectPoint() target is now required`),t=new P),t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}intersectLine(e,t){t===void 0&&(console.warn(`THREE.Plane: .intersectLine() target is now required`),t=new P);let n=e.delta(gn),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let i=-(e.start.dot(this.normal)+this.constant)/r;return i<0||i>1?null:t.copy(n).multiplyScalar(i).add(e.start)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e===void 0&&(console.warn(`THREE.Plane: .coplanarPoint() target is now required`),e=new P),e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||vn.getNormalMatrix(e),r=this.coplanarPoint(gn).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}};yn.prototype.isPlane=!0;var bn=new P,xn=new P,Sn=new P,Cn=new P,wn=new P,Tn=new P,En=new P,Dn=new P,On=new P,kn=new P,An=class e{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r===void 0&&(console.warn(`THREE.Triangle: .getNormal() target is now required`),r=new P),r.subVectors(n,t),bn.subVectors(e,t),r.cross(bn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){bn.subVectors(r,t),xn.subVectors(n,t),Sn.subVectors(e,t);let a=bn.dot(bn),o=bn.dot(xn),s=bn.dot(Sn),c=xn.dot(xn),l=xn.dot(Sn),u=a*c-o*o;if(i===void 0&&(console.warn(`THREE.Triangle: .getBarycoord() target is now required`),i=new P),u===0)return i.set(-2,-1,-1);let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Cn),Cn.x>=0&&Cn.y>=0&&Cn.x+Cn.y<=1}static getUV(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Cn),s.set(0,0),s.addScaledVector(i,Cn.x),s.addScaledVector(a,Cn.y),s.addScaledVector(o,Cn.z),s}static isFrontFacing(e,t,n,r){return bn.subVectors(n,t),xn.subVectors(e,t),bn.cross(xn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bn.subVectors(this.c,this.b),xn.subVectors(this.a,this.b),bn.cross(xn).length()*.5}getMidpoint(e){return e===void 0&&(console.warn(`THREE.Triangle: .getMidpoint() target is now required`),e=new P),e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e===void 0&&(console.warn(`THREE.Triangle: .getPlane() target is now required`),e=new yn),e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getUV(t,n,r,i,a){return e.getUV(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){t===void 0&&(console.warn(`THREE.Triangle: .closestPointToPoint() target is now required`),t=new P);let n=this.a,r=this.b,i=this.c,a,o;wn.subVectors(r,n),Tn.subVectors(i,n),Dn.subVectors(e,n);let s=wn.dot(Dn),c=Tn.dot(Dn);if(s<=0&&c<=0)return t.copy(n);On.subVectors(e,r);let l=wn.dot(On),u=Tn.dot(On);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(wn,a);kn.subVectors(e,i);let f=wn.dot(kn),p=Tn.dot(kn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Tn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return En.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(En,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(wn,a).addScaledVector(Tn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},jn=0;function Mn(){Object.defineProperty(this,"id",{value:jn++}),this.uuid=Qe(),this.name=``,this.type=`Material`,this.fog=!0,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ge,this.stencilZFail=Ge,this.stencilZPass=Ge,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaTest=0,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0}Mn.prototype=Object.assign(Object.create(Je.prototype),{constructor:Mn,isMaterial:!0,onBuild:function(){},onBeforeCompile:function(){},customProgramCacheKey:function(){return this.onBeforeCompile.toString()},setValues:function(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: '`+t+`' parameter is undefined.`);continue}if(t===`shading`){console.warn(`THREE.`+this.type+`: .shading has been removed. Use the boolean .flatShading instead.`),this.flatShading=n===1;continue}let r=this[t];r===void 0?console.warn(`THREE.`+this.type+`: '`+t+`' is not a property of this material.`):r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}},toJSON:function(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.5,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen&&this.sheen.isColor&&(n.sheen=this.sheen.getHex()),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.morphTargets===!0&&(n.morphTargets=!0),this.morphNormals===!0&&(n.morphNormals=!0),this.skinning===!0&&(n.skinning=!0),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),JSON.stringify(this.userData)!==`{}`&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n},clone:function(){return new this.constructor().copy(this)},copy:function(e){this.name=e.name,this.fog=e.fog,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this},dispose:function(){this.dispatchEvent({type:`dispose`})}}),Object.defineProperty(Mn.prototype,"needsUpdate",{set:function(e){e===!0&&this.version++}});var Nn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pn={h:0,s:0,l:0},Fn={h:0,s:0,l:0};function In(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}function Ln(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Rn(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var I=class{constructor(e,t,n){return t===void 0&&n===void 0?this.set(e):this.setRGB(e,t,n)}set(e){return e&&e.isColor?this.copy(e):typeof e==`number`?this.setHex(e):typeof e==`string`&&this.setStyle(e),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,this}setRGB(e,t,n){return this.r=e,this.g=t,this.b=n,this}setHSL(e,t,n){if(e=et(e,1),t=$e(t,0,1),n=$e(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=In(i,r,e+1/3),this.g=In(i,r,e),this.b=In(i,r,e-1/3)}return this}setStyle(e){function t(t){t!==void 0&&parseFloat(t)<1&&console.warn(`THREE.Color: Alpha component of `+e+` will be ignored.`)}let n;if(n=/^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(e)){let e,r=n[1],i=n[2];switch(r){case`rgb`:case`rgba`:if(e=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(i))return this.r=Math.min(255,parseInt(e[1],10))/255,this.g=Math.min(255,parseInt(e[2],10))/255,this.b=Math.min(255,parseInt(e[3],10))/255,t(e[4]),this;if(e=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(i))return this.r=Math.min(100,parseInt(e[1],10))/100,this.g=Math.min(100,parseInt(e[2],10))/100,this.b=Math.min(100,parseInt(e[3],10))/100,t(e[4]),this;break;case`hsl`:case`hsla`:if(e=/^\s*(\d*\.?\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(i)){let n=parseFloat(e[1])/360,r=parseInt(e[2],10)/100,i=parseInt(e[3],10)/100;return t(e[4]),this.setHSL(n,r,i)}}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){let e=n[1],t=e.length;if(t===3)return this.r=parseInt(e.charAt(0)+e.charAt(0),16)/255,this.g=parseInt(e.charAt(1)+e.charAt(1),16)/255,this.b=parseInt(e.charAt(2)+e.charAt(2),16)/255,this;if(t===6)return this.r=parseInt(e.charAt(0)+e.charAt(1),16)/255,this.g=parseInt(e.charAt(2)+e.charAt(3),16)/255,this.b=parseInt(e.charAt(4)+e.charAt(5),16)/255,this}return e&&e.length>0?this.setColorName(e):this}setColorName(e){let t=Nn[e.toLowerCase()];return t===void 0?console.warn(`THREE.Color: Unknown color `+e):this.setHex(t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copyGammaToLinear(e,t=2){return this.r=e.r**+t,this.g=e.g**+t,this.b=e.b**+t,this}copyLinearToGamma(e,t=2){let n=t>0?1/t:1;return this.r=e.r**+n,this.g=e.g**+n,this.b=e.b**+n,this}convertGammaToLinear(e){return this.copyGammaToLinear(this,e),this}convertLinearToGamma(e){return this.copyLinearToGamma(this,e),this}copySRGBToLinear(e){return this.r=Ln(e.r),this.g=Ln(e.g),this.b=Ln(e.b),this}copyLinearToSRGB(e){return this.r=Rn(e.r),this.g=Rn(e.g),this.b=Rn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(){return this.r*255<<16^this.g*255<<8^(this.b*255|0)}getHexString(){return(`000000`+this.getHex().toString(16)).slice(-6)}getHSL(e){e===void 0&&(console.warn(`THREE.Color: .getHSL() target is now required`),e={h:0,s:0,l:0});let t=this.r,n=this.g,r=this.b,i=Math.max(t,n,r),a=Math.min(t,n,r),o,s,c=(a+i)/2;if(a===i)o=0,s=0;else{let e=i-a;switch(s=c<=.5?e/(i+a):e/(2-i-a),i){case t:o=(n-r)/e+(n<r?6:0);break;case n:o=(r-t)/e+2;break;case r:o=(t-n)/e+4}o/=6}return e.h=o,e.s=s,e.l=c,e}getStyle(){return`rgb(`+(this.r*255|0)+`,`+(this.g*255|0)+`,`+(this.b*255|0)+`)`}offsetHSL(e,t,n){return this.getHSL(Pn),Pn.h+=e,Pn.s+=t,Pn.l+=n,this.setHSL(Pn.h,Pn.s,Pn.l),this}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pn),e.getHSL(Fn);let n=tt(Pn.h,Fn.h,t),r=tt(Pn.s,Fn.s,t),i=tt(Pn.l,Fn.l,t);return this.setHSL(n,r,i),this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),e.normalized===!0&&(this.r/=255,this.g/=255,this.b/=255),this}toJSON(){return this.getHex()}};I.NAMES=Nn,I.prototype.isColor=!0,I.prototype.r=1,I.prototype.g=1,I.prototype.b=1;var zn=class extends Mn{constructor(e){super(),this.type=`MeshBasicMaterial`,this.color=new I(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.skinning=!1,this.morphTargets=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this}};zn.prototype.isMeshBasicMaterial=!0;var Bn=new P,Vn=new M,L=class{constructor(e,t,n){if(Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n===!0,this.usage=Ke,this.updateRange={offset:0,count:-1},this.version=0,this.onUploadCallback=function(){}}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}copyColorsArray(e){let t=this.array,n=0;for(let r=0,i=e.length;r<i;r++){let i=e[r];i===void 0&&(console.warn(`THREE.BufferAttribute.copyColorsArray(): color is undefined`,r),i=new I),t[n++]=i.r,t[n++]=i.g,t[n++]=i.b}return this}copyVector2sArray(e){let t=this.array,n=0;for(let r=0,i=e.length;r<i;r++){let i=e[r];i===void 0&&(console.warn(`THREE.BufferAttribute.copyVector2sArray(): vector is undefined`,r),i=new M),t[n++]=i.x,t[n++]=i.y}return this}copyVector3sArray(e){let t=this.array,n=0;for(let r=0,i=e.length;r<i;r++){let i=e[r];i===void 0&&(console.warn(`THREE.BufferAttribute.copyVector3sArray(): vector is undefined`,r),i=new P),t[n++]=i.x,t[n++]=i.y,t[n++]=i.z}return this}copyVector4sArray(e){let t=this.array,n=0;for(let r=0,i=e.length;r<i;r++){let i=e[r];i===void 0&&(console.warn(`THREE.BufferAttribute.copyVector4sArray(): vector is undefined`,r),i=new N),t[n++]=i.x,t[n++]=i.y,t[n++]=i.z,t[n++]=i.w}return this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Vn.fromBufferAttribute(this,t),Vn.applyMatrix3(e),this.setXY(t,Vn.x,Vn.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Bn.fromBufferAttribute(this,t),Bn.applyMatrix3(e),this.setXYZ(t,Bn.x,Bn.y,Bn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Bn.x=this.getX(t),Bn.y=this.getY(t),Bn.z=this.getZ(t),Bn.applyMatrix4(e),this.setXYZ(t,Bn.x,Bn.y,Bn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Bn.x=this.getX(t),Bn.y=this.getY(t),Bn.z=this.getZ(t),Bn.applyNormalMatrix(e),this.setXYZ(t,Bn.x,Bn.y,Bn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Bn.x=this.getX(t),Bn.y=this.getY(t),Bn.z=this.getZ(t),Bn.transformDirection(e),this.setXYZ(t,Bn.x,Bn.y,Bn.z);return this}set(e,t=0){return this.array.set(e,t),this}getX(e){return this.array[e*this.itemSize]}setX(e,t){return this.array[e*this.itemSize]=t,this}getY(e){return this.array[e*this.itemSize+1]}setY(e,t){return this.array[e*this.itemSize+1]=t,this}getZ(e){return this.array[e*this.itemSize+2]}setZ(e,t){return this.array[e*this.itemSize+2]=t,this}getW(e){return this.array[e*this.itemSize+3]}setW(e,t){return this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.prototype.slice.call(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}};L.prototype.isBufferAttribute=!0;var Hn=class extends L{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Un=class extends L{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Wn=class extends L{constructor(e,t,n){super(new Uint16Array(e),t,n)}};Wn.prototype.isFloat16BufferAttribute=!0;var R=class extends L{constructor(e,t,n){super(new Float32Array(e),t,n)}};function Gn(e){if(e.length===0)return-1/0;let t=e[0];for(let n=1,r=e.length;n<r;++n)e[n]>t&&(t=e[n]);return t}var Kn=0,qn=new F,Jn=new hn,Yn=new P,Xn=new gt,Zn=new gt,Qn=new P,z=class e extends Je{constructor(){super(),Object.defineProperty(this,"id",{value:Kn++}),this.uuid=Qe(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Gn(e)>65535?Un:Hn)(e,1):e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new at().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}rotateX(e){return qn.makeRotationX(e),this.applyMatrix4(qn),this}rotateY(e){return qn.makeRotationY(e),this.applyMatrix4(qn),this}rotateZ(e){return qn.makeRotationZ(e),this.applyMatrix4(qn),this}translate(e,t,n){return qn.makeTranslation(e,t,n),this.applyMatrix4(qn),this}scale(e,t,n){return qn.makeScale(e,t,n),this.applyMatrix4(qn),this}lookAt(e){return Jn.lookAt(e),Jn.updateMatrix(),this.applyMatrix4(Jn.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yn).negate(),this.translate(Yn.x,Yn.y,Yn.z),this}setFromPoints(e){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute(`position`,new R(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)console.error(`THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".`,this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Xn.setFromBufferAttribute(n),this.morphTargetsRelative?(Qn.addVectors(this.boundingBox.min,Xn.min),this.boundingBox.expandByPoint(Qn),Qn.addVectors(this.boundingBox.max,Xn.max),this.boundingBox.expandByPoint(Qn)):(this.boundingBox.expandByPoint(Xn.min),this.boundingBox.expandByPoint(Xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error(`THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ft);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)console.error(`THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".`,this),this.boundingSphere.set(new P,1/0);else if(e){let n=this.boundingSphere.center;if(Xn.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Zn.setFromBufferAttribute(n),this.morphTargetsRelative?(Qn.addVectors(Xn.min,Zn.min),Xn.expandByPoint(Qn),Qn.addVectors(Xn.max,Zn.max),Xn.expandByPoint(Qn)):(Xn.expandByPoint(Zn.min),Xn.expandByPoint(Zn.max))}Xn.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Qn.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Qn));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Qn.fromBufferAttribute(a,t),o&&(Yn.fromBufferAttribute(e,t),Qn.add(Yn)),r=Math.max(r,n.distanceToSquared(Qn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeFaceNormals(){}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error(`THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=e.array,r=t.position.array,i=t.normal.array,a=t.uv.array,o=r.length/3;t.tangent===void 0&&this.setAttribute(`tangent`,new L(new Float32Array(4*o),4));let s=t.tangent.array,c=[],l=[];for(let e=0;e<o;e++)c[e]=new P,l[e]=new P;let u=new P,d=new P,f=new P,p=new M,m=new M,h=new M,g=new P,_=new P;function v(e,t,n){u.fromArray(r,e*3),d.fromArray(r,t*3),f.fromArray(r,n*3),p.fromArray(a,e*2),m.fromArray(a,t*2),h.fromArray(a,n*2),d.sub(u),f.sub(u),m.sub(p),h.sub(p);let i=1/(m.x*h.y-h.x*m.y);isFinite(i)&&(g.copy(d).multiplyScalar(h.y).addScaledVector(f,-m.y).multiplyScalar(i),_.copy(f).multiplyScalar(m.x).addScaledVector(d,-h.x).multiplyScalar(i),c[e].add(g),c[t].add(g),c[n].add(g),l[e].add(_),l[t].add(_),l[n].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:n.length}]);for(let e=0,t=y.length;e<t;++e){let t=y[e],r=t.start,i=t.count;for(let e=r,t=r+i;e<t;e+=3)v(n[e+0],n[e+1],n[e+2])}let b=new P,x=new P,S=new P,C=new P;function w(e){S.fromArray(i,e*3),C.copy(S);let t=c[e];b.copy(t),b.sub(S.multiplyScalar(S.dot(t))).normalize(),x.crossVectors(C,t);let n=x.dot(l[e])<0?-1:1;s[e*4]=b.x,s[e*4+1]=b.y,s[e*4+2]=b.z,s[e*4+3]=n}for(let e=0,t=y.length;e<t;++e){let t=y[e],r=t.start,i=t.count;for(let e=r,t=r+i;e<t;e+=3)w(n[e+0]),w(n[e+1]),w(n[e+2])}}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0)n=new L(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new P,i=new P,a=new P,o=new P,s=new P,c=new P,l=new P,u=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}merge(e,t){if(!(e&&e.isBufferGeometry)){console.error(`THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.`,e);return}t===void 0&&(t=0,console.warn(`THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge.`));let n=this.attributes;for(let r in n){if(e.attributes[r]===void 0)continue;let i=n[r].array,a=e.attributes[r],o=a.array,s=a.itemSize*t,c=Math.min(o.length,i.length-s);for(let e=0,t=s;e<c;e++,t++)i[t]=o[e]}return this}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Qn.fromBufferAttribute(e,t),Qn.normalize(),e.setXYZ(t,Qn.x,Qn.y,Qn.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let e=0,i=t.length;e<i;e++){o=t[e]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new L(a,r,i)}if(this.index===null)return console.warn(`THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.5,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new e().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:`dispose`})}};z.prototype.isBufferGeometry=!0;var $n=new F,er=new Ut,tr=new Ft,nr=new P,rr=new P,ir=new P,ar=new P,or=new P,sr=new P,cr=new P,lr=new P,ur=new P,dr=new M,fr=new M,pr=new M,mr=new P,hr=new P,gr=class extends hn{constructor(e=new z,t=new zn){super(),this.type=`Mesh`,this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry;if(e.isBufferGeometry){let t=e.morphAttributes,n=Object.keys(t);if(n.length>0){let e=t[n[0]];if(e!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let t=0,n=e.length;t<n;t++){let n=e[t].name||String(t);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=t}}}}else{let t=e.morphTargets;t!==void 0&&t.length>0&&console.error(`THREE.Mesh.updateMorphTargets() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.`)}}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;if(r===void 0||(n.boundingSphere===null&&n.computeBoundingSphere(),tr.copy(n.boundingSphere),tr.applyMatrix4(i),e.ray.intersectsSphere(tr)===!1)||($n.copy(i).invert(),er.copy(e.ray).applyMatrix4($n),n.boundingBox!==null&&er.intersectsBox(n.boundingBox)===!1))return;let a;if(n.isBufferGeometry){let i=n.index,o=n.attributes.position,s=n.morphAttributes.position,c=n.morphTargetsRelative,l=n.attributes.uv,u=n.attributes.uv2,d=n.groups,f=n.drawRange;if(i!==null){if(Array.isArray(r))for(let n=0,p=d.length;n<p;n++){let p=d[n],m=r[p.materialIndex],h=Math.max(p.start,f.start),g=Math.min(p.start+p.count,f.start+f.count);for(let n=h,r=g;n<r;n+=3){let r=i.getX(n),d=i.getX(n+1),f=i.getX(n+2);a=vr(this,m,e,er,o,s,c,l,u,r,d,f),a&&(a.faceIndex=Math.floor(n/3),a.face.materialIndex=p.materialIndex,t.push(a))}}else{let n=Math.max(0,f.start),d=Math.min(i.count,f.start+f.count);for(let f=n,p=d;f<p;f+=3){let n=i.getX(f),d=i.getX(f+1),p=i.getX(f+2);a=vr(this,r,e,er,o,s,c,l,u,n,d,p),a&&(a.faceIndex=Math.floor(f/3),t.push(a))}}}else if(o!==void 0){if(Array.isArray(r))for(let n=0,i=d.length;n<i;n++){let i=d[n],p=r[i.materialIndex],m=Math.max(i.start,f.start),h=Math.min(i.start+i.count,f.start+f.count);for(let n=m,r=h;n<r;n+=3){let r=n,d=n+1,f=n+2;a=vr(this,p,e,er,o,s,c,l,u,r,d,f),a&&(a.faceIndex=Math.floor(n/3),a.face.materialIndex=i.materialIndex,t.push(a))}}else{let n=Math.max(0,f.start),i=Math.min(o.count,f.start+f.count);for(let d=n,f=i;d<f;d+=3){let n=d,i=d+1,f=d+2;a=vr(this,r,e,er,o,s,c,l,u,n,i,f),a&&(a.faceIndex=Math.floor(d/3),t.push(a))}}}}else n.isGeometry&&console.error(`THREE.Mesh.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.`)}};gr.prototype.isMesh=!0;function _r(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side!==2,s),c===null)return null;hr.copy(s),hr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(hr);return l<n.near||l>n.far?null:{distance:l,point:hr.clone(),object:e}}function vr(e,t,n,r,i,a,o,s,c,l,u,d){nr.fromBufferAttribute(i,l),rr.fromBufferAttribute(i,u),ir.fromBufferAttribute(i,d);let f=e.morphTargetInfluences;if(t.morphTargets&&a&&f){cr.set(0,0,0),lr.set(0,0,0),ur.set(0,0,0);for(let e=0,t=a.length;e<t;e++){let t=f[e],n=a[e];t!==0&&(ar.fromBufferAttribute(n,l),or.fromBufferAttribute(n,u),sr.fromBufferAttribute(n,d),o?(cr.addScaledVector(ar,t),lr.addScaledVector(or,t),ur.addScaledVector(sr,t)):(cr.addScaledVector(ar.sub(nr),t),lr.addScaledVector(or.sub(rr),t),ur.addScaledVector(sr.sub(ir),t)))}nr.add(cr),rr.add(lr),ir.add(ur)}e.isSkinnedMesh&&t.skinning&&(e.boneTransform(l,nr),e.boneTransform(u,rr),e.boneTransform(d,ir));let p=_r(e,t,n,r,nr,rr,ir,mr);if(p){s&&(dr.fromBufferAttribute(s,l),fr.fromBufferAttribute(s,u),pr.fromBufferAttribute(s,d),p.uv=An.getUV(mr,nr,rr,ir,dr,fr,pr,new M)),c&&(dr.fromBufferAttribute(c,l),fr.fromBufferAttribute(c,u),pr.fromBufferAttribute(c,d),p.uv2=An.getUV(mr,nr,rr,ir,dr,fr,pr,new M));let e={a:l,b:u,c:d,normal:new P,materialIndex:0};An.getNormal(nr,rr,ir,e.normal),p.face=e}return p}var yr=class extends z{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new R(c,3)),this.setAttribute(`normal`,new R(l,3)),this.setAttribute(`uv`,new R(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new P;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}};function br(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?t[n][r]=i.clone():Array.isArray(i)?t[n][r]=i.slice():t[n][r]=i}}return t}function xr(e){let t={};for(let n=0;n<e.length;n++){let r=br(e[n]);for(let e in r)t[e]=r[e]}return t}var Sr={clone:br,merge:xr},Cr=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wr=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Tr=class extends Mn{constructor(e){super(),this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.vertexShader=Cr,this.fragmentShader=wr,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&(e.attributes!==void 0&&console.error(`THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead.`),this.setValues(e))}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=br(e.uniforms),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.lights=e.lights,this.clipping=e.clipping,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}};Tr.prototype.isShaderMaterial=!0;var Er=class extends hn{constructor(){super(),this.type=`Camera`,this.matrixWorldInverse=new F,this.projectionMatrix=new F,this.projectionMatrixInverse=new F}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this}getWorldDirection(e){e===void 0&&(console.warn(`THREE.Camera: .getWorldDirection() target is now required`),e=new P),this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(-t[8],-t[9],-t[10]).normalize()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}};Er.prototype.isCamera=!0;var Dr=class extends Er{constructor(e=50,t=1,n=.1,r=2e3){super(),this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ze*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Xe*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ze*2*Math.atan(Math.tan(Xe*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Xe*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};Dr.prototype.isPerspectiveCamera=!0;var Or=90,kr=1,Ar=class extends hn{constructor(e,t,n){if(super(),this.type=`CubeCamera`,n.isWebGLCubeRenderTarget!==!0){console.error(`THREE.CubeCamera: The constructor now expects an instance of WebGLCubeRenderTarget as third parameter.`);return}this.renderTarget=n;let r=new Dr(Or,kr,e,t);r.layers=this.layers,r.up.set(0,-1,0),r.lookAt(new P(1,0,0)),this.add(r);let i=new Dr(Or,kr,e,t);i.layers=this.layers,i.up.set(0,-1,0),i.lookAt(new P(-1,0,0)),this.add(i);let a=new Dr(Or,kr,e,t);a.layers=this.layers,a.up.set(0,0,1),a.lookAt(new P(0,1,0)),this.add(a);let o=new Dr(Or,kr,e,t);o.layers=this.layers,o.up.set(0,0,-1),o.lookAt(new P(0,-1,0)),this.add(o);let s=new Dr(Or,kr,e,t);s.layers=this.layers,s.up.set(0,-1,0),s.lookAt(new P(0,0,1)),this.add(s);let c=new Dr(Or,kr,e,t);c.layers=this.layers,c.up.set(0,-1,0),c.lookAt(new P(0,0,-1)),this.add(c)}update(e,t){this.parent===null&&this.updateMatrixWorld();let n=this.renderTarget,[r,i,a,o,s,c]=this.children,l=e.xr.enabled,u=e.getRenderTarget();e.xr.enabled=!1;let d=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0),e.render(t,r),e.setRenderTarget(n,1),e.render(t,i),e.setRenderTarget(n,2),e.render(t,a),e.setRenderTarget(n,3),e.render(t,o),e.setRenderTarget(n,4),e.render(t,s),n.texture.generateMipmaps=d,e.setRenderTarget(n,5),e.render(t,c),e.setRenderTarget(u),e.xr.enabled=l}},jr=class extends lt{constructor(e,t,n,r,i,a,o,s,c,l){e=e===void 0?[]:e,t=t===void 0?301:t,o=o===void 0?Se:o,super(e,t,n,r,i,a,o,s,c,l),this._needsFlipEnvMap=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}};jr.prototype.isCubeTexture=!0;var Mr=class extends dt{constructor(e,t,n){Number.isInteger(t)&&(console.warn(`THREE.WebGLCubeRenderTarget: constructor signature is now WebGLCubeRenderTarget( size, options )`),t=n),super(e,e,t),t||={},this.texture=new jr(void 0,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.encoding),this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter===void 0?me:t.minFilter,this.texture._needsFlipEnvMap=!1}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.format=Ce,this.texture.encoding=t.encoding,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new yr(5,5,5),i=new Tr({name:`CubemapFromEquirect`,uniforms:br(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new gr(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=me),new Ar(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};Mr.prototype.isWebGLCubeRenderTarget=!0;var Nr=class extends lt{constructor(e,t,n,r,i,a,o,s,c,l,u,d){super(null,a,o,s,c,l,r,i,u,d),this.image={data:e||null,width:t||1,height:n||1},this.magFilter=c===void 0?A:c,this.minFilter=l===void 0?A:l,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}};Nr.prototype.isDataTexture=!0;var Pr=new Ft,Fr=new P,Ir=class{constructor(e=new yn,t=new yn,n=new yn,r=new yn,i=new yn,a=new yn){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e){let t=this.planes,n=e.elements,r=n[0],i=n[1],a=n[2],o=n[3],s=n[4],c=n[5],l=n[6],u=n[7],d=n[8],f=n[9],p=n[10],m=n[11],h=n[12],g=n[13],_=n[14],v=n[15];return t[0].setComponents(o-r,u-s,m-d,v-h).normalize(),t[1].setComponents(o+r,u+s,m+d,v+h).normalize(),t[2].setComponents(o+i,u+c,m+f,v+g).normalize(),t[3].setComponents(o-i,u-c,m-f,v-g).normalize(),t[4].setComponents(o-a,u-l,m-p,v-_).normalize(),t[5].setComponents(o+a,u+l,m+p,v+_).normalize(),this}intersectsObject(e){let t=e.geometry;return t.boundingSphere===null&&t.computeBoundingSphere(),Pr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld),this.intersectsSphere(Pr)}intersectsSprite(e){return Pr.center.set(0,0,0),Pr.radius=.7071067811865476,Pr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pr)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Fr.x=r.normal.x>0?e.max.x:e.min.x,Fr.y=r.normal.y>0?e.max.y:e.min.y,Fr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Fr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Lr(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Rr(e,t){let n=t.isWebGL2,r=new WeakMap;function i(t,r){let i=t.array,a=t.usage,o=e.createBuffer();e.bindBuffer(r,o),e.bufferData(r,i,a),t.onUploadCallback();let s=5126;return i instanceof Float32Array?s=5126:i instanceof Float64Array?console.warn(`THREE.WebGLAttributes: Unsupported data buffer format: Float64Array.`):i instanceof Uint16Array?t.isFloat16BufferAttribute?n?s=5131:console.warn(`THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.`):s=5123:i instanceof Int16Array?s=5122:i instanceof Uint32Array?s=5125:i instanceof Int32Array?s=5124:i instanceof Int8Array?s=5120:i instanceof Uint8Array&&(s=5121),{buffer:o,type:s,bytesPerElement:i.BYTES_PER_ELEMENT,version:t.version}}function a(t,r,i){let a=r.array,o=r.updateRange;e.bindBuffer(i,t),o.count===-1?e.bufferSubData(i,0,a):(n?e.bufferSubData(i,o.offset*a.BYTES_PER_ELEMENT,a,o.offset,o.count):e.bufferSubData(i,o.offset*a.BYTES_PER_ELEMENT,a.subarray(o.offset,o.offset+o.count)),o.count=-1)}function o(e){return e.isInterleavedBufferAttribute&&(e=e.data),r.get(e)}function s(t){t.isInterleavedBufferAttribute&&(t=t.data);let n=r.get(t);n&&(e.deleteBuffer(n.buffer),r.delete(t))}function c(e,t){if(e.isGLBufferAttribute){let t=r.get(e);(!t||t.version<e.version)&&r.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}e.isInterleavedBufferAttribute&&(e=e.data);let n=r.get(e);n===void 0?r.set(e,i(e,t)):n.version<e.version&&(a(n.buffer,e,t),n.version=e.version)}return{get:o,remove:s,update:c}}var zr=class extends z{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new R(p,3)),this.setAttribute(`normal`,new R(m,3)),this.setAttribute(`uv`,new R(h,2))}},B={alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef ALPHATEST
	if ( diffuseColor.a < ALPHATEST ) discard;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,begin_vertex:`vec3 transformed = vec3( position );`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`vec2 integrateSpecularBRDF( const in float dotNV, const in float roughness ) {
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	return vec2( -1.04, 1.04 ) * a004 + r.zw;
}
float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
#if defined ( PHYSICALLY_CORRECT_LIGHTS )
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
#else
	if( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
		return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
	}
	return 1.0;
#endif
}
vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {
	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
	return ( 1.0 - specularColor ) * fresnel + specularColor;
}
vec3 F_Schlick_RoughnessDependent( const in vec3 F0, const in float dotNV, const in float roughness ) {
	float fresnel = exp2( ( -5.55473 * dotNV - 6.98316 ) * dotNV );
	vec3 Fr = max( vec3( 1.0 - roughness ), F0 ) - F0;
	return Fr * fresnel + F0;
}
float G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	float gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	return 1.0 / ( gl * gv );
}
float G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
vec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( incidentLight.direction + viewDir );
	float dotNL = saturate( dot( normal, incidentLight.direction ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( G * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
vec3 BRDF_Specular_GGX_Environment( const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 brdf = integrateSpecularBRDF( dotNV, roughness );
	return specularColor * brdf.x + brdf.y;
}
void BRDF_Specular_Multiscattering_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
	float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
	vec3 F = F_Schlick_RoughnessDependent( specularColor, dotNV, roughness );
	vec2 brdf = integrateSpecularBRDF( dotNV, roughness );
	vec3 FssEss = F * brdf.x + brdf.y;
	float Ess = brdf.x + brdf.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = specularColor + ( 1.0 - specularColor ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
	float dotNH = saturate( dot( geometry.normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
}
float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {
	return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );
}
float BlinnExponentToGGXRoughness( const in float blinnExponent ) {
	return sqrt( 2.0 / ( blinnExponent + 2.0 ) );
}
#if defined( USE_SHEEN )
float D_Charlie(float roughness, float NoH) {
	float invAlpha = 1.0 / roughness;
	float cos2h = NoH * NoH;
	float sin2h = max(1.0 - cos2h, 0.0078125);	return (2.0 + invAlpha) * pow(sin2h, invAlpha * 0.5) / (2.0 * PI);
}
float V_Neubelt(float NoV, float NoL) {
	return saturate(1.0 / (4.0 * (NoL + NoV - NoL * NoV)));
}
vec3 BRDF_Specular_Sheen( const in float roughness, const in vec3 L, const in GeometricContext geometry, vec3 specularColor ) {
	vec3 N = geometry.normal;
	vec3 V = geometry.viewDir;
	vec3 H = normalize( V + L );
	float dotNH = saturate( dot( N, H ) );
	return specularColor * D_Charlie( roughness, dotNH ) * V_Neubelt( dot(N, V), dot(N, L) );
}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vUv );
		vec2 dSTdy = dFdy( vUv );
		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );
		vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate(a) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float max3( vec3 v ) { return max( max( v.x, v.y ), v.z ); }
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float linearToRelativeLuminance( const in vec3 color ) {
	vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
	return dot( weights, color.rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_maxMipLevel 8.0
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_maxTileSize 256.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		float texelSize = 1.0 / ( 3.0 * cubeUV_maxTileSize );
		vec2 uv = getUV( direction, face ) * ( faceSize - 1.0 );
		vec2 f = fract( uv );
		uv += 0.5 - f;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		if ( mipInt < cubeUV_maxMipLevel ) {
			uv.y += 2.0 * cubeUV_maxTileSize;
		}
		uv.y += filterInt * 2.0 * cubeUV_minTileSize;
		uv.x += 3.0 * max( 0.0, cubeUV_maxTileSize - 2.0 * faceSize );
		uv *= texelSize;
		vec3 tl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.x += texelSize;
		vec3 tr = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.y += texelSize;
		vec3 br = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		uv.x -= texelSize;
		vec3 bl = envMapTexelToLinear( texture2D( envMap, uv ) ).rgb;
		vec3 tm = mix( tl, tr, f.x );
		vec3 bm = mix( bl, br, f.x );
		return mix( tm, bm, f.y );
	}
	#define r0 1.0
	#define v0 0.339
	#define m0 - 2.0
	#define r1 0.8
	#define v1 0.276
	#define m1 - 1.0
	#define r4 0.4
	#define v4 0.046
	#define m4 2.0
	#define r5 0.305
	#define v5 0.016
	#define m5 3.0
	#define r6 0.21
	#define v6 0.0038
	#define m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= r1 ) {
			mip = ( r0 - roughness ) * ( m1 - m0 ) / ( r0 - r1 ) + m0;
		} else if ( roughness >= r4 ) {
			mip = ( r1 - roughness ) * ( m4 - m1 ) / ( r1 - r4 ) + m1;
		} else if ( roughness >= r5 ) {
			mip = ( r4 - roughness ) * ( m5 - m4 ) / ( r4 - r5 ) + m4;
		} else if ( roughness >= r6 ) {
			mip = ( r5 - roughness ) * ( m6 - m5 ) / ( r5 - r6 ) + m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), m0, cubeUV_maxMipLevel );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,encodings_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,encodings_pars_fragment:`
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( gammaFactor ) ), value.a );
}
vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( 1.0 / gammaFactor ) ), value.a );
}
vec4 sRGBToLinear( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 RGBEToLinear( in vec4 value ) {
	return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
vec4 LinearToRGBE( in vec4 value ) {
	float maxComponent = max( max( value.r, value.g ), value.b );
	float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
	return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
}
vec4 RGBMToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * value.a * maxRange, 1.0 );
}
vec4 LinearToRGBM( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float M = clamp( maxRGB / maxRange, 0.0, 1.0 );
	M = ceil( M * 255.0 ) / 255.0;
	return vec4( value.rgb / ( M * maxRange ), M );
}
vec4 RGBDToLinear( in vec4 value, in float maxRange ) {
	return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );
}
vec4 LinearToRGBD( in vec4 value, in float maxRange ) {
	float maxRGB = max( value.r, max( value.g, value.b ) );
	float D = max( maxRange / maxRGB, 1.0 );
	D = clamp( floor( D ) / 255.0, 0.0, 1.0 );
	return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );
}
const mat3 cLogLuvM = mat3( 0.2209, 0.3390, 0.4184, 0.1138, 0.6780, 0.7319, 0.0102, 0.1130, 0.2969 );
vec4 LinearToLogLuv( in vec4 value ) {
	vec3 Xp_Y_XYZp = cLogLuvM * value.rgb;
	Xp_Y_XYZp = max( Xp_Y_XYZp, vec3( 1e-6, 1e-6, 1e-6 ) );
	vec4 vResult;
	vResult.xy = Xp_Y_XYZp.xy / Xp_Y_XYZp.z;
	float Le = 2.0 * log2(Xp_Y_XYZp.y) + 127.0;
	vResult.w = fract( Le );
	vResult.z = ( Le - ( floor( vResult.w * 255.0 ) ) / 255.0 ) / 255.0;
	return vResult;
}
const mat3 cLogLuvInverseM = mat3( 6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268 );
vec4 LogLuvToLinear( in vec4 value ) {
	float Le = value.z * 255.0 + value.w;
	vec3 Xp_Y_XYZp;
	Xp_Y_XYZp.y = exp2( ( Le - 127.0 ) / 2.0 );
	Xp_Y_XYZp.z = Xp_Y_XYZp.y / value.y;
	Xp_Y_XYZp.x = value.x * Xp_Y_XYZp.z;
	vec3 vRGB = cLogLuvInverseM * Xp_Y_XYZp.rgb;
	return vec4( max( vRGB, 0.0 ), 1.0 );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 envColor = textureCubeUV( envMap, reflectVec, 0.0 );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifndef ENVMAP_TYPE_CUBE_UV
		envColor = envMapTexelToLinear( envColor );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform int maxMipLevel;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) ||defined( PHONG )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#if defined( USE_ENVMAP )
	#ifdef ENVMAP_MODE_REFRACTION
		uniform float refractionRatio;
	#endif
	vec3 getLightProbeIndirectIrradiance( const in GeometricContext geometry, const in int maxMIPLevel ) {
		vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
		#ifdef ENVMAP_TYPE_CUBE
			vec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );
			#else
				vec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_CUBE_UV )
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
		#else
			vec4 envMapColor = vec4( 0.0 );
		#endif
		return PI * envMapColor.rgb * envMapIntensity;
	}
	float getSpecularMIPLevel( const in float roughness, const in int maxMIPLevel ) {
		float maxMIPLevelScalar = float( maxMIPLevel );
		float sigma = PI * roughness * roughness / ( 1.0 + roughness );
		float desiredMIPLevel = maxMIPLevelScalar + log2( sigma );
		return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
	}
	vec3 getLightProbeIndirectRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in int maxMIPLevel ) {
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( -viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
		#else
			vec3 reflectVec = refract( -viewDir, normal, refractionRatio );
		#endif
		reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
		float specularMIPLevel = getSpecularMIPLevel( roughness, maxMIPLevel );
		#ifdef ENVMAP_TYPE_CUBE
			vec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );
			#ifdef TEXTURE_LOD_EXT
				vec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );
			#else
				vec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );
			#endif
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;
		#elif defined( ENVMAP_TYPE_CUBE_UV )
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
		#endif
		return envMapColor.rgb * envMapIntensity;
	}
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	fogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float fogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float fogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return texture2D( gradientMap, coord ).rgb;
	#else
		return ( coord.x < 0.7 ) ? vec3( 0.7 ) : vec3( 1.0 );
	#endif
}`,lightmap_fragment:`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel= texture2D( lightMap, vUv2 );
	reflectedLight.indirectDiffuse += PI * lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
#endif`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_vertex:`vec3 diffuse = vec3( 1.0 );
GeometricContext geometry;
geometry.position = mvPosition.xyz;
geometry.normal = normalize( transformedNormal );
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( -mvPosition.xyz );
GeometricContext backGeometry;
backGeometry.position = geometry.position;
backGeometry.normal = -geometry.normal;
backGeometry.viewDir = geometry.viewDir;
vLightFront = vec3( 0.0 );
vIndirectFront = vec3( 0.0 );
#ifdef DOUBLE_SIDED
	vLightBack = vec3( 0.0 );
	vIndirectBack = vec3( 0.0 );
#endif
IncidentLight directLight;
float dotNL;
vec3 directLightColor_Diffuse;
vIndirectFront += getAmbientLightIrradiance( ambientLightColor );
vIndirectFront += getLightProbeIrradiance( lightProbe, geometry );
#ifdef DOUBLE_SIDED
	vIndirectBack += getAmbientLightIrradiance( ambientLightColor );
	vIndirectBack += getLightProbeIrradiance( lightProbe, backGeometry );
#endif
#if NUM_POINT_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		getPointDirectLightIrradiance( pointLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = PI * directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_SPOT_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		getSpotDirectLightIrradiance( spotLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = PI * directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_DIR_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		getDirectionalDirectLightIrradiance( directionalLights[ i ], geometry, directLight );
		dotNL = dot( geometry.normal, directLight.direction );
		directLightColor_Diffuse = PI * directLight.color;
		vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
		#ifdef DOUBLE_SIDED
			vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
		#endif
	}
	#pragma unroll_loop_end
#endif
#if NUM_HEMI_LIGHTS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
		vIndirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
		#ifdef DOUBLE_SIDED
			vIndirectBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry );
		#endif
	}
	#pragma unroll_loop_end
#endif`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in GeometricContext geometry ) {
	vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	return irradiance;
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		directLight.color = directionalLight.color;
		directLight.direction = directionalLight.direction;
		directLight.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		vec3 lVector = pointLight.position - geometry.position;
		directLight.direction = normalize( lVector );
		float lightDistance = length( lVector );
		directLight.color = pointLight.color;
		directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );
		directLight.visible = ( directLight.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight ) {
		vec3 lVector = spotLight.position - geometry.position;
		directLight.direction = normalize( lVector );
		float lightDistance = length( lVector );
		float angleCos = dot( directLight.direction, spotLight.direction );
		if ( angleCos > spotLight.coneCos ) {
			float spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );
			directLight.color = spotLight.color;
			directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );
			directLight.visible = true;
		} else {
			directLight.color = vec3( 0.0 );
			directLight.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {
		float dotNL = dot( geometry.normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			irradiance *= PI;
		#endif
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon
#define Material_LightProbeLOD( material )	(0)`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_Specular_BlinnPhong( directLight, geometry, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong
#define Material_LightProbeLOD( material )	(0)`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.specularRoughness = max( roughnessFactor, 0.0525 );material.specularRoughness += geometryRoughness;
material.specularRoughness = min( material.specularRoughness, 1.0 );
#ifdef REFLECTIVITY
	material.specularColor = mix( vec3( MAXIMUM_SPECULAR_COEFFICIENT * pow2( reflectivity ) ), diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( DEFAULT_SPECULAR_COEFFICIENT ), diffuseColor.rgb, metalnessFactor );
#endif
#ifdef CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheen;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float specularRoughness;
	vec3 specularColor;
#ifdef CLEARCOAT
	float clearcoat;
	float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
	vec3 sheenColor;
#endif
};
#define MAXIMUM_SPECULAR_COEFFICIENT 0.16
#define DEFAULT_SPECULAR_COEFFICIENT 0.04
float clearcoatDHRApprox( const in float roughness, const in float dotNL ) {
	return DEFAULT_SPECULAR_COEFFICIENT + ( 1.0 - DEFAULT_SPECULAR_COEFFICIENT ) * ( pow( 1.0 - dotNL, 5.0 ) * pow( 1.0 - roughness, 2.0 ) );
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.specularRoughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifndef PHYSICALLY_CORRECT_LIGHTS
		irradiance *= PI;
	#endif
	#ifdef CLEARCOAT
		float ccDotNL = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = ccDotNL * directLight.color;
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			ccIrradiance *= PI;
		#endif
		float clearcoatDHR = material.clearcoat * clearcoatDHRApprox( material.clearcoatRoughness, ccDotNL );
		reflectedLight.directSpecular += ccIrradiance * material.clearcoat * BRDF_Specular_GGX( directLight, geometry.viewDir, geometry.clearcoatNormal, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearcoatRoughness );
	#else
		float clearcoatDHR = 0.0;
	#endif
	#ifdef USE_SHEEN
		reflectedLight.directSpecular += ( 1.0 - clearcoatDHR ) * irradiance * BRDF_Specular_Sheen(
			material.specularRoughness,
			directLight.direction,
			geometry,
			material.sheenColor
		);
	#else
		reflectedLight.directSpecular += ( 1.0 - clearcoatDHR ) * irradiance * BRDF_Specular_GGX( directLight, geometry.viewDir, geometry.normal, material.specularColor, material.specularRoughness);
	#endif
	reflectedLight.directDiffuse += ( 1.0 - clearcoatDHR ) * irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef CLEARCOAT
		float ccDotNV = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		reflectedLight.indirectSpecular += clearcoatRadiance * material.clearcoat * BRDF_Specular_GGX_Environment( geometry.viewDir, geometry.clearcoatNormal, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearcoatRoughness );
		float ccDotNL = ccDotNV;
		float clearcoatDHR = material.clearcoat * clearcoatDHRApprox( material.clearcoatRoughness, ccDotNL );
	#else
		float clearcoatDHR = 0.0;
	#endif
	float clearcoatInv = 1.0 - clearcoatDHR;
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	BRDF_Specular_Multiscattering_Environment( geometry, material.specularColor, material.specularRoughness, singleScattering, multiScattering );
	vec3 diffuse = material.diffuseColor * ( 1.0 - ( singleScattering + multiScattering ) );
	reflectedLight.indirectSpecular += clearcoatInv * radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef CLEARCOAT
	geometry.clearcoatNormal = clearcoatNormal;
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointDirectLightIrradiance( pointLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotDirectLightIrradiance( spotLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	irradiance += getLightProbeIrradiance( lightProbe, geometry );
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel= texture2D( lightMap, vUv2 );
		vec3 lightMapIrradiance = lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
		#ifndef PHYSICALLY_CORRECT_LIGHTS
			lightMapIrradiance *= PI;
		#endif
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getLightProbeIndirectIrradiance( geometry, maxMipLevel );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	radiance += getLightProbeIndirectRadiance( geometry.viewDir, geometry.normal, material.specularRoughness, maxMipLevel );
	#ifdef CLEARCOAT
		clearcoatRadiance += getLightProbeIndirectRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness, maxMipLevel );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	diffuseColor *= texelColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#ifdef USE_MAP
	vec4 mapTexel = texture2D( map, uv );
	diffuseColor *= mapTexelToLinear( mapTexel );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	uniform mat3 uvTransform;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
	objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
	objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
	objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifndef USE_MORPHNORMALS
		uniform float morphTargetInfluences[ 8 ];
	#else
		uniform float morphTargetInfluences[ 4 ];
	#endif
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	transformed += morphTarget0 * morphTargetInfluences[ 0 ];
	transformed += morphTarget1 * morphTargetInfluences[ 1 ];
	transformed += morphTarget2 * morphTargetInfluences[ 2 ];
	transformed += morphTarget3 * morphTargetInfluences[ 3 ];
	#ifndef USE_MORPHNORMALS
		transformed += morphTarget4 * morphTargetInfluences[ 4 ];
		transformed += morphTarget5 * morphTargetInfluences[ 5 ];
		transformed += morphTarget6 * morphTargetInfluences[ 6 ];
		transformed += morphTarget7 * morphTargetInfluences[ 7 ];
	#endif
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
	vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	#ifdef USE_TANGENT
		vec3 tangent = normalize( vTangent );
		vec3 bitangent = normalize( vBitangent );
		#ifdef DOUBLE_SIDED
			tangent = tangent * faceDirection;
			bitangent = bitangent * faceDirection;
		#endif
		#if defined( TANGENTSPACE_NORMALMAP ) || defined( USE_CLEARCOAT_NORMALMAP )
			mat3 vTBN = mat3( tangent, bitangent, normal );
		#endif
	#endif
#endif
vec3 geometryNormal = normal;`,normal_fragment_maps:`#ifdef OBJECTSPACE_NORMALMAP
	normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( TANGENTSPACE_NORMALMAP )
	vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	#ifdef USE_TANGENT
		normal = normalize( vTBN * mapN );
	#else
		normal = perturbNormal2Arb( -vViewPosition, normal, mapN, faceDirection );
	#endif
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef OBJECTSPACE_NORMALMAP
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( TANGENTSPACE_NORMALMAP ) || defined ( USE_CLEARCOAT_NORMALMAP ) )
	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {
		vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
		vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );
		return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	#ifdef USE_TANGENT
		clearcoatNormal = normalize( vTBN * clearcoatMapN );
	#else
		clearcoatNormal = perturbNormal2Arb( - vViewPosition, clearcoatNormal, clearcoatMapN, faceDirection );
	#endif
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return (( near + viewZ ) * far ) / (( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
		bool inFrustum = all( inFrustumVec );
		bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );
		bool frustumTest = all( frustumTestVec );
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ), 
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ), 
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,shadowmap_pars_vertex:`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHT_SHADOWS ];
		varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SPOT_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		vec4 shadowWorldPosition;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
		vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias, 0 );
		vSpotShadowCoord[ i ] = spotShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
	#endif
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform highp sampler2D boneTexture;
		uniform int boneTextureSize;
		mat4 getBoneMatrix( const in float i ) {
			float j = i * 4.0;
			float x = mod( j, float( boneTextureSize ) );
			float y = floor( j / float( boneTextureSize ) );
			float dx = 1.0 / float( boneTextureSize );
			float dy = 1.0 / float( boneTextureSize );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix( const in float i ) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate(a) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return toneMappingExposure * color;
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmissionmap_fragment:`#ifdef USE_TRANSMISSIONMAP
	totalTransmission *= texture2D( transmissionMap, vUv ).r;
#endif`,transmissionmap_pars_fragment:`#ifdef USE_TRANSMISSIONMAP
	uniform sampler2D transmissionMap;
#endif`,uv_pars_fragment:`#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )
	varying vec2 vUv;
#endif`,uv_pars_vertex:`#ifdef USE_UV
	#ifdef UVS_VERTEX_ONLY
		vec2 vUv;
	#else
		varying vec2 vUv;
	#endif
	uniform mat3 uvTransform;
#endif`,uv_vertex:`#ifdef USE_UV
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif`,uv2_pars_fragment:`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	varying vec2 vUv2;
#endif`,uv2_pars_vertex:`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
	uniform mat3 uv2Transform;
#endif`,uv2_vertex:`#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_frag:`uniform sampler2D t2D;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cube_frag:`#include <envmap_common_pars_fragment>
uniform float opacity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>
	gl_FragColor = envColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,depth_vert:`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	vec4 texColor = texture2D( tEquirect, sampleUV );
	gl_FragColor = mapTexelToLinear( texColor );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
	
		vec4 lightMapTexel= texture2D( lightMap, vUv2 );
		reflectedLight.indirectDiffuse += lightMapTexelToLinear( lightMapTexel ).rgb * lightMapIntensity;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshbasic_vert:`#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <skinbase_vertex>
	#ifdef USE_ENVMAP
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <fog_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <emissivemap_fragment>
	#ifdef DOUBLE_SIDED
		reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;
	#else
		reflectedLight.indirectDiffuse += vIndirectFront;
	#endif
	#include <lightmap_fragment>
	reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );
	#ifdef DOUBLE_SIDED
		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;
	#else
		reflectedLight.directDiffuse = vLightFront;
	#endif
	reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vLightFront;
varying vec3 vIndirectFront;
#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <bsdfs>
#include <lights_pars_begin>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <lights_lambert_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <fog_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
		matcapColor = matcapTexelToLinear( matcapColor );
	#else
		vec4 matcapColor = vec4( 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#ifndef FLAT_SHADED
		vNormal = normalize( transformedNormal );
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define REFLECTIVITY
	#define CLEARCOAT
	#define TRANSMISSION
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef TRANSMISSION
	uniform float transmission;
#endif
#ifdef REFLECTIVITY
	uniform float reflectivity;
#endif
#ifdef CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheen;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <transmissionmap_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <lights_physical_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#ifdef TRANSMISSION
		float totalTransmission = transmission;
	#endif
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <transmissionmap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#ifdef TRANSMISSION
		diffuseColor.a *= mix( saturate( 1. - totalTransmission + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) ), 1.0, metalness );
	#endif
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,normal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <packing>
#include <uv_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
}`,normal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	varying vec3 vViewPosition;
#endif
#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
	vViewPosition = - mvPosition.xyz;
#endif
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,shadow_vert:`#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <begin_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	outgoingLight = diffuseColor.rgb;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`},V={common:{diffuse:{value:new I(15658734)},opacity:{value:1},map:{value:null},uvTransform:{value:new at},uv2Transform:{value:new at},alphaMap:{value:null}},specularmap:{specularMap:{value:null}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},refractionRatio:{value:.98},maxMipLevel:{value:0}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1}},emissivemap:{emissiveMap:{value:null}},bumpmap:{bumpMap:{value:null},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalScale:{value:new M(1,1)}},displacementmap:{displacementMap:{value:null},displacementScale:{value:1},displacementBias:{value:0}},roughnessmap:{roughnessMap:{value:null}},metalnessmap:{metalnessMap:{value:null}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new I(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotShadowMap:{value:[]},spotShadowMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new I(15658734)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},uvTransform:{value:new at}},sprite:{diffuse:{value:new I(15658734)},opacity:{value:1},center:{value:new M(.5,.5)},rotation:{value:0},map:{value:null},alphaMap:{value:null},uvTransform:{value:new at}}},Br={basic:{uniforms:xr([V.common,V.specularmap,V.envmap,V.aomap,V.lightmap,V.fog]),vertexShader:B.meshbasic_vert,fragmentShader:B.meshbasic_frag},lambert:{uniforms:xr([V.common,V.specularmap,V.envmap,V.aomap,V.lightmap,V.emissivemap,V.fog,V.lights,{emissive:{value:new I(0)}}]),vertexShader:B.meshlambert_vert,fragmentShader:B.meshlambert_frag},phong:{uniforms:xr([V.common,V.specularmap,V.envmap,V.aomap,V.lightmap,V.emissivemap,V.bumpmap,V.normalmap,V.displacementmap,V.fog,V.lights,{emissive:{value:new I(0)},specular:{value:new I(1118481)},shininess:{value:30}}]),vertexShader:B.meshphong_vert,fragmentShader:B.meshphong_frag},standard:{uniforms:xr([V.common,V.envmap,V.aomap,V.lightmap,V.emissivemap,V.bumpmap,V.normalmap,V.displacementmap,V.roughnessmap,V.metalnessmap,V.fog,V.lights,{emissive:{value:new I(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:B.meshphysical_vert,fragmentShader:B.meshphysical_frag},toon:{uniforms:xr([V.common,V.aomap,V.lightmap,V.emissivemap,V.bumpmap,V.normalmap,V.displacementmap,V.gradientmap,V.fog,V.lights,{emissive:{value:new I(0)}}]),vertexShader:B.meshtoon_vert,fragmentShader:B.meshtoon_frag},matcap:{uniforms:xr([V.common,V.bumpmap,V.normalmap,V.displacementmap,V.fog,{matcap:{value:null}}]),vertexShader:B.meshmatcap_vert,fragmentShader:B.meshmatcap_frag},points:{uniforms:xr([V.points,V.fog]),vertexShader:B.points_vert,fragmentShader:B.points_frag},dashed:{uniforms:xr([V.common,V.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:B.linedashed_vert,fragmentShader:B.linedashed_frag},depth:{uniforms:xr([V.common,V.displacementmap]),vertexShader:B.depth_vert,fragmentShader:B.depth_frag},normal:{uniforms:xr([V.common,V.bumpmap,V.normalmap,V.displacementmap,{opacity:{value:1}}]),vertexShader:B.normal_vert,fragmentShader:B.normal_frag},sprite:{uniforms:xr([V.sprite,V.fog]),vertexShader:B.sprite_vert,fragmentShader:B.sprite_frag},background:{uniforms:{uvTransform:{value:new at},t2D:{value:null}},vertexShader:B.background_vert,fragmentShader:B.background_frag},cube:{uniforms:xr([V.envmap,{opacity:{value:1}}]),vertexShader:B.cube_vert,fragmentShader:B.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:B.equirect_vert,fragmentShader:B.equirect_frag},distanceRGBA:{uniforms:xr([V.common,V.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:B.distanceRGBA_vert,fragmentShader:B.distanceRGBA_frag},shadow:{uniforms:xr([V.lights,V.fog,{color:{value:new I(0)},opacity:{value:1}}]),vertexShader:B.shadow_vert,fragmentShader:B.shadow_frag}};Br.physical={uniforms:xr([Br.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatNormalScale:{value:new M(1,1)},clearcoatNormalMap:{value:null},sheen:{value:new I(0)},transmission:{value:0},transmissionMap:{value:null}}]),vertexShader:B.meshphysical_vert,fragmentShader:B.meshphysical_frag};function Vr(e,t,n,r,i){let a=new I(0),o=0,s,c,l=null,u=0,d=null;function f(n,i,f,m){let h=i.isScene===!0?i.background:null;h&&h.isTexture&&(h=t.get(h));let g=e.xr,_=g.getSession&&g.getSession();_&&_.environmentBlendMode===`additive`&&(h=null),h===null?p(a,o):h&&h.isColor&&(p(h,1),m=!0),(e.autoClear||m)&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),h&&(h.isCubeTexture||h.mapping===306)?(c===void 0&&(c=new gr(new yr(1,1,1),new Tr({name:`BackgroundCubeMaterial`,uniforms:br(Br.cube.uniforms),vertexShader:Br.cube.vertexShader,fragmentShader:Br.cube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute(`normal`),c.geometry.deleteAttribute(`uv`),c.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(c)),c.material.uniforms.envMap.value=h,c.material.uniforms.flipEnvMap.value=h.isCubeTexture&&h._needsFlipEnvMap?-1:1,(l!==h||u!==h.version||d!==e.toneMapping)&&(c.material.needsUpdate=!0,l=h,u=h.version,d=e.toneMapping),n.unshift(c,c.geometry,c.material,0,0,null)):h&&h.isTexture&&(s===void 0&&(s=new gr(new zr(2,2),new Tr({name:`BackgroundMaterial`,uniforms:br(Br.background.uniforms),vertexShader:Br.background.vertexShader,fragmentShader:Br.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),s.geometry.deleteAttribute(`normal`),Object.defineProperty(s.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(s)),s.material.uniforms.t2D.value=h,h.matrixAutoUpdate===!0&&h.updateMatrix(),s.material.uniforms.uvTransform.value.copy(h.matrix),(l!==h||u!==h.version||d!==e.toneMapping)&&(s.material.needsUpdate=!0,l=h,u=h.version,d=e.toneMapping),n.unshift(s,s.geometry,s.material,0,0,null))}function p(e,t){n.buffers.color.setClear(e.r,e.g,e.b,t,i)}return{getClearColor:function(){return a},setClearColor:function(e,t=1){a.set(e),o=t,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(e){o=e,p(a,o)},render:f}}function Hr(e,t,n,r){let i=e.getParameter(34921),a=r.isWebGL2?null:t.get(`OES_vertex_array_object`),o=r.isWebGL2||a!==null,s={},c=h(null),l=c;function u(t,r,i,a,s){let c=!1;if(o){let e=m(a,i,r);l!==e&&(l=e,f(l.object)),c=g(a,s),c&&_(a,s)}else{let e=r.wireframe===!0;(l.geometry!==a.id||l.program!==i.id||l.wireframe!==e)&&(l.geometry=a.id,l.program=i.id,l.wireframe=e,c=!0)}t.isInstancedMesh===!0&&(c=!0),s!==null&&n.update(s,34963),c&&(C(t,r,i,a),s!==null&&e.bindBuffer(34963,n.get(s).buffer))}function d(){return r.isWebGL2?e.createVertexArray():a.createVertexArrayOES()}function f(t){return r.isWebGL2?e.bindVertexArray(t):a.bindVertexArrayOES(t)}function p(t){return r.isWebGL2?e.deleteVertexArray(t):a.deleteVertexArrayOES(t)}function m(e,t,n){let r=n.wireframe===!0,i=s[e.id];i===void 0&&(i={},s[e.id]=i);let a=i[t.id];a===void 0&&(a={},i[t.id]=a);let o=a[r];return o===void 0&&(o=h(d()),a[r]=o),o}function h(e){let t=[],n=[],r=[];for(let e=0;e<i;e++)t[e]=0,n[e]=0,r[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:n,attributeDivisors:r,object:e,attributes:{},index:null}}function g(e,t){let n=l.attributes,r=e.attributes,i=0;for(let e in r){let t=n[e],a=r[e];if(t===void 0||t.attribute!==a||t.data!==a.data)return!0;i++}return l.attributesNum!==i||l.index!==t}function _(e,t){let n={},r=e.attributes,i=0;for(let e in r){let t=r[e],a={};a.attribute=t,t.data&&(a.data=t.data),n[e]=a,i++}l.attributes=n,l.attributesNum=i,l.index=t}function v(){let e=l.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function y(e){b(e,0)}function b(n,i){let a=l.newAttributes,o=l.enabledAttributes,s=l.attributeDivisors;a[n]=1,o[n]===0&&(e.enableVertexAttribArray(n),o[n]=1),s[n]!==i&&((r.isWebGL2?e:t.get(`ANGLE_instanced_arrays`))[r.isWebGL2?`vertexAttribDivisor`:`vertexAttribDivisorANGLE`](n,i),s[n]=i)}function x(){let t=l.newAttributes,n=l.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function S(t,n,i,a,o,s){r.isWebGL2===!0&&(i===5124||i===5125)?e.vertexAttribIPointer(t,n,i,o,s):e.vertexAttribPointer(t,n,i,a,o,s)}function C(i,a,o,s){if(r.isWebGL2===!1&&(i.isInstancedMesh||s.isInstancedBufferGeometry)&&t.get(`ANGLE_instanced_arrays`)===null)return;v();let c=s.attributes,l=o.getAttributes(),u=a.defaultAttributeValues;for(let t in l){let r=l[t];if(r>=0){let a=c[t];if(a!==void 0){let t=a.normalized,i=a.itemSize,o=n.get(a);if(o===void 0)continue;let c=o.buffer,l=o.type,u=o.bytesPerElement;if(a.isInterleavedBufferAttribute){let n=a.data,o=n.stride,d=a.offset;n&&n.isInstancedInterleavedBuffer?(b(r,n.meshPerAttribute),s._maxInstanceCount===void 0&&(s._maxInstanceCount=n.meshPerAttribute*n.count)):y(r),e.bindBuffer(34962,c),S(r,i,l,t,o*u,d*u)}else a.isInstancedBufferAttribute?(b(r,a.meshPerAttribute),s._maxInstanceCount===void 0&&(s._maxInstanceCount=a.meshPerAttribute*a.count)):y(r),e.bindBuffer(34962,c),S(r,i,l,t,0,0)}else if(t===`instanceMatrix`){let t=n.get(i.instanceMatrix);if(t===void 0)continue;let a=t.buffer,o=t.type;b(r+0,1),b(r+1,1),b(r+2,1),b(r+3,1),e.bindBuffer(34962,a),e.vertexAttribPointer(r+0,4,o,!1,64,0),e.vertexAttribPointer(r+1,4,o,!1,64,16),e.vertexAttribPointer(r+2,4,o,!1,64,32),e.vertexAttribPointer(r+3,4,o,!1,64,48)}else if(t===`instanceColor`){let t=n.get(i.instanceColor);if(t===void 0)continue;let a=t.buffer,o=t.type;b(r,1),e.bindBuffer(34962,a),e.vertexAttribPointer(r,3,o,!1,12,0)}else if(u!==void 0){let n=u[t];if(n!==void 0)switch(n.length){case 2:e.vertexAttrib2fv(r,n);break;case 3:e.vertexAttrib3fv(r,n);break;case 4:e.vertexAttrib4fv(r,n);break;default:e.vertexAttrib1fv(r,n)}}}}x()}function w(){D();for(let e in s){let t=s[e];for(let e in t){let n=t[e];for(let e in n)p(n[e].object),delete n[e];delete t[e]}delete s[e]}}function T(e){if(s[e.id]===void 0)return;let t=s[e.id];for(let e in t){let n=t[e];for(let e in n)p(n[e].object),delete n[e];delete t[e]}delete s[e.id]}function E(e){for(let t in s){let n=s[t];if(n[e.id]===void 0)continue;let r=n[e.id];for(let e in r)p(r[e].object),delete r[e];delete n[e.id]}}function D(){ee(),l!==c&&(l=c,f(l.object))}function ee(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:D,resetDefaultState:ee,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:y,disableUnusedAttributes:x}}function Ur(e,t,n,r){let i=r.isWebGL2,a;function o(e){a=e}function s(t,r){e.drawArrays(a,t,r),n.update(r,a,1)}function c(r,o,s){if(s===0)return;let c,l;if(i)c=e,l=`drawArraysInstanced`;else if(c=t.get(`ANGLE_instanced_arrays`),l=`drawArraysInstancedANGLE`,c===null){console.error(`THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.`);return}c[l](a,r,o,s),n.update(o,a,s)}this.setMode=o,this.render=s,this.renderInstances=c}function Wr(e,t,n){let r;function i(){if(r!==void 0)return r;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);r=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(t){if(t===`highp`){if(e.getShaderPrecisionFormat(35633,36338).precision>0&&e.getShaderPrecisionFormat(35632,36338).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(35633,36337).precision>0&&e.getShaderPrecisionFormat(35632,36337).precision>0?`mediump`:`lowp`}let o=typeof WebGL2RenderingContext<`u`&&e instanceof WebGL2RenderingContext||typeof WebGL2ComputeRenderingContext<`u`&&e instanceof WebGL2ComputeRenderingContext,s=n.precision===void 0?`highp`:n.precision,c=a(s);c!==s&&(console.warn(`THREE.WebGLRenderer:`,s,`not supported, using`,c,`instead.`),s=c);let l=n.logarithmicDepthBuffer===!0,u=e.getParameter(34930),d=e.getParameter(35660),f=e.getParameter(3379),p=e.getParameter(34076),m=e.getParameter(34921),h=e.getParameter(36347),g=e.getParameter(36348),_=e.getParameter(36349),v=d>0,y=o||t.has(`OES_texture_float`),b=v&&y,x=o?e.getParameter(36183):0;return{isWebGL2:o,getMaxAnisotropy:i,getMaxPrecision:a,precision:s,logarithmicDepthBuffer:l,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:h,maxVaryings:g,maxFragmentUniforms:_,vertexTextures:v,floatFragmentTextures:y,floatVertexTextures:b,maxSamples:x}}function Gr(e){let t=this,n=null,r=0,i=!1,a=!1,o=new yn,s=new at,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t,a){let o=e.length!==0||t||r!==0||i;return i=t,n=u(e,a,0),r=e.length,o},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1,l()},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}function Kr(e){let t=new WeakMap;function n(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function r(r){if(r&&r.isTexture){let a=r.mapping;if(a===303||a===304){if(t.has(r)){let e=t.get(r).texture;return n(e,r.mapping)}{let a=r.image;if(a&&a.height>0){let o=e.getRenderTarget(),s=new Mr(a.height/2);return s.fromEquirectangularTexture(e,r),t.set(r,s),e.setRenderTarget(o),r.addEventListener(`dispose`,i),n(s.texture,r.mapping)}return null}}}return r}function i(e){let n=e.target;n.removeEventListener(`dispose`,i);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function a(){t=new WeakMap}return{get:r,dispose:a}}function qr(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r;switch(n){case`WEBGL_depth_texture`:r=e.getExtension(`WEBGL_depth_texture`)||e.getExtension(`MOZ_WEBGL_depth_texture`)||e.getExtension(`WEBKIT_WEBGL_depth_texture`);break;case`EXT_texture_filter_anisotropic`:r=e.getExtension(`EXT_texture_filter_anisotropic`)||e.getExtension(`MOZ_EXT_texture_filter_anisotropic`)||e.getExtension(`WEBKIT_EXT_texture_filter_anisotropic`);break;case`WEBGL_compressed_texture_s3tc`:r=e.getExtension(`WEBGL_compressed_texture_s3tc`)||e.getExtension(`MOZ_WEBGL_compressed_texture_s3tc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_s3tc`);break;case`WEBGL_compressed_texture_pvrtc`:r=e.getExtension(`WEBGL_compressed_texture_pvrtc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_pvrtc`);break;default:r=e.getExtension(n)}return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(e){e.isWebGL2?n(`EXT_color_buffer_float`):(n(`WEBGL_depth_texture`),n(`OES_texture_float`),n(`OES_texture_half_float`),n(`OES_texture_half_float_linear`),n(`OES_standard_derivatives`),n(`OES_element_index_uint`),n(`OES_vertex_array_object`),n(`ANGLE_instanced_arrays`)),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`)},get:function(e){let t=n(e);return t===null&&console.warn(`THREE.WebGLRenderer: `+e+` extension not supported.`),t}}}function Jr(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(e){let n=e.attributes;for(let e in n)t.update(n[e],34962);let r=e.morphAttributes;for(let e in r){let n=r[e];for(let e=0,r=n.length;e<r;e++)t.update(n[e],34962)}}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(Gn(n)>65535?Un:Hn)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Yr(e,t,n,r){let i=r.isWebGL2,a;function o(e){a=e}let s,c;function l(e){s=e.type,c=e.bytesPerElement}function u(t,r){e.drawElements(a,r,s,t*c),n.update(r,a,1)}function d(r,o,l){if(l===0)return;let u,d;if(i)u=e,d=`drawElementsInstanced`;else if(u=t.get(`ANGLE_instanced_arrays`),d=`drawElementsInstancedANGLE`,u===null){console.error(`THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.`);return}u[d](a,o,s,r*c,l),n.update(o,a,l)}this.setMode=o,this.setIndex=l,this.render=u,this.renderInstances=d}function Xr(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(e,t,r){switch(n.calls++,t){case 4:n.triangles+=e/3*r;break;case 1:n.lines+=e/2*r;break;case 3:n.lines+=r*(e-1);break;case 2:n.lines+=r*e;break;case 0:n.points+=r*e;break;default:console.error(`THREE.WebGLInfo: Unknown draw mode:`,t)}}function i(){n.frame++,n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Zr(e,t){return e[0]-t[0]}function Qr(e,t){return Math.abs(t[1])-Math.abs(e[1])}function $r(e){let t={},n=new Float32Array(8),r=[];for(let e=0;e<8;e++)r[e]=[e,0];function i(i,a,o,s){let c=i.morphTargetInfluences,l=c===void 0?0:c.length,u=t[a.id];if(u===void 0){u=[];for(let e=0;e<l;e++)u[e]=[e,0];t[a.id]=u}for(let e=0;e<l;e++){let t=u[e];t[0]=e,t[1]=c[e]}u.sort(Qr);for(let e=0;e<8;e++)e<l&&u[e][1]?(r[e][0]=u[e][0],r[e][1]=u[e][1]):(r[e][0]=2**53-1,r[e][1]=0);r.sort(Zr);let d=o.morphTargets&&a.morphAttributes.position,f=o.morphNormals&&a.morphAttributes.normal,p=0;for(let e=0;e<8;e++){let t=r[e],i=t[0],o=t[1];i!==2**53-1&&o?(d&&a.getAttribute(`morphTarget`+e)!==d[i]&&a.setAttribute(`morphTarget`+e,d[i]),f&&a.getAttribute(`morphNormal`+e)!==f[i]&&a.setAttribute(`morphNormal`+e,f[i]),n[e]=o,p+=o):(d&&a.hasAttribute(`morphTarget`+e)===!0&&a.deleteAttribute(`morphTarget`+e),f&&a.hasAttribute(`morphNormal`+e)===!0&&a.deleteAttribute(`morphNormal`+e),n[e]=0)}let m=a.morphTargetsRelative?1:1-p;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,m),s.getUniforms().setValue(e,`morphTargetInfluences`,n)}return{update:i}}function ei(e,t,n,r){let i=new WeakMap;function a(e){let a=r.render.frame,o=e.geometry,c=t.get(e,o);return i.get(c)!==a&&(t.update(c),i.set(c,a)),e.isInstancedMesh&&(e.hasEventListener(`dispose`,s)===!1&&e.addEventListener(`dispose`,s),n.update(e.instanceMatrix,34962),e.instanceColor!==null&&n.update(e.instanceColor,34962)),c}function o(){i=new WeakMap}function s(e){let t=e.target;t.removeEventListener(`dispose`,s),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:a,dispose:o}}var ti=class extends lt{constructor(e=null,t=1,n=1,r=1){super(null),this.image={data:e,width:t,height:n,depth:r},this.magFilter=A,this.minFilter=A,this.wrapR=de,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}};ti.prototype.isDataTexture2DArray=!0;var ni=class extends lt{constructor(e=null,t=1,n=1,r=1){super(null),this.image={data:e,width:t,height:n,depth:r},this.magFilter=A,this.minFilter=A,this.wrapR=de,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.needsUpdate=!0}};ni.prototype.isDataTexture3D=!0;var ri=new lt,ii=new ti,ai=new ni,oi=new jr,si=[],ci=[],li=new Float32Array(16),ui=new Float32Array(9),di=new Float32Array(4);function fi(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=si[i];if(a===void 0&&(a=new Float32Array(i),si[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function pi(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function mi(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function hi(e,t){let n=ci[t];n===void 0&&(n=new Int32Array(t),ci[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function gi(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function _i(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(pi(n,t))return;e.uniform2fv(this.addr,t),mi(n,t)}}function vi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(pi(n,t))return;e.uniform3fv(this.addr,t),mi(n,t)}}function yi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(pi(n,t))return;e.uniform4fv(this.addr,t),mi(n,t)}}function bi(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(pi(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),mi(n,t)}else{if(pi(n,r))return;di.set(r),e.uniformMatrix2fv(this.addr,!1,di),mi(n,r)}}function xi(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(pi(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),mi(n,t)}else{if(pi(n,r))return;ui.set(r),e.uniformMatrix3fv(this.addr,!1,ui),mi(n,r)}}function Si(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(pi(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),mi(n,t)}else{if(pi(n,r))return;li.set(r),e.uniformMatrix4fv(this.addr,!1,li),mi(n,r)}}function Ci(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function wi(e,t){let n=this.cache;pi(n,t)||(e.uniform2iv(this.addr,t),mi(n,t))}function Ti(e,t){let n=this.cache;pi(n,t)||(e.uniform3iv(this.addr,t),mi(n,t))}function Ei(e,t){let n=this.cache;pi(n,t)||(e.uniform4iv(this.addr,t),mi(n,t))}function Di(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Oi(e,t){let n=this.cache;pi(n,t)||(e.uniform2uiv(this.addr,t),mi(n,t))}function ki(e,t){let n=this.cache;pi(n,t)||(e.uniform3uiv(this.addr,t),mi(n,t))}function Ai(e,t){let n=this.cache;pi(n,t)||(e.uniform4uiv(this.addr,t),mi(n,t))}function ji(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.safeSetTexture2D(t||ri,i)}function Mi(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||ai,i)}function Ni(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.safeSetTextureCube(t||oi,i)}function Pi(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||ii,i)}function Fi(e){switch(e){case 5126:return gi;case 35664:return _i;case 35665:return vi;case 35666:return yi;case 35674:return bi;case 35675:return xi;case 35676:return Si;case 5124:case 35670:return Ci;case 35667:case 35671:return wi;case 35668:case 35672:return Ti;case 35669:case 35673:return Ei;case 5125:return Di;case 36294:return Oi;case 36295:return ki;case 36296:return Ai;case 35678:case 36198:case 36298:case 36306:case 35682:return ji;case 35679:case 36299:case 36307:return Mi;case 35680:case 36300:case 36308:case 36293:return Ni;case 36289:case 36303:case 36311:case 36292:return Pi}}function Ii(e,t){e.uniform1fv(this.addr,t)}function Li(e,t){let n=fi(t,this.size,2);e.uniform2fv(this.addr,n)}function Ri(e,t){let n=fi(t,this.size,3);e.uniform3fv(this.addr,n)}function zi(e,t){let n=fi(t,this.size,4);e.uniform4fv(this.addr,n)}function Bi(e,t){let n=fi(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Vi(e,t){let n=fi(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Hi(e,t){let n=fi(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Ui(e,t){e.uniform1iv(this.addr,t)}function Wi(e,t){e.uniform2iv(this.addr,t)}function Gi(e,t){e.uniform3iv(this.addr,t)}function Ki(e,t){e.uniform4iv(this.addr,t)}function qi(e,t){e.uniform1uiv(this.addr,t)}function Ji(e,t){e.uniform2uiv(this.addr,t)}function Yi(e,t){e.uniform3uiv(this.addr,t)}function Xi(e,t){e.uniform4uiv(this.addr,t)}function Zi(e,t,n){let r=t.length,i=hi(n,r);e.uniform1iv(this.addr,i);for(let e=0;e!==r;++e)n.safeSetTexture2D(t[e]||ri,i[e])}function Qi(e,t,n){let r=t.length,i=hi(n,r);e.uniform1iv(this.addr,i);for(let e=0;e!==r;++e)n.safeSetTextureCube(t[e]||oi,i[e])}function $i(e){switch(e){case 5126:return Ii;case 35664:return Li;case 35665:return Ri;case 35666:return zi;case 35674:return Bi;case 35675:return Vi;case 35676:return Hi;case 5124:case 35670:return Ui;case 35667:case 35671:return Wi;case 35668:case 35672:return Gi;case 35669:case 35673:return Ki;case 5125:return qi;case 36294:return Ji;case 36295:return Yi;case 36296:return Xi;case 35678:case 36198:case 36298:case 36306:case 35682:return Zi;case 35680:case 36300:case 36308:case 36293:return Qi}}function ea(e,t,n){this.id=e,this.addr=n,this.cache=[],this.setValue=Fi(t.type)}function ta(e,t,n){this.id=e,this.addr=n,this.cache=[],this.size=t.size,this.setValue=$i(t.type)}ta.prototype.updateCache=function(e){let t=this.cache;e instanceof Float32Array&&t.length!==e.length&&(this.cache=new Float32Array(e.length)),mi(t,e)};function na(e){this.id=e,this.seq=[],this.map={}}na.prototype.setValue=function(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}};var ra=/(\w+)(\])?(\[|\.)?/g;function ia(e,t){e.seq.push(t),e.map[t.id]=t}function aa(e,t,n){let r=e.name,i=r.length;for(ra.lastIndex=0;;){let a=ra.exec(r),o=ra.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){ia(n,l===void 0?new ea(s,e,t):new ta(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new na(s),ia(n,e)),n=e}}}function oa(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,35718);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);aa(n,e.getUniformLocation(t,n.name),this)}}oa.prototype.setValue=function(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)},oa.prototype.setOptional=function(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)},oa.upload=function(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}},oa.seqWithValue=function(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n};function sa(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var ca=0;function la(e){let t=e.split(`
`);for(let e=0;e<t.length;e++)t[e]=e+1+`: `+t[e];return t.join(`
`)}function ua(e){switch(e){case Fe:return[`Linear`,`( value )`];case Ie:return[`sRGB`,`( value )`];case Re:return[`RGBE`,`( value )`];case Be:return[`RGBM`,`( value, 7.0 )`];case Ve:return[`RGBM`,`( value, 16.0 )`];case He:return[`RGBD`,`( value, 256.0 )`];case Le:return[`Gamma`,`( value, float( GAMMA_FACTOR ) )`];case ze:return[`LogLuv`,`( value )`];default:return console.warn(`THREE.WebGLProgram: Unsupported encoding:`,e),[`Linear`,`( value )`]}}function da(e,t,n){let r=e.getShaderParameter(t,35713),i=e.getShaderInfoLog(t).trim();if(r&&i===``)return``;let a=e.getShaderSource(t);return`THREE.WebGLShader: gl.getShaderInfoLog() `+n+`
`+i+la(a)}function fa(e,t){let n=ua(t);return`vec4 `+e+`( vec4 value ) { return `+n[0]+`ToLinear`+n[1]+`; }`}function pa(e,t){let n=ua(t);return`vec4 `+e+`( vec4 value ) { return LinearTo`+n[0]+n[1]+`; }`}function ma(e,t){let n;switch(t){case 1:n=`Linear`;break;case 2:n=`Reinhard`;break;case 3:n=`OptimizedCineon`;break;case 4:n=`ACESFilmic`;break;case 5:n=`Custom`;break;default:console.warn(`THREE.WebGLProgram: Unsupported toneMapping:`,t),n=`Linear`}return`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}function ha(e){return[e.extensionDerivatives||e.envMapCubeUV||e.bumpMap||e.tangentSpaceNormalMap||e.clearcoatNormalMap||e.flatShading||e.shaderID===`physical`?`#extension GL_OES_standard_derivatives : enable`:``,(e.extensionFragDepth||e.logarithmicDepthBuffer)&&e.rendererExtensionFragDepth?`#extension GL_EXT_frag_depth : enable`:``,e.extensionDrawBuffers&&e.rendererExtensionDrawBuffers?`#extension GL_EXT_draw_buffers : require`:``,(e.extensionShaderTextureLOD||e.envMap)&&e.rendererExtensionShaderTextureLod?`#extension GL_EXT_shader_texture_lod : enable`:``].filter(va).join(`
`)}function ga(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function _a(e,t){let n={},r=e.getProgramParameter(t,35721);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i).name;n[r]=e.getAttribLocation(t,r)}return n}function va(e){return e!==``}function ya(e,t){return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ba(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var xa=/^[ \t]*#include +<([\w\d./]+)>/gm;function Sa(e){return e.replace(xa,Ca)}function Ca(e,t){let n=B[t];if(n===void 0)throw Error(`Can not resolve #include <`+t+`>`);return Sa(n)}var wa=/#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g,Ta=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ea(e){return e.replace(Ta,Oa).replace(wa,Da)}function Da(e,t,n,r){return console.warn(`WebGLProgram: #pragma unroll_loop shader syntax is deprecated. Please use #pragma unroll_loop_start syntax instead.`),Oa(e,t,n,r)}function Oa(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function ka(e){let t=`precision `+e.precision+` float;
precision `+e.precision+` int;`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}function Aa(e){let t=`SHADOWMAP_TYPE_BASIC`;return e.shadowMapType===1?t=`SHADOWMAP_TYPE_PCF`:e.shadowMapType===2?t=`SHADOWMAP_TYPE_PCF_SOFT`:e.shadowMapType===3&&(t=`SHADOWMAP_TYPE_VSM`),t}function ja(e){let t=`ENVMAP_TYPE_CUBE`;if(e.envMap)switch(e.envMapMode){case 301:case 302:t=`ENVMAP_TYPE_CUBE`;break;case 306:case 307:t=`ENVMAP_TYPE_CUBE_UV`}return t}function Ma(e){let t=`ENVMAP_MODE_REFLECTION`;if(e.envMap)switch(e.envMapMode){case 302:case 307:t=`ENVMAP_MODE_REFRACTION`}return t}function Na(e){let t=`ENVMAP_BLENDING_NONE`;if(e.envMap)switch(e.combine){case 0:t=`ENVMAP_BLENDING_MULTIPLY`;break;case 1:t=`ENVMAP_BLENDING_MIX`;break;case 2:t=`ENVMAP_BLENDING_ADD`}return t}function Pa(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Aa(n),l=ja(n),u=Ma(n),d=Na(n),f=e.gammaFactor>0?e.gammaFactor:1,p=n.isWebGL2?``:ha(n),m=ga(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[m].filter(va).join(`
`),g.length>0&&(g+=`
`),_=[p,m].filter(va).join(`
`),_.length>0&&(_+=`
`)):(g=[ka(n),`#define SHADER_NAME `+n.shaderName,m,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.supportsVertexTextures?`#define VERTEX_TEXTURES`:``,`#define GAMMA_FACTOR `+f,`#define MAX_BONES `+n.maxBones,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMap&&n.objectSpaceNormalMap?`#define OBJECTSPACE_NORMALMAP`:``,n.normalMap&&n.tangentSpaceNormalMap?`#define TANGENTSPACE_NORMALMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.displacementMap&&n.supportsVertexTextures?`#define USE_DISPLACEMENTMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.vertexTangents?`#define USE_TANGENT`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUvs?`#define USE_UV`:``,n.uvsVertexOnly?`#define UVS_VERTEX_ONLY`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.useVertexTexture?`#define BONE_TEXTURE`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.logarithmicDepthBuffer?`#define USE_LOGDEPTHBUF`:``,n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?`#define USE_LOGDEPTHBUF_EXT`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_MORPHTARGETS`,`	attribute vec3 morphTarget0;`,`	attribute vec3 morphTarget1;`,`	attribute vec3 morphTarget2;`,`	attribute vec3 morphTarget3;`,`	#ifdef USE_MORPHNORMALS`,`		attribute vec3 morphNormal0;`,`		attribute vec3 morphNormal1;`,`		attribute vec3 morphNormal2;`,`		attribute vec3 morphNormal3;`,`	#else`,`		attribute vec3 morphTarget4;`,`		attribute vec3 morphTarget5;`,`		attribute vec3 morphTarget6;`,`		attribute vec3 morphTarget7;`,`	#endif`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(va).join(`
`),_=[p,ka(n),`#define SHADER_NAME `+n.shaderName,m,n.alphaTest?`#define ALPHATEST `+n.alphaTest+(n.alphaTest%1?``:`.0`):``,`#define GAMMA_FACTOR `+f,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMap&&n.objectSpaceNormalMap?`#define OBJECTSPACE_NORMALMAP`:``,n.normalMap&&n.tangentSpaceNormalMap?`#define TANGENTSPACE_NORMALMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.sheen?`#define USE_SHEEN`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.vertexTangents?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUvs?`#define USE_UV`:``,n.uvsVertexOnly?`#define UVS_VERTEX_ONLY`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.physicallyCorrectLights?`#define PHYSICALLY_CORRECT_LIGHTS`:``,n.logarithmicDepthBuffer?`#define USE_LOGDEPTHBUF`:``,n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?`#define USE_LOGDEPTHBUF_EXT`:``,(n.extensionShaderTextureLOD||n.envMap)&&n.rendererExtensionShaderTextureLod?`#define TEXTURE_LOD_EXT`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:B.tonemapping_pars_fragment,n.toneMapping===0?``:ma(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,B.encodings_pars_fragment,n.map?fa(`mapTexelToLinear`,n.mapEncoding):``,n.matcap?fa(`matcapTexelToLinear`,n.matcapEncoding):``,n.envMap?fa(`envMapTexelToLinear`,n.envMapEncoding):``,n.emissiveMap?fa(`emissiveMapTexelToLinear`,n.emissiveMapEncoding):``,n.lightMap?fa(`lightMapTexelToLinear`,n.lightMapEncoding):``,pa(`linearToOutputTexel`,n.outputEncoding),n.depthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(va).join(`
`)),o=Sa(o),o=ya(o,n),o=ba(o,n),s=Sa(s),s=ya(s,n),s=ba(s,n),o=Ea(o),s=Ea(s),n.isWebGL2&&n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=`#define attribute in
#define varying out
#define texture2D texture
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=sa(i,35633,y),S=sa(i,35632,b);if(i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.morphTargets===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h),e.debug.checkShaderErrors){let e=i.getProgramInfoLog(h).trim(),t=i.getShaderInfoLog(x).trim(),n=i.getShaderInfoLog(S).trim(),r=!0,a=!0;if(i.getProgramParameter(h,35714)===!1){r=!1;let t=da(i,x,`vertex`),n=da(i,S,`fragment`);console.error(`THREE.WebGLProgram: shader error: `,i.getError(),`35715`,i.getProgramParameter(h,35715),`gl.getProgramInfoLog`,e,t,n)}else e===``?(t===``||n===``)&&(a=!1):console.warn(`THREE.WebGLProgram: gl.getProgramInfoLog()`,e);a&&(this.diagnostics={runnable:r,programLog:e,vertexShader:{log:t,prefix:g},fragmentShader:{log:n,prefix:_}})}i.deleteShader(x),i.deleteShader(S);let C;this.getUniforms=function(){return C===void 0&&(C=new oa(i,h)),C};let w;return this.getAttributes=function(){return w===void 0&&(w=_a(i,h)),w},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.name=n.shaderName,this.id=ca++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}function Fa(e,t,n,r,i,a){let o=[],s=r.isWebGL2,c=r.logarithmicDepthBuffer,l=r.floatVertexTextures,u=r.maxVertexUniforms,d=r.vertexTextures,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distanceRGBA`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`},m=`precision.isWebGL2.supportsVertexTextures.outputEncoding.instancing.instancingColor.map.mapEncoding.matcap.matcapEncoding.envMap.envMapMode.envMapEncoding.envMapCubeUV.lightMap.lightMapEncoding.aoMap.emissiveMap.emissiveMapEncoding.bumpMap.normalMap.objectSpaceNormalMap.tangentSpaceNormalMap.clearcoatMap.clearcoatRoughnessMap.clearcoatNormalMap.displacementMap.specularMap.roughnessMap.metalnessMap.gradientMap.alphaMap.combine.vertexColors.vertexAlphas.vertexTangents.vertexUvs.uvsVertexOnly.fog.useFog.fogExp2.flatShading.sizeAttenuation.logarithmicDepthBuffer.skinning.maxBones.useVertexTexture.morphTargets.morphNormals.premultipliedAlpha.numDirLights.numPointLights.numSpotLights.numHemiLights.numRectAreaLights.numDirLightShadows.numPointLightShadows.numSpotLightShadows.shadowMapEnabled.shadowMapType.toneMapping.physicallyCorrectLights.alphaTest.doubleSided.flipSided.numClippingPlanes.numClipIntersection.depthPacking.dithering.sheen.transmissionMap`.split(`.`);function h(e){let t=e.skeleton.bones;if(l)return 1024;{let e=Math.floor((u-20)/4),n=Math.min(e,t.length);return n<t.length?(console.warn(`THREE.WebGLRenderer: Skeleton has `+t.length+` bones. This GPU supports `+n+`.`),0):n}}function g(e){let t;return e&&e.isTexture?t=e.encoding:e&&e.isWebGLRenderTarget?(console.warn(`THREE.WebGLPrograms.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead.`),t=e.texture.encoding):t=Fe,t}function _(i,o,u,m,_){let v=m.fog,y=i.isMeshStandardMaterial?m.environment:null,b=t.get(i.envMap||y),x=p[i.type],S=_.isSkinnedMesh?h(_):0;i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&console.warn(`THREE.WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let C,w;if(x){let e=Br[x];C=e.vertexShader,w=e.fragmentShader}else C=i.vertexShader,w=i.fragmentShader;let T=e.getRenderTarget();return{isWebGL2:s,shaderID:x,shaderName:i.type,vertexShader:C,fragmentShader:w,defines:i.defines,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,instancing:_.isInstancedMesh===!0,instancingColor:_.isInstancedMesh===!0&&_.instanceColor!==null,supportsVertexTextures:d,outputEncoding:T===null?e.outputEncoding:g(T.texture),map:!!i.map,mapEncoding:g(i.map),matcap:!!i.matcap,matcapEncoding:g(i.matcap),envMap:!!b,envMapMode:b&&b.mapping,envMapEncoding:g(b),envMapCubeUV:!!b&&(b.mapping===306||b.mapping===307),lightMap:!!i.lightMap,lightMapEncoding:g(i.lightMap),aoMap:!!i.aoMap,emissiveMap:!!i.emissiveMap,emissiveMapEncoding:g(i.emissiveMap),bumpMap:!!i.bumpMap,normalMap:!!i.normalMap,objectSpaceNormalMap:i.normalMapType===1,tangentSpaceNormalMap:i.normalMapType===0,clearcoatMap:!!i.clearcoatMap,clearcoatRoughnessMap:!!i.clearcoatRoughnessMap,clearcoatNormalMap:!!i.clearcoatNormalMap,displacementMap:!!i.displacementMap,roughnessMap:!!i.roughnessMap,metalnessMap:!!i.metalnessMap,specularMap:!!i.specularMap,alphaMap:!!i.alphaMap,gradientMap:!!i.gradientMap,sheen:!!i.sheen,transmissionMap:!!i.transmissionMap,combine:i.combine,vertexTangents:i.normalMap&&i.vertexTangents,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&_.geometry&&_.geometry.attributes.color&&_.geometry.attributes.color.itemSize===4,vertexUvs:!!i.map||!!i.bumpMap||!!i.normalMap||!!i.specularMap||!!i.alphaMap||!!i.emissiveMap||!!i.roughnessMap||!!i.metalnessMap||!!i.clearcoatMap||!!i.clearcoatRoughnessMap||!!i.clearcoatNormalMap||!!i.displacementMap||!!i.transmissionMap,uvsVertexOnly:!(i.map||i.bumpMap||i.normalMap||i.specularMap||i.alphaMap||i.emissiveMap||i.roughnessMap||i.metalnessMap||i.clearcoatNormalMap||i.transmissionMap)&&!!i.displacementMap,fog:!!v,useFog:i.fog,fogExp2:v&&v.isFogExp2,flatShading:!!i.flatShading,sizeAttenuation:i.sizeAttenuation,logarithmicDepthBuffer:c,skinning:i.skinning&&S>0,maxBones:S,useVertexTexture:l,morphTargets:i.morphTargets,morphNormals:i.morphNormals,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&u.length>0,shadowMapType:e.shadowMap.type,toneMapping:i.toneMapped?e.toneMapping:0,physicallyCorrectLights:e.physicallyCorrectLights,premultipliedAlpha:i.premultipliedAlpha,alphaTest:i.alphaTest,doubleSided:i.side===2,flipSided:i.side===1,depthPacking:i.depthPacking!==void 0&&i.depthPacking,index0AttributeName:i.index0AttributeName,extensionDerivatives:i.extensions&&i.extensions.derivatives,extensionFragDepth:i.extensions&&i.extensions.fragDepth,extensionDrawBuffers:i.extensions&&i.extensions.drawBuffers,extensionShaderTextureLOD:i.extensions&&i.extensions.shaderTextureLOD,rendererExtensionFragDepth:s||n.has(`EXT_frag_depth`),rendererExtensionDrawBuffers:s||n.has(`WEBGL_draw_buffers`),rendererExtensionShaderTextureLod:s||n.has(`EXT_shader_texture_lod`),customProgramCacheKey:i.customProgramCacheKey()}}function v(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.fragmentShader),n.push(t.vertexShader)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);if(t.isRawShaderMaterial===!1){for(let e=0;e<m.length;e++)n.push(t[m[e]]);n.push(e.outputEncoding),n.push(e.gammaFactor)}return n.push(t.customProgramCacheKey),n.join()}function y(e){let t=p[e.type],n;if(t){let e=Br[t];n=Sr.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r;for(let e=0,t=o.length;e<t;e++){let t=o[e];if(t.cacheKey===n){r=t,++r.usedTimes;break}}return r===void 0&&(r=new Pa(e,n,t,i),o.push(r)),r}function x(e){if(--e.usedTimes===0){let t=o.indexOf(e);o[t]=o[o.length-1],o.pop(),e.destroy()}}return{getParameters:_,getProgramCacheKey:v,getUniforms:y,acquireProgram:b,releaseProgram:x,programs:o}}function Ia(){let e=new WeakMap;function t(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function n(t){e.delete(t)}function r(t,n,r){e.get(t)[n]=r}function i(){e=new WeakMap}return{get:t,remove:n,update:r,dispose:i}}function La(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.program===t.program?e.material.id===t.material.id?e.z===t.z?e.id-t.id:e.z-t.z:e.material.id-t.material.id:e.program.id-t.program.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Ra(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function za(e){let t=[],n=0,r=[],i=[],a={id:-1};function o(){n=0,r.length=0,i.length=0}function s(r,i,o,s,c,l){let u=t[n],d=e.get(o);return u===void 0?(u={id:r.id,object:r,geometry:i,material:o,program:d.program||a,groupOrder:s,renderOrder:r.renderOrder,z:c,group:l},t[n]=u):(u.id=r.id,u.object=r,u.geometry=i,u.material=o,u.program=d.program||a,u.groupOrder=s,u.renderOrder=r.renderOrder,u.z=c,u.group=l),n++,u}function c(e,t,n,a,o,c){let l=s(e,t,n,a,o,c);(n.transparent===!0?i:r).push(l)}function l(e,t,n,a,o,c){let l=s(e,t,n,a,o,c);(n.transparent===!0?i:r).unshift(l)}function u(e,t){r.length>1&&r.sort(e||La),i.length>1&&i.sort(t||Ra)}function d(){for(let e=n,r=t.length;e<r;e++){let n=t[e];if(n.id===null)break;n.id=null,n.object=null,n.geometry=null,n.material=null,n.program=null,n.group=null}}return{opaque:r,transparent:i,init:o,push:c,unshift:l,finish:d,sort:u}}function Ba(e){let t=new WeakMap;function n(n,r){let i;return t.has(n)===!1?(i=new za(e),t.set(n,[i])):r>=t.get(n).length?(i=new za(e),t.get(n).push(i)):i=t.get(n)[r],i}function r(){t=new WeakMap}return{get:n,dispose:r}}function Va(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new P,color:new I};break;case`SpotLight`:n={position:new P,direction:new P,color:new I,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new P,color:new I,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new P,skyColor:new I,groundColor:new I};break;case`RectAreaLight`:n={color:new I,position:new P,halfWidth:new P,halfHeight:new P}}return e[t.id]=n,n}}}function Ha(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new M};break;case`SpotLight`:n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new M};break;case`PointLight`:n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new M,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Ua=0;function Wa(e,t){return+!!t.castShadow-!!e.castShadow}function Ga(e,t){let n=new Va,r=Ha(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotShadow:[],spotShadowMap:[],spotShadowMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[]};for(let e=0;e<9;e++)i.probe.push(new P);let a=new P,o=new F,s=new F;function c(a){let o=0,s=0,c=0;for(let e=0;e<9;e++)i.probe[e].set(0,0,0);let l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0;a.sort(Wa);for(let e=0,t=a.length;e<t;e++){let t=a[e],_=t.color,v=t.intensity,y=t.distance,b=t.shadow&&t.shadow.map?t.shadow.map.texture:null;if(t.isAmbientLight)o+=_.r*v,s+=_.g*v,c+=_.b*v;else if(t.isLightProbe)for(let e=0;e<9;e++)i.probe[e].addScaledVector(t.sh.coefficients[e],v);else if(t.isDirectionalLight){let e=n.get(t);if(e.color.copy(t.color).multiplyScalar(t.intensity),t.castShadow){let e=t.shadow,n=r.get(t);n.shadowBias=e.bias,n.shadowNormalBias=e.normalBias,n.shadowRadius=e.radius,n.shadowMapSize=e.mapSize,i.directionalShadow[l]=n,i.directionalShadowMap[l]=b,i.directionalShadowMatrix[l]=t.shadow.matrix,m++}i.directional[l]=e,l++}else if(t.isSpotLight){let e=n.get(t);if(e.position.setFromMatrixPosition(t.matrixWorld),e.color.copy(_).multiplyScalar(v),e.distance=y,e.coneCos=Math.cos(t.angle),e.penumbraCos=Math.cos(t.angle*(1-t.penumbra)),e.decay=t.decay,t.castShadow){let e=t.shadow,n=r.get(t);n.shadowBias=e.bias,n.shadowNormalBias=e.normalBias,n.shadowRadius=e.radius,n.shadowMapSize=e.mapSize,i.spotShadow[d]=n,i.spotShadowMap[d]=b,i.spotShadowMatrix[d]=t.shadow.matrix,g++}i.spot[d]=e,d++}else if(t.isRectAreaLight){let e=n.get(t);e.color.copy(_).multiplyScalar(v),e.halfWidth.set(t.width*.5,0,0),e.halfHeight.set(0,t.height*.5,0),i.rectArea[f]=e,f++}else if(t.isPointLight){let e=n.get(t);if(e.color.copy(t.color).multiplyScalar(t.intensity),e.distance=t.distance,e.decay=t.decay,t.castShadow){let e=t.shadow,n=r.get(t);n.shadowBias=e.bias,n.shadowNormalBias=e.normalBias,n.shadowRadius=e.radius,n.shadowMapSize=e.mapSize,n.shadowCameraNear=e.camera.near,n.shadowCameraFar=e.camera.far,i.pointShadow[u]=n,i.pointShadowMap[u]=b,i.pointShadowMatrix[u]=t.shadow.matrix,h++}i.point[u]=e,u++}else if(t.isHemisphereLight){let e=n.get(t);e.skyColor.copy(t.color).multiplyScalar(v),e.groundColor.copy(t.groundColor).multiplyScalar(v),i.hemi[p]=e,p++}}f>0&&(t.isWebGL2||e.has(`OES_texture_float_linear`)===!0?(i.rectAreaLTC1=V.LTC_FLOAT_1,i.rectAreaLTC2=V.LTC_FLOAT_2):e.has(`OES_texture_half_float_linear`)===!0?(i.rectAreaLTC1=V.LTC_HALF_1,i.rectAreaLTC2=V.LTC_HALF_2):console.error(`THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.`)),i.ambient[0]=o,i.ambient[1]=s,i.ambient[2]=c;let _=i.hash;(_.directionalLength!==l||_.pointLength!==u||_.spotLength!==d||_.rectAreaLength!==f||_.hemiLength!==p||_.numDirectionalShadows!==m||_.numPointShadows!==h||_.numSpotShadows!==g)&&(i.directional.length=l,i.spot.length=d,i.rectArea.length=f,i.point.length=u,i.hemi.length=p,i.directionalShadow.length=m,i.directionalShadowMap.length=m,i.pointShadow.length=h,i.pointShadowMap.length=h,i.spotShadow.length=g,i.spotShadowMap.length=g,i.directionalShadowMatrix.length=m,i.pointShadowMatrix.length=h,i.spotShadowMatrix.length=g,_.directionalLength=l,_.pointLength=u,_.spotLength=d,_.rectAreaLength=f,_.hemiLength=p,_.numDirectionalShadows=m,_.numPointShadows=h,_.numSpotShadows=g,i.version=Ua++)}function l(e,t){let n=0,r=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=i.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),a.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(a),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=i.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),a.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(a),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=i.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s.identity(),o.copy(f.matrixWorld),o.premultiply(d),s.extractRotation(o),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(s),e.halfHeight.applyMatrix4(s),l++}else if(f.isPointLight){let e=i.point[r];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),r++}else if(f.isHemisphereLight){let e=i.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),e.direction.normalize(),u++}}}return{setup:c,setupView:l,state:i}}function Ka(e,t){let n=new Ga(e,t),r=[],i=[];function a(){r.length=0,i.length=0}function o(e){r.push(e)}function s(e){i.push(e)}function c(){n.setup(r)}function l(e){n.setupView(r,e)}return{init:a,state:{lightsArray:r,shadowsArray:i,lights:n},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function qa(e,t){let n=new WeakMap;function r(r,i=0){let a;return n.has(r)===!1?(a=new Ka(e,t),n.set(r,[a])):i>=n.get(r).length?(a=new Ka(e,t),n.get(r).push(a)):a=n.get(r)[i],a}function i(){n=new WeakMap}return{get:r,dispose:i}}var Ja=class extends Mn{constructor(e){super(),this.type=`MeshDepthMaterial`,this.depthPacking=Ue,this.skinning=!1,this.morphTargets=!1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}};Ja.prototype.isMeshDepthMaterial=!0;var Ya=class extends Mn{constructor(e){super(),this.type=`MeshDistanceMaterial`,this.referencePosition=new P,this.nearDistance=1,this.farDistance=1e3,this.skinning=!1,this.morphTargets=!1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.fog=!1,this.setValues(e)}copy(e){return super.copy(e),this.referencePosition.copy(e.referencePosition),this.nearDistance=e.nearDistance,this.farDistance=e.farDistance,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};Ya.prototype.isMeshDistanceMaterial=!0;var Xa=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	float mean = 0.0;
	float squared_mean = 0.0;
	float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy ) / resolution ) );
	for ( float i = -1.0; i < 1.0 ; i += SAMPLE_RATE) {
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( i, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, i ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean * HALF_SAMPLE_RATE;
	squared_mean = squared_mean * HALF_SAMPLE_RATE;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`,Za=`void main() {
	gl_Position = vec4( position, 1.0 );
}`;function Qa(e,t,n){let r=new Ir,i=new M,a=new M,o=new N,s=[],c=[],l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Tr({defines:{SAMPLE_RATE:2/8,HALF_SAMPLE_RATE:1/8},uniforms:{shadow_pass:{value:null},resolution:{value:new M},radius:{value:4}},vertexShader:Za,fragmentShader:Xa}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new z;m.setAttribute(`position`,new L(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new gr(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1,this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){console.warn(`THREE.WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let p=d.getFrameExtents();if(i.multiply(p),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/p.x),i.x=a.x*p.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/p.y),i.y=a.y*p.y,d.mapSize.y=a.y)),d.map===null&&!d.isPointLightShadow&&this.type===3){let e={minFilter:me,magFilter:me,format:Ce};d.map=new dt(i.x,i.y,e),d.map.texture.name=l.name+`.shadowMap`,d.mapPass=new dt(i.x,i.y,e),d.camera.updateProjectionMatrix()}if(d.map===null){let e={minFilter:A,magFilter:A,format:Ce};d.map=new dt(i.x,i.y,e),d.map.texture.name=l.name+`.shadowMap`,d.camera.updateProjectionMatrix()}e.setRenderTarget(d.map),e.clear();let m=d.getViewportCount();for(let e=0;e<m;e++){let t=d.getViewport(e);o.set(a.x*t.x,a.y*t.y,a.x*t.z,a.y*t.w),f.viewport(o),d.updateMatrices(l,e),r=d.getFrustum(),x(n,s,d.camera,l,this.type)}!d.isPointLightShadow&&this.type===3&&_(d,s),d.needsUpdate=!1}g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function _(n,r){let i=t.update(h);f.uniforms.shadow_pass.value=n.map.texture,f.uniforms.resolution.value=n.mapSize,f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,p,h,null)}function v(e,t,n){let r=e|0|t<<1|n<<2,i=s[r];return i===void 0&&(i=new Ja({depthPacking:We,morphTargets:e,skinning:t}),s[r]=i),i}function y(e,t,n){let r=e|0|t<<1|n<<2,i=c[r];return i===void 0&&(i=new Ya({morphTargets:e,skinning:t}),c[r]=i),i}function b(t,n,r,i,a,o,s){let c=null,u=v,f=t.customDepthMaterial;if(i.isPointLight===!0&&(u=y,f=t.customDistanceMaterial),f===void 0){let e=!1;r.morphTargets===!0&&(e=n.morphAttributes&&n.morphAttributes.position&&n.morphAttributes.position.length>0);let i=!1;t.isSkinnedMesh===!0&&(r.skinning===!0?i=!0:console.warn(`THREE.WebGLShadowMap: THREE.SkinnedMesh with material.skinning set to false:`,t));let a=t.isInstancedMesh===!0;c=u(e,i,a)}else c=f;if(e.localClippingEnabled&&r.clipShadows===!0&&r.clippingPlanes.length!==0){let e=c.uuid,t=r.uuid,n=l[e];n===void 0&&(n={},l[e]=n);let i=n[t];i===void 0&&(i=c.clone(),n[t]=i),c=i}return c.visible=r.visible,c.wireframe=r.wireframe,s===3?c.side=r.shadowSide===null?r.side:r.shadowSide:c.side=r.shadowSide===null?d[r.side]:r.shadowSide,c.clipShadows=r.clipShadows,c.clippingPlanes=r.clippingPlanes,c.clipIntersection=r.clipIntersection,c.wireframeLinewidth=r.wireframeLinewidth,c.linewidth=r.linewidth,i.isPointLight===!0&&c.isMeshDistanceMaterial===!0&&(c.referencePosition.setFromMatrixPosition(i.matrixWorld),c.nearDistance=a,c.farDistance=o),c}function x(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),i=n.material;if(Array.isArray(i)){let t=r.groups;for(let c=0,l=t.length;c<l;c++){let l=t[c],u=i[l.materialIndex];if(u&&u.visible){let t=b(n,r,u,o,a.near,a.far,s);e.renderBufferDirect(a,null,r,t,n,l)}}}else if(i.visible){let t=b(n,r,i,o,a.near,a.far,s);e.renderBufferDirect(a,null,r,t,n,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)x(c[e],i,a,o,s)}}function $a(e,t,n){let r=n.isWebGL2;function i(){let t=!1,n=new N,r=null,i=new N(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function a(){let t=!1,n=null,r=null,i=null;return{setTest:function(e){e?ue(2929):O(2929)},setMask:function(r){n!==r&&!t&&(e.depthMask(r),n=r)},setFunc:function(t){if(r!==t){if(t)switch(t){case 0:e.depthFunc(512);break;case 1:e.depthFunc(519);break;case 2:e.depthFunc(513);break;case 3:e.depthFunc(515);break;case 4:e.depthFunc(514);break;case 5:e.depthFunc(518);break;case 6:e.depthFunc(516);break;case 7:e.depthFunc(517);break;default:e.depthFunc(515)}else e.depthFunc(515);r=t}},setLocked:function(e){t=e},setClear:function(t){i!==t&&(e.clearDepth(t),i=t)},reset:function(){t=!1,n=null,r=null,i=null}}}function o(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(e){t||(e?ue(2960):O(2960))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let s=new i,c=new a,l=new o,u={},d=null,f={},p=null,m=!1,h=null,g=null,_=null,v=null,y=null,b=null,x=null,S=!1,C=null,w=null,T=null,E=null,D=null,ee=e.getParameter(35661),te=!1,ne=0,re=e.getParameter(7938);re.indexOf(`WebGL`)===-1?re.indexOf(`OpenGL ES`)!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(re)[1]),te=ne>=2):(ne=parseFloat(/^WebGL (\d)/.exec(re)[1]),te=ne>=1);let ie=null,ae={},oe=new N(0,0,e.canvas.width,e.canvas.height),se=new N(0,0,e.canvas.width,e.canvas.height);function ce(t,n,r){let i=new Uint8Array(4),a=e.createTexture();e.bindTexture(t,a),e.texParameteri(t,10241,9728),e.texParameteri(t,10240,9728);for(let t=0;t<r;t++)e.texImage2D(n+t,0,6408,1,1,0,6408,5121,i);return a}let le={};le[3553]=ce(3553,3553,1),le[34067]=ce(34067,34069,6),s.setClear(0,0,0,1),c.setClear(1),l.setClear(0),ue(2929),c.setFunc(3),he(!1),ge(1),ue(2884),pe(0);function ue(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function O(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function k(t){t!==d&&(e.bindFramebuffer(36160,t),d=t)}function de(t,n){n===null&&d!==null&&(n=d),f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,r&&(t===36009&&(f[36160]=n),t===36160&&(f[36009]=n)))}function fe(t){return p!==t&&(e.useProgram(t),p=t,!0)}let A={100:32774,101:32778,102:32779};if(r)A[103]=32775,A[104]=32776;else{let e=t.get(`EXT_blend_minmax`);e!==null&&(A[103]=e.MIN_EXT,A[104]=e.MAX_EXT)}let j={200:0,201:1,202:768,204:770,210:776,208:774,206:772,203:769,205:771,209:775,207:773};function pe(t,n,r,i,a,o,s,c){if(t===0)m===!0&&(O(3042),m=!1);else if(m===!1&&(ue(3042),m=!0),t!==5){if(t!==h||c!==S){if((g!==100||y!==100)&&(e.blendEquation(32774),g=100,y=100),c)switch(t){case 1:e.blendFuncSeparate(1,771,1,771);break;case 2:e.blendFunc(1,1);break;case 3:e.blendFuncSeparate(0,0,769,771);break;case 4:e.blendFuncSeparate(0,768,0,770);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(770,771,1,771);break;case 2:e.blendFunc(770,1);break;case 3:e.blendFunc(0,769);break;case 4:e.blendFunc(0,768);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}_=null,v=null,b=null,x=null,h=t,S=c}}else a||=n,o||=r,s||=i,(n!==g||a!==y)&&(e.blendEquationSeparate(A[n],A[a]),g=n,y=a),(r!==_||i!==v||o!==b||s!==x)&&(e.blendFuncSeparate(j[r],j[i],j[o],j[s]),_=r,v=i,b=o,x=s),h=t,S=null}function me(e,t){e.side===2?O(2884):ue(2884);let n=e.side===1;t&&(n=!n),he(n),e.blending===1&&e.transparent===!1?pe(0):pe(e.blending,e.blendEquation,e.blendSrc,e.blendDst,e.blendEquationAlpha,e.blendSrcAlpha,e.blendDstAlpha,e.premultipliedAlpha),c.setFunc(e.depthFunc),c.setTest(e.depthTest),c.setMask(e.depthWrite),s.setMask(e.colorWrite);let r=e.stencilWrite;l.setTest(r),r&&(l.setMask(e.stencilWriteMask),l.setFunc(e.stencilFunc,e.stencilRef,e.stencilFuncMask),l.setOp(e.stencilFail,e.stencilZFail,e.stencilZPass)),ve(e.polygonOffset,e.polygonOffsetFactor,e.polygonOffsetUnits),e.alphaToCoverage===!0?ue(32926):O(32926)}function he(t){C!==t&&(t?e.frontFace(2304):e.frontFace(2305),C=t)}function ge(t){t===0?O(2884):(ue(2884),t!==w&&(t===1?e.cullFace(1029):t===2?e.cullFace(1028):e.cullFace(1032))),w=t}function _e(t){t!==T&&(te&&e.lineWidth(t),T=t)}function ve(t,n,r){t?(ue(32823),(E!==n||D!==r)&&(e.polygonOffset(n,r),E=n,D=r)):O(32823)}function ye(e){e?ue(3089):O(3089)}function be(t){t===void 0&&(t=33984+ee-1),ie!==t&&(e.activeTexture(t),ie=t)}function xe(t,n){ie===null&&be();let r=ae[ie];r===void 0&&(r={type:void 0,texture:void 0},ae[ie]=r),(r.type!==t||r.texture!==n)&&(e.bindTexture(t,n||le[t]),r.type=t,r.texture=n)}function Se(){let t=ae[ie];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ce(){try{e.compressedTexImage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function we(){try{e.texImage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Te(){try{e.texImage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ee(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function De(t){se.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),se.copy(t))}function Oe(){e.disable(3042),e.disable(2884),e.disable(2929),e.disable(32823),e.disable(3089),e.disable(2960),e.disable(32926),e.blendEquation(32774),e.blendFunc(1,0),e.blendFuncSeparate(1,0,1,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(513),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(519,0,4294967295),e.stencilOp(7680,7680,7680),e.clearStencil(0),e.cullFace(1029),e.frontFace(2305),e.polygonOffset(0,0),e.activeTexture(33984),e.bindFramebuffer(36160,null),r===!0&&(e.bindFramebuffer(36009,null),e.bindFramebuffer(36008,null)),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),u={},ie=null,ae={},d=null,f={},p=null,m=!1,h=null,g=null,_=null,v=null,y=null,b=null,x=null,S=!1,C=null,w=null,T=null,E=null,D=null,oe.set(0,0,e.canvas.width,e.canvas.height),se.set(0,0,e.canvas.width,e.canvas.height),s.reset(),c.reset(),l.reset()}return{buffers:{color:s,depth:c,stencil:l},enable:ue,disable:O,bindFramebuffer:de,bindXRFramebuffer:k,useProgram:fe,setBlending:pe,setMaterial:me,setFlipSided:he,setCullFace:ge,setLineWidth:_e,setPolygonOffset:ve,setScissorTest:ye,activeTexture:be,bindTexture:xe,unbindTexture:Se,compressedTexImage2D:Ce,texImage2D:we,texImage3D:Te,scissor:Ee,viewport:De,reset:Oe}}function eo(e,t,n,r,i,a,o){let s=i.isWebGL2,c=i.maxTextures,l=i.maxCubemapSize,u=i.maxTextureSize,d=i.maxSamples,f=new WeakMap,p,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):document.createElementNS(`http://www.w3.org/1999/xhtml`,`canvas`)}function g(e,t,n,r){let i=1;if((e.width>r||e.height>r)&&(i=r/Math.max(e.width,e.height)),i<1||t===!0){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let r=t?it:Math.floor,a=r(i*e.width),o=r(i*e.height);p===void 0&&(p=h(a,o));let s=n?h(a,o):p;return s.width=a,s.height=o,s.getContext(`2d`).drawImage(e,0,0,a,o),console.warn(`THREE.WebGLRenderer: Texture has been resized from (`+e.width+`x`+e.height+`) to (`+a+`x`+o+`).`),s}return`data`in e&&console.warn(`THREE.WebGLRenderer: Image in DataTexture is too big (`+e.width+`x`+e.height+`).`),e}return e}function _(e){return nt(e.width)&&nt(e.height)}function v(e){return s?!1:e.wrapS!==1001||e.wrapT!==1001||e.minFilter!==1003&&e.minFilter!==1006}function y(e,t){return e.generateMipmaps&&t&&e.minFilter!==1003&&e.minFilter!==1006}function b(t,n,i,a){e.generateMipmap(t);let o=r.get(n);o.__maxMipLevel=Math.log2(Math.max(i,a))}function x(n,r,i){if(s===!1)return r;if(n!==null){if(e[n]!==void 0)return e[n];console.warn(`THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let a=r;return r===6403&&(i===5126&&(a=33326),i===5131&&(a=33325),i===5121&&(a=33321)),r===6407&&(i===5126&&(a=34837),i===5131&&(a=34843),i===5121&&(a=32849)),r===6408&&(i===5126&&(a=34836),i===5131&&(a=34842),i===5121&&(a=32856)),(a===33325||a===33326||a===34842||a===34836)&&t.get(`EXT_color_buffer_float`),a}function S(e){return e===1003||e===1004||e===1005?9728:9729}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&f.delete(t),o.memory.textures--}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),E(t),o.memory.textures--}function T(t){let n=r.get(t);n.__webglInit!==void 0&&(e.deleteTexture(n.__webglTexture),r.remove(t))}function E(t){let n=t.texture,i=r.get(t),a=r.get(n);if(t){if(a.__webglTexture!==void 0&&e.deleteTexture(a.__webglTexture),t.depthTexture&&t.depthTexture.dispose(),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++)e.deleteFramebuffer(i.__webglFramebuffer[t]),i.__webglDepthbuffer&&e.deleteRenderbuffer(i.__webglDepthbuffer[t]);else e.deleteFramebuffer(i.__webglFramebuffer),i.__webglDepthbuffer&&e.deleteRenderbuffer(i.__webglDepthbuffer),i.__webglMultisampledFramebuffer&&e.deleteFramebuffer(i.__webglMultisampledFramebuffer),i.__webglColorRenderbuffer&&e.deleteRenderbuffer(i.__webglColorRenderbuffer),i.__webglDepthRenderbuffer&&e.deleteRenderbuffer(i.__webglDepthRenderbuffer);r.remove(n),r.remove(t)}}let D=0;function ee(){D=0}function te(){let e=D;return e>=c&&console.warn(`THREE.WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+c),D+=1,e}function ne(e,t){let i=r.get(e);if(e.isVideoTexture&&Oe(e),e.version>0&&i.__version!==e.version){let n=e.image;if(n===void 0)console.warn(`THREE.WebGLRenderer: Texture marked for update but image is undefined`);else if(n.complete===!1)console.warn(`THREE.WebGLRenderer: Texture marked for update but image is incomplete`);else{ue(i,e,t);return}}n.activeTexture(33984+t),n.bindTexture(3553,i.__webglTexture)}function re(e,t){let i=r.get(e);e.version>0&&i.__version!==e.version?ue(i,e,t):(n.activeTexture(33984+t),n.bindTexture(35866,i.__webglTexture))}function ie(e,t){let i=r.get(e);e.version>0&&i.__version!==e.version?ue(i,e,t):(n.activeTexture(33984+t),n.bindTexture(32879,i.__webglTexture))}function ae(e,t){let i=r.get(e);e.version>0&&i.__version!==e.version?O(i,e,t):(n.activeTexture(33984+t),n.bindTexture(34067,i.__webglTexture))}let oe={[k]:10497,[de]:33071,[fe]:33648},se={[A]:9728,[j]:9984,[pe]:9986,[me]:9729,[he]:9985,[ge]:9987};function ce(n,a,o){if(o?(e.texParameteri(n,10242,oe[a.wrapS]),e.texParameteri(n,10243,oe[a.wrapT]),(n===32879||n===35866)&&e.texParameteri(n,32882,oe[a.wrapR]),e.texParameteri(n,10240,se[a.magFilter]),e.texParameteri(n,10241,se[a.minFilter])):(e.texParameteri(n,10242,33071),e.texParameteri(n,10243,33071),(n===32879||n===35866)&&e.texParameteri(n,32882,33071),(a.wrapS!==1001||a.wrapT!==1001)&&console.warn(`THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.`),e.texParameteri(n,10240,S(a.magFilter)),e.texParameteri(n,10241,S(a.minFilter)),a.minFilter!==1003&&a.minFilter!==1006&&console.warn(`THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.`)),t.has(`EXT_texture_filter_anisotropic`)===!0){let o=t.get(`EXT_texture_filter_anisotropic`);if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1||s===!1&&a.type===1016&&t.has(`OES_texture_half_float_linear`)===!1)return;(a.anisotropy>1||r.get(a).__currentAnisotropy)&&(e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy)}}function le(t,n){t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C),t.__webglTexture=e.createTexture(),o.memory.textures++)}function ue(t,r,i){let o=3553;r.isDataTexture2DArray&&(o=35866),r.isDataTexture3D&&(o=32879),le(t,r),n.activeTexture(33984+i),n.bindTexture(o,t.__webglTexture),e.pixelStorei(37440,r.flipY),e.pixelStorei(37441,r.premultiplyAlpha),e.pixelStorei(3317,r.unpackAlignment),e.pixelStorei(37443,0);let c=v(r)&&_(r.image)===!1,l=g(r.image,c,!1,u),d=_(l)||s,f=a.convert(r.format),p=a.convert(r.type),m=x(r.internalFormat,f,p);ce(o,r,d);let h,S=r.mipmaps;if(r.isDepthTexture)m=6402,s?m=r.type===1015?36012:r.type===1014?33190:r.type===1020?35056:33189:r.type===1015&&console.error(`WebGLRenderer: Floating point depth texture requires WebGL2.`),r.format===1026&&m===6402&&r.type!==1012&&r.type!==1014&&(console.warn(`THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture.`),r.type=ve,p=a.convert(r.type)),r.format===1027&&m===6402&&(m=34041,r.type!==1020&&(console.warn(`THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture.`),r.type=xe,p=a.convert(r.type))),n.texImage2D(3553,0,m,l.width,l.height,0,f,p,null);else if(r.isDataTexture){if(S.length>0&&d){for(let e=0,t=S.length;e<t;e++)h=S[e],n.texImage2D(3553,e,m,h.width,h.height,0,f,p,h.data);r.generateMipmaps=!1,t.__maxMipLevel=S.length-1}else n.texImage2D(3553,0,m,l.width,l.height,0,f,p,l.data),t.__maxMipLevel=0}else if(r.isCompressedTexture){for(let e=0,t=S.length;e<t;e++)h=S[e],r.format!==1023&&r.format!==1022?f===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):n.compressedTexImage2D(3553,e,m,h.width,h.height,0,h.data):n.texImage2D(3553,e,m,h.width,h.height,0,f,p,h.data);t.__maxMipLevel=S.length-1}else if(r.isDataTexture2DArray)n.texImage3D(35866,0,m,l.width,l.height,l.depth,0,f,p,l.data),t.__maxMipLevel=0;else if(r.isDataTexture3D)n.texImage3D(32879,0,m,l.width,l.height,l.depth,0,f,p,l.data),t.__maxMipLevel=0;else if(S.length>0&&d){for(let e=0,t=S.length;e<t;e++)h=S[e],n.texImage2D(3553,e,m,f,p,h);r.generateMipmaps=!1,t.__maxMipLevel=S.length-1}else n.texImage2D(3553,0,m,f,p,l),t.__maxMipLevel=0;y(r,d)&&b(o,r,l.width,l.height),t.__version=r.version,r.onUpdate&&r.onUpdate(r)}function O(t,r,i){if(r.image.length!==6)return;le(t,r),n.activeTexture(33984+i),n.bindTexture(34067,t.__webglTexture),e.pixelStorei(37440,r.flipY),e.pixelStorei(37441,r.premultiplyAlpha),e.pixelStorei(3317,r.unpackAlignment),e.pixelStorei(37443,0);let o=r&&(r.isCompressedTexture||r.image[0].isCompressedTexture),c=r.image[0]&&r.image[0].isDataTexture,u=[];for(let e=0;e<6;e++)!o&&!c?u[e]=g(r.image[e],!1,!0,l):u[e]=c?r.image[e].image:r.image[e];let d=u[0],f=_(d)||s,p=a.convert(r.format),m=a.convert(r.type),h=x(r.internalFormat,p,m);ce(34067,r,f);let v;if(o){for(let e=0;e<6;e++){v=u[e].mipmaps;for(let t=0;t<v.length;t++){let i=v[t];r.format!==1023&&r.format!==1022?p===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):n.compressedTexImage2D(34069+e,t,h,i.width,i.height,0,i.data):n.texImage2D(34069+e,t,h,i.width,i.height,0,p,m,i.data)}}t.__maxMipLevel=v.length-1}else{v=r.mipmaps;for(let e=0;e<6;e++)if(c){n.texImage2D(34069+e,0,h,u[e].width,u[e].height,0,p,m,u[e].data);for(let t=0;t<v.length;t++){let r=v[t].image[e].image;n.texImage2D(34069+e,t+1,h,r.width,r.height,0,p,m,r.data)}}else{n.texImage2D(34069+e,0,h,p,m,u[e]);for(let t=0;t<v.length;t++){let r=v[t];n.texImage2D(34069+e,t+1,h,p,m,r.image[e])}}t.__maxMipLevel=v.length}y(r,f)&&b(34067,r,d.width,d.height),t.__version=r.version,r.onUpdate&&r.onUpdate(r)}function _e(t,i,o,s){let c=i.texture,l=a.convert(c.format),u=a.convert(c.type),d=x(c.internalFormat,l,u);s===32879||s===35866?n.texImage3D(s,0,d,i.width,i.height,i.depth,0,l,u,null):n.texImage2D(s,0,d,i.width,i.height,0,l,u,null),n.bindFramebuffer(36160,t),e.framebufferTexture2D(36160,o,s,r.get(c).__webglTexture,0),n.bindFramebuffer(36160,null)}function ye(t,n,r){if(e.bindRenderbuffer(36161,t),n.depthBuffer&&!n.stencilBuffer){let i=33189;if(r){let t=n.depthTexture;t&&t.isDepthTexture&&(t.type===1015?i=36012:t.type===1014&&(i=33190));let r=De(n);e.renderbufferStorageMultisample(36161,r,i,n.width,n.height)}else e.renderbufferStorage(36161,i,n.width,n.height);e.framebufferRenderbuffer(36160,36096,36161,t)}else if(n.depthBuffer&&n.stencilBuffer){if(r){let t=De(n);e.renderbufferStorageMultisample(36161,t,35056,n.width,n.height)}else e.renderbufferStorage(36161,34041,n.width,n.height);e.framebufferRenderbuffer(36160,33306,36161,t)}else{let t=n.texture,i=a.convert(t.format),o=a.convert(t.type),s=x(t.internalFormat,i,o);if(r){let t=De(n);e.renderbufferStorageMultisample(36161,t,s,n.width,n.height)}else e.renderbufferStorage(36161,s,n.width,n.height)}e.bindRenderbuffer(36161,null)}function be(t,i){if(i&&i.isWebGLCubeRenderTarget)throw Error(`Depth Texture with cube render targets is not supported`);if(n.bindFramebuffer(36160,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);r.get(i.depthTexture).__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),ne(i.depthTexture,0);let a=r.get(i.depthTexture).__webglTexture;if(i.depthTexture.format===1026)e.framebufferTexture2D(36160,36096,3553,a,0);else if(i.depthTexture.format===1027)e.framebufferTexture2D(36160,33306,3553,a,0);else throw Error(`Unknown depthTexture format`)}function Se(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(t.depthTexture){if(a)throw Error(`target.depthTexture not supported in Cube render targets`);be(i.__webglFramebuffer,t)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)n.bindFramebuffer(36160,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]=e.createRenderbuffer(),ye(i.__webglDepthbuffer[r],t,!1)}else n.bindFramebuffer(36160,i.__webglFramebuffer),i.__webglDepthbuffer=e.createRenderbuffer(),ye(i.__webglDepthbuffer,t,!1);n.bindFramebuffer(36160,null)}function we(t){let i=t.texture,c=r.get(t),l=r.get(i);t.addEventListener(`dispose`,w),l.__webglTexture=e.createTexture(),l.__version=i.version,o.memory.textures++;let u=t.isWebGLCubeRenderTarget===!0,d=t.isWebGLMultisampleRenderTarget===!0,f=i.isDataTexture3D||i.isDataTexture2DArray,p=_(t)||s;if(s&&i.format===1022&&(i.type===1015||i.type===1016)&&(i.format=Ce,console.warn(`THREE.WebGLRenderer: Rendering to textures with RGB format is not supported. Using RGBA format instead.`)),u){c.__webglFramebuffer=[];for(let t=0;t<6;t++)c.__webglFramebuffer[t]=e.createFramebuffer()}else if(c.__webglFramebuffer=e.createFramebuffer(),d){if(s){c.__webglMultisampledFramebuffer=e.createFramebuffer(),c.__webglColorRenderbuffer=e.createRenderbuffer(),e.bindRenderbuffer(36161,c.__webglColorRenderbuffer);let r=a.convert(i.format),o=a.convert(i.type),s=x(i.internalFormat,r,o),l=De(t);e.renderbufferStorageMultisample(36161,l,s,t.width,t.height),n.bindFramebuffer(36160,c.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(36160,36064,36161,c.__webglColorRenderbuffer),e.bindRenderbuffer(36161,null),t.depthBuffer&&(c.__webglDepthRenderbuffer=e.createRenderbuffer(),ye(c.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(36160,null)}else console.warn(`THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.`)}if(u){n.bindTexture(34067,l.__webglTexture),ce(34067,i,p);for(let e=0;e<6;e++)_e(c.__webglFramebuffer[e],t,36064,34069+e);y(i,p)&&b(34067,i,t.width,t.height),n.bindTexture(34067,null)}else{let e=3553;f&&(s?e=i.isDataTexture3D?32879:35866:console.warn(`THREE.DataTexture3D and THREE.DataTexture2DArray only supported with WebGL2.`)),n.bindTexture(e,l.__webglTexture),ce(e,i,p),_e(c.__webglFramebuffer,t,36064,e),y(i,p)&&b(3553,i,t.width,t.height),n.bindTexture(3553,null)}t.depthBuffer&&Se(t)}function Te(e){let t=e.texture;if(y(t,_(e)||s)){let i=e.isWebGLCubeRenderTarget?34067:3553,a=r.get(t).__webglTexture;n.bindTexture(i,a),b(i,t,e.width,e.height),n.bindTexture(i,null)}}function Ee(t){if(t.isWebGLMultisampleRenderTarget){if(s){let i=t.width,a=t.height,o=16384;t.depthBuffer&&(o|=256),t.stencilBuffer&&(o|=1024);let s=r.get(t);n.bindFramebuffer(36008,s.__webglMultisampledFramebuffer),n.bindFramebuffer(36009,s.__webglFramebuffer),e.blitFramebuffer(0,0,i,a,0,0,i,a,o,9728),n.bindFramebuffer(36008,null),n.bindFramebuffer(36009,s.__webglMultisampledFramebuffer)}else console.warn(`THREE.WebGLRenderer: WebGLMultisampleRenderTarget can only be used with WebGL2.`)}}function De(e){return s&&e.isWebGLMultisampleRenderTarget?Math.min(d,e.samples):0}function Oe(e){let t=o.render.frame;f.get(e)!==t&&(f.set(e,t),e.update())}let ke=!1,Ae=!1;function je(e,t){e&&e.isWebGLRenderTarget&&(ke===!1&&(console.warn(`THREE.WebGLTextures.safeSetTexture2D: don't use render targets as textures. Use their .texture property instead.`),ke=!0),e=e.texture),ne(e,t)}function Me(e,t){e&&e.isWebGLCubeRenderTarget&&(Ae===!1&&(console.warn(`THREE.WebGLTextures.safeSetTextureCube: don't use cube render targets as textures. Use their .texture property instead.`),Ae=!0),e=e.texture),ae(e,t)}this.allocateTextureUnit=te,this.resetTextureUnits=ee,this.setTexture2D=ne,this.setTexture2DArray=re,this.setTexture3D=ie,this.setTextureCube=ae,this.setupRenderTarget=we,this.updateRenderTargetMipmap=Te,this.updateMultisampleRenderTarget=Ee,this.safeSetTexture2D=je,this.safeSetTextureCube=Me}function to(e,t,n){let r=n.isWebGL2;function i(e){let n;if(e===1009)return 5121;if(e===1017)return 32819;if(e===1018)return 32820;if(e===1019)return 33635;if(e===1010)return 5120;if(e===1011)return 5122;if(e===1012)return 5123;if(e===1013)return 5124;if(e===1014)return 5125;if(e===1015)return 5126;if(e===1016)return r?5131:(n=t.get(`OES_texture_half_float`),n===null?null:n.HALF_FLOAT_OES);if(e===1021)return 6406;if(e===1022)return 6407;if(e===1023)return 6408;if(e===1024)return 6409;if(e===1025)return 6410;if(e===1026)return 6402;if(e===1027)return 34041;if(e===1028)return 6403;if(e===1029)return 36244;if(e===1030)return 33319;if(e===1031)return 33320;if(e===1032)return 36248;if(e===1033)return 36249;if(e===33776||e===33777||e===33778||e===33779){if(n=t.get(`WEBGL_compressed_texture_s3tc`),n!==null){if(e===33776)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(e===33777)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(e===33778)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(e===33779)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(e===35840||e===35841||e===35842||e===35843){if(n=t.get(`WEBGL_compressed_texture_pvrtc`),n!==null){if(e===35840)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(e===35841)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(e===35842)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(e===35843)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(e===36196)return n=t.get(`WEBGL_compressed_texture_etc1`),n===null?null:n.COMPRESSED_RGB_ETC1_WEBGL;if((e===37492||e===37496)&&(n=t.get(`WEBGL_compressed_texture_etc`),n!==null)){if(e===37492)return n.COMPRESSED_RGB8_ETC2;if(e===37496)return n.COMPRESSED_RGBA8_ETC2_EAC}if(e===37808||e===37809||e===37810||e===37811||e===37812||e===37813||e===37814||e===37815||e===37816||e===37817||e===37818||e===37819||e===37820||e===37821||e===37840||e===37841||e===37842||e===37843||e===37844||e===37845||e===37846||e===37847||e===37848||e===37849||e===37850||e===37851||e===37852||e===37853)return n=t.get(`WEBGL_compressed_texture_astc`),n===null?null:e;if(e===36492)return n=t.get(`EXT_texture_compression_bptc`),n===null?null:e;if(e===1020)return r?34042:(n=t.get(`WEBGL_depth_texture`),n===null?null:n.UNSIGNED_INT_24_8_WEBGL)}return{convert:i}}var no=class extends Dr{constructor(e=[]){super(),this.cameras=e}};no.prototype.isArrayCamera=!0;var ro=class extends hn{constructor(){super(),this.type=`Group`}};ro.prototype.isGroup=!0;var io={type:`move`},ao=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ro,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ro,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ro,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(o!==null&&(r=t.getPose(e.targetRaySpace,n),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(io))),c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n);if(c.joints[r.jointName]===void 0){let e=new ro;e.matrixAutoUpdate=!1,e.visible=!1,c.joints[r.jointName]=e,c.add(e)}let i=c.joints[r.jointName];e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}},oo=class extends Je{constructor(e,t){super();let n=this,r=e.state,i=null,a=1,o=null,s=`local-floor`,c=null,l=[],u=new Map,d=new Dr;d.layers.enable(1),d.viewport=new N;let f=new Dr;f.layers.enable(2),f.viewport=new N;let p=[d,f],m=new no;m.layers.enable(1),m.layers.enable(2);let h=null,g=null;this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=l[e];return t===void 0&&(t=new ao,l[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=l[e];return t===void 0&&(t=new ao,l[e]=t),t.getGripSpace()},this.getHand=function(e){let t=l[e];return t===void 0&&(t=new ao,l[e]=t),t.getHandSpace()};function _(e){let t=u.get(e.inputSource);t&&t.dispatchEvent({type:e.type,data:e.inputSource})}function v(){u.forEach(function(e,t){e.disconnect(t)}),u.clear(),h=null,g=null,r.bindXRFramebuffer(null),e.setRenderTarget(e.getRenderTarget()),E.stop(),n.isPresenting=!1,n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){a=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){s=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return o},this.getSession=function(){return i},this.setSession=async function(e){if(i=e,i!==null){i.addEventListener(`select`,_),i.addEventListener(`selectstart`,_),i.addEventListener(`selectend`,_),i.addEventListener(`squeeze`,_),i.addEventListener(`squeezestart`,_),i.addEventListener(`squeezeend`,_),i.addEventListener(`end`,v),i.addEventListener(`inputsourceschange`,y);let e=t.getContextAttributes();e.xrCompatible!==!0&&await t.makeXRCompatible();let r={antialias:e.antialias,alpha:e.alpha,depth:e.depth,stencil:e.stencil,framebufferScaleFactor:a},c=new XRWebGLLayer(i,t,r);i.updateRenderState({baseLayer:c}),o=await i.requestReferenceSpace(s),E.setContext(i),E.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}};function y(e){let t=i.inputSources;for(let e=0;e<l.length;e++)u.set(t[e],l[e]);for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=u.get(n);r&&(r.dispatchEvent({type:`disconnected`,data:n}),u.delete(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=u.get(n);r&&r.dispatchEvent({type:`connected`,data:n})}}let b=new P,x=new P;function S(e,t,n){b.setFromMatrixPosition(t.matrixWorld),x.setFromMatrixPosition(n.matrixWorld);let r=b.distanceTo(x),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert();let g=o+m,_=s+m,v=f-h,y=p+(r-h),S=c*s/_*g,C=l*s/_*g;e.projectionMatrix.makePerspective(v,y,S,C,g,_)}function C(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.getCamera=function(e){m.near=f.near=d.near=e.near,m.far=f.far=d.far=e.far,(h!==m.near||g!==m.far)&&(i.updateRenderState({depthNear:m.near,depthFar:m.far}),h=m.near,g=m.far);let t=e.parent,n=m.cameras;C(m,t);for(let e=0;e<n.length;e++)C(n[e],t);e.matrixWorld.copy(m.matrixWorld),e.matrix.copy(m.matrix),e.matrix.decompose(e.position,e.quaternion,e.scale);let r=e.children;for(let e=0,t=r.length;e<t;e++)r[e].updateMatrixWorld(!0);return n.length===2?S(m,d,f):m.projectionMatrix.copy(d.projectionMatrix),m};let w=null;function T(e,t){if(c=t.getViewerPose(o),c!==null){let e=c.views,t=i.renderState.baseLayer;r.bindXRFramebuffer(t.framebuffer);let n=!1;e.length!==m.cameras.length&&(m.cameras.length=0,n=!0);for(let r=0;r<e.length;r++){let i=e[r],a=t.getViewport(i),o=p[r];o.matrix.fromArray(i.transform.matrix),o.projectionMatrix.fromArray(i.projectionMatrix),o.viewport.set(a.x,a.y,a.width,a.height),r===0&&m.matrix.copy(o.matrix),n===!0&&m.cameras.push(o)}}let n=i.inputSources;for(let e=0;e<l.length;e++){let r=l[e],i=n[e];r.update(i,t,o)}w&&w(e,t)}let E=new Lr;E.setAnimationLoop(T),this.setAnimationLoop=function(e){w=e},this.dispose=function(){}}};function so(e){function t(e,t){e.fogColor.value.copy(t.color),t.isFog?(e.fogNear.value=t.near,e.fogFar.value=t.far):t.isFogExp2&&(e.fogDensity.value=t.density)}function n(e,t,n,_){t.isMeshBasicMaterial?r(e,t):t.isMeshLambertMaterial?(r(e,t),c(e,t)):t.isMeshToonMaterial?(r(e,t),u(e,t)):t.isMeshPhongMaterial?(r(e,t),l(e,t)):t.isMeshStandardMaterial?(r(e,t),t.isMeshPhysicalMaterial?f(e,t):d(e,t)):t.isMeshMatcapMaterial?(r(e,t),p(e,t)):t.isMeshDepthMaterial?(r(e,t),m(e,t)):t.isMeshDistanceMaterial?(r(e,t),h(e,t)):t.isMeshNormalMaterial?(r(e,t),g(e,t)):t.isLineBasicMaterial?(i(e,t),t.isLineDashedMaterial&&a(e,t)):t.isPointsMaterial?o(e,t,n,_):t.isSpriteMaterial?s(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function r(t,n){t.opacity.value=n.opacity,n.color&&t.diffuse.value.copy(n.color),n.emissive&&t.emissive.value.copy(n.emissive).multiplyScalar(n.emissiveIntensity),n.map&&(t.map.value=n.map),n.alphaMap&&(t.alphaMap.value=n.alphaMap),n.specularMap&&(t.specularMap.value=n.specularMap);let r=e.get(n).envMap;if(r){t.envMap.value=r,t.flipEnvMap.value=r.isCubeTexture&&r._needsFlipEnvMap?-1:1,t.reflectivity.value=n.reflectivity,t.refractionRatio.value=n.refractionRatio;let i=e.get(r).__maxMipLevel;i!==void 0&&(t.maxMipLevel.value=i)}n.lightMap&&(t.lightMap.value=n.lightMap,t.lightMapIntensity.value=n.lightMapIntensity),n.aoMap&&(t.aoMap.value=n.aoMap,t.aoMapIntensity.value=n.aoMapIntensity);let i;n.map?i=n.map:n.specularMap?i=n.specularMap:n.displacementMap?i=n.displacementMap:n.normalMap?i=n.normalMap:n.bumpMap?i=n.bumpMap:n.roughnessMap?i=n.roughnessMap:n.metalnessMap?i=n.metalnessMap:n.alphaMap?i=n.alphaMap:n.emissiveMap?i=n.emissiveMap:n.clearcoatMap?i=n.clearcoatMap:n.clearcoatNormalMap?i=n.clearcoatNormalMap:n.clearcoatRoughnessMap&&(i=n.clearcoatRoughnessMap),i!==void 0&&(i.isWebGLRenderTarget&&(i=i.texture),i.matrixAutoUpdate===!0&&i.updateMatrix(),t.uvTransform.value.copy(i.matrix));let a;n.aoMap?a=n.aoMap:n.lightMap&&(a=n.lightMap),a!==void 0&&(a.isWebGLRenderTarget&&(a=a.texture),a.matrixAutoUpdate===!0&&a.updateMatrix(),t.uv2Transform.value.copy(a.matrix))}function i(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity}function a(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function o(e,t,n,r){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*n,e.scale.value=r*.5,t.map&&(e.map.value=t.map),t.alphaMap&&(e.alphaMap.value=t.alphaMap);let i;t.map?i=t.map:t.alphaMap&&(i=t.alphaMap),i!==void 0&&(i.matrixAutoUpdate===!0&&i.updateMatrix(),e.uvTransform.value.copy(i.matrix))}function s(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map),t.alphaMap&&(e.alphaMap.value=t.alphaMap);let n;t.map?n=t.map:t.alphaMap&&(n=t.alphaMap),n!==void 0&&(n.matrixAutoUpdate===!0&&n.updateMatrix(),e.uvTransform.value.copy(n.matrix))}function c(e,t){t.emissiveMap&&(e.emissiveMap.value=t.emissiveMap)}function l(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4),t.emissiveMap&&(e.emissiveMap.value=t.emissiveMap),t.bumpMap&&(e.bumpMap.value=t.bumpMap,e.bumpScale.value=t.bumpScale,t.side===1&&(e.bumpScale.value*=-1)),t.normalMap&&(e.normalMap.value=t.normalMap,e.normalScale.value.copy(t.normalScale),t.side===1&&e.normalScale.value.negate()),t.displacementMap&&(e.displacementMap.value=t.displacementMap,e.displacementScale.value=t.displacementScale,e.displacementBias.value=t.displacementBias)}function u(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap),t.emissiveMap&&(e.emissiveMap.value=t.emissiveMap),t.bumpMap&&(e.bumpMap.value=t.bumpMap,e.bumpScale.value=t.bumpScale,t.side===1&&(e.bumpScale.value*=-1)),t.normalMap&&(e.normalMap.value=t.normalMap,e.normalScale.value.copy(t.normalScale),t.side===1&&e.normalScale.value.negate()),t.displacementMap&&(e.displacementMap.value=t.displacementMap,e.displacementScale.value=t.displacementScale,e.displacementBias.value=t.displacementBias)}function d(t,n){t.roughness.value=n.roughness,t.metalness.value=n.metalness,n.roughnessMap&&(t.roughnessMap.value=n.roughnessMap),n.metalnessMap&&(t.metalnessMap.value=n.metalnessMap),n.emissiveMap&&(t.emissiveMap.value=n.emissiveMap),n.bumpMap&&(t.bumpMap.value=n.bumpMap,t.bumpScale.value=n.bumpScale,n.side===1&&(t.bumpScale.value*=-1)),n.normalMap&&(t.normalMap.value=n.normalMap,t.normalScale.value.copy(n.normalScale),n.side===1&&t.normalScale.value.negate()),n.displacementMap&&(t.displacementMap.value=n.displacementMap,t.displacementScale.value=n.displacementScale,t.displacementBias.value=n.displacementBias),e.get(n).envMap&&(t.envMapIntensity.value=n.envMapIntensity)}function f(e,t){d(e,t),e.reflectivity.value=t.reflectivity,e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.sheen&&e.sheen.value.copy(t.sheen),t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap),t.clearcoatNormalMap&&(e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),e.clearcoatNormalMap.value=t.clearcoatNormalMap,t.side===1&&e.clearcoatNormalScale.value.negate()),e.transmission.value=t.transmission,t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap)}function p(e,t){t.matcap&&(e.matcap.value=t.matcap),t.bumpMap&&(e.bumpMap.value=t.bumpMap,e.bumpScale.value=t.bumpScale,t.side===1&&(e.bumpScale.value*=-1)),t.normalMap&&(e.normalMap.value=t.normalMap,e.normalScale.value.copy(t.normalScale),t.side===1&&e.normalScale.value.negate()),t.displacementMap&&(e.displacementMap.value=t.displacementMap,e.displacementScale.value=t.displacementScale,e.displacementBias.value=t.displacementBias)}function m(e,t){t.displacementMap&&(e.displacementMap.value=t.displacementMap,e.displacementScale.value=t.displacementScale,e.displacementBias.value=t.displacementBias)}function h(e,t){t.displacementMap&&(e.displacementMap.value=t.displacementMap,e.displacementScale.value=t.displacementScale,e.displacementBias.value=t.displacementBias),e.referencePosition.value.copy(t.referencePosition),e.nearDistance.value=t.nearDistance,e.farDistance.value=t.farDistance}function g(e,t){t.bumpMap&&(e.bumpMap.value=t.bumpMap,e.bumpScale.value=t.bumpScale,t.side===1&&(e.bumpScale.value*=-1)),t.normalMap&&(e.normalMap.value=t.normalMap,e.normalScale.value.copy(t.normalScale),t.side===1&&e.normalScale.value.negate()),t.displacementMap&&(e.displacementMap.value=t.displacementMap,e.displacementScale.value=t.displacementScale,e.displacementBias.value=t.displacementBias)}return{refreshFogUniforms:t,refreshMaterialUniforms:n}}function co(){let e=document.createElementNS(`http://www.w3.org/1999/xhtml`,`canvas`);return e.style.display=`block`,e}function lo(e){e||={};let t=e.canvas===void 0?co():e.canvas,n=e.context===void 0?null:e.context,r=e.alpha!==void 0&&e.alpha,i=e.depth===void 0||e.depth,a=e.stencil===void 0||e.stencil,o=e.antialias!==void 0&&e.antialias,s=e.premultipliedAlpha===void 0||e.premultipliedAlpha,c=e.preserveDrawingBuffer!==void 0&&e.preserveDrawingBuffer,l=e.powerPreference===void 0?`default`:e.powerPreference,u=e.failIfMajorPerformanceCaveat!==void 0&&e.failIfMajorPerformanceCaveat,d=null,f=null,p=[],m=[];this.domElement=t,this.debug={checkShaderErrors:!0},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.gammaFactor=2,this.outputEncoding=Fe,this.physicallyCorrectLights=!1,this.toneMapping=0,this.toneMappingExposure=1;let h=this,g=!1,_=0,v=0,y=null,b=-1,x=null,S=new N,C=new N,w=null,T=t.width,E=t.height,D=1,ee=null,te=null,ne=new N(0,0,T,E),re=new N(0,0,T,E),ie=!1,ae=new Ir,oe=!1,se=!1,ce=new F,le=new P,ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function O(){return y===null?D:1}let k=n;function de(e,n){for(let r=0;r<e.length;r++){let i=e[r],a=t.getContext(i,n);if(a!==null)return a}return null}try{let e={alpha:r,depth:i,stencil:a,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(t.addEventListener(`webglcontextlost`,Le,!1),t.addEventListener(`webglcontextrestored`,Re,!1),k===null){let t=[`webgl2`,`webgl`,`experimental-webgl`];if(h.isWebGL1Renderer===!0&&t.shift(),k=de(t,e),k===null)throw de(t)?Error(`Error creating WebGL context with your selected attributes.`):Error(`Error creating WebGL context.`)}k.getShaderPrecisionFormat===void 0&&(k.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(e){throw console.error(`THREE.WebGLRenderer: `+e.message),e}let fe,A,j,pe,me,he,ge,_e,ve,ye,xe,Se,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne;function Pe(){fe=new qr(k),A=new Wr(k,fe,e),fe.init(A),Me=new to(k,fe,A),j=new $a(k,fe,A),pe=new Xr(k),me=new Ia,he=new eo(k,fe,j,me,A,Me,pe),ge=new Kr(h),_e=new Rr(k,A),Ne=new Hr(k,fe,_e,A),ve=new Jr(k,_e,pe,Ne),ye=new ei(k,ve,_e,pe),ke=new $r(k),Ee=new Gr(me),xe=new Fa(h,ge,fe,A,Ne,Ee),Se=new so(me),we=new Ba(me),Te=new qa(fe,A),Oe=new Vr(h,ge,j,ye,s),De=new Qa(h,ye,A),Ae=new Ur(k,fe,pe,A),je=new Yr(k,fe,pe,A),pe.programs=xe.programs,h.capabilities=A,h.extensions=fe,h.properties=me,h.renderLists=we,h.shadowMap=De,h.state=j,h.info=pe}Pe();let Ie=new oo(h,k);this.xr=Ie,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){let e=fe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=fe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return D},this.setPixelRatio=function(e){e!==void 0&&(D=e,this.setSize(T,E,!1))},this.getSize=function(e){return e===void 0&&(console.warn(`WebGLRenderer: .getsize() now requires a Vector2 as an argument`),e=new M),e.set(T,E)},this.setSize=function(e,n,r){Ie.isPresenting?console.warn(`THREE.WebGLRenderer: Can't change size while VR device is presenting.`):(T=e,E=n,t.width=Math.floor(e*D),t.height=Math.floor(n*D),r!==!1&&(t.style.width=e+`px`,t.style.height=n+`px`),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e===void 0&&(console.warn(`WebGLRenderer: .getdrawingBufferSize() now requires a Vector2 as an argument`),e=new M),e.set(T*D,E*D).floor()},this.setDrawingBufferSize=function(e,n,r){T=e,E=n,D=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.getCurrentViewport=function(e){return e===void 0&&(console.warn(`WebGLRenderer: .getCurrentViewport() now requires a Vector4 as an argument`),e=new N),e.copy(S)},this.getViewport=function(e){return e.copy(ne)},this.setViewport=function(e,t,n,r){e.isVector4?ne.set(e.x,e.y,e.z,e.w):ne.set(e,t,n,r),j.viewport(S.copy(ne).multiplyScalar(D).floor())},this.getScissor=function(e){return e.copy(re)},this.setScissor=function(e,t,n,r){e.isVector4?re.set(e.x,e.y,e.z,e.w):re.set(e,t,n,r),j.scissor(C.copy(re).multiplyScalar(D).floor())},this.getScissorTest=function(){return ie},this.setScissorTest=function(e){j.setScissorTest(ie=e)},this.setOpaqueSort=function(e){ee=e},this.setTransparentSort=function(e){te=e},this.getClearColor=function(e){return e===void 0&&(console.warn(`WebGLRenderer: .getClearColor() now requires a Color as an argument`),e=new I),e.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor.apply(Oe,arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha.apply(Oe,arguments)},this.clear=function(e,t,n){let r=0;(e===void 0||e)&&(r|=16384),(t===void 0||t)&&(r|=256),(n===void 0||n)&&(r|=1024),k.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Le,!1),t.removeEventListener(`webglcontextrestored`,Re,!1),we.dispose(),Te.dispose(),me.dispose(),ge.dispose(),ye.dispose(),Ne.dispose(),Ie.dispose(),Ie.removeEventListener(`sessionstart`,Ge),Ie.removeEventListener(`sessionend`,Ke),qe.stop()};function Le(e){e.preventDefault(),console.log(`THREE.WebGLRenderer: Context Lost.`),g=!0}function Re(){console.log(`THREE.WebGLRenderer: Context Restored.`),g=!1;let e=pe.autoReset,t=De.enabled,n=De.autoUpdate,r=De.needsUpdate,i=De.type;Pe(),pe.autoReset=e,De.enabled=t,De.autoUpdate=n,De.needsUpdate=r,De.type=i}function ze(e){let t=e.target;t.removeEventListener(`dispose`,ze),Be(t)}function Be(e){Ve(e),me.remove(e)}function Ve(e){let t=me.get(e).programs;t!==void 0&&t.forEach(function(e){xe.releaseProgram(e)})}function He(e,t){e.render(function(e){h.renderBufferImmediate(e,t)})}this.renderBufferImmediate=function(e,t){Ne.initAttributes();let n=me.get(e);e.hasPositions&&!n.position&&(n.position=k.createBuffer()),e.hasNormals&&!n.normal&&(n.normal=k.createBuffer()),e.hasUvs&&!n.uv&&(n.uv=k.createBuffer()),e.hasColors&&!n.color&&(n.color=k.createBuffer());let r=t.getAttributes();e.hasPositions&&(k.bindBuffer(34962,n.position),k.bufferData(34962,e.positionArray,35048),Ne.enableAttribute(r.position),k.vertexAttribPointer(r.position,3,5126,!1,0,0)),e.hasNormals&&(k.bindBuffer(34962,n.normal),k.bufferData(34962,e.normalArray,35048),Ne.enableAttribute(r.normal),k.vertexAttribPointer(r.normal,3,5126,!1,0,0)),e.hasUvs&&(k.bindBuffer(34962,n.uv),k.bufferData(34962,e.uvArray,35048),Ne.enableAttribute(r.uv),k.vertexAttribPointer(r.uv,2,5126,!1,0,0)),e.hasColors&&(k.bindBuffer(34962,n.color),k.bufferData(34962,e.colorArray,35048),Ne.enableAttribute(r.color),k.vertexAttribPointer(r.color,3,5126,!1,0,0)),Ne.disableUnusedAttributes(),k.drawArrays(4,0,e.count),e.count=0},this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ue);let o=i.isMesh&&i.matrixWorld.determinant()<0,s=$e(e,t,r,i);j.setMaterial(r,o);let c=n.index,l=n.attributes.position;if(c===null){if(l===void 0||l.count===0)return}else if(c.count===0)return;let u=1;r.wireframe===!0&&(c=ve.getWireframeAttribute(n),u=2),(r.morphTargets||r.morphNormals)&&ke.update(i,n,r,s),Ne.setup(i,r,s,n,c);let d,f=Ae;c!==null&&(d=_e.get(c),f=je,f.setIndex(d));let p=c===null?l.count:c.count,m=n.drawRange.start*u,h=n.drawRange.count*u,g=a===null?0:a.start*u,_=a===null?1/0:a.count*u,v=Math.max(m,g),y=Math.min(p,m+h,g+_)-1,b=Math.max(0,y-v+1);if(b!==0){if(i.isMesh)r.wireframe===!0?(j.setLineWidth(r.wireframeLinewidth*O()),f.setMode(1)):f.setMode(4);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),j.setLineWidth(e*O()),i.isLineSegments?f.setMode(1):i.isLineLoop?f.setMode(2):f.setMode(3)}else i.isPoints?f.setMode(0):i.isSprite&&f.setMode(4);if(i.isInstancedMesh)f.renderInstances(v,b,i.count);else if(n.isInstancedBufferGeometry){let e=Math.min(n.instanceCount,n._maxInstanceCount);f.renderInstances(v,b,e)}else f.render(v,b)}},this.compile=function(e,t){f=Te.get(e),f.init(),e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(f.pushLight(e),e.castShadow&&f.pushShadow(e))}),f.setupLights(),e.traverse(function(t){let n=t.material;if(n){if(Array.isArray(n))for(let r=0;r<n.length;r++){let i=n[r];Ze(i,e,t)}else Ze(n,e,t)}})};let Ue=null;function We(e){Ue&&Ue(e)}function Ge(){qe.stop()}function Ke(){qe.start()}let qe=new Lr;qe.setAnimationLoop(We),typeof window<`u`&&qe.setContext(window),this.setAnimationLoop=function(e){Ue=e,Ie.setAnimationLoop(e),e===null?qe.stop():qe.start()},Ie.addEventListener(`sessionstart`,Ge),Ie.addEventListener(`sessionend`,Ke),this.render=function(e,t){let n,r;if(arguments[2]!==void 0&&(console.warn(`THREE.WebGLRenderer.render(): the renderTarget argument has been removed. Use .setRenderTarget() instead.`),n=arguments[2]),arguments[3]!==void 0&&(console.warn(`THREE.WebGLRenderer.render(): the forceClear argument has been removed. Use .clear() instead.`),r=arguments[3]),t!==void 0&&t.isCamera!==!0){console.error(`THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(g===!0)return;e.autoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.updateMatrixWorld(),Ie.enabled===!0&&Ie.isPresenting===!0&&(t=Ie.getCamera(t)),e.isScene===!0&&e.onBeforeRender(h,e,t,n||y),f=Te.get(e,m.length),f.init(),m.push(f),ce.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ae.setFromProjectionMatrix(ce),se=this.localClippingEnabled,oe=Ee.init(this.clippingPlanes,se,t),d=we.get(e,p.length),d.init(),p.push(d),Je(e,t,0,h.sortObjects),d.finish(),h.sortObjects===!0&&d.sort(ee,te),oe===!0&&Ee.beginShadows();let i=f.state.shadowsArray;De.render(i,e,t),f.setupLights(),f.setupLightsView(t),oe===!0&&Ee.endShadows(),this.info.autoReset===!0&&this.info.reset(),n!==void 0&&this.setRenderTarget(n),Oe.render(d,e,t,r);let a=d.opaque,o=d.transparent;a.length>0&&Ye(a,e,t),o.length>0&&Ye(o,e,t),y!==null&&(he.updateRenderTargetMipmap(y),he.updateMultisampleRenderTarget(y)),e.isScene===!0&&e.onAfterRender(h,e,t),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1),Ne.resetDefaultState(),b=-1,x=null,m.pop(),f=m.length>0?m[m.length-1]:null,p.pop(),d=p.length>0?p[p.length-1]:null};function Je(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)f.pushLight(e),e.castShadow&&f.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||ae.intersectsSprite(e)){r&&le.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ce);let t=ye.update(e),i=e.material;i.visible&&d.push(e,t,i,n,le.z,null)}}else if(e.isImmediateRenderObject)r&&le.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ce),d.push(e,null,e.material,n,le.z,null);else if((e.isMesh||e.isLine||e.isPoints)&&(e.isSkinnedMesh&&e.skeleton.frame!==pe.render.frame&&(e.skeleton.update(),e.skeleton.frame=pe.render.frame),!e.frustumCulled||ae.intersectsObject(e))){r&&le.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ce);let t=ye.update(e),i=e.material;if(Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&d.push(e,t,s,n,le.z,o)}}else i.visible&&d.push(e,t,i,n,le.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)Je(i[e],t,n,r)}function Ye(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],o=a.object,s=a.geometry,c=r===null?a.material:r,l=a.group;if(n.isArrayCamera){let e=n.cameras;for(let n=0,r=e.length;n<r;n++){let r=e[n];o.layers.test(r.layers)&&(j.viewport(S.copy(r.viewport)),f.setupLightsView(r),Xe(o,t,r,s,c,l))}}else Xe(o,t,n,s,c,l)}}function Xe(e,t,n,r,i,a){if(e.onBeforeRender(h,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),e.isImmediateRenderObject){let r=$e(n,t,i,e);j.setMaterial(i),Ne.reset(),He(e,r)}else h.renderBufferDirect(n,t,r,i,e,a);e.onAfterRender(h,t,n,r,i,a)}function Ze(e,t,n){t.isScene!==!0&&(t=ue);let r=me.get(e),i=f.state.lights,a=f.state.shadowsArray,o=i.state.version,s=xe.getParameters(e,i.state,a,t,n),c=xe.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial?t.environment:null,r.fog=t.fog,r.envMap=ge.get(e.envMap||r.environment),l===void 0&&(e.addEventListener(`dispose`,ze),l=new Map,r.programs=l);let u=l.get(c);if(u!==void 0){if(r.currentProgram===u&&r.lightsStateVersion===o)return Qe(e,s),u}else s.uniforms=xe.getUniforms(e),e.onBuild(s,h),e.onBeforeCompile(s,h),u=xe.acquireProgram(s,c),l.set(c,u),r.uniforms=s.uniforms;let d=r.uniforms;(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(d.clippingPlanes=Ee.uniform),Qe(e,s),r.needsLights=tt(e),r.lightsStateVersion=o,r.needsLights&&(d.ambientLightColor.value=i.state.ambient,d.lightProbe.value=i.state.probe,d.directionalLights.value=i.state.directional,d.directionalLightShadows.value=i.state.directionalShadow,d.spotLights.value=i.state.spot,d.spotLightShadows.value=i.state.spotShadow,d.rectAreaLights.value=i.state.rectArea,d.ltc_1.value=i.state.rectAreaLTC1,d.ltc_2.value=i.state.rectAreaLTC2,d.pointLights.value=i.state.point,d.pointLightShadows.value=i.state.pointShadow,d.hemisphereLights.value=i.state.hemi,d.directionalShadowMap.value=i.state.directionalShadowMap,d.directionalShadowMatrix.value=i.state.directionalShadowMatrix,d.spotShadowMap.value=i.state.spotShadowMap,d.spotShadowMatrix.value=i.state.spotShadowMatrix,d.pointShadowMap.value=i.state.pointShadowMap,d.pointShadowMatrix.value=i.state.pointShadowMatrix);let p=u.getUniforms(),m=oa.seqWithValue(p.seq,d);return r.currentProgram=u,r.uniformsList=m,u}function Qe(e,t){let n=me.get(e);n.outputEncoding=t.outputEncoding,n.instancing=t.instancing,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas}function $e(e,t,n,r){t.isScene!==!0&&(t=ue),he.resetTextureUnits();let i=t.fog,a=n.isMeshStandardMaterial?t.environment:null,o=y===null?h.outputEncoding:y.texture.encoding,s=ge.get(n.envMap||a),c=n.vertexColors===!0&&r.geometry&&r.geometry.attributes.color&&r.geometry.attributes.color.itemSize===4,l=me.get(n),u=f.state.lights;if(oe===!0&&(se===!0||e!==x)){let t=e===x&&n.id===b;Ee.setState(n,e,t)}let d=!1;n.version===l.__version?l.needsLights&&l.lightsStateVersion!==u.state.version?d=!0:l.outputEncoding===o?r.isInstancedMesh&&l.instancing===!1||!r.isInstancedMesh&&l.instancing===!0?d=!0:l.envMap===s?(n.fog&&l.fog!==i||l.numClippingPlanes!==void 0&&(l.numClippingPlanes!==Ee.numPlanes||l.numIntersection!==Ee.numIntersection)||l.vertexAlphas!==c)&&(d=!0):d=!0:d=!0:(d=!0,l.__version=n.version);let p=l.currentProgram;d===!0&&(p=Ze(n,t,r));let m=!1,g=!1,_=!1,v=p.getUniforms(),S=l.uniforms;if(j.useProgram(p.program)&&(m=!0,g=!0,_=!0),n.id!==b&&(b=n.id,g=!0),m||x!==e){if(v.setValue(k,`projectionMatrix`,e.projectionMatrix),A.logarithmicDepthBuffer&&v.setValue(k,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),x!==e&&(x=e,g=!0,_=!0),n.isShaderMaterial||n.isMeshPhongMaterial||n.isMeshToonMaterial||n.isMeshStandardMaterial||n.envMap){let t=v.map.cameraPosition;t!==void 0&&t.setValue(k,le.setFromMatrixPosition(e.matrixWorld))}(n.isMeshPhongMaterial||n.isMeshToonMaterial||n.isMeshLambertMaterial||n.isMeshBasicMaterial||n.isMeshStandardMaterial||n.isShaderMaterial)&&v.setValue(k,`isOrthographic`,e.isOrthographicCamera===!0),(n.isMeshPhongMaterial||n.isMeshToonMaterial||n.isMeshLambertMaterial||n.isMeshBasicMaterial||n.isMeshStandardMaterial||n.isShaderMaterial||n.isShadowMaterial||n.skinning)&&v.setValue(k,`viewMatrix`,e.matrixWorldInverse)}if(n.skinning){v.setOptional(k,r,`bindMatrix`),v.setOptional(k,r,`bindMatrixInverse`);let e=r.skeleton;if(e){let t=e.bones;if(A.floatVertexTextures){if(e.boneTexture===null){let n=Math.sqrt(t.length*4);n=rt(n),n=Math.max(n,4);let r=new Float32Array(n*n*4);r.set(e.boneMatrices);let i=new Nr(r,n,n,Ce,be);e.boneMatrices=r,e.boneTexture=i,e.boneTextureSize=n}v.setValue(k,`boneTexture`,e.boneTexture,he),v.setValue(k,`boneTextureSize`,e.boneTextureSize)}else v.setOptional(k,e,`boneMatrices`)}}return(g||l.receiveShadow!==r.receiveShadow)&&(l.receiveShadow=r.receiveShadow,v.setValue(k,`receiveShadow`,r.receiveShadow)),g&&(v.setValue(k,`toneMappingExposure`,h.toneMappingExposure),l.needsLights&&et(S,_),i&&n.fog&&Se.refreshFogUniforms(S,i),Se.refreshMaterialUniforms(S,n,D,E),oa.upload(k,l.uniformsList,S,he)),n.isShaderMaterial&&n.uniformsNeedUpdate===!0&&(oa.upload(k,l.uniformsList,S,he),n.uniformsNeedUpdate=!1),n.isSpriteMaterial&&v.setValue(k,`center`,r.center),v.setValue(k,`modelViewMatrix`,r.modelViewMatrix),v.setValue(k,`normalMatrix`,r.normalMatrix),v.setValue(k,`modelMatrix`,r.matrixWorld),p}function et(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function tt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return _},this.getActiveMipmapLevel=function(){return v},this.getRenderTarget=function(){return y},this.setRenderTarget=function(e,t=0,n=0){y=e,_=t,v=n,e&&me.get(e).__webglFramebuffer===void 0&&he.setupRenderTarget(e);let r=null,i=!1,a=!1;if(e){let n=e.texture;(n.isDataTexture3D||n.isDataTexture2DArray)&&(a=!0);let o=me.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=o[t],i=!0):r=e.isWebGLMultisampleRenderTarget?me.get(e).__webglMultisampledFramebuffer:o,S.copy(e.viewport),C.copy(e.scissor),w=e.scissorTest}else S.copy(ne).multiplyScalar(D).floor(),C.copy(re).multiplyScalar(D).floor(),w=ie;if(j.bindFramebuffer(36160,r),j.viewport(S),j.scissor(C),j.setScissorTest(w),i){let r=me.get(e.texture);k.framebufferTexture2D(36160,36064,34069+t,r.__webglTexture,n)}else if(a){let r=me.get(e.texture),i=t||0;k.framebufferTextureLayer(36160,36064,r.__webglTexture,n||0,i)}},this.readRenderTargetPixels=function(e,t,n,r,i,a,o){if(!(e&&e.isWebGLRenderTarget)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let s=me.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(s=s[o]),s){j.bindFramebuffer(36160,s);try{let o=e.texture,s=o.format,c=o.type;if(s!==1023&&Me.convert(s)!==k.getParameter(35739)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}let l=c===1016&&(fe.has(`EXT_color_buffer_half_float`)||A.isWebGL2&&fe.has(`EXT_color_buffer_float`));if(c!==1009&&Me.convert(c)!==k.getParameter(35738)&&!(c===1015&&(A.isWebGL2||fe.has(`OES_texture_float`)||fe.has(`WEBGL_color_buffer_float`)))&&!l){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}k.checkFramebufferStatus(36160)===36053?t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&k.readPixels(t,n,r,i,Me.convert(s),Me.convert(c),a):console.error(`THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.`)}finally{let e=y===null?null:me.get(y).__webglFramebuffer;j.bindFramebuffer(36160,e)}}},this.copyFramebufferToTexture=function(e,t,n=0){let r=2**-n,i=Math.floor(t.image.width*r),a=Math.floor(t.image.height*r),o=Me.convert(t.format);he.setTexture2D(t,0),k.copyTexImage2D(3553,n,o,e.x,e.y,i,a,0),j.unbindTexture()},this.copyTextureToTexture=function(e,t,n,r=0){let i=t.image.width,a=t.image.height,o=Me.convert(n.format),s=Me.convert(n.type);he.setTexture2D(n,0),k.pixelStorei(37440,n.flipY),k.pixelStorei(37441,n.premultiplyAlpha),k.pixelStorei(3317,n.unpackAlignment),t.isDataTexture?k.texSubImage2D(3553,r,e.x,e.y,i,a,o,s,t.image.data):t.isCompressedTexture?k.compressedTexSubImage2D(3553,r,e.x,e.y,t.mipmaps[0].width,t.mipmaps[0].height,o,t.mipmaps[0].data):k.texSubImage2D(3553,r,e.x,e.y,o,s,t.image),r===0&&n.generateMipmaps&&k.generateMipmap(3553),j.unbindTexture()},this.copyTextureToTexture3D=function(e,t,n,r,i=0){if(h.isWebGL1Renderer){console.warn(`THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.`);return}let{width:a,height:o,data:s}=n.image,c=Me.convert(r.format),l=Me.convert(r.type),u;if(r.isDataTexture3D)he.setTexture3D(r,0),u=32879;else if(r.isDataTexture2DArray)he.setTexture2DArray(r,0),u=35866;else{console.warn(`THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.`);return}k.pixelStorei(37440,r.flipY),k.pixelStorei(37441,r.premultiplyAlpha),k.pixelStorei(3317,r.unpackAlignment);let d=k.getParameter(3314),f=k.getParameter(32878),p=k.getParameter(3316),m=k.getParameter(3315),g=k.getParameter(32877);k.pixelStorei(3314,a),k.pixelStorei(32878,o),k.pixelStorei(3316,e.min.x),k.pixelStorei(3315,e.min.y),k.pixelStorei(32877,e.min.z),k.texSubImage3D(u,i,t.x,t.y,t.z,e.max.x-e.min.x+1,e.max.y-e.min.y+1,e.max.z-e.min.z+1,c,l,s),k.pixelStorei(3314,d),k.pixelStorei(32878,f),k.pixelStorei(3316,p),k.pixelStorei(3315,m),k.pixelStorei(32877,g),i===0&&r.generateMipmaps&&k.generateMipmap(u),j.unbindTexture()},this.initTexture=function(e){he.setTexture2D(e,0),j.unbindTexture()},this.resetState=function(){_=0,v=0,y=null,j.reset(),Ne.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}var uo=class extends lo{};uo.prototype.isWebGL1Renderer=!0;var fo=class e{constructor(e,t=25e-5){this.name=``,this.color=new I(e),this.density=t}clone(){return new e(this.color,this.density)}toJSON(){return{type:`FogExp2`,color:this.color.getHex(),density:this.density}}};fo.prototype.isFogExp2=!0;var po=class e{constructor(e,t=1,n=1e3){this.name=``,this.color=new I(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,color:this.color.getHex(),near:this.near,far:this.far}}};po.prototype.isFog=!0;var mo=class extends hn{constructor(){super(),this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.overrideMaterial=null,this.autoUpdate=!0,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.autoUpdate=e.autoUpdate,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.background!==null&&(t.object.background=this.background.toJSON(e)),this.environment!==null&&(t.object.environment=this.environment.toJSON(e)),this.fog!==null&&(t.object.fog=this.fog.toJSON()),t}};mo.prototype.isScene=!0;var ho=class e{constructor(e,t){this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=Ke,this.updateRange={offset:0,count:-1},this.version=0,this.uuid=Qe(),this.onUploadCallback=function(){}}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qe()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let n=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),r=new e(n,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qe()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.prototype.slice.call(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}};ho.prototype.isInterleavedBuffer=!0;var go=new P,_o=class e{constructor(e,t,n,r){this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r===!0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)go.x=this.getX(t),go.y=this.getY(t),go.z=this.getZ(t),go.applyMatrix4(e),this.setXYZ(t,go.x,go.y,go.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)go.x=this.getX(t),go.y=this.getY(t),go.z=this.getZ(t),go.applyNormalMatrix(e),this.setXYZ(t,go.x,go.y,go.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)go.x=this.getX(t),go.y=this.getY(t),go.z=this.getZ(t),go.transformDirection(e),this.setXYZ(t,go.x,go.y,go.z);return this}setX(e,t){return this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){return this.data.array[e*this.data.stride+this.offset]}getY(e){return this.data.array[e*this.data.stride+this.offset+1]}getZ(e){return this.data.array[e*this.data.stride+this.offset+2]}getW(e){return this.data.array[e*this.data.stride+this.offset+3]}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){console.log(`THREE.InterleavedBufferAttribute.clone(): Cloning an interlaved buffer attribute will deinterleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new L(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log(`THREE.InterleavedBufferAttribute.toJSON(): Serializing an interlaved buffer attribute will deinterleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};_o.prototype.isInterleavedBufferAttribute=!0;var vo=class extends Mn{constructor(e){super(),this.type=`SpriteMaterial`,this.color=new I(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this}};vo.prototype.isSpriteMaterial=!0;var yo,bo=new P,xo=new P,So=new P,Co=new M,wo=new M,To=new F,Eo=new P,Do=new P,Oo=new P,ko=new M,Ao=new M,jo=new M,Mo=class extends hn{constructor(e){if(super(),this.type=`Sprite`,yo===void 0){yo=new z;let e=new ho(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);yo.setIndex([0,1,2,0,2,3]),yo.setAttribute(`position`,new _o(e,3,0,!1)),yo.setAttribute(`uv`,new _o(e,2,3,!1))}this.geometry=yo,this.material=e===void 0?new vo:e,this.center=new M(.5,.5)}raycast(e,t){e.camera===null&&console.error(`THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),xo.setFromMatrixScale(this.matrixWorld),To.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),So.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&xo.multiplyScalar(-So.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;No(Eo.set(-.5,-.5,0),So,a,xo,r,i),No(Do.set(.5,-.5,0),So,a,xo,r,i),No(Oo.set(.5,.5,0),So,a,xo,r,i),ko.set(0,0),Ao.set(1,0),jo.set(1,1);let o=e.ray.intersectTriangle(Eo,Do,Oo,!1,bo);if(o===null&&(No(Do.set(-.5,.5,0),So,a,xo,r,i),Ao.set(0,1),o=e.ray.intersectTriangle(Eo,Oo,Do,!1,bo),o===null))return;let s=e.ray.origin.distanceTo(bo);s<e.near||s>e.far||t.push({distance:s,point:bo.clone(),uv:An.getUV(bo,Eo,Do,Oo,ko,Ao,jo,new M),face:null,object:this})}copy(e){return super.copy(e),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};Mo.prototype.isSprite=!0;function No(e,t,n,r,i,a){Co.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?wo.copy(Co):(wo.x=a*Co.x-i*Co.y,wo.y=i*Co.x+a*Co.y),e.copy(t),e.x+=wo.x,e.y+=wo.y,e.applyMatrix4(To)}var Po=new P,Fo=new N,Io=new N,Lo=new P,Ro=new F,zo=class extends gr{constructor(e,t){super(e,t),this.type=`SkinnedMesh`,this.bindMode=`attached`,this.bindMatrix=new F,this.bindMatrixInverse=new F}copy(e){return super.copy(e),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new N,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.x=t.getX(n),e.y=t.getY(n),e.z=t.getZ(n),e.w=t.getW(n);let r=1/e.manhattanLength();r===1/0?e.set(1,0,0,0):e.multiplyScalar(r),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===`attached`?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===`detached`?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn(`THREE.SkinnedMesh: Unrecognized bindMode: `+this.bindMode)}boneTransform(e,t){let n=this.skeleton,r=this.geometry;Fo.fromBufferAttribute(r.attributes.skinIndex,e),Io.fromBufferAttribute(r.attributes.skinWeight,e),Po.fromBufferAttribute(r.attributes.position,e).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let e=0;e<4;e++){let r=Io.getComponent(e);if(r!==0){let i=Fo.getComponent(e);Ro.multiplyMatrices(n.bones[i].matrixWorld,n.boneInverses[i]),t.addScaledVector(Lo.copy(Po).applyMatrix4(Ro),r)}}return t.applyMatrix4(this.bindMatrixInverse)}};zo.prototype.isSkinnedMesh=!0;var Bo=class extends hn{constructor(){super(),this.type=`Bone`}};Bo.prototype.isBone=!0;var Vo=new F,Ho=new F,Uo=[],Wo=new gr,Go=class extends gr{constructor(e,t,n){super(e,t),this.instanceMatrix=new L(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.frustumCulled=!1}copy(e){return super.copy(e),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Wo.geometry=this.geometry,Wo.material=this.material,Wo.material!==void 0)for(let i=0;i<r;i++){this.getMatrixAt(i,Vo),Ho.multiplyMatrices(n,Vo),Wo.matrixWorld=Ho,Wo.raycast(e,Uo);for(let e=0,n=Uo.length;e<n;e++){let n=Uo[e];n.instanceId=i,n.object=this,t.push(n)}Uo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new L(new Float32Array(this.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:`dispose`})}};Go.prototype.isInstancedMesh=!0;var Ko=class extends Mn{constructor(e){super(),this.type=`LineBasicMaterial`,this.color=new I(16777215),this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.morphTargets=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.morphTargets=e.morphTargets,this}};Ko.prototype.isLineBasicMaterial=!0;var qo=new P,Jo=new P,Yo=new F,Xo=new Ut,Zo=new Ft,Qo=class extends hn{constructor(e=new z,t=new Ko){super(),this.type=`Line`,this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),this.material=e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.isBufferGeometry){if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)qo.fromBufferAttribute(t,e-1),Jo.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=qo.distanceTo(Jo);e.setAttribute(`lineDistance`,new R(n,1))}else console.warn(`THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`)}else e.isGeometry&&console.error(`THREE.Line.computeLineDistances() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.`);return this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Zo.copy(n.boundingSphere),Zo.applyMatrix4(r),Zo.radius+=i,e.ray.intersectsSphere(Zo)===!1)return;Yo.copy(r).invert(),Xo.copy(e.ray).applyMatrix4(Yo);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=new P,l=new P,u=new P,d=new P,f=this.isLineSegments?2:1;if(n.isBufferGeometry){let r=n.index,i=n.attributes.position;if(r!==null){let n=Math.max(0,a.start),o=Math.min(r.count,a.start+a.count);for(let a=n,p=o-1;a<p;a+=f){let n=r.getX(a),o=r.getX(a+1);if(c.fromBufferAttribute(i,n),l.fromBufferAttribute(i,o),Xo.distanceSqToSegment(c,l,d,u)>s)continue;d.applyMatrix4(this.matrixWorld);let f=e.ray.origin.distanceTo(d);f<e.near||f>e.far||t.push({distance:f,point:u.clone().applyMatrix4(this.matrixWorld),index:a,face:null,faceIndex:null,object:this})}}else{let n=Math.max(0,a.start),r=Math.min(i.count,a.start+a.count);for(let a=n,o=r-1;a<o;a+=f){if(c.fromBufferAttribute(i,a),l.fromBufferAttribute(i,a+1),Xo.distanceSqToSegment(c,l,d,u)>s)continue;d.applyMatrix4(this.matrixWorld);let n=e.ray.origin.distanceTo(d);n<e.near||n>e.far||t.push({distance:n,point:u.clone().applyMatrix4(this.matrixWorld),index:a,face:null,faceIndex:null,object:this})}}}else n.isGeometry&&console.error(`THREE.Line.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.`)}updateMorphTargets(){let e=this.geometry;if(e.isBufferGeometry){let t=e.morphAttributes,n=Object.keys(t);if(n.length>0){let e=t[n[0]];if(e!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let t=0,n=e.length;t<n;t++){let n=e[t].name||String(t);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=t}}}}else{let t=e.morphTargets;t!==void 0&&t.length>0&&console.error(`THREE.Line.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.`)}}};Qo.prototype.isLine=!0;var $o=new P,es=new P,ts=class extends Qo{constructor(e,t){super(e,t),this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.isBufferGeometry){if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)$o.fromBufferAttribute(t,e),es.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+$o.distanceTo(es);e.setAttribute(`lineDistance`,new R(n,1))}else console.warn(`THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`)}else e.isGeometry&&console.error(`THREE.LineSegments.computeLineDistances() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.`);return this}};ts.prototype.isLineSegments=!0;var ns=class extends Qo{constructor(e,t){super(e,t),this.type=`LineLoop`}};ns.prototype.isLineLoop=!0;var rs=class extends Mn{constructor(e){super(),this.type=`PointsMaterial`,this.color=new I(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.morphTargets=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.morphTargets=e.morphTargets,this}};rs.prototype.isPointsMaterial=!0;var is=new F,as=new Ut,os=new Ft,ss=new P,cs=class extends hn{constructor(e=new z,t=new rs){super(),this.type=`Points`,this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e){return super.copy(e),this.material=e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),os.copy(n.boundingSphere),os.applyMatrix4(r),os.radius+=i,e.ray.intersectsSphere(os)===!1)return;is.copy(r).invert(),as.copy(e.ray).applyMatrix4(is);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o;if(n.isBufferGeometry){let i=n.index,o=n.attributes.position;if(i!==null){let n=Math.max(0,a.start),c=Math.min(i.count,a.start+a.count);for(let a=n,l=c;a<l;a++){let n=i.getX(a);ss.fromBufferAttribute(o,n),ls(ss,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(o.count,a.start+a.count);for(let a=n,c=i;a<c;a++)ss.fromBufferAttribute(o,a),ls(ss,a,s,r,e,t,this)}}else console.error(`THREE.Points.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.`)}updateMorphTargets(){let e=this.geometry;if(e.isBufferGeometry){let t=e.morphAttributes,n=Object.keys(t);if(n.length>0){let e=t[n[0]];if(e!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let t=0,n=e.length;t<n;t++){let n=e[t].name||String(t);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=t}}}}else{let t=e.morphTargets;t!==void 0&&t.length>0&&console.error(`THREE.Points.updateMorphTargets() does not support THREE.Geometry. Use THREE.BufferGeometry instead.`)}}};cs.prototype.isPoints=!0;function ls(e,t,n,r,i,a,o){let s=as.distanceSqToPoint(e);if(s<n){let n=new P;as.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,object:o})}}var us=class extends lt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.format=o===void 0?Se:o,this.minFilter=a===void 0?me:a,this.magFilter=i===void 0?me:i,this.generateMipmaps=!1;let l=this;function u(){l.needsUpdate=!0,e.requestVideoFrameCallback(u)}`requestVideoFrameCallback`in e&&e.requestVideoFrameCallback(u)}clone(){return new this.constructor(this.image).copy(this)}update(){let e=this.image;!(`requestVideoFrameCallback`in e)&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}};us.prototype.isVideoTexture=!0;var ds=class extends lt{constructor(e,t,n,r,i,a,o,s,c,l,u,d){super(null,a,o,s,c,l,r,i,u,d),this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}};ds.prototype.isCompressedTexture=!0;var fs=class extends lt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.needsUpdate=!0}};fs.prototype.isCanvasTexture=!0;var ps=class extends lt{constructor(e,t,n,r,i,a,o,s,c,l){if(l=l===void 0?we:l,l!==1026&&l!==1027)throw Error(`DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);n===void 0&&l===1026&&(n=ve),n===void 0&&l===1027&&(n=xe),super(null,r,i,a,o,s,l,n,c),this.image={width:e,height:t},this.magFilter=o===void 0?A:o,this.minFilter=s===void 0?A:s,this.flipY=!1,this.generateMipmaps=!1}};ps.prototype.isDepthTexture=!0;var ms=class extends z{constructor(e=1,t=8,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new P,l=new M;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new R(a,3)),this.setAttribute(`normal`,new R(o,3)),this.setAttribute(`uv`,new R(s,2))}},hs=class extends z{constructor(e=1,t=1,n=1,r=8,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new R(u,3)),this.setAttribute(`normal`,new R(d,3)),this.setAttribute(`uv`,new R(f,2));function _(){let a=new P,_=new P,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let e=0;e<r;e++)for(let t=0;t<i;t++){let n=m[t][e],r=m[t+1][e],i=m[t+1][e+1],a=m[t][e+1];l.push(n,r,a),l.push(r,i,a),v+=6}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new M,m=new P,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}},gs=class extends hs{constructor(e=1,t=1,n=8,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}},_s=class extends z{constructor(e,t,n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new R(i,3)),this.setAttribute(`normal`,new R(i.slice(),3)),this.setAttribute(`uv`,new R(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new P,r=new P,i=new P;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new P;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new P;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new P,t=new P,n=new P,r=new P,o=new M,s=new M,c=new M;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}},vs=class extends _s{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n,i=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r];super(i,[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type=`DodecahedronGeometry`,this.parameters={radius:e,detail:t}}};new P,new P,new P,new An;var ys={triangulate:function(e,t,n){n||=2;let r=t&&t.length,i=r?t[0]*n:e.length,a=bs(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l,u,d,f,p;if(r&&(a=Ds(e,t,a,n)),e.length>80*n){s=l=e[0],c=u=e[1];for(let t=n;t<i;t+=n)d=e[t],f=e[t+1],d<s&&(s=d),f<c&&(c=f),d>l&&(l=d),f>u&&(u=f);p=Math.max(l-s,u-c),p=p===0?0:1/p}return Ss(a,o,n,s,c,p),o}};function bs(e,t,n,r,i){let a,o;if(i===Xs(e,t,n,r)>0)for(a=t;a<n;a+=r)o=qs(a,e[a],e[a+1],o);else for(a=n-r;a>=t;a-=r)o=qs(a,e[a],e[a+1],o);return o&&zs(o,o.next)&&(Js(o),o=o.next),o}function xs(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(zs(n,n.next)||Rs(n.prev,n,n.next)===0)){if(Js(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function Ss(e,t,n,r,i,a,o){if(!e)return;!o&&a&&Ms(e,r,i,a);let s=e,c,l;for(;e.prev!==e.next;)if(c=e.prev,l=e.next,a?ws(e,r,i,a):Cs(e))t.push(c.i/n),t.push(e.i/n),t.push(l.i/n),Js(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=Ts(xs(e),t,n),Ss(e,t,n,r,i,a,2)):o===2&&Es(e,t,n,r,i,a):Ss(xs(e),t,n,r,i,a,1);break}}function Cs(e){let t=e.prev,n=e,r=e.next;if(Rs(t,n,r)>=0)return!1;let i=e.next.next;for(;i!==e.prev;){if(Is(t.x,t.y,n.x,n.y,r.x,r.y,i.x,i.y)&&Rs(i.prev,i,i.next)>=0)return!1;i=i.next}return!0}function ws(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Rs(i,a,o)>=0)return!1;let s=i.x<a.x?i.x<o.x?i.x:o.x:a.x<o.x?a.x:o.x,c=i.y<a.y?i.y<o.y?i.y:o.y:a.y<o.y?a.y:o.y,l=i.x>a.x?i.x>o.x?i.x:o.x:a.x>o.x?a.x:o.x,u=i.y>a.y?i.y>o.y?i.y:o.y:a.y>o.y?a.y:o.y,d=Ps(s,c,t,n,r),f=Ps(l,u,t,n,r),p=e.prevZ,m=e.nextZ;for(;p&&p.z>=d&&m&&m.z<=f;){if(p!==e.prev&&p!==e.next&&Is(i.x,i.y,a.x,a.y,o.x,o.y,p.x,p.y)&&Rs(p.prev,p,p.next)>=0||(p=p.prevZ,m!==e.prev&&m!==e.next&&Is(i.x,i.y,a.x,a.y,o.x,o.y,m.x,m.y)&&Rs(m.prev,m,m.next)>=0))return!1;m=m.nextZ}for(;p&&p.z>=d;){if(p!==e.prev&&p!==e.next&&Is(i.x,i.y,a.x,a.y,o.x,o.y,p.x,p.y)&&Rs(p.prev,p,p.next)>=0)return!1;p=p.prevZ}for(;m&&m.z<=f;){if(m!==e.prev&&m!==e.next&&Is(i.x,i.y,a.x,a.y,o.x,o.y,m.x,m.y)&&Rs(m.prev,m,m.next)>=0)return!1;m=m.nextZ}return!0}function Ts(e,t,n){let r=e;do{let i=r.prev,a=r.next.next;!zs(i,a)&&Bs(i,r,r.next,a)&&Ws(i,a)&&Ws(a,i)&&(t.push(i.i/n),t.push(r.i/n),t.push(a.i/n),Js(r),Js(r.next),r=e=a),r=r.next}while(r!==e);return xs(r)}function Es(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&Ls(o,e)){let s=Ks(o,e);o=xs(o,o.next),s=xs(s,s.next),Ss(o,t,n,r,i,a),Ss(s,t,n,r,i,a);return}e=e.next}o=o.next}while(o!==e)}function Ds(e,t,n,r){let i=[],a,o,s,c,l;for(a=0,o=t.length;a<o;a++)s=t[a]*r,c=a<o-1?t[a+1]*r:e.length,l=bs(e,s,c,r,!1),l===l.next&&(l.steiner=!0),i.push(Fs(l));for(i.sort(Os),a=0;a<i.length;a++)ks(i[a],n),n=xs(n,n.next);return n}function Os(e,t){return e.x-t.x}function ks(e,t){if(t=As(e,t),t){let n=Ks(t,e);xs(t,t.next),xs(n,n.next)}}function As(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;do{if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a){if(a=e,e===r){if(i===n.y)return n;if(i===n.next.y)return n.next}o=n.x<n.next.x?n:n.next}}n=n.next}while(n!==t);if(!o)return null;if(r===a)return o;let s=o,c=o.x,l=o.y,u=1/0,d;n=o;do r>=n.x&&n.x>=c&&r!==n.x&&Is(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)&&(d=Math.abs(i-n.y)/(r-n.x),Ws(n,e)&&(d<u||d===u&&(n.x>o.x||n.x===o.x&&js(o,n)))&&(o=n,u=d)),n=n.next;while(n!==s);return o}function js(e,t){return Rs(e.prev,e,t.prev)<0&&Rs(t.next,e,e.next)<0}function Ms(e,t,n,r){let i=e;do i.z===null&&(i.z=Ps(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,Ns(i)}function Ns(e){let t,n,r,i,a,o,s,c,l=1;do{for(n=e,e=null,a=null,o=0;n;){for(o++,r=n,s=0,t=0;t<l&&(s++,r=r.nextZ,r);t++);for(c=l;s>0||c>0&&r;)s!==0&&(c===0||!r||n.z<=r.z)?(i=n,n=n.nextZ,s--):(i=r,r=r.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;n=r}a.nextZ=null,l*=2}while(o>1);return e}function Ps(e,t,n,r,i){return e=32767*(e-n)*i,t=32767*(t-r)*i,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Fs(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Is(e,t,n,r,i,a,o,s){return(i-o)*(t-s)-(e-o)*(a-s)>=0&&(e-o)*(r-s)-(n-o)*(t-s)>=0&&(n-o)*(a-s)-(i-o)*(r-s)>=0}function Ls(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Us(e,t)&&(Ws(e,t)&&Ws(t,e)&&Gs(e,t)&&(Rs(e.prev,e,t.prev)||Rs(e,t.prev,t))||zs(e,t)&&Rs(e.prev,e,e.next)>0&&Rs(t.prev,t,t.next)>0)}function Rs(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function zs(e,t){return e.x===t.x&&e.y===t.y}function Bs(e,t,n,r){let i=Hs(Rs(e,t,n)),a=Hs(Rs(e,t,r)),o=Hs(Rs(n,r,e)),s=Hs(Rs(n,r,t));return!!(i!==a&&o!==s||i===0&&Vs(e,n,t)||a===0&&Vs(e,r,t)||o===0&&Vs(n,e,r)||s===0&&Vs(n,t,r))}function Vs(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function Hs(e){return e>0?1:e<0?-1:0}function Us(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&Bs(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Ws(e,t){return Rs(e.prev,e,e.next)<0?Rs(e,t,e.next)>=0&&Rs(e,e.prev,t)>=0:Rs(e,t,e.prev)<0||Rs(e,e.next,t)<0}function Gs(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Ks(e,t){let n=new Ys(e.i,e.x,e.y),r=new Ys(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function qs(e,t,n,r){let i=new Ys(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Js(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Ys(e,t,n){this.i=e,this.x=t,this.y=n,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Xs(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Zs=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Qs(e),$s(n,e);let a=e.length;t.forEach(Qs);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,$s(n,t[e]);let o=ys.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Qs(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function $s(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var ec=class extends z{constructor(e,t){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new R(r,3)),this.setAttribute(`uv`,new R(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?100:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?6:t.bevelThickness,d=t.bevelSize===void 0?u-2:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?tc:t.UVGenerator;t.amount!==void 0&&(console.warn(`THREE.ExtrudeBufferGeometry: amount has been renamed to depth.`),c=t.amount);let g,_=!1,v,y,b,x;m&&(g=m.getSpacedPoints(s),_=!0,l=!1,v=m.computeFrenetFrames(s,!1),y=new P,b=new P,x=new P),l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!Zs.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];Zs.isClockWise(t)&&(w[e]=t.reverse())}}let T=Zs.triangulateShape(C,w),E=C;for(let e=0,t=w.length;e<t;e++){let t=w[e];C=C.concat(t)}function D(e,t,n){return t||console.error(`THREE.ExtrudeGeometry: vec does not exist`),t.clone().multiplyScalar(n).add(e)}let ee=C.length,te=T.length;function ne(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new M(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new M(r/a,i/a)}let re=[];for(let e=0,t=E.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),re[e]=ne(E[e],E[n],E[r]);let ie=[],ae,oe=re.concat();for(let e=0,t=w.length;e<t;e++){let t=w[e];ae=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),ae[e]=ne(t[e],t[r],t[i]);ie.push(ae),oe=oe.concat(ae)}for(let e=0;e<p;e++){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=E.length;e<t;e++){let t=D(E[e],re[e],r);O(t.x,t.y,-n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];ae=ie[e];for(let e=0,i=t.length;e<i;e++){let i=D(t[e],ae[e],r);O(i.x,i.y,-n)}}}let se=d+f;for(let e=0;e<ee;e++){let t=l?D(C[e],oe[e],se):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),O(x.x,x.y,x.z)):O(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<ee;t++){let n=l?D(C[t],oe[t],se):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),O(x.x,x.y,x.z)):O(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=E.length;e<t;e++){let t=D(E[e],re[e],r);O(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];ae=ie[e];for(let e=0,i=t.length;e<i;e++){let i=D(t[e],ae[e],r);_?O(i.x,i.y+g[s-1].y,g[s-1].x+n):O(i.x,i.y,c+n)}}}ce(),le();function ce(){let e=r.length/3;if(l){let e=0,t=ee*e;for(let e=0;e<te;e++){let n=T[e];k(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=ee*e;for(let e=0;e<te;e++){let n=T[e];k(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<te;e++){let t=T[e];k(t[2],t[1],t[0])}for(let e=0;e<te;e++){let t=T[e];k(t[0]+ee*s,t[1]+ee*s,t[2]+ee*s)}}n.addGroup(e,r.length/3-e,0)}function le(){let e=r.length/3,t=0;ue(E,t),t+=E.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];ue(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function ue(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=ee*e,a=ee*(e+1);de(t+r+n,t+i+n,t+i+a,t+r+a)}}}function O(e,t,n){a.push(e),a.push(t),a.push(n)}function k(e,t,i){fe(e),fe(t),fe(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);A(o[0]),A(o[1]),A(o[2])}function de(e,t,i,a){fe(e),fe(t),fe(a),fe(t),fe(i),fe(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);A(s[0]),A(s[1]),A(s[3]),A(s[1]),A(s[2]),A(s[3])}function fe(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function A(e){i.push(e.x),i.push(e.y)}}}toJSON(){let e=z.prototype.toJSON.call(this),t=this.parameters.shapes,n=this.parameters.options;return nc(t,n,e)}},tc={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new M(a,o),new M(s,c),new M(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<.01?[new M(o,1-c),new M(l,1-d),new M(f,1-m),new M(h,1-_)]:[new M(s,1-c),new M(u,1-d),new M(p,1-m),new M(g,1-_)]}};function nc(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var rc=class extends z{constructor(e,t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=$e(r,0,Math.PI*2);let i=[],a=[],o=[],s=1/t,c=new P,l=new M;for(let i=0;i<=t;i++){let u=n+i*s*r,d=Math.sin(u),f=Math.cos(u);for(let n=0;n<=e.length-1;n++)c.x=e[n].x*d,c.y=e[n].y,c.z=e[n].x*f,a.push(c.x,c.y,c.z),l.x=i/t,l.y=n/(e.length-1),o.push(l.x,l.y)}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(o,s,c)}if(this.setIndex(i),this.setAttribute(`position`,new R(a,3)),this.setAttribute(`uv`,new R(o,2)),this.computeVertexNormals(),r===Math.PI*2){let n=this.attributes.normal.array,r=new P,i=new P,a=new P,o=t*e.length*3;for(let t=0,s=0;t<e.length;t++,s+=3)r.x=n[s+0],r.y=n[s+1],r.z=n[s+2],i.x=n[o+s+0],i.y=n[o+s+1],i.z=n[o+s+2],a.addVectors(r,i).normalize(),n[s+0]=n[o+s+0]=a.x,n[s+1]=n[o+s+1]=a.y,n[s+2]=n[o+s+2]=a.z}}},ic=class extends z{constructor(e,t=12){super(),this.type=`ShapeGeometry`,this.parameters={shapes:e,curveSegments:t};let n=[],r=[],i=[],a=[],o=0,s=0;if(Array.isArray(e)===!1)c(e);else for(let t=0;t<e.length;t++)c(e[t]),this.addGroup(o,s,t),o+=s,s=0;this.setIndex(n),this.setAttribute(`position`,new R(r,3)),this.setAttribute(`normal`,new R(i,3)),this.setAttribute(`uv`,new R(a,2));function c(e){let o=r.length/3,c=e.extractPoints(t),l=c.shape,u=c.holes;Zs.isClockWise(l)===!1&&(l=l.reverse());for(let e=0,t=u.length;e<t;e++){let t=u[e];Zs.isClockWise(t)===!0&&(u[e]=t.reverse())}let d=Zs.triangulateShape(l,u);for(let e=0,t=u.length;e<t;e++){let t=u[e];l=l.concat(t)}for(let e=0,t=l.length;e<t;e++){let t=l[e];r.push(t.x,t.y,0),i.push(0,0,1),a.push(t.x,t.y)}for(let e=0,t=d.length;e<t;e++){let t=d[e],r=t[0]+o,i=t[1]+o,a=t[2]+o;n.push(r,i,a),s+=3}}}toJSON(){let e=z.prototype.toJSON.call(this),t=this.parameters.shapes;return ac(t,e)}};function ac(e,t){if(t.shapes=[],Array.isArray(e))for(let n=0,r=e.length;n<r;n++){let r=e[n];t.shapes.push(r.uuid)}else t.shapes.push(e.uuid);return t}var oc=class extends z{constructor(e=1,t=8,n=6,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new P,d=new P,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=0;f==0&&a==0?v=.5/t:f==n&&s==Math.PI&&(v=-.5/t);for(let n=0;n<=t;n++){let s=n/t;u.x=-e*Math.cos(r+s*i)*Math.sin(a+_*o),u.y=e*Math.cos(a+_*o),u.z=e*Math.sin(r+s*i)*Math.sin(a+_*o),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(s+v,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new R(p,3)),this.setAttribute(`normal`,new R(m,3)),this.setAttribute(`uv`,new R(h,2))}},sc=class extends z{constructor(e=1,t=.4,n=8,r=6,i=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i},n=Math.floor(n),r=Math.floor(r);let a=[],o=[],s=[],c=[],l=new P,u=new P,d=new P;for(let a=0;a<=n;a++)for(let f=0;f<=r;f++){let p=f/r*i,m=a/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(p),u.y=(e+t*Math.cos(m))*Math.sin(p),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),l.x=e*Math.cos(p),l.y=e*Math.sin(p),d.subVectors(u,l).normalize(),s.push(d.x,d.y,d.z),c.push(f/r),c.push(a/n)}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,o=(r+1)*(e-1)+t,s=(r+1)*e+t;a.push(n,i,s),a.push(i,o,s)}this.setIndex(a),this.setAttribute(`position`,new R(o,3)),this.setAttribute(`normal`,new R(s,3)),this.setAttribute(`uv`,new R(c,2))}},cc=class extends Mn{constructor(e){super(),this.type=`ShadowMaterial`,this.color=new I(0),this.transparent=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this}};cc.prototype.isShadowMaterial=!0;var lc=class extends Tr{constructor(e){super(e),this.type=`RawShaderMaterial`}};lc.prototype.isRawShaderMaterial=!0;var uc=class extends Mn{constructor(e){super(),this.defines={STANDARD:``},this.type=`MeshStandardMaterial`,this.color=new I(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new I(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new M(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.flatShading=!1,this.vertexTangents=!1,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this.flatShading=e.flatShading,this.vertexTangents=e.vertexTangents,this}};uc.prototype.isMeshStandardMaterial=!0;var dc=class extends uc{constructor(e){super(),this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.clearcoat=0,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new M(1,1),this.clearcoatNormalMap=null,this.reflectivity=.5,Object.defineProperty(this,"ior",{get:function(){return(1+.4*this.reflectivity)/(1-.4*this.reflectivity)},set:function(e){this.reflectivity=$e(2.5*(e-1)/(e+1),0,1)}}),this.sheen=null,this.transmission=0,this.transmissionMap=null,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.reflectivity=e.reflectivity,this.sheen=e.sheen?(this.sheen||new I).copy(e.sheen):null,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this}};dc.prototype.isMeshPhysicalMaterial=!0;var fc=class extends Mn{constructor(e){super(),this.type=`MeshPhongMaterial`,this.color=new I(16777215),this.specular=new I(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new I(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new M(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this.flatShading=e.flatShading,this}};fc.prototype.isMeshPhongMaterial=!0;var pc=class extends Mn{constructor(e){super(),this.defines={TOON:``},this.type=`MeshToonMaterial`,this.color=new I(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new I(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new M(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this}};pc.prototype.isMeshToonMaterial=!0;var mc=class extends Mn{constructor(e){super(),this.type=`MeshNormalMaterial`,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new M(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this.flatShading=e.flatShading,this}};mc.prototype.isMeshNormalMaterial=!0;var hc=class extends Mn{constructor(e){super(),this.type=`MeshLambertMaterial`,this.color=new I(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new I(0),this.emissiveIntensity=1,this.emissiveMap=null,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this}};hc.prototype.isMeshLambertMaterial=!0;var gc=class extends Mn{constructor(e){super(),this.defines={MATCAP:``},this.type=`MeshMatcapMaterial`,this.color=new I(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new M(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.skinning=!1,this.morphTargets=!1,this.morphNormals=!1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:``},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.skinning=e.skinning,this.morphTargets=e.morphTargets,this.morphNormals=e.morphNormals,this.flatShading=e.flatShading,this}};gc.prototype.isMeshMatcapMaterial=!0;var _c=class extends Ko{constructor(e){super(),this.type=`LineDashedMaterial`,this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};_c.prototype.isLineDashedMaterial=!0;var vc={arraySlice:function(e,t,n){return vc.isTypedArray(e)?new e.constructor(e.subarray(t,n===void 0?e.length:n)):e.slice(t,n)},convertArray:function(e,t,n){return!e||!n&&e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)},isTypedArray:function(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)},getKeyframeOrder:function(e){function t(t,n){return e[t]-e[n]}let n=e.length,r=Array(n);for(let e=0;e!==n;++e)r[e]=e;return r.sort(t),r},sortedArray:function(e,t,n){let r=e.length,i=new e.constructor(r);for(let a=0,o=0;o!==r;++a){let r=n[a]*t;for(let n=0;n!==t;++n)i[o++]=e[r+n]}return i},flattenJSON:function(e,t,n,r){let i=1,a=e[0];for(;a!==void 0&&a[r]===void 0;)a=e[i++];if(a===void 0)return;let o=a[r];if(o!==void 0){if(Array.isArray(o))do o=a[r],o!==void 0&&(t.push(a.time),n.push.apply(n,o)),a=e[i++];while(a!==void 0);else if(o.toArray!==void 0)do o=a[r],o!==void 0&&(t.push(a.time),o.toArray(n,n.length)),a=e[i++];while(a!==void 0);else do o=a[r],o!==void 0&&(t.push(a.time),n.push(o)),a=e[i++];while(a!==void 0)}},subclip:function(e,t,n,r,i=30){let a=e.clone();a.name=t;let o=[];for(let e=0;e<a.tracks.length;++e){let t=a.tracks[e],s=t.getValueSize(),c=[],l=[];for(let e=0;e<t.times.length;++e){let a=t.times[e]*i;if(!(a<n||a>=r)){c.push(t.times[e]);for(let n=0;n<s;++n)l.push(t.values[e*s+n])}}c.length!==0&&(t.times=vc.convertArray(c,t.times.constructor),t.values=vc.convertArray(l,t.values.constructor),o.push(t))}a.tracks=o;let s=1/0;for(let e=0;e<a.tracks.length;++e)s>a.tracks[e].times[0]&&(s=a.tracks[e].times[0]);for(let e=0;e<a.tracks.length;++e)a.tracks[e].shift(-1*s);return a.resetDuration(),a},makeClipAdditive:function(e,t=0,n=e,r=30){r<=0&&(r=30);let i=n.tracks.length,a=t/r;for(let t=0;t<i;++t){let r=n.tracks[t],i=r.ValueTypeName;if(i===`bool`||i===`string`)continue;let o=e.tracks.find(function(e){return e.name===r.name&&e.ValueTypeName===i});if(o===void 0)continue;let s=0,c=r.getValueSize();r.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(s=c/3);let l=0,u=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(l=u/3);let d=r.times.length-1,f;if(a<=r.times[0]){let e=s,t=c-s;f=vc.arraySlice(r.values,e,t)}else if(a>=r.times[d]){let e=d*c+s,t=e+c-s;f=vc.arraySlice(r.values,e,t)}else{let e=r.createInterpolant(),t=s,n=c-s;e.evaluate(a),f=vc.arraySlice(e.resultBuffer,t,n)}i===`quaternion`&&new pt().fromArray(f).normalize().conjugate().toArray(f);let p=o.times.length;for(let e=0;e<p;++e){let t=e*u+l;if(i===`quaternion`)pt.multiplyQuaternionsFlat(o.values,t,f,0,o.values,t);else{let e=u-l*2;for(let n=0;n<e;++n)o.values[t+n]-=f[n]}}}return e.blendMode=Pe,e}},yc=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.afterEnd_(n-1,e,i)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.beforeStart_(0,e,r);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.beforeStart_(0,e,r);if(r===void 0)return n=t.length,this._cachedIndex=n,this.afterEnd_(n-1,i,e)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`call to abstract method`)}intervalChanged_(){}};yc.prototype.beforeStart_=yc.prototype.copySampleValue_,yc.prototype.afterEnd_=yc.prototype.copySampleValue_;var bc=class extends yc{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ae,endingEnd:Ae}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case je:i=e,o=2*t-n;break;case Me:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case je:a=e,s=2*n-t;break;case Me:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},xc=class extends yc{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Sc=class extends yc{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Cc=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=vc.convertArray(t,this.TimeBufferType),this.values=vc.convertArray(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:vc.convertArray(e.times,Array),values:vc.convertArray(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Sc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new xc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new bc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case De:t=this.InterpolantFactoryMethodDiscrete;break;case Oe:t=this.InterpolantFactoryMethodLinear;break;case ke:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return console.warn(`THREE.KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return De;case this.InterpolantFactoryMethodLinear:return Oe;case this.InterpolantFactoryMethodSmooth:return ke}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=vc.arraySlice(n,i,a),this.values=vc.arraySlice(this.values,i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error(`THREE.KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(console.error(`THREE.KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){console.error(`THREE.KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){console.error(`THREE.KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&vc.isTypedArray(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){console.error(`THREE.KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=vc.arraySlice(this.times),t=vc.arraySlice(this.values),n=this.getValueSize(),r=this.getInterpolation()===ke,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=vc.arraySlice(e,0,a),this.values=vc.arraySlice(t,0,a*n)),this}clone(){let e=vc.arraySlice(this.times,0),t=vc.arraySlice(this.values,0),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Cc.prototype.TimeBufferType=Float32Array,Cc.prototype.ValueBufferType=Float32Array,Cc.prototype.DefaultInterpolation=Oe;var wc=class extends Cc{};wc.prototype.ValueTypeName=`bool`,wc.prototype.ValueBufferType=Array,wc.prototype.DefaultInterpolation=De,wc.prototype.InterpolantFactoryMethodLinear=void 0,wc.prototype.InterpolantFactoryMethodSmooth=void 0;var Tc=class extends Cc{};Tc.prototype.ValueTypeName=`color`;var Ec=class extends Cc{};Ec.prototype.ValueTypeName=`number`;var Dc=class extends yc{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)pt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Oc=class extends Cc{InterpolantFactoryMethodLinear(e){return new Dc(this.times,this.values,this.getValueSize(),e)}};Oc.prototype.ValueTypeName=`quaternion`,Oc.prototype.DefaultInterpolation=Oe,Oc.prototype.InterpolantFactoryMethodSmooth=void 0;var kc=class extends Cc{};kc.prototype.ValueTypeName=`string`,kc.prototype.ValueBufferType=Array,kc.prototype.DefaultInterpolation=De,kc.prototype.InterpolantFactoryMethodLinear=void 0,kc.prototype.InterpolantFactoryMethodSmooth=void 0;var Ac=class extends Cc{};Ac.prototype.ValueTypeName=`vector`;var jc=class{constructor(e,t=-1,n,r=Ne){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=Qe(),this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,r=1/(e.fps||1);for(let e=0,i=n.length;e!==i;++e)t.push(Nc(n[e]).scale(r));let i=new this(e.name,e.duration,t,e.blendMode);return i.uuid=e.uuid,i}static toJSON(e){let t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let e=0,r=n.length;e!==r;++e)t.push(Cc.toJSON(n[e]));return r}static CreateFromMorphTargetSequence(e,t,n,r){let i=t.length,a=[];for(let e=0;e<i;e++){let o=[],s=[];o.push((e+i-1)%i,e,(e+1)%i),s.push(0,1,0);let c=vc.getKeyframeOrder(o);o=vc.sortedArray(o,1,c),s=vc.sortedArray(s,1,c),!r&&o[0]===0&&(o.push(i),s.push(s[0])),a.push(new Ec(`.morphTargetInfluences[`+t[e].name+`]`,o,s).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let t=e;n=t.geometry&&t.geometry.animations||t.animations}for(let e=0;e<n.length;e++)if(n[e].name===t)return n[e];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let r={},i=/^([\w-]*?)([\d]+)$/;for(let t=0,n=e.length;t<n;t++){let n=e[t],a=n.name.match(i);if(a&&a.length>1){let e=a[1],t=r[e];t||(r[e]=t=[]),t.push(n)}}let a=[];for(let e in r)a.push(this.CreateFromMorphTargetSequence(e,r[e],t,n));return a}static parseAnimation(e,t){if(!e)return console.error(`THREE.AnimationClip: No animation in JSONLoader data.`),null;let n=function(e,t,n,r,i){if(n.length!==0){let a=[],o=[];vc.flattenJSON(n,a,o,r),a.length!==0&&i.push(new e(t,a,o))}},r=[],i=e.name||`default`,a=e.fps||30,o=e.blendMode,s=e.length||-1,c=e.hierarchy||[];for(let e=0;e<c.length;e++){let i=c[e].keys;if(i&&i.length!==0){if(i[0].morphTargets){let e={},t=0;for(;t<i.length;t++)if(i[t].morphTargets)for(let n=0;n<i[t].morphTargets.length;n++)e[i[t].morphTargets[n]]=-1;for(let n in e){let e=[],a=[];for(let r=0;r!==i[t].morphTargets.length;++r){let r=i[t];e.push(r.time),a.push(+(r.morphTarget===n))}r.push(new Ec(`.morphTargetInfluence[`+n+`]`,e,a))}s=e.length*(a||1)}else{let a=`.bones[`+t[e].name+`]`;n(Ac,a+`.position`,i,`pos`,r),n(Oc,a+`.quaternion`,i,`rot`,r),n(Ac,a+`.scale`,i,`scl`,r)}}}return r.length===0?null:new this(i,s,r,o)}resetDuration(){let e=this.tracks,t=0;for(let n=0,r=e.length;n!==r;++n){let e=this.tracks[n];t=Math.max(t,e.times[e.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e&&=this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function Mc(e){switch(e.toLowerCase()){case`scalar`:case`double`:case`float`:case`number`:case`integer`:return Ec;case`vector`:case`vector2`:case`vector3`:case`vector4`:return Ac;case`color`:return Tc;case`quaternion`:return Oc;case`bool`:case`boolean`:return wc;case`string`:return kc}throw Error(`THREE.KeyframeTrack: Unsupported typeName: `+e)}function Nc(e){if(e.type===void 0)throw Error(`THREE.KeyframeTrack: track type undefined, can not parse`);let t=Mc(e.type);if(e.times===void 0){let t=[],n=[];vc.flattenJSON(e.keys,t,n,`value`),e.times=t,e.values=n}return t.parse===void 0?new t(e.name,e.times,e.values,e.interpolation):t.parse(e)}var Pc={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(this.files[e]=t)},get:function(e){if(this.enabled!==!1)return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}},Fc=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null}}},Ic=class{constructor(e){this.manager=e===void 0?Fc:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}},Lc={},Rc=class extends Ic{constructor(e){super(e)}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Pc.get(e);if(a!==void 0)return i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0),a;if(Lc[e]!==void 0){Lc[e].push({onLoad:t,onProgress:n,onError:r});return}let o=e.match(/^data:(.*?)(;base64)?,(.*)$/),s;if(o){let n=o[1],a=!!o[2],s=o[3];s=decodeURIComponent(s),a&&(s=atob(s));try{let r,a=(this.responseType||``).toLowerCase();switch(a){case`arraybuffer`:case`blob`:let e=new Uint8Array(s.length);for(let t=0;t<s.length;t++)e[t]=s.charCodeAt(t);r=a===`blob`?new Blob([e.buffer],{type:n}):e.buffer;break;case`document`:r=new DOMParser().parseFromString(s,n);break;case`json`:r=JSON.parse(s);break;default:r=s}setTimeout(function(){t&&t(r),i.manager.itemEnd(e)},0)}catch(t){setTimeout(function(){r&&r(t),i.manager.itemError(e),i.manager.itemEnd(e)},0)}}else{Lc[e]=[],Lc[e].push({onLoad:t,onProgress:n,onError:r}),s=new XMLHttpRequest,s.open(`GET`,e,!0),s.addEventListener(`load`,function(t){let n=this.response,r=Lc[e];if(delete Lc[e],this.status===200||this.status===0){this.status===0&&console.warn(`THREE.FileLoader: HTTP Status 0 received.`),Pc.add(e,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];t.onLoad&&t.onLoad(n)}i.manager.itemEnd(e)}else{for(let e=0,n=r.length;e<n;e++){let n=r[e];n.onError&&n.onError(t)}i.manager.itemError(e),i.manager.itemEnd(e)}},!1),s.addEventListener(`progress`,function(t){let n=Lc[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onProgress&&r.onProgress(t)}},!1),s.addEventListener(`error`,function(t){let n=Lc[e];delete Lc[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onError&&r.onError(t)}i.manager.itemError(e),i.manager.itemEnd(e)},!1),s.addEventListener(`abort`,function(t){let n=Lc[e];delete Lc[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onError&&r.onError(t)}i.manager.itemError(e),i.manager.itemEnd(e)},!1),this.responseType!==void 0&&(s.responseType=this.responseType),this.withCredentials!==void 0&&(s.withCredentials=this.withCredentials),s.overrideMimeType&&s.overrideMimeType(this.mimeType===void 0?`text/plain`:this.mimeType);for(let e in this.requestHeader)s.setRequestHeader(e,this.requestHeader[e]);s.send(null)}return i.manager.itemStart(e),s}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}},zc=class extends Ic{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Pc.get(e);if(a!==void 0)return i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0),a;let o=document.createElementNS(`http://www.w3.org/1999/xhtml`,`img`);function s(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1),Pc.add(e,this),t&&t(this),i.manager.itemEnd(e)}function c(t){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1),r&&r(t),i.manager.itemError(e),i.manager.itemEnd(e)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.substr(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),i.manager.itemStart(e),o.src=e,o}},Bc=class extends Ic{constructor(e){super(e)}load(e,t,n,r){let i=new jr,a=new zc(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function s(n){a.load(e[n],function(e){i.images[n]=e,o++,o===6&&(i.needsUpdate=!0,t&&t(i))},void 0,r)}for(let t=0;t<e.length;++t)s(t);return i}},Vc=class extends Ic{constructor(e){super(e)}load(e,t,n,r){let i=new lt,a=new zc(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(n){i.image=n;let r=e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0;i.format=r?Se:Ce,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},Hc=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200}getPoint(){return console.warn(`THREE.Curve: .getPoint() not implemented.`),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new M:new P);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new P,r=[],i=[],a=[],o=new P,s=new F;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new P),r[t].normalize()}i[0]=new P,a[0]=new P;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos($e(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos($e(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.5,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Uc=class extends Hc{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t){let n=t||new M,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}};Uc.prototype.isEllipseCurve=!0;var Wc=class extends Uc{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.type=`ArcCurve`}};Wc.prototype.isArcCurve=!0;function Gc(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Kc=new P,qc=new Gc,Jc=new Gc,Yc=new Gc,Xc=class extends Hc{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new P){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Kc.subVectors(r[0],r[1]).add(r[0]),c=Kc);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Kc.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Kc),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),qc.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Jc.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Yc.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(qc.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Jc.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Yc.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(qc.calc(s),Jc.calc(s),Yc.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new P().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};Xc.prototype.isCatmullRomCurve3=!0;function Zc(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Qc(e,t){let n=1-e;return n*n*t}function $c(e,t){return 2*(1-e)*e*t}function el(e,t){return e*e*t}function tl(e,t,n,r){return Qc(e,t)+$c(e,n)+el(e,r)}function nl(e,t){let n=1-e;return n*n*n*t}function rl(e,t){let n=1-e;return 3*n*n*e*t}function il(e,t){return 3*(1-e)*e*e*t}function al(e,t){return e*e*e*t}function ol(e,t,n,r,i){return nl(e,t)+rl(e,n)+il(e,r)+al(e,i)}var sl=class extends Hc{constructor(e=new M,t=new M,n=new M,r=new M){super(),this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new M){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(ol(e,r.x,i.x,a.x,o.x),ol(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}};sl.prototype.isCubicBezierCurve=!0;var cl=class extends Hc{constructor(e=new P,t=new P,n=new P,r=new P){super(),this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new P){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(ol(e,r.x,i.x,a.x,o.x),ol(e,r.y,i.y,a.y,o.y),ol(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}};cl.prototype.isCubicBezierCurve3=!0;var ll=class extends Hc{constructor(e=new M,t=new M){super(),this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new M){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t){let n=t||new M;return n.copy(this.v2).sub(this.v1).normalize(),n}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}};ll.prototype.isLineCurve=!0;var ul=class extends Hc{constructor(e=new P,t=new P){super(),this.type=`LineCurve3`,this.isLineCurve3=!0,this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},dl=class extends Hc{constructor(e=new M,t=new M,n=new M){super(),this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new M){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(tl(e,r.x,i.x,a.x),tl(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}};dl.prototype.isQuadraticBezierCurve=!0;var fl=class extends Hc{constructor(e=new P,t=new P,n=new P){super(),this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(tl(e,r.x,i.x,a.x),tl(e,r.y,i.y,a.y),tl(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}};fl.prototype.isQuadraticBezierCurve3=!0;var pl=class extends Hc{constructor(e=[]){super(),this.type=`SplineCurve`,this.points=e}getPoint(e,t=new M){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Zc(o,s.x,c.x,l.x,u.x),Zc(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new M().fromArray(n))}return this}};pl.prototype.isSplineCurve=!0;var ml=Object.freeze({__proto__:null,ArcCurve:Wc,CatmullRomCurve3:Xc,CubicBezierCurve:sl,CubicBezierCurve3:cl,EllipseCurve:Uc,LineCurve:ll,LineCurve3:ul,QuadraticBezierCurve:dl,QuadraticBezierCurve3:fl,SplineCurve:pl}),hl=class extends Hc{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);e.equals(t)||this.curves.push(new ll(t,e))}getPoint(e){let t=e*this.getLength(),n=this.getCurveLengths(),r=0;for(;r<n.length;){if(n[r]>=t){let e=n[r]-t,i=this.curves[r],a=i.getLength(),o=a===0?0:1-e/a;return i.getPointAt(o)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a&&a.isEllipseCurve?e*2:a&&(a.isLineCurve||a.isLineCurve3)?1:a&&a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new ml[n.type]().fromJSON(n))}return this}},gl=class extends hl{constructor(e){super(),this.type=`Path`,this.currentPoint=new M,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ll(this.currentPoint.clone(),new M(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new dl(this.currentPoint.clone(),new M(e,t),new M(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new sl(this.currentPoint.clone(),new M(e,t),new M(n,r),new M(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new pl([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new Uc(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},_l=class extends gl{constructor(e){super(e),this.uuid=Qe(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new gl().fromJSON(n))}return this}},vl=class extends hn{constructor(e,t=1){super(),this.type=`Light`,this.color=new I(e),this.intensity=t}dispose(){}copy(e){return super.copy(e),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}};vl.prototype.isLight=!0;var yl=class extends vl{constructor(e,t,n){super(e,n),this.type=`HemisphereLight`,this.position.copy(hn.DefaultUp),this.updateMatrix(),this.groundColor=new I(t)}copy(e){return vl.prototype.copy.call(this,e),this.groundColor.copy(e.groundColor),this}};yl.prototype.isHemisphereLight=!0;var bl=new F,xl=new P,Sl=new P,Cl=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.mapSize=new M(512,512),this.map=null,this.mapPass=null,this.matrix=new F,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ir,this._frameExtents=new M(1,1),this._viewportCount=1,this._viewports=[new N(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;xl.setFromMatrixPosition(e.matrixWorld),t.position.copy(xl),Sl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Sl),t.updateMatrixWorld(),bl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(t.projectionMatrix),n.multiply(t.matrixWorldInverse)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},wl=class extends Cl{constructor(){super(new Dr(50,1,.5,500)),this.focus=1}updateMatrices(e){let t=this.camera,n=Ze*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}};wl.prototype.isSpotLightShadow=!0;var Tl=class extends vl{constructor(e,t,n=0,r=Math.PI/3,i=0,a=1){super(e,t),this.type=`SpotLight`,this.position.copy(hn.DefaultUp),this.updateMatrix(),this.target=new hn,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.shadow=new wl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};Tl.prototype.isSpotLight=!0;var El=new F,Dl=new P,Ol=new P,kl=class extends Cl{constructor(){super(new Dr(90,1,.5,500)),this._frameExtents=new M(4,2),this._viewportCount=6,this._viewports=[new N(2,1,1,1),new N(0,1,1,1),new N(3,1,1,1),new N(1,1,1,1),new N(3,0,1,1),new N(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,r=this.matrix,i=e.distance||n.far;i!==n.far&&(n.far=i,n.updateProjectionMatrix()),Dl.setFromMatrixPosition(e.matrixWorld),n.position.copy(Dl),Ol.copy(n.position),Ol.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Ol),n.updateMatrixWorld(),r.makeTranslation(-Dl.x,-Dl.y,-Dl.z),El.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(El)}};kl.prototype.isPointLightShadow=!0;var Al=class extends vl{constructor(e,t,n=0,r=1){super(e,t),this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new kl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}};Al.prototype.isPointLight=!0;var jl=class extends Er{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};jl.prototype.isOrthographicCamera=!0;var Ml=class extends Cl{constructor(){super(new jl(-5,5,5,-5,.5,500))}};Ml.prototype.isDirectionalLightShadow=!0;var Nl=class extends vl{constructor(e,t){super(e,t),this.type=`DirectionalLight`,this.position.copy(hn.DefaultUp),this.updateMatrix(),this.target=new hn,this.shadow=new Ml}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};Nl.prototype.isDirectionalLight=!0;var Pl=class extends vl{constructor(e,t){super(e,t),this.type=`AmbientLight`}};Pl.prototype.isAmbientLight=!0;var Fl=class extends vl{constructor(e,t,n=10,r=10){super(e,t),this.type=`RectAreaLight`,this.width=n,this.height=r}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){let t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}};Fl.prototype.isRectAreaLight=!0;var Il=class{constructor(){this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new P)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){let n=e.x,r=e.y,i=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.282095),t.addScaledVector(a[1],.488603*r),t.addScaledVector(a[2],.488603*i),t.addScaledVector(a[3],.488603*n),t.addScaledVector(a[4],n*r*1.092548),t.addScaledVector(a[5],r*i*1.092548),t.addScaledVector(a[6],.315392*(3*i*i-1)),t.addScaledVector(a[7],n*i*1.092548),t.addScaledVector(a[8],.546274*(n*n-r*r)),t}getIrradianceAt(e,t){let n=e.x,r=e.y,i=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.886227),t.addScaledVector(a[1],1.023328*r),t.addScaledVector(a[2],1.023328*i),t.addScaledVector(a[3],1.023328*n),t.addScaledVector(a[4],.858086*n*r),t.addScaledVector(a[5],.858086*r*i),t.addScaledVector(a[6],.743125*i*i-.247708),t.addScaledVector(a[7],.858086*n*i),t.addScaledVector(a[8],.429043*(n*n-r*r)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){let n=this.coefficients;for(let r=0;r<9;r++)n[r].fromArray(e,t+r*3);return this}toArray(e=[],t=0){let n=this.coefficients;for(let r=0;r<9;r++)n[r].toArray(e,t+r*3);return e}static getBasisAt(e,t){let n=e.x,r=e.y,i=e.z;t[0]=.282095,t[1]=.488603*r,t[2]=.488603*i,t[3]=.488603*n,t[4]=1.092548*n*r,t[5]=1.092548*r*i,t[6]=.315392*(3*i*i-1),t[7]=1.092548*n*i,t[8]=.546274*(n*n-r*r)}};Il.prototype.isSphericalHarmonics3=!0;var Ll=class extends vl{constructor(e=new Il,t=1){super(void 0,t),this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){let t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}};Ll.prototype.isLightProbe=!0;var Rl=class{static decodeText(e){if(typeof TextDecoder<`u`)return new TextDecoder().decode(e);let t=``;for(let n=0,r=e.length;n<r;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){let t=e.lastIndexOf(`/`);return t===-1?`./`:e.substr(0,t+1)}},zl=class extends z{constructor(){super(),this.type=`InstancedBufferGeometry`,this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}clone(){return new this.constructor().copy(this)}toJSON(){let e=super.toJSON(this);return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};zl.prototype.isInstancedBufferGeometry=!0;var Bl=class extends L{constructor(e,t,n,r){typeof n==`number`&&(r=n,n=!1,console.error(`THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument.`)),super(e,t,n),this.meshPerAttribute=r||1}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}};Bl.prototype.isInstancedBufferAttribute=!0;var Vl=class extends Ic{constructor(e){super(e),typeof createImageBitmap>`u`&&console.warn(`THREE.ImageBitmapLoader: createImageBitmap() not supported.`),typeof fetch>`u`&&console.warn(`THREE.ImageBitmapLoader: fetch() not supported.`),this.options={premultiplyAlpha:`none`}}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Pc.get(e);if(a!==void 0)return i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0),a;let o={};o.credentials=this.crossOrigin===`anonymous`?`same-origin`:`include`,o.headers=this.requestHeader,fetch(e,o).then(function(e){return e.blob()}).then(function(e){return createImageBitmap(e,Object.assign(i.options,{colorSpaceConversion:`none`}))}).then(function(n){Pc.add(e,n),t&&t(n),i.manager.itemEnd(e)}).catch(function(t){r&&r(t),i.manager.itemError(e),i.manager.itemEnd(e)}),i.manager.itemStart(e)}};Vl.prototype.isImageBitmapLoader=!0;var Hl=class{constructor(){this.type=`ShapePath`,this.color=new I,this.subPaths=[],this.currentPath=null}moveTo(e,t){return this.currentPath=new gl,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,r){return this.currentPath.quadraticCurveTo(e,t,n,r),this}bezierCurveTo(e,t,n,r,i,a){return this.currentPath.bezierCurveTo(e,t,n,r,i,a),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(e,t){function n(e){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n],i=new _l;i.curves=r.curves,t.push(i)}return t}function r(e,t){let n=t.length,r=!1;for(let i=n-1,a=0;a<n;i=a++){let n=t[i],o=t[a],s=o.x-n.x,c=o.y-n.y;if(Math.abs(c)>2**-52){if(c<0&&(n=t[a],s=-s,o=t[i],c=-c),e.y<n.y||e.y>o.y)continue;if(e.y===n.y){if(e.x===n.x)return!0}else{let t=c*(e.x-n.x)-s*(e.y-n.y);if(t===0)return!0;if(t<0)continue;r=!r}}else{if(e.y!==n.y)continue;if(o.x<=e.x&&e.x<=n.x||n.x<=e.x&&e.x<=o.x)return!0}}return r}let i=Zs.isClockWise,a=this.subPaths;if(a.length===0)return[];if(t===!0)return n(a);let o,s,c,l=[];if(a.length===1)return s=a[0],c=new _l,c.curves=s.curves,l.push(c),l;let u=!i(a[0].getPoints());u=e?!u:u;let d=[],f=[],p=[],m=0,h;f[m]=void 0,p[m]=[];for(let t=0,n=a.length;t<n;t++)s=a[t],h=s.getPoints(),o=i(h),o=e?!o:o,o?(!u&&f[m]&&m++,f[m]={s:new _l,p:h},f[m].s.curves=s.curves,u&&m++,p[m]=[]):p[m].push({h:s,p:h[0]});if(!f[0])return n(a);if(f.length>1){let e=!1,t=[];for(let e=0,t=f.length;e<t;e++)d[e]=[];for(let n=0,i=f.length;n<i;n++){let i=p[n];for(let a=0;a<i.length;a++){let o=i[a],s=!0;for(let i=0;i<f.length;i++)r(o.p,f[i].p)&&(n!==i&&t.push({froms:n,tos:i,hole:a}),s?(s=!1,d[i].push(o)):e=!0);s&&d[n].push(o)}}t.length>0&&(e||(p=d))}let g;for(let e=0,t=f.length;e<t;e++){c=f[e].s,l.push(c),g=p[e];for(let e=0,t=g.length;e<t;e++)c.holes.push(g[e].h)}return l}},Ul=class{constructor(e){this.type=`Font`,this.data=e}generateShapes(e,t=100){let n=[],r=Wl(e,t,this.data);for(let e=0,t=r.length;e<t;e++)Array.prototype.push.apply(n,r[e].toShapes());return n}};function Wl(e,t,n){let r=Array.from(e),i=t/n.resolution,a=(n.boundingBox.yMax-n.boundingBox.yMin+n.underlineThickness)*i,o=[],s=0,c=0;for(let e=0;e<r.length;e++){let t=r[e];if(t===`
`)s=0,c-=a;else{let e=Gl(t,i,s,c,n);s+=e.offsetX,o.push(e.path)}}return o}function Gl(e,t,n,r,i){let a=i.glyphs[e]||i.glyphs[`?`];if(!a){console.error(`THREE.Font: character "`+e+`" does not exists in font family `+i.familyName+`.`);return}let o=new Hl,s,c,l,u,d,f,p,m;if(a.o){let e=a._cachedOutline||=a.o.split(` `);for(let i=0,a=e.length;i<a;)switch(e[i++]){case`m`:s=e[i++]*t+n,c=e[i++]*t+r,o.moveTo(s,c);break;case`l`:s=e[i++]*t+n,c=e[i++]*t+r,o.lineTo(s,c);break;case`q`:l=e[i++]*t+n,u=e[i++]*t+r,d=e[i++]*t+n,f=e[i++]*t+r,o.quadraticCurveTo(d,f,l,u);break;case`b`:l=e[i++]*t+n,u=e[i++]*t+r,d=e[i++]*t+n,f=e[i++]*t+r,p=e[i++]*t+n,m=e[i++]*t+r,o.bezierCurveTo(d,f,p,m,l,u)}}return{offsetX:a.ha*t,path:o}}Ul.prototype.isFont=!0;var Kl,ql={getContext:function(){return Kl===void 0&&(Kl=new(window.AudioContext||window.webkitAudioContext)),Kl},setContext:function(e){Kl=e}},Jl=class extends Ic{constructor(e){super(e)}load(e,t,n,r){let i=this,a=new Rc(this.manager);a.setResponseType(`arraybuffer`),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(n){try{let e=n.slice(0);ql.getContext().decodeAudioData(e,function(e){t(e)})}catch(t){r?r(t):console.error(t),i.manager.itemError(e)}},n,r)}},Yl=class extends Ll{constructor(e,t,n=1){super(void 0,n);let r=new I().set(e),i=new I().set(t),a=new P(r.r,r.g,r.b),o=new P(i.r,i.g,i.b),s=Math.sqrt(Math.PI),c=s*Math.sqrt(.75);this.sh.coefficients[0].copy(a).add(o).multiplyScalar(s),this.sh.coefficients[1].copy(a).sub(o).multiplyScalar(c)}};Yl.prototype.isHemisphereLightProbe=!0;var Xl=class extends Ll{constructor(e,t=1){super(void 0,t);let n=new I().set(e);this.sh.coefficients[0].set(n.r,n.g,n.b).multiplyScalar(2*Math.sqrt(Math.PI))}};Xl.prototype.isAmbientLightProbe=!0;var Zl=class extends hn{constructor(e){super(),this.type=`Audio`,this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType=`empty`,this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType=`audioNode`,this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType=`mediaNode`,this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType=`mediaStreamNode`,this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType=`buffer`,this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn(`THREE.Audio: Audio is already playing.`);return}if(this.hasPlaybackControl===!1){console.warn(`THREE.Audio: this Audio has no playback control.`);return}this._startedAt=this.context.currentTime+e;let t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1)console.warn(`THREE.Audio: this Audio has no playback control.`);else return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress%=this.duration||this.buffer.duration),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(){if(this.hasPlaybackControl===!1)console.warn(`THREE.Audio: this Audio has no playback control.`);else return this._progress=0,this.source.stop(),this.source.onended=null,this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}getFilters(){return this.filters}setFilters(e){return e||=[],this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){if(this.detune=e,this.source.detune!==void 0)return this.isPlaying===!0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1)console.warn(`THREE.Audio: this Audio has no playback control.`);else return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn(`THREE.Audio: this Audio has no playback control.`),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1)console.warn(`THREE.Audio: this Audio has no playback control.`);else return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}},Ql=class{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0,t=this.getFrequencyData();for(let n=0;n<t.length;n++)e+=t[n];return e/t.length}},$l=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let r,i,a;switch(t){case`quaternion`:r=this._slerp,i=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case`string`:case`bool`:r=this._select,i=this._select,a=this._setAdditiveIdentityOther,this.buffer=Array(n*5);break;default:r=this._lerp,i=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=r,this._mixBufferRegionAdditive=i,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,r=this.valueSize,i=e*r+r,a=this.cumulativeWeight;if(a===0){for(let e=0;e!==r;++e)n[i+e]=n[e];a=t}else{a+=t;let e=t/a;this._mixBufferRegion(n,i,0,e,r)}this.cumulativeWeight=a}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,r=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,r,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,r=e*t+t,i=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,i<1){let e=t*this._origIndex;this._mixBufferRegion(n,r,e,1-i,t)}a>0&&this._mixBufferRegionAdditive(n,r,this._addIndex*t,1,t);for(let e=t,i=t+t;e!==i;++e)if(n[e]!==n[e+t]){o.setValue(n,r);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,r=n*this._origIndex;e.getValue(t,r);for(let e=n,i=r;e!==i;++e)t[e]=t[r+e%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,r,i){if(r>=.5)for(let r=0;r!==i;++r)e[t+r]=e[n+r]}_slerp(e,t,n,r){pt.slerpFlat(e,t,e,t,e,n,r)}_slerpAdditive(e,t,n,r,i){let a=this._workIndex*i;pt.multiplyQuaternionsFlat(e,a,e,t,e,n),pt.slerpFlat(e,t,e,t,e,a,r)}_lerp(e,t,n,r,i){let a=1-r;for(let o=0;o!==i;++o){let i=t+o;e[i]=e[i]*a+e[n+o]*r}}_lerpAdditive(e,t,n,r,i){for(let a=0;a!==i;++a){let i=t+a;e[i]=e[i]+e[n+a]*r}}},eu=`\\[\\]\\.:\\/`,tu=RegExp(`[\\[\\]\\.:\\/]`,`g`),nu=`[^\\[\\]\\.:\\/]`,ru=`[^`+eu.replace(`\\.`,``)+`]`,iu=`((?:WC+[\\/:])*)`.replace(`WC`,nu),au=`(WCOD+)?`.replace(`WCOD`,ru),ou=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,nu),su=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,nu),cu=RegExp(`^`+iu+au+ou+su+`$`),lu=[`material`,`materials`,`bones`],uu=class{constructor(e,t,n){let r=n||du.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},du=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName)||t,this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(tu,``)}static parseTrackName(e){let t=cu.exec(e);if(!t)throw Error(`PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);lu.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(!t||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.node[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName)||this.rootNode,this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.error(`THREE.PropertyBinding: Trying to update node for track: `+this.path+` but it wasn't found.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){console.error(`THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){console.error(`THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;default:if(t[r]===void 0){console.error(`THREE.PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){console.error(`THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;console.error(`THREE.PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.needsUpdate===void 0?t.matrixWorldNeedsUpdate!==void 0&&(s=this.Versioning.MatrixWorldNeedsUpdate):s=this.Versioning.NeedsUpdate;let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(t.geometry.isBufferGeometry){if(!t.geometry.morphAttributes){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}else{console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences on THREE.Geometry. Use THREE.BufferGeometry instead.`,this);return}}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};du.Composite=uu,du.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},du.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},du.prototype.GetterByBindingType=[du.prototype._getValue_direct,du.prototype._getValue_array,du.prototype._getValue_arrayElement,du.prototype._getValue_toArray],du.prototype.SetterByBindingTypeAndVersioning=[[du.prototype._setValue_direct,du.prototype._setValue_direct_setNeedsUpdate,du.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[du.prototype._setValue_array,du.prototype._setValue_array_setNeedsUpdate,du.prototype._setValue_array_setMatrixWorldNeedsUpdate],[du.prototype._setValue_arrayElement,du.prototype._setValue_arrayElement_setNeedsUpdate,du.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[du.prototype._setValue_fromArray,du.prototype._setValue_fromArray_setNeedsUpdate,du.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var fu=class{constructor(){this.uuid=Qe(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;let e={};this._indicesByUUID=e;for(let t=0,n=arguments.length;t!==n;++t)e[arguments[t].uuid]=t;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};let t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){let e=this._objects,t=this._indicesByUUID,n=this._paths,r=this._parsedPaths,i=this._bindings,a=i.length,o,s=e.length,c=this.nCachedObjects_;for(let l=0,u=arguments.length;l!==u;++l){let u=arguments[l],d=u.uuid,f=t[d];if(f===void 0){f=s++,t[d]=f,e.push(u);for(let e=0,t=a;e!==t;++e)i[e].push(new du(u,n[e],r[e]))}else if(f<c){o=e[f];let s=--c,l=e[s];t[l.uuid]=f,e[f]=l,t[d]=s,e[s]=u;for(let e=0,t=a;e!==t;++e){let t=i[e],a=t[s],o=t[f];t[f]=a,o===void 0&&(o=new du(u,n[e],r[e])),t[s]=o}}else e[f]!==o&&console.error(`THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.`)}this.nCachedObjects_=c}remove(){let e=this._objects,t=this._indicesByUUID,n=this._bindings,r=n.length,i=this.nCachedObjects_;for(let a=0,o=arguments.length;a!==o;++a){let o=arguments[a],s=o.uuid,c=t[s];if(c!==void 0&&c>=i){let a=i++,l=e[a];t[l.uuid]=c,e[c]=l,t[s]=a,e[a]=o;for(let e=0,t=r;e!==t;++e){let t=n[e],r=t[a],i=t[c];t[c]=r,t[a]=i}}}this.nCachedObjects_=i}uncache(){let e=this._objects,t=this._indicesByUUID,n=this._bindings,r=n.length,i=this.nCachedObjects_,a=e.length;for(let o=0,s=arguments.length;o!==s;++o){let s=arguments[o].uuid,c=t[s];if(c!==void 0){if(delete t[s],c<i){let o=--i,s=e[o],l=--a,u=e[l];t[s.uuid]=c,e[c]=s,t[u.uuid]=o,e[o]=u,e.pop();for(let e=0,t=r;e!==t;++e){let t=n[e],r=t[o],i=t[l];t[c]=r,t[o]=i,t.pop()}}else{let i=--a,o=e[i];i>0&&(t[o.uuid]=c),e[c]=o,e.pop();for(let e=0,t=r;e!==t;++e){let t=n[e];t[c]=t[i],t.pop()}}}}this.nCachedObjects_=i}subscribe_(e,t){let n=this._bindingsIndicesByPath,r=n[e],i=this._bindings;if(r!==void 0)return i[r];let a=this._paths,o=this._parsedPaths,s=this._objects,c=s.length,l=this.nCachedObjects_,u=Array(c);r=i.length,n[e]=r,a.push(e),o.push(t),i.push(u);for(let n=l,r=s.length;n!==r;++n){let r=s[n];u[n]=new du(r,e,t)}return u}unsubscribe_(e){let t=this._bindingsIndicesByPath,n=t[e];if(n!==void 0){let r=this._paths,i=this._parsedPaths,a=this._bindings,o=a.length-1,s=a[o],c=e[o];t[c]=n,a[n]=s,a.pop(),i[n]=i[o],i.pop(),r[n]=r[o],r.pop()}}};fu.prototype.isAnimationObjectGroup=!0;var pu=class{constructor(e,t,n=null,r=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=r;let i=t.tracks,a=i.length,o=Array(a),s={endingStart:Ae,endingEnd:Ae};for(let e=0;e!==a;++e){let t=i[e].createInterpolant(null);o[e]=t,t.settings=s}this._interpolantSettings=s,this._interpolants=o,this._propertyBindings=Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Te,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){let n=this._clip.duration,r=e._clip.duration,i=r/n,a=n/r;e.warp(1,i,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let r=this._mixer,i=r.time,a=this.timeScale,o=this._timeScaleInterpolant;o===null&&(o=r._lendControlInterpolant(),this._timeScaleInterpolant=o);let s=o.parameterPositions,c=o.sampleValues;return s[0]=i,s[1]=i+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,r){if(!this.enabled){this._updateWeight(e);return}let i=this._startTime;if(i!==null){let r=(e-i)*n;if(r<0||n===0)return;this._startTime=null,t=n*r}t*=this._updateTimeScale(e);let a=this._updateTime(t),o=this._updateWeight(e);if(o>0){let e=this._interpolants,t=this._propertyBindings;switch(this.blendMode){case Pe:for(let n=0,r=e.length;n!==r;++n)e[n].evaluate(a),t[n].accumulateAdditive(o);break;case Ne:default:for(let n=0,i=e.length;n!==i;++n)e[n].evaluate(a),t[n].accumulate(r,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let r=n.evaluate(e)[0];t*=r,e>n.parameterPositions[1]&&(this.stopFading(),r===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let r=n.evaluate(e)[0];t*=r,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,r=this.time+e,i=this._loopCount,a=n===Ee;if(e===0)return i===-1?r:a&&(i&1)==1?t-r:r;if(n===2200){i===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));handle_stop:{if(r>=t)r=t;else if(r<0)r=0;else{this.time=r;break handle_stop}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=r,this._mixer.dispatchEvent({type:`finished`,action:this,direction:e<0?-1:1})}}else{if(i===-1&&(e>=0?(i=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),r>=t||r<0){let n=Math.floor(r/t);r-=t*n,i+=Math.abs(n);let o=this.repetitions-i;if(o<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,r=e>0?t:0,this.time=r,this._mixer.dispatchEvent({type:`finished`,action:this,direction:e>0?1:-1});else{if(o===1){let t=e<0;this._setEndings(t,!t,a)}else this._setEndings(!1,!1,a);this._loopCount=i,this.time=r,this._mixer.dispatchEvent({type:`loop`,action:this,loopDelta:n})}}else this.time=r;if(a&&(i&1)==1)return t-r}return r}_setEndings(e,t,n){let r=this._interpolantSettings;n?(r.endingStart=je,r.endingEnd=je):(r.endingStart=e?this.zeroSlopeAtStart?je:Ae:Me,r.endingEnd=t?this.zeroSlopeAtEnd?je:Ae:Me)}_scheduleFading(e,t,n){let r=this._mixer,i=r.time,a=this._weightInterpolant;a===null&&(a=r._lendControlInterpolant(),this._weightInterpolant=a);let o=a.parameterPositions,s=a.sampleValues;return o[0]=i,s[0]=t,o[1]=i+e,s[1]=n,this}},mu=class extends Je{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){let n=e._localRoot||this._root,r=e._clip.tracks,i=r.length,a=e._propertyBindings,o=e._interpolants,s=n.uuid,c=this._bindingsByRootAndName,l=c[s];l===void 0&&(l={},c[s]=l);for(let e=0;e!==i;++e){let i=r[e],c=i.name,u=l[c];if(u!==void 0)a[e]=u;else{if(u=a[e],u!==void 0){u._cacheIndex===null&&(++u.referenceCount,this._addInactiveBinding(u,s,c));continue}let r=t&&t._propertyBindings[e].binding.parsedPath;u=new $l(du.create(n,c,r),i.ValueTypeName,i.getValueSize()),++u.referenceCount,this._addInactiveBinding(u,s,c),a[e]=u}o[e].resultBuffer=u.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let t=(e._localRoot||this._root).uuid,n=e._clip.uuid,r=this._actionsByClip[n];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,n,t)}let t=e._propertyBindings;for(let e=0,n=t.length;e!==n;++e){let n=t[e];n.useCount++===0&&(this._lendBinding(n),n.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let e=0,n=t.length;e!==n;++e){let n=t[e];--n.useCount===0&&(n.restoreOriginalState(),this._takeBackBinding(n))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let r=this._actions,i=this._actionsByClip,a=i[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,i[t]=a;else{let t=a.knownActions;e._byClipCacheIndex=t.length,t.push(e)}e._cacheIndex=r.length,r.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],r=e._cacheIndex;n._cacheIndex=r,t[r]=n,t.pop(),e._cacheIndex=null;let i=e._clip.uuid,a=this._actionsByClip,o=a[i],s=o.knownActions,c=s[s.length-1],l=e._byClipCacheIndex;c._byClipCacheIndex=l,s[l]=c,s.pop(),e._byClipCacheIndex=null;let u=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],s.length===0&&delete a[i],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let e=0,n=t.length;e!==n;++e){let n=t[e];--n.referenceCount===0&&this._removeInactiveBinding(n)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,r=this._nActiveActions++,i=t[r];e._cacheIndex=r,t[r]=e,i._cacheIndex=n,t[n]=i}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,r=--this._nActiveActions,i=t[r];e._cacheIndex=r,t[r]=e,i._cacheIndex=n,t[n]=i}_addInactiveBinding(e,t,n){let r=this._bindingsByRootAndName,i=this._bindings,a=r[t];a===void 0&&(a={},r[t]=a),a[n]=e,e._cacheIndex=i.length,i.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,r=n.rootNode.uuid,i=n.path,a=this._bindingsByRootAndName,o=a[r],s=t[t.length-1],c=e._cacheIndex;s._cacheIndex=c,t[c]=s,t.pop(),delete o[i],Object.keys(o).length===0&&delete a[r]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,r=this._nActiveBindings++,i=t[r];e._cacheIndex=r,t[r]=e,i._cacheIndex=n,t[n]=i}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,r=--this._nActiveBindings,i=t[r];e._cacheIndex=r,t[r]=e,i._cacheIndex=n,t[n]=i}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new xc(new Float32Array(2),new Float32Array(2),1,this._controlInterpolantsResultBuffer),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,r=--this._nActiveControlInterpolants,i=t[r];e.__cacheIndex=r,t[r]=e,i.__cacheIndex=n,t[n]=i}clipAction(e,t,n){let r=t||this._root,i=r.uuid,a=typeof e==`string`?jc.findByName(r,e):e,o=a===null?e:a.uuid,s=this._actionsByClip[o],c=null;if(n===void 0&&(n=a===null?Ne:a.blendMode),s!==void 0){let e=s.actionByRoot[i];if(e!==void 0&&e.blendMode===n)return e;c=s.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;let l=new pu(this,a,t,n);return this._bindAction(l,c),this._addInactiveAction(l,o,i),l}existingAction(e,t){let n=t||this._root,r=n.uuid,i=typeof e==`string`?jc.findByName(n,e):e,a=i?i.uuid:e,o=this._actionsByClip[a];return o===void 0?null:o.actionByRoot[r]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,r=this.time+=e,i=Math.sign(e),a=this._accuIndex^=1;for(let o=0;o!==n;++o)t[o]._update(r,e,i,a);let o=this._bindings,s=this._nActiveBindings;for(let e=0;e!==s;++e)o[e].apply(a);return this}setTime(e){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,r=this._actionsByClip,i=r[n];if(i!==void 0){let e=i.knownActions;for(let n=0,r=e.length;n!==r;++n){let r=e[n];this._deactivateAction(r);let i=r._cacheIndex,a=t[t.length-1];r._cacheIndex=null,r._byClipCacheIndex=null,a._cacheIndex=i,t[i]=a,t.pop(),this._removeInactiveBindingsForAction(r)}delete r[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let e in n){let r=n[e].actionByRoot[t];r!==void 0&&(this._deactivateAction(r),this._removeInactiveAction(r))}let r=this._bindingsByRootAndName[t];if(r!==void 0)for(let e in r){let t=r[e];t.restoreOriginalState(),this._removeInactiveBinding(t)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};mu.prototype._controlInterpolantsResultBuffer=new Float32Array(1);var hu=class e{constructor(e){typeof e==`string`&&(console.warn(`THREE.Uniform: Type parameter is no longer needed.`),e=arguments[1]),this.value=e}clone(){return new e(this.value.clone===void 0?this.value:this.value.clone())}},gu=class extends ho{constructor(e,t,n=1){super(e,t),this.meshPerAttribute=n||1}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}};gu.prototype.isInstancedInterleavedBuffer=!0;var _u=class{constructor(e,t,n,r,i){this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=r,this.count=i,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}};_u.prototype.isGLBufferAttribute=!0;var vu=new M,yu=class{constructor(e=new M(1/0,1/0),t=new M(-1/0,-1/0)){this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=vu.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return e===void 0&&(console.warn(`THREE.Box2: .getCenter() target is now required`),e=new M),this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return e===void 0&&(console.warn(`THREE.Box2: .getSize() target is now required`),e=new M),this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t===void 0&&(console.warn(`THREE.Box2: .getParameter() target is now required`),t=new M),t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y)}clampPoint(e,t){return t===void 0&&(console.warn(`THREE.Box2: .clampPoint() target is now required`),t=new M),t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return vu.copy(e).clamp(this.min,this.max).sub(e).length()}intersect(e){return this.min.max(e.min),this.max.min(e.max),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}};yu.prototype.isBox2=!0;var bu=new P,xu=new P,Su=class{constructor(e=new P,t=new P){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e===void 0&&(console.warn(`THREE.Line3: .getCenter() target is now required`),e=new P),e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e===void 0&&(console.warn(`THREE.Line3: .delta() target is now required`),e=new P),e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return t===void 0&&(console.warn(`THREE.Line3: .at() target is now required`),t=new P),this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){bu.subVectors(e,this.start),xu.subVectors(this.end,this.start);let n=xu.dot(xu),r=xu.dot(bu)/n;return t&&(r=$e(r,0,1)),r}closestPointToPoint(e,t,n){let r=this.closestPointToPointParameter(e,t);return n===void 0&&(console.warn(`THREE.Line3: .closestPointToPoint() target is now required`),n=new P),this.delta(n).multiplyScalar(r).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}},Cu=class extends hn{constructor(e){super(),this.material=e,this.render=function(){},this.hasPositions=!1,this.hasNormals=!1,this.hasColors=!1,this.hasUvs=!1,this.positionArray=null,this.normalArray=null,this.colorArray=null,this.uvArray=null,this.count=0}};Cu.prototype.isImmediateRenderObject=!0;var wu=new P,Tu=new F,Eu=new F,Du=class extends ts{constructor(e){let t=Ou(e),n=new z,r=[],i=[],a=new I(0,0,1),o=new I(0,1,0);for(let e=0;e<t.length;e++){let n=t[e];n.parent&&n.parent.isBone&&(r.push(0,0,0),r.push(0,0,0),i.push(a.r,a.g,a.b),i.push(o.r,o.g,o.b))}n.setAttribute(`position`,new R(r,3)),n.setAttribute(`color`,new R(i,3));let s=new Ko({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,s),this.type=`SkeletonHelper`,this.isSkeletonHelper=!0,this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){let t=this.bones,n=this.geometry,r=n.getAttribute(`position`);Eu.copy(this.root.matrixWorld).invert();for(let e=0,n=0;e<t.length;e++){let i=t[e];i.parent&&i.parent.isBone&&(Tu.multiplyMatrices(Eu,i.matrixWorld),wu.setFromMatrixPosition(Tu),r.setXYZ(n,wu.x,wu.y,wu.z),Tu.multiplyMatrices(Eu,i.parent.matrixWorld),wu.setFromMatrixPosition(Tu),r.setXYZ(n+1,wu.x,wu.y,wu.z),n+=2)}n.getAttribute(`position`).needsUpdate=!0,super.updateMatrixWorld(e)}};function Ou(e){let t=[];e&&e.isBone&&t.push(e);for(let n=0;n<e.children.length;n++)t.push.apply(t,Ou(e.children[n]));return t}var ku=class extends ts{constructor(e=10,t=10,n=4473924,r=8947848){n=new I(n),r=new I(r);let i=t/2,a=e/t,o=e/2,s=[],c=[];for(let e=0,l=0,u=-o;e<=t;e++,u+=a){s.push(-o,0,u,o,0,u),s.push(u,0,-o,u,0,o);let t=e===i?n:r;t.toArray(c,l),l+=3,t.toArray(c,l),l+=3,t.toArray(c,l),l+=3,t.toArray(c,l),l+=3}let l=new z;l.setAttribute(`position`,new R(s,3)),l.setAttribute(`color`,new R(c,3));let u=new Ko({vertexColors:!0,toneMapped:!1});super(l,u),this.type=`GridHelper`}};new Int32Array(new Float32Array(1).buffer);var Au=4,ju=8,Mu=[.125,.215,.35,.446,.526,.582],Nu=5+Mu.length,Pu=new zn({side:1,depthWrite:!1,depthTest:!1});new gr(new yr,Pu);var{_lodPlanes:Fu,_sizeLods:Iu,_sigmas:Lu}=Bu(),Ru=(1+Math.sqrt(5))/2,zu=1/Ru;-zu,-zu,-Ru;function Bu(){let e=[],t=[],n=[],r=ju;for(let i=0;i<Nu;i++){let a=2**r;t.push(a);let o=1/a;i>4?o=Mu[i-ju+Au-1]:i==0&&(o=0),n.push(o);let s=1/(a-1),c=-s/2,l=1+s/2,u=[c,c,l,c,l,l,c,c,l,l,c,l],d=new Float32Array(108),f=new Float32Array(72),p=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];d.set(r,18*e),f.set(u,12*e);let i=[e,e,e,e,e,e];p.set(i,6*e)}let m=new z;m.setAttribute(`position`,new L(d,3)),m.setAttribute(`uv`,new L(f,2)),m.setAttribute(`faceIndex`,new L(p,1)),e.push(m),r>Au&&r--}return{_lodPlanes:e,_sizeLods:t,_sigmas:n}}Hc.create=function(e,t){return console.log(`THREE.Curve.create() has been deprecated`),e.prototype=Object.create(Hc.prototype),e.prototype.constructor=e,e.prototype.getPoint=t,e},gl.prototype.fromPoints=function(e){return console.warn(`THREE.Path: .fromPoints() has been renamed to .setFromPoints().`),this.setFromPoints(e)},ku.prototype.setColors=function(){console.error(`THREE.GridHelper: setColors() has been deprecated, pass them in the constructor instead.`)},Du.prototype.update=function(){console.error(`THREE.SkeletonHelper: update() no longer needs to be called.`)},Ic.prototype.extractUrlBase=function(e){return console.warn(`THREE.Loader: .extractUrlBase() has been deprecated. Use THREE.LoaderUtils.extractUrlBase() instead.`),Rl.extractUrlBase(e)},Ic.Handlers={add:function(){console.error(`THREE.Loader: Handlers.add() has been removed. Use LoadingManager.addHandler() instead.`)},get:function(){console.error(`THREE.Loader: Handlers.get() has been removed. Use LoadingManager.getHandler() instead.`)}},yu.prototype.center=function(e){return console.warn(`THREE.Box2: .center() has been renamed to .getCenter().`),this.getCenter(e)},yu.prototype.empty=function(){return console.warn(`THREE.Box2: .empty() has been renamed to .isEmpty().`),this.isEmpty()},yu.prototype.isIntersectionBox=function(e){return console.warn(`THREE.Box2: .isIntersectionBox() has been renamed to .intersectsBox().`),this.intersectsBox(e)},yu.prototype.size=function(e){return console.warn(`THREE.Box2: .size() has been renamed to .getSize().`),this.getSize(e)},gt.prototype.center=function(e){return console.warn(`THREE.Box3: .center() has been renamed to .getCenter().`),this.getCenter(e)},gt.prototype.empty=function(){return console.warn(`THREE.Box3: .empty() has been renamed to .isEmpty().`),this.isEmpty()},gt.prototype.isIntersectionBox=function(e){return console.warn(`THREE.Box3: .isIntersectionBox() has been renamed to .intersectsBox().`),this.intersectsBox(e)},gt.prototype.isIntersectionSphere=function(e){return console.warn(`THREE.Box3: .isIntersectionSphere() has been renamed to .intersectsSphere().`),this.intersectsSphere(e)},gt.prototype.size=function(e){return console.warn(`THREE.Box3: .size() has been renamed to .getSize().`),this.getSize(e)},Ft.prototype.empty=function(){return console.warn(`THREE.Sphere: .empty() has been renamed to .isEmpty().`),this.isEmpty()},Ir.prototype.setFromMatrix=function(e){return console.warn(`THREE.Frustum: .setFromMatrix() has been renamed to .setFromProjectionMatrix().`),this.setFromProjectionMatrix(e)},Su.prototype.center=function(e){return console.warn(`THREE.Line3: .center() has been renamed to .getCenter().`),this.getCenter(e)},at.prototype.flattenToArrayOffset=function(e,t){return console.warn(`THREE.Matrix3: .flattenToArrayOffset() has been deprecated. Use .toArray() instead.`),this.toArray(e,t)},at.prototype.multiplyVector3=function(e){return console.warn(`THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.`),e.applyMatrix3(this)},at.prototype.multiplyVector3Array=function(){console.error(`THREE.Matrix3: .multiplyVector3Array() has been removed.`)},at.prototype.applyToBufferAttribute=function(e){return console.warn(`THREE.Matrix3: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix3( matrix ) instead.`),e.applyMatrix3(this)},at.prototype.applyToVector3Array=function(){console.error(`THREE.Matrix3: .applyToVector3Array() has been removed.`)},at.prototype.getInverse=function(e){return console.warn(`THREE.Matrix3: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead.`),this.copy(e).invert()},F.prototype.extractPosition=function(e){return console.warn(`THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().`),this.copyPosition(e)},F.prototype.flattenToArrayOffset=function(e,t){return console.warn(`THREE.Matrix4: .flattenToArrayOffset() has been deprecated. Use .toArray() instead.`),this.toArray(e,t)},F.prototype.getPosition=function(){return console.warn(`THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.`),new P().setFromMatrixColumn(this,3)},F.prototype.setRotationFromQuaternion=function(e){return console.warn(`THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().`),this.makeRotationFromQuaternion(e)},F.prototype.multiplyToArray=function(){console.warn(`THREE.Matrix4: .multiplyToArray() has been removed.`)},F.prototype.multiplyVector3=function(e){return console.warn(`THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) instead.`),e.applyMatrix4(this)},F.prototype.multiplyVector4=function(e){return console.warn(`THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.`),e.applyMatrix4(this)},F.prototype.multiplyVector3Array=function(){console.error(`THREE.Matrix4: .multiplyVector3Array() has been removed.`)},F.prototype.rotateAxis=function(e){console.warn(`THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.`),e.transformDirection(this)},F.prototype.crossVector=function(e){return console.warn(`THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.`),e.applyMatrix4(this)},F.prototype.translate=function(){console.error(`THREE.Matrix4: .translate() has been removed.`)},F.prototype.rotateX=function(){console.error(`THREE.Matrix4: .rotateX() has been removed.`)},F.prototype.rotateY=function(){console.error(`THREE.Matrix4: .rotateY() has been removed.`)},F.prototype.rotateZ=function(){console.error(`THREE.Matrix4: .rotateZ() has been removed.`)},F.prototype.rotateByAxis=function(){console.error(`THREE.Matrix4: .rotateByAxis() has been removed.`)},F.prototype.applyToBufferAttribute=function(e){return console.warn(`THREE.Matrix4: .applyToBufferAttribute() has been removed. Use attribute.applyMatrix4( matrix ) instead.`),e.applyMatrix4(this)},F.prototype.applyToVector3Array=function(){console.error(`THREE.Matrix4: .applyToVector3Array() has been removed.`)},F.prototype.makeFrustum=function(e,t,n,r,i,a){return console.warn(`THREE.Matrix4: .makeFrustum() has been removed. Use .makePerspective( left, right, top, bottom, near, far ) instead.`),this.makePerspective(e,t,r,n,i,a)},F.prototype.getInverse=function(e){return console.warn(`THREE.Matrix4: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead.`),this.copy(e).invert()},yn.prototype.isIntersectionLine=function(e){return console.warn(`THREE.Plane: .isIntersectionLine() has been renamed to .intersectsLine().`),this.intersectsLine(e)},pt.prototype.multiplyVector3=function(e){return console.warn(`THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.`),e.applyQuaternion(this)},pt.prototype.inverse=function(){return console.warn(`THREE.Quaternion: .inverse() has been renamed to invert().`),this.invert()},Ut.prototype.isIntersectionBox=function(e){return console.warn(`THREE.Ray: .isIntersectionBox() has been renamed to .intersectsBox().`),this.intersectsBox(e)},Ut.prototype.isIntersectionPlane=function(e){return console.warn(`THREE.Ray: .isIntersectionPlane() has been renamed to .intersectsPlane().`),this.intersectsPlane(e)},Ut.prototype.isIntersectionSphere=function(e){return console.warn(`THREE.Ray: .isIntersectionSphere() has been renamed to .intersectsSphere().`),this.intersectsSphere(e)},An.prototype.area=function(){return console.warn(`THREE.Triangle: .area() has been renamed to .getArea().`),this.getArea()},An.prototype.barycoordFromPoint=function(e,t){return console.warn(`THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord().`),this.getBarycoord(e,t)},An.prototype.midpoint=function(e){return console.warn(`THREE.Triangle: .midpoint() has been renamed to .getMidpoint().`),this.getMidpoint(e)},An.prototypenormal=function(e){return console.warn(`THREE.Triangle: .normal() has been renamed to .getNormal().`),this.getNormal(e)},An.prototype.plane=function(e){return console.warn(`THREE.Triangle: .plane() has been renamed to .getPlane().`),this.getPlane(e)},An.barycoordFromPoint=function(e,t,n,r,i){return console.warn(`THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord().`),An.getBarycoord(e,t,n,r,i)},An.normal=function(e,t,n,r){return console.warn(`THREE.Triangle: .normal() has been renamed to .getNormal().`),An.getNormal(e,t,n,r)},_l.prototype.extractAllPoints=function(e){return console.warn(`THREE.Shape: .extractAllPoints() has been removed. Use .extractPoints() instead.`),this.extractPoints(e)},_l.prototype.extrude=function(e){return console.warn(`THREE.Shape: .extrude() has been removed. Use ExtrudeGeometry() instead.`),new ec(this,e)},_l.prototype.makeGeometry=function(e){return console.warn(`THREE.Shape: .makeGeometry() has been removed. Use ShapeGeometry() instead.`),new ic(this,e)},M.prototype.fromAttribute=function(e,t,n){return console.warn(`THREE.Vector2: .fromAttribute() has been renamed to .fromBufferAttribute().`),this.fromBufferAttribute(e,t,n)},M.prototype.distanceToManhattan=function(e){return console.warn(`THREE.Vector2: .distanceToManhattan() has been renamed to .manhattanDistanceTo().`),this.manhattanDistanceTo(e)},M.prototype.lengthManhattan=function(){return console.warn(`THREE.Vector2: .lengthManhattan() has been renamed to .manhattanLength().`),this.manhattanLength()},P.prototype.setEulerFromRotationMatrix=function(){console.error(`THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.`)},P.prototype.setEulerFromQuaternion=function(){console.error(`THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.`)},P.prototype.getPositionFromMatrix=function(e){return console.warn(`THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().`),this.setFromMatrixPosition(e)},P.prototype.getScaleFromMatrix=function(e){return console.warn(`THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().`),this.setFromMatrixScale(e)},P.prototype.getColumnFromMatrix=function(e,t){return console.warn(`THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().`),this.setFromMatrixColumn(t,e)},P.prototype.applyProjection=function(e){return console.warn(`THREE.Vector3: .applyProjection() has been removed. Use .applyMatrix4( m ) instead.`),this.applyMatrix4(e)},P.prototype.fromAttribute=function(e,t,n){return console.warn(`THREE.Vector3: .fromAttribute() has been renamed to .fromBufferAttribute().`),this.fromBufferAttribute(e,t,n)},P.prototype.distanceToManhattan=function(e){return console.warn(`THREE.Vector3: .distanceToManhattan() has been renamed to .manhattanDistanceTo().`),this.manhattanDistanceTo(e)},P.prototype.lengthManhattan=function(){return console.warn(`THREE.Vector3: .lengthManhattan() has been renamed to .manhattanLength().`),this.manhattanLength()},N.prototype.fromAttribute=function(e,t,n){return console.warn(`THREE.Vector4: .fromAttribute() has been renamed to .fromBufferAttribute().`),this.fromBufferAttribute(e,t,n)},N.prototype.lengthManhattan=function(){return console.warn(`THREE.Vector4: .lengthManhattan() has been renamed to .manhattanLength().`),this.manhattanLength()},hn.prototype.getChildByName=function(e){return console.warn(`THREE.Object3D: .getChildByName() has been renamed to .getObjectByName().`),this.getObjectByName(e)},hn.prototype.renderDepth=function(){console.warn(`THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead.`)},hn.prototype.translate=function(e,t){return console.warn(`THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead.`),this.translateOnAxis(t,e)},hn.prototype.getWorldRotation=function(){console.error(`THREE.Object3D: .getWorldRotation() has been removed. Use THREE.Object3D.getWorldQuaternion( target ) instead.`)},hn.prototype.applyMatrix=function(e){return console.warn(`THREE.Object3D: .applyMatrix() has been renamed to .applyMatrix4().`),this.applyMatrix4(e)},Object.defineProperties(hn.prototype,{eulerOrder:{get:function(){return console.warn(`THREE.Object3D: .eulerOrder is now .rotation.order.`),this.rotation.order},set:function(e){console.warn(`THREE.Object3D: .eulerOrder is now .rotation.order.`),this.rotation.order=e}},useQuaternion:{get:function(){console.warn(`THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.`)},set:function(){console.warn(`THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.`)}}}),gr.prototype.setDrawMode=function(){console.error(`THREE.Mesh: .setDrawMode() has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.`)},Object.defineProperties(gr.prototype,{drawMode:{get:function(){return console.error(`THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode.`),0},set:function(){console.error(`THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.`)}}}),zo.prototype.initBones=function(){console.error(`THREE.SkinnedMesh: initBones() has been removed.`)},Dr.prototype.setLens=function(e,t){console.warn(`THREE.PerspectiveCamera.setLens is deprecated. Use .setFocalLength and .filmGauge for a photographic setup.`),t!==void 0&&(this.filmGauge=t),this.setFocalLength(e)},Object.defineProperties(vl.prototype,{onlyShadow:{set:function(){console.warn(`THREE.Light: .onlyShadow has been removed.`)}},shadowCameraFov:{set:function(e){console.warn(`THREE.Light: .shadowCameraFov is now .shadow.camera.fov.`),this.shadow.camera.fov=e}},shadowCameraLeft:{set:function(e){console.warn(`THREE.Light: .shadowCameraLeft is now .shadow.camera.left.`),this.shadow.camera.left=e}},shadowCameraRight:{set:function(e){console.warn(`THREE.Light: .shadowCameraRight is now .shadow.camera.right.`),this.shadow.camera.right=e}},shadowCameraTop:{set:function(e){console.warn(`THREE.Light: .shadowCameraTop is now .shadow.camera.top.`),this.shadow.camera.top=e}},shadowCameraBottom:{set:function(e){console.warn(`THREE.Light: .shadowCameraBottom is now .shadow.camera.bottom.`),this.shadow.camera.bottom=e}},shadowCameraNear:{set:function(e){console.warn(`THREE.Light: .shadowCameraNear is now .shadow.camera.near.`),this.shadow.camera.near=e}},shadowCameraFar:{set:function(e){console.warn(`THREE.Light: .shadowCameraFar is now .shadow.camera.far.`),this.shadow.camera.far=e}},shadowCameraVisible:{set:function(){console.warn(`THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow.camera ) instead.`)}},shadowBias:{set:function(e){console.warn(`THREE.Light: .shadowBias is now .shadow.bias.`),this.shadow.bias=e}},shadowDarkness:{set:function(){console.warn(`THREE.Light: .shadowDarkness has been removed.`)}},shadowMapWidth:{set:function(e){console.warn(`THREE.Light: .shadowMapWidth is now .shadow.mapSize.width.`),this.shadow.mapSize.width=e}},shadowMapHeight:{set:function(e){console.warn(`THREE.Light: .shadowMapHeight is now .shadow.mapSize.height.`),this.shadow.mapSize.height=e}}}),Object.defineProperties(L.prototype,{length:{get:function(){return console.warn(`THREE.BufferAttribute: .length has been deprecated. Use .count instead.`),this.array.length}},dynamic:{get:function(){return console.warn(`THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead.`),this.usage===qe},set:function(){console.warn(`THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead.`),this.setUsage(qe)}}}),L.prototype.setDynamic=function(e){return console.warn(`THREE.BufferAttribute: .setDynamic() has been deprecated. Use .setUsage() instead.`),this.setUsage(e===!0?qe:Ke),this},L.prototype.copyIndicesArray=function(){console.error(`THREE.BufferAttribute: .copyIndicesArray() has been removed.`)},L.prototype.setArray=function(){console.error(`THREE.BufferAttribute: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers`)},z.prototype.addIndex=function(e){console.warn(`THREE.BufferGeometry: .addIndex() has been renamed to .setIndex().`),this.setIndex(e)},z.prototype.addAttribute=function(e,t){return console.warn(`THREE.BufferGeometry: .addAttribute() has been renamed to .setAttribute().`),!(t&&t.isBufferAttribute)&&!(t&&t.isInterleavedBufferAttribute)?(console.warn(`THREE.BufferGeometry: .addAttribute() now expects ( name, attribute ).`),this.setAttribute(e,new L(arguments[1],arguments[2]))):e===`index`?(console.warn(`THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute.`),this.setIndex(t),this):this.setAttribute(e,t)},z.prototype.addDrawCall=function(e,t,n){n!==void 0&&console.warn(`THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset.`),console.warn(`THREE.BufferGeometry: .addDrawCall() is now .addGroup().`),this.addGroup(e,t)},z.prototype.clearDrawCalls=function(){console.warn(`THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups().`),this.clearGroups()},z.prototype.computeOffsets=function(){console.warn(`THREE.BufferGeometry: .computeOffsets() has been removed.`)},z.prototype.removeAttribute=function(e){return console.warn(`THREE.BufferGeometry: .removeAttribute() has been renamed to .deleteAttribute().`),this.deleteAttribute(e)},z.prototype.applyMatrix=function(e){return console.warn(`THREE.BufferGeometry: .applyMatrix() has been renamed to .applyMatrix4().`),this.applyMatrix4(e)},Object.defineProperties(z.prototype,{drawcalls:{get:function(){return console.error(`THREE.BufferGeometry: .drawcalls has been renamed to .groups.`),this.groups}},offsets:{get:function(){return console.warn(`THREE.BufferGeometry: .offsets has been renamed to .groups.`),this.groups}}}),ho.prototype.setDynamic=function(e){return console.warn(`THREE.InterleavedBuffer: .setDynamic() has been deprecated. Use .setUsage() instead.`),this.setUsage(e===!0?qe:Ke),this},ho.prototype.setArray=function(){console.error(`THREE.InterleavedBuffer: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers`)},ec.prototype.getArrays=function(){console.error(`THREE.ExtrudeGeometry: .getArrays() has been removed.`)},ec.prototype.addShapeList=function(){console.error(`THREE.ExtrudeGeometry: .addShapeList() has been removed.`)},ec.prototype.addShape=function(){console.error(`THREE.ExtrudeGeometry: .addShape() has been removed.`)},mo.prototype.dispose=function(){console.error(`THREE.Scene: .dispose() has been removed.`)},hu.prototype.onUpdate=function(){return console.warn(`THREE.Uniform: .onUpdate() has been removed. Use object.onBeforeRender() instead.`),this},Object.defineProperties(Mn.prototype,{wrapAround:{get:function(){console.warn(`THREE.Material: .wrapAround has been removed.`)},set:function(){console.warn(`THREE.Material: .wrapAround has been removed.`)}},overdraw:{get:function(){console.warn(`THREE.Material: .overdraw has been removed.`)},set:function(){console.warn(`THREE.Material: .overdraw has been removed.`)}},wrapRGB:{get:function(){return console.warn(`THREE.Material: .wrapRGB has been removed.`),new I}},shading:{get:function(){console.error(`THREE.`+this.type+`: .shading has been removed. Use the boolean .flatShading instead.`)},set:function(e){console.warn(`THREE.`+this.type+`: .shading has been removed. Use the boolean .flatShading instead.`),this.flatShading=e===1}},stencilMask:{get:function(){return console.warn(`THREE.`+this.type+`: .stencilMask has been removed. Use .stencilFuncMask instead.`),this.stencilFuncMask},set:function(e){console.warn(`THREE.`+this.type+`: .stencilMask has been removed. Use .stencilFuncMask instead.`),this.stencilFuncMask=e}}}),Object.defineProperties(Tr.prototype,{derivatives:{get:function(){return console.warn(`THREE.ShaderMaterial: .derivatives has been moved to .extensions.derivatives.`),this.extensions.derivatives},set:function(e){console.warn(`THREE. ShaderMaterial: .derivatives has been moved to .extensions.derivatives.`),this.extensions.derivatives=e}}}),lo.prototype.clearTarget=function(e,t,n,r){console.warn(`THREE.WebGLRenderer: .clearTarget() has been deprecated. Use .setRenderTarget() and .clear() instead.`),this.setRenderTarget(e),this.clear(t,n,r)},lo.prototype.animate=function(e){console.warn(`THREE.WebGLRenderer: .animate() is now .setAnimationLoop().`),this.setAnimationLoop(e)},lo.prototype.getCurrentRenderTarget=function(){return console.warn(`THREE.WebGLRenderer: .getCurrentRenderTarget() is now .getRenderTarget().`),this.getRenderTarget()},lo.prototype.getMaxAnisotropy=function(){return console.warn(`THREE.WebGLRenderer: .getMaxAnisotropy() is now .capabilities.getMaxAnisotropy().`),this.capabilities.getMaxAnisotropy()},lo.prototype.getPrecision=function(){return console.warn(`THREE.WebGLRenderer: .getPrecision() is now .capabilities.precision.`),this.capabilities.precision},lo.prototype.resetGLState=function(){return console.warn(`THREE.WebGLRenderer: .resetGLState() is now .state.reset().`),this.state.reset()},lo.prototype.supportsFloatTextures=function(){return console.warn(`THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( 'OES_texture_float' ).`),this.extensions.get(`OES_texture_float`)},lo.prototype.supportsHalfFloatTextures=function(){return console.warn(`THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( 'OES_texture_half_float' ).`),this.extensions.get(`OES_texture_half_float`)},lo.prototype.supportsStandardDerivatives=function(){return console.warn(`THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( 'OES_standard_derivatives' ).`),this.extensions.get(`OES_standard_derivatives`)},lo.prototype.supportsCompressedTextureS3TC=function(){return console.warn(`THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( 'WEBGL_compressed_texture_s3tc' ).`),this.extensions.get(`WEBGL_compressed_texture_s3tc`)},lo.prototype.supportsCompressedTexturePVRTC=function(){return console.warn(`THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( 'WEBGL_compressed_texture_pvrtc' ).`),this.extensions.get(`WEBGL_compressed_texture_pvrtc`)},lo.prototype.supportsBlendMinMax=function(){return console.warn(`THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( 'EXT_blend_minmax' ).`),this.extensions.get(`EXT_blend_minmax`)},lo.prototype.supportsVertexTextures=function(){return console.warn(`THREE.WebGLRenderer: .supportsVertexTextures() is now .capabilities.vertexTextures.`),this.capabilities.vertexTextures},lo.prototype.supportsInstancedArrays=function(){return console.warn(`THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( 'ANGLE_instanced_arrays' ).`),this.extensions.get(`ANGLE_instanced_arrays`)},lo.prototype.enableScissorTest=function(e){console.warn(`THREE.WebGLRenderer: .enableScissorTest() is now .setScissorTest().`),this.setScissorTest(e)},lo.prototype.initMaterial=function(){console.warn(`THREE.WebGLRenderer: .initMaterial() has been removed.`)},lo.prototype.addPrePlugin=function(){console.warn(`THREE.WebGLRenderer: .addPrePlugin() has been removed.`)},lo.prototype.addPostPlugin=function(){console.warn(`THREE.WebGLRenderer: .addPostPlugin() has been removed.`)},lo.prototype.updateShadowMap=function(){console.warn(`THREE.WebGLRenderer: .updateShadowMap() has been removed.`)},lo.prototype.setFaceCulling=function(){console.warn(`THREE.WebGLRenderer: .setFaceCulling() has been removed.`)},lo.prototype.allocTextureUnit=function(){console.warn(`THREE.WebGLRenderer: .allocTextureUnit() has been removed.`)},lo.prototype.setTexture=function(){console.warn(`THREE.WebGLRenderer: .setTexture() has been removed.`)},lo.prototype.setTexture2D=function(){console.warn(`THREE.WebGLRenderer: .setTexture2D() has been removed.`)},lo.prototype.setTextureCube=function(){console.warn(`THREE.WebGLRenderer: .setTextureCube() has been removed.`)},lo.prototype.getActiveMipMapLevel=function(){return console.warn(`THREE.WebGLRenderer: .getActiveMipMapLevel() is now .getActiveMipmapLevel().`),this.getActiveMipmapLevel()},Object.defineProperties(lo.prototype,{shadowMapEnabled:{get:function(){return this.shadowMap.enabled},set:function(e){console.warn(`THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled.`),this.shadowMap.enabled=e}},shadowMapType:{get:function(){return this.shadowMap.type},set:function(e){console.warn(`THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type.`),this.shadowMap.type=e}},shadowMapCullFace:{get:function(){console.warn(`THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.`)},set:function(){console.warn(`THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.`)}},context:{get:function(){return console.warn(`THREE.WebGLRenderer: .context has been removed. Use .getContext() instead.`),this.getContext()}},vr:{get:function(){return console.warn(`THREE.WebGLRenderer: .vr has been renamed to .xr`),this.xr}},gammaInput:{get:function(){return console.warn(`THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead.`),!1},set:function(){console.warn(`THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead.`)}},gammaOutput:{get:function(){return console.warn(`THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead.`),!1},set:function(e){console.warn(`THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead.`),this.outputEncoding=e===!0?Ie:Fe}},toneMappingWhitePoint:{get:function(){return console.warn(`THREE.WebGLRenderer: .toneMappingWhitePoint has been removed.`),1},set:function(){console.warn(`THREE.WebGLRenderer: .toneMappingWhitePoint has been removed.`)}}}),Object.defineProperties(Qa.prototype,{cullFace:{get:function(){console.warn(`THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.`)},set:function(){console.warn(`THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.`)}},renderReverseSided:{get:function(){console.warn(`THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.`)},set:function(){console.warn(`THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.`)}},renderSingleSided:{get:function(){console.warn(`THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.`)},set:function(){console.warn(`THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.`)}}}),Object.defineProperties(dt.prototype,{wrapS:{get:function(){return console.warn(`THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS.`),this.texture.wrapS},set:function(e){console.warn(`THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS.`),this.texture.wrapS=e}},wrapT:{get:function(){return console.warn(`THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT.`),this.texture.wrapT},set:function(e){console.warn(`THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT.`),this.texture.wrapT=e}},magFilter:{get:function(){return console.warn(`THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter.`),this.texture.magFilter},set:function(e){console.warn(`THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter.`),this.texture.magFilter=e}},minFilter:{get:function(){return console.warn(`THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter.`),this.texture.minFilter},set:function(e){console.warn(`THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter.`),this.texture.minFilter=e}},anisotropy:{get:function(){return console.warn(`THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy.`),this.texture.anisotropy},set:function(e){console.warn(`THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy.`),this.texture.anisotropy=e}},offset:{get:function(){return console.warn(`THREE.WebGLRenderTarget: .offset is now .texture.offset.`),this.texture.offset},set:function(e){console.warn(`THREE.WebGLRenderTarget: .offset is now .texture.offset.`),this.texture.offset=e}},repeat:{get:function(){return console.warn(`THREE.WebGLRenderTarget: .repeat is now .texture.repeat.`),this.texture.repeat},set:function(e){console.warn(`THREE.WebGLRenderTarget: .repeat is now .texture.repeat.`),this.texture.repeat=e}},format:{get:function(){return console.warn(`THREE.WebGLRenderTarget: .format is now .texture.format.`),this.texture.format},set:function(e){console.warn(`THREE.WebGLRenderTarget: .format is now .texture.format.`),this.texture.format=e}},type:{get:function(){return console.warn(`THREE.WebGLRenderTarget: .type is now .texture.type.`),this.texture.type},set:function(e){console.warn(`THREE.WebGLRenderTarget: .type is now .texture.type.`),this.texture.type=e}},generateMipmaps:{get:function(){return console.warn(`THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps.`),this.texture.generateMipmaps},set:function(e){console.warn(`THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps.`),this.texture.generateMipmaps=e}}}),Zl.prototype.load=function(e){console.warn(`THREE.Audio: .load has been deprecated. Use THREE.AudioLoader instead.`);let t=this;return new Jl().load(e,function(e){t.setBuffer(e)}),this},Ql.prototype.getData=function(){return console.warn(`THREE.AudioAnalyser: .getData() is now .getFrequencyData().`),this.getFrequencyData()},Ar.prototype.updateCubeMap=function(e,t){return console.warn(`THREE.CubeCamera: .updateCubeMap() is now .update().`),this.update(e,t)},Ar.prototype.clear=function(e,t,n,r){return console.warn(`THREE.CubeCamera: .clear() is now .renderTarget.clear().`),this.renderTarget.clear(e,t,n,r)},st.crossOrigin=void 0,st.loadTexture=function(e,t,n,r){console.warn(`THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.`);let i=new Vc;i.setCrossOrigin(this.crossOrigin);let a=i.load(e,n,void 0,r);return t&&(a.mapping=t),a},st.loadTextureCube=function(e,t,n,r){console.warn(`THREE.ImageUtils.loadTextureCube has been deprecated. Use THREE.CubeTextureLoader() instead.`);let i=new Bc;i.setCrossOrigin(this.crossOrigin);let a=i.load(e,n,void 0,r);return t&&(a.mapping=t),a},st.loadCompressedTexture=function(){console.error(`THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.`)},st.loadCompressedTextureCube=function(){console.error(`THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.`)},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`128`}})),typeof window<`u`&&(window.__THREE__?console.warn(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`128`);var Vu=Math.PI*2,Hu=1.25,Uu=35*Math.PI/180,Wu=Math.sin(Uu),Gu=Math.cos(Uu),Ku=1/60,qu=.64,Ju=2.8,Yu=.545,Xu=.3,Zu=.15,Qu=3.4,$u=6.6,ed=1.25,td=ed/Wu,nd=ed/Gu,rd=[`下`,`右下`,`右`,`右上`,`上`,`左上`,`左`,`左下`],id=[[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]],ad=32.5*Math.PI/180,od=new P(-.6,1,.35).normalize(),sd=new P(0,.95,0),cd=new P(0,Wu,Gu),ld=1024,ud={TRUE:0,NEAR:1,FAR:2,GROUND:3},dd=[{label:`素の縮小`,f:[0,0,0,0]},{label:`＋1 階調`,f:[1,0,0,0]},{label:`＋2 α`,f:[1,1,0,0]},{label:`＋3 輪郭`,f:[1,1,1,0]},{label:`＋4 対策`,f:[1,1,1,1]}],fd=[{k:`3d`,label:`3D形状`},{k:`uv`,label:`UVデカール`},{k:`pixel`,label:`ドット顔`}],pd={D:`#241a38`,W:`#fffaf0`,C:`#3f5aa6`,K:`#c98b6e`},md={16:{w:1,h:1,eye:[`D`],narrow:[`D`]},24:{w:1,h:2,eye:[`D`,`D`],narrow:[`D`,`D`]},32:{w:2,h:3,eye:[`DW`,`DD`,`CC`],narrow:[`D.`,`D.`,`C.`]},48:{w:3,h:4,eye:[`DDD`,`DCW`,`DCC`,`.DD`],narrow:[`DD.`,`DC.`,`DC.`,`.D.`]}},hd={2:{angryL:[`D.`,`.D`],angryR:[`.D`,`D.`],sadL:[`.D`,`D.`],sadR:[`D.`,`.D`]},3:{angryL:[`DD.`,`..D`],angryR:[`.DD`,`D..`],sadL:[`..D`,`DD.`],sadR:[`D..`,`.DD`]}},gd={K:`#2a1f3d`,W:`#ffffff`,R:`#e04848`,Y:`#f5c84a`,B:`#6ab4f0`},_d=[{rows:[`....KKK..`,`....KYKK.`,`....KYYYK`,`....KYKKK`,`....KYK..`,`..KKKYK..`,`.KYYYYK..`,`.KYYYK...`,`..KKK....`],ox:2,oy:0},{rows:[`...KKK...`,`..KRRRK..`,`..KRRRK..`,`...KRK...`,`...KRK...`,`....K....`,`...KKK...`,`...KRK...`,`...KKK...`],ox:0,oy:0},{rows:[`..KKKKK..`,`.KWWWWWK.`,`.KWKKKWK.`,`..K..KWK.`,`....KWK..`,`....KWK..`,`....KKK..`,`....KWK..`,`....KKK..`],ox:0,oy:0},{rows:[`.........`,`.........`,`.........`,`.........`,`KKKKKKKKK`,`KWKKWKKWK`,`KKKKKKKKK`,`.........`,`.........`],ox:0,oy:-2},{rows:[`.KK...KK.`,`KRRK.KRRK`,`KRK...KRK`,`.K.....K.`,`.........`,`.K.....K.`,`KRK...KRK`,`KRRK.KRRK`,`.KK...KK.`],ox:4,oy:0},{rows:[`....K....`,`...KBK...`,`...KBK...`,`..KBBBK..`,`..KBWBK..`,`.KBWBBBK.`,`.KBBBBBK.`,`..KBBBK..`,`...KKK...`],ox:7,oy:-7,drift:!0}],vd={joy:{icon:0,motion:`hop`,eye:1,brow:-1,dur:1.8},surprise:{icon:1,motion:`jolt`,eye:0,brow:-1,dur:1.6},question:{icon:2,motion:`tilt`,eye:0,brow:1,dur:2},sad:{icon:3,motion:`slump`,eye:1,brow:1,dur:2.4},angry:{icon:4,motion:`stomp`,eye:0,brow:0,dur:1.8},sweat:{icon:5,motion:`fidget`,eye:0,brow:1,dur:2}},yd={K:`#2a2238`,k:`#4a3f55`,W:`#f4f1ea`,w:`#c9c4b8`,g:`#8a8478`,B:`#4b8fd0`,b:`#8fc3ec`,R:`#d8443f`,r:`#9c2f3a`,Y:`#f2c94c`,G:`#3f7f3a`,N:`#7a5032`,n:`#553722`,T:`#c9a46b`,O:`#e98a3a`},bd={crack:[`..k......`,`.k.k.....`,`k...kk.k.`,`.....k.k.`,`......k..`],puddle:[`...bbbbbb...`,`.bbBBBBBBbb.`,`bBBBBWBBBBBb`,`.bbBBBBBBbb.`,`...bbbbbb...`],pebbles:[`.w...w.`,`wgw.wgw`,`.g..ggw`,`...w.g.`],tulips:[`R...R...R`,`r.R.r.R.r`,`G.r.G.r.G`,`G.G.G.G.G`,`.G.G.G.G.`],mushroom:[`.RRR.`,`RWRWR`,`RRRRR`,`..W..`,`.wWw.`],leaves:[`.O....N.`,`OOn..NN.`,`.n..O...`,`...OOn..`],shopSign:[`..k......k..`,`KKKKKKKKKKKK`,`KTTTTwwTTTTK`,`KTTTTkkTTTTK`,`KTTTkBBkTTTK`,`KTTkBbBBkTTK`,`KTTkBBBBkTTK`,`KTTTkkkkTTTK`,`KKKKKKKKKKKK`]},xd=[[`crack`,-1.5,0,-1,4],[`crack`,2,0,1.8,4],[`puddle`,6.5,0,.3,4],[`pebbles`,-12,0,.6,4],[`pebbles`,.3,0,-8,4],[`tulips`,-2.6,0,5.2,4],[`tulips`,12.5,0,-2.4,4],[`tulips`,-12.5,0,3.6,4],[`mushroom`,-12.6,0,-9.5,4],[`mushroom`,15.6,0,3.9,4],[`leaves`,13.5,0,-10.7,4],[`leaves`,-14.3,0,11.3,4],[`shopSign`,9.9,1,-5,1]],Sd={day:{dir:[-.6,1,.35],col:[1,1,1],int:1,amb:0,lamps:0,decal:1},evening:{dir:[-1,.6,.3],col:[1,.8,.62],int:.92,amb:.04,lamps:.7,decal:.9},night:{dir:[-.45,1,.3],col:[.55,.66,.95],int:.6,amb:.12,lamps:1,decal:.65}},Cd={none:0,brick:1,plankH:2,plankV:3,shingle:4,stone:5,bark:6},wd={grass:0,meadow:1,dirt:2,sand:3,cobble:4,water:5},H={S:32,dot:4,face:`pixel`,f1:!0,f2:!0,f3:!0,f4:!0,auto:!0,compare:!1,tod:`day`,shadow:!0},Td=()=>2*Hu/H.S,Ed=null,Dd=null;function Od(e){if(E.preview.view!==`dot`)throw Error(`性能測定は「最終ドット絵」に切り替えてください`);Ed=new le(5,10),Dd={buildId:{buildId:`gh-42499868841-1-10422fc7d702`,commit:`10422fc7d702b63e06dd94f911704477a40a86f2`,builtAt:`2026-11-08T16:26:38.677Z`}.buildId,document:e,comparison:E.baseline?`baseline`:`draft`,renderedValues:S(D()),variant:O.variant,selection:O.selection,S:H.S,dot:H.dot,shadow:H.shadow,characterCount:1,orientation:innerWidth>innerHeight?`横持ち`:`縦持ち`,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},userAgent:navigator.userAgent},jd()}function kd(e){Ed?.interrupt(e),jd()}function Ad(){return Ed?{conditions:Dd,performance:Ed.result()}:null}function jd(){let e=document.getElementById(`look-performance`);if(!e||!Ed)return;let t=Ed.result();e.textContent=t.status===`complete`?`測定終了：${t.renderedFps?.toFixed(3)}fps・${t.renderedFrames}フレーム・${t.measuredSeconds.toFixed(3)}秒・p95 ${t.frameIntervals.p95Ms?.toFixed(2)}ms`:t.status===`interrupted`?`測定中断：${t.reason}`:`${t.status===`warming`?`準備中（5秒）`:`測定中（10秒）`} — 自動終了まで操作せず待ってください`}function Md(e,t,n){Ed&&!Ed.done&&(Ed.sample(e,t,n),jd())}function Nd(){document.querySelector(`.look-dock`)?.addEventListener(`pointerdown`,()=>kd(`プレビュー操作が変更されました`)),document.getElementById(`look-panel`).addEventListener(`click`,e=>{let t=e.target.id;t!==`look-measure`&&t!==`look-measure-copy`&&kd(`操作が変更されました`)},!0);for(let e of[`input`,`change`,`pointerdown`])document.getElementById(`look-panel`).addEventListener(e,()=>kd(`設定または操作が変更されました`));window.addEventListener(`resize`,()=>kd(`画面の向き・寸法が変わりました`)),document.addEventListener(`visibilitychange`,()=>{document.hidden&&kd(`画面が非表示になりました`)})}var Pd=(e=0,t=0,n=0)=>new P(e,t,n),U={uCamR:{value:Pd(1,0,0)},uCamU:{value:Pd(0,Gu,-Wu)},uCamB:{value:cd.clone()},uPixOrigin:{value:new M},uPixScale:{value:1},uTexel:{value:Td()},uT:{value:16},uTime:{value:0},uKNear:{value:.15},uKFar:{value:.02},uFoot:{value:new N(0,0,Zu,-1)},uToon:{value:1},uUnwrap:{value:1},tRamp:{value:null},uRampRows:{value:1},tMap:{value:null},uMapSize:{value:new M(40,24)},uTW:{value:ed},uTD:{value:td},uTH:{value:nd},uNear:{value:1},uFar:{value:2},uLightDir:{value:Pd(0,1,0)},uSunDirW:{value:od.clone()},uSunCol:{value:Pd(1,1,1)},uSunInt:{value:1},uAmb:{value:0},uPL:{value:Array.from({length:8},()=>new N)},uPLC:{value:Array.from({length:8},()=>Pd())},uPLN:{value:0},tShadow:{value:null},uShadowMat:{value:new F},uShadowOn:{value:0}},Fd=[`uCamB`,`uKNear`,`uKFar`,`uFoot`],Id=[`uCamR`,`uCamU`,`uCamB`,`uPixOrigin`,`uPixScale`,`uTexel`,`uT`,`uTime`],Ld=[`uLightDir`,`uSunDirW`,`uSunCol`,`uSunInt`,`uAmb`,`uPL`,`uPLC`,`uPLN`,`tShadow`,`uShadowMat`,`uShadowOn`];function Rd(e,...t){let n={};return t.flat().forEach(e=>n[e]=U[e]),Object.assign(n,e)}var zd=e=>Math.min(1,Math.max(0,e));function Bd(e,t,n){let r=t-e;return r>.5&&--r,r<-.5&&(r+=1),(e+r*n+1)%1}function Vd(e,t,n,r,i){let a={};e.getHSL(a);let o=new I;return o.setHSL(Bd(a.h,i,t),zd(a.s+n),zd(a.l+r)),o}function Hd(e){let t=new I(e);return[Vd(t,.22,.05,-.3,.72),Vd(t,.12,.03,-.15,.72),t.clone(),Vd(t,.1,-.05,.12,.14)]}function Ud(e){let t=new I(e);return[Vd(t,.22,.05,-.3,.72),Vd(t,.12,.03,-.15,.72),t.clone(),Vd(t,.1,-.05,.12,.14),Vd(t,.16,-.1,.24,.14)]}var Wd=[],Gd=e=>(Wd.push(e),Wd.length-1);Gd(4885052),Gd(4885052),Gd(10253894),Gd(12889464),Gd(9341309),Gd(3111096);var W={brick:Gd(11561554),plank:Gd(10844752),stoneW:Gd(10656911),roofR:Gd(11814458),roofB:Gd(4417190),roofG:Gd(5078344),wood:Gd(8015922),window:Gd(15782010),leaf:Gd(4098629),bush:Gd(5938248),rock:Gd(9211027),cliff:Gd(9074788),trunk:Gd(7096366),waterW:Gd(3111096),barrel:Gd(10119742),metal:Gd(6052454),lantern:Gd(16172890)};(function(){let e=Wd.length,t=new Uint8Array(5*e*4);Wd.forEach((e,n)=>Ud(e).forEach((e,r)=>{let i=(n*5+r)*4;t[i]=Math.round(e.r*255),t[i+1]=Math.round(e.g*255),t[i+2]=Math.round(e.b*255),t[i+3]=255}));let n=new Nr(t,5,e,Ce);n.minFilter=n.magFilter=A,n.needsUpdate=!0,U.tRamp.value=n,U.uRampRows.value=e})();var Kd=`
uniform vec3 uCamR; uniform vec3 uCamU; uniform vec3 uCamB;
uniform vec2 uPixOrigin; uniform float uPixScale; uniform float uTexel; uniform float uT; uniform float uTime;
`,qd=`
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 x){
  vec2 i = floor(x), f = fract(x); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float bandOf(float l){ return l > 0.8 ? 1.0 : (l > 0.5 ? 0.0 : (l > 0.3 ? -1.0 : -2.0)); }
`,Jd=`
#include <packing>
uniform vec3 uLightDir; uniform vec3 uSunDirW; uniform vec3 uSunCol; uniform float uSunInt; uniform float uAmb;
uniform vec4 uPL[8]; uniform vec3 uPLC[8]; uniform float uPLN;
uniform sampler2D tShadow; uniform mat4 uShadowMat; uniform float uShadowOn;
float bayer2(vec2 p){ float x = mod(p.x, 2.0), y = mod(p.y, 2.0); return (x < 0.5 ? (y < 0.5 ? 0.0 : 3.0) : (y < 0.5 ? 2.0 : 1.0)) / 4.0 + 0.125; }
float shadowAt(vec3 wpos, vec3 nW){
  if (uShadowOn < 0.5 || dot(nW, uSunDirW) <= 0.05) return 1.0;
  vec4 sc = uShadowMat * vec4(wpos, 1.0);
  vec3 s = sc.xyz / sc.w;
  if (s.x <= 0.0 || s.x >= 1.0 || s.y <= 0.0 || s.y >= 1.0 || s.z >= 1.0) return 1.0;
  float d = unpackRGBAToDepth(texture2D(tShadow, s.xy));
  return s.z - 0.0015 > d ? 0.0 : 1.0;
}
float lighting(vec3 nV, vec3 nW, vec3 wpos, vec2 pix, out vec3 tint){
  float hl = dot(nV, uLightDir) * 0.5 + 0.5;
  if (shadowAt(wpos, nW) < 0.5) hl = min(hl, 0.42);
  float l = uAmb + hl * uSunInt * (1.0 - uAmb);
  vec3 add = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (float(i) >= uPLN) break;
    vec3 d = uPL[i].xyz - wpos; float dist = length(d);
    float a = clamp(1.0 - dist / uPL[i].w, 0.0, 1.0); a *= a;
    float lam = max(0.0, dot(nW, d / max(dist, 0.001))) * 0.6 + 0.4;
    float q = floor(a * lam * 4.0 + bayer2(pix)) / 4.0;
    vec3 c = uPLC[i];
    l += q * 0.75 * max(c.r, max(c.g, c.b));
    add += c * q;
  }
  tint = min(uSunCol + add * 0.85, vec3(1.35));
  return l;
}
`,Yd=`
float foliage(vec2 p, vec3 C, float Rw, float seed, out float offs, out vec3 nrm){
  vec2 cs = floor(vec2(dot(C, uCamR), dot(C, uCamU)) / uTexel + 0.5);
  vec2 lp = p + 0.5 - cs;
  float Rp = Rw / uTexel;
  float cell = max(3.0, floor(uT * 0.38 + 0.5));
  vec2 gc = floor(lp / cell);
  float best = 1e9, second = 1e9; vec2 bc = vec2(0.0);
  float tq = floor(uTime * 3.0);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = gc + vec2(float(i), float(j));
      vec2 c = (g + 0.2 + vec2(hash(g + seed), hash(g + seed + 17.0)) * 0.6) * cell;
      if (hash(g + seed + tq * 0.37) > 0.9) c.x += 1.0;
      float d = length(lp - c);
      if (d < best) { second = best; best = d; bc = c; } else if (d < second) second = d;
    }
  }
  vec2 nxy = bc / vec2(Rp, Rp * 0.92);
  offs = 0.0; nrm = vec3(0.0, 0.0, 1.0);
  if (dot(nxy, nxy) > 1.0 || best > cell * 0.85) return 0.0;
  nrm = vec3(nxy, sqrt(max(0.0, 1.0 - dot(nxy, nxy))));
  vec2 dd = lp - bc;
  if (second - best < 1.0) offs = -1.0;
  else if (-dd.x + dd.y > cell * 0.45) offs = 1.0;
  else if (dd.x - dd.y > cell * 0.4) offs = -1.0;
  return 1.0;
}
`,Xd=`
attribute vec4 aMapA; attribute vec2 aMapB; attribute float aCard; attribute vec4 aFoot;
uniform vec3 uCamB; uniform float uCardSrc; uniform float uCardKind; uniform vec4 uFoot; uniform float uKNear; uniform float uKFar;
varying vec3 vN; varying vec3 vWN; varying vec3 vWorld; varying vec2 vUv; varying float vDist;
varying vec4 vMapA; varying vec2 vMapB; varying float vKind;
void main(){
  vN = normalize(normalMatrix * normal);
  vWN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz; vUv = uv; vMapA = aMapA; vMapB = aMapB;
  vDist = -(viewMatrix * wp).z;
  float kind = uCardSrc > 1.5 ? aCard : (uCardSrc > 0.5 ? uCardKind : 0.0);
  vec4 foot = uCardSrc > 1.5 ? aFoot : uFoot;
  vKind = kind;
  vec3 pos = wp.xyz;
  if (kind > 0.5 && kind < 2.5) {
    vec3 nh = normalize(vec3(uCamB.x, 0.0, uCamB.z));         // カメラ側を向く水平方向
    float ext = foot.w < 0.0 ? foot.z : abs(nh.x) * foot.z + abs(nh.z) * foot.w;
    float d0 = dot(foot.xy, nh.xz) + (kind < 1.5 ? ext : -ext); // 足元の最も近い点 or 最も遠い点
    float t = (d0 - dot(wp.xyz, nh)) / dot(uCamB, nh);
    pos = mix(wp.xyz + uCamB * t, wp.xyz, kind < 1.5 ? uKNear : uKFar);
  }
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
  if (kind > 2.5) gl_Position.z = 0.9995 * gl_Position.w;     // 地面は常に最奥
}`,Zd=Kd+Jd+`
uniform float uToon; uniform float uAlpha;
uniform vec3 uDeep; uniform vec3 uShadow; uniform vec3 uBase; uniform vec3 uLight;
uniform sampler2D uMap; uniform float uHasMap;
varying vec3 vN; varying vec3 vWN; varying vec3 vWorld; varying vec2 vUv;
void main(){
  vec4 tex = vec4(1.0);
  if (uHasMap > 0.5) { tex = texture2D(uMap, vUv); if (tex.a < 0.5) discard; }
  vec2 pix = uPixOrigin + floor(gl_FragCoord.xy / uPixScale);
  vec3 tint;
  float l = lighting(normalize(vN), normalize(vWN), vWorld, pix, tint);
  vec3 c;
  if (uToon > 0.5) c = l > 0.80 ? uLight : (l > 0.50 ? uBase : (l > 0.30 ? uShadow : uDeep));
  else c = uBase * (0.42 + 0.78 * l);
  if (uHasMap > 0.5) c = tex.rgb * (l > 0.30 ? 1.0 : 0.82);
  gl_FragColor = vec4(c * tint, uAlpha);
}`,Qd=Kd+qd+Jd+Yd+`
uniform float uToon; uniform sampler2D tRamp; uniform float uRampRows; uniform float uRow; uniform float uPattern;
uniform float uEmissive; uniform float uUnwrap;
varying vec3 vN; varying vec3 vWN; varying vec3 vWorld; varying vec4 vMapA; varying vec2 vMapB;
vec3 ramp(float idx){ return texture2D(tRamp, vec2((idx + 0.5) / 5.0, (uRow + 0.5) / uRampRows)).rgb; }
vec2 mapAt(vec2 pc){
  bool cyl = vMapA.x > 0.5 && normalize(vWN).y < 0.6;
  if (!cyl) {
    vec3 o3 = vMapA.x > 0.5 ? vec3(vMapA.y, vMapB.x, vMapA.z) : vMapA.yzw;
    vec2 o = floor(vec2(dot(o3, uCamR), dot(o3, uCamU)) / uTexel + 0.5);
    return vec2(pc.x - o.x, o.y - pc.y);
  }
  float cx = vMapA.y, cz = vMapA.z, r = vMapA.w, yTop = vMapB.x;
  float k = vMapB.y < 0.0 ? uUnwrap : vMapB.y;
  vec3 Rh = normalize(vec3(uCamR.x, 0.0, uCamR.z));
  vec3 Bh = normalize(vec3(uCamB.x, 0.0, uCamB.z));
  vec3 C = vec3(cx, 0.0, cz);
  float rel = clamp((pc.x * uTexel - dot(C, Rh)) / r, -1.0, 1.0);
  float th = asin(rel);
  vec3 Ph = C + Rh * (rel * r) + Bh * (r * cos(th));
  float y = (pc.y * uTexel - dot(Ph, uCamU)) / uCamU.y;
  float lx = mix(rel * r, th * r, k) / uTexel;
  float lyP = dot(vec3(cx, yTop, cz), uCamU) / uTexel - pc.y;
  float lyS = (yTop - y) * uCamU.y / uTexel;
  return vec2(lx, mix(lyP, lyS, k));
}
vec2 cellId(vec2 L){
  if (uPattern > 5.5) {
    float col = floor((L.x + floor(hash(vec2(floor(L.y / 7.0), 1.0)) * 2.0)) / 3.0);
    return vec2(col, floor((L.y + floor(hash(vec2(col, 4.0)) * 11.0)) / 11.0));
  }
  if (uPattern < 1.5) { float row = floor(L.y / 4.0); return vec2(floor((L.x + mod(row, 2.0) * 4.0) / 8.0), row); }
  if (uPattern < 2.5) { float row = floor(L.y / 4.0); return vec2(floor((L.x + floor(hash(vec2(row, 3.0)) * 24.0)) / 18.0), row); }
  if (uPattern < 3.5) { float col = floor(L.x / 3.0); return vec2(col, floor((L.y + floor(hash(vec2(col, 5.0)) * 20.0)) / 14.0)); }
  if (uPattern < 4.5) { float row = floor(L.y / 3.0); return vec2(floor((L.x + mod(row, 2.0) * 3.0) / 6.0), row); }
  float row = floor(L.y / 5.0);
  float w = 7.0 + floor(hash(vec2(row, 9.0)) * 5.0);
  return vec2(floor((L.x + floor(hash(vec2(row, 2.0)) * 12.0)) / w), row);
}
bool diff(vec2 a, vec2 b){ return a.x != b.x || a.y != b.y; }
float pat(vec2 p){
  if (uPattern < 0.5) return 0.0;
  vec2 pc = p + 0.5;
  vec2 id  = cellId(mapAt(pc));
  vec2 idR = cellId(mapAt(pc + vec2(1.0, 0.0)));
  vec2 idD = cellId(mapAt(pc + vec2(0.0, -1.0)));
  vec2 idL = cellId(mapAt(pc + vec2(-1.0, 0.0)));
  vec2 idU = cellId(mapAt(pc + vec2(0.0, 1.0)));
  if ((uPattern > 2.5 && uPattern < 3.5) || uPattern > 5.5) {
    if (idR.x != id.x || idD.y != id.y) return -1.0;
    return idL.x != id.x ? 1.0 : 0.0;
  }
  if (diff(id, idR) || diff(id, idD)) return uPattern > 4.5 ? -2.0 : -1.0;
  float o = hash(id) < 0.25 ? -1.0 : 0.0;
  if (diff(id, idU) || diff(id, idL)) o += 1.0;
  return o;
}
void main(){
  vec2 p = uPixOrigin + floor(gl_FragCoord.xy / uPixScale);
  vec3 nV = normalize(vN), nW = normalize(vWN);
  float offs = 0.0;
  if (vMapA.x > 1.5) {
    vec3 fn;
    if (foliage(p, vec3(vMapA.y, vMapB.x, vMapA.z), vMapA.w, vMapB.y, offs, fn) < 0.5) discard;
    nV = fn; nW = normalize(fn.x * uCamR + fn.y * uCamU + fn.z * uCamB);
  } else offs = pat(p);
  if (uEmissive > 0.5) { gl_FragColor = vec4(ramp(4.0), 1.0); return; }
  vec3 tint;
  float l = lighting(nV, nW, vWorld, p, tint);
  float idx = clamp((uToon > 0.5 ? 2.0 + bandOf(l) : 2.0) + offs, 0.0, 4.0);
  vec3 c = ramp(idx);
  if (uToon < 0.5) c *= 0.55 + 0.6 * l;
  gl_FragColor = vec4(c * tint, 1.0);
}`,$d=Kd+qd+Jd+`
uniform float uToon; uniform sampler2D tRamp; uniform float uRampRows;
uniform sampler2D tMap; uniform vec2 uMapSize; uniform float uTW; uniform float uTD; uniform float uTH; uniform float uHeightTiles;
varying vec3 vN;
vec2 worldXZ(vec2 gp){
  vec2 rh = normalize(uCamR.xz); vec2 fd = -normalize(uCamU.xz); float sp = length(uCamU.xz);
  return rh * (gp.x * uTexel) + fd * (gp.y * uTexel / sp);
}
float typeRaw(vec2 gp){
  vec2 xz = worldXZ(gp);
  vec2 t = floor(vec2(xz.x / uTW + uMapSize.x * 0.5 + 0.5, xz.y / uTD + uMapSize.y * 0.5 + 0.5));
  if (t.x < 0.0 || t.y < 0.0 || t.x >= uMapSize.x || t.y >= uMapSize.y) return 0.0;
  return floor(texture2D(tMap, (t + 0.5) / uMapSize).r * 255.0 + 0.5);
}
float typeAt(vec2 g){
  vec2 n = vec2(vnoise(g / 5.0), vnoise(g / 5.0 + vec2(31.7, 11.3))) - 0.5;
  return typeRaw(g + 0.5 + floor(n * uT * 0.5 + 0.5));
}
float grassP(vec2 g){
  float o = 0.0;
  float big = vnoise(g / vec2(18.0, 14.0));
  if (big > 0.64 || (big > 0.58 && mod(g.x + g.y, 2.0) < 0.5)) o = -1.0;
  vec2 cs = vec2(6.0, 5.0); vec2 cell = floor(g / cs);
  float h = hash(cell);
  vec2 org = cell * cs + floor(vec2(hash(cell + 3.1), hash(cell + 7.7)) * vec2(3.0, 2.0));
  vec2 l = g - org;
  if (h < 0.6) {
    if (l == vec2(1.0, 0.0) || l == vec2(0.0, 1.0) || l == vec2(2.0, 1.0)) o = 1.0;
    else if (l == vec2(1.0, 2.0)) o = -1.0;
  } else if (h < 0.75 && l == vec2(0.0, 0.0)) o = -1.0;
  return o;
}
vec4 flowerP(vec2 g){
  vec2 cs = vec2(7.0, 6.0); vec2 cell = floor(g / cs);
  float h = hash(cell + 11.0);
  if (h > 0.5) return vec4(0.0);
  vec2 org = cell * cs + floor(vec2(hash(cell + 2.3), hash(cell + 5.9)) * vec2(5.0, 4.0)) + 1.0;
  vec2 l = g - org;
  vec3 pc = h < 0.17 ? vec3(0.97, 0.95, 0.90) : (h < 0.34 ? vec3(0.98, 0.83, 0.30) : vec3(0.95, 0.55, 0.72));
  if (l == vec2(0.0)) return uT >= 16.0 ? vec4(0.98, 0.85, 0.35, 1.0) : vec4(pc, 1.0);
  if (uT >= 16.0 && (l == vec2(1.0, 0.0) || l == vec2(-1.0, 0.0) || l == vec2(0.0, 1.0) || l == vec2(0.0, -1.0))) return vec4(pc, 1.0);
  return vec4(0.0);
}
float dirtP(vec2 g){
  float o = 0.0;
  if (vnoise(g / 16.0) > 0.66) o = -1.0;
  float h = hash(g);
  if (h < 0.05) o -= 1.0; else if (h < 0.08) o += 1.0;
  vec2 cs = vec2(9.0, 7.0); vec2 cell = floor(g / cs);
  if (hash(cell + 5.0) < 0.35) {
    vec2 org = cell * cs + floor(vec2(hash(cell + 1.7), hash(cell + 9.3)) * vec2(6.0, 4.0));
    vec2 l = g - org;
    if (l.y == 0.0 && l.x >= 0.0 && l.x <= 1.0) o = 1.0;
    else if (l.y == 1.0 && l.x >= 0.0 && l.x <= 1.0) o = -1.0;
  }
  return o;
}
float sandP(vec2 g){
  float o = 0.0;
  if (hash(g + 3.0) < 0.05) o = -1.0;
  float w = g.y + floor(vnoise(vec2(g.x / 10.0, 3.7)) * 4.0);
  if (mod(w, 7.0) < 0.5 && hash(vec2(floor(g.x / 4.0), floor(w / 7.0))) < 0.6) o = 1.0;
  return o;
}
float cobbleP(vec2 g){
  float row = floor(g.y / 6.0), ly = g.y - row * 6.0;
  float sx = g.x + mod(row, 2.0) * 4.0; float col = floor(sx / 8.0), lx = sx - col * 8.0;
  if (ly > 4.5 || lx > 6.5) return -2.0;
  float o = hash(vec2(col, row)) < 0.3 ? -1.0 : 0.0;
  if (ly < 0.5 || lx < 0.5) o += 1.0;
  return o;
}
float waterP(vec2 g, float tq){
  float o = 0.0;
  if (vnoise(g / 14.0) > 0.6) o = -1.0;
  float wy = floor(g.y / 4.0);
  float sh = floor(tq * 0.5) + floor(hash(vec2(wy, 1.0)) * 30.0);
  if (mod(g.y, 4.0) < 0.5 && mod(g.x + sh + wy * 7.0, 14.0) < 3.0) o = 1.0;
  if (hash(g + vec2(tq * 13.0, tq * 7.0)) < 0.004) o = 2.0;
  return o;
}
void main(){
  vec2 p = uPixOrigin + floor(gl_FragCoord.xy / uPixScale);
  float hPx = uHeightTiles * uT;
  vec2 g = vec2(p.x, -(p.y - hPx) - 1.0);
  float ty = typeAt(g);
  float up = typeAt(g + vec2(0.0, -1.0));
  float dn = typeAt(g + vec2(0.0, 1.0));
  float lf = typeAt(g + vec2(-1.0, 0.0));
  float rt = typeAt(g + vec2(1.0, 0.0));
  float tq = floor(uTime * 6.0);
  float offs = 0.0; vec4 ov = vec4(0.0);
  if (ty < 0.5) offs = grassP(g);
  else if (ty < 1.5) { offs = grassP(g); ov = flowerP(g); }
  else if (ty < 2.5) offs = dirtP(g);
  else if (ty < 3.5) offs = sandP(g);
  else if (ty < 4.5) offs = cobbleP(g);
  else offs = waterP(g, tq);
  bool grassy = ty < 1.5, upGrassy = up < 1.5;
  if (!grassy && ty < 4.5 && upGrassy) offs -= 1.0;
  if (grassy && !upGrassy && up < 4.5) offs += 1.0;
  if (ty > 4.5) {
    if (up < 4.5) offs -= 1.0;
    bool shore = up < 4.5 || dn < 4.5 || lf < 4.5 || rt < 4.5;
    if (shore && hash(g + vec2(tq * 7.0, tq * 3.0)) > 0.5) ov = vec4(0.85, 0.94, 1.0, 1.0);
  }
  vec2 xz = worldXZ(g + 0.5);
  vec3 wpos = vec3(xz.x, uHeightTiles * uTH, xz.y);
  vec3 tint;
  float l = lighting(normalize(vN), vec3(0.0, 1.0, 0.0), wpos, p, tint);
  float idx = clamp((uToon > 0.5 ? 2.0 + bandOf(l) : 3.0) + offs, 0.0, 4.0);
  vec3 c = texture2D(tRamp, vec2((idx + 0.5) / 5.0, (ty + 0.5) / uRampRows)).rgb;
  if (uToon < 0.5) c *= 0.6 + 0.45 * l;
  if (ov.a > 0.5) c = ov.rgb;
  gl_FragColor = vec4(c * tint, 1.0);
}`,ef=Kd+qd+Yd+`
uniform float uId; uniform float uNear; uniform float uFar; uniform float uCardSrc;
varying vec3 vN; varying float vDist; varying vec4 vMapA; varying vec2 vMapB; varying float vKind;
void main(){
  vec3 n = normalize(vN);
  if (uCardSrc > 1.5 && vMapA.x > 1.5) {
    vec2 p = uPixOrigin + floor(gl_FragCoord.xy / uPixScale);
    float fo; vec3 fn;
    if (foliage(p, vec3(vMapA.y, vMapB.x, vMapA.z), vMapA.w, vMapB.y, fo, fn) < 0.5) discard;
    n = fn;
  }
  float id = uId > 0.5 ? uId : (abs(vKind - 1.0) < 0.5 ? 3.0 : 1.0);
  float d = 1.0 - clamp((vDist - uNear) / (uFar - uNear), 0.0, 1.0);
  float d12 = floor(d * 4095.0 + 0.5);
  float hi = floor(d12 / 16.0);
  float lo = d12 - hi * 16.0;
  gl_FragColor = vec4(n.x * 0.5 + 0.5, n.y * 0.5 + 0.5, hi / 255.0, (lo * 16.0 + id) / 255.0);
}`,tf=`void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,nf=`#include <packing>
void main(){ gl_FragColor = packDepthToRGBA(gl_FragCoord.z); }`,rf=Kd+`
uniform vec2 uCenter; uniform vec2 uRad; uniform vec3 uCol;
void main(){
  vec2 p = uPixOrigin + floor(gl_FragCoord.xy / uPixScale) + 0.5;
  vec2 d = (p - uCenter) / uRad;
  if (dot(d, d) > 1.0) discard;
  gl_FragColor = vec4(uCol, 1.0);
}`,af=`
attribute vec3 aAnc; attribute vec2 aCorner; attribute vec4 aSpr; attribute float aKind;
uniform vec3 uCamR; uniform vec3 uCamU; uniform float uTexel;
varying vec2 vTex;
void main(){
  vec2 s = vec2(dot(aAnc, uCamR), dot(aAnc, uCamU)) / uTexel;
  vec2 s0 = floor(s + 0.5);
  vec2 off = (s0 - s) + aCorner * aSpr.zw - vec2(floor(aSpr.z * 0.5), 0.0);
  vec3 w = aAnc + uCamR * (off.x * uTexel) + uCamU * (off.y * uTexel);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  if (aKind > 3.5) gl_Position.z = 0.999 * gl_Position.w;
  vTex = aSpr.xy + aCorner * aSpr.zw;
}`,of=`
uniform sampler2D tAtlas; uniform vec2 uAtlasSize; uniform vec3 uDecalMul;
varying vec2 vTex;
void main(){
  vec4 c = texture2D(tAtlas, (floor(vTex) + 0.5) / uAtlasSize);
  if (c.a < 0.5) discard;
  gl_FragColor = vec4(c.rgb * uDecalMul, 1.0);
}`,sf=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;function cf(e,t={}){let n=Hd(e);return new Tr({uniforms:Rd({uToon:U.uToon,uAlpha:{value:t.alpha||1},uDeep:{value:n[0]},uShadow:{value:n[1]},uBase:{value:n[2]},uLight:{value:n[3]},uMap:{value:t.map||null},uHasMap:{value:+!!t.map},uCardSrc:{value:1},uCardKind:{value:ud.NEAR}},Fd,Id,Ld),vertexShader:Xd,fragmentShader:Zd,side:t.side||0})}var lf=new Map;function uf(e,t=0,n={}){let r=e+`|`+t+`|`+ +!!n.emissive;if(lf.has(r))return lf.get(r);let i=new Tr({uniforms:Rd({uToon:U.uToon,tRamp:U.tRamp,uRampRows:U.uRampRows,uUnwrap:U.uUnwrap,uRow:{value:e},uPattern:{value:t},uEmissive:{value:+!!n.emissive},uCardSrc:{value:2},uCardKind:{value:0}},Fd,Id,Ld),vertexShader:Xd,fragmentShader:Qd});return lf.set(r,i),i}function df(e){return new Tr({uniforms:Rd({uToon:U.uToon,tRamp:U.tRamp,uRampRows:U.uRampRows,tMap:U.tMap,uMapSize:U.uMapSize,uTW:U.uTW,uTD:U.uTD,uTH:U.uTH,uHeightTiles:{value:e},uCardSrc:{value:2},uCardKind:{value:0}},Fd,Id,Ld),vertexShader:Xd,fragmentShader:$d})}function ff(e,t){return new Tr({uniforms:Rd({uId:{value:e},uNear:U.uNear,uFar:U.uFar,uCardSrc:{value:t},uCardKind:{value:ud.NEAR}},Fd,Id),vertexShader:Xd,fragmentShader:ef,side:2})}var pf=ff(0,2),mf=ff(2,1),hf=new Tr({vertexShader:tf,fragmentShader:nf,side:2}),gf=new mo;function _f(){let e=document.createElement(`canvas`);e.width=128,e.height=64;let t=e.getContext(`2d`);for(let e of[34.7,93.3])t.fillStyle=pd.D,t.beginPath(),t.ellipse(e,33,7,10.5,0,0,Vu),t.fill(),t.fillStyle=pd.C,t.beginPath(),t.ellipse(e,37,5,6,0,0,Vu),t.fill(),t.fillStyle=pd.W,t.beginPath(),t.arc(e+2.2,28,2.6,0,Vu),t.fill();let n=new fs(e);return n.minFilter=n.magFilter=me,n.generateMipmaps=!1,n}var vf={skin:cf(15909531,{alpha:.6}),hair:cf(12870189,{side:2}),eye:cf(2760509),tunic:cf(3116938),belt:cf(7029286),pants:cf(3882859),boots:cf(8014379),scarf:cf(14172986),decal:cf(16777215,{map:_f()})};function yf(e,t,n=0,r=0,i=0){let a=new gr(e,t);return a.position.set(n,r,i),a}function bf(e,t=0,n=0,r=0){let i=new ro;return i.position.set(t,n,r),e.add(i),i}var G={};G.root=bf(gf),G.motion=bf(G.root),G.hips=bf(G.motion,0,Yu,0),G.torso=bf(G.hips),G.torso.add(yf(new hs(.22,.29,.52,12),vf.tunic,0,.24,0)),G.torso.add(yf(new hs(.295,.3,.08,12),vf.belt,0,.04,0)),G.torso.add(yf(new hs(.29,.34,.14,12),vf.tunic,0,-.04,0));var xf=yf(new sc(.2,.075,8,16),vf.scarf,0,.5,0);xf.rotation.x=Math.PI/2,G.torso.add(xf),G.tail=bf(G.torso,.1,.5,-.18),G.tail.add(yf(new yr(.13,.42,.05),vf.scarf,0,-.2,0)),G.head=bf(G.torso,0,.56,0),G.head.add(yf(new oc(.44,20,14),vf.skin,0,.36,0));var Sf=yf(new oc(.475,20,10,0,Vu,0,Math.PI*.5),vf.hair,0,.36,0);Sf.rotation.x=-.3,G.head.add(Sf);var Cf=yf(new oc(.45,16,12),vf.hair,0,.27,-.1);Cf.scale.set(1.03,.95,.85),G.head.add(Cf);for(let e of[-.2,0,.2]){let t=yf(new gs(.1,.22,4),vf.hair,e,.46,.42);t.rotation.set(Math.PI,0,e*.8),G.head.add(t)}var wf=yf(new gs(.06,.24,5),vf.hair,.06,.88,.05);wf.rotation.z=-.5,G.head.add(wf),G.eyes3d=bf(G.head);for(let e of[-1,1])G.eyes3d.add(yf(new yr(.075,.14,.05),vf.eye,e*.15,.31,.405));G.decal=yf(new oc(.447,16,10,Math.PI/2-.75,1.5,Math.PI/2-.42,.95),vf.decal,0,.36,0),G.head.add(G.decal),G.headC=bf(G.head,0,.36,0),G.eyeA=[bf(G.head,.15,.33,.41),bf(G.head,-.15,.33,.41)];for(let e of[-1,1]){let t=bf(G.torso,e*.31,.44,0);t.add(yf(new hs(.08,.07,.34,8),vf.tunic,0,-.15,0)),t.add(yf(new oc(.09,10,8),vf.skin,0,-.36,0)),e>0?G.armL=t:G.armR=t;let n=bf(G.hips,e*.13,0,0);n.add(yf(new hs(.095,.085,.4,8),vf.pants,0,-.2,0)),n.add(yf(new yr(.18,.15,.27),vf.boots,0,-.47,.035)),e>0?G.legL=n:G.legR=n}function Tf(e){G.eyes3d.visible=e===`3d`,G.decal.visible=e===`uv`}function Ef(e){let t=Math.sin(Vu*e),n=Math.abs(t),r=.6*t;G.legL.rotation.x=-r,G.legR.rotation.x=r,G.armL.rotation.set(t*.75,0,.1),G.armR.rotation.set(-t*.75,0,-.1),G.hips.position.y=Yu*Math.cos(r)+.005,G.hips.rotation.y=t*.1,G.torso.position.y=0,G.torso.rotation.set(.1,-t*.18,0),G.head.rotation.set(-.06,t*.08,0),G.tail.rotation.set(.75+(1-n)*.25,0,t*.15)}function Df(e){G.legL.rotation.x=0,G.legR.rotation.x=0,G.armL.rotation.set(0,0,.1+e*.03),G.armR.rotation.set(0,0,-.1-e*.03),G.hips.position.y=Yu,G.hips.rotation.y=0,G.torso.position.y=-(.5-.5*e)*.05,G.torso.rotation.set(.02,0,0),G.head.rotation.set(.04*e,0,0),G.tail.rotation.set(.18+e*.05,0,0)}var Of=G.head.children.slice(1,7),kf=Of.map(e=>e.material),Af=Of[0].material,jf=Af.clone();jf.uniforms={...Af.uniforms,uAlpha:{value:.9}};var Mf=Of.map(e=>({p:e.position.clone(),s:e.scale.clone(),r:e.rotation.clone()}));function Nf(){Of.forEach((e,t)=>{e.position.copy(Mf[t].p),e.scale.copy(Mf[t].s),e.rotation.copy(Mf[t].r),e.material=kf[t]})}function Pf(e){if(Nf(),e.browMode===`front-overlay`)for(let e of Of)e.material=jf;if(e.hairStyle!==`eyes-visible`)return;let[t,n,...r]=Of;t.scale.set(.96,.92,.96),t.position.y+=.035,t.position.z-=.025,n.scale.multiplyScalar(.96),n.position.z-=.025;for(let e of r.slice(0,3))e.scale.set(1,.55,.85),e.position.y+=.075,e.position.z-=.025}function Ff(e){let t=e>>>0;return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var If=null,Lf=()=>If?If():Math.random();function Rf(e){If=e===null?null:Ff(e)}var zf=t({expr:()=>K}),K={autoBlink:!0,blinkWait:2.5,seq:[],seqT:0,emote:null};function Bf(e){K.emote={key:e,t:0,dur:vd[e].dur},K.seq=[]}function Vf(){K.emote&&(K.emote.t+=Ku,K.emote.t>=K.emote.dur&&(K.emote=null)),K.seq.length?--K.seqT<=0&&(K.seq.shift(),K.seq.length&&(K.seqT=K.seq[0][1])):K.autoBlink&&!K.emote&&(K.blinkWait-=Ku,K.blinkWait<=0&&(K.seq=[[1,3],[2,4],[1,3]],Lf()<.15&&K.seq.push([0,5],[1,3],[2,4],[1,3]),K.seqT=K.seq[0][1],K.blinkWait=2+Lf()*4))}function Hf(){return K.emote?vd[K.emote.key].eye:K.seq.length?K.seq[0][0]:0}function Uf(e){G.motion.position.set(0,0,0),G.motion.rotation.set(0,0,0);let t=K.emote;if(!t)return;let n=e?Math.floor(t.t*12)/12:t.t,r=Math.max(0,Math.min(1,n/.15,(t.dur-n)/.3)),i=Math.max(0,1-n/.7);switch(vd[t.key].motion){case`hop`:for(let e of[0,.32])n>=e&&n<e+.26&&(G.motion.position.y=.24*Math.sin(Math.PI*(n-e)/.26));G.armL.rotation.z+=.9*r,G.armR.rotation.z-=.9*r;break;case`jolt`:n<.16&&(G.motion.position.y=.14*Math.sin(Math.PI*n/.16)),G.torso.rotation.x-=.3*i,G.head.rotation.x-=.2*i,G.armL.rotation.z+=.5*i,G.armR.rotation.z-=.5*i;break;case`tilt`:G.head.rotation.z+=.32*r,G.torso.rotation.z+=.06*r;break;case`slump`:G.torso.rotation.x+=.3*r,G.head.rotation.x+=.35*r,G.motion.position.y=-.04*r,G.armL.rotation.z-=.08*r,G.armR.rotation.z+=.08*r;break;case`stomp`:if(n<1.1){let e=Math.floor(n/.14),t=n%.14/.14;G.motion.position.y=.07*Math.sin(Math.PI*t),G.motion.rotation.z=(e%2?1:-1)*.06}G.armL.rotation.z+=.35*r,G.armR.rotation.z-=.35*r;break;case`fidget`:G.motion.position.x=.06*Math.sin(n*Vu*3)*r,G.head.rotation.y+=.25*Math.sin(n*Vu*1.5)*r}}function Wf(e){let t=e.length,n=e[0].length,r=[];for(let t=0;t<n;t++)e.some(e=>e[t]!==`.`)&&r.push(t);let i=()=>Array.from({length:t},()=>Array(n).fill(`.`)),a=e=>e.map(e=>e.join(``)),o=i();if(t===1)r.forEach(e=>o[0][e]=`K`);else{let e=t>=3?Math.floor(t*.6):t-1;r.forEach(t=>o[e][t]=`D`)}let s;if(t<=2)s=o.map(e=>e.slice());else{s=e.map(e=>[...e]);let i=Math.ceil(t/2);for(let e=0;e<i;e++)s[e]=Array(n).fill(`.`);r.forEach(e=>s[i-1][e]=`D`)}return[e,a(s),a(o)]}function Gf(e,t){let n=hd[e];if(!n||t<2)return[null,null,null,null];let r=n=>[...Array(t-2).fill(`.`.repeat(e)),...n];return[r(n.angryL),r(n.angryR),r(n.sadL),r(n.sadR)]}var Kf=md[32],qf=null;function Jf(e,t){Kf=md[e];let n=[...Wf(Kf.eye),...Wf(Kf.narrow),...Gf(Kf.w,Kf.h)],r=document.createElement(`canvas`);r.width=Kf.w*10,r.height=Kf.h;let i=r.getContext(`2d`);n.forEach((e,t)=>{e&&e.forEach((e,n)=>[...e].forEach((e,r)=>{pd[e]&&(i.fillStyle=pd[e],i.fillRect(t*Kf.w+r,n,1,1))}))}),qf&&qf.dispose(),qf=new fs(r),qf.minFilter=qf.magFilter=A,qf.generateMipmaps=!1,t.uniforms.tGlyph.value=qf,t.uniforms.uGlyph.value.set(Kf.w,Kf.h)}function Yf(){let e=document.createElement(`canvas`);e.width=9*_d.length,e.height=9;let t=e.getContext(`2d`);_d.forEach((e,n)=>e.rows.forEach((e,r)=>[...e].forEach((e,i)=>{gd[e]&&(t.fillStyle=gd[e],t.fillRect(n*9+i,r,1,1))})));let n=new fs(e);return n.minFilter=n.magFilter=A,n.generateMipmaps=!1,n}var Xf=Zd.slice(Zd.indexOf(`#include <packing>`),Zd.indexOf(`uniform float uToon;`)).replace(`float lighting(`,`float researchLighting(`).replace(`floor(a * lam * 4.0 + bayer2(pix)) / 4.0`,`a * lam`),Zf=`
float highlightFactor(vec3 pos,vec3 nw,vec3 nv,float strength){
 vec3 tint;float light=researchLighting(nv,nw,pos,vec2(0.0),tint);
 return mix(1.0,clamp(light,0.0,1.0),strength);
}`,Qf=Object.fromEntries(Ld.map(e=>[e,U[e]])),$f=G.head.children[0],ep=$f.geometry,tp=$f.material,np=G.head.children.slice(1,7),rp=tp.clone();rp.uniforms={...tp.uniforms,uAlpha:{value:.65}};var ip=0,ap=-1,op=null,sp=!1,cp=``,lp=[],up=[],dp={updates:0};function fp(){ip++}function pp(){return ip}var mp={original:ep},hp=new Tr({uniforms:{...tp.uniforms,uAlpha:{value:.6},tResearchFace:{value:null},uFaceRegion:{value:new N},uFaceOffset:{value:new M},tResearchHighlight:{value:null},uHighlight:{value:new M(1,0)},uSeparateHighlight:{value:0}},vertexShader:tp.vertexShader.replace(`void main(){`,`varying vec3 vFaceLocal;
void main(){
 vFaceLocal=position;`),fragmentShader:tp.fragmentShader.replace(`void main(){`,Xf.slice(Xf.indexOf(`float researchLighting(`))+Zf+`
void main(){`).replace(`void main(){`,`varying vec3 vFaceLocal;
uniform sampler2D tResearchFace;uniform sampler2D tResearchHighlight;uniform vec2 uHighlight;uniform float uSeparateHighlight;uniform vec4 uFaceRegion;uniform vec2 uFaceOffset;
void main(){`).replace(`gl_FragColor = vec4(c * tint, uAlpha);`,`vec2 faceUV=vec2((vFaceLocal.x-uFaceOffset.x)/uFaceRegion.x+0.5,(vFaceLocal.y-uFaceOffset.y)/uFaceRegion.y+0.5);
 if(vFaceLocal.z>0.03 && faceUV.x>=0.0 && faceUV.x<=1.0 && faceUV.y>=0.0 && faceUV.y<=1.0){vec4 ink=texture2D(tResearchFace,faceUV);c=mix(c,ink.rgb,ink.a);}
 vec3 result=c*tint;
 if(uSeparateHighlight>.5 && vFaceLocal.z>0.03 && faceUV.x>=0.0 && faceUV.x<=1.0 && faceUV.y>=0.0 && faceUV.y<=1.0){vec4 hi=texture2D(tResearchHighlight,faceUV);result=mix(result,hi.rgb,hi.a*uHighlight.x*highlightFactor(vWorld,normalize(vWN),normalize(vN),uHighlight.y));}
 gl_FragColor=vec4(result,uAlpha);`)});function gp(e){if(mp[e])return mp[e];if(e===`round`)return mp[e]=new oc(.44,24,18).scale(1.03,.94,1.03);let t=[];for(let e=0;e<=24;e++){let n=-.44+e*.88/24,r=Math.min(.38,Math.sqrt(Math.max(0,.1936-n*n)));t.push(new M(e===0||e===24?0:r,n))}return mp[e]=new rc(t,24)}function _p(e,t,n,r=0,i=1,a=1){if(n.w<=0||n.h<=0||i<=0)return;let o=Math.round(n.x*32),s=Math.round(n.y*24),c=Math.max(1,Math.round(n.w*32)),l=Math.max(1,Math.round(n.h*24)),u=Math.cos(r*Math.PI/180),d=Math.sin(r*Math.PI/180);for(let n=0;n<l;n++)for(let r=0;r<c;r++){let f=((r+.5)/c-.5)/a,p=((n+.5)/l-.5)/a,m=Math.floor((f*u+p*d+.5)*t[0].length),h=t[Math.floor((-f*d+p*u+.5)*t.length)]?.[m];h&&(e.globalAlpha=i,e.fillStyle=h,e.fillRect(o+r,s+n,1,1))}e.globalAlpha=1}function vp(e,t,r,i,a,o=`all`,s=!0,c=!0){let l=document.createElement(`canvas`);l.width=32,l.height=24;let u=l.getContext(`2d`);(o===`all`||o===`extra`)&&_p(u,e.extra,{x:0,y:0,w:1,h:1});for(let r of[`left`,`right`]){let i=e.eyes[r],l={...i.rect},d=t===2,f=t===1;if(d||f){let e=Math.min(i.minHeight,i.rect.h),t=d?e:(i.rect.h+e)/2;l.y=i.rect.y+i.rect.h*i.closeAt-t*i.closeAt,l.h=t}(o===`all`||o===`eye-`+r)&&_p(u,d&&e.blinkMode===`image`?i.closed:i.image,l,0,1,i.imageScale);let p=i.highlight;(s&&(o===`all`||o===`eye-`+r)||o===`highlight-`+r||o===`highlights`)&&p.show&&!(p.hideClosed&&(d||f))&&_p(u,[[n]],{x:l.x+p.x*l.w,y:l.y+p.y*l.h,w:p.w*l.w,h:p.h*l.h},0,p.opacity);let m=e.brows[r],h=m.expressions[a];c&&(o===`all`||o===`brow-`+r)&&(m.neutralVisible||a!==`neutral`)&&_p(u,m.image,{...m.rect,y:m.rect.y+h.dy},r===`left`?h.angle:-h.angle,1,m.imageScale)}return r&&(o===`all`||o===`mouth`)&&_p(u,i?e.mouth.open:e.mouth.image,e.mouth.rect,0,1,e.mouth.imageScale),l}function yp(){let e=D(),t=E.preview,n=e.face,r=JSON.stringify([t.expression,t.mouthOpen,e.highlightOpacity,e.highlightLight,e.browMode]);$f.geometry=gp(e.head.shape),G.head.scale.setScalar(e.head.size);for(let e of np)e.visible=t.hair;if(n.legacy){$f.material=e.browMode===`front-overlay`?rp:tp;return}hp.uniforms.uAlpha.value=e.browMode===`front-overlay`?.65:.6,(op!==n||ap!==ip||sp!==e.mouth||cp!==r)&&(lp.forEach(e=>e.dispose()),up.forEach(e=>e.dispose()),up=[0,1,2].map(e=>{let r=new fs(vp(n,e,!1,!1,t.expression,`highlights`));return r.minFilter=r.magFilter=A,r.generateMipmaps=!1,r}),lp=[0,1,2].map(r=>{let i=new fs(vp(n,r,e.mouth,t.mouthOpen,t.expression,`all`,e.highlightLight===0&&e.highlightOpacity===1,e.browMode===`original`));return i.minFilter=i.magFilter=A,i.generateMipmaps=!1,i}),dp.updates++,op=n,ap=ip,sp=e.mouth,cp=r);let i=t.eyes===`closed`?2:t.eyes===`open`||!t.blink?0:Hf();hp.uniforms.uSeparateHighlight.value=+(e.highlightLight>0||e.highlightOpacity!==1),hp.uniforms.uHighlight.value.set(e.highlightOpacity,e.highlightLight),hp.uniforms.tResearchHighlight.value=up[Math.min(2,i)],hp.uniforms.tResearchFace.value=lp[Math.min(2,i)],hp.uniforms.uFaceRegion.value.set(.88*n.region.width,.88*n.region.height,0,0),hp.uniforms.uFaceOffset.value.set(.88*n.region.x,.88*n.region.y),$f.material=hp}function bp(){$f.geometry=ep,$f.material=tp,G.head.scale.setScalar(1);for(let e of np)e.visible=!0}var xp=l(),Sp=[`left`,`right`],Cp=Array.from({length:6},()=>new N),wp=Array.from({length:2},()=>new P),Tp={uResearchHighlight:{value:0},uHighlight:{value:new M(1,0)},uBrowFrontOnly:{value:0},uBrowOverlay:{value:0},uResearchEyeWorld:{value:[new P,new P]},uResearchEyeNormal:{value:new P},uResearchEyeViewNormal:{value:new P},uResearchStamp:{value:0},tResearchStamp:{value:null},uResearchRects:{value:Cp},uResearchOriginalEyes:{value:wp}},Ep=null,Dp=-1,Op=!1,kp=``,Ap=[],jp=[!1,!1],Mp={updates:0},Np=new P,Pp=new P,Fp=new P;function Ip(e,t){let n=document.createElement(`canvas`);n.width=256,n.height=24;let r=n.getContext(`2d`);return r.imageSmoothingEnabled=!1,[`eye-left`,`eye-right`,`brow-left`,`brow-right`,`mouth`,`extra`,`highlight-left`,`highlight-right`].forEach((n,i)=>{let a=i>=6?e.eyes[Sp[i-6]].rect:i<2?e.eyes[Sp[i]].rect:i<4?{...e.brows[Sp[i-2]].rect,y:e.brows[Sp[i-2]].rect.y+e.brows[Sp[i-2]].expressions[E.preview.expression].dy}:i===4?e.mouth.rect:{x:0,y:0,w:1,h:1},o=vp(e,t,D().mouth,E.preview.mouthOpen,E.preview.expression,n,D().highlightLight===0&&D().highlightOpacity===1);r.drawImage(o,Math.round(a.x*32),Math.round(a.y*24),Math.max(1,Math.round(a.w*32)),Math.max(1,Math.round(a.h*24)),i*32,0,32,24)}),n}function Lp(e){if(Tp.uResearchStamp.value!==0){for(let t of Cp)t.multiplyScalar(e);for(let t of wp)t.x*=e,t.y*=e}}function Rp(e,t,n,r){if(Tp.uResearchStamp.value=0,!E.active||E.baseline||!D().face.legacy&&D().browMode===`original`)return;let i=D().face,a=E.preview,o=JSON.stringify([a.expression,a.mouthOpen,D().highlightOpacity,D().highlightLight,D().browMode]);if(Ep!==i||Dp!==pp()||Op!==D().mouth||kp!==o){Ap.forEach(e=>e.dispose()),Ap=[0,1,2].map(e=>{let t=new fs(Ip(i,e));return t.minFilter=t.magFilter=A,t.generateMipmaps=!1,t}),Ep=i,Dp=pp(),Op=D().mouth,kp=o,Mp.updates++;for(let e=0;e<2;e++)jp[e]=JSON.stringify(i.eyes[Sp[e]])===JSON.stringify(xp.eyes[Sp[e]])}let s=a.eyes===`closed`?2:a.eyes===`open`||!a.blink?0:Hf();Tp.tResearchStamp.value=Ap[s],Tp.uResearchStamp.value=i.legacy?1:2;let c=D();Tp.uResearchHighlight.value=+(c.highlightLight>0||c.highlightOpacity!==1),Tp.uHighlight.value.set(c.highlightOpacity,c.highlightLight),Tp.uBrowFrontOnly.value=+(c.browMode===`front-overlay`),Tp.uBrowOverlay.value=c.browMode===`front-overlay`?ne(G.root.rotation.y):0,G.eyeA.forEach((e,t)=>e.getWorldPosition(Tp.uResearchEyeWorld.value[t])),Tp.uResearchEyeNormal.value.set(0,0,1).transformDirection(G.head.matrixWorld),Tp.uResearchEyeViewNormal.value.copy(Tp.uResearchEyeNormal.value).transformDirection(e.matrixWorldInverse);function l(r,i,a){return Pp.copy(r),G.head.localToWorld(Pp),Pp.project(e),Fp.copy(r).add(Np.set(i,a,0)),G.head.localToWorld(Fp),Fp.project(e),[(Fp.x-Pp.x)*t/2,(Fp.y-Pp.y)*n/2]}function u(e,t,n,r,a,o,s){if(r.z<0){Cp[e].set(0,0,0,0);return}let c=i.region.width/xp.region.width,u=i.region.height/xp.region.height,d=t.x+t.w/2,f=t.y+t.h/2,p=n.x+n.w/2,m=n.y+n.h/2,h=l(a,.88*(i.region.x+(d-.5)*i.region.width-(p-.5)*xp.region.width),.88*(i.region.y-(f-.5)*i.region.height+(m-.5)*xp.region.height)),g=Math.max(1,Math.round(o*t.w/n.w*c)),_=Math.max(1,Math.round(s*t.h/n.h*u));Cp[e].set(Math.round(r.x+h[0]+o/2-g/2),Math.round(r.y+h[1]+s/2-_/2),g,_)}for(let e=0;e<2;e++){let t=Sp[e],n=i.eyes[t],o=r[e?`uEye1`:`uEye0`].value;u(e,n.rect,xp.eyes[t].rect,o,G.eyeA[e].position,Kf.w,Kf.h);let l=jp[e]&&(i.blinkMode===`image`||s===0);wp[e].set(o.x,o.y,l?o.z:-1),wp[e].x=Cp[e].x,wp[e].y=Cp[e].y,(Cp[e].z!==Kf.w||Cp[e].w!==Kf.h)&&(wp[e].z=-1);let d=o.clone();d.y+=Kf.h+1,u(e+2,{...i.brows[t].rect,y:i.brows[t].rect.y+i.brows[t].expressions[a.expression].dy+(c.browMode===`front-overlay`?c.browGap:0)},xp.brows[t].rect,d,G.eyeA[e].position,Kf.w,2)}let d=new P(r.uMouth.value.x,r.uMouth.value.y,r.uMouth.value.z>0?0:-1);u(4,i.mouth.rect,xp.mouth.rect,d,new P(0,.18,.43),2,3);let f=r.uEye0.value,p=r.uEye1.value,m=f.z>=0?f:p,h=f.z>=0?xp.eyes.left.rect:xp.eyes.right.rect,g={x:0,y:0,w:1,h:1};u(5,g,g,new P(m.x+Kf.w/2-(h.x+h.w/2)*16,m.y+Kf.h/2-(1-h.y-h.h/2)*12,m.z),G.eyeA[f.z>=0?0:1].position,16,12),r.uStamp.value=0,r.uMouth.value.set(0,0,0,0)}var zp={"color-vertical":{label:`色比較：縦移動`,start:[0,2.5],inputs:[{seconds:2,x:0,y:-1},{seconds:2,x:0,y:1}],study:!0},"color-diagonal":{label:`色比較：斜め移動`,start:[0,2.5],inputs:[{seconds:2,x:1,y:1},{seconds:2,x:-1,y:-1}],study:!0},"color-horizontal":{label:`色比較：横移動`,start:[0,2.5],inputs:[{seconds:2,x:1,y:0},{seconds:2,x:-1,y:0}],study:!0},"color-walk":{label:`色比較：位置固定の歩行`,start:[0,2.5],inputs:[{seconds:4,x:0,y:1}],study:!0,stationary:!0},"color-trees":{label:`色比較：木との重なり`,start:[11,-13],inputs:[{seconds:2,x:1,y:0},{seconds:2,x:-1,y:0}],study:!0},still:{label:`静止`,start:[0,2.5],inputs:[{seconds:6,x:0,y:0}]},horizontal:{label:`横移動`,start:[0,2.5],inputs:[{seconds:2,x:1,y:0},{seconds:2,x:-1,y:0},{seconds:2,x:0,y:0}]},vertical:{label:`縦移動`,start:[0,2.5],inputs:[{seconds:2,x:0,y:-1},{seconds:2,x:0,y:1},{seconds:2,x:0,y:0}]},diagonal:{label:`斜め移動`,start:[0,2.5],inputs:[{seconds:2,x:1,y:1},{seconds:2,x:-1,y:-1},{seconds:2,x:0,y:0}]},wall:{label:`壁際`,start:[-7.5,-4.9],inputs:[{seconds:2,x:0,y:-1},{seconds:2,x:1,y:-1},{seconds:2,x:0,y:0}]},trees:{label:`木の重なり`,start:[13,-10],inputs:[{seconds:2,x:1,y:0},{seconds:2,x:-1,y:-1},{seconds:2,x:0,y:0}]}};function Bp(e,t,n){let r=0;for(let i of e)if(r+=Math.round(i.seconds/n),t<r){let e=Math.hypot(i.x,i.y);return{x:i.x/Math.max(1,e),y:i.y/Math.max(1,e),len:Math.min(1,e)}}return{x:0,y:0,len:0}}function Vp(e){let t=JSON.parse(e);if(!Array.isArray(t)||t.length<1||t.length>1e3)throw Error(`入力列は1〜1000区間にしてください`);let n=0;for(let e of t){if(!e||![e.seconds,e.x,e.y].every(Number.isFinite)||e.seconds<=0||Math.abs(e.x)>1||Math.abs(e.y)>1)throw Error(`secondsは正数、xとyは−1〜1にしてください`);n+=e.seconds}if(n>600)throw Error(`入力列は合計600秒以内にしてください`);return t.map(({seconds:e,x:t,y:n})=>({seconds:e,x:t,y:n}))}var Hp=class{step;ticks=0;paused=!0;acc=0;constructor(e){this.step=e}reset(){this.ticks=0,this.acc=0,this.paused=!0}pause(){this.paused=!0,this.acc=0}advance(e,t){if(this.paused)return 0;this.acc+=Math.min(.1,Math.max(0,e));let n=0;for(;this.acc+1e-12>=this.step&&n<6;)this.single(t),this.acc-=this.step,n++;return n===6&&(this.acc=0),n}single(e){e(this.ticks++)}get seconds(){return this.ticks*this.step}},Up=new Uint8Array(3840),Wp=(e,t)=>e<0||t<0||e>=40||t>=24?wd.grass:Up[(t*40+e)*4],Gp=(e,t,n)=>{e>=0&&t>=0&&e<40&&t<24&&(Up[(t*40+e)*4]=n)},Kp=e=>Math.floor(e/ed+20+.5),qp=e=>Math.floor(e/td+12+.5);function Jp(e){return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Yp=Jp(11),Xp=[{x:-7.5,z:-7,wall:W.brick,wp:Cd.brick,roof:W.roofR},{x:7.5,z:-7,wall:W.plank,wp:Cd.plankH,roof:W.roofB},{x:-8,z:7,wall:W.stoneW,wp:Cd.stone,roof:W.roofG}];function Zp(){Up.fill(0);for(let e=0;e<40;e++)Gp(e,12,wd.dirt);for(let e=0;e<24;e++)Gp(20,e,wd.dirt);for(let e=17;e<=23;e++)for(let t=11;t<=13;t++)Gp(e,t,wd.cobble);for(let e=0;e<40;e++)for(let t=0;t<24;t++){let n=((e+.5-28.5)/3.4)**2+((t+.5-17.5)/2.3)**2;n<1?Gp(e,t,wd.water):n<1.7&&Wp(e,t)===wd.grass&&Gp(e,t,wd.sand)}for(let e=0;e<40;e++)for(let t=0;t<24;t++)Wp(e,t)===wd.grass&&Yp()<.1&&Gp(e,t,wd.meadow);[[8,15],[9,15],[8,16],[31,7],[32,7],[31,8],[12,19],[13,19],[24,3],[25,3]].forEach(([e,t])=>{Wp(e,t)===wd.grass&&Gp(e,t,wd.meadow)}),Xp.forEach(e=>{let t=Kp(e.x-.8),n=qp(e.z+1.7);if(e.z<0)for(let e=n;e<=11;e++)Gp(t,e,wd.dirt);else Gp(t,n,wd.dirt),Gp(t,n+1,wd.dirt)});let e=new Nr(Up,40,24,Ce);e.minFilter=e.magFilter=A,e.needsUpdate=!0,U.tMap.value?.dispose(),U.tMap.value=e}Zp();var Qp=new mo,$p={circles:[],rects:[]},em=(e,t,n,r)=>$p.rects.push({x0:e,z0:t,x1:n,z1:r}),tm=(e,t,n)=>$p.circles.push({x:e,z:t,r:n}),nm=[],rm={box:new yr(1,1,1),cyl:new hs(1,1,1,16),sph:new oc(1,14,10),dod:new vs(1,0),plane:new zr(1,1).rotateX(-Math.PI/2),circle:new ms(1,24).rotateX(-Math.PI/2)};function im(e,t,n){let r=new _l;r.moveTo(-e/2,0),r.lineTo(e/2,0),r.lineTo(0,t),r.closePath();let i=new ec(r,{depth:n,bevelEnabled:!1});return i.translate(0,0,-n/2),i.rotateY(Math.PI/2),i}var am=im(3.9,1.5,4.4),om=im(1.5,.6,1.7),sm=(e,t,n)=>({mode:0,o:[e,t,n]}),cm=(e,t,n,r,i=-1)=>({mode:1,cx:e,cz:t,r:n,top:r,extra:i}),lm=(e,t,n,r,i)=>({mode:2,cx:e,cz:n,r,top:t,extra:i}),um=sm(0,0,0),dm=new Map,fm=new hn;function pm(e,t,n,r,i,a={}){let o=a.s||[1,1,1];fm.position.set(n,r,i),fm.rotation.set(0,a.ry||0,0),fm.scale.set(o[0],o[1],o[2]),fm.updateMatrix();let s=e.clone().applyMatrix4(fm.matrix);s.index&&(s=s.toNonIndexed());let c=s.attributes.position.count,l=a.map||um,u=l.mode===0?[0,l.o[0],l.o[1],l.o[2]]:[l.mode,l.cx,l.cz,l.r],d=l.mode===0?[0,-1]:[l.top,l.extra],f=a.foot||[n,i,0,0],p=a.card||0,m=new Float32Array(c*4),h=new Float32Array(c*2),g=new Float32Array(c),_=new Float32Array(c*4);for(let e=0;e<c;e++)m.set(u,e*4),h.set(d,e*2),g[e]=p,_.set(f,e*4);s.setAttribute(`aMapA`,new L(m,4)),s.setAttribute(`aMapB`,new L(h,2)),s.setAttribute(`aCard`,new L(g,1)),s.setAttribute(`aFoot`,new L(_,4)),dm.has(t)||dm.set(t,[]),dm.get(t).push(s)}function mm(e){let t=Object.keys(e[0].attributes).filter(t=>e.every(e=>e.attributes[t])),n=e.reduce((e,t)=>e+t.attributes.position.count,0),r=new z;return t.forEach(t=>{let i=e[0].attributes[t].itemSize,a=new Float32Array(n*i),o=0;e.forEach(e=>{a.set(e.attributes[t].array,o),o+=e.attributes[t].array.length}),r.setAttribute(t,new L(a,i))}),r}function hm(e){let{x:t,z:n}=e,r=nd*1.5,i=[t,n,1.875,1.6],a={card:ud.FAR,foot:i};pm(rm.box,uf(e.wall,e.wp),t,r/2,n,{...a,s:[3.75,r,3.2],map:sm(t-1.875,r,n+1.6)}),pm(am,uf(e.roof,Cd.shingle),t,r,n,{map:sm(t-2.2,r+1.5,n)}),pm(rm.box,uf(W.wood,Cd.plankV),t-.8,.8,n+1.62,{...a,s:[.9,1.6,.12],map:sm(t-1.25,1.6,n+1.68)}),pm(rm.box,uf(W.window),t+.9,1.35,n+1.62,{...a,s:[.75,.6,.08]}),pm(rm.box,uf(W.wood),t+.9,1,n+1.66,{...a,s:[.9,.1,.14]}),pm(rm.box,uf(W.brick,Cd.brick),t+1.1,r+.9,n-.5,{s:[.45,1.1,.45],map:sm(t+.875,r+1.45,n-.275)}),em(t-1.875,n-1.6,t+1.875,n+1.6)}function gm(e,t,n=1,r=0,i=!0){let a=[e,t,.2*n,-1];pm(rm.cyl,uf(W.trunk,Cd.bark),e,r+.65*n,t,{card:ud.NEAR,foot:a,s:[.2*n,1.3*n,.2*n],map:cm(e,t,.2*n,r+1.3*n)});let o=[[0,1.85,0,.95]];Yp()<.6&&o.push([(Yp()<.5?-1:1)*.55,1.55+Yp()*.3,.15,.62]),Yp()<.5&&o.push([(Yp()-.5)*.4,2.55,-.1,.55]),o.forEach(([i,o,s,c])=>{let l=c*n,u=e+i*n,d=r+o*n,f=t+s*n,p=l+.5;pm(rm.sph,uf(W.leaf),u,d,f,{card:ud.NEAR,foot:a,s:[p,p*.85,p],map:lm(u,d,f,l,Math.floor(Yp()*97))})}),i&&tm(e,t,.25*n)}function _m(e,t,n=1){let r=.55*n,i=r+.5,a=.42*n;pm(rm.sph,uf(W.bush),e,a,t,{card:ud.NEAR,foot:[e,t,r,-1],s:[i,i*.8,i],map:lm(e,a,t,r,Math.floor(Yp()*97))}),tm(e,t,.5*n)}function vm(e,t,n){pm(rm.dod,uf(W.rock),e,n*.35,t,{card:ud.NEAR,foot:[e,t,n,-1],ry:Yp()*Vu,s:[n,n*.75,n]}),tm(e,t,n*.9)}function ym(e,t){let n={card:ud.NEAR,foot:[e,t,.75,-1]};pm(rm.cyl,uf(W.stoneW,Cd.stone),e,.4,t,{...n,s:[.75,.8,.75],map:cm(e,t,.75,.8)}),pm(rm.circle,uf(W.waterW),e,.805,t,{...n,s:[.55,1,.55]}),pm(rm.box,uf(W.wood),e-.62,1.3,t,{...n,s:[.12,1.8,.12]}),pm(rm.box,uf(W.wood),e+.62,1.3,t,{...n,s:[.12,1.8,.12]}),pm(om,uf(W.roofR,Cd.shingle),e,2.15,t,{...n,map:sm(e-.85,2.75,t)}),tm(e,t,.85)}function bm(e,t){let n={card:ud.NEAR,foot:[e,t,.34,-1]};pm(rm.cyl,uf(W.barrel,Cd.plankV),e,.42,t,{...n,s:[.34,.84,.34],map:cm(e,t,.34,.84)}),pm(rm.cyl,uf(W.metal),e,.2,t,{...n,s:[.355,.07,.355]}),pm(rm.cyl,uf(W.metal),e,.64,t,{...n,s:[.355,.07,.355]}),tm(e,t,.38)}function xm(e,t){pm(rm.box,uf(W.barrel,Cd.plankH),e,.35,t,{card:ud.NEAR,foot:[e,t,.35,.35],s:[.7,.7,.7],map:sm(e-.35,.7,t+.35)}),em(e-.35,t-.35,e+.35,t+.35)}function Sm(e,t,n){let r={card:ud.NEAR,foot:[(e+t)/2,n,(t-e)/2,.06]};for(let i=e;i<=t+.01;i+=1)pm(rm.box,uf(W.wood),i,.35,n,{...r,s:[.12,.7,.12]});pm(rm.box,uf(W.wood),(e+t)/2,.5,n,{...r,s:[t-e,.07,.06]}),pm(rm.box,uf(W.wood),(e+t)/2,.25,n,{...r,s:[t-e,.07,.06]}),em(e-.1,n-.12,t+.1,n+.12)}function Cm(e,t){let n={card:ud.NEAR,foot:[e,t,.1,-1]};pm(rm.box,uf(W.wood),e,.5,t,{...n,s:[.1,1,.1]}),pm(rm.box,uf(W.wood,Cd.plankH),e,.95,t+.02,{...n,s:[.8,.4,.08],map:sm(e-.4,1.15,t+.06)}),tm(e,t,.2)}function wm(e,t){let n={card:ud.NEAR,foot:[e,t,.1,-1]};pm(rm.cyl,uf(W.metal),e,1,t,{...n,s:[.06,2,.06]}),pm(rm.box,uf(W.lantern,0,{emissive:!0}),e,2.12,t,{...n,s:[.26,.3,.26]}),pm(rm.box,uf(W.metal),e,2.31,t,{...n,s:[.34,.06,.34]}),tm(e,t,.15),nm.push([e,2.1,t])}var Tm=df(0),Em=df(1);function Dm(e,t,n,r){let i=(e-20.5)*ed,a=(n+1-20.5)*ed,o=(t-12.5)*td,s=(r+1-12.5)*td,c=(i+a)/2,l=(o+s)/2,u=a-i,d=s-o;pm(rm.box,uf(W.cliff,Cd.stone),c,nd/2,l,{s:[u,nd,d],map:sm(i,nd,s)}),pm(rm.plane,Em,c,nd+.002,l,{s:[u,1,d]});for(let e=i+.6;e<a;e+=1.4+Yp())pm(rm.dod,uf(W.cliff),e,.3,s+.15,{card:ud.NEAR,foot:[e,s+.15,.5,-1],ry:Yp()*Vu,s:[.5,.45,.4]});return em(i,o,a,s+.4),{x0:i,x1:a,z0:o,z1:s}}function Om(){pm(rm.plane,Tm,0,0,0,{card:ud.GROUND,s:[140,1,140]}),Xp.forEach(hm),ym(3.1,-2.2),Cm(-1.9,2.4),bm(10.6,-5.4),bm(11.3,-4.8),bm(-10.4,-5.3),xm(-11.2,-4.3),Sm(4.5,14.5,18.6),[[-3.8,2.9],[3.8,2.9],[-6.4,-4.7],[8.9,-4.7],[-6,9.3]].forEach(([e,t])=>wm(e,t));let e=Dm(4,3,11,6);gm(e.x0+2,e.z0+2,1,nd,!1),gm(e.x0+5.5,e.z0+3.2,.9,nd,!1),gm(e.x0+8,e.z0+1.6,.8,nd,!1),[[-13,-10],[13,-11.5],[15,3.5],[-15,10.5],[-3.5,14],[3,16.5],[-16.5,-3.5],[17,-3.5],[-11,16.5],[17.5,13]].forEach(([e,t])=>gm(e,t,.85+Yp()*.4));for(let e=0;e<280;e++){let e=(Yp()-.5)*70,t=(Yp()-.5)*70;(Math.abs(e)>22.5||Math.abs(t)>21.8)&&gm(e,t,.8+Yp()*.5)}[[-4.4,-6.2],[10.2,-8.6],[-5,9.6],[-10.6,8.6]].forEach(([e,t])=>_m(e,t,.9+Yp()*.3)),[[11,-11,.6],[-11,12,.5],[4.5,-12,.55],[-3,-16,.45],[17,8,.6],[-17,4,.5]].forEach(([e,t,n])=>vm(e,t,n)),dm.forEach((e,t)=>{let n=new gr(mm(e),t);n.frustumCulled=!1,Qp.add(n),e.forEach(e=>e.dispose())}),dm.clear()}Om();var km=11;function Am(e){if(km!==e){km=e,Yp=Jp(e);for(let e of[...Qp.children])e.geometry.dispose(),Qp.remove(e);$p.circles.length=0,$p.rects.length=0,nm.length=0,Zp(),Om()}}var jm=[[0,0],[.8,0],[-.8,0],[0,.8],[0,-.8]];function Mm(e,t){if(Math.abs(e)>21||Math.abs(t)>21)return!0;for(let[n,r]of jm)if(Wp(Kp(e+n*.3),qp(t+r*.3))===wd.water)return!0;for(let n of $p.circles){let r=e-n.x,i=t-n.z,a=n.r+Xu;if(r*r+i*i<a*a)return!0}for(let n of $p.rects)if(e>n.x0-.3&&e<n.x1+.3&&t>n.z0-.3&&t<n.z1+.3)return!0;return!1}var q={gx:0,gy:0};function Nm(e,t){let n=Td();q.gx=Math.round(e/n),q.gy=Math.round(t*Wu/n)}Nm(0,2.5);var Pm=document.getElementById(`stage`),J=new lo({antialias:!1,alpha:!1,powerPreference:`high-performance`});J.setPixelRatio(1),J.autoClear=!1;var Fm=J.domElement;Fm.id=`view`,Pm.prepend(Fm);var Im=new Set,Lm={ArrowUp:`u`,KeyW:`u`,ArrowDown:`d`,KeyS:`d`,ArrowLeft:`l`,KeyA:`l`,ArrowRight:`r`,KeyD:`r`};addEventListener(`keydown`,e=>{e.target?.closest(`input, textarea, select`)||Lm[e.code]&&(Im.add(Lm[e.code]),e.preventDefault())}),addEventListener(`keyup`,e=>{Lm[e.code]&&Im.delete(Lm[e.code])}),addEventListener(`blur`,()=>Im.clear());var Rm=document.getElementById(`joy`),zm=document.getElementById(`knob`),Bm=document.getElementById(`hint`),Vm=null;Pm.addEventListener(`pointerdown`,e=>{Pm.setPointerCapture(e.pointerId);let t=Pm.getBoundingClientRect();Vm={id:e.pointerId,ox:e.clientX,oy:e.clientY,x:0,y:0},Rm.style.left=e.clientX-t.left+`px`,Rm.style.top=e.clientY-t.top+`px`,Rm.style.display=`block`,zm.style.transform=``,Bm.style.opacity=`0`}),Pm.addEventListener(`pointermove`,e=>{if(!Vm||e.pointerId!==Vm.id)return;let t=(e.clientX-Vm.ox)/40,n=(e.clientY-Vm.oy)/40,r=Math.hypot(t,n);r>1&&(t/=r,n/=r),Vm.x=t,Vm.y=n,zm.style.transform=`translate(${t*30}px,${n*30}px)`});var Hm=e=>{Vm&&e.pointerId===Vm.id&&(Vm=null,Rm.style.display=`none`)};Pm.addEventListener(`pointerup`,Hm),Pm.addEventListener(`pointercancel`,Hm);var Um=-1e9,Wm=null;function Gm(e){Wm=e}function Km(){Im.clear(),Vm=null,Rm.style.display=`none`,Um=-1e9,Object.assign(Ym,{i:1,wait:0,stuck:0})}function qm(e){if(Wm)return Wm;let t=0,n=0;Im.has(`l`)&&--t,Im.has(`r`)&&(t+=1),Im.has(`u`)&&--n,Im.has(`d`)&&(n+=1),Vm&&(t+=Vm.x,n+=Vm.y);let r=Math.hypot(t,n);return r>1&&(t/=r,n/=r,r=1),r>.3&&(Um=e,Bm.style.opacity=`0`),{x:t,y:n,len:r}}var Jm=[[0,2.5,0],[0,-12,0],[-4,-4,0],[-14,0,1],[14,0,0],[4,9,1],[0,0,0]],Ym={i:1,wait:0,stuck:0},Xm=Object.keys(vd);function Zm(){if(Ym.wait>0)return Ym.wait-=Ku,{x:0,y:0,len:0};let e=Td(),t=q.gx*e,n=q.gy*e/Wu,[r,i]=Jm[Ym.i],a=r-t,o=i-n;if(Math.hypot(a,o)<.3||Ym.stuck>1.5)return Jm[Ym.i][2]&&(Ym.wait=2.2,Bf(Xm[Math.floor(Lf()*Xm.length)])),Ym.i=(Ym.i+1)%Jm.length,Ym.stuck=0,{x:0,y:0,len:0};let s=a,c=o*Wu,l=Math.hypot(s,c);return{x:s/l,y:c/l,len:1}}var Qm=0,$m=0,eh=!1,th=!1,nh=0,rh=0,ih=0,ah=0,oh=0,sh=0;function ch(e,t,n){return e+(((t-e+Math.PI)%Vu+Vu)%Vu-Math.PI)*n}function lh(e,t){return Math.abs(((e-t+Math.PI)%Vu+Vu)%Vu-Math.PI)}function uh(e){let t=(Math.round(e/(Vu/8))%8+8)%8;return th?(sh++,t!==oh&&sh>=8&&lh(e,oh*Vu/8)>ad&&(oh=t,sh=0),oh):(oh=t,sh=0,t)}function dh(e,t){let n=Td();return!Mm(e*n,t*n/Wu)}function fh(e,t){if(dh(q.gx+e,q.gy+t))return q.gx+=e,q.gy+=t,!0;if(e&&t){if(dh(q.gx+e,q.gy))return q.gx+=e,!0;if(dh(q.gx,q.gy+t))return q.gy+=t,!0}return!1}function ph(e,t){return dh(q.gx+e,q.gy+t)?(q.gx+=e,q.gy+=t,!0):dh(q.gx+e,q.gy)?(q.gx+=e,!0):dh(q.gx,q.gy+t)?(q.gy+=t,!0):!1}function mh(e){H.f4&&(q.gx=Math.round(q.gx),q.gy=Math.round(q.gy));let t=qm(e),n=t.len<.3&&H.auto&&e-Um>3e3;n&&(t=Zm()),eh=t.len>.3;let r=Ju/Td();if(eh){let e=Math.atan2(t.x,t.y),i=uh(e);rh=i*Vu/8,nh=ch(nh,e,1-Math.exp(-Ku*12));let a=!0;if(H.f4){let e=id[i],t=e[0]&&e[1];for(ih+=r*Ku*(t?Math.SQRT1_2:1);ih>=1;)if(--ih,!fh(e[0],e[1])){a=!1,ih=0;break}}else a=ph(t.x*r*Ku,t.y*r*Ku);n&&(Ym.stuck=a?0:Ym.stuck+Ku),Qm=(Qm+Ku/qu)%1,$m=0}else $m+=Ku,Qm=0,ih=0;th=eh,Vf(),ah+=Ku}function hh(e){eh?Ef(e?Math.floor(Qm*4)/4:Qm):Df(e?Math.floor($m/.6)%2?1:-1:Math.sin($m*Vu/1.2)),Uf(e)}function gh(){Qm=$m=nh=rh=ih=ah=oh=sh=0,eh=th=!1}var _h=new mo,vh=(function(){let e={},t=0,n=0;Object.entries(bd).forEach(([r,i])=>{e[r]={x:t,w:i[0].length,h:i.length},t+=i[0].length+1,n=Math.max(n,i.length)});let r=document.createElement(`canvas`);r.width=t,r.height=n;let i=r.getContext(`2d`);Object.entries(bd).forEach(([t,r])=>r.forEach((a,o)=>[...a].forEach((a,s)=>{yd[a]&&(i.fillStyle=yd[a],i.fillRect(e[t].x+s,n-r.length+o,1,1))})));let a=new fs(r);a.minFilter=a.magFilter=A,a.generateMipmaps=!1;let o=[[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]],s=xd.length*6,c=new Float32Array(s*3),l=new Float32Array(s*3),u=new Float32Array(s*2),d=new Float32Array(s*4),f=new Float32Array(s);xd.forEach(([t,n,r,i,a],s)=>o.forEach((o,c)=>{let p=s*6+c;l.set([n,r,i],p*3),u.set(o,p*2),d.set([e[t].x,0,e[t].w,e[t].h],p*4),f[p]=a}));let p=new z;p.setAttribute(`position`,new L(c,3)),p.setAttribute(`aAnc`,new L(l,3)),p.setAttribute(`aCorner`,new L(u,2)),p.setAttribute(`aSpr`,new L(d,4)),p.setAttribute(`aKind`,new L(f,1));let m=new Tr({uniforms:{uCamR:U.uCamR,uCamU:U.uCamU,uTexel:U.uTexel,tAtlas:{value:a},uAtlasSize:{value:new M(t,n)},uDecalMul:{value:Pd(1,1,1)}},vertexShader:af,fragmentShader:of,depthWrite:!1,depthTest:!0}),h=new gr(p,m);return h.frustumCulled=!1,_h.add(h),m})(),yh=new mo,bh=new Tr({uniforms:Rd({uCenter:{value:new M},uRad:{value:new M(5,2)},uCol:{value:Pd(.55,.58,.72)},uCardSrc:{value:0},uCardKind:{value:0}},Fd,Id),vertexShader:Xd,fragmentShader:rf,transparent:!0,depthWrite:!1,depthTest:!0,blending:5,blendEquation:100,blendSrc:208,blendDst:200,blendSrcAlpha:200,blendDstAlpha:201}),xh=new gr(new zr(2.4,2.4).rotateX(-Math.PI/2),bh);xh.frustumCulled=!1,yh.add(xh);var Sh=new dt(ld,ld,{minFilter:A,magFilter:A,format:Ce,depthBuffer:!0,generateMipmaps:!1});U.tShadow.value=Sh.texture;var Ch=new jl(-24,24,24,-24,40,120),wh=new F().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),Th=Pd(),Eh=Pd(),Dh=Pd();function Oh(e,t){Ch.position.copy(U.uSunDirW.value).multiplyScalar(80),Ch.lookAt(0,0,0),Ch.updateMatrixWorld();let n=Ch.matrixWorld.elements;Th.set(n[0],n[1],n[2]),Eh.set(n[4],n[5],n[6]),Dh.set(e,0,t);let r=48/ld;Ch.translateX(Math.round(Dh.dot(Th)/r)*r),Ch.translateY(Math.round(Dh.dot(Eh)/r)*r),Ch.updateMatrixWorld(),J.setRenderTarget(Sh),J.setClearColor(16777215,1),J.clear(),Qp.overrideMaterial=hf,J.render(Qp,Ch),Qp.overrideMaterial=null,U.uShadowMat.value.copy(wh).multiply(Ch.projectionMatrix).multiply(Ch.matrixWorldInverse)}function kh(e){if(e===`sprite`){U.uSunDirW.value.copy(od),U.uSunCol.value.set(1,1,1),U.uSunInt.value=1,U.uAmb.value=0,U.uPLN.value=0,U.uShadowOn.value=0;return}let t=Sd[H.tod];U.uSunDirW.value.set(...t.dir).normalize(),U.uSunCol.value.set(...t.col),U.uSunInt.value=t.int,U.uAmb.value=t.amb,U.uShadowOn.value=+!!H.shadow,U.uPLN.value=t.lamps>0?nm.length:0,nm.forEach(([e,n,r],i)=>{U.uPL.value[i].set(e,n,r,4.5),U.uPLC.value[i].set(1*t.lamps,.72*t.lamps,.38*t.lamps)}),vh.uniforms.uDecalMul.value.set(t.col[0]*t.decal,t.col[1]*t.decal,t.col[2]*t.decal)}function Ah(e){let t=e.matrixWorld.elements;U.uCamR.value.set(t[0],t[1],t[2]),U.uCamU.value.set(t[4],t[5],t[6]),U.uCamB.value.set(t[8],t[9],t[10]),U.uLightDir.value.copy(U.uSunDirW.value).transformDirection(e.matrixWorldInverse)}var jh=`
uniform sampler2D tColor; uniform sampler2D tHi; uniform sampler2D tND; uniform sampler2D tDepth; uniform sampler2D tGlyph; uniform sampler2D tIcon;
uniform vec2 uRes; uniform float uF2; uniform float uF3; uniform float uNDOn;
${Xf}
${Zf}
uniform float uRange; uniform float uTexel;
uniform float uStamp; uniform vec2 uGlyph; uniform float uAtlasCols;
uniform vec3 uEye0; uniform vec3 uEye1; uniform vec3 uBrow0; uniform vec3 uBrow1;
uniform float uLookMode; uniform float uLookOn; uniform vec3 uLookInk; uniform vec3 uLookInnerInk; uniform vec2 uLookOpacity; uniform vec4 uMouth;
uniform vec4 uIcon; uniform vec2 uIconSize; uniform float uIconCols;
uniform float uResearchHighlight;uniform vec2 uHighlight;uniform float uBrowFrontOnly;uniform float uBrowOverlay;uniform vec3 uResearchEyeWorld[2];uniform vec3 uResearchEyeNormal;uniform vec3 uResearchEyeViewNormal;uniform float uResearchStamp; uniform sampler2D tResearchStamp; uniform vec4 uResearchRects[6]; uniform vec3 uResearchOriginalEyes[2];
varying vec2 vUv;
const vec3 INK = vec3(0.10, 0.06, 0.17);
vec4 srcAt(vec2 uv){
  if (uF2 > 0.5) { vec4 c = texture2D(tColor, uv); c.a = step(0.5, c.a); return c; }
  vec2 hp = 1.0 / (uRes * 4.0);
  vec3 rgb = vec3(0.0); float cov = 0.0;
  for (int j = 0; j < 4; j++) {
    for (int i = 0; i < 4; i++) {
      vec4 s = texture2D(tHi, uv + (vec2(float(i), float(j)) - 1.5) * hp);
      if (s.a > 0.5) { rgb += s.rgb; cov += 1.0; }
    }
  }
  if (cov > 0.0) rgb /= cov;
  return vec4(rgb, cov / 16.0);
}
vec4 decodeND(vec2 uv){
  vec4 q = texture2D(tND, uv);
  float A = floor(q.a * 255.0 + 0.5);
  float id = mod(A, 16.0);
  float lo = floor(A / 16.0);
  float hi = floor(q.b * 255.0 + 0.5);
  return vec4(q.r * 2.0 - 1.0, q.g * 2.0 - 1.0, (hi * 16.0 + lo) / 4095.0, id);
}
vec3 fullN(vec4 e){ return vec3(e.x, e.y, sqrt(max(0.0, 1.0 - e.x * e.x - e.y * e.y))); }
// 異なる物体どうしは「描画上の前後（深度バッファ）」、同じ物体内は「本来の深度」で比較する
void nb(vec2 uv, float g, vec4 me, float meS, inout float found, inout float bId, inout vec2 bUv, inout float ne){
  vec4 q = decodeND(uv);
  if (q.w < 0.5) return;
  bool sameObj = abs(q.w - me.w) < 0.5;
  // Two packed-depth codes cover a one-code rounding change at each endpoint.
  // Research-only: do not assign foreground paint at an ambiguous internal edge.
  float paintGuard=(uLookOn>.5 && uLookMode>.5 && abs(me.w-2.0)<.5)?2.0*uRange/4095.0:0.0;
  bool closer = sameObj ? (q.z - me.z) * uRange > g+paintGuard : texture2D(tDepth, uv).r < meS - 0.00001;
  if (closer) {
    bool choose = found < 0.5 || abs(q.w - 2.0) < 0.5;
    if(uLookOn>.5 && uLookMode>.5 && found>.5){
      vec4 prior=decodeND(bUv);
      choose=abs(prior.w-q.w)<.5 ? q.z>prior.z : texture2D(tDepth,uv).r<texture2D(tDepth,bUv).r;
    }
    if (choose) { bId = q.w; bUv = uv; }
    found = 1.0;
  } else if (sameObj && me.w > 0.5) {
    vec3 n1 = fullN(me), n2 = fullN(q);
    if (dot(n1, n2) < 0.6 && dot(n1, uLightDir) > dot(n2, uLightDir) + 0.15) ne = 1.0;
  }
}
vec4 glyphAt(vec2 p, vec3 e){
  if (e.z < -0.5) return vec4(0.0);
  vec2 d = p - e.xy;
  if (d.x < 0.0 || d.y < 0.0 || d.x >= uGlyph.x || d.y >= uGlyph.y) return vec4(0.0);
  return texture2D(tGlyph, vec2((e.z * uGlyph.x + d.x + 0.5) / (uGlyph.x * uAtlasCols), (d.y + 0.5) / uGlyph.y));
}
vec4 researchInk(vec2 p,vec4 r,float tile){
 if(r.z<=0.0||r.w<=0.0)return vec4(0.0);
 vec2 d=p-r.xy;
 if(d.x<0.0||d.y<0.0||d.x>=r.z||d.y>=r.w)return vec4(0.0);
 return texture2D(tResearchStamp,vec2((tile+(d.x+0.5)/r.z)/8.0,(d.y+0.5)/r.w));
}
void main(){
  vec2 t = 1.0 / uRes;
  vec4 c = srcAt(vUv);
  vec2 paintUv=vUv;
  bool ownPaint=uLookOn>.5 && uLookMode>.5;
  bool cov = c.a > 0.5;
  vec4 me = vec4(0.0);
  if (uNDOn > 0.5) me = decodeND(vUv);
  bool meChar = uNDOn > 0.5 ? (abs(me.w - 2.0) < 0.5) : cov;
  if (uF3 > 0.5) {
    float meS = me.w > 0.5 ? texture2D(tDepth, vUv).r : 1.0;
    vec3 mn = fullN(me);
    float nz = max(mn.z, 0.25);
    float gx = 0.06, gy = 0.06;
    if (me.w > 0.5) { gx += uTexel * abs(mn.x) / nz * 1.15; gy += uTexel * abs(mn.y) / nz * 1.15; }
    float found = 0.0, bId = 0.0, ne = 0.0; vec2 bUv = vUv;
    nb(vUv + vec2(t.x, 0.0), gx, me, meS, found, bId, bUv, ne);
    nb(vUv - vec2(t.x, 0.0), gx, me, meS, found, bId, bUv, ne);
    nb(vUv + vec2(0.0, t.y), gy, me, meS, found, bId, bUv, ne);
    nb(vUv - vec2(0.0, t.y), gy, me, meS, found, bId, bUv, ne);
    if (found > 0.5) {
      if (abs(bId - 2.0) < 0.5 && !meChar) {
        vec3 nc = srcAt(bUv).rgb;
        vec4 line = vec4(mix(uLookOn>.5?uLookInk:INK, nc * 0.3, 0.35), 1.0);
        if(ownPaint){
          // Keep the old line footprint, but give it foreground paint at every opacity.
          // Inset is a diagnostic alternative: it does not extend the silhouette.
          if(uLookMode<1.5){c=vec4(mix(nc,line.rgb,uLookOpacity.x),1.0);paintUv=bUv;}
        }else c = uLookOn>.5 ? mix(c,line,uLookOpacity.x) : line;
      } else if (meChar) {
        vec3 line = mix(c.rgb * 0.5, uLookOn>.5?uLookInnerInk:INK, 0.3);
        if(ownPaint && abs(bId-2.0)<.5){
          vec3 fill=srcAt(bUv).rgb;
          line=mix(fill*.5,uLookInnerInk,.3);
          c=vec4(mix(fill,line,uLookOpacity.y),1.0);paintUv=bUv;
        }else c.rgb = uLookOn>.5 ? mix(c.rgb,line,uLookOpacity.y) : line;
      } else if (me.w > 0.5) {
        c.rgb = mix(c.rgb * 0.62, INK, 0.12);
      }
    } else if (ne > 0.5 && cov) {
      c.rgb = min(c.rgb * 1.15 + 0.04, vec3(1.0));
    }
  }
  if(ownPaint && uLookMode>1.5 && meChar && uF3>.5){
    bool edge=abs(decodeND(vUv+vec2(t.x,0.0)).w-2.0)>.5 || abs(decodeND(vUv-vec2(t.x,0.0)).w-2.0)>.5 || abs(decodeND(vUv+vec2(0.0,t.y)).w-2.0)>.5 || abs(decodeND(vUv-vec2(0.0,t.y)).w-2.0)>.5;
    if(edge)c.rgb=mix(c.rgb,mix(uLookInk,c.rgb*.3,.35),uLookOpacity.x);
  }
  vec2 p = floor(vUv * uRes);
  if (uStamp > 0.5 && meChar) {
    float rawA = texture2D(tColor, paintUv).a;
    bool skin = uF2 > 0.5 ? (rawA > 0.5 && rawA < 0.8) : true;
    vec4 g = vec4(0.0);
    if (skin) { g = glyphAt(p, uEye0); if (g.a < 0.5) g = glyphAt(p, uEye1); }
    if (g.a < 0.5) g = glyphAt(p, uBrow0);
    if (g.a < 0.5) g = glyphAt(p, uBrow1);
    if (g.a > 0.5) c = vec4(g.rgb, 1.0);
    vec2 md=p-uMouth.xy;
    if(uLookOn>.5 && skin && md.x>=0.0 && md.y>=0.0 && md.x<uMouth.z && md.y<uMouth.w) c=vec4(INK,1.0);
  }
  if(uResearchStamp>.5 && meChar){
    float rawA=texture2D(tColor,paintUv).a;
    // Shared color pass already resolved hair/background depth. Never paint over it.
    if(uResearchStamp<1.5 && rawA>.5 && rawA<.8){
      vec4 ink=researchInk(p,uResearchRects[5],5.0);ink.rgb*=ink.a;
      for(int i=0;i<4;i++){
        vec4 part=researchInk(p,uResearchRects[i],float(i));
        if(i>=2 && uBrowFrontOnly>.5)part=vec4(0.0);
        if(i<2){
          if(i==0 && uResearchOriginalEyes[0].z>=0.0)part=glyphAt(p,uResearchOriginalEyes[0]);
          if(i==1 && uResearchOriginalEyes[1].z>=0.0)part=glyphAt(p,uResearchOriginalEyes[1]);
          // Keep the adopted narrow/half/closed glyph, changing only its white highlight.
          if(uResearchHighlight>.5 && uResearchOriginalEyes[i].z>=0.0 && part.a>.5 && part.r>.95 && part.g>.94 && part.b>.9){
            float factor=highlightFactor(uResearchEyeWorld[i],uResearchEyeNormal,uResearchEyeViewNormal,uHighlight.y);
            part.rgb=mix(vec3(36.0,26.0,56.0)/255.0,part.rgb,uHighlight.x*factor);
          }
        }
        ink=vec4(part.rgb*part.a,part.a)+ink*(1.0-part.a);
      }
      vec4 mouth=researchInk(p,uResearchRects[4],4.0);ink=vec4(mouth.rgb*mouth.a,mouth.a)+ink*(1.0-mouth.a);
      c.rgb=c.rgb*(1.0-ink.a)+ink.rgb;
      if(uResearchHighlight>.5){for(int i=0;i<2;i++){
        vec4 hi=researchInk(p,uResearchRects[i],float(i+6));
        if(uResearchOriginalEyes[i].z<0.0 && hi.a>0.0){float factor=highlightFactor(uResearchEyeWorld[i],uResearchEyeNormal,uResearchEyeViewNormal,uHighlight.y);
        c.rgb=mix(c.rgb,hi.rgb,hi.a*uHighlight.x*factor);}
      }}
    }
  }
  // Brow-only exception: the visible ND owner must still be this character.
  // World foreground already won depth before this pass. Eyes never use this path.
  if(uResearchStamp>.5 && meChar && uBrowOverlay>0.0){
    float owner=texture2D(tColor,vUv).a;
    if((owner>.63 && owner<.68)||(owner>.88 && owner<.92)){
      for(int i=2;i<4;i++){vec4 brow=researchInk(p,uResearchRects[i],float(i));c.rgb=mix(c.rgb,brow.rgb,brow.a*uBrowOverlay);}
    }
  }
  if (uIcon.w > 0.5) {
    vec2 d = p - uIcon.xy;
    if (d.x >= 0.0 && d.y >= 0.0 && d.x < uIconSize.x && d.y < uIconSize.y) {
      vec4 ic = texture2D(tIcon, vec2((uIcon.z * uIconSize.x + d.x + 0.5) / (uIconSize.x * uIconCols), (d.y + 0.5) / uIconSize.y));
      if (ic.a > 0.5) c = vec4(ic.rgb, 1.0);
    }
  }
  gl_FragColor = c;
}`,Mh=new Tr({uniforms:{...Tp,...Qf,tColor:{value:null},tHi:{value:null},tND:{value:null},tDepth:{value:null},tGlyph:{value:null},tIcon:{value:Yf()},uLookMode:{value:0},uLookOn:{value:0},uLookInk:{value:new I(.1,.06,.17)},uLookInnerInk:{value:new I(.1,.06,.17)},uLookOpacity:{value:new M(1,1)},uMouth:{value:new N},uRes:{value:new M(1,1)},uF2:{value:1},uF3:{value:1},uNDOn:{value:1},uLightDir:U.uLightDir,uRange:{value:1},uTexel:{value:.1},uStamp:{value:0},uGlyph:{value:new M(1,1)},uAtlasCols:{value:10},uEye0:{value:Pd(0,0,-1)},uEye1:{value:Pd(0,0,-1)},uBrow0:{value:Pd(0,0,-1)},uBrow1:{value:Pd(0,0,-1)},uIcon:{value:new N(0,0,0,0)},uIconSize:{value:new M(9,9)},uIconCols:{value:_d.length}},vertexShader:sf,fragmentShader:jh,depthTest:!1,depthWrite:!1}),Nh=new mo,Ph=new gr(new zr(2,2),Mh);Ph.frustumCulled=!1,Nh.add(Ph);var Fh=new Er;function Ih(e,t,n=!1){let r=new dt(e,t,{minFilter:A,magFilter:A,format:Ce,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!1});return n&&(r.depthTexture=new ps(e,t),r.depthTexture.type=ye),r}function Lh(e,t,n,r,i){J.setRenderTarget(n),r&&(J.setClearColor(0,0),J.clear()),e.overrideMaterial=i||null,J.render(e,t),e.overrideMaterial=null}function Rh(e,t,n,r,i,a,o,s){let c=Mh.uniforms;c.tColor.value=t.texture,c.tHi.value=n.texture,c.tND.value=r.texture,c.tDepth.value=r.depthTexture,c.uRes.value.set(i,a),c.uF2.value=+!!e.f2,c.uF3.value=+!!e.f3,c.uNDOn.value=+!!s,c.uRange.value=o,c.uTexel.value=Td()}var zh=Pd(),Bh=Pd(),Vh=Pd(),Hh=Pd();function Uh(e,t,n,r){let i=Mh.uniforms;if(G.root.updateMatrixWorld(!0),r!==`pixel`){i.uStamp.value=0;return}i.uStamp.value=1,G.headC.getWorldPosition(Bh),Hh.copy(Bh).project(e);let a=(Hh.x*.5+.5)*t,o=Hf(),s=K.emote?vd[K.emote.key]:null,c=s&&Kf.w>=2?s.brow:-1,l=U.uCamB.value,u=G.eyeA.map(r=>{r.getWorldPosition(zh);let i=Vh.copy(zh).sub(Bh).normalize().dot(l);return zh.project(e),{f:i,px:(zh.x*.5+.5)*t,py:(zh.y*.5+.5)*n}}),d=u[0].f>.12&&u[1].f>.12;u.forEach((e,t)=>{let n=t?i.uEye1.value:i.uEye0.value,r=t?i.uBrow1.value:i.uBrow0.value;if(e.f<=.12){n.set(0,0,-1),r.set(0,0,-1);return}let s=e.f<=.5,l=e.px;s&&(l+=Math.sign(a-l));let f=Math.round(l-Kf.w/2),p=Math.round(e.py-Kf.h/2);n.set(f,p,(s?3:0)+o);let m=d?e.px<u[1-t].px:e.px<a;r.set(f,p+Kf.h+1,c<0?-1:6+c*2+ +!m)})}function Wh(e,t,n,r){Uh(e,t,n,r);let i=Mh.uniforms;i.uResearchStamp.value=0,i.uMouth.value.set(0,0,0,0),E.active&&!D().face.legacy&&D().browMode===`original`?i.uStamp.value=0:E.active&&r===`pixel`&&(G.headC.getWorldPosition(Bh),zh.set(0,.18,.43),G.head.localToWorld(zh),Vh.copy(zh).sub(Bh).normalize(),Vh.dot(U.uCamB.value)>.15&&(D().mouth||!E.baseline)&&(zh.project(e),i.uMouth.value.set(Math.round((zh.x*.5+.5)*t-1),Math.round((zh.y*.5+.5)*n),2,1)),Rp(e,t,n,i))}function Gh(e,t,n){let r=Mh.uniforms,i=K.emote;if(!i||i.t>i.dur-.12){r.uIcon.value.w=0;return}let a=vd[i.key].icon,o=_d[a];G.headC.getWorldPosition(zh),zh.y+=.62,zh.project(e);let s=(zh.x*.5+.5)*t,c=(zh.y*.5+.5)*n,l=i.t<.08?-2:+(i.t<.16);o.drift&&(l-=Math.floor(i.t*4%3)),r.uIcon.value.set(Math.round(s-4+o.ox),Math.round(c+2+o.oy+l),a,1)}function Kh(e,t){return t.map(t=>{let n=document.createElement(`div`);n.className=`cell`;let r=document.createElement(`canvas`);n.appendChild(r);let i=document.createElement(`div`);return i.textContent=t.label,n.appendChild(i),e.appendChild(n),{cv:r,ctx:r.getContext(`2d`)}})}var qh=Kh(document.getElementById(`stageStrip`),dd),Jh=Kh(document.getElementById(`faceStrip`),fd),Yh=new Tr({uniforms:mf.uniforms,vertexShader:Xd.replace(`vDist = -(viewMatrix * wp).z;`,`vDist = -(viewMatrix * wp).z + dot(vec3(uFoot.x, 0.0, uFoot.y), uCamB);`),fragmentShader:mf.fragmentShader,side:2});function Xh(e,t){!!e.depthTexture!==t&&(e.dispose(),e.depthTexture=t?new ps(e.width,e.height,ye):null)}var Zh,Qh,$h,eg,tg,ng,rg,ig=Td(),ag=new jl(-Hu,Hu,Hu,-Hu,Qu,$u);function og(e,t){ag.position.copy(sd).addScaledVector(cd,5),ag.lookAt(sd),ag.translateX(-e*Td()),ag.translateY(t*Td()),ag.updateMatrixWorld()}function sg(e,t){let n=H.S;kh(`sprite`),G.root.position.set(0,0,0),G.root.rotation.y=e.angle,Tf(e.face),U.uToon.value=+!!e.f1,U.uFoot.value.set(0,0,Zu,-1),U.uNear.value=Qu,U.uFar.value=$u,og(e.subX,e.subY),Ah(ag);let r=e.f3||e.face===`pixel`;Lh(gf,ag,e.f2?Zh:Qh,!0),r&&Lh(gf,ag,$h,!0,mf),Rh(e,Zh,Qh,$h,n,n,$u-Qu,r),Uh(ag,n,n,e.face),Mh.uniforms.uIcon.value.w=0,J.setRenderTarget(t),J.setClearColor(0,0),J.clear(),J.render(Nh,Fh),J.setRenderTarget(null)}var cg=100,lg=100,ug=new jl(-1,1,1,-1,20,80);function dg(){let e=Td(),t=Math.floor(cg/2),n=Math.floor(lg/2);ug.left=-t*e,ug.right=(cg-t)*e,ug.bottom=-n*e,ug.top=(lg-n)*e,ug.updateProjectionMatrix()}function fg(e,t,n,r,i,a,o,s={}){let c=Td();kh(`world`),U.uToon.value=+!!e.f1,U.uFoot.value.set(t,n,Zu,-1),U.uPixScale.value=e.f2?1:4,U.uPixOrigin.value.set(r-Math.floor(cg/2),i-Math.floor(lg/2)),U.uNear.value=20,U.uFar.value=80,ug.position.copy(cd).multiplyScalar(50),ug.lookAt(0,0,0),ug.translateX(r*c),ug.translateY(i*c),ug.updateMatrixWorld(),Ah(ug),H.shadow&&Oh(t,n),xh.position.set(t,.03,n),bh.uniforms.uCenter.value.set(a,-o);let l=Math.max(2,Math.round(.4/c));bh.uniforms.uRad.value.set(l,Math.max(1,Math.round(l*.42)));let u=e.f3||e.face===`pixel`,d=e.f2?tg:ng;Xh(tg,O.variant===`precise`&&e.f2),Xh(ng,O.variant===`precise`&&!e.f2),Lh(Qp,ug,d,!0),Lh(_h,ug,d,!1),s.blob!==!1&&Lh(yh,ug,d,!1),s.character!==!1&&Lh(gf,ug,d,!1),u&&(Lh(Qp,ug,rg,!0,pf),s.character!==!1&&Lh(gf,ug,rg,!1,O.variant===`baseline`?mf:Yh)),Rh(e,tg,ng,rg,cg,lg,60,u),Wh(ug,cg,lg,e.face),Gh(ug,cg,lg),s.character===!1&&(Mh.uniforms.uStamp.value=0,Mh.uniforms.uIcon.value.w=0),s.skipComposite||(J.setRenderTarget(s.target||null),J.setClearColor(0,1),J.clear(),J.render(Nh,Fh))}function pg(){let e=H.S,t=q.gx*ig,n=q.gy*ig/Wu;ig=Td(),Nm(t,n),[Zh,Qh,$h,eg].forEach(e=>e&&e.dispose()),Zh=Ih(e,e),Qh=Ih(e*4,e*4),$h=Ih(e,e,!0),eg=Ih(e,e),U.uT.value=e/2,U.uTexel.value=Td(),Jf(e,Mh),dg();let r=window.devicePixelRatio||1,i=Math.max(1,Math.round(80*r/e));[...qh,...Jh].forEach(t=>{t.cv.width=e,t.cv.height=e,t.cv.style.width=t.cv.style.height=e*i/r+`px`,t.ctx.clearRect(0,0,e,e)})}function mg(){let e=Pm.getBoundingClientRect(),t=window.devicePixelRatio||1,n=Math.max(1,Math.round(H.dot*t))/t;cg=Math.max(16,Math.floor(e.width/n)),lg=Math.max(16,Math.floor(e.height/n)),J.setSize(cg,lg,!1);let r=cg*n,i=lg*n,a=Math.round((e.left+(e.width-r)/2)*t)/t-e.left,o=Math.round((e.top+(e.height-i)/2)*t)/t-e.top;Fm.style.width=r+`px`,Fm.style.height=i+`px`,Fm.style.left=a+`px`,Fm.style.top=o+`px`,[tg,ng,rg].forEach(e=>e&&e.dispose()),tg=Ih(cg,lg),ng=Ih(cg*4,lg*4),rg=Ih(cg,lg,!0),dg()}function hg(e,t){if(e.width!==t.width||e.height!==t.height)throw Error(`画面寸法が変わりました。基準を取り直してください`);let n=t.x-e.x,r=t.y-e.y;if(!Number.isInteger(n)||!Number.isInteger(r))throw Error(`整数格子のカメラ移動のみ比較できます`);let i=0,a=0,o=0,s=[];for(let c=1;c<e.height-1;c++)for(let l=1;l<e.width-1;l++){let u=l-n,d=c-r;if(u<1||d<1||u>=t.width-1||d>=t.height-1)continue;let f=(c*e.width+l)*4,p=(d*t.width+u)*4,m=!1;for(let n=0;n<4;n++){let r=Math.abs(e.pixels[f+n]-t.pixels[p+n]);o=Math.max(o,r),m||=r!==0}i++,m&&(a++,s.length<12&&s.push({x:l+e.x,y:c+e.y,before:Array.from(e.pixels.slice(f,f+4)),after:Array.from(t.pixels.slice(p,p+4))}))}return{scroll:{dx:n,dy:r},compared:i,changed:a,maxChannelDelta:o,examples:s,excluded:e.width*e.height-i,exclusion:`視野の非共通部分と両画像の1px外周（輪郭の隣接参照）。物体や差分値による除外なし`,status:i===0?`比較範囲なし`:a?`不規則変化あり・未解決`:`比較範囲で差分なし`}}function gg(e,t){let n=0;for(let r=0;r<e.length;r+=4)e.subarray(r,r+4).some((e,n)=>e!==t[r+n])&&n++;return n}var Y=e=>document.getElementById(e),_g=e=>Y(e),vg=new Hp(Ku),yg=!1,bg=`final`,xg,Sg=null,Cg,wg=`still`,Tg=11,Eg=zp.still.inputs;function Dg(){return yg&&!!zp[wg].study}function Og(){if(!Dg()||!O.fixedCamera)return null;let[e,t]=zp[wg].start;return{x:Math.round(e/Td()),y:-Math.round(t*Wu/Td())+Math.round(.9*Gu/Td())}}var kg=null,Ag=null,jg=null,Mg=null,Ng=null,Pg=[],Fg=-1/0;function Ig(){return{...H,unwrap:U.uUnwrap.value,autoBlink:K.autoBlink}}function Lg(e){let{unwrap:t,autoBlink:n,...r}=e;Object.assign(H,r),U.uUnwrap.value=t,K.autoBlink=n,pg(),mg(),Rg()}function Rg(){for(let[e,t]of[[`segS`,`S`],[`segFace`,`face`],[`segTod`,`tod`]])Y(e).querySelectorAll(`button`).forEach(e=>e.classList.toggle(`on`,Object.values(e.dataset)[0]===String(H[t])));for(let[e,t]of[[`tgAuto`,H.auto],[`tgCmp`,H.compare],[`tgShadow`,H.shadow],[`tgBlink`,K.autoBlink]])Y(e).classList.toggle(`on`,t),Y(e).setAttribute(`aria-checked`,String(t));_g(`unwrap`).value=String(U.uUnwrap.value*100),Y(`unwrapVal`).textContent=_g(`unwrap`).value}function zg(){return{ticks:vg.ticks,time:ah,shaderTime:U.uTime.value,player:{...q},phase:Qm,idleT:$m,moving:eh,snapA:rh,smoothA:nh,curDir:oh,dirHold:sh,moveAcc:ih,expression:JSON.parse(JSON.stringify(K)),auto:{...Ym},camera:ug.matrixWorld.elements.slice(),worldSeed:km}}function Bg(){return{mode:yg?`検証`:`通常操作`,replayPaused:vg.paused,build:{buildId:`gh-42499868841-1-10422fc7d702`,commit:`10422fc7d702b63e06dd94f911704477a40a86f2`,builtAt:`2026-11-08T16:26:38.677Z`},settings:Ig(),seed:Tg,worldSeed:km,preset:wg,presetLabel:zp[wg].label,inputs:Eg,replay:`入力列を秒数から既存STEPへ丸めて繰返し。リセットで時刻0・乱数先頭・初期位置へ戻る`,stepSeconds:Ku,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio,orientation:innerWidth>innerHeight?`横`:`縦`,bufferWidth:cg,bufferHeight:lg},browser:navigator.userAgent,characters:1,pointLights:H.tod===`day`?0:nm.length,shadowLights:+!!H.shadow,qualityAdjustment:`なし`,characterStudy:{...O,defaultVariant:ue,presetControlsActive:Dg()},bufferView:bg,recording:_g(`v-recording`).checked?`録画中（申告）`:`録画なし（申告・自動検出不可）`,state:zg()}}function Vg(){return JSON.stringify({settings:Ig(),seed:Tg,preset:wg,inputs:Eg,W:cg,H:lg,characterStudy:O})}function Hg(e){Y(`v-message`).textContent=e}function Ug(e){let t=Eg.reduce((e,t)=>e+Math.round(t.seconds/Ku),0),{gx:n,gy:r}=q;Gm(Bp(Eg,e%Math.max(1,t),Ku)),mh(e*Ku*1e3),zp[wg].stationary&&(q.gx=n,q.gy=r)}function Wg(){vg.reset(),gh(),Km(),Rf(Tg),Am(Tg),K.seq=[],K.seqT=0,K.emote=null,K.blinkWait=2.5,K.autoBlink=Cg.autoBlink,Dg()&&O.freezePose&&(K.autoBlink=!1),Nm(...zp[wg].start),U.uTime.value=0,Gm({x:0,y:0,len:0})}function Gg(){t_(`リセット`);let e=Number(_g(`v-seed`).value);if(!Number.isInteger(e)||e<0||e>4294967295)throw Error(`seedは0〜4294967295の整数にしてください`);let t=Vp(_g(`v-inputs`).value);yg||=(Sg=Ig(),Cg={...Sg,auto:!1,compare:!1},!0),Tg=e,wg=Y(`v-preset`).value,Eg=t,Lg(Cg),Wg(),xg(),Kg(),i_(),Hg(`リセットしました。時刻0で停止中です`)}function Kg(){Y(`normal-controls`).disabled=yg;let e=!!kg&&!kg.done;Y(`v-conditions`).disabled=e;for(let t of[`v-play`,`v-step`,`v-seek`,`v-base`,`v-compare`,`v-measure`])Y(t).disabled=e;Y(`v-buffer`).disabled=e}function qg(){t_(`通常操作へ復帰`),O.selection=`default`,O.freezePose=!1,O.fixedCamera=!1,Y(`v-character-variant`).value=`default`,_g(`v-freeze-pose`).checked=!1,_g(`v-fixed-camera`).checked=!1,yg=!1,vg.reset(),Gm(null),Rf(null),Km(),gh(),Am(11),bg=`final`,Y(`v-buffer`).value=`final`,Sg&&Lg(Sg),Nm(0,2.5),U.uTime.value=0,Mg=null,Y(`validation`).open=!1,xg(),Kg(),i_(),Hg(`通常操作に戻りました`)}function Jg(e){return yg?vg.advance(e,Ug):0}function Yg(){yg||Gg(),vg.pause(),vg.single(Ug),U.uTime.value=ah,xg(),i_()}function Xg(e){if(!Number.isFinite(e)||e<0||e>600)throw Error(`固定時刻は0〜600秒にしてください`);yg||Gg(),Wg();let t=Math.round(e/Ku);for(let e=0;e<t;e++)vg.single(Ug);U.uTime.value=ah,xg(),i_(),Hg(`${vg.seconds.toFixed(3)}秒に固定しました（既存STEPに丸め）`)}function Zg(){if(kg&&!kg.done)throw Error(`性能測定を停止してから画素比較してください`);yg||Gg(),vg.pause();let e=Ih(cg,lg),t=ah,n=(t,n,r)=>{U.uTime.value=r,xg({target:e,character:t,blob:n});let i=new Uint8Array(cg*lg*4);return J.readRenderTargetPixels(e,0,0,cg,lg,i),i};try{let e=n(!0,!0,t),r=n(!1,!0,t),i=n(!1,!1,t),a=n(!1,!1,0),o=Og(),s=o?.x??Math.round(q.gx),c=o?.y??-Math.round(q.gy)+Math.round(.9*Gu/Td());return{fullImage:e,image:{width:cg,height:lg,x:s,y:c,pixels:a},conditions:Bg(),fingerprint:Vg(),separation:{characterPixels:gg(e,r),movingFootShadowPixels:gg(r,i),intentionalAnimationPixels:gg(i,a),method:`同一カメラで4描画。全体→キャラ・顔・アイコンなし→足元影なし→既存シェーダー時刻0。静止比較は最終画像全域。建物・木の影と現在のuFootは保持し、差分を除外しない`,frozenShaderSeconds:0,readPixels:!0,normalPerformance:!1}}}finally{e.dispose(),U.uTime.value=t,xg(),J.setRenderTarget(null)}}function Qg(){Mg=Zg(),Hg(`静止背景の基準を記録しました。進行して「画素比較」を押してください`)}function $g(){if(!Mg)throw Error(`先に「比較基準」を押してください`);let e=Zg();if(e.fingerprint!==Mg.fingerprint)throw Error(`条件が変わりました。比較基準を取り直してください`);return Ng={reference:Mg.conditions,current:e.conditions,referenceSeparation:Mg.separation,currentSeparation:e.separation,result:hg(Mg.image,e.image)},Hg(`静止背景：${Ng.result.status}（${Ng.result.changed}画素）。詳細は結果欄`),o_(),Ng}function e_(e,t){yg||Gg(),Wg(),H.compare=!1,bg=`final`,Y(`v-buffer`).value=`final`,vg.paused=!1;let n=Y(`v-duration`).value===`standard`;kg=new le(e??(n?30:5),t??(n?60:10)),Ag=Bg(),jg=null,Kg(),Hg(`画像読出しなしで性能を測定します。画面を表示したままお待ちください`)}function t_(e){kg&&!kg.done&&(kg.interrupt(e),n_())}function n_(){jg={conditions:Ag,result:kg.result(),endState:zg()},Kg(),o_()}function r_(e,t,n){kg&&!kg.done&&Ag&&(cg!==Ag.viewport.bufferWidth||lg!==Ag.viewport.bufferHeight||devicePixelRatio!==Ag.viewport.dpr)&&t_(`内部解像度・DPRの変更`),kg&&!kg.done&&(kg.sample(e,t,n),kg.done&&n_()),yg&&e-Fg>250&&(Fg=e,i_())}function i_(){if(Y(`v-clock`).textContent=yg?`${vg.paused?`停止`:`再生`} · ${vg.seconds.toFixed(3)}秒 · ${vg.ticks}更新`:`通常操作中`,Y(`v-play`).textContent=yg&&!vg.paused?`停止`:`再生`,kg){let e=kg.result();Y(`v-performance`).textContent=`${{warming:`準備中`,measuring:`測定中`,complete:`測定完了`,interrupted:`測定中断`}[e.status]} ${kg.elapsed.toFixed(1)}秒 ／ ${e.renderedFps?.toFixed(1)??`—`} fps ／ 中央値 ${e.frameIntervals.medianMs?.toFixed(2)??`—`} ms ／ p95 ${e.frameIntervals.p95Ms?.toFixed(2)??`—`} ms ／ GPU未取得`}}function a_(){return{schema:`pixel-rig-validation-1`,conditions:Bg(),performance:jg??(kg?{conditions:Ag,result:kg.result(),endState:zg()}:null),pixelComparison:Ng,notices:Pg,knownIssues:[`PNG保存は保留`,`Bと通常既定化は指定成果物で実機採用済み。ルック研究の調整値は未採用`,`自動検査10条件の差分は残存。まばたき時の変化は原因未確定で別件`],acceptance:`自動的な性能合格・実機確認・採用承認を意味しません`}}function o_(){_g(`v-result`).value=JSON.stringify(a_(),null,2)}function s_(e){xg=e,Y(`v-preset`).innerHTML=Object.entries(zp).map(([e,t])=>`<option value="${e}">${t.label}</option>`).join(``),Y(`v-preset`).value=`still`,Y(`v-character-variant`).value=O.selection,Y(`v-character-variant`).addEventListener(`change`,()=>{t_(`比較方式の変更`);let e=O.selection;O.selection=Y(`v-character-variant`).value;try{Gg(),Hg(`同じ経路の先頭へ戻りました。「再生」で変更前／候補を比較してください`)}catch(t){O.selection=e,Y(`v-character-variant`).value=e,Hg(t.message)}});for(let[e,t]of[[`v-freeze-pose`,`freezePose`],[`v-fixed-camera`,`fixedCamera`]])_g(e).addEventListener(`change`,()=>{t_(`切分け条件の変更`),O[t]=_g(e).checked;try{Gg()}catch(e){Hg(e.message)}});_g(`v-inputs`).value=JSON.stringify(zp.still.inputs),Y(`v-preset`).addEventListener(`change`,()=>{_g(`v-inputs`).value=JSON.stringify(zp[Y(`v-preset`).value].inputs);try{Gg()}catch(e){Hg(e.message)}});let t={"v-reset":Gg,"v-exit":qg,"v-play":()=>{yg||Gg(),vg.paused=!vg.paused,vg.paused&&vg.pause(),i_()},"v-step":Yg,"v-seek":()=>Xg(Number(_g(`v-time`).value)),"v-base":Qg,"v-compare":$g,"v-measure":()=>e_(),"v-stop-measure":()=>{t_(`利用者が停止`),i_()}};for(let[e,n]of Object.entries(t))Y(e).addEventListener(`click`,()=>{try{n()}catch(e){Hg(e.message)}});Y(`v-buffer`).addEventListener(`change`,()=>{yg||Gg(),bg=Y(`v-buffer`).value}),Y(`v-copy`).addEventListener(`click`,async()=>{o_();let e=_g(`v-result`).value;try{if(!navigator.clipboard)throw Error(`Clipboard unavailable`);await navigator.clipboard.writeText(e),Hg(`結果をコピーしました`)}catch{Hg(`コピーできませんでした。下の結果欄を長押ししてコピーできます。通常操作へ戻れます`),_g(`v-result`).focus(),_g(`v-result`).select()}}),addEventListener(`resize`,()=>{t_(`画面サイズ・向きの変更`)}),document.addEventListener(`visibilitychange`,()=>{document.hidden&&(vg.pause(),Km(),t_(`画面が非表示`))}),addEventListener(`blur`,()=>{yg&&(vg.pause(),t_(`フォーカスが外れた`))}),i_(),new URLSearchParams(location.search).get(`study`)===`color`&&(Y(`validation`).open=!0,Y(`v-preset`).value=`color-vertical`,Y(`v-preset`).dispatchEvent(new Event(`change`)))}var c_=new Hp(Ku),l_=null,u_=!0;function d_(){E.active||(yg&&qg(),l_={...H},u_=K.autoBlink,E.active=!0,O.selection=`default`,H.auto=!1,H.compare=!1,H.face=`pixel`,H.S=32,H.dot=4,H.shadow=!0,document.body.classList.add(`look-active`),document.getElementById(`look-panel`).hidden=!1,document.getElementById(`normal-controls`).hidden=!0,document.getElementById(`validation`).hidden=!0,f_(),pg(),mg())}function f_(){c_.reset(),gh(),Km(),Rf(11),Am(11);let e=E.preview.lightSite;Nm(e===`lamp`||e===`boundary`?3:0,e===`dark`?7:e===`lamp`?1.8:e===`boundary`?5:2.5),K.seq=[],K.seqT=0,K.emote=null,K.blinkWait=2.5,U.uTime.value=0}function p_(){kd(`通常操作へ戻りました`),E.active=!1,bp(),Nf(),c_.reset(),G.head.position.y=.56,G.head.scale.setScalar(1),Qp.visible=_h.visible=!0,O.selection=`default`,l_&&Object.assign(H,l_),K.autoBlink=u_,K.seq=[],K.emote=null,gh(),Km(),Gm(null),Rf(null),Am(11),Nm(0,2.5),Mh.uniforms.uResearchStamp.value=0,Mh.uniforms.uLookOn.value=0,Mh.uniforms.uMouth.value.set(0,0,0,0),document.body.classList.remove(`look-active`),document.getElementById(`look-panel`).hidden=!0,document.getElementById(`normal-controls`).hidden=!1,document.getElementById(`validation`).hidden=!1,Fm.style.transform=``,pg(),mg()}function m_(e){let t=E.preview,n=t.motion;Gm(Bp(n===`vertical`?zp[`color-vertical`].inputs:n===`diagonal`?zp[`color-diagonal`].inputs:[{seconds:4,x:0,y:0}],e%240,Ku)),K.autoBlink=t.blink,mh(e*Ku*1e3)}function h_(e){f_();for(let t=0;t<e;t++)c_.single(m_)}async function g_(e,t){f_();for(let n=0;n<e;){let r=Math.min(e,n+3e3);for(;n<r;n++)c_.single(m_);t(n/e),await new Promise(e=>setTimeout(e,0))}}function __(){c_.pause(),c_.single(m_)}function v_(e=0){if(!E.active)return!1;let t=performance.now(),n=c_.advance(e,m_),r=E.preview,i=D();H.tod=r.light,H.face=`pixel`,O.selection=`default`;let a=c_.seconds,o=r.autoDirection?Math.floor(a/2)%8:r.direction,s=re(a,r.direction,r.autoDirection,i.headTiltScope===`front`),c=ne(s);if(Tf(`pixel`),G.head.position.y=.56,r.motion===`vertical`||r.motion===`diagonal`)hh(!0);else if(r.motion===`walk`)Ef(Math.floor(a/qu*4)%4/4);else{Df(i.idleMotion===`none`?0:r.motion===`still`?-1:Math.floor($m*i.idleSpeed/.6)%2?1:-1);let e=G.torso.position.y,t=i.headIdle*(i.frontFringe===`still`?1-c:1);G.torso.position.y=i.idleMotion===`none`?0:e*i.bodyIdle,G.head.position.y=.56+(i.idleMotion===`none`?0:e*(t-i.bodyIdle)),G.head.rotation.x*=t}G.head.rotation.x-=i.headTilt*Math.PI/180*(i.headTiltScope===`front`?c:1),yp(),Pf(i),r.eyes===`closed`?K.seq=[[2,999]]:r.eyes!==`open`&&r.blink||(K.seq=[]),G.motion.position.set(0,0,0),G.motion.rotation.set(0,0,0),G.root.rotation.y=s;let l=q.gx*Td(),u=q.gy*Td()/Wu;G.root.position.set(l,0,u),U.uTime.value=ah,Qp.visible=_h.visible=r.background===`map`;let d=Mh.uniforms;d.uLookOn.value=1,d.uLookInk.value.set(i.outlineColor),i.outlineColor===b.outlineColor&&d.uLookInk.value.setRGB(.1,.06,.17),d.uLookInnerInk.value.set(i.innerOutlineColor),i.innerOutlineColor===b.innerOutlineColor&&d.uLookInnerInk.value.setRGB(.1,.06,.17),d.uLookOpacity.value.set(i.outerOpacity,i.innerOpacity),d.uLookMode.value=i.outlineMode===`underpaint`?1:i.outlineMode===`inset`?2:0;let f=r.view===`3d`,p=f?4:1;if((Fm.width!==cg*p||Fm.height!==lg*p)&&J.setSize(cg*p,lg*p,!1),fg({f1:!f,f2:!f,f3:!f,face:`pixel`},l,u,Math.round(q.gx),-Math.round(q.gy)+Math.round(.9*Gu/Td()),q.gx,q.gy,{blob:r.background===`map`,skipComposite:f}),f){d.tColor.value=ng.texture,d.uF2.value=1,d.uF3.value=0,d.uRes.value.set(cg*4,lg*4),d.uGlyph.value.multiplyScalar(4);for(let e of[`uEye0`,`uEye1`,`uBrow0`,`uBrow1`])d[e].value.x*=4,d[e].value.y*=4;Lp(4),d.uMouth.value.multiplyScalar(4),J.setRenderTarget(null),J.clear(),J.render(Nh,Fh),d.uGlyph.value.multiplyScalar(.25)}Fm.style.transform=r.zoom===1?``:`scale(${r.zoom})`,Fm.style.transformOrigin=`50% 65%`;let m=document.getElementById(`look-time`);return m&&(m.textContent=`${E.baseline?`基準`:`調整中`} · ${c_.paused?`停止`:`再生`} ${a.toFixed(2)}秒 · ${o+1}/8方向 · ${r.view===`dot`?`ドット絵`:`3D確認`}`),Md(performance.now(),performance.now()-t,n),!0}var y_=`modulepreload`,b_=function(e,t){return new URL(e,t).href},x_={},S_=function(e){return e.pathname.endsWith(`.css`)},C_=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},w_=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=b_(t,n);let r=s(t),i=S_(r);return C_(x_,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:y_,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{let i=a=>{t.removeEventListener(`load`,i),t.removeEventListener(`error`,i),a.type===`error`?n(Error(`Unable to preload CSS for ${r}`)):e(a)};t.addEventListener(`load`,i),t.addEventListener(`error`,i)})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},X=e=>document.getElementById(e),T_={headTilt:`頭を上げる角度（度）`,headIdle:`頭の待機振幅（倍）`,bodyIdle:`胴体の待機振幅（倍）`,idleSpeed:`待機速度（倍）`,outerOpacity:`外周線の不透明度（%）`,innerOpacity:`内部線の不透明度（%）`},E_=``,D_=``,O_=!1,k_=()=>JSON.stringify([X(`look-name`)?.value.trim(),E.values,E.preview]);function A_(){let e=X(`look-save-state`);e&&(e.textContent=O_?`処理中…`:E_===k_()?`保存済み：${D_}`:`未保存の変更あり`)}function j_(e){D_=e,E_=k_(),A_()}function M_(e,t){if(O_)return;O_=!0,P_(e+`中…`),A_();for(let e of document.querySelectorAll(`[data-save-action]`))e.disabled=!0,e.setAttribute(`aria-busy`,`true`);let n=()=>{X(`look-panel`).inert=!1,document.querySelector(`.look-dock`).inert=!1,O_=!1;for(let e of document.querySelectorAll(`[data-save-action]`))e.disabled=!1,e.removeAttribute(`aria-busy`);A_()};try{let r=t();r?(X(`look-panel`).inert=!0,document.querySelector(`.look-dock`).inert=!0,r.catch(t=>P_(e+`できませんでした。`+se(t))).finally(n)):n()}catch(t){P_(e+`できませんでした。`+se(t)),n()}}function N_(){return{schema:5,name:X(`look-name`).value.trim()||`研究設定`,buildId:{buildId:`gh-42499868841-1-10422fc7d702`,commit:`10422fc7d702b63e06dd94f911704477a40a86f2`,builtAt:`2026-11-08T16:26:38.677Z`}.buildId,values:S(E.values),preview:S(E.preview),playback:{ticks:c_.ticks,paused:c_.paused}}}function P_(e){X(`look-message`).textContent=e;let t=X(`look-operation-result`);t&&(t.textContent=e)}function F_(e){try{e()}catch(e){P_(e.message)}}function I_(){for(let e of Object.keys(C))for(let t of[``,`-number`])X(`look-`+e+t).value=String(Number(E.values[e])*(e.endsWith(`Opacity`)?100:1));X(`look-mouth`).checked=E.values.mouth,X(`look-outlineColor`).value=E.values.outlineColor,X(`look-innerOutlineColor`).value=E.values.innerOutlineColor;for(let e of[`view`,`background`,`motion`,`direction`,`zoom`,`light`])X(`look-`+e).value=String(E.preview[e]);for(let e of[`blink`,`autoDirection`])X(`look-`+e).checked=E.preview[e];X(`look-outlineMode`).value=E.values.outlineMode,X(`look-compare`).value=E.baseline?`baseline`:`draft`,window.dispatchEvent(new Event(`look-controls-refreshed`)),A_()}function L_(e){let t=T(e);E.values=t.values,E.preview=t.preview,E.baseline=!1,X(`look-name`).value=t.name;let n=()=>{c_.paused=t.playback.paused,I_(),window.dispatchEvent(new Event(`look-restored`))};if(t.playback.ticks>36e3)return g_(t.playback.ticks,e=>P_(`再生位置を復元中… ${Math.round(e*100)}%`)).then(n);h_(t.playback.ticks),n()}function R_(e=X(`look-saved`).value){let t=Object.keys(ae()),n=X(`look-saved`);n.replaceChildren(...t.map(e=>{let t=document.createElement(`option`);return t.value=t.textContent=e,t})),t.includes(e)&&(n.value=e)}function z_(){let e=document.createElement(`section`);e.id=`look-panel`,e.className=`validation look-panel`,e.hidden=!0;let t=(e,t,n)=>`<label>${t}<select id="look-${e}">${n.map(([e,t])=>`<option value="${e}">${t}</option>`).join(``)}</select></label>`,n=Object.entries(C).map(([e,[t,n,r]])=>`<label for="look-${e}">${T_[e]}</label><div class="look-range"><input id="look-${e}" type="range" min="${e.endsWith(`Opacity`)?t*100:t}" max="${e.endsWith(`Opacity`)?n*100:n}" step="${e.endsWith(`Opacity`)?r*100:r}"><input aria-label="${T_[e]}の数値" id="look-${e}-number" type="number" min="${e.endsWith(`Opacity`)?t*100:t}" max="${e.endsWith(`Opacity`)?n*100:n}" step="${e.endsWith(`Opacity`)?r*100:r}"><button class="btn ghost" data-look-reset="${e}">初期値</button></div>`).join(``);e.innerHTML=`<h2>キャラクターのルック研究</h2><p class="note">通常のキャラクターは変更しません。調整値は研究用です。プレビューを見ながら下の項目を操作できます。</p><p id="look-time"></p>
 <div class="validation-actions"><button class="btn" id="look-play">再生／停止</button><button class="btn ghost" id="look-step">1コマ進む</button><button class="btn ghost" id="look-reset-time">時刻を先頭へ</button><button class="btn ghost" id="look-exit">通常操作へ戻る</button></div>
 ${t(`compare`,`同じ時刻で比較`,[[`draft`,`調整中`],[`baseline`,`採用済みの基準`]])}
 ${t(`view`,`表示`,[[`dot`,`最終ドット絵`],[`3d`,`3D確認（高解像度・輪郭なし）`]])}
 ${t(`motion`,`動作`,[[`still`,`静止`],[`idle`,`待機`],[`walk`,`その場歩行`],[`vertical`,`縦移動（既存経路）`],[`diagonal`,`斜め移動（既存経路）`]])}
 ${t(`direction`,`向き`,[`正面`,`本人の左斜め`,`本人の左横`,`左後ろ`,`後ろ`,`右後ろ`,`本人の右横`,`本人の右斜め`].map((e,t)=>[String(t),e]))}
 <label><input id="look-autoDirection" type="checkbox">2秒ずつ固定順で8方向</label><label><input id="look-blink" type="checkbox">まばたき</label>
 ${t(`background`,`背景`,[[`map`,`既存マップ`],[`plain`,`無地`]])}${t(`zoom`,`ドットの拡大確認`,[[`1`,`通常サイズ`],[`2`,`2倍（ぼかしなし）`],[`3`,`3倍（ぼかしなし）`]])}${t(`light`,`照明`,[[`day`,`昼`],[`evening`,`夕方`],[`night`,`夜`]])}
 ${t(`outlineMode`,`線と塗りの方式`,[[`legacy`,`従来`],[`underpaint`,`塗りを保つ（候補）`],[`inset`,`内側に線（比較）`]])}<p id="look-outline-note" class="note">線の不透明度：0%＝線なし、100%＝不透明。外周線と内部線を別々に調整できます。「塗りを保つ」は線の下に手前のパーツの塗りを残す比較候補です。3D確認には輪郭線を付けません。</p><details open><summary>角度・待機・輪郭</summary>${n}<label><input id="look-mouth" type="checkbox">口を表示（基準は口なし）</label><button class="btn ghost" data-look-reset="mouth">口を初期値へ</button><label>キャラの外周線の色<input id="look-outlineColor" type="color"></label><button class="btn ghost" data-look-reset="outlineColor">外周線の色を初期値へ</button><label>キャラの内部線の色<input id="look-innerOutlineColor" type="color"></label><button class="btn ghost" data-look-reset="innerOutlineColor">内部線の色を初期値へ</button></details>
 <div id="look-face-editor"></div>
 <details><summary>名前付き保存・コピー・貼り付け</summary><label>設定名<input id="look-name" value="研究設定" maxlength="60"></label><button class="btn" id="look-save">端末内へ保存</button><label>保存済み<select id="look-saved"></select></label><button class="btn ghost" id="look-load">選択した設定を復元</button><button class="btn ghost" id="look-copy">調整中の設定をコピー</button><label>コピー内容／復元する設定<textarea id="look-json" rows="5"></textarea></label><button class="btn ghost" id="look-paste">貼り付けた設定を復元</button></details><details><summary>性能測定（見た目の確認後）</summary><p>最終ドット絵の現在の設定で測ります。端末を縦持ち／横持ちにして、準備5秒＋測定10秒、自動終了まで操作せず待ってください。測定条件に顔と頭の設定も記録します。</p><button class="btn" id="look-measure">現在のドット絵を15秒測定</button><button class="btn ghost" id="look-measure-copy">測定結果をコピー</button><p id="look-performance" role="status"></p><textarea id="look-measure-result" rows="4" aria-label="性能測定結果"></textarea></details><p id="look-message" role="status"></p>`,document.querySelector(`.panel`).prepend(e);let r=document.createElement(`div`);r.className=`look-dock`,r.innerHTML=`<button class="btn" id="look-dock-compare">基準／調整中</button><button class="btn" id="look-dock-view">3D／ドット</button><button class="btn" id="look-dock-play">再生／停止</button>`,document.querySelector(`.stage`).append(r),X(`look-dock-compare`).onclick=()=>{E.baseline=!E.baseline,I_()},X(`look-dock-view`).onclick=()=>{E.preview.view=E.preview.view===`dot`?`3d`:`dot`,I_()},X(`look-dock-play`).onclick=()=>{c_.paused=!c_.paused},X(`look-open`).addEventListener(`click`,()=>{d_(),I_(),F_(R_)});for(let[e,[t,n]]of Object.entries(C))for(let r of[``,`-number`])X(`look-`+e+r).addEventListener(`input`,r=>{let i=r.target.valueAsNumber,a=i/(e.endsWith(`Opacity`)?100:1);if(!Number.isFinite(a)||a<t||a>n)P_(`${T_[e]}は${e.endsWith(`Opacity`)?t*100:t}〜${e.endsWith(`Opacity`)?n*100:n}です`);else{E.values[e]=a;for(let t of[``,`-number`]){let n=X(`look-`+e+t);n!==r.target&&(n.value=String(i))}}});e.querySelectorAll(`[data-look-reset]`).forEach(e=>e.onclick=()=>{let t=e.dataset.lookReset;E.values[t]=S(b[t]),I_()}),X(`look-outlineMode`).onchange=()=>{E.values.outlineMode=X(`look-outlineMode`).value},X(`look-innerOutlineColor`).oninput=()=>{E.values.innerOutlineColor=X(`look-innerOutlineColor`).value},X(`look-mouth`).onchange=()=>{E.values.mouth=X(`look-mouth`).checked},X(`look-outlineColor`).oninput=()=>{E.values.outlineColor=X(`look-outlineColor`).value};for(let e of[`view`,`background`,`motion`,`direction`,`zoom`,`light`])X(`look-`+e).onchange=()=>{E.preview[e]=[`direction`,`zoom`].includes(e)?Number(X(`look-`+e).value):X(`look-`+e).value,e===`motion`&&f_()};for(let e of[`blink`,`autoDirection`])X(`look-`+e).onchange=()=>{E.preview[e]=X(`look-`+e).checked,e===`blink`&&w_(async()=>{let{expr:e}=await Promise.resolve().then(()=>zf);return{expr:e}},void 0,import.meta.url).then(({expr:e})=>{e.seq=[],e.autoBlink=E.preview.blink})};X(`look-compare`).onchange=()=>{E.baseline=X(`look-compare`).value===`baseline`},X(`look-play`).onclick=()=>{c_.paused=!c_.paused},X(`look-step`).onclick=__,X(`look-reset-time`).onclick=f_,X(`look-exit`).onclick=p_,X(`look-save`).onclick=()=>M_(`保存`,()=>{let e=oe(N_());if(R_(e.name),X(`look-saved`).value!==e.name)throw Error(`保存は完了しましたが一覧を更新できません。再読み込みして保存済み一覧を確認してください。`);j_(e.name),P_(`保存しました：${e.name}（この端末のブラウザ）`)}),X(`look-load`).onclick=()=>M_(`復元`,()=>{let e=ae()[X(`look-saved`).value];if(!e)throw Error(`保存済み設定を選んでください。`);let t=()=>{j_(e.name),P_(`設定を復元しました：`+e.name)},n=L_(e);if(n)return n.then(t);t()}),X(`look-paste`).onclick=()=>M_(`貼り付け復元`,()=>{let e=X(`look-json`).value;if(e.length>15e4)throw Error(`設定が大きすぎます`);let t=()=>{A_(),P_(`貼り付けた設定を復元しました。この端末に残す場合は保存してください。`)},n=L_(JSON.parse(e));if(n)return n.then(t);t()}),X(`look-copy`).onclick=()=>M_(`コピー`,async()=>{X(`look-json`).closest(`details`).open=!0;let e=JSON.stringify(T(N_()),null,2);X(`look-json`).value=e;try{await navigator.clipboard.writeText(e),P_(`設定をコピーしました（ファイルの書き出しではありません）。`)}catch(e){throw Error(`コピーできませんでした。内容欄を長押しして手動コピーできます。`+e.message)}}),Nd(),X(`look-measure`).onclick=()=>F_(()=>{c_.paused=!1,Od(N_())}),X(`look-measure-copy`).onclick=async()=>{try{let e=Ad();if(!e)throw Error(`測定結果がありません`);let t=JSON.stringify(e,null,2);X(`look-measure-result`).value=t,await navigator.clipboard.writeText(t),P_(`測定結果をコピーしました`)}catch(e){P_(`測定結果をコピーできませんでした。`+e.message)}},I_(),new URLSearchParams(location.search).get(`study`)===`look`&&(d_(),I_(),F_(R_))}var B_=e=>document.getElementById(e);function V_(e,t){let n=document.createElement(`section`);return n.className=`look-subsection`,n.innerHTML=`<h3>${t}</h3>`,e.append(n),n}function H_(){let e=B_(`look-whole`),t=V_(e,`ルック候補（設定一式）`);e.insertBefore(t,e.children[1]),t.innerHTML+=`<p id="look-preset-state" role="status"></p><button class="btn" id="look-preset-homura">ほむら・ルック候補01を開く</button><button class="btn ghost" id="look-preset-base">調整中を基準の設定に戻す</button><p class="note">現在の調整欄を置き換えます。残したい調整は先に保存・コピーしてください。基準・保存済み一覧・通常のキャラクターは変わりません。</p>`;let n=e=>{let t=N_();t.values=e,t.name=e.presetName,t.preview={...t.preview,direction:0,autoDirection:!1,light:`day`,lightSite:`default`,motion:`idle`,hair:!0,eyes:`auto`},t.playback={ticks:0,paused:!0},L_(t)};B_(`look-preset-homura`).onclick=()=>n(te()),B_(`look-preset-base`).onclick=()=>n(S(b));function r(){fp(),I_(),y()}let i=[];function a(e,t,n,a){let o=V_(e,n);o.classList.add(`homura-options`);let s=a.map(([e,n])=>{let i=document.createElement(`button`);return i.className=`btn ghost`,i.id=`look-`+t+`-`+e,i.textContent=n,i.onclick=()=>{E.values[t]=e,r()},o.append(i),{b:i,value:e}});return i.push(()=>s.forEach(({b:e,value:n})=>e.setAttribute(`aria-pressed`,String(E.values[t]===n)))),o}function o(e,t,n,a,o,s,c=1){let l=V_(e,n),u=document.createElement(`div`);u.className=`look-range`,l.append(u);let d=[`range`,`number`].map(e=>{let i=document.createElement(`input`);return i.id=`look-`+t+(e===`number`?`-number`:``),i.type=e,i.min=String(a),i.max=String(o),i.step=String(s),i.setAttribute(`aria-label`,n),i.oninput=()=>{let e=i.valueAsNumber;!Number.isFinite(e)||e<a||e>o||(E.values[t]=e/c,r())},u.append(i),i}),f=document.createElement(`button`);f.className=`btn ghost`,f.textContent=`初期値`,f.onclick=()=>{E.values[t]=b[t],r()},u.append(f),i.push(()=>d.forEach(e=>e.value=String(E.values[t]*c)))}a(B_(`look-head`),`headTiltScope`,`頭を上げる方向`,[[`front`,`正面だけ`],[`all`,`全方向（従来）`]]);let s=B_(`look-body`);a(s,`idleMotion`,`待機の動き`,[[`current`,`現在の待機`],[`none`,`待機の動きなし`]]);let c=document.createElement(`p`);c.className=`note`,c.textContent=`待機なしでは頭・胴体・腕・手・裾を固定。歩行とまばたきは別設定です。`,s.append(c);let l=B_(`look-hair`);a(l,`hairStyle`,`髪と目の関係`,[[`original`,`従来の髪`],[`eyes-visible`,`正面の目を見せる（候補）`],[`intentional-cover`,`目を隠す意図あり（従来形状）`]]),a(l,`frontFringe`,`正面の前髪の待機`,[[`follow`,`頭の待機に連動`],[`still`,`固定（頭の待機も止める）`]]);let u=document.createElement(`p`);u.className=`note`,u.textContent=`現行の前髪に独立した揺れはありません。固定は正面の頭の待機を抑えます。歩行時は頭に接続したままです。目を見せる候補は髪全体の位置と前髪の長さを調整し、全方向で同じ形を使います。`,l.append(u);let d=B_(`look-face`),f=e=>[...d.querySelectorAll(`.look-subsection`)].find(t=>t.querySelector(`h3`)?.textContent===e),p=f(`眉`);a(p,`browMode`,`眉の描き方`,[[`original`,`従来の眉`],[`front-overlay`,`正面で髪の上（眉だけ）`]]),o(p,`browGap`,`眉を目へ近づける（顔に対する比・＋で下へ）`,-.1,.1,.01);let m=document.createElement(`p`);m.className=`note`,m.textContent=`形は「配置・絵柄を編集」で変更。目からの距離とは別です。正面だけ表示し、前景の木などには隠れます。`,p.append(m);let h=f(`目・ハイライト`);o(h,`highlightOpacity`,`ハイライトの基本不透明度（%）`,0,100,5,100),o(h,`highlightLight`,`照明による減光の強さ（%）`,0,100,5,100);let g=document.createElement(`p`);g.className=`note`,g.textContent=`左右のハイライト個別の不透明度に、この基本値を掛けます。減光0%は従来、100%は顔の位置・向きと太陽・影・街灯を反映します。`,h.append(g);for(let e of[`鼻の基準位置`,`口`]){let t=f(e),n=document.createElement(`details`);n.innerHTML=`<summary>${e}の詳細</summary>`,t.before(n),n.append(t)}let _=V_(B_(`look-draw`),`ハイライトの照明比較`);for(let[e,t]of[[`day`,`昼`],[`dark`,`夜の暗がり`],[`lamp`,`夜の照明付近`],[`boundary`,`夜の明暗を移動`]]){let n=document.createElement(`button`);n.className=`btn ghost`,n.id=`look-light-scene-`+e,n.textContent=t,n.onclick=()=>{E.preview.light=e===`day`?`day`:`night`,E.preview.lightSite=e===`day`?`default`:e,E.preview.motion=e===`boundary`?`vertical`:`idle`,E.preview.direction=0,E.preview.autoDirection=!1,f_(),I_(),y()},_.append(n),i.push(()=>n.setAttribute(`aria-pressed`,String(e===`day`?E.preview.light===`day`&&E.preview.lightSite==="default":E.preview.light===`night`&&E.preview.lightSite===e)))}let v=document.createElement(`p`);v.className=`note`,v.textContent=`移動は「再生する」で開始。位置・照明・経路は設定コピーにも記録します。`,_.append(v),document.querySelector(`.look-save-row`).append(B_(`look-copy`)),B_(`look-copy`).classList.remove(`ghost`),B_(`look-copy`).setAttribute(`aria-label`,`設定をコピー（AIへ渡す・文字データ）`),B_(`look-copy`).title=`ブラウザ保存とは別に、復元できる設定全文をコピー`;function y(){i.forEach(e=>e()),B_(`look-preset-state`).textContent=`元の候補：${E.values.presetName}（調整は未採用）`}window.addEventListener(`look-controls-refreshed`,y),window.addEventListener(`look-restored`,y),document.addEventListener(`input`,()=>queueMicrotask(y)),document.addEventListener(`click`,()=>queueMicrotask(y)),y(),new URLSearchParams(location.search).get(`preset`)===`homura-01`&&n(te())}var Z=e=>document.getElementById(e);function U_(e){let t=Z(e);return t.closest(`label`)||t}function W_(e,t,n){let r=document.createElement(`section`);return r.id=t,r.className=`look-category`,r.innerHTML=`<h2>${n}</h2>`,e.append(r),r}function G_(e,t){let n=document.createElement(`section`);return n.className=`look-subsection`,n.innerHTML=`<h3>${t}</h3>`,e.append(n),n}function K_(e,...t){for(let n of t)e.append(U_(n))}function q_(e,t){let n=Z(`look-`+t).closest(`.look-range`),r=document.querySelector(`label[for="look-${t}"]`);r&&e.append(r),e.append(n)}function J_(e,t){let n=document.querySelector(`[data-face-value="${t}"]`);e.append(n.closest(`label`));let r=document.querySelector(`[data-face-reset="${t}"]`);r&&!e.contains(r)&&e.append(r)}function Y_(e){let t=Z(e);if(t.dataset.buttons)return;t.dataset.buttons=`true`,t.classList.add(`choice-source`),t.setAttribute(`aria-hidden`,`true`),t.tabIndex=-1;let n=document.createElement(`div`);n.className=`look-choices`,n.dataset.choiceFor=e,n.setAttribute(`role`,`group`),n.setAttribute(`aria-label`,t.closest(`label`)?.firstChild?.textContent||e);for(let e of t.options){let r=document.createElement(`button`);r.type=`button`,r.className=`btn ghost`,r.dataset.choice=e.value,r.textContent=e.text,r.onclick=()=>{t.value=e.value,t.dispatchEvent(new Event(`change`,{bubbles:!0})),X_()},n.append(r)}t.after(n)}function X_(){for(let e of document.querySelectorAll(`[data-choice-for]`)){let t=Z(e.dataset.choiceFor);for(let n of e.querySelectorAll(`button`))n.setAttribute(`aria-pressed`,String(n.dataset.choice===t.value)),n.disabled=!![...t.options].find(e=>e.value===n.dataset.choice)?.disabled}for(let e of document.querySelectorAll(`[data-direction]`))e.setAttribute(`aria-pressed`,String(!E.preview.autoDirection&&Number(e.dataset.direction)===E.preview.direction));Z(`look-dock-play`)&&(Z(`look-dock-compare`).textContent=E.baseline?`基準を表示中`:`調整中を表示中`,Z(`look-dock-compare`).setAttribute(`aria-pressed`,String(E.baseline)),Z(`look-dock-view`).textContent=E.preview.view===`dot`?`表示：ドット`:`表示：3D`,Z(`look-dock-view`).setAttribute(`aria-pressed`,String(E.preview.view===`3d`)),Z(`look-dock-play`).textContent=c_.paused?`▶ 再生する`:`Ⅱ 停止する`,Z(`look-dock-play`).setAttribute(`aria-pressed`,String(!c_.paused)),Z(`look-direction-state`).textContent=E.preview.autoDirection?`自動回転中（2秒ごと）`:`固定：${Z(`look-direction`).selectedOptions[0].text}`,A_())}function Z_(){let e=Z(`look-panel`),t=W_(e,`look-whole`,`全体`),n=W_(e,`look-head`,`頭`),r=W_(e,`look-face`,`顔`),i=W_(e,`look-hair`,`髪`),a=W_(e,`look-body`,`胴体・動き`),o=W_(e,`look-draw`,`描画`),s=Z(`look-name`).closest(`details`);s.open=!0,s.querySelector(`summary`).textContent=`この端末のブラウザに保存`,t.append(s);let c=document.createElement(`p`);c.className=`note`,c.textContent=`顔の絵柄・配置、頭、動き、線、表示条件と保存時の再生位置を保存します。画像やファイルの書き出しではありません。`,s.insertBefore(c,s.children[1]),Z(`look-save`).textContent=`この名前で保存`,Z(`look-load`).textContent=`選んだ設定を復元`,Z(`look-copy`).textContent=`設定をコピー`,Z(`look-paste`).textContent=`貼り付けから復元`;for(let e of[`look-save`,`look-load`,`look-paste`,`look-copy`])Z(e).dataset.saveAction=`true`;let l=document.createElement(`details`);l.innerHTML=`<summary>設定コピー・貼り付け（文字データ）</summary>`,s.append(l),K_(l,`look-copy`,`look-json`,`look-paste`),Z(`face-duplicate`).textContent=`現在の設定を別名で保存`,s.append(Z(`face-duplicate`)),Z(`face-duplicate`).dataset.saveAction=`true`,Z(`face-duplicate`).onclick=()=>{let e=Z(`look-name`);e.value=(e.value.slice(0,40)+` のコピー `+new Date().toLocaleTimeString(`ja-JP`,{hour12:!1})).slice(0,60),Z(`look-save`).click()},K_(t,`look-compare`,`look-view`,`look-background`);let u=G_(t,`向き`),d=document.createElement(`div`);d.className=`direction-compass`;let f=[3,4,5,2,-1,6,1,0,7],p=[`↓`,`↙`,`←`,`↖`,`↑`,`↗`,`→`,`↘`];for(let e of f){let t=document.createElement(e<0?`span`:`button`);e<0?t.textContent=`キャラ`:(t.textContent=p[e],t.className=`btn ghost`,t.dataset.direction=String(e),t.setAttribute(`aria-label`,Z(`look-direction`).options[e].text),t.onclick=()=>{let t=Z(`look-autoDirection`);t.checked=!1,t.dispatchEvent(new Event(`change`,{bubbles:!0}));let n=Z(`look-direction`);n.value=String(e),n.dispatchEvent(new Event(`change`,{bubbles:!0})),X_()}),d.append(t)}u.append(d),K_(u,`look-direction`,`look-autoDirection`),Z(`look-direction`).classList.add(`choice-source`);let m=document.createElement(`p`);m.id=`look-direction-state`,u.append(m),K_(n,`face-head-shape`),n.append(document.querySelector(`[data-face-reset="head.shape"]`)),J_(n,`head.size`),q_(n,`headTilt`),K_(n,`face-reset`),Z(`face-reset`).textContent=`顔・頭を基準に戻す`;let h=G_(r,`全体配置`);K_(h,`face-preset`,`face-preset-use`,`face-legacy`),Z(`face-preset-use`).textContent=`この顔をコピーして編集`;for(let e of[`width`,`height`,`x`,`y`])J_(h,`face.region.`+e);let g=G_(r,`眉`);J_(g,`face.linkBrows`),K_(g,`face-expression`);let _=G_(r,`目・ハイライト`);J_(_,`face.linkEyes`),K_(_,`look-blink`,`face-eye-state`,`face-blink-mode`);let v=G_(r,`鼻の基準位置`);for(let e of[`x`,`y`])J_(v,`face.nose.`+e);let y=G_(r,`口`);K_(y,`look-mouth`,`face-mouth-open`),y.append(document.querySelector(`[data-look-reset="mouth"]`));for(let[e,t]of[[g,`brows`],[_,`eyes`],[v,`extra`],[y,`mouth`]]){let n=document.createElement(`button`);n.className=`btn ghost`,n.textContent=t===`extra`?`鼻・そばかすを描く`:`配置・絵柄を編集`,n.onclick=()=>{let e=Z(`face-part`);e.value=t,e.dispatchEvent(new Event(`change`,{bubbles:!0})),Z(`face-workbench`).scrollIntoView({block:`start`,behavior:`smooth`})},e.append(n)}let b=G_(r,`選択した部位を編集`);b.id=`face-workbench`,K_(b,`face-part`,`face-side`,`face-layer`),J_(b,`face.mirrorArtwork`),K_(b,`face-grid`,`face-grid-info`);let x=Z(`face-pen`).parentElement;b.append(x),K_(b,`face-color`,`face-palette`,`face-part-fields`,`face-message`),K_(i,`face-hair`);let S=document.createElement(`p`);S.className=`note`,S.textContent=`髪を隠す表示は顔の確認用です。髪型の編集はまだありません。`,i.append(S),K_(a,`look-time`,`look-motion`,`look-play`,`look-step`,`look-reset-time`);for(let e of[`headIdle`,`bodyIdle`,`idleSpeed`])q_(a,e);K_(o,`look-outlineMode`,`look-outline-note`,`look-light`,`look-zoom`,`look-outlineColor`),o.append(document.querySelector(`[data-look-reset="outlineColor"]`)),q_(o,`outerOpacity`),K_(o,`look-innerOutlineColor`),o.append(document.querySelector(`[data-look-reset="innerOutlineColor"]`)),q_(o,`innerOpacity`);let C=Z(`look-measure`).closest(`details`);o.append(C),K_(o,`look-exit`,`look-message`);for(let t of[...e.children])t.classList.contains(`look-category`)||t.remove();for(let e of[`look-outlineMode`,`look-compare`,`look-view`,`look-motion`,`look-background`,`look-light`,`look-zoom`,`face-head-shape`,`face-preset`,`face-part`,`face-side`,`face-layer`,`face-eye-state`,`face-blink-mode`,`face-expression`])Y_(e);let w=Z(`stage`),T=document.createElement(`div`);T.className=`look-preview-column`,w.before(T),T.append(w);let D=document.querySelector(`.look-dock`);T.append(D),D.innerHTML=`<div class="look-toolbar-buttons"></div><div class="look-save-row"><span id="look-save-state" role="status">未保存の変更あり</span><button class="btn" id="look-dock-save" data-save-action>保存</button></div><p id="look-operation-result" role="status"></p>`;let ee=D.querySelector(`.look-toolbar-buttons`);for(let[e,t]of[[`compare`,`基準`],[`view`,`表示`],[`play`,`再生`]]){let n=document.createElement(`button`);n.id=`look-dock-`+e,n.className=`btn ghost`,n.textContent=t,n.onclick=()=>{if(e===`play`)Z(`look-play`).click();else{let t=Z(`look-`+(e===`compare`?`compare`:`view`));t.value=e===`compare`?E.baseline?`draft`:`baseline`:E.preview.view===`dot`?`3d`:`dot`,t.dispatchEvent(new Event(`change`,{bubbles:!0}))}X_()},ee.append(n)}Z(`look-dock-save`).onclick=()=>Z(`look-save`).click(),Z(`look-operation-result`).textContent=Z(`look-message`).textContent,document.addEventListener(`input`,()=>queueMicrotask(X_)),document.addEventListener(`change`,()=>queueMicrotask(X_)),document.addEventListener(`click`,()=>queueMicrotask(X_)),document.addEventListener(`pointerup`,()=>queueMicrotask(X_)),window.addEventListener(`look-controls-refreshed`,X_),window.addEventListener(`look-restored`,X_),document.addEventListener(`pointerdown`,e=>{let t=e.target.closest(`button`);t&&t.classList.add(`is-pressed`)});for(let e of[`pointerup`,`pointercancel`])document.addEventListener(e,()=>document.querySelectorAll(`.is-pressed`).forEach(e=>e.classList.remove(`is-pressed`)));setInterval(()=>{E.active&&X_()},500),X_(),window.dispatchEvent(new Event(`resize`))}var Q=e=>document.getElementById(e),$=`eyes`,Q_=`left`,$_=`normal`,ev=`pen`,tv=`#241a38`,nv=[],rv=[],iv=``,av=!1,ov=``,sv=()=>$===`extra`?null:$===`mouth`?E.values.face.mouth:E.values.face[$][Q_],cv=()=>{let e=E.values.face,t=sv();return $===`extra`?e.extra:$===`eyes`&&$_===`closed`?t.closed:$===`mouth`&&$_===`open`?e.mouth.open:t.image};function lv(){return JSON.stringify(E.values)}function uv(e){e!==lv()&&(nv.push(e),nv.length>60&&nv.shift(),rv=[])}function dv(){fp(),Sv()}function fv(e){Q(`face-message`).textContent=e}function pv(e,t=!0){let n=lv();try{e(),T(N_()),uv(n),fp(),Sv()}catch(e){E.values=JSON.parse(n),fv(e.message)}t&&xv()}function mv(e){return e.split(`.`).reduce((e,t)=>e[t],E.values)}function hv(e,t){let n=e.split(`.`),r=n.pop(),i=n.reduce((e,t)=>e[t],E.values);i[r]=t}function gv(e){return e.split(`.`).reduce((e,t)=>e[t],b)}function _v(e,t,n,r,i){return`<label>${t}<div class="look-range"><input type="range" data-face-value="${e}" min="${n}" max="${r}" step="${i}"><input type="number" aria-label="${t}" data-face-value="${e}" min="${n}" max="${r}" step="${i}"><button type="button" class="btn ghost" data-face-reset="${e}">初期値</button></div></label>`}function vv(e,t){return`<label><input type="checkbox" data-face-value="${e}">${t}</label><button class="btn ghost" data-face-reset="${e}">初期値</button>`}function yv(e){e.querySelectorAll(`[data-face-value]`).forEach(e=>{let t=e.dataset.faceValue;e.type===`checkbox`?e.checked=mv(t):e.value=String(mv(t)),e.onchange=()=>pv(()=>{if(hv(t,e.type===`checkbox`?e.checked:e.valueAsNumber),$===`eyes`||$===`brows`){let e=`face.${$}.${Q_}.`;t.startsWith(e)&&!t.startsWith(e+`highlight.`)&&f(E.values.face,$,Q_)}})}),e.querySelectorAll(`input[type=range][data-face-value]`).forEach(t=>{t.oninput=()=>{let n=t.dataset.faceValue;pv(()=>{hv(n,t.valueAsNumber),($===`eyes`||$===`brows`)&&n.startsWith(`face.${$}.${Q_}.`)&&!n.includes(`.highlight.`)&&f(E.values.face,$,Q_)},!1),e.querySelectorAll(`[data-face-value]`).forEach(e=>{e.dataset.faceValue===n&&(e.value=String(mv(n)))})}}),e.querySelectorAll(`[data-face-reset]`).forEach(e=>e.onclick=()=>pv(()=>{let t=e.dataset.faceReset;hv(t,S(gv(t))),t.startsWith(`face.${$}.${Q_}.`)&&!t.includes(`.highlight.`)&&($===`eyes`||$===`brows`)&&f(E.values.face,$,Q_)}))}function bv(){let e=sv(),t=$===`mouth`?`face.mouth`:`face.${$}.${Q_}`,n=``;if(e){for(let[e,r,i]of[[`x`,`配置範囲の横位置`,1],[`y`,`配置範囲の縦位置`,1],[`w`,`配置範囲の幅`,.5],[`h`,`配置範囲の高さ`,.5]])n+=_v(t+`.rect.`+e,r,e===`w`||e===`h`?1/48:0,i,1/96);n+=_v(t+`.imageScale`,`絵柄の拡大率（配置範囲は維持）`,.5,2,.05)}if($===`eyes`){n+=`<details><summary>まばたき・ハイライトの詳細</summary>`,n+=_v(t+`.closeAt`,`閉じる基準位置（目の上端0・下端1）`,0,1,.05)+_v(t+`.minHeight`,`閉じ目の最小高さ（顔に対する比）`,1/24,.2,1/96),n+=vv(t+`.highlight.show`,`ハイライトを表示`)+vv(t+`.highlight.hideClosed`,`閉じ目・半目ではハイライトを隠す`);for(let[e,r]of[[`x`,`横位置`],[`y`,`縦位置`],[`w`,`幅`],[`h`,`高さ`],[`opacity`,`不透明度`]])n+=_v(t+`.highlight.`+e,`ハイライトの`+r,0,1,.05);n+=`<button class="btn ghost" id="face-copy-highlight">反対の目にも同じ側のハイライト</button></details>`}if($===`brows`){n+=vv(t+`.neutralVisible`,`通常表情でも眉を表示`);let e=E.preview.expression;n+=_v(t+`.expressions.`+e+`.dy`,`選択中の表情：眉の上下移動`,-.15,.15,.01)+_v(t+`.expressions.`+e+`.angle`,`選択中の表情：眉の角度`,-35,35,1)}Q(`face-part-fields`).innerHTML=n,yv(Q(`face-part-fields`)),$===`eyes`&&(Q(`face-copy-highlight`).onclick=()=>pv(()=>{let e=E.values.face;e.eyes[Q_===`left`?`right`:`left`].highlight=S(e.eyes[Q_].highlight)}))}function xv(){Q(`face-legacy`).textContent=E.values.face.legacy?`元のドット配置で編集。設定操作では描画方式を変更しません。`:`頭表面の顔を編集。設定操作では描画方式を変更しません。髪は深度に従って顔を隠します。`,Q(`face-undo`).toggleAttribute(`disabled`,nv.length===0),Q(`face-redo`).toggleAttribute(`disabled`,rv.length===0);for(let e of[`shape`])Q(`face-head-`+e).value=E.values.head.shape;Q(`face-blink-mode`).value=E.values.face.blinkMode,Q(`face-eye-state`).value=E.preview.eyes,Q(`face-expression`).value=E.preview.expression,Q(`face-hair`).checked=E.preview.hair,Q(`face-mouth-open`).checked=E.preview.mouthOpen,yv(Q(`look-face-editor`)||Q(`look-panel`)),bv(),Sv(),I_()}function Sv(){let e=Q(`face-grid`).getContext(`2d`);e.clearRect(0,0,320,240),e.fillStyle=`#d8b69c`,e.fillRect(0,0,320,240),e.imageSmoothingEnabled=!1;let t=E.values.face,n=$_===`closed`?2:0;e.drawImage(vp(t,n,E.values.mouth,$_===`open`,E.preview.expression),0,0,320,240),e.strokeStyle=`#0003`,e.lineWidth=1;for(let t=0;t<=32;t++)e.beginPath(),e.moveTo(t*10+.5,0),e.lineTo(t*10+.5,240),e.stroke();for(let t=0;t<=24;t++)e.beginPath(),e.moveTo(0,t*10+.5),e.lineTo(320,t*10+.5),e.stroke();let r=sv();r&&(e.strokeStyle=`#663bdb`,e.lineWidth=2,e.strokeRect(r.rect.x*320,r.rect.y*240,r.rect.w*320,r.rect.h*240)),e.strokeStyle=`#088`,e.beginPath(),e.moveTo(t.nose.x*320-5,t.nose.y*240),e.lineTo(t.nose.x*320+5,t.nose.y*240),e.moveTo(t.nose.x*320,t.nose.y*240-5),e.lineTo(t.nose.x*320,t.nose.y*240+5),e.stroke(),Q(`face-grid-info`).textContent=`32×24 共通格子 · ${$===`extra`?`追加描画`:$===`eyes`?`目`:$===`brows`?`眉`:`口`} ${Q_===`left`?`本人の左`:`本人の右`} · 元絵柄 ${cv()[0].length}×${cv().length}。紫の範囲／鼻の十字は編集ガイドです。`}function Cv(e){let t=Q(`face-grid`).getBoundingClientRect(),n=(e.clientX-t.left)/t.width,r=(e.clientY-t.top)/t.height,i=sv(),a=cv(),o=i?.rect||{x:0,y:0,w:1,h:1},s=i?.imageScale||1;if(n<o.x||r<o.y||n>=o.x+o.w||r>=o.y+o.h)return;let c=Math.floor((((n-o.x)/o.w-.5)/s+.5)*a[0].length),l=Math.floor((((r-o.y)/o.h-.5)/s+.5)*a.length);if(c<0||l<0||c>=a[0].length||l>=a.length)return;let u=c+`,`+l;if(u===ov)return;let d=ov?ov.split(`,`).map(Number):[c,l],p=Math.max(Math.abs(c-d[0]),Math.abs(l-d[1]));for(let e=0;e<=p;e++){let t=p?e/p:0,n=Math.round(d[0]+(c-d[0])*t),r=Math.round(d[1]+(l-d[1])*t);a[r][n]=ev===`erase`?``:tv}ov=u,$===`brows`&&(sv().neutralVisible=!0),($===`eyes`||$===`brows`)&&f(E.values.face,$,Q_,!0),dv()}function wv(){Q(`look-face-editor`).innerHTML=`<details open><summary>顔・頭の研究</summary><p id="face-legacy" class="note"></p>
 <label>顔プリセット<select id="face-preset"><option value="original">現在の顔（基準）</option><option value="small">小さな目・少ない情報</option><option value="expressive">眉と頬のある顔</option></select></label><button class="btn" id="face-preset-use">複製して調整中へ</button><button class="btn ghost" id="face-duplicate">今の研究設定を複製</button><button class="btn ghost" id="face-reset">顔・頭を初期値へ</button>
 <div id="face-general"><label>頭形状<select id="face-head-shape"><option value="original">現在の球形</option><option value="round">横に少し丸い形</option><option value="cylinder">角を丸めた円柱形</option></select></label><button class="btn ghost" data-face-reset="head.shape">頭形状を初期値へ</button>${_v(`head.size`,`頭の大きさ（倍）`,.9,1.1,.01)}${_v(`face.region.width`,`頭に対する顔領域の幅`,.5,1,.01)}${_v(`face.region.height`,`頭に対する顔領域の高さ`,.4,.85,.01)}${_v(`face.region.x`,`顔全体の横位置（本人の左が＋）`,-.15,.15,.01)}${_v(`face.region.y`,`顔全体の縦位置（上が＋）`,-.15,.15,.01)}
 ${vv(`face.linkEyes`,`目の配置を左右連動`)}${vv(`face.linkBrows`,`眉の配置を左右連動`)}${vv(`face.mirrorArtwork`,`連動して描く絵柄を左右反転（配置対称とは別）`)}
 ${_v(`face.nose.x`,`鼻の基準・横位置（ガイドのみ）`,0,1,1/32)}${_v(`face.nose.y`,`鼻の基準・縦位置（ガイドのみ）`,0,1,1/24)}</div>
 <label><input id="face-hair" type="checkbox" checked>髪を表示（非表示は診断用）</label>
 <label>閉じ目の方式<select id="face-blink-mode"><option value="image">専用の閉じ目画像</option><option value="shrink">通常の目を縦に縮める</option></select></label>
 <label>目の表示<select id="face-eye-state"><option value="auto">まばたき設定に従う</option><option value="open">開いた目を固定</option><option value="closed">閉じた目を固定</option></select></label><label><input type="checkbox" id="face-mouth-open">開口状態を表示</label>
 <label>眉の比較表情<select id="face-expression"><option value="neutral">通常</option><option value="angry">きりっと</option><option value="sad">困り眉</option></select></label>
 <p>左右はキャラクター本人から見た左右です。配置の連動とハイライトは独立です。鼻・そばかすは「追加描画」に描くと、まばたきの変形を受けません。</p>
 <label>編集する部位<select id="face-part"><option value="brows">眉</option><option value="eyes" selected>目</option><option value="extra">追加描画（鼻・そばかす）</option><option value="mouth">口</option></select></label><label>左右<select id="face-side"><option value="left">本人の左</option><option value="right">本人の右</option></select></label><label>編集する絵柄<select id="face-layer"><option value="normal">通常</option><option value="closed">閉じ目（目）</option><option value="open">開口（口）</option></select></label>
 <div class="validation-actions"><button class="btn" id="face-pen">描く</button><button class="btn ghost" id="face-erase">消しゴム</button><button class="btn ghost" id="face-undo">元に戻す</button><button class="btn ghost" id="face-redo">やり直す</button></div><label>描く色<input type="color" id="face-color" value="#241a38"></label><div id="face-palette"></div>
 <canvas id="face-grid" width="320" height="240" aria-label="顔のドット編集格子"></canvas><p class="note" id="face-grid-info"></p><p class="note">格子内は描画操作、格子の外はスクロールです。配置範囲を変えても元の絵柄は保持します。保存・コピーは下の研究設定に顔も含みます。</p>
 <details><summary>選択した部位の配置・絵柄・閉じ目・ハイライト</summary><div id="face-part-fields"></div></details><p id="face-message" role="status"></p></details>`,Q(`face-preset-use`).onclick=()=>{let e=lv();E.values.face=u(Q(`face-preset`).value),uv(e),fp(),xv()},Q(`face-duplicate`).onclick=()=>{let e=Q(`look-name`);E.values=S(E.values),e.value=(e.value+` の複製`).slice(0,60),fv(`研究設定を複製しました。名前付き保存で別に残せます`),fp(),xv()},Q(`face-reset`).onclick=()=>{let e=lv();E.values.face=l(),E.values.head=S(b.head),uv(e),fp(),xv()},Q(`face-head-shape`).onchange=()=>{let e=lv();E.values.head.shape=Q(`face-head-shape`).value,uv(e),xv()};for(let e of[`part`,`side`,`layer`])Q(`face-`+e).onchange=()=>{$=Q(`face-part`).value,Q_=Q(`face-side`).value;let e=Q(`face-layer`);for(let t of e.options)t.disabled=t.value===`closed`?$!==`eyes`:t.value===`open`&&$!==`mouth`;e.selectedOptions[0].disabled&&(e.value=`normal`),$_=e.value,bv(),Sv()};Q(`face-blink-mode`).onchange=()=>pv(()=>E.values.face.blinkMode=Q(`face-blink-mode`).value),Q(`face-eye-state`).onchange=()=>{E.preview.eyes=Q(`face-eye-state`).value,K.seq=[]},Q(`face-expression`).onchange=()=>{E.preview.expression=Q(`face-expression`).value,E.preview.expression!==`neutral`&&fp(),xv()},Q(`face-hair`).onchange=()=>E.preview.hair=Q(`face-hair`).checked,Q(`face-mouth-open`).onchange=()=>{E.preview.mouthOpen=Q(`face-mouth-open`).checked,fp(),xv()};let e=e=>{ev=e;for(let e of[`pen`,`erase`])Q(`face-`+e).setAttribute(`aria-pressed`,String(e===ev)),Q(`face-`+e).classList.toggle(`ghost`,e!==ev)};e(`pen`),Q(`face-pen`).onclick=()=>{e(`pen`),fv(`描く：選択した部位の範囲をなぞってください`)},Q(`face-erase`).onclick=()=>{e(`erase`),fv(`消しゴム：選択した部位の範囲をなぞってください`)},Q(`face-color`).oninput=()=>tv=Q(`face-color`).value;for(let e of[`#241a38`,`#3f5aa6`,`#fffaf0`,`#bd7054`,`#c64747`]){let t=document.createElement(`button`);t.className=`face-swatch`,t.style.background=e,t.setAttribute(`aria-label`,`色 `+e),t.onclick=()=>{tv=e,Q(`face-color`).value=e},Q(`face-palette`).append(t)}let t=Q(`face-grid`);t.onpointerdown=e=>{e.button===0&&(e.preventDefault(),iv=lv(),av=!0,ov=``,t.setPointerCapture(e.pointerId),Cv(e))},t.onpointermove=e=>{av&&(e.preventDefault(),Cv(e))};let n=()=>{av&&(av=!1,uv(iv),xv())};t.onpointerup=n,t.onpointercancel=n,t.onlostpointercapture=n,Q(`face-undo`).onclick=()=>{nv.length&&(rv.push(lv()),E.values=JSON.parse(nv.pop()),fp(),xv())},Q(`face-redo`).onclick=()=>{rv.length&&(nv.push(lv()),E.values=JSON.parse(rv.pop()),fp(),xv())},window.addEventListener(`look-restored`,()=>{nv=[],rv=[],fp(),xv()}),xv()}var Tv=null;function Ev(e,t,n,r,i){let a=n*n*4;Tv&&Tv.length===a||(Tv=new Uint8Array(a)),J.readRenderTargetPixels(e,0,0,n,n,Tv);let o=t.createImageData(n,n);for(let e=0;e<n;e++){let t=(n-1-e)*n*4;o.data.set(Tv.subarray(t,t+n*4),e*n*4)}t.putImageData(o,r,i)}function Dv(e,t,n){let r=H.S;if(H.compare){let i=q.gx-Math.floor(q.gx),a=q.gy-Math.floor(q.gy);e%2==0?dd.forEach((e,o)=>{let s=e.f;hh(!!s[3]),sg({f1:!!s[0],f2:!!s[1],f3:!!s[2],face:H.face,angle:s[3]?t:n,subX:s[3]?0:i,subY:s[3]?0:a},eg),Ev(eg,qh[o].ctx,r,0,0)}):(hh(!0),fd.forEach((e,n)=>{sg({f1:!0,f2:!0,f3:!0,face:e.k,angle:t,subX:0,subY:0},eg),Ev(eg,Jh[n].ctx,r,0,0)}))}}function Ov(){function e(e,t){e.classList.toggle(`on`,t),e.setAttribute(`aria-checked`,t?`true`:`false`)}document.querySelectorAll(`.step`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.k;H[n]=!H[n],e(t,H[n])})});function t(e,t,n){document.querySelectorAll(e+` button`).forEach(r=>r.addEventListener(`click`,()=>{document.querySelectorAll(e+` button`).forEach(e=>e.classList.toggle(`on`,e===r)),n(r.dataset[t])}))}t(`#segS`,`s`,e=>{H.S=+e,pg()}),t(`#segFace`,`f`,e=>{H.face=e}),t(`#segTod`,`t`,e=>{H.tod=e}),document.querySelectorAll(`#emo button`).forEach(e=>e.addEventListener(`click`,()=>Bf(e.dataset.k)));let n=document.getElementById(`dot`),r=document.getElementById(`dotVal`);n.addEventListener(`input`,()=>{H.dot=+n.value,r.textContent=String(H.dot),mg()});let i=document.getElementById(`unwrap`),a=document.getElementById(`unwrapVal`);i.addEventListener(`input`,()=>{U.uUnwrap.value=i.value/100,a.textContent=i.value}),[[`tgAuto`,()=>H.auto=!H.auto],[`tgCmp`,()=>H.compare=!H.compare],[`tgShadow`,()=>H.shadow=!H.shadow],[`tgBlink`,()=>(K.autoBlink=!K.autoBlink,K.seq=[],K.autoBlink)]].forEach(([t,n])=>{let r=document.getElementById(t);r.addEventListener(`click`,()=>e(r,n()))})}function kv(){let e=document.getElementById(`dlg`),t=document.getElementById(`sheet`),n=t.getContext(`2d`);document.getElementById(`closeDlg`).addEventListener(`click`,()=>e.close()),document.getElementById(`bake`).addEventListener(`click`,()=>{let r=H.S,i=K.emote;K.emote=null;let a=K.seq;K.seq=[],t.width=r*4,t.height=r*8,n.clearRect(0,0,t.width,t.height);for(let e=0;e<8;e++)for(let t=0;t<4;t++)Ef(t/4),Uf(!0),sg({f1:H.f1,f2:H.f2,f3:H.f3,face:H.face,angle:e*Vu/8,subX:0,subY:0},eg),Ev(eg,n,r,t*r,e*r);K.emote=i,K.seq=a;let o=window.devicePixelRatio||1,s=Math.min(innerWidth*.86,640),c=Math.max(1,Math.floor(Math.min(s/(r*4),innerHeight*.6/(r*8))*o));t.style.width=r*4*c/o+`px`,t.style.height=r*8*c/o+`px`,document.getElementById(`dl`).href=t.toDataURL(`image/png`),document.getElementById(`sheetInfo`).textContent=`${r*4}×${r*8}px／行：下・右下・右・右上・上・左上・左・左下`,e.showModal()})}var Av=new Tr({uniforms:{image:{value:null},depth:{value:!1}},vertexShader:`varying vec2 uv0; void main(){uv0=uv; gl_Position=vec4(position.xy,0.,1.);}`,fragmentShader:`uniform sampler2D image; uniform bool depth; varying vec2 uv0; void main(){vec4 c=texture2D(image,uv0); gl_FragColor=depth?vec4(vec3(c.r),1.):vec4(c.rgb,1.);}`,depthTest:!1,depthWrite:!1}),jv=new mo;jv.add(new gr(new zr(2,2),Av));var Mv=new Er;function Nv(e){if(e===`final`)return;let t=H.f3||H.face===`pixel`,n=e===`color`?(H.f2?tg:ng).texture:e===`shadow`?H.shadow?Sh.texture:null:t?e===`depth`?rg.depthTexture:rg.texture:null;J.setRenderTarget(null),n?(Av.uniforms.image.value=n,Av.uniforms.depth.value=e===`depth`,J.render(jv,Mv)):(J.setClearColor(0,1),J.clear())}var Pv=0,Fv=60,Iv=performance.now(),Lv=0,Rv=document.getElementById(`hud`),zv={day:`昼`,evening:`夕方`,night:`夜`};function Bv(e){requestAnimationFrame(Bv);let t=performance.now(),n=Math.min(.1,(e-Iv)/1e3);if(Iv=e,Fv=Fv*.93+1/Math.max(n,.001)*.07,v_(n)){Lv=0;return}let r=0;if(yg)Lv=0,r=Jg(n);else{for(Lv+=n;Lv>=.016666666666666666&&r<6;)mh(e),Lv-=Ku,r++;r===6&&(Lv=0)}U.uTime.value=ah,Vv(),Nv(bg),Dv(Pv,rh,nh),r_(e,performance.now()-t,r),Pv%10==0&&(Rv.textContent=`${H.S}px／ドット×${H.dot}／${Math.round(Fv)}fps／${zv[H.tod]}／向き：${rd[oh]}`),Pv++}function Vv(e){let t=H.f4,n=Td(),r=Math.round(q.gx),i=Math.round(q.gy),a=q.gx*n,o=q.gy*n/Wu,s=Math.round(.9*Gu/n);Tf(H.face),hh(t),Dg()&&O.freezePose&&(Ef(.25),G.motion.position.set(0,0,0),G.motion.rotation.set(0,0,0)),G.root.position.set(a,0,o),G.root.rotation.y=Dg()&&O.freezePose?0:t?rh:nh;let c=Og();fg({f1:H.f1,f2:H.f2,f3:H.f3,face:H.face},a,o,c?.x??r,c?.y??-i+s,q.gx,q.gy,e)}Ov(),kv(),new ResizeObserver(mg).observe(Pm),pg(),mg(),s_(Vv),z_(),wv(),Z_(),H_(),document.addEventListener(`visibilitychange`,()=>{Iv=performance.now(),Lv=0}),requestAnimationFrame(Bv),document.getElementById(`status`).textContent=`起動しました · Three.js r128`,document.getElementById(`build-id`).textContent={buildId:`gh-42499868841-1-10422fc7d702`,commit:`10422fc7d702b63e06dd94f911704477a40a86f2`,builtAt:`2026-11-08T16:26:38.677Z`}.buildId,document.getElementById(`commit`).textContent={buildId:`gh-42499868841-1-10422fc7d702`,commit:`10422fc7d702b63e06dd94f911704477a40a86f2`,builtAt:`2026-11-08T16:26:38.677Z`}.commit,document.getElementById(`built-at`).textContent={buildId:`gh-42499868841-1-10422fc7d702`,commit:`10422fc7d702b63e06dd94f911704477a40a86f2`,builtAt:`2026-11-08T16:26:38.677Z`}.builtAt||`開発中`;