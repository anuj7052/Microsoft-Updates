import fs from 'fs'
import path from 'path'

/**
 * Load and optionally filter articles from data/news.json.
 * Returns articles already normalised with both `image` and `images` fields
 * so they work with every existing page component.
 */
export function getNewsForCategory(category = null, limit = 50) {
  try {
    const p = path.join(process.cwd(), 'data', 'news.json')
    if (!fs.existsSync(p)) return []
    let items = JSON.parse(fs.readFileSync(p, 'utf8'))
    if (category) {
      items = items.filter(
        (a) => a.feedCategory === category || a.category === category
      )
    }
    return items.slice(0, limit)
  } catch {
    return []
  }
}

/**
 * Look up a single article by its slug field.
 */
export function getNewsBySlug(slug) {
  try {
    const p = path.join(process.cwd(), 'data', 'news.json')
    if (!fs.existsSync(p)) return null
    const items = JSON.parse(fs.readFileSync(p, 'utf8'))
    return items.find((a) => a.slug === slug) || null
  } catch {
    return null
  }
}

/**
 * Full-text search across title, description, feedCategory.
 */
export function searchNews(query, limit = 15) {
  try {
    const p = path.join(process.cwd(), 'data', 'news.json')
    if (!fs.existsSync(p)) return []
    const q = query.toLowerCase()
    return JSON.parse(fs.readFileSync(p, 'utf8'))
      .filter(
        (a) =>
          (a.title || '').toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q) ||
          (a.feedCategory || '').toLowerCase().includes(q)
      )
      .slice(0, limit)
  } catch {
    return []
  }
}
