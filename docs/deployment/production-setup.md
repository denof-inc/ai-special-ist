# 本番環境セットアップガイド

## 概要

本ドキュメントは常時起動のローカルPC環境での本番運用設定手順を説明します。

## 必要な環境変数

### 1. データベース設定

```bash
# Prisma + PostgreSQL（ローカル環境）
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=YOUR_PRISMA_API_KEY"
```

### 2. メールサービス設定

```bash
# Resend API（本番用APIキー必要）
RESEND_API_KEY="re_your_production_api_key_here"
```

### 3. アプリケーション設定

```bash
# 本番用URL
NEXT_PUBLIC_APP_URL="http://your-domain.com"

# 環境指定
NODE_ENV=production
```

## セットアップ手順

### 1. 環境変数設定

```bash
# .env.production ファイルを作成
cp .env.example .env.production

# 本番用の値を設定
nano .env.production
```

### 2. データベースセットアップ

```bash
# Prismaクライアント生成
pnpm prisma generate

# データベース同期
pnpm prisma db push

# マイグレーション実行（必要に応じて）
pnpm prisma migrate deploy
```

### 3. 本番ビルド

```bash
# 依存関係インストール
pnpm install --frozen-lockfile

# 本番ビルド
pnpm run build
```

### 4. 本番起動

```bash
# 本番サーバー起動
pnpm start

# または PM2を使用した永続化
npm install -g pm2
pm2 start npm --name "ai-specialist" -- start
```

## 必要なサービス設定

### 1. Resend（メール送信）

1. [Resend](https://resend.com) でアカウント作成
2. APIキーを取得
3. ドメイン認証設定
4. 送信者ドメイン設定

### 2. PostgreSQL（データベース）

1. PostgreSQLサーバーの確認
2. データベース接続の確認
3. バックアップ設定

## 監視・メンテナンス

### ログ監視

```bash
# PM2ログ確認
pm2 logs ai-specialist

# アプリケーションログ
tail -f logs/app.log
```

### ヘルスチェック

```bash
# アプリケーション起動確認
curl http://localhost:3000/api/health

# データベース接続確認
pnpm prisma db pull
```

### バックアップ

```bash
# データベースバックアップ
pg_dump your_database > backup_$(date +%Y%m%d).sql
```

## トラブルシューティング

### よくある問題

1. **環境変数が読み込まれない**
   - .env.production ファイルの存在確認
   - NODE_ENV=production の設定確認

2. **データベース接続エラー**
   - PostgreSQLサーバーの起動確認
   - DATABASE_URL の形式確認

3. **メール送信エラー**
   - RESEND_API_KEY の有効性確認
   - ドメイン認証状況の確認

### エラーログ確認

```bash
# Next.js エラーログ
cat .next/trace.log

# システムエラーログ
journalctl -u your-service-name
```
