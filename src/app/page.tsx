'use client'

import Link from 'next/link'
import { Analysis } from 'undraw-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[75vh]">
      
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-24 gap-16">
        <div className="flex-1 space-y-8 max-w-2xl">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-black uppercase leading-[1.1]">
            Measure your digital maturity
          </h1>
          <p className="text-xl text-neutral-500 font-bold uppercase tracking-widest leading-relaxed max-w-lg">
            Join today and benchmark your organizational capabilities. Built for modern enterprises ready to transform.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signup" className="px-8 py-5 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-neutral-800 transition-colors text-center inline-block">
              Sign Up
            </Link>
            <Link href="/assessment" className="px-8 py-5 bg-white text-black font-black uppercase tracking-widest text-sm border-2 border-black hover:bg-neutral-100 transition-colors text-center inline-block">
              Take Assessment
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-xl flex justify-center lg:justify-end">
          {/* We wrap the unDraw illustration in a div and apply CSS filters to force it to black/white */}
          <div className="w-full grayscale contrast-200 drop-shadow-2xl">
            <Analysis color="#000000" style={{ height: '250px' }} />
          </div>
        </div>
      </div>

    </div>
  )
}
