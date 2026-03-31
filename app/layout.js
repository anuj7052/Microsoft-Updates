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
  title: {
    default: 'Microsoft Updates — Latest Microsoft News, Windows, Azure, Copilot & More',
    template: '%s | Microsoft Updates',
  },
  description: 'Microsoft Updates is your #1 source for the latest Microsoft news, Windows 11 updates, Azure cloud announcements, Microsoft 365, Copilot AI, Power Platform, Fabric, security patches, and licensing changes. Updated every 15 minutes with live RSS feeds from official Microsoft blogs.',
  keywords: 'microsoft updates, microsoft news, windows 11 update, windows 12, azure updates, microsoft 365, office 365, copilot ai, microsoft copilot, power platform, power bi, microsoft fabric, microsoft security, patch tuesday, microsoft licensing, microsoft india, azure india, teams update, excel update, word update, outlook update, microsoft defender, microsoft sentinel, github copilot, copilot pro, copilot studio, power apps, power automate, onelake, windows server',
  metadataBase: new URL('https://microsoftupdates.co.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Microsoft Updates — Latest Microsoft News & Updates',
    description: 'Your #1 source for latest Microsoft news — Windows, Azure, Copilot AI, Microsoft 365, Power Platform, Fabric, Security. Live updates every 15 minutes.',
    url: 'https://microsoftupdates.co.in',
    siteName: 'Microsoft Updates',
    locale: 'en_IN',
    type: 'website',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Microsoft Updates — Latest Microsoft News',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Microsoft Updates — Latest Microsoft News & Updates',
    description: 'Your #1 source for latest Microsoft news — Windows, Azure, Copilot AI, Microsoft 365, Power Platform, Fabric, Security.',
    images: ['/og-image.png'],
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
  other: {
    'google-site-verification': 'ADD_GOOGLE_VERIFICATION_CODE',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <meta name="theme-color" content="#0a0e1a" />
        <meta name="google-adsense-account" content="ca-pub-2413226939900202" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-dm antialiased min-h-screen">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2413226939900202"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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
              description: 'Your #1 source for the latest Microsoft news, updates, and insights — Windows, Azure, Copilot AI, Microsoft 365, Power Platform, Fabric, and Security.',
              inLanguage: 'en',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://microsoftupdates.co.in/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Microsoft Updates',
                url: 'https://microsoftupdates.co.in',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://microsoftupdates.co.in/og-image.png',
                },
                sameAs: [
                  'https://www.linkedin.com/in/anuj-singh-46140116a/',
                  'https://youtube.com/@its_anujsinghh',
                  'https://instagram.com/its_anujsinghh',
                ],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Microsoft Updates — Latest News',
              description: 'Browse the latest Microsoft news across Windows, Azure, Copilot, Microsoft 365, Power Platform, Fabric, Security, and Licensing.',
              url: 'https://microsoftupdates.co.in',
              mainEntity: {
                '@type': 'ItemList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Windows Updates', url: 'https://microsoftupdates.co.in/windows' },
                  { '@type': 'ListItem', position: 2, name: 'Azure Cloud Updates', url: 'https://microsoftupdates.co.in/azure' },
                  { '@type': 'ListItem', position: 3, name: 'Copilot & AI', url: 'https://microsoftupdates.co.in/copilot' },
                  { '@type': 'ListItem', position: 4, name: 'Microsoft 365', url: 'https://microsoftupdates.co.in/office365' },
                  { '@type': 'ListItem', position: 5, name: 'Power Platform', url: 'https://microsoftupdates.co.in/power-platform' },
                  { '@type': 'ListItem', position: 6, name: 'Microsoft Fabric', url: 'https://microsoftupdates.co.in/fabric' },
                  { '@type': 'ListItem', position: 7, name: 'Security Updates', url: 'https://microsoftupdates.co.in/security' },
                  { '@type': 'ListItem', position: 8, name: 'Licensing', url: 'https://microsoftupdates.co.in/licensing' },
                ],
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
