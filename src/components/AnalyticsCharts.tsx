'use client'

import { useMemo } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

export default function AnalyticsCharts({ rawData }: { rawData: any[] }) {
  
  const { radarData, barData, pieData, roles, sCurveData } = useMemo(() => {
    const dimScores: Record<string, {total: number, count: number}> = {}
    const dimRoleScores: Record<string, Record<string, {total: number, count: number}>> = {}
    const roleCounts: Record<string, number> = {}
    const roleSet = new Set<string>()

    rawData.forEach(assessment => {
      const role = assessment.jobLevel || 'Unknown'
      roleSet.add(role)
      
      if (!roleCounts[role]) roleCounts[role] = 0
      roleCounts[role] += 1
      
      assessment.answers.forEach((ans: any) => {
        const dim = ans.dimensionName
        
        if (!dimScores[dim]) dimScores[dim] = { total: 0, count: 0 }
        dimScores[dim].total += ans.score
        dimScores[dim].count += 1
        
        if (!dimRoleScores[dim]) dimRoleScores[dim] = {}
        if (!dimRoleScores[dim][role]) dimRoleScores[dim][role] = { total: 0, count: 0 }
        dimRoleScores[dim][role].total += ans.score
        dimRoleScores[dim][role].count += 1
      })
    })

    const pie = Object.keys(roleCounts).map(role => ({
      name: role,
      value: roleCounts[role]
    }))

    const radar = Object.keys(dimScores).map(dim => ({
      dimension: dim,
      Average: Number((dimScores[dim].total / dimScores[dim].count).toFixed(2)),
      Target: 4.5
    }))

    const sCurveData = Object.keys(dimScores)
      .sort()
      .map((dim, index, arr) => {
        const avg = Number((dimScores[dim].total / dimScores[dim].count).toFixed(2));
        return {
          name: dim,
          Maturity: avg,
          Cumulative: Number((arr.slice(0, index + 1).reduce((acc, d) => acc + (dimScores[d].total / dimScores[d].count), 0) / (index + 1)).toFixed(2))
        };
      });

    const bar = Object.keys(dimRoleScores).map(dim => {
      const entry: any = { dimension: dim }
      Array.from(roleSet).forEach(r => {
        if (dimRoleScores[dim][r]) {
          entry[r] = Number((dimRoleScores[dim][r].total / dimRoleScores[dim][r].count).toFixed(2))
        } else {
          entry[r] = 0
        }
      })
      return entry
    })

    return { radarData: radar, barData: bar, pieData: pie, roles: Array.from(roleSet), sCurveData }
  }, [rawData])

  if (rawData.length === 0) {
    return <div className="p-12 text-center border-2 border-black border-dashed mt-8">
      <h3 className="text-2xl font-black text-black uppercase tracking-tighter">No Assessment Data Available</h3>
      <p className="text-neutral-500 mt-2 font-bold uppercase tracking-widest text-xs">Users need to complete the assessment before analytics can be generated.</p>
    </div>
  }

  // Vibrant color palette for graphical distinction
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
      
      <div className="bg-white p-8 border-2 border-black">
        <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tighter">Overall Footprint</h3>
        <p className="text-xs font-bold text-neutral-500 mb-8 uppercase tracking-widest max-w-sm">Organizational average across all dimensions to quickly identify core strengths.</p>
        
        <div className="h-[350px] w-full border-2 border-black p-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#000000" strokeDasharray="3 3"/>
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#000000', fontSize: 13, fontWeight: 900 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#999999' }} />
              <Radar name="Org Average" dataKey="Average" stroke="#000000" strokeWidth={3} fill="#000000" fillOpacity={0.1} />
              <Tooltip wrapperClassName="!border-2 !border-black !bg-white !shadow-none !rounded-none" />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-8 border-2 border-black">
        <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tighter">Perception Gap</h3>
        <p className="text-xs font-bold text-neutral-500 mb-8 uppercase tracking-widest max-w-sm">Compare dimension scores by job level to identify alignment or disconnects.</p>
        
        <div className="h-[350px] w-full border-2 border-black p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
              <XAxis dataKey="dimension" tick={{ fill: '#000000', fontSize: 12, fontWeight: 900 }} axisLine={{ stroke: '#000000' }} tickLine={false} dy={10} />
              <YAxis domain={[0, 5]} tick={{ fill: '#000000', fontSize: 12, fontWeight: 900 }} axisLine={{ stroke: '#000000' }} tickLine={false} />
              <Tooltip cursor={{ fill: '#f5f5f5' }} wrapperClassName="!border-2 !border-black !bg-white !shadow-none !rounded-none" />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {roles.map((role: string, idx: number) => (
                 <Bar 
                    key={role} 
                    dataKey={role} 
                    name={role}
                    fill={colors[idx % colors.length]} 
                    stroke="#000000"
                    strokeWidth={2}
                    radius={[0, 0, 0, 0]} 
                    maxBarSize={40} 
                  />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-8 border-2 border-black lg:col-span-2 xl:col-span-1">
        <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tighter">Demographics</h3>
        <p className="text-xs font-bold text-neutral-500 mb-8 uppercase tracking-widest max-w-sm">Distribution of assessment participants by job level.</p>
        
        <div className="h-[350px] w-full border-2 border-black p-4 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="value" stroke="#000000" strokeWidth={3}>
                {pieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip wrapperClassName="!border-2 !border-black !bg-white !shadow-none !rounded-none" />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-8 border-2 border-black lg:col-span-2">
        <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tighter">AIMM S-Curve</h3>
        <p className="text-xs font-bold text-neutral-500 mb-8 uppercase tracking-widest max-w-sm">Visualizing the cumulative maturity progression across dimensions.</p>
        
        <div className="h-[400px] w-full border-2 border-black p-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
              <XAxis dataKey="name" tick={{ fill: '#000000', fontSize: 13, fontWeight: 900 }} axisLine={{ stroke: '#000000' }} />
              <YAxis domain={[0, 5]} tick={{ fill: '#000000', fontWeight: 900 }} axisLine={{ stroke: '#000000' }} tickLine={false}/>
              <Tooltip wrapperClassName="!border-2 !border-black !bg-white !shadow-none !rounded-none" />
              <Legend verticalAlign="top" align="right" />
              <Area type="monotone" dataKey="Maturity" stroke="#000000" strokeWidth={4} fill="#000000" fillOpacity={0.1} />
              <Area type="monotone" dataKey="Cumulative" stroke="#666666" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
