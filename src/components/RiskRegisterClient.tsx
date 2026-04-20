'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RiskRegisterClient({ organizations }: { organizations: any[] }) {
  const router = useRouter()
  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || '')
  
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ description: '', status: 'Open', probability: 5, impact: 5, mitigationPlan: '' })

  const handleAddRisk = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!selectedOrgId) return alert("Select an organisation first.")
    
    const res = await fetch('/api/risks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, organizationId: selectedOrgId })
    })

    if(res.ok) {
      setShowAdd(false)
      setForm({ description: '', status: 'Open', probability: 5, impact: 5, mitigationPlan: '' })
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this risk log?")) return
    await fetch(`/api/risks?id=${id}`, { method: 'DELETE' })
    router.refresh()
  }

  // Exact math logic matching user's Excel model, mapped to Black & White styles
  const getRiskCategory = (prob: number, impact: number) => {
    const score = prob * impact
    if (score >= 80) return { label: 'Jeopardy', desc: 'Imminent Closure - Requires immediate attention', bg: 'bg-white text-black border-2 border-white font-black', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
    if (score >= 60) return { label: 'High', desc: 'Disruption likely - Requires attention and managed', bg: 'bg-neutral-800 text-white border-2 border-white', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    if (score >= 50) return { label: 'Medium', desc: 'Possible disruption - Needs to be managed', bg: 'bg-black text-white border-2 border-neutral-500', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    return { label: 'Low', desc: 'No disruption likely - Needs to be monitored', bg: 'bg-black text-neutral-500 border-2 border-neutral-800', icon: 'M5 13l4 4L19 7' }
  }

  const activeOrg = organizations.find((o:any) => o.id === selectedOrgId)
  const risks = activeOrg?.risks || []

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="bg-black p-8 border-2 border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex-1 w-full max-w-md">
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Select Organisation Context</label>
          <select 
            value={selectedOrgId} 
            onChange={e => setSelectedOrgId(e.target.value)}
            className="w-full px-5 py-4 bg-black border-2 border-neutral-700 font-bold text-white focus:border-white outline-none appearance-none cursor-pointer rounded-none"
          >
            {organizations.map((org:any) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors whitespace-nowrap"
        >
          + Log New Risk
        </button>
      </div>

      {showAdd && (
        <div className="bg-black border-2 border-white p-8 md:p-12 relative">
          <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-tighter">
            Log New Risk Incidence
          </h2>
          <form onSubmit={handleAddRisk} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Risk Description</label>
              <input required type="text" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full px-5 py-4 bg-black border-2 border-neutral-800 text-white font-medium focus:border-white outline-none placeholder:text-neutral-600 rounded-none" placeholder="e.g. Budget overruns during implementation" />
            </div>
            
            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Probability (1-10)</label>
              <input required type="number" min="1" max="10" value={form.probability} onChange={e=>setForm({...form, probability: parseInt(e.target.value)})} className="w-full px-5 py-4 bg-black border-2 border-neutral-800 text-white font-black text-2xl focus:border-white outline-none rounded-none" />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Impact (1-10)</label>
              <input required type="number" min="1" max="10" value={form.impact} onChange={e=>setForm({...form, impact: parseInt(e.target.value)})} className="w-full px-5 py-4 bg-black border-2 border-neutral-800 text-white font-black text-2xl focus:border-white outline-none rounded-none" />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">Mitigation Plan</label>
              <textarea required rows={3} value={form.mitigationPlan} onChange={e=>setForm({...form, mitigationPlan: e.target.value})} className="w-full px-5 py-4 bg-black border-2 border-neutral-800 text-white font-medium focus:border-white outline-none placeholder:text-neutral-600 resize-none rounded-none" placeholder="Action plan to reduce or control this risk..." />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-neutral-800">
              <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors">Save Risk Log</button>
              <button type="button" onClick={() => setShowAdd(false)} className="w-full sm:w-auto px-10 py-4 bg-black border-2 border-neutral-800 text-white font-bold uppercase tracking-widest text-sm hover:border-white transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-black border-2 border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-neutral-900 border-b-2 border-neutral-800">
                <th className="px-8 py-6 text-xs font-black text-white uppercase tracking-widest w-1/4">Risk Description</th>
                <th className="px-8 py-6 text-xs font-black text-white uppercase tracking-widest text-center w-32">Score</th>
                <th className="px-8 py-6 text-xs font-black text-white uppercase tracking-widest w-72">RRAG Status</th>
                <th className="px-8 py-6 text-xs font-black text-white uppercase tracking-widest">Mitigation Plan</th>
                <th className="px-8 py-6 text-xs font-black text-white uppercase tracking-widest text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-800">
              {risks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-neutral-500 font-medium">
                    <div className="flex flex-col items-center gap-4">
                      <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="uppercase tracking-widest font-bold">No active risks registered for this organisation.</p>
                    </div>
                  </td>
                </tr>
              ) : risks.map((r:any) => {
                const cat = getRiskCategory(r.probability, r.impact)
                const percent = r.probability * r.impact
                
                return (
                  <tr key={r.id} className="hover:bg-neutral-900/50 transition-colors group">
                    <td className="px-8 py-8 font-bold text-white">
                      <div className="line-clamp-2 text-lg leading-snug">{r.description}</div>
                      <div className="text-[10px] font-black text-neutral-500 mt-3 uppercase tracking-widest">
                        Logged: {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-black text-white tracking-tighter">{percent}%</span>
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mt-2">{r.probability} P × {r.impact} I</span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className={`px-5 py-4 flex items-start gap-4 ${cat.bg}`}>
                        <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d={cat.icon} />
                        </svg>
                        <div>
                          <div className="font-black text-sm tracking-widest uppercase mb-1.5">{cat.label}</div>
                          <div className="text-[11px] font-bold leading-tight opacity-90">{cat.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-sm text-neutral-400 font-medium leading-relaxed">
                      <div className="line-clamp-3">{r.mitigationPlan}</div>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <button 
                        onClick={() => handleDelete(r.id)} 
                        className="text-neutral-500 border-2 border-neutral-800 hover:border-white hover:text-white px-4 py-3 font-bold text-xs uppercase tracking-widest transition-colors"
                        title="Dismiss Risk"
                      >
                        Dismiss
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
