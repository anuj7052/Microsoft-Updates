import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'

export const revalidate = 1800

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function loadLiveItems() {
  try {
    const p = join(process.cwd(), 'data', 'live-updates.json')
    if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf8')).items || []
  } catch {}
  return []
}

function loadMarkdownArticles() {
  const articles = []
  const baseDir = join(process.cwd(), 'content', 'updates')
  try {
    const cats = readdirSync(baseDir, { withFileTypes: true }).filter(d => d.isDirectory())
    for (const cat of cats) {
      const files = readdirSync(join(baseDir, cat.name)).filter(f => f.endsWith('.md'))
      for (const file of files) {
        try {
          const raw = readFileSync(join(baseDir, cat.name, file), 'utf8')
          const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
          if (!fmMatch) continue
          const fm = {}
          fmMatch[1].split('\n').forEach(line => {
            const m = line.match(/^(\w+):\s*"?(.+?)"?\s*$/)
            if (m) fm[m[1]] = m[2]
          })
          articles.push({
            title: fm.title || file.replace('.md', ''),
            slug: fm.slug || file.replace('.md', ''),
            category: fm.category || cat.name,
            date: fm.date || fm.publishedAt,
            description: fm.metaDescription || '',
            sourceUrl: fm.sourceUrl || '',
          })
        } catch {}
      }
    }
  } catch {}
  return articles
}

export async function GET() {
  const liveItems = loadLiveItems()
  const mdArticles = loadMarkdownArticles()

  // Merge: live items + markdown articles, dedupe by slug
  const slugSet = new Set()
  const allItems = []

  for (const item of liveItems) {
    const slug = item.slug
    if (slug && !slugSet.has(slug)) {
      slugSet.add(slug)
      allItems.push({
        title: item.title,
        link: `https://microsoftupdates.co.in/live/${slug}`,
        description: item.summary || item.description || '',
        pubDate: item.date ? new Date(item.date).toUTCString() : new Date().toUTCString(),
        category: item.category || 'general',
        sourceUrl: item.sourceUrl || '',
      })
    }
  }

  for (const a of mdArticles) {
    if (a.slug && !slugSet.has(a.slug)) {
      slugSet.add(a.slug)
      allItems.push({
        title: a.title,
        link: `https://microsoftupdates.co.in/updates/${a.category}/${a.slug}`,
        description: a.description || '',
        pubDate: a.date ? new Date(a.date).toUTCString() : new Date().toUTCString(),
        category: a.category,
        sourceUrl: a.sourceUrl || '',
      })
    }
  }

  // Sort by date descending
  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))

  const items = allItems.slice(0, 50).map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
    </item>`).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Latest Microsoft Updates &amp; News</title>
    <link>https://microsoftupdates.co.in</link>
    <description>Independent coverage of Microsoft updates — Windows, Azure, Microsoft 365, Copilot, Security &amp; more.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://microsoftupdates.co.in/api/feed/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://microsoftupdates.co.in/icon.png</url>
      <title>Latest Microsoft Updates &amp; News</title>
      <link>https://microsoftupdates.co.in</link>
    </image>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    },
  })
}
