import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'
export const revalidate = 3600

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function parseMatter(raw) {
  const { default: matter } = await import('gray-matter')
  return matter(raw)
}

async function renderMarkdown(content) {
  const { marked } = await import('marked')
  return marked(content)
}

function getMarkdownPath(category, slug) {
  return path.join(process.cwd(), 'content', 'updates', category, `${slug}.md`)
}

function getRelatedMarkdown(category, currentSlug) {
  const dir = path.join(process.cwd(), 'content', 'updates', category)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== `${currentSlug}.md`)
    .map((file) => {
      try {
        const raw = fs.readFileSync(path.join(dir, file), 'utf8')
        // Fast-parse only frontmatter lines without full gray-matter
        const fm = {}
        const lines = raw.split('\n')
        let inFm = false
        for (const line of lines) {
          if (line.trim() === '---') { inFm = !inFm; if (!inFm) break; continue }
          if (!inFm) continue
          const m = line.match(/^(\w+):\s*"?(.+?)"?\s*$/)
          if (m) fm[m[1]] = m[2]
        }
        return {
          title: fm.title || file.replace('.md', ''),
          slug: file.replace('.md', ''),
          category,
          riskLevel: fm.riskLevel || 'SAFE',
          publishedAt: fm.publishedAt || fm.date || null,
        }
      } catch { return null }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, 4)
}

// ─── Static params from markdown files ──────────────────────────────────────

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'content', 'updates')
  if (!fs.existsSync(contentDir)) return []

  const params = []
  const cats = fs.readdirSync(contentDir)
  for (const cat of cats) {
    const catDir = path.join(contentDir, cat)
    if (!fs.statSync(catDir).isDirectory()) continue
    for (const file of fs.readdirSync(catDir)) {
      if (file.endsWith('.md')) {
        params.push({ category: cat, slug: file.replace('.md', '') })
      }
    }
  }
  return params
}

const RISK_STYLES = {
  SAFE: {
    label: 'SAFE TO INSTALL',
    badge: 'bg-green-500/15 text-green-400 border border-green-500/30',
    icon: '✓',
  },
  CAUTION: {
    label: 'INSTALL WITH CAUTION',
    badge: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    icon: '⚠',
  },
  AVOID: {
    label: 'HOLD — KNOWN ISSUES',
    badge: 'bg-red-500/15 text-red-400 border border-red-500/30',
    icon: '✕',
  },
}

const CATEGORY_COLORS = {
  azure: 'bg-blue-500/15 text-blue-400',
  windows: 'bg-cyan-500/15 text-cyan-400',
  security: 'bg-red-500/15 text-red-400',
  office365: 'bg-orange-500/15 text-orange-400',
  'power-platform': 'bg-purple-500/15 text-purple-400',
  fabric: 'bg-pink-500/15 text-pink-400',
  copilot: 'bg-indigo-500/15 text-indigo-400',
  general: 'bg-gray-500/15 text-gray-400',
  licensing: 'bg-yellow-500/15 text-yellow-400',
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params

  // Try markdown first
  const mdPath = getMarkdownPath(category, slug)
  if (fs.existsSync(mdPath)) {
    const raw = fs.readFileSync(mdPath, 'utf8')
    const { data: fm } = await parseMatter(raw)
    return {
      title: `${fm.metaTitle || fm.title} | Microsoft Updates`,
      description: fm.metaDescription || fm.title,
      openGraph: {
        title: fm.metaTitle || fm.title,
        description: fm.metaDescription || fm.title,
        url: `https://microsoftupdates.co.in/updates/${category}/${slug}`,
        siteName: 'Microsoft Updates',
        type: 'article',
        publishedTime: fm.publishedAt,
      },
      alternates: { canonical: `/updates/${category}/${slug}` },
      robots: { index: true, follow: true },
    }
  }

  // Fallback to DB
  try {
    const { prisma } = await import('../../../../lib/db')
    const update = await prisma.update.findUnique({
      where: { slug },
      select: { metaTitle: true, metaDescription: true, title: true, description: true, category: true, publishedAt: true },
    })
    if (!update) return { title: 'Update Not Found | Microsoft Updates' }
    return {
      title: `${update.metaTitle || update.title} | Microsoft Updates`,
      description: update.metaDescription || update.description,
      openGraph: {
        title: update.metaTitle || update.title,
        description: update.metaDescription || update.description,
        url: `https://microsoftupdates.co.in/updates/${update.category}/${slug}`,
        siteName: 'Microsoft Updates',
        type: 'article',
        publishedTime: update.publishedAt?.toISOString(),
      },
      alternates: { canonical: `/updates/${update.category}/${slug}` },
      robots: { index: true, follow: true },
    }
  } catch {
    return { title: 'Update Not Found | Microsoft Updates' }
  }
}

