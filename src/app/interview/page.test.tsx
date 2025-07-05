import { render, screen } from '@testing-library/react'

import { getAllInterviewArticles } from '@/lib/mdx'

import InterviewPage from './page'

// Mock dependencies
jest.mock('@/lib/mdx', () => ({
  getAllInterviewArticles: jest.fn(),
  formatDate: jest.fn(() => '2024-01-01'),
}))

const mockArticles = [
  {
    slug: 'article-1',
    title: 'テスト記事1',
    author: '著者1',
    company: '会社1',
    industry: '業界1',
    date: '2024-01-01',
    excerpt: '記事1の説明',
    tags: ['tag1', 'tag2'],
    readingTime: 5,
  },
  {
    slug: 'article-2',
    title: 'テスト記事2',
    author: '著者2',
    company: '会社2',
    industry: '業界2',
    date: '2024-01-02',
    excerpt: '記事2の説明',
    tags: ['tag3', 'tag4'],
    readingTime: 7,
  },
]

describe('InterviewPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders interview articles list', async () => {
    ;(getAllInterviewArticles as jest.Mock).mockReturnValue(mockArticles)

    const component = await InterviewPage()
    render(component)

    expect(screen.getByText('AI活用インタビュー')).toBeInTheDocument()
    expect(screen.getByText('テスト記事1')).toBeInTheDocument()
    expect(screen.getByText('テスト記事2')).toBeInTheDocument()
    expect(screen.getByText('著者1')).toBeInTheDocument()
    expect(screen.getByText('著者2')).toBeInTheDocument()
  })

  it('renders article metadata correctly', async () => {
    ;(getAllInterviewArticles as jest.Mock).mockReturnValue(mockArticles)

    const component = await InterviewPage()
    render(component)

    expect(screen.getByText('@ 会社1')).toBeInTheDocument()
    expect(screen.getByText('@ 会社2')).toBeInTheDocument()
    expect(screen.getByText('業界1')).toBeInTheDocument()
    expect(screen.getByText('業界2')).toBeInTheDocument()
  })

  it('renders article excerpts and reading time', async () => {
    ;(getAllInterviewArticles as jest.Mock).mockReturnValue(mockArticles)

    const component = await InterviewPage()
    render(component)

    expect(screen.getByText('記事1の説明')).toBeInTheDocument()
    expect(screen.getByText('記事2の説明')).toBeInTheDocument()
    expect(screen.getAllByText(/読了時間/)).toHaveLength(2)
  })

  it('handles empty articles list', async () => {
    ;(getAllInterviewArticles as jest.Mock).mockReturnValue([])

    const component = await InterviewPage()
    render(component)

    expect(screen.getByText('AI活用インタビュー')).toBeInTheDocument()
    expect(screen.queryByText('テスト記事1')).not.toBeInTheDocument()
  })

  it('renders article links correctly', async () => {
    ;(getAllInterviewArticles as jest.Mock).mockReturnValue(mockArticles)

    const component = await InterviewPage()
    render(component)

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })
})