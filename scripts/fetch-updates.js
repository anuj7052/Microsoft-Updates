#!/usr/bin/env node
'use strict'

/**
 * Microsoft Updates — Automated Content Pipeline
 * Runs every 30 min via GitHub Actions.
 * Fetches RSS feeds → detects new items → generates AI articles → saves markdown → updates tracker JSON.
 * No database required.
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const { XMLParser } = require('fast-xml-parser')

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..')
const TRACKER_PATH = path.join(ROOT, 'data', 'updates.json')
const CONTENT_DIR = path.join(ROOT, 'content', 'updates')

// ─── RSS Feeds ────────────────────────────────────────────────────────────────

const FEEDS = [
  { url: 'https://blogs.windows.com/feed/', category: 'windows' },
  { url: 'https://azure.microsoft.com/en-us/blog/feed/', category: 'azure' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=microsoft_365blog', category: 'office365' },
  { url: 'https://msrc.microsoft.com/blog/feed', category: 'security' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=MicrosoftCopilotBlog', category: 'copilot' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=PowerAutomate', category: 'power-platform' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=MicrosoftFabricBlog', category: 'fabric' },
]

const MAX_RETRIES = 3
const DELAY_MS = 3000
const MAX_TRACKER_SIZE = 1000 // Keep last N processed items

// ─── Utilities ────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function stripHtml(str) {
  return String(str || '')
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function generateSlug(title, kbNumber) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')

  return kbNumber ? `${kbNumber.toLowerCase()}-${base}` : base
}

function extractKBNumber(text) {
  const match = String(text).match(/\bKB\d{6,7}\b/i)
  return match ? match[0].toUpperCase() : null
}

function classifyRisk(title, description) {
  const text = `${title} ${description}`.toLowerCase()
  if (/known issue|workaround|regression|unexpected behavior|does not work|not working/.test(text)) return 'CAUTION'
  if (/critical bug|crash|corruption|data loss|breaks(?! ground)|broken(?![ -]ground)/.test(text)) return 'AVOID'
  return 'SAFE'
}

function toISODate(str) {
  try {
    const d = new Date(str)
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

function toDateStr(isoStr) {
  return isoStr.split('T')[0]
}

// ─── HTTP Fetch with redirect follow + retry ──────────────────────────────────

function fetchUrl(url, retriesLeft = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const attempt = (targetUrl, retries) => {
      const mod = targetUrl.startsWith('https') ? https : http

      const req = mod.get(
        targetUrl,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MicrosoftUpdatesBot/1.0; +https://microsoftupdates.co.in)',
            Accept: 'application/rss+xml, application/xml, text/xml, */*',
          },
          timeout: 20000,
        },
        (res) => {
          // Follow redirects
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirectUrl = res.headers.location.startsWith('http')
              ? res.headers.location
              : new URL(res.headers.location, targetUrl).toString()
            res.resume()
            return attempt(redirectUrl, retries)
          }

          if (res.statusCode !== 200) {
            res.resume()
            return reject(new Error(`HTTP ${res.statusCode} for ${targetUrl}`))
          }

          let data = ''
          res.setEncoding('utf8')
          res.on('data', (chunk) => (data += chunk))
          res.on('end', () => resolve(data))
          res.on('error', reject)
        }
      )

      req.on('error', (err) => {
        if (retries > 0) {
          setTimeout(() => attempt(targetUrl, retries - 1), 2000)
        } else {
          reject(err)
        }
      })

      req.on('timeout', () => {
        req.destroy()
        if (retries > 0) {
          setTimeout(() => attempt(targetUrl, retries - 1), 2000)
        } else {
          reject(new Error(`Timeout: ${targetUrl}`))
        }
      })
    }

    attempt(url, retriesLeft)
  })
}

// ─── RSS Parser ───────────────────────────────────────────────────────────────

function parseRSS(xml) {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseTagValue: false,
      cdataTagname: '__cdata',
    })

    const result = parser.parse(xml)
    const channel = result?.rss?.channel || result?.feed

    if (!channel) return []

    // Support both RSS 2.0 (item) and Atom (entry)
    const rawItems = channel.item || channel.entry || []
    const items = Array.isArray(rawItems) ? rawItems : [rawItems]

    return items
      .map((item) => {
        const title = stripHtml(item.title?.['#text'] || item.title?.['__cdata'] || item.title || '')
        const description = stripHtml(
          item.description?.['#text'] ||
            item.description?.['__cdata'] ||
            item.description ||
            item['content:encoded']?.['__cdata'] ||
            item.summary?.['#text'] ||
            item.summary ||
            ''
        ).substring(0, 800)

        const url =
          (typeof item.link === 'string' ? item.link : null) ||
          item.link?.['@_href'] ||
          item.link?.['#text'] ||
          item.id?.['#text'] ||
          (typeof item.id === 'string' ? item.id : '') ||
          ''

        const guid =
          item.guid?.['#text'] ||
          (typeof item.guid === 'string' ? item.guid : null) ||
          item.id?.['#text'] ||
          (typeof item.id === 'string' ? item.id : null) ||
          url

        const pubDate = item.pubDate || item.published || item.updated || ''

        return { title, description, url: url.trim(), guid: String(guid).trim(), pubDate }
      })
      .filter((item) => item.title && item.url)
  } catch (err) {
    console.error('RSS parse error:', err.message)
    return []
  }
}

