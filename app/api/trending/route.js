import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { cacheGet, cacheSet, CACHE_TTL } from '../../../lib/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const cacheKey = 'updates:trending'

  const cached = await cacheGet(cacheKey)
  if (cached) {
    return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached, {
      headers: { 'X-Cache': 'HIT' },
    })
  }

  const trending = await prisma.update.findMany({
    orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
    take: 10,
    select: {
      id: true,
      title: true,
      category: true,
      slug: true,
      riskLevel: true,
      views: true,
      publishedAt: true,
      summaryEn: true,
    },
  })

  await cacheSet(cacheKey, JSON.stringify(trending), CACHE_TTL.TRENDING)

  return NextResponse.json(trending, { headers: { 'X-Cache': 'MISS' } })
}
