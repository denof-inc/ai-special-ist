import { NextRequest } from 'next/server'
import { POST } from '@/app/api/early-access/route'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

// Mock modules
jest.mock('@/lib/prisma', () => ({
  prisma: {
    earlyAccessRegistration: {
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}))

jest.mock('@/lib/email', () => ({
  sendWelcomeEmail: jest.fn(),
}))

describe('/api/early-access', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('registers early access user successfully', async () => {
    const mockRegistration = {
      id: 'test-id',
      email: 'test@example.com',
      name: 'Test User',
    }

    ;(prisma.earlyAccessRegistration.create as jest.Mock).mockResolvedValue(
      mockRegistration
    )
    ;(sendWelcomeEmail as jest.Mock).mockResolvedValue({ id: 'email-id' })

    const request = new NextRequest(
      'http://localhost:3000/api/early-access',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
        }),
      }
    )

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe(
      '先行登録が完了しました！確認メールをお送りしています。'
    )
  })

  it('returns error for invalid email', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/early-access',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
        }),
      }
    )

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.success).toBe(false)
  })

  it('handles duplicate email registration', async () => {
    const duplicateError = new Error('Unique constraint failed')
    ;(prisma.earlyAccessRegistration.create as jest.Mock).mockRejectedValue(
      duplicateError
    )

    const request = new NextRequest(
      'http://localhost:3000/api/early-access',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      }
    )

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.message).toBe('このメールアドレスは既に登録されています。')
  })
})