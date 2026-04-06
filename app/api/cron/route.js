import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { fetchMicrosoftFeeds } from '../../../lib/feeds'
import { generateArticleContent } from '../../../lib/ai-writer'

export const maxDuration = 300 // Set max execution time to 5 mins

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  
  // Authorize the request (Vercel cron uses Bearer <CRON_SECRET>, fallback to query param for manual trigger)
  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` && 
    request.nextUrl.searchParams.get('secret') !== process.env.PIPELINE_SECRET
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const items = await fetchMicrosoftFeeds()
    const saved = []
    
    // We only process up to 10 items per run to avoid Vercel timeouts with AI generation
    const itemsToProcess = items.slice(0, 10)
    
    for (const item of itemsToProcess) {
      // Create a URL-friendly slug
      const slug = String(item.title)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .substring(0, 80)
        .replace(/-$/, '')
        
      // Ensure the source URL length fits within our database bounds
      const sourceUrl = item.link || `https://microsoftupdates.co.in/fallback/${slug}`
      
      // Check if this article already exists in the database
      const exists = await prisma.update.findFirst({
          where: { OR: [{ slug }, { sourceUrl }] }
      })
      
      if (exists) continue;

      // Generate AI Content
      const aiContent = await generateArticleContent(item.title, item.description, item.feedCategory)

      // Fallback to template if AI writer is disabled or fails
      const data = {
        title: item.title,
        category: item.feedCategory || 'general',
        description: aiContent?.summaryEn || item.description || item.title,
        summaryEn: aiContent?.summaryEn || `Microsoft has published a new ${item.feedCategory || 'platform'} update: ${item.title}. Review core changes directly from Microsoft.`,
        summaryHi: aiContent?.summaryHi || `माइक्रोसॉफ्ट ने एक नया अपडेट जारी किया है: ${item.title}। यह अपडेट कार्यक्षमता और सुरक्षा को और ऊपर लाता है।`,
        keyChanges: aiContent?.keyChanges || [
          `Performance improvements for ${item.source || 'Microsoft'}.`,
          `Security fixes for reported bugs.`
        ],
        riskLevel: aiContent?.riskLevel || 'SAFE',
        shouldInstall: aiContent?.shouldInstall || 'Generally safe to roll out after staging tests.',
        slug,
        metaTitle: aiContent?.metaTitle || item.title.substring(0, 60),
        metaDescription: aiContent?.metaDescription || (item.description || item.title).substring(0, 155),
        sourceUrl,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        views: 0
      }

      await prisma.update.create({ data })
      saved.push(slug)
    }
    
    return NextResponse.json({ success: true, count: saved.length, processed: saved })
  } catch (error) {
    console.error('CRON_ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
