import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-ms-navy border-t border-[var(--border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo size={28} />
              <span className="font-syne font-bold text-base gradient-text">
                Latest Microsoft Updates & News
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
              Independent coverage of Microsoft news, updates, and insights — trusted by IT professionals worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-syne font-bold text-sm text-[var(--text-primary)] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-ms-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-syne font-bold text-sm text-[var(--text-primary)] mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.linkedin.com/in/anuj-singh-46140116a/" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-ms-accent transition-colors flex items-center gap-2">
                  💼 LinkedIn
                </a>
              </li>
              <li>
                <a href="https://youtube.com/@its_anujsinghh?si=IjM_Vp3iu4tbTW2i" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[#FF0000] transition-colors flex items-center gap-2">
                  ▶️ YouTube
                </a>
              </li>
              <li>
                <a href="https://instagram.com/its_anujsinghh" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[#E1306C] transition-colors flex items-center gap-2">
                  📸 Instagram
                </a>
              </li>
            </ul>

            <h4 className="font-syne font-bold text-sm text-[var(--text-primary)] mt-6 mb-3">Our App</h4>
            <a
              href="https://only4you-app.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-ms-accent transition-colors"
            >
              💜 Only4You App
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] text-center leading-relaxed">
            © 2026 Latest Microsoft Updates & News — Not affiliated with Microsoft Corporation.
          </p>
          <p className="text-xs text-[var(--text-muted)] text-center mt-2 leading-relaxed max-w-2xl mx-auto">
            Disclaimer: Microsoft Updates is an independent news website and is not affiliated with, endorsed by, or connected to Microsoft Corporation in any way. Microsoft, Windows, Azure, and other product names are trademarks of Microsoft Corporation.
          </p>
        </div>
      </div>
    </footer>
  )
}
