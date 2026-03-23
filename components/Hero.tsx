'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@sanity/client'

const freshClient = createClient({
  projectId: '471979z9',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-01-22',
})

type Settings = {
  coverVideo?: {
    asset?: {
      url: string
    }
  }
}

export const Hero = ({ onReady }: { onReady?: () => void }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    freshClient
      .fetch<Settings>(`*[_type == "settings"][0]{ coverVideo{ asset->{ url } } }`)
      .then((data) => {
        setVideoUrl(data?.coverVideo?.asset?.url ?? null)
      })
      .catch(console.error)
      .finally(() => onReady?.())
  }, [])

  return (
    <section className='relative w-full h-screen bg-black overflow-hidden'>
      {videoUrl && (
        <video
          src={videoUrl}
          className='absolute inset-0 w-full h-full object-cover'
          autoPlay
          loop
          muted
          playsInline
          preload='none'
          disablePictureInPicture
        />
      )}
      <div className='absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3'>
        <span className='text-white/40 text-[10px] uppercase tracking-[0.3em] font-light'>Scroll</span>
        <div className='w-px h-10 bg-gradient-to-b from-white/40 to-transparent' />
      </div>
    </section>
  )
}
