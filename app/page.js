import HeroSection from '../components/HeroSection'
import NewsTicker from '../components/NewsTicker'
import NewsCard from '../components/NewsCard'
import FeaturedSection from '../components/FeaturedSection'
import CategoryGrid from '../components/CategoryGrid'
import LiveFeed from '../components/LiveFeed'
import PricingSection from '../components/PricingSection'
import { newsArticles } from '../data/news'

export const revalidate = 900 // Revalidate every 15 minutes

export const metadata = {
  title: 'Microsoft Updates — Latest Microsoft News & Updates',
  description: 'Your go-to source for the latest Microsoft news, updates, and insights covering Windows, Azure, Power Platform, Microsoft Fabric, Copilot AI, Office 365, Licensing, and Security.',
  keywords: 'microsoft, windows, azure, power platform, microsoft fabric, copilot, office 365, licensing, security, news, updates',
  openGraph: {
    title: 'Microsoft Updates — Latest Microsoft News & Updates',
    description: 'Your go-to source for the latest Microsoft news, updates, and insights.',
    url: 'https://microsoftupdates.co.in',
    siteName: 'Microsoft Updates',
    locale: 'en',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function HomePage() {
  const latestNews = newsArticles.slice(0, 9)
  const licensingNews = newsArticles.filter(a => a.category === 'licensing').slice(0, 4)
  const azureNews = newsArticles.filter(a => a.category === 'azure').slice(0, 3)
  const powerNews = newsArticles.filter(a => a.category === 'power-platform').slice(0, 3)
  const copilotNews = newsArticles.filter(a => a.category === 'copilot').slice(0, 3)
  const windowsNews = newsArticles.filter(a => a.category === 'windows').slice(0, 3)
  const securityNews = newsArticles.filter(a => a.category === 'security').slice(0, 3)
  const officeNews = newsArticles.filter(a => a.category === 'office365').slice(0, 3)

  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Live News Ticker */}
      <NewsTicker />

      {/* 3. Latest News Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)] mb-6 tracking-tight">
          Latest Microsoft News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {latestNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 5. Live Microsoft Blog Feed */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-ms-accent rounded-full"></div>
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
            Live from Microsoft Blogs
          </h2>
        </div>
        <LiveFeed limit={12} />
      </section>

      {/* 6. Featured Deep-Dive */}
      <FeaturedSection />

      {/* 6. Categories Grid */}
      <CategoryGrid />

      {/* 8. Licensing & Pricing Section */}
      <PricingSection />

      {/* Licensing Articles */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-ms-yellow rounded-full"></div>
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
            Licensing News
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {licensingNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 9. Azure News Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-ms-blue rounded-full"></div>
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
            Azure Cloud Updates
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {azureNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 10. Power Platform Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-ms-yellow rounded-full"></div>
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
            Power Platform Updates
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {powerNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 11. Copilot & AI Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-ms-accent rounded-full"></div>
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
            Copilot & AI Updates
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {copilotNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 12. Windows Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-ms-green rounded-full"></div>
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
            Windows Updates
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {windowsNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 13. Security Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[#00BCF2] rounded-full"></div>
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
            Security Updates
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {securityNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 14. Office 365 Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-ms-orange rounded-full"></div>
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
            Office 365 Updates
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {officeNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

    </>
  )
}
