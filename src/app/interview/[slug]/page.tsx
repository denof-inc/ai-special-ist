import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { Button } from '@/components/ui/button'
import { InterviewContent } from '@/components/interview-content'
import mdxComponents from '@/components/mdx-components'
import { parseMarkdownTable } from '@/lib/markdown-table'
import { getInterviewArticleBySlug, getAllInterviewArticles } from '@/lib/mdx'
import { formatDate } from '@/lib/mdx'

interface Props {
  params: { slug: string }
}

export default async function InterviewArticlePage({ params }: Props) {
  const article = getInterviewArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  // Process markdown tables in content
  const processedContent = parseMarkdownTable(article.content)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/interview" className="text-primary hover:underline">
            ← インタビュー一覧に戻る
          </Link>
        </div>

        <article>
          <header className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                {article.industry}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDate(article.date)}
              </span>
              <span className="text-sm text-muted-foreground">
                読了時間 {article.readingTime}分
              </span>
            </div>

            <h1 className="mb-8 text-4xl font-bold leading-tight text-foreground">
              {article.title}
            </h1>

            <div className="mb-8 rounded-lg bg-muted/50 p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/40">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt={article.author}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{article.author}</h2>
                  <p className="text-muted-foreground">{article.company}</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mb-12">
              <img
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop"
                alt={article.title}
                className="h-64 w-full rounded-xl object-cover shadow-lg md:h-80"
              />
            </div>
          </header>

          <InterviewContent>
            <MDXRemote 
              source={processedContent} 
              components={mdxComponents}
            />
          </InterviewContent>
        </article>

        <div className="mt-16 rounded-lg bg-muted/50 p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl font-bold">
                この記事について詳しく相談したい
              </h3>
              <p className="mb-4 text-muted-foreground">
                記事の内容についてより詳しく知りたい方は、専門家による無料相談をご活用ください。
              </p>
              <Button asChild className="interview-cta">
                <Link href="/qa">無料相談を始める</Link>
              </Button>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-bold">他のインタビュー記事</h3>
              <p className="mb-4 text-muted-foreground">
                様々な業界でのAI活用事例をご紹介しています。
              </p>
              <Button asChild variant="outline">
                <Link href="/interview">インタビュー一覧を見る</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const articles = getAllInterviewArticles()
  return articles.map(article => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const article = getInterviewArticleBySlug(params.slug)

  if (!article) {
    return {
      title: '記事が見つかりません',
      description: '指定された記事が見つかりません。',
    }
  }

  return {
    title: article.metadata.title,
    description: article.metadata.description,
    keywords: article.metadata.keywords,
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metadata.title,
      description: article.metadata.description,
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
  }
}
