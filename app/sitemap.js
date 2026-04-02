import fs from 'fs'
import path from 'path'
import { newsArticles, categories } from '../data/news'

export default function sitemap() {
  const baseUrl = 'https://microsoftupdates.co.in'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/live`, lastModified: new Date(), changeFrequency: 'always', priority: 0.95 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const articlePages = newsArticles.map((article) => ({
    url: `${baseUrl}/${article.category}/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Markdown-based updates from content/updates/
  const markdownPages = []
  const contentDir = path.join(process.cwd(), 'content', 'updates')
  if (fs.existsSync(contentDir)) {
    const cats = fs.readdirSync(contentDir)
    for (const cat of cats) {
      const catDir = path.join(contentDir, cat)
      try {
        if (!fs.statSync(catDir).isDirectory()) continue
        const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.md'))
        for (const file of files) {
          const slug = file.replace('.md', '')
          let lastMod = new Date()
          try {
            const raw = fs.readFileSync(path.join(catDir, file), 'utf8')
            const dateMatch = raw.match(/publishedAt:\s*"?([^"\n]+)"?/)
            if (dateMatch) lastMod = new Date(dateMatch[1])
          } catch {}

          markdownPages.push({
            url: `${baseUrl}/updates/${cat}/${slug}`,
            lastModified: lastMod,
            changeFrequency: 'monthly',
            priority: 0.75,
          })
        }
      } catch {}
    }
  }

  // Live update pages from data/live-updates.json
  const livePages = []
  try {
    const livePath = path.join(process.cwd(), 'data', 'live-updates.json')
    if (fs.existsSync(livePath)) {
      const data = JSON.parse(fs.readFileSync(livePath, 'utf8'))
      const items = data.items || []
      for (const item of items) {
        if (!item.slug) continue
        livePages.push({
          url: `${baseUrl}/live/${item.slug}`,
          lastModified: item.date ? new Date(item.date) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  } catch {}

  return [...staticPages, ...categoryPages, ...articlePages, ...markdownPages, ...livePages]
}
