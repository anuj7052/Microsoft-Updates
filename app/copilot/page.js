import Link from 'next/link'
import NewsCard from '../../components/NewsCard'
import LiveCategoryArticles from '../../components/LiveCategoryArticles'
import { newsArticles } from '../../data/news'
import { getUpdatesFromDb } from '../../lib/feeds'

export const revalidate = 900

export const metadata = {
  title: 'Copilot & AI Updates | MicrosoftUpdates.co.in',
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

export default async function CopilotPage() {
  const articles = newsArticles.filter(a => a.category === 'copilot')

  let liveArticles = []
  try {
    liveArticles = await getUpdatesFromDb('copilot')
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-ms-accent transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">Copilot & AI</span>
      </nav>

      <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-10 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🤖</span>
          <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-[var(--text-primary)]">
            Copilot & AI Updates
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] max-w-2xl">
          Everything Microsoft AI — from GitHub Copilot and Copilot Pro to Copilot Studio and AI integrations across the Microsoft 365 ecosystem.
        </p>
        <div className="h-1 w-16 bg-ms-accent rounded-full mt-4"></div>
      </div>

      <LiveCategoryArticles articles={liveArticles} />

      <h2 className="font-syne font-extrabold text-xl text-[var(--text-primary)] mb-5">All Articles</h2>
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
