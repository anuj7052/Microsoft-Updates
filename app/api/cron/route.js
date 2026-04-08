import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { fetchMicrosoftFeeds } from '../../../lib/feeds'
import { generateArticleContent } from '../../../lib/ai-writer'

export const maxDuration = 300 // Set max execution time to 5 mins

function makeSlug(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  
  // Authorize: Vercel cron sends Bearer <CRON_SECRET>, manual trigger uses ?secret=PIPELINE_SECRET
  const cronSecret = process.env.CRON_SECRET
  const pipelineSecret = process.env.PIPELINE_SECRET
  const querySecret = request.nextUrl.searchParams.get('secret')

  const isValidCron = cronSecret && authHeader === `Bearer ${cronSecret}`
  const isValidManual = pipelineSecret && querySecret === pipelineSecret

  if (!isValidCron && !isValidManual) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items = await fetchMicrosoftFeeds()
    const saved = []
    const skipped = []
    
    for (const item of items) {
      const slug = makeSlug(item.title)
      const sourceUrl = item.link || `https://microsoftupdates.co.in/fallback/${slug}`
      
      // Skip if already exists
      const exists = await prisma.update.findFirst({
        where: { OR: [{ slug }, { sourceUrl }] }
      })
      if (exists) { skipped.push(slug); continue }

      // Generate AI Content (SEO-optimised article)
      const aiContent = await generateArticleContent(item.title, item.description, item.feedCategory)

      const catLabel = {
        azure: 'Azure', windows: 'Windows', security: 'Security',
        office365: 'Microsoft 365', 'power-platform': 'Power Platform',
        copilot: 'Copilot & AI', fabric: 'Microsoft Fabric'
      }[item.feedCategory] || 'Microsoft'

      const data = {
        title: item.title,
        category: item.feedCategory || 'general',
        description: aiContent?.summaryEn || item.description || item.title,
        summaryEn: aiContent?.summaryEn || `${item.title} — Microsoft has released a new ${catLabel} update. ${item.description || ''} Stay current with the latest Microsoft changes to ensure your systems are secure and up to date.`,
        summaryHi: aiContent?.summaryHi || `माइक्रोसॉफ्ट ने ${catLabel} के लिए एक नया अपडेट जारी किया है: ${item.title}। यह अपडेट सुरक्षा और प्रदर्शन में सुधार करता है। अपने सिस्टम को अद्यतन रखें।`,
        keyChanges: aiContent?.keyChanges || [
          `New ${catLabel} update release: ${item.title}`,
          `Performance and reliability improvements for ${catLabel}`,
          `Security enhancements and bug fixes included`,
          `Review Microsoft's official release notes for full details`,
        ],
        riskLevel: aiContent?.riskLevel || 'SAFE',
        shouldInstall: aiContent?.shouldInstall || 'Test in a staging environment first, then deploy to production systems.',
        slug,
        metaTitle: aiContent?.metaTitle || item.title.substring(0, 60),
        metaDescription: aiContent?.metaDescription || `${item.title} — Latest ${catLabel} update from Microsoft. ${(item.description || '').substring(0, 100)}`.substring(0, 155),
        sourceUrl,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        views: 0,
      }

      await prisma.update.create({ data })
      saved.push(slug)
    }
    
    console.log(`CRON: Saved ${saved.length} new articles, skipped ${skipped.length} existing`)
    return NextResponse.json({ success: true, count: saved.length, saved, skipped: skipped.length })
  } catch (error) {
    console.error('CRON_ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
