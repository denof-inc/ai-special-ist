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
      question: 'Q. AIに詳しくないのですが、どんな人に紹介すれば喜ばれますか？',
      answer:
        '「AIのスキルを活かして仕事の幅を広げたいけれど、営業活動は少し苦手…」と感じているご友人・お知り合いがいらっしゃれば、きっとお役に立てるはずです。フリーランス、副業希望の方、どなたでも歓迎です。',
    },
    {
      question: 'Q. 本当に無料で始められますか？',
      answer:
        'はい、先行登録いただいた方は、3ヶ月間すべての機能を完全無料でご利用いただけます。自動で有料プランに移行することはありませんので、ご安心ください。',
    },
    {
      question: 'Q. どのような企業が利用しますか？',
      answer:
        'AIの導入を検討している中小企業から、特定の技術的課題を抱える大企業まで、規模や業種を問わず、リアルな課題を持つ様々な企業が質問者として参加します。',
    },
    {
      question: 'Q. 企業とのやり取りはどのように行いますか？',
      answer:
        'あなたの回答を見た企業から、サイト内のメッセージ機能を通じて直接連絡が届きます。その後のやり取りや契約は、当事者間で自由に進めていただけます。',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* セクション1: ファーストビュー */}
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1A237E] to-[#2196F3] text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold">
            AIをもっと身近に、オープンに。
          </h1>
          <h2 className="mb-4 text-2xl">
            AIのスキルで活躍したいと願うすべての専門家のために。
            <br />
            あなたのAIスキルが、まだ見ぬ誰かの課題を解決し、あなたの『資産』となる。
          </h2>
          <p className="mb-6 text-lg">
            豊富な知見とスキルを持ちながら、その価値を十分に発揮できていないと感じていませんか？私たちは、あなたの専門性が正当に評価され、新たな活躍の機会に繋がる、ただ一つのプラットフォームを創造します。
          </p>
          <p className="mb-8 text-xl">
            <strong>
              今なら、先行登録いただいた方限定で、全ての機能を3ヶ月間無料でご利用いただけます。
            </strong>
          </p>
          <button className="rounded-lg bg-[#FF9800] px-8 py-4 text-xl font-bold text-white transition-colors hover:bg-[#F57C00]">
            ＞＞ 今すぐ無料で先行登録する
          </button>
        </div>
      </section>

      {/* セクション2: 問題提起 */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-3xl font-bold">
            腕のいい職人ほど、営業が苦手なように。
            <br />
            優れたAI専門家が、仕事探しに悩んでいませんか？
          </h2>
          <p className="mb-12 text-center text-gray-700">
            AI技術の進化は目覚ましく、その専門知識を持つあなたの価値は、日に日に高まっています。しかし、その高度なスキルを実際のビジネスに繋げるまでには、多くの専門家が共通の壁に直面しています。
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold">
                スキルのアピールが難しい
              </h3>
              <p>
                自身の専門性や実績を、課題を抱える企業の担当者に「伝わる形」で表現し、信頼を勝ち取るのは決して簡単ではありません。
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold">
                案件獲得のプロセスが不透明
              </h3>
              <p>
                エージェントやマッチングサイトでは、手数料も安くなく、本当に自分のスキルが活かせる案件に出会える機会は限られています。
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold">
                常に「営業」し続けなければならない
              </h3>
              <p>
                単発の案件で関係が途切れてしまい、常に新規顧客を探し続けなければならない…そんな状況にもどかしさを感じていませんか？
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* セクション3: 解決策とサービスイメージ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-center text-3xl font-bold">
            本サービスを一言でいうと、「回答」するだけで仕事の依頼が舞い込む、新しい営業のカタチです。
          </h2>
          <p className="mb-12 text-center text-gray-700">
            私たちが提案するのは、従来の営業手法とは全く異なるアプローチです。このプラットフォームでは、あなたの「回答」そのものが、見込み顧客への最も雄弁なプレゼンテーションとなり、継続的に価値を生み出す「資産」へと変わります。
          </p>

          <div className="space-y-16">
            {/* 強み1 */}
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="h-64 rounded-lg bg-gray-300 md:w-1/2"></div>
              <div className="md:w-1/2">
                <h3 className="mb-4 text-2xl font-bold">
                  質の高い回答が、検索エンジン経由で見込み顧客を連れてくる
                </h3>
                <p className="mb-4">
                  【例えば…】企業が「AIで業務を効率化したい」とGoogle検索した時、このサイトにある専門家の的確な回答がヒットします。それを見た企業が「この人に相談したい！」と直接連絡してくる、という仕組みです。
                </p>
                <p className="text-gray-700">
                  【専門家のあなたへ】AIに関する具体的な課題を持つ企業担当者は、まず検索エンジンで解決策を探します。あなたの専門的で分かりやすい回答は、検索結果で上位に表示され、課題解決に最も近い専門家として、あなたの存在を自然な形で知らせます。これは、あなたが眠っている間でさえ、24時間365日働き続ける、強力な営業チャネルとなります。
                </p>
              </div>
            </div>

            {/* 強み2 */}
            <div className="flex flex-col items-center gap-8 md:flex-row-reverse">
              <div className="h-64 rounded-lg bg-gray-300 md:w-1/2"></div>
              <div className="md:w-1/2">
                <h3 className="mb-4 text-2xl font-bold">
                  実績がなくても、「本気度」と「専門性」で勝負できる
                </h3>
                <p className="mb-4">
                  【つまり…】有名な専門家でなくても、回答の質が高ければ正当に評価されます。まだ実績の少ない、才能ある専門家にとって大きなチャンスになります。
                </p>
                <p className="text-gray-700">
                  【専門家のあなたへ】この場所では、誰もが平等です。たとえ輝かしい実績や知名度がなくても、一つひとつの質問に真摯に向き合い、質の高い回答を積み重ねることで、あなたの思考力や問題解決能力がダイレクトに伝わります。経歴書だけでは伝わらない「本物の実力」で、先行する専門家とも対等に渡り合うことが可能です。
                </p>
              </div>
            </div>

            {/* 強み3 */}
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="h-64 rounded-lg bg-gray-300 md:w-1/2"></div>
              <div className="md:w-1/2">
                <h3 className="mb-4 text-2xl font-bold">
                  あなたの知見が、プロフィールページに「資産」として蓄積される
                </h3>
                <p className="mb-4">
                  【言い換えると…】回答すればするほど、それが自動で立派な実績集（ポートフォリオ）になります。手間をかけずに、あなたの信頼性がどんどん高まっていきます。
                </p>
                <p className="text-gray-700">
                  【専門家のあなたへ】あなたが投稿した回答は、すべてあなたのプロフィールページに紐づけられ、実績として蓄積されていきます。それは、あなたの専門性の深さと幅広さを証明する、唯一無二のポートフォリオ。この「知の資産」が、あなたの信頼性を高め、企業からの引き合いを増やし続けます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* セクション4: 先行登録のメリット */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-center text-3xl font-bold">
            未来を共に創る、最初のスペシャリストを募集します。
          </h2>
          <p className="mb-12 text-center text-gray-700">
            私たちは、このプラットフォームを参加する専門家の皆様と共に成長させていきたいと考えています。黎明期にご参加いただく初期メンバーの方には、感謝を込めて特別な機会をご用意しました。
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold">
                3ヶ月間の完全無料トライアル
              </h3>
              <p>
                まずはリスクなく、本サービスの全ての価値を心ゆくまでご体験ください。あなたの知見が資産に変わる感覚を、ぜひご自身で実感していただきたいと考えています。
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold">
                初期メンバー限定の優遇措置
              </h3>
              <p>
                サイト内での露出機会の増加や、今後のサービス開発にあなたの声を反映させる意見交換会へのご招待など、共にプラットフォームを成長させる重要なパートナーとして、特別なサポートをお約束します。
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold">
                専門家インタビュー記事の作成（希望者のみ）
              </h3>
              <p>
                あなたの専門性やこれまでのご経験、そして未来へのビジョンを深く掘り下げる、プロのライターによるインタビュー記事を作成。私たちのメディアで公開し、あなたのブランディングを強力に後押しします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* セクション5: ご利用の流れ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-[#2196F3]">1</div>
              <h3 className="mb-2 text-xl font-bold">1. 先行登録</h3>
              <p>
                まずはフォームから、1分で完了する簡単な情報をご登録ください。
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-[#2196F3]">2</div>
              <h3 className="mb-2 text-xl font-bold">2. プロフィール作成</h3>
              <p>
                あなたの専門スキルや経歴を登録し、魅力的なプロフィールを完成させます。
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-[#2196F3]">3</div>
              <h3 className="mb-2 text-xl font-bold">3. 質問に回答</h3>
              <p>あなたの知見を活かせる質問を選び、専門家として回答します。</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl font-bold text-[#2196F3]">4</div>
              <h3 className="mb-2 text-xl font-bold">4. 案件獲得へ</h3>
              <p>
                あなたの回答に価値を感じた企業から、直接あなたに相談や案件の依頼が届きます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* セクション6: FAQ よくあるご質問 */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            よくあるご質問
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-lg bg-white shadow-md">
                <button
                  className="w-full p-6 text-left font-bold transition-colors hover:bg-gray-50"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                </button>
                <div
                  className={`px-6 pb-6 ${openFAQs.has(index) ? 'block' : 'hidden'}`}
                  style={{ display: openFAQs.has(index) ? 'block' : 'none' }}
                >
                  <p>A. {faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* セクション7: クロージング */}
      <section className="bg-gradient-to-br from-[#1A237E] to-[#2196F3] py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            さあ、あなたの知見を、未来のビジネスへ。
          </h2>
          <p className="mb-8 text-lg">
            AIの可能性が社会のあらゆる場面で求められる今、専門家の価値はかつてないほど高まっています。その貴重な知見を、閉じた世界に留めておくのはあまりにも惜しい。私たちと共に、専門知識が正当に評価され、新たなチャンスが次々と生まれるオープンなエコシステムを築きませんか。未来を切り拓く、あなたのご参加を心よりお待ちしています。
          </p>
          <button className="rounded-lg bg-[#FF9800] px-8 py-4 text-xl font-bold text-white transition-colors hover:bg-[#F57C00]">
            ＞＞ 今すぐ無料で先行登録し、新たな一歩を踏み出す
          </button>
        </div>
      </section>
    </div>
  )
}
