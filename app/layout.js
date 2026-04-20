import { Inter, Newsreader, Roboto_Flex, Oi } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-newsreader',
  display: 'swap',
  adjustFontFallback: false,
})

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
})

const oi = Oi({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-oi',
  display: 'swap',
})

export const metadata = {
  title: 'Powertool',
  description: 'Powertool is your independent intelligence hub for the latest Microsoft news — Windows, Azure, Copilot AI, Microsoft 365, Power Platform, Fabric, and Security. Updated every 30 minutes.',
  keywords: 'powertool, microsoft updates, windows updates, azure updates, microsoft news, copilot ai, microsoft 365, power platform, microsoft fabric, security patches, patch tuesday',
  metadataBase: new URL('https://microsoftupdates.co.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Powertool — Microsoft Intelligence Hub',
    description: 'Your independent hub for the latest Microsoft news — Windows, Azure, Copilot AI, Microsoft 365, Power Platform, Fabric, and Security.',
    url: 'https://microsoftupdates.co.in',
    siteName: 'Powertool',
    locale: 'en_IN',
    type: 'website',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Powertool — Microsoft Intelligence Hub',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Powertool — Microsoft Intelligence Hub',
    description: 'Your independent hub for the latest Microsoft news — Windows, Azure, Copilot AI, M365, Power Platform, Fabric, Security.',
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
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${robotoFlex.variable} ${oi.variable}`}>
      <head>
        <meta name="theme-color" content="#f8f9fa" />
        <meta name="google-adsense-account" content="ca-pub-2413226939900202" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className={`bg-surface text-on-surface antialiased pt-24 ${inter.variable} ${newsreader.variable}`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2413226939900202"
          crossOrigin="anonymous"
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
              description: 'Microsoft Updates — Your independent hub for the latest Microsoft news covering Windows, Azure, Copilot AI, Microsoft 365, Power Platform, Fabric, and Security.',
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
              name: 'Microsoft Updates — Latest News & Updates',
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
        {/* Fixed top navbar */}
        <Navbar />

        {/* Decorative gradient orbs — fixed, pointer-events-none */}
        <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Purple orb — top-left, Power Platform */}
          <div className="orb-1 absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-400/20 to-purple-600/10 blur-[120px]" />
          {/* Blue orb — top-right, Fabric */}
          <div className="orb-2 absolute -top-20 -right-40 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-blue-400/18 to-indigo-500/10 blur-[100px]" />
          {/* Sky orb — bottom-center, Cloud */}
          <div className="orb-3 absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-t from-sky-400/14 to-cyan-300/8 blur-[110px]" />
          {/* Dot grid overlay */}
          <div className="dot-grid absolute inset-0 opacity-40" />
          {/* Scattered Microsoft app logos — global background */}
          {[
            { x: '5%',  y: '15%', rotate: -12, opacity: 0.07, svg: <svg viewBox="0 0 88 88" fill="none"><path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L.019 75.48l-.003-29.978zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349l-.011 41.34-47.318-6.677-.066-34.739z" fill="#00ADEF"/></svg> },
            { x: '14%', y: '68%', rotate: 8,   opacity: 0.07, svg: <svg viewBox="0 0 24 24"><path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3z" fill="#2B7CD3"/><path d="M8 7.5l1.5 6 1.5-4.5 1.5 4.5 1.5-6H15l-2.5 9h-1L10 12l-1.5 4.5h-1L5 7.5z" fill="white"/></svg> },
            { x: '22%', y: '28%', rotate: -6,  opacity: 0.07, svg: <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="2" fill="#217346"/><path d="M7 7.5l2.5 4-2.5 4h1.8l1.7-2.8 1.7 2.8H14l-2.5-4 2.5-4h-1.8L10.5 10.3 8.8 7.5z" fill="white"/></svg> },
            { x: '30%', y: '80%', rotate: 15,  opacity: 0.06, svg: <svg viewBox="0 0 24 24"><path d="M20 4h-3V3a2 2 0 00-4 0v1H7a1 1 0 00-1 1v12a1 1 0 001 1h13a1 1 0 001-1V5a1 1 0 00-1-1zm-7 10.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" fill="#6264A7"/><circle cx="13" cy="11" r="2" fill="white"/></svg> },
            { x: '40%', y: '12%', rotate: -20, opacity: 0.07, svg: <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="2" fill="#0078D4"/><path d="M13 7h7v2H13zm0 3h7v2H13zm0 3h5v2H13zM4 7h7a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" fill="#0078D4"/><ellipse cx="7.5" cy="12" rx="2.5" ry="3" fill="white"/></svg> },
            { x: '50%', y: '72%', rotate: 5,   opacity: 0.06, svg: <svg viewBox="0 0 24 24"><path d="M10.5 18H7a4 4 0 01-.5-7.96A6 6 0 0118 12h.5a3.5 3.5 0 010 7H10.5z" fill="#0364B8"/></svg> },
            { x: '58%', y: '22%', rotate: 18,  opacity: 0.07, svg: <svg viewBox="0 0 24 24"><path d="M13.05 4.24L7.28 17.67l9.57-.01-4.84-5.62 4.6-10.81H9.93L13.05 4.24z" fill="#0089D6"/><path d="M8.93 8.06L5 19.76h6.67l8.33-.1-7-1.99 1.88-4.39L8.93 8.06z" fill="#0089D6" opacity=".8"/></svg> },
            { x: '67%', y: '62%', rotate: -9,  opacity: 0.07, svg: <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="2" fill="#B7472A"/><path d="M8 7h4.5a3 3 0 010 6H10v4H8V7z" fill="white"/><rect x="10" y="9" width="2.5" height="2" rx="1" fill="#B7472A"/></svg> },
            { x: '76%', y: '18%', rotate: 12,  opacity: 0.06, svg: <svg viewBox="0 0 24 24"><path d="M21 9.5C21 6 17.87 3 14 3a8 8 0 00-8 8c0 1.85.63 3.55 1.68 4.9A5 5 0 0112 14h8.5a9 9 0 00.5-2.5c0-.67-.08-1.34-.22-2H12a2 2 0 01-2-2c0-2.21 1.79-4 4-4 2 0 3.7 1.4 4.2 3.3L21 9.5z" fill="#0078D4"/><path d="M3 15a8 8 0 0015.29 3.2A5 5 0 0114 19H7.5A6.5 6.5 0 013 15z" fill="#1BBAEE"/></svg> },
            { x: '84%', y: '74%', rotate: -15, opacity: 0.07, svg: <svg viewBox="0 0 24 24"><rect x="3"  y="12" width="4" height="9" rx="1" fill="#F2C811"/><rect x="10" y="7"  width="4" height="14" rx="1" fill="#F2C811" opacity=".8"/><rect x="17" y="3"  width="4" height="18" rx="1" fill="#F2C811" opacity=".6"/></svg> },
            { x: '91%', y: '35%', rotate: 22,  opacity: 0.06, svg: <svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="6" fill="#036C70"/><circle cx="15" cy="15" r="6" fill="#1A9BA1" opacity=".9"/><circle cx="9"  cy="15" r="4" fill="#37C6D0" opacity=".9"/></svg> },
            { x: '96%', y: '78%', rotate: -7,  opacity: 0.07, svg: <svg viewBox="0 0 24 24" fill="#191c1d"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.773.004 1.55.105 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg> },
            { x: '8%',  y: '88%', rotate: 10,  opacity: 0.07, svg: <svg viewBox="0 0 24 24"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" fill="none" stroke="#0078D4" strokeWidth="1.5"/><path d="M12 2l8 4.5-8 4.5-8-4.5z" fill="#0078D4" opacity=".5"/></svg> },
            { x: '45%', y: '44%', rotate: -18, opacity: 0.05, svg: <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#7B68EE"/></svg> },
            { x: '71%', y: '88%', rotate: 6,   opacity: 0.06, svg: <svg viewBox="0 0 24 24"><path d="M12 2l9 4v5c0 5.25-3.83 10.15-9 11.32C6.83 21.15 3 16.25 3 11V6l9-4z" fill="#107C10" opacity=".9"/><path d="M9 11l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/></svg> },
          ].map(({ x, y, rotate, opacity, svg }, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: x, top: y,
                width: '2.2rem', height: '2.2rem',
                opacity,
                transform: `rotate(${rotate}deg)`,
                display: 'block',
              }}
            >
              {svg}
            </span>
          ))}
        </div>

        {/* Full-width main area */}
        <div className="main-scroll-area w-full relative z-10">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
