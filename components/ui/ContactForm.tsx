'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import MagneticButton from './MagneticButton'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setStatus('success')
      reset()

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg
                     text-text-primary placeholder:text-text-secondary/50
                     focus:outline-none focus:border-accent-bitcoin
                     transition-colors duration-300"
          placeholder="Your name"
          disabled={status === 'loading'}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg
                     text-text-primary placeholder:text-text-secondary/50
                     focus:outline-none focus:border-accent-bitcoin
                     transition-colors duration-300"
          placeholder="your@email.com"
          disabled={status === 'loading'}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Message field */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="w-full px-4 py-3 bg-bg-card border border-border rounded-lg
                     text-text-primary placeholder:text-text-secondary/50
                     focus:outline-none focus:border-accent-bitcoin
                     transition-colors duration-300 resize-none"
          placeholder="Tell us about your project..."
          disabled={status === 'loading'}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Submit button */}
      <MagneticButton>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-4 px-6 bg-accent-bitcoin text-bg-primary font-semibold
                     rounded-lg transition-all duration-300 hover:bg-accent-gold
                     hover:shadow-lg hover:shadow-accent-bitcoin/25
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Message Sent!
            </>
          ) : status === 'error' ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Failed to Send
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </MagneticButton>

      {/* Status messages */}
      {status === 'success' && (
        <p className="text-center text-green-500 text-sm">
          Thank you! We&apos;ll get back to you soon.
        </p>
      )}
      {status === 'error' && (
        <p className="text-center text-red-500 text-sm">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
