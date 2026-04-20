import { NextResponse } from 'next/server'
import { cacheGet, cacheSet, CACHE_TTL } from '../../../lib/redis'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function loadItems() {
  try {
    const p = path.join(process.cwd(), 'data', 'live-updates.json')
    return JSON.parse(fs.readFileSync(p, 'utf8')).items || []
  } catch {
    return []
  }
}

export async function GET() {
  const cacheKey = 'updates:trending'

  const cached = await cacheGet(cacheKey)
  if (cached) {
    return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached, {
      headers: { 'X-Cache': 'HIT' },
    })
  }

  // Return the 10 most recent items as "trending" (no view counter in JSON)
  const trending = loadItems()
    .slice(0, 10)
    .map((i) => ({
      id: i.slug,
      title: i.title,
      category: i.category,
      slug: i.slug,
      riskLevel: i.riskLevel || 'SAFE',
      views: 0,
      publishedAt: i.date,
      summaryEn: i.summary || '',
    }))

  await cacheSet(cacheKey, JSON.stringify(trending), CACHE_TTL.TRENDING)

  return NextResponse.json(trending, { headers: { 'X-Cache': 'MISS' } })
}
