import type { Metadata } from 'next'
import { AboutPage } from '@/components/AboutPage'

export const metadata: Metadata = {
  title: 'Sobre mí',
  description: 'Conocé más sobre Mateo Vázquez, realizador audiovisual de Montevideo.',
}

export default function SobreMiPage() {
  return <AboutPage />
}
