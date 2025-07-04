# API エンドポイント詳細

**更新日**: 2025-07-04  
**担当者**: 技術リード  
**対象フェーズ**: v0.1 PoC → Year-1

## 概要

AIスペシャリスト.comの全APIエンドポイントについて、リクエスト・レスポンス形式、認証要件、使用例を詳細に説明します。

## ベースURL

```
Development: http://localhost:3000/api
Staging: https://staging-api.ai-specialist.com/api
Production: https://api.ai-specialist.com/api
```

## 認証

### JWT Bearer Token
```http
Authorization: Bearer <jwt_token>
```

### API Key（管理者用）
```http
X-API-Key: <api_key>
```

## エンドポイント一覧

### 🔐 認証・認可 (`/api/auth`)

#### POST `/api/auth/register`
新規ユーザー登録

**Request:**
```typescript
{
  email: string;           // メールアドレス
  password: string;        // パスワード（8文字以上）
  name: string;           // 表示名
  role: 'client' | 'specialist'; // ユーザー種別
  specialties?: string[]; // 専門分野（specialistの場合）
}
```

**Response (201):**
```typescript
{
  success: true;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      is_verified: boolean;
    };
    token: string;
    expiresAt: string;
  };
}
```

**使用例:**
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepass123',
    name: '田中太郎',
    role: 'specialist',
    specialties: ['AI', 'Machine Learning']
  })
});
```

#### POST `/api/auth/login`
ユーザーログイン

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    user: UserProfile;
    token: string;
    expiresAt: string;
  };
}
```

#### GET `/api/auth/me`
現在のユーザー情報取得

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
{
  success: true;
  data: {
    user: UserProfile;
    subscription?: SubscriptionInfo;
  };
}
```

### 👥 ユーザー管理 (`/api/users`)

#### GET `/api/users/specialists`
専門家一覧取得

**Query Parameters:**
```typescript
{
  page?: number;          // ページ番号（デフォルト: 1）
  limit?: number;         // 1ページあたりの件数（デフォルト: 20）
  specialties?: string[]; // 専門分野フィルター
  rating?: number;        // 最低評価
  availability?: 'available' | 'busy' | 'offline';
  sort?: 'rating' | 'experience' | 'response_time';
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    specialists: SpecialistProfile[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}
```

**使用例:**
```javascript
// 評価4.0以上のAI専門家を取得
const response = await fetch('/api/users/specialists?specialties=AI&rating=4.0&sort=rating');
```

#### GET `/api/users/:id/profile`
ユーザープロフィール取得

**Response (200):**
```typescript
{
  success: true;
  data: {
    user: UserProfile;
    stats?: {
      questions_asked: number;
      answers_given: number;
      accepted_answers: number;
      total_upvotes: number;
      reputation_score: number;
    };
  };
}
```

#### PUT `/api/users/:id/profile`
プロフィール更新

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  name?: string;
  bio?: string;
  avatar_url?: string;
  specialties?: string[];    // specialist のみ
  hourly_rate?: number;      // specialist のみ
  portfolio_url?: string;    // specialist のみ
}
```

### ❓ 質問管理 (`/api/questions`)

#### GET `/api/questions`
質問一覧取得

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  status?: 'open' | 'answered' | 'closed';
  tags?: string[];
  author_id?: string;
  sort?: 'created_at' | 'updated_at' | 'view_count' | 'answer_count';
  order?: 'asc' | 'desc';
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    questions: QuestionSummary[];
    pagination: PaginationInfo;
    filters: {
      availableTags: Tag[];
      statusCounts: Record<string, number>;
    };
  };
}
```

#### POST `/api/questions`
質問作成

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  title: string;             // 質問タイトル（10-200文字）
  content: string;           // 質問内容（20-10000文字）
  tags: string[];           // タグ（1-5個）
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  budget_min?: number;      // 予算下限
  budget_max?: number;      // 予算上限
  deadline?: string;        // 締切（ISO 8601形式）
}
```

**Response (201):**
```typescript
{
  success: true;
  data: {
    question: QuestionDetail;
  };
}
```

**使用例:**
```javascript
const response = await fetch('/api/questions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Next.jsでのJWT認証実装について',
    content: 'Next.js App Routerを使用してJWT認証を実装したいのですが...',
    tags: ['nextjs', 'jwt', 'authentication'],
    priority: 'normal',
    budget_min: 10000,
    budget_max: 50000,
    deadline: '2025-07-15T00:00:00Z'
  })
});
```

#### GET `/api/questions/:id`
質問詳細取得

**Response (200):**
```typescript
{
  success: true;
  data: {
    question: QuestionDetail;
    answers: Answer[];
    relatedQuestions: QuestionSummary[];
  };
}
```

#### PUT `/api/questions/:id`
質問更新

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  title?: string;
  content?: string;
  tags?: string[];
  status?: 'open' | 'closed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}
```

#### DELETE `/api/questions/:id`
質問削除

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No Content

### 💬 回答管理 (`/api/questions/:questionId/answers`)

#### GET `/api/questions/:questionId/answers`
回答一覧取得

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  sort?: 'created_at' | 'upvote_count';
  order?: 'asc' | 'desc';
}
```

#### POST `/api/questions/:questionId/answers`
回答作成

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  content: string;           // 回答内容
  estimated_hours?: number;  // 見積もり時間
  proposed_rate?: number;    // 提案料金
}
```

**Response (201):**
```typescript
{
  success: true;
  data: {
    answer: Answer;
  };
}
```

#### PUT `/api/answers/:id`
回答更新

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  content?: string;
  estimated_hours?: number;
  proposed_rate?: number;
}
```

