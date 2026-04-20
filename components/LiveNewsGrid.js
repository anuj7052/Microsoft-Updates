import Link from 'next/link'

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
  'Copilot & AI': 'bg-ms-accent/15 text-ms-accent',
  'Microsoft Fabric': 'bg-ms-accent/15 text-ms-accent',
}

const categoryGradients = {
  azure: 'linear-gradient(135deg, #0078D4, #00BCF2)',
  windows: 'linear-gradient(135deg, #00A4EF, #7FBA00)',
  security: 'linear-gradient(135deg, #F25022, #FFB900)',
  office365: 'linear-gradient(135deg, #FFB900, #F25022)',
  'power-platform': 'linear-gradient(135deg, #742774, #C084FC)',
  copilot: 'linear-gradient(135deg, #22D3EE, #A855F7)',
  fabric: 'linear-gradient(135deg, #C084FC, #00BCF2)',
  general: 'linear-gradient(135deg, #A855F7, #22D3EE)',
}

const categoryIcons = {
  azure: '☁️',
  windows: '🪟',
  security: '🔒',
  office365: '📧',
  'power-platform': '⚡',
  copilot: '🤖',
  fabric: '🧵',
  general: '📰',
}

const categoryLogos = {
  azure: '/cloud.png',
  fabric: '/Fabric-transparent-logo-1.webp',
  'power-platform': '/power-platform-2.png',
}

function getImageUrl(article) {
  if (article.image) return article.image
  const cat = article.feedCategory || 'general'
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => {
          const colorClass = sourceColors[article.source] || 'bg-ms-accent/15 text-ms-accent'
          const artSlug = article.slug || makeSlug(article.title)
          const cat = article.feedCategory || 'general'
          const gradient = categoryGradients[cat] || categoryGradients.general
          const icon = categoryIcons[cat] || '📰'
          const logo = categoryLogos[cat] || null
          const imageUrl = getImageUrl(article)

          return (
            <Link
              key={i}
              href={`/live/${artSlug}`}
              className="group bg-ms-card rounded-2xl border border-[var(--border)] overflow-hidden glow-hover transition-all duration-300 flex flex-col"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={e => {
                    if (logo) {
                      e.currentTarget.src = logo
                      e.currentTarget.className = 'w-full h-full object-contain p-8 opacity-80'
                    }
                  }}
                />
                <div className="absolute inset-0 img-overlay" />
                {logo && (
                  <div className="absolute bottom-2 right-2">
                    <img src={logo} alt={cat} className="h-5 object-contain opacity-80" />
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`${colorClass} text-[10px] px-2 py-0.5 rounded-full font-bold`}>
                    {article.source}
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
                  <span>Independent Report</span>
                  <span className="text-[#C084FC] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Read full article →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
