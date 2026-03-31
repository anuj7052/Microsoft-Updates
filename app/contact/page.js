'use client'

import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-ms-accent transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">Contact</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-8">
          <h1 className="font-syne font-extrabold text-3xl text-[var(--text-primary)] mb-2">
            Get in Touch
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Have a news tip, feedback, or business inquiry? We&apos;d love to hear from you.
          </p>

          <form
            action="mailto:contact@microsoftupdates.co.in"
            method="POST"
            encType="text/plain"
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm text-[var(--text-secondary)] mb-1.5">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-ms-navy border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-ms-blue transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-[var(--text-secondary)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-ms-navy border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-ms-blue transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm text-[var(--text-secondary)] mb-1.5">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full bg-ms-navy border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-ms-blue transition-colors"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-[var(--text-secondary)] mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full bg-ms-navy border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-ms-blue transition-colors resize-none"
                placeholder="Your message..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-ms-blue hover:bg-ms-blue/90 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-6">
            <h2 className="font-syne font-bold text-lg text-[var(--text-primary)] mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--text-muted)] mb-1">General Inquiries</p>
                <p className="text-sm text-ms-accent">contact@microsoftupdates.co.in</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)] mb-1">Advertising & Partnerships</p>
                <p className="text-sm text-ms-accent">ads@microsoftupdates.co.in</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)] mb-1">News Tips</p>
                <p className="text-sm text-ms-accent">tips@microsoftupdates.co.in</p>
              </div>
            </div>
          </div>

          <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-6">
            <h2 className="font-syne font-bold text-lg text-[var(--text-primary)] mb-4">Follow Us</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-ms-accent transition-colors cursor-pointer">
                <span className="text-lg">𝕏</span>
                <span>Twitter / X</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-ms-accent transition-colors cursor-pointer">
                <span className="text-lg">💼</span>
                <span>LinkedIn</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-ms-accent transition-colors cursor-pointer">
                <span className="text-lg">▶️</span>
                <span>YouTube</span>
              </div>
            </div>
          </div>

          <div className="bg-ms-navy/50 rounded-2xl border border-[var(--border)] p-6">
            <h2 className="font-syne font-bold text-lg text-[var(--text-primary)] mb-2">Response Time</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We typically respond to all inquiries within 24-48 business hours. For urgent matters, please mention &quot;URGENT&quot; in your subject line.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