// ─── Fallback content (no AI) ─────────────────────────────────────────────────

function generateFallback(item, category, kbNumber) {
  const riskLevel = classifyRisk(item.title, item.description)
  const slug = generateSlug(item.title, kbNumber)
  const desc = item.description || `Microsoft has released a new ${category} update.`

  return {
    slug,
    seoTitle: item.title.substring(0, 65),
    metaTitle: item.title.substring(0, 65),
    metaDescription: desc.substring(0, 155),
    summaryEn: desc.substring(0, 500),
    summaryHi: `Microsoft ने ${category} के लिए एक नया अपडेट जारी किया है। विवरण के लिए Microsoft की आधिकारिक वेबसाइट देखें।`,
    keyChanges: [
      'Visit official Microsoft link for full patch notes',
      'Check system compatibility before installing',
      'Consider testing in a staging environment first',
    ],
    shouldInstall:
      riskLevel === 'SAFE'
        ? 'This update appears safe to install. Test in a non-production environment before wide deployment.'
        : riskLevel === 'CAUTION'
        ? 'Install with caution. Review known issues on your specific configuration first.'
        : 'Hold off — reported issues may impact your system. Wait for a patched version.',
    beginnerExplanation: `Microsoft released a new update for ${category.replace('-', ' ')}. It may include bug fixes, security patches, or new features. Check the official link for details.`,
    riskLevel,
  }
}

// ─── AI content generation ────────────────────────────────────────────────────

async function generateContent(item, category, kbNumber) {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallback(item, category, kbNumber)
  }

  try {
    // Lazy-load openai to avoid crash if not installed
    const { OpenAI } = require('openai')
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const prompt = `You are an expert Microsoft technology journalist. Analyze this update and respond ONLY with valid JSON, no markdown.

Title: ${item.title}
Category: ${category}
Description: ${item.description.substring(0, 700)}${kbNumber ? `\nKB Number: ${kbNumber}` : ''}

Return exactly this JSON structure:
{
  "seoTitle": "SEO-optimized title under 65 characters",
  "metaTitle": "Meta title under 60 characters",
  "metaDescription": "Compelling meta description under 155 characters",
  "summaryEn": "2-3 clear sentences in English for IT professionals",
  "summaryHi": "2-3 वाक्य हिंदी में भारतीय IT पेशेवरों के लिए",
  "keyChanges": ["specific improvement 1", "specific fix 2", "specific feature 3"],
  "shouldInstall": "Direct 2-sentence recommendation on deploying this update",
  "beginnerExplanation": "1-2 simple sentences for non-technical users",
  "riskLevel": "SAFE or CAUTION or AVOID"
}

Risk classification:
- SAFE: security fixes, bug fixes, performance improvements, new features
- CAUTION: known issues, compatibility concerns, workarounds needed
- AVOID: data loss risk, critical crashes, widespread breakage`

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 900,
    })

    const data = JSON.parse(response.choices[0].message.content)
    const slug = generateSlug(data.seoTitle || item.title, kbNumber)

    return {
      slug,
      seoTitle: data.seoTitle || item.title.substring(0, 65),
      metaTitle: data.metaTitle || item.title.substring(0, 60),
      metaDescription: data.metaDescription || item.description.substring(0, 155),
      summaryEn: data.summaryEn || item.description.substring(0, 500),
      summaryHi: data.summaryHi || '',
      keyChanges: Array.isArray(data.keyChanges) ? data.keyChanges : [],
      shouldInstall: data.shouldInstall || '',
      beginnerExplanation: data.beginnerExplanation || '',
      riskLevel: ['SAFE', 'CAUTION', 'AVOID'].includes(data.riskLevel) ? data.riskLevel : classifyRisk(item.title, item.description),
    }
  } catch (err) {
    console.warn(`  ⚠ AI failed (${err.message}), using fallback`)
    return generateFallback(item, category, kbNumber)
  }
}

// ─── Save markdown article ────────────────────────────────────────────────────

