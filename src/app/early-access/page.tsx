'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  earlyAccessSchema,
  type EarlyAccessFormData,
} from '@/lib/validations/early-access'

export default function Subscribe(): JSX.Element {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EarlyAccessFormData>({
    resolver: zodResolver(earlyAccessSchema),
  })

  const onSubmit = async (data: EarlyAccessFormData): Promise<void> => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || '登録に失敗しました')
      }

      // 成功時は完了画面に遷移
      router.push('/early-access/success')
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : '登録に失敗しました'
      )
    } finally {
      setIsSubmitting(false)
    }
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

            {submitError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  {...register('email')}
                  className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-600 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  お名前（任意）
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                  placeholder="田中太郎"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  メッセージ（任意）
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                  placeholder="AIについてお聞きしたいことがあれば..."
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
