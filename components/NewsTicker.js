'use client'

import { useState, useEffect } from 'react'
import { newsArticles } from '../data/news'

export default function NewsTicker() {
  const [items, setItems] = useState(
    newsArticles.slice(0, 12).map(a => ({ title: a.title, link: `/${a.category}/${a.slug}`, external: false }))
  )

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch('/api/feed')
        const data = await res.json()
        if (data.articles?.length > 0) {
          setItems(data.articles.slice(0, 15).map(a => ({ title: a.title, link: a.link, external: true })))
        }
      } catch {}
    }
    fetchLive()
  }, [])

  return (
    <section className="bg-ms-navy border-y border-[var(--border)] overflow-hidden my-6">
      <div className="flex items-center">
        {/* LIVE label */}
        <div className="shrink-0 flex items-center gap-1.5 bg-ms-red px-4 py-2.5 z-10">
          <span className="w-2 h-2 bg-white rounded-full pulse-dot"></span>
          <span className="text-white text-xs font-bold tracking-wider">LIVE</span>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="ticker-animate inline-flex items-center">
            {[...items, ...items].map((item, i) => (
              <a
                key={i}
                href={item.link}
                target={item.external ? '_blank' : '_self'}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center text-sm text-[var(--text-secondary)] px-6 hover:text-ms-accent transition-colors"
              >
                <span className="text-ms-accent mr-2">●</span>
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
