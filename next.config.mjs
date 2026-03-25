/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/agent/card.json', destination: '/agent/card' },
    ]
  },
}

export default nextConfig
