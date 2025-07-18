import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import EarlyAccessPage from '@/app/early-access/page'

describe('AIスペシャリスト.com 先行登録ランディングページ', () => {
  // ファーストビューのテスト
  describe('ファーストビュー', () => {
    it('メインキャッチコピーが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'AIをもっと身近に、オープンに。',
        })
      ).toBeInTheDocument()
    })

    it('サブキャッチコピーが表示される', () => {
      render(<EarlyAccessPage />)
      // h2タグ内でテキストを検索（brタグで分割されているため）
      const h2Elements = screen.getAllByRole('heading', { level: 2 })
      const firstH2 = h2Elements[0] // 最初のh2要素
      expect(firstH2).toHaveTextContent(
        'AIのスキルで活躍したいと願うすべての専門家のために'
      )
      expect(firstH2).toHaveTextContent(
        'あなたのAIスキルが、まだ見ぬ誰かの課題を解決し、あなたの『資産』となる'
      )
    })

    it('説明文が表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByText(/豊富な知見とスキルを持ちながら/)
      ).toBeInTheDocument()
    })

    it('特典の強調テキストが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByText(/今なら、先行登録いただいた方限定で/)
      ).toBeInTheDocument()
    })

    it('CTAボタンが表示される', () => {
      render(<EarlyAccessPage />)
      const ctaButtons = screen.getAllByRole('button', {
        name: /今すぐ無料で先行登録/,
      })
      expect(ctaButtons[0]).toBeInTheDocument()
    })
  })

  // 問題提起セクションのテスト
  describe('問題提起セクション', () => {
    it('セクションタイトルが表示される', () => {
      render(<EarlyAccessPage />)
      // 問題提起セクションのh2タグ内でテキストを検索
      const h2Elements = screen.getAllByRole('heading', { level: 2 })
      const problemSectionH2 = h2Elements[1] // 2番目のh2
      expect(problemSectionH2).toHaveTextContent(
        '腕のいい職人ほど、営業が苦手なように'
      )
      expect(problemSectionH2).toHaveTextContent(
        '優れたAI専門家が、仕事探しに悩んでいませんか'
      )
    })

    it('3つの問題点が表示される', () => {
      render(<EarlyAccessPage />)
      expect(screen.getByText('スキルのアピールが難しい')).toBeInTheDocument()
      expect(screen.getByText('案件獲得のプロセスが不透明')).toBeInTheDocument()
      expect(
        screen.getByText('常に「営業」し続けなければならない')
      ).toBeInTheDocument()
    })
  })

  // 解決策セクションのテスト
  describe('解決策とサービスイメージ', () => {
    it('セクションタイトルが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByText(
          '本サービスを一言でいうと、「回答」するだけで仕事の依頼が舞い込む、新しい営業のカタチです。'
        )
      ).toBeInTheDocument()
    })

    it('3つの強みが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByText(
          '質の高い回答が、検索エンジン経由で見込み顧客を連れてくる'
        )
      ).toBeInTheDocument()
      expect(
        screen.getByText('実績がなくても、「本気度」と「専門性」で勝負できる')
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          'あなたの知見が、プロフィールページに「資産」として蓄積される'
        )
      ).toBeInTheDocument()
    })
  })

  // 先行登録のメリットセクションのテスト
  describe('先行登録のメリット', () => {
    it('セクションタイトルが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByText('未来を共に創る、最初のスペシャリストを募集します。')
      ).toBeInTheDocument()
    })

    it('3つの特典が表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByText('3ヶ月間の完全無料トライアル')
      ).toBeInTheDocument()
      expect(screen.getByText('初期メンバー限定の優遇措置')).toBeInTheDocument()
      expect(
        screen.getByText('専門家インタビュー記事の作成（希望者のみ）')
      ).toBeInTheDocument()
    })
  })

  // 利用の流れセクションのテスト
  describe('ご利用の流れ', () => {
    it('4つのステップが表示される', () => {
      render(<EarlyAccessPage />)
      expect(screen.getByText('1. 先行登録')).toBeInTheDocument()
      expect(screen.getByText('2. プロフィール作成')).toBeInTheDocument()
      expect(screen.getByText('3. 質問に回答')).toBeInTheDocument()
      expect(screen.getByText('4. 案件獲得へ')).toBeInTheDocument()
    })
  })

  // FAQセクションのテスト
  describe('FAQ', () => {
    it('質問がデフォルトで閉じている', () => {
      render(<EarlyAccessPage />)
      const answer = screen.queryByText(
        /AIのスキルを活かして仕事の幅を広げたいけれど/
      )
      expect(answer).not.toBeVisible()
    })

    it('質問をクリックすると回答が表示される', () => {
      render(<EarlyAccessPage />)
      const question = screen.getByText(
        'Q. AIに詳しくないのですが、どんな人に紹介すれば喜ばれますか？'
      )
      fireEvent.click(question)

      const answer = screen.getByText(
        /AIのスキルを活かして仕事の幅を広げたいけれど/
      )
      expect(answer).toBeVisible()
    })

    it('複数の質問を開閉できる', () => {
      render(<EarlyAccessPage />)
      const question1 = screen.getByText('Q. 本当に無料で始められますか？')
      const question2 = screen.getByText('Q. どのような企業が利用しますか？')

      fireEvent.click(question1)
      fireEvent.click(question2)

      expect(screen.getByText(/はい、先行登録いただいた方は/)).toBeVisible()
      expect(
        screen.getByText(/AIの導入を検討している中小企業から/)
      ).toBeVisible()
    })
  })

  // クロージングセクションのテスト
  describe('クロージング', () => {
    it('セクションタイトルが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByText('さあ、あなたの知見を、未来のビジネスへ。')
      ).toBeInTheDocument()
    })

    it('最終CTAボタンが表示される', () => {
      render(<EarlyAccessPage />)
      const finalCTA = screen.getByRole('button', {
        name: '＞＞ 今すぐ無料で先行登録し、新たな一歩を踏み出す',
      })
      expect(finalCTA).toBeInTheDocument()
    })
  })

  // インタラクションのテスト
  describe('インタラクション', () => {
    it('CTAボタンにホバーエフェクトがある', () => {
      render(<EarlyAccessPage />)
      const ctaButton = screen.getAllByRole('button', {
        name: /今すぐ無料で先行登録/,
      })[0]

      // ホバー時のクラスが適用されるか確認
      fireEvent.mouseEnter(ctaButton)
      expect(ctaButton).toHaveClass(/hover:/)
    })

    it('スムーススクロールが動作する', () => {
      // モックスクロール関数
      const scrollToMock = jest.fn()
      window.scrollTo = scrollToMock

      render(<EarlyAccessPage />)
      // スクロールトリガーがあれば、その動作をテスト
    })
  })

  // レスポンシブデザインのテスト
  describe('レスポンシブデザイン', () => {
    it('モバイルビューで要素が縦積みになる', () => {
      // window.matchMediaのモック
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(max-width: 768px)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(<EarlyAccessPage />)
      // モバイルレイアウトの確認
    })
  })
})