function saveMarkdown(content, item, category, kbNumber) {
  const dir = path.join(CONTENT_DIR, category)
  fs.mkdirSync(dir, { recursive: true })

  const filePath = path.join(dir, `${content.slug}.md`)

  // Never overwrite existing articles
  if (fs.existsSync(filePath)) {
    console.log(`  ⏭  Exists: ${content.slug}`)
    return content.slug
  }

  const riskEmoji = { SAFE: '✅', CAUTION: '⚠️', AVOID: '❌' }[content.riskLevel] || '✅'
  const pubDate = toDateStr(toISODate(item.pubDate))
  const keyChangesList = (content.keyChanges || []).map((c) => `- ${c}`).join('\n')

  // Escape quotes in frontmatter values to prevent YAML breaking
  const esc = (str) => String(str || '').replace(/"/g, '\\"').replace(/\n/g, ' ')

  const markdown = `---
title: "${esc(content.seoTitle)}"
metaTitle: "${esc(content.metaTitle)}"
metaDescription: "${esc(content.metaDescription)}"
date: "${pubDate}"
category: "${category}"
slug: "${content.slug}"${kbNumber ? `\nkbNumber: "${kbNumber}"` : ''}
riskLevel: "${content.riskLevel}"
sourceUrl: "${item.url}"
publishedAt: "${toISODate(item.pubDate)}"
---

## Summary

${content.summaryEn}

## Summary (हिंदी में)

${content.summaryHi}

## Key Changes

${keyChangesList}

## Should You Install?

${content.shouldInstall}

## Simple Explanation

${content.beginnerExplanation}

## Risk Level: ${content.riskLevel} ${riskEmoji}

${
  content.riskLevel === 'SAFE'
    ? 'This update is generally safe to deploy. Always run a quick test in a staging environment first.'
    : content.riskLevel === 'CAUTION'
    ? 'Proceed carefully. Review the known issues section and test on a few machines before wide deployment.'
    : 'Hold off on this update. Wait until Microsoft releases a fix for the reported issues before installing.'
}

## Official Microsoft Source

For full patch notes, affected versions, and workarounds:

[Read the full article on Microsoft →](${item.url})
`

  fs.writeFileSync(filePath, markdown, 'utf8')
  console.log(`  ✓ Saved: content/updates/${category}/${content.slug}.md`)
  return content.slug
}

// ─── Tracker ──────────────────────────────────────────────────────────────────

function loadTracker() {
  if (!fs.existsSync(TRACKER_PATH)) {
    return { lastFetchedAt: null, processed: [] }
  }
  try {
    return JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf8'))
  } catch {
    return { lastFetchedAt: null, processed: [] }
  }
}

function saveTracker(tracker) {
  fs.mkdirSync(path.dirname(TRACKER_PATH), { recursive: true })
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2), 'utf8')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 Pipeline started — ${new Date().toISOString()}`)

  const tracker = loadTracker()
  const processedGuids = new Set(tracker.processed.map((p) => p.guid))
  const processedUrls = new Set(tracker.processed.map((p) => p.url))
  const lastFetchedAt = tracker.lastFetchedAt ? new Date(tracker.lastFetchedAt) : null

  const newItems = []

  // ── Fetch all feeds ──────────────────────────────────────────────────────────
  for (const feed of FEEDS) {
    console.log(`\n📡 ${feed.category.toUpperCase()}: ${feed.url}`)

    try {
      const xml = await fetchUrl(feed.url)
      const items = parseRSS(xml)
      console.log(`   ${items.length} items in feed`)

      for (const item of items) {
        // Skip items older than last fetch
        if (lastFetchedAt && item.pubDate) {
          const itemDate = new Date(item.pubDate)
          if (!isNaN(itemDate.getTime()) && itemDate <= lastFetchedAt) continue
        }

        // Dedup by guid and url
        if (processedGuids.has(item.guid) || processedUrls.has(item.url)) continue

        // Mark seen immediately to prevent cross-feed dups
        processedGuids.add(item.guid)
        processedUrls.add(item.url)

        newItems.push({ ...item, category: feed.category })
      }
    } catch (err) {
      console.error(`   ✗ Failed: ${err.message}`)
    }
  }

  console.log(`\n📊 ${newItems.length} new items to process`)

  let newCount = 0

  // ── Process each new item ────────────────────────────────────────────────────
  for (let i = 0; i < newItems.length; i++) {
    const item = newItems[i]
    console.log(`\n[${i + 1}/${newItems.length}] ${item.title.substring(0, 70)}`)

    const kbNumber = extractKBNumber(`${item.title} ${item.description}`)

    try {
      const content = await generateContent(item, item.category, kbNumber)
      const slug = saveMarkdown(content, item, item.category, kbNumber)

      tracker.processed.push({
        guid: item.guid,
        url: item.url,
        slug,
        category: item.category,
        riskLevel: content.riskLevel,
        savedAt: new Date().toISOString(),
      })

      newCount++

      // Rate-limit AI calls to avoid 429 errors
      if (process.env.OPENAI_API_KEY && i < newItems.length - 1) {
        await sleep(DELAY_MS)
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`)
    }
  }

  // ── Update tracker ───────────────────────────────────────────────────────────
  tracker.lastFetchedAt = new Date().toISOString()

  // Trim to prevent unbounded growth
  if (tracker.processed.length > MAX_TRACKER_SIZE) {
    tracker.processed = tracker.processed.slice(-MAX_TRACKER_SIZE)
  }

  saveTracker(tracker)

  console.log(`\n✅ Done — ${newCount} new articles saved\n`)
  process.exit(0)
}

main().catch((err) => {
  console.error('\n❌ Pipeline failed:', err)
  process.exit(1)
})
