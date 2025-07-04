const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [require('rehype-slug'), require('rehype-highlight')],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: true,
  },
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

module.exports = withMDX(nextConfig)
