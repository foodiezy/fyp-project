'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Authentication } from "undraw-react"

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (res?.error) {
      setError("Invalid credentials. Please verify your email and password.")
      setIsLoading(false)
    } else {
      router.push('/consultant')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[70vh] flex flex-col lg:flex-row items-center justify-center gap-16 -mx-4">
      <div className="hidden lg:flex flex-1 w-full max-w-md justify-center grayscale contrast-200">
        <Authentication color="#000000" style={{ height: '300px' }} />
      </div>

      <div className="bg-white p-8 sm:p-12 w-full max-w-md border-2 border-black flex-1">
        <h1 className="text-4xl font-black text-black mb-2 tracking-tighter uppercase">Logon</h1>
        <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-8">Sign in to your account</p>
        
        {error && <div className="bg-black text-white p-4 mb-6 font-black uppercase tracking-widest text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white border-2 border-neutral-300 text-black focus:border-black outline-none rounded-none transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white border-2 border-neutral-300 text-black focus:border-black outline-none rounded-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white font-black py-5 uppercase tracking-widest text-sm hover:bg-neutral-800 disabled:opacity-50 transition-colors mt-4"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-neutral-500">
          Not registered yet?{' '}
          <Link href="/auth/signup" className="text-black hover:underline underline-offset-4 decoration-2">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
