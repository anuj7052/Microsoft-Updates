import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { cacheGet, cacheSet, cacheDel, CACHE_TTL } from '../../../../lib/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const { slug } = await params
  const cacheKey = `update:${slug}`

  const cached = await cacheGet(cacheKey)
  if (cached) {
    return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached, {
      headers: { 'X-Cache': 'HIT' },
    })
  }

  const update = await prisma.update.findUnique({ where: { slug } })

  if (!update) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await cacheSet(cacheKey, JSON.stringify(update), CACHE_TTL.SINGLE_UPDATE)

  // Increment view count asynchronously (fire-and-forget, then invalidate trending)
  prisma.update
    .update({ where: { slug }, data: { views: { increment: 1 } } })
    .then(() => cacheDel('updates:trending'))
    .catch(() => {})

  return NextResponse.json(update, { headers: { 'X-Cache': 'MISS' } })
}
