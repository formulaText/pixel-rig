import assert from 'node:assert/strict';
import { appendFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const commandPrefix = '/pixel-rig-pages ';
const login = /^[a-zA-Z0-9][a-zA-Z0-9-]*(?:\[bot\])?$/;

export function authorizeExecutor({ actor, triggeringActor = actor, owner, delegates = '' }) {
  assert(login.test(owner), '承認者は個人リポジトリの所有者');
  const allowed = [owner, ...delegates.split(',').map(s => s.trim()).filter(Boolean)].map(s => s.toLowerCase());
  for (const executor of [actor, triggeringActor]) {
    assert(login.test(executor || '') && allowed.includes(executor.toLowerCase()), '許可されていない実行者');
  }
}

export function validateApproval({ approved, expectedBuildId, approval, owner }) {
  assert(approved === true, '実機確認・明示承認が必要');
  assert.match(expectedBuildId || '', /^[a-zA-Z0-9._-]+$/, '承認対象ビルドIDが不正');
  assert(approval?.approver?.toLowerCase() === owner.toLowerCase(), '依頼者の明示承認が必要');
  assert.equal(approval.buildId, expectedBuildId, '承認記録のビルドIDが不一致');
  assert(typeof approval.statement === 'string' && approval.statement.includes(expectedBuildId)
    && approval.statement.length <= 4000, '対象ビルドIDを含む承認原文が必要');
  assert(typeof approval.source === 'string' && approval.source.trim().length >= 8
    && approval.source.length <= 2000, '承認の受領元が必要');
}

// JSONをデータとしてのみ扱い、コメントの文字列をシェルへ埋め込まない。
export function parseRequest({ eventName, event, actor, triggeringActor = actor, delegates = '', ref, runUrl }) {
  const owner = event.repository.owner.login;
  assert.equal(event.repository.owner.type, 'User', '組織移管時は承認者の設計を見直してください');
  assert.equal(ref, 'refs/heads/main', 'mainの配信処理のみ実行可能');
  authorizeExecutor({ actor, triggeringActor, owner, delegates });
  let input;
  let requestUrl = runUrl;
  if (eventName === 'issue_comment') {
    assert.equal(event.action, 'created', '新規コメントだけ実行可能');
    assert(event.issue.pull_request, '対象PRへのコメントが必要');
    assert.equal(event.comment.user.login, actor, '投稿者と実行者が不一致');
    assert(event.comment.body.startsWith(commandPrefix), '配信コマンドではありません');
    input = JSON.parse(event.comment.body.slice(commandPrefix.length));
    requestUrl = event.comment.html_url;
  } else {
    assert.equal(eventName, 'workflow_dispatch', '非対応の起動方法');
    input = event.inputs;
  }
  assert(input && typeof input === 'object' && !Array.isArray(input), '入力が不正');
  const keys = ['operation', 'source_ref', 'expected_build_id', 'iphone_approved', 'approval_by', 'approval_text', 'approval_source', 'executor_label'];
  assert(Object.keys(input).every(key => keys.includes(key)), '未知の入力項目');
  assert(['candidate', 'promote'].includes(input.operation), '操作が不正');
  const approved = input.iphone_approved === true || input.iphone_approved === 'true';
  const expectedBuildId = input.expected_build_id || '';
  const approval = {
    approver: input.approval_by || '', buildId: expectedBuildId,
    statement: input.approval_text || '', source: input.approval_source || '',
  };
  const executorLabel = input.executor_label || 'GitHub';
  assert(['Codex', 'GitHub'].includes(executorLabel), '実行経路はCodexまたはGitHub');
  let sourceRef = '';
  if (input.operation === 'promote') {
    assert.match(expectedBuildId, /^gh-\d+-\d+-[a-f0-9]{12}$/, '公開ビルドIDが必要');
    validateApproval({ approved, expectedBuildId, approval, owner });
  } else {
    assert(!approved && !expectedBuildId && !approval.approver && !approval.statement && !approval.source,
      '候補公開へ昇格承認を混在させない');
    sourceRef = input.source_ref || 'main';
    assert(typeof sourceRef === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._/-]{0,199}$/.test(sourceRef)
      && !sourceRef.includes('..'), 'source_refが不正');
  }
  return { operation: input.operation, sourceRef, expectedBuildId, approved, approval,
    actor, triggeringActor, owner, executorLabel, requestUrl, runUrl };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const env = process.env;
  const request = parseRequest({ eventName: env.GITHUB_EVENT_NAME,
    event: JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8')),
    actor: env.GITHUB_ACTOR, triggeringActor: env.GITHUB_TRIGGERING_ACTOR,
    delegates: env.PAGES_EXECUTORS, ref: env.GITHUB_REF,
    runUrl: `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}/attempts/${env.GITHUB_RUN_ATTEMPT}` });
  // JSON.stringifyにより改行をエスケープし、GITHUB_OUTPUTの追加キー注入を防ぐ。
  appendFileSync(env.GITHUB_OUTPUT, `request=${JSON.stringify(request)}\noperation=${request.operation}\nsource_ref=${request.sourceRef}\n`);
  appendFileSync(env.GITHUB_STEP_SUMMARY, `配信要求: ${request.requestUrl}\n\n実行: ${request.executorLabel} / ${request.actor}\n\n操作: ${request.operation}\n`);
}