export default async function UpdateDetailPage({ params }) {
  const { category, slug } = await params

  let update = null
  let contentHtml = ''
  let related = []
  let fromMarkdown = false

  // ── 1. Try markdown file ────────────────────────────────────────────────────
  const mdPath = getMarkdownPath(category, slug)
  if (fs.existsSync(mdPath)) {
    const raw = fs.readFileSync(mdPath, 'utf8')
    const { data: fm, content } = await parseMatter(raw)
    contentHtml = await renderMarkdown(content)
    fromMarkdown = true

    update = {
      title: fm.title || slug,
      metaTitle: fm.metaTitle || fm.title,
      metaDescription: fm.metaDescription || '',
      category: fm.category || category,
      slug: fm.slug || slug,
      kbNumber: fm.kbNumber || null,
      riskLevel: fm.riskLevel || 'SAFE',
      sourceUrl: fm.sourceUrl || null,
      publishedAt: fm.publishedAt || fm.date ? new Date(fm.publishedAt || fm.date) : null,
      views: null,
    }
    related = getRelatedMarkdown(category, slug)
  }

  // ── 2. Fallback to DB ───────────────────────────────────────────────────────
  if (!update) {
    try {
      const { prisma } = await import('../../../../lib/db')
      const dbUpdate = await prisma.update.findUnique({ where: { slug } })

      if (dbUpdate) {
        update = dbUpdate
        fromMarkdown = false

        prisma.update
          .update({ where: { slug }, data: { views: { increment: 1 } } })
          .catch(() => {})

        related = await prisma.update
          .findMany({
            where: { category: dbUpdate.category, id: { not: dbUpdate.id } },
            orderBy: { publishedAt: 'desc' },
            take: 4,
            select: { title: true, slug: true, category: true, riskLevel: true, publishedAt: true },
          })
          .catch(() => [])
      }
    } catch { /* DB not configured */ }
  }

  if (!update) notFound()

  const risk = RISK_STYLES[update.riskLevel] || RISK_STYLES.SAFE
  const catColor = CATEGORY_COLORS[update.category] || CATEGORY_COLORS.general
  const publishedDate = update.publishedAt
    ? new Date(update.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: update.title,
    description: update.metaDescription || update.title,
    datePublished: update.publishedAt?.toISOString(),
    author: { '@type': 'Organization', name: 'Microsoft Updates' },
    publisher: {
      '@type': 'Organization',
      name: 'Microsoft Updates',
      url: 'https://microsoftupdates.co.in',
    },
    url: `https://microsoftupdates.co.in/updates/${update.category}/${slug}`,
    articleSection: update.category,
    keywords: `microsoft, ${update.category}, ${update.kbNumber || ''}, updates`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6 flex-wrap">
          <Link href="/" className="hover:text-ms-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${update.category}`} className="hover:text-ms-accent transition-colors capitalize">
            {update.category.replace('-', ' ')}
          </Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)] line-clamp-1">{update.title}</span>
        </nav>

        <article className="bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-10">
          {/* Category + KB badge */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${catColor}`}>
              {update.category.replace('-', ' ')}
            </span>
            {update.kbNumber && (
              <span className="bg-ms-accent/15 text-ms-accent text-xs font-bold px-2.5 py-1 rounded font-mono">
                {update.kbNumber}
              </span>
            )}
            {publishedDate && (
              <span className="text-[var(--text-muted)] text-xs ml-auto">{publishedDate}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-syne font-extrabold text-2xl md:text-3xl text-[var(--text-primary)] leading-tight mb-6">
            {update.title}
          </h1>

          {/* Risk Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-8 ${risk.badge}`}>
            <span className="text-base">{risk.icon}</span>
            {risk.label}
            {update.views > 0 && (
              <span className="ml-4 text-xs font-normal opacity-70">{update.views.toLocaleString()} views</span>
            )}
          </div>

          {/* Article body — markdown rendered HTML or DB structured fields */}
          {fromMarkdown ? (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : (
            <>
              {update.summaryEn && (
                <section className="mb-8">
                  <h2 className="font-syne font-bold text-lg text-[var(--text-primary)] mb-3">Summary</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{update.summaryEn}</p>
                </section>
              )}
              {update.summaryHi && update.summaryHi !== update.summaryEn && (
                <section className="mb-8 bg-[var(--bg-primary)] rounded-xl p-5 border border-[var(--border)]">
                  <h2 className="font-syne font-bold text-base text-[var(--text-primary)] mb-2">सारांश (Hindi)</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{update.summaryHi}</p>
                </section>
              )}
              {update.keyChanges?.length > 0 && (
                <section className="mb-8">
                  <h2 className="font-syne font-bold text-lg text-[var(--text-primary)] mb-4">Key Changes</h2>
                  <ul className="space-y-3">
                    {update.keyChanges.map((change, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-ms-accent/20 text-ms-accent flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">{i + 1}</span>
                        <span className="text-[var(--text-secondary)] leading-relaxed">{change}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {update.shouldInstall && (
                <section className="mb-8 rounded-xl p-5 border-l-4 border-ms-accent bg-ms-accent/5">
                  <h2 className="font-syne font-bold text-lg text-[var(--text-primary)] mb-2">Should You Install?</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{update.shouldInstall}</p>
                </section>
              )}
              {update.description && (
                <section className="mb-8">
                  <h2 className="font-syne font-bold text-lg text-[var(--text-primary)] mb-3">Details</h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{update.description}</p>
                </section>
              )}
              {update.sourceUrl && (
                <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ms-accent hover:underline text-sm font-medium mt-2">
                  View original source →
                </a>
              )}
            </>
          )}
        </article>

        {/* Related Updates */}
        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-ms-accent rounded-full" />
              <h2 className="font-syne font-extrabold text-xl text-[var(--text-primary)]">
                Related Updates
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => {
                const rr = RISK_STYLES[r.riskLevel] || RISK_STYLES.SAFE
                return (
                  <Link
                    key={r.slug}
                    href={`/updates/${r.category}/${r.slug}`}
                    className="bg-ms-card border border-[var(--border)] rounded-xl p-4 hover:border-ms-accent/50 transition-colors group"
                  >
                    <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded mb-2 ${rr.badge}`}>
                      {rr.icon} {r.riskLevel}
                    </div>
                    <p className="text-[var(--text-primary)] text-sm font-medium leading-snug group-hover:text-ms-accent transition-colors line-clamp-2">
                      {r.title}
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
