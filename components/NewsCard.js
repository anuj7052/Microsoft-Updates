import Link from 'next/link'

const tagColors = {
  NEW: 'bg-ms-accent/20 text-ms-accent',
  HOT: 'bg-ms-orange/20 text-ms-orange',
  CRITICAL: 'bg-ms-red/20 text-ms-red',
  ALERT: 'bg-ms-yellow/20 text-ms-yellow',
}

export default function NewsCard({ article }) {
  return (
    <Link href={`/${article.category}/${article.slug}`}>
      <article className="group bg-ms-card rounded-xl border border-[var(--border)] overflow-hidden hover:border-ms-blue/40 transition-all duration-300 hover:-translate-y-1 h-full">
        <div className="p-5">
          {/* Top row: category + tag */}
          <div className="flex items-center justify-between mb-3">
            <span className={`badge-${article.category} text-xs font-medium px-2.5 py-1 rounded-full`}>
              {article.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            {article.tag && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tagColors[article.tag] || 'bg-ms-blue/20 text-ms-blue'}`}>
                {article.tag}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-syne font-bold text-[15px] text-[var(--text-primary)] mb-2 leading-snug group-hover:text-ms-accent transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3 font-dm">
            {article.description}
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-dm">
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
            <span className="text-xs font-medium text-ms-accent group-hover:translate-x-1 transition-transform">
              Read more →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
