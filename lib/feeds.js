import fs from 'fs'
import path from 'path'

const RSS_FEEDS = [
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
]

/**
 * Extract all image URLs from an RSS item's XML.
 * Checks enclosure, media:content, media:thumbnail, and img tags in HTML content.
 */
function extractImagesFromItem(itemXml) {
  const imgs = []

  // enclosure (image type)
  const encRx = /<enclosure[^>]+url=["']([^"']+)["'][^>]*/gi
  let m
  while ((m = encRx.exec(itemXml)) !== null) {
    const url = m[1]
    if (url.match(/\.(jpg|jpeg|png|webp|gif)/i) || itemXml.slice(m.index, m.index + 200).includes('image')) {
      imgs.push(url)
    }
  }

  // media:content
  const mcRx = /<media:content[^>]+url=["']([^"']+)["']/gi
  while ((m = mcRx.exec(itemXml)) !== null) imgs.push(m[1])

  // media:thumbnail
  const mtRx = /<media:thumbnail[^>]+url=["']([^"']+)["']/gi
  while ((m = mtRx.exec(itemXml)) !== null) imgs.push(m[1])

  // img tags inside content:encoded or description HTML
  const imgRx = /<img[^>]+src=["']([^"']+)["']/gi
  while ((m = imgRx.exec(itemXml)) !== null) {
    const src = m[1]
    if (
      src.startsWith('http') &&
      !src.includes('emoji') &&
      !src.includes('avatar') &&
      !src.includes('gravatar') &&
      !src.includes('pixel') &&
      src.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)
    ) {
      imgs.push(src)
    }
  }

  // deduplicate and return only http(s) URLs
  return [...new Set(imgs)].filter((u) => u.startsWith('http'))
}

function parseXMLItems(xmlText) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXml = match[1]
    const getTag = (tag) => {
      const r = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?<\\/${tag}>`, 's')
      const m = itemXml.match(r)
      return m ? m[1].trim() : ''
    }

    const title = getTag('title')
    const link = getTag('link')
    const pubDate = getTag('pubDate')
    const rawDesc = getTag('description') || getTag('content:encoded') || ''
    const description = rawDesc.replace(/<[^>]+>/g, '').substring(0, 300).trim()
    const categoryMatch = itemXml.match(/<category[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/s)
    const category = categoryMatch ? categoryMatch[1].trim() : ''
    const images = extractImagesFromItem(itemXml)

    if (title) {
      items.push({ title, link, pubDate, description, category, images })
    }
  }
  return items
}

export async function fetchMicrosoftFeeds(categoryFilter = null) {
  const feedsToFetch = categoryFilter
    ? RSS_FEEDS.filter((f) => f.category === categoryFilter)
    : RSS_FEEDS

  const results = await Promise.allSettled(
    feedsToFetch.map(async (feed) => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)
      try {
        const res = await fetch(feed.url, {
          signal: controller.signal,
          next: { revalidate: 900 },
          headers: { 'User-Agent': 'MicrosoftUpdatesBot/1.0' },
        })
        clearTimeout(timeout)
        if (!res.ok) return []
        const xml = await res.text()
        const items = parseXMLItems(xml).slice(0, 10)
        return items.map((item) => ({
          ...item,
          source: feed.name,
          feedCategory: feed.category,
          images: item.images || [],
        }))
      } catch {
        clearTimeout(timeout)
        return []
      }
    })
  )

  const allItems = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))

  // Deduplicate by normalized title
  const seen = new Set()
  const unique = allItems.filter((item) => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return unique.slice(0, 80)
}

/**
 * Fetch the OG image URL from an article page.
 * Cached by Next.js fetch for 24h so it's only slow once per URL.
 */
async function fetchOgImage(url) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'MicrosoftUpdatesBot/1.0' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const html = await res.text()
    // Try og:image in both attribute orders
    const m =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/)
    return m ? m[1] : null
  } catch {
    return null
  }
}

export async function getUpdatesFromDb(categoryFilter = null, take = 80) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'live-updates.json')
    if (!fs.existsSync(filePath)) return []
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    let items = data.items || []
    if (categoryFilter && categoryFilter !== 'general') {
      items = items.filter((i) => i.category === categoryFilter)
    }
    return items.slice(0, take).map((item) => ({
      title: item.title,
      description: item.summary,
      feedCategory: item.category,
      pubDate: item.date,
      slug: item.slug,
      source: 'Microsoft Updates',
      sourceUrl: item.sourceUrl,
      images: item.image ? [item.image] : [],
    }))
  } catch (e) {
    console.error('getUpdatesFromDb error:', e.message)
    return []
  }
}

export { RSS_FEEDS, fetchOgImage }
