# システム設計

**更新日**: 2025-07-04  
**担当者**: 技術リード  
**対象フェーズ**: 全フェーズ

## 概要

AIスペシャリスト.comのシステム全体設計について、アーキテクチャ図、データフロー、コンポーネント関係を詳細に説明します。

## システム全体図

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Next.js       │◄───┤   API Routes    │◄───┤   PostgreSQL    │
│   (App Router)  │    │   (→NestJS)     │    │   + pgvector    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CMS           │    │   AI Services   │    │   Search        │
│   Notion/Decap  │    │   OpenAI API    │    │   FTS→Pinecone  │
│   →Strapi       │    │   GPT-4 mini    │    │   KNN Search    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Edge      │    │   Payment       │    │   Monitoring    │
│   Vercel Edge   │    │   Stripe        │    │   Datadog       │
│   Image Opt     │    │   Subscriptions │    │   Sentry        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## フェーズ別アーキテクチャ進化

### v0.1 PoC アーキテクチャ

```
┌─────────────────┐
│   Next.js App   │
│   ┌───────────┐ │    ┌─────────────────┐
│   │ Frontend  │ │◄───┤   PostgreSQL    │
│   │ + API     │ │    │   (RDS Free)    │
│   │ Routes    │ │    │                 │
│   └───────────┘ │    └─────────────────┘
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   OpenAI API    │
│   GPT-4 mini    │
└─────────────────┘
```

### v1.0 β アーキテクチャ

```
┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   PostgreSQL    │
│   Frontend      │    │   + pgvector    │
│   ┌───────────┐ │◄───┤   (RDS)         │
│   │API Routes │ │    │                 │
│   └───────────┘ │    └─────────────────┘
└─────────────────┘              │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Strapi CMS    │    │   Stripe        │
│   Content Mgmt  │    │   Payments      │
└─────────────────┘    └─────────────────┘
```

### Year-1 スケールアーキテクチャ

```
┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   NestJS API    │
│   Frontend      │◄───┤   Gateway       │
│   + Edge Func   │    │                 │
└─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼─────┐
        │ Auth Service │ │Content Svc  │ │Search Svc │
        └──────────────┘ └─────────────┘ └───────────┘
                │               │               │
                ▼               ▼               ▼
        ┌───────────────┐ ┌─────────────┐ ┌───────────┐
        │ Aurora PG     │ │ Strapi CMS  │ │ Pinecone  │
        │ (Auth/User)   │ │ (Content)   │ │ (Search)  │
        └───────────────┘ └─────────────┘ └───────────┘
```

## データフロー設計

### 1. ユーザー認証フロー

```
User → Frontend → API Routes → Database
  │                    │           │
  │                    ▼           ▼
  │              JWT Token    User Record
  │                    │           │
  │◄───────────────────┴───────────┘
  │
  ▼
Authenticated Session
```

### 2. 質問・回答フロー

```
User Input → Frontend → API Validation → Database
     │           │            │             │
     │           ▼            ▼             ▼
     │    UI Validation  Business Logic  Data Storage
     │           │            │             │
     │           ▼            ▼             ▼
     │    Error Handling  AI Processing  Search Index
     │           │            │             │
     │◄──────────┴────────────┴─────────────┘
     │
     ▼
Updated UI + Notifications
```

### 3. AI支援フロー

```
User Request → Content Analysis → OpenAI API → Response Processing
      │              │               │              │
      │              ▼               ▼              ▼
      │        Context Building  AI Generation  Content Filter
      │              │               │              │
      │              ▼               ▼              ▼
      │        Prompt Engineering  API Response  Safety Check
      │              │               │              │
      │◄─────────────┴───────────────┴──────────────┘
      │
      ▼
Enhanced Content + Suggestions
```

## コンポーネント設計

### フロントエンド コンポーネント階層

```
App Layout
├── Header
│   ├── Navigation
│   ├── UserMenu
│   └── SearchBar
├── Main Content
│   ├── QuestionList
│   │   ├── QuestionCard
│   │   ├── Pagination
│   │   └── FilterSidebar
│   ├── QuestionDetail
│   │   ├── QuestionContent
│   │   ├── AnswerList
│   │   │   └── AnswerCard
│   │   └── AnswerForm
│   └── UserProfile
│       ├── ProfileInfo
│       ├── AnswerHistory
│       └── SubscriptionStatus
└── Footer
    ├── Links
    └── ContactInfo
```

### バックエンド サービス階層（Year-1）

