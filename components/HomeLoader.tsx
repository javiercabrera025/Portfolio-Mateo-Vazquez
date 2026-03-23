'use client'

import { useState } from 'react'
import { Hero } from './Hero'
import { Projects } from './Projects'

export const HomeLoader = () => {
  const [heroReady, setHeroReady] = useState(false)
  const [projectsReady, setProjectsReady] = useState(false)

  const isLoading = !heroReady || !projectsReady

  return (
    <>
      {/* Overlay sutil mientras cargan los dos */}
      <div
        className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500 pointer-events-none ${
          isLoading ? 'opacity-100' : 'opacity-0'
        }`}>
        <div className='relative w-8 h-8'>
          <div className='absolute inset-0 rounded-full border border-white/15' />
          <div className='absolute inset-0 rounded-full border border-white/60 border-t-transparent animate-spin' />
        </div>
      </div>

      <Hero onReady={() => setHeroReady(true)} />
      <Projects onReady={() => setProjectsReady(true)} />
    </>
  )
}
