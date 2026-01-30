'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Hexagon } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'

const navItems = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Tech', href: '#tech' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
                  ${isScrolled ? 'glassmorphism py-3' : 'bg-transparent py-6'}`}
    >
      <nav className="section-container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Hexagon
            className="w-8 h-8 text-accent-bitcoin transition-transform duration-300
                       group-hover:rotate-180 group-hover:scale-110"
            strokeWidth={1.5}
          />
          <span className="text-xl font-bold tracking-tight">
            Liber<span className="text-accent-bitcoin">Block</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <MagneticButton>
                <Link
                  href={item.href}
                  className="relative text-sm font-medium text-text-secondary
                             hover:text-text-primary transition-colors duration-300
                             after:absolute after:bottom-0 after:left-0 after:w-0
                             after:h-px after:bg-accent-bitcoin after:transition-all
                             after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </Link>
              </MagneticButton>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <MagneticButton>
            <Link href="#contact" className="btn-primary text-sm">
              Get in Touch
            </Link>
          </MagneticButton>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-text-primary hover:text-accent-bitcoin
                     transition-colors duration-300"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <div
        className={`md:hidden absolute top-full left-0 right-0 glassmorphism
                    transition-all duration-300 overflow-hidden
                    ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <ul className="flex flex-col p-6 gap-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-lg font-medium text-text-secondary
                           hover:text-accent-bitcoin transition-colors duration-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <Link
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-primary inline-block text-center w-full"
            >
              Get in Touch
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
