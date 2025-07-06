'use client'

import { CheckCircle, Mail, ArrowRight, Gift } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function EarlyAccessSuccessPage(): JSX.Element {
  useEffect(() => {
    // ページビューをログ記録
    if (typeof window !== 'undefined') {
      // Success page viewed (tracked via analytics if configured)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 opacity-25 blur"></div>
            <div className="relative inline-block rounded-full bg-white p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          {/* Main Message */}
          <h1 className="mb-6 text-4xl font-bold text-gray-900">
            先行登録が完了しました！
          </h1>

          <p className="mb-8 text-xl text-gray-600">
            ご登録いただいた <strong>メールアドレス</strong>{' '}
            に確認メールをお送りしています。
          </p>

          {/* Email Check Section */}
          <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="mb-4 flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-blue-900">
              メールをご確認ください
            </h2>
            <p className="text-sm text-blue-700">
              確認メールが届かない場合は、迷惑メールフォルダもご確認ください。
              <br />
              数分経っても届かない場合は、お手数ですがお問い合わせください。
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mb-8 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white">
            <div className="mb-4 flex items-center justify-center">
              <Gift className="h-10 w-10" />
            </div>
            <h2 className="mb-4 text-2xl font-bold">先行登録者限定特典</h2>
            <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-2">
              <div className="flex items-start space-x-3">
                <div className="mt-1 rounded-full bg-white/20 p-1">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold">無料個別相談</h3>
                  <p className="text-sm opacity-90">通常価格：30,000円</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 rounded-full bg-white/20 p-1">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold">AI活用ガイドブック</h3>
                  <p className="text-sm opacity-90">PDF版を無料配布</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 rounded-full bg-white/20 p-1">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold">ローンチ時30%OFF</h3>
                  <p className="text-sm opacity-90">クーポンコード配布</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 rounded-full bg-white/20 p-1">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold">最新AI情報</h3>
                  <p className="text-sm opacity-90">優先配信でお届け</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 text-center">
            <p className="text-gray-600">
              サービス開始まで今しばらくお待ちください。
              <br />
              最新情報をいち早くお届けいたします！
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                トップページに戻る
              </Link>

              <Link
                href="/interview"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors hover:from-purple-700 hover:to-indigo-700"
              >
                AI活用事例を見る
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500">
              ご質問やお困りのことがございましたら、
              <a
                href="mailto:support@aispecialist.com"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                support@aispecialist.com
              </a>
              までお気軽にお問い合わせください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
