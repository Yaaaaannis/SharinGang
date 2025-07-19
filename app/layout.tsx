

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from './ClientProviders'
import { DynamicTitle } from '@/components/ui/DynamicTitle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://sharin-gang.vercel.app'),
  title: {
    default: 'SharinGang - Radio Anime Openings & Endings',
    template: '%s | SharinGang'
  },
  description: 'Écoutez en streaming les meilleures openings et endings d\'anime japonais. Radio gratuite avec une sélection unique de musiques d\'anime.',
  keywords: ['anime', 'openings', 'endings', 'musique japonaise', 'streaming', 'radio', 'j-pop', 'j-rock', 'ost anime'],
  authors: [{ name: 'SharinGang' }],
  creator: 'SharinGang',
  publisher: 'SharinGang',
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
    google: 'your-google-verification-code',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://sharin-gang.vercel.app',
    siteName: 'SharinGang',
    title: 'SharinGang - Radio Anime Openings & Endings',
    description: 'Écoutez en streaming les meilleures openings et endings d\'anime japonais. Radio gratuite avec une sélection unique de musiques d\'anime.',
    images: [
      {
        url: 'https://sharin-gang.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SharinGang - Radio Anime',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sharingang',
    creator: '@sharingang',
    title: 'SharinGang - Radio Anime Openings & Endings',
    description: 'Écoutez en streaming les meilleures openings et endings d\'anime japonais.',
    images: ['https://sharin-gang.vercel.app/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://sharin-gang.vercel.app',
  },
  category: 'music',
  classification: 'Radio streaming anime',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f00611" />
        <meta name="msapplication-TileColor" content="#f00611" />
        <meta name="application-name" content="SharinGang" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SharinGang" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#f00611" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="google-site-verification" content="IbcRLbhGwyQoLXwknn1ryhLQ21CQg7DkEfmzpRdqh7c" />
      </head>
      <body className={inter.className}>
        <ClientProviders>
          <DynamicTitle />
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
