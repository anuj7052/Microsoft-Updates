const { PrismaClient } = require('@prisma/client')
const RSS_FEEDS = [
  { url: 'https://devblogs.microsoft.com/landingpage/feed/', category: 'general', name: 'Microsoft Dev Blogs' },
  { url: 'https://azure.microsoft.com/en-us/blog/feed/', category: 'azure', name: 'Azure Blog' },
  { url: 'https://blogs.windows.com/feed/', category: 'windows', name: 'Windows Blog' },
  { url: 'https://www.microsoft.com/en-us/security/blog/feed/', category: 'security', name: 'Microsoft Security' },
  { url: 'https://devblogs.microsoft.com/microsoft365dev/feed/', category: 'office365', name: 'Microsoft 365 Dev' },
  { url: 'https://devblogs.microsoft.com/powerplatform/feed/', category: 'power-platform', name: 'Power Platform' },
  { url: 'https://blog.fabric.microsoft.com/en-us/blog/feed/', category: 'fabric', name: 'Microsoft Fabric' },
  { url: 'https://devblogs.microsoft.com/microsoft365dev/feed/', category: 'copilot', name: 'Copilot & AI' },
]

const prisma = new PrismaClient()

// Helper to generate slug
function makeSlug(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}

function parseXMLItems(xmlText) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xmlText)) !== null) {
    let itemXml = match[1]
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
    
    if (title) {
      items.push({ title, link, pubDate, description })
    }
  }
  return items
}

async function scrapeFeeds() {
  const items = []
  
  for (const feed of RSS_FEEDS) {
    console.log(`\nFetching ${feed.name}...`)
    try {
      const res = await fetch(feed.url)
      if (!res.ok) continue
      
      const xml = await res.text()
      const parsed = parseXMLItems(xml)
      
      parsed.forEach(item => {
          items.push({
             ...item,
             category: feed.category,
             sourceUrl: feed.url
          })
      })
      console.log(`Found ${parsed.length} recent articles for ${feed.name}.`)
    } catch(e) {
      console.error('Error fetching feed:', e.message)
    }
  }
  
  return items
}

async function insertItem(item) {
  const slug = makeSlug(item.title)
  const sourceUrl = item.link || `https://microsoftupdates.co.in/fallback/${slug}-${Date.now()}`
  
  const exists = await prisma.update.findFirst({
    where: { OR: [{ slug }, { sourceUrl }] }
  })
  
  if (exists) {
    process.stdout.write('.')
    return false
  }

  let riskLevel = 'SAFE'
  const titleLower = item.title.toLowerCase()
  if (titleLower.includes('fix') || titleLower.includes('warning') || titleLower.includes('issue') || titleLower.includes('security') || titleLower.includes('cve')) {
    riskLevel = 'CAUTION'
  }

  const cleanDesc = item.description.replace(/<[^>]+>/g, '')
  const shortDesc = cleanDesc.substring(0, 155).trim() + (cleanDesc.length > 155 ? '...' : '')

  try {
    await prisma.update.create({
      data: {
        title: item.title,
        category: item.category || 'general',
        description: cleanDesc,
        summaryEn: `Microsoft has published a past update: ${item.title}. This historical update is archived for your reference.`,
        keyChanges: [`Archived ${item.title}`],
        riskLevel,
        shouldInstall: 'This is a historical update spanning the past 2 years.',
        slug,
        metaTitle: item.title.substring(0, 60).trim(),
        metaDescription: shortDesc,
        sourceUrl,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        views: 0
      }
    })
    process.stdout.write('+')
    return true
  } catch (e) {
    return false
  }
}

async function main() {
  console.log("Starting backfill via main RSS Feeds...")
  
  const allItems = await scrapeFeeds()
  console.log(`\nFound a total of ${allItems.length} cross-platform articles. Inserting...`)
  
  let inserted = 0
  for (const item of allItems) {
      const added = await insertItem(item)
      if (added) inserted++
  }
  
  console.log(`\n\nDone! Successfully seeded database with ${inserted} new historic updates!`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
