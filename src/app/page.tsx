import Link from 'next/link'

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen">
      {/* Premium Hero Section with Triple Layer Gradient */}
      <section className="hero-premium relative overflow-hidden py-24 md:py-32">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mb-8 text-6xl font-bold text-white md:text-7xl lg:text-8xl">
              <span className="block">AI</span>
              <span className="text-gradient-accent block">スペシャリスト</span>
              <span className="block">.com</span>
            </h1>
            <p className="mb-12 text-xl text-white/90 md:text-2xl">
              企業向けAI導入支援プラットフォーム
              <br />
              <span className="text-gradient-accent font-semibold">
                次世代のビジネス変革を実現
              </span>
            </p>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <button className="btn-gradient-accent">
                <Link href="/interview">事例を見る</Link>
              </button>
              <button className="btn-gradient-dynamic">
                <Link href="/qa">無料相談を始める</Link>
              </button>
            </div>
          </div>
        </div>

        {/* Floating gradient orbs */}
        <div className="absolute left-1/4 top-20 h-32 w-32 rounded-full bg-gradient-accent opacity-20 blur-xl"></div>
        <div className="absolute right-1/4 top-40 h-24 w-24 rounded-full bg-gradient-primary opacity-30 blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 h-40 w-40 rounded-full bg-gradient-dynamic opacity-15 blur-2xl"></div>
      </section>

      {/* Premium Content Section */}
      <section className="relative py-20">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-yellow-50/20"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
              {/* Interview Card - Premium Gradient */}
              <div className="card-gradient-accent group relative overflow-hidden rounded-2xl p-8">
                <div className="relative z-10">
                  <div className="mb-6 flex items-center">
                    <div className="mr-4 h-12 w-12 rounded-lg bg-gradient-accent-intense"></div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      <span className="text-gradient-accent">インタビュー</span>
                      記事
                    </h2>
                  </div>
                  <p className="mb-8 text-lg leading-relaxed text-gray-700">
                    実際にAIを導入した企業の事例を詳しく紹介。
                    <br />
                    <span className="text-gradient-accent font-semibold">
                      成功のポイントと実装のコツ
                    </span>
                    を学べます。
                  </p>
                  <button className="btn-gradient-accent">
                    <Link href="/interview">インタビューを見る</Link>
                  </button>
                </div>

                {/* Card gradient border */}
                <div className="border-gradient-accent absolute inset-0 rounded-2xl"></div>
              </div>

              {/* Consultation Card - Premium Gradient */}
              <div className="card-gradient-primary group relative overflow-hidden rounded-2xl p-8">
                <div className="relative z-10">
                  <div className="mb-6 flex items-center">
                    <div className="mr-4 h-12 w-12 rounded-lg bg-gradient-primary-intense"></div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      <span className="text-gradient-primary">無料</span>相談
                    </h2>
                  </div>
                  <p className="mb-8 text-lg leading-relaxed text-gray-700">
                    AI導入についてお気軽にご相談ください。
                    <br />
                    <span className="text-gradient-primary font-semibold">
                      専門家がサポート
                    </span>
                    いたします。
                  </p>
                  <button className="btn-gradient-primary">
                    <Link href="/qa">相談を始める</Link>
                  </button>
                </div>

                {/* Card gradient border */}
                <div className="border-gradient-primary absolute inset-0 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
