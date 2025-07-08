/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

import { POST } from '@/app/api/early-access/route'

// Set environment variable for tests
process.env.RESEND_API_KEY = 'test-key'

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

jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock crypto.randomUUID
const mockRandomUUID = jest.fn(() => 'mocked-uuid')
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: mockRandomUUID,
  },
})

describe('/api/early-access', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns error for invalid JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/early-access', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'content-type': 'application/json',
      },
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.message).toBe('不正なリクエスト形式です。')
  })

  it('returns error for invalid email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/early-access', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.message).toBe('メールアドレスの形式が正しくありません。')
  })

  it('successfully creates registration and sends email', async () => {
    const { prisma } = require('@/lib/prisma')
    const { sendWelcomeEmail } = require('@/lib/email')

    const mockRegistration = {
      id: 'test-id',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
    }

    prisma.earlyAccessRegistration.create.mockResolvedValue(mockRegistration)
    prisma.earlyAccessRegistration.update.mockResolvedValue(mockRegistration)
    sendWelcomeEmail.mockResolvedValue(true)

    const request = new NextRequest('http://localhost:3000/api/early-access', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        message: 'Looking forward to the launch!',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.message).toBe(
      '先行登録が完了しました！確認メールをお送りしています。'
    )
    expect(prisma.earlyAccessRegistration.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        message: 'Looking forward to the launch!',
        source: 'landing_page',
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        ipAddress: 'unknown',
        userAgent: 'unknown',
        unsubscribeToken: 'mocked-uuid',
      },
    })
    expect(sendWelcomeEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Test User'
    )
  })

  it('handles duplicate email registration', async () => {
    const { prisma } = require('@/lib/prisma')

    const duplicateError = new Error('Unique constraint failed')
    duplicateError.message = 'Unique constraint failed'
    prisma.earlyAccessRegistration.create.mockRejectedValue(duplicateError)

    const request = new NextRequest('http://localhost:3000/api/early-access', {
      method: 'POST',
      body: JSON.stringify({
        email: 'duplicate@example.com',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.message).toBe('このメールアドレスは既に登録されています。')
  })
})
