# Logger使用ガイド

## 概要

強力なLoggerクラスを実装し、運用・デバッグに必要な機能を提供します。

## 基本的な使用方法

### インポート

```typescript
import { logger } from '@/lib/logger'
```

### ログレベル

```typescript
// 開発時のデバッグ情報
logger.debug('詳細なデバッグ情報', { component: 'UserService' })

// 一般的な情報
logger.info('ユーザーがログインしました', { userId: 'user123' })

// 警告（問題ではないが注意が必要）
logger.warn('APIレスポンスが遅いです', { duration: 3000 })

// エラー（問題が発生）
logger.error('データベース接続に失敗', error, { operation: 'user_fetch' })

// 致命的エラー（システムが停止する可能性）
logger.fatal('システムが応答しません', error, { component: 'Database' })
```

## 便利メソッド

### リクエストログ

```typescript
logger.request('GET', '/api/users', { requestId: 'req_123' })
```

### パフォーマンス測定

```typescript
const start = Date.now()
// 何らかの処理
const duration = Date.now() - start
logger.performance('database_query', duration, { query: 'SELECT * FROM users' })
```

### ユーザーアクション追跡

```typescript
logger.userAction('login', 'user123', { 
  component: 'AuthComponent',
  method: 'email' 
})
```

### エラーバウンダリでの例外キャッチ

```typescript
// React Error Boundary内
logger.captureException(error, { 
  component: 'UserProfile',
  props: { userId: 'user123' }
})
```

## 構造化ログ

### コンテキスト情報

```typescript
const context = {
  userId: 'user123',
  requestId: 'req_456',
  component: 'PaymentService',
  action: 'process_payment',
  metadata: {
    amount: 1000,
    currency: 'JPY',
    paymentMethod: 'credit_card'
  }
}

logger.info('決済処理を開始', context)
```

### ログ出力例（本番環境）

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "決済処理を開始",
  "context": {
    "userId": "user123",
    "requestId": "req_456",
    "component": "PaymentService",
    "action": "process_payment",
    "metadata": {
      "amount": 1000,
      "currency": "JPY",
      "paymentMethod": "credit_card"
    }
  },
  "environment": "production",
  "version": "1.0.0"
}
```

## 環境別設定

### 開発環境

```typescript
import { LoggerClass } from '@/lib/logger'

const devLogger = new LoggerClass({
  level: 'debug',
  enableConsole: true,
  enableJson: false, // 読みやすいコンソール出力
})
```

### 本番環境

```typescript
const prodLogger = new LoggerClass({
  level: 'info',
  enableConsole: true,
  enableJson: true, // JSON形式で構造化
  enableRemote: true,
  remoteEndpoint: 'https://logs.example.com/api'
})
```

## Next.js での使用

### API Routes

```typescript
// pages/api/users.ts または app/api/users/route.ts
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  const requestId = crypto.randomUUID()
  
  logger.request('GET', '/api/users', { requestId })
  
  try {
    const users = await fetchUsers()
    logger.info('ユーザー一覧を取得しました', { 
      requestId,
      count: users.length 
    })
    return Response.json(users)
  } catch (error) {
    logger.error('ユーザー取得に失敗', error, { requestId })
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

### React Components

```typescript
// components/UserProfile.tsx
import { logger } from '@/lib/logger'
import { useEffect } from 'react'

export function UserProfile({ userId }: { userId: string }) {
  useEffect(() => {
    logger.info('ユーザープロフィールを表示', {
      component: 'UserProfile',
      userId
    })
  }, [userId])

  const handleAction = async () => {
    try {
      logger.userAction('profile_update', userId, { 
        component: 'UserProfile' 
      })
      
      await updateProfile()
      
      logger.info('プロフィール更新完了', { userId })
    } catch (error) {
      logger.error('プロフィール更新に失敗', error, { 
        userId,
        component: 'UserProfile' 
      })
    }
  }

  return (
    <div>
      {/* プロフィール表示 */}
    </div>
  )
}
```

### Error Boundary

```typescript
import { logger } from '@/lib/logger'
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    logger.captureException(error, {
      component: 'ErrorBoundary',
      metadata: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return <h1>何かが間違いました</h1>
    }

    return this.props.children
  }
}
```

## 運用でのログ分析

### 検索例

```bash
# エラーログのみ抽出
jq 'select(.level == "error")' logs.json

# 特定ユーザーのアクション追跡
jq 'select(.context.userId == "user123")' logs.json

# パフォーマンス問題の特定
jq 'select(.context.action == "performance" and .context.metadata.duration > 1000)' logs.json

# 特定コンポーネントのエラー
jq 'select(.level == "error" and .context.component == "PaymentService")' logs.json
```

## ベストプラクティス

### 1. 適切なログレベルの使用

- `debug`: 開発時のみ、詳細な情報
- `info`: 正常な処理の記録
- `warn`: 問題ではないが注意が必要
- `error`: 処理に失敗したが回復可能
- `fatal`: システムが停止する重大な問題

### 2. 構造化されたコンテキスト

```typescript
// Good: 構造化された情報
logger.info('注文処理完了', {
  orderId: 'order_123',
  userId: 'user_456',
  amount: 1500,
  status: 'completed'
})

// Bad: 文字列に全て含める
logger.info('注文order_123がuser_456によって1500円で完了しました')
```

### 3. エラーハンドリング

```typescript
try {
  await riskyOperation()
} catch (error) {
  // エラーオブジェクトと追加コンテキストを含める
  logger.error('リスクのある操作が失敗', error, {
    operation: 'riskyOperation',
    retryCount: 3
  })
  throw error // 必要に応じて再スロー
}
```

### 4. パフォーマンス意識

```typescript
// Logger は非同期で処理されるため、アプリケーションのパフォーマンスに影響しません
// ただし、大量のログを出力する場合は適切なレベル設定を行ってください

// 本番環境では debug レベルを無効にする
const logger = new LoggerClass({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
})
```

## 外部サービス連携

### Sentry連携例

```typescript
const logger = new LoggerClass({
  level: 'info',
  enableRemote: true,
  remoteEndpoint: 'https://sentry.io/api/your-project/logs'
})
```

### CloudWatch連携例

```typescript
// AWS Lambda環境での使用
const logger = new LoggerClass({
  level: 'info',
  enableConsole: true,
  enableJson: true, // CloudWatch Logs で構造化ログとして記録
})
```

このLoggerクラスにより、開発から運用まで一貫したログ管理が可能になります。