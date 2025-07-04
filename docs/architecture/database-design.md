# データベース設計

**更新日**: 2025-07-04  
**担当者**: 技術リード  
**対象フェーズ**: v0.1 PoC → Year-1

## 概要

AIスペシャリスト.comのデータベース設計について、ER図、テーブル設計、インデックス戦略、マイグレーション計画を詳細に説明します。

## データベース概要

### 技術選択

- **RDBMS**: PostgreSQL 14+
- **ORM**: Prisma (v0.1) → TypeORM (Year-1)
- **拡張機能**: pgvector (ベクトル検索用)
- **バックアップ**: AWS RDS自動バックアップ + S3

### フェーズ別構成

```
v0.1 PoC:    PostgreSQL + Prisma (単一DB)
v1.0 β:      PostgreSQL + pgvector + Redis Cache
Year-1:      Aurora PostgreSQL + Read Replica + Microservices
```

## ER図

### 全体概要

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Users    │    │  Questions  │    │   Answers   │
│             │───▶│             │◄───│             │
│ (Clients &  │    │ (Q&A Posts) │    │ (Responses) │
│ Specialists)│    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   ▼                   ▼
       │           ┌─────────────┐    ┌─────────────┐
       │           │    Tags     │    │    Votes    │
       │           │(Categories) │    │ (Rating)    │
       │           └─────────────┘    └─────────────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Subscriptions│    │  Payments   │    │ Comments    │
│(Billing)    │    │ (Stripe)    │    │(Discussions)│
└─────────────┘    └─────────────┘    └─────────────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ CMS Content │    │  Analytics  │    │   Logs      │
│(Articles)   │    │ (Metrics)   │    │ (Audit)     │
└─────────────┘    └─────────────┘    └─────────────┘
```

## テーブル設計

### 1. ユーザー管理

#### users テーブル

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    avatar_url VARCHAR(500),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verification_token UUID,
    password_reset_token UUID,
    password_reset_expires TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Role ENUM
CREATE TYPE user_role AS ENUM ('client', 'specialist', 'admin');

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### user_profiles テーブル

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Specialist specific fields
    specialties TEXT[], -- ['AI', 'Machine Learning', 'Web Development']
    experience_years INTEGER,
    hourly_rate INTEGER, -- in JPY
    portfolio_url VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    certifications JSONB,
    skills JSONB,
    availability_status VARCHAR(20) DEFAULT 'available', -- available, busy, offline

    -- Location & Contact
    location VARCHAR(100),
    timezone VARCHAR(50),
    languages TEXT[] DEFAULT ARRAY['Japanese'],

    -- Statistics (denormalized for performance)
    total_questions INTEGER DEFAULT 0,
    total_answers INTEGER DEFAULT 0,
    accepted_answers INTEGER DEFAULT 0,
    total_upvotes INTEGER DEFAULT 0,
    reputation_score INTEGER DEFAULT 0,
    response_time_avg INTEGER, -- in minutes

    -- SEO & Discovery
    slug VARCHAR(100) UNIQUE,
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT valid_hourly_rate CHECK (hourly_rate IS NULL OR hourly_rate >= 1000),
    CONSTRAINT valid_experience CHECK (experience_years IS NULL OR experience_years >= 0),
    CONSTRAINT valid_reputation CHECK (reputation_score >= 0)
);

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_specialties ON user_profiles USING GIN (specialties);
CREATE INDEX idx_user_profiles_availability ON user_profiles(availability_status);
CREATE INDEX idx_user_profiles_reputation ON user_profiles(reputation_score DESC);
CREATE INDEX idx_user_profiles_slug ON user_profiles(slug) WHERE slug IS NOT NULL;
```

### 2. 質問・回答システム

#### questions テーブル

