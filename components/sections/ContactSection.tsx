'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Github, Linkedin, Twitter, Mail, MapPin, MessageSquare } from 'lucide-react'
import ContactForm from '@/components/ui/ContactForm'
import GlowCard from '@/components/ui/GlowCard'
import MagneticButton from '@/components/ui/MagneticButton'
import TextReveal from '@/components/ui/TextReveal'

gsap.registerPlugin(ScrollTrigger)

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@liberblock.dev',
    href: 'mailto:contact@liberblock.dev',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Remote / Worldwide',
    href: null,
  },
  {
    icon: MessageSquare,
    label: 'Response Time',
    value: 'Within 24 hours',
    href: null,
  },
]

const socialLinks = [
  { icon: Github, href: 'https://github.com/liberblock', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/liberblock', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com/liberblock', label: 'Twitter' },
]

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: infoRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.2,
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-32 bg-bg-primary relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-5"
          style={{
            background:
              'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <TextReveal triggerOnScroll>
            <span className="text-accent-bitcoin font-mono text-sm uppercase tracking-widest">
              Get in Touch
            </span>
          </TextReveal>
          <TextReveal delay={0.2} triggerOnScroll>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Let&apos;s <span className="text-gradient">Connect</span>
            </h2>
          </TextReveal>
          <TextReveal delay={0.3} triggerOnScroll splitBy="words">
            <p className="text-text-secondary max-w-2xl mx-auto">
              Have a project in mind? We&apos;d love to hear from you. Send us a
              message and we&apos;ll respond as soon as possible.
            </p>
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div ref={formRef}>
            <GlowCard className="p-8">
              <ContactForm />
            </GlowCard>
          </div>

          {/* Contact info */}
          <div ref={infoRef} className="space-y-8">
            {/* Info cards */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <GlowCard key={info.label} glowColor="#D4AF37" className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg bg-accent-gold/10 flex items-center
                                  justify-center text-accent-gold"
                    >
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-lg font-medium hover:text-accent-bitcoin
                                     transition-colors duration-300"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-lg font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>

            {/* Social links */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <MagneticButton key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-12 h-12 rounded-xl border border-border flex items-center
                                 justify-center text-text-secondary hover:text-accent-bitcoin
                                 hover:border-accent-bitcoin transition-all duration-300
                                 hover:shadow-lg hover:shadow-accent-bitcoin/20"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  </MagneticButton>
                ))}
              </div>
            </div>

            {/* CTA */}
            <GlowCard className="p-6 mt-8">
              <p className="text-text-secondary mb-4">
                Prefer a direct conversation?
              </p>
              <MagneticButton>
                <a
                  href="mailto:contact@liberblock.dev"
                  className="btn-secondary inline-block"
                >
                  Schedule a Call
                </a>
              </MagneticButton>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  )
}
