// Research data is separate from game defaults. All persisted data is validated.
export interface LookValues {
  headTilt: number; headIdle: number; bodyIdle: number; idleSpeed: number;
  mouth: boolean; outlineColor: string; outerOpacity: number; innerOpacity: number;
  head: { shape: 'original'; size: number }; face: { preset: 'original' };
}
export interface Preview {
  view: 'dot'|'3d'; background:'plain'|'map'; motion:'still'|'idle'|'walk'|'vertical'|'diagonal';
  direction:number; autoDirection:boolean; blink:boolean; zoom:number; light:'day'|'evening'|'night';
}
export interface LookDocument { schema:1; name:string; buildId:string; values:LookValues; preview:Preview; playback:{ticks:number;paused:boolean} }
export const BASE: LookValues={headTilt:0,headIdle:1,bodyIdle:1,idleSpeed:1,mouth:false,outlineColor:'#1a0f2b',outerOpacity:1,innerOpacity:1,head:{shape:'original',size:1},face:{preset:'original'}};
export const PREVIEW:Preview={view:'dot',background:'map',motion:'idle',direction:0,autoDirection:false,blink:true,zoom:1,light:'day'};
export const clone=<T>(v:T):T=>JSON.parse(JSON.stringify(v));
export const limits={headTilt:[0,12,.5],headIdle:[0,1.5,.05],bodyIdle:[0,1.5,.05],idleSpeed:[.25,2,.05],outerOpacity:[0,1,.05],innerOpacity:[0,1,.05]} as const;
function object(v:unknown): asserts v is Record<string,any> {if(!v||typeof v!=='object'||Array.isArray(v))throw Error('設定はオブジェクトで指定してください');}
export function validateDocument(input:unknown):LookDocument {
 object(input);if(input.schema!==1)throw Error('未対応のスキーマ版です（対応：1）。元データは変更しません');
 if(typeof input.name!=='string'||!input.name.trim()||input.name.length>60)throw Error('設定名は1〜60文字にしてください');
 if(typeof input.buildId!=='string'||input.buildId.length>120)throw Error('ビルドIDが不正です');
 const v=input.values,p=input.preview;object(v);object(p);
 object(input.playback);if(!Number.isInteger(input.playback.ticks)||input.playback.ticks<0||input.playback.ticks>36000||typeof input.playback.paused!=='boolean')throw Error('再生時刻は0〜600秒にしてください');
 for(const [k,[min,max]]of Object.entries(limits))if(typeof v[k]!=='number'||!Number.isFinite(v[k])||v[k]<min||v[k]>max)throw Error(`${k} は ${min}〜${max} の数値にしてください`);
 if(typeof v.mouth!=='boolean'||!/^#[0-9a-f]{6}$/i.test(v.outlineColor))throw Error('口の設定または輪郭色が不正です');
 object(v.head);object(v.face);if(v.head.shape!=='original'||v.head.size!==1||v.face.preset!=='original')throw Error('この版で未対応の顔・頭形状です');
 for(const [k,allowed]of Object.entries({view:['dot','3d'],background:['plain','map'],motion:['still','idle','walk','vertical','diagonal'],light:['day','evening','night']}))if(!allowed.includes(p[k]))throw Error(`プレビューの ${k} が不正です`);
 if(!Number.isInteger(p.direction)||p.direction<0||p.direction>7||typeof p.autoDirection!=='boolean'||typeof p.blink!=='boolean'||![1,2,3].includes(p.zoom))throw Error('方向・まばたき・拡大率が不正です');
 return clone({schema:1,name:input.name.trim(),buildId:input.buildId,values:v,preview:p,playback:input.playback}) as LookDocument;
}
export const research={active:false,baseline:false,values:clone(BASE),preview:clone(PREVIEW)};
export function effectiveLook(){return research.active&&!research.baseline?research.values:BASE;}