#### POST `/api/answers/:id/accept`
回答承認

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
{
  success: true;
  data: {
    answer: Answer;
    message: string;
  };
}
```

#### POST `/api/answers/:id/vote`
回答投票

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  vote_type: 'upvote' | 'downvote';
}
```

### 🔍 検索 (`/api/search`)

#### GET `/api/search/questions`
質問検索

**Query Parameters:**
```typescript
{
  q: string;              // 検索クエリ
  tags?: string[];        // タグフィルター
  page?: number;
  limit?: number;
  sort?: 'relevance' | 'created_at' | 'view_count';
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    questions: QuestionSummary[];
    pagination: PaginationInfo;
    searchMeta: {
      query: string;
      totalResults: number;
      searchTime: number; // ms
    };
  };
}
```

**使用例:**
```javascript
// 「Next.js」に関する質問を検索
const response = await fetch('/api/search/questions?q=Next.js&tags=frontend&sort=relevance');
```

#### POST `/api/search/semantic`
セマンティック検索（ベクトル検索）

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  query: string;
  limit?: number;
  threshold?: number;     // 類似度閾値（0.0-1.0）
  filters?: {
    tags?: string[];
    status?: string[];
    date_range?: {
      from: string;
      to: string;
    };
  };
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    results: Array<{
      question: QuestionSummary;
      similarity: number;
      highlights: string[];
    }>;
    searchMeta: {
      query: string;
      embedding_time: number;
      search_time: number;
    };
  };
}
```

### 🤖 AI支援 (`/api/ai`)

#### POST `/api/ai/generate-answer`
AI回答生成支援

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  question_id: string;
  context?: string;
  style?: 'professional' | 'casual' | 'technical';
  length?: 'short' | 'medium' | 'long';
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    generated_content: string;
    confidence: number;
    suggestions: string[];
    sources?: string[];
  };
}
```

#### POST `/api/ai/improve-content`
コンテンツ改善提案

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  content: string;
  type: 'question' | 'answer';
  improvements?: ('grammar' | 'clarity' | 'structure' | 'tone')[];
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    improved_content: string;
    suggestions: Array<{
      type: string;
      original: string;
      improved: string;
      reason: string;
    }>;
  };
}
```

#### POST `/api/ai/moderate-content`
コンテンツモデレーション

**Request:**
```typescript
{
  content: string;
  type: 'question' | 'answer' | 'comment';
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    is_safe: boolean;
    flagged_categories: string[];
    confidence: number;
    suggested_action: 'approve' | 'review' | 'reject';
  };
}
```

### 💳 決済・サブスクリプション (`/api/payments`)

#### POST `/api/payments/create-subscription`
サブスクリプション作成

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  plan_type: 'specialist_monthly';
  payment_method_id: string; // Stripe Payment Method ID
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    subscription: SubscriptionInfo;
    client_secret?: string; // 3D Secure用
  };
}
```

#### POST `/api/payments/cancel-subscription`
サブスクリプション解約

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
{
  cancel_at_period_end: boolean;
  reason?: string;
}
```

#### GET `/api/payments/history`
決済履歴取得

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  status?: 'succeeded' | 'failed' | 'pending';
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    payments: PaymentHistory[];
    pagination: PaginationInfo;
  };
}
```

#### POST `/api/payments/webhook`
Stripe Webhook

**Headers:** `Stripe-Signature: <signature>`

**Request Body:** Stripe Event Object

### 📝 コンテンツ管理 (`/api/content`)

#### GET `/api/content/articles`
インタビュー記事一覧

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    articles: ArticleSummary[];
    pagination: PaginationInfo;
  };
}
```

#### GET `/api/content/articles/:slug`
記事詳細取得

**Response (200):**
```typescript
{
  success: true;
  data: {
    article: ArticleDetail;
    relatedArticles: ArticleSummary[];
    tags: Tag[];
  };
}
```

#### POST `/api/content/sync-cms`
CMS同期（管理者のみ）

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
{
  success: true;
  data: {
    synced_count: number;
    updated_count: number;
    errors: string[];
  };
}
```

## エラーレスポンス

### 標準エラー形式
```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}
```

### エラーコード一覧

| コード | 説明 | HTTPステータス |
|--------|------|----------------|
| `UNAUTHORIZED` | 認証が必要 | 401 |
| `FORBIDDEN` | アクセス権限なし | 403 |
| `NOT_FOUND` | リソースが見つからない | 404 |
| `VALIDATION_ERROR` | 入力値エラー | 400 |
| `RATE_LIMIT_EXCEEDED` | レート制限超過 | 429 |
| `SUBSCRIPTION_REQUIRED` | サブスクリプション必要 | 402 |
| `INTERNAL_SERVER_ERROR` | サーバーエラー | 500 |

## Rate Limiting

### 制限値
- **IP別**: 100リクエスト/15分
- **ユーザー別**: 30リクエスト/分
- **AI API**: 10リクエスト/分

### レスポンスヘッダー
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
```

## バージョニング

### APIバージョン管理
```
/api/v1/questions    # v1.0 API
/api/v2/questions    # v2.0 API（将来）
```

### 後方互換性
- v1 APIは最低1年間サポート
- 廃止予定機能は3ヶ月前に通知
- 新機能は段階的にロールアウト

---

**このAPIドキュメントは開発進捗に応じて継続的に更新されます。実装前に最新版を確認してください。**

