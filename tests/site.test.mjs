import test from 'node:test';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { updateSite } from '../scripts/site.mjs';
import { hashes, verifyArtifact } from '../scripts/artifact.mjs';

function setup(t) {
  const root = mkdtempSync(join(tmpdir(), 'pixel-rig-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const site = join(root, 'site');
  const candidate = join(root, 'candidate');
  cpSync('dist', candidate, { recursive: true });
  return { site, candidate, operation: 'candidate' };
}
const approve = state => ({ operation: 'promote', approved: true, actor: 'owner', owner: 'owner', expectedBuildId: state.candidate.buildId });

test('初回未確定→明示昇格→候補更新でも確認済み成果物を全バイト保持', t => {
  const options = setup(t);
  const first = updateSite(options);
  assert.equal(first.stable, null);
  assert.match(readFileSync(join(options.site, 'stable/index.html'), 'utf8'), /未確定/);
  assert.match(readFileSync(join(options.site, 'index.html'), 'utf8'), /原本v5/);
  const promoted = updateSite({ ...options, ...approve(first) });
  assert.deepEqual(promoted.stable, first.candidate);
  assert.deepEqual(hashes(join(options.site, 'stable')), hashes(options.candidate));
  const before = hashes(join(options.site, 'stable'));
  const manifestBefore = readFileSync(join(options.site, 'stable/build.json'), 'utf8');
  // 別の候補を模擬し、内容とビルドIDを両方変更する。
  const info = verifyArtifact(options.candidate);
  for (const path of Object.keys(info.files).filter(path => path.endsWith('.js'))) {
    const file = join(options.candidate, path);
    writeFileSync(file, readFileSync(file, 'utf8').replaceAll(info.buildId, info.buildId + '-next'));
  }
  info.buildId += '-next';
  info.files = hashes(options.candidate);
  writeFileSync(join(options.candidate, 'build.json'), JSON.stringify(info));
  const updated = updateSite(options);
  assert.equal(updated.candidate.buildId, info.buildId);
  assert.equal(updated.stable.buildId, first.candidate.buildId);
  assert.deepEqual(hashes(join(options.site, 'stable')), before);
  assert.equal(readFileSync(join(options.site, 'stable/build.json'), 'utf8'), manifestBefore);
  assert.throws(() => updateSite({ ...options, ...approve(first) }), /ビルドID/);
  assert.deepEqual(hashes(join(options.site, 'stable')), before);
});

test('未承認・他者・候補なし・成果物改変を拒否', t => {
  const options = setup(t);
  assert.throws(() => updateSite({ ...options, ...approve({ candidate: { buildId: 'none' } }) }), /ビルドID/);
  const state = updateSite(options);
  assert.throws(() => updateSite({ ...options, ...approve(state), approved: false }), /明示承認/);
  assert.throws(() => updateSite({ ...options, ...approve(state), actor: 'other' }), /明示承認/);
  writeFileSync(join(options.candidate, 'index.html'), 'broken');
  assert.throws(() => updateSite(options), /不一致/);
  assert.deepEqual(verifyArtifact(join(options.site, 'candidate')), state.candidate);
});

test('保存済み確認済み版の破損は配信を停止し、空の状態へ戻さない', t => {
  const options = setup(t);
  const state = updateSite(options);
  updateSite({ ...options, ...approve(state) });
  writeFileSync(join(options.site, 'stable/index.html'), 'broken');
  assert.throws(() => updateSite(options), /不一致/);
  rmSync(join(options.site, 'site.json'));
  assert.throws(() => updateSite(options), /状態記録/);
});

test('リポジトリ配下・両系統のリンクとJS/CSS参照、無改変原本', t => {
  const options = setup(t);
  const state = updateSite(options);
  updateSite({ ...options, ...approve(state) });
  for (const path of ['index.html', 'candidate/index.html', 'stable/index.html']) {
    const html = readFileSync(join(options.site, path), 'utf8');
    for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (link.startsWith('data:')) continue; // インラインfaviconはHTTP参照ではない。
      const url = new URL(link, `https://example.test/pixel-rig/${path}`);
      assert(url.pathname.startsWith('/pixel-rig/'), `base外: ${url}`);
      let local = url.pathname.slice('/pixel-rig/'.length);
      if (!local || local.endsWith('/')) local += 'index.html';
      assert.doesNotThrow(() => readFileSync(join(options.site, local)), `リンク切れ: ${url}`);
    }
  }
  assert.deepEqual(readFileSync(join(options.site, 'original/v5.html')), readFileSync('prototypes/v5_pixel-rig-poc.html'));
});


test('Gitに保存してarchiveした配信全体も両系統のID・全ファイルと一致', t => {
  const options = setup(t);
  const first = updateSite(options);
  const state = updateSite({ ...options, ...approve(first) });
  const git = (...args) => execFileSync('git', ['-C', options.site, ...args], { stdio: 'pipe' });
  git('init');
  git('add', '.');
  git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'Test site');
  const archive = join(options.site, '..', 'site.tar');
  writeFileSync(archive, git('archive', 'HEAD'));
  const upload = join(options.site, '..', 'upload');
  mkdirSync(upload);
  execFileSync('tar', ['-xf', archive, '-C', upload]);
  assert.deepEqual(verifyArtifact(join(upload, 'stable')), state.stable);
  assert.deepEqual(verifyArtifact(join(upload, 'candidate')), state.candidate);
  assert.deepEqual(JSON.parse(readFileSync(join(upload, 'site.json'))), state);
  assert.deepEqual(readFileSync(join(upload, 'original/v5.html')), readFileSync('prototypes/v5_pixel-rig-poc.html'));
});

test('ファイルハッシュが正しくても表示と異なるビルドID・コミットは拒否', t => {
  const options = setup(t);
  const info = verifyArtifact(options.candidate);
  writeFileSync(join(options.candidate, 'build.json'), JSON.stringify({ ...info, buildId: 'different' }));
  assert.throws(() => updateSite(options), /識別情報/);
  writeFileSync(join(options.candidate, 'build.json'), JSON.stringify({ ...info, commit: 'a'.repeat(40) }));
  assert.throws(() => updateSite(options), /識別情報/);
});
