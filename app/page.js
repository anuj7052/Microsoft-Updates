import Link from 'next/link'
import fs from 'fs'
import path from 'path'

export const revalidate = 1800

export const metadata = {
  description: 'Your independent intelligence hub for Microsoft Power Platform, Fabric, and Azure Cloud. Latest updates, insights, and announcements — updated every 30 minutes.',
  openGraph: {
    title: 'PowerTool — Power Platform, Fabric & Cloud Dashboard',
    description: 'Independent intelligence hub for Microsoft Power Platform, Fabric, and Azure Cloud.',
    url: 'https://microsoftupdates.co.in',
    siteName: 'PowerTool',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

// ── Config ──────────────────────────────────────────────────────────────────

const CATEGORY_LOGOS = {
  azure: '/microsoft_azure-logo_brandlogos.net_mlyt6-512x512.png',
  fabric: '/Fabric_final_x256.png',
  'power-platform': '/Microsoft_Power_Platform_logo.svg.png',
}

const STREAMS = [
  {
    key: 'power-platform',
    label: 'Power Platform',
    href: '/power-platform',
    icon: 'settings_input_component',
    logo: '/Microsoft_Power_Platform_logo.svg.png',
    accent: 'from-purple-500 to-violet-600',
    accentLight: 'bg-purple-50',
    accentText: 'text-purple-700',
    accentBorder: 'border-purple-200',
    dot: 'bg-purple-500',
    description: 'Power Apps · Power Automate · Power BI · Copilot Studio',
  },
  {
    key: 'fabric',
    label: 'Microsoft Fabric',
    href: '/fabric',
    icon: 'layers',
    logo: '/Fabric_final_x256.png',
    accent: 'from-blue-500 to-indigo-600',
    accentLight: 'bg-blue-50',
    accentText: 'text-blue-700',
    accentBorder: 'border-blue-200',
    dot: 'bg-blue-500',
    description: 'OneLake · Data Engineering · Real-Time Analytics · AI',
  },
  {
    key: 'azure',
    label: 'Cloud',
    href: '/azure',
    icon: 'cloud',
    logo: '/microsoft_azure-logo_brandlogos.net_mlyt6-512x512.png',
    accent: 'from-sky-500 to-cyan-600',
    accentLight: 'bg-sky-50',
    accentText: 'text-sky-700',
    accentBorder: 'border-sky-200',
    dot: 'bg-sky-500',
    description: 'Azure Services · Infrastructure · AI · Cost Management',
  },
]

// ── Data ──────────────────────────────────────────────────────────────────────

function getNewsData() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'news.json')
    if (!fs.existsSync(filePath)) return []
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return []
  }
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1) return 'Just now'
    if (h < 24) return `${h}h ago`
    const d = Math.floor(h / 24)
    if (d < 7) return `${d}d ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  } catch { return '' }
}

// ── Components ───────────────────────────────────────────────────────────────

function StreamCard({ article, stream, featured = false }) {
  const href = article.url || `/${stream.key}/${article.slug}`
  const isExternal = !!article.url
  const img = (article.images || []).filter(Boolean)[0] || null
  const time = timeAgo(article.pubDate || article.date)

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`group flex flex-col glass-card rounded-xl overflow-hidden hover:border-outline-variant hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-all duration-200 ${featured ? 'md:flex-row' : ''}`}
    >
      {/* Thumbnail */}
      <div className={`relative overflow-hidden bg-surface-container shrink-0 ${featured ? 'md:w-2/5 h-48 md:h-auto' : 'h-40'}`}>
        {img ? (
          <img src={img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : stream.logo ? (
          <div className={`w-full h-full bg-gradient-to-br ${stream.accent} opacity-10 flex items-center justify-center p-4`}>
            <img src={stream.logo} alt={stream.label} className="max-w-[60%] max-h-[60%] object-contain opacity-80" />
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${stream.accent} opacity-10 flex items-center justify-center`}>
            <span className={`material-symbols-outlined ${stream.accentText} opacity-60`}
              style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>{stream.icon}</span>
          </div>
        )}
        {/* Category pill */}
        <span className={`absolute top-2 left-2 text-[10px] font-label font-semibold px-2 py-0.5 rounded-full ${stream.accentLight} ${stream.accentText} border ${stream.accentBorder}`}>
          {stream.label}
        </span>
      </div>

      {/* Content */}
      <div className={`p-4 flex flex-col flex-1 ${featured ? 'p-5' : ''}`}>
        <h3 className={`font-headline font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug ${featured ? 'text-xl mb-2' : 'text-[15px] mb-1.5'}`}>
          {article.title}
        </h3>
        {featured && (
          <p className="font-body text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-3">
            {article.description || article.summary || ''}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-outline-variant/10">
          <span className="font-label text-[11px] text-on-surface-variant">{time}</span>
          <span className={`font-label text-[11px] font-semibold ${stream.accentText} flex items-center gap-0.5`}>
            Read
            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
          </span>
        </div>
      </div>
    </a>
  )
}

