'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { newsArticles } from '../data/news'

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const categoryMap = {
  'Azure Blog': { badge: 'badge-azure', label: 'Azure' },
  'Windows Blog': { badge: 'badge-windows', label: 'Windows' },
  'Microsoft Security Blog': { badge: 'badge-security', label: 'Security' },
  'Microsoft 365 Blog': { badge: 'badge-office365', label: 'Office 365' },
  'Power Platform Blog': { badge: 'badge-power-platform', label: 'Power Platform' },
  'Microsoft Developer Blogs': { badge: 'badge-copilot', label: 'Developer' },
}

export default function HeroSection() {
  const [liveArticles, setLiveArticles] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch('/api/feed')
        const data = await res.json()
        if (data.articles?.length >= 4) {
          setLiveArticles(data.articles)
        }
      } catch {}
      setLoading(false)
    }
    fetchLive()
  }, [])

  // Fallback to static data
  const hero = liveArticles ? liveArticles[0] : newsArticles[0]
  const sideItems = liveArticles ? liveArticles.slice(1, 4) : newsArticles.slice(1, 4)
  const isLive = !!liveArticles

  return (
    <section className="max-w-7xl mx-auto px-4 pt-8 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main hero */}
        <a
          href={isLive ? hero.link : `/${hero.category}/${hero.slug}`}
          target={isLive ? '_blank' : '_self'}
          rel={isLive ? 'noopener noreferrer' : undefined}
          className="group lg:col-span-2 bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-8 hover:border-ms-blue/40 transition-all duration-300 block"
        >
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            {isLive && (
              <span className="flex items-center gap-1.5 bg-ms-red/15 text-ms-red text-xs font-bold px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-ms-red rounded-full pulse-dot"></span>
                LIVE
              </span>
            )}
            {!isLive && (
              <span className="flex items-center gap-1.5 bg-ms-red/15 text-ms-red text-xs font-bold px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-ms-red rounded-full pulse-dot"></span>
                BREAKING
              </span>
            )}
            <span className={`${isLive ? (categoryMap[hero.source]?.badge || 'bg-ms-accent/15 text-ms-accent') : `badge-${hero.category}`} text-xs px-2.5 py-1 rounded-full font-medium`}>
              {isLive ? (categoryMap[hero.source]?.label || hero.source) : hero.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-syne font-extrabold text-2xl md:text-3xl lg:text-4xl text-[var(--text-primary)] leading-snug md:leading-tight mb-4 tracking-tight group-hover:text-ms-accent transition-colors">
            {hero.title}
          </h1>

          {/* Description */}
          <p className="font-dm font-light text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-6 max-w-2xl line-clamp-3">
            {hero.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] font-dm">
            <span>{isLive ? timeAgo(hero.pubDate) : hero.date}</span>
            <span>•</span>
            <span>{isLive ? 'From Microsoft' : hero.readTime}</span>
            <span className="text-ms-accent opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
              Read full article →
            </span>
          </div>
        </a>

        {/* Side cards */}
        <div className="flex flex-col gap-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-ms-card rounded-xl border border-[var(--border)] p-4 animate-pulse">
                <div className="h-3 w-16 bg-ms-navy rounded mb-3"></div>
                <div className="h-4 w-full bg-ms-navy rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-ms-navy rounded mb-2"></div>
                <div className="h-3 w-20 bg-ms-navy rounded"></div>
              </div>
            ))
          ) : (
            sideItems.map((article, i) => (
              <a
                key={i}
                href={isLive ? article.link : `/${article.category}/${article.slug}`}
                target={isLive ? '_blank' : '_self'}
                rel={isLive ? 'noopener noreferrer' : undefined}
                className="group bg-ms-card rounded-xl border border-[var(--border)] p-4 hover:border-ms-blue/40 transition-all duration-200 hover:-translate-y-0.5 block"
              >
                <span className={`${isLive ? (categoryMap[article.source]?.badge || 'bg-ms-accent/15 text-ms-accent') : `badge-${article.category}`} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                  {isLive ? (categoryMap[article.source]?.label || article.source) : article.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <h3 className="font-syne font-bold text-sm text-[var(--text-primary)] mt-2 mb-1 leading-snug line-clamp-2 tracking-tight group-hover:text-ms-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-dm">
                  {isLive ? timeAgo(article.pubDate) : article.date}
                </p>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
