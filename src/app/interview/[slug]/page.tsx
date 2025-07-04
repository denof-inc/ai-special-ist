import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { Button } from '@/components/ui/button'
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/interview" className="text-primary hover:underline">
            ← インタビュー一覧に戻る
          </Link>
        </div>

        <article className="prose prose-lg max-w-none">
          <header className="mb-12">
            <div className="mb-4 flex items-center gap-2">
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

            <h1 className="mb-6 text-4xl font-bold">{article.title}</h1>

            <div className="mb-6 flex items-center gap-4">
              <span className="text-lg font-medium">{article.author}</span>
              <span className="text-muted-foreground">@ {article.company}</span>
            </div>

            <p className="mb-8 text-xl text-muted-foreground">
              {article.excerpt}
            </p>

            <div className="mb-8 flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {article.featuredImage && (
              <div className="mb-8">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="h-64 w-full rounded-lg object-cover"
                />
              </div>
            )}
          </header>

          <div className="interview-content">
            <MDXRemote source={article.content} />
          </div>
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
