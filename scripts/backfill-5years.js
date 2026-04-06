const { PrismaClient } = require('@prisma/client')
const cheerio = require('cheerio')

const prisma = new PrismaClient()

function makeSlug(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}

async function scrapeWindowsBlog(pageNum) {
  const url = `https://blogs.windows.com/page/${pageNum}/`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) return []
    const html = await res.text()
    const $ = cheerio.load(html)
    const items = []
    
    // Windows blog uses <article> or .post
    $('article').each((i, el) => {
      const title = $(el).find('h3 a, h2 a').text().trim() || $(el).find('h3, h2').text().trim()
      const link = $(el).find('h3 a, h2 a').attr('href') || ''
      let dateString = $(el).find('.c-meta__date, time').text().trim()
      let desc = $(el).find('.c-paragraph, p').first().text().trim()
      
      if (title && link) {
        items.push({
          title,
          link,
          pubDate: dateString ? new Date(dateString) : new Date(Date.now() - pageNum * 86400000),
          description: desc || title,
          category: 'windows'
        })
      }
    })
    return items
  } catch (e) {
    return []
  }
}

async function insertItem(item) {
  const slug = makeSlug(item.title)
  const sourceUrl = item.link || `https://microsoftupdates.co.in/fallback/${slug}-${Date.now()}`
  
  const exists = await prisma.update.findFirst({ where: { OR: [{ slug }, { sourceUrl }] } })
  if (exists) return false

  let riskLevel = 'SAFE'
  if (item.title.toLowerCase().includes('security') || item.title.toLowerCase().includes('cve')) riskLevel = 'CAUTION'
  const cleanDesc = item.description.replace(/<[^>]+>/g, '').substring(0, 155)

  try {
    await prisma.update.create({
      data: {
        title: item.title,
        category: item.category || 'general',
        description: cleanDesc,
        summaryEn: `Archived update: ${item.title}.`,
        keyChanges: [`Source: ${item.title}`],
        riskLevel,
        shouldInstall: 'Historical reference only.',
        slug,
        metaTitle: item.title.substring(0, 60),
        metaDescription: cleanDesc,
        sourceUrl,
        publishedAt: isNaN(new Date(item.pubDate).getTime()) ? new Date() : new Date(item.pubDate),
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
  console.log("Starting 5-Year High-Depth Crawler...")
  // Crawl Windows deeply (e.g. 50 pages)
  let total = 0
  for (let i = 1; i <= 50; i++) {
    process.stdout.write(`\nCrawling Page ${i} `)
    const items = await scrapeWindowsBlog(i)
    if (items.length === 0) break
    for (const item of items) {
      const ok = await insertItem(item)
      if (ok) total++
    }
  }
  console.log(`\n\nInserted ${total} deeply archived articles.`)
}

main().catch(console.error).finally(()=> prisma.$disconnect())
