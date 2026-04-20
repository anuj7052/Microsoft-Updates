import { newsArticles, categories } from '../../../data/news'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LinkedInButton from '../../../components/LinkedInButton'

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

const RISK_MAP = {
  CRITICAL: { label: 'ACTION REQ', icon: 'warning', border: 'border-error', badge: 'bg-error-container text-on-error-container' },
  ALERT: { label: 'CAUTION', icon: 'warning', border: 'border-tertiary-container', badge: 'bg-tertiary-container text-on-tertiary-container' },
  HOT: { label: 'SAFE', icon: 'check_circle', border: 'border-secondary-container', badge: 'bg-secondary-container text-on-secondary-container' },
  NEW: { label: 'SAFE', icon: 'check_circle', border: 'border-secondary-container', badge: 'bg-secondary-container text-on-secondary-container' },
  default: { label: 'SAFE', icon: 'check_circle', border: 'border-secondary-container', badge: 'bg-secondary-container text-on-secondary-container' },
}

const CATEGORY_ICONS = {
  azure: 'cloud',
  windows: 'grid_view',
  security: 'security',
  copilot: 'smart_toy',
  fabric: 'layers',
  'power-platform': 'settings_input_component',
  licensing: 'description',
  office365: 'description',
}

export default async function ArticlePage({ params }) {
  const { category, slug } = await params
  const article = newsArticles.find(
    (a) => a.category === category && a.slug === slug
  )

  if (!article) notFound()

  const cat = categories.find((c) => c.id === category)
  const risk = RISK_MAP[article.tag] || RISK_MAP.default
  const catIcon = CATEGORY_ICONS[category] || 'article'

  const relatedArticles = newsArticles
    .filter((a) => a.category === category && a.id !== article.id)
    .slice(0, 3)

  const allRelated = newsArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 md:p-10 lg:px-16 lg:py-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
        {/* Background MS logo watermark */}
        <svg
          className="ms-logo-bg"
          style={{ top: 40, left: '55%', width: 280, height: 280, animationDuration: '14s', animationDelay: '1s' }}
          viewBox="0 0 96 96"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="1" y="1" width="44" height="44" fill="#f25022" />
          <rect x="51" y="1" width="44" height="44" fill="#7fba00" />
          <rect x="1" y="51" width="44" height="44" fill="#00a4ef" />
          <rect x="51" y="51" width="44" height="44" fill="#ffb900" />
        </svg>

        {/* Left Column: Article */}
        <article className="lg:col-span-8 flex flex-col gap-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant animate-fade-in">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${category}`} className="hover:text-primary transition-colors capitalize">
              {cat?.name || category.replace('-', ' ')}
            </Link>
            <span>/</span>
            <span className="line-clamp-1 text-on-surface">{article.title}</span>
          </nav>

          {/* Header */}
          <header className="flex flex-col gap-4 scan-line-container">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.05em] text-on-surface-variant font-semibold flex-wrap animate-fade-in">
              <span className="bg-surface-container-high px-2 py-1 rounded text-primary capitalize">
                {cat?.name || category.replace('-', ' ')}
              </span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
            <h1 className="text-[2rem] md:text-[2.75rem] leading-[1.1] font-bold text-on-surface tracking-[-0.02em] animate-fade-up">
              {article.title}
            </h1>
            <p className="text-lg text-on-surface-variant font-medium max-w-3xl leading-relaxed mt-1 animate-fade-up stagger-2">
              {article.description}
            </p>
          </header>

          {/* AI Executive Summary */}
          <section className="card-premium bg-surface-container rounded-xl p-6 relative overflow-hidden animate-scale-up stagger-3">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-container to-primary rounded-l-xl" />
            <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none select-none">
              <span className="material-symbols-outlined text-[100px]">auto_awesome</span>
            </div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-surface-container-highest p-2 rounded-lg text-primary shrink-0 mt-1">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2 flex-wrap">
                  AI Executive Summary
                  <span className="bg-primary/10 text-primary text-[0.65rem] px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Auto-Generated
                  </span>
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {article.description} This update is part of Microsoft&apos;s ongoing investment in the{' '}
                  {cat?.name || category} space. IT administrators and decision-makers should evaluate
                  the impact on their current infrastructure and plan for adoption in the upcoming quarter.
                  Detailed documentation is available through the official Microsoft Learn portal.
                </p>
              </div>
            </div>
          </section>

          {/* Article Body */}
          <div className="prose prose-invert max-w-none text-on-surface-variant leading-relaxed space-y-6 animate-fade-up stagger-4">
            <h2 className="text-[1.5rem] font-bold text-on-surface mt-8 mb-4">Key Highlights</h2>
            <ul className="list-none space-y-4 pl-0">
              <li className="flex items-start gap-3 animate-slide-left stagger-1">
                <span className="material-symbols-outlined text-primary mt-1 text-lg shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <strong className="text-on-surface block mb-1">Strategic Impact</strong>
                  <span className="text-sm text-on-surface-variant">
                    This update represents a significant step forward in Microsoft&apos;s strategy to enhance{' '}
                    {cat?.name || category} capabilities across enterprise and consumer segments.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 animate-slide-left stagger-2">
                <span className="material-symbols-outlined text-primary mt-1 text-lg shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <strong className="text-on-surface block mb-1">Performance &amp; Security</strong>
                  <span className="text-sm text-on-surface-variant">
                    Organizations can expect improved performance, enhanced security features, and better
                    integration with existing Microsoft ecosystem tools.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 animate-slide-left stagger-3">
                <span className="material-symbols-outlined text-primary mt-1 text-lg shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <strong className="text-on-surface block mb-1">Global Rollout</strong>
                  <span className="text-sm text-on-surface-variant">
                    The rollout is expected to be available globally, with phased deployment across different
                    regions starting this quarter.
                  </span>
                </div>
              </li>
            </ul>

            <h2 className="text-[1.5rem] font-bold text-on-surface mt-10 mb-4">What This Means for You</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              For IT administrators and technology decision-makers, this announcement signals Microsoft&apos;s
              continued investment in the {cat?.name || category} space. Teams should begin evaluating the
              impact on their current infrastructure and plan for adoption accordingly.
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Microsoft has indicated that detailed documentation and migration guides will be available
              through the official Microsoft Learn portal, along with updated pricing information for
              affected services.
            </p>

            <h2 className="text-[1.5rem] font-bold text-on-surface mt-10 mb-4">Looking Ahead</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Industry analysts expect this to be part of a broader series of announcements from Microsoft
              in the coming months. Stay tuned to Microsoft Updates for comprehensive coverage of all
              related developments.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-outline-variant/15 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-on-surface">Was this article helpful?</span>
              <button className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors flex items-center justify-center text-on-surface-variant hover:text-white border border-outline-variant/20">
                <span className="material-symbols-outlined text-sm">thumb_up</span>
              </button>
              <button className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors flex items-center justify-center text-on-surface-variant hover:text-white border border-outline-variant/20">
                <span className="material-symbols-outlined text-sm">thumb_down</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://microsoftupdates.co.in/${category}/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-md border border-outline-variant/20 text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-white transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                Share
              </a>
              <button className="px-4 py-2 rounded-md border border-outline-variant/20 text-sm font-medium text-on-surface-variant hover:bg-surface-container-highest hover:text-white transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">bookmark</span>
                Save
              </button>
            </div>
          </div>
        </article>

        {/* Right Column: Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6 h-max">

          {/* Deployment Risk */}
          <div className={`card-premium bg-surface-container rounded-xl p-6 border-l-4 ${risk.border} relative overflow-hidden animate-scale-up`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface">
                Deployment Risk
              </h4>
              <span className={`${risk.badge} text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1`}>
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {risk.icon}
                </span>
                {risk.label}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              This update introduces enhancements to the {cat?.name || category} platform. Review your
              existing configurations and test in a non-production environment before broad deployment.
            </p>
            <div className="space-y-3">
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/15 flex items-start gap-3">
                <span className="material-symbols-outlined text-outline text-sm mt-0.5">policy</span>
                <div>
                  <span className="text-xs text-on-surface block font-semibold mb-0.5">Policy Compatibility</span>
                  <span className="text-[0.6875rem] text-on-surface-variant leading-tight block">
                    Verify compatibility with existing GPO and compliance policies.
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/15 flex items-start gap-3">
                <span className="material-symbols-outlined text-outline text-sm mt-0.5">memory</span>
                <div>
                  <span className="text-xs text-on-surface block font-semibold mb-0.5">Resource Impact</span>
                  <span className="text-[0.6875rem] text-on-surface-variant leading-tight block">
                    Monitor system resources after deployment for unexpected changes.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 animate-fade-up stagger-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">On This Page</h4>
            <nav className="flex flex-col gap-2">
              <a className="text-sm text-primary border-l-2 border-primary pl-3 py-1 bg-surface-container-highest/50 transition-colors font-medium" href="#summary">
                AI Executive Summary
              </a>
              <a className="text-sm text-on-surface-variant hover:text-white border-l-2 border-transparent pl-3 py-1 hover:bg-surface-container-highest/30 transition-colors" href="#highlights">
                Key Highlights
              </a>
              <a className="text-sm text-on-surface-variant hover:text-white border-l-2 border-transparent pl-3 py-1 hover:bg-surface-container-highest/30 transition-colors" href="#impact">
                What This Means for You
              </a>
              <a className="text-sm text-on-surface-variant hover:text-white border-l-2 border-transparent pl-3 py-1 hover:bg-surface-container-highest/30 transition-colors" href="#ahead">
                Looking Ahead
              </a>
            </nav>
          </div>

          {/* Related Articles */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface border-b border-outline-variant/20 pb-2">
              Related Intelligence
            </h4>
            {(relatedArticles.length > 0 ? relatedArticles : allRelated).slice(0, 3).map((ra) => (
              <Link
                key={ra.id}
                href={`/${ra.category}/${ra.slug}`}
                className="group block p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant/15"
              >
                <span className="text-[0.6875rem] text-primary uppercase tracking-wider font-semibold block mb-1 capitalize">
                  {ra.category.replace('-', ' ')}
                </span>
                <h5 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors leading-tight mb-2 line-clamp-2">
                  {ra.title}
                </h5>
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  {ra.date}
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </main>

      <LinkedInButton
        title={article.title}
        description={article.description}
        content={article.description}
        articleUrl={`https://microsoftupdates.co.in/${category}/${slug}`}
      />
    </div>
  )
}
