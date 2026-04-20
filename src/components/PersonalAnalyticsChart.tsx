'use client'

import React, { useMemo } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

export default function PersonalAnalyticsChart({ rawData }: { rawData: any }) {

  const { radarData, barData } = useMemo(() => {
    // rawData is a single assessment object with answers populated
    const answers = rawData.answers || []
    
    // Group scores by dimension
    const dimScores: Record<string, { total: number, count: number }> = {}

    answers.forEach((ans: any) => {
      const dimName = ans.question.dimension.name
      if (!dimScores[dimName]) {
         dimScores[dimName] = { total: 0, count: 0 }
      }
      dimScores[dimName].total += ans.score
      dimScores[dimName].count += 1
    })

    const extractedRadar = Object.keys(dimScores).map(dim => ({
      dimension: dim,
      Score: Number((dimScores[dim].total / dimScores[dim].count).toFixed(2))
    }))

    const extractedBar = Object.keys(dimScores).map(dim => ({
      dimension: dim,
      Score: Number((dimScores[dim].total / dimScores[dim].count).toFixed(2))
    }))

    return { radarData: extractedRadar, barData: extractedBar }
  }, [rawData])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-black">
          <p className="font-black text-black mb-2 uppercase tracking-widest text-xs border-b-2 border-black pb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
             <div key={index} className="flex items-center gap-2 text-sm font-bold">
                <div className="w-3 h-3 bg-black" />
                <span className="text-neutral-500 uppercase tracking-widest text-xs">{entry.name}:</span>
                <span className="text-black font-black ml-auto pl-4">{entry.value}</span>
             </div>
          ))}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-12">
      {radarData.length > 0 ? (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Radar Footprint */}
            <div className="bg-white p-8 border-2 border-black flex flex-col transition-colors hover:bg-neutral-50 cursor-default">
               <div className="mb-6">
                  <h3 className="text-2xl font-black text-black mb-1 uppercase tracking-tighter">My Footprint</h3>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Your multidimensional e-Maturity mapping shape.</p>
               </div>
               <div className="h-80 w-full mt-auto border-2 border-black p-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                     <PolarGrid stroke="#000000" />
                     <PolarAngleAxis dataKey="dimension" tick={{ fill: '#000000', fontSize: 13, fontWeight: 900 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#999999', fontSize: 11 }} />
                     <Radar name="My Score" dataKey="Score" stroke="#4f46e5" strokeWidth={3} fill="#6366f1" fillOpacity={0.4} />
                     <Tooltip content={<CustomTooltip />} />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Dimensional Bar Score */}
            <div className="bg-white p-8 border-2 border-black flex flex-col transition-colors hover:bg-neutral-50 cursor-default">
               <div className="mb-6">
                  <h3 className="text-2xl font-black text-black mb-1 uppercase tracking-tighter">Breakdown</h3>
                  <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Your isolated average score per dimension category.</p>
               </div>
               <div className="h-80 w-full mt-auto border-2 border-black p-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 50 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                     <XAxis 
                       dataKey="dimension" 
                       tick={{ fill: '#000000', fontSize: 11, fontWeight: 900 }} 
                       axisLine={{ stroke: '#000000' }}
                       tickLine={false}
                       angle={-45}
                       textAnchor="end"
                       height={70}
                     />
                     <YAxis 
                       domain={[0, 5]} 
                       tick={{ fill: '#000000', fontSize: 12, fontWeight: 900 }} 
                       axisLine={{ stroke: '#000000' }}
                       tickLine={false}
                       tickCount={6}
                     />
                     <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f5' }} />
                     <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="square" />
                     <Bar dataKey="Score" fill="#8b5cf6" radius={[0, 0, 0, 0]} maxBarSize={60} stroke="#4c1d95" strokeWidth={2} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
         </div>
      ) : (
         <div className="flex flex-col items-center justify-center p-24 bg-white border-2 border-black text-center">
            <h3 className="text-4xl font-black text-black tracking-tighter uppercase mb-4">Data Not Processed</h3>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs max-w-md leading-relaxed">We could not calculate visual metrics for this assessment. It may lack dimension data.</p>
         </div>
      )}
    </div>
  )
}
