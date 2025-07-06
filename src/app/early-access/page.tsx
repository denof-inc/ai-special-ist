'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Subscribe(): JSX.Element {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: 実際のAPI連携を実装
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-4 text-5xl text-green-600">✓</div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              ご登録ありがとうございます
            </h1>
            <p className="mb-6 text-gray-600">最新情報をお送りいたします。</p>
            <Link href="/" className="btn-gradient-accent">
              ホームに戻る
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            AIスペシャリスト.com
          </h1>
          <p className="text-xl text-gray-600">
            匿名でAIの悩み相談できるサイト
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* LP部分 */}
          <div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              先行登録者限定の特別特典
            </h2>

            <div className="mb-8 space-y-4">
              <div className="flex items-start">
                <div className="text-gradient-accent mr-3 mt-1">•</div>
                <p className="text-gray-700">
                  <strong>3ヶ月間無料でサービスをご利用いただけます</strong>
                  <br />
                  正式リリース後、有料プランの機能を3ヶ月間無料でお試しいただけます
                </p>
              </div>

              <div className="flex items-start">
                <div className="text-gradient-accent mr-3 mt-1">•</div>
                <p className="text-gray-700">
                  <strong>アーリーアダプター専用バッジを付与</strong>
                  <br />
                  サービス内で先行登録者であることを示す特別なバッジを表示いたします
                </p>
              </div>

              <div className="flex items-start">
                <div className="text-gradient-accent mr-3 mt-1">•</div>
                <p className="text-gray-700">
                  <strong>開発進捗レポートを定期配信</strong>
                  <br />
                  新機能の開発状況や先行プレビュー版へのアクセス権をご提供いたします
                </p>
              </div>
            </div>

            <div className="card-gradient-accent rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>現在準備中：</strong>
                <Link
                  href="/interview"
                  className="ml-1 underline hover:no-underline"
                >
                  インタビューメディア
                </Link>
                は既にご覧いただけます
              </p>
            </div>
          </div>

          {/* フォーム部分 */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-center text-2xl font-bold text-gray-900">
              無料で先行登録
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gradient-accent w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? '登録中...' : '無料で先行登録する'}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-500">
              登録いただいたメールアドレスは、サービス案内以外の目的では使用いたしません。
              <br />
              <Link href="/privacy" className="underline hover:no-underline">
                プライバシーポリシー
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
