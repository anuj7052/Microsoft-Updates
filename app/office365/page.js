import Link from 'next/link'
import NewsCard from '../../components/NewsCard'
import LiveCategoryArticles from '../../components/LiveCategoryArticles'
import { newsArticles } from '../../data/news'
import { getUpdatesFromDb } from '../../lib/feeds'

export const revalidate = 900

export const metadata = {
  description: 'Latest Microsoft Office 365 and Microsoft 365 news including Teams, Excel, Word, Outlook, Planner, and Loop updates for Indian organizations.',
  keywords: 'office 365, microsoft 365, teams, excel, word, outlook, planner, loop, india',
  openGraph: {
    title: 'Office 365 Updates | MicrosoftUpdates.co.in',
    description: 'Latest Microsoft 365 and Office 365 feature updates for Indian organizations.',
    url: 'https://microsoftupdates.co.in/office365',
    siteName: 'MicrosoftUpdates.co.in',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default async function Office365Page() {
  const articles = newsArticles.filter(a => a.category === 'office365')

  let liveArticles = []
  try {
    liveArticles = await getUpdatesFromDb('office365')
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">Office 365</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-inter font-bold tracking-tight text-3xl md:text-4xl text-on-surface">Office 365 Updates</h1>
        <p className="text-on-surface-variant mt-2">Feature updates across Microsoft Teams, Excel, Word, Outlook, Planner, Loop, and the broader Microsoft 365 suite.</p>
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
