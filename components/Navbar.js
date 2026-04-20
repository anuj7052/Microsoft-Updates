'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Logo from './Logo'

function makeSlug(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80)
    .replace(/-$/, '')
}

const NAV_LINKS = [
  { href: '/',                label: 'Home' },
  { href: '/live',            label: 'Live Feed' },
  { href: '/azure',           label: 'Cloud' },
  { href: '/power-platform',  label: 'Power Platform' },
  { href: '/fabric',          label: 'Fabric' },
]

const MORE_LINKS = [
  { href: '/windows',    label: 'Windows' },
  { href: '/copilot',    label: 'Copilot & AI' },
  { href: '/office365',  label: 'Office 365' },
  { href: '/security',   label: 'Security' },
  { href: '/licensing',  label: 'Licensing' },
]

export default function Navbar() {
  const brandRef    = useRef(null)
  const rafRef      = useRef(null)
  const mouseRef    = useRef({ x: 0, y: 0 })
  const inputRef    = useRef(null)
  const dropdownRef = useRef(null)
  const moreRef     = useRef(null)

  const [query, setQuery]           = useState('')
  const [results, setResults]       = useState([])
  const [isLoading, setIsLoading]   = useState(false)
  const [showDrop, setShowDrop]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [moreOpen, setMoreOpen]     = useState(false)

  const router   = useRouter()
  const pathname = usePathname()

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── close mobile + more on route change ── */
  useEffect(() => { setMobileOpen(false); setMoreOpen(false) }, [pathname])

  /* ── variable-font cursor effect ── */
  useEffect(() => {
    const onMove  = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onTouch = (e) => { const t = e.touches[0]; mouseRef.current = { x: t.clientX, y: t.clientY } }
    window.addEventListener('mousemove', onMove,  { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])
  useEffect(() => {
    const animate = () => {
      if (brandRef.current) {
        const h = window.innerHeight || 1
        const w = window.innerWidth  || 1
        const yP = Math.max(0, Math.min(1, mouseRef.current.y / h))
        const xP = Math.max(0, Math.min(1, mouseRef.current.x / w))
        brandRef.current.style.fontVariationSettings =
          `'wght' ${Math.round(300 + yP * 500)}, 'opsz' ${parseFloat((8 + xP * 40).toFixed(1))}`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  /* ── debounced search ── */
  useEffect(() => {
    if (!query.trim()) { setResults([]); setShowDrop(false); return }
    setIsLoading(true)
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(d => { setResults(Array.isArray(d) ? d.slice(0, 6) : []); setShowDrop(true) })
        .catch(() => setResults([]))
        .finally(() => setIsLoading(false))
    }, 320)
    return () => clearTimeout(t)
  }, [query])

  /* ── close dropdowns on outside click ── */
  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDrop(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    const h = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) { setShowDrop(false); router.push(`/?q=${encodeURIComponent(query.trim())}`) }
  }
  const clearSearch = () => { setQuery(''); setResults([]); setShowDrop(false); inputRef.current?.focus() }
  const isActive = (href) => href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  return (
    /* ── outer wrapper: centres & constrains the floating pill ── */
    <div className="fixed top-4 left-0 right-0 z-50 px-3 sm:px-5 pointer-events-none">
      <div
        className={`
          pointer-events-auto
          mx-auto max-w-[1500px]
          flex flex-col
          rounded-3xl
          border border-white/25
          shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]
          transition-all duration-300
          ${scrolled
            ? 'bg-white/80 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.08)]'
            : 'bg-white/60 backdrop-blur-xl'}
        `}
      >
        {/* ── main row ── */}
        <div className="flex items-center h-[72px] px-6 gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2 group" aria-label="Powertool home">
            <div className="group-hover:scale-105 transition-transform duration-200">
              <Logo size={28} />
            </div>
            <span
              ref={brandRef}
              className="font-oi text-[18px] sm:text-[22px] leading-none tracking-tight text-[#191c1d] select-none"
              style={{ fontVariationSettings: "'wght' 400, 'opsz' 24" }}
            >
              Power<span className="text-[#0078d4]">tool</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href)
              const isLive = href === '/live'
              return (
                <Link key={href} href={href}
                  className={`relative px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isLive
                      ? active
                        ? 'text-red-700 bg-red-50/80'
                        : 'text-red-400 hover:text-red-600 hover:bg-red-50/60'
                      : active
                        ? 'text-[#0078d4] bg-blue-50/80'
                        : 'text-[#475569] hover:text-[#191c1d] hover:bg-black/5'
                  }`}>
                  {label}
                  {active && <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full ${isLive ? 'bg-red-700' : 'bg-[#0078d4]'}`} />}
                </Link>
              )
            })}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(v => !v)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  MORE_LINKS.some(l => isActive(l.href))
                    ? 'text-[#0078d4] bg-blue-50/80'
                    : 'text-[#475569] hover:text-[#191c1d] hover:bg-black/5'
                }`}
              >
                More
                <span
                  className="material-symbols-outlined transition-transform duration-200"
                  style={{ fontSize: '16px', fontVariationSettings: "'FILL' 0", transform: moreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </button>

              {moreOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-white/95 backdrop-blur-xl border border-black/8 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50">
                  {MORE_LINKS.map(({ href, label }) => {
                    const active = isActive(href)
                    return (
                      <Link key={href} href={href}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-colors border-b border-black/5 last:border-0 ${
                          active ? 'text-[#0078d4] bg-blue-50/60' : 'text-[#475569] hover:text-[#191c1d] hover:bg-black/4'
                        }`}
                      >
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#0078d4] shrink-0" />}
                        {!active && <span className="w-1.5 h-1.5 shrink-0" />}
                        {label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Create Post button */}
          <Link href="/create-post"
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200 border ${
              isActive('/create-post')
                ? 'bg-[#0078d4] text-white border-[#0078d4]'
                : 'bg-white border-[#0078d4]/40 text-[#0078d4] hover:bg-blue-50'
            }`}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            Create Post
          </Link>

          {/* Search */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none select-none"
                  style={{ fontSize: '16px', fontVariationSettings: "'FILL' 0" }}>search</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => results.length > 0 && setShowDrop(true)}
                  placeholder="Search..."
                  className="w-56 lg:w-80 h-9 pl-9 pr-8 bg-black/5 border border-black/8 rounded-xl text-sm text-[#191c1d] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0078d4]/20 focus:border-[#0078d4]/40 focus:bg-white/80 transition-all duration-200"
                />
                {query && !isLoading && (
                  <button type="button" onClick={clearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                  </button>
                )}
                {isLoading && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <div className="w-3.5 h-3.5 border-2 border-[#0078d4] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </form>

            {showDrop && results.length > 0 && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-white/90 backdrop-blur-xl border border-black/8 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50">
                {results.map((item, i) => (
                  <Link key={i} href={`/live/${item.slug || makeSlug(item.title)}`}
                    onClick={() => { setShowDrop(false); setQuery('') }}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50/60 transition-colors border-b border-black/5 last:border-0">
                    <span className="material-symbols-outlined text-[#94a3b8] mt-0.5 shrink-0"
                      style={{ fontSize: '14px', fontVariationSettings: "'FILL' 0" }}>article</span>
                    <span className="text-[13px] text-[#191c1d] line-clamp-2 leading-snug">{item.title}</span>
                  </Link>
                ))}
                <div className="px-4 py-2 border-t border-black/5">
                  <button onClick={handleSubmit} className="text-xs text-[#0078d4] font-medium hover:underline">
                    See all results →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden p-2 rounded-xl text-[#475569] hover:text-[#191c1d] hover:bg-black/5 transition-all duration-200"
            aria-label="Toggle menu">
            <span className="material-symbols-outlined" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 0" }}>
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* ── Mobile nav ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-black/8 px-3 py-2 flex flex-col gap-0.5">
            {[...NAV_LINKS, ...MORE_LINKS, { href: '/create-post', label: 'Create Post' }].map(({ href, label }) => {
              const active = isActive(href)
              const isLive = href === '/live'
              return (
                <Link key={href} href={href}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isLive
                      ? active
                        ? 'bg-red-50/80 text-red-700'
                        : 'text-red-400 hover:bg-red-50/60 hover:text-red-600'
                      : active
                        ? 'bg-blue-50/80 text-[#0078d4]'
                        : 'text-[#475569] hover:bg-black/5 hover:text-[#191c1d]'
                  }`}>
                  {label}
                </Link>
              )
            })}
            {/* Mobile search */}
            <form onSubmit={handleSubmit} className="px-1 py-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none"
                  style={{ fontSize: '16px', fontVariationSettings: "'FILL' 0" }}>search</span>
                <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-9 pl-9 pr-4 bg-black/5 border border-black/8 rounded-xl text-sm text-[#191c1d] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0078d4]/20 focus:border-[#0078d4]/40 transition-all" />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
