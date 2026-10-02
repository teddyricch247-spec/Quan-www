import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SiteShell } from '../components/layout/SiteShell';
import { JsonLd } from '../components/JsonLd';
import { SITE_URL } from '../lib/seo';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const DEFAULT_TITLE = 'Quancis — One Model. Three Ways In.';
const DEFAULT_DESCRIPTION =
  'Quancis builds Kael, a composite intelligence, and the products people actually use it through: Kael, Quan Harness, and Quan Chat.';

// Tells search engines who publishes the site. Only facts the site already
// states: no social profiles or contact details are claimed here.
const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Quancis',
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Quancis',
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Quancis',
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: 'Quancis',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="bg-white text-ink antialiased font-sans selection:bg-ink selection:text-white">
        <JsonLd data={SITE_JSON_LD} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
