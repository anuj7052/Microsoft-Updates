import Link from 'next/link'
import { getNewsForCategory } from '../../lib/newsData'

export const revalidate = 1800

export const metadata = {
  description: 'Latest Azure Cloud news — services, infrastructure, AI, security, and cost management. Independent coverage updated every 30 minutes.',
  keywords: 'azure cloud, azure updates, azure ai, azure infrastructure, azure services, cloud computing, microsoft azure',
  openGraph: {
    title: 'Cloud (Azure) Updates — PowerTool',
    description: 'Latest Azure Cloud updates: services, AI, infrastructure, and cost management.',
    url: 'https://microsoftupdates.co.in/azure',
    siteName: 'PowerTool',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

async function enrichWithOgImages_UNUSED() {}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1) return 'Just now'
    if (h < 24) return `${h}h ago`
    const d = Math.floor(h / 24)
    return d < 7 ? `${d}d ago` : new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  } catch { return '' }
}

export default function CloudPage() {
  const articles = getNewsForCategory('azure', 30)
  const [featured, ...rest] = articles

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">Azure Cloud</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-inter font-bold tracking-tight text-3xl md:text-4xl text-on-surface">Azure Cloud Updates</h1>
        <p className="text-on-surface-variant mt-2">Independent coverage of Microsoft Azure Cloud — the latest service announcements, infrastructure updates, AI capabilities, and best practices.</p>
      </div>

      {/* Featured article */}
      {featured && (
        <div className="mb-8 animate-fade-up stagger-2">
          <a href={featured.url || `/azure/${featured.slug}`}
            target={featured.url ? '_blank' : undefined}
            rel={featured.url ? 'noopener noreferrer' : undefined}
            className="group flex flex-col md:flex-row glass-card rounded-xl overflow-hidden hover:shadow-[0_4px_24px_rgba(0,0,0,0.10)] transition-all duration-200">
            <div className="md:w-2/5 h-52 md:h-auto relative overflow-hidden bg-sky-50">
              {(featured.images || []).filter(Boolean)[0] ? (
                <img src={featured.images[0]} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-sky-300" style={{ fontSize: '72px', fontVariationSettings: "'FILL' 1" }}>cloud</span>
                </div>
              )}
              <span className="absolute top-3 left-3 text-[10px] font-label font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                FEATURED
              </span>
            </div>
            <div className="md:w-3/5 p-6 flex flex-col justify-center">
              <p className="font-label text-[11px] text-on-surface-variant uppercase tracking-widest mb-2">{timeAgo(featured.pubDate || featured.date)}</p>
              <h2 className="font-headline text-xl md:text-2xl font-medium text-on-surface group-hover:text-primary transition-colors leading-tight mb-3 line-clamp-3">
                {featured.title}
              </h2>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                {featured.description || featured.summary || ''}
              </p>
              <span className="mt-4 text-xs font-label font-semibold text-sky-700 flex items-center gap-1">
                Read full article <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
              </span>
            </div>
          </a>
        </div>
      )}

      {/* Article grid */}
      {articles.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rest.map((article, i) => {
            const href = article.url || `/azure/${article.slug}`
            const img = (article.images || []).filter(Boolean)[0] || null
            return (
              <a key={article.id || article.slug || i}
                href={href}
                target={article.url ? '_blank' : undefined}
                rel={article.url ? 'noopener noreferrer' : undefined}
                className="group flex flex-col glass-card rounded-xl overflow-hidden hover:border-sky-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)] transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}>
                <div className="h-36 overflow-hidden bg-sky-50 shrink-0">
                  {img ? (
                    <img src={img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-sky-200" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>cloud</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-headline text-[15px] font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2 flex-1">
                    {article.title}
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-3">
                    {article.description || article.summary || ''}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span className="font-label text-[11px] text-on-surface-variant">{timeAgo(article.pubDate || article.date)}</span>
                    <span className="font-label text-[11px] font-semibold text-sky-700">Read →</span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
