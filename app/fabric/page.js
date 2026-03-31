import Link from 'next/link'
import NewsCard from '../../components/NewsCard'
import { newsArticles } from '../../data/news'

export const metadata = {
  title: 'Microsoft Fabric Updates | MicrosoftUpdates.co.in',
  description: 'Latest Microsoft Fabric news including OneLake, data engineering, real-time intelligence, and analytics updates for Indian data professionals.',
  keywords: 'microsoft fabric, onelake, data engineering, real-time analytics, data warehouse, india',
  openGraph: {
    title: 'Microsoft Fabric Updates | MicrosoftUpdates.co.in',
    description: 'Latest Microsoft Fabric and OneLake updates for Indian data professionals.',
    url: 'https://microsoftupdates.co.in/fabric',
    siteName: 'MicrosoftUpdates.co.in',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function FabricPage() {
  const articles = newsArticles.filter(a => a.category === 'fabric')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-ms-accent transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">Microsoft Fabric</span>
      </nav>

      <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-10 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🔷</span>
          <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-[var(--text-primary)]">
            Microsoft Fabric Updates
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] max-w-2xl">
          All things Microsoft Fabric — from OneLake and data engineering to real-time intelligence and Copilot-powered analytics for Indian enterprises.
        </p>
        <div className="h-1 w-16 bg-ms-purple rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
