import { earlyAccessSchema } from '@/lib/validations/early-access'

describe('earlyAccessSchema', () => {
  it('validates valid email', () => {
    const result = earlyAccessSchema.safeParse({
      email: 'test@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('validates with optional name and message', () => {
    const result = earlyAccessSchema.safeParse({
      email: 'test@example.com',
      name: 'Test User',
      message: 'Looking forward to the launch!',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = earlyAccessSchema.safeParse({
      email: 'invalid-email',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      '有効なメールアドレスを入力してください'
    )
  })

  it('rejects empty email', () => {
    const result = earlyAccessSchema.safeParse({
      email: '',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      'メールアドレスは必須です'
    )
  })

  it('rejects missing email', () => {
    const result = earlyAccessSchema.safeParse({})
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      'メールアドレスは必須です'
    )
  })
})