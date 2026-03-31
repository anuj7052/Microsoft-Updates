import Link from 'next/link'
import NewsCard from '../../components/NewsCard'
import LiveCategoryArticles from '../../components/LiveCategoryArticles'
import { newsArticles } from '../../data/news'
import { fetchMicrosoftFeeds } from '../../lib/feeds'

export const revalidate = 900

export const metadata = {
  title: 'Windows Updates | MicrosoftUpdates.co.in',
  description: 'Latest Windows 11, Windows 12, and Windows Server news, updates, patches, and feature announcements for Indian IT professionals.',
  keywords: 'windows 11, windows 12, windows update, windows server, microsoft windows, india',
  openGraph: {
    title: 'Windows Updates | MicrosoftUpdates.co.in',
    description: 'Latest Windows news, updates, and patches for Indian IT professionals.',
    url: 'https://microsoftupdates.co.in/windows',
    siteName: 'MicrosoftUpdates.co.in',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default async function WindowsPage() {
  const articles = newsArticles.filter(a => a.category === 'windows')

  let liveArticles = []
  try {
    liveArticles = await fetchMicrosoftFeeds('windows')
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-ms-accent transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">Windows Updates</span>
      </nav>

      {/* Hero */}
      <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-10 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🪟</span>
          <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-[var(--text-primary)]">
            Windows Updates
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] max-w-2xl">
          Stay up to date with the latest Windows 11, Windows 12, and Windows Server news — including feature updates, security patches, and insider builds relevant to Indian users.
        </p>
        <div className="h-1 w-16 bg-ms-green rounded-full mt-4"></div>
      </div>

      {/* Live articles from RSS */}
      <LiveCategoryArticles articles={liveArticles} />

      {/* Static articles - always preserved */}
      <h2 className="font-syne font-extrabold text-xl text-[var(--text-primary)] mb-5">All Articles</h2>
      {/* Articles grid */}
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
