# Powertool — Microsoft Intelligence Hub

<p align="center">
  <a href="https://microsoftupdates.co.in" target="_blank">
    <img src="public/HomePage.png" alt="Powertool — Home Page" width="100%" style="border-radius:12px;" />
  </a>
</p>
<p align="center"><em>Home Page</em></p>

<p align="center">
  <img src="public/PowerPlatform.png" alt="Powertool — Power Platform Page" width="49%" style="border-radius:10px;" />
  &nbsp;
  <img src="public/CreatePost.png" alt="Powertool — Create Post Page" width="49%" style="border-radius:10px;" />
</p>
<p align="center"><em>Power Platform &nbsp;|&nbsp; Create Post</em></p>

<p align="center">
  <a href="https://microsoftupdates.co.in"><strong>🌐 Live Site →</strong></a>
</p>

---

## What is Powertool?

**Powertool** is an independent Microsoft intelligence hub — a fast, clean news website that aggregates and summarises the latest official updates from Microsoft, updated automatically every 30 minutes.

Built for IT professionals, developers, and Microsoft enthusiasts who want to stay on top of everything Microsoft — without visiting a dozen different sources.

### What it covers

| Category | What you'll find |
|---|---|
| 🪟 **Windows** | Feature updates, security patches, Insider builds |
| ☁️ **Azure** | New services, pricing changes, GA announcements |
| 🤖 **Copilot & AI** | Microsoft AI product launches, model updates |
| 📦 **Microsoft 365** | Office apps, Teams, Outlook, SharePoint updates |
| ⚡ **Power Platform** | Power Apps, Power Automate, Power BI releases |
| 🧵 **Fabric** | Microsoft Fabric data platform announcements |
| 🔐 **Security** | Patch Tuesday advisories, CVE disclosures |
| 📋 **Licensing** | Subscription changes, pricing updates |
| 📡 **Live Feed** | Real-time stream of all incoming updates |

### Key features

- **Auto-updated every 30 minutes** via cron job pulling official Microsoft RSS feeds
- **AI-powered summaries** — every article is summarised using OpenAI for quick scanning
- **Risk-level tagging** — updates are tagged `SAFE`, `CAUTION`, or `AVOID` based on content
- **Live Feed page** — real-time stream of all new updates as they arrive
- **Full-text search** — search across all articles instantly
- **Trending articles** — surfaces the most-read updates
- **RSS feed** available at `/api/feed/rss` for feed reader subscribers
- **Dynamic Open Graph images** — every article generates a rich social preview card
- **SEO-optimised** — sitemap, robots.txt, canonical URLs, and structured data
- **Interactive footer** — mouse-driven animated brand section
- **Responsive design** — works seamlessly on mobile, tablet, and desktop
- **Segoe UI typography** — clean, Windows-native reading experience

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Prisma ORM |
| Cache | Upstash Redis |
| AI | OpenAI API (summarisation & writing) |
| Deployment | Vercel |
| Fonts | Oi (brand), Newsreader (headlines), Segoe UI (body) |

---

## Project Structure

```
app/               # Next.js App Router pages & API routes
  [category]/      # Dynamic category pages (azure, windows, etc.)
  api/             # API routes (cron, search, feed, trending, og)
  live/            # Live feed pages
components/        # Shared UI components (Navbar, Footer, NewsCard, etc.)
content/updates/   # Markdown articles organised by category
data/              # Static JSON data (news, history, live updates)
lib/               # Core utilities (AI writer, DB client, feeds, Redis)
prisma/            # Prisma schema
public/            # Static assets
scripts/           # One-off data scripts (backfill, fetch, seed)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Upstash Redis instance
- OpenAI API key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
OPENAI_API_KEY=sk-...
```

### Database Setup

```bash
npm run db:push        # Push schema to database
npm run db:generate    # Generate Prisma client
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run fetch` | Manually fetch latest updates from Microsoft feeds |
| `npm run db:studio` | Open Prisma Studio to browse the database |
| `npm run db:migrate` | Run pending Prisma migrations |
| `npm run db:push` | Push schema changes to database |

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/updates` | GET | List updates (paginated) |
| `/api/updates/[slug]` | GET | Single update by slug |
| `/api/feed/rss` | GET | RSS feed |
| `/api/search` | GET | Full-text search |
| `/api/trending` | GET | Trending articles |
| `/api/og` | GET | Dynamic Open Graph image |
| `/api/cron` | POST | Fetch & process new updates (cron) |
| `/api/create-post` | POST | Create a new post via API |
| `/api/download-image` | GET | Proxy image downloader |

---

## Deployment

The project is configured for Vercel (`vercel.json`). 

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set all environment variables in the Vercel dashboard
4. Configure a cron job to hit `POST /api/cron` every 30 minutes

---

## License

This project is private and not open-source. All rights reserved.

