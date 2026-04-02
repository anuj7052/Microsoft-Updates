import HeroSection from '../components/HeroSection'
import NewsTicker from '../components/NewsTicker'
import LiveNewsGrid from '../components/LiveNewsGrid'
import CategoryGrid from '../components/CategoryGrid'
import { fetchMicrosoftFeeds } from '../lib/feeds'

export const revalidate = 900

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
  let liveArticles = []
  try {
    liveArticles = await fetchMicrosoftFeeds()
  } catch {}

  const azureLive = liveArticles.filter(a => a.feedCategory === 'azure').slice(0, 6)
  const windowsLive = liveArticles.filter(a => a.feedCategory === 'windows').slice(0, 6)
  const securityLive = liveArticles.filter(a => a.feedCategory === 'security').slice(0, 6)

  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection articles={liveArticles.slice(0, 4)} />

      {/* 2. News Ticker */}
      <NewsTicker articles={liveArticles.slice(0, 15)} />

      {/* 3. Latest Updates Grid */}
      <LiveNewsGrid articles={liveArticles.slice(0, 9)} title="Latest Updates" />

      {/* 4. Categories */}
      <CategoryGrid />

      {/* 5. Top category sections */}
      {windowsLive.length > 0 && (
        <LiveNewsGrid articles={windowsLive} title="Windows Updates" />
      )}
      {azureLive.length > 0 && (
        <LiveNewsGrid articles={azureLive} title="Azure Cloud Updates" />
      )}
      {securityLive.length > 0 && (
        <LiveNewsGrid articles={securityLive} title="Security Updates" />
      )}
    </>
  )
}
