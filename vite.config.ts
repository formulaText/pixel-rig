import { defineConfig } from 'vite';

export default defineConfig({
  // 相対baseにより /pixel-rig/{candidate,stable}/ へ同一成果物を移せる。
  base: './',
  define: {
    __BUILD_INFO__: JSON.stringify({ buildId: 'local-dev', commit: '未コミットの開発画面', builtAt: '' }),
  },
});
