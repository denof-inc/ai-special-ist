import {
  calculateReadingTime,
  generateArticleSlug,
  formatDate,
  generateSEOKeywords,
} from './mdx'

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
}))

describe('MDX Utilities', () => {
  describe('calculateReadingTime', () => {
    it('calculates reading time correctly for Japanese text', () => {
      const content = 'a'.repeat(400) // 400 characters
      expect(calculateReadingTime(content)).toBe(1)
    })

    it('returns minimum 1 minute for short content', () => {
      const content = 'short'
      expect(calculateReadingTime(content)).toBe(1)
    })

    it('calculates reading time for longer content', () => {
      const content = 'a'.repeat(1200) // 1200 characters = 3 minutes
      expect(calculateReadingTime(content)).toBe(3)
    })
  })

  describe('generateArticleSlug', () => {
    it('converts title to valid slug', () => {
      const title = 'AIチャットボットで顧客対応を革新'
      const slug = generateArticleSlug(title)
      expect(slug).toBe('ai')
    })

    it('handles special characters', () => {
      const title = 'Test Title: With Special Characters!'
      const slug = generateArticleSlug(title)
      expect(slug).toBe('test-title-with-special-characters')
    })

    it('handles multiple spaces', () => {
      const title = 'Multiple   Spaces   Title'
      const slug = generateArticleSlug(title)
      expect(slug).toBe('multiple-spaces-title')
    })
  })

  describe('formatDate', () => {
    it('formats date in Japanese locale', () => {
      const dateString = '2024-01-15'
      const formatted = formatDate(dateString)
      expect(formatted).toBe('2024年1月15日')
    })
  })

  describe('generateSEOKeywords', () => {
    it('generates SEO keywords from article data', () => {
      const article = {
        slug: 'test',
        title: 'Test Title',
        excerpt: 'Test excerpt',
        date: '2024-01-15',
        author: 'Test Author',
        company: 'Test Company',
        industry: 'テクノロジー',
        tags: ['AI', 'チャットボット'],
        readingTime: 5,
      }

      const keywords = generateSEOKeywords(article)
      expect(keywords).toContain('テクノロジー')
      expect(keywords).toContain('AI導入')
      expect(keywords).toContain('AI')
      expect(keywords).toContain('チャットボット')
      expect(new Set(keywords).size).toBe(keywords.length) // No duplicates
    })
  })
})
