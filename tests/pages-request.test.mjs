import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRequest, commandPrefix } from '../scripts/pages-request.mjs';
const id = 'gh-123-1-abcdef123456';
const candidate = { operation: 'candidate', source_ref: 'a'.repeat(40), executor_label: 'Codex' };
const promotion = { operation: 'promote', expected_build_id: id, iphone_approved: true,
  approval_by: 'owner', approval_text: `ビルド ${id} をiPhoneで確認済み。昇格を承認します。`, approval_source: 'Codexへの依頼 2026-11-07', executor_label: 'Codex' };
function args(input, actor = 'owner') {
  return { eventName: 'issue_comment', actor, ref: 'refs/heads/main', runUrl: 'https://github.com/o/r/actions/runs/1',
    event: { action: 'created', repository: { owner: { login: 'owner', type: 'User' } },
      issue: { pull_request: {} }, comment: { user: { login: actor }, body: commandPrefix + JSON.stringify(input),
        html_url: 'https://github.com/o/r/pull/1#issuecomment-2' } } };
}
test('PRコメントとdispatchを同じ承認要求へ正規化', () => {
  const comment = parseRequest(args(promotion));
  const input = args(promotion);
  input.eventName = 'workflow_dispatch'; input.event.inputs = { ...promotion, iphone_approved: 'true' };
  const dispatch = parseRequest(input);
  assert.deepEqual(dispatch.approval, comment.approval);
  assert.equal(comment.requestUrl, input.event.comment.html_url);
  assert.equal(comment.executorLabel, 'Codex');
  assert.equal(parseRequest(args(candidate)).sourceRef, candidate.source_ref);
});
test('明示登録された委任先だけを許可し、承認者は所有者のまま保持', () => {
  const delegated = { ...args(promotion, 'delegate'), delegates: 'delegate' };
  assert.equal(parseRequest(delegated).approval.approver, 'owner');
  assert.equal(parseRequest(delegated).actor, 'delegate');
  assert.throws(() => parseRequest({ ...delegated, delegates: '' }), /実行者/);
  assert.throws(() => parseRequest({ ...delegated, triggeringActor: 'stranger' }), /実行者/);
  assert.throws(() => parseRequest(args({ ...promotion, approval_by: 'delegate' })), /明示承認/);
});
test('未承認・対象なし・受領元なし・別ブランチ・編集・通常コメントを拒否', () => {
  for (const patch of [{ iphone_approved: false }, { iphone_approved: 'false' }, { expected_build_id: '' },
    { expected_build_id: 'gh-124-1-abcdef123456' }, { approval_text: '' }, { approval_source: '' },
    { expected_build_id: 'local-example' }, { operation: 'other' }, { extra: 'ignored?' }]) {
    assert.throws(() => parseRequest(args({ ...promotion, ...patch })));
  }
  assert.throws(() => parseRequest(args({ ...candidate, iphone_approved: true })));
  for (const source_ref of ['../main', 'main\noperation=promote', '$(id)', '-main']) {
    assert.throws(() => parseRequest(args({ ...candidate, source_ref })));
  }
  assert.throws(() => parseRequest({ ...args(candidate), ref: 'refs/heads/feature' }));
  for (const mutate of [a => a.event.action = 'edited', a => delete a.event.issue.pull_request,
    a => a.event.comment.body = '通常のコメント', a => a.event.comment.user.login = 'stranger',
    a => a.event.repository.owner.type = 'Organization']) {
    const input = args(candidate); mutate(input); assert.throws(() => parseRequest(input));
  }
});
