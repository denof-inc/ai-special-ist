# Resend API セットアップガイド

## 概要

AIスペシャリスト.comの早期登録メール機能で使用するResend APIの設定手順です。

## Resend アカウント作成

### 1. アカウント登録

1. [Resend公式サイト](https://resend.com) にアクセス
2. "Sign up"をクリック
3. メールアドレスとパスワードを入力
4. 認証メールを確認してアカウントを有効化

### 2. APIキー取得

1. Resendダッシュボードにログイン
2. 左サイドバーの "API Keys" をクリック
3. "Create API Key" ボタンをクリック
4. キー名を入力（例：ai-specialist-production）
5. 権限を "Full access" に設定
6. "Create" ボタンをクリック
7. **生成されたAPIキーをコピー**（再表示されないため注意）

### 3. ドメイン設定（推奨）

1. 左サイドバーの "Domains" をクリック
2. "Add Domain" ボタンをクリック
3. 送信元ドメインを入力（例：aispecialist.com）
4. DNS設定を追加（提供されるTXTレコードをDNSに追加）
5. 認証完了まで待機

## 環境変数設定

### 1. 本番環境用設定

```bash
# .env.production ファイルに追加
RESEND_API_KEY="re_your_actual_api_key_here"
```

### 2. 開発環境用設定

```bash
# .env ファイルに追加（開発・テスト用）
RESEND_API_KEY="re_your_development_api_key_here"
```

## テスト送信

### 1. API動作確認

```bash
# 開発サーバー起動
pnpm run dev

# テスト送信
curl -X POST http://localhost:3000/api/early-access \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "テストユーザー"
  }'
```

### 2. メール確認事項

- 送信者アドレス：`AIスペシャリスト.com <noreply@aispecialist.com>`
- 件名：`【AIスペシャリスト.com】先行登録ありがとうございます！`
- 本文：HTML形式のウェルカムメール
- 特典内容の記載確認

## 送信制限・料金

### 無料プラン制限

- 月間 3,000通まで無料
- 1日最大 100通
- 1時間最大 10通

### 有料プラン

- 詳細は [Resend Pricing](https://resend.com/pricing) を参照
- 必要に応じてアップグレード

## トラブルシューティング

### よくある問題

1. **APIキーエラー**

   ```
   Error: Invalid API key
   ```

   - APIキーの形式確認（re\_で始まる）
   - 環境変数の設定確認

2. **ドメイン認証エラー**

   ```
   Error: Domain not verified
   ```

   - DNS設定の確認
   - 認証完了まで時間が必要

3. **送信制限エラー**

   ```
   Error: Rate limit exceeded
   ```

   - 送信頻度の調整
   - プラン制限の確認

### デバッグ用ログ

```javascript
// src/lib/email.ts のデバッグ用
console.log('Resend instance:', !!resendClient)
console.log('API Key prefix:', process.env.RESEND_API_KEY?.substring(0, 5))
```

## セキュリティ

### APIキー管理

- ❌ Git にコミットしない
- ❌ ブラウザからアクセス可能にしない
- ✅ 環境変数で管理
- ✅ 定期的なローテーション

### 不正利用対策

- レート制限の設定
- 送信先ドメインの制限
- ログ監視の実装

## 監視・運用

### 送信ログ確認

1. Resendダッシュボードの "Logs" セクション
2. 送信状況とエラーログの確認
3. 開封率・クリック率の分析

### アラート設定

- 送信失敗率の監視
- 月間制限の使用量アラート
- 異常な送信パターンの検知
