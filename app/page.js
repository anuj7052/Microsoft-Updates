import HeroSection from '../components/HeroSection'
import NewsTicker from '../components/NewsTicker'
import LiveNewsGrid from '../components/LiveNewsGrid'
import FeaturedSection from '../components/FeaturedSection'
import CategoryGrid from '../components/CategoryGrid'
import LiveFeed from '../components/LiveFeed'
import PricingSection from '../components/PricingSection'
import { fetchMicrosoftFeeds } from '../lib/feeds'

export const revalidate = 900 // ISR: Regenerate every 15 minutes automatically

export const metadata = {
  title: 'Latest Microsoft Updates & News — Independent Blog',
  description: 'Independent coverage of Microsoft updates every 30 minutes. Windows, Azure, Copilot AI, Microsoft 365, Power Platform, Fabric, Security patches. Trusted by IT professionals.',
  keywords: 'microsoft updates today, latest microsoft news, windows 11 update, azure updates, microsoft copilot, microsoft 365 update, office 365, power platform, microsoft fabric, security patches, patch tuesday',
  openGraph: {
    title: 'Latest Microsoft Updates & News — Independent Blog',
    description: 'Independent Microsoft updates coverage updated every 30 minutes. Windows, Azure, Copilot, M365, Security.',
    url: 'https://microsoftupdates.co.in',
    siteName: 'Latest Microsoft Updates & News',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default async function HomePage() {
  // Fetch live data from Microsoft RSS feeds at build/revalidation time (server-side)
  let liveArticles = []
  try {
    liveArticles = await fetchMicrosoftFeeds()
  } catch {}

  // Categorize live articles
  const azureLive = liveArticles.filter(a => a.feedCategory === 'azure').slice(0, 6)
  const windowsLive = liveArticles.filter(a => a.feedCategory === 'windows').slice(0, 6)
  const securityLive = liveArticles.filter(a => a.feedCategory === 'security').slice(0, 6)
  const officeLive = liveArticles.filter(a => a.feedCategory === 'office365').slice(0, 6)
  const powerLive = liveArticles.filter(a => a.feedCategory === 'power-platform').slice(0, 6)
  const fabricLive = liveArticles.filter(a => a.feedCategory === 'fabric').slice(0, 6)
  const copilotLive = liveArticles.filter(a => a.feedCategory === 'copilot').slice(0, 6)
  const generalLive = liveArticles.filter(a => a.feedCategory === 'general').slice(0, 6)

  return (
    <>
      {/* 1. Hero Section — server data passed as props */}
      <HeroSection articles={liveArticles.slice(0, 4)} />

      {/* 2. Live News Ticker */}
      <NewsTicker articles={liveArticles.slice(0, 15)} />

      {/* 3. Latest News Grid — all live articles */}
      <LiveNewsGrid articles={liveArticles.slice(0, 9)} title="Latest Microsoft Updates & News" />

      {/* 4. Live Updates Quick-View section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-ms-red/15 text-ms-red text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-ms-red rounded-full animate-pulse"></span>
              LIVE
            </span>
            <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
              Live Updates Feed
            </h2>
          </div>
          <a href="/live" className="text-xs text-ms-accent hover:underline font-medium">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {liveArticles.slice(0, 6).map((article, i) => (
            <div key={i} className="bg-ms-card rounded-xl border border-[var(--border)] p-4 flex flex-col gap-2">
              <p className="text-[10px] text-[var(--text-muted)] font-dm">
                {new Date(article.pubDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {' · '}{article.source}
              </p>
              <p className="font-syne font-bold text-sm text-[var(--text-primary)] leading-snug line-clamp-2">
                {article.title}
              </p>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-ms-accent hover:underline mt-auto font-medium"
              >
                Verify from Microsoft →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Live Microsoft Blog Feed */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-ms-accent rounded-full"></div>
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
            Latest Microsoft Blog Posts
          </h2>
        </div>
        <LiveFeed articles={liveArticles.slice(0, 12)} />
      </section>

      {/* 5. Featured Deep-Dive */}
      <FeaturedSection />

      {/* 6. Categories Grid */}
      <CategoryGrid />

      {/* 7. Licensing & Pricing Section */}
      <PricingSection />

      {/* 8. Azure News */}
      {azureLive.length > 0 && (
        <LiveNewsGrid articles={azureLive} title="Azure Cloud Updates" color="bg-ms-blue" />
      )}

      {/* 9. Windows News */}
      {windowsLive.length > 0 && (
        <LiveNewsGrid articles={windowsLive} title="Windows Updates" color="bg-ms-green" />
      )}

      {/* 10. Power Platform */}
      {powerLive.length > 0 && (
        <LiveNewsGrid articles={powerLive} title="Power Platform Updates" color="bg-ms-yellow" />
      )}

      {/* 11. Security */}
      {securityLive.length > 0 && (
        <LiveNewsGrid articles={securityLive} title="Security Updates" color="bg-[#00BCF2]" />
      )}

      {/* 12. Office 365 */}
      {officeLive.length > 0 && (
        <LiveNewsGrid articles={officeLive} title="Office 365 & M365 Updates" color="bg-ms-orange" />
      )}

      {/* 13. Microsoft Fabric */}
      {fabricLive.length > 0 && (
        <LiveNewsGrid articles={fabricLive} title="Microsoft Fabric Updates" color="bg-ms-purple" />
      )}

      {/* 14. Copilot & AI */}
      {copilotLive.length > 0 && (
        <LiveNewsGrid articles={copilotLive} title="Copilot & AI Updates" color="bg-ms-accent" />
      )}

      {/* 15. Developer & General */}
      {generalLive.length > 0 && (
        <LiveNewsGrid articles={generalLive} title="Developer Updates" color="bg-ms-accent" />
      )}
    </>
  )
}
