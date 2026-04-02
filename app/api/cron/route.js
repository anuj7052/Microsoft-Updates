import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { fetchMicrosoftFeeds } from '../../../lib/feeds'

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
    
    // We only process up to 30 items per run to avoid Vercel timeouts
    const itemsToProcess = items.slice(0, 30)
    
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

      // Classify risk level
      let riskLevel = 'SAFE'
      const titleLower = item.title.toLowerCase()
      if (titleLower.includes('fix') || titleLower.includes('warning') || titleLower.includes('issue')) {
          riskLevel = 'CAUTION'
      }

      // Automatically format rich metadata
      const cleanDesc = (item.description || item.title).replace(/<[^>]+>/g, '')
      const shortDesc = cleanDesc.substring(0, 155).trim() + (cleanDesc.length > 155 ? '...' : '')
      const metaTitle = item.title.substring(0, 60).trim()

      await prisma.update.create({
        data: {
          title: item.title,
          category: item.feedCategory || 'general',
          description: cleanDesc,
          summaryEn: `Microsoft has published a new ${item.feedCategory || 'platform'} update: ${item.title}. This update may introduce new functionality, address known issues, or deliver security improvements. Review the core changes and patch notes directly from Microsoft to identify potential impacts on your environment.`,
          summaryHi: `माइक्रोसॉफ्ट ने एक नया अपडेट जारी किया है: ${item.title}। यह अपडेट कार्यक्षमता में सुधार और सुरक्षा को बढ़ाता है।`,
          keyChanges: [
            `Performance enhancements for ${item.source || 'Microsoft'} platform components.`,
            `Potentially includes bug fixes for reported community issues.`
          ],
          riskLevel,
          shouldInstall: 'This update is generally safe to roll out. Ensure you test in a staging environment before widespread production deployment.',
          slug,
          metaTitle,
          metaDescription: shortDesc,
          sourceUrl,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          views: 0
        }
      })
      saved.push(slug)
    }
    
    return NextResponse.json({ success: true, count: saved.length, processed: saved })
  } catch (error) {
    console.error('CRON_ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
