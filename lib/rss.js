import Parser from 'rss-parser'

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['media:group', 'media:group'],
      ['content:encoded', 'content:encoded'],
    ],
  },
  timeout: 10000,
  headers: { 'User-Agent': 'MicrosoftUpdatesBot/1.0' },
})

/**
 * Fetch and parse an RSS feed URL. Returns an array of raw rss-parser items.
 * Returns an empty array on error so callers can safely spread results.
 */
export async function fetchFeed(url) {
  try {
    const feed = await parser.parseURL(url)
    return feed.items || []
  } catch (err) {
    console.warn(`[rss] Failed to fetch ${url}: ${err.message}`)
    return []
  }
}