```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,

    -- Metadata
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status question_status DEFAULT 'open',
    priority question_priority DEFAULT 'normal',

    -- Content & SEO
    excerpt TEXT, -- Auto-generated from content
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),

    -- Business Logic
    budget_min INTEGER,
    budget_max INTEGER,
    deadline TIMESTAMP,
    accepted_answer_id UUID, -- Self-reference to answers table

    -- Analytics (denormalized)
    view_count INTEGER DEFAULT 0,
    answer_count INTEGER DEFAULT 0,
    upvote_count INTEGER DEFAULT 0,
    downvote_count INTEGER DEFAULT 0,

    -- AI/Search Enhancement
    content_vector VECTOR(1536), -- OpenAI embeddings
    search_vector TSVECTOR, -- Full-text search
    language VARCHAR(10) DEFAULT 'ja',

    -- Timestamps
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT valid_budget CHECK (
        (budget_min IS NULL AND budget_max IS NULL) OR
        (budget_min IS NOT NULL AND budget_max IS NOT NULL AND budget_min <= budget_max)
    ),
    CONSTRAINT valid_deadline CHECK (deadline IS NULL OR deadline > created_at)
);

-- ENUMs
CREATE TYPE question_status AS ENUM ('open', 'answered', 'closed', 'archived');
CREATE TYPE question_priority AS ENUM ('low', 'normal', 'high', 'urgent');

-- Triggers
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate search_vector
CREATE OR REPLACE FUNCTION update_question_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('japanese',
        COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_question_search_vector_trigger
    BEFORE INSERT OR UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_question_search_vector();

-- Indexes
CREATE INDEX idx_questions_author_id ON questions(author_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX idx_questions_last_activity ON questions(last_activity_at DESC);
CREATE INDEX idx_questions_search_vector ON questions USING GIN (search_vector);
CREATE INDEX idx_questions_content_vector ON questions USING ivfflat (content_vector vector_cosine_ops);
CREATE INDEX idx_questions_slug ON questions(slug);
CREATE INDEX idx_questions_view_count ON questions(view_count DESC);
```

#### answers テーブル

```sql
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Content
    content TEXT NOT NULL,
    content_html TEXT, -- Rendered HTML for performance

    -- Business Logic
    is_accepted BOOLEAN DEFAULT FALSE,
    estimated_hours INTEGER,
    proposed_rate INTEGER, -- Specialist's proposed rate

    -- Analytics
    upvote_count INTEGER DEFAULT 0,
    downvote_count INTEGER DEFAULT 0,

    -- AI Enhancement
    content_vector VECTOR(1536),

    -- Timestamps
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT valid_proposed_rate CHECK (proposed_rate IS NULL OR proposed_rate >= 1000),
    CONSTRAINT valid_estimated_hours CHECK (estimated_hours IS NULL OR estimated_hours > 0),
    CONSTRAINT unique_accepted_per_question EXCLUDE (question_id WITH =) WHERE (is_accepted = TRUE)
);

-- Triggers
CREATE TRIGGER update_answers_updated_at
    BEFORE UPDATE ON answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update question stats when answer is added/removed
CREATE OR REPLACE FUNCTION update_question_answer_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE questions SET
            answer_count = answer_count + 1,
            last_activity_at = CURRENT_TIMESTAMP
        WHERE id = NEW.question_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE questions SET
            answer_count = answer_count - 1,
            last_activity_at = CURRENT_TIMESTAMP
        WHERE id = OLD.question_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' AND OLD.is_accepted != NEW.is_accepted THEN
        UPDATE questions SET
            accepted_answer_id = CASE WHEN NEW.is_accepted THEN NEW.id ELSE NULL END,
            status = CASE WHEN NEW.is_accepted THEN 'answered' ELSE 'open' END,
            last_activity_at = CURRENT_TIMESTAMP
        WHERE id = NEW.question_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_question_answer_count_trigger
    AFTER INSERT OR DELETE OR UPDATE ON answers
    FOR EACH ROW EXECUTE FUNCTION update_question_answer_count();

-- Indexes
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_author_id ON answers(author_id);
CREATE INDEX idx_answers_created_at ON answers(created_at DESC);
CREATE INDEX idx_answers_is_accepted ON answers(is_accepted) WHERE is_accepted = TRUE;
CREATE INDEX idx_answers_content_vector ON answers USING ivfflat (content_vector vector_cosine_ops);
```

### 3. タグ・カテゴリ

#### tags テーブル

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    icon_name VARCHAR(50),

    -- Hierarchy support
    parent_id UUID REFERENCES tags(id) ON DELETE SET NULL,
    path TEXT, -- Materialized path: /tech/frontend/react
    level INTEGER DEFAULT 0,

    -- Analytics
    usage_count INTEGER DEFAULT 0,
    question_count INTEGER DEFAULT 0,

    -- SEO
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),

    -- Admin
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT valid_level CHECK (level >= 0 AND level <= 5),
    CONSTRAINT no_self_parent CHECK (parent_id != id)
);

