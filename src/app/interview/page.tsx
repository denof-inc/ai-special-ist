import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { getAllInterviewArticles } from '@/lib/mdx'
import { formatDate } from '@/lib/mdx'

export default async function InterviewPage() {
  const articles = getAllInterviewArticles()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">AI活用インタビュー</h1>
          <p className="text-lg text-muted-foreground">
            企業でのAI導入事例と実践的な活用方法を専門家が解説
          </p>
        </div>

        <div className="grid gap-8">
          {articles.map(article => (
            <article
              key={article.slug}
              className="rounded-lg border p-6 transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-col gap-6 lg:flex-row">
                {article.featuredImage && (
                  <div className="lg:w-1/3">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-48 w-full rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                      {article.industry}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(article.date)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      読了時間: {article.readingTime}分
                    </span>
                  </div>

                  <h2 className="mb-3 text-2xl font-bold transition-colors hover:text-primary">
                    <Link href={`/interview/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="mb-4 line-clamp-3 text-muted-foreground">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{article.author}</span>
                      <span className="text-muted-foreground">
                        @ {article.company}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground"
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
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              まだインタビュー記事がありません。
            </p>
          </div>
        )}

        <div className="mt-16 rounded-lg bg-muted/50 p-8 text-center">
          <h3 className="mb-4 text-2xl font-bold">AI導入でお悩みですか？</h3>
          <p className="mb-6 text-muted-foreground">
            専門家による無料相談で、あなたの課題に最適なAI活用方法をご提案します
          </p>
          <Button asChild size="lg" className="interview-cta">
            <Link href="/qa">無料相談を始める</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'AI活用インタビュー | AIスペシャリスト.com',
  description:
    '企業でのAI導入事例と実践的な活用方法を専門家が解説。成功事例から学ぶAI活用のポイント。',
  keywords: [
    'AI導入',
    'AI活用事例',
    'デジタル変革',
    'DX',
    'インタビュー',
    'AI専門家',
  ],
}
