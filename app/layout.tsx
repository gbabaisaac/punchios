import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Punch: The AI friend that texts first',
  description:
    'Punch is the first AI that reaches out before you do. It remembers your life, matches your texting style, and actually cares.',
  keywords: 'AI, friend, mental health, companion, proactive AI, texting, emotional support',
  icons: {
    icon: '/img/transparentpunchiocn.png',
  },
  openGraph: {
    title: 'Punch: The AI friend that texts first',
    description:
      'The first AI that reaches out before you do. Punch remembers your life, matches your texting style, and actually cares.',
    images: ['/img/Punchio.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Punch: The AI friend that texts first',
    description:
      'The first AI that reaches out before you do. Punch remembers your life, matches your texting style, and actually cares.',
    images: ['/img/Punchio.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>{children}</body>
    </html>
  )
}
