import { getInterviewArticleBySlug, getAllInterviewArticles } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDate } from '@/lib/mdx'
import { notFound } from 'next/navigation'

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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/interview" className="text-primary hover:underline">
            ← インタビュー一覧に戻る
          </Link>
        </div>

        <article className="prose prose-lg max-w-none">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
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
            
            <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-lg">{article.author}</span>
              <span className="text-muted-foreground">@ {article.company}</span>
            </div>
            
            <p className="text-xl text-muted-foreground mb-8">
              {article.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
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
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </header>

          <div className="interview-content">
            <MDXRemote source={article.content} />
          </div>
        </article>

        <div className="mt-16 p-8 bg-muted/50 rounded-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">この記事について詳しく相談したい</h3>
              <p className="text-muted-foreground mb-4">
                記事の内容についてより詳しく知りたい方は、専門家による無料相談をご活用ください。
              </p>
              <Button asChild className="interview-cta">
                <Link href="/qa">
                  無料相談を始める
                </Link>
              </Button>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">他のインタビュー記事</h3>
              <p className="text-muted-foreground mb-4">
                様々な業界でのAI活用事例をご紹介しています。
              </p>
              <Button asChild variant="outline">
                <Link href="/interview">
                  インタビュー一覧を見る
                </Link>
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
  return articles.map((article) => ({
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