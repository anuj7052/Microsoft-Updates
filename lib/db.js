import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Build a clean connection URL - ensure channel_binding is set (required for Neon pooler)
function getDbUrl() {
  const url = process.env.DATABASE_URL || ''
  // Replace pgbouncer=true with channel_binding=require for Neon compatibility
  if (url.includes('pgbouncer=true')) {
    return url.replace('pgbouncer=true', 'channel_binding=require')
  }
  // Add channel_binding if completely missing
  if (!url.includes('channel_binding')) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}channel_binding=require`
  }
  return url
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: getDbUrl(),
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
