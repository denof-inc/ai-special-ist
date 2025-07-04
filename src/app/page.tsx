import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">AIスペシャリスト.com</h1>
        <p className="text-xl text-muted-foreground mb-8">
          企業向けAI導入支援プラットフォーム
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">インタビュー記事</h2>
            <p className="text-muted-foreground mb-4">
              実際にAIを導入した企業の事例を詳しく紹介
            </p>
            <Button asChild>
              <Link href="/interview">
                インタビューを見る
              </Link>
            </Button>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">無料相談</h2>
            <p className="text-muted-foreground mb-4">
              AI導入についてお気軽にご相談ください
            </p>
            <Button asChild variant="outline">
              <Link href="/qa">
                相談を始める
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}