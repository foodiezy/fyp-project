'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MatrixEditorClient({ initialModel }: { initialModel: any }) {
  const router = useRouter()
  const [model, setModel] = useState(initialModel)
  
  // Modal states
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [detailsForm, setDetailsForm] = useState({ name: model.name, description: model.description || '', version: model.version })
  
  const [isAddingDimension, setIsAddingDimension] = useState(false)
  const [dimName, setDimName] = useState('')

  const [editingDimension, setEditingDimension] = useState<any>(null)
  const [editingLevel, setEditingLevel] = useState<any>(null)

  const handleUpdateDetails = async () => {
    const res = await fetch(`/api/models/${model.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(detailsForm)
    })
    if(res.ok) {
      setModel({...model, ...detailsForm})
      setIsEditingDetails(false)
      router.refresh()
    } else alert("Failed to update.")
  }

  const handleAddDimension = async () => {
    if(!dimName) return
    const res = await fetch(`/api/dimensions`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: dimName, maturityModelId: model.id })
    })
    if(res.ok) {
      setDimName('')
      setIsAddingDimension(false)
      router.refresh()
    }
  }

  const handleUpdateDimension = async () => {
    if(!editingDimension) return
    const res = await fetch(`/api/dimensions/${editingDimension.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: editingDimension.name })
    })
    if(res.ok) {
      setEditingDimension(null)
      router.refresh()
    }
  }

  const handleUpdateLevel = async () => {
    if(!editingLevel) return
    const res = await fetch(`/api/levels/${editingLevel.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: editingLevel.name, description: editingLevel.description })
    })
    if(res.ok) {
      setEditingLevel(null)
      router.refresh()
    }
  }

  const handleAddQuestion = async (dimId: string) => {
    const text = prompt("Enter the new criteria/question text:")
    if(!text) return
    const res = await fetch(`/api/questions`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ text, dimensionId: dimId })
    })
    if(res.ok) router.refresh()
  }

  const handleDeleteQuestion = async (qId: string) => {
    if(!confirm("Are you sure you want to permanently delete this criteria?")) return
    const res = await fetch(`/api/questions/${qId}`, { method: 'DELETE' })
    if(res.ok) router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      
      {/* Details Modal */}
      {isEditingDetails && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-black border-2 border-white p-8 max-w-lg w-full">
            <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-tighter">Edit Meta</h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-neutral-400 mb-2 block uppercase tracking-widest">Title</label>
                <input value={detailsForm.name} onChange={e=>setDetailsForm({...detailsForm, name: e.target.value})} className="w-full p-4 bg-black border-2 border-neutral-800 text-white focus:border-white focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-400 mb-2 block uppercase tracking-widest">Version</label>
                <input value={detailsForm.version} onChange={e=>setDetailsForm({...detailsForm, version: e.target.value})} className="w-full p-4 bg-black border-2 border-neutral-800 text-white focus:border-white focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-400 mb-2 block uppercase tracking-widest">Description</label>
                <textarea value={detailsForm.description} onChange={e=>setDetailsForm({...detailsForm, description: e.target.value})} className="w-full p-4 bg-black border-2 border-neutral-800 text-white focus:border-white focus:outline-none transition-colors resize-none" rows={4} />
              </div>
            </div>
            <div className="flex gap-4 justify-end mt-8 pt-6 border-t-2 border-neutral-800">
              <button onClick={()=>setIsEditingDetails(false)} className="px-6 py-3 text-white font-bold border-2 border-neutral-800 hover:border-white uppercase tracking-widest text-sm transition-colors">Cancel</button>
              <button onClick={handleUpdateDetails} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Dimension Modal */}
      {isAddingDimension && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-black border-2 border-white p-8 max-w-md w-full">
            <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-tighter">New Category</h2>
            <div>
              <label className="text-xs font-bold text-neutral-400 mb-2 block uppercase tracking-widest">Dimension Name</label>
              <input value={dimName} onChange={e=>setDimName(e.target.value)} className="w-full p-4 bg-black border-2 border-neutral-800 text-white focus:border-white focus:outline-none transition-colors" placeholder="e.g. Innovation" autoFocus />
            </div>
            <div className="flex gap-4 justify-end mt-8 pt-6 border-t-2 border-neutral-800">
              <button onClick={()=>setIsAddingDimension(false)} className="px-6 py-3 text-white font-bold border-2 border-neutral-800 hover:border-white uppercase tracking-widest text-sm transition-colors">Cancel</button>
              <button onClick={handleAddDimension} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dimension Modal */}
      {editingDimension && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-black border-2 border-white p-8 max-w-md w-full">
            <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-tighter">Rename Category</h2>
            <div>
              <label className="text-xs font-bold text-neutral-400 mb-2 block uppercase tracking-widest">New Dimension Name</label>
              <input value={editingDimension.name} onChange={e=>setEditingDimension({...editingDimension, name: e.target.value})} className="w-full p-4 bg-black border-2 border-neutral-800 text-white focus:border-white focus:outline-none transition-colors" autoFocus />
            </div>
            <div className="flex gap-4 justify-end mt-8 pt-6 border-t-2 border-neutral-800">
              <button onClick={()=>setEditingDimension(null)} className="px-6 py-3 text-white font-bold border-2 border-neutral-800 hover:border-white uppercase tracking-widest text-sm transition-colors">Cancel</button>
              <button onClick={handleUpdateDimension} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Level Modal */}
      {editingLevel && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-black border-2 border-white p-8 max-w-lg w-full">
            <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-tighter">Edit Level {editingLevel.level}</h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-neutral-400 mb-2 block uppercase tracking-widest">Level Title</label>
                <input value={editingLevel.name} onChange={e=>setEditingLevel({...editingLevel, name: e.target.value})} className="w-full p-4 bg-black border-2 border-neutral-800 text-white focus:border-white focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-400 mb-2 block uppercase tracking-widest">Detailed Criteria</label>
                <textarea value={editingLevel.description} onChange={e=>setEditingLevel({...editingLevel, description: e.target.value})} className="w-full p-4 bg-black border-2 border-neutral-800 text-white focus:border-white focus:outline-none transition-colors resize-none" rows={5} />
              </div>
            </div>
            <div className="flex gap-4 justify-end mt-8 pt-6 border-t-2 border-neutral-800">
              <button onClick={()=>setEditingLevel(null)} className="px-6 py-3 text-white font-bold border-2 border-neutral-800 hover:border-white uppercase tracking-widest text-sm transition-colors">Cancel</button>
              <button onClick={handleUpdateLevel} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-neutral-200 transition-colors">Save Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6 pb-8 border-b-2 border-neutral-800">
        <div>
          <a href="/consultant" className="text-sm font-bold text-neutral-400 hover:text-white mb-4 inline-block uppercase tracking-widest transition-colors">
            &larr; Back to Dashboard
          </a>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">{model.name}</h1>
          <p className="mt-3 text-xl text-neutral-400 font-bold">{model.description} <span className="inline-block px-2 border-2 border-neutral-700 text-sm ml-2">v{model.version}</span></p>
        </div>
        <div className="flex gap-4">
          <button onClick={()=>setIsEditingDetails(true)} className="px-6 py-3 border-2 border-neutral-800 text-white bg-black font-bold hover:border-white uppercase tracking-widest text-sm transition-colors">
            Edit Meta
          </button>
          <button onClick={()=>setIsAddingDimension(true)} className="px-6 py-3 bg-white text-black font-black hover:bg-neutral-200 uppercase tracking-widest text-sm transition-colors">
            + Dimension
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {model.dimensions.map((dim: any) => (
          <div key={dim.id} className="bg-black border-2 border-neutral-800 group relative">
            <div className="p-8 border-b-2 border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{dim.name}</h2>
              <button onClick={()=>setEditingDimension({id: dim.id, name: dim.name})} className="text-sm font-bold text-white border-2 border-neutral-800 hover:border-white bg-black px-6 py-3 uppercase tracking-widest transition-colors">
                Rename
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Question Bank</h3>
                <button onClick={() => handleAddQuestion(dim.id)} className="text-xs font-black text-black bg-white px-4 py-2 uppercase tracking-widest hover:bg-neutral-200 transition-colors">
                  + Add Question
                </button>
              </div>
              <ul className="space-y-4 mb-12">
                {dim.questions.map((q: any) => (
                  <li key={q.id} className="text-base text-neutral-300 bg-neutral-900 p-5 border border-neutral-800 flex justify-between items-center group/item hover:border-neutral-600 transition-colors">
                    <span className="font-bold">{q.text}</span>
                    <button onClick={() => handleDeleteQuestion(q.id)} className="text-sm text-neutral-500 font-bold hover:text-white uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-all">Remove</button>
                  </li>
                ))}
                {dim.questions.length === 0 && <li className="text-sm text-neutral-500 font-bold uppercase tracking-widest italic bg-black p-6 border-2 border-dashed border-neutral-800 text-center">No criteria mapped yet.</li>}
              </ul>

              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Scale Matrix</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {dim.levelDescriptions.sort((a:any,b:any)=>a.level - b.level).map((lvl:any) => (
                  <div key={lvl.id} onClick={() => setEditingLevel({id: lvl.id, level: lvl.level, name: lvl.name, description: lvl.description})} className="p-6 border-2 border-neutral-800 bg-black hover:border-white transition-colors cursor-pointer flex flex-col items-start">
                    <span className="text-xs font-black mb-4 px-3 py-1 bg-white text-black uppercase tracking-widest">Lvl {lvl.level}</span>
                    <strong className="font-black mb-3 text-xl leading-tight text-white uppercase tracking-tighter">{lvl.name}</strong>
                    <span className="text-sm font-medium text-neutral-400">{lvl.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {model.dimensions.length === 0 && (
          <div className="text-center py-24 bg-black border-2 border-neutral-800">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Matrix is Empty</h3>
            <p className="text-neutral-500 mt-3 font-bold uppercase tracking-widest text-sm">Initialize your matrix by adding a dimension parameter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