function StreamColumn({ stream, articles }) {
  const [featured, ...rest] = articles
  return (
    <div className="flex flex-col gap-0 min-w-0">
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl bg-gradient-to-r ${stream.accent} text-white`}>
        <div className="flex items-center gap-2.5">
          {stream.logo ? (
            <>
              <img
                src={stream.logo}
                alt={stream.label}
                className="h-6 w-6 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <div>
                <p className="font-label text-sm font-bold leading-none">{stream.label}</p>
                <p className="font-label text-[10px] opacity-75 mt-0.5 leading-none">{stream.description}</p>
              </div>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>{stream.icon}</span>
              <div>
                <p className="font-label text-sm font-bold leading-none">{stream.label}</p>
                <p className="font-label text-[10px] opacity-75 mt-0.5 leading-none">{stream.description}</p>
              </div>
            </>
          )}
        </div>
        <Link href={stream.href}
          className="text-[11px] font-label font-semibold bg-white/20 hover:bg-white/30 transition-colors px-2.5 py-1 rounded-full flex items-center gap-1">
          All
          <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>arrow_forward</span>
        </Link>
      </div>

      {/* Articles */}
      <div className="border border-t-0 border-white/60 rounded-b-xl overflow-hidden flex flex-col divide-y divide-outline-variant/15 bg-white/70 backdrop-blur-md">
        {articles.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-on-surface-variant">Loading stream…</p>
          </div>
        ) : articles.map((article, i) => (
          <StreamRow key={article.id || article.slug || i} article={article} stream={stream} index={i} />
        ))}
      </div>
    </div>
  )
}

function StreamRow({ article, stream, index }) {
  const href = article.url || `/${stream.key}/${article.slug}`
  const isExternal = !!article.url
  const img = (article.images || []).filter(Boolean)[0] || null
  const time = timeAgo(article.pubDate || article.date)

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group flex items-start gap-3 px-4 py-3.5 hover:bg-white/60 transition-colors animate-fade-up"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-container">
        {img ? (
          <img src={img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : stream.logo ? (
          <div className={`w-full h-full bg-gradient-to-br ${stream.accent} opacity-10 flex items-center justify-center p-1.5`}>
            <img src={stream.logo} alt={stream.label} className="w-full h-full object-contain opacity-70" />
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${stream.accent} opacity-15 flex items-center justify-center`}>
            <span className={`material-symbols-outlined ${stream.accentText} opacity-50`}
              style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>{stream.icon}</span>
          </div>
        )}
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4 className="font-body text-[13px] font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h4>
        <p className="font-label text-[11px] text-on-surface-variant mt-1">{time}</p>
      </div>
    </a>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const allNews = getNewsData()

  function getStream(key, limit = 7) {
    return allNews
      .filter((a) => a.feedCategory === key || a.category === key)
      .slice(0, limit)
  }

  const ppArticles = getStream('power-platform')
  const fabricArticles = getStream('fabric')
  const azureArticles = getStream('azure')

  const streamData = [
    { stream: STREAMS[0], articles: ppArticles },
    { stream: STREAMS[1], articles: fabricArticles },
    { stream: STREAMS[2], articles: azureArticles },
  ]

  // Latest 3 articles across all streams for hero spotlight
  const allLatest = [...ppArticles.slice(0,2), ...fabricArticles.slice(0,2), ...azureArticles.slice(0,2)]
    .sort((a, b) => new Date(b.pubDate || b.date || 0) - new Date(a.pubDate || a.date || 0))
    .slice(0, 3)

  return (
    <>
      <h1 className="sr-only">PowerTool — Power Platform, Fabric & Cloud Dashboard</h1>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">

        {/* ── Hero Header ── */}
        <header className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-widest">Live • Updated every 30 min</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold text-on-surface tracking-tight leading-tight mb-3">
            Intelligence Dashboard
          </h1>
          <p className="font-body text-base text-on-surface-variant max-w-2xl">
            Real-time updates across <span className="text-purple-700 font-medium">Power Platform</span>, <span className="text-blue-700 font-medium">Microsoft Fabric</span>, and <span className="text-sky-700 font-medium">Azure Cloud</span> — everything in one place.
          </p>
        </header>

        {/* ── Spotlight (top 3 latest across all streams) ── */}
        {allLatest.length > 0 && (
          <section className="mb-10 animate-fade-up stagger-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>bolt</span>
              <h2 className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Latest Across All Streams</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allLatest.map((article, i) => {
                const stream = STREAMS.find(s => s.key === (article.feedCategory || article.category)) || STREAMS[2]
                return <StreamCard key={article.id || i} article={article} stream={stream} featured={i === 0} />
              })}
            </div>
          </section>
        )}

        {/* ── 3-Column Stream ── */}
        <section>
          <div className="flex items-center gap-2 mb-5 animate-fade-up stagger-3">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>dashboard</span>
            <h2 className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Live Streams</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {streamData.map(({ stream, articles }, i) => (
              <div key={stream.key} className="animate-fade-up" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                <StreamColumn stream={stream} articles={articles} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA row ── */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up stagger-5">
          {STREAMS.map((stream) => (
            <Link key={stream.key} href={stream.href}
              className={`group flex items-center justify-between p-4 rounded-xl border border-white/60 glass-card hover:shadow-md transition-all duration-200`}>
              <div className="flex items-center gap-3">
                {stream.logo ? (
                  <img src={stream.logo} alt={stream.label} className="w-9 h-9 object-contain shrink-0" />
                ) : (
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stream.accent} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>{stream.icon}</span>
                  </div>
                )}
                <div>
                  <p className={`font-label text-sm font-bold ${stream.accentText}`}>{stream.label}</p>
                  <p className="font-label text-[11px] text-on-surface-variant">View all updates</p>
                </div>
                {stream.logo && (
                  <p className="font-label text-[11px] text-on-surface-variant">View all updates</p>
                )}
              </div>
              <span className={`material-symbols-outlined ${stream.accentText} group-hover:translate-x-1 transition-transform duration-200`}
                style={{ fontSize: '20px' }}>arrow_forward</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
