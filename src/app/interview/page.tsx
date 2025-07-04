import { getAllInterviewArticles } from '@/lib/mdx'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDate } from '@/lib/mdx'

export default async function InterviewPage() {
  const articles = getAllInterviewArticles()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">AI活用インタビュー</h1>
          <p className="text-muted-foreground text-lg">
            企業でのAI導入事例と実践的な活用方法を専門家が解説
          </p>
        </div>

        <div className="grid gap-8">
          {articles.map((article) => (
            <article key={article.slug} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {article.featuredImage && (
                  <div className="lg:w-1/3">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {article.industry}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {formatDate(article.date)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      読了時間: {article.readingTime}分
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                    <Link href={`/interview/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{article.author}</span>
                      <span className="text-muted-foreground">@ {article.company}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button asChild variant="outline">
                      <Link href={`/interview/${article.slug}`}>
                        続きを読む
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              まだインタビュー記事がありません。
            </p>
          </div>
        )}

        <div className="mt-16 p-8 bg-muted/50 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">AI導入でお悩みですか？</h3>
          <p className="text-muted-foreground mb-6">
            専門家による無料相談で、あなたの課題に最適なAI活用方法をご提案します
          </p>
          <Button asChild size="lg" className="interview-cta">
            <Link href="/qa">
              無料相談を始める
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'AI活用インタビュー | AIスペシャリスト.com',
  description: '企業でのAI導入事例と実践的な活用方法を専門家が解説。成功事例から学ぶAI活用のポイント。',
  keywords: ['AI導入', 'AI活用事例', 'デジタル変革', 'DX', 'インタビュー', 'AI専門家'],
}