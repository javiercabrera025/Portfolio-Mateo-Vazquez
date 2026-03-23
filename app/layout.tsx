import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-syne',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mateovazquez.uy'),
  title: {
    default: 'Mateo Vázquez – Realizador Audiovisual',
    template: '%s – Mateo Vázquez',
  },
  description:
    'Portfolio audiovisual de Mateo Vázquez. Producción, rodaje y edición de proyectos de no ficción.',
  keywords: [
    'Mateo Vázquez',
    'realizador audiovisual',
    'video',
    'producción audiovisual',
    'filmmaker',
    'Montevideo',
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://mateovazquez.uy/' },
  openGraph: {
    type: 'website',
    title: 'Mateo Vázquez – Realizador Audiovisual',
    description:
      'Portfolio audiovisual de Mateo Vázquez. Producción, rodaje y edición de proyectos de no ficción.',
    url: 'https://mateovazquez.uy/',
    images: [{ url: 'https://mateovazquez.uy/mateo.jpeg', width: 1200, height: 630 }],
    locale: 'es_UY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mateo Vázquez – Realizador Audiovisual',
    description:
      'Portfolio audiovisual de Mateo Vázquez. Producción, rodaje y edición de proyectos de no ficción.',
    images: ['https://mateovazquez.uy/mateo.jpeg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es' className={`${inter.className} ${syne.variable}`}>
      <body className='min-h-screen bg-white antialiased flex flex-col'>
        <Header />
        <main className='flex-1 bg-black'>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