-- Triggers
CREATE TRIGGER update_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_parent_id ON tags(parent_id);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);
CREATE INDEX idx_tags_path ON tags(path);
CREATE INDEX idx_tags_is_featured ON tags(is_featured) WHERE is_featured = TRUE;
```

#### question_tags テーブル (Many-to-Many)

```sql
CREATE TABLE question_tags (
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (question_id, tag_id)
);

-- Auto-update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET
            usage_count = usage_count + 1,
            question_count = question_count + 1
        WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET
            usage_count = usage_count - 1,
            question_count = question_count - 1
        WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_usage_count_trigger
    AFTER INSERT OR DELETE ON question_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- Indexes
CREATE INDEX idx_question_tags_question_id ON question_tags(question_id);
CREATE INDEX idx_question_tags_tag_id ON question_tags(tag_id);
```

### 4. 投票・評価システム

#### votes テーブル

```sql
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Polymorphic reference (question or answer)
    votable_type VARCHAR(20) NOT NULL, -- 'question' or 'answer'
    votable_id UUID NOT NULL,

    vote_type vote_type NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- One vote per user per item
    UNIQUE(user_id, votable_type, votable_id)
);

CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');

-- Trigger to update vote counts
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.votable_type = 'question' THEN
            IF NEW.vote_type = 'upvote' THEN
                UPDATE questions SET upvote_count = upvote_count + 1 WHERE id = NEW.votable_id;
            ELSE
                UPDATE questions SET downvote_count = downvote_count + 1 WHERE id = NEW.votable_id;
            END IF;
        ELSIF NEW.votable_type = 'answer' THEN
            IF NEW.vote_type = 'upvote' THEN
                UPDATE answers SET upvote_count = upvote_count + 1 WHERE id = NEW.votable_id;
            ELSE
                UPDATE answers SET downvote_count = downvote_count + 1 WHERE id = NEW.votable_id;
            END IF;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.votable_type = 'question' THEN
            IF OLD.vote_type = 'upvote' THEN
                UPDATE questions SET upvote_count = upvote_count - 1 WHERE id = OLD.votable_id;
            ELSE
                UPDATE questions SET downvote_count = downvote_count - 1 WHERE id = OLD.votable_id;
            END IF;
        ELSIF OLD.votable_type = 'answer' THEN
            IF OLD.vote_type = 'upvote' THEN
                UPDATE answers SET upvote_count = upvote_count - 1 WHERE id = OLD.votable_id;
            ELSE
                UPDATE answers SET downvote_count = downvote_count - 1 WHERE id = OLD.votable_id;
            END IF;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' AND OLD.vote_type != NEW.vote_type THEN
        -- Handle vote type change (upvote -> downvote or vice versa)
        -- Remove old vote count and add new vote count
        -- (Implementation details omitted for brevity)
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vote_counts_trigger
    AFTER INSERT OR DELETE OR UPDATE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_vote_counts();

-- Indexes
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_votable ON votes(votable_type, votable_id);
CREATE UNIQUE INDEX idx_votes_unique_user_vote ON votes(user_id, votable_type, votable_id);
```

### 5. サブスクリプション・決済

#### subscriptions テーブル

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Stripe Integration
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255) NOT NULL,
    stripe_price_id VARCHAR(255) NOT NULL,

    -- Subscription Details
    plan_type subscription_plan NOT NULL,
    status subscription_status NOT NULL,

    -- Pricing
    amount INTEGER NOT NULL, -- in JPY cents
    currency VARCHAR(3) DEFAULT 'JPY',

    -- Billing Cycle
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,

    -- Cancellation
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP,
    cancellation_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Only one active subscription per user
    UNIQUE(user_id) WHERE status = 'active'
);

-- ENUMs
CREATE TYPE subscription_plan AS ENUM ('specialist_monthly', 'specialist_yearly');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'unpaid', 'trialing');

-- Triggers
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_current_period_end ON subscriptions(current_period_end);
```

