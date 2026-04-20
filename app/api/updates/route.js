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

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
  const search = searchParams.get('search') || ''
  const risk = searchParams.get('risk') || ''

  const cacheKey = `updates:${category}:${page}:${search}:${risk}`

  const cached = await cacheGet(cacheKey)
  if (cached) {
    return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached, {
      headers: { 'X-Cache': 'HIT' },
    })
  }

  let items = loadItems()

  if (category) items = items.filter((i) => i.category === category)
  if (risk) items = items.filter((i) => (i.riskLevel || 'SAFE') === risk)
  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (i) =>
        (i.title || '').toLowerCase().includes(q) ||
        (i.summary || '').toLowerCase().includes(q)
    )
  }

  const total = items.length
  const updates = items.slice((page - 1) * limit, page * limit).map((i) => ({
    id: i.slug,
    title: i.title,
    category: i.category,
    description: i.summary || '',
    summaryEn: i.summary || '',
    riskLevel: i.riskLevel || 'SAFE',
    slug: i.slug,
    kbNumber: i.kbNumber || null,
    publishedAt: i.date,
    views: 0,
    metaTitle: i.metaTitle || i.title,
    metaDescription: i.metaDescription || i.summary || '',
  }))

  const result = { updates, total, page, pages: Math.ceil(total / limit), limit }

  await cacheSet(cacheKey, JSON.stringify(result), CACHE_TTL.UPDATES_LIST)

  return NextResponse.json(result, { headers: { 'X-Cache': 'MISS' } })
}
