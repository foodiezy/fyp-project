import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Report } from 'undraw-react'

export const dynamic = 'force-dynamic'

export default async function ResultsDashboard() {
  const assessments = await prisma.assessment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      organization: true,
      user: true,
      maturityModel: true,
      answers: true
    }
  })

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12 border-b-2 border-black pb-8">
        <div>
          <h1 className="text-5xl font-black text-black tracking-tighter uppercase">Client Results</h1>
          <p className="mt-3 text-sm text-neutral-500 font-bold uppercase tracking-widest">Review submitted assessments and analyze maturity scores.</p>
        </div>
        <div className="w-full max-w-xs grayscale contrast-200">
          <Report color="#000000" style={{ height: '150px' }} />
        </div>
      </div>

      <div className="grid gap-6">
        {assessments.map((req: any) => {
          const totalScore = req.answers.reduce((acc: number, a: any) => acc + a.score, 0)
          const avgScoreNum = req.answers.length > 0 ? (totalScore / req.answers.length) : 0
          const avgScore = avgScoreNum.toFixed(1)
          
          return (
            <Link href={`/consultant/results/${req.id}`} key={req.id} className="block group bg-white border-2 border-black p-8 sm:p-10 hover:bg-neutral-100 transition-colors cursor-pointer">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
                <div>
                  <h3 className="font-black text-4xl text-black uppercase tracking-tighter group-hover:underline underline-offset-4 decoration-4">{req.organization.name}</h3>
                  <p className="text-xs text-neutral-500 font-black mt-3 uppercase tracking-widest">
                    Submitted by {req.user.name || req.user.email}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <span className="text-xs text-white bg-black px-4 py-2 font-black tracking-widest uppercase">
                      {req.maturityModel.name}
                    </span>
                    <span className="text-xs text-black font-bold uppercase tracking-widest border-2 border-black px-4 py-2">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 sm:border-l-2 sm:border-black sm:pl-10">
                  <div className="text-right">
                    <div className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-2">Global Score</div>
                    <div className="text-6xl font-black tracking-tighter text-black">{avgScore} <span className="text-2xl text-neutral-400">/ 5</span></div>
                  </div>
                  <div className="text-white bg-black p-4 transition-transform group-hover:translate-x-2">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
        {assessments.length === 0 && (
          <div className="text-center py-24 bg-white border-2 border-black">
             <div className="w-24 h-24 bg-black text-white flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
             </div>
             <h3 className="text-4xl font-black text-black tracking-tighter uppercase">No Analytics Available Yet</h3>
             <p className="text-neutral-500 font-bold mt-4 uppercase tracking-widest text-sm max-w-lg mx-auto">When your clients complete an evaluation using the Assessment Engine, their deep scoring data will automatically sync here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
