import { newsArticles } from '../data/news'

const tickerItems = newsArticles.slice(0, 12).map(a => a.title)

export default function NewsTicker() {
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
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="inline-flex items-center text-sm text-[var(--text-secondary)] px-6">
                <span className="text-ms-accent mr-2">●</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
