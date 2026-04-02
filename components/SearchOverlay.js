'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

function makeSlug(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [allItems, setAllItems] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()

    // Load live-updates data for searching
    fetch('/api/feed')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAllItems(data)
        else if (data.articles) setAllItems(data.articles)
        else if (data.items) setAllItems(data.items)
      })
      .catch(() => {})

    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const filtered = allItems.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.summary && item.summary.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.feedCategory && item.feedCategory.toLowerCase().includes(q)) ||
        (item.source && item.source.toLowerCase().includes(q))
    ).slice(0, 8)
    setResults(filtered)
  }, [query, allItems])

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl mx-4 rounded-2xl border border-[var(--border)] overflow-hidden"
        style={{ background: 'var(--ms-navy)', boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(168,85,247,0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
          <svg className="w-5 h-5 text-[var(--text-muted)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search updates... (Esc to close)"
            className="flex-1 bg-transparent text-[var(--text-primary)] text-base font-dm outline-none placeholder:text-[var(--text-muted)]"
          />
          <kbd className="text-[10px] text-[var(--text-muted)] border border-[var(--border)] rounded px-1.5 py-0.5 font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query && results.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-[var(--text-muted)] font-dm">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
          {results.map((item, i) => {
            const slug = item.slug || makeSlug(item.title)
            return (
              <Link
                key={i}
                href={`/live/${slug}`}
                onClick={onClose}
                className="flex items-start gap-3 px-5 py-3 hover:bg-[rgba(168,85,247,0.06)] transition-colors border-b border-[var(--border)] last:border-0"
              >
                {item.image && (
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-syne font-bold text-sm text-[var(--text-primary)] leading-snug line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 font-dm">
                    {(item.category || item.feedCategory || '')?.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    {(item.date || item.pubDate) && ` · ${new Date(item.date || item.pubDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                  </p>
                </div>
                <svg className="w-4 h-4 text-[var(--text-muted)] mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )
          })}
        </div>

        {/* Footer hint */}
        {!query && (
          <div className="px-5 py-4 text-xs text-[var(--text-muted)] font-dm border-t border-[var(--border)]">
            Type to search across all Microsoft updates, articles, and categories.
          </div>
        )}
      </div>
    </div>
  )
}
