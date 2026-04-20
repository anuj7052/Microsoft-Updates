import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { newsArticles } from '../../data/news'
import CreatePostClient from './CreatePostClient'

export const metadata = {
  description: 'Pick a Microsoft article and generate a professional LinkedIn post with AI — no login required.',
}

const SECTIONS = [
  { id: 'power-platform',   label: 'Power Platform'  },
  { id: 'fabric',           label: 'Fabric'          },
  { id: 'azure',            label: 'Cloud'           },
  { id: 'windows',          label: 'Windows'         },
  { id: 'copilot',          label: 'Copilot & AI'    },
  { id: 'office365',        label: 'Office 365'      },
  { id: 'security',         label: 'Security'        },
  { id: 'licensing',        label: 'Licensing'       },
]

export default function CreatePostPage() {
  /* ── Read live news.json ── */
  let liveArticles = []
  try {
    const p = join(process.cwd(), 'data', 'news.json')
    if (existsSync(p)) liveArticles = JSON.parse(readFileSync(p, 'utf8'))
  } catch {}

  /* ── Read markdown content articles ── */
  function readMarkdownArticles(categoryId) {
    const dir = join(process.cwd(), 'content', 'updates', categoryId)
    if (!existsSync(dir)) return []
    try {
      return readdirSync(dir)
        .filter(f => f.endsWith('.md'))
        .map(filename => {
          const slug = filename.replace(/\.md$/, '')
          let title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          let description = ''
          try {
            const raw = readFileSync(join(dir, filename), 'utf8')
            // Extract frontmatter title / description if present
            const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
            if (fmMatch) {
              const fm = fmMatch[1]
              const t = fm.match(/^title:\s*['"]?(.+?)['"]?\s*$/m)
              const d = fm.match(/^description:\s*['"]?(.+?)['"]?\s*$/m)
              if (t) title = t[1].trim()
              if (d) description = d[1].trim()
            }
          } catch {}
          return {
            title,
            description,
            image: null,
            slug,
            date: '',
            url: `https://microsoftupdates.co.in/updates/${categoryId}/${slug}`,
            category: categoryId,
          }
        })
    } catch { return [] }
  }

  /* ── Build sections ── */
  const sections = SECTIONS.map(sec => {
    const fromLive = liveArticles
      .filter(a => a.feedCategory === sec.id)
      .map(a => ({
        title:       a.title,
        description: a.description || '',
        image:       a.image || null,
        slug:        a.slug,
        date:        a.pubDate || a.publishedAt || '',
        url:         a.url || a.link || `https://microsoftupdates.co.in/live/${a.slug}`,
        category:    sec.id,
      }))

    const fromStatic = newsArticles
      .filter(a => a.category === sec.id)
      .map(a => ({
        title:       a.title,
        description: a.description || '',
        image:       null,
        slug:        a.slug,
        date:        a.date || '',
        url:         `https://microsoftupdates.co.in/${a.category}/${a.slug}`,
        category:    sec.id,
      }))

    const fromMarkdown = readMarkdownArticles(sec.id)

    /* Merge live first, then static, then markdown; deduplicate by slug; cap at 50 */
    const seen = new Set()
    const articles = [...fromLive, ...fromStatic, ...fromMarkdown]
      .filter(a => { if (seen.has(a.slug)) return false; seen.add(a.slug); return true })
      .slice(0, 50)

    return { ...sec, articles }
  })

  return <CreatePostClient sections={sections} />
}

