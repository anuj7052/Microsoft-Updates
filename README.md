# Microsoft Updates — Independent News Blog

An independent Next.js news blog covering the latest Microsoft updates — Windows, Azure, Copilot AI, Microsoft 365, Power Platform, Fabric, and security patches. Auto-updated every 30 minutes from official Microsoft sources. Live at [microsoftupdates.co.in](https://microsoftupdates.co.in).

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via Prisma ORM
- **Cache:** Upstash Redis
- **AI:** OpenAI (article summarisation & AI writing)
- **Deployment:** Vercel

## Features

- Auto-fetched news from official Microsoft RSS feeds (cron every 30 minutes)
- Categories: Windows, Azure, Copilot, Microsoft 365 / Office 365, Power Platform, Fabric, Security, Licensing, Live
- AI-generated article summaries (English)
- Risk-level tagging (`SAFE` / `CAUTION` / `AVOID`) for updates
- Open Graph image generation (`/api/og`)
- RSS feed (`/api/feed/rss`)
- Full-text search (`/api/search`)
- Trending articles (`/api/trending`)
- SEO-optimised with sitemap, robots.txt, and canonical URLs
- Dark theme with Google Translate integration

## Project Structure

```
app/               # Next.js App Router pages & API routes
components/        # Shared UI components (Navbar, Footer, NewsCard, etc.)
content/updates/   # Markdown articles organised by category
data/              # Static JSON data (news, history, live updates)
lib/               # Core utilities (AI writer, DB client, feeds, Redis)
prisma/            # Prisma schema
public/            # Static assets
scripts/           # One-off data scripts (backfill, fetch, seed)
```

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

## Scripts

| Command | Description |
|---|---|
| `npm run fetch` | Manually fetch latest updates from Microsoft feeds |
| `npm run db:studio` | Open Prisma Studio to browse the database |
| `npm run db:migrate` | Run pending Prisma migrations |

## API Routes

| Route | Description |
|---|---|
| `GET /api/updates` | List updates (paginated) |
| `GET /api/updates/[slug]` | Single update by slug |
| `GET /api/feed/rss` | RSS feed |
| `GET /api/search` | Full-text search |
| `GET /api/trending` | Trending articles |
| `GET /api/og` | Dynamic Open Graph image |
| `POST /api/cron` | Cron job to fetch & process new updates |

## Deployment

The project is configured for Vercel (`vercel.json`). Set all environment variables in the Vercel dashboard and configure a cron job to hit `/api/cron` every 30 minutes.

## License

This project is private and not open-source.
