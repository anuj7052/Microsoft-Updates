import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata = {
  title: 'Microsoft Updates — Latest Microsoft News & Updates',
  description: 'Your go-to source for the latest Microsoft news, updates, and insights covering Windows, Azure, Power Platform, Microsoft Fabric, Copilot AI, Office 365, Licensing, and Security.',
  keywords: 'microsoft, windows, azure, power platform, microsoft fabric, copilot, office 365, licensing, security, news, updates, microsoft 365, copilot ai, azure cloud, windows 11',
  metadataBase: new URL('https://microsoftupdates.co.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Microsoft Updates — Latest Microsoft News & Updates',
    description: 'Your go-to source for the latest Microsoft news, updates, and insights.',
    url: 'https://microsoftupdates.co.in',
    siteName: 'Microsoft Updates',
    locale: 'en',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Microsoft Updates — Latest Microsoft News & Updates',
    description: 'Your go-to source for the latest Microsoft news, updates, and insights.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'ADD_GOOGLE_VERIFICATION_CODE',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
      </head>
      <body className="font-dm antialiased min-h-screen">
        {/* Google Translate container */}
        <div id="google_translate_element" className="google-translate-hidden"></div>
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'hi,bn,te,ta,mr,gu,kn,ml,pa,ur,es,fr,de,ja,zh-CN,ar,pt,ru,ko',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false,
                }, 'google_translate_element');
              }
            `,
          }}
        />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Microsoft Updates',
              url: 'https://microsoftupdates.co.in',
              description: 'Your go-to source for the latest Microsoft news, updates, and insights.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://microsoftupdates.co.in/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Microsoft Updates',
                url: 'https://microsoftupdates.co.in',
              },
            }),
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
