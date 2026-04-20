import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getNewsBySlug } from '../../../lib/newsData'
import LinkedInButton from '../../../components/LinkedInButton'

export const revalidate = 1800

function loadLiveItems() {
  try {
    const p = join(process.cwd(), 'data', 'live-updates.json')
    if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf8')).items || []
  } catch {}
  return []
}

export async function generateStaticParams() {
  const liveItems = loadLiveItems()
  // Also include slugs from news.json so detail pages are pre-rendered
  try {
    const p = join(process.cwd(), 'data', 'news.json')
    if (existsSync(p)) {
      const newsItems = JSON.parse(readFileSync(p, 'utf8'))
      const newsSlugs = newsItems.filter((i) => i.slug).map((i) => ({ slug: i.slug }))
      const liveSlugs = liveItems.filter((i) => i.slug).map((i) => ({ slug: i.slug }))
      // Deduplicate
      const seen = new Set()
      return [...liveSlugs, ...newsSlugs].filter(({ slug }) => {
        if (seen.has(slug)) return false
        seen.add(slug)
        return true
      })
    }
  } catch {}
  return liveItems.filter((i) => i.slug).map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const liveItems = loadLiveItems()
  let item = liveItems.find((i) => i.slug === slug) || getNewsBySlug(slug)

  if (!item) {
    return { title: 'Update Not Found | Microsoft Updates' }
  }

  const cat = item.category?.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Microsoft'
  const ogImage = `https://microsoftupdates.co.in/api/og?title=${encodeURIComponent(item.title.substring(0, 100))}&category=${encodeURIComponent(item.category || 'general')}`
  return {
    title: `${item.title} | Microsoft Updates`,
    description: item.summary || `Latest ${cat} update from Microsoft.`,
    openGraph: {
      title: item.title,
      description: item.summary || '',
      url: `https://microsoftupdates.co.in/live/${slug}`,
      siteName: 'Latest Microsoft Updates & News',
      type: 'article',
      publishedTime: item.date,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: item.title, description: item.summary || '', images: [ogImage] },
    alternates: { canonical: `/live/${slug}` },
    robots: { index: true, follow: true },
  }
}

const categoryColors = {
  windows: 'text-[#34D399]',
  azure: 'text-[#A855F7]',
  security: 'text-[#22D3EE]',
  office365: 'text-[#FB923C]',
  'power-platform': 'text-[#FBBF24]',
  copilot: 'text-[#22D3EE]',
  fabric: 'text-[#C084FC]',
  general: 'text-[#C084FC]',
}

const categoryBg = {
  windows: 'rgba(52,211,153,0.12)',
  azure: 'rgba(168,85,247,0.12)',
  security: 'rgba(34,211,238,0.12)',
  office365: 'rgba(251,146,60,0.12)',
  'power-platform': 'rgba(251,191,36,0.12)',
  copilot: 'rgba(34,211,238,0.12)',
  fabric: 'rgba(192,132,252,0.12)',
  general: 'rgba(192,132,252,0.12)',
}

const categoryLabels = {
  windows: 'Windows',
  azure: 'Azure',
  security: 'Security',
  office365: 'Office 365',
  'power-platform': 'Power Platform',
  copilot: 'Copilot / AI',
  fabric: 'Microsoft Fabric',
  general: 'General',
}

function extractKeyPoints(text = '') {
  if (!text) return []
  const clean = text.replace(/<[^>]+>/g, ' ')
  const sentences = clean.split(/[.!?]\s+/).map(s => s.trim()).filter(s => s.length > 30 && s.length < 300)
  return sentences.slice(0, 5)
}

function estimateReadTime(text = '') {
  const words = text.split(/\s+/).length
  return Math.max(2, Math.ceil(words / 200))
}

