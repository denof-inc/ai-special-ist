import { render, screen } from '@testing-library/react'
import { notFound } from 'next/navigation'

import { getInterviewArticleBySlug, getAllInterviewArticles } from '@/lib/mdx'

import InterviewArticlePage, {
  generateStaticParams,
  generateMetadata,
} from './page'

// Mock dependencies
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('@/lib/mdx', () => ({
  getInterviewArticleBySlug: jest.fn(),
  getAllInterviewArticles: jest.fn(),
  formatDate: jest.fn(() => '2024-01-01'),
}))

jest.mock('@/lib/markdown-table', () => ({
  parseMarkdownTable: jest.fn((content): string => content),
}))

jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }): JSX.Element => (
    <div data-testid="mdx-content">{source}</div>
  ),
}))

jest.mock('@/components/interview-content', () => ({
  InterviewContent: ({ children }: { children: React.ReactNode }): JSX.Element => (
    <div data-testid="interview-content">{children}</div>
  ),
}))

jest.mock('@/components/mdx-components', () => ({
  __esModule: true,
  default: {},
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    asChild,
    ...props
  }: {
    children: React.ReactNode
    asChild?: boolean
    [key: string]: unknown
  }): JSX.Element => {
    if (asChild) {
      return <>{children}</>
    }
    return <button {...props}>{children}</button>
  },
}))

const mockArticle = {
  slug: 'test-interview',
  title: 'テストインタビュー記事',
  author: '田中太郎',
  company: 'テスト株式会社',
  industry: 'IT業界',
  date: '2024-01-01',
  excerpt: 'これはテスト記事の説明文です。',
  tags: ['AI', 'テクノロジー', 'イノベーション'],
  readingTime: 5,
  content: 'テスト記事のコンテンツです。',
  metadata: {
    title: 'テストインタビュー記事',
    description: 'テスト記事の説明',
    keywords: ['test', 'interview'],
  },
  featuredImage: 'https://example.com/image.jpg',
}

describe('InterviewArticlePage', () => {
  beforeEach((): void => {
    jest.clearAllMocks()
  })

  it('renders interview article page correctly', async (): Promise<void> => {
    ;(getInterviewArticleBySlug as jest.Mock).mockReturnValue(mockArticle)

    const component = await InterviewArticlePage({
      params: { slug: 'test-interview' },
    })
    render(component)

    expect(screen.getByText('テストインタビュー記事')).toBeInTheDocument()
    expect(screen.getAllByText('田中太郎')).toHaveLength(2)
    expect(screen.getAllByText('テスト株式会社')).toHaveLength(2)
    expect(screen.getAllByText('IT業界')).toHaveLength(3)
    expect(
      screen.getByText('これはテスト記事の説明文です。')
    ).toBeInTheDocument()
    expect(screen.getByTestId('mdx-content')).toBeInTheDocument()
  })

  it('calls notFound when article is not found', async (): Promise<void> => {
    ;(getInterviewArticleBySlug as jest.Mock).mockReturnValue(null)

    await InterviewArticlePage({ params: { slug: 'non-existent' } })

    expect(notFound).toHaveBeenCalled()
  })

  it('displays article tags correctly', async (): Promise<void> => {
    ;(getInterviewArticleBySlug as jest.Mock).mockReturnValue(mockArticle)

    const component = await InterviewArticlePage({
      params: { slug: 'test-interview' },
    })
    render(component)

    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('テクノロジー')).toBeInTheDocument()
    expect(screen.getByText('イノベーション')).toBeInTheDocument()
  })

  it('displays profile and company data sections', async (): Promise<void> => {
    ;(getInterviewArticleBySlug as jest.Mock).mockReturnValue(mockArticle)

    const component = await InterviewArticlePage({
      params: { slug: 'test-interview' },
    })
    render(component)

    expect(screen.getByText('PROFILE')).toBeInTheDocument()
    expect(screen.getByText('COMPANY DATA')).toBeInTheDocument()
    expect(screen.getByText('氏名')).toBeInTheDocument()
    expect(screen.getByText('所属')).toBeInTheDocument()
    expect(screen.getByText('会社名')).toBeInTheDocument()
  })
})

describe('generateStaticParams', () => {
  it('returns static params for all articles', async (): Promise<void> => {
    const mockArticles = [
      { slug: 'article-1' },
      { slug: 'article-2' },
      { slug: 'article-3' },
    ]
    ;(getAllInterviewArticles as jest.Mock).mockReturnValue(mockArticles)

    const result = await generateStaticParams()

    expect(result).toEqual([
      { slug: 'article-1' },
      { slug: 'article-2' },
      { slug: 'article-3' },
    ])
  })
})

describe('generateMetadata', () => {
  it('returns metadata for existing article', async (): Promise<void> => {
    ;(getInterviewArticleBySlug as jest.Mock).mockReturnValue(mockArticle)

    const result = await generateMetadata({
      params: { slug: 'test-interview' },
    })

    expect(result).toEqual({
      title: 'テストインタビュー記事',
      description: 'テスト記事の説明',
      keywords: ['test', 'interview'],
      openGraph: {
        title: 'テストインタビュー記事',
        description: 'テスト記事の説明',
        type: 'article',
        publishedTime: '2024-01-01',
        authors: ['田中太郎'],
        tags: ['AI', 'テクノロジー', 'イノベーション'],
        images: ['https://example.com/image.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'テストインタビュー記事',
        description: 'テスト記事の説明',
        images: ['https://example.com/image.jpg'],
      },
    })
  })

  it('returns not found metadata for non-existent article', async (): Promise<void> => {
    ;(getInterviewArticleBySlug as jest.Mock).mockReturnValue(null)

    const result = await generateMetadata({ params: { slug: 'non-existent' } })

    expect(result).toEqual({
      title: '記事が見つかりません',
      description: '指定された記事が見つかりません。',
    })
  })
})
