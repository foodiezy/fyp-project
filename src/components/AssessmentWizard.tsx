'use client'

import { useState, useEffect } from 'react'

export default function AssessmentWizard({ model }: { model: any }) {
  const [currentDimIdx, setCurrentDimIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  
  // Demographics state
  const [showDemographics, setShowDemographics] = useState(true)
  const [jobLevel, setJobLevel] = useState('')
  const [department, setDepartment] = useState('')

  // Scroll to top when dimension changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentDimIdx])

  const dimension = model.dimensions[currentDimIdx]
  if (!dimension) return null

  const isLast = currentDimIdx === model.dimensions.length - 1

  const handleScore = (qId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [qId]: score }))
  }

  const handleNext = () => {
    if (!isLast) setCurrentDimIdx(p => p + 1)
  }

  const handlePrev = () => {
    if (currentDimIdx > 0) setCurrentDimIdx(p => p - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: model.id,
          answers,
          jobLevel,
          department
        })
      })
      if (res.ok) setIsDone(true)
      else alert("Failed to submit assessment")
    } catch(err) {
      alert("Error submitting assessment")
    }
    setIsSubmitting(false)
  }

  if (isDone) {
    return (
      <div className="text-center py-20 bg-black text-white min-h-[70vh] flex flex-col items-center justify-center border border-neutral-800">
        <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-5xl font-black mb-4 tracking-tighter">Assessment Completed</h2>
        <p className="text-xl text-neutral-400 max-w-lg mx-auto font-medium">Your responses have been successfully recorded. The consultant will review your comprehensive maturity score.</p>
        <div className="mt-12">
          <a href="/assessment" className="px-10 py-5 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors inline-block uppercase tracking-widest text-sm">
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  const currentQIds = dimension.questions.map((q: any) => q.id)
  const allAnswered = currentQIds.every((id: string) => answers[id] !== undefined)

  if (showDemographics) {
    return (
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Before we begin</h2>
          <p className="text-lg text-neutral-400 font-medium">Please provide your role details so we can accurately segment the maturity findings.</p>
        </div>
        
        <div className="bg-black p-8 md:p-12 border-2 border-neutral-800 space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest">What is your Job Level?</label>
            <select 
              className="w-full p-4 bg-black border-2 border-neutral-700 focus:border-white focus:outline-none transition-colors font-bold text-white appearance-none rounded-none"
              value={jobLevel}
              onChange={(e) => setJobLevel(e.target.value)}
            >
              <option value="" disabled>Select Job Level</option>
              <option value="Senior Management">Senior Management (C-Suite, VP, Director)</option>
              <option value="Management">Management (Manager, Lead, Supervisor)</option>
              <option value="Workforce">Workforce (Individual Contributor, Staff)</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest">What is your Department?</label>
            <select 
              className="w-full p-4 bg-black border-2 border-neutral-700 focus:border-white focus:outline-none transition-colors font-bold text-white appearance-none rounded-none"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="" disabled>Select Department</option>
              <option value="IT/Technology">IT / Technology</option>
              <option value="Operations">Operations</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Sales/Marketing">Sales & Marketing</option>
              <option value="Product">Product</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="pt-8">
            <button
              onClick={() => setShowDemographics(false)}
              disabled={!jobLevel || !department}
              className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-sm disabled:opacity-30 hover:bg-neutral-200 transition-colors"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto" key={dimension.id}>
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-neutral-800 pb-8 gap-6">
        <div>
          <span className="text-sm font-bold tracking-widest text-neutral-500 uppercase">
            Part {currentDimIdx + 1} of {model.dimensions.length}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-2 tracking-tighter uppercase">{dimension.name}</h2>
        </div>
        <div className="text-sm font-bold text-black bg-white px-5 py-2.5 uppercase tracking-widest">
          {dimension.questions.length} Metrics
        </div>
      </div>

      <div className="space-y-12">
        {dimension.questions.map((q: any, i: number) => (
          <div key={q.id} className="p-8 md:p-10 bg-black border-2 border-neutral-800 hover:border-neutral-600 transition-colors">
            <p className="text-xl md:text-2xl font-bold text-white mb-8 flex gap-6 leading-relaxed">
              <span className="text-black bg-white w-10 h-10 flex-shrink-0 flex justify-center items-center font-black">{i+1}</span>
              <span className="mt-1">{q.text}</span>
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
              {[1, 2, 3, 4, 5].map(score => {
                const isSelected = answers[q.id] === score;
                const desc = dimension.levelDescriptions.find((l:any) => l.level === score)?.name || `Level ${score}`
                
                return (
                  <button
                    key={score}
                    onClick={() => handleScore(q.id, score)}
                    className={`flex-1 py-6 px-4 transition-colors font-bold border-2 focus:outline-none ${
                      isSelected 
                        ? 'border-white bg-white text-black' 
                        : 'border-neutral-800 bg-black text-neutral-400 hover:border-neutral-500 hover:text-white'
                    }`}
                  >
                    <div className="text-3xl font-black mb-2">{score}</div>
                    <div className="text-xs uppercase tracking-widest opacity-90">{desc}</div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-12 border-t-2 border-neutral-800 flex flex-col-reverse sm:flex-row justify-between gap-6">
        <button
          onClick={handlePrev}
          disabled={currentDimIdx === 0}
          className="w-full sm:w-auto px-10 py-5 font-bold uppercase tracking-widest text-sm border-2 border-neutral-800 text-neutral-400 bg-black disabled:opacity-30 hover:border-white hover:text-white transition-colors"
        >
          Previous
        </button>
        
        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="w-full sm:w-auto px-12 py-5 font-black uppercase tracking-widest text-sm text-black bg-white disabled:opacity-30 hover:bg-neutral-200 transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className="w-full sm:w-auto px-12 py-5 font-black uppercase tracking-widest text-sm text-black bg-white disabled:opacity-30 hover:bg-neutral-200 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
