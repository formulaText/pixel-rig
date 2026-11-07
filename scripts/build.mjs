import { build } from 'vite';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { hashes, verifyArtifact } from './artifact.mjs';

const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (process.env.GITHUB_ACTIONS === 'true' && execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()) {
  throw new Error('GitHubビルドには未コミットの変更を含められません');
}
const builtAt = new Date().toISOString();
const buildId = process.env.GITHUB_RUN_ID
  ? `gh-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}-${commit.slice(0, 12)}`
  : `local-${commit.slice(0, 12)}-${Date.now()}`;
const info = { buildId, commit, builtAt };
await build({ define: { __BUILD_INFO__: JSON.stringify(info) } });
writeFileSync('dist/THIRD_PARTY_LICENSES.txt', 'three 0.128.0\n\n' + readFileSync('node_modules/three/LICENSE', 'utf8')
  + '\n\nVite 8.3.6 (module preload helper)\n\n' + readFileSync('node_modules/vite/LICENSE.md', 'utf8'));
writeFileSync('dist/build.json', JSON.stringify({ ...info, files: hashes('dist') }, null, 2) + '\n');
verifyArtifact('dist');
console.log(`成果物: ${buildId} / ${commit}`);
