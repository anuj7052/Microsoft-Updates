/**
 * scripts/fetchNews.js
 *
 * Fetches Microsoft RSS feeds, normalises items, and writes data/news.json.
 * Run manually:   node scripts/fetchNews.js
 * Or add a cron / Vercel scheduled function that calls this via /api/cron.
 */

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { fetchFeed } from '../lib/rss.js'
import { transform } from '../lib/transform.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── OG image scraper ──────────────────────────────────────────────────────────

const BAD_IMAGE_PATTERNS = [
  's.w.org/images/core/emoji',
  'uhf.microsoft.com',
  'gravatar.com',
  'wp-includes/images',
  '/emoji/',
  'pixel.wp.com',
  'pixel.rsstag.com',
  'feeds.feedburner.com',
]

function isBadImage(url) {
  if (!url) return true
  return BAD_IMAGE_PATTERNS.some((p) => url.includes(p))
}

async function fetchOgImage(url) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MicrosoftUpdatesBot/1.0)' },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const html = await res.text()
    // Try OG and Twitter card image meta tags (both attribute orderings)
    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/,
    ]
    for (const rx of patterns) {
      const m = html.match(rx)
      if (m && m[1].startsWith('http') && !isBadImage(m[1])) return m[1]
    }
    return null
  } catch {
    return null
  }
}

// ── Feed catalogue ────────────────────────────────────────────────────────────

const FEEDS = [
  {
    url: 'https://devblogs.microsoft.com/powerplatform/feed/',
    category: 'power-platform',
    name: 'Power Platform',
  },
  {
    url: 'https://blog.fabric.microsoft.com/en-us/blog/feed/',
    category: 'fabric',
    name: 'Microsoft Fabric',
  },
  {
    url: 'https://azure.microsoft.com/en-us/blog/feed/',
    category: 'azure',
    name: 'Azure Blog',
  },
  {
    url: 'https://blogs.windows.com/feed/',
    category: 'windows',
    name: 'Windows Blog',
  },
  {
    url: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',
    category: 'office365',
    name: 'Microsoft 365',
  },
  {
    url: 'https://devblogs.microsoft.com/microsoft365dev/feed/',
    category: 'office365',
    name: 'M365 Dev',
  },
  {
    url: 'https://www.microsoft.com/en-us/security/blog/feed/',
    category: 'security',
    name: 'Microsoft Security Blog',
  },
  {
    url: 'https://blogs.microsoft.com/ai/feed/',
    category: 'copilot',
    name: 'Microsoft AI',
  },
]

// Number of paginated pages to fetch per feed (each page = ~10 articles)
const PAGES_PER_FEED = 5

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄 Fetching Microsoft RSS feeds…')

  // ── Load existing articles to merge with ─────────────────────────────────
  const outputPath = path.join(__dirname, '..', 'data', 'news.json')
  let existingArticles = []
  try {
    if (fs.existsSync(outputPath)) {
      existingArticles = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
      console.log(`  📂 Loaded ${existingArticles.length} existing articles`)
    }
  } catch {}

  const seen = new Set()
  // Seed seen set with existing article titles so we don't add dupes
  existingArticles.forEach(a => {
    const key = (a.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    if (key) seen.add(key)
  })

  const newArticles = []

  for (const feed of FEEDS) {
    process.stdout.write(`  → ${feed.name} … `)
    const baseUrl = feed.url.replace(/\?.*$/, '')

    // Fetch multiple pages
    const allItems = []
    for (let page = 1; page <= PAGES_PER_FEED; page++) {
      const pageUrl = page === 1 ? baseUrl : `${baseUrl}?paged=${page}`
      const items = await fetchFeed(pageUrl)
      if (!items.length) break
      allItems.push(...items)
    }

    const normalized = transform(allItems, feed.category, feed.name)

    let added = 0
    for (const article of normalized) {
      const key = article.title.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (!key || seen.has(key)) continue
      seen.add(key)
      newArticles.push(article)
      added++
    }
    console.log(`${added} new articles (${allItems.length} fetched)`)
  }

  // ── Enrich missing/bad images via OG scraping ─────────────────────────────
  // Includes articles with no image AND articles that got emoji/placeholder images
  const needsImage = newArticles.filter((a) => (!a.image || isBadImage(a.image)) && (a.url || a.link))
  if (needsImage.length > 0) {
    console.log(`\n🖼  Fetching OG images for ${needsImage.length} articles…`)
    // Batch in groups of 8 to avoid hammering servers
    for (let i = 0; i < needsImage.length; i += 8) {
      const batch = needsImage.slice(i, i + 8)
      await Promise.all(
        batch.map(async (article) => {
          const og = await fetchOgImage(article.url || article.link)
          if (og) {
            article.image = og
            article.images = [og]
          } else {
            // Clear bad placeholder so UI shows category fallback instead
            if (isBadImage(article.image)) {
              article.image = null
              article.images = []
            }
          }
        })
      )
      process.stdout.write(`.`)
    }
    console.log()
  }

  // ── Merge new articles on top of existing, newest-first ──────────────────
  const allArticles = [...newArticles, ...existingArticles]

  // Sort newest-first
  allArticles.sort((a, b) => {
    const da = new Date(b.pubDate || b.publishedAt || 0)
    const db = new Date(a.pubDate || a.publishedAt || 0)
    return da - db
  })

  // Keep up to 200 articles per category so the file doesn't grow unbounded
  const catCount = {}
  const trimmed = allArticles.filter(a => {
    const cat = a.feedCategory || 'unknown'
    catCount[cat] = (catCount[cat] || 0) + 1
    return catCount[cat] <= 200
  })

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(trimmed, null, 2))

  const catSummary = Object.entries(catCount).map(([c, n]) => `${c}:${Math.min(n,200)}`).join(', ')
  console.log(`\n✅ Wrote ${trimmed.length} articles → data/news.json`)
  console.log(`   (${catSummary})`)
}

main().catch((err) => {
  console.error('❌ fetchNews failed:', err)
  process.exit(1)
})

