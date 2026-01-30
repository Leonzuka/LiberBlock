'use client'

import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail, Hexagon } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'

const socialLinks = [
  { icon: Github, href: 'https://github.com/liberblock', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/liberblock', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com/liberblock', label: 'Twitter' },
  { icon: Mail, href: 'mailto:contact@liberblock.dev', label: 'Email' },
]

const footerLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Tech Stack', href: '#tech' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Hexagon
                className="w-8 h-8 text-accent-bitcoin transition-transform duration-300
                           group-hover:rotate-180"
                strokeWidth={1.5}
              />
              <span className="text-xl font-bold tracking-tight">
                Liber<span className="text-accent-bitcoin">Block</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Building the future with cutting-edge digital products.
              Cypherpunk aesthetics meets modern technology.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-text-secondary">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent-bitcoin
                               transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-text-secondary">
              Connect
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <MagneticButton key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg border border-border flex items-center
                               justify-center text-text-secondary hover:text-accent-bitcoin
                               hover:border-accent-bitcoin transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                </MagneticButton>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row
                        justify-between items-center gap-4">
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} LiberBlock. All rights reserved.
          </p>
          <p className="text-text-secondary text-sm font-mono">
            Built with <span className="text-accent-bitcoin">&#9889;</span> and passion
          </p>
        </div>
      </div>
    </footer>
  )
}
