/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap', '@react-three/drei'],
  },
}

module.exports = nextConfig