#### payments テーブル

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

    -- Stripe Integration
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),

    -- Payment Details
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'JPY',
    status payment_status NOT NULL,
    payment_method_type VARCHAR(50), -- 'card', 'bank_transfer', etc.

    -- Metadata
    description TEXT,
    failure_reason TEXT,
    receipt_url VARCHAR(500),

    -- Timestamps
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'canceled', 'refunded');

-- Triggers
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
```

### 6. コンテンツ管理

#### cms_articles テーブル (インタビューコンテンツ)

```sql
CREATE TABLE cms_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Content
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    content_html TEXT, -- Rendered HTML

    -- Metadata
    author_id UUID REFERENCES users(id),
    featured_image_url VARCHAR(500),

    -- SEO
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),
    canonical_url VARCHAR(500),

    -- Publishing
    status article_status DEFAULT 'draft',
    published_at TIMESTAMP,

    -- Analytics
    view_count INTEGER DEFAULT 0,
    reading_time INTEGER, -- Estimated reading time in minutes

    -- AI Enhancement
    content_vector VECTOR(1536),
    search_vector TSVECTOR,

    -- External CMS Integration
    cms_id VARCHAR(100), -- Strapi/microCMS ID
    cms_last_sync TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');

-- Triggers
CREATE TRIGGER update_cms_articles_updated_at
    BEFORE UPDATE ON cms_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate search vector
