import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchMicrosoftFeeds } from '../../../lib/feeds'

export const revalidate = 1800

function loadLiveItems() {
  try {
    const p = join(process.cwd(), 'data', 'live-updates.json')
    if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf8')).items || []
  } catch {}
  return []
}

export async function generateStaticParams() {
  const items = loadLiveItems()
  return items
    .filter((i) => i.slug)
    .map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const items = loadLiveItems()
  const item = items.find((i) => i.slug === slug)

  if (!item) return { title: 'Update Not Found | Microsoft Updates' }

  const cat = item.category?.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Microsoft'
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
      images: item.image ? [{ url: item.image }] : [],
    },
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

// Extract bullet points from description text for key points section
function extractKeyPoints(text = '') {
  if (!text) return []
  const clean = text.replace(/<[^>]+>/g, ' ')
  // Split on `. ` or `! ` or `? ` boundaries
  const sentences = clean
    .split(/[.!?]\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 30 && s.length < 250)
  return sentences.slice(0, 4)
}

function estimateReadTime(text = '') {
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export default async function LiveArticlePage({ params }) {
  const { slug } = await params

  // 1. Try live-updates.json
  let item = null
  const items = loadLiveItems()
  item = items.find((i) => i.slug === slug) || null

  // 2. Fallback: try to find in live RSS feed by slug match
  if (!item) {
    try {
      const feeds = await fetchMicrosoftFeeds()
      const match = feeds.find((a) => {
        const s = a.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .substring(0, 80)
        return s === slug || (a.slug && a.slug === slug)
      })
      if (match) {
        item = {
          title: match.title,
          summary: match.description || '',
          date: match.pubDate,
          category: match.feedCategory || 'general',
          sourceUrl: match.link,
          slug,
          image: match.image || null,
        }
      }
    } catch {}
  }

  if (!item) notFound()

  const colorTxt = categoryColors[item.category] || categoryColors.general
  const colorBg = categoryBg[item.category] || categoryBg.general
  const label = categoryLabels[item.category] || item.category
  const readMin = estimateReadTime((item.summary || '') + (item.description || ''))
  const keyPoints = extractKeyPoints(item.summary || item.description || '')
  const formattedDate = (() => {
    try { return new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) } catch { return '' }
  })()

  // JSON-LD schema — NewsArticle
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
    ...(item.image ? { image: { '@type': 'ImageObject', url: item.image } } : {}),
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
          {/* Hero image — always shown (gradient fallback) */}
          <div className="w-full aspect-[2/1] overflow-hidden rounded-2xl mb-6 relative" style={{background:'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(34,211,238,0.07))'}}>
            {item.image ? (
              <>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="eager" />
                <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(8,7,15,0.7) 0%,transparent 50%)'}} />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 opacity-15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6"/></svg>
              </div>
            )}
            {/* Category label overlaid on image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm ${colorTxt}`} style={{background:colorBg,border:`1px solid ${colorBg.replace('0.12','0.3')}`}}>{label}</span>
              <span className="flex items-center gap-1 text-[#F87171] text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm" style={{background:'rgba(248,113,113,0.15)',border:'1px solid rgba(248,113,113,0.3)'}}>
                <span className="w-1.5 h-1.5 bg-[#F87171] rounded-full pulse-dot"></span>LIVE
              </span>
            </div>
          </div>

          {/* Article header */}
          <div className="mb-8">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-[var(--text-muted)] font-dm">
              {formattedDate && <span>{formattedDate}</span>}
              <span className="opacity-40">·</span>
              <span className="reading-chip">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {readMin} min read
              </span>
              <span className="opacity-40">·</span>
              <span className="ai-badge">INDEPENDENT COVERAGE</span>
            </div>

            <h1 className="font-syne font-extrabold text-2xl md:text-3xl lg:text-[2rem] text-[var(--text-primary)] leading-snug tracking-tight mb-5">
              {item.title}
            </h1>

            {/* Summary lead */}
            {item.summary && (
              <p className="text-[1.05rem] text-[var(--text-secondary)] font-dm leading-relaxed border-l-2 border-[#A855F7] pl-4">
                {item.summary}
              </p>
            )}
          </div>

          <hr className="grad-divider" />

          {/* Key Points section */}
          {keyPoints.length > 0 && (
            <div className="rounded-2xl p-6 mb-8" style={{background:'linear-gradient(135deg,rgba(168,85,247,0.06),rgba(34,211,238,0.03))',border:'1px solid rgba(168,85,247,0.18)'}}>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-[#C084FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                <h2 className="font-syne font-bold text-sm text-[var(--text-primary)] uppercase tracking-widest">Key Points</h2>
              </div>
              <ul className="space-y-3">
                {keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] font-dm leading-relaxed">
                    <span className="mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-[#C084FC]" style={{background:'rgba(168,85,247,0.12)'}}>{i+1}</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What This Means */}
          <div className="rounded-2xl p-6 mb-8" style={{background:'rgba(19,18,42,0.6)',border:'1px solid var(--border)'}}>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <h2 className="font-syne font-bold text-sm text-[var(--text-primary)] uppercase tracking-widest">About This Update</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-[var(--text-secondary)] font-dm leading-relaxed">
              <p>This is an independent summary of an official Microsoft announcement. We rewrite and simplify technical content so IT professionals and everyday users can quickly understand what changed and why it matters.</p>
              <p>We monitor official Microsoft feeds, blogs, and documentation 24/7 and publish summaries every 30 minutes — saving you time across Windows, Azure, Microsoft 365, Copilot, Security, and more.</p>
            </div>
          </div>

          {/* Should you install / act? */}
          <div className="rounded-2xl p-6 mb-8" style={{background:'rgba(34,211,238,0.04)',border:'1px solid rgba(34,211,238,0.12)'}}>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <h2 className="font-syne font-bold text-sm text-[var(--text-primary)] uppercase tracking-widest">Our Take</h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-dm leading-relaxed">
              Stay informed by reading the full official release from Microsoft linked below. For security updates, apply as soon as possible. For feature updates, review the release notes before deploying in production environments.
            </p>
          </div>

          {/* Source CTA */}
          {item.sourceUrl && (
            <div className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{background:'linear-gradient(135deg,rgba(168,85,247,0.1),rgba(34,211,238,0.05))',border:'1px solid rgba(168,85,247,0.25)'}}>
              <div className="flex-1">
                <p className="font-syne font-bold text-[var(--text-primary)] mb-1">Read the Full Official Release</p>
                <p className="text-xs text-[var(--text-secondary)] font-dm">Verify details, download links, and complete patch notes directly from the official Microsoft source.</p>
              </div>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:opacity-90 hover:scale-105"
                style={{background:'linear-gradient(135deg,#A855F7,#22D3EE)',color:'#fff'}}
              >
                Open on Microsoft.com
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[11px] text-[var(--text-muted)] font-dm leading-relaxed rounded-xl p-4" style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.04)'}}>
            <strong>Disclaimer:</strong> This is an independent news blog and is not affiliated with, endorsed by, or sponsored by Microsoft Corporation. All product names, logos, and trademarks are the property of their respective owners. Always verify updates from official Microsoft sources before installation.
          </p>
        </article>

        {/* Back navigation */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center gap-4">
          <Link href="/live" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#C084FC] transition-colors font-dm">
            ← Back to Live Updates
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#C084FC] transition-colors font-dm">
            Home
          </Link>
        </div>
      </main>
    </>
  )
}
