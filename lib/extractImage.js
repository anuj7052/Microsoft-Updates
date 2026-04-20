/**
 * Domains / patterns that produce generic/useless images — skip them.
 * The OG scraper will get a real image instead.
 */
const BAD_IMAGE_PATTERNS = [
  's.w.org/images/core/emoji',   // WordPress emoji icons (72x72 px)
  'uhf.microsoft.com',           // Generic Microsoft brand logo
  'gravatar.com',                // User avatars
  'wp-includes/images',          // WordPress system images
  '/emoji/',                     // Any emoji path
  'pixel.wp.com',                // WordPress tracking pixel
  'pixel.rsstag.com',            // RSS tracking pixel
  'feeds.feedburner.com',        // Feedburner pixel
]

function isBadImage(url) {
  if (!url) return true
  return BAD_IMAGE_PATTERNS.some((p) => url.includes(p))
}

/**
 * Extract the best available image URL from an RSS parser item.
 * Tries multiple fields in order of preference.
 */
export function extractImage(item) {
  // 1. enclosure (e.g. podcast-style feeds)
  if (item.enclosure?.url && !isBadImage(item.enclosure.url)) return item.enclosure.url

  // 2. media:content (namespaced field rss-parser exposes as object)
  const mc = item['media:content'] || item['media:group']?.['media:content']
  if (mc) {
    const url = Array.isArray(mc) ? mc[0]?.$ ?.url : mc.$?.url || mc.url
    if (url && !isBadImage(url)) return url
  }

  // 3. media:thumbnail
  const mt = item['media:thumbnail']
  if (mt) {
    const url = mt.$?.url || mt.url || (Array.isArray(mt) ? mt[0]?.$?.url : null)
    if (url && !isBadImage(url)) return url
  }

  // 4. img tags inside content:encoded — skip emoji/tiny/bad images, take first real one
  const html = item['content:encoded'] || item.content || item.description || ''
  if (html) {
    const imgRx = /<img[^>]+src=["']([^"']+)["']/g
    let m
    while ((m = imgRx.exec(html)) !== null) {
      const src = m[1]
      if (src.startsWith('http') && !isBadImage(src)) return src
    }
  }

  return null
}

