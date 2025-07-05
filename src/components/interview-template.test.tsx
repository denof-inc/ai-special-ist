import { render, screen } from '@testing-library/react'

import {
  InterviewTemplate,
  INTERVIEW_CATEGORIES,
  STANDARD_QUESTIONS,
  type InterviewTemplateData,
} from './interview-template'

const mockData: InterviewTemplateData = {
  title: 'テストインタビュー',
  author: '田中太郎',
  company: 'テスト株式会社',
  industry: 'IT業界',
  date: '2024-01-01',
  excerpt: 'テストの説明文です。',
  tags: ['AI', 'テクノロジー', 'イノベーション'],
  readingTime: 5,
}

describe('InterviewTemplate', () => {
  it('renders template with provided data', () => {
    render(
      <InterviewTemplate data={mockData}>
        <p>Interview content</p>
      </InterviewTemplate>
    )

    expect(screen.getByText('テストインタビュー')).toBeInTheDocument()
    expect(screen.getByText('田中太郎')).toBeInTheDocument()
    expect(screen.getByText('テスト株式会社')).toBeInTheDocument()
    expect(screen.getByText('IT業界')).toBeInTheDocument()
    expect(screen.getByText('Interview content')).toBeInTheDocument()
  })

  it('renders meta information correctly', () => {
    render(
      <InterviewTemplate data={mockData}>
        <div>Content</div>
      </InterviewTemplate>
    )

    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
    expect(screen.getByText('読了時間 5分')).toBeInTheDocument()
  })

  it('renders tags correctly', () => {
    render(
      <InterviewTemplate data={mockData}>
        <div>Content</div>
      </InterviewTemplate>
    )

    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('テクノロジー')).toBeInTheDocument()
    expect(screen.getByText('イノベーション')).toBeInTheDocument()
  })

  it('renders excerpt correctly', () => {
    render(
      <InterviewTemplate data={mockData}>
        <div>Content</div>
      </InterviewTemplate>
    )

    expect(screen.getByText('テストの説明文です。')).toBeInTheDocument()
  })

  it('renders footer with CTAs', () => {
    render(
      <InterviewTemplate data={mockData}>
        <div>Content</div>
      </InterviewTemplate>
    )

    expect(screen.getByText('この記事について詳しく相談したい')).toBeInTheDocument()
    expect(screen.getByText('他のインタビュー記事')).toBeInTheDocument()
    expect(screen.getByText('無料相談を始める')).toBeInTheDocument()
    expect(screen.getByText('インタビュー一覧を見る')).toBeInTheDocument()
  })

  it('includes template marker for identification', () => {
    const { container } = render(
      <InterviewTemplate data={mockData}>
        <div>Content</div>
      </InterviewTemplate>
    )

    const marker = container.querySelector('[data-template="standard-interview"]')
    expect(marker).toBeInTheDocument()
  })
})

describe('INTERVIEW_CATEGORIES', () => {
  it('contains all expected categories', () => {
    expect(INTERVIEW_CATEGORIES.BACKGROUND).toBe('background')
    expect(INTERVIEW_CATEGORIES.CHALLENGE).toBe('challenge')
    expect(INTERVIEW_CATEGORIES.SOLUTION).toBe('solution')
    expect(INTERVIEW_CATEGORIES.IMPLEMENTATION).toBe('implementation')
    expect(INTERVIEW_CATEGORIES.RESULTS).toBe('results')
    expect(INTERVIEW_CATEGORIES.FUTURE).toBe('future')
  })
})

describe('STANDARD_QUESTIONS', () => {
  it('contains expected number of questions', () => {
    expect(STANDARD_QUESTIONS).toHaveLength(6)
  })

  it('has questions in correct order', () => {
    const orders = STANDARD_QUESTIONS.map(q => q.order)
    expect(orders).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('covers all categories', () => {
    const categories = STANDARD_QUESTIONS.map(q => q.category)
    const uniqueCategories = new Set(categories)
    
    expect(uniqueCategories.has('background')).toBe(true)
    expect(uniqueCategories.has('challenge')).toBe(true)
    expect(uniqueCategories.has('solution')).toBe(true)
    expect(uniqueCategories.has('implementation')).toBe(true)
    expect(uniqueCategories.has('results')).toBe(true)
    expect(uniqueCategories.has('future')).toBe(true)
  })

  it('has proper question structure', () => {
    STANDARD_QUESTIONS.forEach(question => {
      expect(question.id).toBeDefined()
      expect(question.category).toBeDefined()
      expect(question.question).toBeDefined()
      expect(question.order).toBeDefined()
      expect(typeof question.order).toBe('number')
    })
  })
})