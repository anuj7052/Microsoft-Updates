// Proxy an external image and serve it with Content-Disposition: attachment
// so the browser downloads it instead of navigating away.
// This bypasses cross-origin restrictions that prevent <a download> from working.
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return new Response('Missing url parameter', { status: 400 })
  }

  let parsed
  try {
    parsed = new URL(imageUrl)
  } catch {
    return new Response('Invalid URL', { status: 400 })
  }

  // Only allow http/https — block everything else (file://, ftp://, etc.)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return new Response('Only http/https URLs are allowed', { status: 400 })
  }

  // SSRF protection — block private / loopback / link-local addresses
  const host = parsed.hostname.toLowerCase()
  const isPrivate =
    host === 'localhost' ||
    host === '0.0.0.0' ||
    /^127\./.test(host) ||        // 127.0.0.0/8
    /^10\./.test(host) ||          // 10.0.0.0/8
    /^192\.168\./.test(host) ||    // 192.168.0.0/16
    /^169\.254\./.test(host) ||    // 169.254.0.0/16  link-local
    /^172\.(1[6-9]|2[0-9]|3[01])\./.test(host) || // 172.16-31.0.0/12
    host === '::1' ||
    /^fc[0-9a-f]{2}:/i.test(host) || // fc00::/7 private IPv6
    /^fe80:/i.test(host)              // fe80::/10 link-local IPv6

  if (isPrivate) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MicrosoftUpdates-ImageProxy/1.0)',
        Accept: 'image/*,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      return new Response('Failed to fetch image', { status: 502 })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'

    // Only proxy actual images
    if (!contentType.startsWith('image/')) {
      return new Response('URL does not point to an image', { status: 400 })
    }

    const buffer = await res.arrayBuffer()
    const ext = contentType.split('/')[1]?.split(';')[0]?.replace('jpeg', 'jpg') || 'jpg'

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="linkedin-post-image.${ext}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new Response('Failed to fetch image', { status: 502 })
  }
}
