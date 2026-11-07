# pixel-rig

Three.jsで、3Dキャラクターと背景を現代的でリッチなドット絵として描画する研究プロジェクトです。

v1〜v5の原本と現行開発資料に加え、V6-01のTypeScript＋Vite最小起動ページ、原本検査、GitHub Actions／Pagesの配信基盤を収録しています。v5の移植はV6-02です。

## 最初に読む資料

- [開発資料の入口と優先順位](docs/00_README.md)
- [決定事項・暫定案・未決事項](docs/09_決定事項と検討状況.md)
- [v6実装計画](docs/12_v6実装計画.md)
- [作業指示一覧](docs/issues/README.md)
- [Codexへの依頼方法](docs/10_Codex作業ガイド.md)
- [登録方法と次の作業](START_HERE.txt)

## 現在の段階

対象は公開リポジトリ [formulaText/pixel-rig](https://github.com/formulaText/pixel-rig) です。V6-01のコード・配信構成を実装し、公開URLとiPhone実機での確認を待つ段階です。開発・ビルド・配信はGitHubのサービスで完結させます。確認済み版は依頼者の実機確認と明示承認後のみ設定し、初回は「未確定」です。

[初回準備・候補更新・昇格のiPhone Safari操作手順](docs/07_リポジトリ構成と開発フロー.md)を参照してください。PRをmainへ統合→PagesのSourceをGitHub Actionsに設定→候補を手動公開の順序です。マージや候補更新では自動昇格しません。

最初の開発目標は、Three.js r128のままファイル分割してv5の見た目・挙動を再現することです。

## 収録物

|場所|内容|
|---|---|
|docs/|現在の方針、v5技術仕様、ロードマップ、計画|
|docs/issues/|1 Issue・1 PR単位の16件の作業指示|
|prototypes/|v1〜v5のHTML原本。v5が再現基準|
|references/|壁際の問題の参考画像原本|
|archive/|過去の文書。現行指示として使用しない|
|AGENTS.md|Codexの作業上の共通ルール|
|src/・scripts/・tests/|最小起動ページ、原本照合、配信構成と検査|
|.github/workflows/|CIと手動の候補更新／明示承認後の昇格|
|MANIFEST.sha256|配布時点のスナップショット（開発中は更新しない）|

原本HTMLは外部CDNからThree.js r128を読み込みます。v6の研究アプリは依存物をビルド成果物に含めます。原本のCDN参照を修正してしまわないでください。

## 配布版との関係

アップロード済みの [開発資料ZIP](pixel-rig-development-package.zip) を保持しています。`MANIFEST.sha256` は配布版の54ファイルを検証するための記録です。登録時に統合・更新した文書と検証方法は [資料更新記録](docs/13_資料更新記録.md) を参照してください。原本HTML・参考画像・保存用旧文書は配布版から変更していません。
