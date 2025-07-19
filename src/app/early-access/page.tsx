'use client'

import { useState } from 'react'

export default function EarlyAccessPage(): JSX.Element {
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set())

  const toggleFAQ = (index: number): void => {
    const newOpenFAQs = new Set(openFAQs)
    if (newOpenFAQs.has(index)) {
      newOpenFAQs.delete(index)
    } else {
      newOpenFAQs.add(index)
    }
    setOpenFAQs(newOpenFAQs)
  }

  const faqs = [
    {
      question: 'Q. 本当に無料ですか？',
      answer:
        'はい。先行登録いただいた方は、3ヶ月間すべての機能を完全無料でご利用いただけます。期間終了後に自動で有料プランに移行することはありませんので、ご安心ください。',
    },
    {
      question: 'Q. 登録したら、すぐに企業に公開されますか？',
      answer:
        'いいえ。ご自身でプロフィールを公開設定にするまで、企業側から閲覧されることはありません。ご自身のタイミングで活動を開始できます。',
    },
    {
      question: 'Q. どんな企業が利用する想定ですか？',
      answer:
        'AI導入を検討している中小企業から、特定技術の課題を抱える大企業の事業部まで、規模や業種を問わず、リアルな課題を持つ企業様の利用を想定しています。',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* セクション1: ファーストビュー */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* 左側：テキスト */}
            <div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                「営業」に使う時間を、
                <br />
                「価値提供」の時間へ。
              </h1>
              <p className="mb-8 text-lg text-gray-700">
                あなたの「回答」が営業資産となり、企業から直接オファーが届く。
                <br />
                AI専門家のための新しい案件獲得プラットフォーム。
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="rounded-lg bg-[#007BFF] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#0056b3]">
                  今すぐ無料で登録する
                </button>
                <button className="rounded-lg border-2 border-[#007BFF] bg-white px-8 py-4 text-lg font-bold text-[#007BFF] transition-colors hover:bg-gray-50">
                  資料をダウンロードする
                </button>
              </div>
            </div>
            {/* 右側：画像プレースホルダー */}
            <div className="h-96 rounded-lg bg-gray-100">
              {/* イメージプレースホルダー */}
            </div>
          </div>
        </div>
      </section>

      {/* セクション2: 課題提起 */}
      <section className="bg-[#F7F8FA] py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            AI専門家のこんなお悩みありませんか？
          </h2>
          <div
            className="grid gap-8 md:grid-cols-3"
            data-testid="problem-cards-container"
          >
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <span className="mr-3 text-2xl text-[#28A745]">✓</span>
                <h3 className="text-xl font-bold text-gray-900">
                  スキルのアピールが苦手
                </h3>
              </div>
              <p className="text-gray-700">
                自分の持つ高度な専門性や実績を、ビジネスサイドの相手に伝わる形で表現するのが難しい。
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <span className="mr-3 text-2xl text-[#28A745]">✓</span>
                <h3 className="text-xl font-bold text-gray-900">
                  エージェント経由の手数料
                </h3>
              </div>
              <p className="text-gray-700">
                案件を紹介されても、中間マージンが高く、自身の価値が正当に単価へ反映されているか疑問に感じる。
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <span className="mr-3 text-2xl text-[#28A745]">✓</span>
                <h3 className="text-xl font-bold text-gray-900">
                  継続的な案件獲得の労力
                </h3>
              </div>
              <p className="text-gray-700">
                一つの案件が終わるたびに、また一から営業活動を始める必要があり、本来集中したい開発や分析の時間が削られる。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* セクション3: ソリューション（サービスの提供価値） */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            AIスペシャリスト.comが、その課題を解決できる理由
          </h2>

          <div className="space-y-12">
            {/* 特徴1 */}
            <div className="rounded-lg bg-gray-50 p-8">
              <div className="mb-4 flex items-center">
                <span className="mr-4 text-3xl">🔍</span>
                <h3 className="text-2xl font-bold text-gray-900">
                  回答が、SEO資産になる
                </h3>
              </div>
              <p className="mb-4 text-gray-700">
                質の高い回答は検索エンジンに評価され、あなたを求める企業を自動で集客。手間をかけずに認知度を高めます。
              </p>
            </div>

            {/* 特徴2 */}
            <div className="rounded-lg bg-gray-50 p-8">
              <div className="mb-4 flex items-center">
                <span className="mr-4 text-3xl">🏆</span>
                <h3 className="text-2xl font-bold text-gray-900">
                  実力で、正当に評価される
                </h3>
              </div>
              <p className="mb-4 text-gray-700">
                経歴や知名度だけでなく、具体的な回答内容であなたの課題解決能力を証明。本質的なスキルで評価されます。
              </p>
            </div>

            {/* 特徴3 */}
            <div className="rounded-lg bg-gray-50 p-8">
              <div className="mb-4 flex items-center">
                <span className="mr-4 text-3xl">🤝</span>
                <h3 className="text-2xl font-bold text-gray-900">
                  直接契約で、高単価を実現
                </h3>
              </div>
              <p className="mb-4 text-gray-700">
                企業との直接契約だから、中間マージンは一切なし。あなたの価値がそのまま報酬に反映されます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* セクション4: ご利用の流れ */}
      <section className="bg-[#F7F8FA] py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            ご利用はかんたん、3ステップ
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#007BFF] text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Step1: 無料登録
              </h3>
              <p className="text-gray-700">
                プロフィールを登録し、あなたの専門領域を設定します。
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#007BFF] text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Step2: 質問に回答
              </h3>
              <p className="text-gray-700">
                あなたの知見を活かせる質問に回答し、評価と信頼を高めます。
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#007BFF] text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Step3: オファー獲得
              </h3>
              <p className="text-gray-700">
                回答を見た企業から、直接スカウトや案件相談が届きます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* セクション5: 信頼性の補強 */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 md:grid-cols-2">
            {/* 左側：運営者紹介 */}
            <div>
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                運営者紹介
              </h3>
              <div className="flex items-start gap-6">
                <div className="h-24 w-24 rounded-full bg-gray-300">
                  {/* プロフィール写真プレースホルダー */}
                </div>
                <div>
                  <p className="mb-2 text-xl font-bold text-gray-900">
                    寺内 大樹（てらうち たいき）
                  </p>
                  <p className="text-gray-700">
                    Webエンジニア歴15年。受発注双方の立場で、優れた技術者が営業活動で苦労する姿を数多く見てきました。「技術者が、もっと本質的な価値提供に集中できる世界を創りたい」という想いから、本サービスを立ち上げています。
                  </p>
                </div>
              </div>
            </div>

            {/* 右側：FAQ */}
            <div>
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                よくあるご質問
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <button
                      className="w-full text-left font-bold text-gray-900 transition-colors hover:text-[#007BFF]"
                      onClick={() => toggleFAQ(index)}
                    >
                      {faq.question}
                    </button>
                    <div
                      className={`mt-2 text-gray-700 ${
                        openFAQs.has(index) ? 'block' : 'hidden'
                      }`}
                      style={{
                        display: openFAQs.has(index) ? 'block' : 'none',
                      }}
                    >
                      <p>A. {faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* セクション6: クロージング */}
      <section className="bg-[#F7F8FA] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            さあ、あなたのスキルを正当に評価する企業と出会いませんか？
          </h2>
          <p className="mb-8 text-lg text-gray-700">
            今なら初期メンバーとして、3ヶ月間すべての機能を無料でご利用いただけます。
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button className="rounded-lg bg-[#007BFF] px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-[#0056b3]">
              今すぐ無料で登録する
            </button>
            <button className="rounded-lg border-2 border-[#007BFF] bg-white px-8 py-4 text-lg font-bold text-[#007BFF] transition-colors hover:bg-gray-50">
              資料をダウンロードする
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
