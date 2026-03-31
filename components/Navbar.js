'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const navCategories = [
  { name: 'All', href: '/' },
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
  const [translateOpen, setTranslateOpen] = useState(false)

  useEffect(() => {
    // Close translate dropdown when clicking outside
    const handleClick = (e) => {
      if (!e.target.closest('.translate-wrapper')) {
        setTranslateOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-ms-dark/80 backdrop-blur-xl border-b border-[rgba(0,120,212,0.18)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
              <div className="bg-[#F25022] rounded-sm"></div>
              <div className="bg-[#7FBA00] rounded-sm"></div>
              <div className="bg-[#00A4EF] rounded-sm"></div>
              <div className="bg-[#FFB900] rounded-sm"></div>
            </div>
            <span className="font-syne font-bold text-sm md:text-base text-[var(--text-primary)]">
              Microsoft Updates
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Translate button */}
            <div className="translate-wrapper relative">
              <button
                onClick={() => setTranslateOpen(!translateOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-ms-card border border-[var(--border)] hover:border-ms-blue/40 transition-colors"
                aria-label="Translate page"
                title="Translate page"
              >
                <svg className="w-5 h-5 text-ms-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.913 17H20.087M12.913 17L11 21M12.913 17L16.5 9L20.087 17M2 5H14M8 1V5M4.5 5C5.372 8.221 7.56 10.996 10.38 12.87M11.5 14.5C9.732 13.392 8.193 11.867 7.042 10" />
                </svg>
              </button>
              {translateOpen && (
                <div className="absolute right-0 top-full mt-2 bg-ms-card border border-[var(--border)] rounded-xl p-3 shadow-2xl shadow-black/40 z-50 min-w-[200px]">
                  <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">Translate this page</p>
                  <div id="google_translate_element"></div>
                </div>
              )}
            </div>
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
              className="px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-ms-accent hover:bg-ms-card rounded-md transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-ms-dark/95 backdrop-blur-xl">
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
  )
}
