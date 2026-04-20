import { NextResponse } from 'next/server'
import { cacheGet, cacheSet, CACHE_TTL } from '../../../../lib/redis'
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

export async function GET(request, { params }) {
  const { slug } = await params
  const cacheKey = `update:${slug}`

  const cached = await cacheGet(cacheKey)
  if (cached) {
    return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached, {
      headers: { 'X-Cache': 'HIT' },
    })
  }

  const items = loadItems()
  const item = items.find((i) => i.slug === slug)

  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const update = {
    id: item.slug,
    title: item.title,
    category: item.category,
    slug: item.slug,
    description: item.summary || '',
    summaryEn: item.summary || '',
    summaryHi: item.summaryHi || '',
    riskLevel: item.riskLevel || 'SAFE',
    keyChanges: item.keyChanges || [],
    sourceUrl: item.sourceUrl,
    publishedAt: item.date,
    metaTitle: item.metaTitle || item.title,
    metaDescription: item.metaDescription || item.summary || '',
    image: item.image || null,
  }

  await cacheSet(cacheKey, JSON.stringify(update), CACHE_TTL.SINGLE_UPDATE)

  return NextResponse.json(update, { headers: { 'X-Cache': 'MISS' } })
}
