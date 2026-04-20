import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PersonalResultsDirectory() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect('/api/auth/signin')
  }

  const userId = (session.user as any).id

  // SECURE QUERY: Fetch only assessments where userId strictly matches the logged in user
  const myAssessments = await prisma.assessment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      maturityModel: true,
      answers: true
    }
  })

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-end gap-6 mb-8 border-b-2 border-neutral-800 pb-8">
        <Link href="/assessment" className="text-white hover:bg-white hover:text-black transition-colors border-2 border-white p-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Past Results</h1>
          <p className="text-neutral-400 font-bold uppercase tracking-widest text-sm mt-2">Review your securely isolated assessment history.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {myAssessments.map((req: any) => {
          const totalScore = req.answers.reduce((acc: number, a: any) => acc + a.score, 0)
          const avgScoreNum = req.answers.length > 0 ? (totalScore / req.answers.length) : 0
          const avgScore = avgScoreNum.toFixed(1)
          
          return (
            <Link href={`/assessment/results/${req.id}`} key={req.id} className="block group bg-black border-2 border-neutral-800 p-8 sm:p-10 hover:border-white transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
                <div>
                  <h3 className="font-black text-3xl text-white uppercase tracking-tighter group-hover:underline underline-offset-4 decoration-4">{req.maturityModel.name}</h3>
                  <div className="mt-6 flex items-center gap-4">
                    <span className="text-xs text-black bg-white px-4 py-2 font-black tracking-widest uppercase">
                      {req.jobLevel || 'Unknown Role'}
                    </span>
                    <span className="text-sm text-neutral-400 font-bold uppercase tracking-widest">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 sm:border-l-2 sm:border-neutral-800 sm:pl-10">
                  <div className="text-right">
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Overall Score</div>
                    <div className="text-5xl font-black tracking-tighter text-white">{avgScore} <span className="text-xl text-neutral-600">/ 5</span></div>
                  </div>
                  <div className="text-black bg-white border-2 border-white p-4 transition-transform group-hover:translate-x-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

        {myAssessments.length === 0 && (
           <div className="text-center py-24 bg-black border-2 border-neutral-800 mt-4">
             <div className="w-20 h-20 bg-neutral-900 text-neutral-600 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h3 className="text-3xl font-black text-white tracking-tighter uppercase">No Tests Found</h3>
             <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm mt-3">You must complete an assessment before anything appears here.</p>
           </div>
        )}
      </div>
    </div>
  )
}
