import { z } from 'zod'

export const earlyAccessSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください'),
  name: z.string().optional(),
  message: z.string().optional(),
})

export type EarlyAccessFormData = z.infer<typeof earlyAccessSchema>
