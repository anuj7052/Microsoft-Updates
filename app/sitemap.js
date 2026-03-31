import { newsArticles, categories } from '../data/news'

export default function sitemap() {
  const baseUrl = 'https://microsoftupdates.co.in'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const articlePages = newsArticles.map((article) => ({
    url: `${baseUrl}/${article.category}/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...articlePages]
}
