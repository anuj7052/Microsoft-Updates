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
  title: 'Microsoft Updates — Latest Windows, Azure, Copilot, M365, Fabric News',
  description: 'Get real-time Microsoft news updates every 15 minutes. Latest Windows 11/12 updates, Azure cloud announcements, Microsoft Copilot AI news, Microsoft 365 features, Power Platform, Microsoft Fabric, security patches, and licensing changes. Trusted by IT professionals worldwide.',
  keywords: 'microsoft updates today, latest microsoft news, windows 11 update, windows 12, azure updates, microsoft copilot, copilot ai news, microsoft 365 update, office 365 new features, power platform updates, power bi, microsoft fabric, security patches, patch tuesday, microsoft licensing, microsoft india news, teams update, excel update',
  openGraph: {
    title: 'Microsoft Updates — Latest Windows, Azure, Copilot, M365, Fabric News',
    description: 'Real-time Microsoft news updated every 15 minutes. Windows, Azure, Copilot AI, M365, Power Platform, Fabric, Security.',
    url: 'https://microsoftupdates.co.in',
    siteName: 'Microsoft Updates',
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
      <LiveNewsGrid articles={liveArticles.slice(0, 9)} title="Latest Microsoft News" />

      {/* 4. Live Microsoft Blog Feed */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-ms-accent rounded-full"></div>
          <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
            Live from Microsoft Blogs
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
