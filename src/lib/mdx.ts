import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'

export interface InterviewArticle {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  company: string
  industry: string
  tags: string[]
  featuredImage?: string
  readingTime: number
  content: string
  metadata: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface InterviewArticleSummary {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  company: string
  industry: string
  tags: string[]
  featuredImage?: string
  readingTime: number
}

const interviewDirectory = path.join(process.cwd(), 'src/content/interview')

export function getAllInterviewArticles(): InterviewArticleSummary[] {
  if (!fs.existsSync(interviewDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(interviewDirectory)
  const articles = fileNames
    .filter(name => name.endsWith('.mdx'))
    .map(name => {
      const slug = name.replace(/\.mdx$/, '')
      const fullPath = path.join(interviewDirectory, name)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const readingTime = calculateReadingTime(content)

      return {
        slug,
        title: data.title || '',
        excerpt: data.excerpt || '',
        date: data.date || '',
        author: data.author || '',
        company: data.company || '',
        industry: data.industry || '',
        tags: data.tags || [],
        featuredImage: data.featuredImage,
        readingTime,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return articles
}

export function getInterviewArticleBySlug(
  slug: string
): InterviewArticle | null {
  try {
    const fullPath = path.join(interviewDirectory, `${slug}.mdx`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const readingTime = calculateReadingTime(content)

    return {
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      date: data.date || '',
      author: data.author || '',
      company: data.company || '',
      industry: data.industry || '',
      tags: data.tags || [],
      featuredImage: data.featuredImage,
      readingTime,
      content,
      metadata: {
        title: data.metaTitle || data.title || '',
        description: data.metaDescription || data.excerpt || '',
        keywords: data.keywords || data.tags || [],
      },
    }
  } catch (error) {
    // Error reading article - handled by returning null
    return null
  }
}

export function getArticlesByTag(tag: string): InterviewArticleSummary[] {
  const allArticles = getAllInterviewArticles()
  return allArticles.filter(article =>
    article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getArticlesByIndustry(
  industry: string
): InterviewArticleSummary[] {
  const allArticles = getAllInterviewArticles()
  return allArticles.filter(
    article => article.industry.toLowerCase() === industry.toLowerCase()
  )
}

export function getAllTags(): string[] {
  const allArticles = getAllInterviewArticles()
  const tagSet = new Set<string>()

  allArticles.forEach(article => {
    article.tags.forEach(tag => tagSet.add(tag))
  })

  return Array.from(tagSet).sort()
}

export function getAllIndustries(): string[] {
  const allArticles = getAllInterviewArticles()
  const industrySet = new Set<string>()

  allArticles.forEach(article => {
    if (article.industry) {
      industrySet.add(article.industry)
    }
  })

  return Array.from(industrySet).sort()
}

export function calculateReadingTime(content: string): number {
  // 平均読速: 400文字/分 (日本語)
  const wordsPerMinute = 400
  const wordCount = content.length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, readingTime)
}

export function generateArticleSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function generateSEOKeywords(
  article: InterviewArticleSummary
): string[] {
  const keywords = [
    article.industry,
    'AI導入',
    'AI活用事例',
    'デジタル変革',
    'DX',
    ...article.tags,
  ].filter(Boolean)

  return Array.from(new Set(keywords))
}
