import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { sha256, verifyArtifact } from './artifact.mjs';

const originalPath = 'prototypes/v5_pixel-rig-poc.html';
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const page = (title, body) => `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#141b25;color:#edf3fa}body{margin:0;padding:24px}main{max-width:760px;margin:auto;line-height:1.8}section{border-top:1px solid #4c5f75;margin-top:24px}a{color:#9cd8ff;display:inline-block;padding:12px 0}code{overflow-wrap:anywhere}dt{margin-top:12px}dd{margin:0;overflow-wrap:anywhere}</style></head><body><main>${body}</main></body></html>\n`;
const details = info => info ? `<dl><dt>ビルドID</dt><dd><code>${escape(info.buildId)}</code></dd><dt>元のコミット</dt><dd><code>${escape(info.commit)}</code></dd><dt>ビルド日時（UTC）</dt><dd>${escape(info.builtAt)}</dd></dl>` : '<p>未確定 — 原本v5を比較先としてご利用ください。</p>';

export function updateSite({ site, candidate, operation, expectedBuildId = '', approved = false, actor = '', owner = '' }) {
  assert(['candidate', 'promote'].includes(operation), '操作が不正');
  const statePath = join(site, 'site.json');
  const hasState = existsSync(statePath);
  // 既存サイトの記録欠落を新規サイトとして初期化しない。
  assert(hasState || !existsSync(join(site, 'index.html')), '既存サイトの状態記録がありません');
  const state = hasState ? JSON.parse(readFileSync(statePath, 'utf8')) : { schema: 1, stable: null, candidate: null };
  assert.equal(state.schema, 1);
  for (const channel of ['stable', 'candidate']) {
    if (state[channel]) assert.deepEqual(verifyArtifact(join(site, channel)), state[channel]);
    else assert(!existsSync(join(site, channel, 'build.json')), `${channel}の記録が欠落`);
  }
  const original = readFileSync(originalPath);
  const expectedHash = readFileSync('MANIFEST.sha256', 'utf8').split('\n').find(line => line.endsWith('  ' + originalPath))?.split('  ')[0];
  assert.equal(sha256(original), expectedHash, '原本が配布版と不一致');
  if (hasState) {
    assert.equal(state.original.sha256, expectedHash);
    assert.equal(sha256(readFileSync(join(site, 'original/v5.html'))), expectedHash);
  }
  if (operation === 'candidate') {
    const info = verifyArtifact(candidate);
    rmSync(join(site, 'candidate'), { recursive: true, force: true });
    cpSync(candidate, join(site, 'candidate'), { recursive: true });
    state.candidate = info;
  } else {
    assert(approved && actor && actor === owner, '依頼者本人の実機確認・明示承認が必要');
    assert(state.candidate && expectedBuildId === state.candidate.buildId, '承認したビルドIDと現在の候補が不一致');
    rmSync(join(site, 'stable'), { recursive: true, force: true });
    cpSync(join(site, 'candidate'), join(site, 'stable'), { recursive: true });
    state.stable = verifyArtifact(join(site, 'stable'));
    state.approval = { actor, buildId: expectedBuildId, at: new Date().toISOString() };
  }
  if (!hasState) {
    mkdirSync(join(site, 'original'), { recursive: true });
    writeFileSync(join(site, 'original/v5.html'), original);
    state.original = {
      path: originalPath, sha256: expectedHash,
      commit: execFileSync('git', ['log', '-1', '--format=%H', '--', originalPath], { encoding: 'utf8' }).trim(),
    };
  }
  if (!state.stable) {
    mkdirSync(join(site, 'stable'), { recursive: true });
    writeFileSync(join(site, 'stable/index.html'), page('確認済み版 — 未確定', '<h1>確認済み版：未確定</h1><p>最初の実機確認と明示承認を待っています。</p><p><a href="../original/v5.html">原本v5（比較用）を開く</a></p><a href="../">入口へ戻る</a>'));
  }
  writeFileSync(join(site, 'index.html'), page('Pixel Rig — 入口', `<h1>Pixel Rig</h1><p>研究アプリの確認先を選んでください。</p>
<section><h2><a href="./stable/">確認済み版</a></h2>${details(state.stable)}</section>
<section><h2><a href="./candidate/">検証候補</a></h2><p>iPhone実機での確認・承認前の内容です。</p>${details(state.candidate)}</section>
<section><h2><a href="./original/v5.html">原本v5（比較用）</a></h2><p>配布時のHTMLを変更せず保存。Three.js r128を外部CDNから読み込みます。</p><p>原本ファイル：<code>${originalPath}</code><br>登録コミット：<code>${escape(state.original.commit)}</code><br>SHA-256：<code>${escape(state.original.sha256)}</code></p></section>`));
  writeFileSync(join(site, '.nojekyll'), '');
  writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');
  return state;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const state = updateSite({
    site: process.env.SITE_DIR || 'work/site', candidate: process.env.CANDIDATE_DIR || 'dist',
    operation: process.env.OPERATION || 'candidate', expectedBuildId: process.env.EXPECTED_BUILD_ID,
    approved: process.env.APPROVED === 'true', actor: process.env.ACTOR, owner: process.env.OWNER,
  });
  console.log(JSON.stringify({ stable: state.stable?.buildId ?? '未確定', candidate: state.candidate?.buildId }));
}
