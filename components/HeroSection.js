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

const categoryMap = {
  'Azure Blog': { badge: 'bg-ms-blue/15 text-ms-blue', label: 'Azure', cat: 'azure' },
  'Windows Blog': { badge: 'bg-ms-green/15 text-ms-green', label: 'Windows', cat: 'windows' },
  'Microsoft Security': { badge: 'bg-[#00BCF2]/15 text-[#00BCF2]', label: 'Security', cat: 'security' },
  'Microsoft 365 Dev': { badge: 'bg-ms-orange/15 text-ms-orange', label: 'Office 365', cat: 'office365' },
  'Power Platform': { badge: 'bg-ms-yellow/15 text-ms-yellow', label: 'Power Platform', cat: 'power-platform' },
  'Microsoft Dev Blogs': { badge: 'bg-ms-accent/15 text-ms-accent', label: 'Developer', cat: 'copilot' },
}

function getImageUrl(article) {
  if (article.image) return article.image
  const meta = categoryMap[article.source]
  const cat = article.feedCategory || (meta && meta.cat) || 'general'
  const title = encodeURIComponent((article.title || '').substring(0, 100))
  return `/api/og?title=${title}&category=${cat}`
}

export default function HeroSection({ articles = [] }) {
  if (articles.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-8 text-center">
          <p className="text-[var(--text-muted)]">Loading latest news...</p>
        </div>
      </section>
    )
  }

  const hero = articles[0]
  const sideItems = articles.slice(1, 4)
  const heroMeta = categoryMap[hero.source] || { badge: 'bg-ms-accent/15 text-ms-accent', label: hero.source }
  const heroSlug = hero.slug || makeSlug(hero.title)
  const heroCategory = hero.feedCategory || 'general'

  return (
    <section className="max-w-7xl mx-auto px-4 pt-8 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main hero — links internally */}
        <a
          href={`/live/${heroSlug}`}
          className="group lg:col-span-2 rounded-2xl border border-[var(--border)] overflow-hidden glow-hover transition-all duration-300 block relative"
          style={{ background: 'var(--ms-card)' }}
        >
          {/* Hero image — always shown */}
          <div className="w-full aspect-[16/7] overflow-hidden relative">
            <img src={getImageUrl(hero)} alt={hero.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="eager" />
            <div className="absolute inset-0 img-overlay" />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 text-[#F87171] text-xs font-bold px-3 py-1 rounded-full" style={{background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)'}}>
                <span className="w-1.5 h-1.5 bg-[#F87171] rounded-full pulse-dot"></span>
                LIVE
              </span>
              <span className={`${heroMeta.badge} text-xs px-2.5 py-1 rounded-full font-medium`}>
                {heroMeta.label}
              </span>
              <span className="ai-badge">INDEPENDENT</span>
            </div>

            <h1 className="font-syne font-extrabold text-2xl md:text-3xl lg:text-[2rem] text-[var(--text-primary)] leading-snug tracking-tight mb-4 group-hover:text-[#C084FC] transition-colors">
              {hero.title}
            </h1>

            <p className="font-dm font-light text-[var(--text-secondary)] text-[15px] md:text-base leading-relaxed mb-6 max-w-2xl line-clamp-3">
              {hero.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] font-dm">
              <span>{timeAgo(hero.pubDate)}</span>
              <span>·</span>
              <span>Independent Coverage</span>
              <span className="gradient-text font-semibold opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                Read full article →
              </span>
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'linear-gradient(90deg,#A855F7,#22D3EE)'}} />
        </a>

        {/* Side cards */}
        <div className="flex flex-col gap-4">
          {sideItems.map((article, i) => {
            const meta = categoryMap[article.source] || { badge: 'bg-ms-accent/15 text-ms-accent', label: article.source }
            const artSlug = article.slug || makeSlug(article.title)
            return (
              <a
                key={i}
                href={`/live/${artSlug}`}
                className="group rounded-xl border border-[var(--border)] overflow-hidden glow-hover transition-all duration-200 hover:-translate-y-0.5 block relative"
                style={{ background: 'var(--ms-card)' }}
              >
                <div className="w-full aspect-[16/7] overflow-hidden relative">
                  <img src={getImageUrl(article)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 img-overlay" />
                </div>
                <div className="p-4">
                  <span className={`${meta.badge} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                    {meta.label}
                  </span>
                  <h3 className="font-syne font-bold text-[15px] text-[var(--text-primary)] mt-2 mb-1 leading-snug line-clamp-2 tracking-tight group-hover:text-[#C084FC] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-dm flex items-center gap-1">
                    <span>{timeAgo(article.pubDate)}</span>
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{background:'linear-gradient(90deg,#A855F7,#22D3EE)'}} />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
