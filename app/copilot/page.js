import Link from 'next/link'
import NewsCard from '../../components/NewsCard'
import LiveCategoryArticles from '../../components/LiveCategoryArticles'
import { newsArticles } from '../../data/news'
import { getNewsForCategory } from '../../lib/newsData'

export const revalidate = 1800

export const metadata = {
  description: 'Latest Microsoft Copilot and AI news including GitHub Copilot, Copilot Pro, Copilot Studio, and AI features across Microsoft 365 for Indian users.',
  keywords: 'microsoft copilot, github copilot, copilot pro, copilot studio, ai, artificial intelligence, india',
  openGraph: {
    title: 'Copilot & AI Updates | MicrosoftUpdates.co.in',
    description: 'Latest Microsoft Copilot and AI news for Indian users and developers.',
    url: 'https://microsoftupdates.co.in/copilot',
    siteName: 'MicrosoftUpdates.co.in',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function CopilotPage() {
  const articles = newsArticles.filter(a => a.category === 'copilot')
  const liveArticles = getNewsForCategory('copilot', 30)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">Copilot & AI</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-inter font-bold tracking-tight text-3xl md:text-4xl text-on-surface">Copilot & AI Updates</h1>
        <p className="text-on-surface-variant mt-2">Everything Microsoft AI — from GitHub Copilot and Copilot Pro to Copilot Studio and AI integrations across the Microsoft 365 ecosystem.</p>
      </div>

      <LiveCategoryArticles articles={liveArticles} />

      <h2 className="font-inter font-bold text-xl text-on-surface mb-5">All Articles</h2>
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
