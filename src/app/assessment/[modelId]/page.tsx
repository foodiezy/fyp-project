import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AssessmentWizard from '@/components/AssessmentWizard'

export const dynamic = 'force-dynamic'

export default async function TakeAssessment({ params }: { params: { modelId: string } }) {
  const model = await prisma.maturityModel.findUnique({
    where: { id: params.modelId },
    include: {
      dimensions: {
        include: {
          questions: true,
          levelDescriptions: true
        }
      }
    }
  })

  if (!model) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 p-8 border-2 border-black bg-black text-white">
        <h1 className="text-4xl font-black uppercase tracking-tighter">{model.name}</h1>
        <p className="mt-3 font-bold uppercase tracking-widest text-xs text-neutral-400">{model.description}</p>
      </div>

      <div className="bg-white border-2 border-black p-6 sm:p-10">
        <AssessmentWizard model={model} />
      </div>
    </div>
  )
}
