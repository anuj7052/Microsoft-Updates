import { newsArticles } from '../data/news'

export default function HeroSection() {
  const hero = newsArticles[0]
  const sideArticles = newsArticles.slice(1, 4)

  return (
    <section className="max-w-7xl mx-auto px-4 pt-8 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main hero */}
        <div className="lg:col-span-2 bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-8">
          {/* Breaking badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 bg-ms-red/15 text-ms-red text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-ms-red rounded-full pulse-dot"></span>
              BREAKING
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-syne font-extrabold text-2xl md:text-3xl lg:text-4xl text-[var(--text-primary)] leading-snug md:leading-tight mb-4 tracking-tight">
            {hero.title}
          </h1>

          {/* Category tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`badge-${hero.category} text-xs px-2.5 py-1 rounded-full font-medium`}>
              {hero.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            {hero.tag && (
              <span className="bg-ms-accent/15 text-ms-accent text-xs px-2.5 py-1 rounded-full font-medium">
                {hero.tag}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="font-dm font-light text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
            {hero.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] font-dm">
            <span>{hero.date}</span>
            <span>•</span>
            <span>{hero.readTime}</span>
          </div>
        </div>

        {/* Side cards */}
        <div className="flex flex-col gap-4">
          {sideArticles.map((article) => (
            <div key={article.id} className="bg-ms-card rounded-xl border border-[var(--border)] p-4 hover:border-ms-blue/40 transition-colors">
              <span className={`badge-${article.category} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                {article.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <h3 className="font-syne font-bold text-sm text-[var(--text-primary)] mt-2 mb-1 leading-snug line-clamp-2 tracking-tight">
                {article.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-dm">{article.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
