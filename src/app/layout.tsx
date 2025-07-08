import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AIスペシャリスト.com',
  description: '企業向けAI導入支援プラットフォーム',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    title: 'AIスペシャリスト.com',
    description: '企業向けAI導入支援プラットフォーム',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'AIスペシャリスト.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIスペシャリスト.com',
    description: '企業向けAI導入支援プラットフォーム',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* Premium Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto flex h-20 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                  <span className="text-lg font-bold text-white">AI</span>
                </div>
                <span className="text-gradient-primary text-xl font-bold">
                  AIスペシャリスト
                </span>
              </Link>
            </div>

            <nav className="hidden items-center space-x-8 md:flex">
              <Link
                href="/interview"
                className="hover:text-gradient-primary text-sm font-medium text-foreground transition-all"
              >
                インタビュー
              </Link>
              <Link
                href="/qa"
                className="hover:text-gradient-primary text-sm font-medium text-foreground transition-all"
              >
                無料相談
              </Link>
              <button className="btn-gradient-accent text-sm">
                <Link href="/qa">お問い合わせ</Link>
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="btn-gradient-primary px-4 py-2 text-sm">
                <Link href="/qa">相談</Link>
              </button>
            </div>
          </div>
        </header>

        {children}

        {/* Premium Footer */}
        <footer className="relative bg-gradient-primary">
          <div className="absolute inset-0 bg-gradient-hero-overlay"></div>
          <div className="container relative z-10 mx-auto px-4 py-12">
            <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent">
                  <span className="text-sm font-bold text-white">AI</span>
                </div>
                <span className="text-lg font-bold text-white">
                  AIスペシャリスト.com
                </span>
              </div>
              <p className="text-sm text-white/80">
                © 2024 AIスペシャリスト.com. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
