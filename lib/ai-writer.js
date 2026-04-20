import OpenAI from 'openai'

// Lazy init — never instantiate at module load time (causes build failures if env vars missing)
let _openai = null
function getOpenAI() {
  if (_openai) return _openai
  const isAzure = !!process.env.AZURE_OPENAI_API_KEY
  _openai = isAzure
    ? new OpenAI({
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
        azureDeployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
        apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2025-04-01-preview',
      })
    : new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return _openai
}

export async function generateArticleContent(title, snippet, category) {
  const isAzure = !!process.env.AZURE_OPENAI_API_KEY
  const hasAuth = isAzure
    ? (!!process.env.AZURE_OPENAI_API_KEY && !!process.env.AZURE_OPENAI_ENDPOINT)
    : (!!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-openai-key'));

  if (!hasAuth) {
    console.warn('AI Writer: No valid credentials. Using template fallback.')
    return null
  }

  const categoryLabel = {
    azure: 'Azure Cloud', windows: 'Windows', security: 'Microsoft Security',
    office365: 'Microsoft 365', 'power-platform': 'Power Platform',
    copilot: 'Copilot & AI', fabric: 'Microsoft Fabric', general: 'Microsoft'
  }[category] || 'Microsoft'

  const prompt = `You are a professional IT journalist writing for "Microsoft Updates & News" (microsoftupdates.co.in), an independent tech news site targeting Indian IT professionals.

Write a high-quality, SEO-optimized news article for this Microsoft update:

TITLE: ${title}
CATEGORY: ${categoryLabel}
SNIPPET: ${snippet}

Return a JSON object with EXACTLY these fields:
- "summaryEn": A well-written 3-paragraph article (min 200 words) in English. Para 1: What was announced. Para 2: Key technical details and impact. Para 3: What IT admins should do.
- "summaryHi": A 2-paragraph Hindi summary (Unicode Devanagari) of the same article.
- "keyChanges": Array of exactly 4-5 specific, actionable bullet points about what changed.
- "shouldInstall": One clear sentence recommendation for IT admins (e.g., "Deploy immediately to all systems" or "Test in staging for 2 weeks before production rollout").
- "metaTitle": SEO title with primary keyword first, max 60 characters. Include year 2026.
- "metaDescription": Compelling meta description with call-to-action, max 155 characters.
- "riskLevel": Exactly one of: "SAFE", "CAUTION", or "AVOID" based on the update type.

Rules: Be factual. Use active voice. Include relevant keywords naturally. Target IT professionals and developers.`

  try {
    const openai = getOpenAI()
    const response = await openai.chat.completions.create({
      model: isAzure ? process.env.AZURE_OPENAI_DEPLOYMENT_NAME : 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_completion_tokens: 2000,
      temperature: 0.7,
    })

    const content = JSON.parse(response.choices[0].message.content)
    return content
  } catch (error) {
    console.error('AI Writer Error:', error.message)
    return null
  }
}

