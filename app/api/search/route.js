import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function loadItems() {
  const results = []
  // 1. live-updates.json (static curated articles)
  try {
    const p = path.join(process.cwd(), 'data', 'live-updates.json')
    const items = JSON.parse(fs.readFileSync(p, 'utf8')).items || []
    items.forEach((i) =>
      results.push({
        title: i.title,
        description: i.summary || '',
        category: i.category,
        pubDate: i.date || new Date().toISOString(),
        slug: i.slug,
        image: i.image || null,
      })
    )
  } catch {}
  // 2. news.json (RSS pipeline)
  try {
    const p = path.join(process.cwd(), 'data', 'news.json')
    const items = JSON.parse(fs.readFileSync(p, 'utf8'))
    items.forEach((i) =>
      results.push({
        title: i.title,
        description: i.description || '',
        category: i.feedCategory || '',
        pubDate: i.pubDate || i.publishedAt || new Date().toISOString(),
        slug: i.slug,
        image: i.image || null,
      })
    )
  } catch {}
  return results
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || typeof q !== 'string' || q.trim() === '') {
    return NextResponse.json([])
  }

  try {
    const rawQuery = q.trim().toLowerCase()
    const items = loadItems()
    // Deduplicate by slug
    const seen = new Set()
    const results = items
      .filter((i) => {
        if (!i.title) return false
        const key = i.slug || i.title.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (seen.has(key)) return false
        seen.add(key)
        return (
          (i.title || '').toLowerCase().includes(rawQuery) ||
          (i.description || '').toLowerCase().includes(rawQuery) ||
          (i.category || '').toLowerCase().includes(rawQuery)
        )
      })
      .slice(0, 15)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

