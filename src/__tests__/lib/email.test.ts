import { sendWelcomeEmail } from '@/lib/email'
import { Resend } from 'resend'

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn(),
    },
  })),
}))

describe('sendWelcomeEmail', () => {
  let mockResend: jest.Mocked<Resend>
  
  beforeEach(() => {
    mockResend = new Resend('test-key') as jest.Mocked<Resend>
    jest.clearAllMocks()
  })

  it('sends welcome email successfully', async () => {
    mockResend.emails.send.mockResolvedValue({
      data: { id: 'test-email-id' },
      error: null,
    })

    const result = await sendWelcomeEmail('test@example.com', 'Test User')

    expect(mockResend.emails.send).toHaveBeenCalledWith({
      from: 'AIスペシャリスト.com <noreply@aispecialist.com>',
      to: ['test@example.com'],
      subject: '【AIスペシャリスト.com】先行登録ありがとうございます！',
      html: expect.stringContaining('Test User様'),
    })
    expect(result).toEqual({ id: 'test-email-id' })
  })

  it('sends welcome email without name', async () => {
    mockResend.emails.send.mockResolvedValue({
      data: { id: 'test-email-id' },
      error: null,
    })

    await sendWelcomeEmail('test@example.com')

    expect(mockResend.emails.send).toHaveBeenCalledWith({
      from: 'AIスペシャリスト.com <noreply@aispecialist.com>',
      to: ['test@example.com'],
      subject: '【AIスペシャリスト.com】先行登録ありがとうございます！',
      html: expect.not.stringContaining('様'),
    })
  })

  it('throws error when email sending fails', async () => {
    mockResend.emails.send.mockResolvedValue({
      data: null,
      error: { message: 'Email sending failed' },
    })

    await expect(sendWelcomeEmail('test@example.com')).rejects.toThrow(
      'Failed to send welcome email: Email sending failed'
    )
  })
})