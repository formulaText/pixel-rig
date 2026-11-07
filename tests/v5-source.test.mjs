import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { transpileModule, ModuleKind } from 'typescript';

test('v5の全GLSLを文字列単位で維持（画素格子・色・深度・顔マスク）', () => {
  const source = readFileSync('prototypes/v5_pixel-rig-poc.html', 'utf8');
  const shaders = source.slice(source.indexOf('const C_COMMON'), source.indexOf('/* ================= レンダラー'));
  const names = [...shaders.matchAll(/^const (\w+) =/gm)].map(m => m[1]);
  const baseline = runInNewContext(`${shaders}\nJSON.stringify({${names.join(',')}})`);
  const port = readFileSync('src/render/shaders.ts', 'utf8').replace(/export \{[^}]+\};/, '');
  const compiled = transpileModule(`${port}\nJSON.stringify({${names.join(',')}})`, { compilerOptions: { module: ModuleKind.CommonJS } }).outputText;
  assert.equal(runInNewContext(compiled), baseline);
});

test('v5の定数・既定値・顔／アイコン／デカールデータを維持', async () => {
  const THREE = await import('three');
  const source = readFileSync('prototypes/v5_pixel-rig-poc.html', 'utf8');
  const constants = source.slice(source.indexOf('const TAU'), source.indexOf('/* ================= シェーダー部品'));
  const names = [...constants.matchAll(/^const (\w+) =/gm)].map(m => m[1]);
  const baseline = runInNewContext(`${constants}\nJSON.stringify({${names.join(',')}})`, { THREE });
  const port = readFileSync('src/core/constants.ts', 'utf8').replace(/^import .*;\n/gm, '').replace(/export \{[^}]+\};/, '');
  const compiled = transpileModule(`${port}\nJSON.stringify({${names.join(',')}})`, { compilerOptions: { module: ModuleKind.CommonJS } }).outputText;
  assert.equal(runInNewContext(compiled, { THREE }), baseline);
});

test('移動・時間・感情・深度描画の主要関数は型消去後に原本と同じ', async () => {
  const ts = await import('typescript');
  const original = readFileSync('prototypes/v5_pixel-rig-poc.html', 'utf8');
  const script = original.slice(original.indexOf('const TAU'), original.lastIndexOf('})();'));
  const functions = code => new Map(ts.createSourceFile('source.ts', code, ts.ScriptTarget.Latest, true).statements
    .filter(ts.isFunctionDeclaration).map(node => [node.name.text, node.getText()]));
  const baseline = functions(script);
  const cases = {
    'src/gameplay/logic.ts': ['lerpAngle', 'angDist', 'pickDir', 'canAt', 'stepPixel', 'moveFloat', 'tick', 'applyPose'],
    'src/character/expression.ts': ['triggerEmote', 'tickExpr', 'curEye', 'applyEmote'],
    'src/character/rig.ts': ['walkPose', 'idlePose', 'setFace'],
    'src/render/scene.ts': ['renderSprite', 'renderWorld', 'positionCharCam', 'updateWorldFrustum', 'resize'],
    'src/render/lighting.ts': ['updateShadowMap', 'applyLight', 'setCamBasis'],
    'src/render/post.ts': ['pass', 'setPost', 'computeStamps', 'setIcon', 'mkRT'],
    'src/world/world.ts': ['blocked', 'mulberry32', 'put', 'mergeGeos', 'house', 'tree', 'bush', 'rock', 'well', 'barrel', 'crate', 'fence', 'sign', 'lamp', 'plateau'],
  };
  const eraseTypes = code => transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, removeComments: true } }).outputText;
  for (const [file, names] of Object.entries(cases)) {
    const port = functions(readFileSync(file, 'utf8'));
    for (const name of names) assert.equal(eraseTypes(port.get(name)), eraseTypes(baseline.get(name)), `${file}: ${name}`);
  }
});
