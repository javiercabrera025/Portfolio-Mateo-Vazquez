import { ProjectDetails } from '@/components/ProjectDetails'

export default async function ProyectoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProjectDetails slug={slug} />
}
