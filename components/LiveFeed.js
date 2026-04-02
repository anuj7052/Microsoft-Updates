'use client'

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
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
  azure: 'bg-ms-blue/15 text-ms-blue',
  windows: 'bg-ms-green/15 text-ms-green',
  security: 'bg-[#00BCF2]/15 text-[#00BCF2]',
  office365: 'bg-ms-orange/15 text-ms-orange',
  'power-platform': 'bg-ms-yellow/15 text-ms-yellow',
  copilot: 'bg-ms-accent/15 text-ms-accent',
  fabric: 'bg-ms-accent/15 text-ms-accent',
  general: 'bg-ms-accent/15 text-ms-accent',
}

export default function LiveFeed({ articles = [] }) {
  if (articles.length === 0) {
    return (
      <div className="bg-ms-card rounded-xl border border-[var(--border)] p-8 text-center">
        <p className="text-[var(--text-muted)] text-sm">Loading live feed...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[#F25022] text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(242,80,34,0.15)', border: '1px solid rgba(242,80,34,0.3)' }}>
            <span className="w-2 h-2 bg-[#F25022] rounded-full pulse-dot"></span>
            LIVE
          </span>
          <span className="text-xs text-[var(--text-muted)] font-dm">Updated every 30 minutes</span>
        </div>
      </div>

      <div className="space-y-3">
        {articles.map((article, i) => {
          const colorClass = categoryColors[article.feedCategory] || categoryColors.general
          const slug = article.slug || makeSlug(article.title)

          return (
            <a
              key={i}
              href={`/live/${slug}`}
              className="group block bg-ms-card rounded-xl border border-[var(--border)] p-4 hover:border-[rgba(192,132,252,0.4)] transition-all duration-200 hover:-translate-y-0.5 glow-hover"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`${colorClass} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                  {article.source}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-dm">
                  {timeAgo(article.pubDate)}
                </span>
              </div>
              <h3 className="font-syne font-bold text-sm text-[var(--text-primary)] leading-snug group-hover:text-[#C084FC] transition-colors line-clamp-2 tracking-tight">
                {article.title}
              </h3>
              {article.description && (
                <p className="text-xs text-[var(--text-secondary)] font-dm mt-1.5 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              )}
              <span className="text-[11px] gradient-text font-semibold mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                Read full article →
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
