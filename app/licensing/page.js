import Link from 'next/link'
import NewsCard from '../../components/NewsCard'
import LiveCategoryArticles from '../../components/LiveCategoryArticles'
import { newsArticles } from '../../data/news'
import { getUpdatesFromDb } from '../../lib/feeds'

export const revalidate = 900

export const metadata = {
  description: 'Latest Microsoft licensing news, price changes, CSP updates, and academic licensing offers for Indian businesses and partners.',
  keywords: 'microsoft licensing, microsoft 365 licensing, csp, azure licensing, price change, india',
  openGraph: {
    title: 'Microsoft Licensing Updates | MicrosoftUpdates.co.in',
    description: 'Latest Microsoft licensing news and price changes for Indian businesses.',
    url: 'https://microsoftupdates.co.in/licensing',
    siteName: 'MicrosoftUpdates.co.in',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default async function LicensingPage() {
  const articles = newsArticles.filter(a => a.category === 'licensing')

  let liveArticles = []
  try {
    liveArticles = await getUpdatesFromDb('general')
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">Licensing</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-inter font-bold tracking-tight text-3xl md:text-4xl text-on-surface">Microsoft Licensing Updates</h1>
        <p className="text-on-surface-variant mt-2">Track Microsoft licensing changes, price adjustments, CSP program updates, and academic offers.</p>
      </div>

      <LiveCategoryArticles articles={liveArticles} />

      <h2 className="font-inter font-bold text-xl text-on-surface mb-5">All Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {articles.map((article, i) => (
          <div key={article.id}>
            <NewsCard article={article} />
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-center text-[var(--text-muted)] py-12">No articles found in this category.</p>
      )}
    </div>
  )
}
