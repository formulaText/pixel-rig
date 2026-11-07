import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const entries = readFileSync('MANIFEST.sha256', 'utf8').trim().split('\n')
  .map(line => line.split('  '))
  .filter(([, path]) => /^(prototypes\/|references\/|archive\/original-documents\/)/.test(path));
assert.equal(entries.length, 18, '原本の登録数が変化しています');
for (const [expected, path] of entries) {
  const actual = createHash('sha256').update(readFileSync(path)).digest('hex');
  assert.equal(actual, expected, `原本不一致: ${path}`);
  console.log(`${actual}  ${path}`);
}
console.log('原本18件のSHA-256一致');
