'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

/* ── LinkedIn SVG ─────────────────────────────────────────────────────────── */
const LiIcon = ({ size = 16 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

/* ── Section SVG logos (inline, no external dependencies) ────────────────── */
const AzureLogo = () => (
  <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <defs>
      <linearGradient id="az1" x1="-.49" y1="71.17" x2="56.54" y2="2.86" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#114a8b"/>
        <stop offset="1" stopColor="#0669bc"/>
      </linearGradient>
      <linearGradient id="az2" x1="37.93" y1="46.56" x2="51.66" y2="51.23" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopOpacity=".3"/>
        <stop offset=".07" stopOpacity=".2"/>
        <stop offset=".32" stopOpacity=".1"/>
        <stop offset=".62" stopOpacity=".05"/>
        <stop offset="1" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="az3" x1="11.87" y1="73.79" x2="68.48" y2="6.03" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#3ccbf4"/>
        <stop offset="1" stopColor="#2892df"/>
      </linearGradient>
    </defs>
    <path d="M33.34 6.54h26.04L33.74 89.09a4.15 4.15 0 0 1-3.93 2.82H8.17a4.14 4.14 0 0 1-3.92-5.47L27.41 9.36a4.15 4.15 0 0 1 3.93-2.82z" fill="url(#az1)"/>
    <path d="M67.76 60.68H29.51a1.91 1.91 0 0 0-1.3 3.31l24.69 23.04a4.17 4.17 0 0 0 2.84 1.12h21.72z" fill="#0078d4"/>
    <path d="M33.34 6.54a4.1 4.1 0 0 0-3.94 2.86L4.29 86.39a4.13 4.13 0 0 0 3.9 5.52h22.23a4.44 4.44 0 0 0 3.4-2.9l5.35-15.77 19.13 17.82a4.24 4.24 0 0 0 2.67.93h23.29l-10.22-29.22-29.75.01L59.4 6.54z" fill="url(#az2)"/>
    <path d="M68.59 9.36a4.14 4.14 0 0 0-3.93-2.82H33.65a4.14 4.14 0 0 1 3.93 2.82l23.16 77.08a4.14 4.14 0 0 1-3.93 5.47h31.01a4.14 4.14 0 0 0 3.93-5.47z" fill="url(#az3)"/>
  </svg>
)

const PowerPlatformLogo = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M16 2L2 9l14 7 14-7z" fill="#742774"/>
    <path d="M2 9v14l14 7V16z" fill="#AE4DA0"/>
    <path d="M30 9v14l-14 7V16z" fill="#C55FA6"/>
    <path d="M16 2l14 7-14 7L2 9z" fill="#BF5EAF" opacity=".5"/>
  </svg>
)

const FabricLogo = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <rect width="32" height="32" rx="4" fill="#7B3FE4"/>
    <path d="M8 8h7v7H8zm9 0h7v7h-7zm0 9h7v7h-7zM8 17h7v7H8z" fill="white" opacity=".9"/>
    <path d="M12 20l4-4 4 4" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const WindowsLogo = () => (
  <svg viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.453L.028 75.48l-.01-29.8zm4.327-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349l-.011 41.34-47.318-6.678-.066-34.739z" fill="#00ADEF"/>
  </svg>
)

const CopilotLogo = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <defs>
      <linearGradient id="cp1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7B5EA7"/>
        <stop offset="1" stopColor="#00B4F0"/>
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="15" fill="url(#cp1)"/>
    <path d="M10 11c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2.5-1.5 4.6-3.7 5.5L20 27h-8l1.7-10.5C11.5 15.6 10 13.5 10 11z" fill="white" opacity=".9"/>
    <circle cx="16" cy="11" r="3" fill="url(#cp1)"/>
  </svg>
)

const Office365Logo = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <defs>
      <linearGradient id="o3651" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#DC3E15"/>
        <stop offset="1" stopColor="#B02E0C"/>
      </linearGradient>
    </defs>
    <path d="M19 4L3 8v16l16 4V4z" fill="url(#o3651)"/>
    <path d="M19 4l10 3v18l-10 3V4z" fill="#DC3E15" opacity=".7"/>
    <path d="M8 12a6 6 0 1 0 0 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const SecurityLogo = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M16 2L4 7v9c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V7L16 2z" fill="#107C10"/>
    <path d="M11 16l3.5 3.5L21 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LicensingLogo = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <rect x="3" y="4" width="26" height="24" rx="3" fill="#605E5C"/>
    <rect x="3" y="4" width="26" height="7" rx="3" fill="#323130"/>
    <path d="M9 17h14M9 21h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="23" cy="21" r="2.5" fill="#FFD700"/>
    <path d="M22.3 21l.7.7 1.3-1.4" fill="none" stroke="#323130" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SECTION_LOGO = {
  azure:            AzureLogo,
  windows:          WindowsLogo,
  copilot:          CopilotLogo,
  office365:        Office365Logo,
  'power-platform': PowerPlatformLogo,
  fabric:           FabricLogo,
  security:         SecurityLogo,
  licensing:        LicensingLogo,
}

