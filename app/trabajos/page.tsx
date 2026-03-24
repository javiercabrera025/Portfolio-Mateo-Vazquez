import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AllProjects } from '@/components/AllProjects'

export const metadata: Metadata = {
  title: 'Trabajos',
  description: 'Todos los proyectos audiovisuales de Mateo Vázquez.',
  alternates: { canonical: 'https://mateovazquez.uy/trabajos' },
}

export default function TrabajosPage() {
  return (
    <Suspense>
      <AllProjects />
    </Suspense>
  )
}
