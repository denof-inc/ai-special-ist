import fs from 'fs'

// Mock fs module first
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
}))

import {
  calculateReadingTime,
  generateArticleSlug,
  formatDate,
  generateSEOKeywords,
  getAllInterviewArticles,
  getInterviewArticleBySlug,
  getArticlesByTag,
  getArticlesByIndustry,
  getAllTags,
  getAllIndustries,
} from '@/lib/mdx'

// Type the mocked fs functions properly
const mockFs = {
  existsSync: jest.mocked(fs.existsSync),
  readdirSync: jest.mocked(fs.readdirSync),
  readFileSync: jest.mocked(fs.readFileSync),
}

describe('MDX Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
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

  describe('getAllInterviewArticles', () => {
    it('returns empty array when directory does not exist', () => {
      mockFs.existsSync.mockReturnValue(false)
      const articles = getAllInterviewArticles()
      expect(articles).toEqual([])
    })

    it('returns articles when directory exists', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['test.mdx', 'other.txt'] as never)
      mockFs.readFileSync.mockReturnValue(`---
title: Test Article
excerpt: Test excerpt
date: 2023-12-25
author: Test Author
company: Test Company
industry: Technology
tags: [ai, tech]
---
Content`)

      const articles = getAllInterviewArticles()
      expect(articles).toHaveLength(1) // Only .mdx files
      expect(articles[0].title).toBe('Test Article')
    })
  })

  describe('getInterviewArticleBySlug', () => {
    it('returns null when file does not exist', () => {
      mockFs.existsSync.mockReturnValue(false)
      const article = getInterviewArticleBySlug('test')
      expect(article).toBeNull()
    })

    it('returns article when file exists', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockReturnValue(`---
title: Test Article
excerpt: Test excerpt  
date: 2023-12-25
author: Test Author
company: Test Company
industry: Technology
tags: [ai, tech]
metaTitle: Meta Title
metaDescription: Meta Description
keywords: [keyword1, keyword2]
---
Content`)

      const article = getInterviewArticleBySlug('test')
      expect(article?.title).toBe('Test Article')
      expect(article?.metadata.title).toBe('Meta Title')
    })

    it('returns null on error', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('Read error')
      })

      const article = getInterviewArticleBySlug('test')
      expect(article).toBeNull()
    })
  })

  describe('getArticlesByTag', () => {
    it('filters articles by tag', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue([
        'article1.mdx',
        'article2.mdx',
      ] as never)

      mockFs.readFileSync.mockReturnValueOnce(`---
title: Article 1
tags: [AI, Tech]
excerpt: Test excerpt
date: 2023-12-25
author: Author 1
company: Company 1
industry: Industry 1
---
Content 1`).mockReturnValueOnce(`---
title: Article 2
tags: [Finance]
excerpt: Test excerpt
date: 2023-12-25
author: Author 2
company: Company 2
industry: Industry 2
---
Content 2`)

      const result = getArticlesByTag('ai')
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Article 1')
    })
  })

  describe('getArticlesByIndustry', () => {
    it('filters articles by industry', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue([
        'article1.mdx',
        'article2.mdx',
      ] as never)

      mockFs.readFileSync.mockReturnValueOnce(`---
title: Article 1
industry: Technology
tags: []
excerpt: Test excerpt
date: 2023-12-25
author: Author 1
company: Company 1
---
Content 1`).mockReturnValueOnce(`---
title: Article 2
industry: Finance
tags: []
excerpt: Test excerpt
date: 2023-12-25
author: Author 2
company: Company 2
---
Content 2`)

      const result = getArticlesByIndustry('technology')
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Article 1')
    })
  })

  describe('getAllTags', () => {
    it('returns unique sorted tags', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue([
        'article1.mdx',
        'article2.mdx',
      ] as never)

      mockFs.readFileSync.mockReturnValueOnce(`---
title: Article 1
tags: [AI, Tech]
excerpt: Test excerpt
date: 2023-12-25
author: Author 1
company: Company 1
industry: Industry 1
---
Content 1`).mockReturnValueOnce(`---
title: Article 2
tags: [Finance, AI]
excerpt: Test excerpt
date: 2023-12-25
author: Author 2
company: Company 2
industry: Industry 2
---
Content 2`)

      const tags = getAllTags()
      expect(tags).toEqual(['AI', 'Finance', 'Tech'])
    })
  })

  describe('getAllIndustries', () => {
    it('returns unique industries', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue([
        'article1.mdx',
        'article2.mdx',
        'article3.mdx',
      ] as never)

      mockFs.readFileSync.mockReturnValueOnce(`---
title: Article 1
industry: Technology
tags: []
excerpt: Test excerpt
date: 2023-12-25
author: Author 1
company: Company 1
---
Content 1`).mockReturnValueOnce(`---
title: Article 2
industry: Finance
tags: []
excerpt: Test excerpt
date: 2023-12-25
author: Author 2
company: Company 2
---
Content 2`).mockReturnValueOnce(`---
title: Article 3
industry: ''
tags: []
excerpt: Test excerpt
date: 2023-12-25
author: Author 3
company: Company 3
---
Content 3`)

      const industries = getAllIndustries()
      expect(industries).toEqual(['Finance', 'Technology'])
    })
  })
})
