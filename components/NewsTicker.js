function makeSlug(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}

export default function NewsTicker({ articles = [] }) {
  if (articles.length === 0) return null

  const items = articles.map(a => ({
    title: a.title,
    slug: a.slug || makeSlug(a.title),
  }))

  return (
    <section className="border-y border-[var(--border)] overflow-hidden my-6 bg-ms-card">
      <div className="flex items-center">
        {/* LIVE label */}
        <div className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 z-10" style={{ background: '#F25022' }}>
          <span className="w-2 h-2 bg-white rounded-full pulse-dot"></span>
          <span className="text-white text-xs font-bold tracking-wider">LIVE</span>
        </div>

        {/* Scrolling ticker — all links go to internal /live/slug */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="ticker-track">
            {[...items, ...items].map((item, i) => (
              <a
                key={i}
                href={`/live/${item.slug}`}
                className="inline-flex items-center text-sm text-[var(--text-secondary)] px-6 hover:text-[#C084FC] transition-colors"
              >
                <span className="text-[#C084FC] mr-2">●</span>
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
