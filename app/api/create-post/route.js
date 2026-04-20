import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import OpenAI from 'openai'

/* ── Azure OpenAI client ─────────────────────────────────────────────────── */
function getAI() {
  if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
    return new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
      defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || '2025-04-01-preview' },
      defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
    })
  }
  if (process.env.OPENAI_API_KEY) {
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return null
}

/* ── Fetch + parse URL ───────────────────────────────────────────────────── */
async function scrapeUrl(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PowertoolBot/1.0)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(12000),
  })
  if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`)
  const html = await res.text()
  const $ = cheerio.load(html)

  // Title
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('title').text() ||
    ''

  // Description
  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    ''

  // Thumbnail
  const thumbnail =
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    $('meta[name="twitter:image:src"]').attr('content') ||
    ''

  // Resolve relative thumbnail URL
  const resolvedThumbnail = thumbnail
    ? new URL(thumbnail, url).href
    : ''

  // Main text — grab <article> or <main> body, strip tags
  const bodyEl = $('article').first().length ? $('article').first() : $('main').first()
  bodyEl.find('script,style,nav,header,footer,aside,.ad,.advertisement').remove()
  const bodyText = bodyEl.text().replace(/\s+/g, ' ').trim().substring(0, 3000)

  const fallbackText = $('body').find('p').slice(0, 10).map((_, el) => $(el).text()).get().join(' ').substring(0, 3000)

  return {
    title: title.trim(),
    description: description.trim(),
    thumbnail: resolvedThumbnail,
    bodyText: bodyText || fallbackText,
  }
}

/* ── Generate LinkedIn post via AI ──────────────────────────────────────── */
async function generatePost(scraped, url) {
  const ai = getAI()
  const model = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini'

  const articleUrl = url || ''
  const prompt = `You are a professional LinkedIn content creator specialising in Microsoft technology.

Based on the article below, write a compelling LinkedIn post following this EXACT structure:

1. BODY — 2-4 short paragraphs with a strong hook opening line, key insights, and a closing call-to-action question. Use relevant emojis naturally throughout (1-2 per paragraph). Use line breaks between paragraphs for readability. Between 150-250 words.

2. LINK LINE — One blank line after the body, then exactly this line:
🔗 Link: ${articleUrl}

3. HASHTAGS LINE — One blank line after the link, then 6-8 relevant hashtags on a single line (e.g. #Microsoft #Azure #AI #CloudComputing).

The final post must look exactly like this format:
[hook line with emoji]

[paragraph with emojis]

[paragraph with emojis]

[call-to-action question]

🔗 Link: ${articleUrl}

#Tag1 #Tag2 #Tag3 #Tag4 #Tag5 #Tag6

Article title: ${scraped.title}
Article description: ${scraped.description}
Article body excerpt: ${scraped.bodyText.substring(0, 1500)}

Return a JSON object with exactly these fields:
{
  "post": "the full LinkedIn post text formatted exactly as described above",
  "headline": "a short punchy headline for the post card (max 80 chars)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`

  if (!ai) {
    // Fallback without AI
    const hashtags = '#Microsoft #Tech #MicrosoftUpdates #Windows #Azure'
    const postLines = [
      `📌 ${scraped.title}`,
      '',
      scraped.description,
      '',
      `🔗 Link: ${articleUrl}`,
      '',
      hashtags,
    ].join('\n')
    return {
      post: postLines,
      headline: scraped.title.substring(0, 80),
      tags: ['Microsoft', 'Tech', 'MicrosoftUpdates'],
    }
  }

  const response = await ai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_completion_tokens: 900,
  })

  return JSON.parse(response.choices[0].message.content)
}

/* ── Handler ─────────────────────────────────────────────────────────────── */
export async function POST(request) {
  try {
    const body = await request.json()
    const { url, articleData } = body

    let scraped

    if (articleData) {
      // Direct article data supplied — skip full scraping
      scraped = {
        title:       String(articleData.title       || '').trim(),
        description: String(articleData.description || '').trim(),
        thumbnail:   String(articleData.image       || ''),
        bodyText:    String(articleData.content     || articleData.description || '').substring(0, 3000),
      }
      // If no image was supplied but we have an external source URL, try a quick og:image fetch
      if (!scraped.thumbnail && articleData.articleUrl) {
        try {
          const srcUrl = new URL(articleData.articleUrl)
          if (!srcUrl.hostname.includes('microsoftupdates.co.in')) {
            const ogRes = await fetch(articleData.articleUrl, {
              headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PowertoolBot/1.0)', Accept: 'text/html' },
              signal: AbortSignal.timeout(6000),
            })
            if (ogRes.ok) {
              const html = await ogRes.text()
              const $ = cheerio.load(html)
              const og = $('meta[property="og:image"]').attr('content')
                      || $('meta[name="twitter:image"]').attr('content') || ''
              if (og) scraped.thumbnail = new URL(og, articleData.articleUrl).href
            }
          }
        } catch {} // silent — image is optional
      }
    } else {
      if (!url || !URL.canParse(url)) {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
      }
      scraped = await scrapeUrl(url)
    }

    const sourceUrl = url || articleData?.articleUrl || ''
    const aiResult = await generatePost(scraped, sourceUrl)

    return NextResponse.json({
      title:     scraped.title,
      thumbnail: scraped.thumbnail,
      post:      aiResult.post,
      headline:  aiResult.headline,
      tags:      aiResult.tags,
      sourceUrl,
    })
  } catch (err) {
    console.error('create-post error:', err)
    return NextResponse.json({ error: err.message || 'Failed to generate post' }, { status: 500 })
  }
}
