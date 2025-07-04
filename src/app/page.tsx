import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-4xl font-bold">AIスペシャリスト.com</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          企業向けAI導入支援プラットフォーム
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-2xl font-semibold">インタビュー記事</h2>
            <p className="mb-4 text-muted-foreground">
              実際にAIを導入した企業の事例を詳しく紹介
            </p>
            <Button asChild>
              <Link href="/interview">インタビューを見る</Link>
            </Button>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-2xl font-semibold">無料相談</h2>
            <p className="mb-4 text-muted-foreground">
              AI導入についてお気軽にご相談ください
            </p>
            <Button asChild variant="outline">
              <Link href="/qa">相談を始める</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
