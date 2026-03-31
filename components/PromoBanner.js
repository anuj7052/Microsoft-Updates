'use client'

import { useState, useEffect } from 'react'

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const closed = sessionStorage.getItem('promo_dismissed')
    if (!closed) setDismissed(false)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('promo_dismissed', '1')
  }

  if (dismissed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-ms-navy via-ms-card to-ms-navy rounded-2xl border border-ms-accent/30 p-4 md:p-5 shadow-2xl shadow-ms-accent/10 backdrop-blur-sm">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-lg"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* App Promo */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-3xl">💜</span>
            <div>
              <p className="font-syne font-bold text-sm text-[var(--text-primary)]">
                Try <span className="text-ms-accent">Only4You</span> App
              </p>
              <p className="text-xs text-[var(--text-muted)] font-dm">
                An exclusive app built just for you — check it out now!
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="https://only4you-app.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ms-accent hover:bg-ms-accent/80 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all font-syne whitespace-nowrap"
            >
              Open App →
            </a>
            <a
              href="https://youtube.com/@its_anujsinghh?si=IjM_Vp3iu4tbTW2i&sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF0000] hover:bg-[#CC0000] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all font-syne flex items-center gap-1.5 whitespace-nowrap"
            >
              ▶ Subscribe
            </a>
            <a
              href="https://www.linkedin.com/in/anuj-singh-46140116a/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0077B5] hover:bg-[#005885] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all font-syne whitespace-nowrap hidden md:inline-block"
            >
              💼 Connect
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
