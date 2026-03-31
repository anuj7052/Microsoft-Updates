import { fetchMicrosoftFeeds } from '../../../lib/feeds'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const cat = searchParams.get('category')

  try {
    const allItems = await fetchMicrosoftFeeds(cat || null)

    return Response.json(
      { articles: allItems, updated: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        },
      }
    )
  } catch (error) {
    return Response.json(
      { articles: [], error: 'Failed to fetch feeds', updated: new Date().toISOString() },
      { status: 500 }
    )
  }
}
