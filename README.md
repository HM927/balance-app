# 残高管理アプリ

基準残高・基準日と登録した収入・支出から、指定日時点の予想残高を確認するWebアプリです。
カレンダー・収支管理・設定の3画面を、ページ全体の再読み込みなしで切り替えます。

## 実装済み機能

- FullCalendarの月表示で日付を選択し、予想残高と選択日の収支一覧を表示
- 収入・支出の登録と削除（日付・金額・メモ）
- 全期間の収支一覧と「すべて・収入・支出」の切り替え
- メモの部分一致検索と、種別による絞り込みの同時適用
- 検索結果の件数・0件メッセージの表示
- 追加・削除後も、選択中の種別・検索語を維持して一覧を更新
- 基準残高・基準日の登録と更新
- Spring BootのREST APIとPostgreSQLによる永続化

基準情報と収支の保存先はPostgreSQLです。現在の画面はlocalStorageを保存先として使いません。

## 使用技術

| 区分 | 技術 |
|---|---|
| フロントエンド | HTML・CSS・Vanilla JavaScript（ES Modules） |
| 開発サーバー・ビルド | Vite |
| カレンダー | FullCalendar |
| バックエンド | Java 21・Spring Boot・Spring MVC |
| DBアクセス | Spring JDBC / JdbcTemplate |
| データベース | PostgreSQL |
| テスト | Node.js標準テストランナー・Playwright |
| Javaのビルド | Gradle Wrapper |

依存関係のバージョンは`package.json`・`package-lock.json`・`backend/build.gradle`を参照してください。

## 処理の構成

```text
ブラウザ
  HTML / index.js / transaction-list.js / calendar.js
    ↓ api.jsからHTTP通信
Spring Boot
  Controller → Repository → JdbcTemplate
    ↓ SQL
PostgreSQL
```

検索・種別による絞り込みはバックエンドで実行します。
残高計算と日別一覧の抽出は現在フロントエンドで行い、検索条件なしで取得した全収支を使います。
収支管理画面の検索条件は、残高計算に影響しません。

## ローカルでの起動

### 必要な環境

- Node.js・npm
- Java 21
- PostgreSQLのサーバーと`psql`
- E2Eテストには、さらに`initdb`・`pg_ctl`とPlaywrightのブラウザ

以下のコマンドは、特記がなければプロジェクトのルートで実行します。

### 1. JavaScriptの依存関係を準備

```bash
npm ci
```

### 2. PostgreSQLを準備

PostgreSQLを起動してください。起動方法はインストール方法によって異なります。
現在の接続設定は次のとおりです。

| 設定 | 値 |
|---|---|
| ホスト・ポート | `localhost:5432` |
| DB名 | `balance_app` |
| DBユーザー | `balance_app_user` |

新しい環境では、DB作成権限のあるロールで接続して、ユーザーとDBを作成します。
既に作成済みなら、この操作は不要です。

```sql
CREATE USER balance_app_user WITH PASSWORD '任意のパスワード';
CREATE DATABASE balance_app OWNER balance_app_user;
```

続いて、作成したDBへ接続します。

```bash
psql -h localhost -U balance_app_user -d balance_app
```

初回のみ、次のテーブルを作成します。現在、自動マイグレーションは導入していません。

```sql
CREATE TABLE transactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type VARCHAR(7) NOT NULL CHECK (type IN ('income', 'expense')),
    amount BIGINT NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL,
    memo TEXT NOT NULL CHECK (length(trim(memo)) > 0)
);

CREATE TABLE base_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    balance BIGINT NOT NULL,
    base_date DATE NOT NULL
);
```

`\q`でpsqlを終了できます。DB定義を変更した際は、テスト用の`scripts/e2e-schema.sql`も更新してください。

### 3. Spring Bootを起動

別のターミナルで、DB作成時に設定したパスワードを指定して起動します。
`SPRING_DATASOURCE_PASSWORD`は、設定ファイルのパスワード設定を上書きします。

```bash
cd backend
SPRING_DATASOURCE_PASSWORD='設定したDBパスワード' ./gradlew bootRun
```

