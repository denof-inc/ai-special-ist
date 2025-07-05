import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { InterviewContent } from '@/components/interview-content'
import mdxComponents from '@/components/mdx-components'
import { Button } from '@/components/ui/button'
import { parseMarkdownTable } from '@/lib/markdown-table'
import {
  getAllInterviewArticles,
  getInterviewArticleBySlug,
  formatDate,
} from '@/lib/mdx'

interface Props {
  params: { slug: string }
}

export default async function InterviewArticlePage({
  params,
}: Props): Promise<JSX.Element> {
  const article = getInterviewArticleBySlug(params.slug)

  if (!article) {
    notFound()
    return null // TypeScript requires return after notFound() for tests
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
            {/* Hero Image - Full Width */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1400&h=600&fit=crop&crop=face"
                alt={`${article.author}氏のインタビュー`}
                className="h-80 w-full object-cover object-center md:h-96 lg:h-[500px]"
              />
            </div>

            {/* Article Header Content - Below Image */}
            <div className="mt-8 space-y-8">
              {/* Title and Interviewee Name - v-tsushin style */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
                  {article.title}
                </h1>

                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                    {article.author}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="rounded bg-slate-100 px-3 py-1 font-medium">
                      {article.industry}
                    </span>
                    <span>{formatDate(article.date)}</span>
                    <span>読了時間 {article.readingTime}分</span>
                  </div>
                </div>
              </div>

              {/* Profile and Company Data Section - Challenge+ style */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* Left: Profile */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 border-b-2 border-slate-200 pb-2 text-lg font-bold text-slate-800">
                      PROFILE
                    </h3>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="w-20 text-sm font-medium text-slate-600">
                          氏名
                        </span>
                        <span className="text-sm font-medium text-slate-800">
                          {article.author}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-20 text-sm font-medium text-slate-600">
                          所属
                        </span>
                        <span className="text-sm text-slate-800">
                          {article.company}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-20 text-sm font-medium text-slate-600">
                          業界
                        </span>
                        <span className="text-sm text-slate-800">
                          {article.industry}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Company Data */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 border-b-2 border-slate-200 pb-2 text-lg font-bold text-slate-800">
                      COMPANY DATA
                    </h3>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="w-20 text-sm font-medium text-slate-600">
                          会社名
                        </span>
                        <span className="text-sm font-medium text-slate-800">
                          {article.company}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-20 text-sm font-medium text-slate-600">
                          業界
                        </span>
                        <span className="text-sm text-slate-800">
                          {article.industry}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-20 text-sm font-medium text-slate-600">
                          タグ
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interview Introduction */}
              <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-6">
                <p className="text-base leading-relaxed text-slate-700">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </header>

          <InterviewContent>
            <MDXRemote source={processedContent} components={mdxComponents} />
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

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const articles = getAllInterviewArticles()
  return articles.map(article => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<{
  title: string
  description: string
  keywords?: string[]
  openGraph?: {
    title: string
    description: string
    type: string
    publishedTime: string
    authors: string[]
    tags: string[]
    images?: string[]
  }
  twitter?: {
    card: string
    title: string
    description: string
    images?: string[]
  }
}> {
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
