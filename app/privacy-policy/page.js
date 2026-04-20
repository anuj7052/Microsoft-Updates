import Link from 'next/link'

export const metadata = {
  description: 'Privacy Policy for MicrosoftUpdates.co.in — learn how we collect, use, and protect your data, including our use of Google AdSense and cookies.',
  keywords: 'privacy policy, cookies, google adsense, data protection, microsoftupdates',
  openGraph: {
    title: 'Privacy Policy | MicrosoftUpdates.co.in',
    description: 'Privacy Policy — how we handle your data and use cookies.',
    url: 'https://microsoftupdates.co.in/privacy-policy',
    siteName: 'MicrosoftUpdates.co.in',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-ms-accent transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">Privacy Policy</span>
      </nav>

      <div className="bg-ms-card rounded-2xl border border-[var(--border)] p-6 md:p-10">
        <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-[var(--text-primary)] mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Last Updated: March 2026</p>

        {/* 1. Introduction */}
        <section className="mb-8">
          <h2 className="font-syne font-bold text-xl text-ms-accent mb-3">1. Introduction</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Welcome to MicrosoftUpdates.co.in (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring a safe online experience. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at microsoftupdates.co.in. Please read this privacy policy carefully. By using the website, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="mb-8">
          <h2 className="font-syne font-bold text-xl text-ms-accent mb-3">2. Information We Collect</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
            We may collect information about you in a variety of ways. The information we may collect on the website includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
            <li><strong className="text-[var(--text-primary)]">Personal Data:</strong> If you contact us via email or our contact form, we collect your name, email address, and any message content you provide voluntarily.</li>
            <li><strong className="text-[var(--text-primary)]">Log Data:</strong> When you visit our website, our servers automatically log standard data including your IP address, browser type, operating system, referring URLs, pages visited, and timestamps.</li>
            <li><strong className="text-[var(--text-primary)]">Cookies and Tracking:</strong> We use cookies and similar tracking technologies to enhance your browsing experience and serve relevant advertisements. See Section 3 for details.</li>
          </ul>
        </section>

        {/* 3. Google AdSense & Cookies */}
        <section className="mb-8 bg-ms-navy/50 rounded-xl border border-ms-yellow/20 p-6">
          <h2 className="font-syne font-bold text-xl text-ms-yellow mb-3">3. Google AdSense & Cookies</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
            We use Google AdSense to display advertisements on our website. Google AdSense is an advertising service provided by Google LLC.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
            Google uses cookies to serve ads based on your prior visits to our website and other websites on the internet. Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to MicrosoftUpdates.co.in and/or other sites on the Internet.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
            You may opt out of personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ms-accent hover:underline"
            >
              Google Ads Settings
            </a>.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            For more information about how Google uses data when you use our website, please visit{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ms-accent hover:underline"
            >
              Google&apos;s Privacy & Terms page
            </a>.
          </p>
        </section>

        {/* 4. Third-Party Services */}
        <section className="mb-8">
          <h2 className="font-syne font-bold text-xl text-ms-accent mb-3">4. Third-Party Services</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
            We may use third-party services that collect, monitor, and analyze browsing data. These include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
            <li><strong className="text-[var(--text-primary)]">Google AdSense:</strong> For displaying advertisements. Google may use cookies and web beacons to collect data for ad personalization.</li>
            <li><strong className="text-[var(--text-primary)]">Google Analytics:</strong> For analyzing website traffic and user behavior. Google Analytics collects data such as pages visited, time spent on pages, and demographic information in an anonymized manner.</li>

          </ul>
        </section>

        {/* 5. Your Rights */}
        <section className="mb-8">
          <h2 className="font-syne font-bold text-xl text-ms-accent mb-3">5. Your Rights</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
            <li>The right to access the personal data we hold about you</li>
            <li>The right to request correction of inaccurate personal data</li>
            <li>The right to request deletion of your personal data</li>
            <li>The right to opt out of personalized advertising</li>
            <li>The right to withdraw consent at any time</li>
          </ul>
          <p className="text-[var(--text-secondary)] leading-relaxed mt-3">
            To exercise any of these rights, please contact us using the information provided below.
          </p>
        </section>

        {/* 6. Data Security */}
        <section className="mb-8">
          <h2 className="font-syne font-bold text-xl text-ms-accent mb-3">6. Data Security</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* 7. Contact Information */}
        <section>
          <h2 className="font-syne font-bold text-xl text-ms-accent mb-3">7. Contact Information</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-ms-accent mt-2">contact@microsoftupdates.co.in</p>
          <p className="text-[var(--text-secondary)] mt-4 text-sm">
            MicrosoftUpdates.co.in<br />
            India
          </p>
        </section>
      </div>
    </div>
  )
}
