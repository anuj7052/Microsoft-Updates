const { PrismaClient } = require('@prisma/client')
const cheerio = require('cheerio')

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

async function scrapePage(pageNum) {
  const url = `https://devblogs.microsoft.com/landingpage/page/${pageNum}/`
  console.log(`\nFetching ${url}...`)
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    })
    
    if (!res.ok) {
      console.log(`Failed to fetch page ${pageNum}: ${res.status}`)
      return []
    }
    
    const html = await res.text()
    const $ = cheerio.load(html)
    
    const items = []
    
    // Find article cards
    $('article').each((i, el) => {
      const titleEl = $(el).find('h2.entry-title a')
      const title = titleEl.text().trim()
      const link = titleEl.attr('href')
      
      const categoryEl = $(el).find('.entry-category')
      const categoryText = categoryEl.text().trim() || 'General'
      
      const dateEl = $(el).find('.entry-date')
      const dateText = dateEl.text().trim()
      
      const descEl = $(el).find('.entry-content p, .entry-summary p').first()
      const description = descEl.text().trim()
      
      if (title && link) {
        items.push({
          title,
          link,
          pubDate: dateText ? new Date(dateText) : new Date(),
          description: description || title,
          category: categoryText,
          source: 'Microsoft Dev Blogs',
          feedCategory: 'general'
        })
      }
    })
    
    return items
  } catch (err) {
    console.error(`Error scraping page ${pageNum}:`, err.message)
    return []
  }
}

async function insertItem(item) {
  const slug = makeSlug(item.title)
  const sourceUrl = item.link || `https://microsoftupdates.co.in/fallback/${slug}-${Date.now()}`
  
  // Check if exists
  const exists = await prisma.update.findFirst({
    where: { OR: [{ slug }, { sourceUrl }] }
  })
  
  if (exists) {
    process.stdout.write('.')
    return false
  }

  // Classify risk level
  let riskLevel = 'SAFE'
  const titleLower = item.title.toLowerCase()
  if (titleLower.includes('fix') || titleLower.includes('warning') || titleLower.includes('issue') || titleLower.includes('security') || titleLower.includes('cve')) {
    riskLevel = 'CAUTION'
  }

  const cleanDesc = item.description.replace(/<[^>]+>/g, '')
  const shortDesc = cleanDesc.substring(0, 155).trim() + (cleanDesc.length > 155 ? '...' : '')
  const metaTitle = item.title.substring(0, 60).trim()

  try {
    await prisma.update.create({
      data: {
        title: item.title,
        category: item.feedCategory || 'general',
        description: cleanDesc,
        summaryEn: `Microsoft has published a past update: ${item.title}. This historical update is archived for your reference.`,
        keyChanges: [
          `Archived ${item.title}`,
        ],
        riskLevel,
        shouldInstall: 'This is a historical update spanning the past 2 years.',
        slug,
        metaTitle,
        metaDescription: shortDesc,
        sourceUrl,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        views: 0
      }
    })
    process.stdout.write('+')
    return true
  } catch (e) {
    console.error(`\nFailed to insert ${slug}:`, e.message)
    return false
  }
}

async function main() {
  console.log("Starting 2-year history backfill scraper...")
  
  // Scrape up to 50 pages (approx 2 years depending on frequency)
  const MAX_PAGES = 50
  let totalInserted = 0
  
  for (let page = 1; page <= MAX_PAGES; page++) {
    const items = await scrapePage(page)
    if (items.length === 0) {
      console.log(`\nNo items found on page ${page}. Stopping.`)
      break
    }
    
    console.log(`Found ${items.length} items. Inserting...`)
    
    for (const item of items) {
      const inserted = await insertItem(item)
      if (inserted) totalInserted++
    }
    
    // Polite delay
    await new Promise(r => setTimeout(r, 1000))
  }
  
  console.log(`\n\nDone! Successfully backfilled ${totalInserted} historical updates.`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
