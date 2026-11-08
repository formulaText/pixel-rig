import {validateDocument,type LookDocument} from './model';
export const storageKey='pixel-rig-look-library-v1';
export function readLibrary():Record<string,LookDocument>{
 const raw=localStorage.getItem(storageKey);if(!raw)return Object.create(null);
 let v:unknown;try{v=JSON.parse(raw);}catch{throw Error('保存データを読み取れません。元のデータは上書きしていません。設定コピーで現在の調整を退避してください。');}
 if(!v||typeof v!=='object'||Array.isArray(v))throw Error('保存領域の形式が不正です。上書きせず保持しています。');
 return Object.assign(Object.create(null),v);
}
export function persistDocument(value:unknown){
 const d=validateDocument(value),all=readLibrary();
 if(Object.keys(all).length>=30&&!Object.hasOwn(all,d.name))throw Error('保存は30件までです。既存の名前で更新するか、設定をコピーして退避してください。');
 all[d.name]=d;const encoded=JSON.stringify(all);
 localStorage.setItem(storageKey,encoded);
 // Confirm persistence before updating the list or claiming success.
 if(localStorage.getItem(storageKey)!==encoded)throw Error('ブラウザへの保存を確認できません。設定をコピーして退避し、ブラウザの保存制限を確認してください。');
 return d;
}
export function storageError(error:unknown){
 const e=error as Error;
 if(e?.name==='QuotaExceededError')return 'ブラウザの保存容量が不足しています。設定をコピーして退避し、空き容量やブラウザの保存制限を確認してください。';
 if(e?.name==='SecurityError')return 'このブラウザでは保存領域を利用できません。Safariの通常タブで開くか、設定をコピーして退避してください。';
 return `${e?.message||String(error)} 必要なら「設定をコピー」で現在の調整を退避してください。`;
}
