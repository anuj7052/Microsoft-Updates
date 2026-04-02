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

const feedCategoryMap = {
  'Azure Blog': 'azure',
  'Windows Blog': 'windows',
  'Microsoft Security': 'security',
  'Microsoft 365 Dev': 'office365',
  'Power Platform': 'power-platform',
  'Microsoft Dev Blogs': 'copilot',
}

function getImageUrl(article) {
  if (article.image) return article.image
  const cat = article.feedCategory || feedCategoryMap[article.source] || 'general'
  const title = encodeURIComponent((article.title || '').substring(0, 100))
  return `/api/og?title=${title}&category=${cat}`
}

export default function LiveNewsGrid({ articles = [], title }) {
  if (articles.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-7">
        <div className="section-line"></div>
        <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
          {title}
        </h2>
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

              {/* Article image — always shown */}
              <div className="w-full aspect-[16/10] overflow-hidden relative">
                <img
                  src={getImageUrl(article)}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 img-overlay" />
                <span className={`absolute top-3 left-3 ${colorCls} text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm`}>
                  {article.source}
                </span>
              </div>

              <div className="relative z-10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[12px] text-[var(--text-muted)] font-dm">
                    {timeAgo(article.pubDate)}
                  </span>
                </div>
                <h3 className="font-syne font-bold text-[15px] text-[var(--text-primary)] leading-snug group-hover:text-[#C084FC] transition-colors line-clamp-2 tracking-tight mb-2">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="text-[14px] text-[var(--text-secondary)] font-dm line-clamp-2 leading-relaxed mb-3">
                    {article.description}
                  </p>
                )}
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                  <span className="text-[11px] font-semibold gradient-text opacity-0 group-hover:opacity-100 transition-opacity">
                    Read full article →
                  </span>
                  {article.link && (
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-20 text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 ml-auto transition-colors"
                      title="Verify from official Microsoft source"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
