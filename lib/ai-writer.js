import OpenAI from 'openai'

const isAzure = !!process.env.AZURE_OPENAI_API_KEY;

const openai = isAzure
  ? new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
      azureDeployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      apiVersion: '2024-05-01-preview', // Stable Azure API version
    })
  : new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

export async function generateArticleContent(title, snippet, category) {
  const hasAuth = isAzure 
    ? (!!process.env.AZURE_OPENAI_API_KEY && !!process.env.AZURE_OPENAI_ENDPOINT)
    : (!!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-openai-key'));

  if (!hasAuth) {
    console.warn('AI Writer: No valid OpenAI or Azure OpenAI credentials found. Falling back to template generation.')
    return null
  }

  const prompt = `
    You are a professional IT news reporter for "Microsoft Updates & News". 
    Create a high-quality, SEO-optimized news article based on this Microsoft update:
    
    TITLE: ${title}
    SNIPPET: ${snippet}
    CATEGORY: ${category}
    
    Please return a JSON object with the following fields:
    - summaryEn: A detailed 3-paragraph professional summary in English.
    - summaryHi: A detailed 3-paragraph professional summary in Hindi (Unicode).
    - keyChanges: An array of 3-5 bullet points of specific technical changes.
    - shouldInstall: A professional recommendation for IT admins (e.g., "Install immediately", "Test in staging first").
    - metaTitle: A catchy, SEO-focused title (max 60 chars).
    - metaDescription: A compelling meta description (max 155 chars).
    - riskLevel: One of "SAFE", "CAUTION", or "AVOID".
    
    Ensure the tone is authoritative and helpful for IT professionals.
  `

  try {
    const response = await openai.chat.completions.create({
      model: isAzure ? process.env.AZURE_OPENAI_DEPLOYMENT_NAME : 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 1500,
    })

    const content = JSON.parse(response.choices[0].message.content)
    return content
  } catch (error) {
    console.error('AI Writer Error Details:', error)
    return null
  }
}

