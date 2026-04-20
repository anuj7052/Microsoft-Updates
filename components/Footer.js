'use client'

import Link from 'next/link'
import { useRef, useEffect } from 'react'

function FooterBrand() {
  const containerRef = useRef(null)
  const brandRef     = useRef(null)
  const vLineRef     = useRef(null)
  const hLineRef     = useRef(null)
  const dotRef       = useRef(null)
  const xLabelRef    = useRef(null)
  const yLabelRef    = useRef(null)
  const mouseRef     = useRef({ x: 0, y: 0, inside: false })
  const rafRef       = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.inside = true
    }
    const onEnter = () => { mouseRef.current.inside = true }
    const onLeave = () => { mouseRef.current.inside = false }

    el.addEventListener('mousemove',  onMove,  { passive: true })
    el.addEventListener('mouseenter', onEnter, { passive: true })
    el.addEventListener('mouseleave', onLeave, { passive: true })
    return () => {
      el.removeEventListener('mousemove',  onMove)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      const { x, y, inside } = mouseRef.current
      const container = containerRef.current

      // ── visibility toggle ─────────────────────────────────────────
      const vis = inside ? 'block' : 'none'
      if (vLineRef.current)  vLineRef.current.style.display  = vis
      if (hLineRef.current)  hLineRef.current.style.display  = vis
      if (dotRef.current)    dotRef.current.style.display    = vis
      if (xLabelRef.current) xLabelRef.current.style.display = vis
      if (yLabelRef.current) yLabelRef.current.style.display = vis

      if (inside && container) {
        const { width, height } = container.getBoundingClientRect()

        // ── crosshair lines ────────────────────────────────────────
        if (vLineRef.current) vLineRef.current.style.left = `${x}px`
        if (hLineRef.current) hLineRef.current.style.top  = `${y}px`

        // ── dot ───────────────────────────────────────────────────
        if (dotRef.current) {
          dotRef.current.style.left = `${x}px`
          dotRef.current.style.top  = `${y}px`
        }

        // ── x/y labels ────────────────────────────────────────────
        if (xLabelRef.current) xLabelRef.current.textContent = `x: ${Math.round(x)}`
        if (yLabelRef.current) yLabelRef.current.textContent = `y: ${Math.round(y)}`

        // ── font variation ────────────────────────────────────────
        if (brandRef.current) {
          const yP   = Math.max(0, Math.min(1, y / (height || 1)))
          const wght = Math.round(100 + yP * 800)
          brandRef.current.style.fontVariationSettings = `'wght' ${wght}`
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden py-24 flex items-center justify-center select-none cursor-none bg-transparent"
    >
      {/* Vertical crosshair line */}
      <div
        ref={vLineRef}
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        style={{ display: 'none', left: 0, background: 'rgba(25,28,29,0.15)' }}
      />
      {/* Horizontal crosshair line */}
      <div
        ref={hLineRef}
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ display: 'none', top: 0, background: 'rgba(25,28,29,0.15)' }}
      />
      {/* Cursor dot */}
      <div
        ref={dotRef}
        className="absolute pointer-events-none"
        style={{
          display: 'none',
          width: '8px', height: '8px',
          background: '#191c1d',
          borderRadius: '2px',
          transform: 'translate(-50%, -50%)',
          left: 0, top: 0,
        }}
      />
      {/* x/y readout — bottom left */}
      <div className="absolute bottom-5 left-6 flex flex-col gap-0.5 pointer-events-none">
        <span
          ref={xLabelRef}
          className="font-grotesk tabular-nums"
          style={{ display: 'none', fontSize: '11px', color: 'rgba(25,28,29,0.35)', fontVariationSettings: "'wght' 400" }}
        >
          x: 0
        </span>
        <span
          ref={yLabelRef}
          className="font-grotesk tabular-nums"
          style={{ display: 'none', fontSize: '11px', color: 'rgba(25,28,29,0.35)', fontVariationSettings: "'wght' 400" }}
        >
          y: 0
        </span>
      </div>

      {/* Social icons — top right */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
          className="text-[#191c1d]/40 hover:text-[#191c1d]/80 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
          </svg>
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
          className="text-[#191c1d]/40 hover:text-[#191c1d]/80 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.987V9h3.102v1.561h.046c.432-.818 1.487-1.681 3.061-1.681 3.273 0 3.876 2.154 3.876 4.957v6.615zM5.337 7.433a1.8 1.8 0 110-3.601 1.8 1.8 0 010 3.601zM6.969 20.452H3.7V9h3.27v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X"
          className="text-[#191c1d]/40 hover:text-[#191c1d]/80 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>

      {/* Copyright — bottom right */}
      <div className="absolute bottom-5 right-6 pointer-events-none">
        <span className="font-grotesk text-[11px] text-[#191c1d]/35 tabular-nums"
          style={{ fontVariationSettings: "'wght' 400", fontStyle: 'normal' }}>
          © {new Date().getFullYear()} PowerTool. All rights reserved.
        </span>
      </div>

      {/* Background scattered Microsoft app logos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {[
          // Windows logo
          { x: '5%',  y: '15%', rotate: -12, opacity: 0.25, svg: <svg viewBox="0 0 88 88" fill="none"><path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L.019 75.48l-.003-29.978zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349l-.011 41.34-47.318-6.677-.066-34.739z" fill="#00ADEF"/></svg> },
          // Word
          { x: '14%', y: '68%', rotate: 8,   opacity: 0.25, svg: <svg viewBox="0 0 24 24"><path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3z" fill="#2B7CD3"/><path d="M8 7.5l1.5 6 1.5-4.5 1.5 4.5 1.5-6H15l-2.5 9h-1L10 12l-1.5 4.5h-1L5 7.5z" fill="white"/></svg> },
          // Excel
          { x: '22%', y: '28%', rotate: -6,  opacity: 0.25, svg: <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="2" fill="#217346"/><path d="M7 7.5l2.5 4-2.5 4h1.8l1.7-2.8 1.7 2.8H14l-2.5-4 2.5-4h-1.8L10.5 10.3 8.8 7.5z" fill="white"/></svg> },
          // Teams
          { x: '30%', y: '80%', rotate: 15,  opacity: 0.22, svg: <svg viewBox="0 0 24 24"><path d="M20 4h-3V3a2 2 0 00-4 0v1H7a1 1 0 00-1 1v12a1 1 0 001 1h13a1 1 0 001-1V5a1 1 0 00-1-1zm-7 10.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" fill="#6264A7"/><circle cx="13" cy="11" r="2" fill="white"/></svg> },
          // Outlook
          { x: '40%', y: '12%', rotate: -20, opacity: 0.25, svg: <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="2" fill="#0078D4"/><path d="M13 7h7v2H13zm0 3h7v2H13zm0 3h5v2H13zM4 7h7a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" fill="#0078D4"/><ellipse cx="7.5" cy="12" rx="2.5" ry="3" fill="white"/></svg> },
          // OneDrive
          { x: '50%', y: '72%', rotate: 5,   opacity: 0.22, svg: <svg viewBox="0 0 24 24"><path d="M10.5 18H7a4 4 0 01-.5-7.96A6 6 0 0118 12h.5a3.5 3.5 0 010 7H10.5z" fill="#0364B8"/></svg> },
          // Azure
          { x: '58%', y: '22%', rotate: 18,  opacity: 0.25, svg: <svg viewBox="0 0 24 24"><path d="M13.05 4.24L7.28 17.67l9.57-.01-4.84-5.62 4.6-10.81H9.93L13.05 4.24z" fill="#0089D6"/><path d="M8.93 8.06L5 19.76h6.67l8.33-.1-7-1.99 1.88-4.39L8.93 8.06z" fill="#0089D6" opacity=".8"/></svg> },
          // PowerPoint
          { x: '67%', y: '62%', rotate: -9,  opacity: 0.25, svg: <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="2" fill="#B7472A"/><path d="M8 7h4.5a3 3 0 010 6H10v4H8V7z" fill="white"/><rect x="10" y="9" width="2.5" height="2" rx="1" fill="#B7472A"/></svg> },
          // Edge
          { x: '76%', y: '18%', rotate: 12,  opacity: 0.22, svg: <svg viewBox="0 0 24 24"><path d="M21 9.5C21 6 17.87 3 14 3a8 8 0 00-8 8c0 1.85.63 3.55 1.68 4.9A5 5 0 0112 14h8.5a9 9 0 00.5-2.5c0-.67-.08-1.34-.22-2H12a2 2 0 01-2-2c0-2.21 1.79-4 4-4 2 0 3.7 1.4 4.2 3.3L21 9.5z" fill="#0078D4"/><path d="M3 15a8 8 0 0015.29 3.2A5 5 0 0114 19H7.5A6.5 6.5 0 013 15z" fill="#1BBAEE"/></svg> },
          // Power BI
          { x: '84%', y: '74%', rotate: -15, opacity: 0.25, svg: <svg viewBox="0 0 24 24"><rect x="3"  y="12" width="4" height="9" rx="1" fill="#F2C811"/><rect x="10" y="7"  width="4" height="14" rx="1" fill="#F2C811" opacity=".8"/><rect x="17" y="3"  width="4" height="18" rx="1" fill="#F2C811" opacity=".6"/></svg> },
          // SharePoint
          { x: '91%', y: '35%', rotate: 22,  opacity: 0.22, svg: <svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="6" fill="#036C70"/><circle cx="15" cy="15" r="6" fill="#1A9BA1" opacity=".9"/><circle cx="9"  cy="15" r="4" fill="#37C6D0" opacity=".9"/></svg> },
          // GitHub
          { x: '96%', y: '78%', rotate: -7,  opacity: 0.25, svg: <svg viewBox="0 0 24 24" fill="#191c1d"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.773.004 1.55.105 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg> },
          // Fabric
          { x: '8%',  y: '88%', rotate: 10,  opacity: 0.25, svg: <svg viewBox="0 0 24 24"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" fill="none" stroke="#0078D4" strokeWidth="1.5"/><path d="M12 2l8 4.5-8 4.5-8-4.5z" fill="#0078D4" opacity=".5"/></svg> },
          // Copilot / AI star
          { x: '45%', y: '44%', rotate: -18, opacity: 0.20, svg: <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#7B68EE"/></svg> },
          // Security shield
          { x: '71%', y: '88%', rotate: 6,   opacity: 0.22, svg: <svg viewBox="0 0 24 24"><path d="M12 2l9 4v5c0 5.25-3.83 10.15-9 11.32C6.83 21.15 3 16.25 3 11V6l9-4z" fill="#107C10" opacity=".9"/><path d="M9 11l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/></svg> },
        ].map(({ x, y, rotate, opacity, svg }, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: x, top: y,
              width: '2.2rem', height: '2.2rem',
              opacity,
              transform: `rotate(${rotate}deg)`,
              display: 'block',
            }}
          >
            {svg}
          </span>
        ))}
      </div>

      {/* Brand text + tagline */}
      <div className="flex flex-col items-center gap-3">
        <Link href="/" tabIndex={-1} aria-label="PowerTool home">
          <span
            ref={brandRef}
            className="font-grotesk text-[clamp(3.5rem,12vw,9rem)] leading-none tracking-tighter text-[#191c1d] block"
            style={{ fontVariationSettings: "'wght' 400", fontStyle: 'normal' }}
          >
            PowerTool
          </span>
        </Link>
        <span
          className="font-grotesk text-sm tracking-wide"
          style={{
            display: 'inline-block',
            fontStyle: 'normal',
            fontVariationSettings: "'wght' 500",
            background: 'linear-gradient(90deg, #F25022 0%, #FFB900 33%, #7FBA00 66%, #00A4EF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Your all-in-one place for the latest Microsoft updates
        </span>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      className="border-t border-white/30"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(139,92,246,0.10) 0%, transparent 60%),' +
          'radial-gradient(ellipse 60% 50% at 90% 5%, rgba(59,130,246,0.09) 0%, transparent 55%),' +
          'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(14,165,233,0.08) 0%, transparent 50%),' +
          'linear-gradient(160deg, #f5f3ff 0%, #eff6ff 35%, #f0f9ff 65%, #fafafa 100%)',
      }}
    >
      {/* ── Variable-font brand hero ── */}
      <FooterBrand />
    </footer>
  )
}