// Generate full article body from RSS summary
function generateArticleBody(item) {
  const title = item.title || ''
  const summary = item.summary || item.description || ''
  const category = categoryLabels[item.category] || item.category || 'Microsoft'
  const date = item.date || item.pubDate || ''

  let formattedDate = ''
  try {
    formattedDate = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {}

  // Clean up the summary text
  const cleanSummary = summary.replace(/<[^>]+>/g, ' ').trim()

  // Build article sections
  const sections = []

  // Section 1: Overview
  sections.push({
    heading: 'Overview',
    icon: '📋',
    content: cleanSummary || `Microsoft has released a new ${category} update. This article covers the key details and what you need to know about this announcement.`
  })

  // Section 2: What's New
  const whatsNew = generateWhatsNew(title, category, cleanSummary)
  sections.push({
    heading: "What's New",
    icon: '🆕',
    content: whatsNew
  })

  // Section 3: Who's Affected
  sections.push({
    heading: "Who's Affected",
    icon: '👥',
    content: generateWhosAffected(category)
  })

  // Section 4: What You Should Do
  sections.push({
    heading: 'What You Should Do',
    icon: '✅',
    content: generateActionItems(category)
  })

  // Section 5: Background Context
  sections.push({
    heading: 'Background & Context',
    icon: '📖',
    content: generateContext(category, title)
  })

  return { sections, formattedDate, cleanSummary }
}

function generateWhatsNew(title, category, summary) {
  const lowerTitle = title.toLowerCase()
  
  if (lowerTitle.includes('security') || lowerTitle.includes('vulnerability') || lowerTitle.includes('patch') || lowerTitle.includes('cve')) {
    return `This security update addresses important vulnerabilities and improvements in the ${category} ecosystem. Microsoft regularly releases security patches to protect enterprise and consumer environments from emerging threats. ${summary ? `Specifically, ${summary.substring(0, 200)}` : ''} Organizations should review the full security bulletin to understand the scope of changes and plan their deployment accordingly.`
  }
  
  if (lowerTitle.includes('update') || lowerTitle.includes('release') || lowerTitle.includes('new')) {
    return `Microsoft has announced significant updates to its ${category} platform. ${summary ? summary.substring(0, 250) : `These changes bring new capabilities and improvements designed to enhance productivity, security, and user experience across the ${category} ecosystem.`} This release continues Microsoft's commitment to delivering regular updates and improvements to its product lineup.`
  }

  if (lowerTitle.includes('preview') || lowerTitle.includes('beta') || lowerTitle.includes('insider')) {
    return `A new preview build has been announced for the ${category} platform, giving early adopters and IT professionals a chance to test upcoming features before general availability. ${summary ? summary.substring(0, 200) : ''} Preview releases help Microsoft gather feedback and ensure quality before wider deployment.`
  }

  return `${summary || `Microsoft has made an important announcement regarding its ${category} platform. This update brings notable changes that IT professionals and end users should be aware of.`} These changes reflect Microsoft's ongoing investment in the ${category} ecosystem and their commitment to continuous improvement.`
}

function generateWhosAffected(category) {
  const affectedMap = {
    windows: 'This update affects Windows users across consumer and enterprise environments. IT administrators managing Windows devices through Intune, SCCM, or Group Policy should review compatibility requirements. Home users will typically receive this update automatically through Windows Update.',
    azure: 'This update primarily impacts Azure cloud subscribers, DevOps teams, and cloud architects. Organizations running production workloads on Azure should review the changes for any impact on service level agreements, pricing, or feature availability.',
    security: 'This security bulletin affects all Microsoft product users but particularly organizations running enterprise deployments. Security teams, system administrators, and compliance officers should prioritize reviewing vulnerability severity ratings and applying patches based on their risk assessment.',
    office365: 'Organizations using Microsoft 365 (formerly Office 365) will be affected by this change. This includes users of Outlook, Teams, SharePoint, OneDrive, and other productivity applications. Administrators managing Microsoft 365 tenants should review the admin center for deployment details.',
    'power-platform': 'Power Platform users including Power BI, Power Apps, Power Automate, and Power Virtual Agents users are affected. Citizen developers and IT departments leveraging low-code solutions should review how these changes impact their existing applications and workflows.',
    copilot: 'Users of Microsoft Copilot and AI-powered features across Microsoft 365, Edge, Windows, and Azure are affected. Organizations evaluating or deploying AI capabilities should review the updates for new features, policy controls, and data handling information.',
    fabric: 'Data engineers, analysts, and organizations using Microsoft Fabric for data analytics and AI workloads are affected. Teams using Data Factory, Synapse, Power BI, or Real-Time Analytics within Fabric should review changes for impact on existing pipelines.',
    general: 'This update may affect users across multiple Microsoft products and services. IT professionals and system administrators should review the specifics to determine the impact on their environment.',
  }
  return affectedMap[category] || affectedMap.general
}

function generateActionItems(category) {
  const actionMap = {
    windows: '1. Check Windows Update for the latest patches and updates.\n2. Review the release notes for any known issues before deploying.\n3. Test updates in a non-production environment first if managing enterprise deployments.\n4. Ensure your backup strategy is current before applying major updates.\n5. Monitor the Microsoft Tech Community for user feedback on potential issues.',
    azure: '1. Review the Azure Updates page for detailed change documentation.\n2. Check Azure Service Health for any planned maintenance windows.\n3. Test affected services in a dev/staging environment before production.\n4. Review pricing changes if any are announced.\n5. Update infrastructure-as-code templates to align with new features or deprecations.',
    security: '1. Review CVSS scores and severity ratings for each vulnerability addressed.\n2. Apply critical and high-severity patches within your organization\'s SLA.\n3. Use Microsoft Defender vulnerability management to track patch status.\n4. Test patches in a controlled environment before broad deployment.\n5. Document remediation actions for compliance and audit purposes.',
    office365: '1. Check the Microsoft 365 Admin Center for rollout timelines.\n2. Communicate changes to end users if the UI or workflows are affected.\n3. Update training materials and internal documentation.\n4. Test impacted workflows, especially custom integrations and add-ins.\n5. Review message center posts for additional context and timelines.',
    'power-platform': '1. Review the Power Platform Admin Center for change notifications.\n2. Test existing Power Apps and Power Automate flows for compatibility.\n3. Update solution packages if using ALM for Power Platform.\n4. Review data loss prevention (DLP) policies if new connectors are involved.\n5. Check maker documentation for any API changes.',
    copilot: '1. Review Copilot admin controls and data governance settings.\n2. Test new AI features in a pilot group before organization-wide rollout.\n3. Update responsible AI policies and usage guidelines.\n4. Monitor usage analytics through the Microsoft 365 Admin Center.\n5. Gather user feedback on AI feature accuracy and usefulness.',
    fabric: '1. Review changes to Data Factory pipelines and Synapse workspaces.\n2. Validate existing data models and refresh schedules.\n3. Test real-time analytics queries for performance changes.\n4. Update lakehouse and warehouse configurations if needed.\n5. Monitor capacity consumption metrics after the update.',
    general: '1. Review the official Microsoft documentation for full details.\n2. Assess impact on your specific environment and use cases.\n3. Test changes in a non-production environment before deploying.\n4. Keep an eye on Microsoft community forums for user feedback.\n5. Bookmark the official announcement for reference.',
  }
  return actionMap[category] || actionMap.general
}

function generateContext(category, title) {
  return `Microsoft regularly releases updates, patches, and feature announcements across its product ecosystem. This ${category} announcement is part of Microsoft's ongoing commitment to improving security, performance, and user experience across all platforms. For context, Microsoft typically follows a monthly update cycle (Patch Tuesday) for security updates, while feature updates and announcements may come at any time through preview channels and official blog posts. This independent coverage summarizes official Microsoft announcements to help IT professionals stay informed without needing to monitor multiple sources.`
}

export default async function LiveArticlePage({ params }) {
  const { slug } = await params

  // Load live-updates.json once — used for fallback AND related articles
  const liveItems = loadLiveItems()

  // 1. Try live-updates.json (primary static source)
  let item = liveItems.find((i) => i.slug === slug) || null

  // 2. Fallback: try news.json (RSS pipeline)
  if (!item) {
    item = getNewsBySlug(slug)
    if (item) {
      // Normalise to the shape the render code expects
      item = {
        title: item.title,
        summary: item.description || '',
        description: item.description || '',
        date: item.pubDate || item.publishedAt || '',
        category: item.feedCategory || 'general',
        sourceUrl: item.url || item.link || '',
        slug: item.slug,
        image: item.image || (item.images && item.images[0]) || null,
      }
    }
  }

  if (!item) notFound()

  const colorTxt = categoryColors[item.category] || categoryColors.general
  const colorBg = categoryBg[item.category] || categoryBg.general
  const label = categoryLabels[item.category] || item.category

  // Generate the full article body
  const { sections, formattedDate, cleanSummary } = generateArticleBody(item)
  const keyPoints = extractKeyPoints(cleanSummary)
  const allText = sections.map(s => s.content).join(' ')
  const readMin = estimateReadTime(allText)

  // JSON-LD schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.summary || `Independent coverage of: ${item.title}`,
    datePublished: item.date,
    dateModified: item.date,
    author: { '@type': 'Organization', name: 'Latest Microsoft Updates & News', url: 'https://microsoftupdates.co.in' },
    publisher: { '@type': 'Organization', name: 'Latest Microsoft Updates & News', url: 'https://microsoftupdates.co.in', logo: { '@type': 'ImageObject', url: 'https://microsoftupdates.co.in/icon.png' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://microsoftupdates.co.in/live/${slug}` },
    isAccessibleForFree: true,
    ...(item.sourceUrl ? { sameAs: item.sourceUrl } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-dm mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#C084FC] transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <Link href="/live" className="hover:text-[#C084FC] transition-colors">Live Updates</Link>
          <span className="opacity-40">/</span>
          <span className="text-[var(--text-secondary)] line-clamp-1">{item.title.substring(0, 55)}{item.title.length > 55 ? '…' : ''}</span>
        </nav>

        <article>
          {/* Hero Image */}
          <div className="w-full aspect-[2/1] overflow-hidden rounded-2xl mb-6 relative" style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(34,211,238,0.07))' }}>
            <img 
              src={item.image || `/api/og?title=${encodeURIComponent((item.title || '').substring(0, 100))}&category=${item.category || 'general'}`} 
              alt={item.title} 
              className="w-full h-full object-cover" 
              loading="eager" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ms-card)] via-transparent to-transparent opacity-80" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm ${colorTxt}`} style={{ background: colorBg, border: `1px solid ${colorBg.replace('0.12', '0.3')}` }}>{label}</span>
              <span className="flex items-center gap-1 text-[#F87171] text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm" style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)' }}>
                <span className="w-1.5 h-1.5 bg-[#F87171] rounded-full pulse-dot"></span>LIVE
              </span>
            </div>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-[var(--text-muted)] font-dm">
              {formattedDate && <span>{formattedDate}</span>}
              <span className="opacity-40">·</span>
              <span className="reading-chip inline-flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {readMin} min read
              </span>
              <span className="opacity-40">·</span>
              <span className="ai-badge">INDEPENDENT COVERAGE</span>
            </div>

            <h1 className="font-syne font-extrabold text-2xl md:text-3xl lg:text-[2.2rem] text-[var(--text-primary)] leading-snug tracking-tight mb-5">
              {item.title}
            </h1>

            {cleanSummary && (
              <p className="text-[1.05rem] text-[var(--text-secondary)] font-dm leading-relaxed border-l-2 border-[#A855F7] pl-4">
                {cleanSummary}
              </p>
            )}
          </div>

          <hr className="grad-divider" />

          {/* Key Points */}
          {keyPoints.length > 0 && (
            <div className="rounded-2xl p-6 mb-8" style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.06),rgba(34,211,238,0.03))', border: '1px solid rgba(168,85,247,0.18)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📌</span>
                <h2 className="font-syne font-bold text-sm text-[var(--text-primary)] uppercase tracking-widest">Key Points</h2>
              </div>
              <ul className="space-y-3">
                {keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] font-dm leading-relaxed">
                    <span className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-[#C084FC]" style={{ background: 'rgba(168,85,247,0.12)' }}>{i + 1}</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Article Sections */}
          {sections.map((section, i) => (
            <div key={i} className="rounded-2xl p-6 mb-6 bg-ms-card shadow-sm border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{section.icon}</span>
                <h2 className="font-syne font-bold text-sm text-[var(--text-primary)] uppercase tracking-widest">{section.heading}</h2>
              </div>
              <div className="text-sm text-[var(--text-secondary)] font-dm leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}

          {/* Share Article */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-syne font-bold text-[var(--text-primary)]">Share this update:</span>
            <div className="flex items-center gap-2">
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=https://microsoftupdates.co.in/live/${slug}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-colors text-[var(--text-secondary)] hover:text-white" title="Share on X (Twitter)">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https://microsoftupdates.co.in/live/${slug}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[#0A66C2] flex items-center justify-center transition-colors text-[var(--text-secondary)] hover:text-white" title="Share on LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(item.title + ' https://microsoftupdates.co.in/live/' + slug)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[#25D366] flex items-center justify-center transition-colors text-[var(--text-secondary)] hover:text-white" title="Share on WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=https://microsoftupdates.co.in/live/${slug}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[#1877F2] flex items-center justify-center transition-colors text-[var(--text-secondary)] hover:text-white" title="Share on Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Source CTA */}
          {item.sourceUrl && (
            <div className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.1),rgba(34,211,238,0.05))', border: '1px solid rgba(168,85,247,0.25)' }}>
              <div className="flex-1">
                <p className="font-syne font-bold text-[var(--text-primary)] mb-1">Verify from Official Source</p>
                <p className="text-xs text-[var(--text-secondary)] font-dm">Cross-check details, download links, and complete notes directly from Microsoft.</p>
              </div>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:opacity-90 hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#A855F7,#22D3EE)', color: '#fff' }}
              >
                View on Microsoft.com
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[11px] text-[var(--text-muted)] font-dm leading-relaxed rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <strong>Disclaimer:</strong> This is an independent news blog and is not affiliated with, endorsed by, or sponsored by Microsoft Corporation. All product names, logos, and trademarks are the property of their respective owners. Always verify updates from official Microsoft sources before installation.
          </p>
        </article>

        {/* Back Navigation */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center gap-4">
          <Link href="/live" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#C084FC] transition-colors font-dm">
            ← Back to Live Updates
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#C084FC] transition-colors font-dm">
            Home
          </Link>
        </div>

        {/* Related Articles */}
        {(() => {
          const related = liveItems.filter((i) => i.category === item.category && i.slug !== slug).slice(0, 4)
          if (related.length === 0) return null
          return (
            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="section-line"></div>
                <h2 className="font-syne font-bold text-lg text-[var(--text-primary)]">Related Updates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map((r, i) => (
                  <Link
                    key={i}
                    href={`/live/${r.slug}`}
                    className="group rounded-xl border border-[var(--border)] overflow-hidden hover:border-[rgba(168,85,247,0.4)] glow-hover transition-all duration-200"
                    style={{ background: 'var(--ms-card)' }}
                  >
                    <div className="p-4">
                      <h3 className="font-syne font-bold text-sm text-[var(--text-primary)] leading-snug line-clamp-2 group-hover:text-[#C084FC] transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] mt-2 font-dm">
                        {(() => { try { return new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) } catch { return '' } })()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })()}
      </main>

      <LinkedInButton
        title={item.title}
        description={item.summary || item.description || ''}
        content={allText}
        articleUrl={`https://microsoftupdates.co.in/live/${slug}`}
      />
    </>
  )
}
