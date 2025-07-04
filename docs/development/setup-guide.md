# 開発環境セットアップガイド

**更新日**: 2025-07-04  
**担当者**: 技術リード  
**対象**: 新規開発者・環境構築

## 概要

AIスペシャリスト.comの開発環境を最短時間でセットアップするための完全ガイドです。

## 前提条件

### 必要なソフトウェア

- **Node.js**: v18.17.0以上
- **npm**: v9.0.0以上（またはpnpm v8.0.0以上）
- **Git**: v2.30.0以上
- **PostgreSQL**: v14.0以上
- **Docker**: v20.10.0以上（オプション）

### 推奨開発環境

- **OS**: macOS, Ubuntu 20.04+, Windows 11 + WSL2
- **エディタ**: VS Code + 推奨拡張機能
- **ターミナル**: iTerm2 (macOS), Windows Terminal (Windows)

## クイックスタート（5分セットアップ）

### 1. リポジトリクローン

```bash
git clone https://github.com/your-org/ai-specialist-platform.git
cd ai-specialist-platform
```

### 2. 依存関係インストール

```bash
# npm使用の場合
npm install

# pnpm使用の場合（推奨）
pnpm install
```

### 3. 環境変数設定

```bash
# 環境変数ファイルをコピー
cp .env.example .env.local

# 必要な値を設定（後述の詳細設定を参照）
```

### 4. データベースセットアップ

```bash
# PostgreSQL起動（Dockerの場合）
docker-compose up -d postgres

# マイグレーション実行
npm run db:migrate

# シードデータ投入
npm run db:seed
```

### 5. 開発サーバー起動

```bash
npm run dev
```

🎉 **完了！** http://localhost:3000 でアプリケーションにアクセスできます。

## 詳細セットアップ

### Node.js環境構築

#### 1. Node.jsインストール

```bash
# nvm使用（推奨）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18.17.0
nvm use 18.17.0

# または公式サイトからダウンロード
# https://nodejs.org/
```

#### 2. パッケージマネージャー選択

```bash
# pnpm インストール（推奨 - 高速・効率的）
npm install -g pnpm

# または npm をそのまま使用
# npm は Node.js に同梱
```

### データベース環境構築

#### Option A: Docker使用（推奨）

```bash
# docker-compose.yml を使用
docker-compose up -d postgres redis

# 接続確認
docker-compose exec postgres psql -U postgres -d ai_specialist_dev
```

#### Option B: ローカルインストール

```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu
sudo apt update
sudo apt install postgresql-14 postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Windows (WSL2)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

#### データベース作成

```sql
-- PostgreSQL に接続
psql -U postgres

-- データベース作成
CREATE DATABASE ai_specialist_dev;
CREATE DATABASE ai_specialist_test;

-- ユーザー作成
CREATE USER ai_specialist WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ai_specialist_dev TO ai_specialist;
GRANT ALL PRIVILEGES ON DATABASE ai_specialist_test TO ai_specialist;

-- pgvector 拡張機能（v1.0以降で使用）
CREATE EXTENSION IF NOT EXISTS vector;
```

### 環境変数設定

#### .env.local ファイル作成

```bash
# データベース接続
DATABASE_URL="postgresql://ai_specialist:your_password@localhost:5432/ai_specialist_dev"
DATABASE_URL_TEST="postgresql://ai_specialist:your_password@localhost:5432/ai_specialist_test"

# JWT認証
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# OpenAI API
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_MODEL="gpt-4o-mini"

# Stripe（決済）
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Redis（キャッシュ）
REDIS_URL="redis://localhost:6379"

# CMS（v1.0以降）
STRAPI_URL="http://localhost:1337"
STRAPI_API_TOKEN="your-strapi-api-token"

# 監視・ログ（本番環境）
SENTRY_DSN="your-sentry-dsn"
DATADOG_API_KEY="your-datadog-api-key"