APIは`http://localhost:8080`です。Javaコードを変更した場合は、停止してから再起動してください。
8080番が使用中の場合は、以前起動したSpring Bootが残っていないか確認します。

### 4. フロントエンドを起動

プロジェクトのルートにある別のターミナルで実行します。

```bash
npx vite frontend --port 5173 --strictPort
```

ブラウザで **http://localhost:5173** を開きます。
現在のCORS設定はこのオリジンを許可しているため、`127.0.0.1`や別ポートではなく`localhost:5173`を使用してください。

設定画面で基準情報を保存し、収支を登録してからカレンダーの日付を選択します。
サーバーの停止は、それぞれのターミナルで`Ctrl+C`です。

## REST API

| メソッド | パス | 処理 |
|---|---|---|
| GET | `/transactions` | 全収支を取得 |
| GET | `/transactions?type=income` | 収入だけ取得（支出は`expense`） |
| GET | `/transactions?keyword=給料` | メモの部分一致検索 |
| GET | `/transactions?type=income&keyword=給料` | 種別とメモの両方で絞り込み |
| POST | `/transactions` | 収支を登録。IDはDBが発行 |
| DELETE | `/transactions/{id}` | 指定IDの収支を削除 |
| GET | `/base-info` | 基準情報を取得。未登録なら404 |
| PUT | `/base-info` | 基準情報を登録・更新 |

検索結果は日付の古い順、同じ日付ではIDの小さい順です。一致する収支がなければ空配列を返します。
並び順を選ぶUIはありません。検索はSQLの`LIKE`を使い、現時点では`%`・`_`をワイルドカードとして扱います。

収支の登録データ:

```json
{
  "type": "income",
  "amount": 3000,
  "date": "2026-11-25",
  "memo": "給料"
}
```

基準情報の保存データ:

```json
{
  "balance": 10000,
  "baseDate": "2026-11-10"
}
```

## 残高計算の仕様

基準残高に、基準日から選択日までの収入を加え、支出を引きます。基準日・選択日当日の収支も含みます。
日別一覧には、選択日と同じ日付の収支だけを表示します。
基準日より前の日付への逆算は未対応で、現在は基準残高をそのまま返します。

## ディレクトリ構成

```text
frontend/
  index.html
  css/                       見た目・画面ナビゲーションのスタイル
  js/
    index.js                 基準情報・収支追加・一覧の初期化
    transaction-list.js      検索条件・一覧の再取得・削除
    view.js                  収支や残高のDOM表示
    api.js                   バックエンドへのHTTP通信
    calendar.js              カレンダーの日付選択
    balance.js               残高計算
    transactions.js          日別抽出などのデータ処理
    navigation.js            3画面の切り替え
backend/
  src/main/java/com/hm927/balanceapp/
    controller/              HTTPリクエスト・レスポンス
    repository/              SQLによるDB操作
    model/                   データのrecord
  src/main/resources/        Spring Bootの設定
tests/                       Node.jsの単体テスト
e2e/                         API・画面の結合テスト
scripts/                     一時DB・テスト用バックエンドの起動
```

## テスト

```bash
# 残高計算の単体テスト
npm test

# 初回のみ、Playwrightのブラウザを準備
npx playwright install

# API・画面の結合テスト
npm run test:e2e

# Chromiumだけ実行
npm run test:e2e -- --project=chromium
```

E2E実行時は、一時PostgreSQLと18080番のテスト用Spring Bootを自動起動します。
普段のDBは初期化せず、専用DBだけを各テストの前に初期化します。
終了時はテスト用サーバーを停止し、一時DBを削除します。

- 単体テスト: 残高計算の正常値・境界値など11件
- API・画面テスト: 検索・条件の組み合わせ・追加削除・基準情報の保存など22ケース
- PlaywrightはChromium・Firefox・WebKitの3プロジェクトで実行（計66件）

詳しい準備とテスト対象は[e2e/README.md](e2e/README.md)を参照してください。

## 現在の範囲と今後の予定

現在はユーザー認証・ユーザーごとのデータ分離がなく、基準情報は固定IDの1件で管理します。
今後は、収支編集、日付・金額範囲のフィルター、定期収支の設計・実装を検討しています。
React・TypeScriptへの移行やデプロイも今後の検討事項です。
