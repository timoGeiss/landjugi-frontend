import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: '*.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'cnjnkrylxygbtriciocf.supabase.co' },
    ],
  },
}

export default nextConfig
