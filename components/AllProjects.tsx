'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { client } from '@/lib/sanityClient'

interface SanityImageAsset {
  url: string
}

interface SanityImage {
  asset?: SanityImageAsset
}

interface Tag {
  _id: string
  label: string
}

interface Proyecto {
  _id: string
  title: string
  description: string
  image: SanityImage
  order?: number
  tag?: Tag
}

const slugFromTitle = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const slugFromLabel = (label: string) =>
  label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const AllProjects = () => {
  const [items, setItems] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTag = searchParams.get('tag')

  useEffect(() => {
    client
      .fetch<Proyecto[]>(
        `*[_type == "proyecto"]{ _id, title, description, image{ asset-> }, order, tag->{ _id, label } }`
      )
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) return a.order - b.order
          if (a.order !== undefined) return -1
          if (b.order !== undefined) return 1
          return a.title.localeCompare(b.title)
        })
        setItems(sorted)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Tags únicos presentes en los proyectos, en orden de aparición
  const availableTags: Tag[] = []
  const seenIds = new Set<string>()
  for (const p of items) {
    if (p.tag && !seenIds.has(p.tag._id)) {
      seenIds.add(p.tag._id)
      availableTags.push(p.tag)
    }
  }

  const filtered = activeTag
    ? items.filter((p) => p.tag && slugFromLabel(p.tag.label) === activeTag)
    : items

  const handleTagClick = (tag: Tag) => {
    const slug = slugFromLabel(tag.label)
    if (activeTag === slug) {
      router.push('/trabajos')
    } else {
      router.push(`/trabajos?tag=${slug}`)
    }
  }

  if (loading) {
    return (
      <section className='relative w-full bg-black pt-[calc(72px+5rem)] pb-20'>
        <div className='max-w-7xl mx-auto px-4 md:px-8'>
          <div className='h-9 w-36 bg-white/10 rounded mb-8 animate-pulse' />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'>
            {Array.from({ length: 16 }).map((_, i) => (
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
    <section className='relative w-full bg-black pt-[calc(72px+5rem)] pb-20'>
      <div className='max-w-7xl mx-auto px-4 md:px-8'>
        <h2 className='text-white text-4xl font-bold mb-8' style={{ fontFamily: 'var(--font-syne)' }}>
          Trabajos
        </h2>

        {availableTags.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-10'>
            <button
              onClick={() => router.push('/trabajos')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${
                !activeTag
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white'
              }`}
              style={{ fontFamily: 'var(--font-syne)' }}>
              Todos
            </button>
            {availableTags.map((tag) => {
              const isActive = activeTag === slugFromLabel(tag.label)
              return (
                <button
                  key={tag._id}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${
                    isActive
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-syne)' }}>
                  {tag.label}
                </button>
              )
            })}
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'>
          <AnimatePresence mode='wait'>
            {filtered.map((p, i) => {
              const imageUrl = p.image?.asset?.url
              return (
                <motion.article
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04, ease: 'easeOut' }}
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
                          <h3 className='font-bold text-white text-xl mb-2' style={{ fontFamily: 'var(--font-syne)' }}>
                            {p.title}
                          </h3>
                          {p.tag && (
                            <span className='text-white/60 text-xs uppercase tracking-widest'>
                              {p.tag.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
