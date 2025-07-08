import { render, screen } from '@testing-library/react'

import EarlyAccess from '@/app/early-access/page'

describe('Early Access Page', () => {
  it('renders early access form correctly', () => {
    render(<EarlyAccess />)

    expect(screen.getByText('AIスペシャリスト.com')).toBeInTheDocument()
    expect(screen.getByText('先行登録者限定の特別特典')).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: /メールアドレス/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /無料で先行登録する/i })
    ).toBeInTheDocument()
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
