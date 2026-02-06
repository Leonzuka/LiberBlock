import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/layout/SmoothScroll'
import CustomCursor from '@/components/ui/CustomCursor'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LiberBlock | Digital Innovation Studio',
  description: 'Immersive portfolio showcasing cutting-edge digital products. Cypherpunk aesthetics meets modern web technology.',
  keywords: ['portfolio', 'web development', 'blockchain', 'bitcoin', 'digital products', 'LiberBlock'],
  authors: [{ name: 'LiberBlock' }],
  openGraph: {
    title: 'LiberBlock | Digital Innovation Studio',
    description: 'Immersive portfolio showcasing cutting-edge digital products.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-primary text-text-primary antialiased">
        <SmoothScroll>
          <CustomCursor />
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
