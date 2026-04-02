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
  windows: 'bg-ms-green/15 text-ms-green',
  azure: 'bg-ms-blue/15 text-ms-blue',
  security: 'bg-[#00BCF2]/15 text-[#00BCF2]',
  office365: 'bg-ms-orange/15 text-ms-orange',
  'power-platform': 'bg-ms-yellow/15 text-ms-yellow',
  copilot: 'bg-ms-accent/15 text-ms-accent',
  fabric: 'bg-purple-400/15 text-purple-400',
  general: 'bg-ms-accent/15 text-ms-accent',
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

  const colorClass = categoryColors[item.category] || categoryColors.general
  const label = categoryLabels[item.category] || item.category
  const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // JSON-LD schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.summary,
    datePublished: item.date,
    dateModified: item.date,
    author: { '@type': 'Organization', name: 'Latest Microsoft Updates & News' },
    publisher: {
      '@type': 'Organization',
      name: 'Latest Microsoft Updates & News',
      url: 'https://microsoftupdates.co.in',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://microsoftupdates.co.in/live/${slug}` },
    ...(item.image ? { image: item.image } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-dm mb-6">
          <Link href="/" className="hover:text-ms-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/live" className="hover:text-ms-accent transition-colors">Live Updates</Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)] line-clamp-1">{item.title.substring(0, 50)}…</span>
        </nav>

        <article className="bg-ms-card rounded-2xl border border-[var(--border)] overflow-hidden">
          {/* Hero image */}
          {item.image && (
            <div className="w-full aspect-[2/1] overflow-hidden bg-ms-dark">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          <div className="p-6 md:p-10">
            {/* Category + date */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${colorClass}`}>
                {label}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-dm">{formattedDate}</span>
              <span className="flex items-center gap-1.5 bg-ms-red/15 text-ms-red text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-ms-red rounded-full animate-pulse"></span>
                LIVE
              </span>
            </div>

            {/* Title */}
            <h1 className="font-syne font-extrabold text-2xl md:text-3xl lg:text-[2rem] text-[var(--text-primary)] leading-snug tracking-tight mb-6">
              {item.title}
            </h1>

            {/* Summary */}
            {item.summary && (
              <div className="mb-8 pb-8 border-b border-[var(--border)]">
                <p className="text-base text-[var(--text-secondary)] font-dm leading-relaxed">
                  {item.summary}
                </p>
              </div>
            )}

            {/* Info box */}
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5 mb-8 flex flex-col gap-3">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">About This Update</p>
              <p className="text-sm text-[var(--text-secondary)] font-dm leading-relaxed">
                This is an independent summary of an official Microsoft announcement. The full details,
                patch notes, and technical documentation are available directly from Microsoft.
              </p>
              <p className="text-sm text-[var(--text-secondary)] font-dm leading-relaxed">
                We process hundreds of Microsoft updates every day to help IT professionals and enthusiasts
                stay informed without visiting multiple sources.
              </p>
            </div>

            {/* Source verification — prominent CTA */}
            <div className="rounded-2xl border-2 border-ms-blue/30 bg-ms-blue/5 p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-syne font-bold text-[var(--text-primary)] mb-1">
                  Read the Full Article on Microsoft
                </p>
                <p className="text-xs text-[var(--text-secondary)] font-dm">
                  Verify details, download links, and complete patch notes directly from the official Microsoft source.
                </p>
              </div>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 bg-ms-blue hover:bg-ms-blue/80 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Open on Microsoft
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-[var(--text-muted)] font-dm leading-relaxed border-t border-[var(--border)] pt-6">
              <strong>Disclaimer:</strong> This is an independent news blog and is not affiliated with, endorsed by,
              or sponsored by Microsoft Corporation. All product names, logos, and trademarks are the property of
              their respective owners. Always verify updates from official Microsoft sources before installation.
            </p>
          </div>
        </article>

        {/* Back navigation */}
        <div className="mt-6 flex items-center gap-4">
          <Link
            href="/live"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-ms-accent transition-colors font-dm"
          >
            ← Back to Live Updates
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-ms-accent transition-colors font-dm"
          >
            Home
          </Link>
        </div>
      </main>
    </>
  )
}