# 開発環境設定
NODE_ENV="development"
LOG_LEVEL="debug"
```

#### 環境変数の取得方法

**OpenAI API Key:**

1. https://platform.openai.com/ にアクセス
2. API Keys セクションで新しいキーを作成
3. 使用量制限を設定（月$50程度を推奨）

**Stripe Keys:**

1. https://dashboard.stripe.com/ にアクセス
2. テストモードでPublishable keyとSecret keyを取得
3. Webhookエンドポイントを設定

### VS Code 開発環境設定

#### 推奨拡張機能

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-todo-highlight",
    "gruntfuggly.todo-tree"
  ]
}
```

#### VS Code設定

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

#### デバッグ設定

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

## データベースマイグレーション

### Prisma使用（v0.1 PoC）

```bash
# Prismaクライアント生成
npx prisma generate

# マイグレーション作成
npx prisma migrate dev --name init

# データベースリセット
npx prisma migrate reset

# Prisma Studio起動（GUI）
npx prisma studio
```

### TypeORM使用（Year-1移行後）

```bash
# マイグレーション作成
npm run migration:generate -- --name InitialMigration

# マイグレーション実行
npm run migration:run

# マイグレーション取り消し
npm run migration:revert
```

## 開発サーバー起動

### 基本コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# 型チェック
npm run type-check

# リンター実行
npm run lint

# テスト実行
npm run test

# テスト（ウォッチモード）
npm run test:watch

# E2Eテスト
npm run test:e2e
```

### 並行開発（フルスタック）

```bash
# ターミナル1: フロントエンド
npm run dev

# ターミナル2: バックエンド（NestJS移行後）
cd backend
npm run start:dev

# ターミナル3: データベース
docker-compose up postgres redis

# ターミナル4: CMS（Strapi移行後）
cd cms
npm run develop
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. ポート競合エラー

```bash
# ポート使用状況確認
lsof -i :3000

# プロセス終了
kill -9 <PID>

# 別ポートで起動
PORT=3001 npm run dev
```

#### 2. データベース接続エラー

```bash
# PostgreSQL起動確認
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# 接続テスト
psql -U postgres -h localhost -p 5432
```

#### 3. Node.js バージョンエラー

```bash
# 現在のバージョン確認
node --version

# 正しいバージョンに切り替え
nvm use 18.17.0

# .nvmrc ファイル作成
echo "18.17.0" > .nvmrc
```

#### 4. 依存関係エラー

```bash
# node_modules削除・再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュクリア
npm cache clean --force
```

#### 5. TypeScript エラー

```bash
# TypeScript再起動（VS Code）
Cmd+Shift+P → "TypeScript: Restart TS Server"

# 型定義再生成
npm run type-check
```

### パフォーマンス最適化

#### 開発サーバー高速化

```bash
# SWC使用（高速コンパイル）
npm install --save-dev @swc/core

# Turbopack使用（Next.js 13+）
npm run dev -- --turbo
```

#### メモリ使用量最適化

```bash
# Node.js メモリ制限増加
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

## Git設定

### Git Hooks設定

```bash
# Husky インストール
npm install --save-dev husky

# Git hooks 有効化
npx husky install

# pre-commit hook 追加
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

### コミットメッセージ規約

```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加・修正
chore: その他の変更

例:
feat: ユーザー認証機能を追加
fix: 質問投稿時のバリデーションエラーを修正
docs: API仕様書を更新
```

## 次のステップ

### 開発開始前のチェックリスト

- [ ] 全ての依存関係がインストール済み
- [ ] データベースが正常に動作
- [ ] 環境変数が正しく設定済み
- [ ] 開発サーバーが起動
- [ ] テストが通る
- [ ] VS Code拡張機能がインストール済み
- [ ] Git設定が完了

### 学習リソース

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [Prisma公式ドキュメント](https://www.prisma.io/docs)

### サポート

- **技術的な質問**: 開発チャットで質問
- **バグ報告**: GitHub Issues
- **機能提案**: GitHub Discussions

---

**このセットアップガイドで問題が発生した場合は、すぐにチームに相談してください。迅速にサポートします！**
