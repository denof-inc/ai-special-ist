import { NextRequest, NextResponse } from 'next/server'

import { sendWelcomeEmail } from '@/lib/email'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { earlyAccessSchema } from '@/lib/validations/early-access'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // リクエストボディの解析
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          message: '不正なリクエスト形式です。',
        },
        { status: 400 }
      )
    }

    // バリデーション
    let validatedData
    try {
      validatedData = earlyAccessSchema.parse(body)
    } catch (validationError) {
      return NextResponse.json(
        {
          success: false,
          message: 'メールアドレスの形式が正しくありません。',
        },
        { status: 400 }
      )
    }

    // IPアドレスとUser-Agentを取得
    const ipAddress =
      request.ip ||
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // UTMパラメータを取得
    const url = new URL(request.url)
    const utmSource = url.searchParams.get('utm_source')
    const utmMedium = url.searchParams.get('utm_medium')
    const utmCampaign = url.searchParams.get('utm_campaign')

    // データベースに保存
    let registration
    try {
      registration = await prisma.earlyAccessRegistration.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          message: validatedData.message,
          source: 'landing_page',
          utmSource,
          utmMedium,
          utmCampaign,
          ipAddress,
          userAgent,
          unsubscribeToken: crypto.randomUUID(),
        },
      })
    } catch (dbError) {
      if (
        dbError instanceof Error &&
        dbError.message.includes('Unique constraint')
      ) {
        return NextResponse.json(
          {
            success: false,
            message: 'このメールアドレスは既に登録されています。',
          },
          { status: 409 }
        )
      }

      logger.error('Database error during registration', dbError)
      return NextResponse.json(
        {
          success: false,
          message:
            'データベースエラーが発生しました。しばらく時間をおいて再度お試しください。',
        },
        { status: 500 }
      )
    }

    // 自動返信メール送信
    try {
      await sendWelcomeEmail(validatedData.email, validatedData.name)

      // メール送信成功をデータベースに記録
      await prisma.earlyAccessRegistration.update({
        where: { id: registration.id },
        data: { emailSentAt: new Date() },
      })

      logger.info('Welcome email sent successfully', {
        email: validatedData.email,
        registrationId: registration.id,
      })
    } catch (emailError) {
      logger.error('Failed to send welcome email', emailError, {
        email: validatedData.email,
        registrationId: registration.id,
      })
      // メール送信失敗してもユーザーには成功レスポンスを返す
    }

    logger.info('Early access registration successful', {
      email: validatedData.email,
      registrationId: registration.id,
    })

    return NextResponse.json({
      success: true,
      message: '先行登録が完了しました！確認メールをお送りしています。',
    })
  } catch (error) {
    logger.error('Unexpected error during early access registration', error)

    return NextResponse.json(
      {
        success: false,
        message:
          '予期しないエラーが発生しました。しばらく時間をおいて再度お試しください。',
      },
      { status: 500 }
    )
  }
}
