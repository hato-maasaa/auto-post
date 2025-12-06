# One Source, Two Posts

このプロジェクトは、フリーランスエンジニアが「One Source, Two Posts」ワークフロー（NoteとX）を効率化するために設計された、洗練されたコンテンツ生成および自動化ツールです。

## 機能

- **1つの入力、2つの出力**: 1つのトピックから、長文のNote記事と、短文/スレッド形式のXポストを生成します。
- **AI搭載**: LLM（デモ用はモック、OpenAI統合準備済み）を使用したコンテンツ生成。
- **自動投稿**:
  - **Note**: Playwrightを使用してブラウザを自動操作し、ログインセッションの処理や下書き作成を行います。
  - **X**: Twitter API v2を使用します。
- **ダッシュボード**: コンテンツを管理するための、プレミアムな「グラスモーフィズム」デザインのダッシュボード。
- **ログ機能**: すべての投稿をローカルのSQLiteデータベースに記録します。

## 技術スタック

- **フロントエンド**: Next.js 14+ (App Router), TypeScript, Vanilla CSS (CSS Modules), Lucide React.
- **バックエンド API**: Next.js API Routes.
- **データベース**: SQLite + Prisma.
- **自動化**: Playwright, twitter-api-v2.
- **バリデーション**: Zod, React Hook Form.

## 始め方

### 1. インストール

```bash
npm install
npx playwright install chromium
```

### 2. 環境設定

`.env`ファイルが作成されています。開いてキーを入力してください：

```bash
DATABASE_URL="file:./dev.db"

# X (Twitter) API Keys (developer.twitter.com から取得)
TWITTER_APP_KEY=""
TWITTER_APP_SECRET=""
TWITTER_ACCESS_TOKEN=""
TWITTER_ACCESS_SECRET=""

# Note Login (任意、以下参照)
NOTE_EMAIL=""
NOTE_PASSWORD=""
```

### 3. データベース

データベースを初期化します（まだ完了していない場合）：

```bash
npx prisma migrate dev --name init
```

### 4. アプリの実行

```bash
npm run dev
```

`http://localhost:3000` にアクセスしてください。

## Note自動化 (Playwright)

このツールはPlaywrightを使用してNote.comと対話します。
- **初回実行時**: "Noteに投稿"をクリックすると、ブラウザウィンドウが開きます。ログインしていない場合は、そのウィンドウで手動でログインできます。スクリプトはセッション状態を `note-storage-state.json` に保存しようとします。
- **次回以降**: ツールは保存されたセッション状態を使用して自動的に投稿します。

## プロジェクト構成

- `app/`: Next.js App Router ページおよび API ルート。
- `components/features/dashboard/`: メインダッシュボードのロジックとUI。
- `lib/`:
  - `note-poster.ts`: Playwright 自動化ロジック。
  - `prisma.ts`: データベースクライアント。
  - `types.ts`: Zod スキーマと型定義。
- `prisma/`: データベーススキーマ。
