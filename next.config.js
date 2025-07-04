/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Interview media specific config
  async rewrites() {
    return [
      {
        source: '/interview-sitemap.xml',
        destination: '/api/sitemap/interview',
      },
    ]
  },
  async redirects() {
    return [
      // Future redirects for SEO
    ]
  },
}

// Use simpler MDX configuration without problematic plugins
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX(nextConfig)
