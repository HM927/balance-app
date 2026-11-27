# テストの実行

残高計算の単体テスト:

```bash
npm test
```

API・画面の結合テスト（プロジェクトのルートで実行）:

```bash
npm run test:e2e
# Chromiumだけ実行する場合
npm run test:e2e -- --project=chromium
```

Java 21、PostgreSQLの`initdb`・`pg_ctl`・`psql`、Playwrightのブラウザが必要です。
PostgreSQLのコマンドがPATH上にない場合は、インストール先のbinをPATHに追加してください。
未導入のブラウザは`npx playwright install`で準備します。

## データの分離

- `scripts/start-e2e-backend.js`がOSの一時ディレクトリに専用PostgreSQLを作成します。
- PostgreSQLは空いているローカルポート、Spring Bootは18080番で起動します。
- `scripts/e2e-schema.sql`でテーブルを作成します。DB定義を変更した際は、この定義も合わせて更新してください。
- テストのAPI通信は18080番に転送します。検索処理のモックは使わず、実際のController・Repository・SQLを実行します。
- 各テストの前に専用APIで収支を空にし、基準情報を10,000円・2026年11月10日に揃えます。
- DB共有による競合を避けるため、1 workerで順番に実行します。
- 終了時にテスト用サーバーを停止し、一時DBを削除します。
- 普段の8080番のAPIや、開発用PostgreSQLのデータは変更しません。

Viteは5173番で自動起動します。ローカルで既にViteが動いている場合は再利用します。
18080番が使用中なら、テストは既存サーバーを使わずに停止します。

## 確認する内容

- `api-search.spec.js`: 全件、種別、メモの部分一致、条件の同時適用、空欄・空白、0件、日付と同日ID順、SQLとして解釈されてはいけない入力。
- `transaction-search.spec.js`: タブと選択表示、検索語のクリア、件数と0件表示、追加・削除後の条件維持、残高計算への影響、検索応答順の逆転。
- 既存の基準情報・追加削除・未入力テストも、同じ専用DBを利用します。

並び順は現在の仕様である「古い日付順、同日ならID順」を検証します。
新しい順の選択UIは今回の仕様に含めません。
