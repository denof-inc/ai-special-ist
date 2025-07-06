import Link from 'next/link'

export default function Home(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
          AIスペシャリスト.com
        </h1>

        <p className="mb-8 text-xl text-gray-600">サイト準備中</p>

        <div className="mb-12 space-y-4">
          <p className="text-gray-700">
            企業向けAI導入支援プラットフォームを準備中です。
          </p>
          <p className="text-gray-700">
            現在、インタビューメディアをご覧いただけます。
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/interview" className="btn-gradient-accent">
            インタビューメディアを見る
          </Link>

          <Link
            href="/early-access"
            className="inline-block rounded-lg border border-gray-400 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100"
          >
            先行登録（最新情報を受け取る）
          </Link>
        </div>
      </div>
    </main>
  )
}
