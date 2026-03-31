import { newsArticles, categories } from '../../../data/news'
import Link from 'next/link'
import AdSlot from '../../../components/AdSlot'
import CommentSection from '../../../components/CommentSection'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    category: article.category,
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params
  const article = newsArticles.find(
    (a) => a.category === category && a.slug === slug
  )
  if (!article) return { title: 'Article Not Found | Microsoft Updates' }

  const cat = categories.find((c) => c.id === category)
  return {
    title: `${article.title} | Microsoft Updates`,
    description: article.description,
    keywords: `microsoft, ${category}, ${article.title.toLowerCase()}, news, updates`,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://microsoftupdates.co.in/${category}/${slug}`,
      siteName: 'Microsoft Updates',
      locale: 'en',
      type: 'article',
      publishedTime: article.date,
    },
    robots: { index: true, follow: true },
  }
}

export default async function ArticlePage({ params }) {
  const { category, slug } = await params
  const article = newsArticles.find(
    (a) => a.category === category && a.slug === slug
  )

  if (!article) {
    notFound()
  }

  const cat = categories.find((c) => c.id === category)
  const relatedArticles = newsArticles
    .filter((a) => a.category === category && a.id !== article.id)
    .slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-ms-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${category}`} className="hover:text-ms-accent transition-colors">
          {cat?.name || category}
        </Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)] line-clamp-1">{article.title}</span>
      </nav>

      {/* Article */}
      <article className="bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-10">
        {/* Category + Tag */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`badge-${article.category} text-xs font-medium px-3 py-1 rounded-full`}>
            {cat?.icon} {cat?.name || category}
          </span>
          {article.tag && (
            <span className="bg-ms-accent/15 text-ms-accent text-xs font-bold px-2.5 py-0.5 rounded">
              {article.tag}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-syne font-extrabold text-2xl md:text-3xl lg:text-4xl text-[var(--text-primary)] leading-snug tracking-tight mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] font-dm mb-8 pb-6 border-b border-[var(--border)]">
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>

        {/* Article body */}
        <div className="prose prose-invert max-w-none font-dm text-[var(--text-secondary)] leading-relaxed space-y-6">
          <p className="text-base md:text-lg leading-relaxed">
            {article.description}
          </p>

          <h2 className="font-syne font-bold text-xl text-[var(--text-primary)] mt-8 mb-3">Key Highlights</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-ms-accent mt-1">●</span>
              <span>This update represents a significant step forward in Microsoft&apos;s strategy to enhance {cat?.name || category} capabilities across enterprise and consumer segments.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ms-accent mt-1">●</span>
              <span>Organizations can expect improved performance, enhanced security features, and better integration with existing Microsoft ecosystem tools.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ms-accent mt-1">●</span>
              <span>The rollout is expected to be available globally, with phased deployment across different regions starting this quarter.</span>
            </li>
          </ul>

          <h2 className="font-syne font-bold text-xl text-[var(--text-primary)] mt-8 mb-3">What This Means for You</h2>
          <p>
            For IT administrators and technology decision-makers, this announcement signals Microsoft&apos;s continued investment in the {cat?.name || category} space. Teams should begin evaluating the impact on their current infrastructure and plan for adoption accordingly.
          </p>
          <p>
            Microsoft has indicated that detailed documentation and migration guides will be available through the official Microsoft Learn portal, along with updated pricing information for affected services.
          </p>

          <h2 className="font-syne font-bold text-xl text-[var(--text-primary)] mt-8 mb-3">Looking Ahead</h2>
          <p>
            Industry analysts expect this to be part of a broader series of announcements from Microsoft in the coming months. Stay tuned to Microsoft Updates for comprehensive coverage of all related developments.
          </p>

          {/* Share */}
          <div className="mt-10 pt-6 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)] mb-3">Share this article</p>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://microsoftupdates.co.in/${category}/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-ms-navy rounded-lg text-sm text-[var(--text-secondary)] hover:text-ms-accent border border-[var(--border)] hover:border-ms-blue/40 transition-colors"
              >
                𝕏 Share
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://microsoftupdates.co.in/${category}/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-ms-navy rounded-lg text-sm text-[var(--text-secondary)] hover:text-ms-accent border border-[var(--border)] hover:border-ms-blue/40 transition-colors"
              >
                💼 LinkedIn
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Ad Slot */}
      <AdSlot id="adsense-article" size="rectangle" />

      {/* Comments */}
      <CommentSection articleId={`${category}-${slug}`} />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-12">
          <h2 className="font-syne font-extrabold text-xl text-[var(--text-primary)] mb-6 tracking-tight">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedArticles.map((ra) => (
              <Link key={ra.id} href={`/${ra.category}/${ra.slug}`}>
                <div className="group bg-ms-card rounded-xl border border-[var(--border)] p-5 hover:border-ms-blue/40 transition-all duration-300 hover:-translate-y-1">
                  <span className={`badge-${ra.category} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                    {ra.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <h3 className="font-syne font-bold text-sm text-[var(--text-primary)] mt-2 mb-1 leading-snug line-clamp-2 group-hover:text-ms-accent transition-colors">
                    {ra.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-dm">{ra.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
