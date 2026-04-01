/**
 * Automated pipeline:
 * 1. Fetch RSS feeds (only items newer than lastFetchedAt)
 * 2. Deduplicate against DB (KB number, source URL, title)
 * 3. Generate AI content for each new item
 * 4. Store to PostgreSQL
 * 5. Invalidate Redis caches
 * 6. Update lastFetchedAt
 */

import { prisma } from './db.js'
import { cacheDel } from './redis.js'
import { generateAIContent, generateSlug } from './ai.js'
import { fetchMicrosoftFeeds } from './feeds.js'

const DELAY_MS = 2500 // Rate-limit AI calls: 2.5s between requests
const MAX_RETRIES = 3

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Extract KB number from title/description ────────────────────────────────

function extractKBNumber(text) {
  const match = text.match(/\bKB\d{7}\b/i)
  return match ? match[0].toUpperCase() : null
}

// ─── Deduplication check ─────────────────────────────────────────────────────

async function isDuplicate(title, kbNumber, sourceUrl) {
  // 1. Unique KB number
  if (kbNumber) {
    const exists = await prisma.update.findUnique({
      where: { kbNumber },
      select: { id: true },
    })
    if (exists) return true
  }

  // 2. Source URL is unique-indexed
  const byUrl = await prisma.update.findUnique({
    where: { sourceUrl },
    select: { id: true },
  })
  if (byUrl) return true

  // 3. Exact title match (case-insensitive)
  const byTitle = await prisma.update.findFirst({
    where: { title: { equals: title, mode: 'insensitive' } },
    select: { id: true },
  })
  return !!byTitle
}

// ─── Ensure slug is unique in DB ─────────────────────────────────────────────

async function ensureUniqueSlug(slug) {
  const exists = await prisma.update.findUnique({ where: { slug }, select: { id: true } })
  if (!exists) return slug
  return `${slug}-${Date.now()}`
}

// ─── Process a single article with retries ───────────────────────────────────

async function processArticle(article, attempt = 1) {
  const kbNumber = extractKBNumber(`${article.title} ${article.description}`)

  const duplicate = await isDuplicate(article.title, kbNumber, article.link)
  if (duplicate) {
    return { status: 'skipped', reason: 'duplicate' }
  }

  try {
    const aiContent = await generateAIContent({
      title: article.title,
      description: article.description,
      category: article.feedCategory || 'general',
      kbNumber,
    })

    const slug = await ensureUniqueSlug(aiContent.slug)

    await prisma.update.create({
      data: {
        title: article.title,
        kbNumber: kbNumber || undefined,
        category: article.feedCategory || 'general',
        description: article.description,
        summaryEn: aiContent.summaryEn,
        summaryHi: aiContent.summaryHi,
        keyChanges: aiContent.keyChanges,
        riskLevel: aiContent.riskLevel,
        shouldInstall: aiContent.shouldInstall,
        slug,
        metaTitle: aiContent.metaTitle,
        metaDescription: aiContent.metaDescription,
        sourceUrl: article.link,
        publishedAt: article.pubDate ? new Date(article.pubDate) : new Date(),
      },
    })

    // Invalidate category + global caches
    await cacheDel(
      `updates:${article.feedCategory}:1:`,
      `updates:all:1:`,
      `updates:latest`,
      `updates:trending`,
    )

    return { status: 'processed' }
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      console.warn(`[Pipeline] Retry ${attempt}/${MAX_RETRIES} for: ${article.title.substring(0, 40)}`)
      await sleep(attempt * 3000)
      return processArticle(article, attempt + 1)
    }
    throw err
  }
}

// ─── Main pipeline entry point ───────────────────────────────────────────────

export async function runPipeline() {
  const stats = { fetched: 0, new: 0, skipped: 0, processed: 0, errors: 0 }
  const startedAt = Date.now()

  console.log('[Pipeline] ▶ Starting run at', new Date().toISOString())

  // Get last fetch timestamp
  const fetchState = await prisma.fetchState.findFirst()
  const lastFetchedAt = fetchState?.lastFetchedAt || new Date(Date.now() - 60 * 60 * 1000) // default: 1h ago

  console.log('[Pipeline] Last fetched:', lastFetchedAt.toISOString())

  // Fetch all RSS feeds
  const articles = await fetchMicrosoftFeeds()
  stats.fetched = articles.length

  // Only process articles newer than last fetch
  const newArticles = articles.filter((a) => {
    if (!a.pubDate) return true // include if date unknown
    return new Date(a.pubDate) > lastFetchedAt
  })
  stats.new = newArticles.length

  console.log(`[Pipeline] ${stats.fetched} fetched, ${stats.new} are new`)

  for (const article of newArticles) {
    try {
      const result = await processArticle(article)

      if (result.status === 'skipped') {
        stats.skipped++
      } else {
        stats.processed++
        console.log(`[Pipeline] ✓ Stored: ${article.title.substring(0, 60)}`)
      }

      await sleep(DELAY_MS) // Rate limiting between AI calls
    } catch (err) {
      stats.errors++
      console.error(`[Pipeline] ✗ Error:`, err.message, '|', article.title.substring(0, 40))
    }
  }

  // Update lastFetchedAt to now
  await prisma.fetchState.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', lastFetchedAt: new Date() },
    update: { lastFetchedAt: new Date() },
  })

  const duration = ((Date.now() - startedAt) / 1000).toFixed(1)
  console.log(`[Pipeline] ■ Done in ${duration}s`, stats)

  return stats
}
