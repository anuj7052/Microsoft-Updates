import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || typeof q !== 'string' || q.trim() === '') {
    return NextResponse.json([])
  }

  try {
    const rawQuery = q.trim()
    const results = await prisma.update.findMany({
      where: {
        OR: [
          { title: { contains: rawQuery, mode: 'insensitive' } },
          { description: { contains: rawQuery, mode: 'insensitive' } },
          { category: { contains: rawQuery, mode: 'insensitive' } },
        ]
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 15,
      select: {
        title: true,
        description: true,
        slug: true,
        category: true,
        publishedAt: true,
        sourceUrl: true,
      }
    })

    const formatted = results.map(doc => ({
      title: doc.title,
      description: doc.description || '',
      category: doc.category,
      pubDate: doc.publishedAt ? doc.publishedAt.toISOString() : new Date().toISOString(),
      slug: doc.slug,
      image: null, // Image field doesn't exist in DB, components will fallback to OG image
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to execute robust search' }, { status: 500 })
  }
}
