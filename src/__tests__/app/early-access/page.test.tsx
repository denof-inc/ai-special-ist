import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import EarlyAccess from '@/app/early-access/page'

describe('Early Access Page', () => {
  it('renders early access form correctly', () => {
    render(<EarlyAccess />)

    expect(screen.getByText('AIスペシャリスト.com')).toBeInTheDocument()
    expect(screen.getByText('先行登録者限定の特別特典')).toBeInTheDocument()
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByText('無料で先行登録する')).toBeInTheDocument()
  })

  it('handles form submission correctly', async () => {
    render(<EarlyAccess />)

    const emailInput = screen.getByLabelText('メールアドレス')
    const submitButton = screen.getByText('無料で先行登録する')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    expect(screen.getByText('登録中...')).toBeInTheDocument()

    await waitFor(
      () => {
        expect(
          screen.getByText('ご登録ありがとうございます')
        ).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('shows benefits and current features', () => {
    render(<EarlyAccess />)

    expect(
      screen.getByText('3ヶ月間無料でサービスをご利用いただけます')
    ).toBeInTheDocument()
    expect(
      screen.getByText('アーリーアダプター専用バッジを付与')
    ).toBeInTheDocument()
    expect(screen.getByText('開発進捗レポートを定期配信')).toBeInTheDocument()
    expect(screen.getByText('インタビューメディア')).toBeInTheDocument()
  })
})
