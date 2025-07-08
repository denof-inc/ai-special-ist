import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __globalPrisma: PrismaClient | undefined
}

// Vercel用のPrismaクライアント設定
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 遅延初期化でビルド時エラーを回避
let _prisma: PrismaClient | null = null

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop): unknown {
    if (!_prisma) {
      // 実際に使用される時点で初期化
      _prisma =
        globalForPrisma.prisma ??
        new PrismaClient({
          log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
          // ビルド時安全な設定: DATABASE_URLが未定義の場合はダミー値を使用
          datasources: {
            db: {
              url:
                process.env.DATABASE_URL ||
                'postgresql://dummy:dummy@localhost:5432/dummy',
            },
          },
        })

      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _prisma
      }
    }

    return _prisma[prop as keyof PrismaClient]
  },
})
