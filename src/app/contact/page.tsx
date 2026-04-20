'use client'

import { useState } from 'react'
import { Analysis } from 'undraw-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) setIsSuccess(true)
      else setErrorMsg("Failed to send message. Please try again.")
    } catch(err) {
      setErrorMsg("An unexpected error occurred.")
    }
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center border-2 border-black mt-12 bg-white">
        <div className="w-24 h-24 bg-black text-white flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-black text-black mb-4 tracking-tighter uppercase">Message Sent</h2>
        <p className="text-sm text-neutral-500 font-bold uppercase tracking-widest max-w-lg mx-auto">Thank you for reaching out. A consultant will review your message.</p>
        <div className="mt-12">
          <button onClick={() => {setIsSuccess(false); setFormData({name:'', email:'', message:''})}} className="px-8 py-4 bg-white border-2 border-black text-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
            Send Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 flex flex-col lg:flex-row gap-12 items-center">
      <div className="flex-1 w-full max-w-xl flex justify-center">
        {/* unDraw illustration explicitly black/white */}
        <div className="w-full grayscale contrast-200 drop-shadow-2xl opacity-90">
          <Analysis primaryColor="#000000" height="300px" />
        </div>
      </div>

      <div className="flex-1 w-full max-w-lg">
        <div className="mb-10">
          <h1 className="text-5xl font-black text-black tracking-tighter uppercase">Contact</h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-widest text-neutral-500">Have questions about AIMM? We're here to help.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 border-2 border-black space-y-6">
          {errorMsg && (
            <div className="p-4 bg-black text-white font-black text-xs uppercase tracking-widest">
              {errorMsg}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 border-2 border-neutral-300 focus:outline-none focus:border-black bg-white transition-colors rounded-none" placeholder="Jane Doe" />
          </div>
          
          <div>
            <label className="block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest">Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 border-2 border-neutral-300 focus:outline-none focus:border-black bg-white transition-colors rounded-none" placeholder="jane@example.com" />
          </div>

          <div>
            <label className="block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest">Your Message</label>
            <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-5 py-4 border-2 border-neutral-300 focus:outline-none focus:border-black bg-white transition-colors resize-none rounded-none" placeholder="How can we help?" />
          </div>

          <button disabled={isSubmitting} type="submit" className="w-full py-5 mt-4 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-neutral-800 disabled:opacity-50 transition-colors">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
