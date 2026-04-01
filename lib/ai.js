import OpenAI from 'openai'

let openaiClient = null

function getOpenAI() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openaiClient
}

// ─── Risk classification (no AI needed) ──────────────────────────────────────

function classifyRisk(title, description) {
  const text = `${title} ${description}`.toLowerCase()

  if (/known issue|workaround|regression|unexpected behavior|does not work|not working/.test(text)) {
    return 'CAUTION'
  }
  if (/critical bug|crash|corruption|data loss|breaks|broken(?! link)|fails to|failure/.test(text)) {
    return 'AVOID'
  }
  return 'SAFE'
}

// ─── Slug generation ──────────────────────────────────────────────────────────

export function generateSlug(title, kbNumber) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 75)
    .replace(/-$/, '')

  return kbNumber ? `${kbNumber.toLowerCase()}-${base}` : base
}

// ─── Main AI content generator ───────────────────────────────────────────────

export async function generateAIContent(article) {
  const { title, description, category, kbNumber } = article
  const riskLevel = classifyRisk(title, description)
  const slug = generateSlug(title, kbNumber)

  const openai = getOpenAI()

  // Fallback when OpenAI is not configured
  if (!openai) {
    return buildFallback({ title, description, riskLevel, slug })
  }

  const prompt = `You are a senior Microsoft technology analyst writing for IT professionals.
Analyze this Microsoft update and respond ONLY with valid JSON. No markdown, no extra text.

Title: ${title}
Description: ${description.substring(0, 500)}
Category: ${category}${kbNumber ? `\nKB Number: ${kbNumber}` : ''}

Return exactly this JSON structure:
{
  "summaryEn": "Clear 2-3 sentence summary in English for IT professionals",
  "summaryHi": "2-3 sentence summary in Hindi for Indian IT audience",
  "keyChanges": ["specific change 1", "specific change 2", "specific change 3"],
  "shouldInstall": "Direct recommendation on whether to install this update",
  "metaTitle": "SEO-optimized title, max 60 characters",
  "metaDescription": "SEO description highlighting value, max 155 characters"
}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 700,
      response_format: { type: 'json_object' },
    })

    const data = JSON.parse(response.choices[0].message.content)

    return {
      summaryEn: data.summaryEn || description.substring(0, 300),
      summaryHi: data.summaryHi || description.substring(0, 300),
      keyChanges: Array.isArray(data.keyChanges) ? data.keyChanges.slice(0, 6) : [],
      shouldInstall: data.shouldInstall || defaultInstallRec(riskLevel),
      riskLevel,
      slug,
      metaTitle: (data.metaTitle || title).substring(0, 60),
      metaDescription: (data.metaDescription || description).substring(0, 155),
    }
  } catch (err) {
    console.error('[AI] Generation failed:', err.message)
    return buildFallback({ title, description, riskLevel, slug })
  }
}

function defaultInstallRec(riskLevel) {
  if (riskLevel === 'SAFE') return 'This update is safe to install on production systems.'
  if (riskLevel === 'CAUTION') return 'Test on non-production systems before rolling out widely.'
  return 'Hold off — wait for Microsoft to resolve the known issues first.'
}

function buildFallback({ title, description, riskLevel, slug }) {
  return {
    summaryEn: description.substring(0, 300),
    summaryHi: description.substring(0, 300),
    keyChanges: [],
    shouldInstall: defaultInstallRec(riskLevel),
    riskLevel,
    slug,
    metaTitle: title.substring(0, 60),
    metaDescription: description.substring(0, 155),
  }
}
