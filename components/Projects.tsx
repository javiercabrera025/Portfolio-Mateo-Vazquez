'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { client } from '@/lib/sanityClient'

interface SanityImageAsset {
  url: string
}

interface SanityImage {
  asset?: SanityImageAsset
}

interface Proyecto {
  _id: string
  title: string
  description: string
  image: SanityImage
  order?: number
}

const slugFromTitle = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const Projects = ({ onReady }: { onReady?: () => void }) => {
  const [items, setItems] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    client
      .fetch<Proyecto[]>(
        `*[_type == "proyecto"]{ _id, title, description, image{ asset-> }, order }`
      )
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) return a.order - b.order
          if (a.order !== undefined) return -1
          if (b.order !== undefined) return 1
          return a.title.localeCompare(b.title)
        })
        setItems(sorted.slice(0, 9))
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
      .finally(() => onReady?.())
  }, [])

  if (loading) {
    return (
      <section className='relative w-full bg-black py-20 min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 md:px-8'>
          <div className='h-9 w-36 bg-white/10 rounded mb-8 animate-pulse' />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className='bg-white/5 p-2 animate-pulse'>
                <div className='aspect-video bg-white/10' />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='relative w-full bg-black py-20 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 md:px-8'>
        <h2 className='text-white text-3xl font-bold mb-8 tracking-tight' style={{ fontFamily: 'var(--font-syne)' }}>Trabajos</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'>
          {items.map((p, i) => {
            const imageUrl = p.image?.asset?.url
            return (
              <motion.article
                key={p._id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
                onClick={() => router.push(`/trabajos/${slugFromTitle(p.title)}`)}
                className='relative cursor-pointer transition-transform duration-300 group'>
                <div className='relative bg-white p-2 shadow-[0_20px_40px_rgba(0,0,0,0.45)]'>
                  <div className='relative overflow-hidden aspect-video'>
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={p.title}
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                      />
                    )}
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex items-center justify-center'>
                      <div className='opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 px-4 text-center'>
                        <h3 className='font-bold text-white text-xl mb-2' style={{ fontFamily: 'var(--font-syne)' }}>{p.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        <div className='mt-12 flex justify-center'>
          <Link
            href='/trabajos'
            className='inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-light tracking-widest uppercase border border-white/20 hover:border-white/50 px-8 py-3 transition-all duration-300'>
            Ver todos los trabajos
          </Link>
        </div>
      </div>
    </section>
  )
}
