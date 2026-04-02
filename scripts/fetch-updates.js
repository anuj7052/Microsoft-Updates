#!/usr/bin/env node
'use strict'

/**
 * Latest Microsoft Updates & News — Automated Content Pipeline
 * Runs every 30 min via GitHub Actions.
 *
 * TWO outputs:
 *  1. data/live-updates.json  — latest 60 items for real-time homepage display
 *  2. data/history.json       — 1-year dedup tracker (seen GUIDs)
 *  3. content/updates/*.md    — full AI articles only for "major" updates
 *
 * No database required.
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const { XMLParser } = require('fast-xml-parser')

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..')
const TRACKER_PATH = path.join(ROOT, 'data', 'updates.json')       // legacy compat
const LIVE_PATH = path.join(ROOT, 'data', 'live-updates.json')
const HISTORY_PATH = path.join(ROOT, 'data', 'history.json')
const CONTENT_DIR = path.join(ROOT, 'content', 'updates')

// How many live items to keep in the JSON file
const MAX_LIVE_ITEMS = 60
// How many history GUIDs to retain (covers ~1 year at current volume)
const MAX_HISTORY_GUIDS = 5000

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
const MAX_TRACKER_SIZE = 1000 // Keep last N processed items (legacy)

// Keywords that mark an update as "major" → triggers full AI article generation
const MAJOR_KEYWORDS = [
  'security update', 'patch tuesday', 'critical', 'vulnerability', 'cve-',
  'zero-day', '0-day', 'cumulative update', 'feature update', 'kb', 'windows 11',
  'windows 12', 'azure openai', 'breaking change', 'general availability', 'ga release',
  'major release', 'deprecated', 'end of life', 'eol',
]

function isMajorUpdate(title, description) {
  const text = `${title} ${description}`.toLowerCase()
  return MAJOR_KEYWORDS.some((kw) => text.includes(kw))
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extractFirstImg(html) {
  const m = String(html || '').match(/<img[^>]+src=["']([^"']+)["']/i)
  return m ? m[1] : null
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

        // Extract image from media fields or inline HTML
        const rawHtml =
          item['content:encoded']?.['__cdata'] ||
          item.description?.['__cdata'] ||
          item.description?.['#text'] ||
          ''
        const image =
          item['media:content']?.['@_url'] ||
          item['media:thumbnail']?.['@_url'] ||
          (item['enclosure'] && item['enclosure']['@_url']?.startsWith('http') ? item['enclosure']['@_url'] : null) ||
          extractFirstImg(rawHtml) ||
          null

        return { title, description, url: url.trim(), guid: String(guid).trim(), pubDate, image }
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
  const hasAzure = process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT
  const hasOpenAI = process.env.OPENAI_API_KEY

  if (!hasAzure && !hasOpenAI) {
    return generateFallback(item, category, kbNumber)
  }

  try {
    const { OpenAI, AzureOpenAI } = require('openai')
    let client
    let model

    if (hasAzure) {
      client = new AzureOpenAI({
        apiKey: process.env.AZURE_OPENAI_KEY,
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini',
        apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2026-03-03',
      })
      model = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini'
    } else {
      client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      model = 'gpt-4o-mini'
    }

    const prompt = `You are an expert Microsoft technology journalist writing for an independent blog. Analyze this update and respond ONLY with valid JSON, no markdown.

Title: ${item.title}
Category: ${category}
Description: ${item.description.substring(0, 700)}${kbNumber ? `\nKB Number: ${kbNumber}` : ''}

Return exactly this JSON structure:
{
  "seoTitle": "Compelling SEO-optimized title under 65 characters",
  "metaTitle": "Meta title under 60 characters",
  "metaDescription": "Compelling meta description under 155 characters that makes people click",
  "summaryEn": "3-4 clear sentences in English summarizing what changed, why it matters, and who should care",
  "summaryHi": "3-4 वाक्य हिंदी में भारतीय IT पेशेवरों के लिए — सरल भाषा में",
  "keyChanges": ["specific improvement 1", "specific fix 2", "specific feature 3", "specific benefit 4", "specific impact 5"],
  "detailedAnalysis": "A 200-300 word detailed analysis paragraph covering: what exactly changed, technical details, who is affected, migration steps if any, comparison with previous version, and real-world impact. Write in a clear, informative tone.",
  "impactAssessment": "Who is affected and how — 2-3 sentences covering enterprise users, developers, end users as applicable",
  "shouldInstall": "Direct 2-sentence recommendation on deploying this update with specific actions",
  "beginnerExplanation": "2-3 simple sentences for non-technical users explaining what this means in everyday language",
  "riskLevel": "SAFE or CAUTION or AVOID",
  "relatedTopics": ["related topic 1", "related topic 2", "related topic 3"]
}

Risk classification:
- SAFE: security fixes, bug fixes, performance improvements, new features, GA releases
- CAUTION: known issues mentioned, compatibility concerns, preview/beta features
- AVOID: data loss risk, critical crashes, widespread breakage reported`

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1800,
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
      detailedAnalysis: data.detailedAnalysis || '',
      impactAssessment: data.impactAssessment || '',
      shouldInstall: data.shouldInstall || '',
      beginnerExplanation: data.beginnerExplanation || '',
      riskLevel: ['SAFE', 'CAUTION', 'AVOID'].includes(data.riskLevel) ? data.riskLevel : classifyRisk(item.title, item.description),
      relatedTopics: Array.isArray(data.relatedTopics) ? data.relatedTopics : [],
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
image: "${item.image || ''}"
publishedAt: "${toISODate(item.pubDate)}"
relatedTopics: ${JSON.stringify(content.relatedTopics || [])}
---

## Summary

${content.summaryEn}

## Summary (हिंदी में)

${content.summaryHi}

## Key Changes

${keyChangesList}

## Detailed Analysis

${content.detailedAnalysis || `Microsoft has released this ${category.replace('-', ' ')} update with several improvements and changes. The update addresses various aspects of the platform including performance enhancements, bug fixes, and feature additions. IT administrators should review the official release notes linked below for complete technical specifications and deployment guidance.`}

## Who Is Affected?

${content.impactAssessment || `This update affects ${category.replace('-', ' ')} users and administrators. Organizations using Microsoft ${category.replace('-', ' ')} services should review the changes and plan their deployment accordingly.`}

## Should You Install?

${content.shouldInstall}

## Simple Explanation

${content.beginnerExplanation}

## Risk Level: ${content.riskLevel} ${riskEmoji}

${
  content.riskLevel === 'SAFE'
    ? 'This update is generally safe to deploy. Always test in a staging environment before production rollout.'
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

// ─── Data store helpers ───────────────────────────────────────────────────────

function loadJSON(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')) } catch { return fallback }
}

function saveJSON(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

// Legacy tracker — kept for backward compatibility
function loadTracker() {
  return loadJSON(TRACKER_PATH, { lastFetchedAt: null, processed: [] })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 Pipeline started — ${new Date().toISOString()}`)

  // ── Load state ───────────────────────────────────────────────────────────────
  const tracker = loadTracker()
  const history = loadJSON(HISTORY_PATH, { lastFetchedAt: null, seenGuids: [], totalArticles: 0 })

  const seenGuids = new Set(history.seenGuids)
  const processedUrls = new Set(tracker.processed.map((p) => p.url))

  // Use the most recent lastFetchedAt from either source
  const lastRaw = [tracker.lastFetchedAt, history.lastFetchedAt]
    .filter(Boolean)
    .sort()
    .pop()
  const lastFetchedAt = lastRaw ? new Date(lastRaw) : null

  // ── Accumulate all feed items for live-updates.json ──────────────────────────
  const allFeedItems = []   // everything from this run (for live display)
  const newItems = []       // only truly new items (for article generation)

  for (const feed of FEEDS) {
    console.log(`\n📡 ${feed.category.toUpperCase()}: ${feed.url}`)

    try {
      const xml = await fetchUrl(feed.url)
      const items = parseRSS(xml)
      console.log(`   ${items.length} items in feed`)

      for (const item of items) {
        // Enrich with category for live display — include all recent items
        const enriched = {
          title: item.title,
          description: item.description,
          url: item.url,
          guid: item.guid,
          pubDate: toISODate(item.pubDate),
          category: feed.category,
          image: item.image || null,
        }
        allFeedItems.push(enriched)

        // For article generation: only genuinely new items
        if (lastFetchedAt && item.pubDate) {
          const itemDate = new Date(item.pubDate)
          if (!isNaN(itemDate.getTime()) && itemDate <= lastFetchedAt) continue
        }
        if (seenGuids.has(item.guid) || processedUrls.has(item.url)) continue

        seenGuids.add(item.guid)
        processedUrls.add(item.url)
        newItems.push({ ...item, category: feed.category })
      }
    } catch (err) {
      console.error(`   ✗ Failed: ${err.message}`)
    }
  }

  // ── Save live-updates.json (all recent items across all feeds) ───────────────
  // Sort by date descending, keep latest MAX_LIVE_ITEMS
  const liveItems = allFeedItems
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, MAX_LIVE_ITEMS)
    .map((item) => ({
      title: item.title,
      summary: item.description.substring(0, 220),
      date: item.pubDate,
      category: item.category,
      sourceUrl: item.url,
      // internal article page
      slug: generateSlug(item.title, extractKBNumber(`${item.title} ${item.description}`)),
      image: item.image || null,
    }))

  saveJSON(LIVE_PATH, { updatedAt: new Date().toISOString(), items: liveItems })
  console.log(`\n💾 live-updates.json updated — ${liveItems.length} items`)

  // ── Generate articles for ALL new updates ───────────────────────────────────
  console.log(`\n📊 ${newItems.length} new items — generating articles for all`)

  let newArticleCount = 0

  for (let i = 0; i < newItems.length; i++) {
    const item = newItems[i]
    console.log(`\n[${i + 1}/${newItems.length}] ${item.title.substring(0, 70)}`)

    const kbNumber = extractKBNumber(`${item.title} ${item.description}`)

    try {
      const content = await generateContent(item, item.category, kbNumber)
      saveMarkdown(content, item, item.category, kbNumber)

      tracker.processed.push({
        guid: item.guid,
        url: item.url,
        slug: content.slug,
        category: item.category,
        riskLevel: content.riskLevel,
        savedAt: new Date().toISOString(),
      })

      newArticleCount++

      if ((process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY) && i < newItems.length - 1) {
        await sleep(DELAY_MS)
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`)
    }
  }

  // ── Update trackers ──────────────────────────────────────────────────────────
  const now = new Date().toISOString()

  // Trim to prevent unbounded growth
  if (tracker.processed.length > MAX_TRACKER_SIZE) {
    tracker.processed = tracker.processed.slice(-MAX_TRACKER_SIZE)
  }
  tracker.lastFetchedAt = now
  saveJSON(TRACKER_PATH, tracker)

  // History: keep last MAX_HISTORY_GUIDS entries (covers ~1 year)
  const guidArray = [...seenGuids]
  history.seenGuids = guidArray.slice(-MAX_HISTORY_GUIDS)
  history.lastFetchedAt = now
  history.totalArticles = (history.totalArticles || 0) + newArticleCount
  saveJSON(HISTORY_PATH, history)

  console.log(`\n✅ Done — ${newArticleCount} new articles | ${liveItems.length} live items\n`)
  process.exit(0)
}

main().catch((err) => {
  console.error('\n❌ Pipeline failed:', err)
  process.exit(1)
})
