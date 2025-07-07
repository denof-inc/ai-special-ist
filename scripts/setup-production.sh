#!/bin/bash

# 本番環境セットアップスクリプト
# 常時起動ローカルPC用

set -e

echo "=== AIスペシャリスト.com 本番環境セットアップ ==="

# 1. 依存関係インストール
echo "📦 依存関係をインストール中..."
pnpm install --frozen-lockfile

# 2. 環境変数チェック
echo "🔍 環境変数をチェック中..."
if [ ! -f .env.production ]; then
    echo "❌ .env.production ファイルが見つかりません"
    echo "📝 .env.example をコピーして .env.production を作成してください"
    exit 1
fi

# 3. Prismaセットアップ
echo "🗄️ データベースをセットアップ中..."
pnpm prisma generate --no-engine
pnpm prisma db push

# 4. 本番ビルド
echo "🏗️ 本番ビルドを実行中..."
NODE_ENV=production pnpm run build

# 5. 品質チェック
echo "✅ 品質チェックを実行中..."
pnpm run quality:check

echo ""
echo "✨ セットアップ完了！"
echo ""
echo "📋 次のステップ："
echo "1. 環境変数の設定確認:"
echo "   - RESEND_API_KEY (メール送信用)"
echo "   - NEXT_PUBLIC_APP_URL (本番ドメイン)"
echo ""
echo "2. 本番起動:"
echo "   NODE_ENV=production pnpm start"
echo ""
echo "3. PM2での永続化（推奨）:"
echo "   npm install -g pm2"
echo "   NODE_ENV=production pm2 start npm --name 'ai-specialist' -- start"
echo ""