'use client'

import { useState } from 'react'

export default function Featured() {
  const covers = [
    { 
      src: '/assets/covers/cover1.jpg', 
      title: 'THE PILOT', 
      genre: 'Drama Series',
      desc: 'Director: J.R.' 
    },
    { 
      src: '/assets/covers/cover2.jpg', 
      title: 'CHICAGO SOUL', 
      genre: 'Documentary',
      desc: 'A Vertikal Original' 
    },
    { 
      src: '/assets/covers/cover3.jpg', 
      title: 'THE GRIND', 
      genre: 'Reality',
      desc: 'Season 1 Coming' 
    },
  ]

  return (
    <section className="py-24 bg-black text-white relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
            <h2 className="text-4xl font-bold tracking-tight">
              Streaming <span className="text-purple-500">Jan 1</span>
            </h2>
            <p className="hidden md:block text-gray-400 font-mono text-sm">
              /// CURATED_SELECTION
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {covers.map((cover, i) => (
            <CoverCard key={i} cover={cover} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Sub-component for Image Safety
function CoverCard({ cover }: { cover: any }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-gray-800 group-hover:border-purple-500/50 transition-all duration-300">
        
        {/* IMAGE with Fallback */}
        <img 
          src={imgError ? '/assets/placeholder-cover.jpg' : cover.src} 
          alt={cover.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">
          {cover.genre}
        </p>
        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
          {cover.title}
        </h3>
        <p className="text-sm text-gray-500">{cover.desc}</p>
      </div>
    </div>
  )
}

