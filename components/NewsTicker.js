export default function NewsTicker({ articles = [] }) {
  if (articles.length === 0) return null

  const items = articles.map(a => ({ title: a.title, link: a.link }))

  return (
    <section className="bg-ms-navy border-y border-[var(--border)] overflow-hidden my-6">
      <div className="flex items-center">
        {/* LIVE label */}
        <div className="shrink-0 flex items-center gap-1.5 bg-ms-red px-4 py-2.5 z-10">
          <span className="w-2 h-2 bg-white rounded-full pulse-dot"></span>
          <span className="text-white text-xs font-bold tracking-wider">LIVE</span>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="ticker-animate inline-flex items-center">
            {[...items, ...items].map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-[var(--text-secondary)] px-6 hover:text-ms-accent transition-colors"
              >
                <span className="text-ms-accent mr-2">●</span>
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
