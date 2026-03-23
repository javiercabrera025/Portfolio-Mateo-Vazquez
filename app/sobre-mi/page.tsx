import type { Metadata } from 'next'
import { AboutPage } from '@/components/AboutPage'

export const metadata: Metadata = {
  title: 'Sobre mí',
  description: 'Conocé más sobre Mateo Vázquez, realizador audiovisual de Montevideo.',
  alternates: { canonical: 'https://mateovazquez.uy/sobre-mi' },
}

export default function SobreMiPage() {
  return <AboutPage />
}
