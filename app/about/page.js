import Link from 'next/link'

export const metadata = {
  title: 'About Us | MicrosoftUpdates.co.in',
  description: 'Learn about MicrosoftUpdates.co.in — an independent Microsoft news portal covering Windows, Azure, Copilot, Power Platform, and more for the Indian audience.',
  keywords: 'about, microsoftupdates, microsoft news, india, independent news',
  openGraph: {
    title: 'About Us | MicrosoftUpdates.co.in',
    description: 'An independent Microsoft news portal for the Indian audience.',
    url: 'https://microsoftupdates.co.in/about',
    siteName: 'MicrosoftUpdates.co.in',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-ms-accent transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">About Us</span>
      </nav>

      <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-10">
        <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-[var(--text-primary)] mb-6">
          About MicrosoftUpdates.co.in
        </h1>

        {/* Mission */}
        <section className="mb-8">
          <h2 className="font-syne font-bold text-xl text-ms-accent mb-3">Our Mission</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            MicrosoftUpdates.co.in is dedicated to delivering timely, accurate, and comprehensive coverage of the Microsoft ecosystem — tailored specifically for the Indian IT community. Whether you&apos;re a cloud architect evaluating Azure services, an IT administrator managing Microsoft 365 licenses, or a developer building with Power Platform, we bring you the news that matters most.
          </p>
        </section>

        {/* What We Cover */}
        <section className="mb-8">
          <h2 className="font-syne font-bold text-xl text-ms-accent mb-3">What We Cover</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '🪟', name: 'Windows 11 & Windows Server updates' },
              { icon: '☁️', name: 'Azure cloud services and pricing' },
              { icon: '⚡', name: 'Power Platform (Power Apps, Automate, BI, Pages)' },
              { icon: '🔷', name: 'Microsoft Fabric and analytics' },
              { icon: '📋', name: 'Microsoft licensing and pricing changes' },
              { icon: '🤖', name: 'Copilot and AI across Microsoft products' },
              { icon: '📊', name: 'Office 365 / Microsoft 365 features' },
              { icon: '🛡️', name: 'Security patches, CVEs, and Defender updates' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3 bg-ms-navy/50 rounded-lg p-3 border border-[var(--border)]">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-[var(--text-secondary)]">{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-8">
          <h2 className="font-syne font-bold text-xl text-ms-accent mb-3">Our Team</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            We are a team of Microsoft technology enthusiasts and certified professionals based in India. Our editorial team includes Azure-certified architects, Microsoft 365 administrators, and Power Platform developers who understand the real-world challenges facing Indian IT teams.
          </p>
        </section>

        {/* Disclaimer */}
        <section className="mb-8 bg-ms-navy/50 rounded-xl border border-ms-yellow/20 p-6">
          <h2 className="font-syne font-bold text-xl text-ms-yellow mb-3">Disclaimer</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            MicrosoftUpdates.co.in is an independent news website and is not affiliated with, endorsed by, or connected to Microsoft Corporation in any way. Microsoft, Windows, Azure, Office 365, Power Platform, Microsoft Fabric, Copilot, and other product names mentioned on this website are trademarks of Microsoft Corporation. All product names, logos, and brands are property of their respective owners.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-syne font-bold text-xl text-ms-accent mb-3">Contact Us</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Have a tip, question, or feedback? Reach out to us at{' '}
            <span className="text-ms-accent">contact@microsoftupdates.co.in</span>
          </p>
          <p className="text-[var(--text-secondary)] mt-2">
            For partnership and advertising inquiries:{' '}
            <span className="text-ms-accent">ads@microsoftupdates.co.in</span>
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a href="https://www.linkedin.com/in/anuj-singh-46140116a/" target="_blank" rel="noopener noreferrer" className="bg-[#0077B5] hover:bg-[#005885] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all font-syne">
              💼 LinkedIn
            </a>
            <a href="https://youtube.com/@its_anujsinghh?si=IjM_Vp3iu4tbTW2i&sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="bg-[#FF0000] hover:bg-[#CC0000] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all font-syne">
              ▶ YouTube — Subscribe
            </a>
            <a href="https://instagram.com/its_anujsinghh" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all font-syne">
              📸 Instagram
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
