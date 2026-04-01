import { NextResponse } from 'next/server'
import { runPipeline } from '../../../lib/pipeline'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes — needed for AI generation loop

export async function POST(request) {
  // Verify pipeline secret token
  const authHeader = request.headers.get('authorization')
  const secret = process.env.PIPELINE_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stats = await runPipeline()
    return NextResponse.json({ success: true, stats, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('[Pipeline Route]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
