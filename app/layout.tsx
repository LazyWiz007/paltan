import type { Metadata } from 'next';
import { Montserrat, Sacramento, Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const sacramento = Sacramento({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sacramento',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3020';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'The Golden AK69 Prompt — Paritosh Anand',
  description:
    '30 content ideas built around your personality, niche and goals — from the system behind 113 pieces a week.',
  openGraph: {
    title: 'The Golden AK69 Prompt',
    description:
      '30 content ideas built around your personality, niche and goals — from the system behind 113 pieces a week.',
    siteName: 'Paritosh Anand',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport = {
  themeColor: '#0b0a12',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${sacramento.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
