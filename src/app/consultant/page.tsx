import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import NewModelButton from '@/components/NewModelButton'
import { Dashboard } from 'undraw-react'

export const dynamic = 'force-dynamic'

export default async function ConsultantDashboard() {
  const models = await prisma.maturityModel.findMany({
    include: {
      dimensions: {
        include: {
          questions: true,
          levelDescriptions: true,
        }
      }
    }
  })

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-b-2 border-black pb-12">
        <div className="flex-1 w-full space-y-4 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase">Consultant Dashboard</h1>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm max-w-lg">Manage Maturity Models, view analytics, and control the AIMM framework.</p>
          <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            <Link href="/consultant/analytics" className="px-8 py-4 border-2 border-black text-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
              View Analytics
            </Link>
            <Link href="/consultant/risks" className="px-8 py-4 border-2 border-black text-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
              Risk Register
            </Link>
            <NewModelButton />
          </div>
        </div>
        <div className="hidden md:flex flex-1 w-full justify-end max-w-sm grayscale contrast-200">
          <Dashboard color="#000000" style={{ height: '180px' }} />
        </div>
      </div>

      <div className="grid gap-8">
        {models.map(model => (
          <Link href={`/consultant/model/${model.id}`} key={model.id} className="block bg-white border-2 border-black p-8 md:p-12 hover:bg-black hover:text-white transition-colors group cursor-pointer">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6 border-b-2 border-black group-hover:border-white pb-8">
              <div>
                <h2 className="text-4xl font-black flex items-center gap-4 uppercase tracking-tighter">
                  <span className="p-3 bg-black text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                  <span className="group-hover:underline underline-offset-4 decoration-4">{model.name}</span>
                  <span className="text-sm font-black px-4 py-2 border-2 border-black group-hover:border-white ml-2 uppercase tracking-widest">
                    v{model.version}
                  </span>
                </h2>
                <p className="mt-4 font-bold text-neutral-500 group-hover:text-neutral-400">{model.description}</p>
              </div>
              <div className="text-sm font-black bg-black text-white group-hover:bg-white group-hover:text-black px-8 py-4 uppercase tracking-widest transition-transform group-hover:translate-x-2 flex items-center gap-3">
                Edit Matrix <span>&rarr;</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {model.dimensions.map(dim => (
                <div key={dim.id} className="p-6 border-2 border-black group-hover:border-white transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-2xl uppercase tracking-tighter">{dim.name}</h3>
                    <span className="h-10 w-10 bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center text-lg font-black transition-colors">
                      {dim.questions.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="text-xs font-black uppercase tracking-widest mb-3 opacity-50">Question Preview</div>
                    {dim.questions.map(q => (
                      <div key={q.id} className="text-sm border-2 border-black group-hover:border-white p-4 font-bold">
                        {q.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t-2 border-black group-hover:border-white transition-colors">
              <h3 className="text-xs font-black mb-6 uppercase tracking-widest opacity-50">Maturity Level Mappings</h3>
              <div className="flex flex-wrap gap-4">
                {model.dimensions[0]?.levelDescriptions.sort((a,b)=>a.level - b.level).map(lvl => (
                  <div key={lvl.id} className="flex flex-col border-2 border-black group-hover:border-white px-6 py-4 min-w-[140px] transition-colors">
                    <span className="text-xs font-black uppercase tracking-widest mb-2 opacity-50">Level {lvl.level}</span>
                    <span className="text-base font-black uppercase tracking-tighter">{lvl.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
        {models.length === 0 && (
          <div className="text-center py-24 border-2 border-black bg-white mt-4">
             <div className="w-24 h-24 bg-black text-white flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h3 className="text-4xl font-black tracking-tighter uppercase">No Maturity Models Created</h3>
             <p className="font-bold text-neutral-500 mt-4 uppercase tracking-widest text-sm max-w-sm mx-auto">Start by creating your first matrix framework.</p>
          </div>
        )}
      </div>
    </div>
  )
}
