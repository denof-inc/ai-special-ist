import { render, screen } from '@testing-library/react'

import EarlyAccessSuccessPage from '@/app/early-access/success/page'

describe('EarlyAccessSuccessPage', () => {
  it('renders success message', () => {
    render(<EarlyAccessSuccessPage />)

    expect(screen.getByText('先行登録が完了しました！')).toBeInTheDocument()
    expect(screen.getByText('メールをご確認ください')).toBeInTheDocument()
    expect(screen.getByText('先行登録者限定特典')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<EarlyAccessSuccessPage />)

    expect(screen.getByText('トップページに戻る')).toBeInTheDocument()
    expect(screen.getByText('AI活用事例を見る')).toBeInTheDocument()
  })

  it('renders benefits section', () => {
    render(<EarlyAccessSuccessPage />)

    expect(screen.getByText('無料個別相談')).toBeInTheDocument()
    expect(screen.getByText('AI活用ガイドブック')).toBeInTheDocument()
    expect(screen.getByText('ローンチ時30%OFF')).toBeInTheDocument()
    expect(screen.getByText('最新AI情報')).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(<EarlyAccessSuccessPage />)

    expect(screen.getByText('support@aispecialist.com')).toBeInTheDocument()
  })
})
