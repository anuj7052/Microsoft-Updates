'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import SearchOverlay from './SearchOverlay'

const navCategories = [
  { name: 'All', href: '/' },
  { name: 'Live Updates', href: '/live' },
  { name: 'Windows', href: '/windows' },
  { name: 'Azure', href: '/azure' },
  { name: 'Power Platform', href: '/power-platform' },
  { name: 'Microsoft Fabric', href: '/fabric' },
  { name: 'Licensing', href: '/licensing' },
  { name: 'Copilot/AI', href: '/copilot' },
  { name: 'Office 365', href: '/office365' },
  { name: 'Security', href: '/security' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-xl" style={{ background:'rgba(8,7,15,0.85)', borderBottom:'1px solid rgba(168,85,247,0.15)', boxShadow:'0 1px 40px rgba(168,85,247,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <Logo size={32} />
              <div className="flex flex-col leading-none">
                <span className="font-syne font-bold text-sm md:text-[15px] tracking-tight" style={{background:'linear-gradient(90deg,#C084FC,#22D3EE)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  Latest Microsoft Updates &amp; News
                </span>
                <span className="text-[9px] text-[var(--text-muted)] font-dm tracking-wide hidden md:block">
                  Independent Updates Blog
                </span>
              </div>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[rgba(168,85,247,0.4)] transition-colors"
                title="Search (Cmd+K)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-[11px] font-dm hidden md:inline">Search</span>
                <kbd className="text-[9px] border border-[var(--border)] rounded px-1 py-0.5 font-mono hidden md:inline">⌘K</kbd>
              </button>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Category links - desktop */}
          <div className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
            {navCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[#C084FC] hover:bg-[rgba(168,85,247,0.08)] rounded-md transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--border)] backdrop-blur-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--ms-dark) 95%, transparent)' }}>
            <div className="px-4 py-3 space-y-1">
              {navCategories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-ms-accent hover:bg-ms-card rounded-md transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}
