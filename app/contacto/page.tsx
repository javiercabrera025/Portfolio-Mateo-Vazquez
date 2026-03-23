import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contactate con Mateo Vázquez para proyectos audiovisuales.',
  alternates: { canonical: 'https://mateovazquez.uy/contacto' },
}

export default function ContactoPage() {
  return <ContactForm />
}
