import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AnalyticsCharts from '@/components/AnalyticsCharts'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage({ searchParams }: { searchParams: { orgId?: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) redirect('/api/auth/signin')
  
  const user = session.user as any
  
  let orgId = searchParams.orgId || user.organizationId

  // If consultant has no linked org, pick the first one for MVP testing purposes
  if (!orgId && ['CONSULTANT', 'ADMIN'].includes(user.role)) {
    const firstOrg = await prisma.organization.findFirst()
    if (firstOrg) orgId = firstOrg.id
  }

  if (!orgId) return <div className="p-10 text-center font-black uppercase tracking-widest border-2 border-black m-8">No Organization Found for analytics.</div>

  const org = await prisma.organization.findUnique({ where: { id: orgId } })

  const assessments = await prisma.assessment.findMany({
    where: { 
      organizationId: orgId,
      status: 'COMPLETED'
    },
    include: {
      answers: {
        include: {
          question: {
            include: {
              dimension: true
            }
          }
        }
      }
    }
  })

  // Format data for Recharts client component
  const processedData = assessments.map((a: any) => ({
    id: a.id,
    jobLevel: a.jobLevel || 'Unknown',
    department: a.department || 'Unknown',
    answers: a.answers.map((ans: any) => ({
      dimensionName: ans.question.dimension.name,
      score: ans.score
    }))
  }))

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-black border-2 border-black p-8 sm:p-12 text-white">
        <div className="relative z-10">
          <span className="inline-block px-4 py-2 bg-white text-black font-black tracking-widest uppercase text-xs mb-6">
            Demographic Insights
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 uppercase">Analytics Dashboard</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-400 max-w-2xl leading-relaxed">
            Real-time maturity reporting for <strong className="text-white underline underline-offset-4 decoration-2 mx-1">{org?.name}</strong>. Compare findings across seniority levels and identify perception gaps.
          </p>
        </div>
      </div>

      <AnalyticsCharts rawData={processedData} />
    </div>
  )
}
