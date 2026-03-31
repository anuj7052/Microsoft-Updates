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

const categoryMap = {
  'Azure Blog': { badge: 'bg-ms-blue/15 text-ms-blue', label: 'Azure' },
  'Windows Blog': { badge: 'bg-ms-green/15 text-ms-green', label: 'Windows' },
  'Microsoft Security': { badge: 'bg-[#00BCF2]/15 text-[#00BCF2]', label: 'Security' },
  'Microsoft 365 Dev': { badge: 'bg-ms-orange/15 text-ms-orange', label: 'Office 365' },
  'Power Platform': { badge: 'bg-ms-yellow/15 text-ms-yellow', label: 'Power Platform' },
  'Microsoft Dev Blogs': { badge: 'bg-ms-accent/15 text-ms-accent', label: 'Developer' },
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

  return (
    <section className="max-w-7xl mx-auto px-4 pt-8 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main hero */}
        <a
          href={hero.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group lg:col-span-2 bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-8 hover:border-ms-blue/40 transition-all duration-300 block"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 bg-ms-red/15 text-ms-red text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-ms-red rounded-full pulse-dot"></span>
              LIVE
            </span>
            <span className={`${heroMeta.badge} text-xs px-2.5 py-1 rounded-full font-medium`}>
              {heroMeta.label}
            </span>
          </div>

          <h1 className="font-syne font-extrabold text-2xl md:text-3xl lg:text-4xl text-[var(--text-primary)] leading-snug md:leading-tight mb-4 tracking-tight group-hover:text-ms-accent transition-colors">
            {hero.title}
          </h1>

          <p className="font-dm font-light text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-6 max-w-2xl line-clamp-3">
            {hero.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] font-dm">
            <span>{timeAgo(hero.pubDate)}</span>
            <span>•</span>
            <span>From Microsoft</span>
            <span className="text-ms-accent opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
              Read full article →
            </span>
          </div>
        </a>

        {/* Side cards */}
        <div className="flex flex-col gap-4">
          {sideItems.map((article, i) => {
            const meta = categoryMap[article.source] || { badge: 'bg-ms-accent/15 text-ms-accent', label: article.source }
            return (
              <a
                key={i}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-ms-card rounded-xl border border-[var(--border)] p-4 hover:border-ms-blue/40 transition-all duration-200 hover:-translate-y-0.5 block"
              >
                <span className={`${meta.badge} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                  {meta.label}
                </span>
                <h3 className="font-syne font-bold text-sm text-[var(--text-primary)] mt-2 mb-1 leading-snug line-clamp-2 tracking-tight group-hover:text-ms-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-dm">
                  {timeAgo(article.pubDate)}
                </p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
