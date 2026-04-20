import { getNewsForCategory } from '../../lib/newsData'
import Link from 'next/link'

export const revalidate = 1800

export const metadata = {
  description: 'Live stream of the latest Microsoft updates from official blogs. Windows, Azure, Copilot, Microsoft 365, Security, Power Platform, Fabric updates every 30 minutes.',
}

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
}

function makeSlug(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}

const categoryColors = {
  azure: { badge: 'bg-ms-blue/15 text-ms-blue', label: 'Azure' },
  windows: { badge: 'bg-ms-green/15 text-ms-green', label: 'Windows' },
  security: { badge: 'bg-[#00BCF2]/15 text-[#00BCF2]', label: 'Security' },
  office365: { badge: 'bg-ms-orange/15 text-ms-orange', label: 'Office 365' },
  'power-platform': { badge: 'bg-ms-yellow/15 text-ms-yellow', label: 'Power Platform' },
  copilot: { badge: 'bg-ms-accent/15 text-ms-accent', label: 'Copilot / AI' },
  fabric: { badge: 'bg-ms-accent/15 text-ms-accent', label: 'Microsoft Fabric' },
  general: { badge: 'bg-ms-accent/15 text-ms-accent', label: 'General' },
}

function getImageUrl(article) {
  if (article.image) return article.image
  const cat = article.feedCategory || 'general'
  const title = encodeURIComponent((article.title || '').substring(0, 100))
  return `/api/og?title=${title}&category=${cat}`
}

const CATEGORY_LOGOS = {
  azure: '/cloud.png',
  fabric: '/Fabric-transparent-logo-1.webp',
  'power-platform': '/power-platform-2.png',
}

export default function LivePage() {
  const articles = getNewsForCategory(null, 150)

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-[#F25022] text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(242,80,34,0.12)', border: '1px solid rgba(242,80,34,0.25)' }}>
            <span className="w-2 h-2 bg-[#F25022] rounded-full pulse-dot"></span>
            LIVE
          </span>
          <span className="text-xs text-[var(--text-muted)] font-dm">Updated every 30 minutes</span>
        </div>
        <h1 className="font-syne font-extrabold text-4xl md:text-5xl gradient-text mb-4">Live Feed</h1>
        <p className="text-[var(--text-secondary)] font-dm max-w-2xl mx-auto">
          Independent coverage of the latest Microsoft announcements across all products. Every article is written and published on our site.
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-12 text-center">
          <p className="text-[var(--text-muted)]">Loading live updates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => {
            const cat = categoryColors[article.feedCategory] || categoryColors.general
            const slug = article.slug || makeSlug(article.title)
            const logo = CATEGORY_LOGOS[article.feedCategory] || null

            return (
              <Link
                key={i}
                href={`/live/${slug}`}
                className="group bg-ms-card rounded-2xl border border-[var(--border)] overflow-hidden glow-hover transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 img-overlay" />
                  {logo && (
                    <div className="absolute bottom-2 right-2">
                      <img src={logo} alt={article.feedCategory} className="h-5 object-contain opacity-85" />
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${cat.badge} text-[10px] px-2 py-0.5 rounded-full font-bold`}>
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-dm">
                      {timeAgo(article.pubDate)}
                    </span>
                  </div>

                  <h3 className="font-syne font-extrabold text-lg text-[var(--text-primary)] mb-2 line-clamp-2 leading-tight group-hover:text-[#C084FC] transition-colors">
                    {article.title}
                  </h3>

                  {article.description && (
                    <p className="font-dm text-sm text-[var(--text-secondary)] line-clamp-3 mb-4 flex-1">
                      {article.description}
                    </p>
                  )}

                  <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-dm text-[var(--text-muted)]">
                    <span>{article.source}</span>
                    <span className="text-[#C084FC] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Read full article →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-12 text-center">
        <p className="text-[11px] text-[var(--text-muted)] font-dm max-w-2xl mx-auto">
          <strong>Disclaimer:</strong> This is an independent news blog. All updates are sourced from official Microsoft RSS feeds. Always verify from official Microsoft sources before taking action.
        </p>
      </div>
    </main>
  )
}
