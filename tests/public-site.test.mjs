import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { updateSite } from '../scripts/site.mjs';
import { verifyPublicSite } from '../scripts/verify-public-site.mjs';

test('公開先のID・実ファイル・原本まで照合し、古い状態や配信破損を拒否', async t => {
  const site = mkdtempSync(join(tmpdir(), 'pixel-rig-public-'));
  t.after(() => rmSync(site, { recursive: true, force: true }));
  const state = updateSite({ site, candidate: 'dist', operation: 'candidate' });
  const url = 'https://example.test/pixel-rig/';
  const fetcher = async target => new Response(readFileSync(join(site, target.pathname.slice('/pixel-rig/'.length))));
  const options = { site, url, fetcher };
  const report = await verifyPublicSite(options);
  assert.equal(report.candidate, state.candidate.buildId);
  assert.equal(report.stable, null);
  for (const broken of ['site.json', 'candidate/build.json', 'candidate/index.html', 'stable/index.html', 'original/v5.html']) {
    await assert.rejects(verifyPublicSite({ ...options, fetcher: async target =>
      target.pathname.endsWith('/' + broken) ? new Response('{}') : fetcher(target) }));
  }
  await assert.rejects(verifyPublicSite({ ...options, fetcher: async () => new Response('', { status: 404 }) }), /HTTP 404/);
});
