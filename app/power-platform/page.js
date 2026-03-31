import Link from 'next/link'
import NewsCard from '../../components/NewsCard'
import AdSlot from '../../components/AdSlot'
import { newsArticles } from '../../data/news'

export const metadata = {
  title: 'Power Platform Updates | MicrosoftUpdates.co.in',
  description: 'Latest Microsoft Power Platform news including Power Apps, Power Automate, Power BI, and Power Pages updates for Indian businesses.',
  keywords: 'power platform, power apps, power automate, power bi, power pages, microsoft, india',
  openGraph: {
    title: 'Power Platform Updates | MicrosoftUpdates.co.in',
    description: 'Latest Power Apps, Power Automate, and Power BI updates for Indian businesses.',
    url: 'https://microsoftupdates.co.in/power-platform',
    siteName: 'MicrosoftUpdates.co.in',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function PowerPlatformPage() {
  const articles = newsArticles.filter(a => a.category === 'power-platform')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-ms-accent transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">Power Platform</span>
      </nav>

      <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-10 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">⚡</span>
          <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-[var(--text-primary)]">
            Power Platform Updates
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] max-w-2xl">
          Discover the latest Power Apps, Power Automate, Power BI, and Power Pages features — with a focus on use cases and pricing relevant to Indian enterprises and startups.
        </p>
        <div className="h-1 w-16 bg-ms-yellow rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article, i) => (
          <div key={article.id}>
            <NewsCard article={article} />
            {(i + 1) % 6 === 0 && <div className="col-span-full"><AdSlot id={`adsense-pp-${i}`} size="leaderboard" /></div>}
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-center text-[var(--text-muted)] py-12">No articles found in this category.</p>
      )}
    </div>
  )
}
