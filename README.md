# AIスペシャリスト.com

## 🚀 クイックスタート

### 前提条件
- Node.js 18.17.0+
- pnpm 8.0.0+
- PostgreSQL 14+
- Docker (オプション)

### 5分セットアップ
```bash
# 1. リポジトリクローン
git clone https://github.com/denof-inc/ai-specialist-platform.git
cd ai-specialist-platform

# 2. 依存関係インストール
pnpm install

# 3. 環境変数設定
cp .env.example .env.local
# .env.localを編集して必要な値を設定

# 4. データベースセットアップ
docker-compose up -d postgres
pnpm run db:migrate

# 5. 開発サーバー起動
pnpm run dev
```

🎉 **完了！** http://localhost:3000 でアプリケーションにアクセス

## 🛠️ 技術スタック

### フロントエンド
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod

### バックエンド
- **v0.1**: Next.js API Routes
- **v1.0+**: NestJS (段階的移行)
- **Database**: PostgreSQL + pgvector
- **ORM**: Prisma → TypeORM
- **Cache**: Redis
- **Queue**: Bull/BullMQ

### インフラ・デプロイ
- **Hosting**: Vercel (Frontend) + Railway/Render (Backend)
- **Database**: AWS RDS PostgreSQL
- **CDN**: Vercel Edge Network
- **Monitoring**: Sentry + Datadog
- **CI/CD**: GitHub Actions

### 外部サービス
- **AI**: OpenAI GPT-4o-mini
- **Payment**: Stripe
- **CMS**: Notion → Decap CMS → Strapi (v1.0)
- **Email**: Resend
- **Analytics**: Vercel Analytics

## 📁 プロジェクト構造

```
├── docs/                          # 📚 完全なドキュメント
│   ├── README.md                  # ドキュメント全体ガイド
│   ├── api/                       # API仕様書
│   ├── architecture/              # システム設計
│   ├── development/               # 開発ガイド
│   ├── project/                   # プロジェクト管理
│   └── deployment/                # デプロイ・運用
├── src/                           # ソースコード
│   ├── app/                       # Next.js App Router
│   ├── components/                # Reactコンポーネント
│   ├── lib/                       # ユーティリティ
│   └── types/                     # TypeScript型定義
├── prisma/                        # データベーススキーマ
├── public/                        # 静的ファイル
├── CLAUDE.md                      # AI開発ルール
└── package.json                   # 依存関係・スクリプト
```

## 🔄 開発フロー

### ブランチ戦略
```bash
# 新機能開発
git checkout -b feature/user-authentication
git checkout -b feature/question-posting

# バグ修正
git checkout -b fix/login-validation-error

# ドキュメント更新
git checkout -b docs/api-documentation
```

### コミット規約
```bash
# 機能追加
git commit -m "feat: ユーザー認証機能を追加"

# バグ修正
git commit -m "fix: ログインバリデーションエラーを修正"

# ドキュメント
git commit -m "docs: API仕様書を更新"

# リファクタリング
git commit -m "refactor: 認証ロジックをサービス層に分離"

# テスト
git commit -m "test: ユーザー登録のテストケースを追加"
```

### PR作成手順
```bash
# 1. 変更をプッシュ
git push origin feature/your-feature

# 2. PR作成
gh pr create --title "feat: 機能名" --body "変更内容の説明"

# 3. レビュー・マージ後
git checkout main
git pull origin main
git branch -d feature/your-feature
```

## 📚 ドキュメント

**重要**: 開発開始前に必ず `docs/` ディレクトリを確認してください。

### 役割別ガイド

#### 👨‍💻 フロントエンド開発者
```bash
# 必読ドキュメント
docs/development/setup-guide.md      # 環境セットアップ
docs/development/README.md           # 開発概要
docs/api/endpoints.md               # API仕様
```

#### ⚙️ バックエンド開発者
```bash
# 必読ドキュメント
docs/architecture/database-design.md # DB設計
docs/api/authentication.md          # 認証システム
docs/architecture/system-design.md   # システム設計
```

#### 🔧 DevOps・インフラ
```bash
# 必読ドキュメント
docs/deployment/README.md           # デプロイ概要
docs/architecture/README.md         # インフラ構成
```

#### 💼 プロダクトオーナー
```bash
# 必読ドキュメント
docs/project/business-requirements.md # ビジネス要件
docs/project/README.md               # プロジェクト概要
```

## ⚡ 主要コマンド

### 開発
```bash
# 開発サーバー起動
pnpm run dev

# 型チェック
pnpm run type-check

# リンター実行
pnpm run lint
pnpm run lint:fix

# フォーマット
pnpm run format
```

### データベース
```bash
# マイグレーション実行
pnpm run db:migrate

# Prisma Studio起動
pnpm run db:studio

# シードデータ投入
pnpm run db:seed

# データベースリセット
pnpm run db:reset
```

### テスト
```bash
# 全テスト実行
pnpm run test

# ウォッチモード
pnpm run test:watch

# カバレッジ
pnpm run test:coverage

# E2Eテスト
pnpm run test:e2e
```

### ビルド・デプロイ
```bash
# 本番ビルド
pnpm run build

# 本番サーバー起動
pnpm run start

# 依存関係更新
pnpm run update-deps
```

## 🎯 開発優先度

### v0.1 PoC（現在）
- [ ] 基本認証システム（Next.js + JWT）
- [ ] 質問投稿・表示機能（CRUD + 検索）
- [ ] プロフィールページ（ユーザー・専門家）
- [ ] 基本的なマッチング（Q&A→回答選択）

### v1.0 β（2025年Q4）
- [ ] 完全なユーザー認証・認可（RBAC + セッション管理）
- [ ] 決済・サブスクリプション（Stripe統合）
- [ ] 評価・レビューシステム
- [ ] CMS統合（Strapi + /interview統合）

## 🚨 重要ルール

### 開発前の必須確認
1. **`docs/`ディレクトリを必ず確認**
2. **`CLAUDE.md`のAI運用5原則を遵守**
3. **既存のコード規約・アーキテクチャに従う**

### 品質基準
- **テストカバレッジ**: 80%以上
- **ESLint**: エラー0件
- **TypeScript**: `any`型使用禁止
- **セキュリティ**: 脆弱性チェック必須

## 🆘 トラブルシューティング

### よくある問題
```bash
# ポート競合
lsof -i :3000
kill -9 <PID>

# Node.jsバージョン
nvm use 18.17.0

# 依存関係エラー
rm -rf node_modules package-lock.json
pnpm install

# データベース接続エラー
docker-compose down
docker-compose up -d postgres
```

### サポート
- **技術的問題**: GitHub Issues
- **設計相談**: `docs/`ディレクトリ参照
- **緊急対応**: 開発チームに連絡

---

**Happy Coding! 🚀**

詳細な情報は `docs/` ディレクトリを参照してください。