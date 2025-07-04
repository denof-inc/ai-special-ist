# 開発環境セットアップガイド

## 開発ツール

### Lint & Format
```bash
# ESLint実行
npm run lint

# ESLint自動修正
npm run lint:fix

# Prettier実行
npm run format

# Prettier確認のみ
npm run format:check

# 型チェック
npm run type-check
```

### テスト
```bash
# テスト実行
npm run test

# Watch モード
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage

# CI用テスト（カバレッジ + 非watch）
npm run test:ci
```

### 品質チェック（全体）
```bash
# 全品質チェック実行
npm run quality:check
```

## 設定詳細

### ESLint設定
- Next.js 14 + TypeScript + Tailwind CSS対応
- any型使用禁止（CLAUDE.md準拠）
- 自動import整理
- Tailwind CSSクラス順序チェック

### Jest設定
- Next.js統合テスト環境
- カバレッジ閾値: 80%
- React Testing Library + Jest DOM

### GitHub Actions
- Node.js 18.x, 20.x マトリックステスト
- Lint, 型チェック, テスト
- セキュリティスキャン
- ビルド確認

## 品質基準
- ESLintエラー: 0件
- TypeScriptエラー: 0件
- テストカバレッジ: 80%以上
- Prettierフォーマット準拠