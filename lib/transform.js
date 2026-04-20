import { extractImage } from './extractImage.js'

/**
 * Normalise raw rss-parser items into the shape consumed by app/page.js.
 * Output matches the structure returned by fetchMicrosoftFeeds in lib/feeds.js.
 */
export function transform(items, category, sourceName) {
  return items.map((item) => ({
    title: item.title || '',
    link: item.link || item.guid || '',
    publishedAt: item.pubDate || item.isoDate || '',
    pubDate: item.pubDate || item.isoDate || '',
    feedCategory: category,
    source: sourceName || category,
    description: item.contentSnippet || stripHtml(item.content || item.description || ''),
    image: extractImage(item),
    images: extractImage(item) ? [extractImage(item)] : [],
    slug: slugify(item.title),
    url: item.link || item.guid || '',
  }))
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').substring(0, 300).trim()
}

function slugify(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}
