// 配信成果物を /pixel-rig/{candidate,stable}/ で起動する。保存済みpages-stateには触れない。
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
import { updateSite } from '../../scripts/site.mjs';

const root = resolve('work/v6-02/site-smoke');
mkdirSync(root,{recursive:true});
const site = resolve(root,'pixel-rig');
const state=updateSite({site,candidate:'dist',operation:'candidate'});
// 一時サイトのみで昇格を模擬し、同一成果物のstableパスも起動する。
updateSite({site,operation:'promote',approved:true,actor:'test',owner:'test',expectedBuildId:state.candidate.buildId,
  approval:{approver:'test',buildId:state.candidate.buildId,statement:`ビルド ${state.candidate.buildId} の昇格を承認（ローカル模擬）`,source:'ローカル一時サイトのテスト用承認'}});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain'};
const server=createServer((req,res)=>{
  let p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
  if(!p.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  try{if(statSync(p).isDirectory())p=resolve(p,'index.html');res.setHeader('Content-Type',mime[extname(p)]||'application/octet-stream');res.end(readFileSync(p));}
  catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(5176,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],requests=new Set(),results=[];
try{
 for(const [name,viewport]of [['portrait',{width:393,height:852}],['landscape',{width:852,height:393}]]){
  const p=await browser.newPage({viewport,deviceScaleFactor:3,hasTouch:true,isMobile:true,acceptDownloads:true});
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  p.on('response',r=>{requests.add(r.url());if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await p.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:5176/')?route.continue():route.abort());
  await p.goto('http://127.0.0.1:5176/pixel-rig/');
  await p.locator('a[href="./candidate/"]').click();
  await p.waitForFunction(()=>document.getElementById('hud')?.textContent.includes('fps'));
  assert.equal(await p.locator('#build-id').textContent(),state.candidate.buildId);
  assert.equal(await p.locator('#commit').textContent(),state.candidate.commit);
  assert.equal(await p.locator('iframe').count(),0);
  assert.equal(await p.evaluate(()=>typeof window.__rig),'undefined');
  assert(await p.locator('#view').evaluate(c=>c.width>0&&c.height>0));
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  assert.equal(overflow,false,`${name} horizontal overflow`);
  const actions=['#segTod [data-t="night"]','#tgShadow','#emo [data-k="joy"]','#segS [data-s="48"]','#segFace [data-f="uv"]','.step[data-k="f2"]','#tgAuto','#tgBlink','#tgCmp'];
  for(const selector of actions)await p.locator(selector).tap();
  await p.locator('#unwrap').evaluate(e=>{e.value='0';e.dispatchEvent(new Event('input',{bubbles:true}));});
  for(const dot of [2,7])await p.locator('#dot').evaluate((e,d)=>{e.value=String(d);e.dispatchEvent(new Event('input',{bubbles:true}));},dot);
  await p.locator('#bake').tap();
  assert(await p.locator('#dlg').evaluate(d=>d.open));
  const [w,h]=await p.locator('#sheet').evaluate(c=>[c.width,c.height]);assert.deepEqual([w,h],[192,384]);
  const download= p.waitForEvent('download');await p.locator('#dl').tap();const file=await download;
  await file.saveAs(`${root}/${name}-sprite_sheet.png`);assert.equal(file.suggestedFilename(),'sprite_sheet.png');
  assert.equal(readFileSync(`${root}/${name}-sprite_sheet.png`).subarray(1,4).toString(),'PNG');
  await p.locator('#closeDlg').tap();assert.equal(await p.locator('#dlg').evaluate(d=>d.open),false);
  await p.locator('a[href="../"]').tap();await p.waitForURL('**/pixel-rig/');assert.equal(new URL(p.url()).pathname,'/pixel-rig/');
  await p.locator('a[href="./stable/"]').click();await p.waitForFunction(()=>document.getElementById('hud')?.textContent.includes('fps'));
  assert.equal(await p.locator('#build-id').textContent(),state.candidate.buildId);
  await p.reload();await p.waitForFunction(()=>document.getElementById('hud')?.textContent.includes('fps'));
  assert.equal(await p.locator('#commit').textContent(),state.candidate.commit);
  const stage=await p.locator('#stage').boundingBox();const panel=await p.locator('.panel').boundingBox();
  assert(panel.y>=stage.y+stage.height-1 || panel.x>=stage.x+stage.width-1,'panel overlaps stage');
  await p.screenshot({path:`${root}/${name}.png`});
  results.push({name,viewport,dpr:3,buildId:state.candidate.buildId,commit:state.candidate.commit,png:[w,h],overflow,stage,panel});
  await p.close();
 }
 assert.deepEqual(errors,[]);
 assert([...requests].every(url=>url.startsWith('http://127.0.0.1:5176/')));
 writeFileSync(`${root}/result.json`,JSON.stringify({browser:await browser.version(),errors,requests:[...requests],results},null,2)+'\n');
 console.log('Built site: portrait/landscape, candidate/stable, controls, PNG download, identity, return, reload, assets passed.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
