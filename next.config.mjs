/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/agent/card.json', destination: '/agent/card' },
    ]
  },
  webpack: (config) => {
    // Optional wallet connector dependencies — stub them out when not installed
    config.resolve.alias = {
      ...config.resolve.alias,
      '@base-org/account': false,
      '@metamask/connect-evm': false,
      '@walletconnect/ethereum-provider': false,
      '@safe-global/safe-apps-sdk': false,
      '@safe-global/safe-apps-provider': false,
    }
    return config
  },
}

export default nextConfig
