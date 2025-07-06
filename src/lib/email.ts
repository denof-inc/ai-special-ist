import { Resend } from 'resend'

// ビルド時は警告のみ、実行時にエラーチェック
let resendInstance: Resend | null = null

if (process.env.RESEND_API_KEY) {
  resendInstance = new Resend(process.env.RESEND_API_KEY)
} else {
  // eslint-disable-next-line no-console
  console.warn(
    'RESEND_API_KEY is not defined. Email functionality will be disabled.'
  )
}

export const resend = resendInstance

export async function sendWelcomeEmail(
  email: string,
  name?: string
): Promise<{ id: string } | null> {
  if (!resend) {
    throw new Error('RESEND_API_KEY is not defined. Cannot send email.')
  }

  const { data, error } = await resend.emails.send({
    from: 'AIスペシャリスト.com <noreply@aispecialist.com>',
    to: [email],
    subject: '【AIスペシャリスト.com】先行登録ありがとうございます！',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #7c3aed; text-align: center; margin-bottom: 30px;">
          AIスペシャリスト.com
        </h1>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px 0; font-size: 24px;">先行登録ありがとうございます！</h2>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">
            ${name ? `${name}様、` : ''}AIの力でビジネスを加速させる準備はいかがですか？
          </p>
        </div>

        <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1e293b; margin-top: 0;">先行登録者限定の特別特典</h3>
          <ul style="color: #475569; line-height: 1.8;">
            <li>🎯 <strong>無料個別相談</strong>（通常価格：30,000円）</li>
            <li>📚 <strong>AI活用ガイドブック</strong>（PDF版）</li>
            <li>🚀 <strong>ローンチ時30%OFF</strong>のクーポン</li>
            <li>💡 <strong>最新AI情報</strong>の優先配信</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #64748b; margin: 0;">サービス開始まで今しばらくお待ちください。</p>
          <p style="color: #64748b; margin: 10px 0 0 0;">最新情報をいち早くお届けいたします！</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <div style="text-align: center; color: #94a3b8; font-size: 14px;">
          <p>AIスペシャリスト.com チーム</p>
          <p>
            このメールに心当たりがない場合は、
            <a href="mailto:support@aispecialist.com" style="color: #7c3aed;">support@aispecialist.com</a>
            までご連絡ください。
          </p>
        </div>
      </div>
    `,
  })

  if (error) {
    throw new Error(`Failed to send welcome email: ${error.message}`)
  }

  return data
}