```
API Gateway (NestJS)
├── Auth Module
│   ├── AuthController
│   ├── AuthService
│   ├── JwtStrategy
│   └── RoleGuard
├── Question Module
│   ├── QuestionController
│   ├── QuestionService
│   ├── QuestionRepository
│   └── QuestionEntity
├── User Module
│   ├── UserController
│   ├── UserService
│   ├── UserRepository
│   └── UserEntity
├── Payment Module
│   ├── PaymentController
│   ├── StripeService
│   ├── SubscriptionService
│   └── WebhookHandler
└── AI Module
    ├── AIController
    ├── OpenAIService
    ├── ContentFilter
    └── EmbeddingService
```

## セキュリティアーキテクチャ

### 認証・認可フロー

```
1. ユーザーログイン
   ├── Email/Password検証
   ├── JWT Token生成
   ├── HttpOnly Cookie設定
   └── CSRF Token生成

2. API リクエスト
   ├── JWT Token検証
   ├── CSRF Token検証
   ├── Rate Limiting チェック
   ├── Role-based Access Control
   └── リソースアクセス許可

3. セッション管理
   ├── Token Refresh
   ├── セッション無効化
   └── ログアウト処理
```

### セキュリティレイヤー

```
┌─────────────────────────────────────────┐
│ WAF (Web Application Firewall)          │
├─────────────────────────────────────────┤
│ Rate Limiting (100 req/min per IP)      │
├─────────────────────────────────────────┤
│ HTTPS/TLS 1.3 Encryption               │
├─────────────────────────────────────────┤
│ CSRF Protection                         │
├─────────────────────────────────────────┤
│ XSS Protection (CSP Headers)           │
├─────────────────────────────────────────┤
│ SQL Injection Prevention                │
├─────────────────────────────────────────┤
│ Input Validation & Sanitization        │
├─────────────────────────────────────────┤
│ JWT Authentication                      │
├─────────────────────────────────────────┤
│ Role-based Authorization                │
├─────────────────────────────────────────┤
│ AI Content Moderation                   │
└─────────────────────────────────────────┘
```

## パフォーマンス設計

### キャッシュ戦略

```
┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   CDN           │
│   Cache         │◄───┤   (Vercel Edge) │
│   (1 hour)      │    │   (24 hours)    │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Next.js ISR   │    │   Redis Cache   │
│   (60 seconds)  │◄───┤   (1 hour)      │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Search Index  │
│   Query Cache   │    │   (Pinecone)    │
└─────────────────┘    └─────────────────┘
```

## 災害復旧設計

### バックアップアーキテクチャ

```
Primary Database → Automated Backup → S3 Storage
         │                │              │
         ▼                ▼              ▼
Read Replica → Point-in-Time Recovery → Glacier Archive
         │                │              │
         ▼                ▼              ▼
Application Data → Code Repository → GitHub Backup
```

### 復旧手順

```
1. 障害検知 (15分以内)
   ├── 自動監視アラート
   ├── ヘルスチェック失敗
   └── ユーザー報告

2. 影響範囲特定 (30分以内)
   ├── サービス可用性確認
   ├── データ整合性確認
   └── 復旧方法決定

3. 復旧実行 (2時間以内)
   ├── バックアップからの復元
   ├── サービス再起動
   └── データ整合性確認

4. 検証・報告 (4時間以内)
   ├── 全機能テスト
   ├── パフォーマンス確認
   └── 事後分析レポート
```

---

## 早期登録機能の技術選定

### 選定技術とその理由

**フォーム処理系**

- **React Hook Form**: パフォーマンス重視でReactコンポーネントの再レンダリングを最小化
- **Zod**: TypeScriptファーストなスキーマバリデーション、型安全性確保

**メール送信**

- **Resend**: Next.jsエコシステムとの親和性、開発者体験とAPI仕様の明確さ

**データベース**

- **Prisma**: 既存ORM、型安全性とスキーママイグレーション管理

### 実装範囲

```
早期登録フロー
├── フォームバリデーション (React Hook Form + Zod)
├── データベース保存 (Prisma)
├── 自動返信メール (Resend)
├── 成功画面遷移 (Next.js Router)
└── エラーハンドリング (統一エラー処理)
```

### 関連ファイル

- `/src/app/early-access/page.tsx`: 登録フォームUI
- `/src/app/early-access/success/page.tsx`: 成功ページ
- `/src/app/api/early-access/route.ts`: API エンドポイント
- `/src/lib/validations/early-access.ts`: バリデーションスキーマ
- `/src/lib/email.ts`: メール送信サービス
- `/prisma/schema.prisma`: データベーススキーマ

---

**このシステム設計は段階的に進化します。各フェーズで必要な部分から実装し、将来の拡張性を確保しながら開発を進めてください。**
