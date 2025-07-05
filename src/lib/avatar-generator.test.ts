import {
  generateAvatar,
  generateProfessionalHeadshot,
  generateTextAvatar,
  generateUnsplashAvatar,
  getPersonAvatar,
  type PersonInfo,
} from './avatar-generator'

describe('Avatar Generator', () => {
  const mockPerson: PersonInfo = {
    name: '田中太郎',
    company: 'テスト株式会社',
    industry: 'IT業界',
    gender: 'male',
    age: 'middle',
  }

  describe('generateAvatar', () => {
    it('generates DiceBear avatar URL with correct parameters', () => {
      const result = generateAvatar(mockPerson)

      expect(result).toContain('api.dicebear.com')
      expect(result).toContain('avataaars')
      expect(result).toContain('田中太郎テスト株式会社')
      expect(result).toContain('backgroundColor=065f46')
      expect(result).toContain('clothesColor=1f2937')
      expect(result).toContain('skinColor=fdbcb4')
    })

    it('encodes special characters in name and company', () => {
      const personWithSpecialChars: PersonInfo = {
        name: 'John & Jane',
        company: 'Test & Co.',
        industry: 'Tech',
      }

      const result = generateAvatar(personWithSpecialChars)

      expect(result).toContain('John & JaneTest & Co.')
    })
  })

  describe('generateProfessionalHeadshot', () => {
    it('generates RoboHash URL with correct seed', () => {
      const result = generateProfessionalHeadshot(mockPerson)

      expect(result).toContain('robohash.org')
      expect(result).toContain(encodeURIComponent('田中太郎テスト株式会社'))
      expect(result).toContain('set=set4')
      expect(result).toContain('size=200x200')
    })
  })

  describe('generateTextAvatar', () => {
    it('generates UI Avatars URL with initials', () => {
      const result = generateTextAvatar(mockPerson)

      expect(result).toContain('ui-avatars.com')
      expect(result).toContain('田')
      expect(result).toContain('background=3b82f6')
      expect(result).toContain('color=ffffff')
      expect(result).toContain('size=200')
      expect(result).toContain('bold=true')
      expect(result).toContain('format=svg')
    })

    it('handles single name correctly', () => {
      const singleName: PersonInfo = {
        name: 'John',
        company: 'Test',
        industry: 'Tech',
      }

      const result = generateTextAvatar(singleName)

      expect(result).toContain('J')
    })

    it('handles multiple words in name', () => {
      const multipleName: PersonInfo = {
        name: 'John Michael Smith',
        company: 'Test',
        industry: 'Tech',
      }

      const result = generateTextAvatar(multipleName)

      expect(result).toContain('name=JM')
    })
  })

  describe('generateUnsplashAvatar', () => {
    it('generates Unsplash URL with correct query for male middle-aged', () => {
      const result = generateUnsplashAvatar(mockPerson)

      expect(result).toContain('images.unsplash.com')
      expect(result).toContain('w=200&h=200')
      expect(result).toContain('fit=crop&crop=face')
    })

    it('uses different queries for different demographics', () => {
      const femaleYoung: PersonInfo = {
        name: 'Jane',
        company: 'Test',
        industry: 'Tech',
        gender: 'female',
        age: 'young',
      }

      const result = generateUnsplashAvatar(femaleYoung)

      expect(result).toContain('images.unsplash.com')
    })

    it('falls back to default query for neutral demographics', () => {
      const neutralPerson: PersonInfo = {
        name: 'Alex',
        company: 'Test',
        industry: 'Tech',
        gender: 'neutral',
        age: 'senior',
      }

      const result = generateUnsplashAvatar(neutralPerson)

      expect(result).toContain('images.unsplash.com')
    })

    it('handles missing gender and age with defaults', () => {
      const minimalPerson: PersonInfo = {
        name: 'Test',
        company: 'Company',
        industry: 'Industry',
      }

      const result = generateUnsplashAvatar(minimalPerson)

      expect(result).toContain('images.unsplash.com')
    })
  })

  describe('getPersonAvatar', () => {
    it('returns DiceBear avatar by default', () => {
      const result = getPersonAvatar(mockPerson)
      expect(result).toContain('api.dicebear.com')
    })

    it('returns DiceBear avatar when explicitly requested', () => {
      const result = getPersonAvatar(mockPerson, 'dicebear')
      expect(result).toContain('api.dicebear.com')
    })

    it('returns text avatar when requested', () => {
      const result = getPersonAvatar(mockPerson, 'text')
      expect(result).toContain('ui-avatars.com')
    })

    it('returns Unsplash avatar when requested', () => {
      const result = getPersonAvatar(mockPerson, 'unsplash')
      expect(result).toContain('images.unsplash.com')
    })

    it('falls back to Unsplash for unknown method', () => {
      const result = getPersonAvatar(mockPerson, 'unknown' as any)
      expect(result).toContain('images.unsplash.com')
    })
  })
})