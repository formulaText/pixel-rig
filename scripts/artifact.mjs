import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

export const sha256 = data => createHash('sha256').update(data).digest('hex');
export function files(root, prefix = '') {
  return readdirSync(join(root, prefix)).sort().flatMap(name => {
    const path = prefix + name;
    const stat = lstatSync(join(root, path));
    assert(!stat.isSymbolicLink(), '成果物のsymlinkは禁止');
    return stat.isDirectory() ? files(root, path + '/') : [path];
  });
}
export function hashes(root) {
  return Object.fromEntries(files(root).filter(path => path !== 'build.json')
    .map(path => [path, sha256(readFileSync(join(root, path)))]));
}
export function verifyArtifact(root) {
  const info = JSON.parse(readFileSync(join(root, 'build.json'), 'utf8'));
  assert.match(info.buildId, /^[a-zA-Z0-9._-]+$/);
  assert.match(info.commit, /^[a-f0-9]{40}$/);
  assert(!Number.isNaN(Date.parse(info.builtAt)));
  assert.deepEqual(hashes(root), info.files, '配信ファイルとビルド記録が不一致');
  assert(info.files['index.html'] && info.files['THIRD_PARTY_LICENSES.txt']);
  const js = Object.keys(info.files).filter(path => path.endsWith('.js'))
    .map(path => readFileSync(join(root, path), 'utf8')).join('\n');
  assert(js.includes(info.buildId) && js.includes(info.commit), '画面のビルド識別情報が不一致');
  return info;
}
