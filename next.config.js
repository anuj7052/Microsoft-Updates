/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['microsoftupdates.co.in'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}
module.exports = nextConfig
