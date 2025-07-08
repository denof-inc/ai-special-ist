import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __globalPrisma: PrismaClient | undefined
}

// Vercel用のPrismaクライアント設定
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
    // Vercel用の接続設定
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
