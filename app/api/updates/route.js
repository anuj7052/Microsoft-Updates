import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { cacheGet, cacheSet, CACHE_TTL } from '../../../lib/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
  const search = searchParams.get('search') || ''
  const risk = searchParams.get('risk') || '' // SAFE | CAUTION | AVOID

  const cacheKey = `updates:${category}:${page}:${search}:${risk}`

  // Try Redis cache first
  const cached = await cacheGet(cacheKey)
  if (cached) {
    return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached, {
      headers: { 'X-Cache': 'HIT' },
    })
  }

  const where = {
    ...(category ? { category } : {}),
    ...(risk ? { riskLevel: risk } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { summaryEn: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const [updates, total] = await Promise.all([
    prisma.update.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        summaryEn: true,
        riskLevel: true,
        slug: true,
        kbNumber: true,
        publishedAt: true,
        views: true,
        metaTitle: true,
        metaDescription: true,
      },
    }),
    prisma.update.count({ where }),
  ])

  const result = {
    updates,
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
  }

  await cacheSet(cacheKey, JSON.stringify(result), CACHE_TTL.UPDATES_LIST)

  return NextResponse.json(result, {
    headers: { 'X-Cache': 'MISS' },
  })
}