/* ── Section colour config ────────────────────────────────────────────────── */
const SECTION_STYLE = {
  azure:            { accent: '#0078D4', lightBg: '#e8f3fd', badge: 'Cloud (Azure)'    },
  windows:          { accent: '#00ADEF', lightBg: '#e6f6fd', badge: 'Windows'          },
  copilot:          { accent: '#7B5EA7', lightBg: '#f0ecf7', badge: 'Copilot & AI'     },
  office365:        { accent: '#DC3E15', lightBg: '#fdeee9', badge: 'Office 365'        },
  'power-platform': { accent: '#742774', lightBg: '#f3e8f9', badge: 'Power Platform'   },
  fabric:           { accent: '#7B3FE4', lightBg: '#ede8fd', badge: 'Microsoft Fabric' },
  security:         { accent: '#107C10', lightBg: '#e8f5e8', badge: 'Security'         },
  licensing:        { accent: '#605E5C', lightBg: '#f0eeee', badge: 'Licensing'        },
}

/* ── Character counter ring ───────────────────────────────────────────────── */
function CharRing({ count, max = 3000 }) {
  const over  = count > max
  const pct   = Math.min(count / max, 1)
  const r     = 10
  const circ  = 2 * Math.PI * r
  const color = over ? '#ba1a1a' : pct > 0.85 ? '#D83B01' : '#0060ab'
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-mono tabular-nums ${over ? 'text-[#ba1a1a]' : pct > 0.85 ? 'text-[#D83B01]' : 'text-on-surface-variant'}`}>
        {count.toLocaleString()}&thinsp;/&thinsp;{max.toLocaleString()}
      </span>
      <svg width="26" height="26" viewBox="0 0 26 26" className="-rotate-90">
        <circle cx="13" cy="13" r={r} fill="none" stroke="#e1e3e4" strokeWidth="2.5" />
        <circle cx="13" cy="13" r={r} fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.2s, stroke 0.2s' }} />
      </svg>
    </div>
  )
}

/* ── Article card ─────────────────────────────────────────────────────────── */
function ArticleCard({ article, sectionId, onSelect, loading }) {
  const style     = SECTION_STYLE[sectionId]
  const Logo      = SECTION_LOGO[sectionId]
  const isLoading = loading === article.slug
  const dateStr   = article.date
    ? (() => { try { return new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) } catch { return '' } })()
    : ''

  return (
    <div
      className="group flex-shrink-0 w-64 sm:w-72 text-left rounded-2xl border border-surface-container-highest bg-surface-container-lowest overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 shadow-sm"
      onMouseEnter={e => { e.currentTarget.style.borderColor = style.accent + '80' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '' }}
    >
      {/* Clickable area → generates post */}
      <button
        onClick={() => onSelect(article)}
        disabled={!!loading}
        className="w-full text-left disabled:opacity-60 disabled:cursor-wait"
      >
      {/* Thumbnail */}
      <div className="h-36 overflow-hidden relative" style={{ background: style.lightBg }}>
        {article.image
          ? <img src={article.image} alt="" className="w-full h-full object-cover" loading="lazy" />
          : (
            <div className="w-full h-full flex items-center justify-center opacity-20" style={{ color: style.accent }}>
              <Logo />
            </div>
          )
        }
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="w-7 h-7 rounded-full border-[3px] border-[#e1e3e4] animate-spin" style={{ borderTopColor: style.accent }} />
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: style.accent }}>
            <span className="opacity-80 scale-75 inline-flex"><Logo /></span>
            {style.badge}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-2 flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </p>
        <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">{article.description}</p>
        <div className="flex items-center justify-between mt-1">
          {dateStr && <span className="text-[10px] text-on-surface-variant">{dateStr}</span>}
          <span className="ml-auto text-[11px] font-semibold" style={{ color: style.accent }}>
            {isLoading ? 'Generating…' : 'Create post →'}
          </span>
        </div>
      </div>
      </button>

      {/* Footer: open article link */}
      {article.url && (
        <div className="px-4 pb-3">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[11px] font-semibold border transition-colors hover:bg-surface-container"
            style={{ color: style.accent, borderColor: style.accent + '40' }}
          >
            Open article ↗
          </a>
        </div>
      )}
    </div>
  )
}

/* ── Review Modal ─────────────────────────────────────────────────────────── */
function ReviewModal({ article, post, setPost, onClose, sectionId, thumbnail }) {
  const [copied,      setCopied]      = useState(false)
  const [hinted,      setHinted]      = useState(false)
  const [imgCopied,   setImgCopied]   = useState(false)
  const [downloadImg, setDownloadImg] = useState(true)
  const style  = SECTION_STYLE[sectionId] || SECTION_STYLE.azure
  const Logo   = SECTION_LOGO[sectionId] || AzureLogo
  const isOver = post.length > 3000
  const img    = thumbnail || article.image || ''

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  async function copyImgUrl() {
    try { await navigator.clipboard.writeText(img) } catch {}
    setImgCopied(true)
    setTimeout(() => setImgCopied(false), 2500)
  }

  function triggerImgDownload() {
    if (!img) return
    const a = document.createElement('a')
    a.href = `/api/download-image?url=${encodeURIComponent(img)}`
    a.download = 'linkedin-post-image.jpg'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  async function copyAndOpen() {
    try { await navigator.clipboard.writeText(post) } catch {}
    setCopied(true)
    setHinted(true)
    // URL and hashtags are already in the post text (added by AI).
    // We still pass the post as the text param so LinkedIn pre-fills the composer.
    const liUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(post)}`
    window.open(liUrl, '_blank', 'noopener,noreferrer')
    if (img && downloadImg) triggerImgDownload()
  }

  async function copyOnly() {
    try { await navigator.clipboard.writeText(post) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-outline-variant/30 bg-surface-container-lowest flex flex-col overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.18)] max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#0A66C2' }}>
              <LiIcon size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">LinkedIn Post Preview</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Review and edit — then open LinkedIn to paste</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors text-base" aria-label="Close">✕</button>
        </div>

        {/* Article chip */}
        <div className="px-6 pt-4 shrink-0">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs border border-outline-variant/20 bg-surface-container">
            <span className="shrink-0 inline-flex" style={{ color: style.accent }}><Logo /></span>
            <span className="line-clamp-1 font-medium text-on-surface flex-1">{article.title}</span>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md transition-colors hover:bg-surface-container-high"
                style={{ color: style.accent }}
              >
                Open ↗
              </a>
            )}
          </div>
        </div>

        {/* Image panel */}
        {img && (
          <div className="mx-6 mt-4 shrink-0 rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container">
            <div className="relative">
              <img src={img} alt="Article thumbnail" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={copyImgUrl}
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg text-white backdrop-blur-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(0,0,0,0.55)' }}
                >
                  {imgCopied ? '✓ Copied' : 'Copy URL'}
                </button>
                <a
                  href={img}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg text-white backdrop-blur-sm transition-all hover:scale-105"
                  style={{ background: 'rgba(0,0,0,0.55)' }}
                >
                  Open ↗
                </a>
              </div>
              <div className="absolute top-2 left-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: style.accent + 'cc' }}>Attach to LinkedIn post</span>
              </div>
            </div>
            {/* Image warning strip */}
            <div className="px-3 py-2 flex items-center gap-2 justify-between bg-amber-50 border-t border-amber-200/70">
              <span className="text-[11px] text-amber-700 truncate">⚠ LinkedIn can't accept pasted images — Image will auto-download. Drag & drop it into your post.</span>
              <label className="flex items-center gap-1 text-[11px] text-amber-700 cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={downloadImg}
                  onChange={e => setDownloadImg(e.target.checked)}
                  className="w-3.5 h-3.5 accent-amber-600 cursor-pointer"
                />
                Auto-download
              </label>
            </div>
          </div>
        )}

        {/* Textarea */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <textarea
            value={post}
            onChange={e => setPost(e.target.value)}
            className="w-full h-56 sm:h-64 text-sm leading-relaxed rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-on-surface bg-surface-container"
            style={{ border: `1px solid ${isOver ? '#ba1a1a' : '#c0c7d4'}` }}
            spellCheck
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <CharRing count={post.length} />
          </div>
          {isOver && <p className="text-xs text-[#ba1a1a] mt-1 text-right">{post.length - 3000} characters over limit — trim before posting</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/20 shrink-0 bg-surface-container-low">
          {hinted && (
            <p className="text-center text-xs text-on-surface-variant mb-3 flex items-center justify-center gap-1.5">
              <span className="text-[#107C10]">✓</span> LinkedIn opened with text pre-filled.{img && downloadImg ? ' Image is downloading — drag &amp; drop it into your LinkedIn post.' : ' Use “Add photo” in LinkedIn to attach the image.'}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button onClick={copyOnly} className="px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface border border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container transition-all">
                {copied && !hinted ? '✓ Copied' : 'Copy text'}
              </button>
              <button
                onClick={copyAndOpen}
                disabled={isOver}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: isOver ? '#aaa' : 'linear-gradient(135deg,#0A66C2,#0077b5)' }}
              >
                <LiIcon size={14} />
                Open LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Section row ──────────────────────────────────────────────────────────── */
function SectionRow({ section, onSelect, loading }) {
  const style = SECTION_STYLE[section.id]
  const Logo  = SECTION_LOGO[section.id]
  if (!section.articles.length) return null

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: style.lightBg }}>
          <span style={{ color: style.accent }}><Logo /></span>
        </div>
        <h2 className="text-xl font-bold text-on-surface">{style.badge}</h2>
        <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full font-medium">
          {section.articles.length} articles
        </span>
        <div className="flex-1 h-px ml-1 bg-surface-container-high" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-0.5 px-0.5" style={{ scrollbarWidth: 'thin' }}>
        {section.articles.map(article => (
          <ArticleCard
            key={article.slug}
            article={article}
            sectionId={section.id}
            onSelect={onSelect}
            loading={loading}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function CreatePostClient({ sections }) {
  const [loading,    setLoading]    = useState(null)
  const [error,      setError]      = useState('')
  const [modal,      setModal]      = useState(null)
  const [editedPost, setEditedPost] = useState('')
  const abortRef = React.useRef(null)

  function cancelGeneration() {
    abortRef.current?.abort()
    setLoading(null)
  }

  async function handleSelect(article, sectionId) {
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(article.slug)
    setError('')
    try {
      const res = await fetch('/api/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          articleData: {
            title:       article.title,
            description: article.description,
            content:     article.description,
            articleUrl:  article.url,
            image:       article.image || '',
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setEditedPost(data.post || '')
      setModal({ article, sectionId, thumbnail: data.thumbnail || article.image || '' })
    } catch (e) {
      if (e.name !== 'AbortError') {
        const msg = e.message || ''
        setError(
          msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')
            ? 'Could not reach the server. Make sure the dev server is running and refresh.'
            : msg || 'Failed to generate post'
        )
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 pt-24 sm:pt-28">

      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">Create LinkedIn Post</span>
      </nav>

      <div className="flex items-start gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm" style={{ background: '#0A66C2' }}>
          <LiIcon size={22} />
        </div>
        <div>
          <h1 className="font-inter font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl text-on-surface">Create LinkedIn Post</h1>
          <p className="text-on-surface-variant text-sm mt-1 max-w-xl">
            Pick any article — AI crafts a professional LinkedIn post for you to review, edit, and share. No login required.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm border text-[#ba1a1a] bg-[#ffdad6] border-[#ba1a1a]/30">
          <span>⚠</span> {error}
          <button onClick={() => setError('')} className="ml-auto opacity-60 hover:opacity-100 transition-opacity">✕</button>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl px-8 py-6 shadow-xl flex flex-col items-center gap-4 border border-outline-variant/20">
            <div className="w-10 h-10 rounded-full border-4 border-surface-container-highest border-t-primary animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-on-surface">Generating LinkedIn post…</p>
              <p className="text-xs text-on-surface-variant mt-1">AI is reading the article</p>
            </div>
            <button
              onClick={cancelGeneration}
              className="mt-1 px-5 py-2 rounded-xl text-sm font-medium text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {sections.map(section => (
        <SectionRow
          key={section.id}
          section={section}
          onSelect={(article) => handleSelect(article, section.id)}
          loading={loading}
        />
      ))}

      {modal && (
        <ReviewModal
          article={modal.article}
          sectionId={modal.sectionId}
          post={editedPost}
          setPost={setEditedPost}
          onClose={() => setModal(null)}
          thumbnail={modal.thumbnail}
        />
      )}
    </div>
  )
}
