import type { Metadata } from 'next'
import { ProjectDetails } from '@/components/ProjectDetails'
import { client } from '@/lib/sanityClient'

interface Proyecto {
  title: string
  description: string
  image?: { asset?: { url: string } }
  order?: number
  _updatedAt: string
}

const slugFromTitle = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

async function getAllProjects() {
  return client.fetch<Proyecto[]>(
    `*[_type == "proyecto"]{ title, description, image{ asset->{ url } }, order, _updatedAt }`
  )
}

function sortProjects(projects: Proyecto[]) {
  return [...projects].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.title.localeCompare(b.title)
  })
}

export async function generateStaticParams() {
  const projects = await client.fetch<{ title: string }[]>(
    `*[_type == "proyecto"]{ title }`
  )
  return projects.map((p) => ({ slug: slugFromTitle(p.title) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const projects = await getAllProjects()
  const project = sortProjects(projects).find((p) => slugFromTitle(p.title) === slug)

  if (!project) return { title: 'Trabajo' }

  const imageUrl = project.image?.asset?.url
  const canonicalUrl = `https://mateovazquez.uy/trabajos/${slug}`

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      title: `${project.title} – Mateo Vázquez`,
      description: project.description,
      url: canonicalUrl,
      locale: 'es_UY',
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: project.title }]
        : [{ url: 'https://mateovazquez.uy/mateo.jpeg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} – Mateo Vázquez`,
      description: project.description,
      images: imageUrl ? [imageUrl] : ['https://mateovazquez.uy/mateo.jpeg'],
    },
  }
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const projects = await getAllProjects()
  const project = sortProjects(projects).find((p) => slugFromTitle(p.title) === slug)

  const jsonLd = project
    ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description,
        image: project.image?.asset?.url,
        url: `https://mateovazquez.uy/trabajos/${slug}`,
        dateModified: project._updatedAt,
        creator: {
          '@type': 'Person',
          name: 'Mateo Vázquez',
          url: 'https://mateovazquez.uy',
        },
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProjectDetails slug={slug} />
    </>
  )
}
