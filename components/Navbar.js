'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

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
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-[var(--border)]" style={{ backgroundColor: 'color-mix(in srgb, var(--ms-dark) 80%, transparent)' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
              <rect x="0" y="0" width="10" height="10" fill="#F25022" />
              <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
              <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
              <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
            </svg>
            <span className="font-syne font-bold text-sm md:text-base text-[var(--text-primary)]">
              Microsoft Updates
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />
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
                <div className="absolute right-0 top-full mt-2 bg-ms-card border border-[var(--border)] rounded-xl p-3 shadow-2xl shadow-black/40 z-50 min-w-[220px]">
                  <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">Translate this page</p>
                  <select
                    className="w-full bg-ms-navy text-[var(--text-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm cursor-pointer outline-none hover:border-ms-blue/60 transition-colors"
                    onChange={(e) => {
                      const lang = e.target.value
                      if (!lang) return
                      // Set Google Translate cookie and reload
                      document.cookie = `googtrans=/en/${lang};path=/;`
                      document.cookie = `googtrans=/en/${lang};path=/;domain=${window.location.hostname}`
                      window.location.reload()
                    }}
                    defaultValue=""
                  >
                    <option value="">Select Language</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="gu">ગુજરાતી (Gujarati)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="ml">മലയാളം (Malayalam)</option>
                    <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                    <option value="ur">اردو (Urdu)</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                    <option value="de">Deutsch (German)</option>
                    <option value="ja">日本語 (Japanese)</option>
                    <option value="zh-CN">中文 (Chinese)</option>
                    <option value="ar">العربية (Arabic)</option>
                    <option value="pt">Português (Portuguese)</option>
                    <option value="ru">Русский (Russian)</option>
                    <option value="ko">한국어 (Korean)</option>
                  </select>
                  <button
                    className="w-full mt-2 text-xs text-ms-accent hover:underline text-left"
                    onClick={() => {
                      document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;'
                      document.cookie = `googtrans=;path=/;domain=${window.location.hostname};expires=Thu, 01 Jan 1970 00:00:00 UTC;`
                      window.location.reload()
                    }}
                  >
                    ↩ Back to English
                  </button>
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
  )
}
