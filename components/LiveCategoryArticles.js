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

function makeSlug(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}

export default function LiveCategoryArticles({ articles = [] }) {
  if (articles.length === 0) return null

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-syne font-extrabold text-xl text-[var(--text-primary)]">
          Live Updates
        </h2>
        <span className="flex items-center gap-1.5 bg-ms-red/15 text-ms-red text-[10px] font-bold px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-ms-red rounded-full pulse-dot"></span>
          LIVE
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article, i) => {
          const artSlug = article.slug || makeSlug(article.title)
          return (
            <a
              key={i}
              href={`/live/${artSlug}`}
              className="group bg-ms-card rounded-xl border border-[var(--border)] p-5 hover:border-[#C084FC] transition-all duration-200 hover:-translate-y-1 block glow-hover"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-ms-accent/15 text-ms-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {article.source}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-dm">
                  {timeAgo(article.pubDate)}
                </span>
              </div>
              <h3 className="font-syne font-bold text-sm text-[var(--text-primary)] leading-snug group-hover:text-[#C084FC] transition-colors line-clamp-2 tracking-tight mb-2">
                {article.title}
              </h3>
              {article.description && (
                <p className="text-xs text-[var(--text-secondary)] font-dm line-clamp-2 leading-relaxed mb-3">
                  {article.description}
                </p>
              )}
              <span className="text-[10px] gradient-text font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Read full article →
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
