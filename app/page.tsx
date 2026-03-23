import { HomeLoader } from '@/components/HomeLoader'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mateo Vázquez',
  jobTitle: 'Realizador Audiovisual',
  url: 'https://mateovazquez.uy',
  image: 'https://mateovazquez.uy/mateo-profile.jpeg',
  description:
    'Portfolio audiovisual de Mateo Vázquez. Producción, rodaje y edición de proyectos de no ficción.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Montevideo',
    addressCountry: 'UY',
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeLoader />
    </>
  )
}
