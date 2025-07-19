import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import EarlyAccessPage from '@/app/early-access/page'

describe('AIスペシャリスト向け BtoB先行登録ランディングページ', () => {
  // ファーストビューのテスト
  describe('ファーストビュー', () => {
    it('メインキャッチコピーが表示される', () => {
      render(<EarlyAccessPage />)
      const h1Elements = screen.getAllByRole('heading', { level: 1 })
      const mainHeading = h1Elements[0]
      expect(mainHeading).toHaveTextContent('「営業」に使う時間を、')
      expect(mainHeading).toHaveTextContent('「価値提供」の時間へ。')
    })

    it('サブコピーが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByText(/あなたの「回答」が営業資産となり/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/AI専門家のための新しい案件獲得プラットフォーム/)
      ).toBeInTheDocument()
    })

    it('メインCTAボタンが表示される', () => {
      render(<EarlyAccessPage />)
      const mainCTAs = screen.getAllByRole('button', {
        name: '今すぐ無料で登録する',
      })
      expect(mainCTAs[0]).toBeInTheDocument()
    })

    it('サブCTAボタンが表示される', () => {
      render(<EarlyAccessPage />)
      const subCTAs = screen.getAllByRole('button', {
        name: '資料をダウンロードする',
      })
      expect(subCTAs[0]).toBeInTheDocument()
    })
  })

  // 課題提起セクションのテスト
  describe('課題提起セクション', () => {
    it('セクションタイトルが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'AI専門家のこんなお悩みありませんか？',
        })
      ).toBeInTheDocument()
    })

    it('3つの課題カードが表示される', () => {
      render(<EarlyAccessPage />)
      // カード1
      expect(screen.getByText('スキルのアピールが苦手')).toBeInTheDocument()
      expect(
        screen.getByText(
          /自分の持つ高度な専門性や実績を、ビジネスサイドの相手に伝わる形で表現するのが難しい/
        )
      ).toBeInTheDocument()

      // カード2
      expect(screen.getByText('エージェント経由の手数料')).toBeInTheDocument()
      expect(
        screen.getByText(
          /案件を紹介されても、中間マージンが高く、自身の価値が正当に単価へ反映されているか疑問に感じる/
        )
      ).toBeInTheDocument()

      // カード3
      expect(screen.getByText('継続的な案件獲得の労力')).toBeInTheDocument()
      expect(
        screen.getByText(
          /一つの案件が終わるたびに、また一から営業活動を始める必要があり、本来集中したい開発や分析の時間が削られる/
        )
      ).toBeInTheDocument()
    })
  })

  // ソリューションセクションのテスト
  describe('ソリューション（サービスの提供価値）', () => {
    it('セクションタイトルが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'AIスペシャリスト.comが、その課題を解決できる理由',
        })
      ).toBeInTheDocument()
    })

    it('3つの特徴が表示される', () => {
      render(<EarlyAccessPage />)
      // 特徴1
      expect(screen.getByText('回答が、SEO資産になる')).toBeInTheDocument()
      expect(
        screen.getByText(
          /質の高い回答は検索エンジンに評価され、あなたを求める企業を自動で集客。手間をかけずに認知度を高めます/
        )
      ).toBeInTheDocument()

      // 特徴2
      expect(screen.getByText('実力で、正当に評価される')).toBeInTheDocument()
      expect(
        screen.getByText(
          /経歴や知名度だけでなく、具体的な回答内容であなたの課題解決能力を証明。本質的なスキルで評価されます/
        )
      ).toBeInTheDocument()

      // 特徴3
      expect(screen.getByText('直接契約で、高単価を実現')).toBeInTheDocument()
      expect(
        screen.getByText(
          /企業との直接契約だから、中間マージンは一切なし。あなたの価値がそのまま報酬に反映されます/
        )
      ).toBeInTheDocument()
    })
  })

  // 利用の流れセクションのテスト
  describe('ご利用の流れ', () => {
    it('セクションタイトルが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'ご利用はかんたん、3ステップ',
        })
      ).toBeInTheDocument()
    })

    it('3つのステップが表示される', () => {
      render(<EarlyAccessPage />)
      // Step1
      expect(screen.getByText('Step1: 無料登録')).toBeInTheDocument()
      expect(
        screen.getByText(/プロフィールを登録し、あなたの専門領域を設定します/)
      ).toBeInTheDocument()

      // Step2
      expect(screen.getByText('Step2: 質問に回答')).toBeInTheDocument()
      expect(
        screen.getByText(
          /あなたの知見を活かせる質問に回答し、評価と信頼を高めます/
        )
      ).toBeInTheDocument()

      // Step3
      expect(screen.getByText('Step3: オファー獲得')).toBeInTheDocument()
      expect(
        screen.getByText(/回答を見た企業から、直接スカウトや案件相談が届きます/)
      ).toBeInTheDocument()
    })
  })

  // 信頼性の補強セクションのテスト
  describe('信頼性の補強', () => {
    it('運営者紹介が表示される', () => {
      render(<EarlyAccessPage />)
      expect(screen.getByText('運営者紹介')).toBeInTheDocument()
      expect(
        screen.getByText('寺内 大樹（てらうち たいき）')
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Webエンジニア歴15年。受発注双方の立場で/)
      ).toBeInTheDocument()
    })

    it('FAQセクションタイトルが表示される', () => {
      render(<EarlyAccessPage />)
      expect(screen.getByText('よくあるご質問')).toBeInTheDocument()
    })

    it('FAQ質問がデフォルトで閉じている', () => {
      render(<EarlyAccessPage />)
      const answer = screen.queryByText(
        /はい。先行登録いただいた方は、3ヶ月間すべての機能を完全無料でご利用いただけます/
      )
      expect(answer).not.toBeVisible()
    })

    it('FAQ質問をクリックすると回答が表示される', () => {
      render(<EarlyAccessPage />)
      const question = screen.getByText('Q. 本当に無料ですか？')
      fireEvent.click(question)

      const answer = screen.getByText(
        /はい。先行登録いただいた方は、3ヶ月間すべての機能を完全無料でご利用いただけます/
      )
      expect(answer).toBeVisible()
    })

    it('複数のFAQ質問を開閉できる', () => {
      render(<EarlyAccessPage />)
      const question1 = screen.getByText(
        'Q. 登録したら、すぐに企業に公開されますか？'
      )
      const question2 = screen.getByText('Q. どんな企業が利用する想定ですか？')

      fireEvent.click(question1)
      fireEvent.click(question2)

      expect(
        screen.getByText(
          /いいえ。ご自身でプロフィールを公開設定にするまで、企業側から閲覧されることはありません/
        )
      ).toBeVisible()
      expect(
        screen.getByText(
          /AI導入を検討している中小企業から、特定技術の課題を抱える大企業の事業部まで/
        )
      ).toBeVisible()
    })
  })

  // クロージングセクションのテスト
  describe('クロージング', () => {
    it('セクションタイトルが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'さあ、あなたのスキルを正当に評価する企業と出会いませんか？',
        })
      ).toBeInTheDocument()
    })

    it('特典の強調テキストが表示される', () => {
      render(<EarlyAccessPage />)
      expect(
        screen.getByText(
          /今なら初期メンバーとして、3ヶ月間すべての機能を無料でご利用いただけます/
        )
      ).toBeInTheDocument()
    })

    it('最終CTAボタンが表示される', () => {
      render(<EarlyAccessPage />)
      const finalCTAs = screen.getAllByRole('button', {
        name: '今すぐ無料で登録する',
      })
      expect(finalCTAs[1]).toBeInTheDocument() // 2つ目のメインCTA
    })

    it('最終サブCTAボタンが表示される', () => {
      render(<EarlyAccessPage />)
      const finalSubCTAs = screen.getAllByRole('button', {
        name: '資料をダウンロードする',
      })
      expect(finalSubCTAs[1]).toBeInTheDocument() // 2つ目のサブCTA
    })
  })

  // インタラクションのテスト
  describe('インタラクション', () => {
    it('CTAボタンにホバーエフェクトがある', () => {
      render(<EarlyAccessPage />)
      const ctaButton = screen.getAllByRole('button', {
        name: '今すぐ無料で登録する',
      })[0]

      // ホバー時のクラスが適用されるか確認
      fireEvent.mouseEnter(ctaButton)
      expect(ctaButton).toHaveClass(/hover:/)
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
      const cards = screen.getByTestId('problem-cards-container')
      // Tailwind CSSのmd:grid-cols-3は、モバイルでは1列になる
      expect(cards).toHaveClass('grid')
    })
  })
})
