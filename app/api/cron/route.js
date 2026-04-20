import { NextResponse } from 'next/server'
import { fetchMicrosoftFeeds } from '../../../lib/feeds'
import { generateArticleContent } from '../../../lib/ai-writer'
import fs from 'fs'
import path from 'path'

export const maxDuration = 300 // Set max execution time to 5 mins

function makeSlug(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  
  // Authorize: Vercel cron sends Bearer <CRON_SECRET>, manual trigger uses ?secret=PIPELINE_SECRET
  const cronSecret = process.env.CRON_SECRET
  const pipelineSecret = process.env.PIPELINE_SECRET
  const querySecret = request.nextUrl.searchParams.get('secret')

  const isValidCron = cronSecret && authHeader === `Bearer ${cronSecret}`
  const isValidManual = pipelineSecret && querySecret === pipelineSecret

  if (!isValidCron && !isValidManual) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'live-updates.json')
    let existing = { updatedAt: new Date().toISOString(), items: [] }
    try { existing = JSON.parse(fs.readFileSync(dataPath, 'utf8')) } catch {}

    const existingSlugs = new Set((existing.items || []).map((i) => i.slug))
    const existingUrls = new Set((existing.items || []).map((i) => i.sourceUrl).filter(Boolean))

    const items = await fetchMicrosoftFeeds()
    const saved = []
    const skipped = []
    const newItems = []

    for (const item of items) {
      const slug = makeSlug(item.title)
      const sourceUrl = item.link || `https://microsoftupdates.co.in/fallback/${slug}`

      if (existingSlugs.has(slug) || existingUrls.has(sourceUrl)) {
        skipped.push(slug)
        continue
      }

      const aiContent = await generateArticleContent(item.title, item.description, item.feedCategory)

      newItems.push({
        title: item.title,
        summary: aiContent?.summaryEn || item.description || item.title,
        date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        category: item.feedCategory || 'general',
        sourceUrl,
        slug,
        image: `/api/og?title=${encodeURIComponent(item.title)}&category=${item.feedCategory || 'general'}`,
        riskLevel: aiContent?.riskLevel || 'SAFE',
        keyChanges: aiContent?.keyChanges || [],
        summaryHi: aiContent?.summaryHi || '',
        metaTitle: aiContent?.metaTitle || item.title.substring(0, 60),
        metaDescription: aiContent?.metaDescription || '',
      })
      saved.push(slug)
    }

    if (newItems.length > 0) {
      existing.items = [...newItems, ...(existing.items || [])]
      existing.updatedAt = new Date().toISOString()
      fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2))
    }

    console.log(`CRON: Saved ${saved.length} new articles, skipped ${skipped.length} existing`)
    return NextResponse.json({ success: true, count: saved.length, saved, skipped: skipped.length })
  } catch (error) {
    console.error('CRON_ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
