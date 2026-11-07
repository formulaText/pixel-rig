import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { sha256, verifyArtifact } from './artifact.mjs';

export async function verifyPublicSite({ site, url, fetcher = fetch }) {
  const base = new URL(url.endsWith('/') ? url : url + '/');
  const get = async path => {
    const target = new URL(path, base);
    assert(target.href.startsWith(base.href), '公開先外のパス');
    target.searchParams.set('verify', `${Date.now()}`);
    const response = await fetcher(target, { cache: 'no-store', signal: AbortSignal.timeout(20000) });
    assert(response.ok, `公開先HTTP ${response.status}: ${path}`);
    return Buffer.from(await response.arrayBuffer());
  };
  const expected = JSON.parse(readFileSync(join(site, 'site.json'), 'utf8'));
  const actual = JSON.parse((await get('site.json')).toString());
  assert.deepEqual(actual, expected, '公開状態と保存状態が不一致');
  const paths = ['index.html', 'original/v5.html'];
  for (const channel of ['stable', 'candidate']) {
    if (expected[channel]) {
      assert.deepEqual(verifyArtifact(join(site, channel)), expected[channel]);
      paths.push(`${channel}/build.json`, ...Object.keys(expected[channel].files).map(p => `${channel}/${p}`));
    } else paths.push(`${channel}/index.html`);
  }
  for (const path of paths) {
    assert.equal(sha256(await get(path)), sha256(readFileSync(join(site, path))), `公開ファイル不一致: ${path}`);
  }
  return { url: base.href, stable: expected.stable?.buildId ?? null, candidate: expected.candidate?.buildId ?? null,
    originalSha256: expected.original.sha256, verifiedFiles: paths.length + 1 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const attempts = Number(process.env.VERIFY_ATTEMPTS || 12);
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      console.log(JSON.stringify(await verifyPublicSite({ site: process.env.SITE_DIR, url: process.env.PUBLIC_URL })));
      break;
    } catch (error) {
      if (attempt === attempts) throw error;
      console.log(`公開反映待ち ${attempt}/${attempts}: ${error.message.slice(0,300)}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}
