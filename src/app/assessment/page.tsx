import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Trends } from 'undraw-react'

export const dynamic = 'force-dynamic'

export default async function AssessmentDirectory() {
  const models = await prisma.maturityModel.findMany({
    include: {
      _count: {
        select: { dimensions: true }
      }
    }
  })

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b-2 border-black pb-12">
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-5xl font-black text-black tracking-tighter uppercase">Available Assessments</h1>
          <p className="text-sm text-neutral-500 font-bold uppercase tracking-widest">Select an e-Maturity model below to begin your evaluation.</p>
          <div className="pt-4">
            <Link 
              href="/assessment/results" 
              className="inline-flex px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              View Past Results
            </Link>
          </div>
        </div>
        <div className="w-full max-w-xs grayscale contrast-200">
          <Trends color="#000000" style={{ height: '150px' }} />
        </div>
      </div>

      <div className="grid gap-8">
        {models.map(model => (
          <div key={model.id} className="bg-white border-2 border-black p-8 sm:p-10 transition-colors flex flex-col md:flex-row justify-between items-center group hover:bg-neutral-50">
            <div className="space-y-3 mb-8 md:mb-0">
              <h2 className="text-3xl font-black text-black uppercase tracking-tighter">{model.name}</h2>
              <p className="text-neutral-500 font-bold max-w-lg">{model.description}</p>
              <div className="flex gap-4 text-xs text-black font-black uppercase tracking-widest pt-2">
                <span className="flex items-center gap-1 border-2 border-black px-3 py-1">
                  v{model.version}
                </span>
                <span className="flex items-center gap-1 border-2 border-black px-3 py-1">
                  {model._count.dimensions} Dimensions
                </span>
              </div>
            </div>
            
            <Link 
              href={`/assessment/${model.id}`} 
              className="w-full md:w-auto px-10 py-5 bg-black text-white uppercase tracking-widest text-sm font-black transition-colors hover:bg-neutral-800 text-center"
            >
              Start Evaluation
            </Link>
          </div>
        ))}
        {models.length === 0 && (
          <div className="text-center py-24 bg-white border-2 border-black">
             <div className="w-24 h-24 bg-black text-white flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
             </div>
             <h3 className="text-4xl font-black text-black tracking-tighter uppercase">No Models Available</h3>
             <p className="text-neutral-500 font-bold mt-4 uppercase tracking-widest text-sm">Please check back later or contact your consultant.</p>
          </div>
        )}
      </div>
    </div>
  )
}
