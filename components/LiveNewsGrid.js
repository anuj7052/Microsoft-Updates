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

const sourceColors = {
  'Azure Blog': 'bg-ms-blue/15 text-ms-blue',
  'Windows Blog': 'bg-ms-green/15 text-ms-green',
  'Microsoft Security': 'bg-[#00BCF2]/15 text-[#00BCF2]',
  'Microsoft 365 Dev': 'bg-ms-orange/15 text-ms-orange',
  'Power Platform': 'bg-ms-yellow/15 text-ms-yellow',
  'Microsoft Dev Blogs': 'bg-ms-accent/15 text-ms-accent',
}

export default function LiveNewsGrid({ articles = [], title, color = 'bg-ms-accent' }) {
  if (articles.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-7">
        <div className="section-line"></div>
        <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
          {title}
        </h2>
        <span className="flex items-center gap-1.5 text-[#F87171] text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)'}}>
          <span className="w-1.5 h-1.5 bg-[#F87171] rounded-full pulse-dot"></span>
          LIVE
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article, i) => {
          const internalSlug = article.slug || makeSlug(article.title)
          const colorCls = sourceColors[article.source] || 'bg-ms-accent/15 text-ms-accent'
          return (
            <div
              key={i}
              className="group relative rounded-xl border border-[var(--border)] overflow-hidden glow-hover transition-all duration-200 hover:-translate-y-1"
              style={{ background: 'var(--ms-card)' }}
            >
              {/* Full-card link */}
              <a href={`/live/${internalSlug}`} className="absolute inset-0 z-0" aria-label={article.title} />

              {/* Article image */}
              {article.image ? (
                <div className="w-full aspect-[16/9] overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 img-overlay" />
                </div>
              ) : (
                <div className="w-full h-20 bg-gradient-to-br from-[rgba(168,85,247,0.08)] to-[rgba(34,211,238,0.03)]" />
              )}

              <div className="relative z-10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`${colorCls} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
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
                <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                  <span className="text-[10px] font-semibold gradient-text opacity-0 group-hover:opacity-100 transition-opacity">
                    Read article →
                  </span>
                  {article.link && (
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-20 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 ml-auto transition-colors"
                      title="Verify from official Microsoft source"
                    >
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Source
                    </a>
                  )}
                </div>
              </div>

              {/* Bottom gradient line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'linear-gradient(90deg,#A855F7,#22D3EE)'}} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
