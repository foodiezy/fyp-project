import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ReportExportButton from '@/components/ReportExportButton'

export const dynamic = 'force-dynamic'

export default async function ResultAnalyticsPage({ params }: { params: { assessmentId: string } }) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: params.assessmentId },
    include: {
      organization: true,
      user: true,
      maturityModel: {
        include: {
          dimensions: {
            include: { questions: true, levelDescriptions: true }
          }
        }
      },
      answers: {
        include: { question: true }
      }
    }
  })

  if (!assessment) notFound()

  const dimensionScores = assessment.maturityModel.dimensions.map((dim: any) => {
    const dimAnswers = assessment.answers.filter((a: any) => a.question.dimensionId === dim.id)
    const total = dimAnswers.reduce((sum: number, a: any) => sum + a.score, 0)
    const avgScoreNum = dimAnswers.length > 0 ? (total / dimAnswers.length) : 0
    const avg = avgScoreNum.toFixed(1)
    
    // Finding the level description matching the truncated floor of the average score locally
    const currentLevel = Math.floor(avgScoreNum) || 1
    const descriptor = dim.levelDescriptions.find((l: any) => l.level === currentLevel)

    return {
      dim,
      avg,
      currentLevel,
      descriptor,
      answeredCount: dimAnswers.length
    }
  })

  const overallAvgNum = assessment.answers.length > 0 ? (assessment.answers.reduce((acc: number, a: any) => acc + a.score, 0) / assessment.answers.length) : 0
  const overallAvg = overallAvgNum.toFixed(1)

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12 border-b-2 border-black pb-8">
        <div>
          <a href="/consultant/results" className="text-sm font-bold text-neutral-500 hover:text-black uppercase tracking-widest transition-colors mb-4 inline-block">
            &larr; Back to Global Analytics
          </a>
          <h1 className="text-5xl font-black text-black tracking-tighter uppercase">{assessment.organization.name}</h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-neutral-500">Survey compiled by {assessment.user.name} on {new Date(assessment.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
             <div className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">Global Index</div>
             <div className="text-6xl font-black text-black tracking-tighter">{overallAvg} <span className="text-2xl text-neutral-400">/ 5</span></div>
          </div>
          <ReportExportButton assessment={assessment} dimensionScores={dimensionScores} overallAvg={overallAvg} />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Dimensional Breakdown</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dimensionScores.map(stat => (
          <div key={stat.dim.id} className="bg-white border-2 border-black p-8 flex flex-col justify-between group hover:bg-black hover:text-white transition-colors cursor-default">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">{stat.dim.name}</h3>
              <div className="flex items-end gap-2 mb-8">
                <span className="text-6xl font-black tracking-tighter">{stat.avg}</span>
                <span className="text-xl font-black opacity-40 mb-1.5">/ 5</span>
              </div>
              
              <div className="p-6 border-2 border-black group-hover:border-white transition-colors">
                <div className="text-xs font-black uppercase tracking-widest mb-4 flex items-center justify-between opacity-60">
                  Stance
                  <span className="px-3 py-1 bg-black text-white group-hover:bg-white group-hover:text-black">Lvl {stat.currentLevel}</span>
                </div>
                <strong className="text-xl font-black block mb-3 uppercase tracking-tighter leading-tight">{stat.descriptor?.name || 'Unmapped'}</strong>
                <p className="text-sm font-bold opacity-80 leading-relaxed">
                  {stat.descriptor?.description || 'No maturity definition provided in the Consultant layout for this level.'}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-black group-hover:border-white flex justify-between items-center text-xs font-black uppercase tracking-widest opacity-60 transition-colors">
               <span>Algorithm Integrity</span>
               <span>{stat.answeredCount} Data points</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
