const categoryColors = {
  azure: { bg: 'bg-ms-blue/15', text: 'text-ms-blue' },
  windows: { bg: 'bg-ms-green/15', text: 'text-ms-green' },
  security: { bg: 'bg-[#00BCF2]/15', text: 'text-[#00BCF2]' },
  office365: { bg: 'bg-ms-orange/15', text: 'text-ms-orange' },
  'power-platform': { bg: 'bg-ms-yellow/15', text: 'text-ms-yellow' },
  general: { bg: 'bg-ms-accent/15', text: 'text-ms-accent' },
}

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-ms-red/15 text-ms-red text-xs font-bold px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-ms-red rounded-full pulse-dot"></span>
            LIVE
          </span>
          <span className="text-xs text-[var(--text-muted)] font-dm">from Microsoft Official Blogs</span>
        </div>
        <span className="text-[10px] text-[var(--text-muted)] font-dm">
          Auto-updates every 15 min
        </span>
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {articles.map((article, i) => {
          const colors = categoryColors[article.feedCategory] || categoryColors.general
          return (
            <a
              key={i}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-ms-card rounded-xl border border-[var(--border)] p-4 hover:border-ms-blue/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`${colors.bg} ${colors.text} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                  {article.source}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-dm">
                  {timeAgo(article.pubDate)}
                </span>
              </div>
              <h3 className="font-syne font-bold text-sm text-[var(--text-primary)] leading-snug group-hover:text-ms-accent transition-colors line-clamp-2 tracking-tight">
                {article.title}
              </h3>
              {article.description && (
                <p className="text-xs text-[var(--text-secondary)] font-dm mt-1.5 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              )}
              <span className="text-[10px] text-ms-accent font-medium mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                Read on Microsoft →
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
