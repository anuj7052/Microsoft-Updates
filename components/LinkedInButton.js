'use client'

import { useState, useEffect } from 'react'

const LinkedInIcon = ({ size = 16 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const CHAR_LIMIT = 3000

export default function LinkedInButton({ title, description, content, articleUrl }) {
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [post, setPost] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [copied, setCopied] = useState(false)
  const [imgCopied, setImgCopied] = useState(false)
  const [downloadImg, setDownloadImg] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const charCount = post.length
  const isOver = charCount > CHAR_LIMIT
  const pct = Math.min(charCount / CHAR_LIMIT, 1)

  // SVG circle progress
  const radius = 10
  const circ = 2 * Math.PI * radius
  const dashOffset = circ * (1 - pct)
  const circleColor = isOver ? '#f87171' : pct > 0.85 ? '#fbbf24' : '#0A66C2'

  async function handleGenerate() {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleData: { title, description, content, articleUrl },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')
      setPost(data.post || '')
      setThumbnail(data.thumbnail || '')
      setStatus('ready')
    } catch (err) {
      const msg = err.message || ''
      setErrorMsg(
        msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')
          ? 'Could not reach the server. Make sure the dev server is running and refresh.'
          : msg || 'Something went wrong'
      )
      setStatus('error')
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(post)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // clipboard not available — silently skip
    }
  }

  async function copyImgUrl() {
    try { await navigator.clipboard.writeText(thumbnail) } catch {}
    setImgCopied(true)
    setTimeout(() => setImgCopied(false), 2500)
  }

  async function handleOpenLinkedIn() {
    try { await navigator.clipboard.writeText(post) } catch {}
    setCopied(true)
    // URL and hashtags are already inside the post text (added by AI).
    const liUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(post)}`
    window.open(liUrl, '_blank', 'noopener,noreferrer')
    if (thumbnail && downloadImg) {
      const a = document.createElement('a')
      a.href = `/api/download-image?url=${encodeURIComponent(thumbnail)}`
      a.download = 'linkedin-post-image.jpg'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  function handleClose() {
    setStatus('idle')
    setPost('')
    setThumbnail('')
    setCopied(false)
  }

  // Lock body scroll while modal is open
  useEffect(() => {
    if (status === 'ready' || status === 'loading') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [status])

  return (
    <>
      {/* ── Floating trigger button ───────────────────────────────────── */}
      <button
        onClick={handleGenerate}
        title="Create LinkedIn post from this article"
        aria-label="Create LinkedIn post"
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-white text-xs sm:text-sm font-semibold shadow-[0_8px_32px_rgba(10,102,194,0.45)] transition-all duration-200 hover:scale-105 hover:shadow-[0_12px_40px_rgba(10,102,194,0.65)] active:scale-95 select-none"
        style={{ background: 'linear-gradient(135deg,#0A66C2,#0077b5)' }}
      >
        <LinkedInIcon size={18} />
        <span>Post to LinkedIn</span>
      </button>

      {/* ── Loading overlay ───────────────────────────────────────────── */}
      {status === 'loading' && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/65 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5 text-white">
            <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
            <div className="text-center">
              <p className="text-base font-semibold">Generating your LinkedIn post…</p>
              <p className="text-sm text-white/50 mt-1">AI is reading the article and crafting a post</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Review + edit modal ───────────────────────────────────────── */}
      {status === 'ready' && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] max-h-[92vh]"
            style={{ background: 'linear-gradient(160deg,#0f0f1a,#141424)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#0A66C2' }}>
                  <LinkedInIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">LinkedIn Post Preview</p>
                  <p className="text-[11px] text-white/40 mt-0.5">Review and edit before posting</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors text-base"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Article title chip */}
            <div className="px-6 pt-4 shrink-0">
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/50 border border-white/[0.07]"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <span className="shrink-0 opacity-60">📄</span>
                <span className="line-clamp-1 flex-1">{title}</span>
                {articleUrl && (
                  <a href={articleUrl} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >Open ↗</a>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            {thumbnail && (
              <div className="mx-6 mt-3 shrink-0 rounded-xl overflow-hidden border border-white/[0.08]">
                <div className="relative">
                  <img src={thumbnail} alt="Article thumbnail" className="w-full h-36 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white bg-[#0A66C2]/80">Attach to LinkedIn post</span>
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                    <button
                      onClick={copyImgUrl}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg text-white backdrop-blur-sm transition-all hover:scale-105"
                      style={{ background: 'rgba(0,0,0,0.55)' }}
                    >
                      {imgCopied ? '✓ Copied' : 'Copy URL'}
                    </button>
                    <a
                      href={thumbnail}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg text-white backdrop-blur-sm transition-all hover:scale-105"
                      style={{ background: 'rgba(0,0,0,0.55)' }}
                    >
                      Open ↗
                    </a>
                  </div>
                </div>
                {/* Image warning — LinkedIn can't accept pasted images */}
                <div className="px-3 py-2 flex items-center gap-2 justify-between border-t border-white/[0.08]" style={{ background: 'rgba(251,191,36,0.07)' }}>
                  <span className="text-[11px] text-amber-400/90 truncate">⚠ LinkedIn can't accept pasted images — Image will auto-download. Drag & drop it into your post.</span>
                  <label className="flex items-center gap-1 text-[11px] text-amber-400/90 cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={downloadImg}
                      onChange={e => setDownloadImg(e.target.checked)}
                      className="w-3.5 h-3.5 accent-amber-400 cursor-pointer"
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
                onChange={(e) => setPost(e.target.value)}
                className="w-full h-56 sm:h-64 text-sm leading-relaxed rounded-xl p-4 resize-none border focus:outline-none transition-colors font-mono text-white/90"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: isOver ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)',
                }}
                spellCheck
                aria-label="LinkedIn post content"
              />

              {/* Character counter */}
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className={`text-xs font-mono tabular-nums ${isOver ? 'text-red-400' : pct > 0.85 ? 'text-amber-400' : 'text-white/30'}`}>
                  {charCount.toLocaleString()} / {CHAR_LIMIT.toLocaleString()}
                </span>
                <svg width="26" height="26" viewBox="0 0 26 26" className="-rotate-90">
                  <circle cx="13" cy="13" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                  <circle
                    cx="13" cy="13" r={radius} fill="none"
                    stroke={circleColor} strokeWidth="2.5"
                    strokeDasharray={circ}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.2s, stroke 0.2s' }}
                  />
                </svg>
              </div>

              {isOver && (
                <p className="text-xs text-red-400 mt-1 text-right">
                  {charCount - CHAR_LIMIT} characters over the limit — trim before posting
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.08] shrink-0">
              {copied && (
                <p className="text-center text-xs text-white/40 mb-3">
                  \u2713 Text pre-filled in LinkedIn.{thumbnail && downloadImg ? " Image is downloading \u2014 drag & drop it into your post." : " Use \u201cAdd photo\u201d in LinkedIn to attach the image."}
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white border border-white/[0.12] hover:border-white/25 transition-all"
                  >
                    {copied ? '✓ Copied' : 'Copy text'}
                  </button>
                  <button
                    onClick={handleOpenLinkedIn}
                    disabled={isOver}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                    style={{ background: isOver ? '#555' : 'linear-gradient(135deg,#0A66C2,#0077b5)' }}
                  >
                    <LinkedInIcon size={14} />
                    Open LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Error toast ───────────────────────────────────────────────── */}
      {status === 'error' && (
        <div className="fixed bottom-24 right-6 z-[200] flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-2xl border border-red-500/30"
          style={{ background: 'rgba(30,10,10,0.95)', backdropFilter: 'blur(12px)' }}
        >
          <span className="text-red-400">⚠</span>
          <span className="text-white/80">{errorMsg || 'Failed to generate post'}</span>
          <button
            onClick={() => setStatus('idle')}
            className="ml-1 text-white/40 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
