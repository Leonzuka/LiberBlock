'use client'

import { useRef, useEffect, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  stagger?: number
  className?: string
  splitBy?: 'chars' | 'words' | 'lines'
  triggerOnScroll?: boolean
}

export default function TextReveal({
  children,
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
  className = '',
  splitBy = 'chars',
  triggerOnScroll = false,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return

    const text = textRef.current.textContent || ''
    let elements: string[]

    if (splitBy === 'chars') {
      elements = text.split('')
    } else if (splitBy === 'words') {
      elements = text.split(' ')
    } else {
      elements = [text]
    }

    // Create wrapped elements
    textRef.current.innerHTML = elements
      .map(
        (el, i) =>
          `<span class="inline-block overflow-hidden"><span class="reveal-element inline-block" style="transform: translateY(100%)">${el === ' ' ? '&nbsp;' : el}</span></span>`
      )
      .join(splitBy === 'words' ? ' ' : '')

    const revealElements = textRef.current.querySelectorAll('.reveal-element')

    const tl = gsap.timeline({
      scrollTrigger: triggerOnScroll
        ? {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        : undefined,
      delay: triggerOnScroll ? 0 : delay,
    })

    tl.to(revealElements, {
      y: 0,
      duration,
      stagger,
      ease: 'power3.out',
    })

    return () => {
      tl.kill()
    }
  }, [children, delay, duration, stagger, splitBy, triggerOnScroll])

  return (
    <div ref={containerRef} className={className}>
      <span ref={textRef}>{children}</span>
    </div>
  )
}
