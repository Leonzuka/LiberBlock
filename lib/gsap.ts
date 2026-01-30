import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Default easing functions
export const easings = {
  smooth: 'power3.out',
  snappy: 'power4.out',
  elastic: 'elastic.out(1, 0.5)',
  bounce: 'bounce.out',
  slow: 'power2.inOut',
}

// Animation presets
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 0.6, ease: easings.smooth },
  },
  fadeInUp: {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: easings.smooth },
  },
  fadeInDown: {
    from: { opacity: 0, y: -40 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: easings.smooth },
  },
  fadeInLeft: {
    from: { opacity: 0, x: -40 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: easings.smooth },
  },
  fadeInRight: {
    from: { opacity: 0, x: 40 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: easings.smooth },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1, duration: 0.6, ease: easings.elastic },
  },
}

// Create a scroll-triggered animation
export function createScrollAnimation(
  element: Element | null,
  animation: keyof typeof animations,
  options: {
    trigger?: Element | string
    start?: string
    end?: string
    scrub?: boolean | number
    markers?: boolean
    delay?: number
  } = {}
) {
  if (!element) return null

  const anim = animations[animation]

  return gsap.fromTo(element, anim.from, {
    ...anim.to,
    delay: options.delay || 0,
    scrollTrigger: {
      trigger: options.trigger || element,
      start: options.start || 'top 80%',
      end: options.end,
      scrub: options.scrub,
      markers: options.markers,
      toggleActions: options.scrub ? undefined : 'play none none reverse',
    },
  })
}

// Stagger animation for multiple elements
export function createStaggerAnimation(
  elements: Element[] | NodeListOf<Element>,
  animation: keyof typeof animations,
  stagger: number = 0.1,
  options: {
    trigger?: Element | string
    start?: string
  } = {}
) {
  if (!elements || elements.length === 0) return null

  const anim = animations[animation]
  const trigger = options.trigger || elements[0]

  return gsap.fromTo(elements, anim.from, {
    ...anim.to,
    stagger,
    scrollTrigger: {
      trigger,
      start: options.start || 'top 80%',
      toggleActions: 'play none none reverse',
    },
  })
}

// Text split animation helper
export function splitText(text: string, by: 'chars' | 'words' = 'chars') {
  if (by === 'chars') {
    return text.split('').map((char) => (char === ' ' ? '\u00A0' : char))
  }
  return text.split(' ')
}

export { gsap, ScrollTrigger }