CREATE OR REPLACE FUNCTION update_article_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('japanese',
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(NEW.excerpt, '') || ' ' ||
        COALESCE(NEW.content, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_article_search_vector_trigger
    BEFORE INSERT OR UPDATE ON cms_articles
    FOR EACH ROW EXECUTE FUNCTION update_article_search_vector();

-- Indexes
CREATE INDEX idx_cms_articles_slug ON cms_articles(slug);
CREATE INDEX idx_cms_articles_status ON cms_articles(status);
CREATE INDEX idx_cms_articles_published_at ON cms_articles(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_cms_articles_search_vector ON cms_articles USING GIN (search_vector);
CREATE INDEX idx_cms_articles_content_vector ON cms_articles USING ivfflat (content_vector vector_cosine_ops);
CREATE INDEX idx_cms_articles_view_count ON cms_articles(view_count DESC);
```

#### article_tags テーブル

```sql
CREATE TABLE article_tags (
    article_id UUID NOT NULL REFERENCES cms_articles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (article_id, tag_id)
);

-- Indexes
CREATE INDEX idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag_id ON article_tags(tag_id);
```

## パフォーマンス最適化

### インデックス戦略

```sql
-- 複合インデックス (よく一緒に使われるカラム)
CREATE INDEX idx_questions_status_created_at ON questions(status, created_at DESC);
CREATE INDEX idx_questions_author_status ON questions(author_id, status);
CREATE INDEX idx_answers_question_accepted ON answers(question_id, is_accepted);

-- 部分インデックス (条件付きデータのみ)
CREATE INDEX idx_questions_open ON questions(created_at DESC) WHERE status = 'open';
CREATE INDEX idx_users_specialists ON users(created_at DESC) WHERE role = 'specialist';
CREATE INDEX idx_subscriptions_active ON subscriptions(user_id) WHERE status = 'active';

-- 関数ベースインデックス
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
CREATE INDEX idx_tags_name_lower ON tags(LOWER(name));
```

### クエリ最適化例

```sql
-- 人気の質問取得 (複合インデックス使用)
SELECT q.id, q.title, q.view_count, q.answer_count
FROM questions q
WHERE q.status = 'open'
ORDER BY q.view_count DESC, q.created_at DESC
LIMIT 20;

-- 専門家検索 (部分インデックス + GIN使用)
SELECT up.user_id, u.name, up.specialties, up.reputation_score
FROM user_profiles up
JOIN users u ON u.id = up.user_id
WHERE u.role = 'specialist'
  AND up.specialties && ARRAY['AI', 'Machine Learning']
  AND up.availability_status = 'available'
ORDER BY up.reputation_score DESC
LIMIT 10;

-- セマンティック検索 (ベクトル検索)
SELECT q.id, q.title, q.content,
       1 - (q.content_vector <=> $1::vector) AS similarity
FROM questions q
WHERE 1 - (q.content_vector <=> $1::vector) > 0.8
ORDER BY similarity DESC
LIMIT 10;
```

## データ整合性

### 制約・バリデーション

```sql
-- ビジネスルール制約
ALTER TABLE user_profiles ADD CONSTRAINT check_specialist_fields
CHECK (
    (user_id IN (SELECT id FROM users WHERE role = 'specialist') AND
     specialties IS NOT NULL AND
     array_length(specialties, 1) > 0) OR
    (user_id IN (SELECT id FROM users WHERE role = 'client'))
);

-- データ品質制約
ALTER TABLE questions ADD CONSTRAINT check_title_length
CHECK (char_length(trim(title)) >= 10);

ALTER TABLE questions ADD CONSTRAINT check_content_length
CHECK (char_length(trim(content)) >= 20);

-- 参照整合性 (Cascading Deletes)
-- 既に定義済みのForeign Key制約で実装
```

### 統計情報同期

```sql
-- 統計情報を定期的に更新するプロシージャ
CREATE OR REPLACE FUNCTION sync_user_statistics()
RETURNS VOID AS $$
BEGIN
    -- User統計情報更新
    UPDATE user_profiles SET
        total_questions = (
            SELECT COUNT(*) FROM questions
            WHERE author_id = user_profiles.user_id
        ),
        total_answers = (
            SELECT COUNT(*) FROM answers
            WHERE author_id = user_profiles.user_id
        ),
        accepted_answers = (
            SELECT COUNT(*) FROM answers
            WHERE author_id = user_profiles.user_id AND is_accepted = TRUE
        ),
        total_upvotes = (
            SELECT COALESCE(SUM(upvote_count), 0) FROM answers
            WHERE author_id = user_profiles.user_id
        );

    -- Reputation計算
    UPDATE user_profiles SET
        reputation_score = (
            accepted_answers * 15 +
            total_upvotes * 2 +
            total_answers * 1
        );
END;
$$ LANGUAGE plpgsql;

-- 日次実行のCron Job
-- SELECT cron.schedule('sync-user-stats', '0 2 * * *', 'SELECT sync_user_statistics();');
```

## バックアップ・復旧

### バックアップ戦略

```sql
-- 重要テーブルの優先度
-- Priority 1 (Critical): users, user_profiles, subscriptions, payments
-- Priority 2 (Important): questions, answers, votes
-- Priority 3 (Recoverable): cms_articles, tags, analytics

-- Point-in-Time Recovery準備
-- WAL (Write-Ahead Logging) 設定
-- postgresql.conf:
-- wal_level = replica
-- archive_mode = on
-- archive_command = 'aws s3 cp %p s3://your-backup-bucket/wal/%f'
```

### 災害復旧手順

```bash
# 1. 最新のBaseBackupから復元
pg_basebackup -h source-server -D /var/lib/postgresql/data -U replication -W

# 2. WALファイルから特定時点まで復旧
# recovery.conf設定
# restore_command = 'aws s3 cp s3://your-backup-bucket/wal/%f %p'
# recovery_target_time = '2025-07-04 12:00:00 JST'

# 3. データ整合性チェック
psql -c "SELECT COUNT(*) FROM users;"
psql -c "SELECT COUNT(*) FROM questions;"
```

## マイグレーション計画

### v0.1 → v1.0 移行

```sql
-- pgvector拡張機能追加
CREATE EXTENSION IF NOT EXISTS vector;

-- ベクトルカラム追加
ALTER TABLE questions ADD COLUMN content_vector VECTOR(1536);
ALTER TABLE answers ADD COLUMN content_vector VECTOR(1536);
ALTER TABLE cms_articles ADD COLUMN content_vector VECTOR(1536);

-- インデックス作成
CREATE INDEX CONCURRENTLY idx_questions_content_vector
ON questions USING ivfflat (content_vector vector_cosine_ops);
```

### v1.0 → Year-1 移行 (Microservices)

```sql
-- 段階的なデータベース分離
-- 1. Auth Service DB
CREATE DATABASE auth_service;

-- 2. Content Service DB
CREATE DATABASE content_service;

-- 3. Search Service DB
CREATE DATABASE search_service;

-- データ移行スクリプト
-- pg_dump specific tables and restore to new databases
```

---

**このデータベース設計は、パフォーマンス、拡張性、保守性を考慮した設計となっています。段階的に実装し、定期的にパフォーマンス監視を行ってください。**
