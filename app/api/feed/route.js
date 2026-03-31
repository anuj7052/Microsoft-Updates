const RSS_FEEDS = [
  {
    url: 'https://devblogs.microsoft.com/landingpage/feed/',
    category: 'general',
    name: 'Microsoft Dev Blogs',
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
    url: 'https://www.microsoft.com/en-us/security/blog/feed/',
    category: 'security',
    name: 'Microsoft Security',
  },
  {
    url: 'https://devblogs.microsoft.com/microsoft365dev/feed/',
    category: 'office365',
    name: 'Microsoft 365 Dev',
  },
  {
    url: 'https://devblogs.microsoft.com/powerplatform/feed/',
    category: 'power-platform',
    name: 'Power Platform',
  },
]

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
    // Strip HTML tags for clean text
    const description = rawDesc.replace(/<[^>]+>/g, '').substring(0, 300).trim()
    const categoryMatch = itemXml.match(/<category[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/s)
    const category = categoryMatch ? categoryMatch[1].trim() : ''

    if (title) {
      items.push({ title, link, pubDate, description, category })
    }
  }
  return items
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const cat = searchParams.get('category')

  try {
    const feedsToFetch = cat
      ? RSS_FEEDS.filter((f) => f.category === cat)
      : RSS_FEEDS

    const results = await Promise.allSettled(
      feedsToFetch.map(async (feed) => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 8000)
        try {
          const res = await fetch(feed.url, {
            signal: controller.signal,
            next: { revalidate: 1800 },
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
      .slice(0, 50)

    return Response.json(
      { articles: allItems, updated: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    return Response.json(
      { articles: [], error: 'Failed to fetch feeds', updated: new Date().toISOString() },
      { status: 500 }
    )
  }
}
