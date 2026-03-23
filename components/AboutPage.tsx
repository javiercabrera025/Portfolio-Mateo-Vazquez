'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/sanityClient'

interface AboutData {
  title: string
  content: any[]
}

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className='text-black/90 leading-relaxed text-lg mb-4'>{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className='font-semibold text-black'>{children}</strong>,
    em: ({ children }: any) => <em className='italic'>{children}</em>,
    link: ({ children, value }: any) => (
      <a href={value?.href} target='_blank' rel='noreferrer' className='underline text-blue-600'>
        {children}
      </a>
    ),
  },
}

export const AboutPage = () => {
  const [about, setAbout] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch<AboutData | null>('*[_type == "about"]{ _id, title, content }[0]')
      .then(setAbout)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className='bg-black pt-[calc(72px+5rem)] animate-pulse'>
        <div className='max-w-6xl mx-auto px-4 md:px-8 py-16 pb-0'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-start'>
            <div className='md:pr-20 space-y-4'>
              <div className='h-12 bg-white/10 rounded w-2/3 mb-8' />
              <div className='h-4 bg-white/10 rounded w-full' />
              <div className='h-4 bg-white/10 rounded w-5/6' />
              <div className='h-4 bg-white/10 rounded w-4/6' />
              <div className='h-4 bg-white/10 rounded w-full' />
              <div className='h-4 bg-white/10 rounded w-3/4' />
            </div>
            <div className='aspect-[4/5] bg-white/10 rounded' />
          </div>
        </div>
      </div>
    )
  }

  if (!about) return null

  return (
    <div className='bg-black pt-[calc(72px+5rem)]'>
      <main className='max-w-6xl mx-auto px-4 md:px-8 py-16 pb-0'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-start'>
          <div className='about-left md:pr-20'>
            <h1 className='text-4xl font-bold text-white mb-8' style={{ fontFamily: 'var(--font-syne)' }}>{about.title}</h1>
            <div className='text-white/90'>
              <PortableText value={about.content} components={portableTextComponents} />
            </div>
          </div>
          <div className='relative'>
            <div className='relative overflow-hidden'>
              <Image
                src='https://mateovazquez.uy/mateo-profile.jpeg'
                alt='Mateo Vazquez'
                width={800}
                height={1000}
                className='w-full h-auto object-contain [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]'
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
