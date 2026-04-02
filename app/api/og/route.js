import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Latest Microsoft Updates & News'
  const category = searchParams.get('category') || 'General'

  const categoryColors = {
    windows: '#34D399',
    azure: '#A855F7',
    security: '#22D3EE',
    office365: '#FB923C',
    'power-platform': '#FBBF24',
    copilot: '#22D3EE',
    fabric: '#C084FC',
    general: '#C084FC',
  }
  const color = categoryColors[category.toLowerCase()] || '#A855F7'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#08070F',
          padding: '60px',
          backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(168,85,247,0.15), transparent)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: color,
              border: `2px solid ${color}`,
              padding: '4px 16px',
              borderRadius: '20px',
            }}
          >
            {category.replace('-', ' ').toUpperCase()}
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#F87171',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '2px solid rgba(248,113,113,0.3)',
              padding: '4px 14px',
              borderRadius: '20px',
            }}
          >
            LIVE
          </div>
        </div>

        <div
          style={{
            fontSize: title.length > 80 ? '42px' : '52px',
            fontWeight: 800,
            color: '#F4F0FF',
            lineHeight: 1.2,
            maxWidth: '900px',
            letterSpacing: '-0.02em',
          }}
        >
          {title.length > 120 ? title.substring(0, 117) + '...' : title}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 700,
                background: 'linear-gradient(90deg, #C084FC, #22D3EE)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Latest Microsoft Updates & News
            </div>
            <div style={{ fontSize: '14px', color: '#514B6E' }}>
              Independent Coverage · microsoftupdates.co.in
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #A855F7, #22D3EE)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
