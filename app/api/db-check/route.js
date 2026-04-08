import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

// Diagnostic endpoint — remove after confirming DB works on Vercel
export async function GET() {
  const startTime = Date.now()
  try {
    const count = await prisma.update.count()
    const latest = await prisma.update.findMany({
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: { title: true, category: true, publishedAt: true }
    })
    return NextResponse.json({
      status: 'ok',
      count,
      latency_ms: Date.now() - startTime,
      latest,
      db_url_hint: (process.env.DATABASE_URL || '').substring(0, 60) + '...',
    })
  } catch (e) {
    return NextResponse.json({
      status: 'error',
      message: e.message,
      latency_ms: Date.now() - startTime,
      db_url_hint: (process.env.DATABASE_URL || 'NOT_SET').substring(0, 60) + '...',
    }, { status: 500 })
  }
}
